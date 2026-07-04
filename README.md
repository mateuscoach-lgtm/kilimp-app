# Kilimp App

Aplicativo de pedidos de produtos de limpeza da Kilimp — catálogo, carrinho,
checkout, recibo com impressão térmica + WhatsApp, e painel administrativo
(pedidos, produtos com foto, clientes, relatório exportável para Excel).

Este projeto já está conectado ao **Supabase** (banco de dados real).

## Antes de rodar: configurar o Supabase

1. Crie o projeto no Supabase e pegue a URL + chave anon (Project Settings → API).
2. No SQL Editor do Supabase, cole e execute o conteúdo do arquivo
   `supabase_setup.sql` (está na raiz deste projeto). Ele já cria as 4
   tabelas, as sequências de numeração, as funções `nextval_pedido` /
   `nextval_fiscal` e as regras de segurança (RLS).
3. Em **Storage**, crie um bucket chamado `produtos-fotos`, marcado como público.
4. (Opcional) Cole e execute o `supabase_produtos_exemplo.sql` para
   começar com 12 produtos de exemplo já cadastrados. Veja o passo a
   passo em `COMO_CADASTRAR_PRODUTOS.md`.

## Rodando localmente

```bash
# 1. Instalar as dependências
npm install

# 2. Copiar o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# 3. Editar o .env e colar sua URL e chave do Supabase

# 4. Rodar o servidor de desenvolvimento
npm run dev
```

O terminal vai mostrar um endereço local (geralmente `http://localhost:5173`).

## Publicando no Netlify

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
> proteção mais forte, o passo seguinte de evolução é migrar para o
> Supabase Auth.

## Identidade visual — logo Kilimp

A logo "Kilimp" é tipografia real (componente `KilimpLogo` em
`src/components/Common.jsx`), não uma imagem — assim ela se adapta a
qualquer fundo (azul ou claro), escala sem perda de qualidade e não gera
o "estranhamento" visual de um PNG colado sobre a interface.

Ela reproduz o estilo do logo oficial de 20 anos da marca: letras
arredondadas tipo "bubble", gradiente + bisel 3D via `text-shadow` em
camadas, leve arco na linha de base, pontos customizados (bolhas) nos
dois "i", e uma gota com gradiente/brilho ao lado do "p". A fonte usada é
a **Fredoka One** (Google Fonts, carregada no `index.html`), a mais
próxima livre disponível do estilo do logo original — se a marca tiver o
arquivo da fonte/letreiro original, dá pra ficar ainda mais fiel.

Para ajustar o logo, edite a função `KilimpLogo` em `Common.jsx`. O
parâmetro `variant` controla a cor: `"light"` (para fundos azuis) ou
`"dark"` (para fundos claros/areia).

**Paleta de cores** (em `src/components/Common.jsx`):
- Azul principal `#2980B9` (`ACCENT`) e azul escuro `#1A5276` (`ACCENT_DARK`)
- Areia `#F4F1EA` (`SAND`) — fundo de seções alternadas
- Areia clara `#FAF7F0` (`BG`) — fundo principal
- Grafite `#2C3E50` (`GRAPHITE`) — textos, no lugar do preto puro

## Reconhecimento automático de cliente recorrente

Ao digitar o telefone no checkout e sair do campo, o app busca no banco e,
se encontrar, pré-preenche nome, endereço, complemento, bairro e cidade.

## Cálculo de frete por distância

O checkout calcula automaticamente o valor da entrega com base na distância
em linha reta entre a loja e o endereço do cliente (Nominatim/OpenStreetMap
+ fórmula de Haversine, sem custo).

Antes de usar em produção, configure em `src/lib/frete.js`:

1. `LOJA_LATITUDE` e `LOJA_LONGITUDE` — a localização real da Kilimp.
2. `FAIXAS_FRETE` — a tabela de preço por faixa de distância.

Se o endereço não for encontrado automaticamente, o cliente pode optar por
"Combinar na entrega".

## Reimpressão e ficha de cliente

No painel admin, aba **Pedidos**, cada pedido tem um botão **"Reimprimir"**.
Na aba **Clientes**, cada cliente tem **"Consultar / imprimir ficha"**.

## Estrutura de pastas

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
    HomeView.jsx         → página institucional de recepção
    CarrinhoView.jsx    → carrinho de compras
    CheckoutView.jsx    → dados de entrega, pagamento, troco
    ReciboView.jsx       → comprovante + botão de imprimir/WhatsApp
    ReciboModal.jsx      → reimpressão de pedido (painel admin)
    ClienteModal.jsx     → ficha do cliente (painel admin)
    AdminLoginView.jsx  → login do painel
    AdminView.jsx       → painel: pedidos, produtos, clientes, relatório
    ProductForm.jsx     → cadastro/edição de produto com foto
  components/
    Common.jsx           → peças visuais reaproveitadas (logo, botões, cards, etc.)
    ContactFooter.jsx    → rodapé de contato (loja)
  App.jsx                → tela principal, navegação entre as views
  main.jsx                → ponto de entrada do React
supabase_setup.sql        → script completo para colar no SQL Editor do Supabase
.env.example               → modelo das variáveis de ambiente necessárias
```

## O que ainda depende de uma etapa futura

- **Impressão térmica automática**: `enviarParaImpressora` em
  `src/lib/utils.js` já monta o comando ESC/POS, mas só simula o envio
  (loga no console). Falta o agente local de impressão rodando no
  computador da loja.
- **Pix automático (Mercado Pago)**: hoje o Pix é combinado na entrega.
  Automatizar exige uma Edge Function no Supabase.
- **WhatsApp 100% automático**: hoje o botão "Imprimir e avisar loja" abre
  o WhatsApp com a mensagem pronta, mas alguém precisa clicar em enviar.
- **Nota fiscal eletrônica (NF-e)**: em avaliação — ver conversa em andamento
  sobre integração com provedor de emissão (Focus NFe / PlugNotas).
