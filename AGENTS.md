# Diretrizes e Padrões do Backend (Mapeia Focos)

Você está trabalhando no backend do sistema **Mapeia Focos**. Siga rigorosamente as regras abaixo ao ler, refatorar ou escrever código neste repositório.

## 1. Stack e Ferramentas
- **Framework:** NestJS (Node.js) com TypeScript.
- **ORM:** Drizzle ORM integrado ao PostgreSQL.
- **Storage:** Cloudflare R2 (API S3) via `infra/storage`.
- **Cache/Sessões:** Redis via `infra/redis`.
- **Validação:** `class-validator` / `Zod` (na camada de DTOs).

## 2. Padrão Arquitetural (Clean Architecture + MVC)
A estrutura de pastas (`src/`) segue uma organização em primeiro nível rigorosa. Cada camada tem uma responsabilidade estrita:

1. **`controllers/`**: Rotas HTTP, Guards (`@Roles`, `@CurrentUser`), recepção de DTOs. **Nunca inclua regras de negócio ou chamadas ao banco aqui.**
2. **`services/`**: Orquestração de casos de uso. Recebe Entidades, aplica regras e delega a repositórios ou mappers.
3. **`entities/`**: O coração do domínio. Classes TypeScript puras, organizadas em subpastas por entidade (ex: `user/`). Cada entidade possui:
   - `*.entity.ts`: A classe de domínio sem decorators de infra.
   - `*.props.ts`: As interfaces/tipos da entidade.
   - `*.builder.ts`: Pattern Builder obrigatório para instanciar a entidade com validação.
4. **`mappers/`**: Transformação bidirecional de dados. Toda conversão passa por eles:
   - `toDomainFromDto()`: DTO -> Entity
   - `toDto()`: Entity -> DTO
   - `toPersistence()`: Entity -> Drizzle Schema Insert
   - `toDomainFromPersistence()`: Drizzle Schema Select -> Entity
5. **`repositories/`**: Isolamento das queries SQL usando Drizzle ORM.
6. **`infra/database/schema/`**: Onde os schemas do Drizzle (Tabelas do Postgres) são declarados.
7. **`modules/`**: Módulos do NestJS para agrupar Controllers, Services e Repositories (Injeção de Dependências). O `app.module.ts` deve importar os módulos dessa pasta.

## 3. Regra Mandatória: Barrel Exports (`index.ts`)
- **Toda pasta e subpasta do projeto DEVE ter um `index.ts`.**
- **Clean Imports:** Ao importar classes/tipos de outras camadas, **sempre importe da pasta**, nunca do arquivo específico.
  - ❌ Errado: `import { UserEntity } from '../entities/user/user.entity'`
  - ✅ Correto: `import { UserEntity } from '../entities'`

## 4. Regras de Negócio e Domínio (Invariantes)
- **Ocorrências Anônimas:** O atributo de anonimato do cidadão é inegociável. Ao transitar DTOs para View, certifique-se de que o Mapper remova qualquer identificação se `isAnonymous` for true.
- **Não implemente testes:** Testes não serão desenvolvidos nesta fase. Não gere ou modifique arquivos `.spec.ts` ou `.e2e-spec.ts`.

## 5. Convenções de Código
- Utilize **Inglês** para nomes de variáveis, métodos, classes e entidades (ex: `OccurrenceEntity`, `UserRepository`).
- Utilize `snake_case` para os arquivos (ex: `occurrence.entity.ts`).
- Priorize a tipagem explícita nos retornos de funções.
