# Roteiro de teste do Uno SDD — Fornalha

> Copiado de §8 e §9 do `FORNALHA-BOOTSTRAP.md`. As referências a §7 apontam para os comandos de entrega daquele arquivo: `copy .env.example .env`, `git add -A`, `git commit` e `git push -u origin main`.

## 8. Roteiro de teste do Uno SDD (para a pessoa)

### 8.1 Preparação (uma vez)

1. Bootstrap commitado e pushado (§7). **Os worktrees nascem da branch.** Tudo que precisa estar dentro deles (skills, carimbador, `uno.config.json`) tem que estar commitado na `main` antes do primeiro `worktree new`.
2. `worktree doctor` no checkout principal. Anote o que reprova; o esperado é a cobertura de ignore e, se ainda não ligou, o `core.longpaths`.
3. No app: **Escolher pasta do repositório** → a raiz da Fornalha. O esperado é conectar e o `.claude/uno/daemon.json` aparecer como não rastreado no `git status`. É a única escrita que o daemon faz sozinho.
4. Instalar o fluxo pelo app (ao adotar a primeira task, ou nas Configurações). Confira:
   - a tela lista, **antes** de gravar, o que será criado e o que será mesclado;
   - surgem `sdd-summary.mjs` + `sdd-summary.origin.txt`;
   - o `settings.json` mantém o `UserPromptSubmit` e ganha o `PostToolUse` e os três `deny`;
   - os dois ignores ganham as duas linhas;
   - o `git status` mostra só isso.

   Commit + push.

5. `worktree doctor` de novo. Nenhum bloqueante.

### 8.2 Ondas sugeridas

Uma onda por vez, com até três tasks frias, sempre **um gate humano por vez** e **uma aplicação no ar por vez**.

| Onda | Tasks                     |
| ---- | ------------------------- |
| 1    | FOR-001, FOR-002, FOR-003 |
| 2    | FOR-004, FOR-005, FOR-006 |
| 3    | FOR-007, FOR-008, FOR-009 |
| 4    | FOR-010, FOR-011, FOR-014 |
| 5    | FOR-012, FOR-013, FOR-015 |
| 6    | FOR-016                   |
| 7    | FOR-017                   |

Para começar uma task: `worktree new FOR-00X --create`. Isso cria `feature/FOR-00X` a partir de `origin/main` em `.claude/worktrees/FOR-00X/`. Depois dispare as fases pelo board, ou rode `/plan FOR-00X` numa sessão aberta **dentro** do worktree. Faça o merge na ordem das ondas.

### 8.3 Cenários

| #   | Cenário                                         | Task                    | Como                                                                                                                                    | O que observar                                                                                                                                                       |
| --- | ----------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Três worktrees frios em paralelo                | FOR-001/002/003         | `worktree new` nas três; `/plan` nas três pelo board                                                                                    | três cards ativos; `worktree ls` com as três; título das sessões `SDD-PLAN-FOR-00X`                                                                                  |
| 2   | Gate humano e notificação                       | FOR-001                 | `/question` e deixar esperando                                                                                                          | card em "Precisa de você"; notificação do tray; o `SUMARIO.md` não carimba `question` antes de você aprovar                                                          |
| 3   | Terminal embutido e VS Code                     | qualquer, no `/feature` | abrir o terminal da task; "Abrir no VS Code"                                                                                            | `pwd` no terminal é o worktree certo; o VS Code abre a pasta do worktree e depois a sessão; se o deep link falhar, o fallback `claude attach` está visível           |
| 4   | Pular fase com motivo                           | FOR-002                 | pular `test-plan`, `autotest` e `verify` com o motivo "mudança só de texto; conferida no review"                                        | a UI exige o motivo; o `SUMARIO.md` mostra os três pulos com o motivo; a task chega (ou não) a pronta para PR — anotar qual                                          |
| 5   | `/spec` sobre relato cru                        | FOR-004                 | `/spec FOR-004`                                                                                                                         | o task-analyst investiga, pergunta só o que sobrar e reescreve o `TASK.md`; `spec: done` no `SUMARIO.md`                                                             |
| 6   | `.env` como bastão                              | FOR-005                 | no `TEST.md`, rodar o CT sem `.env` no worktree frio; `worktree hot FOR-005`; rodar o CT com `.env`                                     | o board mostra o ambiente local nessa task; um `hot` em outra task tira o `.env` desta                                                                               |
| 7   | Uma aplicação no ar por vez                     | FOR-005 + outra         | `npm run dev` em dois worktrees                                                                                                         | o segundo falha na porta 5180                                                                                                                                        |
| 8   | Gate de layout (canvas)                         | FOR-007                 | `/plan`                                                                                                                                 | o plano classifica como "mudança estrutural", publica o canvas e **espera** a aprovação; o PLAN registra `Layout aprovado:` e o bloco de blindagem                   |
| 9   | Empate na triagem visual                        | FOR-008                 | `/plan`                                                                                                                                 | o agente **pergunta** se é ajuste pontual ou mudança estrutural, em vez de decidir sozinho                                                                           |
| 10  | Guard rail de remoção + lockfile divergente     | FOR-009                 | depois do `/feature`, commit + push da branch; `worktree rm FOR-009`; `worktree rm --force FOR-009`; `worktree new FOR-009`             | o primeiro `rm` recusa e lista os commits; o novo worktree nasce **sem** `node_modules` compartilhado e orienta `npm ci`; o `node_modules` do principal fica intacto |
| 11  | Lockfile igual, `node_modules` velho (hipótese) | FOR-010                 | depois do merge da FOR-009: `git pull` no principal **sem** `npm install`; `worktree new FOR-010 --create`; `npm run build` no worktree | hipótese: o `new` não percebe e o build falha por falta da fonte. Se acontecer, é achado                                                                             |
| 12  | Review BLOQUEADO → correção 5.2                 | FOR-011                 | antes do `/review-feature`, pôr à mão `text-orange-600` num link do `site-footer.tsx` e commitar                                        | a 5.0 (`check:cores`) acusa; `REVIEW.md` BLOQUEADO; você pede a correção; o sub-agente corrige; o veredito vira APROVADO e o `SUMARIO.md` é recarimbado              |
| 13  | Verify FAIL                                     | FOR-003                 | depois do `/autotest`, enfraquecer um teste (`expect(formatPrice(12.5)).toBeTruthy()`); `/verify` numa sessão nova                      | o sensor de discriminação acusa a asserção fraca; `verify: blocked · FAIL`                                                                                           |
| 14  | Task parada                                     | FOR-012                 | `/plan`; commit + push da branch; `worktree rm --force FOR-012`; depois `worktree new FOR-012`                                          | a task aparece em "paradas" com a fase derivada; o `new` retoma de onde parou                                                                                        |
| 15  | Task concluída no histórico                     | FOR-001                 | merge do PR na `main`; `git fetch`; `worktree rm FOR-001`                                                                               | ela sai das ativas e aparece nas concluídas, com o `SUMARIO.md` da base. O daemon não faz `fetch` sozinho                                                            |
| 16  | Ordem de merge                                  | FOR-002 × FOR-005       | fazer o merge de FOR-005 **antes** de FOR-002                                                                                           | conflito em `content/hero.ts`: é o que o `Vem depois de` previne                                                                                                     |
| 17  | Catálogo enxuto                                 | antes da FOR-017        | Configurações → catálogo: tirar `test-plan`, `autotest` e `verify`; passar o papel `autoriza_pr` ao `review`                            | `worktree doctor` sem aviso de `phase_commands`; a FOR-017 com cinco fases; o carimbador recusa `--phase verify`                                                     |

### 8.4 Cronômetro

Anote as fases de toda task. É a medida que responde se o Uno SDD ficou rápido o bastante.

| Task    | Fase     | Início | Fim | Min | Observação |
| ------- | -------- | ------ | --- | --- | ---------- |
| FOR-001 | plan     |        |     |     |            |
| FOR-001 | question |        |     |     |            |
| …       |          |        |     |     |            |

---

## 9. Registro de achados

Um bloco por achado. Achado vira task `SDD-0NN` no repositório do Uno SDD, do mesmo jeito que a SDD-031 nasceu do primeiro uso real.

```markdown
### A-NN — <título curto>

- **Onde:** app (tela) | daemon | CLI `worktree` | skill/command | carimbador
- **Task / fase:** FOR-00X · /plan
- **Passos:** 1. … 2. …
- **Esperado:** …
- **Observado:** … (print, saída colada)
- **Tempo da fase:** … min
- **Severidade:** bloqueia | atrapalha | cosmético
```
