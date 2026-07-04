import React, { useState } from 'react'
import { Lock, User } from 'lucide-react'
import { ACCENT_DARK, DANGER } from '../components/Common'
import { ADMIN_CREDENCIAIS } from '../lib/utils'

export default function AdminLoginView({ onSuccess, voltar }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(false)

  function handleSubmit() {
    if (usuario.trim() === ADMIN_CREDENCIAIS.usuario && senha === ADMIN_CREDENCIAIS.senha) {
      setErro(false)
      onSuccess()
    } else {
      setErro(true)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', paddingTop: 40, padding: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-flex', background: ACCENT_DARK, borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <Lock size={22} color="#fff" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 17 }}>Acesso restrito</div>
        <div style={{ fontSize: 12.5, color: '#7C8B9C', marginTop: 2 }}>Área exclusiva da loja Kilimp</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 11.5, color: '#7C8B9C', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}><User size={12} /> Usuário</label>
          <input
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #D7E2F0', fontSize: 13.5, outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: '#7C8B9C', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}><Lock size={12} /> Senha</label>
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid #D7E2F0', fontSize: 13.5, outline: 'none' }}
          />
        </div>
        {erro && <div style={{ fontSize: 12, color: DANGER }}>Usuário ou senha incorretos.</div>}
        <button onClick={handleSubmit} style={{ width: '100%', background: ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 13.5, fontWeight: 700, marginTop: 4 }}>
          Entrar
        </button>
      </div>

      <button onClick={voltar} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#7C8B9C', fontSize: 12.5, padding: 8 }}>
        ← Voltar para a loja
      </button>
    </div>
  )
}
