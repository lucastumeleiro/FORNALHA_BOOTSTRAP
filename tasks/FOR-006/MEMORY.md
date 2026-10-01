# MEMORY — FOR-006: Copy do cardápio

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                  | Status      | Observações |
| --------------------- | ----------- | ----------- |
| PLAN-01-copy-cardapio | ✅ Concluído | Onda 1 (única). Seis `description` em `src/data/products.ts` e `subtitle` em `src/content/products-section.ts`, textos copiados do PLAN. Contagens 13/12/10/9/11/11 e subtítulo 10. typecheck, test e check:cores limpos. Sem desvios. |

## Contratos Disponíveis

_Nenhum contrato exportado_ — tipos e chaves não mudaram. FOR-014 consome a copy final; nomes e preços intactos.

## Bloqueios Ativos

_Nenhum._
