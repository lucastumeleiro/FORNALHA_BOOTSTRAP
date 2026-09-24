---
name: sdd-spec
description: Fase 1 do SDD — enriquece TASK.md com investigação técnica completa via skill `task-analyst`. Substitui o TASK.md existente pelo conteúdo detalhado no formato de task estruturada (estilo Jira/Linear). Use ao invocar via command `/spec`. Sub-skill de `sdd` que delega análise e detalhamento para skill `task-analyst`.
---

# SDD — Fase 1: Enriquecimento do TASK.md

Usa a skill `task-analyst` para investigar o relato/task e produzir uma versão detalhada do TASK.md — com causa raiz, escopo fechado, checklist de implementação e critérios de aceite testáveis.

**Output:** `tasks/<NOME>/TASK.md` (substitui o conteúdo existente)

**Padrão detalhado de análise e detalhamento:** invocar skill `task-analyst`. Esta skill foca no **fluxo da fase**.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos: TASK.md + EPIC.md (se existir) — apenas estes nesta fase
- `tasks/<NOME>/QUESTION.md` **se existir** — significa que já houve uma rodada de Fase 3 nesta task. Como esta fase **substitui** o TASK.md, toda decisão registrada no QUESTION.md deve ser **preservada** no TASK.md reescrito. Perder decisão já acordada é regressão, não enriquecimento
- Invocar skill `task-analyst` para conduzir o fluxo completo de análise (4 fases: triagem → investigação → detalhamento → validação)
- O conteúdo atual do TASK.md serve como "relato de entrada" para a Fase 1 do `task-analyst`
- **O output final é salvo em `tasks/<NOME>/TASK.md`, substituindo o conteúdo anterior**
- **NUNCA alterar arquivos nesta fase além de `tasks/<NOME>/TASK.md`**

---

## Fluxo

### 1. Ler TASK.md atual como relato de entrada

O conteúdo do TASK.md existente substitui o "relato do suporte" da Fase 1 do `task-analyst`. Não aguardar input do usuário — usar o arquivo como entrada direta.

### 2. Executar `task-analyst` (fluxo completo)

Executar as 4 fases do `task-analyst` normalmente — o TASK.md lido no passo anterior substitui o "relato do suporte" como entrada da Fase 1.

### 3. Salvar em TASK.md

Ao concluir, gravar o conteúdo do template preenchido em `tasks/<NOME>/TASK.md`, **substituindo** o conteúdo anterior.

---

## Regras

- **NUNCA** implementar código nesta fase
- **NUNCA** alterar arquivos do projeto além de `tasks/<NOME>/TASK.md`
- Se encontrar **contradições** entre o relato e o código existente, documentar no TASK.md e avisar
- Se TASK.md estiver ambíguo demais para prosseguir, **parar e perguntar**

---

## Ao terminar

### 1. Carimbar `spec: done` no `SUMARIO.md`

Com o `TASK.md` enriquecido **já salvo em disco** e antes de avisar o usuário (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase spec --status done
```

Rodar da raiz do worktree da task. A Fase 1 é a única sem artefato próprio — ela reescreve o `TASK.md`, que a Fase 3 também reescreve —, então **nenhum hook infere `spec`**. Sem esta chamada, `spec` permanece `skipped` e ninguém distingue "não rodou" de "rodou": é esta chamada, e só ela, que fecha essa ambiguidade. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

### 2. Avisar o usuário

Avisar usuário para revisar o TASK.md enriquecido. Frequentemente haverá perguntas e ajustes antes de avançar pra Fase 2 (`/plan`).

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] Skill `task-analyst` consultada e fluxo completo executado
- [ ] TASK.md atual lido como relato de entrada (não aguardou input do usuário)
- [ ] TASK.md salvo com conteúdo enriquecido (conteúdo anterior substituído)
- [ ] `spec: done` carimbado no `SUMARIO.md` com `exit 0`, depois de salvar o TASK.md e antes do gate
