# QUESTION — FOR-002

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 1 — Confronto com código existente: nada relevante
- Frente 4 — Premissas não declaradas: nada relevante
- Frente 6 — Escopo e complexidade: nada relevante

## Itens

### Q2.1 — Citações a "Fase 3 (Q3.1/Q3.2/Q5.2)" e "Ver QUESTION.md" sem artefato correspondente

**Problema:** TASK.md (I1, I2) e PLAN-01 (Fonte do Passo 1, Incertezas finais, Pontos de Atenção) já afirmam que I1/I2 foram "Resolvido na Fase 3 (Q3.1)" / "(Q3.2)" e que a estratégia de teste de CA-3 foi "decisão da Fase 3, Q5.2", remetendo a "Ver QUESTION.md". Mas `tasks/FOR-002/QUESTION.md` não existe — nunca existiu: `git log -- tasks/FOR-002/TASK.md` só mostra o commit de bootstrap, e a edição que insere essas citações está só no working tree, não commitada. Esta própria rodada de `/question` está entrando pela Etapa 1 porque o arquivo está ausente (Etapa 0.5) — ou seja, essas IDs não têm nenhum registro que as sustente, e continuarão fantasmas depois que este arquivo nascer com IDs novos (Q1.x, Q2.x...) que não coincidem com Q3.1/Q3.2/Q5.2.

**Âncoras:** `tasks/FOR-002/TASK.md:40-41` (working tree, não commitado) · `plans/PLAN-01-copy-hero.md:23,67,79`

**Sugestão:** Escolher um caminho: (a) tratar I1/I2 como reabertas nesta rodada — cada uma vira item novo aqui (ver Q2.2 e Q3.1 abaixo) e, na Etapa 3, as citações em TASK/PLAN são reescritas para apontar para os IDs reais deste `QUESTION.md`; ou (b) confirmar que o texto pré-preenchido já reflete uma decisão real tomada informalmente, e trocar "Q3.1"/"Q3.2"/"Q5.2" pelos IDs que este arquivo de fato vier a registrar.

**Afeta:** TASK.md §Incertezas (I1, I2), PLAN-01 (Fonte do Passo 1, Incertezas, Pontos de Atenção)

**Resposta:** aceito

**Comentário:**

### Q2.2 — Subtítulo proposto usa o fato que a própria TASK reservou para FOR-006

**Problema:** A nota de resolução da I1 em TASK.md diz que "fornadas às 7h e às 16h" **fica livre para FOR-006** — isto é, não deveria entrar no texto de FOR-002. Mas PLAN-01 Passo 1 (linha 29) escreve exatamente essa frase no subtítulo: "Fornadas às 7h e às 16h, com farinha orgânica de moinho de pedra." — o oposto do que a própria resolução registra. Agrava o problema: `tasks/FOR-006/TASK.md` (Incerteza I2) ainda está decidindo "se o subtítulo novo fala das fornadas (horário) ou da fermentação" — se FOR-002 já usa esse fato, FOR-006 corre risco de repetir a mesma informação numa seção logo abaixo do Hero na ordem do EPIC.

**Âncoras:** `tasks/FOR-002/TASK.md:40` (I1) · `plans/PLAN-01-copy-hero.md:25,29` · `tasks/FOR-006/TASK.md` §Incertezas I2

**Sugestão:** Ou (a) tirar "fornadas às 7h e às 16h" do subtítulo de FOR-002 e usar outro fato de §Fatos da marca (ex.: "o fermento está vivo desde 2019", ou só "farinha orgânica de moinho de pedra" sozinho); ou (b) revogar explicitamente a reserva ("fica livre para FOR-006") e aceitar que as duas tasks citem o mesmo fato.

**Afeta:** TASK.md §Incertezas (I1), PLAN-01 Passo 1

**Resposta:** aceito

**Comentário:**

### Q2.3 — Passo 3 (verificação) reconfere CA-1 e CA-4, mas não CA-2

**Problema:** PLAN-01 Passo 3 lista como conferência explícita a contagem de palavras (CA-1) e o `git diff --stat` (CA-4), mas não repete, como item de checklist, a verificação de CA-2 (o texto cita um fato de §Fatos da marca e não usa superlativo vazio) — essa parte fica só a cargo do julgamento feito no Passo 1, sem um passo de reconferência simétrico ao das outras duas.

**Âncoras:** `plans/PLAN-01-copy-hero.md:40-46` (Passo 3)

**Sugestão:** Acrescentar ao Passo 3 um item explícito: reler o texto final contra a lista de fatos do EPIC §Fatos da marca e contra os superlativos vazios citados em §Marca (voz), do mesmo jeito que CA-1 e CA-4 já são reconferidos.

**Afeta:** PLAN-01 Passo 3

**Resposta:** aceito

**Comentário:**

### Q3.1 — Subtítulo de 13 palavras junta 2 fatos numa frase só, tensionando "frases curtas" do EPIC

**Problema:** EPIC §Marca pede "frases curtas" — no plural, várias frases curtas, não uma frase longa. O subtítulo escolhido, "Fornadas às 7h e às 16h, com farinha orgânica de moinho de pedra.", é uma oração composta juntando dois fatos por vírgula, com 13 das 20 palavras permitidas por CA-1. A premissa P1 (contagem de palavras sem pontuação) trata o teto numérico como único critério, mas caber no teto não garante frase curta no sentido do EPIC — é uma frase longa que só cabe dentro do limite.

**Âncoras:** `plans/PLAN-01-copy-hero.md:29` · `tasks/EPIC.md` §Marca ("frases curtas")

**Sugestão:** Dividir em duas frases curtas (ex.: "Fornadas às 7h e às 16h. Farinha orgânica de moinho de pedra.") ou manter só um dos dois fatos no subtítulo, deixando a frase mais enxuta mesmo dentro do teto de 20 palavras.

**Afeta:** PLAN-01 Passo 1 (texto do subtítulo)

**Resposta:** aceito

**Comentário:**

### Q5.1 — Nada no PLAN pede que o TEST.md confira o novo comprimento do texto nas duas larguras

**Problema:** O subtítulo passa de 5 para 13 palavras (quase triplica) e o título passa de 20 para 32 caracteres; a Triagem visual do PLAN-01 classifica a mudança como "ajuste pontual... sem canvas" porque componente e layout não mudam de código — mas o volume de texto renderizado dentro do `<h1 className="text-4xl font-bold">` e do `<p className="text-lg">` (`src/sections/hero.tsx:8-13`) muda bastante, o que pode alterar quebras de linha e ritmo vertical do hero em telas estreitas. Nenhum passo do PLAN nem nota em "Pontos de Atenção" pede que a Fase 6a (TEST.md) confira esse ponto especificamente.

**Âncoras:** `src/sections/hero.tsx:8-13` · `plans/PLAN-01-copy-hero.md` §Triagem visual e §Pontos de Atenção

**Sugestão:** Acrescentar em "Pontos de Atenção" uma nota pedindo que o TEST.md (Fase 6a, seguindo `teste-de-mesa` — duas larguras quando cabe) inclua um cenário conferindo que o hero não quebra de forma estranha nem estoura o container na largura estreita, já que o volume de texto mudou mesmo sem mudança de layout.

**Afeta:** PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                         | Desfecho   | Artefatos afetados         |
| ---- | ------------------------------- | ---------- | --------------------------- |
| Q2.1 | Coerência TASK ↔ PLAN            | ✅ Aceito  | TASK.md, PLAN-01            |
| Q2.2 | Coerência TASK ↔ PLAN            | ✅ Aceito  | TASK.md, PLAN-01            |
| Q2.3 | Coerência TASK ↔ PLAN            | ✅ Aceito  | PLAN-01                     |
| Q3.1 | Ataque às premissas declaradas   | ✅ Aceito  | PLAN-01                     |
| Q5.1 | Cenários esquecidos              | ✅ Aceito  | PLAN-01                     |

## Decisões

### Q2.1 — Citações a "Fase 3 (Q3.1/Q3.2/Q5.2)" sem artefato correspondente

**Decisão:** As citações eram fantasmas — este `QUESTION.md` não existia antes desta rodada. I1 foi de fato reaberta nesta rodada (via Q2.2 e Q3.1, que mudam o subtítulo); I2 (escolha do CTA) e a nota de classificação de teste de CA-3 não foram relitigadas por nenhum item — só tiveram a citação corrigida para o ID real que apontou o problema (Q2.1).

**Impacto:** `TASK.md` §Incertezas (I1, I2) e `PLAN-01` (Fonte do Passo 1, §Pontos de Atenção, §Incertezas) com citações corrigidas.

### Q2.2 — Subtítulo proposto usava fato reservado para FOR-006

**Decisão:** Subtítulo passa a usar só "Farinha orgânica de moinho de pedra." — tira "fornadas às 7h e às 16h" do texto de FOR-002, mantendo a reserva desse fato para FOR-006 como o TASK.md original já previa.

**Impacto:** `PLAN-01` Passo 1 (texto do subtítulo, 13→6 palavras); `TASK.md` §Incertezas I1 atualizada. `tasks/FOR-006/TASK.md` não foi tocado (fora de `tasks/FOR-002/`) — segue livre para citar "fornadas" sem repetição.

### Q2.3 — Passo 3 não reconferia CA-2

**Decisão:** Acrescentado item de checklist no Passo 3 pedindo releitura do texto final contra EPIC §Fatos da marca e contra os superlativos vazios de §Marca (voz), simétrico à reconferência já feita para CA-1 e CA-4.

**Impacto:** `PLAN-01` Passo 3 ganha um bullet novo.

### Q3.1 — Subtítulo de 13 palavras juntava 2 fatos numa frase só

**Decisão:** Resolvido pela mesma escolha de Q2.2: subtítulo com um único fato ("Farinha orgânica de moinho de pedra.") já é uma frase curta dentro do teto de 20 palavras — não é mais necessário dividir em duas frases.

**Impacto:** mesmo ajuste de Q2.2 no `PLAN-01` Passo 1; nenhuma mudança adicional.

### Q5.1 — Nada pedia que o TEST.md conferisse o novo comprimento nas duas larguras

**Decisão:** Acrescentada nota em §Pontos de Atenção do PLAN-01 pedindo que o TEST.md (Fase 6a, `teste-de-mesa`) inclua um cenário conferindo que o hero não quebra de forma estranha nem estoura o container na largura estreita — o título ainda cresce de 20 para 32 caracteres, mesmo com o subtítulo agora estável em tamanho.

**Impacto:** `PLAN-01` §Pontos de Atenção ganha um bullet novo.

## Incertezas abertas

_Nenhuma — todos os itens desta rodada foram aceitos._

## Alterações aplicadas

| Arquivo                          | O que mudou                                                                   | Origem       |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------- |
| `TASK.md`                         | §Incertezas I1: citação corrigida, subtítulo final registrado                  | Q2.1, Q2.2    |
| `TASK.md`                         | §Incertezas I2: citação corrigida (Q3.2 → Q2.1)                                | Q2.1          |
| `plans/PLAN-01-copy-hero.md`      | Passo 1 "Fonte": citação corrigida (Q3.1, Q3.2 → Q2.1, Q2.2, Q3.1)              | Q2.1          |
| `plans/PLAN-01-copy-hero.md`      | Passo 1: subtítulo reescrito para "Farinha orgânica de moinho de pedra." (6 palavras); parêntese do fato do título ajustado | Q2.2, Q3.1    |
| `plans/PLAN-01-copy-hero.md`      | Passo 3: bullet novo reconferindo CA-2                                         | Q2.3          |
| `plans/PLAN-01-copy-hero.md`      | §Pontos de Atenção: citação corrigida (Q5.2 → Q2.1); bullet novo sobre largura estreita | Q2.1, Q5.1 |
| `plans/PLAN-01-copy-hero.md`      | §Premissas e Incertezas → Incertezas: citação corrigida (Q3.1, Q3.2 → Q2.1, Q2.2) | Q2.1       |
