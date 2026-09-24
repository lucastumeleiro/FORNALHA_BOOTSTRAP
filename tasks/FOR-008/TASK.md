# [FEATURE] FOR-008 — Tema escuro com alternância

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** componente · **Depende de:** — · **Vem depois de:** FOR-004 (`content/header.ts`) · **Pode rodar em paralelo com:** FOR-007, FOR-009 · **Precede:** FOR-015, FOR-017

## Contexto

Os tokens `.dark` existem desde o bootstrap, mas não há como ligá-los.

## Comportamento Esperado

1. `ThemeProvider` no padrão do guia de dark mode do shadcn para Vite: tema `light`, `dark` ou `system`; classe `dark` no `<html>`; persistência em `localStorage` na chave `fornalha-theme`.
2. `ThemeToggle` no cabeçalho: botão só com ícone (`Sun`/`Moon`) que alterna entre claro e escuro, com `aria-label` em `content/header.ts`.
3. A primeira visita segue o sistema (`prefers-color-scheme`).

## Arquivos/Módulos Afetados

- `src/components/theme-provider.tsx` (novo)
- `src/components/theme-toggle.tsx` (novo)
- `src/sections/site-header.tsx`
- `src/content/header.ts`
- `src/main.tsx`

## Critérios de Aceite

- [ ] **CA-1** — Dado a primeira visita com o sistema em modo escuro, então a página abre escura.
- [ ] **CA-2** — Dado o botão, quando clico, então o tema alterna e o `<html>` ganha ou perde a classe `dark`.
- [ ] **CA-3** — Dado que escolhi o escuro, quando recarrego, então continua escuro.
- [ ] **CA-4** — Dado só o teclado, então chego ao botão com `Tab`, vejo o foco e alterno com `Enter` ou `Espaço`.

## Fora de escopo

Menu com a opção "sistema", evitar o piscar do tema no carregamento.

## Premissas e Incertezas

**Premissas**

- P1 — O provider aceita `system`, mas o botão só alterna entre claro e escuro; depois do primeiro clique a escolha fica explícita.
- P2 — Os tokens `.dark` de `src/index.css` bastam; nenhuma cor muda nesta task.
- P3 — O `ThemeProvider` envolve a árvore em `main.tsx`, como a lista de arquivos indica.

**Incertezas**

- I1 — Se o `aria-label` é fixo ("Alternar tema") ou descreve o próximo estado ("Ativar tema escuro").
- I2 — Com o tema em `system`, se o primeiro clique vai para o oposto do tema que está na tela ou sempre para o escuro.
