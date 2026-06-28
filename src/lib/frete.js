// ============================================================
// CÁLCULO DE FRETE POR DISTÂNCIA
// ============================================================
// Estratégia escolhida: distância em linha reta (fórmula de Haversine),
// sem custo e sem precisar de chave de API paga.
//
// Para isso precisamos de duas coisas:
// 1. As coordenadas (latitude/longitude) da loja — você define abaixo.
// 2. As coordenadas do endereço do cliente — conseguimos de graça
//    através do Nominatim (serviço público do OpenStreetMap).
// ============================================================

// ---------- COORDENADAS DA LOJA ----------
// IMPORTANTE: troque estes valores pela localização real da Kilimp.
// Forma fácil de achar: abra google.com/maps, clique com o botão direito
// exatamente no ponto da loja, e o primeiro número que aparece no menu
// é a latitude, o segundo é a longitude.
export const LOJA_LATITUDE = -23.5015
export const LOJA_LONGITUDE = -47.4526

// ---------- TABELA DE PREÇO POR FAIXA DE DISTÂNCIA ----------
// Edite livremente: cada faixa tem uma distância MÁXIMA (em km) e um preço.
// A lista deve estar em ordem crescente de distância.
export const FAIXAS_FRETE = [
  { ateKm: 3, preco: 5.0 },
  { ateKm: 6, preco: 8.0 },
  { ateKm: 10, preco: 12.0 },
  { ateKm: 999, preco: 18.0 }, // "qualquer distância acima disso"
]

// Fórmula de Haversine: calcula a distância em km entre dois pontos
// (latitude/longitude), considerando a curvatura da Terra.
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // raio médio da Terra em km
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

// Converte um endereço em texto para coordenadas, usando o serviço
// gratuito Nominatim (OpenStreetMap). Não precisa de chave de API.
// Limite de uso justo: no máximo 1 chamada por segundo (mais que
// suficiente para o volume de uma loja de bairro).
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
    // Erros aqui costumam ser de rede/CORS. Logamos o detalhe completo
    // para facilitar o diagnóstico pelo Console do navegador (F12).
    console.error('[Frete] Erro de rede ao geocodificar endereço:', e)
    return null
  }
}

// Tenta geocodificar em níveis decrescentes de precisão:
// 1. Endereço completo (rua + número + bairro + cidade)
// 2. Sem o "de"/conectivos comuns que variam entre o nome oficial e o do OSM
// 3. Bairro + cidade (sem a rua) — quase sempre existe no mapa, e já dá
//    uma distância aproximada razoável para fins de frete
async function geocodificarComFallback(enderecoCompleto, rua, bairro, cidade) {
  const tentativa1 = await geocodificarEndereco(enderecoCompleto)
  if (tentativa1) return tentativa1

  if (rua && cidade) {
    // Remove conectivos comuns ("de", "da", "do") que costumam ser a
    // diferença entre o nome popular e o nome cadastrado no mapa.
    const ruaSimplificada = rua.replace(/\b(de|da|do|dos|das)\b/gi, '').replace(/\s+/g, ' ').trim()
    if (ruaSimplificada !== rua) {
      const tentativa2 = await geocodificarEndereco(`${ruaSimplificada}, ${cidade}, SP, Brasil`)
      if (tentativa2) return tentativa2
    }
  }

  if (bairro && cidade) {
    // Última tentativa: só o bairro. Menos preciso (a distância é até o
    // centro do bairro, não até a casa exata), mas evita travar o pedido.
    const tentativa3 = await geocodificarEndereco(`${bairro}, ${cidade}, SP, Brasil`)
    if (tentativa3) return { ...tentativa3, aproximado: true }
  }

  return null
}

// Função principal: recebe o endereço completo do cliente e devolve
// o valor do frete + a distância calculada (para mostrar na tela, se quiser).
// Se não conseguir geocodificar nem pelo bairro, devolve frete null.
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
    distanciaKm: Math.round(distanciaKm * 10) / 10, // 1 casa decimal
    valor: faixa.preco,
    erro: null,
    aproximado: !!coordsCliente.aproximado,
  }
}
