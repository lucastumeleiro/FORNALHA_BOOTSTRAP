---
name: design-system
description: Aparência do site da Fornalha — tokens de cor do shadcn nos dois temas, classes semânticas, como primitivo e fonte entram, contraste e foco. Invocar em todo PLAN que crie ou altere componente, seção, src/index.css, fonte ou tema.
---

# Design system — Fornalha

O tema é o do shadcn: variáveis CSS em `src/index.css` (`:root` para o claro, `.dark` para o escuro), mapeadas para o Tailwind no bloco `@theme inline`. O componente pede **papel** (`bg-primary`, `text-muted-foreground`, `border-border`), nunca **tom**. Por isso trocar a cor da marca é editar tokens, e nenhum componente muda.

## Como as coisas entram

- **Cor nova:** variável em `:root` **e** em `.dark`, mais a linha `--color-<nome>: var(--<nome>)` no `@theme inline`. Formato `oklch()`, como o shadcn gera.
- **Fonte:** pacote `@fontsource-variable/*` importado em `src/index.css`, com a família exposta como token `--font-*` no `@theme inline`.
- **Primitivo novo:** `npx shadcn@latest add <nome>`, que gera em `src/components/ui/` e instala a dependência. Não se escreve à mão nem se copia de outro projeto.
- **Variante:** `cva` no componente da casa, com um grupo por eixo.
- **Tema escuro:** classe `dark` no `<html>`, como no guia do shadcn para Vite. Nada de `prefers-color-scheme` espalhado por componente.
- **Canvas/mockup** aprovado na Fase 2 define arranjo e hierarquia. Cor, espaçamento e raio vêm daqui; em divergência, o token ganha.

## Regras verificáveis

### DS-01 — Cor literal só em `src/index.css`

**Bloqueia:** sim
**Verificação:** `npm run check:cores`

Hex, `rgb()`, `hsl()` ou `oklch()` fora da folha de tokens é violação, inclusive em `style=`.

### DS-02 — Classe de cor é semântica, nunca paleta de fábrica nem valor arbitrário

**Bloqueia:** sim
**Verificação:** `npm run check:cores`

`bg-primary` ✅ · `bg-orange-600` ❌ · `bg-[#c2410c]` ❌ · `text-white` ❌ (o certo é `text-primary-foreground`).

### DS-03 — Token novo existe nos dois temas e no `@theme inline`

**Bloqueia:** sim
**Verificação:** julgamento

### DS-04 — `src/components/ui/` sai do CLI; ajuste de aparência se faz no componente da casa ou no token

**Bloqueia:** sim
**Verificação:** julgamento

### DS-05 — Texto sobre cor de marca tem contraste ≥ 4,5:1 (≥ 3:1 se tiver 24 px ou mais) nos dois temas

**Bloqueia:** sim
**Verificação:** julgamento

O PLAN que muda cor registra os pares medidos (DevTools → contraste), e o `TEST.md` confere.

### DS-06 — Elemento interativo tem foco visível (o `ring` do tema) e nome acessível

**Bloqueia:** sim
**Verificação:** julgamento

Botão só com ícone leva `aria-label`, com o texto em `src/content/` (AR-01).
