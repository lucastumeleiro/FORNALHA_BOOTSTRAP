---
description: Fase 6a/7 SDD — gera TEST.md (teste de mesa) a partir de TASK + PLAN aprovados + feature implementada (SPEC se existir)
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /test-plan — Fase 6a/7 do Spec Driven Development

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

Confirmar que `tasks/<NOME>/plans/` (com ao menos um PLAN) existe. Se não existir, parar e avisar.
TASK.md é sempre a fonte de verdade para os critérios de aceitação.

## Execução

1. Invocar skill `sdd-test-plan` para o fluxo da fase
2. Skill `sdd-test-plan` invoca a skill de teste de mesa do projeto, se existir, para padrões de estrutura
3. Seguir Etapa 0 (revisão de contexto — incluindo `QUESTION.md` se existir, para não gerar CT de cenário descartado na Fase 3 — + pesquisa de dados existentes na fonte de dados do projeto, se houver ferramenta de consulta disponível) e Etapa 1 (gerar TEST.md — CTs priorizando execução pela UI, reaproveitando cadastros existentes)
4. Output em `tasks/<NOME>/TEST.md`

Ao terminar, avisar o usuário — fase de teste de mesa concluída. Próximo passo: `/autotest`.
