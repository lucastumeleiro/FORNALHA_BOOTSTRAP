# QUESTION — FOR-012

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 6 — Escopo e complexidade: nada relevante

## Itens

### Q1.1 — Âncora do Passo 4 aponta para as linhas erradas e a correção fica sem forma definida

**Problema:** o PLAN cita `products-section.test.tsx:53-55`, mas as três asserções de rótulo estão em `:51-53`. Além disso, a Incerteza 3 do PLAN deixa "buscar dentro da grade ou excluir os botões" a critério de quem executa. Buscar dentro da grade não funciona sem mudar a seção: a grade (`products-section.tsx:15`) é uma `div` sem role nem rótulo, e o `within` precisaria de um `data-testid` ou de um `role` novo em código de produção só para o teste. Já o `Badge` tem `data-slot="badge"` (`badge.tsx:40`), o que permite um filtro exato sem tocar a seção.

**Âncoras:** `src/sections/products-section.test.tsx:51-53` · `src/components/ui/badge.tsx:40` · `src/sections/products-section.tsx:15` · `PLAN-01 passo 4` · `PLAN-01 §Incertezas 3`

**Sugestão:** corrigir a âncora para `:51-53` e fixar a forma: `getAllByText("Pães", { selector: '[data-slot="badge"]' })` (o mesmo para "Doces" e "Bebidas"). A Incerteza 3 do PLAN sai.

**Afeta:** PLAN-01 passo 4, PLAN-01 §Pontos de Atenção, PLAN-01 §Incertezas

**Resposta:** aceito

**Comentário:**

### Q2.1 — FOR-014 deveria vir antes, mas não está no `main`, e o PLAN reescreve a P3 da TASK em silêncio

**Problema:** o cabeçalho da TASK diz "Vem depois de: FOR-014", e o `TASK.md` do FOR-014 diz "Precede: FOR-012". Mesmo assim, o FOR-014 não foi mergeado: não há commit dele no `git log`, e `Product` (`src/data/products.ts:3-9`) não tem `available`. O PLAN trata isso como "P3 da TASK não se aplica hoje" (PLAN §Premissas 3) e segue. Isso traz dois riscos. (a) O FOR-014 também altera `src/content/products-section.ts` (adiciona o texto "Esgotado") no mesmo objeto de 5 linhas onde o Passo 2 deste PLAN acrescenta três chaves: o conflito de merge é quase certo. (b) A P3 ("esgotados continuam na grade e entram na contagem") vira uma premissa que nenhum teste trava. Quando o FOR-014 entrar, ninguém vai verificar se a contagem continua contando a focaccia.

**Âncoras:** `TASK §cabeçalho (Vem depois de FOR-014)` · `TASK §Premissas P3` · `tasks/FOR-014/TASK.md §Arquivos` · `src/data/products.ts:3-9` · `PLAN-01 §Premissas 3`

**Sugestão:** decidir a ordem de forma explícita. Recomendado: seguir sem o FOR-014, registrar na TASK que a ordem foi invertida de propósito (P3 fica válida "por construção", já que `filterProducts` filtra só por `category`) e anotar no PLAN §Pontos de Atenção o conflito previsto em `content/products-section.ts`, para quem mergear depois. A alternativa é pausar o FOR-012 até o FOR-014 entrar.

**Afeta:** TASK §cabeçalho, TASK §Premissas P3, PLAN-01 §Premissas 3, PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

### Q3.1 — I1: com `aria-live`, a contagem pode ser anunciada pela metade

**Problema:** a TASK deixa a I1 em aberto, e o PLAN (passo 3 + §Incertezas 1) propõe `aria-live="polite"` na contagem. O passo descreve a contagem como `"{n} {one|other}"`. Escrito no JSX como `{n} {word}`, isso vira três nós de texto. Sem `aria-atomic`, alguns leitores de tela anunciam só o nó que mudou ("1" em vez de "1 produto"). Indo de "Pães" (3) para "Doces" (2), a palavra não muda e o anúncio sai só "2".

**Âncoras:** `PLAN-01 passo 3` · `PLAN-01 §Incertezas 1` · `TASK §Incertezas I1`

**Sugestão:** aceitar o `aria-live="polite"` e exigir que a contagem seja **uma única string** (template literal `` `${n} ${word}` ``) **e** que o elemento tenha `aria-atomic="true"`. A I1 sai da TASK como decidida.

**Afeta:** PLAN-01 passo 3, PLAN-01 §Incertezas, TASK §Incertezas I1

**Resposta:** aceito

**Comentário:**

### Q3.2 — I2: o grupo com rótulo usa um texto que ninguém aprovou

**Problema:** o PLAN propõe `role="group"` + `aria-label="Filtrar por categoria"` e admite que o texto é inferido (PLAN §Incertezas 2). O padrão é razoável: quatro botões de alternância relacionados ganham contexto ao entrar no grupo. O texto, porém, vai para `content/` e é lido por leitor de tela, e por isso precisa de decisão consciente: segue a voz do EPIC ("frases curtas, concreto")?

**Âncoras:** `PLAN-01 passo 2` · `PLAN-01 passo 3` · `PLAN-01 §Incertezas 2` · `TASK §Incertezas I2` · `EPIC §Marca (Voz)`

**Sugestão:** aceitar o grupo com `aria-label="Filtrar por categoria"` como está. A I2 sai da TASK como decidida, e o PLAN remove a incerteza.

**Afeta:** PLAN-01 §Incertezas, TASK §Incertezas I2

**Resposta:** aceito

**Comentário:**

### Q4.1 — Clicar no botão que já está ativo: nada declarado

**Problema:** `aria-pressed` é a semântica de um botão de alternância, em que pressionar de novo solta o botão. O PLAN (passo 3) usa os botões como seleção exclusiva, parecida com rádio, mas não diz o que acontece ao clicar no ativo. Quem implementar pode tanto "desligar e voltar a Todos" quanto não fazer nada, e nenhum CA trava isso. O leitor de tela anuncia "pressionado", e a pessoa pode esperar que um segundo clique solte.

**Âncoras:** `PLAN-01 passo 3` · `TASK §Comportamento Esperado 2` · `TASK §Critérios de Aceite CA-4`

**Sugestão:** declarar no passo 3 que clicar no botão ativo **não faz nada**: ele continua ativo, sempre há exatamente um `aria-pressed="true"`, e "Todos" é o único jeito de voltar à lista completa.

**Afeta:** PLAN-01 passo 3, TASK §Comportamento Esperado 2

**Resposta:** aceito

**Comentário:**

### Q4.2 — Ordem e lista de categorias escritas à mão, desacopladas de `ProductCategory`

**Problema:** o passo 3 monta as opções como `"all"`, depois `breads`, `sweets`, `drinks`, numa lista literal. `categoryLabels` (`content/products-section.ts:4`) não é tipado como `Record<ProductCategory, string>`. Se uma categoria nova entrar em `ProductCategory` (`data/products.ts:1`) e em `categoryLabels`, o botão dela simplesmente não aparece, e o `typecheck` não acusa nada. O Contexto da TASK fala em crescer de 6 para 30 produtos, o que torna categoria nova um cenário plausível.

**Âncoras:** `PLAN-01 passo 3` · `src/content/products-section.ts:4` · `src/data/products.ts:1` · `TASK §Contexto`

**Sugestão:** derivar as opções de `Object.keys(categoryLabels)`, com o tipo afirmado como `ProductCategory[]` (a ordem de inserção já é Pães, Doces, Bebidas), precedidas de `"all"`. Nada muda em `categoryLabels`, que o teste trava.

**Afeta:** PLAN-01 passo 3

**Resposta:** aceito

**Comentário:**

### Q5.1 — Alvo de toque de 32 px para um público "no celular, com pressa"

**Problema:** o `Button` no tamanho `default` tem `h-8` (32 px; `button.tsx:24`). O EPIC define o público como "vizinhos do bairro, no celular, com pressa". Quatro botões de 32 px lado a lado, com `gap` pequeno, atendem o mínimo da WCAG 2.5.8 (24 px), mas ficam abaixo dos 44 px recomendados para toque. O passo 3 não define `size`, e o PLAN não trata o caso dos 375 px (quatro botões mais a contagem num `flex-wrap`, com a contagem podendo cair sozinha numa segunda linha).

**Âncoras:** `src/components/ui/button.tsx:24-27` · `PLAN-01 passo 3` · `EPIC §Para quem`

**Sugestão:** usar `size="lg"` (`h-9`) nos quatro botões com `gap-2`, e pôr a contagem num elemento à parte da linha de botões (por exemplo, `basis-full sm:basis-auto`), para que em 375 px ela fique numa linha própria e previsível. O `button.tsx` não se edita (DS-04).

**Afeta:** PLAN-01 passo 3

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                    | Desfecho  | Artefatos afetados                                     |
| ---- | ------------------------- | --------- | ------------------------------------------------------ |
| Q1.1 | Código existente          | ✅ Aceito | PLAN-01 (passo 4, Pontos de Atenção, Incertezas)       |
| Q2.1 | Coerência TASK ↔ PLAN     | ✅ Aceito | TASK §cabeçalho, §P3; PLAN-01 (Premissas, Atenção)     |
| Q3.1 | Premissas declaradas      | ✅ Aceito | TASK §I1; PLAN-01 (passo 3, Incertezas)                |
| Q3.2 | Premissas declaradas      | ✅ Aceito | TASK §I2; PLAN-01 (passo 2, Incertezas)                |
| Q4.1 | Premissas não declaradas  | ✅ Aceito | TASK §Comportamento 2; PLAN-01 passo 3                 |
| Q4.2 | Premissas não declaradas  | ✅ Aceito | PLAN-01 passo 3                                        |
| Q5.1 | Cenários esquecidos       | ✅ Aceito | PLAN-01 passo 3                                        |

## Decisões

### Q1.1 — Âncora do Passo 4 aponta para as linhas erradas e a correção fica sem forma definida

**Decisão:** âncora corrigida para `products-section.test.tsx:51-53`. A asserção passa a contar só os badges, com `getAllByText(rótulo, { selector: '[data-slot="badge"]' })`, sem tocar a seção.

**Impacto:** `PLAN-01` passo 4 e §Pontos de Atenção reescritos; Incerteza 3 do PLAN removida.

### Q2.1 — FOR-014 deveria vir antes, mas não está no `main`, e o PLAN reescreve a P3 da TASK em silêncio

**Decisão:** o FOR-012 segue sem esperar o FOR-014, e a inversão de ordem fica registrada como deliberada. A P3 continua válida por construção, porque `filterProducts` filtra só por `category`. O conflito previsto em `content/products-section.ts` fica anotado para quem fizer o merge depois.

**Impacto:** `TASK.md` §cabeçalho e §P3 atualizados; `PLAN-01` §Premissas 3 reescrita e §Pontos de Atenção com o aviso de conflito.

### Q3.1 — I1: com `aria-live`, a contagem pode ser anunciada pela metade

**Decisão:** a contagem usa `aria-live="polite"` e `aria-atomic="true"` e é montada como uma única string (`` `${n} ${word}` ``), para o anúncio sair sempre completo.

**Impacto:** `PLAN-01` passo 3 atualizado; I1 marcada como decidida na TASK e no PLAN.

### Q3.2 — I2: o grupo com rótulo usa um texto que ninguém aprovou

**Decisão:** fica o `role="group"` com `aria-label="Filtrar por categoria"`, texto aprovado.

**Impacto:** I2 marcada como decidida na TASK e no PLAN; referência do `PLAN-01` passo 2 atualizada.

### Q4.1 — Clicar no botão que já está ativo: nada declarado

**Decisão:** clicar no botão ativo não faz nada. Sempre há exatamente um `aria-pressed="true"`, e só "Todos" volta à lista completa.

**Impacto:** `TASK.md` §Comportamento Esperado 2 e `PLAN-01` passo 3 atualizados.

### Q4.2 — Ordem e lista de categorias escritas à mão, desacopladas de `ProductCategory`

**Decisão:** as opções vêm de `Object.keys(categoryLabels) as ProductCategory[]`, depois de `"all"`. `categoryLabels` não muda.

**Impacto:** `PLAN-01` passo 3 atualizado.

### Q5.1 — Alvo de toque de 32 px para um público "no celular, com pressa"

**Decisão:** os botões usam `size="lg"` com `gap-2`. A contagem fica num elemento à parte (`basis-full sm:basis-auto`) e, em 375 px, ganha linha própria.

**Impacto:** `PLAN-01` passo 3 atualizado.

## Incertezas abertas

Nenhuma.

## Alterações aplicadas

| Arquivo                           | O que mudou                                                                                | Origem           |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ---------------- |
| `TASK.md`                         | §cabeçalho: inversão de ordem com o FOR-014 registrada                                     | Q2.1             |
| `TASK.md`                         | §Comportamento Esperado 2: clicar no ativo não faz nada                                    | Q4.1             |
| `TASK.md`                         | §P3: válida por construção; §I1 e §I2 marcadas como decididas                              | Q2.1, Q3.1, Q3.2 |
| `plans/PLAN-01-category-filter.md` | passo 2: referência ao grupo decidido                                                     | Q3.2             |
| `plans/PLAN-01-category-filter.md` | passo 3: opções derivadas, clique no ativo, `size="lg"`, contagem atômica em linha própria | Q3.1, Q4.1, Q4.2, Q5.1 |
| `plans/PLAN-01-category-filter.md` | passo 4: âncora `:51-53` e `selector: '[data-slot="badge"]'`                              | Q1.1             |
| `plans/PLAN-01-category-filter.md` | §Pontos de Atenção: âncora corrigida e conflito previsto com o FOR-014                    | Q1.1, Q2.1       |
| `plans/PLAN-01-category-filter.md` | §Premissas 3 reescrita; §Incertezas trocadas por decisões                                 | Q2.1, Q3.1, Q3.2, Q1.1 |
