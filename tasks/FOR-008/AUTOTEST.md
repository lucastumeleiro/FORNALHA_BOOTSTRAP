# AUTOTEST — FOR-008

Registro das decisões de automação (Fase 6b/7 do SDD).
Categorias: **A** unit · **B** integração leve · **C** não automatizado (coberto por teste de mesa).
As exclusões (C) são auditadas pelo Check 6 da Fase 7 (`/verify`).

Nenhum teste foi executado nesta fase (regra da fase). Os números de linha abaixo são dos arquivos recém-escritos.

## Resumo

| Categoria | CTs                                                          | Testes escritos |
| --------- | ------------------------------------------------------------ | --------------- |
| A         | — (a task não cria função pura em `src/lib/`)                | 0               |
| B         | CT-01, CT-02, CT-03, CT-04, CT-05, CT-06, CT-08, CT-09, CT-10, CT-11 | 36      |
| C         | CT-07, CT-12                                                 | —               |

Arquivos de teste: `src/components/theme-provider.test.tsx` (18), `src/components/theme-toggle.test.tsx` (10), `src/sections/site-header.test.tsx` (4), `src/main.test.tsx` (4; ligação do provider na aplicação real, adicionado no ciclo 1 do loop de correção da Fase 7, lacuna P1 do VERIFY; o caso de primeira visita com sistema claro entrou no ciclo 2, lacuna P2).

CT-01, CT-03, CT-06 e CT-08 são **B com parcela C** (a parte visual/CSS do cenário): as parcelas estão justificadas em `## Exclusões`.

**Toolchain** (fora de A/B/C, não executado aqui): `npm run typecheck` (os testes entram no `tsc -b`), `npm run build`, `npm run check:cores`.

## Classificação por CT

| CT    | Cat   | Regra aplicada                                                                                  | Destino                                                                                                                                                                                      |
| ----- | ----- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CT-01 | B (+C parcial) | tema aplicado e `localStorage` vazio são atributo/estado do DOM, com `matchMedia` na fronteira | `theme-provider.test.tsx:71-86` (classe `dark`), `:104-118` (nada gravado antes do clique), `main.test.tsx:45-56` (aplicação real: primeira visita com sistema escuro abre com `dark`; prova a ligação `<ThemeProvider defaultTheme="system">` de `src/main.tsx:9`); parcela "ícone lua" em Exclusões                                                                |
| CT-02 | B     | idem, contraprova com sistema claro                                                             | `theme-provider.test.tsx:88-102`, `main.test.tsx:58-69` (aplicação real: primeira visita com sistema claro abre com `light`, sem `dark` e sem nada gravado; prova que `defaultTheme="system"` de `src/main.tsx:9` segue o sistema)                                                                                                                                                              |
| CT-03 | B (+C parcial) | clique + classe do `<html>` + chave salva, via `user-event`                                    | `theme-toggle.test.tsx:44-75` (claro→escuro→claro→escuro), `theme-provider.test.tsx:137-162`, `main.test.tsx:71-85` (aplicação real: clique no botão do cabeçalho troca a classe do `<html>` e grava a chave); parcela "ícone muda" em Exclusões                                                            |
| CT-04 | B     | primeiro clique em `system` vai ao oposto do tema efetivo                                       | `theme-toggle.test.tsx:77-91` (sistema escuro→claro), `:93-105` (sistema claro→escuro), `:107-120` (escolha salva difere do sistema)                                                         |
| CT-05 | B     | persistência: nova montagem lê a chave; escolha explícita vence o sistema                       | `theme-provider.test.tsx:204-227` (recarrega e segue escuro), `:229-244` (salvo `light` vence sistema escuro), `:246-261` (salvo `system`), `main.test.tsx:87-98` (aplicação real: escolha salva `dark` vence o sistema claro, o que prova a `storageKey` de `src/main.tsx:9`)                                                  |
| CT-06 | B (+C parcial) | foco e acionamento por teclado são comportamento de DOM (`toHaveFocus`, `user.keyboard`)  | `theme-toggle.test.tsx:151-185` (Tab, Enter, Espaço, foco permanece), `site-header.test.tsx:39-60` (ordem Cardápio→Contato→botão), `:62-77` (Shift+Tab volta a Contato); parcelas visuais em Exclusões |
| CT-07 | C     | `teste-automatizado §Classificação A/B/C deste produto` — "layout em 375 px"                    | manual — TEST.md CT-07 (justificativa abaixo)                                                                                                                                                |
| CT-08 | B (+C parcial) | `<button>`, `aria-label` e `aria-hidden` são atributos do DOM                              | `theme-toggle.test.tsx:188-199` (button nativo + rótulo), `:201-214` (rótulo fixo após alternar), `:216-232` (dois `svg` com `aria-hidden="true"`); parcela `display: none` em Exclusões    |
| CT-09 | B     | valor inválido cai no padrão e é sobrescrito no próximo clique                                  | `theme-provider.test.tsx:264-279`, `:281-299`                                                                                                                                                |
| CT-10 | B     | `Storage.prototype` stubado para lançar (previsto no PLAN e no próprio CT-10)                   | `theme-provider.test.tsx:302-319` (leitura lança), `:321-341` (gravação lança), `theme-toggle.test.tsx:122-148` (alterna na sessão com leitura e gravação lançando)                          |
| CT-11 | B     | sistema muda sem recarregar (o `change` do `MediaQueryList` é disparado dentro de `act`): classe não muda; nova montagem abre no tema novo                   | `theme-provider.test.tsx:344-361`, `:363-385`                                                                                                                                                |
| CT-12 | C     | `teste-automatizado §Classificação A/B/C deste produto` — "cor e contraste percebidos"          | manual — TEST.md CT-12 (justificativa abaixo)                                                                                                                                                |

## Exclusões (categoria C) — justificativa auditável

### CT-07 — Cabeçalho com o botão em 375 px e em ≥ 1280 px, nos dois temas

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — categoria C: "o que só um navegador de verdade mostra", com o exemplo "layout em 375 px".

**Por que não é A nem B:** o cenário pede alinhamento do botão, ausência de rolagem horizontal e medida de 32 × 32 px. Tudo isso vem de classes Tailwind (`size-8` em `src/components/ui/button.tsx:28`; `flex items-center justify-between` e `gap-4` em `src/sections/site-header.tsx:7-9`) que só viram CSS no pipeline do Vite. O Vitest em jsdom não carrega o Tailwind nem calcula layout, então `getBoundingClientRect` devolve 0 × 0 e nenhuma largura de viewport tem efeito. Asserir a string da classe seria testar o literal do JSX (viola TA-03 e não prova a medida). Autoauditoria: dependência injetável? não, é CSS; mock de 1 nível? não existe mock que produza layout; efeito num atributo do DOM? só o nome da classe, não o resultado. O que é DOM está coberto como B: botão presente dentro do cabeçalho, depois dos links (`site-header.test.tsx:22-37` e `:39-60`).

**Cobertura substituta:** CT-07 do TEST.md (manual, 4 combinações de tema × largura).

### CT-12 — Página inteira legível no tema escuro, sem mudança de cor

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — categoria C: "cor e contraste percebidos".

**Por que não é A nem B:** a legibilidade depende dos tokens de `src/index.css:84` (bloco `.dark`) resolvidos pelo navegador, com razão de contraste ≥ 4,5:1 sobre o fundo renderizado. O jsdom não aplica o `index.css` (tokens e Tailwind), então não há cor computada para medir; um teste só poderia ler os literais do CSS, e `npm run check:cores` já guarda que cor literal só existe nesse arquivo. Autoauditoria: dependência injetável? não; mock? qualquer mock devolveria a cor que o teste definiu; atributo do DOM? nenhum, a cor não é atributo.

**Cobertura substituta:** CT-12 do TEST.md (manual, 375 px e ≥ 1280 px, nos dois temas).

### Parcelas visuais de CTs classificados B

**Ícone exibido (CT-01, CT-02, CT-03)** — **Regra:** `teste-automatizado §Classificação A/B/C deste produto` ("cor e contraste percebidos", "layout"). **Por quê:** `src/components/theme-toggle.tsx:20-21` alterna `Sun`/`Moon` só com `dark:hidden` e `hidden dark:block`; qual dos dois aparece é efeito de CSS do Tailwind sobre a classe `dark` do `<html>`, que o jsdom não aplica (`Sun` e `Moon` ficam ambos no DOM). A parte que é DOM (a classe `dark`/`light` do `<html>` que dispara a troca) está em B nos testes citados. **Substituto:** CT-01, CT-02 e CT-03 do TEST.md.

**Anel de foco visível e `Espaço` sem rolar a página (CT-06)** — **Regra:** idem ("cor e contraste percebidos"; "rolagem"). **Por quê:** o anel vem das classes `focus-visible:ring-*` de `src/components/ui/button.tsx:7`, e rolagem por `Espaço` é comportamento padrão do navegador, ausente do jsdom. Cobertos em B: o foco chega ao botão, permanece nele e `Enter`/`Espaço` alternam (`theme-toggle.test.tsx:151-185`). **Substituto:** CT-06 do TEST.md, nos dois temas.

**`display: none` do ícone oculto (CT-08)** — **Regra:** idem. **Por quê:** mesma origem de `theme-toggle.tsx:20-21`; o `display` é computado a partir do CSS do Tailwind. Cobertos em B: `button` nativo, `aria-label` fixo e `aria-hidden="true"` nos dois `svg` (`theme-toggle.test.tsx:188-232`). **Substituto:** CT-08 do TEST.md.

### Ligação do provider em `src/main.tsx:9` (lacuna P1 do VERIFY, ciclo 1)

Classificação **B**, sem exclusão. `main.tsx` só executa `createRoot(...).render(...)` no nível do módulo, então o teste monta `<div id="root">` no jsdom, simula `matchMedia` (só a consulta `(prefers-color-scheme: dark)` casa quando o sistema é escuro) e faz `await import("@/main")` com `vi.resetModules()` por caso, limpando `localStorage`, o `<html>` e o `body` entre os casos (`src/main.test.tsx`). Remover o `<ThemeProvider>` faz falhar `main.test.tsx:53`, `:66` e `:76`; trocar o `defaultTheme` de `main.tsx` para `"light"` faz falhar `main.test.tsx:53` e `:76`; para `"dark"`, `main.test.tsx:66` (caso de primeira visita com sistema claro); trocar a `storageKey` falha `:96`.

## Rastreabilidade CA → CT → asserção

| CA   | CT                          | Cat | Evidência                                                                                                                                              |
| ---- | --------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| CA-1 | CT-01, CT-02, CT-09, CT-10, CT-11 | B   | `theme-provider.test.tsx:71` (sistema escuro → `dark`; o mock só casa a consulta `(prefers-color-scheme: dark)`), `main.test.tsx:45` (idem na aplicação real), `:58` (primeira visita com sistema claro → `light` na aplicação real), `theme-provider.test.tsx:88` (sistema claro → `light`), `:104` (nada gravado), `:264` (inválido), `:302` (leitura lança), `:363` (nova montagem com sistema escuro) |
| CA-2 | CT-03, CT-04, CT-08, CT-10  | B   | `theme-toggle.test.tsx:44` (alterna e `<html>` ganha/perde `dark`), `main.test.tsx:71` (idem na aplicação real), `theme-toggle.test.tsx:77`, `:93` (oposto do efetivo), `:188-214` (rótulo e `button`), `:122` (bloqueado)   |
| CA-3 | CT-05, CT-09                | B   | `theme-provider.test.tsx:204` (continua escuro ao recarregar), `main.test.tsx:87` (aplicação real), `theme-provider.test.tsx:229` (escolha vence o sistema), `:281` (inválido é sobrescrito)                      |
| CA-4 | CT-06, CT-08                | B + C parcial | `theme-toggle.test.tsx:151` (Tab, Enter, Espaço, foco permanece), `site-header.test.tsx:39` e `:62` (ordem de foco); anel visível: manual — TEST.md CT-06 |

## Lacunas sinalizadas

Nenhum CA ficou sem CT no TEST.md.

- Testes além do TEST.md, escritos por serem regra testável sem recurso externo: `storageKey` personalizada (`theme-provider.test.tsx:164`), `defaultTheme` informado (`:120`), volta para `system` (`:182`), `useTheme`/`ThemeToggle` fora do provider sem lançar erro e sem efeito (`theme-provider.test.tsx:388`, `:397`, `theme-toggle.test.tsx:235`; protege o `App.test.tsx`, decisão Q1.1).
- Observação sem teste (fora de escopo, Q5.1): `resolvedTheme` é recalculado a cada render (`src/components/theme-provider.tsx:53`), enquanto a classe do `<html>` só é reaplicada quando `theme` muda (`:55-59`). Se o sistema mudar com a página aberta e algo re-renderizar o provider, `resolvedTheme` pode divergir da classe na tela; o cenário foi deixado de fora de propósito e não tem teste.
