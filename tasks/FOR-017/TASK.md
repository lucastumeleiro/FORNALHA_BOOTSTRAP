# [FEATURE] FOR-017 — Acessibilidade básica

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** acessibilidade · **Depende de:** — · **Vem depois de:** FOR-015 (`site-header.tsx`), FOR-016 (`App.tsx`) · **Pode rodar em paralelo com:** — · **Precede:** —

## Contexto

A página declara `lang="en"`, a aba mostra o título do template e não há atalho para o conteúdo.

## Comportamento Esperado

1. No `index.html`: `lang="pt-BR"`, `<title>Fornalha — padaria de fermentação natural</title>` e um `<meta name="description">` baseado no EPIC.
2. Link "Pular para o conteúdo" como primeiro elemento focável, visível só com foco, levando a `<main id="conteudo">`.
3. Cabeçalho em `<header>`, navegação em `<nav aria-label="Principal">` e rodapé em `<footer>`. Conferir e corrigir o que faltar.

## Arquivos/Módulos Afetados

- `index.html`
- `src/App.tsx`
- `src/sections/site-header.tsx`
- `src/content/header.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado a aba do navegador, então ela mostra "Fornalha — padaria de fermentação natural".
- [ ] **CA-2** — Dado o `<html>`, então ele tem `lang="pt-BR"`.
- [ ] **CA-3** — Dado o primeiro `Tab`, então aparece "Pular para o conteúdo", e `Enter` leva o foco para o `<main>`.
- [ ] **CA-4** — Dado o painel de acessibilidade do DevTools, então existem os landmarks banner, navigation "Principal", main e contentinfo.

## Fora de escopo

Auditoria WCAG completa, Lighthouse.

## Premissas e Incertezas

**Premissas**

- P1 — O texto "Pular para o conteúdo" e o rótulo "Principal" ficam em `content/header.ts`; o texto do `index.html` fica no próprio `index.html`.
- P2 — O `<main>` recebe `tabIndex={-1}` para poder receber o foco do atalho.
- P3 — O `<meta name="description">` usa só fatos do EPIC.

**Incertezas**

- I1 — Onde o atalho mora: no começo de `site-header.tsx` ou em `App.tsx`, antes do cabeçalho.
- I2 — Se a navegação do menu móvel (FOR-015) também é um `<nav>` e, nesse caso, qual rótulo recebe para não haver duas navegações "Principal".
