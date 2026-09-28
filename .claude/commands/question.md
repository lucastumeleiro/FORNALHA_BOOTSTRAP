---
description: Fase 3/7 SDD — questionamento crítico adversarial dos artefatos TASK + PLAN + EPIC; as perguntas e as respostas vivem em QUESTION.md (arquivo ou tela do app), e os ajustes só entram com aprovação
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
2. **Etapa 0 e 0.5 — entrada idempotente:** carregar contexto completo + investigar código real (leituras cirúrgicas nos arquivos que os PLANs tocam) e ler `tasks/<NOME>/QUESTION.md`. Ausente → Etapa 1. Formato antigo ou `Estado: aplicado` → informar e **não escrever** (formato antigo: perguntar antes de qualquer coisa). `Estado: aguardando respostas` → **não regerar**; ler as respostas, listar os IDs sem desfecho e parar, ou, com todos respondidos, ir à solicitação da Etapa 3
3. **Etapa 1 — Crítica grava e para:** atacar em **6 frentes** (skill detalha cada uma), numerando **todos** os itens no padrão `QN.M`, e **gravar** tudo em `tasks/<NOME>/QUESTION.md` (protocolo 2, todo item com `Resposta: pendente`). Parar dizendo "Perguntas gravadas em `tasks/<NOME>/QUESTION.md`. Responda no arquivo ou pela tela do app e peça para continuar.", só com contagem e IDs no chat
4. **Etapa 2 — Respostas:** a pessoa responde no arquivo ou pela tela do app; ao continuar (dizendo ao agente ou pelo "Continuar" da tela), o agente lê o arquivo. Resposta dada no chat não é transcrita
5. **Etapa 3 — Escrita:** com todo item respondido, **solicitar ativamente** a aplicação — listando arquivo por arquivo o que muda e os IDs de origem (`[s]` tudo · `[p]` só o `QUESTION.md` · `[n]` nada). Só após aprovação do usuário **na conversa do terminal** (a tela do app nunca aprova): completar o `QUESTION.md` com `Edit`, aplicar os ajustes acordados em `TASK.md` e `plans/PLAN-NN-*.md` e, por último, marcar `Estado: aplicado`

Escrita permitida **somente** dentro de `tasks/<NOME>/`: o `QUESTION.md` na Etapa 1 (com o arquivo ainda inexistente) e `TASK.md`/`plans/` só na Etapa 3 aprovada — nunca código de produção, nunca ajuste antes da aprovação.

Ao terminar, avisar o usuário para revisar `QUESTION.md` e os artefatos ajustados antes de avançar pra `/feature`.
