import React from 'react'
import { ArrowLeft } from 'lucide-react'

export const ACCENT = '#1373D6'
export const ACCENT_DARK = '#0A3D7A'
export const BG = '#F5F8FC'
export const DANGER = '#C9544A'

export function KilimpLogo({ size = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
      <div style={{
        fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: 26 * size,
        color: '#fff', letterSpacing: -0.5, fontStyle: 'italic',
        textShadow: '0 2px 0 rgba(10,61,122,0.45)', transform: 'skewY(-2deg)',
      }}>
        Kilimp
      </div>
      <div style={{ fontSize: 9.5 * size, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 1 * size }}>
        Produtos de Limpeza
      </div>
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

export function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, color: '#7C8B9C', marginBottom: 4, display: 'block' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
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
