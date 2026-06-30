import { supabase } from './supabaseClient'
import { garantirCliente } from './clientes'

// Pede ao banco o próximo número da sequência e devolve já formatado.
// Usamos sequências do Postgres (criadas no Capítulo 2 do guia) para garantir
// que dois pedidos feitos ao mesmo tempo nunca recebam o mesmo número.
async function proximoNumeroPedido() {
  const { data, error } = await supabase.rpc('nextval_pedido')
  if (error) {
    console.error('Erro ao gerar número do pedido:', error)
    // Fallback simples (não deve acontecer se a função SQL abaixo estiver criada)
    return 'PED' + Date.now()
  }
  return 'PED' + String(data).padStart(4, '0')
}

async function proximoCodigoFiscal() {
  const { data, error } = await supabase.rpc('nextval_fiscal')
  if (error) {
    console.error('Erro ao gerar código fiscal:', error)
    return 'REF-' + new Date().getFullYear() + '-' + Date.now()
  }
  const ano = new Date().getFullYear()
  return `REF-${ano}-${String(data).padStart(4, '0')}`
}

// Cria o pedido completo: garante o cliente, cria o pedido, cria os itens.
// Devolve o pedido já no formato que o restante do app espera (igual ao
// que era usado no protótipo, para não precisar mudar as telas).
export async function criarPedido({ dadosCliente, itensCarrinho, total, pagamento, troco, trocoPara, valorFrete, distanciaKm }) {
  const cliente = await garantirCliente(dadosCliente)

  const numeroPedido = await proximoNumeroPedido()
  const codigoFiscal = await proximoCodigoFiscal()

  const { data: pedido, error: erroPedido } = await supabase
    .from('pedidos')
    .insert({
      numero_pedido: numeroPedido,
      codigo_fiscal: codigoFiscal,
      cliente_id: cliente.id,
      endereco_entrega: dadosCliente.enderecoCompleto,
      forma_pagamento: pagamento,
      precisa_troco: !!troco,
      troco_para: troco ? trocoPara : null,
      valor_frete: valorFrete || 0,
      distancia_km: distanciaKm ?? null,
      total,
      status: 'Recebido',
      impresso: false,
    })
    .select()
    .single()

  if (erroPedido) {
    console.error('Erro ao criar pedido:', erroPedido)
    throw erroPedido
  }

  const itensParaSalvar = itensCarrinho.map(item => ({
    pedido_id: pedido.id,
    produto_id: item.id,
    nome_produto: item.nome,
    unidade: item.unidade,
    quantidade: item.qty,
    preco_unitario: item.preco,
  }))

  const { error: erroItens } = await supabase.from('itens_pedido').insert(itensParaSalvar)
  if (erroItens) {
    console.error('Erro ao salvar itens do pedido:', erroItens)
    throw erroItens
  }

  // Monta o objeto no mesmo formato usado pelas telas (recibo, admin etc.)
  return {
    id: pedido.numero_pedido,
    codigoFiscal: pedido.codigo_fiscal,
    clienteId: cliente.id,
    cliente: cliente.nome,
    telefone: cliente.telefone,
    endereco: pedido.endereco_entrega,
    pagamento: pedido.forma_pagamento,
    troco: pedido.precisa_troco,
    trocoPara: pedido.troco_para,
    valorFrete: Number(pedido.valor_frete || 0),
    distanciaKm: pedido.distancia_km,
    itens: itensCarrinho.map(i => ({ id: i.id, nome: i.nome, unidade: i.unidade, qty: i.qty, preco: i.preco })),
    total: pedido.total,
    status: pedido.status,
    criadoEm: pedido.criado_em,
    _dbId: pedido.id, // id interno (uuid) — útil para marcar como impresso depois
  }
}

// Lista todos os pedidos com seus itens, já no formato usado pelas telas do admin.
export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id, numero_pedido, codigo_fiscal, endereco_entrega, forma_pagamento,
      precisa_troco, troco_para, valor_frete, distancia_km, previsao_entrega,
      total, status, impresso, criado_em,
      clientes ( id, nome, telefone ),
      itens_pedido ( nome_produto, unidade, quantidade, preco_unitario )
    `)
    .order('criado_em', { ascending: false })

  if (error) {
    console.error('Erro ao listar pedidos:', error)
    return []
  }

  return data.map(p => ({
    id: p.numero_pedido,
    codigoFiscal: p.codigo_fiscal,
    clienteId: p.clientes?.id,
    cliente: p.clientes?.nome || '(cliente removido)',
    telefone: p.clientes?.telefone || '',
    endereco: p.endereco_entrega,
    pagamento: p.forma_pagamento,
    troco: p.precisa_troco,
    trocoPara: p.troco_para,
    valorFrete: Number(p.valor_frete || 0),
    distanciaKm: p.distancia_km,
    previsaoEntrega: p.previsao_entrega,
    itens: p.itens_pedido.map(i => ({
      nome: i.nome_produto, unidade: i.unidade, qty: i.quantidade, preco: Number(i.preco_unitario),
    })),
    total: Number(p.total),
    status: p.status,
    criadoEm: p.criado_em,
    _dbId: p.id,
  }))
}

// Marca um pedido como impresso (chamado depois que o cupom for enviado para a impressora).
export async function marcarComoImpresso(pedidoDbId) {
  const { error } = await supabase.from('pedidos').update({ impresso: true }).eq('id', pedidoDbId)
  if (error) console.error('Erro ao marcar pedido como impresso:', error)
}

// Atualiza o status do pedido (Recebido → Embalando → Pronto para entrega → Finalizado).
export async function atualizarStatusPedido(pedidoDbId, novoStatus) {
  const { error } = await supabase.from('pedidos').update({ status: novoStatus }).eq('id', pedidoDbId)
  if (error) console.error('Erro ao atualizar status do pedido:', error)
}

// Define ou altera a data prevista de entrega de um pedido (usado no
// painel, aba Painel/Kanban). dataISO no formato "AAAA-MM-DD" ou null
// para limpar a previsão.
export async function atualizarPrevisaoEntrega(pedidoDbId, dataISO) {
  const { error } = await supabase.from('pedidos').update({ previsao_entrega: dataISO || null }).eq('id', pedidoDbId)
  if (error) {
    console.error('Erro ao atualizar previsão de entrega:', error)
    throw error
  }
}
