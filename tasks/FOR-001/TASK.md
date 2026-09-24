# [FEATURE] FOR-001 — Paleta terracota

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** cor · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-002, FOR-003 · **Precede:** FOR-009

## Contexto

O site usa a paleta neutra de fábrica do shadcn. A marca é terracota (EPIC §Marca).

## Comportamento Esperado

1. `--primary` passa a ser terracota nos dois temas, e `--primary-foreground` garante contraste.
2. `--ring` acompanha o primário, para o foco aparecer na cor da marca.
3. Nenhum componente muda; só tokens.

## Arquivos/Módulos Afetados

- `src/index.css`

## Critérios de Aceite

- [ ] **CA-1** — Dado o tema claro, quando abro a página, então o botão do hero aparece em terracota.
- [ ] **CA-2** — Dado o tema escuro (classe `dark` no `<html>`, pelo DevTools), então o primário é um terracota mais claro, legível sobre o fundo escuro.
- [ ] **CA-3** — Dado o botão primário, então o contraste entre texto e fundo é ≥ 4,5:1 nos dois temas, com os pares medidos registrados no PLAN.
- [ ] **CA-4** — Dado o repositório, quando rodo `npm run check:cores`, então há 0 violações, e o diff só toca `src/index.css`.

## Fora de escopo

Fundo creme, fontes, alternador de tema (FOR-008).

## Premissas e Incertezas

**Premissas**

- P1 — O tom exato de terracota fica a critério do PLAN, desde que cumpra o contraste do CA-3.
- P2 — Só `--primary`, `--primary-foreground` e `--ring` mudam; fundo, borda, secundário e os demais tokens continuam neutros.
- P3 — O tema escuro se confere pondo a classe `dark` no `<html>` pelo DevTools, porque o alternador ainda não existe.

**Incertezas**

- I1 — Se `--sidebar-primary`, `--sidebar-ring` e `--chart-*` acompanham o primário, embora a página não use sidebar nem gráfico.
- I2 — Se `--accent` ganha um toque terracota ou continua neutro.
