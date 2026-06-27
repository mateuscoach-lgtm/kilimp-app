import React, { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, DANGER, Section, Field, TopBar } from '../components/Common'
import { EMOJIS_DISPONIVEIS } from '../lib/utils'

export default function ProductForm({ produto, onCancel, onSave, salvando }) {
  const isNovo = !produto.id
  const [data, setData] = useState({
    nome: produto.nome || '',
    categoria: produto.categoria || '',
    preco: produto.preco ?? '',
    unidade: produto.unidade || '',
    estoque: produto.estoque ?? '',
    foto_url: produto.foto_url || null,
    emoji: produto.emoji || '🧽',
  })
  const [previewLocal, setPreviewLocal] = useState(null) // pré-visualização antes do upload
  const [arquivoFoto, setArquivoFoto] = useState(null) // arquivo real, enviado só ao salvar
  const fileInputRef = useRef(null)

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setArquivoFoto(file)
    setPreviewLocal(URL.createObjectURL(file))
  }

  function handleRemovePhoto() {
    setArquivoFoto(null)
    setPreviewLocal(null)
    update('foto_url', null)
  }

  const valido = data.nome.trim() && data.categoria.trim() && data.preco !== '' && data.unidade.trim()

  function handleSubmit() {
    if (!valido) return
    onSave(
      {
        ...data,
        preco: parseFloat(data.preco),
        estoque: data.estoque === '' ? 0 : parseInt(data.estoque, 10),
      },
      arquivoFoto
    )
  }

  const fotoExibida = previewLocal || data.foto_url

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 100 }}>
      <TopBar title={isNovo ? 'Novo produto' : 'Editar produto'} onBack={onCancel} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Section title="Foto do produto">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 76, height: 76, borderRadius: 12, background: '#F0F4FA', border: '1px solid #E3EAF3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {fotoExibida ? (
                <img src={fotoExibida} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 32 }}>{data.emoji}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <button onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: ACCENT, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 0', fontSize: 12.5, fontWeight: 600 }}>
                <ImagePlus size={14} /> {fotoExibida ? 'Trocar foto' : 'Adicionar foto'}
              </button>
              {fotoExibida && (
                <button onClick={handleRemovePhoto} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#fff', color: DANGER, border: '1px solid #F0DAD6', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 600 }}>
                  <X size={13} /> Remover foto
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>
          </div>
          {!fotoExibida && (
            <div>
              <label style={{ fontSize: 11.5, color: '#7C8B9C', marginBottom: 6, display: 'block' }}>Ou escolha um ícone enquanto não tem foto:</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {EMOJIS_DISPONIVEIS.map(e => (
                  <button
                    key={e}
                    onClick={() => update('emoji', e)}
                    style={{ width: 34, height: 34, borderRadius: 8, fontSize: 17, border: data.emoji === e ? `2px solid ${ACCENT}` : '1px solid #E3EAF3', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section title="Informações do produto">
          <Field label="Nome do produto" value={data.nome} onChange={v => update('nome', v)} placeholder="Ex: Desinfetante Lavanda" />
          <Field label="Categoria" value={data.categoria} onChange={v => update('categoria', v)} placeholder="Ex: Desinfetantes" />
          <Field label="Unidade" value={data.unidade} onChange={v => update('unidade', v)} placeholder="Ex: 1L, 500ml, pacote c/10" />
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="Preço (R$)" value={data.preco} onChange={v => update('preco', v.replace(',', '.'))} placeholder="0,00" />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Estoque" value={data.estoque} onChange={v => update('estoque', v)} placeholder="0" />
            </div>
          </div>
        </Section>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center', padding: 12, background: BG, borderTop: '1px solid #E3EAF3' }}>
        <div style={{ width: '100%', maxWidth: 488, display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: '#fff', border: '1px solid #D7E2F0', color: '#4A5C70', borderRadius: 14, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!valido || salvando}
            style={{ flex: 2, background: (valido && !salvando) ? ACCENT_DARK : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}
          >
            {salvando ? 'Salvando...' : isNovo ? 'Cadastrar produto' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
