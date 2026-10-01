# PLAN-01 — FOR-002: copy do hero

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** todos os demais (único PLAN da task)
**Triagem visual:** ajuste pontual — só o texto de um hero que já existe; arranjo, layout e componentes não mudam (sem canvas)

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-002/TASK.md

## Escopo

Reescrever `title`, `subtitle` e `cta.label` em `src/content/hero.ts`, na voz do EPIC e com fato de §Fatos da marca, mantendo `cta.href`.

**Um PLAN só:** a task toca um arquivo; não há domínio técnico a separar.

## Passos de Implementação (ordenados)

### Passo 1 — Escolher o fato e o rótulo do CTA

**Fonte:** TASK.md §Incertezas I1 e I2 | EPIC.md §Fatos da marca e §Marca (voz) | confirmado na Fase 3 (Q2.1, Q2.2, Q3.1)

- Fato do título: fermentação natural de 36 horas (o que só esta padaria diz; "fornadas às 7h e às 16h" fica livre para FOR-006 — Q2.2).
- CTA nomeia o destino, não chama para ação: o vizinho com pressa entende onde vai cair.
- Texto confirmado na Fase 3 (Q2.1, Q2.2, Q3.1):
  - `title`: "Fermentação natural de 36 horas" — 5 palavras
  - `subtitle`: "Farinha orgânica de moinho de pedra." — 6 palavras
  - `cta.label`: "Ver cardápio" — 2 palavras
- Sem emoji, sem exclamação, sem superlativo; nenhum fato fora do EPIC (P3).

### Passo 2 — Editar `src/content/hero.ts`

**Fonte:** leitura de código (`src/content/hero.ts:1-5`) | skill `arquitetura` (AR-01: texto visível só em `src/content/`)

- Trocar apenas os três valores de texto; manter o objeto `heroContent` com `as const`, a chave `cta.href` igual a `"#cardapio"` e o nome do export.
- Não tocar em `src/sections/hero.tsx` nem em `src/App.test.tsx` (o teste lê `heroContent.title`, então segue válido).

### Passo 3 — Conferir contagem e escopo

**Fonte:** TASK.md CA-1, CA-2, CA-4 | P1 | item de CA-2 acrescentado na Fase 3 (Q2.3)

- Contar palavras do texto como aparece na tela, sem pontuação: título ≤ 6, subtítulo ≤ 20, CTA ≤ 3.
- Reler o texto final contra a lista de fatos do EPIC §Fatos da marca e contra os superlativos vazios citados em §Marca (voz) — confere CA-2.
- Rodar `npm run typecheck` e `npm test`.
- `git diff --stat` deve listar só `src/content/hero.ts`.

## Arquivos Impactados

| Arquivo               | Operação | Justificativa                    |
| --------------------- | -------- | -------------------------------- |
| `src/content/hero.ts` | Editar   | Novo texto do hero (único da task) |

## Contratos Exportados

- _Nenhum_ (`heroContent` mantém o mesmo formato)

## Convenções Aplicáveis

- Frontend: skill `arquitetura` (AR-01). Skill `design-system` não se aplica: não há cor, token, componente nem CSS alterados.
- Comentários e artefatos em português, identificadores em inglês.

## Pontos de Atenção

- FOR-005 (WhatsApp) vem depois e mexe no hero; manter o formato de `heroContent` evita conflito.
- Não rodar `npm run dev` (regra do repositório); CA-3 é verificado no TEST.md pela pessoa.
- CA-3 (CTA leva ao Cardápio) é candidato a teste B automatizado: `href="#cardapio"` já pareado com `id="cardapio"` em `products-section.tsx`, padrão citado em `teste-automatizado §Classificação A/B/C deste produto` (citação corrigida na Fase 3 — Q2.1). Sinalizar para a Fase 6a/6b.
- O título cresce de "Bem-vindo à Fornalha" (20 caracteres) para "Fermentação natural de 36 horas" (32 caracteres); o TEST.md (Fase 6a, `teste-de-mesa`) deve incluir um cenário conferindo que o hero não quebra de forma estranha nem estoura o container na largura estreita, mesmo sem mudança de layout (Q5.1).

## Premissas e Incertezas

### Premissas

1. Contagem de palavras é a do texto na tela, sem pontuação (TASK P1).
2. `href` do CTA fica `#cardapio` (TASK P2).
3. Só entram fatos de EPIC §Fatos da marca (TASK P3).

### Incertezas

_Nenhuma — I1 e I2 da TASK foram resolvidas na Fase 3 (Q2.1, Q2.2). Ver QUESTION.md._
