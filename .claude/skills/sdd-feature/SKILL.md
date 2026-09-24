---
name: sdd-feature
description: Execução da feature (Fase 4 do SDD) — orquestra time de agentes Claude por PLAN, executa em ondas sequenciais com paralelismo interno via Agent tool, coordena via MEMORY.md. Use ao invocar via command `/feature`. Sub-skill de `sdd`.
---

# SDD — Fase 4: Orquestração de Time de Agentes

Executa PLANs aprovados usando um time de agentes Claude independentes, organizados em ondas sequenciais com paralelismo interno, coordenados via MEMORY.md.

**Output:** arquivos de código (criados/modificados conforme PLANs).

**Pré-requisito:** TASK + `plans/*.md` + MEMORY.md presentes; após Fase 3 (`/question`).

---

## Etapa 0 — Contexto do Orquestrador

Ler antes de qualquer execução:

1. `tasks/<NOME>/TASK.md` — **sempre; fonte de verdade principal**
2. Todos `tasks/<NOME>/plans/PLAN-NN-*.md`
3. `tasks/<NOME>/MEMORY.md`
4. `tasks/<NOME>/QUESTION.md` (se existir) — decisões da Fase 3 (`QN.M`) e **incertezas abertas**. As incertezas apontadas ali como "resolver na execução" são responsabilidade desta fase; decisão registrada **não** se re-litiga
5. `tasks/<NOME>/EPIC.md` (se existir)

**NUNCA inicie sem ter lido todos os PLANs.**

---

## Etapa 1 — Grafo de Dependências

Extrair `**Dependências:**` de cada PLAN. Agrupar em ondas:

- **Onda 1:** `Dependências: nenhuma`
- **Onda N:** dependências satisfeitas por ondas anteriores

```
PLAN-01 (deps=nenhuma)         → Onda 1
PLAN-03 (deps=nenhuma)         → Onda 1  [paralelo]
PLAN-02 (deps=PLAN-01)         → Onda 2
PLAN-04 (deps=PLAN-03)         → Onda 2  [paralelo com PLAN-02]
PLAN-05 (deps=PLAN-03,PLAN-04) → Onda 3
```

**Ondas são sequenciais**: Onda N só começa após todos os agentes da Onda N-1 concluírem e MEMORY.md ser atualizado.

---

## Etapa 2 — Detectar Domínio e Selecionar Agente

Antes de lançar cada agente, classificar o domínio do PLAN pelos caminhos listados no **Escopo** ou **Passos de Implementação**. A tabela abaixo é o ponto de partida — **ajuste conforme a arquitetura real deste produto** (pode não haver separação backend/frontend, ou pode haver mais camadas):

| Domínio detectado                                                                                                                                            | `subagent_type`                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `src/**`, `index.html`, `public/**`, inclusive um PLAN que rode `npx shadcn@latest add` (aí o `package.json` e o lockfile mudam como consequência)           | `frontend-agent`                                                                                  |
| Só configuração de raiz (`package.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `uno.config.json`), `scripts/**`, `.claude/**` ou documentos | `general-purpose`, instruído a invocar `arquitetura` (e `design-system` se tocar `src/index.css`) |

> Os agentes são definidos em `.claude/agents/frontend-agent.md` e carregam contexto de stack, seleção de skills por tipo de arquivo, regras de execução e formato do relatório final. O prompt do orquestrador só precisa dos identificadores (template abaixo).
>
> **Fallback:** se o runtime não resolver esses tipos (ex.: sessão sem `.claude/agents/`), usar `subagent_type: "general-purpose"` e incluir no prompt a instrução de invocar a Skill tool com a skill de domínio correspondente, além das regras críticas do CLAUDE.md.

---

## Etapa 3 — Executar Ondas com Time de Agentes

**Antes da primeira onda — carimbar a abertura da feature** (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase feature --status in_progress
```

Rodar da raiz do worktree da task. A Fase 4 é a mais longa e a única sem artefato próprio: sem o carimbo de abertura, a task aparece como não iniciada durante horas de trabalho real, e nenhum hook consegue inferir essa abertura de escrita nenhuma. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

Para cada onda:

1. **Antes:** marcar PLANs da onda como `🔄 Em execução` no MEMORY.md
2. **Lançar time:** enviar **todos os agentes da onda em uma única mensagem** usando múltiplas chamadas à Agent tool em paralelo — um agente por PLAN, com o `subagent_type` do domínio conforme Etapa 2
3. **Aguardar:** todos os agentes da onda concluírem (paralelismo real dentro da onda)
4. **Após:** atualizar MEMORY.md — status `✅`/`❌`, contratos exportados, bloqueios
5. **Verificar:** bloqueios → **parar e avisar usuário antes de avançar**
6. **Avançar:** se todos `✅`, iniciar próxima onda (agentes lerão MEMORY.md para consumir contratos)

---

## Template de Prompt para Agente do Time

Preencher e usar como `prompt` em cada chamada Agent tool, com o `subagent_type` da Etapa 2. A definição do agente já contém as leituras obrigatórias, a seleção de skills e o formato do relatório — o prompt fornece os identificadores e o contexto da onda:

```
Você foi selecionado para implementar {PLAN_ID} da task {TASK_ID}.

Arquivos do plano:
- PLAN: `tasks/{TASK_ID}/plans/{PLAN_FILE}`
- TASK: `tasks/{TASK_ID}/TASK.md`
- MEMORY: `tasks/{TASK_ID}/MEMORY.md`
- QUESTION: `tasks/{TASK_ID}/QUESTION.md` (se existir)

Contratos de ondas anteriores relevantes ao seu PLAN (resumo do MEMORY.md):
{CONTRATOS_RESUMIDOS — ou "primeira onda, nenhum contrato ainda"}

Avisos desta onda:
{AVISOS — ex.: arquivos que outro agente da mesma onda edita em paralelo
(não tocar); pendências conhecidas deixadas para PLANs seguintes}

NÃO edite o MEMORY.md — o orquestrador atualiza.
```

Substituições: `{PLAN_ID}`, `{TASK_ID}`, `{PLAN_FILE}` conforme o PLAN; `{CONTRATOS_RESUMIDOS}` e `{AVISOS}` montados pelo orquestrador a partir do MEMORY.md e do grafo da onda.

---

## Regras do Orquestrador

- **NUNCA** implementar código diretamente — papel do orquestrador é coordenar o time, não codificar
- **NUNCA** avançar para próxima onda com bloqueios ativos
- **SEMPRE** atualizar MEMORY.md entre ondas (contratos disponíveis para onda seguinte)
- Desvio reportado por agente: avaliar impacto em PLANs dependentes; avisar usuário se relevante
- Bloqueio: parar, exibir descrição completa, aguardar decisão do usuário

---

## Ao Terminar

### 1. Carimbar `feature: done` no `SUMARIO.md`

Somente quando **todos** os PLANs estão `✅` no `MEMORY.md` e não há bloqueio ativo (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase feature --status done
```

**Em falha, bloqueio ou interrupção, não carimbar `done`:** deixar `feature: in_progress` como está e relatar o bloqueio ao usuário. Estado aberto é a informação correta — `worktree doctor` e o daemon reconciliam depois; inventar conclusão faz o sumário mentir sobre trabalho que não terminou. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

### 2. Relatório final

Relatório final:

- Arquivos criados/modificados (agrupados por PLAN)
- Ondas executadas e agentes por onda
- Desvios (se houve)
- Estado final do MEMORY.md
- Arquivos na melhor ordem para conferência do código

Próximo: Fase 5 (`/review-feature`) — auditoria de regras + `REVIEW.md`. Depois, Fase 6a (`/test-plan`).

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] Todos PLANs + MEMORY.md lidos antes de iniciar
- [ ] Grafo de dependências mapeado e ondas definidas
- [ ] Domínio de cada PLAN detectado conforme a tabela de domínios do projeto
- [ ] PLANs mistos (ex.: backend + frontend) sinalizados ao usuário antes de prosseguir
- [ ] MEMORY.md atualizado antes de cada onda (🔄) e após (✅/❌ + contratos)
- [ ] Agentes da mesma onda lançados em paralelo (única mensagem, múltiplas chamadas Agent)
- [ ] Ondas executadas em sequência — onda N só inicia após N-1 completa
- [ ] Bloqueios verificados e resolvidos antes de avançar
- [ ] `feature: in_progress` carimbado com `exit 0` antes de lançar a primeira onda
- [ ] `feature: done` carimbado com `exit 0` só com todos os PLANs ✅ e nenhum bloqueio ativo — caso contrário, `in_progress` preservado
- [ ] Relatório final com arquivos + ondas + desvios
