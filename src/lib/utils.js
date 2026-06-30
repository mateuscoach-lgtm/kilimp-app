// ============================================================
// CONFIGURAÇÃO DA LOJA
// ============================================================
// O login do painel admin agora usa Supabase Auth de verdade (e-mail +
// senha gerenciados pelo próprio Supabase), em vez de credenciais fixas
// no código. Ver supabase_migracao_auth_seguranca.sql para criar o
// usuário administrador e as políticas de segurança correspondentes.

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
    `Entrega: ${order.valorFrete ? formatBRL(order.valorFrete) : 'a combinar'}${order.distanciaKm ? ` (~${order.distanciaKm} km)` : ''}`,
    `Total: ${formatBRL(order.total)}`,
    `Pagamento: ${order.pagamento}${order.troco ? ` — Troco para ${formatBRL(order.trocoPara)}` : ''}`,
  ]
  return linhas.join('\n')
}

export function abrirWhatsAppPedido(order) {
  const texto = encodeURIComponent(montarMensagemWhatsApp(order))
  const url = `https://wa.me/${WHATSAPP_LOJA}?text=${texto}`
  // Navegação direta em vez de window.open(url, '_blank'): evita que o
  // navegador abra uma janela pop-up separada, que em alguns computadores
  // (principalmente com posição/monitor salvos de uma sessão anterior)
  // pode nascer fora da área visível da tela ("fora de área"). Com
  // location.href o WhatsApp abre na mesma aba/contexto, de forma mais
  // previsível tanto no computador quanto no celular.
  window.location.href = url
}

// Formata uma data ISO ("AAAA-MM-DD") para o formato falado em
// português, ex: "quinta-feira, 3 de julho".
function formatarDataFalada(dataISO) {
  const data = new Date(dataISO + 'T00:00:00')
  return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Monta a mensagem de previsão de entrega, enviada PARA O CLIENTE (não
// para a loja, ao contrário de montarMensagemWhatsApp). Usada no painel,
// aba Painel/Kanban, quando o admin define ou altera a data prevista.
export function montarMensagemPrevisaoEntrega(order) {
  const dataFalada = formatarDataFalada(order.previsaoEntrega)
  const linhas = [
    `Olá, ${order.cliente}! Aqui é da Kilimp. 🧴`,
    ``,
    `Seu pedido ${order.id} está confirmado e a previsão de entrega é para *${dataFalada}*.`,
    ``,
    `Qualquer dúvida, é só responder por aqui. Obrigado pela preferência!`,
  ]
  return linhas.join('\n')
}

// Abre o WhatsApp com a mensagem de previsão de entrega já pronta,
// direcionada ao TELEFONE DO CLIENTE (e não ao número da loja). O envio
// final continua dependendo de um clique humano em "Enviar" dentro do
// WhatsApp — não existe forma de mandar mensagens de WhatsApp 100%
// automáticas sem a API oficial paga da Meta (ver nota no README).
export function avisarClientePrevisaoEntrega(order) {
  if (!order.previsaoEntrega) return
  let telefoneLimpo = (order.telefone || '').replace(/\D/g, '')
  if (!telefoneLimpo) return
  // O campo de telefone no checkout pede só DDD + número (ex: (15) 99999-0000),
  // sem o DDI 55. Mas, por segurança, se o cliente excepcionalmente já tiver
  // digitado o 55 na frente (telefone com 12-13 dígitos começando com 55),
  // evitamos duplicar o prefixo.
  const jaTemDDI = telefoneLimpo.length >= 12 && telefoneLimpo.startsWith('55')
  const texto = encodeURIComponent(montarMensagemPrevisaoEntrega(order))
  const url = `https://wa.me/${jaTemDDI ? '' : '55'}${telefoneLimpo}?text=${texto}`
  window.location.href = url
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
  linhas.push(`Entrega: ${order.valorFrete ? formatBRL(order.valorFrete) : 'a combinar'}${order.distanciaKm ? ` (~${order.distanciaKm} km)` : ''}\n`)
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
