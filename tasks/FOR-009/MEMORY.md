# MEMORY — FOR-009: Títulos com serifa

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                      | Status      | Observações |
| ------------------------- | ----------- | ----------- |
| PLAN-01-fonte-titulos     | ✅ Concluído | Onda 1 (única). `@fontsource-variable/fraunces@^5.3.0`; typecheck, test (21), build e check:cores com exit 0; CA-3 ok no `git diff --stat`; `.woff2` opsz no `dist`, sem host externo. Sem desvios. |

## Contratos Disponíveis

_Nenhum contrato exportado._ O token `--font-heading` (já existente) agora aponta para `'Fraunces Variable', ui-serif, Georgia, serif`; `h1`–`h3` o aplicam pelo `@layer base`.

## Bloqueios Ativos

_Nenhum._
