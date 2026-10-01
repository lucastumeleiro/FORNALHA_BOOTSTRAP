Ciclo: 3/3

# VERIFY — FOR-008: Tema escuro com alternância

**Veredito:** PASS ✅
**Verificado por:** sub-agente independente (author ≠ verifier), contexto novo; sensor estático, nada foi executado (nem `npm test`, `build`, `typecheck` nem `dev`). Os relatos de quem corrigiu não foram aceitos: cada linha citada foi conferida nos arquivos atuais.
**Diff coberto:** 5 arquivos de produção (`src/components/theme-provider.tsx`, `src/components/theme-toggle.tsx`, `src/sections/site-header.tsx`, `src/content/header.ts`, `src/main.tsx`), 4 arquivos de teste (`src/components/theme-provider.test.tsx` 18 casos, `src/components/theme-toggle.test.tsx` 10, `src/sections/site-header.test.tsx` 4, `src/main.test.tsx` 4 = 36) e `tasks/FOR-008/TASK.md` (CA-1, CA-3, CA-4 e Fora de escopo/I1/I2 reescritos).

Resumo: as lacunas do ciclo 2 estão fechadas. O mutante `defaultTheme="system"` → `"dark"` agora morre no novo caso `main.test.tsx:58-69`; CA-3 nomeia o observável; a asserção pós-clique usa `waitFor`. Nenhum CA sem cobertura, nenhum mutante plausível sobrevivente, nenhuma exclusão refutada. Restam só achados não bloqueantes (REVIEW.md ausente; risco de tempo/`act` que só a execução confirma).

## Histórico

| Ciclo | Veredito | Lacunas |
| ----- | -------- | ------- |
| 1     | FAIL ❌  | Ligação de `main.tsx` sem teste; mock de `matchMedia` ignorava a query; teste CT-11 vácuo; precisão da spec em CA-1/CA-4 |
| 2     | FAIL ❌  | Mutante `defaultTheme="system"` → `"dark"` sobrevivia (faltava caso "primeira visita com sistema claro"); CA-3 sem observável; risco de `waitFor`/timeout em `main.test.tsx` |
| 3     | PASS ✅  | Todas fechadas (ver checks); só achados não bloqueantes |

## Check 1 — Conclusão

Todos PLANs ✅: sim. `MEMORY.md` lista `PLAN-01-tema-escuro` (único PLAN em `plans/`) como "✅ Concluído", sem bloqueios ativos. `AUTOTEST.md` presente, com `## Exclusões`. Os quatro arquivos de teste existem.

Produção em relação ao PLAN-01 (passo 5): `src/main.tsx` contém, por leitura e por `git diff` (+4 −1, só o import e o wrapper), `<StrictMode><ThemeProvider defaultTheme="system" storageKey="fornalha-theme"><App /></ThemeProvider></StrictMode>`. É o que o PLAN pede e o que `main.test.tsx` espera; a restauração manual após o checkout acidental não deixou resíduo (o restante do arquivo é idêntico ao `HEAD`). `theme-provider.tsx`, `theme-toggle.tsx`, `site-header.tsx` (wrapper `flex items-center gap-4`) e `header.ts` (`themeToggle.label = "Alternar tema"`) estão como o PLAN descreve.

## Check 2 — Cobertura ancorada nos CAs

Todas as linhas abaixo foram abertas nos arquivos atuais; cada uma aponta a asserção citada. Também conferi as citações de linha do `AUTOTEST.md` (CT-01 a CT-11, Exclusões, Rastreabilidade): todas existem e apontam o teste certo (`button.tsx:7` e `:28`, `index.css:84`, `site-header.tsx:7-9`, `theme-toggle.tsx:20-21`, `theme-provider.tsx:53` e `:55-59` incluídos).

| CA | Estado | Evidência (`arquivo:linha`) | Observação |
| -- | ------ | --------------------------- | ---------- |
| CA-1 — primeira visita, sem tema salvo, sistema escuro: `<html>` com `dark` | ✅ auto | Provider: `theme-provider.test.tsx:83` (`dark` presente), `:84` (`light` ausente), `:116` (nada gravado), `:117` (`escolhido: system`); contraprova `:100-101`. App real: `main.test.tsx:53` (`dark`), `:54` (sem `light`), `:55` (chave nula); contraprova no app real `main.test.tsx:66-68` (`light`, sem `dark`, chave nula) | Fecha a lacuna do ciclo 2: o caso `:58-69` usa `simularSistema(false)` (`:60`) sem valor salvo. |
| CA-2 — clique alterna e `<html>` ganha/perde `dark` | ✅ auto | `theme-toggle.test.tsx:56-58`, `:64-66`, `:72-74` (ganha e perde nas duas direções; chave `dark`/`light`); oposto do efetivo `:88-90` (escuro→`light`), `:103-104` (claro→`dark`); cabeçalho `site-header.test.tsx:91-92`; app real `main.test.tsx:82-84` | Mira o valor exato (classe `dark` no `<html>`). |
| CA-3 — escolhi o escuro, recarrego, continua escuro: `<html>` mantém `dark` | ✅ auto | `theme-provider.test.tsx:225` (`dark` após desmontar e remontar com o mesmo `localStorage`, sistema claro), `:226`; escolha vence o sistema `:242-243`; app real `main.test.tsx:96-97` (chave `dark` salva, sistema claro, abre `dark` sem `light`) | "Recarregar" = nova montagem sobre o mesmo `localStorage`; no app real, novo `import("@/main")` (`main.test.tsx:26`) com `resetModules` (`:33`). |
| CA-4 — só teclado: `Tab` chega ao botão, anel de foco visível, `Enter`/`Espaço` alternam | ✅ auto (Tab/Enter/Espaço) + 🧪 manual (anel visível) | `theme-toggle.test.tsx:162` (`toHaveFocus` após `Tab`), `:168`, `:175`, `:182` (cada acionamento alterna), `:169`, `:176`, `:183` (foco permanece); ordem `site-header.test.tsx:49-51`, `:57-59`, `:74-76`. Anel: TEST.md CT-06 (`TEST.md:123`) | Anel é CSS computado (`focus-visible:ring-3`, `button.tsx:7`): C legítimo (Check 6), mapeado a CT. |

Releitura da spec (TASK.md reescrito, diff conferido): CA-1 acrescenta "(sem tema salvo)" e o observável `dark`; CA-3 acrescenta "o `<html>` mantém a classe `dark`"; CA-4 troca "vejo o foco" por "anel de foco visível". Mantêm a intenção original (cada um só nomeia o observável já implícito) e não contradizem `QUESTION.md`: Q3.1/Q3.2 resolvem I1/I2 (marcadas como resolvidas, sem mudar a decisão), Q5.1 fica em "Fora de escopo" e o `change` do sistema não é implementado. Nenhum item de `QUESTION.md` ficou `rejeitado`/descartado.

Asserções que dependem da ligação real do provider (CA-1/2/3 no app) estão em `main.test.tsx`, não só no provider isolado.

## Check 3 — Sensor de discriminação estático

Perguntas específicas do ciclo:

- **`waitFor` é válido com `vi.resetModules()`?** Sim. `waitFor` e `screen` vêm de importação estática do topo (`main.test.tsx:1`), resolvida antes de qualquer `resetModules`; só o que é importado dinamicamente (`@/main`, React, App) é reavaliado. `waitFor` observa o `document` (classe do `<html>` mudando é mutação de atributo) e faz polling, então independe de qual cópia do React renderizou. Sem `globals` no `vite.config.ts` o RTL não liga `IS_REACT_ACT_ENVIRONMENT` sozinho, portanto a segunda cópia do React agenda a renderização inicial normalmente e `findByRole` (`:27`) e `waitFor` (`:53`, `:66`, `:76`, `:82`, `:96`) esperam por ela. Pode haver aviso `act(...)` no console do clique (a flag global fica verdadeira durante o `eventWrapper` do RTL), mas é ruído, não falha: `src/test/setup.ts` não converte `console.error` em erro.
- **Isolamento entre casos.** `beforeEach`: `vi.resetModules()` e `body.innerHTML = '<div id="root">'` (`main.test.tsx:33-34`); `afterEach`: `restoreAllMocks`, `localStorage.clear()`, remove `light`/`dark` do `<html>`, esvazia o `body` (`:38-41`). Raízes React de casos anteriores ficam presas a contêineres destacados e sem atualizações pendentes: não mexem no `<html>` nem no `localStorage`. A ordem dos casos não importa. Idem nos outros três arquivos: `afterEach` limpa `localStorage` e as classes do `<html>` (`theme-provider.test.tsx:63-67`, `theme-toggle.test.tsx:36-40`, `site-header.test.tsx:16-19`); `simularSistema` cria um mock novo por caso. Nenhum caso depende do resultado de outro.
- **Mock de `matchMedia` respeita a query.** `theme-provider.test.tsx:26`, `theme-toggle.test.tsx:14` e `main.test.tsx:12`: `escuro && query === "(prefers-color-scheme: dark)"`.
- **CT-11 dispara o evento antes de assertar.** `sistema.mudarPara(true)` (`theme-provider.test.tsx:355`) chama os ouvintes capturados em `addEventListener` (`:31-40`) dentro de `act` (`:19`); só então vêm `:358-360`.

| Teste (`arquivo:linha`) | Mutante tentado | Veredito |
| ----------------------- | --------------- | -------- |
| `main.test.tsx:45-56` | remover `<ThemeProvider>` de `main.tsx:9` (ou renderizar `<App/>` fora dele); `defaultTheme="light"`; query `dark`→`light` ou ternário invertido em `resolveTheme` | ✅ morrem em `:53` |
| `main.test.tsx:58-69` | `defaultTheme="system"`→`"dark"`; remover o provider; ignorar `prefers-color-scheme` (sempre `dark`) | ✅ morrem em `:66-67` (o mutante `"dark"` do ciclo 2 morre aqui) |
| `main.test.tsx:71-85` | `defaultTheme="light"`; provider sem efeito; `<ThemeToggle>` removido do cabeçalho; `storageKey` trocada em `main.tsx:9`; não gravar | ✅ morrem em `:76`, `:82` ou `:84` |
| `main.test.tsx:87-98` | `storageKey` trocada em `main.tsx:9`; provider ignora o valor salvo; salvo não vence o sistema | ✅ morrem em `:96` |
| **Conjunto de `main.test.tsx` contra `main.tsx:9`** | `defaultTheme` = `"light"` (morre em `:53`, `:76`), `"dark"` (morre em `:66`), `"system"` omitido (equivalente, sem efeito), `storageKey` errada (`:84`, `:96`), sem provider (`:53`, `:66`, `:76`, `:96`) | ✅ nenhum sobrevive |
| `theme-provider.test.tsx:71-86`, `:88-102` | ignorar `prefers-color-scheme`; query `dark`→`light`; não remover a classe anterior; não aplicar `light` explícito; inverter `resolveTheme` | ✅ `:83-85`, `:100-101` |
| `theme-provider.test.tsx:104-118`, `:120-133` | gravar na montagem; `defaultTheme` padrão `system`→`dark`/`light`; ignorar `defaultTheme` | ✅ `:116`, `:83`, `:100`, `:132` |
| `theme-provider.test.tsx:137-162`, `:164-180`, `:182-200` | não gravar; gravar valor errado; `storageKey` padrão trocada; não reaplicar ao voltar para `system` | ✅ `:153`, `:160-161`, `:178-179`, `:198-199` |
| `theme-provider.test.tsx:204-261` | ignorar valor salvo; salvo não vencer o sistema; `system` salvo tratado como outra coisa | ✅ `:225`, `:242-243`, `:259` |
| `theme-provider.test.tsx:264-298` | aceitar valor inválido; não sobrescrever | ✅ `:277`, `:296` |
| `theme-provider.test.tsx:302-340` | tirar o `try/catch` da leitura ou da gravação | ✅ `:317` (render lança) e `:338-339` |
| `theme-provider.test.tsx:344-383` | assinar `change` (`addEventListener`) e reaplicar a classe | ✅ `:358-360` |
| `theme-provider.test.tsx:388-408` | contexto padrão com `resolvedTheme: "dark"`; `setTheme` real fora do provider | ✅ `:394`, `:406-407` |
| `theme-toggle.test.tsx:44-120` | clique sempre para `dark`; alternar por `theme` em vez de `resolvedTheme`; inverter o ternário; não gravar | ✅ `:64`, `:88`, `:90`, `:103` |
| `theme-toggle.test.tsx:122-147` | tirar o `try/catch` da gravação | ✅ `:139` |
| `theme-toggle.test.tsx:151-184` | `tabIndex={-1}`; `<button>`→`<div>`; `disabled` | ✅ `:162` |
| `theme-toggle.test.tsx:188-232` | `aria-label` que muda com o estado; `aria-label` removido; `aria-hidden` removido de um ícone; um ícone removido | ✅ `:198`, `:212-213`, `:227-230` |
| `site-header.test.tsx:22-93` | botão fora do cabeçalho; botão antes da `<nav>`; link removido; `<ThemeToggle>` removido | ✅ `:35`, `:57-59`, `:74-76`, `:91` |
| Ícone/estado errado (`Sun`/`Moon` trocados, `dark:hidden` invertido) | exige CSS do Tailwind, ausente no jsdom | exclusão C legítima (Check 6) |
| Assinar o `MediaQueryList` por `onchange`/`addListener` | o mock só entrega o evento pelo `addEventListener` | tolerado: caminho legado, implausível numa troca para `change`; não bloqueia |

## Check 4 — Payload/conjunção

Nenhuma asserção fraca do tipo `toHaveBeenCalled()`: nenhum teste asserta chamada; todos miram estado (classes do `<html>`, valor de `localStorage`, texto, atributos, foco). Os pares ganha/perde (`dark` presente e `light` ausente, e o inverso) estão completos em `main.test.tsx:53-54`, `:66-67`, `:82-83`, `:96-97`. Casos só com `toContain` (`theme-provider.test.tsx:132`, `:198`, `:259`, `:278`; `theme-toggle.test.tsx:103`, `:118`, `:168`, `:182`) discriminam porque o estado anterior do `<html>` era o oposto ou o `defaultTheme` difere do sistema; a remoção da classe antiga é provada em `:84`, `:101` e `:160`. Não há conjunção de condições soltas escondendo um ramo.

## Check 5 — Escopo e fechamento do REVIEW.md

- `git status`: só os cinco arquivos de "Arquivos Impactados" do PLAN-01 (`theme-provider.tsx`, `theme-toggle.tsx`, `site-header.tsx`, `header.ts`, `main.tsx`), os testes lado a lado (os quatro `*.test.tsx` novos) e artefatos de `tasks/FOR-008/`. `src/index.css`, `src/components/ui/*`, `src/test/setup.ts` e `index.html` não foram tocados.
- Produção sem alteração indevida: o diff de `site-header.tsx` é só o import e o wrapper `flex items-center gap-4` (Q1.2); `header.ts` ganha uma chave; `main.tsx` conferido no Check 1.
- Sem cor literal nem classe de paleta nos cinco arquivos de produção (busca por hex, `oklch`, `rgb(`, `hsl(`, `bg|text|border-(white|black|gray…)`: zero ocorrências); aparência só por classes de token (`dark:hidden`, `hidden dark:block`, `border-border`, `text-muted-foreground`).
- Comportamento rejeitado de `QUESTION.md`: nenhum. Todos os itens estão `aceito`; o `change` do `MediaQueryList` não é assinado (Q5.1); sem script inline contra o piscar; sem menu "sistema".
- `TASK.md` alterado: a reescrita de CA-1/3/4 e as notas de I1/I2/Fora de escopo seguem a aprovação do usuário e a Fase 3. Escopo acordado.
- Observação sem teste e fora de escopo, já declarada em `AUTOTEST.md:84`: `resolvedTheme` é recalculado a cada render (`theme-provider.tsx:53`) enquanto a classe do `<html>` só se reaplica quando `theme` muda (`:55-59`).
- Risco residual que o sensor estático não decide (não bloqueia): (a) o primeiro caso de `main.test.tsx` importa o App inteiro dentro do limite padrão de 5 s do teste, e `findByRole` (`:27`) espera até 1 s pela renderização inicial; (b) após `resetModules` o React do app é uma segunda cópia, podendo emitir aviso de `act` no clique. O `waitFor` pós-clique (`:82`) já cobre o assentamento. Confirmar na primeira execução de `npm test`; se instável, `{ timeout }` no primeiro caso.
- **`REVIEW.md` ausente** (Fase 5 pulada, `skipReason: ih` no `SUMARIO.md`): achado declarado, não bloqueia. Bloqueantes do REVIEW.md em aberto: nenhum (não existe o arquivo).

## Check 6 — Auditoria das exclusões (AUTOTEST.md)

Cada parcela C do `AUTOTEST.md` tem bloco em `## Exclusões` (CT-07, CT-12, "Ícone exibido", "Anel de foco visível e `Espaço`", "`display: none` do ícone oculto") e todas citam `§Classificação A/B/C deste produto`. A "Ligação do provider em `src/main.tsx:9`" é B, sem exclusão, com teste. Nenhuma exclusão sem bloco; nenhum CT classificado C sem bloco (CT-07 e CT-12 são os únicos C).

| CT / parcela | Justificativa da 6b | Refutação tentada | Veredito |
| ------------ | ------------------- | ----------------- | -------- |
| CT-07 — cabeçalho em 375 px e ≥ 1280 px, botão 32 × 32 px | `size-8` (`button.tsx:28`) e `flex items-center justify-between gap-4` (`site-header.tsx:7-9`) só viram CSS pelo Tailwind do Vite; jsdom devolve 0 × 0 | Dependência injetável? não, é CSS. Mock de 1 nível? nenhum produz layout. Asserir a classe é testar o literal do JSX (TA-03). Automação possível do que é DOM (botão no cabeçalho, depois dos links, na ordem de foco) já existe: `site-header.test.tsx:35`, `:57-59`, `:74-76` | ✅ C legítimo (layout em navegador real) |
| CT-12 — legibilidade/contraste no escuro, sem mudança de cor | tokens `.dark` de `index.css:84` só se resolvem no navegador; `check:cores` já guarda cor literal | Nada a injetar; qualquer mock devolveria a cor que o teste definiu; a cor não é atributo do DOM | ✅ C legítimo (cor e contraste percebidos) |
| Parcela "ícone exibido" (CT-01, CT-02, CT-03) | `Sun`/`Moon` alternam por `dark:hidden`/`hidden dark:block` (`theme-toggle.tsx:20-21`); o `display` vem do CSS do Tailwind | A parte DOM que dispara a troca (classe do `<html>`) está em B (`theme-provider.test.tsx:83-84`, `main.test.tsx:53`, `:82`). Asserir `dark:hidden` seria literal e não prova qual ícone aparece | ✅ C legítimo |
| Parcela "anel de foco visível" e `Espaço` sem rolar (CT-06) | anel vem de `focus-visible:ring-*` (`button.tsx:7`); rolagem é comportamento do navegador | Foco chega, permanece, e `Enter`/`Espaço` alternam em B (`theme-toggle.test.tsx:162-183`); `toHaveFocus` não prova anel renderizado | ✅ C legítimo |
| Parcela `display: none` do ícone oculto (CT-08) | mesma origem de `theme-toggle.tsx:20-21` | `button`, `aria-label` fixo e `aria-hidden` já em B (`theme-toggle.test.tsx:198`, `:212`, `:227-230`) | ✅ C legítimo |

Exclusões refutadas: nenhuma.
AUTOTEST.md ausente (fluxo antigo): não.

## Lacunas priorizadas

Nenhuma lacuna bloqueante. Nada exige escalar ao usuário por falha de cobertura.

Achados não bloqueantes (para registro):

1. [P3] `REVIEW.md` ausente (Fase 5 pulada, `skipReason: ih`). Achado declarado; decisão de processo da pessoa.
2. [P3] Risco de tempo/`act` em `src/main.test.tsx:26-27` e `:82` que só a execução confirma (Check 5). Se `npm test` mostrar instabilidade: `{ timeout }` no primeiro caso e/ou `findByRole` com timeout maior.
3. [P3] Observação já declarada em `AUTOTEST.md:84`: `resolvedTheme` pode divergir da classe do `<html>` se o sistema mudar com a página aberta e algo re-renderizar o provider (fora de escopo, Q5.1; sem teste, de propósito).
