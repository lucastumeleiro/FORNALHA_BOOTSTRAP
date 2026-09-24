---
name: arquitetura
description: Onde cada coisa mora no site da Fornalha (SPA React + Vite) — seções, conteúdo, dados, componentes, funções puras e ambiente. Invocar em todo PLAN e antes de criar arquivo novo.
---

# Arquitetura — Fornalha

Uma página só, sem backend. O código se separa pelo que a pessoa vê (a seção) e pelo que muda sozinho (texto, dados, lógica). Assim uma task de copy não toca em componente e uma task de cor não toca em texto.

| Caminho                     | Mora aqui                                                       | Não mora aqui                  |
| --------------------------- | --------------------------------------------------------------- | ------------------------------ |
| `src/App.tsx`               | a ordem das seções e os landmarks da página                     | lógica, texto                  |
| `src/sections/<nome>.tsx`   | uma seção, com o `id` da âncora                                 | texto literal                  |
| `src/content/<secao>.ts`    | todo texto visível da seção, inclusive `aria-label` e mensagens | JSX                            |
| `src/data/products.ts`      | o cardápio e seus tipos                                         | texto de interface             |
| `src/components/<nome>.tsx` | componente da casa reutilizável; recebe dados por prop          | import de valor de `src/data/` |
| `src/components/ui/`        | primitivos do shadcn, gerados pelo CLI                          | edição à mão                   |
| `src/lib/<nome>.ts`         | função pura: formatar, filtrar, validar, montar URL             | React, DOM, `import.meta.env`  |

Seção nova se chama `<nome>-section.tsx`; as quatro do bootstrap (`site-header`, `hero`, `products-section`, `site-footer`) ficam como estão.

## Regras verificáveis

### AR-01 — Texto visível mora em `src/content/`, nunca literal no JSX

**Bloqueia:** sim
**Verificação:** julgamento

Inclui `aria-label`, `alt`, placeholder e mensagem de erro. Exceção: nome e preço de produto, que vêm de `src/data/`.

### AR-02 — Seção nova é um arquivo em `src/sections/`, um em `src/content/` e uma linha em `App.tsx`

**Bloqueia:** não
**Verificação:** julgamento

### AR-03 — Lógica com regra é função pura em `src/lib/`

**Bloqueia:** não
**Verificação:** julgamento

Pura quer dizer sem React, sem DOM e sem `import.meta.env`: o que ela precisa chega por parâmetro. É isso que a torna teste de categoria A.

### AR-04 — Sem backend, sem `fetch`, sem roteador, sem estado global

**Bloqueia:** sim
**Verificação:** julgamento

O estado é `useState` local; a navegação é por âncora (`#id`). Dependência nova só entra se a TASK pedir ou o PLAN justificar.

### AR-05 — Ambiente só por `import.meta.env.VITE_*`, tipado, com a ausência tratada

**Bloqueia:** sim
**Verificação:** julgamento

Variável nova entra no `.env.example`, sem valor real, e na tipagem de `ImportMetaEnv`. A página funciona sem `.env`, porque o worktree nasce sem ele.

### AR-06 — Import por `@/`, nunca `../../`

**Bloqueia:** não
**Verificação:** julgamento

### AR-07 — Arquivo de produção com até 150 linhas

**Bloqueia:** não
**Verificação:** julgamento

Se passar, a seção se divide em componentes em `src/components/`.
