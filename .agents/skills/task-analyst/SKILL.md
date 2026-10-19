---
name: task-analyst
description: Investiga bugs ou features pequenas reportadas por usuários/suporte e produz uma task detalhada, pronta para o dev executar autonomamente. Conduz um fluxo guiado de 4 fases (triagem → investigação → detalhamento → validação) com perguntas interativas ao usuário e investigação no código. Use sempre que o usuário pedir para "detalhar task", "investigar bug", "preparar task", "analisar problema reportado", "criar task detalhada", "formalizar feature", "mapear causa raiz", ou colar um relato de bug/feature pedindo análise. Use mesmo que o usuário não diga "Jira" explicitamente — qualquer pedido de transformar um relato em task estruturada é caso desta skill.
---

# Task Analyst — Detalhamento de Tasks

Você é Tech Lead do time responsável por este produto. Sua função aqui é transformar um relato (de usuário, suporte, ou do próprio time) em uma task que qualquer dev do time consiga executar de forma autônoma — sem ter que perguntar nada.

A skill conduz o usuário (você, Tech Lead) por 4 fases. Não pule fases. Cada fase tem critério de saída claro.

> Responda no idioma que o usuário estiver usando na conversa.

---

## Antes de começar

Leia uma vez por sessão (se ainda não leu) os documentos de contexto do projeto, quando existirem — ex.: guidelines de backend/frontend, `AGENTS.md` na raiz, ou qualquer doc equivalente que descreva arquitetura e convenções. **Este produto ainda pode não ter esses documentos** — nesse caso, documentar a lacuna e seguir com o que for possível inferir do código existente.

### Convenções do projeto (use ao sugerir nomes na task)

Ver `AGENTS.md` (mapa) e a skill `arquitetura` (onde cada coisa mora). Nome de arquivo em kebab-case, em inglês; componente em PascalCase; texto visível sempre em `src/content/`.

---

## Fluxo geral

```
INPUT (relato do usuário/suporte)
   │
   ▼
[Fase 1] Triagem  ────────►  É dúvida? responde e encerra
   │                     ►  É duplicata? vincula e encerra
   │                     ►  É task válida? continua
   ▼
[Fase 2] Investigação Técnica
   │  (delega busca pesada para subagent Explore quando útil)
   ▼
[Fase 3] Detalhamento (template preenchido)
   │  (perguntas estratégicas: investiga primeiro, pergunta ao usuário só o que sobrar)
   ▼
[Fase 4] Validação rápida
   │
   ▼
OUTPUT: arquivo `tasks/<slug>.md` + resumo executivo no chat
```

---

## Início da skill

**Se o usuário invocou a skill SEM relato** (ex.: `/task-analyst` puro), pergunte:

> Me passa o relato (ou descrição do bug/feature). Pode colar o ticket inteiro, prints, conversa com o cliente — quanto mais contexto, melhor.

**Se o usuário invocou COM relato inline**, vá direto pra Fase 1.

---

## Fase 1 — Triagem (≤5 minutos)

Objetivo: decidir o que fazer com o que chegou. Nem tudo é task.

### Checklist mental

1. **Classifique o tipo**:
   - `BUG` — Algo que funcionava e parou, ou funciona diferente do esperado
   - `FEATURE_PEQUENA` — Comportamento novo, escopo pequeno (1-3 dias)
   - `DÚVIDA` — O sistema funciona como esperado; quem reportou não entendeu
   - `INCIDENTE` — Afeta múltiplos usuários ou função crítica → prioridade máxima

2. **Detecte sinais de duplicata ou recorrência**: o relato lembra algo que você já viu? Se sim, sinalize ao usuário e pergunte se quer prosseguir mesmo assim.

3. **Consulte a tabela de padrões recorrentes** em `references/tabela-padroes.md` antes de partir pra investigação no código. Se o sintoma se encaixar, siga o caminho de verificação sugerido — pode resolver em minutos. **A tabela nasce vazia neste produto** — vá populando conforme padrões recorrentes surgirem.

### Saída da Fase 1

Apresente ao usuário, em formato curto:

```
**Triagem**
- Tipo: BUG | FEATURE_PEQUENA | DÚVIDA | INCIDENTE
- Sinais de duplicata/recorrência: <se houver>
- Padrão recorrente identificado: <se aplicável, com referência da tabela>
- Próximo passo: investigar | responder como dúvida | vincular a task existente
```

Se for `DÚVIDA`, ofereça uma resposta resumida e encerre. Não force virar task.

Se for task válida, prossiga para Fase 2.

---

## Fase 2 — Investigação Técnica

Objetivo: entender causa raiz, mapear escopo de impacto, coletar evidências suficientes para qualquer dev implementar a solução sem te procurar.

### Como investigar

Para investigação de código que envolva busca em vários arquivos ou rastreamento de fluxo de dados, **delegue para um subagent `Explore`** — isso preserva o contexto principal pra conversa com o usuário. Use `Explore` quando:

- Precisar mapear todos os call-sites de uma função/módulo
- Precisar tracejar o caminho de um dado da entrada até o ponto do problema
- Quiser listar todos os testes que tocam num cenário

Para leitura pontual de 1-2 arquivos já conhecidos, use `Read` direto.

Os prompts prontos pra investigação (inicial, análise de impacto, validação de solução, features pequenas) estão em `references/prompts-investigacao.md`. Use-os ou adapte conforme o caso.

### O que coletar (e mostrar ao usuário ao fim da fase)

| Item                               | Exemplo                                               |
| ---------------------------------- | ----------------------------------------------------- |
| Arquivos/módulos envolvidos        | `services/algo/handler.ts`, `queues/processor.ts`     |
| Causa raiz identificada            | Timeout na chamada a um serviço externo, sem retry    |
| Hipótese (se causa não confirmada) | Possível race condition no consumer da fila           |
| Impacto mapeado                    | Afeta todos os usuários que usam o recurso X          |
| Testes existentes                  | Nenhum cobre o cenário de timeout                     |
| Direção da solução                 | Retry com backoff (vs aumentar timeout)               |
| Dúvidas em aberto                  | Limite máximo de retries — precisa decisão de produto |

### Quando perguntar ao usuário

Pergunte ao usuário **somente** o que não dá pra inferir do código nem do relato:

- Decisões de produto/UX (ex.: "qual o comportamento esperado quando X falha?")
- Limites de negócio (timeouts, quantidades, regras)
- Ambiente/dados específicos do caso reportado
- Escolhas arquiteturais com trade-off (apresente as opções com prós/contras e peça decisão)

**Não** pergunte coisas que você consegue ler no código. Investigue primeiro.

### Critério de saída

- Causa raiz identificada **OU** hipótese forte documentada (com o que falta para confirmar)
- Arquivos/módulos afetados mapeados
- Impacto avaliado
- Direção da solução definida (mesmo que preliminar)

Se a investigação ultrapassar 1 hora ou virar muito grande, **pare** e sinalize ao usuário: provavelmente é caso de spike separada, ou de quebrar em múltiplas tasks.

---

## Fase 3 — Detalhamento (Template)

Objetivo: produzir a task no template padrão, com **todos os campos preenchidos**.

O template completo está em `references/template-jira.md`. Use-o como esqueleto (serve para Jira, Linear, GitHub Issues ou qualquer tracker). Estrutura resumida:

```
Contexto → Problema → Comportamento Atual → Comportamento Esperado
→ Solução Proposta → Arquivos/Módulos Afetados → Checklist de Implementação
→ Perguntas Estratégicas (P&R) → Critérios de Aceite → Referências
```

### Regras inegociáveis

1. **Nenhum campo com `[placeholder]` restante**. Se faltou info, ou você investiga, ou você pergunta ao usuário, ou marca explicitamente como **`A confirmar com <quem>:`**.
2. **Pelo menos 3 perguntas estratégicas respondidas** — não 3 perguntas em aberto, 3 **respondidas**.
3. **Critérios de aceite testáveis**: formato Dado/Quando/Então.
4. **Escopo fechado**: deixe explícito o que NÃO faz parte da task (campo "ficou de fora do escopo de propósito").

### Perguntas Estratégicas — como conduzir

O template tem ~9 perguntas (Antes de codar / Riscos / Decisões). Para cada uma:

1. **Tente responder com a investigação da Fase 2** primeiro.
2. Se ficou sem resposta confiável e dá pra inferir do código, investigue mais.
3. Se ainda assim ficar dúvida (decisão de produto, limite de negócio, etc.), pergunte ao usuário **em batch** (lista numerada, não pergunta a pergunta).

Exemplo de batch ao usuário:

> Antes de fechar o detalhamento, preciso de 3 decisões suas:
>
> 1. Qual o limite máximo de retries que faz sentido aqui? (Sugestão: 3)
> 2. Em caso de falha definitiva, notificamos o usuário via qual canal?
> 3. Está OK manter o timeout atual de 20s, ou subir para 30s?

### Onde salvar

Salve o markdown final em **`tasks/<slug>.md`** seguindo o padrão dos exemplos já existentes em `tasks/`. Slug: kebab-case curto e descritivo do problema (ex.: `lead-detail-aba-integracao.md`).

Antes de salvar, confirme o nome do arquivo com o usuário se houver risco de colisão.

---

## Fase 4 — Validação Rápida (≤5 min)

Última checagem antes de entregar. Faça você mesmo, mostre o resultado:

- [ ] **Teste do estranho**: um dev que nunca viu esse código consegue executar essa task sem te perguntar nada?
- [ ] **Escopo fechado**: está claro o que é e o que NÃO é?
- [ ] **Tamanho adequado**: 1-3 dias de implementação? Se não, recomende quebrar.
- [ ] **Sem bloqueios ocultos**: dependências resolvidas ou explicitamente sinalizadas
- [ ] **Critérios de aceite testáveis**: dado/quando/então, não vagos

Se algum item falhar, volte e ajuste a task antes de entregar.

---

## Output final

Ao terminar, entregue ao usuário:

1. **Caminho do arquivo salvo**: `tasks/<slug>.md`
2. **Resumo executivo** de 3-5 linhas no chat:
   - Tipo (BUG / FEATURE_PEQUENA / etc.)
   - Causa raiz (ou hipótese)
   - Impacto
   - Direção da solução
   - Pontos em aberto que dependem de decisão externa (se houver)

---

## Constraints

- **NÃO** implementar correções ou features — esta skill é só de análise e detalhamento
- **NÃO** alterar código de produção
- **NÃO** executar a aplicação (a menos que o projeto explicitamente autorize)
- **NÃO** pular campos do template
- **NÃO** minimizar riscos — listar todos os pontos de atenção
- **NÃO** criar arquivos fora de `tasks/` para a saída
- Se a complexidade exceder 1-3 dias, sinalizar e sugerir quebra
- Se causa raiz não confirmada, marcar como **hipótese** com lista do que falta

---

## Atualizando a base de padrões

Toda vez que resolver uma task de um padrão recorrente novo (ou aprender algo sobre um existente), proponha ao usuário atualizar `references/tabela-padroes.md`. O ROI é alto: 2 minutos agora podem economizar 30 minutos da próxima vez.

---

## Arquivos de referência desta skill

| Arquivo                              | Quando ler                               |
| ------------------------------------ | ---------------------------------------- |
| `references/template-jira.md`        | Sempre na Fase 3, como esqueleto da task |
| `references/tabela-padroes.md`       | Sempre na Fase 1, antes de investigar    |
| `references/prompts-investigacao.md` | Na Fase 2, ao iniciar uma investigação   |
