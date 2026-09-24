---
name: sdd-verify
description: Verificação independente da feature (Fase 7 do SDD) — um verificador com contexto fresco (author ≠ verifier) audita cobertura ancorada nos critérios de aceite e a força das asserções via sensor de discriminação estático, sem executar nada. Use ao invocar via command `/verify` ou ao validar uma feature após os testes (Fase 6b). Sub-skill de `sdd`.
---

# SDD — Fase 7: Verificação Independente

Audita a feature implementada **com olhos frescos**: confirma que cada critério de aceite (CA) do TASK.md tem teste que o cobre, e que cada teste de fato **discrimina** comportamento errado. Não escreve produção, não corrige — produz veredito + plano de correção priorizado.

**Output:** `tasks/<NOME>/VERIFY.md` + veredito compacto em chat (`PASS ✅` | `FAIL ❌`).

**Pré-requisito:** Fase 6b concluída — `tasks/<NOME>/MEMORY.md` com todos PLANs `✅ Concluído`, arquivos de teste escritos **e** `tasks/<NOME>/AUTOTEST.md` presente. Faltar MEMORY ou testes → parar e avisar.

> **Sem `AUTOTEST.md`** (task que rodou sob o fluxo antigo): não bloquear. Reconstruir as classificações a partir de TEST.md + testes existentes, rodar o Check 6 sobre essa reconstrução e **declarar no VERIFY.md** que as exclusões não foram documentadas pela Fase 6b — o que por si só é achado.

---

## Princípio inegociável: author ≠ verifier

Quem implementou **não** verifica com o mesmo contexto. Para garantir frescor:

- O orquestrador **lança um sub-agente verificador** via Agent tool (`subagent_type: "general-purpose"`), que recebe **só** os artefatos e o diff — **nunca** o raciocínio da implementação.
- O verificador opera **read-only**: a única escrita permitida é `tasks/<NOME>/VERIFY.md`.
- Herdar a justificativa de quem escreveu o código = verificação contaminada = violação.

> Exceção (modo single-agent): se não for possível lançar sub-agente, reler TASK.md + diff + testes do zero, declarando explicitamente no VERIFY.md que a independência foi simulada.

> **A Fase 7 é a sessão E** ([`docs/worktree-e-wip.md`](https://github.com/lucastumeleiro/sdd/blob/main/docs/worktree-e-wip.md) §5): sessão nova no worktree da task, sem `--resume` nem `--continue` e diferente da sessão D (`/test-plan` · `/autotest`). Permitir background não afrouxa isso — contexto fresco continua obrigatório, e é o que torna `author ≠ verifier` um fato e não uma simulação.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos: TASK.md (fonte dos CAs), todos PLANs, MEMORY.md (confirmar `✅`), TEST.md (CTs + matriz CA↔CT), `AUTOTEST.md` (classificações A/B/C + exclusões justificadas — objeto do Check 6), `REVIEW.md` (auditoria de regras da Fase 5 — objeto do Check 5), `QUESTION.md` se existir.
- **`REVIEW.md` no Check 5:** padrão e arquitetura já foram auditados regra por regra na Fase 5. A Fase 7 **não re-deriva** essa análise — confere se os bloqueantes foram fechados. `REVIEW.md` ausente (task do fluxo antigo) não bloqueia: declarar a ausência como achado.
- **`QUESTION.md` no Check 5 (escopo):** arquivo tocado por decisão da Fase 3 (`QN.M`) **não** é desvio de escopo, mesmo fora de "Arquivos Impactados" dos PLANs — é escopo acordado. Já um comportamento que o QUESTION.md registra como **rejeitado** (❌) e que aparece implementado no diff **é** desvio, e deve ser sinalizado.
- Identificar o **diff da feature**: arquivos em "Arquivos Impactados" de todos PLANs + os arquivos de teste lado a lado.
- Ler os arquivos de teste da feature **por completo** — as asserções são o objeto da auditoria.
- Ler o código de produção que cada teste cobre — necessário para o sensor de discriminação.
- Invocar a skill de teste automatizado do projeto (se existir) para os **critérios de categoria C** (cenários NÃO automatizáveis sem recurso externo: query de banco, repositório, model, migration, integração externa viva, bootstrap). A Fase 7 respeita o C **justificado** — não exige teste automatizado para o que genuinamente não roda sem esse recurso —, mas **não** aceita o C por decreto: cada exclusão do `AUTOTEST.md` é atacada no Check 6.
- ❌ Não spawnar Explore amplo: o escopo é fechado (diff da feature).

---

## Checks (sequenciais — cada um produz evidência falsificável)

### Check 1 — Auditoria de conclusão

Confirmar no MEMORY.md: todos PLANs `✅`. Qualquer PLAN `🔄`/`❌`/parcial → registrar como bloqueio e **não** seguir para os checks de teste.

### Check 2 — Cobertura ancorada nos CAs (3 estados, não 2)

A cobertura tem **duas camadas legítimas**: teste automatizado (categorias A/B da Fase 6b) e teste de mesa manual (categoria C — o que não roda sem recurso externo). A Fase 7 **não trata "sem teste automatizado" como falha automática** — trata como falha só quando algo automatizável ficou sem teste.

Para **cada** CA do TASK.md, classificar em um dos três estados:

| Estado                  | Quando                                                                                                                          | É lacuna?                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| ✅ **Coberto (auto)**   | tem asserção em teste automatizado com `arquivo:linha`                                                                          | não — vai pro Check 3 (sensor)    |
| 🧪 **Coberto (manual)** | sem teste automatizado, mas mapeado a CT do TEST.md **e** a lógica é categoria C (query/repo/model/migration/externo/bootstrap) | não — fora do escopo de autoteste |
| ❌ **Lacuna**           | sem asserção **e** (não está no TEST.md **ou** a lógica é automatizável A/B e foi pulada)                                       | sim                               |

Regras:

- **Coberto (auto):** onde o CA define resultado preciso (status code, valor de campo, mensagem, estado persistido), a asserção **deve mirar esse valor exato** — senão é asserção fraca (Check 3/4).
- **Coberto (manual):** só é 🧪 se a exclusão correspondente **sobreviver ao Check 6**. C refutado no Check 6 → este CA vira ❌ Lacuna. Não aceitar "fica pro teste de mesa" para o que dá pra automatizar.
- **CA sem resultado preciso no TASK** → marcar **lacuna de precisão da spec** (não passar em silêncio).
- **Sem `arquivo:linha` e sem CT no TEST.md = não coberto.** Não existe "coberto implicitamente".

Saída: tabela CA → estado → evidência.

| CA    | Estado    | Evidência                                                          | Observação                                                |
| ----- | --------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| CA-01 | ✅ auto   | `algo.service.test.ts:88` — `expect(result.status).toBe("active")` | —                                                         |
| CA-02 | 🧪 manual | TEST.md CT-04                                                      | join no banco — categoria C, não automatizável            |
| CA-03 | ❌ lacuna | —                                                                  | regra pura mockável, sem teste e sem CT — deveria ser A/B |

### Check 3 — Sensor de discriminação **estático**

> Aplica-se **só aos CAs ✅ Coberto (auto)** do Check 2. CAs 🧪 manual não têm asserção para mutar — sua qualidade é responsabilidade do TEST.md (Fase 6a).
> Não executamos testes (rodar o comando de teste é proibido nesta fase). O sensor é **analítico**: para cada teste, achar o **mutante que sobreviveria**.

Para cada teste relevante, perguntar: _"qual alteração plausível no código de produção NÃO faria nenhuma asserção falhar?"_. Tipos de mutante a considerar:

- Inverter condição (`if (x)` → `if (!x)`)
- Trocar valor de retorno (`return total` → `return 0`)
- Off-by-one (`>=` → `>`, `i+1` → `i`)
- Remover efeito colateral (deletar o `save()`/`emit()`/push)

Regra de matança: **se existe um mutante plausível que sobrevive, a asserção é fraca → vira fix.** Citar o mutante concreto.

| Teste (`arquivo:linha`) | Mutante que sobrevive                                       | Veredito      |
| ----------------------- | ----------------------------------------------------------- | ------------- |
| `resolver.test.ts:40`   | trocar `return value` por `return ""` — nenhum expect falha | ❌ fraco      |
| `controller.test.ts:25` | nenhum mutante plausível sobrevive                          | ✅ discrimina |

### Check 4 — Regra payload/conjunção

Para cada campo nomeado em objeto retornado ou evento emitido, a asserção mira o **valor/estado**, não só a ocorrência da chamada:

- ✅ `expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ status: "active" }))`
- ❌ `expect(repo.save).toHaveBeenCalled()` — confirma chamada, não conteúdo

`toHaveBeenCalled()`/`toHaveBeenCalledTimes()` (ou equivalente no framework do projeto) como **única** asserção sobre um payload = fraco → fix.

### Check 5 — Escopo e fechamento do `REVIEW.md`

> Desvio de padrão coberto por skill **não** é objeto deste check — é objeto da Fase 5, que audita regra por regra com IDs citáveis. Re-derivar aqui duplicaria a análise no ponto mais caro de corrigir.

- Arquivo tocado fora de "Arquivos Impactados" de qualquer PLAN → sinalizar (escopo vazou). Exceção: arquivo tocado por decisão da Fase 3 (`QN.M`) é escopo acordado.
- Abstração especulativa / refactor não pedido / código morto introduzido → sinalizar.
- **Fechamento:** toda violação em `## Bloqueantes` do `REVIEW.md` tem correção correspondente em `## Correções aplicadas (5.2)` ou visível no diff. Bloqueante em aberto → `FAIL`.
- `REVIEW.md` ausente → declarar como achado e seguir; não bloqueia.

### Check 6 — Auditoria das exclusões (`AUTOTEST.md`)

> Iterar a seção `## Exclusões` do `AUTOTEST.md` — **uma passada por CT excluído**, não por CA. O Check 2 é ancorado em CA e por isso não alcança um C cujo CA está coberto por outro teste; este check alcança.

Postura: **tentar refutar cada exclusão.** A Fase 6b é autora e ré da classificação — se o verificador só homologar, o C nunca é fiscalizado.

Para cada C, buscar o caminho de automação que a 6b alegou não existir:

| Refutação                                                                               | Conclusão                    |
| --------------------------------------------------------------------------------------- | ---------------------------- |
| método sob teste recebe dependência **injetável**                                       | era **A** → C refutado       |
| um mock de **1 nível** resolveria (sem cadeia de 3+)                                    | era **A** → C refutado       |
| setup caberia em **<30 linhas** com o cliente de teste do projeto                       | era **B** → C refutado       |
| lógica de regra/filtro **pura** separável do acesso a dados                             | era **A** → C refutado       |
| justificativa **genérica** ("usa o ORM", "precisa de banco") sem âncora `arquivo:linha` | insuficiente → C refutado    |
| exclusão **sem bloco** em `## Exclusões`                                                | não justificada → C refutado |

C **confirmado** (exclusão legítima) só quando bate um destes: valor do teste está nos filtros/joins/includes (mockar = testar o mock), 3+ chamadas encadeadas (mock frágil), migration/model/repo puro, integração externa viva, bootstrap.

Regra de matança: **exclusão refutada = automatização indevidamente pulada.** O CA correspondente volta ao Check 2 como ❌ Lacuna e o veredito é `FAIL`. Citar o caminho de automação concreto — refutar sem apontar o "era A porque X" não vale, mesma exigência do mutante no Check 3.

| CT    | Justificativa da 6b                   | Refutação tentada                                                                                      | Veredito                         |
| ----- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------- |
| CT-07 | valor nos joins (`repositorio.ts:88`) | mock do método de leitura devolveria o que o mock definiu — nada a testar                              | ✅ C legítimo                    |
| CT-11 | "serviço usa o ORM"                   | `AlgoService` recebe a interface do repositório no construtor (`algo.service.ts:24`) — era categoria A | ❌ C refutado → CA-9 vira lacuna |

---

## Template — `tasks/<NOME>/VERIFY.md`

```markdown
# VERIFY — TASK-ID: <título da task>

**Veredito:** PASS ✅ | FAIL ❌
**Verificado por:** sub-agente independente (author ≠ verifier)
**Diff coberto:** <N arquivos de produção, M arquivos de teste>

## Check 1 — Conclusão

Todos PLANs ✅: sim | não (<detalhe>)

## Check 2 — Cobertura ancorada nos CAs

<tabela CA → estado (✅ auto / 🧪 manual / ❌ lacuna) → evidência>
Lacunas de precisão da spec: <lista | nenhuma>

## Check 3 — Sensor de discriminação estático

<tabela teste → mutante sobrevivente → veredito>

## Check 4 — Payload/conjunção

<asserções fracas encontradas | nenhuma>

## Check 5 — Escopo e fechamento do REVIEW.md

<vazamentos de escopo / over-engineering | nada relevante>
Bloqueantes do REVIEW.md em aberto: <lista com ID | nenhum | REVIEW.md ausente>

## Check 6 — Auditoria das exclusões (AUTOTEST.md)

<tabela CT → justificativa da 6b → refutação tentada → veredito>
Exclusões refutadas: <lista com o caminho de automação concreto | nenhuma>
AUTOTEST.md ausente (fluxo antigo): sim | não

## Lacunas priorizadas (se FAIL)

1. [P1] <lacuna> — CA-XX / CT-XX — `arquivo:linha` ou "sem evidência" — correção sugerida
2. [P2] ...
```

---

## Veredito em chat (formato compacto)

```
## Verificação: TASK-ID — PASS ✅ | FAIL ❌

CAs: A auto · B manual (TEST.md) · C lacunas
Asserções fracas (mutante sobrevive): K
Exclusões auditadas: N — L legítimas · M refutadas
Escopo: limpo | <N vazamentos>
Relatório: tasks/TASK-ID/VERIFY.md

Lacunas priorizadas (se FAIL):
1. [P1] <lacuna> — CA-XX — arquivo:linha
```

---

## Ao terminar — carimbar `verify` com o verdict vivo

Com o `VERIFY.md` **já escrito em disco** e antes de apresentar o veredito (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

| Veredito  | Chamada                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------- |
| `PASS ✅` | `node .claude/hooks/sdd-summary.mjs --task <NOME> --phase verify --status done --verdict PASS`    |
| `FAIL ❌` | `node .claude/hooks/sdd-summary.mjs --task <NOME> --phase verify --status blocked --verdict FAIL` |

Rodar da raiz do worktree da task. `verify` é **campo vivo**: todo ciclo do loop de correção abaixo que mude o veredito exige carimbar de novo com o par atual — inclusive a transição `FAIL` → `PASS` que fecha o loop. Um `SUMARIO.md` preso no `FAIL` de três ciclos atrás mente para o board tanto quanto um `VERIFY.md` desatualizado; o carimbo é idempotente, então repetir quando nada mudou não custa nada. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

---

## Loop de correção (máx. 3 ciclos)

Se `FAIL`:

1. Apresentar lacunas priorizadas ao usuário.
2. Correções de teste/código → despachar via **Agent tool (foreground)**, ou por uma sessão em background lançada **de dentro do worktree da task** (`.claude/worktrees/<NOME>/`). Nunca a partir do checkout principal: de lá o Claude Code cria worktree e branch novos, fora da task, e a correção aterrissa onde ninguém procura.
3. Re-verificar (novo Check 2–4 e 6 sobre o diff corrigido).
4. Recarimbar o `SUMARIO.md` sempre que o veredito mudar (§Ao terminar — carimbar `verify` com o verdict vivo), e reapresentar o veredito compacto atualizado.
5. Após **3 ciclos** ainda com lacuna → **escalar ao usuário**, não insistir.

> Correção de exclusão refutada (Check 6) implica **escrever o teste que faltou** e atualizar o `AUTOTEST.md` — trabalho da Fase 6b, despachado via Agent tool. O verificador não escreve teste nem edita o `AUTOTEST.md`.

Feature só é `PASS` quando **todo CA está coberto** — auto (asserção que mira o resultado preciso) **ou** manual justificado (CT no TEST.md + exclusão que sobreviveu ao Check 6) — **e** nenhum mutante plausível sobrevive nos testes automatizados. CA em ❌ Lacuna ou exclusão refutada no Check 6 = `FAIL`.

---

## Regras

- **NUNCA** executar o comando de teste/build/dev do projeto — sensor é estático.
- **NUNCA** escrever produção nem editar testes nesta fase — só `tasks/<NOME>/VERIFY.md`. Isso inclui o `AUTOTEST.md`: o verificador **audita**, não corrige.
- **NUNCA** marcar CA como coberto sem `arquivo:linha`.
- **NUNCA** aceitar `toHaveBeenCalled()` (ou equivalente) como única asserção de um payload.
- **NUNCA** homologar exclusão (C) por deferência à Fase 6b — a postura do Check 6 é refutar.
- **SEMPRE** lançar o verificador como sub-agente independente quando possível (author ≠ verifier).
- **SEMPRE** citar o mutante concreto ao reprovar uma asserção, e o caminho de automação concreto ao refutar uma exclusão.

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] Pré-requisito conferido: todos PLANs ✅ em MEMORY.md + arquivos de teste presentes + `AUTOTEST.md` (ou ausência declarada no VERIFY.md)
- [ ] Verificador rodou com contexto fresco (sub-agente independente, ou independência declarada no VERIFY.md)
- [ ] Cada CA do TASK.md classificado em 1 dos 3 estados (✅ auto / 🧪 manual / ❌ lacuna) com evidência
- [ ] Cada teste auto relevante tem mutante avaliado (sobrevive ❌ / não sobrevive ✅)
- [ ] Asserções só-`toHaveBeenCalled()` sobre payload listadas como fracas
- [ ] Vazamentos de escopo conferidos contra "Arquivos Impactados" dos PLANs
- [ ] Bloqueantes do `REVIEW.md` conferidos como fechados (ou ausência do `REVIEW.md` declarada)
- [ ] **Cada** exclusão do `AUTOTEST.md` teve refutação tentada — nenhuma homologada por deferência
- [ ] Exclusão refutada cita o caminho de automação concreto e rebaixa o CA a ❌ no Check 2
- [ ] `VERIFY.md` escrito com veredito e (se FAIL) lacunas priorizadas
- [ ] `verify` carimbado no `SUMARIO.md` com `exit 0` e o par correto (`PASS`/`done`, `FAIL`/`blocked`), depois do VERIFY.md e antes do veredito
- [ ] Cada ciclo do loop que mudou o veredito recarimbou o `SUMARIO.md` com o par atual
- [ ] Nenhuma execução do comando de teste/build/dev do projeto
