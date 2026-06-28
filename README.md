# Kilimp App

Aplicativo de pedidos de produtos de limpeza da Kilimp — catálogo, carrinho,
checkout, recibo com impressão térmica + WhatsApp, e painel administrativo
(pedidos, produtos com foto, clientes, relatório exportável para Excel).

Este projeto já está conectado ao **Supabase** (banco de dados real) em vez
do armazenamento de teste usado no protótipo inicial.

## Antes de rodar: configurar o Supabase

1. Siga o **Guia de Deploy Kilimp (Supabase + Netlify)** — Capítulos 1 a 4 —
   para criar o projeto no Supabase e pegar a URL + chave anon.
2. No SQL Editor do Supabase, cole e execute o conteúdo do arquivo
   `supabase_setup.sql` (está na raiz deste projeto). Ele já cria as 4
   tabelas, as sequências de numeração, as funções `nextval_pedido` /
   `nextval_fiscal` e as regras de segurança (RLS).
3. Em **Storage**, crie um bucket chamado `produtos-fotos`, marcado como
   público (também descrito no guia, Capítulo 3).
4. (Opcional) Cole e execute o `supabase_produtos_exemplo.sql` para
   começar com 12 produtos de exemplo já cadastrados, em vez de abrir
   o catálogo vazio. Veja o passo a passo bem detalhado em
   `COMO_CADASTRAR_PRODUTOS.md`.

## Rodando localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Copiar o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# 3. Editar o .env e colar sua URL e chave do Supabase
#    (abra o arquivo .env em qualquer editor de texto)

# 4. Rodar o servidor de desenvolvimento
npm run dev
```

O terminal vai mostrar um endereço local (geralmente `http://localhost:5173`)
para abrir no navegador.

## Publicando no Netlify

Siga os Capítulos 6 e 7 do Guia de Deploy. Resumo:

1. Suba este código para um repositório no GitHub.
2. No Netlify, importe o repositório.
3. Build command: `npm run build` — Publish directory: `dist`
4. Cadastre as mesmas variáveis do `.env` em
   **Site settings → Environment variables**.
5. Deploy.

## Login do painel administrativo

- Usuário: `kilimp`
- Senha: `kilimp2026`

Essas credenciais estão em `src/lib/utils.js` (constante `ADMIN_CREDENCIAIS`).
**Troque a senha antes de divulgar o app**, editando esse arquivo.

> Nota de segurança: este login protege apenas a *tela* do painel. Para uma
> proteção mais forte (que protege também o acesso direto à API do
> Supabase), o passo seguinte de evolução é migrar para o Supabase Auth.
> Isso não é urgente para o volume inicial de uma loja de bairro, mas vale
> revisitar se o app crescer.

## Cadastro inteligente por telefone (novo)

O checkout agora reconhece automaticamente clientes que já compraram antes:
ao digitar o telefone e sair do campo, o app busca no banco e, se encontrar,
pré-preenche nome, endereço, complemento, bairro e cidade — sem precisar de
login ou senha. Da segunda compra em diante, o cliente só digita o telefone.

Também foi adicionado o campo **Complemento** (bloco, apartamento, ponto de
referência), útil para quem mora em condomínio.

**Migração de banco necessária:** se você já rodou o `supabase_setup.sql`
antes desta atualização, rode também `supabase_migracao_complemento.sql`
(adiciona a coluna nova na tabela `clientes`, sem apagar nada).



O checkout calcula automaticamente o valor da entrega com base na distância
em linha reta entre a loja e o endereço do cliente (sem custo, sem chave de
API — usa o serviço gratuito Nominatim/OpenStreetMap para localizar o
endereço, e a fórmula de Haversine para calcular a distância).

**Antes de usar em produção, configure em `src/lib/frete.js`:**

1. `LOJA_LATITUDE` e `LOJA_LONGITUDE` — a localização real da Kilimp.
   Forma fácil de achar: abra o Google Maps, clique com o botão direito
   exatamente no ponto da loja, e copie os dois números que aparecem.
2. `FAIXAS_FRETE` — a tabela de preço por faixa de distância. Vem com
   valores de exemplo; edite livremente.

**Migração de banco necessária:** se você já rodou o `supabase_setup.sql`
antes desta atualização, é preciso rodar também o
`supabase_migracao_frete.sql` (adiciona duas colunas novas na tabela
`pedidos`, sem apagar nada do que já existe).

Se o endereço não for encontrado automaticamente, o cliente pode optar por
"Combinar na entrega" em vez de travar o pedido.

## Reimpressão e ficha de cliente (novo)

No painel admin, aba **Pedidos**, cada pedido tem um botão **"Reimprimir"**
que reabre o cupom completo e permite reenviar para a impressora/WhatsApp.

Na aba **Clientes**, cada cliente tem um botão **"Consultar / imprimir
ficha"**, que mostra os dados completos e o histórico de pedidos, com opção
de imprimir.

## Rodapé de contatos (novo)

A tela inicial (loja) agora tem, no final da página, três botões de
contato: WhatsApp, e-mail e localização no mapa. Edite os valores reais em
`src/components/ContactFooter.jsx` (constantes `EMAIL_LOJA` e
`ENDERECO_LOJA_TEXTO`).



As telas principais (loja, carrinho, checkout, painel admin) agora se
adaptam automaticamente para telas grandes — mais colunas de produtos,
cabeçalho mais espaçoso, formulários mais largos. Isso é feito por CSS
(hook `useIsDesktop` em `src/lib/useIsDesktop.js`), sem precisar de uma
versão separada do app.



```
src/
  lib/
    supabaseClient.js   → conexão com o Supabase (lê o .env)
    produtos.js         → funções de banco: listar/criar/editar produto, upload de foto
    clientes.js         → funções de banco: buscar/criar cliente, resumo de compras
    pedidos.js          → funções de banco: criar pedido completo, listar, atualizar status
    frete.js            → cálculo de frete por distância (Haversine + geocodificação gratuita)
    utils.js            → formatação, WhatsApp, impressão térmica (ESC/POS)
    useIsDesktop.js      → hook para detectar tela grande (computador) vs celular
  views/
    LojaView.jsx        → catálogo (tela inicial do cliente)
    CarrinhoView.jsx    → carrinho de compras
    CheckoutView.jsx    → dados de entrega, pagamento, troco
    ReciboView.jsx      → comprovante + botão de imprimir/WhatsApp
    AdminLoginView.jsx  → login do painel
    AdminView.jsx       → painel: pedidos, produtos, clientes, relatório
    ProductForm.jsx     → cadastro/edição de produto com foto
  components/
    Common.jsx          → peças visuais reaproveitadas (botões, cards, etc.)
  App.jsx                → tela principal, navegação entre as views
  main.jsx                → ponto de entrada do React
supabase_setup.sql        → script completo para colar no SQL Editor do Supabase
.env.example               → modelo das variáveis de ambiente necessárias
```

## O que ainda depende de uma etapa futura

- **Impressão térmica automática**: a função `enviarParaImpressora` em
  `src/lib/utils.js` já monta o comando ESC/POS, mas só simula o envio
  (loga no console). Falta o agente local de impressão rodando no
  computador da loja — ver Capítulo 10 do Guia de Deploy.
- **Pix automático (Mercado Pago)**: a tela de checkout já avisa o cliente
  que o Pix é combinado na entrega. Para automatizar, é necessária uma
  Edge Function no Supabase — ver Capítulo 9 do Guia de Deploy.
- **WhatsApp 100% automático**: hoje o botão "Imprimir e avisar loja" abre
  o WhatsApp com a mensagem pronta, mas alguém precisa clicar em enviar.
  Automatizar de ponta a ponta exigiria a API oficial do WhatsApp Business
  (custo e processo de aprovação mais longos — não recomendado por agora).
