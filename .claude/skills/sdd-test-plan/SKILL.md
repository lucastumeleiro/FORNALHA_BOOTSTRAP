---
name: sdd-test-plan
description: Padrão de TEST.md (Fase 6a do SDD) — plano de teste de mesa manual baseado em TASK + PLAN aprovados + feature implementada. Use ao gerar TEST.md, ao invocar via command `/test-plan`. Sub-skill de `sdd` que delega padrões para uma skill de teste de mesa do projeto (se existir).
---

# SDD — Fase 6a: TEST.md

Cria plano de testes de mesa manuais (executável por humano, via UI e, quando necessário, via cliente de API ou console/CLI).

**Output:** `tasks/<NOME>/TEST.md`

**Pré-requisito:** todos `plans/PLAN-NN-*.md` aprovados.

**Padrão detalhado de TEST.md:** invocar uma skill de teste de mesa do projeto (ex.: `teste-de-mesa`), se existir. Esta skill foca no **fluxo da fase** — os padrões concretos de ferramenta (cliente HTTP, banco, ambiente) são do projeto e devem ser preenchidos conforme ele for definido.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos adicionais: todos PLANs; `QUESTION.md` se existir — decisão da Fase 3 que mudou comportamento esperado precisa de CT que a cubra, e cenário **descartado** ali (item ❌) não vira CT
- **Identificar todos critérios de aceitação do TASK** — cada um vira pelo menos um CT
- Invocar skill de teste de mesa do projeto PRIMEIRO, se existir (padrões de estrutura)
- **Ler os modelos/entidades** que aparecerão em consultas de setup ou verificação (ex.: schema/models do banco). Fazer isso antes de escrever qualquer INSERT ou SELECT — nunca assumir colunas por convenção.
- **Pesquisar a fonte de dados do projeto (banco, API, storage)** — consultar registros já existentes (seed, ambiente de teste) para **reaproveitar cadastros** que satisfaçam as pré-condições, em vez de criar dados novos.
- **Mapear os pontos de entrada da UI** de cada CA (menu, rota, página, campos) — necessário para escrever passos de UI precisos. Ler a página/rota envolvida quando houver camada visual.
- ❌ Não spawnar Explore para "ver como outros testes foram feitos"

---

## Etapa 1 — Gerar TEST.md

Seguir estrutura da skill de teste de mesa do projeto (ou, na ausência dela, a estrutura abaixo):

1. **Pré-requisitos** (ambiente, variáveis/credenciais do cliente de API usado, dados de base)
2. **Cenários de Teste** (CT-XX: happy path + edge + erros)
3. **Matriz de Rastreabilidade** (CA ↔ CT)
4. **Premissas e Incertezas**

### Dados de base — reutilizar antes de criar

- Todo dado necessário é declarado no TEST.md, mas **priorizar o reaproveitamento de cadastros existentes** (seed, registros já no ambiente de teste) em vez de inserir novos.
- A seção "Dados de Base" lista **os dois grupos**: (a) _reutilizados_ — com a **query/consulta de localização** que devolve o identificador no ambiente do testador (não fixar id); (b) _a criar_ — inserções apenas para o que não existe.
- Criar dado novo apenas quando não houver registro adequado **ou** quando o CT exigir estado controlado/isolado. Inserções continuam responsabilidade do testador se o acesso do assistente à fonte de dados for somente leitura.

### Execução — UI/UX primeiro, cliente de API como exceção

- **Todo CT deve, por padrão, ser executado pela interface (UI/UX).** Descrever com clareza: onde navegar (menu + rota), qual botão/ação, quais campos preencher e com quais valores, e o resultado visual esperado (toast, redirect, estado da lista).
- **Usar um cliente de API (Postman/Insomnia/curl/etc.) apenas quando a UI não permite** exercitar o cenário: endpoint sem tela (webhook, cron, integração/evento interno), operação não exposta na interface, injeção de payload inválido/erro inalcançável pela tela, ou verificação de contrato de API. Nesses casos, declarar a chamada no formato atual (método, URL, headers, body, status, payload).
- Cada CT declara **`Via: UI`** ou **`Via: API`** (com justificativa curta quando via API).
- Verificação de estado na fonte de dados continua via consulta somente leitura, seja a ação via UI ou via API.

---

## Regras

- **NUNCA** implementar código
- **NUNCA** alterar além de `tasks/<NOME>/TEST.md`
- **NUNCA** usar cliente de API num CT que a UI consegue exercitar — API só como exceção justificada
- **NUNCA** inserir dado novo sem antes pesquisar um cadastro reaproveitável
- CA não testável → documentar lacuna nas Incertezas e avisar

## Rastreabilidade

Cada CA do TASK → ≥1 CT na matriz. CA sem CT = lacuna a sinalizar.

---

## Ao terminar

### 1. Carimbar `test-plan: done` no `SUMARIO.md`

Com o `TEST.md` **já escrito em disco** e antes de avisar o usuário (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase test-plan --status done
```

Rodar da raiz do worktree da task. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

### 2. Avisar

Avisar usuário. Próximo: Fase 6b (`/autotest`).

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] CAs do TASK identificados
- [ ] Skill de teste de mesa do projeto invocada (se existir)
- [ ] Modelos/entidades de todas as entidades usadas em queries lidos antes de escrever qualquer INSERT/SELECT
- [ ] CTs cobrem happy path + edge + erros
- [ ] Fonte de dados pesquisada; cadastros existentes reaproveitados antes de criar novos
- [ ] Dados de Base declaram reutilizados (query de localização) e a criar (INSERT)
- [ ] CTs priorizam UI (rota + campos + resultado visual); cliente de API só onde a UI não alcança, com justificativa
- [ ] Matriz CA ↔ CT completa
- [ ] `test-plan: done` carimbado no `SUMARIO.md` com `exit 0`, depois de escrever o TEST.md e antes do gate
