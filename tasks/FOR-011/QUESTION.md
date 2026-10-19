# QUESTION — FOR-011

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 3 — Ataque às premissas declaradas: nada relevante
- Frente 4 — Premissas NÃO declaradas: nada relevante

## Itens

### Q1.1 — "©" literal no JSX contraria o próprio PLAN e a AR-01

**Problema:** o PLAN-01 passo 1 diz "todo texto visível e todo `aria-label` ficam aqui [content], nunca literais no JSX". O código implementado deixa o símbolo e a composição da linha de copyright no componente (`© {year} {footerContent.brand}`). A estrutura da frase fica dividida entre `footer.ts` e `site-footer.tsx`, e quem editar o texto do rodapé em `content/` não controla a linha de copyright.

**Âncoras:** `src/sections/site-footer.tsx:45` · `PLAN-01 passo 1` · `src/content/footer.ts:3`

**Sugestão:** mover o símbolo para o content (ex.: `copyright: { symbol: "©", brand: "Fornalha" }`) ou expor uma função/prefixo no content, deixando no JSX só `{prefixo} {year} {brand}` sem texto literal.

**Afeta:** PLAN-01 passo 1 e passo 2

**Resposta:** aceito

**Comentário:**

### Q1.2 — Instagram sem ícone e WhatsApp com ícone: links irmãos com tratamento visual diferente

**Problema:** na mesma `<ul>`, o WhatsApp leva `MessageCircle` e o Instagram só texto, porque o `lucide-react` 1.48.0 não tem a marca. O resultado é uma linha de redes assimétrica. O TASK pede ícone "quando houver um adequado" (§Comportamento Esperado 2), e `MessageCircle` é um balão genérico, não a marca do WhatsApp; o PLAN rejeitou ícone genérico para o Instagram (I2) mas aceitou um genérico para o WhatsApp sem justificar a diferença.

**Âncoras:** `src/sections/site-footer.tsx:26` · `src/sections/site-footer.tsx:38` · `PLAN-01 passo 3` · `TASK I2`

**Sugestão:** os dois links só com texto (remover `MessageCircle` do rodapé), ou manter como está registrando que a assimetria é aceita. Recomendado: só texto nos dois, coerente com a decisão de I2.

**Afeta:** PLAN-01 passo 3, TASK §Premissas e Incertezas (I2)

**Resposta:** aceito

**Comentário:**

### Q2.1 — Fase 4 já foi executada antes da Fase 3: ajustes agora recaem sobre código pronto

**Problema:** `SUMARIO.md` marca `feature: done` (12:48Z) com `question: pending` (12:51Z) e o `MEMORY.md` dá o PLAN-01 como concluído. A Fase 3 existe para barrar o PLAN antes de codar; hoje qualquer item aceito aqui que mude comportamento (Q1.1, Q1.2, Q5.1) exige alterar `src/` e o teste, e a Fase 3 só escreve em `tasks/FOR-011/`. Sem decisão explícita, TASK/PLAN e código divergem.

**Âncoras:** `tasks/FOR-011/SUMARIO.md` (fases `feature` e `question`) · `tasks/FOR-011/MEMORY.md §Estado dos PLANs` · `CLAUDE.md §Regras críticas`

**Sugestão:** itens aceitos ajustam TASK/PLAN aqui e o código/teste é corrigido pela Fase 5 (`/review-feature`), que já despacha correções, registrando no `MEMORY.md` que a implementação antecedeu a Fase 3. Alternativa: reabrir `/feature` para o PLAN-01 (conta como segundo PLAN? não, é o mesmo PLAN reexecutado).

**Afeta:** TASK §Premissas e Incertezas, PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

### Q2.2 — I1 e I2 foram resolvidas só no MEMORY; TASK e PLAN ainda as dão como abertas

**Problema:** o PLAN-01 manda "Confirmar na Fase 3" para I1 (mensagem do WhatsApp) e I2 (ícone do Instagram). O `MEMORY.md` registra a resolução (mensagem própria; sem ícone) como fato consumado, sem que a pessoa tenha confirmado. O TASK continua listando as duas como incertezas, sem decisão. A fonte de verdade (TASK.md) fica desatualizada.

**Âncoras:** `PLAN-01 §Incertezas 1 e 2` · `TASK §Incertezas I1, I2` · `tasks/FOR-011/MEMORY.md:10` · `src/content/footer.ts:13`

**Sugestão:** confirmar aqui as duas decisões (I1: mensagem própria "Olá, vim pelo site da Fornalha."; I2: sem ícone de marca) e registrá-las no TASK como decididas, citando o ID.

**Afeta:** TASK §Premissas e Incertezas, PLAN-01 §Incertezas

**Resposta:** aceito

**Comentário:**

### Q5.1 — Asserção de nome acessível não discrimina (CA-3)

**Problema:** o teste de CA-3 usa `toHaveAccessibleName(/\S/)`, que passa com qualquer nome não vazio, inclusive o texto visível sem `aria-label` ou um nome errado/trocado entre os links. O PLAN passo 4 pede cobrir "nome acessível". Os outros testes localizam os links por `ariaLabel`, mas só dois, e não verificam que o link do Instagram aponta para o nome do Instagram no cenário com número.

**Âncoras:** `src/sections/site-footer.test.tsx:71` · `PLAN-01 passo 4` · `TASK CA-3`

**Sugestão:** no laço, comparar com o nome esperado de cada link (`footerContent.social.instagram.ariaLabel` e `...whatsapp.ariaLabel`) com `toHaveAccessibleName(<string>)`, e/ou afirmar o par href↔nome.

**Afeta:** PLAN-01 passo 4

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                | Desfecho   | Artefatos afetados                         |
| ---- | --------------------- | ---------- | ------------------------------------------ |
| Q1.1 | Código existente      | ✅ Aceito  | PLAN-01 passos 1 e 2                       |
| Q1.2 | Código existente      | ✅ Aceito  | PLAN-01 passo 3, TASK §Premissas e Incertezas |
| Q2.1 | Coerência TASK ↔ PLAN | ✅ Aceito  | TASK §Premissas e Incertezas, PLAN-01 §Pontos de Atenção |
| Q2.2 | Coerência TASK ↔ PLAN | ✅ Aceito  | TASK §Premissas e Incertezas, PLAN-01 §Incertezas |
| Q5.1 | Cenários esquecidos   | ✅ Aceito  | PLAN-01 passo 4                            |

## Decisões

### Q1.1 — "©" literal no JSX contraria o próprio PLAN e a AR-01

**Decisão:** o símbolo e o prefixo da linha de copyright passam para `content/footer.ts`; o JSX compõe só prefixo, ano e marca, sem texto literal.

**Impacto:** `PLAN-01` passos 1 e 2 reescritos. Código (`site-footer.tsx`, `footer.ts`) corrigido na Fase 5.

### Q1.2 — Instagram sem ícone e WhatsApp com ícone

**Decisão:** os dois links ficam só com texto; `MessageCircle` sai do rodapé, coerente com I2.

**Impacto:** `PLAN-01` passo 3 reescrito; `TASK.md §Premissas e Incertezas` (I2) decidida. Código corrigido na Fase 5.

### Q2.1 — Fase 4 executada antes da Fase 3

**Decisão:** os ajustes entram em TASK/PLAN agora; o código e o teste são corrigidos pela Fase 5 (`/review-feature`). Fica registrado que a implementação antecedeu a Fase 3.

**Impacto:** nota em `TASK.md §Premissas e Incertezas` e em `PLAN-01 §Pontos de Atenção`.

### Q2.2 — I1 e I2 resolvidas só no MEMORY

**Decisão:** I1 confirmada (mensagem própria "Olá, vim pelo site da Fornalha.") e I2 confirmada (sem ícone de marca).

**Impacto:** `TASK.md §Premissas e Incertezas` e `PLAN-01 §Incertezas` com as duas marcadas como decididas.

### Q5.1 — Asserção de nome acessível não discrimina (CA-3)

**Decisão:** o teste de CA-3 compara o nome acessível de cada link com o `ariaLabel` esperado, em vez de `/\S/`.

**Impacto:** `PLAN-01` passo 4 reescrito. Teste corrigido na Fase 5.

## Incertezas abertas

Nenhuma.

## Alterações aplicadas

| Arquivo                                  | O que mudou                                                                 | Origem     |
| ---------------------------------------- | --------------------------------------------------------------------------- | ---------- |
| `plans/PLAN-01-rodape-redes.md`          | passos 1, 2, 3 e 4 ajustados; §Pontos de Atenção e §Incertezas atualizados  | Q1.1, Q1.2, Q2.1, Q2.2, Q5.1 |
| `TASK.md`                                | §Comportamento Esperado 2 e §Premissas e Incertezas: I1 e I2 decididas, nota de ordem de fases | Q1.2, Q2.1, Q2.2 |
