import React, { useState, useMemo } from 'react'
import { ArrowRight, Hash, Phone, Package, Calendar, XCircle } from 'lucide-react'
import { ACCENT_DARK, DANGER, EmptyState } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { atualizarStatusPedido } from '../lib/pedidos'
import { useIsDesktop } from '../lib/useIsDesktop'
import PedidoDetalheModal from './PedidoDetalheModal'

const COLUNAS = [
  { status: 'Recebido',            titulo: 'Recebido',             cor: '#1373D6' },
  { status: 'Embalando',           titulo: 'Embalando',            cor: '#D98C2B' },
  { status: 'Pronto para entrega', titulo: 'Pronto para entrega',  cor: '#7A5FC4' },
  { status: 'Finalizado',          titulo: 'Finalizado',           cor: '#1FAE5C' },
  { status: 'Cancelado',           titulo: 'Cancelado',            cor: '#C9544A' },
]

function proximoStatus(statusAtual) {
  const fluxo = ['Recebido', 'Embalando', 'Pronto para entrega', 'Finalizado']
  const idx = fluxo.indexOf(statusAtual)
  if (idx === -1 || idx === fluxo.length - 1) return null
  return fluxo[idx + 1]
}

export default function KanbanView({ orders, recarregarPedidosEClientes }) {
  const isDesktop = useIsDesktop()
  const [movendo, setMovendo] = useState({})
  const [arrastando, setArrastando] = useState(null)
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(null)

  const pedidosPorColuna = useMemo(() => {
    const mapa = {}
    COLUNAS.forEach(c => { mapa[c.status] = [] })
    orders.forEach(o => {
      const statusEfetivo = movendo[o.id] || o.status
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
      setMovendo(prev => { const n = { ...prev }; delete n[pedido.id]; return n })
    }
  }

  async function handleCancelar(pedido) {
    setConfirmandoCancelamento(null)
    await moverPedido(pedido, 'Cancelado')
  }

  function handleDrop(e, statusDestino) {
    e.preventDefault()
    if (arrastando) moverPedido(arrastando, statusDestino)
    setArrastando(null)
  }

  if (orders.length === 0) {
    return <EmptyState text="Nenhum pedido registrado ainda. Assim que um pedido chegar, ele aparece aqui como um card em 'Recebido'." />
  }

  const pedidoSelecionadoAtualizado = pedidoSelecionado
    ? orders.find(o => o.id === pedidoSelecionado.id) || pedidoSelecionado
    : null

  return (
    <>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {COLUNAS.map(coluna => {
          const pedidosDaColuna = pedidosPorColuna[coluna.status] || []
          const isCancelada = coluna.status === 'Cancelado'
          return (
            <div
              key={coluna.status}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, coluna.status)}
              style={{
                flex: isDesktop ? '1 1 0' : '0 0 260px', minWidth: isDesktop ? 200 : 260,
                display: 'flex', flexDirection: 'column',
                background: isCancelada ? '#FDF1F0' : '#F0F3F7',
                borderRadius: 14, minHeight: 200,
                border: isCancelada ? '1px solid #F5C6C3' : 'none',
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
                  const podeCancelar = coluna.status !== 'Cancelado' && coluna.status !== 'Finalizado'
                  const confirmando = confirmandoCancelamento === pedido.id

                  return (
                    <div
                      key={pedido.id}
                      draggable={!isCancelada}
                      onDragStart={() => !isCancelada && setArrastando(pedido)}
                      onDragEnd={() => setArrastando(null)}
                      onClick={() => setPedidoSelecionado(pedido)}
                      style={{
                        background: isCancelada ? '#fff5f5' : '#fff',
                        borderRadius: 11, padding: 11,
                        border: isCancelada ? '1px solid #FECACA' : '1px solid #E3EAF3',
                        cursor: 'pointer', opacity: emTransito ? 0.55 : 1, transition: 'opacity 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 700, color: isCancelada ? DANGER : ACCENT_DARK, marginBottom: 3 }}>
                        <Hash size={11} /> {pedido.id}
                        {isCancelada && <span style={{ marginLeft: 'auto', fontSize: 10, color: DANGER, fontWeight: 700, background: '#FEE2E2', borderRadius: 6, padding: '1px 6px' }}>Cancelado</span>}
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#2C3E50' }}>{pedido.cliente}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8B97A5', marginTop: 2 }}>
                        <Phone size={10} /> {pedido.telefone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8B97A5', marginTop: 4 }}>
                        <Package size={10} /> {pedido.itens.reduce((s, i) => s + i.qty, 0)} itens
                      </div>
                      {pedido.previsaoEntrega && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#1FAE5C', marginTop: 4, fontWeight: 600 }}>
                          <Calendar size={10} /> {new Date(pedido.previsaoEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      )}
                      {pedido.observacao && (
                        <div style={{ fontSize: 10.5, color: '#D98C2B', background: '#FDF6EC', borderRadius: 6, padding: '3px 7px', marginTop: 5, fontStyle: 'italic' }}>
                          📝 {pedido.observacao}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#2C3E50' }}>{formatBRL(pedido.total)}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {podeCancelar && !confirmando && (
                            <button
                              onClick={e => { e.stopPropagation(); setConfirmandoCancelamento(pedido.id) }}
                              disabled={emTransito}
                              title="Cancelar pedido"
                              style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#FEF2F2', color: DANGER, border: 'none', borderRadius: 7, padding: '5px 7px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}
                            >
                              <XCircle size={11} /> Cancelar
                            </button>
                          )}
                          {confirmando && (
                            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => setConfirmandoCancelamento(null)} style={{ fontSize: 10, padding: '4px 7px', borderRadius: 6, border: '1px solid #D7E2F0', background: '#fff', color: '#4A5C70', fontWeight: 700, cursor: 'pointer' }}>Não</button>
                              <button onClick={() => handleCancelar(pedido)} style={{ fontSize: 10, padding: '4px 7px', borderRadius: 6, border: 'none', background: DANGER, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Sim, cancelar</button>
                            </div>
                          )}
                          {destino && !confirmando && (
                            <button
                              onClick={e => { e.stopPropagation(); moverPedido(pedido, destino) }}
                              disabled={emTransito}
                              title={`Mover para "${destino}"`}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EAF1FB', color: ACCENT_DARK, border: 'none', borderRadius: 7, padding: '5px 8px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}
                            >
                              {emTransito ? '...' : 'Avançar'} <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {pedidoSelecionadoAtualizado && (
        <PedidoDetalheModal
          order={pedidoSelecionadoAtualizado}
          onClose={() => setPedidoSelecionado(null)}
          onAtualizado={recarregarPedidosEClientes}
        />
      )}
    </>
  )
}
