---
description: Fase 3/7 SDD — questionamento crítico adversarial dos artefatos TASK + PLAN + EPIC, discussão item por item e registro das decisões em QUESTION.md
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /question — Fase 3/7 do Spec Driven Development

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

Confirmar que `tasks/<NOME>/plans/` (com ao menos um PLAN) e `tasks/<NOME>/MEMORY.md` existem. Se faltar algum, parar e avisar.
TASK.md é sempre a fonte de verdade.

## Execução

1. Invocar skill `sdd-question` para o método de questionamento
2. **Etapa 0** — carregar contexto completo + investigar código real (leituras cirúrgicas nos arquivos que os PLANs tocam)
3. **Etapa 1 — Crítica:** atacar em **6 frentes** (skill detalha cada uma), numerando **todos** os itens no padrão `QN.M` (`N` = frente 1-6, `M` = item dentro da frente). Sem limite de itens por frente; frente vazia é declarada e não renumerada
4. **Etapa 2 — Discussão:** conduzir a discussão item por item com o usuário até todo `QN.M` ter desfecho (aceito / rejeitado / incerteza aberta). **Nenhum arquivo é escrito aqui**
5. **Etapa 3 — Escrita:** ao fechar a discussão, **solicitar ativamente** a aplicação — listando arquivo por arquivo o que muda e os IDs de origem. Só após aprovação do usuário:
   - criar `tasks/<NOME>/QUESTION.md` (Resumo + Decisões + Incertezas abertas + Alterações aplicadas)
   - aplicar os ajustes acordados em `TASK.md` e `plans/PLAN-NN-*.md`

Escrita permitida **somente** dentro de `tasks/<NOME>/` e **somente** na Etapa 3 aprovada — nunca código de produção, nunca antes da aprovação.

Ao terminar, avisar o usuário para revisar `QUESTION.md` e os artefatos ajustados antes de avançar pra `/feature`.
