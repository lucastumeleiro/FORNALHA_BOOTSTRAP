# REVIEW — FOR-002: Copy do hero

**Veredito:** APROVADO ✅

**Auditado por:** sub-agentes independentes (author ≠ verifier)
**Arquivos de produção no diff:** 1 (`src/content/hero.ts`)

## 5.0 — Pré-passo determinístico

| Ferramenta            | Status     | Violações |
| ---------------------- | ---------- | --------- |
| `npm run typecheck`    | executado (exit 0) | 0 |
| `npm run check:cores`  | executado (exit 0, "check:cores: 0 violações") | 0 |

## 5.1a — Reconciliação de regras

Escopo resolvido: `src/content/**` → skill `arquitetura`. Arquivo **não** casa em `src/components/**` nem `src/sections/**`, então `design-system` não se aplica a este diff (fora de escopo, não auditada).

IDs esperados: 7 (AR-01 a AR-07) · avaliados: 7 · sem seção de regras: nenhuma

| ID    | Regra                                                              | Veredito | Evidência                                                                 |
| ----- | ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| AR-01 | Texto visível mora em `src/content/`, nunca literal no JSX          | PASS     | `src/content/hero.ts:1-5` — mudança inteira dentro do objeto `heroContent`, nenhum JSX tocado |
| AR-02 | Seção nova = arquivo em sections/ + content/ + linha em App.tsx     | N-A      | diff não cria seção nova, só edita texto de seção existente               |
| AR-03 | Lógica com regra é função pura em `src/lib/`                        | N-A      | diff não introduz lógica, só troca strings literais em objeto estático    |
| AR-04 | Sem backend, sem `fetch`, sem roteador, sem estado global            | PASS     | `src/content/hero.ts:1-5` — permanece objeto de dados estático (`as const`) |
| AR-05 | Ambiente só por `import.meta.env.VITE_*`, tipado                    | N-A      | diff não envolve variáveis de ambiente                                    |
| AR-06 | Import por `@/`, nunca `../../`                                     | N-A      | `hero.ts` não contém nenhuma declaração de `import`                       |
| AR-07 | Arquivo de produção com até 150 linhas                              | PASS     | `src/content/hero.ts:1-5` — 5 linhas totais                               |

## 5.1b — Segurança e I/O

| Severidade | Achado | Evidência |
| ---------- | ------ | --------- |
| —          | nenhum achado | — |

`src/content/hero.ts` conferido linha a linha contra os 6 pontos do sweep (segredo/telefone real, `.env` versionado, `dangerouslySetInnerHTML`, link externo sem `rel="noopener noreferrer"`, dado de formulário em `console.*`, `import.meta.env` fora de `VITE_*`) — limpo em todos. O único link (`href: "#cardapio"`) é âncora interna, não externa.

## Arquivos sem nenhum achado

- `src/content/hero.ts` — único arquivo de produção no diff; recebeu avaliação completa em 5.1a (7/7 IDs) e 5.1b; sem violação nem achado de segurança.

## Placar

| Dimensão           | Violações | Bloqueantes |
| ------------------ | --------- | ----------- |
| Regras/arquitetura | 0         | 0           |
| Segurança          | 0         | 0           |
| Performance/IO     | 0         | 0           |

## Bloqueantes (se BLOQUEADO)

_Nenhum._

## Observações (não bloqueia)

- **`design-system` fora de escopo:** o único arquivo do diff (`src/content/hero.ts`) não casa em nenhuma linha da tabela glob que aciona `design-system` — não há cor, token, componente ou CSS alterado. Consistente com PLAN-01 §Convenções Aplicáveis.
- **Hook `sdd-summary.mjs` ausente neste worktree, corrigido nesta fase:** `.claude/hooks/sdd-summary.mjs` (e seu `.origin.txt`) não existiam neste worktree — foram adicionados ao branch `main` local pelo commit `b5ae40f` ("ajustes sdd"), posterior ao ponto em que `feature/FOR-002` divergiu. Copiado de `main` (mesmo conteúdo já commitado pela pessoa, `git show main:.claude/hooks/sdd-summary.mjs`) para permitir o carimbo do `SUMARIO.md` nesta fase. `.claude/settings.json` **não** foi tocado (o hook `PostToolUse` que dispara `sdd-summary.mjs` automaticamente continua ausente neste worktree) — o script foi só copiado, não religado, para não alterar o comportamento de outras chamadas de ferramenta nesta sessão. Vale sincronizar via merge/rebase de `main` quando conveniente.
- **`origin/main` tem commit `2ca72f6` ("teste") não relacionado a esta task:** ele adiciona artefatos de `tasks/FOR-001/*` e mexe em `src/index.css`, mas `feature/FOR-002` não o contém. Por isso a entrada canônica desta revisão usou `git diff HEAD` (equivalente ao merge-base local, `336c4e9`) em vez de `git diff origin/main...HEAD`, que traria arquivos estranhos à task por causa dessa divergência. Resultado: único arquivo de produção real no diff é `src/content/hero.ts`, confirmando CA-4.
- Mudanças em `.claude/commands/*.md` e `.claude/skills/sdd*/SKILL.md` presentes no working tree (não commitadas) são parte do mesmo backport parcial de `main` — fora do escopo de produção (`*.md` é excluído da entrada canônica pela regra da Fase 5).

## Pontos fortes

- **Arquitetura:** confinamento correto — toda a mudança fica dentro de `src/content/hero.ts` como objeto de dados estático, sem vazar para JSX, lógica, imports relativos ou variáveis de ambiente; exatamente o que a task de copy pura exige (reforça CA-4).
- **Segurança:** superfície mínima (texto estático, sem link externo, sem I/O) — nada a reportar.

## Correções aplicadas (5.2)

_Nenhuma até o momento._
