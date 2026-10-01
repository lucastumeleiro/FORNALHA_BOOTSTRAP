# [FEATURE] FOR-006 — Copy do cardápio

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** copy · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-004, FOR-005 · **Precede:** FOR-014

## Contexto

Os seis produtos dizem "Descrição em breve.", e a seção diz "Conheça nossos produtos."

## Comportamento Esperado

1. Uma descrição por produto, com 8 a 18 palavras e um detalhe concreto (ingrediente, tempo, textura) coerente com o EPIC.
2. O subtítulo da seção é reescrito, com até 12 palavras.
3. Nomes e preços não mudam.

## Arquivos/Módulos Afetados

- `src/data/products.ts` (só o campo `description`)
- `src/content/products-section.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado cada card, então a descrição tem de 8 a 18 palavras e nenhuma é "Descrição em breve.".
- [ ] **CA-2** — Dado o conjunto, então nenhuma descrição repete a estrutura de outra (por exemplo, todas começando com "Feito com…") e nenhuma usa superlativo vazio.
- [ ] **CA-3** — Dado o diff de `products.ts`, então só o campo `description` mudou.

## Fora de escopo

Fotos, produtos novos.

## Premissas e Incertezas

**Premissas**

- P1 — O detalhe concreto vem do EPIC (fermentação de 36 horas, farinha orgânica de moinho de pedra, fornadas) ou do que o nome do produto já diz (centeio, alecrim, manteiga, laranja).
- P2 — O limite de 8 a 18 palavras vale para cada descrição isolada.
- P3 — O título "Cardápio" e os rótulos de categoria (`categoryLabels`) não mudam.

**Incertezas**

- I1 — ~~Se a descrição do café coado pode citar origem ou torra, que o EPIC não menciona.~~ **Resolvida (Q3.1):** não cita origem nem torra; seria fato fora do EPIC.
- I2 — ~~Se o subtítulo novo fala das fornadas (horário) ou da fermentação.~~ **Resolvida (Q3.2, Q5.1):** fala da fermentação, sem horário de fornada (a das 16h não existe no fim de semana) e sem repetir "36 horas", que já é o título do Hero.
