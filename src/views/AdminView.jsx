import React, { useState, useMemo } from 'react'
import { ClipboardList, Package, Store, FileSpreadsheet, Plus, Pencil, Trash2, Hash, LogOut, ArrowLeft, Printer, Eye } from 'lucide-react'
import { ACCENT_DARK, DANGER, ProductThumb, StatCard, EmptyState } from '../components/Common'
import { formatBRL } from '../lib/utils'
import { criarProduto, atualizarProduto, desativarProduto } from '../lib/produtos'
import { useIsDesktop } from '../lib/useIsDesktop'
import ProductForm from './ProductForm'
import ReciboModal from './ReciboModal'
import ClienteModal from './ClienteModal'

export default function AdminView({
  orders, clients, produtos, recarregarProdutos, recarregarPedidosEClientes,
  tab, setTab, voltar, exportarCSV, sair,
}) {
  const isDesktop = useIsDesktop()
  const maxWidth = isDesktop ? 1000 : 560
  const [editing, setEditing] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [atualizando, setAtualizando] = useState(false)
  const [pedidoParaImprimir, setPedidoParaImprimir] = useState(null)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)

  const totalVendas = orders.reduce((s, o) => s + Number(o.total), 0)
  const ticketMedio = orders.length ? totalVendas / orders.length : 0

  const vendasPorProduto = useMemo(() => {
    const map = {}
    orders.forEach(o => o.itens.forEach(i => {
      map[i.nome] = (map[i.nome] || 0) + i.qty
    }))
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [orders])

  async function handleSaveProduct(produtoDados, arquivoFoto) {
    setSalvando(true)
    try {
      if (editing.id) {
        await atualizarProduto(editing.id, produtoDados, arquivoFoto)
      } else {
        await criarProduto(produtoDados, arquivoFoto)
      }
      await recarregarProdutos()
      setEditing(null)
    } catch (e) {
      alert('Não foi possível salvar o produto. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Remover este produto da loja? Ele deixa de aparecer para os clientes, mas o histórico de pedidos antigos é mantido.')) return
    await desativarProduto(id)
    await recarregarProdutos()
  }

  async function handleAtualizar() {
    setAtualizando(true)
    await recarregarPedidosEClientes()
    setAtualizando(false)
  }

  if (editing !== null) {
    return <ProductForm produto={editing} onCancel={() => setEditing(null)} onSave={handleSaveProduct} salvando={salvando} />
  }

  return (
    <div style={{ maxWidth, margin: '0 auto', paddingBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={voltar} style={{ background: '#fff', border: '1px solid #D7E2F0', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={17} />
          </button>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Painel Kilimp</div>
        </div>
        <button onClick={sair} title="Sair" style={{ background: '#fff', border: '1px solid #D7E2F0', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: DANGER }}>
          <LogOut size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0', overflowX: 'auto' }}>
        {[
          { key: 'pedidos', label: 'Pedidos', icon: ClipboardList },
          { key: 'produtos', label: 'Produtos', icon: Package },
          { key: 'clientes', label: 'Clientes', icon: Store },
          { key: 'relatorio', label: 'Relatório', icon: FileSpreadsheet },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 600,
              border: tab === t.key ? 'none' : '1px solid #D7E2F0',
              background: tab === t.key ? ACCENT_DARK : '#fff',
              color: tab === t.key ? '#fff' : '#4A5C70',
            }}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StatCard label="Pedidos" value={orders.length} />
          <StatCard label="Faturado" value={formatBRL(totalVendas)} small />
          <StatCard label="Ticket médio" value={formatBRL(ticketMedio)} small />
        </div>

        {(tab === 'pedidos' || tab === 'clientes') && (
          <button
            onClick={handleAtualizar}
            disabled={atualizando}
            style={{ marginBottom: 12, fontSize: 12, color: ACCENT_DARK, background: '#EAF1FB', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600 }}
          >
            {atualizando ? 'Atualizando...' : '↻ Atualizar lista'}
          </button>
        )}

        {tab === 'pedidos' && (
          orders.length === 0 ? (
            <EmptyState text="Nenhum pedido registrado ainda. Faça um pedido na loja para ver aparecer aqui." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{o.id}</span>
                    <span style={{ fontSize: 11, background: '#EAF1FB', color: ACCENT_DARK, padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{o.status}</span>
                  </div>
                  {o.codigoFiscal && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#7C8B9C', marginBottom: 2 }}>
                      <Hash size={11} /> {o.codigoFiscal}
                    </div>
                  )}
                  <div style={{ fontSize: 12.5, color: '#4A5C70' }}>{o.cliente} • {o.telefone}</div>
                  <div style={{ fontSize: 11.5, color: '#7C8B9C', marginTop: 2 }}>{o.endereco}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 13 }}>
                    <span style={{ color: '#7C8B9C' }}>
                      {o.itens.reduce((s, i) => s + i.qty, 0)} itens • {o.pagamento}
                      {o.troco && ` (troco p/ ${formatBRL(o.trocoPara)})`}
                    </span>
                    <span style={{ fontWeight: 700 }}>{formatBRL(o.total)}</span>
                  </div>
                  <button
                    onClick={() => setPedidoParaImprimir(o)}
                    style={{ marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#EAF1FB', color: ACCENT_DARK, border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 600 }}
                  >
                    <Printer size={13} /> Reimprimir
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'produtos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => setEditing({})}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#1373D6', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 0', fontSize: 13.5, fontWeight: 700 }}
            >
              <Plus size={16} /> Cadastrar novo produto
            </button>

            {produtos.map(p => (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, flexShrink: 0 }}><ProductThumb produto={p} size={36} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.nome}{!p.ativo && <span style={{ color: '#9AAAB9', fontWeight: 400 }}> (oculto)</span>}</div>
                  <div style={{ fontSize: 11, color: '#7C8B9C' }}>{p.categoria} • {p.unidade} • estoque: {p.estoque}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: ACCENT_DARK, flexShrink: 0 }}>{formatBRL(p.preco)}</div>
                <button onClick={() => setEditing(p)} style={{ background: '#EEF2F7', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#FBEEEC', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: DANGER }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'clientes' && (
          clients.length === 0 ? (
            <EmptyState text="Nenhum cliente cadastrado ainda. Cada novo pedido cria o cadastro automaticamente." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {clients.map(c => (
                <div key={c.id} style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{c.nome}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#4A5C70', marginTop: 2 }}>{c.telefone}</div>
                  <div style={{ fontSize: 11.5, color: '#7C8B9C' }}>{c.endereco}{c.bairro ? ', ' + c.bairro : ''}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12.5 }}>
                    <span style={{ color: '#7C8B9C' }}>{c.totalPedidos} pedido(s)</span>
                    <span style={{ fontWeight: 700 }}>{formatBRL(c.totalGasto)}</span>
                  </div>
                  <button
                    onClick={() => setClienteSelecionado(c)}
                    style={{ marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#EAF1FB', color: ACCENT_DARK, border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 12, fontWeight: 600 }}
                  >
                    <Eye size={13} /> Consultar / imprimir ficha
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'relatorio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', marginBottom: 10 }}>Produtos mais vendidos</div>
              {vendasPorProduto.length === 0 ? (
                <div style={{ fontSize: 12.5, color: '#9AAAB9' }}>Sem dados ainda.</div>
              ) : (
                vendasPorProduto.map(([nome, qty]) => (
                  <div key={nome} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0', borderBottom: '1px solid #EEF2F7' }}>
                    <span>{nome}</span>
                    <span style={{ fontWeight: 700, color: ACCENT_DARK }}>{qty} un.</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={exportarCSV}
              disabled={orders.length === 0}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: orders.length === 0 ? '#C7D6E8' : ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}
            >
              <FileSpreadsheet size={16} /> Exportar relatório (CSV / Excel)
            </button>
            <div style={{ fontSize: 11.5, color: '#9AAAB9', textAlign: 'center' }}>
              Gera um arquivo .csv que abre direto no Excel, com todos os pedidos carregados.
            </div>
          </div>
        )}
      </div>

      {pedidoParaImprimir && (
        <ReciboModal order={pedidoParaImprimir} onClose={() => setPedidoParaImprimir(null)} />
      )}

      {clienteSelecionado && (
        <ClienteModal
          cliente={clienteSelecionado}
          pedidosDoCliente={orders.filter(o => o.clienteId === clienteSelecionado.id)}
          onClose={() => setClienteSelecionado(null)}
        />
      )}
    </div>
  )
}
