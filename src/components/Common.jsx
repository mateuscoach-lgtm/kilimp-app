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

// Wordmark "Kilimp" recriado como tipografia real (não imagem), para se
// adaptar perfeitamente a qualquer fundo — header azul, hero, ou áreas claras.
// `variant="light"` = texto branco (usar sobre fundo azul)
// `variant="dark"`  = texto azul escuro (usar sobre fundo claro/areia)
export function KilimpLogo({ size = 1, height = 40, variant = 'light', showTagline = false }) {
  const color = variant === 'light' ? '#FFFFFF' : ACCENT_DARK
  const dropColor = variant === 'light' ? '#FFFFFF' : ACCENT
  const fontSize = height * size * 0.74

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: fontSize * 0.06 }}>
        <span style={{
          fontFamily: "'Poppins', 'Segoe UI', Arial, sans-serif",
          fontWeight: 800, fontSize, color, letterSpacing: -0.5, whiteSpace: 'nowrap',
          fontStyle: 'italic', transform: 'skewY(-1.5deg)', display: 'inline-block',
        }}>
          Kilimp
        </span>
        <svg width={fontSize * 0.26} height={fontSize * 0.38} viewBox="0 0 24 32" style={{ flexShrink: 0, marginLeft: 1 }}>
          <path
            d="M12 1C12 1 3 14 3 21a9 9 0 0018 0C21 14 12 1 12 1z"
            fill={dropColor}
            opacity={variant === 'light' ? 0.95 : 1}
          />
        </svg>
      </div>
      {showTagline && (
        <span style={{
          fontSize: fontSize * 0.19, fontWeight: 600, letterSpacing: 1.1, textTransform: 'uppercase',
          color: variant === 'light' ? 'rgba(255,255,255,0.85)' : '#5A6470', marginTop: fontSize * 0.08,
        }}>
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
