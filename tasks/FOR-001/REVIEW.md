# REVIEW — FOR-001: Paleta terracota

**Veredito:** APROVADO ✅

**Auditado por:** sub-agentes independentes (author ≠ verifier)
**Arquivos de produção no diff:** 1 (`src/index.css`)

> `git diff main...HEAD` vem vazio porque a mudança ainda não foi commitada; o escopo veio do `git diff` do working tree, que coincide com "Arquivos Impactados" do PLAN-01.

## 5.0 — Pré-passo determinístico

| Ferramenta            | Status                             | Violações |
| --------------------- | ---------------------------------- | --------- |
| `npm run typecheck`   | executado (`tsc -b`, exit 0)       | 0         |
| `npm run check:cores` | executado (exit 0, "0 violações")  | 0         |

## 5.1a — Reconciliação de regras

Escopo resolvido: `src/index.css` → `design-system`
IDs esperados: 6 · avaliados: 6 · sem seção de regras: nenhuma

| ID    | Regra                                                       | Veredito | Evidência                                                                                           |
| ----- | ----------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| DS-01 | Cor literal só em `src/index.css`                           | PASS     | `check:cores` 0 violações; mudanças em `src/index.css:56,57,67,91,92,102`                           |
| DS-02 | Classe de cor semântica                                     | PASS     | `check:cores` 0 violações; o diff não toca classe                                                   |
| DS-03 | Token novo nos dois temas e no `@theme inline`              | N-A      | nenhum token novo; os três já existem e são mapeados em `src/index.css:22,32,33`                    |
| DS-04 | `src/components/ui/` sai do CLI                             | N-A      | o diff não toca `src/components/ui/`                                                                |
| DS-05 | Contraste ≥ 4,5:1 nos dois temas                            | PASS     | recalculado: 5,61 (claro) e 7,02 (escuro), batem com `PLAN-01-tokens-terracota.md:55-60`            |
| DS-06 | Foco visível (`ring` do tema)                               | PASS     | `--ring` = `--primary` em `src/index.css:67` e `:102`; `outline-ring/50` em `src/index.css:120`     |

## 5.1b — Segurança e I/O

| Severidade | Achado         | Evidência |
| ---------- | -------------- | --------- |
| —          | nenhum achado  | —         |

## Arquivos sem nenhum achado

- `src/index.css` — só os seis valores esperados mudaram, em `oklch()`, sem `url()`, `@import`, segredo ou I/O; nenhum token fora do escopo (P2) foi tocado.

## Placar

| Dimensão           | Violações | Bloqueantes |
| ------------------ | --------- | ----------- |
| Regras/arquitetura | 0         | 0           |
| Segurança          | 0         | 0           |
| Performance/IO     | 0         | 0           |

## Bloqueantes

Nenhum.

## Observações (não bloqueia)

- I1: `--sidebar-primary` em `.dark` continua azul de fábrica (`src/index.css:110`); `--sidebar-ring` (`:81,115`) e `--accent` (`:62,97`) seguem neutros por P2. Já registrado no PLAN (`PLAN-01-tokens-terracota.md:81`).
- O anel de foco é `ring/50`, então o contraste efetivo é menor que o do primário puro; conferir visualmente no `TEST.md` (CA-1, CA-2).
- CA-1 e CA-2 dependem de conferência no navegador, que é da pessoa.

## Pontos fortes

- Regras/arquitetura: diff mínimo (6 linhas, 1 arquivo), contrastes do PLAN reproduzidos exatamente.
- Segurança: nenhuma superfície de I/O tocada.

## Correções aplicadas (5.2)

_Nenhuma._
