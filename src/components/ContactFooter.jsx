import React from 'react'
import { MessageCircle, Mail, MapPin } from 'lucide-react'
import { WHATSAPP_LOJA } from '../lib/utils'

const EMAIL_LOJA = 'contato@kilimp.com.br'
const ENDERECO_LOJA_TEXTO = 'Sorocaba, SP'

export default function ContactFooter({ isDesktop }) {
  function abrirWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_LOJA}`, '_blank')
  }
  function abrirEmail() {
    window.location.href = `mailto:${EMAIL_LOJA}`
  }
  function abrirLocalizacao() {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO_LOJA_TEXTO + ', Kilimp')}`
    window.open(url, '_blank')
  }

  const botoes = [
    { label: 'WhatsApp', icon: MessageCircle, onClick: abrirWhatsApp, color: '#1FAE5C' },
    { label: 'E-mail', icon: Mail, onClick: abrirEmail, color: '#1373D6' },
    { label: 'Localização', icon: MapPin, onClick: abrirLocalizacao, color: '#C9544A' },
  ]

  return (
    <div style={{ padding: isDesktop ? '28px 32px 40px' : '24px 16px 32px', marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12, textAlign: 'center' }}>
        Fale com a Kilimp
      </div>
      <div style={{ display: 'flex', gap: 10, maxWidth: isDesktop ? 480 : '100%', margin: '0 auto' }}>
        {botoes.map(b => (
          <button
            key={b.label}
            onClick={b.onClick}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12,
              padding: '14px 8px', fontSize: 11.5, fontWeight: 600, color: '#4A5C70',
            }}
          >
            <div style={{ background: b.color, width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <b.icon size={16} color="#fff" />
            </div>
            {b.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#9AAAB9', marginTop: 16 }}>
        Kilimp · Comércio de Produtos de Limpeza · (15) 3233-8893
      </div>
    </div>
  )
}
