# Migração da Fase 3 (`/question`) para este repositório — SDD-041

> **Para o agente de IA que for aplicar isto:** este arquivo foi gerado a partir
> do repositório canônico do **Uno SDD** (commit `ea52c6e`, task `SDD-041`). Ele
> descreve o que mudou na Fase 3 do fluxo SDD (`/question`) e como propagar essa
> mudança para o `.claude/` (e, se aplicável, `.agents/`) **deste** repositório.
>
> **Antes de sobrescrever qualquer arquivo abaixo:** confira se a cópia local já
> diverge do canônico (nome de fases diferente, convenções próprias, texto
> adaptado ao domínio deste repo). Se for uma cópia fiel, sem alteração, pode
> substituir direto pelo conteúdo novo. Se divergir, **porte o equivalente** em
> vez de sobrescrever — o objetivo é este repositório ganhar o comportamento
> novo, não perder customização local.

---

## Contexto — o que mudou e por quê

A Fase 3 (`/question`) deixou de ser um fluxo de crítica + discussão dentro da
mesma conversa e virou um protocolo **persistido em `QUESTION.md`**, em duas
paradas:

1. A skill ataca os artefatos, **grava** as perguntas em `tasks/<NOME>/QUESTION.md`
   (todo item nasce com `**Resposta:** pendente`) e **para** — sem esperar
   resposta na mesma conversa.
2. A pessoa responde **no arquivo** (editor de texto) ou numa **tela dedicada**
   de app, se o produto tiver uma. Uma sessão nova (`/question <NOME>` de novo)
   relê o arquivo: se sobrar item sem desfecho, lista os IDs e para de novo; com
   tudo respondido, **solicita ativamente** a aplicação dos ajustes e só escreve
   em `TASK.md`/`plans/` **depois de aprovação explícita dada na conversa do
   terminal** (nunca por uma resposta vinda de outro lugar).

Por quê: o fluxo antigo exigia que pergunta e resposta acontecessem na mesma
sessão, sem sobreviver a fechar a conversa, e não dava para responder por uma
tela separada. O protocolo novo desacopla os dois lados no arquivo.

**Efeito colateral se só parte disso for aplicada:** sem a skill nova, nada
quebra, mas o comportamento antigo continua (crítica + diálogo direto na
conversa, sem parar para esperar resposta em arquivo).

---

## Arquivos a atualizar

### 1. `.claude/commands/question.md` — substituir o conteúdo inteiro

```markdown
---
description: Fase 3/7 SDD — questionamento crítico adversarial dos artefatos TASK + PLAN + EPIC; as perguntas e as respostas vivem em QUESTION.md (arquivo ou tela do app), e os ajustes só entram com aprovação
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /question — Fase 3/7 do Spec Driven Development

## Detecção da task

Se `$ARGUMENTS` foi fornecido, usar como `<NOME>`.

Se não foi fornecido:

1. Detectar branch atual
2. Se branch tem padrão de ticket (ex.: `feature/TASK-123`), extrair e perguntar:
   ```
   Detectei `TASK-123` na branch atual. É essa a task?
   [s] sim
   [n] informar outra
   ```
3. Senão, perguntar: `Qual identificador da task?`

Confirmar que `tasks/<NOME>/plans/` (com ao menos um PLAN) e `tasks/<NOME>/MEMORY.md` existem. Se faltar algum, parar e avisar.
TASK.md é sempre a fonte de verdade.

## Execução

1. Invocar skill `sdd-question` para o método de questionamento
2. **Etapa 0 e 0.5 — entrada idempotente:** carregar contexto completo + investigar código real (leituras cirúrgicas nos arquivos que os PLANs tocam) e ler `tasks/<NOME>/QUESTION.md`. Ausente → Etapa 1. Formato antigo ou `Estado: aplicado` → informar e **não escrever** (formato antigo: perguntar antes de qualquer coisa). `Estado: aguardando respostas` → **não regerar**; ler as respostas, listar os IDs sem desfecho e parar, ou, com todos respondidos, ir à solicitação da Etapa 3
3. **Etapa 1 — Crítica grava e para:** atacar em **6 frentes** (skill detalha cada uma), numerando **todos** os itens no padrão `QN.M`, e **gravar** tudo em `tasks/<NOME>/QUESTION.md` (protocolo 2, todo item com `Resposta: pendente`). Parar dizendo "Perguntas gravadas em `tasks/<NOME>/QUESTION.md`. Responda no arquivo ou pela tela do app e peça para continuar.", só com contagem e IDs no chat
4. **Etapa 2 — Respostas:** a pessoa responde no arquivo ou pela tela do app; ao continuar (dizendo ao agente ou pelo "Continuar" da tela), o agente lê o arquivo. Resposta dada no chat não é transcrita
5. **Etapa 3 — Escrita:** com todo item respondido, **solicitar ativamente** a aplicação — listando arquivo por arquivo o que muda e os IDs de origem (`[s]` tudo · `[p]` só o `QUESTION.md` · `[n]` nada). Só após aprovação do usuário **na conversa do terminal** (a tela do app nunca aprova): completar o `QUESTION.md` com `Edit`, aplicar os ajustes acordados em `TASK.md` e `plans/PLAN-NN-*.md` e, por último, marcar `Estado: aplicado`

Escrita permitida **somente** dentro de `tasks/<NOME>/`: o `QUESTION.md` na Etapa 1 (com o arquivo ainda inexistente) e `TASK.md`/`plans/` só na Etapa 3 aprovada — nunca código de produção, nunca ajuste antes da aprovação.

Ao terminar, avisar o usuário para revisar `QUESTION.md` e os artefatos ajustados antes de avançar pra `/feature`.
```

**Adapte antes de colar:** se este repositório numerar fases diferente (ex. a
Fase 3 não se chama `question` no catálogo, ou não usa `plans/PLAN-NN-*.md`),
troque os nomes de artefato e o `--phase` mantendo a lógica das 5 etapas.

---

### 2. `.claude/skills/sdd-question/SKILL.md` — substituir o conteúdo inteiro

> Arquivo grande (351 linhas no canônico) — copie-o integralmente do
> repositório Uno SDD em `.claude/skills/sdd-question/SKILL.md` (commit
> `ea52c6e`). Se este repositório tiver acesso ao checkout do Uno SDD (mesma
> máquina, ex. `F:\Unobject\sdd`), a cópia mais segura é:
>
> ```bash
> cp <caminho-do-uno-sdd>/.claude/skills/sdd-question/SKILL.md .claude/skills/sdd-question/SKILL.md
> ```
>
> Se não houver acesso ao repositório canônico, peça à pessoa que cole o
> conteúdo do arquivo `.claude/skills/sdd-question/SKILL.md` do Uno SDD
> (commit `ea52c6e` / task SDD-041) — é o arquivo que define as Etapas 0 a 3,
> o padrão de numeração `QN.M`, o gabarito do `QUESTION.md` (protocolo 2) e o
> carimbo `--phase question --status done`.
>
> **Pontos que este arquivo precisa cobrir, se for adaptado em vez de copiado
> ao pé da letra** (resumo do que mudou vs. a versão anterior — a diferença
> não é um patch pequeno, é reescrita do fluxo inteiro):
> - Etapa 0.5 nova: decide o ponto de entrada lendo `QUESTION.md` existente
>   (ausente → Etapa 1; formato antigo ou `aplicado` → informa e não escreve;
>   `aguardando respostas` → não regera, vai para leitura de respostas)
> - Etapa 1 grava o arquivo inteiro (`Write`) e **para** — não faz mais
>   diálogo de pergunta/resposta na mesma conversa
> - Gabarito do `QUESTION.md` ganhou cabeçalho `**Protocolo:** 2` /
>   `**Estado:**` (`aguardando respostas` → `aplicado`), com todo item
>   nascendo `**Resposta:** pendente`
> - Etapa 2 é só leitura do arquivo — resposta dada no chat nunca é transcrita
> - Etapa 3 só escreve após aprovação explícita **na conversa do terminal**
>   (nunca por sinal vindo de uma tela/app), usa `Edit` cirúrgico (nunca
>   `Write` do arquivo inteiro, para não pisar resposta escrita durante a
>   conversa) e marca `Estado: aplicado` **por último**, depois de todos os
>   outros ajustes
> - Carimbo `--phase question --status done` só sai depois do `Estado:
>   aplicado` — nunca com a rodada ainda `aguardando respostas`

---

### 3. `.claude/skills/sdd/SKILL.md` (skill master) — patch cirúrgico, 6 trechos

Este arquivo **não** foi reescrito — só 6 trechos pontuais mudaram para o
master reconhecer o novo protocolo de 2 etapas da Fase 3. Aplique cada
substituição abaixo mantendo o resto do arquivo como está (procure o texto
"Antes" e troque exatamente pelo "Depois"; se o seu arquivo já divergiu do
canônico nesses pontos, adapte a ideia em vez de colar literal):

**3.1 — na árvore de artefatos por task:**
- Antes: `├── QUESTION.md   # Fase 3 — decisões da rodada de questionamento (IDs QN.M)`
- Depois: `├── QUESTION.md   # Fase 3 — perguntas (IDs QN.M) e respostas da rodada, gravadas na Etapa 1; decisões na Etapa 3`

**3.2 — na visão geral das fases:**
- Antes: `- **3** \`/question\` → \`sdd-question\` → crítica adversarial + discussão → \`QUESTION.md\` + ajustes acordados em \`TASK.md\`/\`plans/\` (escrita só na Etapa 3, com aprovação explícita)`
- Depois: `- **3** \`/question\` → \`sdd-question\` → crítica adversarial gravada em \`QUESTION.md\` (Etapa 1, que para) → respostas da pessoa no arquivo ou na tela → ajustes acordados em \`TASK.md\`/\`plans/\` (Etapa 3, com aprovação explícita na conversa do terminal). O \`QUESTION.md\` é também o meio de resposta; só ele é escrito antes da aprovação`

**3.3 — em "Quando chamar: depois do artefato, antes do gate":**
- Antes: `Fase que não fechou não carimba. A Fase 3, em particular, só carimba depois de a Etapa 3 **autorizada** ter escrito o \`QUESTION.md\` e os ajustes acordados; carimbar durante a discussão violaria o próprio gate que ela é.`
- Depois: `Fase que não fechou não carimba. A Fase 3, em particular: o \`QUESTION.md\` **já existe desde a Etapa 1** (é o meio da conversa), então a presença dele não prova o fechamento; ela só carimba depois de a Etapa 3 **autorizada** ter aplicado os ajustes acordados e deixado o \`QUESTION.md\` com \`**Estado:** aplicado\`; carimbar enquanto ele diz \`aguardando respostas\` violaria o próprio gate que ela é.`

**3.4 — na Etapa 0.1 padrão (leitura de artefatos):**
- Antes: `- Ler \`tasks/<NOME>/QUESTION.md\` se existir (fases 4+) — decisões já tomadas na Fase 3 e incertezas ainda abertas. **Decisão registrada ali não se re-litiga**; incerteza aberta se resolve na execução`
- Depois: `- Ler \`tasks/<NOME>/QUESTION.md\` se existir (fases 4+) — decisões já tomadas na Fase 3 e incertezas ainda abertas. **Decisão registrada ali não se re-litiga**; incerteza aberta se resolve na execução. **Só vale como decisão com \`**Estado:** aplicado\` (ou formato legado, sem \`**Protocolo:**\`).** Com \`**Estado:** aguardando respostas\`, a rodada **não fechou**: nada ali é decisão, a \`Sugestão\` não é acordo e as respostas dadas podem ainda mudar — as decisões só existem em \`## Decisões\`, depois da Etapa 3`

**3.5 — na seção "Premissas e Incertezas", exceção da Fase 3:**
- Antes: `> **Exceção — Fase 3 (\`QUESTION.md\`):** é a fase que **ataca** as premissas das outras, não que as declara. Usa o próprio formato (Resumo + Decisões + Incertezas abertas + Alterações aplicadas); a seção \`## Incertezas abertas\` cumpre o papel.`
- Depois: `> **Exceção — Fase 3 (\`QUESTION.md\`):** é a fase que **ataca** as premissas das outras, não que as declara. Usa o próprio formato, o do protocolo 2 (cabeçalho \`**Protocolo:**\`/\`**Estado:**\` + \`## Itens\`; Resumo, Decisões, Incertezas abertas e Alterações aplicadas entram na Etapa 3); a seção \`## Incertezas abertas\` cumpre o papel.`

**3.6 — nas Regras Globais:**
- Antes: `- **NUNCA** implementar código nas fases 1-3, 5, 6a, 7 (Fase 3 escreve \`QUESTION.md\` e ajusta \`TASK.md\`/\`plans/\` só na Etapa 3 aprovada; Fase 5 coordena correções via agentes; Fase 7 só escreve \`VERIFY.md\`)`
- Depois: `- **NUNCA** implementar código nas fases 1-3, 5, 6a, 7 (Fase 3 grava o \`QUESTION.md\` na Etapa 1 — a única escrita antes da aprovação — e ajusta \`TASK.md\`/\`plans/\` só na Etapa 3 aprovada, na conversa do terminal; Fase 5 coordena correções via agentes; Fase 7 só escreve \`VERIFY.md\`)`

---

### 4. `.claude/skills/sdd-feature/SKILL.md` — patch cirúrgico, 1 linha

Na lista de leituras obrigatórias antes de executar a Fase 4:

- Antes: `4. \`tasks/<NOME>/QUESTION.md\` (se existir) — decisões da Fase 3 (\`QN.M\`) e **incertezas abertas**. As incertezas apontadas ali como "resolver na execução" são responsabilidade desta fase; decisão registrada **não** se re-litiga`
- Depois: `4. \`tasks/<NOME>/QUESTION.md\` (se existir) — decisões da Fase 3 (\`QN.M\`) e **incertezas abertas**. As incertezas apontadas ali como "resolver na execução" são responsabilidade desta fase; decisão registrada **não** se re-litiga. **Se o cabeçalho diz \`**Estado:** aguardando respostas\`, a Fase 3 não fechou:** avisar a pessoa ("a Fase 3 não fechou: há N itens sem desfecho / respostas ainda sem aplicar") e **perguntar** se prossegue mesmo assim; nunca tratar \`Sugestão\` como decisão. Com \`aplicado\` ou formato legado (sem \`**Protocolo:**\`), seguir como de costume`

---

### 5. `.claude/commands/feature.md` — patch cirúrgico, 1 linha

Na Etapa 0 da execução de `/feature`:

- Antes: `2. Etapa 0: ler todos os PLANs em \`tasks/<NOME>/plans/\` + TASK + MEMORY.md + QUESTION.md (se existir — decisões \`QN.M\` da Fase 3 e incertezas abertas a resolver nesta fase)`
- Depois: `2. Etapa 0: ler todos os PLANs em \`tasks/<NOME>/plans/\` + TASK + MEMORY.md + QUESTION.md (se existir — decisões \`QN.M\` da Fase 3 e incertezas abertas a resolver nesta fase). Se o \`QUESTION.md\` diz \`**Estado:** aguardando respostas\`, a Fase 3 não fechou: **avisar a pessoa e perguntar** se prossegue mesmo assim; \`Sugestão\` nunca é decisão`

---

## Se este repositório também usa o runtime Codex (`.agents/`)

Espelhar os arquivos 2, 3 e 4 (skills) em `.agents/skills/sdd-question/SKILL.md`,
`.agents/skills/sdd/SKILL.md` e `.agents/skills/sdd-feature/SKILL.md` — mesmo
conteúdo do runtime Claude. Não há `.agents/commands/`; o equivalente de
comando desse runtime (`.codex/agents/`, se este repositório tiver) segue a
convenção própria dele — adapte o texto do item 1 e 5 ao formato que esse
runtime usa, mantendo a mesma lógica de 5 etapas.

---

## Fora do escopo deste .md: o hook `sdd-summary.mjs`

O carimbador (`.claude/hooks/sdd-summary.mjs`) também precisa reconhecer o
estado `aguardando respostas` para não marcar `question: done` antes da hora.
**Isso não se resolve copiando texto** — é um bundle binário/compilado que,
por norma do produto, só o **app Uno SDD** instala (com confirmação, nunca
sobrescreve calado). Ação:

- **Se este repositório usa o app Uno SDD:** Configurações → Atualizações →
  garantir que o daemon instalado já é de uma versão que inclui SDD-041 (ou
  reinstalar o daemon).
- **Se não usa o app** (`claude` direto / CI): sem o bundle novo, a Fase 3
  continua funcionando (a skill grava e para do mesmo jeito), mas o
  `SUMARIO.md` pode ficar temporariamente desatualizado até o carimbo
  explícito da Etapa 3 — não é bloqueante, é só um efeito a saber.

---

## Verificação depois de aplicar

```bash
grep -rl "sdd-summary.mjs" .claude/skills .agents/skills .claude/agents .codex/agents 2>/dev/null | sort
```

Resultado esperado: a skill master (`sdd`), as sete sub-skills de fase e o
agente revisor do runtime adotado — todos citando o carimbador.

Teste funcional: rodar `/question <TASK-ID>` numa task com PLANs aprovados e
confirmar que o agente **grava `QUESTION.md` e para**, em vez de fazer crítica
e diálogo direto na conversa.
