## ✅ Como Testar no Insomnia

1. **Pré-requisitos:** confirme que a API está em execução e que o `.env` contém o município atendido, por exemplo:

   ```env
   MUNICIPALITY_NAME=ARAPIRACA
   ```

   Os agentes que devem aparecer precisam estar ativos, ter o perfil `agent` e estar associados a esse município no banco.

2. **Criar a requisição no Insomnia:**
   - Método: `GET`
   - URL:

     ```http
     http://localhost:8000/api/users/agentes
     ```

   - Body: nenhum
   - Autenticação: não necessária na configuração atual

3. **Enviar e conferir a resposta:** o resultado esperado é `200 OK`, com uma lista de agentes no formato:

   ```json
   [
     {
       "agentId": "01a1427d-cf34-7f7d-9662-87d1921be41a",
       "name": "Agente de Endemias",
       "sectorRegion": "Centro",
       "totalActiveTasks": 2
     }
   ]
   ```

4. **Validar os dados retornados:**
   - Cada agente deve ter `agentId`, `name`, `sectorRegion` e `totalActiveTasks`.
   - Agentes sem ocorrências em andamento devem retornar `totalActiveTasks: 0`.
   - A contagem considera ocorrências ativas no status `forwarded_for_inspection`; ocorrências resolvidas ou descartadas não entram na contagem.
   - A lista deve incluir somente agentes ativos associados ao município configurado.

Se a resposta for `[]`, confira se há agentes ativos com perfil `agent` e se o campo `municipality` deles corresponde ao valor de `MUNICIPALITY_NAME`.