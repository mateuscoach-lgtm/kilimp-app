import React, { useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, DANGER, Section, Field, TopBar } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { useIsDesktop } from '../lib/useIsDesktop'
import { calcularFrete } from '../lib/frete'

export default function CheckoutView({ form, setForm, items, total, voltar, finalizar }) {
  const isDesktop = useIsDesktop()
  const maxWidth = isDesktop ? 720 : 520
  const trocoOk = !(form.pagamento === 'Dinheiro' && form.troco && !form.trocoPara)

  const [frete, setFrete] = useState(null) // { distanciaKm, valor, erro }
  const [calculando, setCalculando] = useState(false)

  // Só libera confirmar o pedido depois que o frete foi calculado com sucesso
  // (ou o cliente optou por seguir sem cálculo automático, ver handleSemCalculo).
  const freteOk = frete !== null && (frete.valor !== null || frete.semCalculo)
  const valido = form.nome.trim() && form.telefone.trim() && form.endereco.trim() && trocoOk && freteOk

  const totalComFrete = total + (frete?.valor || 0)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    // Se o cliente mudar o endereço depois de já ter calculado, invalida
    // o frete anterior para evitar cobrar um valor de outro endereço.
    if (field === 'endereco' || field === 'bairro' || field === 'cidade') {
      setFrete(null)
    }
  }

  async function handleCalcularFrete() {
    if (!form.endereco.trim()) return
    setCalculando(true)
    const enderecoCompleto = `${form.endereco}, ${form.bairro || ''} - ${form.cidade || 'Sorocaba'}, SP`
    const resultado = await calcularFrete(enderecoCompleto, form.endereco, form.cidade || 'Sorocaba')
    setFrete(resultado)
    setCalculando(false)
  }

  function handleSemCalculo() {
    // Caminho de saída: se o endereço não for encontrado automaticamente,
    // a loja pode preferir combinar o frete manualmente em vez de travar o pedido.
    setFrete({ distanciaKm: null, valor: 0, erro: null, semCalculo: true })
  }

  function handleFinalizar() {
    finalizar({ valorFrete: frete?.valor || 0, distanciaKm: frete?.distanciaKm ?? null })
  }

  return (
    <div style={{ maxWidth, margin: '0 auto', paddingBottom: 110 }}>
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

          {!frete && (
            <button
              onClick={handleCalcularFrete}
              disabled={!form.endereco.trim() || calculando}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: form.endereco.trim() ? ACCENT : '#C7D6E8', color: '#fff', border: 'none',
                borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600,
              }}
            >
              {calculando ? <Loader2 size={15} className="spin" /> : <MapPin size={15} />}
              {calculando ? 'Calculando frete...' : 'Calcular valor da entrega'}
            </button>
          )}

          {frete && frete.valor !== null && !frete.semCalculo && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EAF1FB', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 12.5, color: '#4A5C70' }}>
                <MapPin size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                Entrega a ~{frete.distanciaKm} km
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_DARK }}>{formatBRL(frete.valor)}</div>
            </div>
          )}

          {frete && frete.erro === 'endereco_nao_encontrado' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#FBEEEC', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: DANGER }}>
                Não conseguimos localizar esse endereço automaticamente. Confira se está completo (rua, número, bairro).
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setFrete(null)} style={{ flex: 1, background: '#fff', border: '1px solid #D7E2F0', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#4A5C70' }}>
                  Tentar de novo
                </button>
                <button onClick={handleSemCalculo} style={{ flex: 1, background: ACCENT_DARK, border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#fff' }}>
                  Combinar na entrega
                </button>
              </div>
            </div>
          )}

          {frete && frete.semCalculo && (
            <div style={{ fontSize: 11.5, color: '#7C8B9C', background: '#EAF1FB', borderRadius: 8, padding: '8px 10px' }}>
              Valor da entrega será combinado diretamente com a loja.
            </div>
          )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', color: '#4A5C70' }}>
            <span>Entrega{frete?.semCalculo ? ' (a combinar)' : ''}</span>
            <span>{frete ? formatBRL(frete.valor || 0) : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 700, paddingTop: 8, borderTop: '1px solid #E3EAF3', marginTop: 4 }}>
            <span>Total</span>
            <span style={{ color: ACCENT_DARK }}>{formatBRL(totalComFrete)}</span>
          </div>
        </Section>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: 12, background: BG, borderTop: '1px solid #E3EAF3' }}>
        <button
          onClick={handleFinalizar}
          disabled={!valido}
          style={{ width: '100%', maxWidth: 488, background: valido ? ACCENT_DARK : '#C7D6E8', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 14.5, fontWeight: 700 }}
        >
          {!frete ? 'Calcule o frete para continuar' : 'Confirmar pedido'}
        </button>
      </div>
    </div>
  )
}
