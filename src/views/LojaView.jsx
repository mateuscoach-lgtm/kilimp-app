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
  const colunas = isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr'

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: totalItens > 0 ? 92 : 24 }}>
      {/* Header azul sólido, sem gradiente chamativo — consistente com a Home */}
      <div style={{ background: ACCENT_DARK, padding: isDesktop ? '14px 32px' : '12px 16px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: isDesktop ? 24 : 14 }}>
          {irParaHome && (
            <button onClick={irParaHome} title="Voltar ao início" style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <ArrowLeft size={16} />
            </button>
          )}
          <KilimpLogo height={isDesktop ? 28 : 24} variant="light" />

          {isDesktop && (
            <div style={{ position: 'relative', flex: 1, maxWidth: 380, marginLeft: 8 }}>
              <Search size={15} style={{ position: 'absolute', left: 13, top: 11, color: '#A9C3D6' }} />
              <input
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 9, border: 'none', fontSize: 13.5, outline: 'none' }}
              />
            </div>
          )}

          <div style={{ flex: isDesktop ? 0 : 1 }} />

          <button onClick={irParaAdmin} title="Painel administrativo" style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 9, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Store size={16} />
          </button>
          <button onClick={irParaCarrinho} style={{ position: 'relative', background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 9, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <ShoppingCart size={16} />
            {totalItens > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#D98C2B', color: '#fff', fontSize: 9.5, fontWeight: 700, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ACCENT_DARK}` }}>
                {totalItens}
              </span>
            )}
          </button>
        </div>

        {!isDesktop && (
          <div style={{ position: 'relative', maxWidth: 1180, margin: '10px auto 0' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: 10, color: '#A9C3D6' }} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar produto..."
              style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 9, border: 'none', fontSize: 13.5, outline: 'none' }}
            />
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: isDesktop ? '18px 32px 4px' : '14px 16px 4px' }}>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: cat === categoria ? 'none' : '1px solid #E3DBC8',
                background: cat === categoria ? ACCENT_DARK : '#fff',
                color: cat === categoria ? '#fff' : '#5A6470', whiteSpace: 'nowrap',
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
              <div key={prod.id} style={{ background: '#fff', borderRadius: 14, padding: isDesktop ? 16 : 12, border: '1px solid #ECE6D8', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ProductThumb produto={prod} size={isDesktop ? 64 : 46} height={isDesktop ? 140 : 110} />
                <div style={{ fontSize: isDesktop ? 14.5 : 13.5, fontWeight: 600, lineHeight: 1.25, minHeight: 34, marginTop: 4, color: '#2C3E50' }}>{prod.nome}</div>
                <div style={{ fontSize: 11.5, color: '#8A8273' }}>{prod.unidade}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: isDesktop ? 16.5 : 15, color: ACCENT_DARK }}>{formatBRL(prod.preco)}</div>
                  {qty === 0 ? (
                    <button onClick={() => addToCart(prod.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={16} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EAF1F8', borderRadius: 8, padding: '2px 4px' }}>
                      <button onClick={() => addToCart(prod.id)} style={{ background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={13} />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 14, textAlign: 'center', color: ACCENT_DARK }}>{qty}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {produtos.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9A9384', fontSize: 13, padding: '32px 0' }}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>

        <ContactFooter isDesktop={isDesktop} />
      </div>

      {totalItens > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: 12, background: `linear-gradient(to top, ${BG} 60%, rgba(250,247,240,0))` }}>
          <button onClick={irParaCarrinho} style={{ width: '100%', maxWidth: isDesktop ? 480 : 488, background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 16px rgba(26,82,118,0.35)', fontSize: 14.5, fontWeight: 700 }}>
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
