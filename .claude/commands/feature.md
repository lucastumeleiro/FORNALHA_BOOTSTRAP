---
description: Fase 4/7 SDD — orquestra time de agentes Claude paralelos por PLAN seguindo grafo de dependências
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /feature — Fase 4/7 do Spec Driven Development

## Detecção da task

Se `$ARGUMENTS` foi fornecido, usar como `<NOME>`.

Se não foi fornecido:

1. Detectar branch atual
2. Se branch tem padrão de ticket (ex.: `feature/TASK-123`), extrair e perguntar:
   ```
   Detectei `TASK-123` na branch atual. É essa a task?
   [s] sim
   [n] informar outra
   ```
3. Senão, perguntar: `Qual identificador da task?`

Confirmar que `tasks/<NOME>/plans/` existe com ao menos um PLAN e que `tasks/<NOME>/MEMORY.md` existe. Se faltar algum, parar e avisar (rodar fases anteriores).
TASK.md é sempre a fonte de verdade.

## Execução

1. Invocar skill `sdd-feature` para regras de orquestração e template de prompt dos agentes
2. Etapa 0: ler todos os PLANs em `tasks/<NOME>/plans/` + TASK + MEMORY.md + QUESTION.md (se existir — decisões `QN.M` da Fase 3 e incertezas abertas a resolver nesta fase). Se o `QUESTION.md` diz `**Estado:** aguardando respostas`, a Fase 3 não fechou: **avisar a pessoa e perguntar** se prossegue mesmo assim; `Sugestão` nunca é decisão
3. Etapa 1: construir grafo de dependências e agrupar em ondas (sequenciais); dentro de cada onda, PLANs sem dependência mútua rodam em paralelo
4. Para cada onda (executar ondas em sequência — onda N só inicia após onda N-1 completa):
   - Atualizar MEMORY.md (marcar PLANs como 🔄 Em execução)
   - Lançar **todos os agentes da onda em uma única mensagem** via Agent tool — um agente por PLAN, todos em paralelo real, com `subagent_type` conforme o domínio do PLAN (`frontend-agent`, ver skill `sdd-feature`)
   - Aguardar conclusão de todos os agentes da onda
   - Atualizar MEMORY.md (✅ Concluído / ❌ Bloqueado + contratos exportados + bloqueios)
   - Verificar bloqueios — se houver, **parar e avisar** antes de avançar
5. Agentes de ondas posteriores lêem MEMORY.md para consumir contratos de ondas anteriores

Ao terminar, apresentar relatório final: arquivos por PLAN, ondas executadas, desvios.

Próximo passo: `/review-feature` para a auditoria de regras (gera `REVIEW.md`) e o ciclo de correções. Depois, `/test-plan` para gerar TEST.md e `/autotest` para os testes automatizados.
