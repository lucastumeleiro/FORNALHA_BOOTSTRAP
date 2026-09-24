# [FEATURE] FOR-015 — Menu no celular

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** design (responsivo) + primitivo · **Depende de:** — · **Vem depois de:** FOR-008 (`site-header.tsx`, `content/header.ts`), FOR-010 (lockfile) · **Pode rodar em paralelo com:** FOR-012, FOR-013 · **Precede:** FOR-016 (lockfile), FOR-017

## Contexto

Em 375 px, os itens do menu ficam espremidos ao lado da marca.

## Comportamento Esperado

1. `npx shadcn@latest add sheet`.
2. Abaixo de 768 px, a navegação some e aparece o botão "Abrir menu" (ícone `Menu`), que abre um `Sheet` lateral com os mesmos itens de `content/header.ts` e o alternador de tema.
3. Clicar num item fecha o `Sheet` e navega; `Esc` fecha; o foco volta ao botão.
4. A partir de 768 px, fica como hoje.

## Arquivos/Módulos Afetados

- `src/components/ui/sheet.tsx` (gerado)
- `src/components/mobile-nav.tsx` (novo)
- `src/sections/site-header.tsx`
- `src/content/header.ts`
- `package.json` e lockfile (se mudarem)

## Critérios de Aceite

- [ ] **CA-1** — Dado 375 px, então o cabeçalho mostra só a marca e o botão de menu.
- [ ] **CA-2** — Dado o menu aberto, quando clico em "Cardápio", então o `Sheet` fecha e a página vai à seção.
- [ ] **CA-3** — Dado o menu aberto, quando aperto `Esc`, então ele fecha e o foco volta ao botão.
- [ ] **CA-4** — Dado 1280 px, então a navegação aparece em linha e não há botão de menu.

## Fora de escopo

Cabeçalho fixo ao rolar, animação própria.

## Premissas e Incertezas

**Premissas**

- P1 — 768 px é o breakpoint `md` do Tailwind.
- P2 — O `ThemeToggle` da FOR-008 é reusado dentro do `Sheet`, sem duplicar lógica.
- P3 — O rótulo "Abrir menu" e o título do `Sheet` ficam em `content/header.ts`.

**Incertezas**

- I1 — Se o título do `Sheet` (o Radix pede um) fica visível ou só para leitor de tela.
- I2 — Como o clique no item fecha o `Sheet`: `SheetClose` envolvendo o link ou estado controlado.
