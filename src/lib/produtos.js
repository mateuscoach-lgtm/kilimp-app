import { supabase } from './supabaseClient'

// ============================================================
// PRODUTOS
// ============================================================

// Busca todos os produtos ativos, para exibir na loja.
// No painel admin, passamos incluirInativos=true para também ver os ocultos.
export async function listarProdutos(incluirInativos = false) {
  let query = supabase.from('produtos').select('*').order('nome')
  if (!incluirInativos) query = query.eq('ativo', true)

  const { data, error } = await query
  if (error) {
    console.error('Erro ao listar produtos:', error)
    return []
  }
  return data
}

// Cria um novo produto. Se vier um arquivo de foto (File do input), faz o
// upload para o Storage primeiro e salva o link público em foto_url.
export async function criarProduto(produto, arquivoFoto) {
  let fotoUrl = null
  if (arquivoFoto) {
    fotoUrl = await enviarFotoProduto(arquivoFoto)
  }

  const { data, error } = await supabase
    .from('produtos')
    .insert({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      unidade: produto.unidade,
      estoque: produto.estoque || 0,
      foto_url: fotoUrl,
      ativo: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar produto:', error)
    throw error
  }
  return data
}

// Atualiza um produto existente. Se vier um novo arquivo de foto, substitui.
export async function atualizarProduto(id, produto, arquivoFoto) {
  let fotoUrl = produto.foto_url || null
  if (arquivoFoto) {
    fotoUrl = await enviarFotoProduto(arquivoFoto)
  }

  const { data, error } = await supabase
    .from('produtos')
    .update({
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco,
      unidade: produto.unidade,
      estoque: produto.estoque || 0,
      foto_url: fotoUrl,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar produto:', error)
    throw error
  }
  return data
}

// Exclusão "lógica": marca como inativo em vez de apagar de verdade.
// Isso preserva o histórico de pedidos antigos que referenciam esse produto.
export async function desativarProduto(id) {
  const { error } = await supabase.from('produtos').update({ ativo: false }).eq('id', id)
  if (error) {
    console.error('Erro ao desativar produto:', error)
    throw error
  }
}

// Envia o arquivo de foto para o bucket "produtos-fotos" e devolve a URL pública.
async function enviarFotoProduto(arquivoFoto) {
  const extensao = arquivoFoto.name.split('.').pop()
  const nomeArquivo = `produto-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`

  const { error: erroUpload } = await supabase.storage
    .from('produtos-fotos')
    .upload(nomeArquivo, arquivoFoto, { cacheControl: '3600', upsert: false })

  if (erroUpload) {
    console.error('Erro ao enviar foto:', erroUpload)
    throw erroUpload
  }

  const { data } = supabase.storage.from('produtos-fotos').getPublicUrl(nomeArquivo)
  return data.publicUrl
}
