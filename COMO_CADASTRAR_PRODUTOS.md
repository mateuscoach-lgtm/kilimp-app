# Como colar o cadastro de produtos no Supabase

Este é um passo a passo bem miudinho, assumindo que você **já tem** o projeto
criado no Supabase (Capítulo 1 do Guia de Deploy) e **já rodou** o
`supabase_setup.sql` (Capítulo 2 — que cria as tabelas).

Se ainda não fez esses dois passos, faça-os primeiro — sem as tabelas
criadas, este cadastro de produtos não tem onde ser guardado.

---

## Passo 1 — Entrar no projeto

1. Acesse [supabase.com](https://supabase.com) e faça login.
2. Na tela inicial, clique no card do seu projeto (o que você chamou de
   `kilimp-app`).

## Passo 2 — Abrir o SQL Editor

1. Olhe o **menu lateral esquerdo** (uma faixa fina de ícones).
2. Procure o ícone parecido com `>_` (um terminal). O nome ao lado é
   **"SQL Editor"**.
3. Clique nele.

## Passo 3 — Criar uma consulta nova

1. No topo da tela, clique no botão **"New query"** (Nova consulta).
2. Vai abrir uma área em branco, com fundo escuro — é ali que cola o código.

## Passo 4 — Copiar o conteúdo do arquivo

1. Abra o arquivo `supabase_produtos_exemplo.sql` (está dentro da pasta do
   projeto que você já tem).
2. Selecione **todo o conteúdo** do arquivo (Ctrl+A se estiver com o
   arquivo aberto e focado, ou clique e arraste do início ao fim).
3. Copie (Ctrl+C).

## Passo 5 — Colar e executar

1. Volte para a aba do Supabase, clique dentro da área em branco do
   SQL Editor.
2. Cole o conteúdo (Ctrl+V).
3. Clique no botão **"Run"** (geralmente no canto superior direito da
   área de código), ou aperte **Ctrl+Enter** (Windows) / **Cmd+Enter** (Mac).

## Passo 6 — Confirmar que funcionou

Depois de rodar, aparece uma mensagem na parte de baixo da tela, algo como:

```
Success. 12 rows affected
```

Isso quer dizer que os 12 produtos de exemplo foram criados. ✅

---

## Como ver os produtos cadastrados

1. No menu lateral, clique em **"Table Editor"** (ícone de tabela).
2. Clique na tabela **produtos**.
3. Você vai ver uma planilha com as 12 linhas, uma para cada produto.

Você pode até editar diretamente aqui se quiser (clicando em cima de uma
célula), mas o caminho mais simples no dia a dia é editar pelo **painel
admin do próprio app** (aba Produtos → ícone de lápis), porque lá você
também consegue trocar a foto.

---

## Se aparecer algum erro

| Mensagem de erro | O que provavelmente aconteceu | O que fazer |
|---|---|---|
| `relation "produtos" does not exist` | A tabela ainda não foi criada | Volte ao Capítulo 2 do Guia de Deploy e rode o `supabase_setup.sql` primeiro |
| `duplicate key value` | Você rodou o cadastro de produtos duas vezes | Sem problema grave: ou ignore (ficou um produto repetido, é só apagar pelo painel), ou rode antes um `delete from produtos;` para limpar e tentar de novo |
| Nada acontece ao clicar em "Run" | Às vezes é só lentidão da página | Espere alguns segundos; se persistir, recarregue a página (F5) e repita do Passo 3 |

---

## Próximo passo depois disso

Com os produtos no banco, é só abrir o app (local com `npm run dev`, ou já
publicado no Netlify) que o catálogo vai aparecer carregado automaticamente
na tela inicial — não precisa de mais nenhuma configuração para isso.
