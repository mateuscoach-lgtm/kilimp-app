# Como colar o cadastro de produtos no Supabase

Este é um passo a passo bem miudinho, assumindo que você **já tem** o projeto
criado no Supabase e **já rodou** o `supabase_setup.sql` (que cria as tabelas).

## Passo 1 — Entrar no projeto

1. Acesse [supabase.com](https://supabase.com) e faça login.
2. Clique no card do seu projeto (`kilimp-app`).

## Passo 2 — Abrir o SQL Editor

1. No menu lateral esquerdo, procure o ícone `>_` — **"SQL Editor"**.
2. Clique nele.

## Passo 3 — Criar uma consulta nova

1. Clique em **"New query"**.

## Passo 4 — Copiar o conteúdo do arquivo

1. Abra o arquivo `supabase_produtos_exemplo.sql`.
2. Selecione todo o conteúdo (Ctrl+A) e copie (Ctrl+C).

## Passo 5 — Colar e executar

1. Cole no SQL Editor (Ctrl+V).
2. Clique em **"Run"** ou aperte Ctrl+Enter / Cmd+Enter.

## Passo 6 — Confirmar que funcionou

Deve aparecer algo como `Success. 12 rows affected`.

## Como ver os produtos cadastrados

1. Menu lateral → **"Table Editor"**.
2. Clique na tabela **produtos**.

O caminho mais simples no dia a dia é editar pelo painel admin do
próprio app (aba Produtos → ícone de lápis), porque lá você também
consegue trocar a foto.

## Se aparecer algum erro

| Mensagem de erro | O que provavelmente aconteceu | O que fazer |
|---|---|---|
| `relation "produtos" does not exist` | A tabela ainda não foi criada | Rode o `supabase_setup.sql` primeiro |
| `duplicate key value` | Cadastro de produtos rodado duas vezes | Ignore, ou rode `delete from produtos;` antes |
| Nada acontece ao clicar em "Run" | Lentidão da página | Espere ou recarregue (F5) |

## Próximo passo

Com os produtos no banco, é só abrir o app (`npm run dev`, ou já publicado
no Netlify) que o catálogo aparece carregado automaticamente.
