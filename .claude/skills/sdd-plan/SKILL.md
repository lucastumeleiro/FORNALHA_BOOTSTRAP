---
name: sdd-plan
description: Padrão de PLANs (Fase 2 do SDD) — decompõe TASK.md em múltiplos planos de execução independentes em plans/, cria MEMORY.md esqueleto. Use ao gerar PLANs, ao invocar via command `/plan`. Sub-skill de `sdd`.
---

# SDD — Fase 2: plans/ + MEMORY.md

Decompõe TASK.md em unidades independentes de trabalho. Cada PLAN cobre conjunto coeso de arquivos, paralelizável com demais.

**Output:**

- `tasks/<NOME>/plans/PLAN-NN-<slug>.md` (1 a 5 arquivos)
- `tasks/<NOME>/MEMORY.md` (esqueleto inicial)

**Pré-requisito:** TASK.md presente — fonte de verdade.

---

## Etapa 0 — Pesquisa e Contexto

> **Seguir sequência padrão do master `sdd` (Etapa 0).** Complementos desta fase:

### Gate anti-presunção (OBRIGATÓRIO antes de escrever PLANs)

Listar em rascunho interno:

- **(A) TASK.md** — comportamentos, regras, endpoints, schemas, validações, CAs — **fonte de verdade**. Somar `QUESTION.md` **se existir** (rodada de Fase 3 anterior): decisão registrada ali é fato confirmado, mesmo peso do TASK — não re-litigar nem contradizer
- **(B) Skills + codebase** — padrões de código, assinaturas, convenções, naming
- **(C) Inferido / não confirmado** — qualquer coisa não coberta por A ou B

**Regra:** itens (C) → `Premissas e Incertezas` — **nunca** para passos como fato.

---

## Etapa 1 — Decomposição em PLANs

> **Fornalha:** as tasks deste repositório são cortadas para caber em **um** PLAN. Dois só com o motivo escrito no próprio PLAN. Se a decomposição pedir três ou mais, pare e pergunte à pessoa se a task deve ser partida.

Os exemplos abaixo assumem uma decomposição típica de app full-stack (migration/dados, backend/serviço, frontend/UI) — **ajuste os domínios conforme a arquitetura real deste produto** (pode ser um monólito, um CLI, um app estático, etc.).

- **Feature full-stack:** migration/dados, backend/serviço, frontend-types, frontend-state, frontend-ui
- **Só backend/serviço com persistência:** migration/dados, modelo, serviço
- **Só frontend/UI:** frontend-types, frontend-state, frontend-ui
- **Feature simples (≤3 arquivos):** 1 PLAN único

**Regras:**

- 1 PLAN/domínio técnico, máx 5 PLANs
- PLANs sem dependências mútuas → declarar paralelizáveis
- Dependências comuns: migration/dados → models/repo → service/route; frontend-types ∥ backend; frontend-state depende types; frontend-ui depende types+state

---

## Etapa 1.5 — Triagem visual e aprovação de layout

Só se aplica quando a Etapa 1 produziu PLAN de frontend. **Classificar primeiro; o gate de
layout existe só para mudança estrutural.** Task pequena não paga o custo do canvas.

### Passo A — Classificar a mudança de frontend

| Classe                 | O que caracteriza                                                     | Exemplos                                                                                                                                                                                                                       | Canvas         |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| **Sem UI**             | nada renderizável muda                                                | só `types/`, `services/`, `stores/`, schemas; refactor interno                                                                                                                                                                 | ❌             |
| **Ajuste pontual**     | encaixa em estrutura que já existe, sem mudar o arranjo dos elementos | campo adicionado/removido em form existente, coluna nova em tabela existente, opção nova em select/menu, filtro novo num painel de filtros que já existe, label/i18n, máscara, regra de validação, ícone, ajuste de texto      | ❌             |
| **Mudança estrutural** | cria superfície nova ou reorganiza a que existe                       | página nova, componente/modal/drawer novo, aba/seção/passo novo num fluxo, reordenação ou redesenho de layout existente, mudança de navegação ou hierarquia, estado de tela inexistente (vazio/erro/sem permissão), responsivo | ✅ obrigatório |

Registrar sempre a classe no PLAN de frontend, com uma linha de justificativa. Ex.:

> **Triagem visual:** ajuste pontual — campo `documento` adicionado ao form que já existe

**Empate:** se ficar entre _ajuste pontual_ e _mudança estrutural_, **não decidir sozinho** —
perguntar ao usuário em uma linha e seguir a resposta.

### Passo B — Canvas de layout (só para mudança estrutural)

Usar a ferramenta de canvas/mockup disponível no ambiente (ex.: uma skill de `design`, o Artifact tool, ou equivalente) e publicar um artboard por tela/estado
que a TASK exige:

- tela principal em estado preenchido
- estados derivados exigidos pela TASK (vazio, carregando, erro, sem permissão)
- modais/drawers novos
- variação responsiva quando a TASK mencionar mobile

O mockup segue o design system do projeto (tokens de cor light/dark, tipografia,
radius e variantes de componente) **quando ele existir** — caso ainda não exista uma skill de design system, registrar isso como lacuna e usar como referência o padrão visual mais próximo disponível no projeto. Layout fora do design system não passa no gate.

**Gate:** apresentar o link do canvas e **aguardar aprovação explícita do usuário**. Sem
aprovação, os PLANs de frontend não são finalizados e a Fase 2 não fecha. Se o usuário
pedir ajuste → republicar o canvas (mesma URL) e pedir aprovação de novo.

Aprovado: registrar a URL no campo `**Layout aprovado:**` do PLAN e citá-la como
`**Fonte:**` nos passos de UI.

### Passo C — Blindar o canvas contra cópia literal (OBRIGATÓRIO)

O canvas é HTML/CSS solto: hex cravado, `style=` inline, px fixo, markup próprio, nada do
design system. Ele aprova **arranjo, hierarquia e conteúdo** — **nunca** o código. Sem esta
blindagem no PLAN, a Fase 4 copia a aparência do canvas e abandona os tokens e
componentes do projeto.

Todo PLAN com `**Layout aprovado:**` carrega este bloco, literal, em `Pontos de Atenção`:

> **O canvas é referência visual, não fonte de código.** A implementação usa
> obrigatoriamente os **tokens/estilos do design system do projeto** e
> **componentes que já existem no projeto** (quando houver biblioteca de componentes definida).
> Proibido no código: hex ou rgb do canvas, valor arbitrário fora do sistema de estilos do projeto,
> `style=` inline, px cravado onde há token, e markup próprio onde existe
> componente. **Divergir visualmente do canvas para respeitar token e componente do projeto
> é o comportamento correto — não é desvio de plano e não precisa de aprovação.**

Passo de UI cita as duas fontes separadas, para não colapsar arranjo e código:

> **Fonte:** arranjo — canvas \<URL\> | tokens e componentes — design system do projeto + \<arquivo análogo\>

---

## Etapa 2 — Estrutura de cada PLAN-NN.md

```markdown
# PLAN-NN — TASK-ID: <escopo em poucas palavras>

**Identificador:** PLAN-NN
**Dependências:** PLAN-01 | nenhuma
**Paralelizável com:** PLAN-03, PLAN-04 | todos os demais
**Triagem visual:** sem UI | ajuste pontual | mudança estrutural — <justificativa> _(só em PLAN de frontend — Etapa 1.5)_
**Layout aprovado:** <URL do canvas> _(só quando a triagem deu mudança estrutural)_

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/TASK-ID/TASK.md

## Escopo

<uma linha: o que este PLAN implementa>

## Passos de Implementação (ordenados)

### Passo 1 — <título>

**Fonte:** TASK.md §<seção> | leitura de código (`arquivo:linha`)

- O que fazer (comportamento vem de TASK/SPEC; padrão de código vem de skill + arquivo análogo)

### Passo 2 — <título>

**Fonte:** ...

## Arquivos Impactados

| Arquivo         | Operação | Justificativa |
| --------------- | -------- | ------------- |
| `caminho/...ts` | Criar    | Novo módulo   |

## Contratos Exportados

<!-- O que este PLAN produz que PLANs dependentes precisarão importar -->

- `interface XType` — `caminho/types/x.types.ts`
- _Nenhum_ (se não exporta contratos relevantes)

## Convenções Aplicáveis

- Backend/serviço: skill(s) de backend do projeto (quando existirem)
- Frontend/UI: skill(s) de frontend do projeto (quando existirem) + design system (obrigatório quando há UI)

## Pontos de Atenção

- <risco ou impacto em outros módulos>

## Premissas e Incertezas

### Premissas

1. ...

### Incertezas

1. ...
```

---

## Etapa 3 — Criar MEMORY.md

```markdown
# MEMORY — TASK-ID: <título da task>

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN           | Status      | Observações |
| -------------- | ----------- | ----------- |
| PLAN-01-<slug> | ⏳ Pendente | —           |
| PLAN-02-<slug> | ⏳ Pendente | —           |

## Contratos Disponíveis

_Nenhum contrato disponível ainda._

## Bloqueios Ativos

_Nenhum._
```

---

## Regras de código nos PLANs

- **TASK.md define comportamento** (o que fazer, quais campos, qual regra) — não implementação final
- **Skills + codebase definem estrutura** (como escrever, assinaturas, convenções, naming)
- **Nunca copiar código da TASK como código final** — TASK ilustra intenção, não padrão

  ✅ "Passo 2 — validar `phone` no DTO/schema (comportamento: TASK §3) seguindo o padrão de um arquivo análogo já existente no projeto."
  ❌ Colar o schema que veio na TASK como se fosse o código a escrever.

- Se adaptar → citar: `comportamento: TASK.md §X | padrão: skill Y + arquivo análogo Z`
- Se padrão não encontrado → declarar como **incerteza**, não inventar
- **Todos os comentários** seguem o idioma padrão do projeto (definir e manter consistente)

### Canvas de layout (mesma regra, aplicada ao visual)

- **Canvas define arranjo visual** (o que aparece, em que ordem, com que hierarquia e densidade) — **não** define cor, spacing, tipografia, markup nem componente
- **Design system + componentes do projeto definem a aparência** — sempre, e vencem o canvas em qualquer divergência
- **Nunca traduzir CSS/HTML do canvas em código final** — nem copiado, nem convertido para valor arbitrário fora do sistema de estilos

  ✅ "Passo 3 — card de resumo com componentes existentes do projeto (variantes: design system); arranjo e ordem dos blocos conforme canvas \<URL\>."
  ❌ Colar `<div style="background:#1e293b;padding:16px">` do canvas.
  ❌ Converter o hex do canvas em valor arbitrário do sistema de estilos — usar um valor cravado é a mesma violação, só disfarçada.
  ❌ Recriar à mão um componente que já existe no projeto porque o canvas desenhou diferente.

- Resultado visual diferente do canvas por causa de token ou componente do projeto → **esperado**; não é desvio de plano, não abre pedido de aprovação

### Rastreabilidade

Todo passo deve ter `**Fonte:**` declarada. Ausência de fonte = premissa não declarada = violação.

---

## Ao terminar

### 1. Carimbar `plan: done` no `SUMARIO.md`

Com todos os PLANs e o `MEMORY.md` **já escritos em disco** e antes de apresentar o resultado (contrato completo no master `sdd`, §Fechamento de fase — carimbar o `SUMARIO.md`):

```bash
node .claude/hooks/sdd-summary.mjs --task <NOME> --phase plan --status done
```

Rodar da raiz do worktree da task. **Não carimbar `spec`.** `spec: skipped` é o default com que as oito fases nascem na inicialização do `SUMARIO.md`, e um `spec: done` deixado pela Fase 1 é preservado automaticamente — carimbar `spec` aqui só teria como efeito apagar o trabalho da Fase 1. `exit ≠ 0` significa que a fase **não** foi carimbada: ler o diagnóstico em `stderr`, resolver a causa e repetir a chamada antes de fechar a fase.

### 2. Apresentar

Apresentar:

1. Lista dos PLANs com escopo
2. Grafo de dependências (paralelo vs sequencial)
3. Confirmação de MEMORY.md criado
4. Triagem visual de cada PLAN de frontend — e, se deu mudança estrutural, o link do canvas aprovado

Avisar para revisar antes de avançar para a Fase 3 (`/question`).

---

## Checklist (complementa checklist global do master `sdd`)

- [ ] Número de PLANs justificado (1-5)
- [ ] Cada PLAN tem: identificador, dependências, escopo, passos, arquivos, contratos, premissas
- [ ] Cada passo tem `**Fonte:**` declarada
- [ ] Nenhum passo copia código da TASK diretamente
- [ ] Itens sem fonte → Premissas/Incertezas
- [ ] MEMORY.md criado com PLANs ⏳ Pendente
- [ ] PLAN de frontend tem `**Triagem visual:**` com classe + justificativa
- [ ] Classe _mudança estrutural_: canvas publicado, aprovado pelo usuário e URL em `**Layout aprovado:**`
- [ ] Caso de empate na triagem foi levado ao usuário, não decidido sozinho
- [ ] PLAN com `**Layout aprovado:**` carrega o bloco de blindagem do canvas em `Pontos de Atenção` (Etapa 1.5, Passo C)
- [ ] Nenhum passo de UI prescreve cor, spacing ou markup vindo do canvas — aparência sempre via token/componente do projeto
- [ ] Passo de UI cita arranjo (canvas) e aparência (skill + arquivo análogo) como fontes separadas
- [ ] `plan: done` carimbado no `SUMARIO.md` com `exit 0`, depois dos PLANs + MEMORY.md e antes do gate
- [ ] Nenhum carimbo de `spec` emitido pela Fase 2 — `skipped` é default e `done` anterior é preservado
