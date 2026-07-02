import React, { useState, useEffect, useMemo } from 'react'
import { listarProdutos } from './lib/produtos'
import { criarPedido, listarPedidos, marcarComoImpresso } from './lib/pedidos'
import { listarClientesComResumo } from './lib/clientes'
import { enviarParaImpressora, abrirWhatsAppPedido, formatBRL } from './lib/utils'
import { supabase } from './lib/supabaseClient'

import LojaView from './views/LojaView'
import HomeView from './views/HomeView'
import CarrinhoView from './views/CarrinhoView'
import CheckoutView from './views/CheckoutView'
import ReciboView from './views/ReciboView'
import AdminLoginView from './views/AdminLoginView'
import AdminView from './views/AdminView'

export default function App() {
  const [view, setView] = useState('home') // home | loja | carrinho | checkout | recibo | admin
  const [cart, setCart] = useState({})
  const [categoria, setCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [produtos, setProdutos] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminTab, setAdminTab] = useState('painel')
  const [adminAutenticado, setAdminAutenticado] = useState(false)

  const [form, setForm] = useState({
    nome: '', telefone: '', endereco: '', complemento: '', bairro: '', cidade: 'Sorocaba',
    pagamento: 'Pix', troco: false, trocoPara: '', observacao: '',
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

  // Verifica se já existe uma sessão de admin válida (ex: a pessoa
  // recarregou a página depois de já ter logado) e mantém o app
  // sincronizado caso a sessão expire ou seja encerrada em outra aba.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAdminAutenticado(!!data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminAutenticado(!!session)
    })

    return () => listener.subscription.unsubscribe()
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
        observacao: form.observacao || null,
      })

      setLastOrder(pedido)
      setCart({})
      setForm(prev => ({ ...prev, troco: false, trocoPara: '', observacao: '' }))
      setView('recibo')
    } catch (e) {
      // O alerta para o cliente fica genérico de propósito (não é o lugar
      // de mostrar jargão técnico), mas o erro real vai pro console (F12)
      // para facilitar o diagnóstico de quem mexe no painel admin depois.
      console.error('[Kilimp] Falha ao finalizar pedido:', e)
      alert('Não foi possível enviar o pedido. Verifique sua conexão e tente novamente.')
    }
  }

  async function handleImprimirRecibo(order) {
    await enviarParaImpressora(order)
    // order._dbId só existe quando o pedido foi criado/lido por uma sessão
    // de admin logada (ex: reimpressão pelo painel). No fluxo normal do
    // cliente comprando na loja (sem login), não temos esse uuid — e nem
    // poderíamos marcar como impresso de qualquer forma, já que UPDATE em
    // pedidos agora exige login. Por isso essa marcação é "melhor esforço":
    // some silenciosamente quando não há sessão, sem travar o recibo.
    if (order._dbId) await marcarComoImpresso(order._dbId)
    abrirWhatsAppPedido(order)
  }

  function exportarCSV({ filtroInicio, filtroFim } = {}) {
    // Filtra por período se informado
    const pedidosFiltrados = orders.filter(o => {
      if (o.status === 'Cancelado') return false
      const data = new Date(o.criadoEm)
      if (filtroInicio && data < new Date(filtroInicio + 'T00:00:00')) return false
      if (filtroFim && data > new Date(filtroFim + 'T23:59:59')) return false
      return true
    })

    // ── ABA 1: Pedidos detalhados ──
    const headerPedidos = 'Pedido,Ref.Fiscal,Cliente,Telefone,Endereço,Bairro,Cidade,Pagamento,Troco,Troco Para,Frete (R$),Distância (km),Itens,Qtd Total,Subtotal Itens,Total c/ Frete,Status,Observação,Data\n'
    const rowsPedidos = pedidosFiltrados.map(o => {
      const itensStr = o.itens.map(i => `${i.qty}x ${i.nome}`).join(' | ')
      const qtdTotal = o.itens.reduce((s, i) => s + i.qty, 0)
      const subtotalItens = o.itens.reduce((s, i) => s + i.qty * i.preco, 0)
      const [, , , bairro, cidade] = (o.endereco || '').split(/,|-/) // estimativa
      return [
        o.id,
        o.codigoFiscal || '',
        o.cliente,
        o.telefone,
        `"${o.endereco}"`,
        '',
        '',
        o.pagamento,
        o.troco ? 'Sim' : 'Não',
        o.troco ? Number(o.trocoPara).toFixed(2) : '',
        Number(o.valorFrete || 0).toFixed(2),
        o.distanciaKm || '',
        `"${itensStr}"`,
        qtdTotal,
        subtotalItens.toFixed(2),
        Number(o.total).toFixed(2),
        o.status,
        `"${o.observacao || ''}"`,
        new Date(o.criadoEm).toLocaleString('pt-BR'),
      ].join(',')
    }).join('\n')

    // ── ABA 2: Vendas por produto ──
    const mapaProdutos = {}
    pedidosFiltrados.forEach(o => {
      o.itens.forEach(i => {
        if (!mapaProdutos[i.nome]) {
          mapaProdutos[i.nome] = {
            nome: i.nome, unidade: i.unidade, precoUnitario: i.preco,
            qtdVendida: 0, faturamento: 0,
          }
        }
        mapaProdutos[i.nome].qtdVendida += i.qty
        mapaProdutos[i.nome].faturamento += i.qty * i.preco
      })
    })

    // Enriquece com custo dos produtos carregados
    Object.values(mapaProdutos).forEach(p => {
      const prodCadastrado = produtos.find(pr => pr.nome === p.nome)
      p.custo = prodCadastrado?.custo ?? null
      p.custoTotal = p.custo !== null ? p.custo * p.qtdVendida : null
      p.margemBruta = p.custo !== null ? ((p.faturamento - (p.custo * p.qtdVendida)) / p.faturamento * 100) : null
      p.lucroBruto = p.custo !== null ? (p.faturamento - p.custo * p.qtdVendida) : null
    })

    const faturamentoTotal = Object.values(mapaProdutos).reduce((s, p) => s + p.faturamento, 0)
    let acumulado = 0
    const produtosOrdenados = Object.values(mapaProdutos)
      .sort((a, b) => b.faturamento - a.faturamento)
      .map(p => {
        acumulado += p.faturamento
        const percFaturamento = faturamentoTotal > 0 ? (p.faturamento / faturamentoTotal * 100) : 0
        const percAcumulado = faturamentoTotal > 0 ? (acumulado / faturamentoTotal * 100) : 0
        const curvaABC = percAcumulado <= 70 ? 'A' : percAcumulado <= 90 ? 'B' : 'C'
        return { ...p, percFaturamento, percAcumulado, curvaABC }
      })

    const headerProdutos = 'Produto,Unidade,Preço Unitário,Custo Unitário,Qtd Vendida,Faturamento (R$),Custo Total (R$),Lucro Bruto (R$),Margem (%),% do Faturamento,% Acumulado,Curva ABC\n'
    const rowsProdutos = produtosOrdenados.map(p => [
      `"${p.nome}"`,
      p.unidade,
      Number(p.precoUnitario).toFixed(2),
      p.custo !== null ? Number(p.custo).toFixed(2) : 'Sem custo cadastrado',
      p.qtdVendida,
      p.faturamento.toFixed(2),
      p.custoTotal !== null ? p.custoTotal.toFixed(2) : '—',
      p.lucroBruto !== null ? p.lucroBruto.toFixed(2) : '—',
      p.margemBruta !== null ? p.margemBruta.toFixed(1) + '%' : '—',
      p.percFaturamento.toFixed(1) + '%',
      p.percAcumulado.toFixed(1) + '%',
      p.curvaABC,
    ].join(',')).join('\n')

    // ── Gera dois arquivos CSV separados ──
    const periodo = filtroInicio && filtroFim ? `_${filtroInicio}_a_${filtroFim}` : ''

    const download = (nomeArquivo, header, rows) => {
      const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = nomeArquivo; a.click()
      URL.revokeObjectURL(url)
    }

    download(`kilimp_pedidos${periodo}.csv`, headerPedidos, rowsPedidos)
    setTimeout(() => {
      download(`kilimp_produtos_abc${periodo}.csv`, headerProdutos, rowsProdutos)
    }, 400)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F0', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ color: '#0A3D7A', fontSize: 14, fontWeight: 600 }}>Carregando…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F0', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#2C3E50' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #C7D6E8; border-radius: 4px; }
        button { font-family: inherit; cursor: pointer; }
        input, select, textarea { font-family: inherit; }
        .spin { animation: spin-rotate 0.8s linear infinite; }
        @keyframes spin-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {view === 'home' && (
        <HomeView
          categorias={categorias}
          totalItens={totalItens}
          irParaProdutos={() => setView('loja')}
          irParaCarrinho={() => setView('carrinho')}
          irParaAdmin={() => setView('admin')}
        />
      )}

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
          removeFromCart={removeFromCart}
          totalItens={totalItens}
          total={total}
          irParaCarrinho={() => setView('carrinho')}
          irParaAdmin={() => setView('admin')}
          irParaHome={() => setView('home')}
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
            sair={async () => { await supabase.auth.signOut(); setView('loja') }}
          />
        ) : (
          <AdminLoginView
            onSuccess={() => {}}
            voltar={() => setView('loja')}
          />
        )
      )}
    </div>
  )
}
