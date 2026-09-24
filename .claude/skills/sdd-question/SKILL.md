---
name: sdd-question
description: Crítica adversarial dos artefatos SDD (Fase 3) — desafia TASK + PLAN, discute cada item com o usuário e, ao fim, registra as decisões em QUESTION.md e aplica os ajustes acordados em TASK/PLANs. Use ao invocar via command `/question` ou quando precisar revisar criticamente artefatos antes de implementar. Sub-skill de `sdd`.
---

# SDD — Fase 3: Questionamento Crítico

Crítica adversarial de TASK + PLAN + EPIC (se existir) antes da execução, seguida de **discussão com o usuário** e **registro das decisões**.

**Output:**

1. Crítica em chat, numerada no padrão `QN.M`
2. Discussão item por item com o usuário
3. `tasks/<NOME>/QUESTION.md` — registro resumido das decisões
4. Ajustes em `TASK.md` / `plans/PLAN-NN-*.md` — **somente após solicitação explícita e aprovação do usuário** (Etapa 3)

**Pré-requisito:** todos `plans/PLAN-NN-*.md` aprovados.

**Papel:** revisor crítico e interlocutor. Missão **não é validar ou elogiar** — é desafiar, expor fragilidades e conduzir a discussão até cada item ter uma decisão consciente. Só depois disso escreve.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos adicionais: todos PLANs, TASK.md, MEMORY.md; TEST.md se existir
- Investigar código **cirurgicamente** — ler apenas arquivos referenciados nos PLANs (assinaturas, models, rotas)
- ✅ Read cirúrgico nos arquivos concretos que PLANs tocam
- ❌ Explore amplo gera crítica superficial baseada em sumário

---

## Etapa 1 — Crítica

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

**Frente sem achado é pulada na numeração, não renumerada.** Se a frente 3 não tem fragilidade, declare "frente 3: nada relevante" e siga para `Q4.1` — nunca reaproveite o `3` para outra frente.

❌ **Anti-padrões (causa da divergência que este padrão elimina):**

| Errado                                                        | Por quê                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `1, 2, 3, 4, 5, 6, 7...` sequencial global                    | perde a frente de origem; impossível referenciar depois      |
| `Q1, Q2, Q3` sem sub-índice                                   | idem — não distingue frente de item                          |
| Misturar `1.1` num bloco e `5` em outro                       | o problema exato que este padrão resolve; **nunca** misturar |
| Renumerar frentes vazias (frente 3 vazia → frente 4 vira "3") | quebra a âncora fixa frente↔número                           |

O ID `QN.M` é **estável e citável**: PLANs, TASK e MEMORY referenciam decisões por ele (ex: `**Fonte:** decisão da Fase 3 (Q1.1)`).

---

## Formato da crítica em chat

Blocos pelas 6 frentes. Para cada item:

- **`QN.M` — desafio** direto
- **Por que importa** (1-2 linhas com referência concreta)
- **Sugestão** (opcional — alternativa concreta se houver)

**Profundidade > volume** — todo item precisa carregar peso próprio; zero item de enchimento. Isso é critério de **qualidade por item**, não teto de quantidade: 12 achados reais valem 12 itens.

Regra de ancoragem: **desafio sem referência concreta (`arquivo:linha`, `§seção do TASK` ou `PLAN-NN passo X`) = descartar.** Crítica genérica não cabe nesta fase.

✅ "**Q2.1** — PLAN-02 passo 3 chama `algumService.activate()`, mas `algum.service.ts:120` exige um dado no construtor — o passo não declara de onde vem. Premissa não declarada."
❌ "Será que o service está sendo instanciado corretamente?" — vago, sem âncora, não força decisão.

Frente sem fragilidade → declarar: "frente X: nada relevante".

---

## Etapa 2 — Discussão

Após apresentar a crítica, **discutir com o usuário**. Esta é a etapa mais longa da fase.

- Conduzir item por item pelos IDs `QN.M` — o usuário pode responder em qualquer ordem, agrupado ou salteado
- Defender o questionamento quando o contra-argumento não resolve o problema apontado; **aceitar** quando resolve
- Se o usuário decidir por um caminho que reintroduz um risco já apontado, **registrar o risco** e seguir — a decisão é dele
- Item pode terminar em: **aceito** (vai virar ajuste), **rejeitado** (fica como está, com motivo), ou **incerteza aberta** (não bloqueia; resolve na Fase 4)

**Não escrever nenhum arquivo durante esta etapa.** Nem `QUESTION.md`, nem TASK, nem PLANs.

### Critério de saída

Todo item `QN.M` tem desfecho registrado. Nenhum item pendente de resposta.

Ao atingir esse ponto, **solicitar ativamente a escrita** (não esperar o usuário pedir):

```
Todos os N itens discutidos: X aceitos, Y rejeitados, Z incertezas abertas.

Posso aplicar agora?
  1. Criar tasks/<NOME>/QUESTION.md com o registro das decisões
  2. Aplicar os ajustes acordados em:
     - TASK.md → <seções>  (itens QN.M, ...)
     - plans/PLAN-NN-<slug>.md → <passos>  (itens QN.M, ...)

[s] aplicar tudo   [p] só o QUESTION.md   [n] não escrever nada
```

Listar **explicitamente** cada arquivo e o que muda nele, com os IDs que originam a mudança. Sem lista, sem aprovação.

---

## Etapa 3 — Escrita (único momento em que a Fase 3 altera arquivos)

Só executa **após o usuário aprovar** a solicitação da Etapa 2.

### 3.1 — `tasks/<NOME>/QUESTION.md`

```markdown
# QUESTION — <NOME>

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.

## Resumo

| ID   | Frente                   | Desfecho            | Artefatos afetados |
| ---- | ------------------------ | ------------------- | ------------------ |
| Q1.1 | Código existente         | ✅ Aceito           | PLAN-01, PLAN-02   |
| Q2.1 | Coerência TASK ↔ PLAN    | ✅ Aceito           | TASK §Solução      |
| Q4.1 | Premissas não declaradas | ❌ Rejeitado        | —                  |
| Q5.1 | Cenários esquecidos      | ⏳ Incerteza aberta | —                  |

## Decisões

### Q1.1 — <título curto do achado>

**Problema:** o que foi questionado e por que importava, com âncora concreta (`arquivo:linha`, `§seção`, `PLAN-NN passo X`). 2-4 linhas.

**Decisão:** o que ficou definido na discussão, e o porquê. 2-4 linhas.

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

- **Resumido** — problema e decisão em 2-4 linhas cada. O detalhamento vive no TASK/PLAN ajustado, não aqui
- Todo item com desfecho ✅ ou ❌ tem bloco em `## Decisões`; item ⏳ vive só em `## Incertezas abertas`
- Item ❌ rejeitado **também** é documentado — saber o que foi descartado e por quê evita re-litigar na Fase 5 ou 7
- `## Alterações aplicadas` reflete **exatamente** o que foi escrito; se o usuário escolheu `[p]` (só QUESTION.md), a seção registra "nenhuma alteração aplicada — decisões pendentes de aplicação manual"
- **Não** tem seção `## Premissas e Incertezas` no formato padrão das outras fases — `## Incertezas abertas` cumpre o papel, e as premissas já foram atacadas nas frentes 3 e 4

### 3.2 — Ajustes em TASK.md e plans/

- Alterar **apenas** o que foi acordado na Etapa 2 — nada além
- Manter o padrão de cada artefato (skill `sdd-plan` para PLANs; formato do TASK.md)
- Todo passo de PLAN alterado ou criado leva `**Fonte:**` citando o ID: `**Fonte:** decisão da Fase 3 (Q1.1)`
- **Nunca** tocar código de produção — a Fase 3 escreve só dentro de `tasks/<NOME>/`
- Se um ajuste acordado revelar-se inviável ao aplicar, **parar e avisar** — não improvisar solução alternativa

### 3.3 — Carimbar `question: done` no `SUMARIO.md`

Somente depois de a Etapa 3 **autorizada** ter escrito o `QUESTION.md` e aplicado os ajustes acordados em `TASK.md`/`plans/` (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase question --status done
```

Rodar da raiz do worktree da task. **Nunca carimbar durante as Etapas 1 e 2**, nem quando o usuário não autorizou a escrita: a Fase 3 é um gate, e carimbá-la antes da autorização é declarar fechado o que não fechou. Se o usuário escolheu `[p]` (só `QUESTION.md`, sem aplicar ajustes), o carimbo sai depois de o `QUESTION.md` estar escrito — e não antes. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

Ao terminar, relatar arquivos escritos e avisar para revisar antes de avançar para a Fase 4 (`/feature`).

---

## Regras

- **NUNCA** alterar arquivo algum nas Etapas 0, 1 e 2 — revisor, não editor
- **NUNCA** escrever na Etapa 3 sem a solicitação explícita da Etapa 2 aprovada pelo usuário
- **NUNCA** escrever fora de `tasks/<NOME>/` — zero código de produção nesta fase
- **NUNCA** ser complacente
- **NUNCA** misturar padrões de numeração — sempre `QN.M`
- **SEMPRE** ancorar crítica em código real
- **SEMPRE** solicitar a escrita ativamente ao fechar a discussão — não aguardar o usuário pedir

---

## Checklist (complementa checklist global do master `sdd`)

**Etapa 1 — Crítica**

- [ ] Todos artefatos SDD lidos (EPIC + TASK + PLANs + MEMORY)
- [ ] Leituras cirúrgicas nos arquivos referenciados nos PLANs
- [ ] Crítica organizada em 6 frentes
- [ ] Numeração `QN.M` em **todos** os itens — zero item com numeração plana ou fora do padrão
- [ ] Frentes vazias declaradas ("frente X: nada relevante") e **não** renumeradas
- [ ] Cada item: desafio + por que importa + (opcional) caminho
- [ ] Cada item cita `arquivo:linha`, `§seção do TASK` ou `PLAN-NN passo X` — zero desafios genéricos
- [ ] Nenhum item cortado para encurtar a lista

**Etapa 2 — Discussão**

- [ ] Nenhum arquivo escrito durante a discussão
- [ ] Todo item `QN.M` com desfecho: aceito / rejeitado / incerteza aberta
- [ ] Escrita solicitada ativamente, listando arquivo por arquivo + IDs de origem

**Etapa 3 — Escrita (só com aprovação)**

- [ ] `QUESTION.md` criado com Resumo + Decisões + Incertezas abertas + Alterações aplicadas
- [ ] Itens rejeitados também documentados
- [ ] Ajustes limitados ao acordado — nada além
- [ ] Passos de PLAN alterados citam `**Fonte:** decisão da Fase 3 (QN.M)`
- [ ] Zero escrita fora de `tasks/<NOME>/`
- [ ] `question: done` carimbado no `SUMARIO.md` com `exit 0`, só após a escrita autorizada e antes do gate
