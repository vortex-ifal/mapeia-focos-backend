<!--
  📌 Convenção para o Título da PR (estritamente em Inglês):
  <tipo>(<escopo>): <descrição sucinta em inglês> (#TXXX)

  Exemplos:
  - feat(occurrences): add priority column and update endpoint (#T034)
  - feat(occurrences): add update occurrence status route and status history tracking (#T030)
  - refactor(occurrences): embed media in occurrence entity and remove redundant read models
-->

## 📌 Resumo da PR
<!--
  Breve descrição contextualizando o objetivo da PR, a necessidade de negócio e o card/issue correspondente (ex.: Card #T034).
-->

---

## 🛠️ Alterações Feitas

<!--
  Descreva as alterações agrupadas pelas camadas afetadas da Clean Architecture / MVC:
-->

### 1. Banco de Dados e Migrações (Drizzle ORM)
- 

### 2. Domínio e Entidades (`src/entities/`)
- 

### 3. DTOs e Swagger (`src/dtos/`)
- 

### 4. Mappers e Repositórios (`src/mappers/` & `src/repositories/`)
- 

### 5. Serviços e Controllers (`src/services/` & `src/controllers/`)
- 

---

## 💡 Decisões Tomadas
<!--
  Justifique decisões técnicas e arquiteturais relevantes (ex.: enum vs tabela relacional, semântica de status HTTP como 204/404/409, otimizações de query, modelagens no domínio).
-->
1. 
2. 

---

## ✅ Como Testar

1. **Validação Estática e Build:**
   ```bash
   pnpm lint
   pnpm build
   ```

2. **Banco de Dados (caso haja migrations/seeds):**
   ```bash
   pnpm db:migrate
   ```

3. **Exemplo de Chamada HTTP / Cenários Validados:**
   ```bash
   # Exemplo de payload ou comando curl
   ```

---

## 📋 Checklist de Qualidade
- [ ] O título da PR segue a convenção convencional em **Inglês** (`feat(...)`, `fix(...)`, etc.).
- [ ] O código-fonte (classes, métodos, variáveis, rotas) está estritamente em **Inglês**.
- [ ] A documentação Swagger e mensagens de erro de entrada estão estritamente em **Português (PT-BR)**.
- [ ] Todos os novos diretórios/subpastas possuem seus respectivos `index.ts` (*barrel exports*).
- [ ] `pnpm lint` e `pnpm build` executados sem erros.
