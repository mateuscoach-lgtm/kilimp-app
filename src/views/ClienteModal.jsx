import React from 'react'
import { X, Printer } from 'lucide-react'
import { ACCENT_DARK, Row, Dashed } from '../components/Common'
import { formatBRL } from '../lib/utils'

// Modal que mostra os dados completos de um cliente (cadastro + resumo de
// compras) e permite imprimir essa ficha — útil para consulta rápida ou
// para conferência manual.
export default function ClienteModal({ cliente, pedidosDoCliente, onClose }) {
  function handleImprimir() {
    window.print()
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
          <div style={{ fontWeight: 700, fontSize: 15 }}>Ficha do cliente</div>
          <button onClick={onClose} style={{ background: '#EEF2F7', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 10, padding: 16, fontSize: 13 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: ACCENT_DARK, marginBottom: 8 }}>{cliente.nome}</div>
          <Row label="Telefone" value={cliente.telefone} />
          <Row label="Endereço" value={cliente.endereco} wrap />
          <Row label="Bairro" value={cliente.bairro || '—'} />
          <Row label="Cidade" value={cliente.cidade || '—'} />
          <Row label="Cliente desde" value={new Date(cliente.criado_em || cliente.criadoEm).toLocaleDateString('pt-BR')} />
          <Dashed />
          <div style={{ fontWeight: 700, marginBottom: 6 }}>RESUMO DE COMPRAS</div>
          <Row label="Total de pedidos" value={cliente.totalPedidos} />
          <Row label="Total gasto" value={formatBRL(cliente.totalGasto)} />

          {pedidosDoCliente && pedidosDoCliente.length > 0 && (
            <>
              <Dashed />
              <div style={{ fontWeight: 700, marginBottom: 6 }}>HISTÓRICO DE PEDIDOS</div>
              {pedidosDoCliente.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#4A5C70' }}>
                  <span>{p.id} • {new Date(p.criadoEm).toLocaleDateString('pt-BR')}</span>
                  <span style={{ fontWeight: 600 }}>{formatBRL(p.total)}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <button
          onClick={handleImprimir}
          style={{ width: '100%', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 13, fontWeight: 700 }}
        >
          <Printer size={15} /> Imprimir ficha
        </button>
      </div>
    </div>
  )
}
