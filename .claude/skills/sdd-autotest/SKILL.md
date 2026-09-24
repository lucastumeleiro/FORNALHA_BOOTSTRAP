---
name: sdd-autotest
description: Geração de testes automatizados (Fase 6b do SDD) — converte TEST.md em testes automatizados. Use ao invocar via command `/autotest` ou ao gerar testes após implementação. Sub-skill de `sdd` que delega padrões para uma skill de teste automatizado do projeto (se existir).
---

# SDD — Fase 6b: Testes Automatizados

Conversão do TEST.md em **testes automatizados** usando o framework de teste do projeto (ex.: Vitest, Jest, pytest — o que este produto adotar).

**Output:**

1. Arquivos de teste lado a lado com código testado
2. `tasks/<NOME>/AUTOTEST.md` — registro auditável das decisões de classificação (A/B/C)

> O `AUTOTEST.md` não é relatório decorativo: é a **entrada do Check 6 da Fase 7**. Toda exclusão (categoria C) declarada ali será atacada pelo verificador, que pode reprovar a feature se a justificativa não sustentar. Justificativa vaga = `FAIL` na Fase 7.

**Pré-requisito:** Implementação (Fase 4) concluída (todos PLANs ✅ em MEMORY.md).

**Padrão detalhado de testes:** invocar uma skill de teste automatizado do projeto (ex.: `teste-automatizado`), se existir. Esta skill foca no **fluxo da fase**.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

- Artefatos adicionais: SPEC, todos PLANs, MEMORY.md (confirmar todos ✅), TEST.md, `QUESTION.md` se existir (decisões da Fase 3 que alteraram o comportamento a testar)
- Invocar skill de teste automatizado do projeto (padrões de estrutura, AAA, mocking), se existir
- Ler arquivos de "Arquivos Impactados" de todos PLANs — entender o que testar vs pular
- Confirmar o framework de teste e as bibliotecas de mock estão configurados no projeto

---

## Fluxo

### 1. Classificar cenários

Para cada CT do TEST.md → A (unit), B (integração leve) ou C (não automatizar). Critérios detalhados na skill de teste automatizado do projeto, se existir; na ausência dela, usar o critério geral abaixo.

### 2. Escrever testes (A e B)

Padrão geral: describe/suite aninhado, nome de teste descrevendo o comportamento ("deve... quando/se..."), estrutura AAA (Arrange-Act-Assert), arquivo de teste lado a lado com o código. Ajustar ao idioma e às convenções já adotadas no projeto.

### 3. Justificar cada exclusão (C)

Motivo curto **não basta**. Cada C precisa de três coisas, ou não sobrevive ao Check 6 da Fase 7:

1. **Qual regra** foi aplicada — citar a regra (da skill de teste automatizado do projeto, se existir), não parafrasear
2. **Por que não é A nem B** — o que exatamente exige um recurso externo (banco, API viva, etc.), com âncora `arquivo:linha`
3. **Cobertura substituta** — qual CT do TEST.md cobre o cenário manualmente

❌ `"CT-07: usa o ORM"` — genérico, não diz o que no código exige banco. Reprovado no Check 6.
✅ `"CT-07: valor do teste está nos joins/queries (repositorio.ts:88-104) — mockar o método de acesso a dados retornaria o que o mock definiu, não o que a query resolve. Coberto por CT-07 do TEST.md."`

**Autoauditoria antes de fechar um C:** o método sob teste recebe a dependência (repositório/cliente externo) de forma injetável? Um mock de 1 nível resolveria? O setup caberia em <30 linhas? Se **qualquer** resposta for sim, é A ou B — reclassificar.

### 4. Escrever `tasks/<NOME>/AUTOTEST.md`

Template abaixo. É a única escrita fora dos arquivos de teste nesta fase.

---

## Template — `tasks/<NOME>/AUTOTEST.md`

```markdown
# AUTOTEST — <NOME>

Registro das decisões de automação (Fase 6b/7 do SDD).
Categorias: **A** unit · **B** integração leve · **C** não automatizado (coberto por teste de mesa).
As exclusões (C) são auditadas pelo Check 6 da Fase 7 (`/verify`).

## Resumo

| Categoria | CTs                 | Testes escritos |
| --------- | ------------------- | --------------- |
| A         | CT-01, CT-02, CT-05 | 14              |
| B         | CT-03               | 3               |
| C         | CT-07, CT-11        | —               |

## Classificação por CT

| CT    | Cat | Regra aplicada                     | Destino                                 |
| ----- | --- | ---------------------------------- | --------------------------------------- |
| CT-01 | A   | serviço com dependência mockável   | `algo.service.test.ts:22-58` (4 testes) |
| CT-03 | B   | validação de schema via requisição | `algo.routes.test.ts:14-39` (3 testes)  |
| CT-07 | C   | valor do teste está nos joins      | manual — TEST.md CT-07                  |

## Exclusões (categoria C) — justificativa auditável

### CT-07 — <título do cenário>

**Regra aplicada:** skill de teste automatizado do projeto §Quando mockar acesso a dados — "valor do teste está nos filtros/joins/includes → cat C (mockar = testar o mock)".

**Por que não é A nem B:** <o que exatamente exige um recurso externo, com âncora `arquivo:linha`. Qual seria o mock e por que ele testaria o mock em vez do código.>

**Cobertura substituta:** CT-07 do TEST.md (manual).

## Rastreabilidade CA → CT → asserção

| CA   | CT    | Cat | Evidência                 |
| ---- | ----- | --- | ------------------------- |
| CA-1 | CT-01 | A   | `algo.service.test.ts:31` |
| CA-5 | CT-07 | C   | manual — TEST.md CT-07    |

## Lacunas sinalizadas

CA testável sem recurso externo que **não** tinha CT no TEST.md — teste escrito mesmo assim.

- CA-4 — sem CT no TEST.md; regra pura, automatizada em `algo.service.test.ts:71`
```

**Regras do AUTOTEST.md:**

- Todo CT do TEST.md aparece na tabela de classificação — nenhum sumido
- Todo C tem bloco em `## Exclusões` com as 3 partes; C sem bloco é tratado como lacuna pela Fase 7
- Todo CA do TASK.md aparece na rastreabilidade, mesmo que a evidência seja manual
- `## Lacunas sinalizadas` vazia é declarada como "nenhuma", não omitida

---

## Ao terminar — carimbar `autotest: done` no `SUMARIO.md`

Com os arquivos de teste escritos **e** o `AUTOTEST.md` salvo em disco, antes do relatório em chat (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase autotest --status done
```

Rodar da raiz do worktree da task. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

---

## Relatório Final (em chat — compacto)

1. **Arquivos criados** (caminho + nº testes)
2. **Contagem por categoria** (A / B / C)
3. **Exclusões (C)** — CT + regra aplicada, uma linha cada
4. **Comando sugerido:** o comando de teste do projeto (ex.: `npm test`) — sem executar
5. **Caminho do `AUTOTEST.md`**

O detalhamento vive no `AUTOTEST.md`; o chat só resume.

Próximo: Fase 7 (`/verify`) — verificação independente da cobertura, da força das asserções e das exclusões declaradas aqui.

---

## Regras

- **NUNCA** executar o comando de teste/build/dev do projeto
- **NUNCA** criar banco em memória ou mock pesado do ORM/cliente de dados
- **NUNCA** refatorar código de produção pra destravar teste
- **NUNCA** escrever nomes de teste em idioma diferente do padrão já adotado no projeto
- **NUNCA** usar skip de teste (`it.skip`/equivalente) — não escrever o teste, documentar no `AUTOTEST.md`
- **NUNCA** referenciar CT-XX, TEST.md ou identificadores do plano de teste nos nomes de `describe`/`it` — os testes devem descrever comportamento do código, não rastrear documentos
- **NUNCA** fechar um C com justificativa genérica ("usa o ORM", "precisa de banco") — sem regra citada e âncora `arquivo:linha`, o Check 6 da Fase 7 reprova
- **NUNCA** classificar como C para evitar trabalho — a autoauditoria (dependência injetável? mock de 1 nível? setup <30 linhas?) é obrigatória antes de excluir
- Se CA testável sem recurso externo não está no TEST.md → escrever teste e registrar em `## Lacunas sinalizadas`

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] Skill de teste automatizado do projeto consultada (se existir)
- [ ] Arquivos do PLAN lidos
- [ ] Framework de teste e bibliotecas de mock confirmados no projeto
- [ ] Cada CT classificado (A, B, C)
- [ ] A/B → testes correspondentes
- [ ] Cada C passou pela autoauditoria (dependência injetável? mock simples? setup <30 linhas?) antes de ser fechado
- [ ] Cada C tem regra citada + âncora `arquivo:linha` + CT substituto do TEST.md
- [ ] Nomes de teste seguem o padrão do projeto ("deve...quando/se...")
- [ ] AAA com comentários no idioma do projeto
- [ ] Arquivos de teste lado a lado
- [ ] `AUTOTEST.md` escrito: Resumo + Classificação por CT + Exclusões + Rastreabilidade CA→CT→asserção + Lacunas
- [ ] Todo CT do TEST.md e todo CA do TASK.md presentes no `AUTOTEST.md`
- [ ] `autotest: done` carimbado no `SUMARIO.md` com `exit 0`, depois dos testes + AUTOTEST.md e antes do relatório
- [ ] Relatório final compacto em chat, apontando para o `AUTOTEST.md`
