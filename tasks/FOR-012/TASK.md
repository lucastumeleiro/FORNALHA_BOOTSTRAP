# [FEATURE] FOR-012 — Filtro do cardápio por categoria

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** componente + lógica pura · **Depende de:** — · **Vem depois de:** FOR-004 (`products-section.tsx`, se a correção tocar ali), FOR-014 (`content/products-section.ts`) · **Pode rodar em paralelo com:** FOR-013, FOR-015 · **Precede:** —

> **Ordem invertida de propósito (Fase 3, Q2.1):** o FOR-012 entra antes do FOR-014, que ainda não está no `main`. O merge do que vier depois deve resolver o conflito previsto em `src/content/products-section.ts`.

## Contexto

Hoje são seis produtos, e o plano é chegar a trinta. "Pães", "Doces" e "Bebidas" ajudam quem só quer café.

## Comportamento Esperado

1. Função pura `filterProducts(products, category)` em `src/lib/filter-products.ts`, com `category` sendo uma `ProductCategory` ou `"all"`.
2. Acima da grade, quatro botões feitos com o `Button` que já existe: "Todos", "Pães", "Doces" e "Bebidas". O ativo usa a variante default e tem `aria-pressed="true"`; os demais usam `outline`. Clicar no botão que já está ativo não faz nada: sempre há exatamente um ativo, e "Todos" é o único jeito de voltar à lista completa (Q4.1).
3. "Todos" é o filtro inicial. A contagem aparece ao lado ("3 produtos"), com singular e plural certos.

## Arquivos/Módulos Afetados

- `src/lib/filter-products.ts` (novo)
- `src/sections/products-section.tsx`
- `src/content/products-section.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado o filtro "Pães", então aparecem só os três pães e "3 produtos".
- [ ] **CA-2** — Dado o filtro "Bebidas", então aparece um produto e "1 produto", no singular.
- [ ] **CA-3** — Dado o filtro "Todos", então aparecem os seis.
- [ ] **CA-4** — Dado o botão ativo, então ele tem `aria-pressed="true"` e os demais, `false`.

## Fora de escopo

Busca por texto, ordenação, filtro na URL.

## Premissas e Incertezas

**Premissas**

- P1 — Os rótulos dos botões reusam `categoryLabels` de `content/products-section.ts`, mais o rótulo "Todos".
- P2 — O filtro é `useState` local na seção e não sobrevive a um recarregamento.
- P3 — Produtos esgotados continuam na grade e entram na contagem. Vale por construção: `filterProducts` filtra só por `category`, então o `available` do FOR-014, quando entrar, não afeta o filtro (Q2.1).

**Incertezas**

- I1 — ~~Se a contagem é anunciada a leitor de tela quando o filtro muda (`aria-live`).~~ **Decidida (Q3.1):** é anunciada, com `aria-live="polite"` + `aria-atomic="true"`, como uma única string.
- I2 — ~~Se os quatro botões ficam num grupo com rótulo (`role="group"` + `aria-label`) ou soltos.~~ **Decidida (Q3.2):** ficam num grupo, com `role="group"` e `aria-label="Filtrar por categoria"`.
