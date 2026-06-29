import React, { useState } from 'react'
import { ShoppingCart, Menu, X, ShieldCheck, Lock, Truck, MessageCircle, Mail, MapPin, Phone, Droplets, FlaskConical, Trash2, Sparkles, PackageOpen } from 'lucide-react'
import { ACCENT, ACCENT_DARK, SAND, BG, GRAPHITE, KilimpLogo } from '../components/Common'
import { useIsDesktop } from '../lib/useIsDesktop'
import { WHATSAPP_LOJA } from '../lib/utils'

const SELOS = [
  { icon: ShoppingCart, label: 'Compra Fácil' },
  { icon: ShieldCheck, label: 'Produtos de Qualidade' },
  { icon: Lock, label: 'Compra Segura' },
  { icon: Truck, label: 'Entrega Rápida' },
]

// Ícones outline por palavra-chave da categoria — cai no genérico (Sparkles)
// se o nome não corresponder a nenhum padrão conhecido.
const ICONES_CATEGORIA = [
  { match: /multiuso/i, icon: Sparkles },
  { match: /desinfet/i, icon: Droplets },
  { match: /detergente|sab[ãa]o/i, icon: FlaskConical },
  { match: /sac/i, icon: Trash2 },
  { match: /[áa]lcool/i, icon: FlaskConical },
  { match: /papel/i, icon: PackageOpen },
  { match: /lavanderia/i, icon: Droplets },
]
function iconePara(categoria) {
  const found = ICONES_CATEGORIA.find(i => i.match.test(categoria))
  return found ? found.icon : Sparkles
}

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

      {/* HEADER — azul sólido, consistente com o restante do app */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: ACCENT_DARK, boxShadow: '0 2px 10px rgba(26,82,118,0.18)' }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: isDesktop ? '13px 32px' : '11px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => scrollPara('topo')} style={{ background: 'none', border: 'none', padding: 0, display: 'flex' }}>
            <KilimpLogo height={isDesktop ? 30 : 25} variant="light" />
          </button>

          {isDesktop ? (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <NavLink onClick={() => scrollPara('topo')}>Início</NavLink>
              <NavLink onClick={irParaProdutos}>Produtos</NavLink>
              <NavLink onClick={() => scrollPara('categorias')}>Categorias</NavLink>
              <NavLink onClick={() => scrollPara('sobre')}>Sobre Nós</NavLink>
              <NavLink onClick={() => scrollPara('contato')}>Contato</NavLink>
              <NavLink onClick={irParaAdmin}>Painel Administrativo</NavLink>
              <button
                onClick={irParaCarrinho}
                style={{
                  position: 'relative', background: 'rgba(255,255,255,0.14)', color: '#fff', border: 'none',
                  borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ShoppingCart size={16} />
                {totalItens > 0 && (
                  <span style={{
                    position: 'absolute', top: -5, right: -5, background: '#D98C2B', color: '#fff',
                    fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ACCENT_DARK}`,
                  }}>
                    {totalItens}
                  </span>
                )}
              </button>
            </nav>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={irParaCarrinho} style={{ position: 'relative', background: 'rgba(255,255,255,0.14)', color: '#fff', border: 'none', borderRadius: 9, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={15} />
                {totalItens > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, background: '#D98C2B', color: '#fff', fontSize: 9.5, fontWeight: 700, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${ACCENT_DARK}` }}>
                    {totalItens}
                  </span>
                )}
              </button>
              <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 9, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {menuAberto ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          )}
        </div>

        {!isDesktop && menuAberto && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '8px 16px 12px', display: 'flex', flexDirection: 'column' }}>
            <MobileNavLink onClick={() => scrollPara('topo')}>Início</MobileNavLink>
            <MobileNavLink onClick={irParaProdutos}>Produtos</MobileNavLink>
            <MobileNavLink onClick={() => scrollPara('categorias')}>Categorias</MobileNavLink>
            <MobileNavLink onClick={() => scrollPara('sobre')}>Sobre Nós</MobileNavLink>
            <MobileNavLink onClick={() => scrollPara('contato')}>Contato</MobileNavLink>
            <MobileNavLink onClick={irParaAdmin}>Painel Administrativo</MobileNavLink>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="topo" style={{
        background: `linear-gradient(160deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`,
        padding: isDesktop ? '60px 32px 52px' : '36px 20px 36px',
        textAlign: 'center', color: '#fff',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
            <KilimpLogo height={isDesktop ? 84 : 58} variant="light" showTagline />
          </div>
          <p style={{
            fontSize: isDesktop ? 16.5 : 14, color: 'rgba(255,255,255,0.88)',
            maxWidth: 460, margin: '0 auto 26px', lineHeight: 1.5,
          }}>
            Os melhores produtos de limpeza para facilitar o seu dia a dia, com entrega rápida em Sorocaba e região.
          </p>
          <button
            onClick={irParaProdutos}
            style={{
              background: '#fff', color: ACCENT_DARK, border: 'none', borderRadius: 11,
              padding: isDesktop ? '14px 34px' : '12px 28px', fontSize: 14, fontWeight: 700,
              boxShadow: '0 8px 22px rgba(0,0,0,0.16)', cursor: 'pointer',
            }}
          >
            Ver Produtos
          </button>

          <div style={{
            display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: isDesktop ? 26 : 16, marginTop: isDesktop ? 48 : 32,
          }}>
            {SELOS.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={19} color="#fff" />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS — fundo areia, ícones outline */}
      {categoriasReais.length > 0 && (
        <section id="categorias" style={{ background: SAND, padding: isDesktop ? '48px 32px' : '32px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Eyebrow>Nosso catálogo</Eyebrow>
            <h2 style={{ fontSize: isDesktop ? 26 : 19, fontWeight: 800, color: ACCENT_DARK, marginBottom: 22, marginTop: 6 }}>
              Categorias de produtos
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? `repeat(${Math.min(categoriasReais.length, 5)}, 1fr)` : 'repeat(2, 1fr)',
              gap: 12,
            }}>
              {categoriasReais.map(cat => {
                const Icone = iconePara(cat)
                return (
                  <button
                    key={cat}
                    onClick={irParaProdutos}
                    style={{
                      background: '#fff', border: '1px solid #E7E2D5', borderRadius: 13,
                      padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                      cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(26,82,118,0.10)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    <Icone size={26} color={ACCENT_DARK} strokeWidth={1.5} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: GRAPHITE, textAlign: 'center' }}>{cat}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* SOBRE NÓS */}
      <section id="sobre" style={{ padding: isDesktop ? '60px 32px' : '40px 20px', background: BG }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow center>Quem somos</Eyebrow>
          <h2 style={{ fontSize: isDesktop ? 26 : 19, fontWeight: 800, color: ACCENT_DARK, margin: '6px 0 14px' }}>
            Qualidade, confiança e praticidade para o seu dia a dia
          </h2>
          <p style={{ fontSize: isDesktop ? 15 : 13.5, color: '#5A6470', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            A Kilimp é uma empresa de Sorocaba dedicada ao comércio de produtos de limpeza,
            com atendimento próximo e entrega rápida para sua casa ou empresa. Trabalhamos
            para que cuidar do seu lar seja simples, rápido e sem complicação.
          </p>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer id="contato" style={{ background: ACCENT_DARK, color: '#fff', padding: isDesktop ? '44px 32px 26px' : '32px 20px 22px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: isDesktop ? '1.2fr 1fr 1fr' : '1fr', gap: 28,
        }}>
          <div>
            <KilimpLogo height={30} variant="light" />
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}>
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
          maxWidth: 1100, margin: '32px auto 0', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.15)',
          fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center',
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
      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.92)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 2px' }}
    >
      {children}
    </button>
  )
}

function MobileNavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 600, textAlign: 'left', padding: '9px 4px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
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
        color: 'rgba(255,255,255,0.8)', fontSize: 12.5, padding: '6px 0', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <Icon size={14} style={{ flexShrink: 0 }} />
      {children}
    </button>
  )
}
