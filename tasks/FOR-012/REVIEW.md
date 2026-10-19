# REVIEW — FOR-012: Filtro do cardápio por categoria

**Veredito:** APROVADO ✅

**Auditado por:** sub-agentes independentes (author ≠ verifier) — (a) regras e arquitetura, (b) segurança e I/O, ambos `general-purpose`, read-only, sem acesso ao raciocínio da implementação
**Arquivos de produção no diff:** 3 (`src/content/products-section.ts`, `src/sections/products-section.tsx`, `src/lib/filter-products.ts`) + 1 de teste (`src/sections/products-section.test.tsx`)

> **Escopo canônico:** `git diff origin/main...HEAD --name-only` veio **vazio** (o trabalho está no working tree, sem commit). Pela regra do reviewer-agent, a entrada passou a ser a união das listas "Arquivos Impactados" dos PLANs (PLAN-01), que coincide com `git status` do working tree. `src/lib/filter-products.ts` é arquivo novo não rastreado e foi lido por inteiro.

## 5.0 — Pré-passo determinístico

| Ferramenta            | Status                                                  | Violações |
| --------------------- | ------------------------------------------------------- | --------- |
| `npm run typecheck`   | executado (`tsc -b`, exit 0)                            | 0         |
| `npm run check:cores` | executado (`check:cores: 0 violações`, exit 0)          | 0         |

## 5.1a — Reconciliação de regras

Escopo resolvido:

- `src/content/products-section.ts` → `arquitetura`
- `src/lib/filter-products.ts` → `arquitetura`
- `src/sections/products-section.tsx` → `design-system` + `arquitetura`
- `src/sections/products-section.test.tsx` → `src/sections/**` (`design-system` + `arquitetura`) + `**/*.test.tsx` (`teste-automatizado`)

IDs esperados: 18 · avaliados: 18 · sem seção de regras: nenhuma (as três skills têm `## Regras verificáveis`)

| ID    | Regra                                                      | Veredito | Evidência                                                                                                                                         |
| ----- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| AR-01 | Texto visível em `src/content/`, nunca literal no JSX      | PASS     | `products-section.ts:5-7`; consumido em `products-section.tsx:9-10`, `:38`, `:52`, `:62`. `"all"` (`:14`) é identificador interno               |
| AR-02 | Seção nova = arquivo + content + linha em `App.tsx`        | N-A      | nenhuma seção nova; `products-section` já existia                                                                                                 |
| AR-03 | Lógica com regra é função pura em `src/lib/`               | PASS     | `filter-products.ts:6-12` pura, recebe tudo por parâmetro; chamada em `products-section.tsx:23`                                                   |
| AR-04 | Sem backend, `fetch`, roteador nem estado global           | PASS     | `useState` local em `products-section.tsx:22`; nenhuma dependência nova                                                                           |
| AR-05 | Ambiente só por `import.meta.env.VITE_*`                   | N-A      | nenhum dos 4 arquivos toca em ambiente                                                                                                            |
| AR-06 | Import por `@/`, nunca `../../`                            | PASS     | `products-section.tsx:3-7`, `filter-products.ts:1`, `products-section.test.tsx:3-7`                                                               |
| AR-07 | Arquivo de produção com até 150 linhas                     | PASS     | `products-section.tsx` 77 · `products-section.ts` 8 · `filter-products.ts` 12 (conferido com `wc -l`)                                             |
| DS-01 | Cor literal só em `src/index.css`                          | PASS     | `check:cores` 0 violações; revisão manual dos 4 arquivos sem hex/rgb/hsl/oklch nem `style=`                                                       |
| DS-02 | Classe de cor semântica, nunca paleta de fábrica           | PASS     | `check:cores` 0 violações; só `text-muted-foreground` (`products-section.tsx:31`, `:60`) e tokens do `Button` por `variant`                       |
| DS-03 | Token novo existe nos dois temas e no `@theme inline`      | N-A      | nenhum token criado; `src/index.css` não foi tocado                                                                                               |
| DS-04 | `src/components/ui/` sai do CLI, sem edição à mão          | PASS     | nenhum arquivo de `src/components/` alterado; `Button` só consumido com `size`/`variant` (`products-section.tsx:4`, `:44-51`)                     |
| DS-05 | Contraste do texto sobre cor de marca nos dois temas       | PASS     | botão ativo reusa o par existente `bg-primary`/`text-primary-foreground` (`button.tsx:11`); nenhum token novo. Medição nos dois temas é do teste de mesa |
| DS-06 | Foco visível e nome acessível                              | PASS     | foco vem do `Button` (`button.tsx:7`, `focus-visible:ring-*`); nome pelo texto do content (`products-section.tsx:52`); grupo rotulado (`:37-38`) |
| TA-01 | Teste ao lado do código                                    | PASS     | `src/sections/products-section.test.tsx` ao lado de `products-section.tsx`                                                                        |
| TA-02 | Nome em português, "deve … quando …"                       | PASS     | `products-section.test.tsx:13`, `:27`, `:38`, `:58`, `:78`                                                                                        |
| TA-03 | Consulta por papel/rótulo; sem seletor de classe e sem snapshot | PASS | `selector: '[data-slot="badge"]'` (`products-section.test.tsx:52-55`) é seletor de atributo, não de classe, e foi decidido em Q1.1; sem snapshot |
| TA-04 | Toda exclusão C cita `§Classificação A/B/C deste produto`  | N-A      | nenhum arquivo do escopo declara exclusão C; elas vivem no `AUTOTEST.md` (Fase 6b)                                                                |
| TA-05 | Mock só na fronteira, nunca na unidade sob teste           | PASS     | `products-section.test.tsx:1-7` — nenhum mock; renderiza a unidade real                                                                           |

Resultado: 18 esperados · 13 PASS · 5 N-A · 0 VIOLAÇÃO.

## 5.1b — Segurança e I/O

| Severidade | Achado         | Evidência |
| ---------- | -------------- | --------- |
| —          | nenhum achado  | —         |

Checklist varrido, todos LIMPO: segredo/telefone real · `.env` versionado (`git ls-files` só mostra `.env.example`) · `dangerouslySetInnerHTML`/`innerHTML`/`eval` · link externo sem `rel` · `console.*` · `import.meta.env` fora de `VITE_` · I/O novo (`fetch`, storage, `location`, query string) · valor do usuário indo a URL/atributo/HTML. O único valor vindo de ação do usuário é `option.value` (`products-section.tsx:42-50`), derivado de `Object.keys(categoryLabels)` + `"all"`, usado só para comparação e `key`.

## Arquivos sem nenhum achado

Todos os 4 ficaram sem achado, nos dois sub-agentes:

- `src/content/products-section.ts` — só três chaves de texto estático num objeto `as const`, 8 linhas; sem JSX nem I/O.
- `src/sections/products-section.tsx` — textos vindos do content, cores semânticas, foco e nome herdados do `Button`, estado local em memória, filtro isolado em `lib/`, 77 linhas. As decisões da Fase 3 (`size="lg"`, `aria-live`+`aria-atomic`, `role="group"`, clique no ativo sem efeito, `Object.keys(categoryLabels)`) estão presentes.
- `src/sections/products-section.test.tsx` — nomes no formato, consulta por papel/texto, sem snapshot e sem mock; único toque do diff é o filtro por `data-slot`.
- `src/lib/filter-products.ts` — função pura, só importa tipo por `@/`, sem React nem DOM, 12 linhas.

## Placar

| Dimensão           | Violações | Bloqueantes |
| ------------------ | --------- | ----------- |
| Regras/arquitetura | 0         | 0           |
| Segurança          | 0         | 0           |
| Performance/IO     | 0         | 0           |

## Bloqueantes (se BLOQUEADO)

Nenhum.

## Observações (não bloqueia)

- **Sem teste novo para o filtro.** Não existe `src/lib/filter-products.test.ts` nem teste de integração dos CA-1..CA-4. Não é violação de TA-01..05 e o PLAN-01 (passo 4) deixa os testes dos CAs para a Fase 6b (`/autotest`).
- **Desvio de espaçamento registrado no MEMORY.** A grade passou de `mt-8` para `mt-6` (`products-section.tsx:65`), enquanto o PLAN dizia que a grade ficava como está. É só espaçamento e está declarado em `MEMORY.md §Desvios`; o PLAN pedia aprovação prévia de desvios e não encontrei registro dela. Fica para a pessoa confirmar.
- **Incerto (~20%, não é violação):** `products-section.test.tsx:53-55` repete "Pães", "Doces" e "Bebidas" como literais em vez de importá-los de `src/content/`. As linhas já eram literais antes; o diff só acrescentou o `selector`.
- **Incerto (~15%, não é violação):** a escolha singular/plural (`products-section.tsx:62`) fica na seção. O PLAN-01 (Premissa 4) justifica; não há motivo para extrair para `lib/`.
- **TA-03:** o `selector` por `data-slot` acopla o teste a um atributo interno do `Badge`. Aceito em Q1.1.
- **Pré-existente, fora do diff:** `products-section.test.tsx:63-70` tem preços literais em vez de derivados de `formatPrice`; `src/components/ui/button.tsx:3` importa `cn` de `"cn"` sem `@/` (arquivo do CLI, não tocado).
- **Conflito previsto com o FOR-014** em `src/content/products-section.ts` (decisão Q2.1): quem mergear depois mantém as duas adições.

## Pontos fortes

- **(a) Regras/arquitetura:** separação nítida — lógica pura em `lib/`, UI em `sections/`, texto todo em `content/`, sem tocar `components/ui/`. Opções do filtro derivadas de `Object.keys(categoryLabels)` tipado como `ProductCategory[]`, então novas categorias ganham botão sem lista paralela.
- **(a) Acessibilidade:** `role="group"` rotulado, `aria-pressed` sempre booleano, região `aria-live` atômica com a contagem numa única string e alvos `size="lg"`.
- **(b) Segurança/IO:** estado do filtro só em memória, nenhuma superfície nova de I/O, e nenhum valor do usuário chega a URL, atributo ou HTML.

## Correções aplicadas (5.2)

_Nenhuma._
