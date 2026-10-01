# AUTOTEST — FOR-006

Registro das decisões de automação (Fase 6b/7 do SDD).
Categorias: **A** unit · **B** integração leve · **C** não automatizado (coberto por teste de mesa).
As exclusões (C) são auditadas pelo Check 6 da Fase 7 (`/verify`).

Os testes **não foram executados** nesta fase (regra do SDD). Comando sugerido no fim.

## Resumo

| Categoria | CTs                                      | Testes escritos |
| --------- | ---------------------------------------- | --------------- |
| A         | CT-01, CT-02, CT-03, CT-04, CT-05, CT-08 | 15              |
| B         | CT-01, CT-09                             | 5               |
| C         | CT-06, CT-07                             | —               |

Total: 20 testes em 3 arquivos. CT-01 tem um teste A (descrição amarrada ao id, `products.test.ts:32-52`) **e** o B de render. CT-04 e CT-05 têm testes A **e** B (a mesma regra vista no dado e na tela); a contagem acima os registra uma vez, na categoria principal, e os testes B de cada um estão contados na linha B (CT-04: `products-section.test.tsx:13`; CT-05: `:38` e `:56`).

Contagem por arquivo:

| Arquivo                                | Testes |
| -------------------------------------- | ------ |
| `src/data/products.test.ts`            | 11     |
| `src/content/products-section.test.ts` | 4      |
| `src/sections/products-section.test.tsx` | 5    |

## Classificação por CT

| CT    | Cat | Regra aplicada                                                                                  | Destino                                                                                                         |
| ----- | --- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| CT-01 | A/B | A: cada descrição casa com o termo-chave do seu id (regra pura sobre dado); B: seção renderizada em jsdom, o efeito é texto no DOM | `products.test.ts:32-52` (1 teste A); `products-section.test.tsx:27-36` (1 teste B), `:13-25` (título/subtítulo) |
| CT-02 | A   | regra pura sobre dado (`src/data/`), sem DOM                                                     | `products.test.ts:10-30` (2 testes)                                                                              |
| CT-03 | A   | regra pura sobre dado: aberturas, superlativo, "36 horas", "miolo", "úmid", fato fora da marca    | `products.test.ts:62-106` (5 testes)                                                                              |
| CT-04 | A   | regra pura sobre `src/content/` (contagem, texto antigo, horário, categoria, "36 horas")          | `products-section.test.ts:7-33` (3 testes); render em `products-section.test.tsx:13-25`                          |
| CT-05 | A   | invariante de dado (id/name/price/category) + B de render (nome, preço, badge)                    | `products.test.ts:108-166` (2 testes); `products-section.test.tsx:38-72` (2 testes); `products-section.test.ts:35-43` (rótulos) |
| CT-06 | C   | julgamento editorial contra `tasks/EPIC.md`; parte mecânica automatizada em CT-03                 | manual — TEST.md CT-06 (ver Exclusões)                                                                           |
| CT-07 | C   | layout em 375 px, quebra de linha, contraste nos dois temas                                       | manual — TEST.md CT-07 (ver Exclusões)                                                                           |
| CT-08 | A   | invariante de dado: só `description` varia; a leitura do `git diff` é C (ver Exclusões)           | `products.test.ts:108-166` (2 testes); leitura do `git diff` segue em TEST.md CT-08                              |
| CT-09 | B   | texto ausente do DOM da página (`App`) — o `Ctrl+F` do CT vira `queryByText`; o console do navegador é C (ver Exclusões) | `products-section.test.tsx:76-86` (1 teste)                                                              |

## Exclusões (categoria C) — justificativa auditável

### CT-07 — Copy legível em 375 px e em ≥ 1280 px, nos dois temas

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — linha **C**: "o que só um navegador de verdade mostra: cor e contraste percebidos, fonte carregada, layout em 375 px".

**Por que não é A nem B:** o que o CT-07 verifica é quebra de linha, estouro do card, sobreposição do badge/preço, rolagem horizontal e contraste do texto secundário. Tudo isso é resolvido pelo motor de layout e pelo CSS do Tailwind v4, e o jsdom não tem nenhum dos dois. O único vestígio no DOM são strings de classe (`src/components/ui/card.tsx:14` e `:27`, `src/sections/products-section.tsx:15` com `sm:grid-cols-2 lg:grid-cols-3`). Assertar essas strings testaria o texto do className, não o resultado visual, e `teste-automatizado` TA-03 proíbe seletor de classe. Autoauditoria: o efeito **não** aparece num atributo semântico do DOM (`aria-*`, `href`, `id`, texto); dependência injetável não existe (é CSS); nenhum mock de 1 nível produz layout. Nenhuma resposta da autoauditoria leva a A/B.

**Cobertura substituta:** CT-07 do TEST.md (manual, {claro, escuro} × {375 px, ≥ 1280 px}). O que é texto (a copy chegar ao DOM) está automatizado em CT-01/CT-04.

### CT-06 — Copy coerente com os fatos da marca (EPIC)

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — a linha C da tabela fala de "o que só um navegador mostra" e **não cobre julgamento editorial**; registro isso como lacuna da skill, e não como encaixe forçado. A exclusão se sustenta pela autoauditoria, não pela linha da tabela.

**Por que não é A nem B:** o oráculo do CT-06 é a leitura humana de `tasks/EPIC.md` §Fatos da marca contra a copy ("detalhe concreto coerente", voz do EPIC, não contradizer "Horários e endereço"). Não há função, atributo ou texto no `src/` que diga o que é coerente com a marca; `TEST.md:228` (Incerteza 2) e `PLAN-01-copy-cardapio.md:90` (Premissa 4) já registram que "detalhe concreto" é julgamento. Um teste que lesse `tasks/EPIC.md` acoplaria o código a um artefato do SDD e quebraria quando o EPIC for reescrito, sem provar coerência. Autoauditoria: dependência injetável? não há; mock de 1 nível? mockar o EPIC seria testar o mock; setup < 30 linhas? sim, mas o resultado não seria o julgamento pedido.

**O que foi automatizado do CT-06 (a parte mecânica):** "36 horas" só no `sourdough` (`products.test.ts:83-91`); sem farinha, origem, torra, fornecedor ou horário (`products.test.ts:99-106`; o regex pega `7h`, `7h30` e `7 horas`, depois de tirar o "36 horas" permitido); subtítulo sem horário, sem "36 horas" e sem categoria (`products-section.test.ts:22-33`); o fato "desde 2019" no `sourdough` e o detalhe de cada produto amarrados ao id (`products.test.ts:32-52`).

**Cobertura substituta:** CT-06 do TEST.md (manual).

### CT-08 (resto) — Leitura do `git diff` de `src/data/products.ts` e `src/content/products-section.ts`

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — a linha C trata do que só um navegador mostra; o `git diff` é histórico do repositório, caso que a tabela não prevê. Registro como lacuna da skill, e não como encaixe forçado: a exclusão se sustenta pela autoauditoria.

**Por que não é A nem B:** o que sobra do CT-08 é "só linhas `description` mudaram; no `products-section.ts` só `subtitle`; nada mais em `src/`". O artefato é o `git diff` do working tree: um teste teria de rodar `child_process` contra o git, fora do código de produto, e deixaria de significar algo depois do commit (`TEST.md:222`, Premissa 3, que manda trocar o comando para `origin/main...HEAD`). Autoauditoria: efeito em atributo do DOM? não; função pura ou dependência injetável? não existe; mock de 1 nível? mockar o git seria testar o mock. A parte que é dado já está automatizada: id, name, price, category, ordem e conjunto de chaves em `products.test.ts:108-166`; título e rótulos de categoria em `products-section.test.ts:35-43`.

**Cobertura substituta:** CT-08 do TEST.md (`TEST.md:168-177`, manual).

### CT-09 (resto) — Console do navegador sem erro nem aviso novo

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — linha **C**: "o que só um navegador de verdade mostra".

**Por que não é A nem B:** o resultado esperado é "o console do DevTools não mostra erros nem avisos novos ao carregar a página" (`TEST.md:198`). O texto ausente do DOM já é B (`products-section.test.tsx:76-86`). Um `vi.spyOn(console, "error")` em volta de `render(<App />)` só pegaria avisos do React no jsdom, não o console do navegador (rede, fonte, extensões). A mudança é texto estático em `src/data/products.ts` e `src/content/products-section.ts`, que não tem como originar erro novo de execução. Autoauditoria: o efeito aparece em atributo do DOM? não, aparece no console do navegador; nenhuma resposta leva a A/B.

**Cobertura substituta:** CT-09 do TEST.md (manual, 2º resultado esperado, `TEST.md:198`).

## Toolchain (fora de A/B/C)

| O quê                          | Comando               | Observação                                                             |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------- |
| Os arquivos de teste compilam  | `npm run typecheck`   | `tsc -b` inclui os testes                                              |
| Sem cor literal nova           | `npm run check:cores` | a task não toca cor; só confirma que nada vazou                        |

## Rastreabilidade CA → CT → asserção

| CA / CE | CT            | Cat | Evidência                                                                                                         |
| ------- | ------------- | --- | ----------------------------------------------------------------------------------------------------------------- |
| CA-1    | CT-01         | B   | `products-section.test.tsx:27-36` (seis descrições do dado aparecem na tela)                                      |
| CA-1    | CT-02         | A   | `products.test.ts:10-22` (8 ≤ palavras ≤ 18 por produto); `:24-30` (contagens 13/12/10/9/11/11)                   |
| CA-1    | CT-01         | A   | `products.test.ts:32-52` (cada descrição casa com o termo-chave do seu id; falha se duas forem trocadas)           |
| CA-1    | CT-09         | B   | `products-section.test.tsx:76-86` (sem "Descrição em breve"); `products.test.ts:54-60` (dado sem texto provisório) |
| CA-2    | CT-03         | A   | `products.test.ts:62-71` (aberturas distintas, sem "Feito"); `:73-81` (sem superlativo por radical, emoji, "!"); `:83-97` ("36 horas", vocabulário repetido) |
| CA-3    | CT-05, CT-08  | A/B | `products.test.ts:108-166` (id/name/price/category e conjunto de chaves); `products-section.test.tsx:38-72` (nome, preço, badge na tela) |
| CE-1    | CT-01, CT-06  | A/B/C | `products.test.ts:32-52` (detalhe e "2019" por id); `products-section.test.tsx:27-36`; coerência com o EPIC: manual — TEST.md CT-06                                    |
| CE-2    | CT-04         | A/B | `products-section.test.ts:7-33` (≤ 12 palavras, texto antigo ausente, sem horário/categoria/"36 horas"); `products-section.test.tsx:13-25` (subtítulo na tela) |
| CE-3    | CT-05         | A/B | `products.test.ts:108-152`; `products-section.test.ts:35-43` (título e rótulos); `products-section.test.tsx:38-72` |
| (visual) | CT-07        | C   | manual — TEST.md CT-07                                                                                            |

## Lacunas sinalizadas

- **Redação fora do termo-chave não é fixada.** O teste de `products.test.ts:32-52` amarra cada descrição ao seu produto por um termo-chave (e o "desde 2019" do `sourdough`), não pela frase inteira; reescrever a descrição mantendo o termo, as contagens e as regras continua passando. É o que o TASK pede (regras, não texto), e fixar a frase seria snapshot disfarçado (proibido).
- **CA sem CT no TEST.md:** nenhum. O subtítulo não tem CA numerado (TEST.md, Incerteza 1); o CT-04 o cobre, e o teste foi escrito.
- Os restos manuais de CT-08 (`git diff`) e CT-09 (console do navegador) estão em `## Exclusões`.

## Comando sugerido

```bash
npm test
```

Antes do `/verify`, a pessoa pode rodar também `npm run typecheck` e `npm run check:cores`.
