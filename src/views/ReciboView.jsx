import React, { useState } from 'react'
import { Check, Printer } from 'lucide-react'
import { ACCENT, ACCENT_DARK, Row, Dashed } from '../components/Common'
import { formatBRL, abrirWhatsAppPedido } from '../lib/utils'

export default function ReciboView({ order, onImprimir, novoPedido }) {
  const [status, setStatus] = useState('idle')

  async function handleImprimir() {
    setStatus('imprimindo')
    await onImprimir(order)
    setStatus('impresso')
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 18px' }}>
        <div style={{ background: ACCENT, borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Pedido confirmado!</div>
          <div style={{ fontSize: 12.5, color: '#7C8B9C' }}>Ref. fiscal {order.codigoFiscal}</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px dashed #B9C9DC', borderRadius: 4, padding: '20px 18px', fontFamily: "ui-monospace, 'Courier New', monospace", fontSize: 12.5, color: '#15202B' }}>
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 15, marginBottom: 1, color: ACCENT_DARK, fontStyle: 'italic' }}>KILIMP</div>
        <div style={{ textAlign: 'center', fontSize: 10, color: '#7C8B9C', marginBottom: 10 }}>Comércio de Produtos de Limpeza · (15) 3233-8893</div>
        <Dashed />
        <Row label="Pedido" value={order.id} />
        <Row label="Ref. fiscal" value={order.codigoFiscal} />
        <Row label="Data" value={new Date(order.criadoEm).toLocaleString('pt-BR')} />
        <Row label="Status" value={order.status} />
        <Dashed />
        <div style={{ fontWeight: 700, marginBottom: 4 }}>CLIENTE</div>
        <Row label="Nome" value={order.cliente} />
        <Row label="Telefone" value={order.telefone} />
        <Row label="Endereço" value={order.endereco} wrap />
        <Dashed />
        <div style={{ fontWeight: 700, marginBottom: 4 }}>ITENS</div>
        {order.itens.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span>{item.qty}x {item.nome} ({item.unidade})</span>
            <span>{formatBRL(item.preco * item.qty)}</span>
          </div>
        ))}
        <Dashed />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span>Entrega{order.distanciaKm ? ` (~${order.distanciaKm} km)` : ''}</span>
          <span>{order.valorFrete ? formatBRL(order.valorFrete) : 'a combinar'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
          <span>TOTAL</span>
          <span>{formatBRL(order.total)}</span>
        </div>
        <Row label="Pagamento" value={order.pagamento} />
        {order.troco && <Row label="Troco para" value={formatBRL(order.trocoPara)} />}
        <Dashed />
        <div style={{ textAlign: 'center', fontSize: 10, color: '#7C8B9C' }}>Cupom não fiscal</div>
        <div style={{ textAlign: 'center', fontSize: 10.5, color: '#7C8B9C', marginTop: 2 }}>Obrigado pela compra!</div>
      </div>

      <button
        onClick={handleImprimir}
        disabled={status !== 'idle'}
        style={{ width: '100%', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: status === 'idle' ? ACCENT_DARK : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}
      >
        <Printer size={16} />
        {status === 'idle' && 'Imprimir e avisar loja no WhatsApp'}
        {status === 'imprimindo' && 'Enviando para a impressora...'}
        {status === 'impresso' && 'Impresso e WhatsApp aberto'}
      </button>
      {status === 'impresso' && (
        <div style={{ fontSize: 11.5, color: '#7C8B9C', textAlign: 'center', marginTop: 6 }}>
          Se o WhatsApp não abriu automaticamente,{' '}
          <button onClick={() => abrirWhatsAppPedido(order)} style={{ background: 'none', border: 'none', color: ACCENT_DARK, fontWeight: 600, padding: 0, textDecoration: 'underline' }}>
            clique aqui
          </button>.
        </div>
      )}

      <button onClick={novoPedido} style={{ width: '100%', marginTop: 10, background: '#fff', border: '1px solid #D7E2F0', color: '#4A5C70', borderRadius: 12, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}>
        Fazer novo pedido
      </button>
    </div>
  )
}
