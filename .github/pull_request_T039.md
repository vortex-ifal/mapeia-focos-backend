## 📌 Resumo da PR

Adiciona um endpoint para o aplicativo do agente consultar as ocorrências atribuídas a ele. A resposta inclui os dados da ocorrência, como endereço, coordenadas, descrição, status e prioridade, ordenados por prioridade e data.

---

## 🛠️ Alterações Feitas

### 1. Banco de Dados e Migrações (Drizzle ORM)
- Não foram feitas alterações no banco de dados nem criadas migrations.
- A consulta utiliza as tabelas `assignments`, `occurrences` e `occurrence_statuses` já existentes.

### 2. Domínio e Entidades (`src/entities/`)
- Não foi necessário criar ou alterar entidades de domínio.

### 3. DTOs e Swagger (`src/dtos/`)
- Criado `AgentIdParamDto` para validar o UUID do agente informado na rota.
- Documentados no Swagger o endpoint, o parâmetro e as respostas esperadas.

### 4. Mappers e Repositórios (`src/mappers/` & `src/repositories/`)
- Adicionada consulta ao repositório de ocorrências para buscar as ocorrências atribuídas ao agente.
- A consulta considera a atribuição mais recente de cada ocorrência, para que uma atribuição antiga não faça a ocorrência aparecer na lista de outro agente.
- São retornadas somente ocorrências ativas. Ocorrências com status `resolved` ou `rejected` são excluídas.
- A resposta é ordenada por prioridade (`high`, `medium`, `low`; sem prioridade por último) e, em caso de empate, pelas ocorrências mais antigas primeiro.

### 5. Serviços e Controllers (`src/services/` & `src/controllers/`)
- Criado o endpoint `GET /api/occurrences/agent/:agentId`.
- O serviço verifica se o usuário existe, está ativo e possui perfil `agent`.
- Um agente válido recebe suas ocorrências atribuídas. Usuário inexistente, inativo ou que não seja agente recebe `403 Forbidden`.
- Os itens da resposta usam o DTO de ocorrência existente, incluindo endereço, latitude, longitude, descrição, status e prioridade.

---

## 💡 Decisões Tomadas

1. A consulta considera apenas a atribuição mais recente por ocorrência, evitando exibir a mesma tarefa para um agente que já não seja seu responsável atual.
2. Como o projeto ainda não possui autenticação, o endpoint recebe o `agentId` pela URL. A API valida que o ID corresponde a um agente ativo, mas ainda não verifica se quem fez a requisição é esse agente.
3. O acesso por setor não foi implementado. Atualmente, o modelo não relaciona ocorrências a setores; o endpoint retorna somente ocorrências atribuídas diretamente ao agente.

---
Banco de dados:

Não há migrations novas para esta alteração.
O banco precisa ter a migration da tabela assignments já aplicada.
Para receber ocorrências na resposta, deve haver um agente ativo com perfil agent e ocorrências ativas atribuídas a ele.
Requisição no Insomnia:

Método: GET

URL: http://localhost:8000/api/occurrences/agent/01a1427d-cf34-7f7d-9662-87d1921be41a


Body: nenhum

Autenticação: nenhuma na implementação atual

Envie a requisição. Com ocorrências atribuídas ao agente, a resposta esperada é 200 OK, com um array semelhante a:

[
  {
    "id": "uuid-da-ocorrencia",
    "protocol": "a1b2c",
    "address": "Rua de Exemplo, 123, Centro",
    "description": "Recipientes com água parada no local.",
    "situationType": "Lote vago",
    "latitude": -9.751234,
    "longitude": -36.661234,
    "createdAt": "2026-11-05T13:00:00.000Z",
    "updatedAt": "2026-11-05T13:10:00.000Z",
    "status": {
      "key": "forwarded_for_inspection",
      "name": "Encaminhada para Vistoria"
    },
    "priority": "high"
  }
]

Cenários adicionais:

Agente válido sem ocorrências atribuídas: 200 OK com [].
ID malformado, como abc: 400 Bad Request.
UUID válido de usuário inexistente, inativo ou que não seja agente: 403 Forbidden.
Ocorrências resolvidas (resolved) ou descartadas (rejected): não devem aparecer.
Com prioridades diferentes, conferir que a ordem é high, medium, low e, por fim, sem prioridade. Ocorrências com a mesma prioridade aparecem da mais antiga para a mais recente.