# PLAN-01 — FOR-001: tokens terracota em `src/index.css`

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** ajuste pontual — só troca o valor de três tokens que já existem; nenhum elemento, arranjo ou componente muda

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-001/TASK.md

## Escopo

Trocar `--primary`, `--primary-foreground` e `--ring` por terracota em `:root` e em `.dark`, com contraste ≥ 4,5:1 medido e registrado aqui.

**Um PLAN só:** a task toca um arquivo e três tokens (arquitetura e design-system, sem outro domínio).

## Passos de Implementação (ordenados)

### Passo 1 — Tema claro (`:root`)

**Fonte:** TASK.md §Comportamento Esperado 1–2, P1, P2 | `src/index.css:56-57,67` | skill `design-system` (formato `oklch()`, papel e não tom)

- `--primary`: `oklch(0.52 0.14 40)` (terracota escuro, tijolo).
- `--primary-foreground`: `oklch(0.985 0.005 80)` (creme quase branco).
- `--ring`: `oklch(0.52 0.14 40)`, o mesmo tom do primário. O reset em `@layer base` aplica `outline-ring/50`, e o `ring-ring/50` do botão também usa esse token com transparência.

### Passo 2 — Tema escuro (`.dark`)

**Fonte:** TASK.md §Comportamento Esperado 1–2, CA-2, P2 | `src/index.css:91-92,102` | EPIC §Marca ("no escuro, um terracota mais claro")

- `--primary`: `oklch(0.72 0.13 45)` (terracota mais claro).
- `--primary-foreground`: `oklch(0.2 0.03 40)` (carvão quente; texto escuro sobre primário claro, a mesma lógica do tema de fábrica).
- `--ring`: `oklch(0.72 0.13 45)`, igual ao primário.

### Passo 3 — Não tocar em mais nada

**Fonte:** TASK.md P2, §Fora de escopo, CA-4

- `--accent`, `--sidebar-*`, `--chart-*`, fundo, borda, secundário e `@theme inline` ficam como estão. O bloco `@theme inline` já mapeia os três tokens (linhas 22, 32, 33), então DS-03 está cumprido sem edição.

### Passo 4 — Verificar

**Fonte:** TASK.md CA-3, CA-4 | `package.json` scripts

- Rodar `npm run check:cores` (0 violações), `npm run typecheck` e `npm test`.
- `git diff --stat` deve listar só `src/index.css`.
- Não rodar `npm run dev`; conferir CA-1 e CA-2 é da pessoa no `TEST.md`.

## Contraste medido (CA-3, DS-05)

Calculado por script (oklch → sRGB linear → luminância relativa WCAG). A pessoa deve reconferir no DevTools durante o `TEST.md`.

| Tema   | Par                                           | Razão  | Limite | Resultado |
| ------ | --------------------------------------------- | ------ | ------ | --------- |
| Claro  | `primary-foreground` sobre `primary`          | 5,61:1 | 4,5:1  | passa     |
| Escuro | `primary-foreground` sobre `primary`          | 7,02:1 | 4,5:1  | passa     |
| Claro  | `primary` sobre `background` (branco)         | 5,86:1 | 3:1    | passa     |
| Escuro | `primary` sobre `background` (`0.145 0 0`)    | 7,63:1 | 3:1    | passa     |

O anel de foco é `ring/50`, então o contraste efetivo do anel é menor que o do primário puro; DS-06 pede foco visível, e o `TEST.md` confere isso.

## Arquivos Impactados

| Arquivo         | Operação | Justificativa                              |
| --------------- | -------- | ------------------------------------------ |
| `src/index.css` | Editar   | Seis valores de token (três por tema)      |

## Contratos Exportados

- _Nenhum_

## Convenções Aplicáveis

- Frontend/UI: skills `design-system` (DS-01, DS-02, DS-03, DS-05, DS-06) e `arquitetura`. Cor literal só em `src/index.css`, e é ali que a edição acontece.

## Pontos de Atenção

- Sem canvas: triagem é ajuste pontual, então não há bloco de blindagem.
- Em `.dark`, `--sidebar-primary` continua azul de fábrica (`oklch(0.488 0.243 264.376)`). A página não usa sidebar, mas fica como resíduo fora da paleta da marca (I1).
- Outros componentes que usam `bg-primary`/`text-primary` (links, badges) também ficam terracota. É o efeito esperado de trocar o token.

## Premissas e Incertezas

### Premissas

1. Os tons escolhidos (matiz 40–45, croma 0,13–0,14) leem como terracota; a conferência visual é do `TEST.md` (P1).
2. `--ring` igual ao `--primary` cumpre "acompanha o primário".

### Incertezas

1. **I1 (da TASK):** `--sidebar-primary`, `--sidebar-ring` e `--chart-*` seguem neutros por P2, sem confirmação de que devam acompanhar. Decisão para a Fase 3.
2. **I2 (da TASK):** `--accent` fica neutro por P2. Decisão para a Fase 3.
