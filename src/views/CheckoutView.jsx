import React, { useState } from 'react'
import { MapPin, Loader2, CheckCircle2, ArrowLeft, User, Home, CreditCard, Receipt } from 'lucide-react'
import { ACCENT, ACCENT_DARK, BG, DANGER, Field } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { useIsDesktop } from '../lib/useIsDesktop'
import { calcularFrete } from '../lib/frete'
import { buscarClientePorTelefone } from '../lib/clientes'

// Section com número de etapa — reforça a sensação de progresso guiado
// em vez de um formulário longo e uniforme.
function Step({ number, title, icon: Icon, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid #EDE8DF', boxShadow: '0 1px 4px rgba(44,62,80,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: '#EAF1FB', color: ACCENT_DARK,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={13} strokeWidth={2.5} />
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.3 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>
    </div>
  )
}

export default function CheckoutView({ form, setForm, items, total, voltar, finalizar }) {
  const isDesktop = useIsDesktop()
  const maxWidth = isDesktop ? 760 : 520
  const trocoOk = !(form.pagamento === 'Dinheiro' && form.troco && !form.trocoPara)

  const [frete, setFrete] = useState(null)
  const [calculando, setCalculando] = useState(false)
  const [buscandoCliente, setBuscandoCliente] = useState(false)
  const [clienteReconhecido, setClienteReconhecido] = useState(false)

  const freteOk = frete !== null && (frete.valor !== null || frete.semCalculo)
  const valido = form.nome.trim() && form.telefone.trim() && form.endereco.trim() && trocoOk && freteOk
  const totalComFrete = total + (frete?.valor || 0)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'endereco' || field === 'bairro' || field === 'cidade') setFrete(null)
    if (field === 'telefone') setClienteReconhecido(false)
  }

  async function handleTelefoneBlur() {
    const telefone = form.telefone.trim()
    if (!telefone || telefone.length < 8) return
    setBuscandoCliente(true)
    const cliente = await buscarClientePorTelefone(telefone)
    setBuscandoCliente(false)
    if (cliente) {
      setForm(prev => ({
        ...prev,
        nome: cliente.nome || prev.nome,
        endereco: cliente.endereco || prev.endereco,
        complemento: cliente.complemento || prev.complemento,
        bairro: cliente.bairro || prev.bairro,
        cidade: cliente.cidade || prev.cidade,
      }))
      setClienteReconhecido(true)
      setFrete(null)
    }
  }

  async function handleCalcularFrete() {
    if (!form.endereco.trim()) return
    setCalculando(true)
    const enderecoCompleto = `${form.endereco}, ${form.bairro || ''} - ${form.cidade || 'Sorocaba'}, SP`
    const resultado = await calcularFrete(enderecoCompleto, form.endereco, form.bairro, form.cidade || 'Sorocaba')
    setFrete(resultado)
    setCalculando(false)
  }

  function handleSemCalculo() {
    setFrete({ distanciaKm: null, valor: 0, erro: null, semCalculo: true })
  }

  function handleFinalizar() {
    finalizar({ valorFrete: frete?.valor || 0, distanciaKm: frete?.distanciaKm ?? null })
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 110 }}>
      <style>{`
        .field-input:focus { border-color: #2980B9 !important; box-shadow: 0 0 0 3px rgba(41,128,185,0.10); }
        .pay-opt { transition: all 0.15s; }
      `}</style>

      {/* Header */}
      <div style={{ background: ACCENT_DARK, padding: isDesktop ? '0 32px' : '0 16px', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 2px 12px rgba(26,82,118,0.22)' }}>
        <div style={{ maxWidth, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, height: 56 }}>
          <button onClick={voltar} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: -0.3 }}>Dados da entrega</span>
        </div>
      </div>

      <div style={{ maxWidth, margin: '0 auto', padding: '18px 16px', display: isDesktop ? 'grid' : 'flex', gridTemplateColumns: isDesktop ? '1fr 320px' : undefined, flexDirection: isDesktop ? undefined : 'column', gap: 14, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Step number={1} title="Quem vai receber" icon={User}>
            <Field label="Telefone / WhatsApp" value={form.telefone} onChange={v => update('telefone', v)} onBlur={handleTelefoneBlur} placeholder="(15) 99999-0000" />
            {buscandoCliente && <div style={{ fontSize: 11.5, color: '#94A3B8' }}>Verificando cadastro...</div>}
            {clienteReconhecido && !buscandoCliente && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#15803D', background: '#EAFBF0', borderRadius: 9, padding: '7px 10px', fontWeight: 600 }}>
                <CheckCircle2 size={13} /> Que bom te ver de novo! Seus dados foram preenchidos automaticamente.
              </div>
            )}
            <Field label="Nome completo" value={form.nome} onChange={v => update('nome', v)} placeholder="Ex: Maria Souza" />
          </Step>

          <Step number={2} title="Endereço de entrega" icon={Home}>
            <Field label="Rua e número" value={form.endereco} onChange={v => update('endereco', v)} placeholder="Rua das Acácias, 120" />
            <Field label="Complemento (bloco, apto, ponto de referência)" value={form.complemento} onChange={v => update('complemento', v)} placeholder="Ex: Bloco 2, Apto 34" />
            <Field label="Bairro" value={form.bairro} onChange={v => update('bairro', v)} placeholder="Vila Hortência" />
            <Field label="Cidade" value={form.cidade} onChange={v => update('cidade', v)} placeholder="Sorocaba" />

            {!frete && (
              <button
                onClick={handleCalcularFrete}
                disabled={!form.endereco.trim() || calculando}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  background: form.endereco.trim() ? ACCENT : '#DCE7F1', color: '#fff', border: 'none',
                  borderRadius: 11, padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {calculando ? <Loader2 size={15} className="spin" /> : <MapPin size={15} />}
                {calculando ? 'Calculando frete...' : 'Calcular valor da entrega'}
              </button>
            )}

            {frete && frete.valor !== null && !frete.semCalculo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EAF1FB', borderRadius: 11, padding: '11px 13px' }}>
                  <div style={{ fontSize: 12.5, color: '#4A5C70', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                    <MapPin size={13} color={ACCENT_DARK} /> Entrega a ~{frete.distanciaKm} km
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: ACCENT_DARK }}>{formatBRL(frete.valor)}</div>
                </div>
                {frete.aproximado && (
                  <div style={{ fontSize: 11, color: '#94A3B8', padding: '0 4px' }}>Cálculo aproximado pelo bairro (endereço exato não localizado no mapa).</div>
                )}
              </div>
            )}

            {frete && frete.erro === 'endereco_nao_encontrado' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#FDF0EE', borderRadius: 11, padding: '11px 13px' }}>
                <div style={{ fontSize: 12, color: DANGER, fontWeight: 600 }}>Não conseguimos localizar esse endereço automaticamente. Confira se está completo (rua, número, bairro).</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setFrete(null)} style={{ flex: 1, background: '#fff', border: '1px solid #D7E2F0', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 700, color: '#4A5C70', cursor: 'pointer' }}>Tentar de novo</button>
                  <button onClick={handleSemCalculo} style={{ flex: 1, background: ACCENT_DARK, border: 'none', borderRadius: 9, padding: '9px 0', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Combinar na entrega</button>
                </div>
              </div>
            )}

            {frete && frete.semCalculo && (
              <div style={{ fontSize: 11.5, color: '#4A5C70', background: '#EAF1FB', borderRadius: 9, padding: '9px 11px', fontWeight: 500 }}>Valor da entrega será combinado diretamente com a loja.</div>
            )}
          </Step>

          <Step number={3} title="Pagamento" icon={CreditCard}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Pix', 'Dinheiro', 'Cartão na entrega'].map(opt => (
                <button
                  key={opt}
                  className="pay-opt"
                  onClick={() => update('pagamento', opt)}
                  style={{
                    flex: 1, padding: '11px 6px', borderRadius: 11, fontSize: 12, fontWeight: 700,
                    border: form.pagamento === opt ? 'none' : '1.5px solid #E2E8F0',
                    background: form.pagamento === opt ? ACCENT : '#fff',
                    color: form.pagamento === opt ? '#fff' : '#64748B', cursor: 'pointer',
                    boxShadow: form.pagamento === opt ? '0 2px 8px rgba(41,128,185,0.25)' : 'none',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {form.pagamento === 'Pix' && (
              <div style={{ fontSize: 11.5, color: '#4A5C70', background: '#EAF1FB', borderRadius: 9, padding: '9px 11px' }}>
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
                        flex: 1, padding: '10px 6px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                        border: form.troco === opt.value ? 'none' : '1.5px solid #E2E8F0',
                        background: form.troco === opt.value ? ACCENT_DARK : '#fff',
                        color: form.troco === opt.value ? '#fff' : '#64748B', cursor: 'pointer',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {form.troco && (
                  <Field label="Troco para quanto? (R$)" value={form.trocoPara} onChange={v => update('trocoPara', v.replace(',', '.'))} placeholder="Ex: 50,00" />
                )}
              </div>
            )}
          </Step>
        </div>

        {/* Resumo — sticky no desktop */}
        <div style={{ position: isDesktop ? 'sticky' : 'static', top: isDesktop ? 76 : undefined }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, border: '1px solid #EDE8DF', boxShadow: '0 1px 4px rgba(44,62,80,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Receipt size={14} color={ACCENT_DARK} />
              <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.3 }}>Resumo do pedido</div>
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', color: '#64748B' }}>
                <span>{item.qty}x {item.nome}</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{formatBRL(item.preco * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', color: '#64748B' }}>
              <span>Entrega{frete?.semCalculo ? ' (a combinar)' : ''}</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>{frete ? formatBRL(frete.valor || 0) : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, paddingTop: 10, borderTop: '1px dashed #E2E8F0', marginTop: 6 }}>
              <span style={{ color: '#1E293B' }}>Total</span>
              <span style={{ color: ACCENT_DARK }}>{formatBRL(totalComFrete)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '12px 16px 20px', background: `linear-gradient(to top, ${BG} 60%, rgba(250,247,240,0))`, pointerEvents: 'none' }}>
        <button
          onClick={handleFinalizar}
          disabled={!valido}
          style={{
            width: '100%', maxWidth: 488, background: valido ? ACCENT_DARK : '#DCE7F1', color: '#fff', border: 'none',
            borderRadius: 16, padding: '15px 0', fontSize: 15, fontWeight: 800,
            boxShadow: valido ? '0 8px 24px rgba(26,82,118,0.38)' : 'none', cursor: valido ? 'pointer' : 'default', pointerEvents: 'all',
          }}
        >
          {!frete ? 'Calcule o frete para continuar' : 'Confirmar pedido'}
        </button>
      </div>
    </div>
  )
}
