import { supabase } from './supabaseClient'

// ============================================================
// PRODUTOS
// ============================================================

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

export async function desativarProduto(id) {
  const { error } = await supabase.from('produtos').update({ ativo: false }).eq('id', id)
  if (error) {
    console.error('Erro ao desativar produto:', error)
    throw error
  }
}

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
