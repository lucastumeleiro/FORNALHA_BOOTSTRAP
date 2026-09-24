# [BUG] FOR-003 — Preço em reais

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** bug + componente · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-001, FOR-002 · **Precede:** FOR-014

## Contexto

O cardápio mostra `R$ 12.50` e `R$ 28.00`, com ponto decimal, no formato americano.

## Comportamento Esperado

1. Função pura `formatPrice(value: number): string` em `src/lib/format-price.ts`, com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
2. Componente `PriceTag` (`src/components/price-tag.tsx`) que mostra o preço formatado em destaque (`font-semibold`, `tabular-nums`).
3. O `ProductCard` usa o `PriceTag`.

## Arquivos/Módulos Afetados

- `src/lib/format-price.ts` (novo)
- `src/components/price-tag.tsx` (novo)
- `src/components/product-card.tsx`

## Critérios de Aceite

- [ ] **CA-1** — Dado o croissant (12,5), então o card mostra `R$ 12,50`.
- [ ] **CA-2** — Dado o pão de fermentação natural (28), então `R$ 28,00`, sempre com duas casas.
- [ ] **CA-3** — Dado `formatPrice(1234.5)`, então `R$ 1.234,50`.
- [ ] **CA-4** — Dado o diff, então não sobra nenhum `toFixed` em `src/`.

## Fora de escopo

Produtos novos, preço promocional.

## Premissas e Incertezas

**Premissas**

- P1 — O preço chega em reais como `number` (não em centavos), como está em `src/data/products.ts`.
- P2 — O `PriceTag` recebe o valor numérico por prop e formata com `formatPrice`.
- P3 — O espaço entre `R$` e o número é o que o `Intl` gera (espaço não separável), e isso conta como `R$ 12,50`.

**Incertezas**

- I1 — Qual elemento o `PriceTag` renderiza: `<span>`, `<p>` ou `<data value="…">`.
- I2 — Se o `Intl.NumberFormat` é criado uma vez no módulo ou a cada chamada.
