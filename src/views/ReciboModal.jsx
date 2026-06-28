import React, { useState } from 'react'
import { X, Printer } from 'lucide-react'
import { ACCENT, ACCENT_DARK, Row, Dashed } from '../components/Common'
import { formatBRL, abrirWhatsAppPedido, enviarParaImpressora } from '../lib/utils'

// Modal simples que mostra o cupom de um pedido já existente, com botão
// para reimprimir (reenvia o comando ESC/POS e reabre o WhatsApp, igual
// faz a tela de recibo do cliente). Usado pelo painel admin, aba Pedidos.
export default function ReciboModal({ order, onClose }) {
  const [status, setStatus] = useState('idle')

  async function handleImprimir() {
    setStatus('imprimindo')
    await enviarParaImpressora(order)
    abrirWhatsAppPedido(order)
    setStatus('impresso')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(10,20,30,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 100,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, maxWidth: 420, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Reimprimir pedido</div>
          <button onClick={onClose} style={{ background: '#EEF2F7', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

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
          disabled={status !== 'idle'}
          style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: status === 'idle' ? ACCENT_DARK : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 13, fontWeight: 700 }}
        >
          <Printer size={15} />
          {status === 'idle' && 'Reimprimir e avisar no WhatsApp'}
          {status === 'imprimindo' && 'Enviando...'}
          {status === 'impresso' && 'Reimpresso!'}
        </button>
      </div>
    </div>
  )
}
