import React from 'react'
import { ShoppingCart, Plus, Search, Store, ArrowLeft } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, KilimpLogo, ProductThumb } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { useIsDesktop } from '../lib/useIsDesktop'
import ContactFooter from '../components/ContactFooter'

export default function LojaView({
  produtos, categorias, categoria, setCategoria, busca, setBusca,
  cart, addToCart, totalItens, total, irParaCarrinho, irParaAdmin, irParaHome,
}) {
  const isDesktop = useIsDesktop()
  const maxWidth = isDesktop ? 1100 : 520
  const colunas = isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr'

  return (
    <div style={{ maxWidth, margin: '0 auto', paddingBottom: totalItens > 0 ? 92 : 24 }}>
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`,
        padding: isDesktop ? '20px 32px 28px' : '16px 18px 24px', color: '#fff',
        borderRadius: isDesktop ? '0 0 26px 26px' : '0 0 22px 22px',
        boxShadow: '0 4px 18px rgba(26,82,118,0.25)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: isDesktop ? 'center' : 'flex-start',
          marginBottom: isDesktop ? 20 : 16, gap: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {irParaHome && (
              <button onClick={irParaHome} title="Voltar ao início" style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <ArrowLeft size={16} />
              </button>
            )}
            <KilimpLogo height={isDesktop ? 40 : 32} framed={false} />
          </div>
          {isDesktop && (
            <div style={{ position: 'relative', flex: 1, maxWidth: 420 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#9FC1E8' }} />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none' }}
              />
            </div>
          )}
          <button onClick={irParaAdmin} title="Painel administrativo" style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Store size={18} />
          </button>
        </div>
        {!isDesktop && (
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#9FC1E8' }} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: 10, border: 'none', fontSize: 14, outline: 'none' }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: isDesktop ? '18px 32px 4px' : '14px 16px 4px' }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: cat === categoria ? 'none' : '1px solid #D7E2F0',
              background: cat === categoria ? ACCENT_DARK : '#fff',
              color: cat === categoria ? '#fff' : '#4A5C70', whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: isDesktop ? '14px 32px' : '10px 16px', display: 'grid', gridTemplateColumns: colunas, gap: isDesktop ? 18 : 12 }}>
        {produtos.map(prod => {
          const qty = cart[prod.id] || 0
          return (
            <div key={prod.id} style={{ background: '#fff', borderRadius: 14, padding: isDesktop ? 16 : 12, border: '1px solid #E3EAF3', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ProductThumb produto={prod} size={isDesktop ? 64 : 46} />
              <div style={{ fontSize: isDesktop ? 14.5 : 13.5, fontWeight: 600, lineHeight: 1.25, minHeight: 34, marginTop: 4 }}>{prod.nome}</div>
              <div style={{ fontSize: 11.5, color: '#7C8B9C' }}>{prod.unidade}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <div style={{ fontWeight: 700, fontSize: isDesktop ? 16.5 : 15, color: ACCENT_DARK }}>{formatBRL(prod.preco)}</div>
                {qty === 0 ? (
                  <button onClick={() => addToCart(prod.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} />
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EAF1FB', borderRadius: 8, padding: '2px 4px' }}>
                    <button onClick={() => addToCart(prod.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={13} />
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 700, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        {produtos.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9AAAB9', fontSize: 13, padding: '32px 0' }}>
            Nenhum produto encontrado.
          </div>
        )}
      </div>

      <ContactFooter isDesktop={isDesktop} />

      {totalItens > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: 12, background: 'linear-gradient(to top, rgba(245,248,252,1) 60%, rgba(245,248,252,0))' }}>
          <button onClick={irParaCarrinho} style={{ width: '100%', maxWidth: isDesktop ? 480 : 488, background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 16px rgba(10,61,122,0.35)', fontSize: 14.5, fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingCart size={18} /> Ver carrinho ({totalItens})
            </span>
            <span>{formatBRL(total)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
