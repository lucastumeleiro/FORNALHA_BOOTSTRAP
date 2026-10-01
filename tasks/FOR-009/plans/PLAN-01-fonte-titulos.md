# PLAN-01 — FOR-009: Títulos com serifa (Fraunces)

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** todos os demais (PLAN único)
**Triagem visual:** ajuste pontual — só troca a família de fonte de `h1`–`h3` por token; nenhum arranjo, componente ou texto muda

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-009/TASK.md

## Escopo

Instalar `@fontsource-variable/fraunces`, importá-la em `src/index.css`, apontar `--font-heading` para ela e aplicar a `h1`, `h2` e `h3` pelo `@layer base`.

**Motivo de ser um PLAN só:** a task toca 3 arquivos (`package.json`, `package-lock.json`, `src/index.css`), todos acoplados em uma única mudança; não há domínio técnico separável.

## Passos de Implementação (ordenados)

### Passo 1 — Instalar a dependência

**Fonte:** TASK.md §Comportamento Esperado (1) | skill `design-system` §Como as coisas entram (Fonte)

- `npm install @fontsource-variable/fraunces` (entra em `dependencies`, como as demais libs de runtime; atualiza `package.json` e `package-lock.json`).
- Não rodar `npm run dev`.

### Passo 2 — Importar a fonte em `src/index.css`

**Fonte:** skill `design-system` §Como as coisas entram (Fonte: "pacote importado em `src/index.css`") | leitura de código (`src/index.css:1-3`)

- Adicionar o `@import "@fontsource-variable/fraunces/opsz.css"` (variante com eixos de peso e óptico) junto dos demais `@import` no topo do arquivo, antes de qualquer regra. Confirmar no pacote instalado que o arquivo existe e o nome da família que ele declara.
- Empacotamento local pelo Vite/Fontsource (CA-2): nenhum `<link>` ou `@import url(...)` para serviço externo.

**Fonte:** decisão da Fase 3 (Q3.1)

### Passo 3 — Ajustar o token `--font-heading`

**Fonte:** TASK.md §Comportamento Esperado (2) e P1 | leitura de código (`src/index.css:8`)

- Alterar a linha existente `--font-heading` do `@theme inline` (hoje `var(--font-sans)`) para a família Fraunces Variable, com `ui-serif, Georgia, serif` como fallback (e não `var(--font-sans)`: se a fonte não carregar, o título continua com serifa). Não criar token novo.
- O nome exato da família (`'Fraunces Variable'`) é confirmado no CSS do `opsz.css` instalado, não presumido.

**Fonte:** decisão da Fase 3 (Q3.1, Q4.1)

### Passo 4 — Aplicar o token a `h1`, `h2` e `h3`

**Fonte:** TASK.md §Comportamento Esperado (2) | leitura de código (`src/index.css:118-128`, bloco `@layer base`)

- Dentro do `@layer base` existente, adicionar regra para `h1, h2, h3` com `@apply font-heading`, no mesmo estilo das regras vizinhas.
- Não editar nenhum componente: `hero.tsx:12`, `products-section.tsx:9` e `product-card.tsx:23` já usam `h1`/`h2`/`h3` e herdam a regra (CA-3).
- `html { @apply font-sans }` permanece intocado, mantendo o corpo na fonte do sistema (Comportamento 3).

### Passo 5 — Verificar

**Fonte:** TASK.md §Critérios de Aceite | CLAUDE.md §Comandos

- `npm run typecheck`, `npm test`, `npm run build` e `npm run check:cores`.
- Conferir no `dist` que o `.woff2` da Fraunces foi empacotado e que nenhum CSS referencia host externo de fontes (CA-2).
- Conferir `git diff --stat -- src package.json package-lock.json`: só `package.json`, `package-lock.json`, `src/index.css` (CA-3). Os artefatos de `tasks/FOR-009/` ficam fora dessa checagem.

**Fonte:** decisão da Fase 3 (Q2.2)
- CA-1 (Rendered Fonts no DevTools) é execução visual da pessoa, via `TEST.md`.

## Arquivos Impactados

| Arquivo             | Operação | Justificativa                                            |
| ------------------- | -------- | -------------------------------------------------------- |
| `package.json`      | Editar   | nova dependência `@fontsource-variable/fraunces`         |
| `package-lock.json` | Editar   | lockfile da nova dependência                             |
| `src/index.css`     | Editar   | import da fonte, `--font-heading`, regra de `h1`–`h3`    |

## Contratos Exportados

- _Nenhum_ (o token `--font-heading` já existe; a classe `font-heading` já é usada em `src/components/ui/card.tsx:40`)

## Convenções Aplicáveis

- Frontend/UI: skills `design-system` (Fonte: pacote `@fontsource-variable/*` + token `--font-*`; DS-01/DS-02 sem cor literal) e `arquitetura` (AR-04: dependência nova justificada pela TASK).
- Sem lint (CLAUDE.md). Nenhum agente commita nem roda `npm run dev`.

## Pontos de Atenção

- `CardTitle` (`ui/card.tsx:40`) já aplica `font-heading` no `div`; o `h3` dentro dele agora também recebe a serifa pela regra base. Efeito visual coerente, mas o `h3` do card passa a Fraunces onde antes herdava o sistema. Não editar `components/ui/` (DS-04).
- `h1` e `h2` têm `font-bold` (`hero.tsx:12`, `products-section.tsx:9`); o `h3` do card herda `font-medium` do `CardTitle`. P3 diz que o pacote variável cobre esses pesos; conferir no build que o peso 500 e 700 renderizam.
- Lockfile: FOR-010 (precede) cuida do lockfile; este PLAN só deixa o `package-lock.json` consistente com a instalação.
- Conflito de merge: se `package-lock.json` conflitar com FOR-007/FOR-008, não resolver à mão: reexecutar `npm install` a partir do `package.json` mesclado. **Fonte:** decisão da Fase 3 (Q5.2)
- Troca de fonte (swap): o Fontsource usa `font-display: swap` e o import via CSS não permite preload, então o `h1` do hero (`hero.tsx:12`) pode reflowar na troca sans→Fraunces. Comportamento aceito; preload fora de escopo (CA-3). O `TEST.md` deve observar: recarregar com cache limpo e conferir o salto do hero. **Fonte:** decisão da Fase 3 (Q5.1)

## Premissas e Incertezas

### Premissas

1. P1 (TASK) — `--font-heading` existente no `@theme inline` é o token a ajustar.
2. P2 (TASK) — "fonte do sistema" é o `font-sans` padrão do Tailwind, já aplicado ao `html`.
3. P3 (TASK) — o pacote variável cobre `font-medium`, `font-semibold` e `font-bold`.
4. `npm install` resolve o pacote sem ajuste de `vite.config`/`tsconfig` (import CSS de pacote é tratado pelo Vite; não há import TS do pacote).

### Incertezas

1. I1 (TASK) — **resolvida (Q1/Q2.1):** a marca "Fornalha" no cabeçalho (`site-header.tsx`) não é `h1`–`h3` e **fica fora** desta task (CA-3 proíbe mudar componente); follow-up.
2. I2 (TASK) — **resolvida (Q3.1):** o passo 2 importa a variante `opsz.css`, que traz o eixo óptico.
