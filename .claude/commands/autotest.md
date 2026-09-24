---
description: Fase 6b/7 SDD — gera testes automatizados a partir do TEST.md + AUTOTEST.md com as decisões de classificação A/B/C
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /autotest — Fase 6b/7 do Spec Driven Development

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

Confirmar que `tasks/<NOME>/TEST.md` existe (Fase 6a concluída), que `tasks/<NOME>/MEMORY.md` existe com todos PLANs ✅ Concluído e que a feature já foi implementada (Fase 4). Se faltar algum, parar e avisar.

## Execução

1. Invocar skill `sdd-autotest` para o fluxo da fase
2. Skill `sdd-autotest` invoca a skill de teste automatizado do projeto, se existir, para padrões de código
3. Seguir Etapa 0 (carregar contexto — incluindo `QUESTION.md` se existir — + ler arquivos do PLAN + confirmar deps)
4. Classificar cada CT do TEST.md em **A** (unit), **B** (integração leve) ou **C** (não automatizar)
5. Escrever testes para A/B em arquivos de teste lado a lado com o código testado
6. Para cada **C**, rodar a autoauditoria antes de fechar (dependência injetável? mock de 1 nível? setup <30 linhas?) e justificar com **regra citada + âncora `arquivo:linha` + CT substituto do TEST.md**
7. Escrever `tasks/<NOME>/AUTOTEST.md` (Resumo + Classificação por CT + Exclusões + Rastreabilidade CA→CT→asserção + Lacunas)

Ao terminar, **NÃO executar** o comando de teste do projeto — apenas sugerir o comando ao usuário no relatório final.

Relatório em chat (compacto — o detalhe vive no `AUTOTEST.md`):

1. Arquivos criados (caminho + contagem de testes)
2. Contagem por categoria (A / B / C)
3. Exclusões (C) — CT + regra aplicada, uma linha cada
4. Sugestão de comando de teste do projeto
5. Caminho do `AUTOTEST.md`

> As exclusões (C) declaradas no `AUTOTEST.md` são **atacadas** pelo Check 6 da Fase 7. Justificativa genérica ("usa o ORM", "precisa de banco") sem âncora reprova a feature no `/verify`.

Próximo passo SDD: `/verify` (Fase 7/7) para verificação independente da cobertura, da força das asserções e das exclusões declaradas aqui.
