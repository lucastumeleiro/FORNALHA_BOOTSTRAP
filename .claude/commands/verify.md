---
description: Fase 7/7 SDD — verificação independente (author ≠ verifier): cobertura ancorada nos CAs + sensor de discriminação estático + auditoria das exclusões do AUTOTEST.md
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /verify — Fase 7/7 do Spec Driven Development

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

Confirmar que `tasks/<NOME>/MEMORY.md` existe com todos PLANs `✅ Concluído` **e** que há arquivos de teste da feature (Fase 6b concluída). Se faltar algum, parar e avisar.

`tasks/<NOME>/AUTOTEST.md` é a entrada do Check 6. Se **não** existir (task do fluxo antigo), não bloquear: reconstruir as classificações a partir do TEST.md + testes presentes e declarar a ausência no `VERIFY.md` — a ausência é, por si, achado.
TASK.md é sempre a fonte de verdade dos critérios de aceite.

## Execução

1. Invocar skill `sdd-verify` para o fluxo da fase
2. Seguir Etapa 0 (carregar contexto — incluindo `QUESTION.md` se existir — + identificar diff da feature + ler os arquivos de teste por completo)
3. **Lançar um sub-agente verificador** (`subagent_type: "general-purpose"`) com contexto fresco — author ≠ verifier; ele recebe só artefatos + diff, nunca o raciocínio da implementação. A Fase 7 é a **sessão E** ([`docs/worktree-e-wip.md`](https://github.com/lucastumeleiro/sdd/blob/main/docs/worktree-e-wip.md) §5): sessão nova no worktree da task, sem `--resume` nem `--continue`, diferente da sessão D (`/test-plan` · `/autotest`)
4. Rodar os 6 checks: conclusão → cobertura ancorada nos CAs → sensor de discriminação estático → payload/conjunção → escopo → **auditoria das exclusões** (iterar `## Exclusões` do `AUTOTEST.md` tentando refutar cada C; refutada = CA vira lacuna = `FAIL`)
5. **NÃO executar** o comando de teste/build/dev do projeto — o sensor é estático (achar o mutante que sobreviveria)
6. **NÃO escrever produção nem editar testes** — única escrita permitida é `tasks/<NOME>/VERIFY.md`

Ao terminar, escrever `tasks/<NOME>/VERIFY.md` e **carimbar o `SUMARIO.md`** a partir da raiz do worktree da task — `PASS ✅` usa `node .claude/hooks/sdd-summary.mjs --task <NOME> --phase verify --status done --verdict PASS`; `FAIL ❌` usa `node .claude/hooks/sdd-summary.mjs --task <NOME> --phase verify --status blocked --verdict FAIL`. `exit ≠ 0` significa que a fase não foi carimbada: resolver e repetir antes de fechar.

Só então apresentar o veredito compacto (`PASS ✅` | `FAIL ❌`). Se `FAIL`, apresentar lacunas priorizadas; correções despachadas via **Agent tool (foreground)**, ou por sessão em background lançada **de dentro do worktree da task** (`.claude/worktrees/<NOME>/`) — nunca a partir do checkout principal, de onde o Claude Code criaria worktree e branch novos, fora da task. Re-verificar (máx. 3 ciclos antes de escalar) e **recarimbar o `SUMARIO.md`** sempre que o veredito mudar, inclusive na transição `FAIL` → `PASS` que fecha o loop.
