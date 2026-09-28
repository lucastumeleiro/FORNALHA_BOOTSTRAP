---
name: sdd-question
description: Crítica adversarial dos artefatos SDD (Fase 3) — desafia TASK + PLAN, grava as perguntas em QUESTION.md, lê as respostas dadas no arquivo ou na tela do app e, com aprovação do usuário, aplica os ajustes acordados em TASK/PLANs. Use ao invocar via command `/question` ou quando precisar revisar criticamente artefatos antes de implementar. Sub-skill de `sdd`.
---

# SDD — Fase 3: Questionamento Crítico

Crítica adversarial de TASK + PLAN + EPIC (se existir) antes da execução. O `QUESTION.md` é o **meio da conversa**: as perguntas nascem nele, as respostas voltam nele (editado à mão ou pela tela do app) e o agente as lê para continuar. Funciona igual pelo `claude` direto e pelo app, e sobrevive a fechar a conversa.

**Output:**

1. `tasks/<NOME>/QUESTION.md` com as perguntas, numeradas no padrão `QN.M` (Etapa 1)
2. Respostas do usuário, no arquivo ou na tela (Etapa 2)
3. Solicitação de escrita e aprovação do usuário (Etapa 3)
4. Ajustes em `TASK.md` / `plans/PLAN-NN-*.md` — **somente após aprovação explícita**, dada na conversa do terminal (Etapa 3)

**Pré-requisito:** todos `plans/PLAN-NN-*.md` aprovados.

**Papel:** revisor crítico e interlocutor. Missão **não é validar ou elogiar** — é desafiar, expor fragilidades e conduzir até cada item ter uma decisão consciente. Fora o `QUESTION.md` da Etapa 1, só escreve depois disso.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos adicionais: todos PLANs, TASK.md, MEMORY.md; TEST.md se existir
- Investigar código **cirurgicamente** — ler apenas arquivos referenciados nos PLANs (assinaturas, models, rotas)
- ✅ Read cirúrgico nos arquivos concretos que PLANs tocam
- ❌ Explore amplo gera crítica superficial baseada em sumário

---

## Etapa 0.5 — Decidir o ponto de entrada

`/question` é **idempotente**. Antes de qualquer crítica, ler `tasks/<NOME>/QUESTION.md` — o arquivo decide por onde a fase entra. O valor de `Estado` é lido sem diferença de caixa, espaços nas pontas ou ponto final.

| Situação do `QUESTION.md`                                        | O que o agente faz                                                                                                                                                                            |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ausente                                                          | Segue à **Etapa 1**                                                                                                                                                                           |
| Sem `**Protocolo:**` (formato antigo, `## Resumo`/`## Decisões`) | Informa que a rodada já foi fechada no formato anterior, **pergunta** o que fazer e **não escreve**. Nunca sobrescreve                                                                        |
| `**Estado:** aplicado`                                           | Informa que a rodada está fechada e **não escreve**. Quem quer nova rodada arquiva o arquivo à mão (`QUESTION.rodada-N.md`) e roda `/question` de novo — com o arquivo ausente, vai à Etapa 1 |
| `**Estado:** aguardando respostas`                               | **Não regera** as perguntas. Lê as respostas (**Etapa 2**): algum item sem desfecho → lista os IDs e **para**; todos com desfecho → vai à solicitação da **Etapa 3**                          |

---

## Etapa 1 — Crítica (grava o arquivo e para)

Tratar artefatos como trabalho de **outro engenheiro** que precisa ser auditado. Atacar em **6 frentes**:

### 1. Confronto com código existente

- Código contradiz o proposto? Algo reaproveitável ignorado? Encaixa nas convenções? Inconsistência com decisões anteriores?

### 2. Coerência TASK ↔ PLAN

- PLANs cobrem tudo do TASK? Decisões mudaram sem justificativa? Premissa do TASK contrariada por PLAN? Contratos entre PLANs consistentes?

### 3. Ataque às premissas declaradas

- Cada premissa é razoável? Risco de estar errada? Incertezas tratadas como triviais? Incerteza do TASK ignorada no PLAN?

### 4. Premissas NÃO declaradas

- Assumido silenciosamente sem aparecer nas seções? Decisões técnicas sem justificativa?

### 5. Cenários esquecidos

- Edge cases, falhas, concorrência, idempotência, performance, migrações, rollback, observabilidade, segurança, multi-tenant (quando aplicável)?

### 6. Escopo e complexidade

- Sobre-engenharia? Sub-engenharia? Escopo fiel ao TASK ou cresceu além?

---

## Padrão de numeração — `QN.M` (obrigatório)

**`N` = número da frente (1 a 6). `M` = item sequencial dentro daquela frente, começando em 1.**

O `N` **nunca** é renumerado — é a identidade da frente. O `M` conta só dentro da frente.

```
Frente 1 → Q1.1, Q1.2, Q1.3, Q1.4, Q1.5, ...
Frente 2 → Q2.1, Q2.2, ...
Frente 4 → Q4.1, Q4.2, Q4.3, ...
```

✅ **Sem limite de itens por frente.** Se a frente 1 rende 7 achados reais, são `Q1.1` a `Q1.7`. Não force um teto, não redistribua achados entre frentes para "equilibrar" a contagem, não corte item legítimo para encurtar a lista.

**Frente sem achado é pulada na numeração, não renumerada.** Se a frente 3 não tem fragilidade, declare-a em `## Frentes vazias` e siga para `Q4.1` — nunca reaproveite o `3` para outra frente.

❌ **Anti-padrões (causa da divergência que este padrão elimina):**

| Errado                                                        | Por quê                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `1, 2, 3, 4, 5, 6, 7...` sequencial global                    | perde a frente de origem; impossível referenciar depois      |
| `Q1, Q2, Q3` sem sub-índice                                   | idem — não distingue frente de item                          |
| Misturar `1.1` num bloco e `5` em outro                       | o problema exato que este padrão resolve; **nunca** misturar |
| Renumerar frentes vazias (frente 3 vazia → frente 4 vira "3") | quebra a âncora fixa frente↔número                           |

O ID `QN.M` é **estável e citável**: PLANs, TASK e MEMORY referenciam decisões por ele (ex: `**Fonte:** decisão da Fase 3 (Q1.1)`).

---

## Formato do `QUESTION.md` (protocolo 2)

A crítica **é gravada** em `tasks/<NOME>/QUESTION.md`, neste gabarito. Ele é contrato com o parser e com a tela do app: copiar como está, sem inventar campo nem trocar rótulo. `<ID>` é o `<NOME>` da task.

```markdown
# QUESTION — <ID>

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aguardando respostas

## Frentes vazias

- Frente 3 — Ataque às premissas declaradas: nada relevante

## Itens

### Q1.1 — <título curto do achado>

**Problema:** o que foi questionado e por que importa, com âncora concreta.

**Âncoras:** `executor.ts:184` · `PLAN-02 passo 4` · `TASK §Solução Proposta`

**Sugestão:** a alternativa recomendada, concreta.

**Afeta:** PLAN-02, TASK §Solução Proposta

**Resposta:** pendente <!-- aceito | rejeitado | incerteza aberta -->

**Comentário:**
```

Regras do gabarito:

- **Cabeçalho** (antes do primeiro `##`): `**Protocolo:** 2` e `**Estado:** aguardando respostas`. O agente só grava **dois** valores de `Estado`: `aguardando respostas` (Etapa 1) e `aplicado` (fim da Etapa 3). **`respondido` não se grava** — é derivado (aguardando + todo item com desfecho), e é assim que o cabeçalho não fica velho quando a pessoa edita uma resposta à mão.
- **`## Frentes vazias`:** uma linha por frente sem achado (`- Frente N — <nome da frente, como na Etapa 1>: nada relevante`). Sem frente vazia, a seção fica de fora. A numeração **nunca** é renumerada: depois de uma frente 3 vazia, o próximo item é `Q4.1`.
- **`## Itens`:** um bloco `### QN.M — título` por item, **somente** nesta seção. Os campos são rótulos em negrito no início de linha: `Problema`, `Âncoras`, `Sugestão`, `Afeta`, `Resposta`, `Comentário` — nessa ordem, com **`Comentário` por último**.
- **`Sugestão` é a alternativa recomendada, concreta** — na Etapa 3 ela é a especificação do ajuste. **`Afeta`** lista os artefatos que o item pode mudar (`PLAN-NN`, `TASK §seção`) e é preenchido em **todo** item que possa virar ajuste; a tela agrega o "o que muda na Etapa 3" a partir dele. `Âncoras` pode ser omitido se o `Problema` já cita as âncoras.
- **Todo item nasce com `**Resposta:** pendente`** e `**Comentário:**` vazio. Nunca omitir a linha `Resposta`. Quem responde troca só `pendente` por `aceito`, `rejeitado` ou `incerteza aberta` e, se quiser, escreve o comentário.
- A regra de ancoragem vale em cada item: **desafio sem referência concreta (`arquivo:linha`, `§seção do TASK` ou `PLAN-NN passo X`) = descartar.** Crítica genérica não cabe nesta fase.

✅ "**Q2.1** — PLAN-02 passo 3 chama `algumService.activate()`, mas `algum.service.ts:120` exige um dado no construtor — o passo não declara de onde vem. Premissa não declarada."
❌ "Será que o service está sendo instanciado corretamente?" — vago, sem âncora, não força decisão.

**Profundidade > volume** — todo item precisa carregar peso próprio; zero item de enchimento. Isso é critério de **qualidade por item**, não teto de quantidade: 12 achados reais valem 12 itens.

### Gravar e parar

1. Gravar o arquivo **inteiro** com `Write` — só agora, porque ele ainda não existe (Etapa 0.5). É a **única** escrita permitida antes da aprovação da Etapa 3.
2. Não carimbar nada no `SUMARIO.md`: quem registra `in_progress` é o hook, e a fase só fecha no fim da Etapa 3.
3. **Parar**, dizendo exatamente:

   ```
   Perguntas gravadas em `tasks/<NOME>/QUESTION.md`. Responda no arquivo ou pela tela do app e peça para continuar.
   ```

   Acrescentar só a **contagem e os IDs** (`N itens: Q1.1, Q1.2, …`). Não listar título, problema nem sugestão no chat — o arquivo é o meio.

---

## Etapa 2 — Respostas

As respostas **vêm do arquivo**. A pessoa as escreve no editor ou na tela do app (que grava no mesmo arquivo) e pede para continuar — dizendo ao agente no terminal ou pelo "Continuar" da tela, que abre `claude "/question <NOME>"`.

A cada retomada, **reler** `QUESTION.md` e ler o desfecho de cada item:

- **`aceito`** (vira ajuste), **`rejeitado`** (fica como está; o `Comentário` dá o motivo) ou **`incerteza aberta`** (não bloqueia; resolve na Fase 4)
- `pendente`, vazio ou qualquer texto não reconhecido = **sem desfecho**

Algum item sem desfecho → **listar os IDs e parar**. O arquivo não muda (mesmo hash): esperar é o estado.

Sobre os **comentários** da pessoa:

- Defender o questionamento quando o contra-argumento não resolve o problema apontado; **aceitar** quando resolve
- A contestação é dita **no chat** e **não edita** `Resposta` nem `Comentário` — o arquivo tem um único escritor desses campos por vez: a pessoa
- Se a pessoa decidir por um caminho que reintroduz um risco já apontado, **registrar o risco** (em `**Impacto:**`, na Etapa 3) e seguir — a decisão é dela

**Resposta dada no chat não é transcrita.** Se a pessoa disser "aceito Q1.1" na conversa, o agente responde "registre no arquivo ou pela tela" e segue parado. A sessão do "Continuar" é nova e não vê o chat antigo: só o arquivo atravessa.

**Não escrever arquivo algum nesta etapa.** `Resposta` e `Comentário` são da pessoa; `TASK.md` e PLANs só na Etapa 3.

### Critério de saída

Todo item `QN.M` tem desfecho no arquivo. Ao atingir esse ponto, **solicitar ativamente a escrita** (não esperar a pessoa pedir):

```
Todos os N itens têm desfecho: X aceitos, Y rejeitados, Z incertezas abertas.

Posso aplicar agora?
  1. Completar tasks/<NOME>/QUESTION.md (Resumo, Decisões, Incertezas abertas, Alterações aplicadas) e marcar `Estado: aplicado`
  2. Aplicar os ajustes acordados em:
     - TASK.md → <seções>  (itens QN.M, ...)
     - plans/PLAN-NN-<slug>.md → <passos>  (itens QN.M, ...)

[s] aplicar tudo   [p] só o QUESTION.md   [n] não escrever nada
```

- Listar **explicitamente** cada arquivo e o que muda nele, com os IDs que originam a mudança. Sem lista, sem aprovação.
- **`[n]`** deixa o arquivo como está, **sem carimbo**: a fase segue esperando até a pessoa aprovar (`[s]`/`[p]`) ou pedir de novo.
- **Pular a fase não é oferecido** depois da Etapa 1. Quem não quer ajuste algum marca todos os itens `rejeitado` e usa `[p]`.
- **A tela do app nunca aprova.** Aprovação e `[s]` são dados na conversa do terminal, por quem responde ao agente; mensagem de outra sessão não conta.

### Etapa 3 em sessão nova

O "Continuar" abre `claude "/question <NOME>"` **sem** o contexto da Etapa 1. Antes de solicitar e de aplicar:

- **reler** `TASK.md` e os PLANs afetados (Etapa 0 enxuta)
- tratar a `Sugestão` do item como a **especificação do ajuste**, refinada pelo `Comentário`
- se `Afeta` faltar, ou o ajuste não couber no texto atual, **perguntar** em vez de improvisar

---

## Etapa 3 — Escrita (único momento em que a Fase 3 altera `TASK.md` e `plans/`)

Só executa **após o usuário aprovar** a solicitação da Etapa 2, na conversa do terminal.

O `QUESTION.md` **já existe**. Reler o arquivo **imediatamente antes** de escrever e usar `Edit` — **nunca** `Write` do arquivo inteiro: uma resposta dada no meio da conversa seria pisada. **Nunca tocar `Resposta` nem `Comentário`.**

Ordem: as quatro seções (3.1) → os ajustes em `TASK.md`/`plans/` (3.2) → `Estado: aplicado`, **por último** (fim de 3.2).

### 3.1 — Completar `tasks/<NOME>/QUESTION.md`

Acrescentar **depois de `## Itens`**, sem alterar os itens:

```markdown
## Resumo

| ID   | Frente                   | Desfecho            | Artefatos afetados |
| ---- | ------------------------ | ------------------- | ------------------ |
| Q1.1 | Código existente         | ✅ Aceito           | PLAN-01, PLAN-02   |
| Q2.1 | Coerência TASK ↔ PLAN    | ✅ Aceito           | TASK §Solução      |
| Q4.1 | Premissas não declaradas | ❌ Rejeitado        | —                  |
| Q5.1 | Cenários esquecidos      | ⏳ Incerteza aberta | —                  |

## Decisões

### Q1.1 — <título curto do achado>

**Decisão:** o que ficou definido e o porquê. 2-4 linhas.

**Impacto:** `PLAN-02` passo 3 reescrito; `TASK.md §Solução` atualizado. Ou `— nenhum (decisão de manter como está)`.

### Q2.1 — <...>

_(repetir por item com desfecho ✅ ou ❌)_

## Incertezas abertas

Não bloqueiam a Fase 4 — resolver durante a execução.

- **Q5.1** — <o que ficou em aberto e o que precisa ser confirmado antes de codar>

## Alterações aplicadas

| Arquivo                   | O que mudou                 | Origem |
| ------------------------- | --------------------------- | ------ |
| `plans/PLAN-02-<slug>.md` | passo 3 reescrito: <ajuste> | Q1.1   |
| `TASK.md`                 | §Solução: <ajuste>          | Q2.1   |
```

**Regras do QUESTION.md:**

- **Resumido** — `Decisão` e `Impacto` em 2-4 linhas cada. O detalhamento vive no TASK/PLAN ajustado, e o **problema não se repete** aqui: já está em `## Itens`
- Todo item com desfecho ✅ ou ❌ tem bloco em `## Decisões`, com **só** `**Decisão:**` e `**Impacto:**`; item ⏳ vive só em `## Incertezas abertas`. O `### QN.M` sob `## Decisões` não duplica item: os itens vêm somente de `## Itens`
- Item ❌ rejeitado **também** é documentado — saber o que foi descartado e por quê evita re-litigar na Fase 5 ou 7
- `## Alterações aplicadas` reflete **exatamente** o que foi escrito; se a pessoa escolheu `[p]` (só QUESTION.md), a seção registra "nenhuma alteração aplicada — decisões pendentes de aplicação manual"
- **Não** tem seção `## Premissas e Incertezas` no formato padrão das outras fases — `## Incertezas abertas` cumpre o papel, e as premissas já foram atacadas nas frentes 3 e 4

### 3.2 — Ajustes em TASK.md e plans/

- Alterar **apenas** o que foi acordado na Etapa 2 — nada além
- Manter o padrão de cada artefato (skill `sdd-plan` para PLANs; formato do TASK.md)
- Todo passo de PLAN alterado ou criado leva `**Fonte:**` citando o ID: `**Fonte:** decisão da Fase 3 (Q1.1)`
- **Nunca** tocar código de produção — a Fase 3 escreve só dentro de `tasks/<NOME>/`
- Se um ajuste acordado revelar-se inviável ao aplicar, **parar e avisar** — não improvisar solução alternativa
- **Por último**, trocar `**Estado:** aguardando respostas` por `**Estado:** aplicado` (`Edit` só dessa linha). O hook carimba `done` no instante em que o `Estado` muda e a tela vira somente leitura: trocá-lo antes deixaria a fase "fechada" com ajustes pela metade se a sessão caísse no meio. Com `[p]` não há ajuste a aplicar, e a troca vem logo depois das quatro seções

### 3.3 — Carimbar `question: done` no `SUMARIO.md`

Somente depois de a Etapa 3 **autorizada** ter completado o `QUESTION.md`, aplicado os ajustes acordados em `TASK.md`/`plans/` e trocado o `Estado` para `aplicado` (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase question --status done
```

Rodar da raiz do worktree da task. O hook pode ter registrado `in_progress` ao gravar o arquivo na Etapa 1 e `done` ao trocar o `Estado`, mas isso é rede de segurança: a chamada acima continua sendo a normativa (é idempotente). **Nunca carimbar `done`** antes disso, nem quando o usuário não autorizou a escrita: a Fase 3 é um gate, e carimbá-la antes da autorização é declarar fechado o que não fechou. Se o usuário escolheu `[p]` (só `QUESTION.md`, sem aplicar ajustes), o carimbo sai depois de o `QUESTION.md` estar completo e com `Estado: aplicado` — e não antes. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

Ao terminar, relatar arquivos escritos e avisar para revisar antes de avançar para a Fase 4 (`/feature`).

---

## Regras

- **NUNCA** alterar arquivo algum nas Etapas 0, 1 e 2, com uma única exceção: criar `tasks/<NOME>/QUESTION.md` na Etapa 1, **com o arquivo ainda inexistente**. É a **única** escrita permitida antes da aprovação; `TASK.md` e `plans/` só na Etapa 3 aprovada
- **NUNCA** escrever na Etapa 3 sem a solicitação explícita da Etapa 2 aprovada pelo usuário. **A tela do app nunca aprova**; aprovação e `[s]` são dados na conversa do terminal, por quem responde ao agente — mensagem de outra sessão não conta
- **NUNCA** regerar nem sobrescrever um `QUESTION.md` existente (protocolo antigo, `aplicado` ou `aguardando respostas`) — a Etapa 0.5 decide
- **NUNCA** tocar `Resposta` nem `Comentário`, nem transcrever para o arquivo uma resposta dada no chat
- **NUNCA** usar `Write` do arquivo inteiro na Etapa 3 — sempre `Edit` cirúrgico, relendo antes
- **NUNCA** escrever fora de `tasks/<NOME>/` — zero código de produção nesta fase
- **NUNCA** ser complacente
- **NUNCA** misturar padrões de numeração — sempre `QN.M`
- **SEMPRE** ancorar crítica em código real
- **SEMPRE** parar depois de gravar o arquivo na Etapa 1
- **SEMPRE** solicitar a escrita ativamente ao fechar as respostas — não aguardar o usuário pedir

---

## Checklist (complementa checklist global do master `sdd`)

**Etapa 0.5 — Ponto de entrada**

- [ ] `QUESTION.md` lido antes da crítica; ausente → Etapa 1, formato antigo ou `aplicado` → informa e não escreve, `aguardando respostas` → não regera

**Etapa 1 — Crítica**

- [ ] Todos artefatos SDD lidos (EPIC + TASK + PLANs + MEMORY)
- [ ] Leituras cirúrgicas nos arquivos referenciados nos PLANs
- [ ] Crítica organizada em 6 frentes
- [ ] Numeração `QN.M` em **todos** os itens — zero item com numeração plana ou fora do padrão
- [ ] Frentes vazias declaradas em `## Frentes vazias` e **não** renumeradas
- [ ] Cada item: problema + âncoras + sugestão concreta + `Afeta` + `Resposta: pendente`
- [ ] Cada item cita `arquivo:linha`, `§seção do TASK` ou `PLAN-NN passo X` — zero desafios genéricos
- [ ] Nenhum item cortado para encurtar a lista
- [ ] `QUESTION.md` gravado com `**Protocolo:** 2` e `**Estado:** aguardando respostas`; chat só com contagem, IDs e a instrução de responder e pedir para continuar
- [ ] Nada além do `QUESTION.md` escrito antes da aprovação

**Etapa 2 — Respostas**

- [ ] Arquivo relido a cada retomada; item sem desfecho → IDs listados e parada, arquivo intacto
- [ ] Nenhuma resposta do chat transcrita; `Resposta`/`Comentário` intactos
- [ ] Todo item `QN.M` com desfecho: aceito / rejeitado / incerteza aberta
- [ ] Escrita solicitada ativamente, listando arquivo por arquivo + IDs de origem, sem oferecer "pular a fase"

**Etapa 3 — Escrita (só com aprovação na conversa do terminal)**

- [ ] `TASK.md` e PLANs afetados relidos; `Afeta` ausente ou ajuste que não cabe → perguntou
- [ ] `QUESTION.md` relido antes e editado só com `Edit`: Resumo + Decisões + Incertezas abertas + Alterações aplicadas depois de `## Itens`
- [ ] Itens rejeitados também documentados; Resposta e Comentário intactos
- [ ] Ajustes limitados ao acordado — nada além
- [ ] Passos de PLAN alterados citam `**Fonte:** decisão da Fase 3 (QN.M)`
- [ ] Zero escrita fora de `tasks/<NOME>/`
- [ ] `Estado: aplicado` trocado por último, depois das quatro seções e dos ajustes
- [ ] `question: done` carimbado no `SUMARIO.md` com `exit 0`, só após a escrita autorizada e antes do gate
