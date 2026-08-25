# Doa Fácil

Sistema web para divulgação de doações (roupas, móveis, materiais, etc.) por região. Quem tem algo para doar publica um anúncio com local de retirada; quem tem interesse entra em contato diretamente para combinar a retirada. Projeto acadêmico (faculdade) — código-fonte simples e didático de propósito.

## Stack

- **Frontend:** React + TypeScript + Vite + [Material UI](https://mui.com) (biblioteca de componentes prontos — AppBar, Card, Autocomplete, Dialog etc.)
- **Backend:** Node.js + Express + TypeScript
- **Banco de dados:** PostgreSQL (plano gratuito, ex. Supabase) acessado via `pg` (SQL puro, sem ORM) — mais fácil de ler e explicar em sala
- **Deploy:** a definir na mesma linha dos projetos anteriores (Vercel + banco free tier)

## Por que Material UI?

Biblioteca de componentes React mais usada no mercado — fácil de justificar numa apresentação acadêmica. Deu pra montar uma interface completa (cards, chips de status coloridos, autocomplete de estado/cidade, diálogo de confirmação antes de excluir) sem escrever CSS do zero. O tema (`frontend/src/theme.ts`) usa uma paleta verde inspirada no WhatsApp, com cantos arredondados. Na página de detalhe, se o contato parecer um telefone, aparece um botão "Conversar no WhatsApp" que abre `wa.me` direto (`frontend/src/whatsapp.ts`).

## Por que sem ORM?

Time optou por SQL puro (`db/schema.sql` + queries diretas com `pg`) em vez de Prisma/TypeORM. Menos dependências, menos "mágica" — cada query no código é a query que roda no banco, mais fácil de defender na apresentação.

## Sem login (v1) — como funciona o status da doação

O sistema **não tem cadastro/login de usuário** na v1. Cada doação, ao ser criada, recebe um **código de gerenciamento** (string curta, ex. `A3F9K2XZ`) gerado pelo servidor e mostrado **uma única vez** para quem cadastrou. Esse código funciona como uma "senha de posse" do anúncio:

- Sem o código: só é possível **ver** as doações (listar, ver detalhe, ver contato para combinar retirada).
- Com o código: dá para **mudar o status** (`disponível` → `reservada` → `retirada`) ou **excluir** o anúncio.

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
2. Rode o conteúdo de `backend/db/schema.sql` no editor SQL do projeto (ou via `psql`).
3. Copie a connection string (URI) do banco.

### Backend

```bash
cd backend
cp .env.example .env
# edite .env e cole a DATABASE_URL do passo anterior
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
| status | text | disponivel / reservada / retirada |
| codigo_gerenciamento | text | código secreto, nunca retornado nas listagens |
| criado_em | timestamptz | data de criação |

**Estado e cidade não são texto livre.** O frontend preenche os selects consultando a API pública do IBGE (`servicodados.ibge.gov.br/api/v1/localidades`) — dados abertos do governo, sem chave, sem custo. Não guardamos essa lista no nosso banco: a busca acontece no navegador da pessoa, na hora de preencher o formulário. Não há nível de bairro — a granularidade da busca e do anúncio é só a cidade.

## Próximos passos (em aberto)

- Criar repositório no GitHub e configurar deploy (Vercel para o frontend; backend + banco a decidir juntos).
- Definir se o `contato` fica sempre público ou some atrás de um botão "revelar contato".
- Eventualmente avaliar login real, se o professor pedir maior controle de acesso.
