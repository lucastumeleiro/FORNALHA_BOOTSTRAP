---
description: Fase 5/7 SDD — auditoria de código ancorada nas regras das skills: pré-passo determinístico, auditoria em sub-agentes independentes, REVIEW.md com veredito, e ciclo interativo de correções sob demanda
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /review-feature — Fase 5/7 do Spec Driven Development (auditoria de regras + revisão interativa)

## Detecção da task

Se `$ARGUMENTS` foi fornecido, usar como `<TASK_ID>`.

Se não foi fornecido:

1. Detectar branch atual
2. Se branch tem padrão de ticket (ex.: `feature/TASK-123`), extrair e perguntar:
   ```
   Detectei `TASK-123` na branch atual. É essa a task?
   [s] sim
   [n] informar outra
   ```
3. Senão, perguntar: `Qual identificador da task?`

Confirmar que `tasks/<TASK_ID>/MEMORY.md` existe (feature deve ter sido executada). Se faltar, avisar que `/feature` deve ser rodado antes.

## Execução

**Despacho desta fase:** Agent tool em foreground (`run_in_background: false`), ou sessão em background lançada **de dentro do worktree da task** (`.claude/worktrees/<TASK_ID>/`) — nunca a partir do checkout principal. A partir daqui, Claude assume o papel do reviewer-agent neste chat, seguindo as instruções do arquivo `.claude/agents/reviewer-agent.md` com `TASK_ID = <TASK_ID>`.

**Output da fase:** `tasks/<TASK_ID>/REVIEW.md` + veredito compacto em chat (`APROVADO ✅` | `BLOQUEADO ❌`).

### Leitura obrigatória

1. `tasks/<TASK_ID>/TASK.md`
2. `tasks/<TASK_ID>/MEMORY.md`
3. `tasks/<TASK_ID>/QUESTION.md` se existir — decisões `QN.M` da Fase 3; não reabrir o que já foi decidido ali
4. Todos os PLANs — "Arquivos Impactados" é o escopo acordado
5. `git diff <branch-base>...HEAD --name-only` — lista canônica dos arquivos alterados (excluir `tasks/**`, `*.md`, lockfiles; ajustar `<branch-base>` para a branch principal deste repositório)

### Etapa 5.0 — Pré-passo determinístico

Tentar as ferramentas de análise estática configuradas no projeto (`npm run typecheck` e `npm run check:cores`, conforme a tabela do reviewer-agent). Script ausente ou dependência não instalada → registrar como `não disponível` **com o erro real colado** no REVIEW.md. Nunca presumir indisponibilidade sem tentar.

> São os **únicos** comandos autorizados nesta fase. São análise, não lint nem servidor.

### Etapa 5.1 — Auditoria de regras (sub-agentes independentes)

Resolver o escopo pela tabela glob → skill do reviewer-agent (consulta, não julgamento de relevância — preencher a tabela conforme skills de domínio existirem), montar o conjunto de IDs de regra esperado, e despachar **em paralelo, na mesma mensagem**, dois sub-agentes via **Agent tool** (`subagent_type: "general-purpose"`, `run_in_background: false`):

- **(a) Regras e arquitetura** — lê as skills resolvidas, devolve uma linha por ID esperado
- **(b) Segurança e I/O** — sweep no diff, sem skill

Escrever `tasks/<TASK_ID>/REVIEW.md` com a reconciliação (todo ID esperado com veredito), o placar e os bloqueantes.

**Carimbar o `SUMARIO.md` antes de apresentar o veredito**, da raiz do worktree da task — `APROVADO ✅` usa `node .claude/hooks/sdd-summary.mjs --task <TASK_ID> --phase review --status done --verdict APROVADO`; `BLOQUEADO ❌` usa `node .claude/hooks/sdd-summary.mjs --task <TASK_ID> --phase review --status blocked --verdict BLOQUEADO`. `exit ≠ 0` significa que a fase não foi carimbada: resolver e repetir antes de seguir. Só então apresentar o veredito compacto e **aguardar**.

### Etapa 5.2 — Correções sob demanda

Quando o usuário retornar com uma solicitação, seguir a **Fase 5.2** do reviewer-agent: classificar por domínio, despachar correção via **Agent tool** (`subagent_type: "general-purpose"`, `run_in_background: false`) e apensar em `## Correções aplicadas (5.2)` no REVIEW.md.

**Depois de cada correção, recalcular o veredito** (regra "Veredito é campo vivo" do reviewer-agent): se a correção resolveu o(s) bloqueante(s), atualizar o campo `**Veredito:**` no topo do REVIEW.md para `APROVADO ✅` (mantendo o veredito original da 5.1 anotado, sem apagar histórico) e reapresentar o veredito compacto em chat. Nunca deixar o cabeçalho do REVIEW.md ou o último veredito em chat divergindo do estado real após uma correção aplicada.

**E recarimbar o `SUMARIO.md`** com o par atual (`--status done --verdict APROVADO` ou `--status blocked --verdict BLOQUEADO`), conferindo `exit 0` — nenhum hook infere reescrita de verdict, então sem esta chamada a transição da 5.2 não alcança o sumário.

Quando o usuário considerar a revisão concluída, próximo passo SDD: `/test-plan` (Fase 6a/7).

## Regra absoluta — NUNCA editar código diretamente

**NUNCA** use Edit, Write ou qualquer ferramenta de edição de arquivo para corrigir código da feature.
O revisor analisa e coordena — quem edita são os agentes especializados despachados via Agent tool.

Isso vale mesmo que a correção pareça trivial ou de uma linha. Toda mudança de código passa por um sub-agente.

> **Por que Agent tool — e quando uma sessão em background também serve?**
> O Agent tool (foreground) edita diretamente no working tree do worktree da task, e é o despacho padrão desta fase. Uma sessão em background **lançada de dentro do worktree da task** (`.claude/worktrees/<TASK_ID>/`) também serve: ali o Claude Code já está isolado e o move para um worktree novo é pulado. O que não se faz é lançá-la a partir do checkout principal — de lá ela cria **worktree e branch novos**, fora da task, e a correção aterrissa onde ninguém procura. Regra completa em [`docs/worktree-e-wip.md`](https://github.com/lucastumeleiro/sdd/blob/main/docs/worktree-e-wip.md).
