import React, { useState, useMemo } from 'react'
import { FileSpreadsheet, TrendingUp, Package, DollarSign } from 'lucide-react'
import { ACCENT_DARK, DANGER } from '../components/Common'
import { formatBRL } from '../lib/utils'

const COR_ABC = { A: '#1FAE5C', B: '#D98C2B', C: '#C9544A' }

export default function RelatorioView({ orders, produtos, exportarCSV }) {
  const hoje = new Date()
  const primeiroDiaMes = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`
  const hoje_iso = hoje.toISOString().slice(0, 10)

  const [filtroInicio, setFiltroInicio] = useState(primeiroDiaMes)
  const [filtroFim, setFiltroFim] = useState(hoje_iso)

  const pedidosFiltrados = useMemo(() => orders.filter(o => {
    if (o.status === 'Cancelado') return false
    const data = new Date(o.criadoEm)
    if (filtroInicio && data < new Date(filtroInicio + 'T00:00:00')) return false
    if (filtroFim && data > new Date(filtroFim + 'T23:59:59')) return false
    return true
  }), [orders, filtroInicio, filtroFim])

  const { resumo, produtosABC } = useMemo(() => {
    const faturamento = pedidosFiltrados.reduce((s, o) => s + Number(o.total), 0)
    const ticketMedio = pedidosFiltrados.length ? faturamento / pedidosFiltrados.length : 0
    const totalFrete = pedidosFiltrados.reduce((s, o) => s + Number(o.valorFrete || 0), 0)
    const cancelados = orders.filter(o => o.status === 'Cancelado').length

    const mapa = {}
    pedidosFiltrados.forEach(o => {
      o.itens.forEach(i => {
        if (!mapa[i.nome]) mapa[i.nome] = { nome: i.nome, unidade: i.unidade, preco: i.preco, qtd: 0, fat: 0 }
        mapa[i.nome].qtd += i.qty
        mapa[i.nome].fat += i.qty * i.preco
      })
    })

    const fatTotal = Object.values(mapa).reduce((s, p) => s + p.fat, 0)
    let acum = 0
    const produtosABC = Object.values(mapa)
      .sort((a, b) => b.fat - a.fat)
      .map(p => {
        acum += p.fat
        const perc = fatTotal > 0 ? p.fat / fatTotal * 100 : 0
        const percAcum = fatTotal > 0 ? acum / fatTotal * 100 : 0
        const curva = percAcum <= 70 ? 'A' : percAcum <= 90 ? 'B' : 'C'
        const prod = produtos.find(pr => pr.nome === p.nome)
        const custo = prod?.custo ?? null
        const margemPerc = custo !== null ? ((p.preco - custo) / p.preco * 100) : null
        const lucroBruto = custo !== null ? (p.fat - custo * p.qtd) : null
        return { ...p, perc, percAcum, curva, custo, margemPerc, lucroBruto }
      })

    const custoTotal = produtosABC.reduce((s, p) => s + (p.lucroBruto !== null ? (p.fat - p.lucroBruto) : 0), 0)
    const lucroBrutoTotal = produtosABC.reduce((s, p) => s + (p.lucroBruto ?? 0), 0)
    const margemMedia = faturamento > 0 && lucroBrutoTotal > 0 ? lucroBrutoTotal / faturamento * 100 : null

    return { resumo: { faturamento, ticketMedio, totalFrete, cancelados, pedidos: pedidosFiltrados.length, custoTotal, lucroBrutoTotal, margemMedia }, produtosABC }
  }, [pedidosFiltrados, produtos, orders])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Filtro de período */}
      <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', marginBottom: 10 }}>Período</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#7C8B9C', display: 'block', marginBottom: 3 }}>De</label>
            <input type="date" value={filtroInicio} onChange={e => setFiltroInicio(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #D7E2F0', fontSize: 13, outline: 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11, color: '#7C8B9C', display: 'block', marginBottom: 3 }}>Até</label>
            <input type="date" value={filtroFim} onChange={e => setFiltroFim(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #D7E2F0', fontSize: 13, outline: 'none' }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#9AAAB9', marginTop: 8 }}>
          {pedidosFiltrados.length} pedido(s) no período selecionado (cancelados excluídos)
        </div>
      </div>

      {/* Cards de resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Faturamento', value: formatBRL(resumo.faturamento), icon: DollarSign, cor: ACCENT_DARK },
          { label: 'Ticket médio', value: formatBRL(resumo.ticketMedio), icon: TrendingUp, cor: '#1373D6' },
          { label: 'Pedidos', value: resumo.pedidos, icon: Package, cor: '#7A5FC4' },
          { label: 'Total em frete', value: formatBRL(resumo.totalFrete), icon: TrendingUp, cor: '#D98C2B' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${c.cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <c.icon size={15} color={c.cor} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.cor }}>{c.value}</div>
              <div style={{ fontSize: 10.5, color: '#9AAAB9' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Margem geral (só aparece se há custo cadastrado em algum produto) */}
      {resumo.margemMedia !== null && (
        <div style={{ background: '#EAFBF0', border: '1px solid #A7F3D0', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', marginBottom: 6 }}>Margem de contribuição (período)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#047857' }}>Custo total estimado</span>
            <span style={{ fontWeight: 700 }}>{formatBRL(resumo.custoTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
            <span style={{ color: '#047857' }}>Lucro bruto estimado</span>
            <span style={{ fontWeight: 700 }}>{formatBRL(resumo.lucroBrutoTotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, marginTop: 8, paddingTop: 8, borderTop: '1px solid #6EE7B7' }}>
            <span style={{ color: '#065F46' }}>Margem média</span>
            <span style={{ color: '#065F46' }}>{resumo.margemMedia.toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: 10.5, color: '#6EE7B7', marginTop: 4 }}>* Baseado nos produtos com custo cadastrado</div>
        </div>
      )}

      {/* Curva ABC */}
      <div style={{ background: '#fff', border: '1px solid #E3EAF3', borderRadius: 12, padding: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#7C8B9C', textTransform: 'uppercase', marginBottom: 10 }}>Curva ABC — produtos por faturamento</div>
        {produtosABC.length === 0 ? (
          <div style={{ fontSize: 12.5, color: '#9AAAB9' }}>Sem dados no período.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Legenda */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              {['A', 'B', 'C'].map(l => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: COR_ABC[l], display: 'inline-block' }} />
                  <span style={{ color: '#7C8B9C' }}>{l === 'A' ? 'A: 70% fat.' : l === 'B' ? 'B: 70–90%' : 'C: demais'}</span>
                </div>
              ))}
            </div>
            {produtosABC.map(p => (
              <div key={p.nome} style={{ borderBottom: '1px solid #F1F5F9', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: COR_ABC[p.curva], borderRadius: 5, padding: '1px 5px' }}>{p.curva}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2C3E50' }}>{p.nome}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT_DARK }}>{formatBRL(p.fat)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9AAAB9', marginTop: 3 }}>
                  <span>{p.qtd} un. · {p.perc.toFixed(1)}% do faturamento</span>
                  {p.margemPerc !== null
                    ? <span style={{ color: '#1FAE5C', fontWeight: 600 }}>Margem {p.margemPerc.toFixed(1)}%</span>
                    : <span style={{ color: '#CBD5E1' }}>Sem custo</span>
                  }
                </div>
                {/* Barra de progresso de participação */}
                <div style={{ marginTop: 5, height: 3, borderRadius: 2, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.perc}%`, background: COR_ABC[p.curva], borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exportar */}
      <button
        onClick={() => exportarCSV({ filtroInicio, filtroFim })}
        disabled={pedidosFiltrados.length === 0}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: pedidosFiltrados.length === 0 ? '#C7D6E8' : ACCENT_DARK, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 0', fontSize: 13.5, fontWeight: 700 }}
      >
        <FileSpreadsheet size={16} /> Exportar relatório (2 arquivos CSV)
      </button>
      <div style={{ fontSize: 11, color: '#9AAAB9', textAlign: 'center' }}>
        Gera dois arquivos: pedidos detalhados + produtos com curva ABC e margem. Ambos abrem no Excel.
      </div>
    </div>
  )
}
