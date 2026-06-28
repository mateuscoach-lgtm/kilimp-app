import React, { useState } from 'react'
import { ShoppingCart, Menu, X, ShieldCheck, Lock, Truck, Sparkles, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'
import { ACCENT, ACCENT_DARK, SAND, BG, GRAPHITE, KilimpLogo } from '../components/Common'
import { useIsDesktop } from '../lib/useIsDesktop'
import { WHATSAPP_LOJA } from '../lib/utils'

const SELOS = [
  { icon: ShoppingCart, label: 'Compra Fácil' },
  { icon: ShieldCheck, label: 'Produtos de Qualidade' },
  { icon: Lock, label: 'Compra Segura' },
  { icon: Truck, label: 'Entrega Rápida' },
]

const EMAIL_LOJA = 'contato@kilimp.com.br'
const ENDERECO_LOJA_TEXTO = 'Sorocaba, SP'

export default function HomeView({ categorias, totalItens, irParaProdutos, irParaCarrinho, irParaAdmin }) {
  const isDesktop = useIsDesktop()
  const [menuAberto, setMenuAberto] = useState(false)

  function scrollPara(id) {
    setMenuAberto(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  function abrirWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_LOJA}`, '_blank')
  }
  function abrirEmail() {
    window.location.href = `mailto:${EMAIL_LOJA}`
  }
  function abrirLocalizacao() {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_LOJA_TEXTO + ', Kilimp')}`, '_blank')
  }

  const categoriasReais = (categorias || []).filter(c => c !== 'Todos')

  return (
    <div style={{ minHeight: '100vh', background: BG, color: GRAPHITE }}>

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, background: '#fff',
        borderBottom: '1px solid #EDE9DF', boxShadow: '0 1px 0 rgba(0,0,0,0.02)',
      }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: isDesktop ? '14px 32px' : '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => scrollPara('topo')} style={{ background: 'none', border: 'none', padding: 0, display: 'flex' }}>
            <KilimpLogo height={isDesktop ? 38 : 32} />
          </button>

          {isDesktop ? (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
              <NavLink onClick={() => scrollPara('topo')}>Início</NavLink>
              <NavLink onClick={() => scrollPara('sobre')}>Sobre Nós</NavLink>
              <NavLink onClick={() => scrollPara('contato')}>Contato</NavLink>
              <NavLink onClick={irParaAdmin}>Painel Administrativo</NavLink>
              <button
                onClick={irParaCarrinho}
                style={{
                  position: 'relative', background: ACCENT, color: '#fff', border: 'none',
                  borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ShoppingCart size={18} />
                {totalItens > 0 && (
                  <span style={{
                    position: 'absolute', top: -5, right: -5, background: '#D98C2B', color: '#fff',
                    fontSize: 10.5, fontWeight: 700, borderRadius: '50%', width: 19, height: 19,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff',
                  }}>
                    {totalItens}
                  </span>
                )}
              </button>
            </nav>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={irParaCarrinho} style={{ position: 'relative', background: ACCENT, color: '#fff', border: 'none', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={16} />
                {totalItens > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, background: '#D98C2B', color: '#fff', fontSize: 9.5, fontWeight: 700, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                    {totalItens}
                  </span>
                )}
              </button>
              <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: '#F4F1EA', border: 'none', borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT_DARK }}>
                {menuAberto ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          )}
        </div>

        {!isDesktop && menuAberto && (
          <div style={{ borderTop: '1px solid #EDE9DF', padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <MobileNavLink onClick={() => scrollPara('topo')}>Início</MobileNavLink>
            <MobileNavLink onClick={() => scrollPara('sobre')}>Sobre Nós</MobileNavLink>
            <MobileNavLink onClick={() => scrollPara('contato')}>Contato</MobileNavLink>
            <MobileNavLink onClick={irParaAdmin}>Painel Administrativo</MobileNavLink>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="topo" style={{
        background: `linear-gradient(160deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`,
        padding: isDesktop ? '64px 32px 56px' : '40px 20px 40px',
        textAlign: 'center', color: '#fff',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
            <KilimpLogo height={isDesktop ? 96 : 68} framed={false} />
          </div>
          <p style={{
            fontSize: isDesktop ? 17 : 14.5, color: 'rgba(255,255,255,0.9)',
            maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.5,
          }}>
            Os melhores produtos de limpeza para facilitar o seu dia a dia, com entrega rápida em Sorocaba e região.
          </p>
          <button
            onClick={irParaProdutos}
            style={{
              background: '#fff', color: ACCENT_DARK, border: 'none', borderRadius: 12,
              padding: isDesktop ? '15px 36px' : '13px 30px', fontSize: 14.5, fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)', cursor: 'pointer',
            }}
          >
            Ver Produtos
          </button>

          <div style={{
            display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: isDesktop ? 28 : 18, marginTop: isDesktop ? 52 : 36,
          }}>
            {SELOS.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={20} color="#fff" />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categoriasReais.length > 0 && (
        <section style={{ background: SAND, padding: isDesktop ? '52px 32px' : '36px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Eyebrow>Nosso catálogo</Eyebrow>
            <h2 style={{ fontSize: isDesktop ? 28 : 21, fontWeight: 800, color: ACCENT_DARK, marginBottom: 24, marginTop: 6 }}>
              Categorias de produtos
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? `repeat(${Math.min(categoriasReais.length, 5)}, 1fr)` : 'repeat(2, 1fr)',
              gap: 14,
            }}>
              {categoriasReais.map(cat => (
                <button
                  key={cat}
                  onClick={irParaProdutos}
                  style={{
                    background: '#fff', border: '1px solid #E7E2D5', borderRadius: 14,
                    padding: '22px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,82,118,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: '#EAF1F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={19} color={ACCENT} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GRAPHITE, textAlign: 'center' }}>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOBRE NÓS */}
      <section id="sobre" style={{ padding: isDesktop ? '64px 32px' : '44px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow center>Quem somos</Eyebrow>
          <h2 style={{ fontSize: isDesktop ? 28 : 21, fontWeight: 800, color: ACCENT_DARK, margin: '6px 0 16px' }}>
            Qualidade, confiança e praticidade para o seu dia a dia
          </h2>
          <p style={{ fontSize: isDesktop ? 15.5 : 14, color: '#5A6470', lineHeight: 1.7, maxWidth: 640, margin: '0 auto' }}>
            A Kilimp é uma empresa de Sorocaba dedicada ao comércio de produtos de limpeza,
            com atendimento próximo e entrega rápida para sua casa ou empresa. Trabalhamos
            para que cuidar do seu lar seja simples, rápido e sem complicação.
          </p>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer id="contato" style={{ background: ACCENT_DARK, color: '#fff', padding: isDesktop ? '48px 32px 28px' : '36px 20px 24px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: isDesktop ? '1.2fr 1fr 1fr' : '1fr', gap: 32,
        }}>
          <div>
            <KilimpLogo height={34} framed={false} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}>
              Comércio de produtos de limpeza em Sorocaba e região. Qualidade, confiança e praticidade para o seu dia a dia.
            </p>
          </div>

          <div>
            <FooterTitle>Contato</FooterTitle>
            <FooterButton icon={Phone} onClick={() => {}}>(15) 3233-8893</FooterButton>
            <FooterButton icon={MessageCircle} onClick={abrirWhatsApp}>WhatsApp (15) 9773-5531</FooterButton>
            <FooterButton icon={Mail} onClick={abrirEmail}>{EMAIL_LOJA}</FooterButton>
          </div>

          <div>
            <FooterTitle>Loja</FooterTitle>
            <FooterButton icon={MapPin} onClick={abrirLocalizacao}>Sorocaba, SP — ver no mapa</FooterButton>
            <FooterButton icon={ShoppingCart} onClick={irParaProdutos}>Ver produtos</FooterButton>
          </div>
        </div>

        <div style={{
          maxWidth: 1100, margin: '36px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)',
          fontSize: 11.5, color: 'rgba(255,255,255,0.55)', textAlign: 'center',
        }}>
          © {new Date().getFullYear()} Kilimp · Comércio de Produtos de Limpeza
        </div>
      </footer>
    </div>
  )
}

function NavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', color: '#2C3E50', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', padding: '6px 2px' }}
    >
      {children}
    </button>
  )
}

function MobileNavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', color: '#2C3E50', fontSize: 14, fontWeight: 600, textAlign: 'left', padding: '10px 4px', borderBottom: '1px solid #F4F1EA' }}
    >
      {children}
    </button>
  )
}

function Eyebrow({ children, center }) {
  return (
    <div style={{
      fontSize: 11.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
      color: '#2980B9', textAlign: center ? 'center' : 'left',
    }}>
      {children}
    </div>
  )
}

function FooterTitle({ children }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 14, letterSpacing: 0.3 }}>{children}</div>
}

function FooterButton({ icon: Icon, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.8)', fontSize: 13, padding: '7px 0', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <Icon size={15} style={{ flexShrink: 0 }} />
      {children}
    </button>
  )
}
