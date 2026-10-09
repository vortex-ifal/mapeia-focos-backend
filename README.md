# Mapeia Focos — Backend

Backend da plataforma **Mapeia Focos**, desenvolvida para mapeamento e gestão de focos de dengue e zoonoses, oferecendo suporte para cidadãos, agentes de campo e gestores públicos.

---

## 🛠️ Stack Tecnológica

- **Runtime & Linguagem:** [Node.js](https://nodejs.org/) (>= 24.0.0) com [TypeScript](https://www.typescriptlang.org/)
- **Framework Web:** [NestJS](https://nestjs.com/) v12
- **ORM & Migrations:** [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) (via Docker)
- **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/) (>= 12.0.0)
- **Validação:** [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Linter & Formatador:** [Oxlint](https://oxc.rs/) & [Prettier](https://prettier.io/)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (>= 24.0.0)
- [pnpm](https://pnpm.io/) (>= 12.0.0)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### 1. Clonar e Instalar Dependências

```bash
# Clone o repositório
git clone https://github.com/vortex-ifal/mapeia-focos-backend.git
cd mapeia-focos-banckend

# Instale as dependências
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto a partir do modelo [.env.example](file://.env.example):

```bash
cp .env.example .env
```

Ajuste as variáveis no `.env` se necessário:
```env
# POSTGRES
POSTGRES_USER=mapeia_focos
POSTGRES_PASSWORD=12345678
POSTGRES_DB=mapeia_focos
POSTGRES_PORT=5432

# APP
PORT=8000
DATABASE_URL=postgresql://mapeia_focos:12345678@localhost:5432/mapeia_focos
```

### 3. Subir o Banco de Dados

Suba o container do PostgreSQL em background:

```bash
pnpm db:up
```

### 4. Gerenciar e Executar Migrações do Banco

Para criar novas migrações a partir de alterações nos schemas:

```bash
# Formato padrão (sempre use a flag --name com nome descritivo em snake_case):
pnpm db:generate --name <nome_da_migration>

# Exemplo:
pnpm db:generate --name create_occurrences_table
```

> **Boas Práticas para Migrations:**
> - **Sempre forneça um nome explícito com `--name`:** Evite nomes genéricos ou hashes automáticos. O nome deve descrever com clareza o que a migração altera no banco (ex: `create_users_table`, `add_status_to_occurrences`, `create_locations_table`).
> - **Migrações Atômicas e Focadas:** Agrupe mudanças relacionadas na mesma migration (ex: criação de uma tabela e seus índices/chaves estrangeiras), evitando misturar alterações de múltiplos domínios não correlatos.
> - **Verifique o SQL gerado:** Sempre revise o arquivo `.sql` gerado dentro da pasta `drizzle/` antes de aplicar em outros ambientes.

Aplique os schemas e migrações no banco de dados via Drizzle:

```bash
# Aplicar migrações pendentes
pnpm db:migrate

# Ou para sincronização direta em desenvolvimento local:
pnpm db:push
```

*(Opcional)* Para abrir a interface visual do Drizzle Studio:
```bash
pnpm db:studio
```

### 5. Iniciar a Aplicação

```bash
# Modo de desenvolvimento com hot-reload
pnpm dev

# Modo de produção
pnpm build
pnpm prod
```

O servidor estará disponível por padrão em `http://localhost:8000/api`.

---

## 📜 Scripts Disponíveis

| Script | Descrição |
| --- | --- |
| `pnpm dev` | Inicia o servidor em modo de desenvolvimento (watch mode) |
| `pnpm build` | Compila o projeto TypeScript para JavaScript (`dist/`) |
| `pnpm prod` | Executa a build de produção compilada |
| `pnpm lint` | Executa o Oxlint com validação de tipos |
| `pnpm format` | Formata o código com Prettier |
| `pnpm db:up` | Sobe o container PostgreSQL via Docker Compose |
| `pnpm db:generate --name <nome_da_migration>` | Gera novos arquivos de migração com Drizzle Kit |
| `pnpm db:migrate` | Executa migrações pendentes no banco |
| `pnpm db:push` | Sincroniza o schema diretamente com o banco de dados |
| `pnpm db:studio` | Inicia a interface visual do Drizzle Studio |

---

## 📚 Documentação do Projeto

Para consultar a modelagem de dados, arquitetura e padrões adotados no projeto, veja os documentos dedicados:

- **[Diagrama Entidade-Relacionamento (DER)](./docs/diagrams/der-mapeia-focos.md)**: Modelagem oficial do banco de dados (tabelas, colunas, enums e relacionamentos).
- **[Diretrizes e Padrões do Backend (AGENTS.md)](./AGENTS.md)**: Regras de Clean Architecture + MVC, organização de camadas (`controllers`, `services`, `entities`, `mappers`, `repositories`), regras de negócio e barrel exports (`index.ts`).
