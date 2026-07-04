// ============================================================
// CÁLCULO DE FRETE POR DISTÂNCIA
// ============================================================
export const LOJA_LATITUDE = -23.5015
export const LOJA_LONGITUDE = -47.4526

export const FAIXAS_FRETE = [
  { ateKm: 3, preco: 5.0 },
  { ateKm: 6, preco: 8.0 },
  { ateKm: 10, preco: 12.0 },
  { ateKm: 999, preco: 18.0 },
]

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function geocodificarEndereco(enderecoTexto) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(enderecoTexto)}`

  try {
    const resposta = await fetch(url, {
      headers: {
        'Accept-Language': 'pt-BR',
      },
    })

    if (!resposta.ok) {
      console.error('[Frete] Nominatim respondeu com erro HTTP:', resposta.status)
      return null
    }

    const dados = await resposta.json()

    if (!dados || dados.length === 0) {
      console.warn('[Frete] Endereço não encontrado pelo Nominatim:', enderecoTexto)
      return null
    }

    return {
      latitude: parseFloat(dados[0].lat),
      longitude: parseFloat(dados[0].lon),
    }
  } catch (e) {
    console.error('[Frete] Erro de rede ao geocodificar endereço:', e)
    return null
  }
}

async function geocodificarComFallback(enderecoCompleto, rua, bairro, cidade) {
  const tentativa1 = await geocodificarEndereco(enderecoCompleto)
  if (tentativa1) return tentativa1

  if (rua && cidade) {
    const ruaSimplificada = rua.replace(/\b(de|da|do|dos|das)\b/gi, '').replace(/\s+/g, ' ').trim()
    if (ruaSimplificada !== rua) {
      const tentativa2 = await geocodificarEndereco(`${ruaSimplificada}, ${cidade}, SP, Brasil`)
      if (tentativa2) return tentativa2
    }
  }

  if (bairro && cidade) {
    const tentativa3 = await geocodificarEndereco(`${bairro}, ${cidade}, SP, Brasil`)
    if (tentativa3) return { ...tentativa3, aproximado: true }
  }

  return null
}

export async function calcularFrete(enderecoCompleto, rua, bairro, cidade) {
  const coordsCliente = await geocodificarComFallback(enderecoCompleto, rua, bairro, cidade)

  if (!coordsCliente) {
    return { distanciaKm: null, valor: null, erro: 'endereco_nao_encontrado' }
  }

  const distanciaKm = calcularDistanciaKm(
    LOJA_LATITUDE, LOJA_LONGITUDE,
    coordsCliente.latitude, coordsCliente.longitude
  )

  const faixa = FAIXAS_FRETE.find(f => distanciaKm <= f.ateKm) || FAIXAS_FRETE[FAIXAS_FRETE.length - 1]

  return {
    distanciaKm: Math.round(distanciaKm * 10) / 10,
    valor: faixa.preco,
    erro: null,
    aproximado: !!coordsCliente.aproximado,
  }
}
