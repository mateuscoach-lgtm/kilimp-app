import { supabase } from './supabaseClient'

export async function buscarClientePorTelefone(telefone) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('telefone', telefone)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar cliente:', error)
    return null
  }
  return data
}

export async function criarCliente(dados) {
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      nome: dados.nome,
      telefone: dados.telefone,
      endereco: dados.endereco,
      complemento: dados.complemento || null,
      bairro: dados.bairro,
      cidade: dados.cidade,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar cliente:', error)
    throw error
  }
  return data
}

export async function atualizarCliente(id, dados) {
  const { data, error } = await supabase
    .from('clientes')
    .update({
      nome: dados.nome,
      endereco: dados.endereco,
      complemento: dados.complemento || null,
      bairro: dados.bairro,
      cidade: dados.cidade,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar cliente:', error)
    throw error
  }
  return data
}

export async function garantirCliente(dados) {
  const existente = await buscarClientePorTelefone(dados.telefone)
  if (existente) return atualizarCliente(existente.id, dados)
  return criarCliente(dados)
}

export async function listarClientesComResumo() {
  const { data: clientes, error: erroClientes } = await supabase
    .from('clientes')
    .select('*')
    .order('nome')

  if (erroClientes) {
    console.error('Erro ao listar clientes:', erroClientes)
    return []
  }

  const { data: pedidos, error: erroPedidos } = await supabase
    .from('pedidos')
    .select('cliente_id, total')

  if (erroPedidos) {
    console.error('Erro ao buscar pedidos para resumo de clientes:', erroPedidos)
    return clientes.map(c => ({ ...c, totalPedidos: 0, totalGasto: 0 }))
  }

  return clientes.map(cliente => {
    const pedidosDoCliente = pedidos.filter(p => p.cliente_id === cliente.id)
    return {
      ...cliente,
      totalPedidos: pedidosDoCliente.length,
      totalGasto: pedidosDoCliente.reduce((soma, p) => soma + Number(p.total), 0),
    }
  })
}
