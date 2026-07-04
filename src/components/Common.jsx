import React from 'react'
import { ArrowLeft } from 'lucide-react'

// ============================================================
// PALETA KILIMP — azul + areia + grafite
// ============================================================
export const ACCENT = '#2980B9'       // azul principal (botões, links)
export const ACCENT_DARK = '#1A5276'  // azul escuro (headers, destaques fortes)
export const SAND = '#F4F1EA'         // areia de fundo (seções alternadas)
export const SAND_WARM = '#EDE6D6'    // areia mais quente, para o fundo principal da loja
export const BG = '#FAF7F0'           // fundo principal levemente areia (não branco puro)
export const GRAPHITE = '#2C3E50'     // grafite para textos (no lugar do preto puro)
export const DANGER = '#C9544A'

// ============================================================
// LOGO KILIMP — recriado como tipografia real (não imagem)
// ============================================================
// Reproduz o estilo do logotipo original (letras arredondadas, "bubble",
// com bisel 3D e leve arco na linha de base) usando a fonte gratuita
// "Fredoka One" (Google Fonts — precisa estar carregada no index.html),
// gradiente + camadas de text-shadow para simular o volume/bisel do PNG
// original, e pontos customizados (bolhas) nos "i" no lugar do ponto
// padrão da fonte.
//
// Observação: se o logo original foi desenhado com uma fonte licenciada
// específica (ou é letreiro feito à mão por um designer, sem fonte por
// trás), este é o resultado mais próximo possível usando uma fonte livre.
// Para ficar byte-a-byte idêntico, seria necessário o arquivo da fonte
// original.
//
// `variant="light"` = para fundos escuros (azul) — branco com bisel azul.
// `variant="dark"`  = para fundos claros (areia/branco) — azul com bisel mais escuro.
export function KilimpLogo({ size = 1, height = 40, variant = 'light', showTagline = false }) {
  const isLight = variant === 'light'
  const fontSize = height * size * 0.8

  const gradient = isLight
    ? 'linear-gradient(180deg, #ffffff 0%, #dce9f7 55%, #b9d3ec 100%)'
    : 'linear-gradient(180deg, #3E82BE 0%, #1A5276 60%, #123A5C 100%)'

  const bevel = isLight
    ? ['#9fc1e0', '#7fa9d4', '#5f8fc0']
    : ['#0F3A63', '#0B2C4D', '#082036']

  const dropShadowColor = isLight ? 'rgba(10,30,70,0.45)' : 'rgba(0,0,0,0.35)'

  const textShadow = [
    `1px 1px 0 ${bevel[0]}`,
    `2px 2px 0 ${bevel[1]}`,
    `3px 3px 0 ${bevel[2]}`,
    `4px 5px 8px ${dropShadowColor}`,
  ].join(', ')

  // Cada letra tem um leve deslocamento vertical + rotação, pra reproduzir
  // o arco suave (tipo bandeirinha) da linha de base do logo original.
  const arco = [
    { dy: 0.06, rot: -6 },  // K
    { dy: -0.03, rot: -3 }, // i
    { dy: -0.08, rot: -1 }, // l
    { dy: -0.10, rot: 1 },  // i
    { dy: -0.06, rot: 3 },  // m
    { dy: 0.02, rot: 6 },   // p
  ]
  // "ı" = i sem ponto (o ponto é desenhado à parte, como bolha customizada)
  const letras = ['K', 'ı', 'l', 'ı', 'm', 'p']
  const temPonto = [false, true, false, true, false, false]

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
        {letras.map((ch, i) => (
          <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
            {temPonto[i] && (
              <div
                style={{
                  position: 'absolute',
                  top: -fontSize * 0.32,
                  left: '50%',
                  width: fontSize * 0.2,
                  height: fontSize * 0.2,
                  borderRadius: '50%',
                  background: gradient,
                  boxShadow: `1px 1px 0 ${bevel[0]}, 2px 2px 0 ${bevel[1]}, 2px 3px 5px ${dropShadowColor}`,
                  transform: `translateX(-50%) translateY(${arco[i].dy * fontSize}px) rotate(${arco[i].rot}deg)`,
                }}
              />
            )}
            <span
              style={{
                display: 'inline-block',
                fontFamily: "'Fredoka One', 'Poppins', sans-serif",
                fontWeight: 400,
                fontSize,
                background: gradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow,
                transform: `translateY(${arco[i].dy * fontSize}px) rotate(${arco[i].rot}deg)`,
              }}
            >
              {ch}
            </span>
          </div>
        ))}

        {/* Gota com gradiente + brilho, ao lado do "p" — reproduz o efeito
            "glassy" (vidro/água) da gota do logo original. */}
        <svg
          width={fontSize * 0.36}
          height={fontSize * 0.52}
          viewBox="0 0 24 34"
          style={{ marginLeft: fontSize * 0.04, marginBottom: fontSize * 0.02, flexShrink: 0 }}
        >
          <defs>
            <linearGradient id={`kilimp-gota-${variant}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isLight ? '#eaf5ff' : '#5A9BD4'} />
              <stop offset="60%" stopColor={isLight ? '#a9d3f2' : '#1A5276'} />
              <stop offset="100%" stopColor={isLight ? '#4f96cf' : '#0B2C4D'} />
            </linearGradient>
          </defs>
          <path d="M12 1C12 1 2 15 2 22a10 10 0 0020 0C22 15 12 1 12 1z" fill={`url(#kilimp-gota-${variant})`} />
          <ellipse cx="8.5" cy="14" rx="2.6" ry="4.4" fill="#ffffff" opacity="0.55" />
          <circle cx="16.5" cy="10" r="1" fill="#ffffff" opacity="0.75" />
        </svg>
      </div>

      {showTagline && (
        <span
          style={{
            fontSize: fontSize * 0.19,
            fontWeight: 600,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            color: isLight ? 'rgba(255,255,255,0.85)' : '#5A6470',
            marginTop: fontSize * 0.16,
          }}
        >
          Produtos de Limpeza
        </span>
      )}
    </div>
  )
}

export function ProductThumb({ produto, size = 46 }) {
  if (produto.foto_url || produto.foto) {
    return (
      <div style={{ width: '100%', height: size, borderRadius: 10, overflow: 'hidden', background: '#F0F4FA' }}>
        <img src={produto.foto_url || produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return <div style={{ fontSize: size * 0.65, lineHeight: 1 }}>{produto.emoji || '🧽'}</div>
}

export function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 14, border: '1px solid #E3EAF3' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  )
}

export function Field({ label, value, onChange, placeholder, type = 'text', onBlur }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, color: '#7C8B9C', marginBottom: 4, display: 'block' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #D7E2F0', fontSize: 13.5, outline: 'none' }}
      />
    </div>
  )
}

export function TopBar({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 4px' }}>
      <button onClick={onBack} style={{ background: '#fff', border: '1px solid #D7E2F0', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowLeft size={17} />
      </button>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
    </div>
  )
}

export function StatCard({ label, value, small }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: small ? 13.5 : 17, fontWeight: 700, color: ACCENT_DARK }}>{value}</div>
      <div style={{ fontSize: 10.5, color: '#7C8B9C', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export function EmptyState({ text }) {
  return (
    <div style={{ textAlign: 'center', color: '#9AAAB9', fontSize: 12.5, padding: '40px 16px', border: '1px dashed #D7E2F0', borderRadius: 12 }}>
      {text}
    </div>
  )
}

export function Row({ label, value, wrap }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3, alignItems: 'flex-start' }}>
      <span style={{ color: '#7C8B9C', flexShrink: 0 }}>{label}</span>
      <span style={{ textAlign: 'right', whiteSpace: wrap ? 'normal' : 'nowrap', overflow: wrap ? 'visible' : 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
    </div>
  )
}

export function Dashed() {
  return <div style={{ borderTop: '1px dashed #B9C9DC', margin: '8px 0' }} />
}
