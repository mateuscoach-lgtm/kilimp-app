import React from 'react'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, DANGER, ProductThumb, TopBar } from '../components/Common'
import { formatBRL } from '../lib/utils'

export default function CarrinhoView({ items, total, addToCart, removeFromCart, deleteFromCart, voltar, continuar }) {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 100 }}>
      <TopBar title="Seu carrinho" onBack={voltar} />
      <div style={{ padding: 16 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9AAAB9', padding: '60px 0', fontSize: 14 }}>
            Seu carrinho está vazio.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid #E3EAF3', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, flexShrink: 0 }}><ProductThumb produto={item} size={32} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{item.nome}</div>
                  <div style={{ fontSize: 11.5, color: '#7C8B9C' }}>{item.unidade} • {formatBRL(item.preco)} cada</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: '#EEF2F7', border: 'none', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={13} />
                  </button>
                  <span style={{ fontSize: 13.5, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => addToCart(item.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={13} />
                  </button>
                </div>
                <button onClick={() => deleteFromCart(item.id)} style={{ background: 'none', border: 'none', color: DANGER, padding: 4 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: 12, background: BG, borderTop: '1px solid #E3EAF3' }}>
          <div style={{ width: '100%', maxWidth: 488 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 10, color: '#4A5C70' }}>
              <span>Total</span>
              <span style={{ fontWeight: 700, color: '#15202B' }}>{formatBRL(total)}</span>
            </div>
            <button onClick={continuar} style={{ width: '100%', background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 14.5, fontWeight: 700 }}>
              Continuar para entrega
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
