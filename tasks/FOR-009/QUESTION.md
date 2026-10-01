# QUESTION — FOR-009

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 1 — Confronto com código existente: nada relevante (`index.css:8`, `:118-128`, `card.tsx:40`, `product-card.tsx:23` batem com o que o PLAN descreve)
- Frente 6 — Escopo e complexidade: nada relevante (PLAN único, três arquivos, sem sobre-engenharia)

## Itens

### Q2.1 — I1 (marca no cabeçalho) foi empurrada para esta fase sem decisão

**Problema:** o PLAN declara que a marca "Fornalha" fica fora e que "se a pessoa quiser a serifa na marca, é decisão para `/question`". O texto da marca é um `span` com `font-semibold` (`site-header.tsx:7`), não um `h1`–`h3`, então a regra base não o alcança. O EPIC pede "títulos com serifa" como identidade; o logotipo/marca é o elemento de maior personalidade da página e ficaria em sans ao lado de um hero em serifa. Se ninguém decidir agora, `/feature` implementa o literal e a incoerência só aparece no `TEST.md`.

**Âncoras:** `PLAN-01 §Incertezas (I1)` · `site-header.tsx:7` · `TASK §Premissas e Incertezas (I1)` · `EPIC §Marca`

**Sugestão:** decidir agora. Opção recomendada: manter fora de escopo (CA-3 proíbe mudar componente, e `site-header.tsx` é componente) e registrar a marca como follow-up. Alternativa: ampliar o escopo da TASK, o que quebra CA-3.

**Afeta:** TASK §Premissas e Incertezas (I1), PLAN-01 §Incertezas

**Resposta:** aceito

**Comentário:**

### Q2.2 — CA-3 e o passo de verificação divergem do que o diff final contém

**Problema:** CA-3 diz "nenhum componente mudou: só `index.css` e as dependências", e o PLAN passo 5 confere `git diff --stat` esperando só três arquivos. Mas `tasks/FOR-009/` (`MEMORY.md`, `SUMARIO.md`, `plans/`, `QUESTION.md`) está não rastreado e entra no diff da branch quando for commitado. A verificação como escrita falha, ou passa vazia por olhar só o que está rastreado.

**Âncoras:** `TASK §CA-3` · `PLAN-01 passo 5`

**Sugestão:** reformular CA-3 e o passo 5 para "nenhum arquivo em `src/` exceto `src/index.css` mudou" (ex.: `git diff --stat -- src package.json package-lock.json`).

**Afeta:** TASK §Critérios de Aceite (CA-3), PLAN-01 passo 5

**Resposta:** aceito

**Comentário:**

### Q3.1 — I2 (`opsz`) tratada como adiável, mas a escolha do import é feita no passo 2

**Problema:** o PLAN passo 2 importa "o pacote variável" e declara `opsz` fora de escopo, empurrando a avaliação para o `TEST.md`. Só que o que se importa define o resultado: em `@fontsource-variable/fraunces` o `index.css` padrão traz só o eixo de peso, e o eixo óptico vem em arquivo separado (`opsz.css`). Se o import padrão for usado, a Fraunces nunca poderá ajustar o desenho ao tamanho, e o hero (`text-4xl`, `hero.tsx:12`) é justamente o uso grande. Corrigir depois exige novo import, novo build e nova rodada de teste de mesa. O PLAN também não verificou o conteúdo do pacote, só supôs ("pode não incluir").

**Âncoras:** `PLAN-01 passo 2` · `PLAN-01 §Incertezas (I2)` · `TASK §I2` · `hero.tsx:12`

**Sugestão:** decidir antes de `/feature`. Recomendado: importar a variante com `opsz` (`@fontsource-variable/fraunces/opsz.css`), confirmando no pacote instalado o nome do arquivo e da família (passo 3 já manda confirmar a família). Se preferir o padrão por simplicidade, registrar a perda do `opsz` como decisão consciente, não como pendência.

**Afeta:** PLAN-01 passo 2, PLAN-01 passo 3, TASK §I2

**Resposta:** aceito

**Comentário:**

### Q4.1 — Fallback do `--font-heading` é sans, contradizendo a intenção de serifa

**Problema:** o PLAN passo 3 manda `Fraunces Variable` com `var(--font-sans)` como fallback. Enquanto a fonte carrega (ou se falhar), os títulos aparecem em sans e depois trocam para serifa: o salto é maior do que com fallback serifado. É uma decisão técnica sem justificativa escrita.

**Âncoras:** `PLAN-01 passo 3` · `src/index.css:8`

**Sugestão:** fallback `ui-serif, Georgia, serif` no lugar de `var(--font-sans)`, mantendo a marca coerente se o `.woff2` não carregar.

**Afeta:** PLAN-01 passo 3

**Resposta:** aceito

**Comentário:**

### Q5.1 — Troca de fonte (swap) no `h1` do hero: layout shift não considerado

**Problema:** o Fontsource declara `font-display: swap`, e a importação via CSS (passo 2) não permite `<link rel="preload">`. O `h1` do hero (`text-4xl font-bold tracking-tight`, `hero.tsx:12`) é provavelmente o maior elemento de texto visível ao carregar; a troca de métrica sans→Fraunces pode reflowar o hero. O PLAN não menciona o comportamento e o `TEST.md` só verifica a fonte renderizada (CA-1), não a estabilidade.

**Âncoras:** `PLAN-01 passo 2` · `hero.tsx:12` · `TASK §CA-1`

**Sugestão:** aceitar o swap como comportamento esperado e acrescentar ao PLAN um ponto de atenção, mais um item de observação no `TEST.md` (recarregar com cache limpo e conferir salto do hero). Preload fica fora de escopo (CA-3).

**Afeta:** PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

### Q5.2 — Conflito de merge com tarefas paralelas em `index.css` e `package-lock.json`

**Problema:** a TASK lista FOR-007 e FOR-008 como paralelas e FOR-010 como seguinte, "lockfile". Esta task edita `package-lock.json` (arquivo gerado, que conflita em qualquer instalação concorrente) e as linhas 1-8 de `src/index.css`. O PLAN diz que "FOR-010 cuida do lockfile", mas não diz o que fazer se FOR-007/008 também mexerem em dependência ou em `index.css` e entrarem em `main` antes.

**Âncoras:** `TASK cabeçalho (Pode rodar em paralelo com FOR-007, FOR-008; Precede FOR-010)` · `PLAN-01 §Pontos de Atenção (Lockfile)` · `src/index.css:1-8`

**Sugestão:** acrescentar ao PLAN: se `package-lock.json` conflitar, não resolver à mão, reexecutar `npm install` a partir do `package.json` mesclado. Se FOR-007/008 não tocam dependência nem `index.css`, registrar isso em `## Rejeitado`.

**Afeta:** PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                   | Desfecho  | Artefatos afetados                      |
| ---- | ------------------------ | --------- | --------------------------------------- |
| Q2.1 | Coerência TASK ↔ PLAN    | ✅ Aceito | TASK §Premissas e Incertezas, PLAN-01   |
| Q2.2 | Coerência TASK ↔ PLAN    | ✅ Aceito | TASK §CA-3, PLAN-01 passo 5             |
| Q3.1 | Premissas declaradas     | ✅ Aceito | TASK §I2, PLAN-01 passos 2 e 3          |
| Q4.1 | Premissas não declaradas | ✅ Aceito | PLAN-01 passo 3                         |
| Q5.1 | Cenários esquecidos      | ✅ Aceito | PLAN-01 §Pontos de Atenção              |
| Q5.2 | Cenários esquecidos      | ✅ Aceito | PLAN-01 §Pontos de Atenção              |

## Decisões

### Q2.1 — I1 (marca no cabeçalho) foi empurrada para esta fase sem decisão

**Decisão:** a marca "Fornalha" (`site-header.tsx:7`) fica fora de escopo, porque CA-3 proíbe mudar componente. Vira follow-up.

**Impacto:** `TASK.md §Premissas e Incertezas` (I1) e `PLAN-01 §Incertezas` atualizados.

### Q2.2 — CA-3 e o passo de verificação divergem do que o diff final contém

**Decisão:** CA-3 passa a falar de `src/`, e não do diff inteiro, que inclui `tasks/FOR-009/`.

**Impacto:** `TASK.md` CA-3 reescrito; `PLAN-01` passo 5 usa `git diff --stat -- src package.json package-lock.json`.

### Q3.1 — I2 (`opsz`) tratada como adiável, mas a escolha do import é feita no passo 2

**Decisão:** importar a variante com eixo óptico (`@fontsource-variable/fraunces/opsz.css`), confirmando no pacote instalado o nome do arquivo e da família.

**Impacto:** `PLAN-01` passos 2 e 3 reescritos; I2 da TASK e do PLAN resolvida.

### Q4.1 — Fallback do `--font-heading` é sans, contradizendo a intenção de serifa

**Decisão:** fallback `ui-serif, Georgia, serif` no lugar de `var(--font-sans)`.

**Impacto:** `PLAN-01` passo 3 reescrito.

### Q5.1 — Troca de fonte (swap) no `h1` do hero: layout shift não considerado

**Decisão:** o swap é comportamento esperado e o preload fica fora de escopo. Entra como ponto de atenção, com observação para o `TEST.md` (recarregar com cache limpo e conferir o salto do hero).

**Impacto:** `PLAN-01 §Pontos de Atenção` ganha um ponto novo.

### Q5.2 — Conflito de merge com tarefas paralelas em `index.css` e `package-lock.json`

**Decisão:** em conflito no `package-lock.json`, não resolver à mão: reexecutar `npm install` a partir do `package.json` mesclado.

**Impacto:** `PLAN-01 §Pontos de Atenção` ganha um ponto novo.

## Incertezas abertas

Nenhuma.

## Alterações aplicadas

| Arquivo                           | O que mudou                                                                      | Origem     |
| --------------------------------- | -------------------------------------------------------------------------------- | ---------- |
| `TASK.md`                         | §Premissas e Incertezas: I1 fora de escopo (follow-up) e I2 resolvida; CA-3 reescrito | Q2.1, Q3.1, Q2.2 |
| `plans/PLAN-01-fonte-titulos.md`  | passos 2, 3 e 5 reescritos; dois Pontos de Atenção novos; I1/I2 resolvidas       | Q3.1, Q4.1, Q2.2, Q5.1, Q5.2, Q2.1 |
