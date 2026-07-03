import React from 'react'
import { ArrowLeft } from 'lucide-react'

// ============================================================
// PALETA KILIMP — extraída da logo oficial
// ============================================================
// Azul royal escuro (fundo dominante da logo, header, hero)
export const ACCENT_DARK = '#0D1F6E'
// Azul médio (botões, destaques, chips ativos)
export const ACCENT = '#1A3A9C'
// Azul brilhante ciano (gotas de água, hover, detalhes animados)
export const ACCENT_CYAN = '#4A9FE0'
// Dourado (subtítulos, separadores, preços em destaque)
export const GOLD = '#C9A84C'
export const GOLD_LIGHT = '#E8C96A'
// Fundos
export const SAND = '#F0F4FF'      // fundo de seções alternadas (levemente azulado, não areia)
export const BG = '#F5F7FF'        // fundo principal (branco frio, harmoniza com o azul royal)
// Texto
export const GRAPHITE = '#1A2340'  // grafite azulado para textos
export const DANGER = '#C9544A'

import logoKilimp from '../assets/logo-kilimp.png'

// Logo oficial da Kilimp em PNG (1200x657, fundo azul royal #0D1F6E).
// Sempre use sobre backgrounds azuis escuros — o fundo da logo vai se
// fundir naturalmente com o header/hero.
// - header: height pequeno (40-52px) com maxWidth limitado
// - hero: height maior (120-160px) para dar destaque
// - footer: height médio (52-64px)
export function KilimpLogo({ height = 44, maxWidth, variant, showTagline, size }) {
  return (
    <img
      src={logoKilimp}
      alt="Kilimp — Comércio de Produtos de Limpeza"
      style={{
        height,
        width: 'auto',
        maxWidth: maxWidth || (height * 2.2), // mantém proporção 2:1 da logo
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
      }}
    />
  )
}

export function ProductThumb({ produto, size = 46, height }) {
  if (produto.foto_url || produto.foto) {
    return (
      <div style={{ width: '100%', height: height || size, borderRadius: 10, overflow: 'hidden', background: '#F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* object-fit "contain" em vez de "cover": mostra a foto do produto
            inteira, sem cortar (ex: garrafas e embalagens de pé), mesmo que
            sobre um respiro nas laterais. O fundo suave preenche esse espaço
            de forma discreta, sem parecer vazio. */}
        <img src={produto.foto_url || produto.foto} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    )
  }
  return (
    <div style={{ width: '100%', height: height || 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.65, lineHeight: 1 }}>
      {produto.emoji || '🧽'}
    </div>
  )
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
