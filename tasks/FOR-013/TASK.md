# [FEATURE] FOR-013 — Quem já provou

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** design (estrutural) · **Depende de:** — · **Vem depois de:** FOR-010 (`App.tsx`) · **Pode rodar em paralelo com:** FOR-012, FOR-015 · **Precede:** FOR-016

## Contexto

Falta prova social: três clientes (fictícios) falando de um produto específico.

## Comportamento Esperado

1. Seção "Quem já provou" (`id="depoimentos"`), logo depois do Cardápio.
2. Três cards (o `Card` que já existe) com a citação, o nome e o bairro, e as iniciais num círculo `bg-secondary`.
3. Três colunas a partir de 1024 px; uma coluna abaixo disso.
4. Os textos são escritos por esta task, na voz do EPIC, e cada depoimento cita um produto do cardápio pelo nome.

## Arquivos/Módulos Afetados

- `src/sections/testimonials-section.tsx` (novo)
- `src/content/testimonials.ts` (novo)
- `src/App.tsx`

## Critérios de Aceite

- [ ] **CA-1** — Dado a página, então aparecem três depoimentos logo depois do Cardápio.
- [ ] **CA-2** — Dado cada depoimento, então ele cita pelo nome um produto que existe em `src/data/products.ts`.
- [ ] **CA-3** — Dado 375 px, então uma coluna, sem rolagem horizontal; dado 1280 px, então três colunas.
- [ ] **CA-4** — Dado o markup, então cada depoimento é um `<figure>` com `<blockquote>` e `<figcaption>`.

## Fora de escopo

Carrossel, estrelas, fotos.

## Premissas e Incertezas

**Premissas**

- P1 — Nomes e bairros são inventados pela task; nenhum dado de pessoa real.
- P2 — O nome do produto citado é escrito no texto do depoimento, sem importar valor de `src/data/`.
- P3 — "A partir de 1024 px" é o breakpoint `lg` do Tailwind.

**Incertezas**

- I1 — Se as iniciais são escritas no conteúdo ou calculadas a partir do nome por uma função em `src/lib/`.
- I2 — Se o círculo de iniciais é decorativo (`aria-hidden`) ou tem nome acessível.
