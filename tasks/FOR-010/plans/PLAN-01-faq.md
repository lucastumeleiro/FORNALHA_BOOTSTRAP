# PLAN-01 — FOR-010: seção Perguntas frequentes

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** mudança estrutural — seção nova na página, com primitivo novo (Accordion)
**Layout aprovado:** https://claude.ai/artifact/K1nTAvW3pc2wcERtUryNPX

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-010/TASK.md

**Por que um PLAN só:** a task toca 4 arquivos de um mesmo domínio (frontend) e não há dependência interna que justifique dividir.

## Escopo

Adicionar o primitivo Accordion e a seção "Perguntas frequentes" (`id="perguntas"`), com as cinco perguntas do EPIC, antes de Horários.

## Passos de Implementação (ordenados)

### Passo 1 — Gerar o primitivo Accordion

**Fonte:** TASK.md §Comportamento Esperado 1 e CA-4 | skill `design-system` (DS-04)

- Rodar `npx shadcn@latest add accordion` na raiz do worktree.
- Não editar `src/components/ui/accordion.tsx` à mão; o arquivo fica como o CLI gerou.
- Conferir no `git diff` que `package.json` e o lockfile só mudaram se o CLI exigiu. Se mudaram, a mudança é só a dependência do CLI.

### Passo 2 — Conteúdo

**Fonte:** TASK.md §Comportamento Esperado 2, P1 | EPIC §Perguntas frequentes | skill `arquitetura` (AR-01) | padrão: `src/content/hours.ts`

- Criar `src/content/faq.ts` exportando `faqContent`, no formato de `hoursContent`: `title`, `subtitle` e a lista de itens (pergunta e resposta).
- As cinco perguntas e respostas são as do EPIC, na ordem do EPIC e sem reescrita.
- `title`: "Perguntas frequentes".
- `subtitle`: texto provisório "O que mais perguntam por aqui." (ver Incerteza 3).

### Passo 3 — Seção

**Fonte:** arranjo — canvas https://claude.ai/artifact/K1nTAvW3pc2wcERtUryNPX | tokens e componentes — design system do projeto + `src/sections/hours-section.tsx` e `src/sections/products-section.tsx`

- Criar `src/sections/faq-section.tsx` exportando `FaqSection`.
- Estrutura de `<section id="perguntas">`, container, `h2`, subtítulo, como em `HoursSection`.
- Lista com o Accordion gerado no Passo 1, em modo `type="single"` (P2), sem valor inicial, para que todas comecem fechadas.
- Largura da lista limitada, como no canvas.
- Todo texto vem de `faqContent`.
- Arranjo conforme o canvas: pergunta à esquerda, chevron à direita, separador entre itens.
- Aparência pelo que o Accordion gerado já traz e por classes semânticas de cor (`text-muted-foreground`, `border-border`).
- Foco visível vem do `ring` do tema, que o primitivo já aplica (DS-06). Conferir, não reimplementar.

### Passo 4 — Colocar na página

**Fonte:** TASK.md §Comportamento Esperado 2, P3 | EPIC §Seções, na ordem final | skill `arquitetura` (AR-02)

- Em `src/App.tsx`, importar `FaqSection` por `@/` e renderizá-la logo antes de `<HoursSection />`.
- Não alterar o menu do cabeçalho (P3).

### Passo 5 — Verificação local

**Fonte:** CLAUDE.md §Comandos

- Rodar `npm run typecheck`, `npm run build`, `npm test` e `npm run check:cores`.
- Não rodar `npm run dev`.
- Testes novos ficam para a Fase 6b (`/autotest`).

## Arquivos Impactados

| Arquivo                           | Operação | Justificativa                    |
| --------------------------------- | -------- | -------------------------------- |
| `src/components/ui/accordion.tsx` | Criar    | Gerado pelo CLI (CA-4)           |
| `src/content/faq.ts`              | Criar    | Texto da seção (AR-01)           |
| `src/sections/faq-section.tsx`    | Criar    | A seção                          |
| `src/App.tsx`                     | Editar   | Uma linha, antes de Horários     |
| `package.json` e lockfile         | Editar   | Só se o CLI mudar (TASK §Arquivos) |

## Contratos Exportados

- `FaqSection` — `src/sections/faq-section.tsx`
- `faqContent` — `src/content/faq.ts`

## Convenções Aplicáveis

- Frontend/UI: skills `arquitetura` (AR-01, AR-02, AR-06, AR-07) e `design-system` (DS-01 a DS-06).
- Import por `@/`, arquivo de produção com até 150 linhas.
- Comentários em português.

## Pontos de Atenção

> **O canvas é referência visual, não fonte de código.** A implementação usa
> obrigatoriamente os **tokens/estilos do design system do projeto** e
> **componentes que já existem no projeto** (quando houver biblioteca de componentes definida).
> Proibido no código: hex ou rgb do canvas, valor arbitrário fora do sistema de estilos do projeto,
> `style=` inline, px cravado onde há token, e markup próprio onde existe
> componente. **Divergir visualmente do canvas para respeitar token e componente do projeto
> é o comportamento correto — não é desvio de plano e não precisa de aprovação.**

- O canvas desenhou cada pergunta como `h3`. Isso depende da Incerteza 2; o que o Accordion gerado renderizar prevalece.
- `accordion.tsx` não se edita (DS-04). Qualquer ajuste de aparência vai para a seção ou para token.
- Se o CLI sobrescrever ou alterar arquivos fora da lista (ex.: `src/index.css`), parar e avisar.
- Texto dos itens, inclusive `aria-label` se houver, mora em `src/content/faq.ts`.

## Premissas e Incertezas

### Premissas

1. Perguntas e respostas são as do EPIC, sem reescrita (TASK P1).
2. "Uma aberta por vez" é `type="single"` (TASK P2).
3. A seção não ganha item no menu do cabeçalho (TASK P3).
4. O layout do canvas (aprovado) tem lista de largura limitada e separador entre perguntas.

### Incertezas

1. **`collapsible` (TASK I1):** se a pergunta aberta fecha ao clicar nela de novo. A TASK não diz. Sem decisão, o PLAN usa `collapsible`, que é o comportamento esperado de um FAQ. Levar à `/question`.
2. **Hierarquia de títulos (TASK I2):** se cada pergunta é um `h3` dentro do gatilho, o que entra na hierarquia da página. Levar à `/question`.
3. **Subtítulo:** o EPIC não define. "O que mais perguntam por aqui." é provisório e precisa de confirmação.
