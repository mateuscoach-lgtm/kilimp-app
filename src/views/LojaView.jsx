import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Search, Store, ArrowLeft } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, KilimpLogo, ProductThumb } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { useIsDesktop } from '../lib/useIsDesktop'
import ContactFooter from '../components/ContactFooter'

export default function LojaView({
  produtos, categorias, categoria, setCategoria, busca, setBusca,
  cart, addToCart, removeFromCart, totalItens, total, irParaCarrinho, irParaAdmin, irParaHome,
}) {
  const isDesktop = useIsDesktop()
  const colunas = isDesktop ? 'repeat(4, 1fr)' : '1fr 1fr'
  const [animando, setAnimando] = useState(null)

  function handleAdd(id) {
    setAnimando(id)
    addToCart(id)
    setTimeout(() => setAnimando(null), 200)
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: totalItens > 0 ? 100 : 32 }}>
      <style>{`
        .prod-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .prod-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(26,82,118,0.13); }
        .add-btn { transition: transform 0.15s ease; }
        .add-btn:active { transform: scale(0.88); }
        .cat-chip { transition: background 0.15s, color 0.15s; }
        .search-input:focus { border-color: #2980B9 !important; box-shadow: 0 0 0 3px rgba(41,128,185,0.12); }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        background: ACCENT_DARK,
        padding: isDesktop ? '0 32px' : '0 16px',
        boxShadow: '0 2px 12px rgba(26,82,118,0.22)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: isDesktop ? 20 : 12, height: isDesktop ? 64 : 56 }}>
          {irParaHome && (
            <button onClick={irParaHome} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, cursor: 'pointer' }}>
              <ArrowLeft size={16} />
            </button>
          )}
          <KilimpLogo height={isDesktop ? 28 : 23} variant="light" />

          {/* busca inline no desktop */}
          {isDesktop && (
            <div style={{ position: 'relative', flex: 1, maxWidth: 400, marginLeft: 12 }}>
              <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#93B8D4', pointerEvents: 'none' }} />
              <input
                className="search-input"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1.5px solid transparent', fontSize: 13.5, outline: 'none', background: 'rgba(255,255,255,0.95)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
              />
            </div>
          )}

          <div style={{ flex: 1 }} />

          <button onClick={irParaAdmin} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <Store size={16} />
          </button>
          <button onClick={irParaCarrinho} style={{ position: 'relative', background: totalItens > 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}>
            <ShoppingCart size={16} />
            {totalItens > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: '#E8960A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ACCENT_DARK}`, letterSpacing: 0 }}>
                {totalItens > 9 ? '9+' : totalItens}
              </span>
            )}
          </button>
        </div>

        {/* busca mobile (abaixo do header) */}
        {!isDesktop && (
          <div style={{ paddingBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#93B8D4', pointerEvents: 'none' }} />
              <input
                className="search-input"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1.5px solid transparent', fontSize: 13.5, outline: 'none', background: 'rgba(255,255,255,0.95)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* ── CHIPS DE CATEGORIA ── */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: isDesktop ? '20px 32px 8px' : '14px 16px 8px', scrollbarWidth: 'none' }}>
          <style>{`.cat-scroll::-webkit-scrollbar{display:none}`}</style>
          {categorias.map(cat => (
            <button
              key={cat}
              className="cat-chip"
              onClick={() => setCategoria(cat)}
              style={{
                flexShrink: 0, padding: '7px 16px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
                border: cat === categoria ? 'none' : '1.5px solid #DDD6C8',
                background: cat === categoria ? ACCENT_DARK : '#fff',
                color: cat === categoria ? '#fff' : '#6B7280',
                whiteSpace: 'nowrap', cursor: 'pointer',
                boxShadow: cat === categoria ? '0 2px 8px rgba(26,82,118,0.22)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── GRID DE PRODUTOS ── */}
        <div style={{ padding: isDesktop ? '8px 32px 24px' : '8px 16px 20px', display: 'grid', gridTemplateColumns: colunas, gap: isDesktop ? 20 : 14 }}>
          {produtos.map(prod => {
            const qty = cart[prod.id] || 0
            return (
              <div
                key={prod.id}
                className="prod-card"
                style={{
                  background: '#fff', borderRadius: 16, overflow: 'hidden',
                  border: '1px solid #EDE8DF',
                  boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {/* Área da foto */}
                <div style={{ background: '#F5F8FC', padding: '12px 12px 8px' }}>
                  <ProductThumb produto={prod} size={isDesktop ? 64 : 46} height={isDesktop ? 148 : 116} />
                </div>

                {/* Info + ação */}
                <div style={{ padding: isDesktop ? '12px 14px 14px' : '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <div style={{ fontSize: isDesktop ? 14 : 13, fontWeight: 700, lineHeight: 1.3, color: '#1E293B', minHeight: 36 }}>{prod.nome}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{prod.unidade}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: isDesktop ? 17 : 15.5, color: ACCENT_DARK, letterSpacing: -0.3 }}>{formatBRL(prod.preco)}</div>
                    {qty === 0 ? (
                      <button
                        className="add-btn"
                        onClick={() => handleAdd(prod.id)}
                        style={{
                          background: animando === prod.id ? ACCENT_DARK : ACCENT,
                          color: '#fff', border: 'none', borderRadius: 10,
                          width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(41,128,185,0.30)',
                        }}
                      >
                        <Plus size={18} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#EEF5FC', borderRadius: 10, padding: '3px 4px' }}>
                        <button
                          onClick={() => removeFromCart(prod.id)}
                          style={{ background: '#fff', border: '1px solid #D6E4F0', borderRadius: 7, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Minus size={13} strokeWidth={2.5} color={ACCENT_DARK} />
                        </button>
                        <span style={{ fontSize: 13.5, fontWeight: 800, minWidth: 22, textAlign: 'center', color: ACCENT_DARK }}>{qty}</span>
                        <button
                          onClick={() => handleAdd(prod.id)}
                          style={{ background: ACCENT, border: 'none', borderRadius: 7, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Plus size={13} strokeWidth={2.5} color="#fff" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {produtos.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94A3B8', fontSize: 13.5, padding: '48px 0' }}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>

        <ContactFooter isDesktop={isDesktop} />
      </div>

      {/* ── BOTÃO FLUTUANTE DO CARRINHO ── */}
      {totalItens > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '12px 16px 16px', background: `linear-gradient(to top, ${BG} 55%, rgba(250,247,240,0))`, pointerEvents: 'none' }}>
          <button
            onClick={irParaCarrinho}
            style={{
              width: '100%', maxWidth: isDesktop ? 480 : 488,
              background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 16,
              padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(26,82,118,0.40)', fontSize: 15, fontWeight: 800,
              cursor: 'pointer', pointerEvents: 'all',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={16} />
              </span>
              {totalItens} {totalItens === 1 ? 'item' : 'itens'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {formatBRL(total)}
              <span style={{ fontSize: 13, opacity: 0.75 }}>›</span>
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
