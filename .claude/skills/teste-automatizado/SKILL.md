---
name: teste-automatizado
description: Padrão de teste automatizado da Fornalha — Vitest + Testing Library em jsdom, teste ao lado do código, nomes em português e a classificação A/B/C deste produto. Consumida por sdd-autotest (Fase 6b) e pelo Check 6 do sdd-verify (Fase 7).
---

# Teste automatizado — Fornalha

Runner: Vitest (`npm test`), ambiente `jsdom`, setup em `src/test/setup.ts` (jest-dom e polyfills). Componentes: `@testing-library/react` + `@testing-library/user-event`.

## Convenções

- O arquivo de teste fica ao lado do código: `src/lib/format-price.test.ts`, `src/sections/faq-section.test.tsx`.
- `describe` com o nome da unidade; `it("deve … quando …")` em português.
- AAA, com `// Arrange`, `// Act` e `// Assert` quando o teste não for óbvio.
- A consulta é por papel e rótulo (`getByRole`, `getByLabelText`). O texto esperado se importa de `src/content/`, em vez de repetir a string no teste.
- Sem snapshot.

## Classificação A/B/C deste produto

> Seção citável: `teste-automatizado §Classificação A/B/C deste produto`. Uma exclusão C cita esta seção; não a parafraseia.

| Categoria               | Neste produto                                              | Exemplos                                                                                                           |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **A — unit**            | função pura de `src/lib/`                                  | formatar preço em BRL, filtrar produtos, validar telefone, montar URL do WhatsApp                                  |
| **B — integração leve** | componente ou seção renderizado em jsdom, com `user-event` | abrir item do FAQ, filtrar o cardápio, alternar o tema (classe `dark` + `localStorage`), enviar o formulário vazio |
| **C — não automatizar** | o que só um navegador de verdade mostra                    | cor e contraste percebidos, fonte carregada, layout em 375 px, rolagem até a âncora, o Vite lendo o `.env` real    |
| **Toolchain**           | fica fora de A/B/C, registrado à parte no `AUTOTEST.md`    | "compila", "sem cor literal": `npm run typecheck`, `npm run build`, `npm run check:cores`                          |

**Autoauditoria antes de fechar um C:** o efeito aparece num atributo do DOM (`class`, `aria-*`, `href`, `id`, texto)? Se sim, é B. Exemplo: "clicar em Cardápio rola até a seção" é C na rolagem, mas `href="#cardapio"` somado a um elemento com `id="cardapio"` é B.

## Quando mockar

- `import.meta.env`: `vi.stubEnv("VITE_WHATSAPP_NUMBER", "…")` e `vi.unstubAllEnvs()` no `afterEach`. Nunca o `.env` real.
- Relógio: `vi.useFakeTimers()` + `vi.setSystemTime(...)`.
- `localStorage` e `matchMedia`: os do jsdom e do setup, limpos no `afterEach`.
- Nunca mocke a unidade sob teste nem `src/content/`.

## Armadilhas do jsdom

- `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` separa `R$` do número com espaço não separável (U+00A0). Compare com o próprio `Intl` ou normalize, nunca com `"R$ 12,50"` digitado.
- `matchMedia`, `ResizeObserver` e `scrollIntoView` não existem no jsdom. O setup os fornece; não repita o polyfill no teste.
- O Radix não renderiza conteúdo fechado. Asserte depois da interação.

## Regras verificáveis

### TA-01 — Teste ao lado do código

**Bloqueia:** sim
**Verificação:** julgamento

### TA-02 — Nome em português, no formato "deve … quando …"

**Bloqueia:** sim
**Verificação:** julgamento

### TA-03 — Consulta por papel ou rótulo; sem seletor de classe e sem snapshot

**Bloqueia:** sim
**Verificação:** julgamento

### TA-04 — Toda exclusão C cita `§Classificação A/B/C deste produto`

**Bloqueia:** sim
**Verificação:** julgamento

### TA-05 — Mock só na fronteira (ambiente, relógio, APIs do navegador), nunca na unidade sob teste

**Bloqueia:** sim
**Verificação:** julgamento
