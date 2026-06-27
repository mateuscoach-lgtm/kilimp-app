// ============================================================
// CONFIGURAÇÃO DA LOJA
// ============================================================
// MVP: usuário/senha fixos só para manter o painel fora do alcance do
// cliente comum. Antes de crescer mais: migrar para Supabase Auth.
export const ADMIN_CREDENCIAIS = { usuario: 'kilimp', senha: 'kilimp2026' }

export const WHATSAPP_LOJA = import.meta.env.VITE_WHATSAPP_LOJA || '5515997735531'

export const EMOJIS_DISPONIVEIS = ['🧴', '🧼', '🧪', '🍶', '🧻', '🗑️', '🧽', '💧', '📦', '🪣', '🧹', '🚿']

export function formatBRL(v) {
  return Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Monta o texto que vai para o WhatsApp da loja avisando do novo pedido.
export function montarMensagemWhatsApp(order) {
  const linhas = [
    `*Novo pedido recebido!* 🧴`,
    ``,
    `Pedido: ${order.id}  (Ref. fiscal: ${order.codigoFiscal})`,
    `Cliente: ${order.cliente}`,
    `Telefone: ${order.telefone}`,
    `Endereço: ${order.endereco}`,
    ``,
    `*Itens:*`,
    ...order.itens.map(i => `- ${i.qty}x ${i.nome} (${i.unidade})`),
    ``,
    `Total: ${formatBRL(order.total)}`,
    `Pagamento: ${order.pagamento}${order.troco ? ` — Troco para ${formatBRL(order.trocoPara)}` : ''}`,
  ]
  return linhas.join('\n')
}

export function abrirWhatsAppPedido(order) {
  const texto = encodeURIComponent(montarMensagemWhatsApp(order))
  const url = `https://wa.me/${WHATSAPP_LOJA}?text=${texto}`
  window.open(url, '_blank')
}

// ============================================================
// IMPRESSÃO TÉRMICA (ESC/POS)
// ============================================================
// Monta o comando de impressão no padrão ESC/POS, usado por praticamente
// toda impressora térmica de cupom não fiscal.
// Esta função só MONTA os bytes — não imprime sozinha pelo navegador.
// Para imprimir de fato, ver o agente local de impressão (Capítulo 10
// do Guia de Deploy). Quando esse serviço existir, troque o corpo de
// `enviarParaImpressora` abaixo por uma chamada fetch a esse serviço,
// por exemplo:
//   await fetch('http://localhost:9100/imprimir', { method: 'POST', body: comando })
export function montarComandoESCPOS(order) {
  const ESC = '\x1B'
  const GS = '\x1D'
  const linhas = []

  linhas.push(ESC + '@')
  linhas.push(ESC + 'a' + '\x01')
  linhas.push(ESC + '!' + '\x18')
  linhas.push('KILIMP\n')
  linhas.push(ESC + '!' + '\x00')
  linhas.push('Comercio de Produtos de Limpeza\n')
  linhas.push('Fone: (15) 3233-8893\n')
  linhas.push('--------------------------------\n')
  linhas.push(ESC + 'a' + '\x00')
  linhas.push(`Pedido: ${order.id}\n`)
  linhas.push(`Ref. fiscal: ${order.codigoFiscal}\n`)
  linhas.push(`Data: ${new Date(order.criadoEm).toLocaleString('pt-BR')}\n`)
  linhas.push('--------------------------------\n')
  linhas.push(`Cliente: ${order.cliente}\n`)
  linhas.push(`Telefone: ${order.telefone}\n`)
  linhas.push(`Endereco: ${order.endereco}\n`)
  linhas.push('--------------------------------\n')
  order.itens.forEach(i => {
    linhas.push(`${i.qty}x ${i.nome} (${i.unidade})\n`)
    linhas.push(`   ${formatBRL(i.preco * i.qty)}\n`)
  })
  linhas.push('--------------------------------\n')
  linhas.push(ESC + '!' + '\x10')
  linhas.push(`TOTAL: ${formatBRL(order.total)}\n`)
  linhas.push(ESC + '!' + '\x00')
  linhas.push(`Pagamento: ${order.pagamento}${order.troco ? ` (troco p/ ${formatBRL(order.trocoPara)})` : ''}\n`)
  linhas.push('\n')
  linhas.push(ESC + 'a' + '\x01')
  linhas.push('Cupom nao fiscal\n')
  linhas.push('Obrigado pela compra!\n')
  linhas.push('\n\n\n')
  linhas.push(GS + 'V' + '\x00')

  return linhas.join('')
}

// Ponto único de envio para a impressora. Hoje só simula (loga no console).
export async function enviarParaImpressora(order) {
  const comando = montarComandoESCPOS(order)
  console.log('[Impressora térmica] Comando ESC/POS gerado:', comando)
  // TODO produção: substituir por chamada ao agente local de impressão.
  return { ok: true, simulado: true }
}
