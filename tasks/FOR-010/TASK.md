# [FEATURE] FOR-010 — Perguntas frequentes

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** design (estrutural) + primitivo · **Depende de:** — · **Vem depois de:** FOR-007 (`App.tsx`), FOR-009 (lockfile) · **Pode rodar em paralelo com:** FOR-011, FOR-014 · **Precede:** FOR-013, FOR-015

## Contexto

As mesmas cinco perguntas chegam toda semana.

## Comportamento Esperado

1. `npx shadcn@latest add accordion`.
2. Seção "Perguntas frequentes" (`id="perguntas"`) logo antes de Horários, com as cinco perguntas de EPIC §Perguntas frequentes.
3. Uma pergunta aberta por vez; todas começam fechadas.

## Arquivos/Módulos Afetados

- `src/components/ui/accordion.tsx` (gerado)
- `src/sections/faq-section.tsx` (novo)
- `src/content/faq.ts` (novo)
- `src/App.tsx`
- `package.json` e lockfile (se mudarem)

## Critérios de Aceite

- [ ] **CA-1** — Dado a página, então aparecem as cinco perguntas, fechadas.
- [ ] **CA-2** — Dado uma pergunta aberta, quando abro outra, então a primeira fecha.
- [ ] **CA-3** — Dado só o teclado, então passo pelas perguntas com `Tab` e abro com `Enter` ou `Espaço`, com foco visível.
- [ ] **CA-4** — Dado o `src/components/ui/accordion.tsx`, então ele é o que o CLI gerou.

## Fora de escopo

Busca, perguntas vindas de CMS.

## Premissas e Incertezas

**Premissas**

- P1 — Perguntas e respostas são as do EPIC, sem reescrita.
- P2 — "Uma aberta por vez" é o modo `type="single"` do Accordion.
- P3 — A seção não ganha item no menu do cabeçalho.

**Incertezas**

- I1 — Se dá para fechar a pergunta aberta clicando nela de novo (`collapsible`), o que a TASK não diz.
- I2 — Se cada pergunta vira um título (`h3`) dentro do gatilho, como o Accordion gerado sugere, o que entra na hierarquia de títulos da página.
