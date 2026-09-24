# [FEATURE] FOR-014 — Selo "Esgotado"

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** componente · **Depende de:** — · **Vem depois de:** FOR-003 (`product-card.tsx`), FOR-006 (`products.ts`, `content/products-section.ts`) · **Pode rodar em paralelo com:** FOR-010, FOR-011 · **Precede:** FOR-012

## Contexto

A focaccia acaba cedo, e o site não avisa.

## Comportamento Esperado

1. Campo `available: boolean` em `Product`: a focaccia é `false` e os demais, `true`.
2. No card indisponível: selo "Esgotado" (`Badge` na variante `outline`), nome e preço em `text-muted-foreground`, e o estado anunciado a leitor de tela.
3. O produto continua na grade, na mesma posição.

## Arquivos/Módulos Afetados

- `src/data/products.ts`
- `src/components/product-card.tsx`
- `src/content/products-section.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado a focaccia, então ela mostra o selo "Esgotado" e o texto esmaecido.
- [ ] **CA-2** — Dado os demais produtos, então nenhum mostra o selo.
- [ ] **CA-3** — Dado a árvore de acessibilidade do DevTools, então o card da focaccia expõe "Esgotado".
- [ ] **CA-4** — Dado o `npm run typecheck`, então ele passa, porque todo produto declara `available`.

## Fora de escopo

Esgotar por horário, estoque real.

## Premissas e Incertezas

**Premissas**

- P1 — `available` é obrigatório no tipo (não opcional); é isso que faz o `typecheck` acusar produto sem o campo.
- P2 — O texto "Esgotado" fica em `content/products-section.ts` e chega ao card por prop.
- P3 — O card não tem botão nem ação, então não há nada a desabilitar.

**Incertezas**

- I1 — Como o estado é anunciado: pelo texto visível do selo, lido junto do nome, ou por texto só para leitor de tela.
- I2 — Se o esmaecido do preço vem de uma prop do `PriceTag` (FOR-003) ou de uma classe aplicada pelo card.
