# QUESTION — FOR-007

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 6 — Escopo e complexidade: nada relevante

## Itens

### Q1.1 — `Card` envolvendo o `<dl>` direto fica sem padding horizontal

**Problema:** o PLAN diz "`Card` envolvendo um `<dl>`" sem `CardContent`. O `Card` só tem padding vertical (`py-(--card-spacing)`); o padding lateral vem de `CardHeader`/`CardContent` (`px-(--card-spacing)`). Sem `CardContent`, as linhas dos dias encostam na borda do card e o fundo `bg-primary/10` da linha de hoje vai de ponta a ponta, cortado pelo `overflow-hidden` do card. O `ProductCard` usa `CardContent` e é o padrão que o PLAN cita como referência.

**Âncoras:** `PLAN-01 passo 4 (Coluna 1)` · `src/components/ui/card.tsx:14` · `src/components/ui/card.tsx:71-77` · `src/components/product-card.tsx:30`

**Sugestão:** o passo 4 passa a dizer `Card` > `CardContent` > `<dl>` nas duas colunas. Para a linha de hoje, usar `rounded-md px-2 py-1.5` (ou equivalente em token de espaçamento), de modo que o destaque tenha respiro dentro do `CardContent`.

**Afeta:** PLAN-01 passo 4

**Resposta:** aceito

**Comentário:**

### Q2.1 — "Fechado" em `text-muted-foreground` quebra o DS-05 do próprio PLAN quando hoje é segunda

**Problema:** o passo 4 manda o `<dd>` de dia fechado em `text-muted-foreground`. Os Pontos de Atenção dizem que o fundo `bg-primary/10` "só leva texto `text-foreground`" (DS-05). Quando hoje é segunda, a mesma linha tem `bg-primary/10` **e** `text-muted-foreground`: é exatamente o par que o PLAN proíbe. Em `src/index.css:60-61`, `--muted-foreground` é cinza neutro (`oklch(0.556 0 0)`) e o fundo é terracota translúcido sobre o fundo claro quente; o contraste cai e ninguém mediu. CA-2 e CA-3 rodando juntos (segunda + hoje) não estão cobertos por nenhum cenário.

**Âncoras:** `PLAN-01 passo 4 (Dia fechado)` · `PLAN-01 §Pontos de Atenção DS-05` · `src/index.css:56-61` · `src/index.css:91-96`

**Sugestão:** na linha de hoje, o `<dd>` sempre usa `text-foreground`, mesmo fechado; `text-muted-foreground` só vale para dia fechado que não é hoje. Registrar no PLAN o caso "hoje = segunda" como cenário do teste de mesa.

**Afeta:** PLAN-01 passo 4, PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

### Q2.2 — "Fechado" tem duas fontes de verdade em `content/hours.ts`

**Problema:** o passo 3 define segunda com `hours: "Fechado"` **e** `closed: true`. O texto e a flag podem divergir (alguém muda um e esquece o outro), e o componente precisa decidir qual manda: o estilo `text-muted-foreground` usa `closed`, o que a pessoa lê vem de `hours`. O PLAN também não diz o tipo dos dias, então nada impede um dia `closed: true` com horário preenchido.

**Âncoras:** `PLAN-01 passo 3 (days)` · `PLAN-01 passo 4 (Dia fechado)` · `TASK §Comportamento Esperado 2`

**Sugestão:** manter `hours: "Fechado"` como o texto exibido e **derivar** o estilo de `closed`, mas declarar no PLAN o contrato do item (`{ label: string; hours: string; closed?: true }`) e exigir um teste A em `content/hours.ts` ("todo dia com `closed` tem `hours` igual a 'Fechado'"). Alternativa mais enxuta: tirar `closed` e adicionar `closedLabel` ao conteúdo, com o componente usando `hours === closedLabel`; escolher uma das duas.

**Afeta:** PLAN-01 passo 3, PLAN-01 passo 4

**Resposta:** aceito

**Comentário:**

### Q3.1 — P3 (endereço duplicado) deixa o endereço divergir sem aviso

**Problema:** a P3 e o PLAN aceitam o endereço escrito duas vezes (`footerContent.address` e `hoursContent.address`) e ordenam "não unificar". Mas hoje nada detecta divergência: se uma task futura corrigir o endereço no rodapé, o link "Como chegar" continua apontando para o antigo, e é o link que leva a pessoa até a padaria. O custo de proteger é uma asserção.

**Âncoras:** `TASK §Premissas P3` · `PLAN-01 §Pontos de Atenção (Endereço duplicado)` · `src/content/footer.ts:2`

**Sugestão:** manter a duplicação (decisão da TASK), mas registrar no PLAN que a Fase 6b inclui um teste A `hoursContent.address === footerContent.address`, citando P3. Não toca no rodapé nem em `content/`.

**Afeta:** PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

### Q4.1 — Os rótulos dos sete dias não estão especificados

**Problema:** o passo 3 diz que `days` tem `label` e `hours`, mas não diz **qual** `label`. O EPIC só traz "segunda", "terça a sexta", "sábado", "domingo". O PLAN não define se a tela mostra "Segunda", "Segunda-feira" ou "Seg". Isso importa porque CA-2 ("a linha de segunda") e CA-3 ("linha de sábado") serão testados por texto, e porque em 375 px "Segunda-feira" + selo "Hoje" + horário disputam a mesma linha (CA-5). Hoje o executor decide sozinho, e o autotest pode adivinhar outro texto.

**Âncoras:** `PLAN-01 passo 3 (days)` · `TASK CA-2, CA-3, CA-5` · `EPIC §Fatos da marca (Horários)`

**Sugestão:** fixar no passo 3 os sete rótulos por extenso, sem sufixo: "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo". É o formato mais curto que ainda lê como dia da semana e combina com o EPIC, que escreve "segunda", "sábado".

**Afeta:** PLAN-01 passo 3

**Resposta:** aceito

**Comentário:**

### Q5.1 — `aria-current="date"` num `<div>` genérico dentro do `<dl>` tem suporte fraco e atrapalha o teste

**Problema:** a premissa 3 do PLAN põe `aria-current` no `<div>` da linha. Um `<div>` dentro de `<dl>` não tem papel próprio; leitores de tela costumam ignorar `aria-current` em elemento genérico, então a marcação existe no DOM mas pode não ser anunciada. O selo visível "Hoje" cobre quem enxerga, mas não quem usa leitor de tela. O mesmo vale para o teste: `getByRole` não alcança um `div` genérico, então CA-3 teria de usar `container.querySelector('[aria-current="date"]')`, que é um sensor fraco.

**Âncoras:** `PLAN-01 §Premissas 3` · `PLAN-01 passo 4 (Linha de hoje)` · `TASK CA-3`

**Sugestão:** manter o `aria-current="date"` no `<div>` (é o que o CA-3 pede) e acrescentar ao `Badge` de hoje um texto acessível que ancore a leitura (o próprio "Hoje" já é lido, desde que o `<dt>` o contenha: manter o selo **dentro** do `<dt>`). No PLAN, anotar que o teste de CA-3 localiza a linha pelo texto do `<dt>` (`getByText("Sábado").closest("[aria-current]")`), e não por papel.

**Afeta:** PLAN-01 passo 4, PLAN-01 §Premissas

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                     | Desfecho  | Artefatos afetados                           |
| ---- | -------------------------- | --------- | -------------------------------------------- |
| Q1.1 | Código existente           | ✅ Aceito | PLAN-01 passo 4                              |
| Q2.1 | Coerência TASK ↔ PLAN      | ✅ Aceito | PLAN-01 passo 4, §Pontos de Atenção          |
| Q2.2 | Coerência TASK ↔ PLAN      | ✅ Aceito | PLAN-01 passo 3                              |
| Q3.1 | Premissas declaradas       | ✅ Aceito | PLAN-01 §Pontos de Atenção                   |
| Q4.1 | Premissas não declaradas   | ✅ Aceito | PLAN-01 passo 3                              |
| Q5.1 | Cenários esquecidos        | ✅ Aceito | PLAN-01 passo 4, §Premissas, §Pontos de Atenção |

## Decisões

### Q1.1 — `Card` envolvendo o `<dl>` direto fica sem padding horizontal

**Decisão:** as duas colunas usam `Card` > `CardContent`, como o `ProductCard`. A linha de hoje ganha `rounded-md px-2 py-1.5`, para o destaque ter respiro dentro do card.

**Impacto:** PLAN-01 passo 4 (colunas 1 e 2, e a linha de hoje).

### Q2.1 — "Fechado" em `text-muted-foreground` quebra o DS-05 quando hoje é segunda

**Decisão:** na linha de hoje, o `<dd>` fica sempre em `text-foreground`; `text-muted-foreground` só vale para dia fechado que não é hoje. O caso "hoje = segunda" vira cenário do teste de mesa.

**Impacto:** PLAN-01 passo 4 (dia fechado) e §Pontos de Atenção (DS-05).

### Q2.2 — "Fechado" tem duas fontes de verdade

**Decisão:** ficou a primeira saída da sugestão: `hours` é o texto exibido e o estilo vem de `closed`, com o contrato `{ label: string; hours: string; closed?: true }` e um teste A de coerência na 6b. A saída `closedLabel` foi descartada.

**Impacto:** PLAN-01 passo 3.

### Q3.1 — Endereço duplicado diverge sem aviso

**Decisão:** a duplicação fica (P3), protegida por um teste A `hoursContent.address === footerContent.address` na 6b. O rodapé não muda.

**Impacto:** PLAN-01 §Pontos de Atenção (Endereço duplicado).

### Q4.1 — Rótulos dos sete dias não especificados

**Decisão:** os rótulos ficam fixos, por extenso e sem sufixo: "Segunda" … "Domingo".

**Impacto:** PLAN-01 passo 3.

### Q5.1 — `aria-current` em `<div>` genérico

**Decisão:** o `aria-current="date"` continua no `<div>`; o selo "Hoje" fica dentro do `<dt>`, para o leitor de tela anunciá-lo. O teste de CA-3 localiza a linha pelo texto do `<dt>` com `closest("[aria-current]")`.

**Impacto:** PLAN-01 passo 4 (linha de hoje), §Premissas 3, §Pontos de Atenção (`new Date()`).

## Incertezas abertas

Nenhuma.

## Alterações aplicadas

| Arquivo                            | O que mudou                                                                                     | Origem           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------- |
| `plans/PLAN-01-hours-section.md`   | passo 3: sete rótulos fixos, contrato do item e teste A de `closed` ↔ "Fechado"                 | Q4.1, Q2.2       |
| `plans/PLAN-01-hours-section.md`   | passo 4: `CardContent` nas duas colunas, `rounded-md px-2 py-1.5` na linha de hoje, selo dentro do `<dt>`, `<dd>` de hoje sempre `text-foreground` | Q1.1, Q5.1, Q2.1 |
| `plans/PLAN-01-hours-section.md`   | §Pontos de Atenção: exceção do DS-05 + cenário "hoje = segunda"; teste A do endereço; localização do CA-3 pelo `<dt>` | Q2.1, Q3.1, Q5.1 |
| `plans/PLAN-01-hours-section.md`   | §Premissas 3: o anúncio de "hoje" depende do selo dentro do `<dt>`                              | Q5.1             |
