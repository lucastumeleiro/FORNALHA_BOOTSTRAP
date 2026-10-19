# MEMORY — FOR-012: Filtro do cardápio por categoria

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                    | Status       | Observações                                                                                                                                         |
| ----------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| PLAN-01-category-filter | ✅ Concluído | Onda 1. `npm test` (21 verdes), `npm run typecheck` e `npm run check:cores` verdes, conferidos pelo orquestrador. Desvio de espaçamento: ver abaixo. |

## Contratos Disponíveis

- `type ProductFilter = ProductCategory | "all"` em `src/lib/filter-products.ts`
- `function filterProducts(products: Product[], category: ProductFilter): Product[]` em `src/lib/filter-products.ts` (preserva a ordem; `"all"` devolve uma cópia; não muta a entrada)
- `productsSectionContent.allLabel`, `.filterGroupLabel` e `.productCount` (`{ one, other }`) em `src/content/products-section.ts`

## Desvios

- Grade de `ProductsSection` passou de `mt-8` para `mt-6`, para acomodar a linha de filtros entre o subtítulo e a grade. Só espaçamento; o PLAN dizia que a grade ficava como está.

## Bloqueios Ativos

_Nenhum._
