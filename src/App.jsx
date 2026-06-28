import React, { useState, useEffect, useMemo } from 'react'
import { listarProdutos } from './lib/produtos'
import { criarPedido, listarPedidos, marcarComoImpresso } from './lib/pedidos'
import { listarClientesComResumo } from './lib/clientes'
import { enviarParaImpressora, abrirWhatsAppPedido, formatBRL } from './lib/utils'

import LojaView from './views/LojaView'
import CarrinhoView from './views/CarrinhoView'
import CheckoutView from './views/CheckoutView'
import ReciboView from './views/ReciboView'
import AdminLoginView from './views/AdminLoginView'
import AdminView from './views/AdminView'

export default function App() {
  const [view, setView] = useState('loja') // loja | carrinho | checkout | recibo | admin
  const [cart, setCart] = useState({})
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [produtos, setProdutos] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminTab, setAdminTab] = useState('pedidos')
  const [adminAutenticado, setAdminAutenticado] = useState(false)

  const [form, setForm] = useState({
    nome: '', telefone: '', endereco: '', complemento: '', bairro: '', cidade: 'Sorocaba',
    pagamento: 'Pix', troco: false, trocoPara: '',
  })

  // Carrega o catálogo assim que o app abre (é a única coisa que o
  // cliente comum precisa: produtos e pedidos só carregam quando o
  // admin loga, para não buscar dados sensíveis sem necessidade).
  useEffect(() => {
    (async () => {
      const p = await listarProdutos()
      setProdutos(p)
      setLoading(false)
    })()
  }, [])

  // Carrega pedidos e clientes só quando o admin autentica.
  useEffect(() => {
    if (!adminAutenticado) return
    (async () => {
      const [o, c] = await Promise.all([listarPedidos(), listarClientesComResumo()])
      setOrders(o)
      setClients(c)
    })()
  }, [adminAutenticado])

  const categorias = useMemo(
    () => ['Todos', ...Array.from(new Set(produtos.map(p => p.categoria)))],
    [produtos]
  )

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      const matchCat = categoria === 'Todos' || p.categoria === categoria
      const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
      return matchCat && matchBusca
    })
  }, [produtos, categoria, busca])

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const produto = produtos.find(p => p.id === id)
        return produto ? { ...produto, qty } : null
      })
      .filter(Boolean)
  }, [cart, produtos])

  const total = useMemo(() => cartItems.reduce((s, i) => s + Number(i.preco) * i.qty, 0), [cartItems])
  const totalItens = useMemo(() => cartItems.reduce((s, i) => s + i.qty, 0), [cartItems])

  function addToCart(id) {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }
  function removeFromCart(id) {
    setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }))
  }
  function deleteFromCart(id) {
    setCart(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  async function recarregarProdutos() {
    const p = await listarProdutos(true) // inclui inativos, pois quem chama é o admin
    setProdutos(p)
  }

  async function recarregarPedidosEClientes() {
    const [o, c] = await Promise.all([listarPedidos(), listarClientesComResumo()])
    setOrders(o)
    setClients(c)
  }

  async function finalizarPedido({ valorFrete = 0, distanciaKm = null } = {}) {
    if (!form.nome.trim() || !form.telefone.trim() || !form.endereco.trim()) return

    const enderecoCompleto = `${form.endereco}${form.complemento ? ' - ' + form.complemento : ''}${form.bairro ? ', ' + form.bairro : ''}${form.cidade ? ' - ' + form.cidade : ''}`
    const totalComFrete = total + valorFrete

    try {
      const pedido = await criarPedido({
        dadosCliente: {
          nome: form.nome,
          telefone: form.telefone,
          endereco: form.endereco,
          complemento: form.complemento,
          bairro: form.bairro,
          cidade: form.cidade,
          enderecoCompleto,
        },
        itensCarrinho: cartItems,
        total: totalComFrete,
        pagamento: form.pagamento,
        troco: form.pagamento === 'Dinheiro' && form.troco,
        trocoPara: form.pagamento === 'Dinheiro' && form.troco ? parseFloat(form.trocoPara || 0) : null,
        valorFrete,
        distanciaKm,
      })

      setLastOrder(pedido)
      setCart({})
      setForm(prev => ({ ...prev, troco: false, trocoPara: '' }))
      setView('recibo')
    } catch (e) {
      alert('Não foi possível enviar o pedido. Verifique sua conexão e tente novamente.')
    }
  }

  async function handleImprimirRecibo(order) {
    await enviarParaImpressora(order)
    if (order._dbId) await marcarComoImpresso(order._dbId)
    abrirWhatsAppPedido(order)
  }

  function exportarCSV() {
    const header = 'Pedido,Ref.Fiscal,Cliente,Telefone,Endereco,Pagamento,Troco,Itens,Total,Status,Data\n'
    const rows = orders.map(o => {
      const itensStr = o.itens.map(i => `${i.qty}x ${i.nome}`).join(' | ')
      const trocoStr = o.troco ? `Sim - p/ ${Number(o.trocoPara).toFixed(2)}` : 'Não'
      return [
        o.id, o.codigoFiscal || '', o.cliente, o.telefone, `"${o.endereco}"`, o.pagamento, `"${trocoStr}"`,
        `"${itensStr}"`, Number(o.total).toFixed(2), o.status, new Date(o.criadoEm).toLocaleString('pt-BR'),
      ].join(',')
    }).join('\n')

    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'relatorio_vendas_kilimp.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F8FC', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ color: '#0A3D7A', fontSize: 14, fontWeight: 600 }}>Carregando…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#15202B' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #C7D6E8; border-radius: 4px; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        .spin { animation: spin-rotate 0.8s linear infinite; }
        @keyframes spin-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {view === 'loja' && (
        <LojaView
          produtos={produtosFiltrados}
          categorias={categorias}
          categoria={categoria}
          setCategoria={setCategoria}
          busca={busca}
          setBusca={setBusca}
          cart={cart}
          addToCart={addToCart}
          totalItens={totalItens}
          total={total}
          irParaCarrinho={() => setView('carrinho')}
          irParaAdmin={() => setView('admin')}
        />
      )}

      {view === 'carrinho' && (
        <CarrinhoView
          items={cartItems}
          total={total}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          deleteFromCart={deleteFromCart}
          voltar={() => setView('loja')}
          continuar={() => setView('checkout')}
        />
      )}

      {view === 'checkout' && (
        <CheckoutView
          form={form}
          setForm={setForm}
          items={cartItems}
          total={total}
          voltar={() => setView('carrinho')}
          finalizar={finalizarPedido}
        />
      )}

      {view === 'recibo' && lastOrder && (
        <ReciboView
          order={lastOrder}
          onImprimir={handleImprimirRecibo}
          novoPedido={() => setView('loja')}
        />
      )}

      {view === 'admin' && (
        adminAutenticado ? (
          <AdminView
            orders={orders}
            clients={clients}
            produtos={produtos}
            recarregarProdutos={recarregarProdutos}
            recarregarPedidosEClientes={recarregarPedidosEClientes}
            tab={adminTab}
            setTab={setAdminTab}
            voltar={() => setView('loja')}
            exportarCSV={exportarCSV}
            sair={() => { setAdminAutenticado(false); setView('loja') }}
          />
        ) : (
          <AdminLoginView
            onSuccess={() => setAdminAutenticado(true)}
            voltar={() => setView('loja')}
          />
        )
      )}
    </div>
  )
}
