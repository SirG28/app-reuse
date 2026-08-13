# 🌐 ReUse! Web

Plataforma web da **ReUse!**, construída em **Next.js (App Router)** com **Prisma ORM** e **PostgreSQL**. É uma via de acesso adicional ao [app mobile](../README.md) (React Native/Expo), cobrindo o núcleo de autenticação e publicação/listagem de itens — não uma cópia integral do app.

O visual (cores, tipografia, componentes) foi recriado a partir dos mesmos tokens usados no mobile (`constants/theme.ts` e os `StyleSheet` de `app/*.tsx`), para manter a identidade da marca consistente entre as duas plataformas.

---

## 🖥️ Telas

| Tela | Rota | Objetivo |
|---|---|---|
| Login | `/login` | Autenticação por e-mail/senha, com "lembrar de mim" |
| Cadastro | `/register` | Criação de conta, com autopreenchimento de cidade/estado via ViaCEP a partir do CEP |
| Home / Feed | `/home` | Resumo do usuário (itens publicados, XP) e feed de itens de outros usuários disponíveis para troca |
| Publicar Item | `/items/new` | Formulário para publicar um novo item para troca |
| Perfil | `/profile` | Dados da conta autenticada e logout |

`/login`, `/register` e `/` são públicas; as demais exigem sessão válida (redirecionam para `/login` caso contrário).

---

## 🧩 Prisma nas telas

| Tela | Uso do Prisma |
|---|---|
| Cadastro | `prisma.user.create` (com senha já hasheada via bcrypt) após checar duplicidade de e-mail com `prisma.user.findUnique` |
| Login | `prisma.user.findUnique` por e-mail + `prisma.session.create` (sessão no banco, referenciada por cookie `httpOnly`) |
| Home/Feed | `prisma.item.findMany` (itens de outros usuários, mais recentes primeiro) + `prisma.item.count` (itens do próprio usuário, usado no card de resumo) |
| Publicar Item | `prisma.item.create` vinculado ao usuário da sessão |
| Perfil | Leitura do usuário via sessão (`prisma.session.findUnique` com `include: { user: true }`) |
| Logout | `prisma.session.deleteMany` (invalida a sessão no banco) |

---

## 🗄️ Banco de dados (Postgres via Prisma) — `prisma/schema.prisma`

| Tabela | Campos principais | Objetivo |
|---|---|---|
| `User` | name, email (único), passwordHash, cep, cidade, estado | Conta do usuário. Espelha o tipo `User` do mobile, mas com senha hasheada (o mobile grava em texto puro no MockAPI, uma limitação documentada no README raiz) |
| `Item` | titulo, descricao, troca, imagem, whatsapp, userId | Item publicado para troca. Espelha o tipo `Item` do mobile |
| `Session` | token (único), userId, expiresAt | Sessão de autenticação da web. O mobile guarda sessão local via AsyncStorage; na web isso não é seguro, então o estado de login é validado no servidor a cada requisição via esta tabela + cookie `httpOnly` |

---

## ⚙️ Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** (tokens de cor/tipografia em `src/app/globals.css`, extraídos do mobile)
- **Prisma ORM 6** + **PostgreSQL**
- **bcryptjs** para hash de senha
- Autenticação própria (sem biblioteca externa): sessão em cookie `httpOnly` referenciando a tabela `Session`

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 20.9+
- Docker (para o Postgres local)

### Passo a passo

```bash
# 1. Entrar na pasta do projeto web
cd web

# 2. Instalar dependências
npm install

# 3. Subir o Postgres local
docker compose up -d

# 4. Copiar o .env de exemplo (já aponta pro Postgres do docker-compose acima)
cp .env.example .env

# 5. Rodar a primeira migration (cria as tabelas User/Item/Session)
npx prisma migrate dev --name init

# 6. Popular o banco com dados de demonstração (2 usuários + itens)
npx prisma db seed

# 7. Rodar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### 🔑 Login de teste (criado pelo seed)

- `ana@reuse.com` / senha `reuse123`
- `bruno@reuse.com` / senha `reuse123`

Cada uma tem itens publicados visíveis no feed da outra.

### 🔍 Inspecionar o banco

```bash
npx prisma studio
```

---

## 📌 Fora do escopo desta fase

As telas **Dicas Sustentáveis** e **Meus Itens** do mobile não foram replicadas na web — o foco foi o núcleo de autenticação + CRUD de itens, que já cobre os 3 critérios de avaliação (NextJS, Prisma ORM e banco de dados) sem duplicar o app inteiro.
