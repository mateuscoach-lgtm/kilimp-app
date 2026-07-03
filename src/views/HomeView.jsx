import React, { useState } from 'react'
import { ShoppingCart, Menu, X, ShieldCheck, Lock, Truck, MessageCircle, Mail, MapPin, Phone, Droplets, FlaskConical, Trash2, Sparkles, PackageOpen } from 'lucide-react'
import { ACCENT, ACCENT_DARK, ACCENT_CYAN, GOLD, GOLD_LIGHT, SAND, BG, GRAPHITE, KilimpLogo } from '../components/Common'
import { useIsDesktop } from '../lib/useIsDesktop'
import { WHATSAPP_LOJA } from '../lib/utils'

const SELOS = [
  { icon: ShoppingCart, label: 'Compra Fácil' },
  { icon: ShieldCheck, label: 'Produtos de Qualidade' },
  { icon: Lock, label: 'Compra Segura' },
  { icon: Truck, label: 'Entrega Rápida' },
]

// Ícones outline por palavra-chave da categoria — cai no genérico (Sparkles)
// se o nome não corresponder a nenhum padrão conhecido. Cada categoria
// também ganha uma cor própria (não todas azul), para o grid de
// categorias ter mais vida e ficar mais fácil de escanear visualmente.
const ICONES_CATEGORIA = [
  { match: /multiuso/i, icon: Sparkles, cor: '#7C5FC4' },
  { match: /desinfet/i, icon: Droplets, cor: '#2980B9' },
  { match: /detergente|sab[ãa]o/i, icon: FlaskConical, cor: '#E8960A' },
  { match: /sac/i, icon: Trash2, cor: '#5A6470' },
  { match: /[áa]lcool/i, icon: FlaskConical, cor: '#C9544A' },
  { match: /papel/i, icon: PackageOpen, cor: '#1FAE5C' },
  { match: /lavanderia/i, icon: Droplets, cor: '#1373D6' },
]
function corPara(categoria) {
  const found = ICONES_CATEGORIA.find(i => i.match.test(categoria))
  return found ? found.cor : ACCENT_DARK
}
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
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: `linear-gradient(135deg, #060E3A 0%, ${ACCENT_DARK} 100%)`, boxShadow: '0 2px 16px rgba(6,14,58,0.45)' }}>
        <div style={{
          maxWidth: 1180, margin: '0 auto', padding: isDesktop ? '10px 32px' : '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => scrollPara('topo')} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: 'pointer' }}>
            <KilimpLogo height={isDesktop ? 56 : 48} />
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
        background: `linear-gradient(160deg, #060E3A 0%, ${ACCENT_DARK} 45%, #1A3A9C 100%)`,
        padding: isDesktop ? '64px 32px 56px' : '36px 20px 36px',
        textAlign: 'center', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <style>{`
          @keyframes floatDrop { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.08)} }
          @keyframes floatDrop2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.05)} }
          @keyframes shimmer { 0%{opacity:0.12} 50%{opacity:0.22} 100%{opacity:0.12} }
          .drop1{animation:floatDrop 3.5s ease-in-out infinite}
          .drop2{animation:floatDrop2 4.2s ease-in-out infinite 0.8s}
          .drop3{animation:floatDrop 5s ease-in-out infinite 1.6s}
          .gold-line{background:linear-gradient(90deg,transparent,${GOLD},transparent);height:1px;margin:16px auto;max-width:320px}
        `}</style>

        {/* Gotas decorativas animadas — espelhando as gotas da logo */}
        <svg className="drop1" width={isDesktop ? 80 : 50} height={isDesktop ? 107 : 67} viewBox="0 0 24 32"
          style={{ position: 'absolute', right: isDesktop ? '8%' : '4%', top: '10%', pointerEvents: 'none', filter: 'drop-shadow(0 0 8px #4A9FE066)' }}>
          <path d="M12 1C12 1 3 14 3 21a9 9 0 0018 0C21 14 12 1 12 1z" fill={ACCENT_CYAN} opacity={0.75} />
          <path d="M8 18 Q12 14 16 18" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
        </svg>
        <svg className="drop2" width={isDesktop ? 48 : 30} height={isDesktop ? 64 : 40} viewBox="0 0 24 32"
          style={{ position: 'absolute', right: isDesktop ? '12%' : '14%', top: '40%', pointerEvents: 'none', filter: 'drop-shadow(0 0 6px #4A9FE055)' }}>
          <path d="M12 1C12 1 3 14 3 21a9 9 0 0018 0C21 14 12 1 12 1z" fill={ACCENT_CYAN} opacity={0.55} />
        </svg>
        <svg className="drop3" width={isDesktop ? 36 : 22} height={isDesktop ? 48 : 30} viewBox="0 0 24 32"
          style={{ position: 'absolute', left: isDesktop ? '6%' : '3%', bottom: '20%', pointerEvents: 'none', filter: 'drop-shadow(0 0 5px #4A9FE044)' }}>
          <path d="M12 1C12 1 3 14 3 21a9 9 0 0018 0C21 14 12 1 12 1z" fill={ACCENT_CYAN} opacity={0.45} />
        </svg>

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          {/* Logo real da empresa no hero */}
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}>
            <KilimpLogo height={isDesktop ? 180 : 130} maxWidth={isDesktop ? 520 : 340} />
          </div>

          {/* Separador dourado */}
          <div className="gold-line" />

          <p style={{
            fontSize: isDesktop ? 16.5 : 14, color: 'rgba(255,255,255,0.88)', fontWeight: 500,
            maxWidth: 460, margin: '16px auto 28px', lineHeight: 1.6,
          }}>
            Entrega rápida de produtos de limpeza em Sorocaba e região.
          </p>
          <button
            onClick={irParaProdutos}
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
              color: '#0D1F6E', border: 'none', borderRadius: 12,
              padding: isDesktop ? '15px 42px' : '13px 32px', fontSize: 15, fontWeight: 800,
              boxShadow: `0 6px 24px rgba(201,168,76,0.45)`, cursor: 'pointer', letterSpacing: 0.3,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 32px rgba(201,168,76,0.55)` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 6px 24px rgba(201,168,76,0.45)` }}
          >
            ✨ Ver Produtos
          </button>

          <div style={{
            display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: isDesktop ? 28 : 18, marginTop: isDesktop ? 52 : 36,
          }}>
            {SELOS.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(74,159,224,0.15)',
                  border: `1.5px solid rgba(74,159,224,0.40)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={20} color={ACCENT_CYAN} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: 'rgba(255,255,255,0.92)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categoriasReais.length > 0 && (
        <section id="categorias" style={{ background: SAND, padding: isDesktop ? '52px 32px' : '36px 20px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <Eyebrow>Nosso catálogo</Eyebrow>
            <h2 style={{ fontSize: isDesktop ? 27 : 20, fontWeight: 800, color: ACCENT_DARK, marginBottom: 24, marginTop: 6, letterSpacing: -0.4 }}>
              Categorias de produtos
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? `repeat(${Math.min(categoriasReais.length, 5)}, 1fr)` : 'repeat(2, 1fr)',
              gap: 13,
            }}>
              {categoriasReais.map(cat => {
                const Icone = iconePara(cat)
                const cor = corPara(cat)
                return (
                  <button
                    key={cat}
                    onClick={irParaProdutos}
                    style={{
                      background: '#fff', border: `1px solid #E2E8F8`, borderRadius: 14,
                      padding: '22px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11,
                      cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 24px ${cor}28`; e.currentTarget.style.borderColor = `${cor}66` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F8' }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 13, background: `${cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icone size={22} color={cor} strokeWidth={1.8} />
                    </div>
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
          <h2 style={{ fontSize: isDesktop ? 26 : 19, fontWeight: 800, color: ACCENT_DARK, margin: '6px 0 10px', letterSpacing: -0.3 }}>
            Qualidade, confiança e praticidade
          </h2>
          {/* Separador dourado — elemento da identidade Kilimp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(to right, transparent, ${GOLD})` }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
            <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(to left, transparent, ${GOLD})` }} />
          </div>
          <p style={{ fontSize: isDesktop ? 15 : 13.5, color: '#4A5470', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            A Kilimp é uma empresa de Sorocaba dedicada ao comércio de produtos de limpeza,
            com atendimento próximo e entrega rápida para sua casa ou empresa. Trabalhamos
            para que cuidar do seu lar seja simples, rápido e sem complicação.
          </p>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer id="contato" style={{ background: `linear-gradient(160deg, #060E3A 0%, ${ACCENT_DARK} 100%)`, color: '#fff', padding: isDesktop ? '44px 32px 26px' : '32px 20px 22px' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: isDesktop ? '1.2fr 1fr 1fr' : '1fr', gap: 28,
        }}>
          <div>
            <KilimpLogo height={isDesktop ? 72 : 60} />
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 14, lineHeight: 1.6, maxWidth: 280 }}>
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
          maxWidth: 1100, margin: '32px auto 0', paddingTop: 18,
          borderTop: '1px solid rgba(201,168,76,0.25)',
          fontSize: 11, color: 'rgba(255,255,255,0.40)', textAlign: 'center',
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
