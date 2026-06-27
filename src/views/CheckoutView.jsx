import React from 'react'
import { ACCENT, ACCENT_DARK, BG, Section, Field, TopBar } from '../components/Common'
import { formatBRL } from '../lib/utils'

export default function CheckoutView({ form, setForm, items, total, voltar, finalizar }) {
  const trocoOk = !(form.pagamento === 'Dinheiro' && form.troco && !form.trocoPara)
  const valido = form.nome.trim() && form.telefone.trim() && form.endereco.trim() && trocoOk

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 110 }}>
      <TopBar title="Dados da entrega" onBack={voltar} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

        <Section title="Quem vai receber">
          <Field label="Nome completo" value={form.nome} onChange={v => update('nome', v)} placeholder="Ex: Maria Souza" />
          <Field label="Telefone / WhatsApp" value={form.telefone} onChange={v => update('telefone', v)} placeholder="(15) 99999-0000" />
        </Section>

        <Section title="Endereço de entrega">
          <Field label="Rua e número" value={form.endereco} onChange={v => update('endereco', v)} placeholder="Rua das Acácias, 120" />
          <Field label="Bairro" value={form.bairro} onChange={v => update('bairro', v)} placeholder="Vila Hortência" />
          <Field label="Cidade" value={form.cidade} onChange={v => update('cidade', v)} placeholder="Sorocaba" />
        </Section>

        <Section title="Pagamento">
          <div style={{ display: 'flex', gap: 8 }}>
            {['Pix', 'Dinheiro', 'Cartão na entrega'].map(opt => (
              <button
                key={opt}
                onClick={() => update('pagamento', opt)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
                  border: form.pagamento === opt ? 'none' : '1px solid #D7E2F0',
                  background: form.pagamento === opt ? ACCENT : '#fff',
                  color: form.pagamento === opt ? '#fff' : '#4A5C70',
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {form.pagamento === 'Pix' && (
            <div style={{ fontSize: 11.5, color: '#7C8B9C', background: '#EAF1FB', borderRadius: 8, padding: '8px 10px' }}>
              O QR Code do Pix (via Mercado Pago) vai aparecer aqui depois que o pagamento online estiver ativo. Por enquanto, o Pix é combinado na entrega.
            </div>
          )}

          {form.pagamento === 'Dinheiro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ label: 'Não precisa de troco', value: false }, { label: 'Vou precisar de troco', value: true }].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => update('troco', opt.value)}
                    style={{
                      flex: 1, padding: '9px 6px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      border: form.troco === opt.value ? 'none' : '1px solid #D7E2F0',
                      background: form.troco === opt.value ? ACCENT_DARK : '#fff',
                      color: form.troco === opt.value ? '#fff' : '#4A5C70',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {form.troco && (
                <Field
                  label="Troco para quanto? (R$)"
                  value={form.trocoPara}
                  onChange={v => update('trocoPara', v.replace(',', '.'))}
                  placeholder="Ex: 50,00"
                />
              )}
            </div>
          )}
        </Section>

        <Section title="Resumo do pedido">
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', color: '#4A5C70' }}>
              <span>{item.qty}x {item.nome}</span>
              <span>{formatBRL(item.preco * item.qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 700, paddingTop: 8, borderTop: '1px solid #E3EAF3', marginTop: 4 }}>
            <span>Total</span>
            <span style={{ color: ACCENT_DARK }}>{formatBRL(total)}</span>
          </div>
        </Section>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: 12, background: BG, borderTop: '1px solid #E3EAF3' }}>
        <button
          onClick={finalizar}
          disabled={!valido}
          style={{ width: '100%', maxWidth: 488, background: valido ? ACCENT_DARK : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 14.5, fontWeight: 700 }}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  )
}
