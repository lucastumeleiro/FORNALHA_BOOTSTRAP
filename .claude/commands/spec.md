---
description: Fase 1/7 SDD — enriquece TASK.md com investigação técnica via task-analyst
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /spec — Fase 1/7 do Spec Driven Development

## Detecção da task

Se `$ARGUMENTS` foi fornecido, usar como `<NOME>` da task.

Se não foi fornecido:

1. Detectar branch atual (`git rev-parse --abbrev-ref HEAD`)
2. Se branch tem padrão de ticket (ex.: `feature/TASK-123`), extrair o identificador
3. Perguntar ao usuário:
   ```
   Detectei `TASK-123` na branch atual. É essa a task?
   [s] sim
   [n] informar outra
   ```
4. Se branch não tem padrão ou usuário escolher [n], perguntar: `Qual identificador da task? (ex: TASK-123)`

Confirmar que `tasks/<NOME>/TASK.md` existe antes de prosseguir. Se não existir, parar e avisar.

## Execução

1. Invocar skill `sdd-spec` para o fluxo da fase
2. Skill `sdd-spec` invoca `task-analyst` para conduzir a investigação técnica completa (4 fases: triagem → investigação → detalhamento → validação)
3. O conteúdo atual de `tasks/<NOME>/TASK.md` serve como relato de entrada para o `task-analyst`
4. Output salvo em `tasks/<NOME>/TASK.md`, **substituindo** o conteúdo anterior

Ao terminar, avisar o usuário para revisar o TASK.md enriquecido antes de avançar pra `/plan`.
