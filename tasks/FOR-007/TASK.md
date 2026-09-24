# [FEATURE] FOR-007 — Horários e endereço

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** design (estrutural) · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-008, FOR-009 · **Precede:** FOR-010 (`App.tsx`)

## Contexto

A pergunta mais comum no WhatsApp é "que horas abre?", e a página não responde.

## Comportamento Esperado

1. Seção nova "Horários e endereço" (`id="horarios"`), entre o Cardápio e o rodapé.
2. Os sete dias, de segunda a domingo, com os horários do EPIC; segunda aparece como "Fechado".
3. O dia de hoje aparece destacado, com `aria-current="date"`.
4. Endereço com o link "Como chegar" para `https://www.google.com/maps/search/?api=1&query=<endereço codificado>`, em nova aba.

## Arquivos/Módulos Afetados

- `src/sections/hours-section.tsx` (novo)
- `src/content/hours.ts` (novo)
- `src/App.tsx`

## Critérios de Aceite

- [ ] **CA-1** — Dado a página, então a seção aparece entre o Cardápio e o rodapé, com os sete dias em ordem.
- [ ] **CA-2** — Dado a linha de segunda, então ela diz "Fechado".
- [ ] **CA-3** — Dado que hoje é sábado, então a linha de sábado está destacada e tem `aria-current="date"`.
- [ ] **CA-4** — Dado o "Como chegar", então ele abre o Google Maps com o endereço, em nova aba e com `rel="noopener noreferrer"`.
- [ ] **CA-5** — Dado 375 px, então a seção não cria rolagem horizontal.

## Fora de escopo

Mapa embutido, feriados, item no menu.

## Premissas e Incertezas

**Premissas**

- P1 — "Hoje" é o dia da semana do relógio do navegador, no fuso local.
- P2 — A lista começa na segunda, embora `Date.getDay()` comece no domingo.
- P3 — O endereço é o mesmo do rodapé e fica também em `content/hours.ts`, sem tocar no rodapé.

**Incertezas**

- I1 — Se o destaque considera também a hora (aberto agora ou fechado agora) ou só o dia.
- I2 — Se os sete dias ficam numa tabela (`<table>`) ou numa lista de definição (`<dl>`).
