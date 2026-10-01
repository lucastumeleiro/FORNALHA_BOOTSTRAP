# MEMORY — FOR-007: Horários e endereço

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                  | Status       | Observações                                                                                                                 |
| --------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| PLAN-01-hours-section | ✅ Concluído | Onda 1 (única). Sem desvios. `typecheck`, `npm test` (21 testes) e `check:cores` com exit 0, conferidos pelo orquestrador. |

## Contratos Disponíveis

- `getWeekdayIndex(date: Date): number` — `src/lib/weekday.ts` (segunda = 0 … domingo = 6, horário local)
- `buildMapsUrl(address: string): string` — `src/lib/maps.ts`
- `hoursContent` e o tipo `HoursDay = { label: string; hours: string; closed?: true }` — `src/content/hours.ts` (`days` tipado como `readonly HoursDay[]` para `day.closed` passar no typecheck)
- `HoursSection` — `src/sections/hours-section.tsx`; montada em `src/App.tsx` como a última dentro de `<main>` (uma linha de import e uma de JSX; FOR-010 mexe em `App.tsx` depois)

## Pendências para as fases seguintes

- Fase 6a (TEST.md): cenário "hoje = segunda" (CA-2 + CA-3 juntos, `<dd>` em `text-foreground` sobre `bg-primary/10`, nos dois temas), 375 px sem rolagem horizontal.
- Fase 6b (autotest): teste A `closed` ⇒ `hours === "Fechado"`; teste A `hoursContent.address === footerContent.address`; CA-3 com `vi.setSystemTime` e `getByText("Sábado").closest("[aria-current]")`.

## Bloqueios Ativos

_Nenhum._
