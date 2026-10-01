# QUESTION — FOR-006

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Itens

### Q1.1 — A descrição do centeio repete o subtítulo do Hero

**Problema:** a descrição proposta para `rye` termina em "da farinha de moinho de pedra", frase que já é o subtítulo do Hero, visível na mesma página. Repetir o mesmo fato com as mesmas palavras desperdiça o "detalhe concreto" que a TASK pede e fere o espírito do CA-2 (não repetir estrutura/conteúdo).

**Âncoras:** `src/content/hero.ts:3` · `PLAN-01 passo 1 (linha `rye`)` · `TASK §Comportamento Esperado 1`

**Sugestão:** trocar o detalhe do `rye` por algo que o nome do produto já diz e que o Hero não diz (ex.: "Centeio de miolo denso e sabor firme, bom com manteiga ou queijo"), sem citar a farinha.

**Afeta:** PLAN-01 passo 1

**Resposta:** aceito

**Comentário:**

### Q1.2 — Subtítulo "Pães, doces e café" repete os rótulos de categoria logo abaixo

**Problema:** o subtítulo proposto lista "Pães, doces e café", e a seção renderiza em seguida os rótulos `Pães`, `Doces` e `Bebidas`. O subtítulo vira índice redundante, e "café" aparece aqui e "Bebidas" ali para o mesmo grupo.

**Âncoras:** `src/content/products-section.ts:4` · `PLAN-01 passo 2` · `TASK §Comportamento Esperado 2`

**Sugestão:** usar o subtítulo para o que os rótulos não dizem (fermentação de 36 horas ou fornadas), não para enumerar as categorias.

**Afeta:** PLAN-01 passo 2

**Resposta:** aceito

**Comentário:**

### Q2.1 — As seis descrições repetem vocabulário apesar de aberturas diferentes

**Problema:** o PLAN só verifica a abertura (CA-2). Na proposta, "miolo" aparece em `sourdough`, `rye` e `croissant`; "úmido" em `sourdough` e `orange-cake`; "36 horas" em `sourdough` e `focaccia`. Lido em sequência no grid, o conjunto soa em fórmula, que é o que o CA-2 quer evitar ("nenhuma repete a estrutura de outra").

**Âncoras:** `PLAN-01 passo 1 (tabela)` · `TASK CA-2`

**Sugestão:** cada descrição ganha um detalhe distinto: fermentação/casca no `sourdough`, centeio no `rye`, alecrim/azeite no `focaccia`, camadas no `croissant`, laranja no `orange-cake`, forma de servir no `filter-coffee`. "Miolo" fica no máximo uma vez; "36 horas" aparece uma vez só.

**Afeta:** PLAN-01 passo 1

**Resposta:** aceito

**Comentário:**

### Q2.2 — Café coado fica sem detalhe concreto

**Problema:** a TASK exige "um detalhe concreto (ingrediente, tempo, textura)". "Coado na hora e servido quente, para acompanhar pão, croissant ou bolo" não traz ingrediente, tempo nem textura: é frase de serviço, e a lista de acompanhamentos cita itens que também têm descrição própria. O PLAN evita origem/torra por falta de fato no EPIC (Incerteza 1), mas não oferece substituto que cumpra o Comportamento Esperado 1.

**Âncoras:** `PLAN-01 passo 1 (linha `filter-coffee`)` · `PLAN-01 §Incertezas 1` · `TASK §Comportamento Esperado 1, I1`

**Sugestão:** manter sem origem/torra e ancorar em algo observável e não inventado, por exemplo o método e o tempo ("Coado na hora, passo a passo, e servido quente na xícara").

**Afeta:** PLAN-01 passo 1

**Resposta:** aceito

**Comentário:**

### Q3.1 — I1: o café pode citar origem ou torra?

**Problema:** a incerteza da TASK foi resolvida no PLAN por omissão ("a proposta evita"), mas a TASK pede decisão. O EPIC manda "não invente outros" fatos. Citar origem/torra seria inventar; precisa de decisão explícita para não reabrir em `/review-feature`.

**Âncoras:** `TASK I1` · `PLAN-01 §Incertezas 1` · `EPIC §Fatos da marca`

**Sugestão:** decidir que **não** cita origem nem torra, e registrar a decisão. Se quiser citar, a pessoa informa o fato e ele entra na TASK/EPIC antes da Fase 4.

**Afeta:** TASK §Premissas e Incertezas, PLAN-01 §Incertezas

**Resposta:** aceito

**Comentário:**

### Q3.2 — I2: subtítulo sobre fornadas ou fermentação?

**Problema:** a escolha entre horário das fornadas e as 36 horas de fermentação segue aberta. Ela decide o texto final do passo 2 e interage com Q1.2, Q5.1 e com o que as descrições já dizem sobre 36 horas (Q2.1).

**Âncoras:** `TASK I2` · `PLAN-01 §Incertezas 2` · `PLAN-01 passo 2`

**Sugestão:** subtítulo sobre a fermentação de 36 horas, porque o horário vive em "Horários e endereço" e porque Q5.1 mostra que as fornadas às 7h e 16h não valem todos os dias.

**Afeta:** PLAN-01 passo 2, TASK §Premissas e Incertezas

**Resposta:** aceito

**Comentário:**

### Q4.1 — "36 horas" na focaccia estende o fato do EPIC sem declarar

**Problema:** a Incerteza 3 do PLAN só admite a extrapolação do `rye` (farinha de moinho de pedra). A `focaccia` também a faz: "Massa macia de 36 horas de fermentação". O EPIC dá 36 horas para a fermentação natural da padaria, não para cada produto; croissant e bolo, por exemplo, não passam por ela. A Premissa 4 do PLAN não cobre isso.

**Âncoras:** `PLAN-01 passo 1 (linha `focaccia`)` · `PLAN-01 §Incertezas 3` · `EPIC §Fatos da marca` · `TASK P1`

**Sugestão:** declarar como premissa que pães de fermento natural (`sourdough`, `rye`, `focaccia`) seguem os 36 horas, ou, mais seguro, só o `sourdough` cita as 36 horas e os outros usam detalhe vindo do nome (alecrim, centeio).

**Afeta:** PLAN-01 passo 1, PLAN-01 §Premissas e Incertezas

**Resposta:** aceito

**Comentário:**

### Q5.1 — "Fornadas às 7h e às 16h" é falso no fim de semana

**Problema:** o subtítulo proposto afirma fornadas às 7h e às 16h sem qualificação. O EPIC fecha o sábado às 14h e o domingo às 12h, e a segunda fica fechada. A fornada das 16h não existe nesses dias, então a copy contradiz a seção "Horários e endereço". O EPIC lista os horários como "fatos da marca" ao lado, e a PLAN usa só o par 7h/16h sem cruzar.

**Âncoras:** `PLAN-01 passo 2` · `EPIC §Fatos da marca (Fornadas, Horários)`

**Sugestão:** não citar horário no subtítulo (ver Q3.2), ou qualificar ("fornadas às 7h e às 16h, de terça a sexta").

**Afeta:** PLAN-01 passo 2

**Resposta:** aceito

**Comentário:**

### Q6.1 — Contagem de palavras manual e sem regra para hífen

**Problema:** o passo 3 manda "contar palavras" à mão. A regra de P2 ("separação em espaços; 36 e 7h contam") não cobre hífen nem pontuação colada, e a tabela do PLAN mostra contagens que o executor pode alterar ao "ajustar a redação". Um erro de contagem passa direto, já que não há teste de CA-1.

**Âncoras:** `PLAN-01 passo 1 (regra de contagem)` · `PLAN-01 passo 3` · `TASK CA-1`

**Sugestão:** conferir CA-1 e o subtítulo com um one-liner descartável (`split(/\s+/)`) rodado no passo 3, sem criar arquivo versionado nem teste novo, e citar a regra "token separado por espaço" também no passo 3.

**Afeta:** PLAN-01 passo 3

**Resposta:** aceito

**Comentário:**

### Q6.2 — "O executor pode ajustar a redação" contradiz o aviso de seguir o PLAN fielmente

**Problema:** o cabeçalho do PLAN exige fidelidade e desvio aprovado, mas o passo 1 abre a redação ao executor. Sem delimitar o que pode mudar, o texto final nasce na Fase 4 sem revisão da pessoa, e a copy é justamente o entregável.

**Âncoras:** `PLAN-01 cabeçalho (IMPORTANTE)` · `PLAN-01 passo 1, tópico "Texto proposto"`

**Sugestão:** fixar os textos finais no PLAN após esta rodada (já ajustados por Q1.1, Q2.1, Q2.2, Q4.1) e declarar que o executor só os copia; qualquer mudança vira desvio comunicado.

**Afeta:** PLAN-01 passo 1

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                       | Desfecho  | Artefatos afetados                          |
| ---- | ---------------------------- | --------- | ------------------------------------------- |
| Q1.1 | Código existente             | ✅ Aceito | PLAN-01 passo 1                             |
| Q1.2 | Código existente             | ✅ Aceito | PLAN-01 passo 2                             |
| Q2.1 | Coerência TASK ↔ PLAN        | ✅ Aceito | PLAN-01 passo 1                             |
| Q2.2 | Coerência TASK ↔ PLAN        | ✅ Aceito | PLAN-01 passo 1                             |
| Q3.1 | Premissas declaradas         | ✅ Aceito | TASK §Premissas e Incertezas, PLAN-01 §Incertezas |
| Q3.2 | Premissas declaradas         | ✅ Aceito | TASK §Premissas e Incertezas, PLAN-01 passo 2 |
| Q4.1 | Premissas não declaradas     | ✅ Aceito | PLAN-01 passo 1, PLAN-01 §Premissas e Incertezas |
| Q5.1 | Cenários esquecidos          | ✅ Aceito | PLAN-01 passo 2                             |
| Q6.1 | Escopo e complexidade        | ✅ Aceito | PLAN-01 passo 3                             |
| Q6.2 | Escopo e complexidade        | ✅ Aceito | PLAN-01 passo 1                             |

## Decisões

### Q1.1 — A descrição do centeio repete o subtítulo do Hero

**Decisão:** o `rye` não cita a farinha de moinho de pedra; o detalhe vem do próprio centeio (miolo denso, sabor firme, como servir).

**Impacto:** `PLAN-01` passo 1, linha `rye` reescrita; Incerteza 3 do PLAN removida.

### Q1.2 — Subtítulo "Pães, doces e café" repete os rótulos de categoria logo abaixo

**Decisão:** o subtítulo não enumera categorias; fala do processo (fermentação lenta e fornada).

**Impacto:** `PLAN-01` passo 2, subtítulo reescrito.

### Q2.1 — As seis descrições repetem vocabulário apesar de aberturas diferentes

**Decisão:** cada descrição tem detalhe próprio; "miolo" e "úmido" aparecem uma vez cada, "36 horas" só no `sourdough`.

**Impacto:** `PLAN-01` passo 1, tabela inteira reescrita.

### Q2.2 — Café coado fica sem detalhe concreto

**Decisão:** o café ancora no método e no serviço ("coado na hora, passo a passo"), sem citar outros produtos.

**Impacto:** `PLAN-01` passo 1, linha `filter-coffee` reescrita.

### Q3.1 — I1: o café pode citar origem ou torra?

**Decisão:** não cita origem nem torra — seria fato inventado fora do EPIC. Citar exige incluir o fato no EPIC/TASK antes.

**Impacto:** `TASK.md` I1 resolvida; `PLAN-01` Incerteza 1 vira decisão.

### Q3.2 — I2: subtítulo sobre fornadas ou fermentação?

**Decisão:** subtítulo sobre a fermentação, sem horário. Também não repete "36 horas", que já é o título do Hero.

**Impacto:** `TASK.md` I2 resolvida; `PLAN-01` passo 2 e Incerteza 2 atualizados.

### Q4.1 — "36 horas" na focaccia estende o fato do EPIC sem declarar

**Decisão:** caminho mais seguro — só o `sourdough` cita as 36 horas; `focaccia` fica com alecrim, azeite e textura.

**Impacto:** `PLAN-01` passo 1, linha `focaccia` reescrita; Premissa 4 atualizada.

### Q5.1 — "Fornadas às 7h e às 16h" é falso no fim de semana

**Decisão:** o subtítulo não cita horário de fornada.

**Impacto:** `PLAN-01` passo 2, subtítulo e Fonte atualizados.

### Q6.1 — Contagem de palavras manual e sem regra para hífen

**Decisão:** o passo 3 confere a contagem com um one-liner `node -e` (`split(/\s+/)`), sem arquivo versionado nem teste novo; regra "token separado por espaço" explícita.

**Impacto:** `PLAN-01` passo 3 reescrito.

### Q6.2 — "O executor pode ajustar a redação" contradiz o aviso de seguir o PLAN fielmente

**Decisão:** os textos finais ficam fixos no PLAN, aprovados nesta rodada; o executor só copia, e qualquer mudança é desvio comunicado.

**Impacto:** `PLAN-01` passo 1, cláusula de ajuste removida.

## Incertezas abertas

_Nenhuma._

## Alterações aplicadas

| Arquivo                          | O que mudou                                                                  | Origem                         |
| -------------------------------- | ---------------------------------------------------------------------------- | ------------------------------ |
| `plans/PLAN-01-copy-cardapio.md` | passo 1: tabela com os seis textos finais; executor só copia                  | Q1.1, Q2.1, Q2.2, Q4.1, Q6.2   |
| `plans/PLAN-01-copy-cardapio.md` | passo 2: subtítulo "Da fermentação lenta ao forno, sai fresco em cada fornada." | Q1.2, Q3.2, Q5.1               |
| `plans/PLAN-01-copy-cardapio.md` | passo 3: conferência de contagem por one-liner `split(/\s+/)`                | Q6.1                           |
| `plans/PLAN-01-copy-cardapio.md` | §Premissas e Incertezas: Premissa 4 atualizada; Incertezas 1-3 resolvidas     | Q3.1, Q3.2, Q4.1               |
| `TASK.md`                        | §Premissas e Incertezas: I1 e I2 resolvidas                                   | Q3.1, Q3.2                     |
