import { supabase } from './supabaseClient'

// Busca um cliente pelo telefone (usado para saber se é cliente novo ou recorrente).
export async function buscarClientePorTelefone(telefone) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('telefone', telefone)
    .maybeSingle() // não dá erro se não encontrar nenhum

  if (error) {
    console.error('Erro ao buscar cliente:', error)
    return null
  }
  return data
}

// Cria um cliente novo.
export async function criarCliente(dados) {
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      nome: dados.nome,
      telefone: dados.telefone,
      endereco: dados.endereco,
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

// Garante que o cliente existe: se já tiver cadastro pelo telefone, retorna ele;
// senão, cria um novo. Usado no momento de finalizar o pedido.
export async function garantirCliente(dados) {
  const existente = await buscarClientePorTelefone(dados.telefone)
  if (existente) return existente
  return criarCliente(dados)
}

// Lista todos os clientes, já trazendo quantos pedidos cada um fez e o total gasto
// (usado na aba "Clientes" do painel admin).
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
