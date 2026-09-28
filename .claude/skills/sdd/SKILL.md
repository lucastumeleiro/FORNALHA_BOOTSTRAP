---
name: sdd
description: Master skill do Spec Driven Development (SDD). Use ao iniciar trabalho em uma task numerada (ex. TASK-123), ao orquestrar fluxo SPEC → PLAN → QUESTION → FEATURE → REVIEW-FEATURE → TEST-PLAN → AUTOTEST → VERIFY, ou quando precisar decidir qual sub-skill SDD invocar.
---

# Spec Driven Development — Master

**As fases abaixo são o default.** O fluxo real de um repositório é o catálogo de fases que ele declara em `uno.config.json` — um projeto pode ter uma fase própria e não ter outras. Este repositório **não** declara catálogo: roda no default, que é exatamente o fluxo descrito aqui. Como o consumidor declara o seu: [`docs/adocao-no-repositorio-consumidor.md`](https://github.com/lucastumeleiro/sdd/blob/main/docs/adocao-no-repositorio-consumidor.md), item 7.

Fluxo de 7 fases para desenvolvimento de feature. Cada fase é um gate e toda fase produz artefato em `tasks/<NOME>/` — exceto a 4, que produz código, e a 6b, que gera `*.test.ts` junto ao código além do `AUTOTEST.md`.

> Fluxo importado do Uno SDD para o repositório de teste Fornalha. As skills de domínio daqui são `arquitetura`, `design-system`, `teste-automatizado` e `teste-de-mesa`; onde uma sub-skill diz "skill do projeto, se existir", são estas.

---

## Detecção da task

Ao iniciar SDD, **sempre** confirmar a task com o usuário:

```
1. Detectar branch atual (ex: feature/TASK-123)
2. Se branch tem padrão <PREFIXO>-NÚMERO (ex.: TASK-123, PROJ-45):
   → "Detectei TASK-123 na branch atual. É essa a task?
      [s] sim
      [n] informar outra"
3. Se não tem padrão, ou user respondeu [n]:
   → "Qual identificador da task? (ex: TASK-123)"
4. Confirmar: tasks/TASK-123/ existe? TASK.md presente?
```

**Nunca assumir.** Branch ≠ task em hotfixes ou trabalho cruzado.

---

## Estrutura de artefatos por task

```
tasks/<NOME>/
├── TASK.md       # Fonte de verdade principal — enriquecida pela Fase 1 (/spec)
├── EPIC.md       # (opcional) escopo do épico que contém a task
├── MEMORY.md     # Fase 2+ — estado compartilhado entre sub-agentes
├── plans/
│   ├── PLAN-01-<slug>.md   # Fase 2 — plano unitário por domínio
│   ├── PLAN-02-<slug>.md
│   └── ...
├── QUESTION.md   # Fase 3 — perguntas (IDs QN.M) e respostas da rodada, gravadas na Etapa 1; decisões na Etapa 3
├── REVIEW.md     # Fase 5 — auditoria de regras (IDs de skill) + veredito + correções aplicadas
├── TEST.md       # Fase 6a — teste de mesa
├── AUTOTEST.md   # Fase 6b — decisões de classificação A/B/C + exclusões justificadas
├── VERIFY.md     # Fase 7 — relatório de verificação independente
├── SUMARIO.md    # Cache de estado — escrito pelo carimbador ao fechar cada fase, nunca à mão
└── (os testes em si — Fase 6b — geram .test.ts lado a lado com o código)
```

---

## Fases — visão geral

- **1** `/spec` → `sdd-spec` → enriquece `TASK.md` via `task-analyst` _(pulável pela regra geral abaixo — o motivo de sempre é o `TASK.md` já ser detalhado o suficiente)_
- **2** `/plan` → `sdd-plan` → `plans/PLAN-NN-*.md` + `MEMORY.md` (task com frontend: triagem visual — só _mudança estrutural_ aciona o gate de aprovação de layout via ferramenta de canvas/mockup)
- **3** `/question` → `sdd-question` → crítica adversarial gravada em `QUESTION.md` (Etapa 1, que para) → respostas da pessoa no arquivo ou na tela → ajustes acordados em `TASK.md`/`plans/` (Etapa 3, com aprovação explícita na conversa do terminal). O `QUESTION.md` é também o meio de resposta; só ele é escrito antes da aprovação
- **4** `/feature` → `sdd-feature` → código via sub-agentes paralelos por PLAN
- **5** `/review-feature` → `reviewer-agent` → `REVIEW.md` (5.0 pré-passo determinístico → 5.1 auditoria de regras em sub-agentes independentes → 5.2 correções sob demanda)
- **6a** `/test-plan` → `sdd-test-plan` → `TEST.md`
- **6b** `/autotest` → `sdd-autotest` → arquivos de teste automatizado + `AUTOTEST.md` (classificações A/B/C, exclusões justificadas)
- **7** `/verify` → `sdd-verify` → `VERIFY.md` (verificação independente: author ≠ verifier; audita cobertura, asserções e as exclusões da 6b)

Cada fase é **gate de validação** — usuário revisa antes de avançar.

**`plan` e `feature` são obrigatórias.** São as duas fases que **produzem** — o plano e o código —, e pular qualquer uma esvazia tudo o que vem depois em vez de encurtar o caminho: revisar o quê, testar o quê, verificar o quê.

**As demais são puláveis, com o motivo registrado** — `--status skipped --reason "<motivo>"`. Pular sem dizer por quê é indistinguível de descuido, e é a primeira coisa que alguém vai questionar na revisão do PR, onde o `SUMARIO.md` versionado mostra cada pulo com o motivo ao lado.

**A decisão de pular é humana**, tomada no app ou por carimbo manual. **Nenhum agente pula fase por conta própria** — nem quando a task parece pequena, nem quando a fase parece dispensável, nem para desbloquear a si mesmo. A UI tem atrito (confirmação, motivo obrigatório); o carimbo não tem, e é esta regra que fecha esse buraco.

## Fechamento de fase — carimbar o `SUMARIO.md`

Toda fase fecha **carimbando** `tasks/<NOME>/SUMARIO.md`. Quem escreve o arquivo é o carimbador; a fase só o **invoca**. Ninguém escreve o YAML à mão e ninguém marca fase manualmente — oito fases formatando YAML por conta própria produzem oito dialetos, que é exatamente o defeito que o contrato existe para eliminar.

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase <fase> --status <estado> [--verdict <valor>] [--reason <texto>]
```

- **`cwd` = a raiz do repositório/worktree da task** — é de lá que `tasks/<NOME>/SUMARIO.md` é resolvido.
- **Só a forma `--flag valor`.** `--flag=valor`, flag desconhecida, duplicada ou sem valor são recusadas.
- **`--phase`** ∈ as fases do **catálogo do repositório**, lido de `uno.config.json`. O default embutido — e o que este repositório usa, porque ele não declara catálogo — é `spec` · `plan` · `question` · `feature` · `review` · `test-plan` · `autotest` · `verify`. Um repositório que declare o seu tem outras fases, e o carimbador recusa `--phase` fora dele listando as aceitas.
- **`--status`** ∈ `pending` · `in_progress` · `done` · `blocked` · `skipped` — `skipped` só é aceito nas fases que o catálogo declara **puláveis**, que no default são `spec`, `question`, `review`, `test-plan`, `autotest` e `verify`. `plan` e `feature` não são puláveis e o carimbador as recusa.
- **`--reason`** é **obrigatório** com `--status skipped` e **recusado** em qualquer outro status. O texto é normalizado em uma linha só e recusado acima de 200 caracteres. Retomar é `--status pending` **sem** `--reason`, e apaga o motivo gravado. A única fase dispensada do motivo é a que **nasce pulada pelo catálogo** — prova de conclusão `none` com estado padrão `skipped`, que no default é só a `spec`: ali o `skipped` não é decisão de ninguém, e exigir motivo gravaria em toda task um texto que ninguém escolheu.
- **`--verdict`** só nas fases cuja conclusão o catálogo prova por **veredito**, e **obrigatório** quando o status dessas fases é `done` ou `blocked`. No default são `review` e `verify`, com os pares `APROVADO↔done` e `BLOQUEADO↔blocked` em `review`; `PASS↔done` e `FAIL↔blocked` em `verify`.
- **É idempotente:** repetir o mesmo carimbo não altera um byte do arquivo (nem `updated_at`). Carimbar de novo por segurança é barato; não carimbar não é.

### A chamada de cada fase

| Fase | Quem chama                         | Chamada                                                                                                    |
| ---- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1    | `sdd-spec`                         | `--phase spec --status done`                                                                               |
| 2    | `sdd-plan`                         | `--phase plan --status done`                                                                               |
| 3    | `sdd-question`                     | `--phase question --status done`                                                                           |
| 4    | `sdd-feature`                      | `--phase feature --status in_progress` (abertura) · `--phase feature --status done` (fechamento)           |
| 5    | revisor (5.1 e 5.2)                | `--phase review --status done --verdict APROVADO` \| `--phase review --status blocked --verdict BLOQUEADO` |
| 6a   | `sdd-test-plan`                    | `--phase test-plan --status done`                                                                          |
| 6b   | `sdd-autotest`                     | `--phase autotest --status done`                                                                           |
| 7    | `sdd-verify`                       | `--phase verify --status done --verdict PASS` \| `--phase verify --status blocked --verdict FAIL`          |
| —    | **pessoa** (app ou carimbo manual) | `--phase <fase> --status skipped --reason "<motivo>"` — pula a fase                                        |
| —    | **pessoa** (app ou carimbo manual) | `--phase <fase> --status pending` — retoma a fase pulada                                                   |

**As fases do catálogo nascem juntas.** O primeiro carimbo de uma task cria o `SUMARIO.md` inteiro, com `spec: skipped` (sem `changedAt`) e as demais `pending` — oito no default deste repositório, as que o catálogo declarar em outro. Por isso a Fase 2 **não** carimba `spec: skipped`: é o default da inicialização, e um `spec: done` deixado pela Fase 1 é preservado automaticamente. Só `--phase spec --status done` promove `spec`.

### Quando chamar: depois do artefato, antes do gate

O carimbo é a **última ação da fase**, e só acontece quando a fase de fato fechou:

- **depois** de o artefato que prova o fechamento estar escrito em disco (`TASK.md` enriquecido, PLANs + `MEMORY.md`, `QUESTION.md`, `REVIEW.md`, `TEST.md`, `AUTOTEST.md`, `VERIFY.md`);
- **antes** de avisar o usuário para revisar — o gate de aprovação não abre com a fase por carimbar.

Fase que não fechou não carimba. A Fase 3, em particular: o `QUESTION.md` **já existe desde a Etapa 1** (é o meio da conversa), então a presença dele não prova o fechamento; ela só carimba depois de a Etapa 3 **autorizada** ter aplicado os ajustes acordados e deixado o `QUESTION.md` com `**Estado:** aplicado`; carimbar enquanto ele diz `aguardando respostas` violaria o próprio gate que ela é.

### `exit ≠ 0` impede fechar a fase

| Código | O que houve                                                                                   |
| ------ | --------------------------------------------------------------------------------------------- |
| `0`    | carimbado — ou já estava no estado alvo (idempotente)                                         |
| `1`    | entrada inválida (flag, fase, status, par `verdict`/`status`, ID malformado ou com travessia) |
| `2`    | alvo inválido (symlink, task ausente, campo `task` divergente)                                |
| `3`    | contrato inválido (front-matter ilegível ou fora do schema)                                   |
| `4`    | contenção expirada — outra escrita segurou o lock da task além da espera                      |
| `5`    | falha de escrita                                                                              |

**Qualquer `exit ≠ 0` significa que a fase NÃO foi carimbada.** Ler o diagnóstico em `stderr`, resolver a causa e **repetir a chamada**. Não avançar de fase, não abrir o gate e não relatar a fase como concluída enquanto o carimbo não sair com `exit 0`.

### O hook é rede de segurança, não a fonte

No runtime Claude há um hook `PostToolUse` que observa `Write`/`Edit`/`MultiEdit` em `tasks/<NOME>/` e carimba o que consegue inferir do caminho escrito. Ele **nunca** substitui a chamada normativa acima:

- sai **sempre** com `0` e jamais derruba a operação do usuário — logo, jamais avisa que o carimbo faltou;
- não enxerga escrita feita por `Bash`, nem nada do runtime Codex;
- não consegue inferir `spec` (o `TASK.md` também é reescrito pela Fase 3), nem a abertura da Fase 4, nem a reescrita de verdict da 5.2.

Quem fecha a fase é quem carimba. O hook só pega parte das quedas.

### Precedência: o artefato manda, o sumário é cache

O `SUMARIO.md` é **cache versionado** do que os artefatos da task já dizem — conveniência de leitura no PR e para o board. Não é fonte de verdade e não se edita à mão: em divergência, o artefato (e a derivação do disco) ganha, e `worktree doctor` reconcilia. Sinais externos — PR, sessão viva, `stalled` — são recomputados por quem consome; o carimbador não os conhece e não os inventa.

**A exceção, e é a mais estreita possível: o pulo não é cache.** Nenhuma varredura de disco distingue um `QUESTION.md` que não existe porque a fase não rodou de um que não existe porque alguém decidiu que não rodaria — a declaração de pulo é o único dado do arquivo que não é derivável de lugar nenhum, e por isso ela sobrevive até à reconstrução total. Onde há artefato, o artefato continua ganhando, **inclusive contra a declaração**: fase pulada cujo artefato aparece depois é lida como concluída, e a divergência é reportada.

---

## Worktree, WIP e de onde se lança uma sessão

Uma task por worktree, um worktree por branch do tracker (`feature/<ID>`) — e o `--worktree` nativo do runtime continua proibido: quem cria worktree é `git worktree add`, pelo CLI `worktree`.

A norma operacional completa — os três limites de WIP (**3** tasks em fases frias · **1** em gate humano · **1** com a aplicação no ar), o escalonamento em vez de simultaneidade, a tabela de quais fases paralelizam, as sessões **A–E** de uma task e a regra de origem do background — vive em [`docs/worktree-e-wip.md`](https://github.com/lucastumeleiro/sdd/blob/main/docs/worktree-e-wip.md). É lá que se consulta; aqui fica só o que nenhuma fase pode ignorar:

- **Duas sessões nunca editam a mesma task ao mesmo tempo.** Não há merge de sessões: a segunda sobrescreve o artefato da primeira sem aviso.
- **As sessões D (`/test-plan` · `/autotest`) e E (`/verify`) começam em contexto fresco obrigatório** — sessão nova no worktree da task, sem `--resume`, sem `--continue`, sem herdar transcript. É o que transforma `author ≠ verifier` em fato, não em simulação.
- **A origem do lançamento decide.** Correções e auditorias são despachadas em foreground pelo mecanismo de sub-agente do runtime, **ou** por uma sessão em background lançada de dentro do worktree da task (`.claude/worktrees/<ID>/`) — nunca a partir do checkout principal, de onde o runtime criaria worktree e branch novos, fora da task.

---

## Etapa 0 — Pesquisa e Contexto (padrão para TODAS as fases)

> **Todas as sub-skills devem seguir esta sequência.** Cada fase adiciona leituras específicas (documentadas na sub-skill), mas a base é sempre esta.

### 0.1 Ler artefatos da task

- Ler `tasks/<NOME>/TASK.md` por completo — **sempre a fonte de verdade principal**
- Ler `tasks/<NOME>/EPIC.md` se existir (TASK tem prioridade em conflitos)
- Ler artefatos adicionais conforme fase (PLANs, MEMORY, TEST — cada sub-skill define)
- Ler `tasks/<NOME>/QUESTION.md` se existir (fases 4+) — decisões já tomadas na Fase 3 e incertezas ainda abertas. **Decisão registrada ali não se re-litiga**; incerteza aberta se resolve na execução. **Só vale como decisão com `**Estado:** aplicado`** (ou formato legado, sem `**Protocolo:**`).** Com `**Estado:** aguardando respostas`, a rodada **não fechou**: nada ali é decisão, a `Sugestão` não é acordo e as respostas dadas podem ainda mudar — as decisões só existem em `## Decisões`, depois da Etapa 3

### 0.2 Invocar skills relevantes PRIMEIRO

Antes de explorar qualquer código, invocar skills que cobrem o domínio:

- **Sempre:** `arquitetura`
- **Frontend/UI** (qualquer `.tsx`, `src/index.css`, fonte, tema): `design-system`
- **Teste manual (6a):** `teste-de-mesa`
- **Teste automatizado (6b e Check 6 da 7):** `teste-automatizado`

Skills documentam padrões, convenções e estrutura. Ler primeiro evita exploração redundante.

### 0.3 Leituras cirúrgicas para lacunas

Após skills, ler **apenas** arquivos que skills não cobrem:

- Assinaturas exatas de métodos que serão chamados
- Campos de models/entidades que serão referenciados
- Padrões de arquivos análogos existentes

### 0.4 Anti-padrões

- ❌ Spawnar Agent/Explore amplo — gera contexto gigante com info que skills já cobrem
- ❌ Ler arquivos inteiros de features não relacionadas
- ❌ Grep/Glob abertos sem alvo claro

---

## Premissas e Incertezas (obrigatório em TODAS as fases que geram artefato)

Toda fase que produz arquivo inclui seção `## Premissas e Incertezas` ao final:

- **Mínimo 3 premissas** — assunções feitas ao interpretar TASK ou modelar solução
- **Mínimo 2 incertezas** — decisões com mais de um caminho razoável

Essa seção **alimenta Fase 3** (questionamento crítico). Seja honesto.

> **Exceção — Fase 3 (`QUESTION.md`):** é a fase que **ataca** as premissas das outras, não que as declara. Usa o próprio formato, o do protocolo 2 (cabeçalho `**Protocolo:**`/`**Estado:**` + `## Itens`; Resumo, Decisões, Incertezas abertas e Alterações aplicadas entram na Etapa 3); a seção `## Incertezas abertas` cumpre o papel.
>
> **Exceção — Fase 5 (`REVIEW.md`):** relatório de auditoria com veredito, não declaração de premissas. Usa o próprio formato (pré-passo determinístico + reconciliação de regras + placar + bloqueantes + correções aplicadas).
>
> **Exceção — Fase 6b (`AUTOTEST.md`):** registro de decisões de classificação, não de premissas. Usa o próprio formato (Resumo + Classificação por CT + Exclusões justificadas + Rastreabilidade + Lacunas).
>
> **Exceção — Fase 7 (`VERIFY.md`):** relatório terminal de evidência, não alimenta o questionamento. Usa o próprio formato (veredito + tabelas de evidência + lacunas priorizadas), sem seção de Premissas e Incertezas.

---

## Rastreabilidade obrigatória

- Cada PLAN referencia TASK (e EPIC se existir)
- TEST referencia critérios de aceite do TASK (matriz CA ↔ CT)
- Implementação segue PLANs fielmente; MEMORY.md sincroniza contratos entre sub-agentes
- Invoque skills de arquitetura/backend/frontend (do projeto, quando existirem) para padrões de projeto. Todo código em TASK é exemplo; padrão nas skills ou implementado tem maior prioridade

---

## Regras Globais (valem em TODAS as fases)

- **NUNCA** alterar arquivos do projeto fora de `tasks/<NOME>/` durante fases 1-3, 5, 6a, 7
- **NUNCA** implementar código nas fases 1-3, 5, 6a, 7 (Fase 3 grava o `QUESTION.md` na Etapa 1 — a única escrita antes da aprovação — e ajusta `TASK.md`/`plans/` só na Etapa 3 aprovada, na conversa do terminal; Fase 5 coordena correções via agentes; Fase 7 só escreve `VERIFY.md`)
- **NUNCA** pular fase sem registrar o motivo — e **nunca por decisão do agente**: `plan` e `feature` não são puláveis, e o pulo das demais é decisão humana (§Fases — visão geral)
- **NUNCA** prosseguir com TASK ambíguo — parar e perguntar
- **SEMPRE** registrar premissas e incertezas
- **SEMPRE** confirmar task com usuário antes de iniciar
- Gate de aprovação: ao terminar cada fase, **avisar usuário para revisar** antes de avançar
- **SEMPRE** carimbar o `SUMARIO.md` da fase (§Fechamento de fase) com `exit 0` antes de abrir o gate — `exit ≠ 0` é fase não carimbada, resolver e repetir
- **NUNCA** editar `SUMARIO.md` à mão nem marcar fase manualmente — o carimbador é o único escritor

---

## Checklist Global (complementado por checklist específico de cada fase)

- [ ] Task confirmada com usuário
- [ ] TASK.md lido completo
- [ ] EPIC.md lido (se existir)
- [ ] Skills relevantes invocadas ANTES de explorar código (ou lacuna documentada, se ainda não existirem)
- [ ] Leituras cirúrgicas apenas para lacunas não cobertas pelas skills
- [ ] Premissas e Incertezas preenchidas (≥3 premissas, ≥2 incertezas)
- [ ] Sem alteração de código pelo orquestrador (fases 1-3, 5, 6a, 7)
- [ ] Carimbo da fase aplicado com `exit 0` **antes** do gate de revisão (§Fechamento de fase — carimbar o `SUMARIO.md`)
- [ ] Usuário avisado para revisar antes de avançar
