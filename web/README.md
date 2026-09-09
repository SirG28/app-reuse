# ReUse! Web

Plataforma web da **ReUse!**, construída em **Next.js (App Router)** com **Prisma ORM** e **PostgreSQL**. É uma via de acesso adicional ao [app mobile](../README.md) (React Native/Expo), cobrindo o núcleo de autenticação e publicação/listagem de itens — não uma cópia integral do app.

O visual (cores, tipografia, componentes) foi recriado a partir dos mesmos tokens usados no mobile (`constants/theme.ts` e os `StyleSheet` de `app/*.tsx`), para manter a identidade da marca consistente entre as duas plataformas.

---

## Telas

| Tela | Rota | Objetivo |
|---|---|---|
| Login | `/login` | Autenticação por e-mail/senha, com "lembrar de mim" |
| Cadastro | `/register` | Criação de conta, com autopreenchimento de cidade/estado via ViaCEP a partir do CEP |
| Home / Feed | `/home` | Resumo do usuário (itens publicados, XP) e feed de itens de outros usuários disponíveis para troca |
| Publicar Item | `/items/new` | Formulário para publicar um novo item para troca (com categoria) |
| Ver Todos os Itens | `/items` | Marketplace: todos os itens de outros usuários, com chips de categoria pra filtrar (`?categoria=...`) |
| Perfil | `/profile` | Estilo Instagram: avatar, stats (itens/XP), botão "Editar perfil" e a grade dos próprios itens publicados logo abaixo — não existe mais uma tela separada "Meus Itens" |
| Configurações | `/settings` | Dados da conta (e-mail, cidade, sessão) e "Sair da conta" — acessível pelo ícone de engrenagem no Perfil |
| Dicas Sustentáveis | `/tips` | Lista de notícias/artigos sobre sustentabilidade e reuso, consumidos de uma fonte externa |
| Detalhe do Item | `/items/[id]` | Dados completos do item + comentários entre usuários (API Route + SWR). Se o item for seu, mostra um painel de editar/excluir (com troca de foto) no lugar dos dados de contato |

`/login`, `/register` e `/` são públicas; as demais exigem sessão válida (redirecionam para `/login` caso contrário).

---

## Prisma nas telas

| Tela | Uso do Prisma |
|---|---|
| Cadastro | `prisma.user.create` (com senha já hasheada via bcrypt) após checar duplicidade de e-mail com `prisma.user.findUnique` |
| Login | `prisma.user.findUnique` por e-mail + `prisma.session.create` (sessão no banco, referenciada por cookie `httpOnly`) |
| Home/Feed | `prisma.item.findMany` (itens de outros usuários, mais recentes primeiro) + `prisma.item.count` (itens do próprio usuário, usado no card de resumo) |
| Publicar Item | `prisma.item.create` vinculado ao usuário da sessão, incluindo `categoria` |
| Ver Todos os Itens | `prisma.item.findMany` filtrando por `categoria` via query string (`?categoria=...`), excluindo os itens do próprio usuário |
| Perfil | `prisma.item.findMany` (itens do próprio usuário, exibidos na grade) + `prisma.user.update` via `updateProfileAction` (editar nome/CEP/cidade/estado) |
| Configurações | Leitura do usuário via sessão (`prisma.session.findUnique` com `include: { user: true }`) |
| Detalhe do Item | `prisma.item.findUnique` (dados do item) + `prisma.comment.findMany`/`prisma.comment.create` via API Route (`/api/items/[id]/comments`), consumida no cliente com SWR. Se o item pertence ao usuário da sessão (`item.userId === user.id`), também expõe `prisma.item.update` / `prisma.item.delete` (edição, incluindo foto, e exclusão) |
| Logout | `prisma.session.deleteMany` (invalida a sessão no banco) |

---

## Banco de dados (Postgres via Prisma) — `prisma/schema.prisma`

| Tabela | Campos principais | Objetivo |
|---|---|---|
| `User` | name, email (único), passwordHash, cep, cidade, estado | Conta do usuário. Espelha o tipo `User` do mobile, mas com senha hasheada (o mobile grava em texto puro no MockAPI, uma limitação documentada no README raiz) |
| `Item` | titulo, descricao, troca, categoria, imagem, whatsapp, userId | Item publicado para troca. Espelha o tipo `Item` do mobile. `categoria` é um enum Prisma (`Categoria`, `@default(OUTROS)`) — 9 categorias fixas + "Outros" |
| `Session` | token (único), userId, expiresAt | Sessão de autenticação da web. O mobile guarda sessão local via AsyncStorage; na web isso não é seguro, então o estado de login é validado no servidor a cada requisição via esta tabela + cookie `httpOnly` |
| `Comment` | conteudo, itemId, userId, createdAt, parentId | Comentário de um usuário logado em um item publicado (área nova da Fase 6, detalhe do item). `parentId` (auto-relação) marca uma resposta a outro comentário — um nível só de profundidade |

---

## Fase 6 — Detalhe do item + comentários (em desenvolvimento)

Nova área da plataforma, construída para aplicar os conceitos de Next.js estudados nesta fase: geração estática incremental (SSG/ISG), API Routes e cache/streaming no cliente com SWR.

**Objetivo:** dar a cada item publicado uma página própria (`/items/[id]`), visível apenas para usuários logados, onde é possível comentar sobre o item (perguntar disponibilidade, propor trocas etc.). Hoje a plataforma não tem nenhuma forma de interação além de listar, editar e excluir itens — essa é a lacuna que a área resolve.

### Fases de implementação

- [x] **Fase 1 — Banco de dados**: novo model `Comment` no Prisma (`conteudo`, `createdAt`, relações com `Item` e `User`, `onDelete: Cascade`) + migration `add_comment_model` aplicada no Neon.
- [x] **Fase 2 — Página de detalhe do item**: rota `(protected)/items/[id]/page.tsx` com `generateMetadata` dinâmico (título/descrição por item) e `loading.tsx` (Skeleton); link a partir do `ItemCard` na Home. Como a rota vive sob `(protected)`, que valida a sessão via cookie a cada requisição, ela é renderizada dinamicamente (igual `/home` e `/items/mine`) — SSG "de build" não se aplica a conteúdo logado; o cache/streaming (o outro pilar dos capítulos 2/4) fica por conta do SWR na Fase 4.
- [x] **Fase 3 — API Route de comentários**: `app/api/items/[id]/comments/route.ts` com `GET` (listar, mais antigos primeiro) e `POST` (criar), validando a sessão via `getSession` (401 sem sessão, 400 sem conteúdo, 404 item inexistente).
- [x] **Fase 4 — Componente de comentários**: `ItemComments.tsx` (client component) consumindo a API com `useSWR`, formulário com `react-hook-form`, atualização otimista via `mutate` (novo comentário aparece na hora, sem reload).
- [x] **Refinamento pós-Fase 4**: "Meus Itens" virou só listagem (cards linkando para o detalhe); editar/excluir migrou para `/items/[id]`, exibido apenas quando `item.userId === user.id` (`ItemOwnerPanel.tsx`), incluindo troca de foto (função `comprimirImagem` compartilhada com o formulário de publicação).
- [x] **Refinamento — respostas a comentários**: `Comment` ganhou auto-relação (`parentId`/`replies`); a API retorna comentários de topo já com suas respostas aninhadas. Qualquer usuário logado pode responder a um comentário existente, mas o dono do item não vê a caixa de "novo comentário" no próprio item — só pode responder ao que terceiros escreveram (`ItemComments.tsx`, prop `isOwner`).
- [x] **Refinamento — Perfil estilo Instagram**: `/profile` passou a mostrar a grade dos próprios itens direto na tela (cards no mesmo estilo/tamanho fixo do `ItemCard` da Home — 170×210px tanto lá quanto no Perfil), com "Editar perfil" (novo `updateProfileAction`, reaproveitando a busca de CEP do cadastro via hook `useCepLookup`) e um ícone de configurações levando à nova tela `/settings` (dados de conta + logout). A antiga rota `/items/mine` foi removida; tudo que apontava pra ela agora aponta pra `/profile`.
- [x] **Refinamento — títulos e layout do Perfil**: o cabeçalho de `/profile` virou um rótulo fixo ("Meu Perfil"), já que o nome da pessoa saiu de lá e passou a fazer parte do bloco de informações ao lado da foto (nome, cidade/estado, itens e XP juntos, aproveitando melhor o espaço horizontal em vez de ficarem espalhados).
- [x] **Refinamento — marketplace por categorias**: `Item` ganhou um campo `categoria` (enum Prisma, 9 categorias fixas + "Outros" como padrão para os itens já existentes); nova página `/items` ("Ver todos", antes um link morto na Home) com chips de categoria pra filtrar via query string; `ItemCard` passou a exibir um badge da categoria em todo lugar onde aparece (Home, Perfil, `/items`). **Decisão de produto:** categoria é só filtro de navegação — trocas continuam livres entre categorias (o campo `troca` já é texto livre hoje, e restringir por categoria pioraria o problema clássico do escambo, a "dupla coincidência de desejos", sem necessidade real).
- [x] **Fase 5 — Deploy**: script `prebuild` (`prisma migrate deploy && prisma generate`) adicionado ao `package.json`. Sem ele, a Vercel cacheia `node_modules` entre deploys e o Prisma Client pode ficar desatualizado em relação ao `schema.prisma` (foi exatamente o que quebrou o build depois que os models `Comment` e o enum `Categoria` foram adicionados — `npm run build` local confirmou a correção, gerando todas as rotas sem erro de TypeScript).
- [ ] **Fase 6 — Entrega**: PDF com descritivo da área, link do repositório público e link de produção.

Cada fase é implementada e validada antes de avançar para a próxima.

---

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** (tokens de cor/tipografia em `src/app/globals.css`, extraídos do mobile)
- **Prisma ORM 6** + **PostgreSQL**
- **bcryptjs** para hash de senha
- Autenticação própria (sem biblioteca externa): sessão em cookie `httpOnly` referenciando a tabela `Session`
- **SWR** (cache/streaming de dados no cliente) + **React Hook Form** (formulário de comentários) — usados na área de comentários do item

---

## Como rodar

O desenvolvimento e os testes deste projeto foram feitos com Postgres na nuvem via **[Neon](https://neon.tech)**. O `docker-compose.yml` do repositório sobe um Postgres local equivalente, como alternativa para quem não quiser criar uma conta no Neon (ex.: para rodar/avaliar o projeto sem depender de um banco externo).

### Pré-requisitos

- Node.js 20.9+
- Uma instância Postgres — via [Neon](https://neon.tech) (gratuito, usado no desenvolvimento) **ou** Docker (para rodar localmente)

### Passo a passo

```bash
# 1. Entrar na pasta do projeto web
cd web

# 2. Instalar dependências
npm install

# 3. Banco de dados — escolha uma opção:
#    a) Neon: crie um projeto em neon.tech e copie as duas connection
#       strings (a com "-pooler" e a direta, sem pooler)
#    b) Postgres local via Docker:
docker compose up -d

# 4. Copiar o .env de exemplo e preencher DATABASE_URL/DIRECT_URL.
#    O .env.example já vem no formato do Neon; se for usar Docker local,
#    use as linhas comentadas com localhost:5432 no lugar.
cp .env.example .env

# 5. Rodar a primeira migration (cria as tabelas User/Item/Session)
npx prisma migrate dev --name init

# 6. Popular o banco com dados de demonstração (2 usuários + itens)
npx prisma db seed

# 7. Rodar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Login de teste (criado pelo seed)

- `ana@reuse.com` / senha `reuse123`
- `bruno@reuse.com` / senha `reuse123`

Cada uma tem itens publicados visíveis no feed da outra.

### Inspecionar o banco

```bash
npx prisma studio
```

