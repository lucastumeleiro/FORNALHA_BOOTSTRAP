# MEMORY — FOR-003: Preço em reais

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                       | Status      | Observações |
| --------------------------- | ----------- | ----------- |
| PLAN-01-preco-em-reais       | ✅ Concluído | Onda 1 (PLAN único) — `frontend-agent`. Sem desvios. `typecheck`, `build`, `test` e `check:cores` com exit 0; CA-4 conferido (0 `toFixed` em `src/`). |

## Contratos Disponíveis

- `formatPrice(value: number): string` — `src/lib/format-price.ts` (PLAN-01). Export nomeado; `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` criado uma vez no escopo do módulo. Saída usa espaço não separável (U+00A0) entre `R$` e o número.
- `PriceTag` (prop `value: number`) — `src/components/price-tag.tsx` (PLAN-01). Renderiza `<data value={String(value)} className="font-semibold tabular-nums">`; **sem cor própria** (herda do contexto — mantém FOR-014 desbloqueado, Q5.1). Único filho de `CardContent` em `ProductCard` (Q1.1).

## Bloqueios Ativos

_Nenhum._
