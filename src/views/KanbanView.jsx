import React, { useState, useMemo } from 'react'
import { ArrowRight, Hash, Phone, Package } from 'lucide-react'
import { ACCENT_DARK, EmptyState } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { atualizarStatusPedido } from '../lib/pedidos'
import { useIsDesktop } from '../lib/useIsDesktop'

// As 4 etapas do fluxo de preparação do pedido, na ordem em que avançam.
// O texto de cada uma é exatamente o valor salvo na coluna "status" da
// tabela pedidos no Supabase — não precisa de migração, os pedidos
// antigos já nascem como "Recebido" (valor padrão da tabela).
const COLUNAS = [
  { status: 'Recebido', titulo: 'Recebido', cor: '#1373D6' },
  { status: 'Embalando', titulo: 'Embalando', cor: '#D98C2B' },
  { status: 'Pronto para entrega', titulo: 'Pronto para entrega', cor: '#7A5FC4' },
  { status: 'Finalizado', titulo: 'Finalizado', cor: '#1FAE5C' },
]

function proximoStatus(statusAtual) {
  const idx = COLUNAS.findIndex(c => c.status === statusAtual)
  if (idx === -1 || idx === COLUNAS.length - 1) return null
  return COLUNAS[idx + 1].status
}

export default function KanbanView({ orders, recarregarPedidosEClientes }) {
  const isDesktop = useIsDesktop()
  // Guarda localmente quem está "em trânsito" entre colunas, pra UI responder
  // na hora (otimista) mesmo enquanto o Supabase ainda está confirmando.
  const [movendo, setMovendo] = useState({}) // { [pedidoId]: novoStatus }
  const [arrastando, setArrastando] = useState(null) // pedido sendo arrastado

  const pedidosPorColuna = useMemo(() => {
    const mapa = {}
    COLUNAS.forEach(c => { mapa[c.status] = [] })
    orders.forEach(o => {
      const statusEfetivo = movendo[o.id] || o.status
      // Pedido com status que não bate com nenhuma das 4 colunas (ex: dado
      // legado ou status customizado) cai em "Recebido" por segurança, em
      // vez de desaparecer silenciosamente do quadro.
      const coluna = mapa[statusEfetivo] ? statusEfetivo : 'Recebido'
      mapa[coluna].push(o)
    })
    return mapa
  }, [orders, movendo])

  async function moverPedido(pedido, novoStatus) {
    if (!pedido._dbId || novoStatus === pedido.status) return
    setMovendo(prev => ({ ...prev, [pedido.id]: novoStatus }))
    try {
      await atualizarStatusPedido(pedido._dbId, novoStatus)
      await recarregarPedidosEClientes()
    } finally {
      setMovendo(prev => {
        const next = { ...prev }
        delete next[pedido.id]
        return next
      })
    }
  }

  function handleDrop(e, statusDestino) {
    e.preventDefault()
    if (arrastando) moverPedido(arrastando, statusDestino)
    setArrastando(null)
  }

  const totalPedidos = orders.length

  if (totalPedidos === 0) {
    return <EmptyState text="Nenhum pedido registrado ainda. Assim que um pedido chegar, ele aparece aqui como um card em 'Recebido'." />
  }

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
      {COLUNAS.map(coluna => {
        const pedidosDaColuna = pedidosPorColuna[coluna.status] || []
        return (
          <div
            key={coluna.status}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, coluna.status)}
            style={{
              flex: isDesktop ? '1 1 0' : '0 0 260px', minWidth: isDesktop ? 220 : 260,
              display: 'flex', flexDirection: 'column',
              background: '#F0F3F7', borderRadius: 14, minHeight: 200,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 12px 10px' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: coluna.cor, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, fontSize: 12.5, color: '#33414F' }}>{coluna.titulo}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#8B97A5', background: '#fff', borderRadius: 20, padding: '1px 8px' }}>
                {pedidosDaColuna.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 10px 10px', flex: 1 }}>
              {pedidosDaColuna.length === 0 && (
                <div style={{ fontSize: 11.5, color: '#A9B3BE', textAlign: 'center', padding: '20px 8px', border: '1px dashed #D7DEE6', borderRadius: 10 }}>
                  Nenhum pedido aqui
                </div>
              )}

              {pedidosDaColuna.map(pedido => {
                const destino = proximoStatus(coluna.status)
                const emTransito = !!movendo[pedido.id]
                return (
                  <div
                    key={pedido.id}
                    draggable
                    onDragStart={() => setArrastando(pedido)}
                    onDragEnd={() => setArrastando(null)}
                    style={{
                      background: '#fff', borderRadius: 11, padding: 11, border: '1px solid #E3EAF3',
                      cursor: 'grab', opacity: emTransito ? 0.55 : 1, transition: 'opacity 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: ACCENT_DARK, marginBottom: 3 }}>
                      <Hash size={11} /> {pedido.id}
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2C3E50' }}>{pedido.cliente}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8B97A5', marginTop: 2 }}>
                      <Phone size={10} /> {pedido.telefone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8B97A5', marginTop: 4 }}>
                      <Package size={10} /> {pedido.itens.reduce((s, i) => s + i.qty, 0)} itens
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#2C3E50' }}>{formatBRL(pedido.total)}</span>
                      {destino && (
                        <button
                          onClick={() => moverPedido(pedido, destino)}
                          disabled={emTransito}
                          title={`Mover para "${destino}"`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4, background: '#EAF1FB', color: ACCENT_DARK,
                            border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 10.5, fontWeight: 700,
                          }}
                        >
                          {emTransito ? '...' : 'Avançar'} <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
