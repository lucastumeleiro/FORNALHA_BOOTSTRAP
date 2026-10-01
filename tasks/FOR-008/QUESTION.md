# QUESTION — FOR-008

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.
Como responder: em cada item troque `pendente` por `aceito`, `rejeitado` ou `incerteza aberta`; o comentário é opcional. Depois peça ao agente para continuar.

**Protocolo:** 2
**Estado:** aplicado

## Frentes vazias

- Frente 4 — Premissas NÃO declaradas: nada relevante
- Frente 6 — Escopo e complexidade: nada relevante (cinco arquivos, um PLAN, sem dependência nova)

## Itens

### Q1.1 — `useTheme` fora do provider: o contexto padrão não está especificado

**Problema:** o PLAN diz que `useTheme` fora do provider "deve cair no contexto padrão em vez de lançar erro" para o `App.test.tsx` continuar passando, mas não define esse padrão. Como `SiteHeader` passa a renderizar o `ThemeToggle`, o `App` sob teste monta o botão sem provider: se o `setTheme` padrão for no-op, o botão fica morto em silêncio. O guia do shadcn, que o PLAN cita como padrão, usa `initialState` com `setTheme: () => null` e lança erro quando o contexto é `undefined`, então o PLAN diverge do guia sem registrar isso. A I3 (onde mora o hook) também segue em aberto.

**Âncoras:** `PLAN-01 §Pontos de Atenção` (3º item) · `PLAN-01 passo 2` · `PLAN-01 Incerteza 3` · `src/test/setup.ts:9-22`

**Sugestão:** fixar no passo 2 que o contexto é criado com valor padrão `{ theme: "system", setTheme: () => {} }` (sem lançar erro), declarar a divergência do guia e manter `useTheme` no mesmo arquivo do provider (fecha a I3). Os testes de CA-2 e CA-3 sempre renderizam o provider.

**Afeta:** PLAN-01 passo 2, PLAN-01 §Incertezas (3), PLAN-01 §Premissas (4)

**Resposta:** aceito

**Comentário:**

### Q1.2 — Passo 4 muda a estrutura do cabeçalho, mas a triagem diz "ajuste pontual"

**Problema:** `site-header.tsx:6` tem `flex ... justify-between` com dois filhos (marca e `<nav>`). Com um terceiro filho, `justify-between` joga o botão para o meio ou cria um vão estranho. O passo 4 admite que "a navegação e o botão passam a compartilhar o lado direito num agrupamento", ou seja, um wrapper novo. O cabeçalho do PLAN classifica isso como "ajuste pontual", embora o próprio texto reconheça uma alteração estrutural do contêiner. Essa classificação decide o rigor da triagem visual.

**Âncoras:** `src/sections/site-header.tsx:6-21` · `PLAN-01 cabeçalho (Triagem visual)` · `PLAN-01 passo 4`

**Sugestão:** especificar no passo 4 o wrapper exato: `<div className="flex items-center gap-4">` envolvendo `<nav>` e `<ThemeToggle>`, mantendo `justify-between` no contêiner externo. Deixar registrado que a classificação "ajuste pontual" foi confirmada pela pessoa apesar do wrapper.

**Afeta:** PLAN-01 passo 4, PLAN-01 cabeçalho (Triagem visual)

**Resposta:** aceito

**Comentário:**

### Q2.1 — O contrato `useTheme` não expõe o tema efetivo, mas o passo 3 depende dele

**Problema:** o passo 3 manda alternar a partir do "tema efetivo na tela" quando o tema é `system`. O contrato exportado, porém, é só `useTheme(): { theme, setTheme }`, e `theme` vale `"system"` nesse caso. O toggle teria de repetir a leitura de `matchMedia` que o provider já faz no passo 2: duas fontes de verdade para a mesma decisão. A TASK ainda diz que FOR-015 e FOR-017 vêm depois desta task e vão consumir esse contrato.

**Âncoras:** `PLAN-01 passo 3` (item "Clique") · `PLAN-01 §Contratos Exportados` · `TASK cabeçalho (Precede: FOR-015, FOR-017)`

**Sugestão:** acrescentar `resolvedTheme: "light" | "dark"` ao valor do contexto, calculado no provider, e usá-lo no toggle (`setTheme(resolvedTheme === "dark" ? "light" : "dark")`). Atualizar §Contratos Exportados.

**Afeta:** PLAN-01 passos 2 e 3, PLAN-01 §Contratos Exportados

**Resposta:** aceito

**Comentário:**

### Q3.1 — I1: `aria-label` fixo ou descritivo do próximo estado

**Problema:** o PLAN deixa o passo 1 com "Alternar tema" como texto provisório e a incerteza aberta, mas o passo 3 mostra um ícone que muda (Q3.3). Com rótulo fixo, quem usa leitor de tela não ouve o estado nem o destino. A TASK pede só "`aria-label` em `content/header.ts`".

**Âncoras:** `TASK I1` · `PLAN-01 passo 1` · `PLAN-01 Incerteza 1`

**Sugestão:** manter o rótulo fixo "Alternar tema". É o padrão do guia do shadcn ("Toggle theme"), exige uma chave só em `content/` e evita o anúncio dessincronizar quando o estado muda. Fechar a I1 com essa decisão.

**Afeta:** PLAN-01 passo 1, PLAN-01 §Incertezas (1), TASK §Premissas e Incertezas

**Resposta:** aceito

**Comentário:**

### Q3.2 — I2: primeiro clique com o tema em `system`

**Problema:** o PLAN propõe alternar para o oposto do tema efetivo, mas a TASK não fecha isso. A alternativa "sempre para o escuro" fica sem efeito visível quando o sistema já é escuro, e a pessoa clica sem ver nada mudar. A decisão afeta o CA-2 ("o tema alterna") na primeira visita.

**Âncoras:** `TASK I2` · `PLAN-01 passo 3` (item "Clique") · `PLAN-01 Incerteza 2`

**Sugestão:** adotar o oposto do tema efetivo (sistema escuro → claro; sistema claro → escuro), como o PLAN propõe, e fixar isso como decisão (depende de Q2.1 para a implementação).

**Afeta:** PLAN-01 passo 3, PLAN-01 §Incertezas (2), TASK §Premissas e Incertezas

**Resposta:** aceito

**Comentário:**

### Q3.3 — Incerteza 4 do PLAN: ícone do estado atual ou do destino

**Problema:** o passo 3 manda empilhar `Sun` e `Moon` com `dark:` e deixa em aberto qual aparece. Esse arranjo (a convenção do shadcn) mostra o sol no claro e a lua no escuro, isto é, o ícone do estado atual. Como o rótulo é fixo (Q3.1), um ícone que mostra o estado atual pode ser lido como "ligar claro" por quem vê o sol num tema já claro. A escolha precisa ser registrada porque o TEST.md vai conferir isso.

**Âncoras:** `PLAN-01 passo 3` (item "Ícone") · `PLAN-01 Incerteza 4`

**Sugestão:** manter o ícone do tema atual (sol no claro, lua no escuro), que é a convenção do shadcn, e fechar a incerteza com essa decisão.

**Afeta:** PLAN-01 passo 3, PLAN-01 §Incertezas (4)

**Resposta:** aceito

**Comentário:**

### Q5.1 — Com `system`, mudar o tema do sistema não atualiza a página

**Problema:** o efeito do passo 2 consulta `matchMedia` só quando `theme` muda. Quem está em `system` (a primeira visita, antes de qualquer clique) e troca o sistema para escuro com a página aberta continua no tema antigo até recarregar. Isso contradiz a premissa de "seguir o sistema" do Comportamento 3. O guia do shadcn também não escuta a mudança, então o PLAN herda a lacuna sem declará-la.

**Âncoras:** `PLAN-01 passo 2` (item "Efeito") · `TASK §Comportamento 3` · `src/test/setup.ts:12-21` (stub com `addEventListener` no-op)

**Sugestão:** ou (a) registrar em "Pontos de Atenção" que a mudança do sistema em tempo real está fora de escopo, ou (b) assinar `change` do `MediaQueryList` no efeito quando `theme === "system"` (o stub do setup já aceita `addEventListener`). Recomendo (a), para manter a task pequena.

**Afeta:** PLAN-01 passo 2 ou PLAN-01 §Pontos de Atenção; TASK §Fora de escopo

**Resposta:** aceito

**Comentário:**

### Q5.2 — `localStorage` indisponível derruba a aplicação inteira

**Problema:** o passo 2 lê `localStorage[storageKey]` no estado inicial e grava em `setTheme`, sem tratar exceção. Com o armazenamento bloqueado (navegador com dados de site bloqueados, alguns modos privados), `getItem` ou `setItem` lança. O provider envolve toda a árvore em `main.tsx` (passo 5), então a leitura que lança no render deixa a página em branco, e a gravação que lança impede o clique de trocar o tema. O PLAN trata valor salvo inválido, mas não acesso que falha.

**Âncoras:** `PLAN-01 passo 2` (itens "Estado inicial" e "`setTheme`") · `PLAN-01 passo 5`

**Sugestão:** envolver leitura e gravação em `try/catch`: a leitura cai em `defaultTheme`; a gravação ainda atualiza o estado (o tema muda na sessão, sem persistir). Acrescentar um caso de teste na lista da Fase 6b.

**Afeta:** PLAN-01 passo 2, PLAN-01 §Pontos de Atenção

**Resposta:** aceito

**Comentário:**

## Resumo

| ID   | Frente                | Desfecho  | Artefatos afetados                          |
| ---- | --------------------- | --------- | ------------------------------------------- |
| Q1.1 | Código existente      | ✅ Aceito | PLAN-01                                     |
| Q1.2 | Código existente      | ✅ Aceito | PLAN-01                                     |
| Q2.1 | Coerência TASK ↔ PLAN | ✅ Aceito | PLAN-01                                     |
| Q3.1 | Premissas declaradas  | ✅ Aceito | PLAN-01, TASK §Premissas e Incertezas       |
| Q3.2 | Premissas declaradas  | ✅ Aceito | PLAN-01, TASK §Premissas e Incertezas       |
| Q3.3 | Premissas declaradas  | ✅ Aceito | PLAN-01                                     |
| Q5.1 | Cenários esquecidos   | ✅ Aceito | PLAN-01, TASK §Fora de escopo               |
| Q5.2 | Cenários esquecidos   | ✅ Aceito | PLAN-01                                     |

## Decisões

### Q1.1 — `useTheme` fora do provider: o contexto padrão não está especificado

**Decisão:** o contexto nasce com valor padrão `{ theme: "system", resolvedTheme: "light", setTheme: () => {} }` e `useTheme` não lança fora do provider, o que mantém o `App.test.tsx`. A divergência do guia do shadcn fica declarada. `useTheme` mora no mesmo arquivo do provider.

**Impacto:** `PLAN-01` passo 2 reescrito; Premissa 4 e Incerteza 3 atualizadas.

### Q1.2 — Passo 4 muda a estrutura do cabeçalho, mas a triagem diz "ajuste pontual"

**Decisão:** `<nav>` e `<ThemeToggle>` ficam num `<div className="flex items-center gap-4">`, e o contêiner externo mantém `justify-between`. A classificação "ajuste pontual" segue confirmada pela pessoa apesar do wrapper.

**Impacto:** `PLAN-01` passo 4 e cabeçalho (Triagem visual) atualizados.

### Q2.1 — O contrato `useTheme` não expõe o tema efetivo, mas o passo 3 depende dele

**Decisão:** o provider calcula `resolvedTheme: "light" | "dark"` e o expõe no contexto; o toggle alterna a partir dele, sem repetir a leitura de `matchMedia`. FOR-015 e FOR-017 consomem o mesmo contrato.

**Impacto:** `PLAN-01` passos 2 e 3 e §Contratos Exportados atualizados.

### Q3.1 — I1: `aria-label` fixo ou descritivo do próximo estado

**Decisão:** rótulo fixo "Alternar tema", uma chave só em `content/header.ts`, como no guia do shadcn.

**Impacto:** `PLAN-01` passo 1 e Incerteza 1 fechados; `TASK.md` I1 resolvida.

### Q3.2 — I2: primeiro clique com o tema em `system`

**Decisão:** o clique vai para o oposto do tema efetivo (sistema escuro → claro; sistema claro → escuro), de modo que o clique sempre muda o que a pessoa vê.

**Impacto:** `PLAN-01` passo 3 e Incerteza 2 fechados; `TASK.md` I2 resolvida.

### Q3.3 — Incerteza 4 do PLAN: ícone do estado atual ou do destino

**Decisão:** o botão mostra o ícone do tema atual (sol no claro, lua no escuro), pela convenção do shadcn, com `Sun` e `Moon` empilhados e alternados por `dark:`.

**Impacto:** `PLAN-01` passo 3 e Incerteza 4 fechados.

### Q5.1 — Com `system`, mudar o tema do sistema não atualiza a página

**Decisão:** opção (a): reagir à mudança do tema do sistema com a página aberta fica fora de escopo, sem assinar `change` do `MediaQueryList`. Quem está em `system` vê o tema novo ao recarregar.

**Impacto:** `PLAN-01` §Pontos de Atenção e `TASK.md` §Fora de escopo atualizados.

### Q5.2 — `localStorage` indisponível derruba a aplicação inteira

**Decisão:** leitura e gravação do `localStorage` ficam em `try/catch`: a leitura cai em `defaultTheme` e a gravação ainda atualiza o estado, sem persistir. Entra um caso de teste na Fase 6b.

**Impacto:** `PLAN-01` passo 2 e §Pontos de Atenção atualizados.

## Incertezas abertas

Não bloqueiam a Fase 4 — resolver durante a execução.

_Nenhuma._

## Alterações aplicadas

| Arquivo                             | O que mudou                                                                                                                                      | Origem             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| `plans/PLAN-01-tema-escuro.md`      | passo 1: rótulo fixo decidido                                                                                                                    | Q3.1               |
| `plans/PLAN-01-tema-escuro.md`      | passo 2: contexto padrão sem erro, `resolvedTheme`, `try/catch` no `localStorage`                                                                | Q1.1, Q2.1, Q5.2   |
| `plans/PLAN-01-tema-escuro.md`      | passo 3: clique pelo `resolvedTheme` (oposto), ícone do tema atual                                                                               | Q2.1, Q3.2, Q3.3   |
| `plans/PLAN-01-tema-escuro.md`      | passo 4: wrapper `flex items-center gap-4`; triagem confirmada                                                                                   | Q1.2               |
| `plans/PLAN-01-tema-escuro.md`      | §Contratos Exportados, §Pontos de Atenção, §Premissas e Incertezas atualizados                                                                   | Q1.1, Q2.1, Q5.1, Q5.2, Q3.1-Q3.3 |
| `TASK.md`                           | §Premissas e Incertezas: I1 e I2 resolvidas; §Fora de escopo: mudança do tema do sistema em tempo real                                           | Q3.1, Q3.2, Q5.1   |
