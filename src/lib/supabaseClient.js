import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Isso só aparece no console do navegador (F12) — ajuda a perceber rápido
  // se o arquivo .env não foi criado ou o Netlify não tem as variáveis configuradas.
  console.error(
    '[Kilimp] Faltam as variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'Verifique se o arquivo .env existe (copiado de .env.example) ou, no Netlify, ' +
    'se as variáveis de ambiente foram cadastradas em Site settings → Environment variables.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
