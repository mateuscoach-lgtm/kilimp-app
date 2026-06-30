import React, { useState } from 'react'
import { X, Calendar, Send, Printer, Hash } from 'lucide-react'
import { ACCENT, ACCENT_DARK, Row, Dashed } from '../components/Common'
import { formatBRL, abrirWhatsAppPedido, enviarParaImpressora, avisarClientePrevisaoEntrega } from '../lib/utils'
import { atualizarPrevisaoEntrega, marcarComoImpresso } from '../lib/pedidos'

// Modal de detalhe do pedido, aberto ao clicar num card do Painel
// (Kanban). Mostra o cupom completo (igual o ReciboModal) e adiciona o
// campo de previsão de entrega, com botão para avisar o cliente.
export default function PedidoDetalheModal({ order, onClose, onAtualizado }) {
  const [previsao, setPrevisao] = useState(order.previsaoEntrega || '')
  const [salvando, setSalvando] = useState(false)
  const [statusImpressao, setStatusImpressao] = useState('idle')
  const [avisoEnviado, setAvisoEnviado] = useState(false)

  async function handleSalvarPrevisao() {
    if (!order._dbId) return
    setSalvando(true)
    try {
      await atualizarPrevisaoEntrega(order._dbId, previsao || null)
      await onAtualizado?.()
    } catch (e) {
      alert('Não foi possível salvar a previsão de entrega. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  function handleAvisarCliente() {
    if (!previsao) return
    avisarClientePrevisaoEntrega({ ...order, previsaoEntrega: previsao })
    setAvisoEnviado(true)
  }

  async function handleImprimir() {
    setStatusImpressao('imprimindo')
    await enviarParaImpressora(order)
    if (order._dbId) await marcarComoImpresso(order._dbId)
    abrirWhatsAppPedido(order)
    setStatusImpressao('impresso')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,20,30,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 15 }}>
            <Hash size={15} /> {order.id}
          </div>
          <button onClick={onClose} style={{ background: '#EEF2F7', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        {/* Previsão de entrega */}
        <div style={{ background: '#F5F8FC', border: '1px solid #E3EAF3', borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', marginBottom: 8 }}>
            <Calendar size={12} /> Previsão de entrega
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="date"
              value={previsao}
              onChange={e => { setPrevisao(e.target.value); setAvisoEnviado(false) }}
              style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: '1px solid #D7E2F0', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={handleSalvarPrevisao}
              disabled={salvando}
              style={{ background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 14px', fontSize: 12.5, fontWeight: 700 }}
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {previsao && (
            <button
              onClick={handleAvisarCliente}
              style={{
                marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: avisoEnviado ? '#EAFBF0' : '#EAF1FB', color: avisoEnviado ? '#1FAE5C' : ACCENT_DARK,
                border: 'none', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 700,
              }}
            >
              <Send size={13} /> {avisoEnviado ? 'Aviso aberto no WhatsApp' : 'Avisar cliente no WhatsApp'}
            </button>
          )}
          <div style={{ fontSize: 10.5, color: '#9AAAB9', marginTop: 6 }}>
            Salve a data primeiro; o botão de avisar abre o WhatsApp já com a mensagem pronta para o telefone do cliente — só falta clicar em enviar por lá.
          </div>
        </div>

        {/* Cupom / detalhe do pedido */}
        <div style={{ background: '#fff', border: '1px dashed #B9C9DC', borderRadius: 4, padding: '18px 16px', fontFamily: "ui-monospace, 'Courier New', monospace", fontSize: 12, color: '#15202B' }}>
          <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 14, color: ACCENT_DARK, fontStyle: 'italic' }}>KILIMP</div>
          <div style={{ textAlign: 'center', fontSize: 9.5, color: '#7C8B9C', marginBottom: 8 }}>Comércio de Produtos de Limpeza · (15) 3233-8893</div>
          <Dashed />
          <Row label="Pedido" value={order.id} />
          <Row label="Ref. fiscal" value={order.codigoFiscal} />
          <Row label="Data" value={new Date(order.criadoEm).toLocaleString('pt-BR')} />
          <Row label="Status" value={order.status} />
          <Dashed />
          <div style={{ fontWeight: 700, marginBottom: 3 }}>CLIENTE</div>
          <Row label="Nome" value={order.cliente} />
          <Row label="Telefone" value={order.telefone} />
          <Row label="Endereço" value={order.endereco} wrap />
          <Dashed />
          <div style={{ fontWeight: 700, marginBottom: 3 }}>ITENS</div>
          {order.itens.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <span>{item.qty}x {item.nome} ({item.unidade})</span>
              <span>{formatBRL(item.preco * item.qty)}</span>
            </div>
          ))}
          <Dashed />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span>Entrega{order.distanciaKm ? ` (~${order.distanciaKm} km)` : ''}</span>
            <span>{order.valorFrete ? formatBRL(order.valorFrete) : 'a combinar'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13 }}>
            <span>TOTAL</span>
            <span>{formatBRL(order.total)}</span>
          </div>
          <Row label="Pagamento" value={order.pagamento} />
          {order.troco && <Row label="Troco para" value={formatBRL(order.trocoPara)} />}
        </div>

        <button
          onClick={handleImprimir}
          disabled={statusImpressao !== 'idle'}
          style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: statusImpressao === 'idle' ? ACCENT : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 13, fontWeight: 700 }}
        >
          <Printer size={15} />
          {statusImpressao === 'idle' && 'Reimprimir e avisar loja no WhatsApp'}
          {statusImpressao === 'imprimindo' && 'Enviando...'}
          {statusImpressao === 'impresso' && 'Reimpresso!'}
        </button>
      </div>
    </div>
  )
}
