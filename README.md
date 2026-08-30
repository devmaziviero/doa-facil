# Doa Fácil

Sistema web para divulgação de doações (roupas, móveis, materiais, etc.) por região. Quem tem algo para doar publica um anúncio com local de retirada; quem tem interesse entra em contato diretamente para combinar a retirada. Projeto acadêmico (faculdade) — código-fonte simples e didático de propósito.

## Stack

- **Frontend:** React + TypeScript + Vite + [Material UI](https://mui.com) (biblioteca de componentes prontos — AppBar, Card, Autocomplete, Dialog etc.)
- **Backend:** Node.js + Express + TypeScript
- **Banco de dados:** PostgreSQL (plano gratuito, ex. Supabase) acessado via `pg` (SQL puro, sem ORM) — mais fácil de ler e explicar em sala
- **Storage de imagens:** Supabase Storage (bucket público, mesmo projeto do banco)
- **Deploy:** Vercel (frontend) + Render (backend, free tier) + Supabase (banco + storage, free tier)

## No ar

- **Site:** https://doa-facil-alpha.vercel.app
- **API:** https://doa-facil-0z5o.onrender.com
- **Repositório:** https://github.com/devmaziviero/doa-facil

O backend no Render é free tier: "dorme" depois de ~15 min sem uso e demora uns 30-50s pra acordar no primeiro acesso seguinte — comportamento esperado, não é bug.

## Por que Material UI?

Biblioteca de componentes React mais usada no mercado — fácil de justificar numa apresentação acadêmica. Deu pra montar uma interface completa (cards, chips de status coloridos, autocomplete de estado/cidade, diálogo de confirmação antes de excluir) sem escrever CSS do zero. O tema (`frontend/src/theme.ts`) usa uma paleta verde inspirada no WhatsApp, com cantos arredondados. Na página de detalhe, se o contato parecer um telefone, aparece um botão "Conversar no WhatsApp" que abre `wa.me` direto (`frontend/src/whatsapp.ts`).

## Fotos da doação

Cada anúncio pode ter até **5 fotos** (campo `imagens_urls`, um array no Postgres). O upload acontece via `multipart/form-data` — o backend recebe o arquivo com `multer`, envia pro Storage do Supabase (`backend/src/storage.ts`) e guarda só a URL pública no banco. Limite de 5MB por imagem, só aceita `image/jpeg`, `image/png`, `image/webp` e `image/gif` (validado tanto no backend quanto no bucket). Na página de detalhe, a primeira foto aparece grande e as demais como miniaturas clicáveis (uma galeria simples). Na tela de gerenciar dá pra adicionar novas fotos e remover as antigas antes de salvar.

## Por que sem ORM?

Time optou por SQL puro (`db/schema.sql` + queries diretas com `pg`) em vez de Prisma/TypeORM. Menos dependências, menos "mágica" — cada query no código é a query que roda no banco, mais fácil de defender na apresentação.

## Sem login (v1) — como funciona o status da doação

O sistema **não tem cadastro/login de usuário** na v1. Cada doação, ao ser criada, recebe um **código de gerenciamento** (string curta, ex. `A3F9K2XZ`) gerado pelo servidor e mostrado **uma única vez** para quem cadastrou. Esse código funciona como uma "senha de posse" do anúncio:

- Sem o código: só é possível **ver** as doações (listar, ver detalhe, ver contato para combinar retirada).
- Com o código: dá para **editar** título, descrição e fotos, **mudar o status** (`disponível` → `reservada` → `retirada`) ou **excluir** o anúncio — tudo na página "Gerenciar", que pede só o código (nunca o id, que o usuário nunca vê).

Isso resolve "vincular a doação a alguém" sem exigir conta/senha de verdade. É um ponto de design que pode evoluir depois (ex. trocar por login real, ou vincular por telefone/e-mail com confirmação) — combinado com o usuário que fica para uma fase seguinte.

## Estrutura

```
doa-facil/
  backend/     # API Express + TypeScript
  frontend/    # React + TypeScript (Vite)
```

## Rodando localmente

### Banco de dados

1. Crie um projeto Postgres gratuito (ex. https://supabase.com).
2. Rode o conteúdo de `backend/db/schema.sql` no editor SQL do projeto (ou via `psql`) — isso cria a tabela `doacoes` **e** já configura o bucket de Storage `imagens` com as políticas públicas de leitura/upload.
3. Copie a connection string (URI, de preferência a do **Transaction pooler**, porta 6543 — a conexão direta na 5432 pode falhar em plataformas sem IPv6 como o Render).
4. Em **Project Settings → API**, copie a **URL** do projeto e a **Publishable key** (chave pública, não é segredo).

### Backend

```bash
cd backend
cp .env.example .env
# edite .env: cole a DATABASE_URL, SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY dos passos anteriores
npm install
npm run dev
```

Sobe em `http://localhost:3333`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5175` (proxy configurado para `/api` → backend local).

## Modelo de dados (v1)

Tabela única `doacoes`:

| campo | tipo | descrição |
|---|---|---|
| id | uuid | identificador |
| titulo | text | ex. "Sofá de 2 lugares" |
| descricao | text | detalhes opcionais |
| categoria | text | roupas / moveis / materiais / eletronicos / outros |
| estado | text | UF (ex. "SC"), escolhido em um select |
| cidade | text | cidade, escolhida em um select (depende do estado) |
| contato | text | telefone/whatsapp/e-mail para combinar retirada (público) |
| imagens_urls | text[] | até 5 URLs públicas de fotos (Supabase Storage) |
| status | text | disponivel / reservada / retirada |
| codigo_gerenciamento | text | código secreto, nunca retornado nas listagens |
| criado_em | timestamptz | data de criação |

**Estado e cidade não são texto livre.** O frontend preenche os selects consultando a API pública do IBGE (`servicodados.ibge.gov.br/api/v1/localidades`) — dados abertos do governo, sem chave, sem custo. Não guardamos essa lista no nosso banco: a busca acontece no navegador da pessoa, na hora de preencher o formulário. Não há nível de bairro — a granularidade da busca e do anúncio é só a cidade.

## Próximos passos (em aberto)

- Definir se o `contato` fica sempre público ou some atrás de um botão "revelar contato".
- Eventualmente avaliar login real, se o professor pedir maior controle de acesso.
- Apagar do Storage as fotos de anúncios excluídos (hoje só o registro no banco é removido; o arquivo fica órfão no bucket).
