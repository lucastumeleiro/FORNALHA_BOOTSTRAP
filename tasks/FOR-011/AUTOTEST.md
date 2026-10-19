# AUTOTEST — FOR-011

Registro das decisões de automação (Fase 6b/7 do SDD).
Categorias: **A** unit · **B** integração leve · **C** não automatizado (coberto por teste de mesa).
As exclusões (C) são auditadas pelo Check 6 da Fase 7 (`/verify`).

Arquivo de teste: `src/sections/site-footer.test.tsx` (12 testes, ao lado de `src/sections/site-footer.tsx`). Nenhum código de produção foi alterado nesta fase. Os testes **não foram executados** (regra da fase); comando sugerido no fim.

## Resumo

| Categoria | CTs                                                            | Testes escritos |
| --------- | -------------------------------------------------------------- | --------------- |
| A         | — (a task não criou função pura; `src/lib/whatsapp.ts` é da FOR-005 e entra só via B) | 0  |
| B         | CT-01, CT-02, CT-03, CT-04, CT-07, CT-08, CT-09, CT-10, CT-13, CT-14, CT-15 | 12 |
| C         | CT-05, CT-06, CT-11, CT-12 (e a parte visual de CT-04, CT-10, CT-13) | —  |
| Toolchain | typecheck, build, check:cores (fora de A/B/C)                  | —               |

Dos 12 testes, 5 já existiam (Fase 4/5) e foram mantidos ou fortalecidos; 7 são novos nesta fase (mensagem codificada do WhatsApp, ordem Instagram → WhatsApp, `""` e `"xxx"` como número, só texto sem ícone, ordem do Tab, segundo ano no teste do relógio, `id` único).

## Classificação por CT

| CT    | Cat           | Regra aplicada                                                                 | Destino                                                                                         |
| ----- | ------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| CT-01 | B             | componente renderizado em jsdom, relógio simulado (`teste-automatizado §Quando mockar`) | `site-footer.test.tsx:13-28` (2 testes: 2027 e 2031, sem "2025")                        |
| CT-02 | B             | idem; é o cenário literal do CA-1                                              | `site-footer.test.tsx:13-28` (caso 2027)                                                        |
| CT-03 | B             | `VITE_WHATSAPP_NUMBER` vazio via `vi.stubEnv`; contagem de `link` e `listitem` | `site-footer.test.tsx:30-45` e `:47-72`                                                         |
| CT-04 | B (+ C parcial) | `href`, `target`, `rel`, nome acessível e ausência de `<svg>` são atributos do DOM; a cor no hover é C | `site-footer.test.tsx:130-160`, `:162-181`; hover em §Exclusões                |
| CT-05 | C             | contraste percebido no tema escuro                                             | manual — TEST.md CT-05                                                                          |
| CT-06 | C             | layout em 375 px                                                               | manual — TEST.md CT-06                                                                          |
| CT-07 | B             | dois `listitem`, ordem Instagram → WhatsApp                                    | `site-footer.test.tsx:108-128`                                                                  |
| CT-08 | B (+ C parcial) | URL exata com mensagem codificada, atributos e nome acessível; abrir o WhatsApp de verdade é externo | `site-footer.test.tsx:91-106`, `:130-160`; clique real em §Exclusões |
| CT-09 | B             | nome acessível ↔ `href` de cada link, sem troca                                | `site-footer.test.tsx:130-160` (laço de pares `{name, href}`)                                   |
| CT-10 | B (+ C parcial) | ordem de foco com `user-event`; o anel de foco desenhado é C                 | `site-footer.test.tsx:183-206`; anel em §Exclusões                                              |
| CT-11 | C             | contraste e anel de foco percebidos no tema escuro                             | manual — TEST.md CT-11                                                                          |
| CT-12 | C             | layout em 375 px nos dois temas, sem rolagem horizontal                        | manual — TEST.md CT-12                                                                          |
| CT-13 | B (+ C parcial) | `id="contato"` presente e único; a rolagem até a âncora é C                  | `site-footer.test.tsx:208-219`; rolagem em §Exclusões                                           |
| CT-14 | B             | número com máscara vira só dígitos na URL                                      | `site-footer.test.tsx:74-89`                                                                    |
| CT-15 | B             | número `""` e `"xxx"` esconde o WhatsApp, sem `wa.me` no DOM                   | `site-footer.test.tsx:47-72` (2 casos)                                                          |

### Toolchain (registrado à parte, não é A/B/C)

| Verificação           | O que cobre                                                   |
| --------------------- | ------------------------------------------------------------- |
| `npm run typecheck`   | `footerContent` mudou de forma; consumidor e teste compilam   |
| `npm run build`       | `tsc -b && vite build`                                        |
| `npm run check:cores` | DS-01/DS-02: sem cor literal nem paleta de fábrica no rodapé  |

## Exclusões (categoria C) — justificativa auditável

**Autoauditoria feita em todos os C.** Dependência injetável? Não: o que se mede é o resultado do CSS, e não existe nada a injetar. Mock de 1 nível resolveria? Não: o jsdom não calcula cor nem layout, então qualquer mock devolveria o que ele mesmo definiu. Setup < 30 linhas? Não há setup que faça o jsdom calcular contraste ou posição. Efeito aparece num atributo do DOM? A única coisa no DOM é a string de `class` (`site-footer.tsx:5`), e afirmar sobre ela é seletor de classe, vetado por TA-03, e não prova contraste nem layout. Os pedaços que aparecem em atributo (`href`, `target`, `rel`, `aria-label`, `id`) viraram B acima.

### CT-05 — Tema escuro, sem `.env`

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — "C — não automatizar: o que só um navegador de verdade mostra: cor e contraste percebidos".

**Por que não é A nem B:** o contraste de endereço, link e copyright depende de `--muted-foreground` e `--foreground` sob `.dark` (`src/index.css:86`, `:96`), resolvidos pelo navegador a partir de `text-muted-foreground` e `hover:text-foreground` (`src/sections/site-footer.tsx:5,15`). O vitest em jsdom não resolve essas variáveis nem calcula razão de contraste; o único teste possível seria afirmar a string da classe, o que testa o nome do token e não o resultado.

**Cobertura substituta:** CT-05 do TEST.md (manual, com leitura da razão de contraste no DevTools).

### CT-06 — Largura 375 px, sem `.env`

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — "C — não automatizar: … layout em 375 px".

**Por que não é A nem B:** o arranjo em coluna, o recuo `px-4` e a ausência de rolagem horizontal vêm de `mx-auto max-w-5xl px-4` e `flex flex-wrap gap-4` (`src/sections/site-footer.tsx:15,17`), que só um motor de layout avalia. O jsdom não tem layout (largura e altura são 0), então não há como afirmar "nada cortado" nem "sem barra horizontal".

**Cobertura substituta:** CT-06 do TEST.md (manual, em 375 px).

### CT-11 — Tema escuro, com `.env`

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — "C — não automatizar: … cor e contraste percebidos".

**Por que não é A nem B:** o que se verifica é contraste ≥ 4,5:1 dos dois links, o anel de foco visível contra o fundo escuro e o clareamento no hover. Tudo vem de `--ring` e `--foreground` em `.dark` (`src/index.css:86`, `:102`) combinados com `focus-visible:ring-[3px] focus-visible:ring-ring/50` e `hover:text-foreground` (`src/sections/site-footer.tsx:5`). Pseudo-classes `:hover` e `:focus-visible` com variáveis de tema não são avaliadas pelo jsdom. A parte de "o link recebe foco" é B e está em `site-footer.test.tsx:183-206`.

**Cobertura substituta:** CT-11 do TEST.md (manual).

### CT-12 — Largura 375 px, com `.env`

**Regra aplicada:** `teste-automatizado §Classificação A/B/C deste produto` — "C — não automatizar: … layout em 375 px".

**Por que não é A nem B:** a quebra dos dois links numa segunda linha sem corte depende de `flex-wrap gap-4` (`src/sections/site-footer.tsx:17`) e da largura real da viewport; o jsdom não calcula largura. Que os dois links existem e são clicáveis (`href`, `target`) já é B (`site-footer.test.tsx:108-128`, `:130-160`).

**Cobertura substituta:** CT-12 do TEST.md (manual, nos dois temas).

### Partes C dos CTs classificados como B

- **CT-04, cor no hover (`muted-foreground` → `foreground`):** mesma regra e mesmo motivo de CT-05 (`site-footer.tsx:5`; `src/index.css:61`, `:51`). Cobertura substituta: CT-04 do TEST.md, último item do resultado esperado.
- **CT-08, o clique abre o WhatsApp de verdade com a mensagem preenchida:** destino externo (wa.me), fora do alcance do jsdom; o que é do código — URL exata, `target="_blank"`, `rel` — é B em `site-footer.test.tsx:91-106` e `:130-160`. Cobertura substituta: CT-08 do TEST.md.
- **CT-10, anel de foco de 3 px desenhado e sem corte:** `focus-visible:ring-[3px] focus-visible:ring-ring/50` (`site-footer.tsx:5`) é CSS avaliado só no navegador; a ordem do Tab é B em `site-footer.test.tsx:183-206`. Cobertura substituta: CT-10 do TEST.md.
- **CT-13, a página rola até o rodapé:** `scrollIntoView` e a rolagem por âncora não existem de verdade no jsdom (`teste-automatizado §Armadilhas do jsdom`); o `id="contato"` único está em B (`site-footer.tsx:14`; `site-footer.test.tsx:208-219`). Cobertura substituta: CT-13 do TEST.md, passo 2.

## Rastreabilidade CA → CT → asserção

| CA   | CT                          | Cat | Evidência                                                                                                                    |
| ---- | --------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------- |
| CA-1 | CT-01, CT-02                | B   | `site-footer.test.tsx:13-28` — relógio em 2027 e em 2031 mostra `© {ano} Fornalha`; sem "2025"                              |
| CA-2 | CT-03, CT-14, CT-15, CT-07  | B   | `:30-45` (1 link, 1 `listitem` sem número); `:47-72` (`""` e `"xxx"`, sem `wa.me`); `:74-89` (máscara vira dígitos); `:108-128` (com número, 2 itens, ordem) |
| CA-2 | CT-05, CT-06                | C   | manual — TEST.md CT-05, CT-06 (aparência do cenário sem número)                                                              |
| CA-3 | CT-04, CT-08, CT-09, CT-10  | B   | `:130-160` — por link: `getByRole("link", { name })`, `toHaveAccessibleName(name)`, `href`, `target="_blank"`, `rel="noopener noreferrer"`; `:183-206` — ordem do Tab |
| CA-3 | CT-04, CT-10, CT-11         | C   | manual — hover, anel de foco e contraste (TEST.md CT-04, CT-10, CT-11)                                                       |
| Comp. Esperado 3 (`id="contato"`) | CT-13          | B   | `site-footer.test.tsx:208-219` — `contentinfo` com `id="contato"`, um só no documento                                        |

## Lacunas sinalizadas

Nenhum CA testável sem recurso externo ficou sem CT no TEST.md.

Limites conhecidos de asserção (não são lacunas de CA):

- O CT-01 pede "sem espaço duplo" na linha de copyright. `getByText` normaliza espaços por padrão (`site-footer.test.tsx:23`), então um espaço duplo passaria no teste. Fica com o CT-01 manual. A composição `` `${symbol} ${year} ${brand}` `` (`site-footer.tsx:43`) é um nó de texto único, o que reduz o risco.
- O teste de mensagem do WhatsApp (`:91-106`) confere a mensagem do rodapé contra `src/content/footer.ts`, não contra a do hero; "não é a mensagem do hero" é consequência de a URL levar exatamente `footerContent.social.whatsapp.message`.
- `src/lib/whatsapp.ts` não ganhou teste unitário próprio: pertence à FOR-005 e está fora dos "Arquivos Impactados" do PLAN-01. É exercida pelos testes do rodapé (máscara, `""`, `"xxx"`, codificação).
