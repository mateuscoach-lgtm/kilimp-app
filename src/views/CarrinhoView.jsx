import React from 'react'
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, DANGER, ProductThumb } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { useIsDesktop } from '../lib/useIsDesktop'

export default function CarrinhoView({ items, total, addToCart, removeFromCart, deleteFromCart, voltar, continuar }) {
  const isDesktop = useIsDesktop()
  const maxWidth = isDesktop ? 680 : 520

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      <style>{`
        .item-card { transition: box-shadow 0.15s; }
        .item-card:hover { box-shadow: 0 4px 16px rgba(26,82,118,0.10); }
        .remove-btn:hover { color: #B91C1C !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: ACCENT_DARK, padding: isDesktop ? '0 32px' : '0 16px', boxShadow: '0 2px 12px rgba(26,82,118,0.22)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, height: 56 }}>
          <button onClick={voltar} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <Minus size={0} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: -0.3 }}>Seu carrinho</span>
          {items.length > 0 && (
            <span style={{ marginLeft: 2, background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 11.5, fontWeight: 700, borderRadius: 20, padding: '2px 9px' }}>
              {items.reduce((s, i) => s + i.qty, 0)} itens
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth, margin: '0 auto', padding: '20px 16px', paddingBottom: items.length > 0 ? 160 : 32 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '72px 0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF5FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={32} color="#A8C4DA" strokeWidth={1.5} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#334155' }}>Carrinho vazio</div>
            <div style={{ fontSize: 13.5, color: '#94A3B8', maxWidth: 240 }}>Adicione produtos da loja para continuar</div>
            <button onClick={voltar} style={{ marginTop: 8, background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 12, padding: '11px 24px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
              Ver produtos
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div
                key={item.id}
                className="item-card"
                style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid #EDE8DF', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(44,62,80,0.05)' }}
              >
                {/* thumb */}
                <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#F5F8FC' }}>
                  <ProductThumb produto={item} size={44} height={56} />
                </div>

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#1E293B', lineHeight: 1.3 }}>{item.nome}</div>
                  <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>{item.unidade}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT_DARK, marginTop: 4 }}>{formatBRL(item.preco * item.qty)}</div>
                </div>

                {/* controles quantidade */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F1F7FD', borderRadius: 10, padding: '4px 6px', flexShrink: 0 }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: '#fff', border: '1px solid #D6E4F0', borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Minus size={13} strokeWidth={2.5} color={ACCENT_DARK} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 800, minWidth: 24, textAlign: 'center', color: ACCENT_DARK }}>{item.qty}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    style={{ background: ACCENT, border: 'none', borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <Plus size={13} strokeWidth={2.5} color="#fff" />
                  </button>
                </div>

                {/* remover */}
                <button
                  className="remove-btn"
                  onClick={() => deleteFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#CBD5E1', padding: 6, cursor: 'pointer', transition: 'color 0.15s', flexShrink: 0 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Resumo de valor */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #EDE8DF', marginTop: 4, boxShadow: '0 1px 4px rgba(44,62,80,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#64748B', marginBottom: 8 }}>
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} itens)</span>
                <span style={{ fontWeight: 600 }}>{formatBRL(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#64748B', paddingBottom: 10, borderBottom: '1px dashed #E2E8F0' }}>
                <span>Entrega</span>
                <span style={{ color: '#0EA5E9', fontWeight: 600 }}>calculada no próximo passo</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15.5, fontWeight: 800, marginTop: 10, color: '#1E293B' }}>
                <span>Total estimado</span>
                <span style={{ color: ACCENT_DARK }}>{formatBRL(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão fixo */}
      {items.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '12px 16px 20px', background: `linear-gradient(to top, ${BG} 60%, rgba(250,247,240,0))`, pointerEvents: 'none' }}>
          <button
            onClick={continuar}
            style={{
              width: '100%', maxWidth: 488, background: ACCENT_DARK, color: '#fff', border: 'none',
              borderRadius: 16, padding: '15px 22px', fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(26,82,118,0.38)', cursor: 'pointer', pointerEvents: 'all',
            }}
          >
            <span>Continuar para entrega</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  )
}
