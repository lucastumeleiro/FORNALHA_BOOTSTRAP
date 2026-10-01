# REVIEW — FOR-006: Copy do cardápio

**Veredito:** APROVADO ✅

**Auditado por:** sub-agentes independentes (author ≠ verifier)
**Arquivos de produção no diff:** 2

## 5.0 — Pré-passo determinístico

| Ferramenta            | Status    | Violações |
| --------------------- | --------- | --------- |
| `npm run typecheck`   | executado | 0         |
| `npm run check:cores` | executado | 0         |

`check:cores`: `check:cores: 0 violações`. `typecheck` (`tsc -b`) saiu sem saída de erro.

**Entrada canônica:** `git diff origin/main...HEAD --name-only` veio **vazio** — a feature ainda não foi commitada (os arquivos estão só no working tree). Pela regra do reviewer-agent, a entrada passou a ser a união dos "Arquivos Impactados" do PLAN-01, e o `git diff -- src` do working tree confirmou exatamente os mesmos dois arquivos.

## 5.1a — Reconciliação de regras

Escopo resolvido: `src/data/**` → `arquitetura`; `src/content/**` → `arquitetura`
IDs esperados: 14 (AR-01..AR-07 × 2 arquivos) · avaliados: 14 · sem seção de regras: nenhuma

| ID    | Regra                                                | Bloqueia | Veredito | Evidência                                                                          |
| ----- | ---------------------------------------------------- | -------- | -------- | ---------------------------------------------------------------------------------- |
| AR-01 | Texto visível mora em `src/content/`, nunca no JSX    | sim      | PASS     | `src/data/products.ts:16,24,31,38,46,53` (exceção de produto); nenhum `.tsx` tocado |
| AR-01 | idem                                                 | sim      | PASS     | `src/content/products-section.ts:3`                                                |
| AR-02 | Seção nova = arquivo em sections + content + App.tsx | não      | N-A      | `products.ts`: não cria seção, só edita dados existentes                           |
| AR-02 | idem                                                 | não      | N-A      | `products-section.ts`: não cria seção, edita uma string                            |
| AR-03 | Lógica com regra é função pura em `src/lib/`         | não      | N-A      | `products.ts`: só literais (11-57), sem lógica                                     |
| AR-03 | idem                                                 | não      | N-A      | `products-section.ts`: só literais (1-5)                                           |
| AR-04 | Sem backend, `fetch`, roteador, estado global        | sim      | PASS     | `src/data/products.ts:1-57` — sem import nem efeito                                |
| AR-04 | idem                                                 | sim      | PASS     | `src/content/products-section.ts:1-5` — objeto `as const` puro                     |
| AR-05 | Ambiente só por `import.meta.env.VITE_*`             | sim      | N-A      | `products.ts`: não usa `import.meta.env`                                           |
| AR-05 | idem                                                 | sim      | N-A      | `products-section.ts`: não usa `import.meta.env`                                   |
| AR-06 | Import por `@/`, nunca `../../`                      | não      | N-A      | `products.ts`: nenhum import                                                       |
| AR-06 | idem                                                 | não      | N-A      | `products-section.ts`: nenhum import                                               |
| AR-07 | Arquivo de produção com até 150 linhas               | não      | PASS     | `src/data/products.ts:57` (57 linhas)                                              |
| AR-07 | idem                                                 | não      | PASS     | `src/content/products-section.ts:5` (5 linhas)                                     |

**Verificação complementar (não são IDs):**

- **CA-1** — contagens (palavra = token separado por espaço): `sourdough` 13 (`products.ts:16`), `rye` 12 (`:24`), `focaccia` 10 (`:31`), `croissant` 9 (`:38`), `orange-cake` 11 (`:46`), `filter-coffee` 11 (`:53`); todas entre 8 e 18, nenhuma é "Descrição em breve.". Subtítulo 10 palavras (`products-section.ts:3`), dentro do limite de 12. Contagens conferidas de forma independente pelo revisor com `split(/\s+/)`.
- **CA-2** — aberturas distintas (Fermento, Centeio, Alecrim, Camadas, Laranja, Coado); sem superlativo vazio, emoji ou exclamação.
- **CA-3** — o diff de `products.ts` altera só o campo `description`; `id`, `name`, `price`, `category` e os tipos estão intactos. `products-section.ts` altera só `subtitle` (`title` e `categoryLabels` intactos, P3).
- **Decisões da Fase 3** — todas respeitadas: `rye` sem a farinha (Q1.1), subtítulo sem categorias (Q1.2), "36 horas" só no `sourdough` (Q4.1), café sem origem nem torra (Q3.1), subtítulo sem horário de fornada nem "36 horas" (Q3.2, Q5.1). Textos idênticos aos fixados no PLAN-01 (Q6.2).
- **Fatos da marca** — "fermento vivo desde 2019" e "36 horas" batem com o EPIC (`tasks/EPIC.md:19`).

## 5.1b — Segurança e I/O

| Severidade | Achado        | Evidência |
| ---------- | ------------- | --------- |
| —          | nenhum achado | —         |

Sweep cobriu: segredo/telefone real, `.env` versionado (só `.env.example` está no git), `dangerouslySetInnerHTML`, link externo sem `rel`, `console.*` com dado de formulário, `import.meta.env` fora de `VITE_`.

## Arquivos sem nenhum achado

- `src/data/products.ts` — muda só strings estáticas de `description`; sem import, lógica, `fetch`, env ou HTML; 57 linhas; copy dentro dos limites da TASK e do EPIC.
- `src/content/products-section.ts` — muda só a string de `subtitle`; sem lógica nem import; 5 linhas; texto na camada certa (`src/content/`).

## Placar

| Dimensão           | Violações | Bloqueantes |
| ------------------ | --------- | ----------- |
| Regras/arquitetura | 0         | 0           |
| Segurança          | 0         | 0           |
| Performance/IO     | 0         | 0           |

## Bloqueantes (se BLOQUEADO)

_Nenhum._

## Observações (não bloqueia)

- **Entrada canônica por fallback:** o diff contra `origin/main` estava vazio porque a feature não foi commitada; a auditoria usou os "Arquivos Impactados" do PLAN, confirmados pelo diff do working tree. Depois do commit, o diff canônico deve listar os mesmos dois arquivos.
- **Skill `design-system` fora do escopo:** nenhum componente, token ou tema foi tocado; os dois arquivos casam só em `arquitetura`.
- **Detalhes fora do EPIC (baixa confiança, não é achado):** "azeite" e "casca grossa" (`products.ts:31`, `:16`) não vêm do EPIC nem do nome do produto. A Premissa 4 do PLAN-01 já os classifica como descrição genérica de ingrediente/textura, não fato da marca, e foi aprovada na Fase 3. A pessoa pode reavaliar se quiser a copy estritamente limitada aos fatos do EPIC.
- **Sem testes novos:** a TASK não pede teste para CA-1 a CA-3; a conferência de contagem foi feita por one-liner descartável, como decidido em Q6.1.

## Pontos fortes

- **Regras/arquitetura:** escopo mínimo e fiel ao PLAN (2 arquivos, 7 linhas de texto alteradas); texto na camada certa; nenhuma estrutura exportada mudou, o que preserva o contrato com FOR-014.
- **Segurança/IO:** diff composto só de literais estáticos, sem superfície nova de risco.

## Correções aplicadas (5.2)

_Nenhuma até o momento._
