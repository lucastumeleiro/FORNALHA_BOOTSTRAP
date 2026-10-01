# MEMORY — FOR-010: Perguntas frequentes

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN         | Status       | Observações                                                                                                                                      |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| PLAN-01-faq  | ✅ Concluído | Onda 1. typecheck, build, test e check:cores passaram. `package.json` e lockfile não mudaram. Subtítulo segue provisório (Incerteza 3 do PLAN). |

## Contratos Disponíveis

- `FaqSection` — `src/sections/faq-section.tsx`
- `faqContent` e tipo `FaqItem` — `src/content/faq.ts`
- `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` — `src/components/ui/accordion.tsx` (gerado pelo CLI, sem edição)

## Decisões de execução

- `type="single" collapsible`, sem valor inicial (Incerteza 1 do PLAN, default).
- Cada pergunta é um `h3` sob o `h2` da seção, porque o `AccordionTrigger` gerado usa `AccordionPrimitive.Header` (Incerteza 2).
- Subtítulo "O que mais perguntam por aqui." é provisório e precisa de confirmação.
- A Fase 3 (`/question`) foi pulada pela pessoa; não há `QUESTION.md`.

## Bloqueios Ativos

_Nenhum._
