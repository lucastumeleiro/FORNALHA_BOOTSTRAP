# PLAN-01 — FOR-008: tema escuro com alternância

**Identificador:** PLAN-01
**Dependências:** nenhuma (FOR-004 já entregou `src/content/header.ts`)
**Paralelizável com:** todos os demais (único PLAN da task)
**Triagem visual:** ajuste pontual — botão só com ícone entra no `<header>` que já existe, sem mudar o arranjo dos outros elementos (classificação confirmada pela pessoa após empate com _mudança estrutural_)

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-008/TASK.md

## Escopo

`ThemeProvider` (light/dark/system, classe `dark` no `<html>`, persistência em `fornalha-theme`), `ThemeToggle` com ícone no cabeçalho e o provider envolvendo a árvore em `main.tsx`.

**Um PLAN só:** cinco arquivos pequenos de um único domínio (frontend estático, sem backend); provider, toggle e ligação dependem um do outro em série e não ganhariam paralelismo se separados.

## Passos de Implementação (ordenados)

### Passo 1 — Textos em `src/content/header.ts`

**Fonte:** TASK.md §Comportamento 2 | skill `arquitetura` AR-01 e DS-06 | leitura de código (`src/content/header.ts:1-7`)

- Acrescentar a `headerContent` a chave `themeToggle` com o `aria-label` do botão, mantendo `as const` e as chaves existentes.
- Texto do rótulo: fixo, "Alternar tema" — não depende do estado e dispensa uma chave por estado (I1 da TASK).

**Fonte:** decisão da Fase 3 (Q3.1)

### Passo 2 — `ThemeProvider` em `src/components/theme-provider.tsx`

**Fonte:** TASK.md §Comportamento 1, 3, CA-1, CA-3, P1 | guia de dark mode do shadcn para Vite (padrão do provider: contexto com `theme`/`setTheme`, `storageKey`, `defaultTheme`) | skill `design-system` ("classe `dark` no `<html>`") | skill `arquitetura` AR-04 (estado local, sem estado global)

- Tipo `Theme = "light" | "dark" | "system"`.
- Props: `children`, `defaultTheme` (padrão `"system"`, para a primeira visita seguir o sistema — CA-1) e `storageKey` (padrão `"fornalha-theme"`).
- Estado inicial lido de `localStorage[storageKey]`; sem valor, usa `defaultTheme`. Valor salvo inválido (fora dos três) cai em `defaultTheme`. A leitura fica em `try/catch`: se o acesso ao `localStorage` lançar, cai em `defaultTheme`. **Fonte:** decisão da Fase 3 (Q5.2)
- Efeito sobre `document.documentElement`: remove `light` e `dark`; com `system`, aplica a classe conforme `window.matchMedia("(prefers-color-scheme: dark)")`; senão aplica o tema escolhido. O efeito roda quando `theme` muda; **não** escuta mudança do tema do sistema com a página aberta (fora de escopo). **Fonte:** decisão da Fase 3 (Q5.1)
- `resolvedTheme: "light" | "dark"` é calculado no provider (`theme` quando explícito; com `system`, conforme o `matchMedia`) e exposto no contexto. **Fonte:** decisão da Fase 3 (Q2.1)
- `setTheme` grava no `localStorage` e atualiza o estado. A gravação fica em `try/catch`: se lançar, o estado ainda é atualizado (o tema muda na sessão, sem persistir). **Fonte:** decisão da Fase 3 (Q5.2)
- Exporta também o hook `useTheme`, no mesmo arquivo do provider. O contexto é criado com valor padrão `{ theme: "system", resolvedTheme: "light", setTheme: () => {} }` e `useTheme` **não** lança fora do provider (diverge do guia do shadcn, que lança erro com contexto indefinido; a divergência é para o `App.test.tsx`, que renderiza `App` sem provider, continuar valendo). **Fonte:** decisão da Fase 3 (Q1.1)
- Sem `fetch`, sem estado global além do contexto do próprio provider (AR-04). Imports por `@/` (AR-06).

### Passo 3 — `ThemeToggle` em `src/components/theme-toggle.tsx`

**Fonte:** TASK.md §Comportamento 2, CA-2, CA-4, P1 | tokens e componentes — skill `design-system` + `src/components/ui/button.tsx` (variante `ghost`, tamanho `icon`) | padrão de ícone decorativo: `src/components/whatsapp-button.tsx:20` | texto por prop: `src/components/product-card.tsx`

- Props: `label` (string) — o texto chega por prop; o componente não importa de `src/content/` (skill `arquitetura`).
- Usa `useTheme()` do Passo 2.
- Renderiza `<Button variant="ghost" size="icon" aria-label={label}>` com `Sun` e `Moon` de `lucide-react`, `aria-hidden="true"`.
- Ícone: o do tema atual (sol no claro, lua no escuro). O arranjo é a convenção do shadcn (os dois ícones empilhados, um escondido por `dark:`); aparência só por classes de token. **Fonte:** decisão da Fase 3 (Q3.3)
- Clique: `setTheme(resolvedTheme === "dark" ? "light" : "dark")`. Com o tema em `system`, o clique vai para o oposto do tema efetivo na tela (sistema escuro → claro; sistema claro → escuro). Depois do clique a escolha fica explícita (P1). **Fonte:** decisão da Fase 3 (Q2.1, Q3.2)
- `Button` já traz foco visível (`focus-visible` com `ring`) e é `<button>` nativo: `Tab`, `Enter` e `Espaço` funcionam sem código extra (CA-4, DS-06).
- Nenhuma cor própria; não editar `src/components/ui/button.tsx` (DS-01, DS-02, DS-04).

### Passo 4 — Botão no cabeçalho em `src/sections/site-header.tsx`

**Fonte:** TASK.md §Comportamento 2 | leitura de código (`src/sections/site-header.tsx:6-22`) | skill `arquitetura` AR-01, AR-06

- Renderizar `<ThemeToggle label={headerContent.themeToggle.label} />` na barra do cabeçalho, à direita da navegação.
- Isso muda a estrutura do contêiner flex (hoje `justify-between` com dois filhos): `<nav>` e `<ThemeToggle>` ficam num `<div className="flex items-center gap-4">`, e o contêiner externo mantém `justify-between`. Mexer só no que for preciso para acomodar o botão; classes de espaçamento do sistema (`gap-*`), sem valor arbitrário. A classificação "ajuste pontual" segue confirmada pela pessoa apesar do wrapper. **Fonte:** decisão da Fase 3 (Q1.2)
- O arquivo segue abaixo de 150 linhas (AR-07).

### Passo 5 — Envolver a árvore em `src/main.tsx`

**Fonte:** TASK.md §Comportamento 1, P3 | leitura de código (`src/main.tsx:6-10`)

- Envolver `<App />` com `<ThemeProvider>` dentro do `StrictMode`, usando os padrões (`defaultTheme="system"`, `storageKey="fornalha-theme"`).

### Passo 6 — Conferir

**Fonte:** CLAUDE.md §Comandos | TASK.md CA-1 a CA-4

- `npm run typecheck`, `npm test` e `npm run check:cores`.
- `git diff --stat` lista só os arquivos da tabela abaixo.
- Não rodar `npm run dev` (regra do repositório): CA-1 a CA-4 são conferidos pela pessoa no `TEST.md`.

## Arquivos Impactados

| Arquivo                            | Operação | Justificativa                                          |
| ---------------------------------- | -------- | ------------------------------------------------------ |
| `src/components/theme-provider.tsx` | Criar    | Contexto de tema, classe `dark` no `<html>`, persistência |
| `src/components/theme-toggle.tsx`   | Criar    | Botão de ícone que alterna claro/escuro                |
| `src/content/header.ts`             | Editar   | `aria-label` do botão                                  |
| `src/sections/site-header.tsx`      | Editar   | Mostra o botão no cabeçalho                            |
| `src/main.tsx`                      | Editar   | Provider envolvendo a árvore                           |

## Contratos Exportados

- `ThemeProvider({ children, defaultTheme?, storageKey? })` — `src/components/theme-provider.tsx`
- `useTheme(): { theme, resolvedTheme, setTheme }` — `src/components/theme-provider.tsx` (`resolvedTheme: "light" | "dark"`; Q2.1)
- `type Theme = "light" | "dark" | "system"` — `src/components/theme-provider.tsx`
- `ThemeToggle({ label })` — `src/components/theme-toggle.tsx`
- `headerContent.themeToggle.label` — `src/content/header.ts`

## Convenções Aplicáveis

- Skill `arquitetura`: AR-01 (texto em `content/`), AR-04 (estado local, sem dependência nova), AR-06 (import por `@/`), AR-07 (≤ 150 linhas).
- Skill `design-system`: DS-01/DS-02 (sem cor literal nem classe de paleta), DS-04 (não editar `ui/button.tsx`), DS-06 (foco visível e `aria-label` com texto em `content/`). Tema escuro só pela classe `dark` no `<html>`, sem `prefers-color-scheme` em componente.
- Artefatos e comentários em português; identificadores em inglês.

## Pontos de Atenção

- **Nenhuma cor muda** (TASK P2): se algum elemento ficar ilegível no escuro, é defeito de token em `src/index.css`, fora do escopo; registrar no `MEMORY.md` em vez de corrigir aqui.
- **Piscar do tema no carregamento está fora de escopo** (TASK): não adicionar script inline no `index.html`.
- **Menu com a opção "sistema" está fora de escopo**: o botão só alterna claro/escuro.
- `src/test/setup.ts` já define `window.matchMedia` com `matches: false`, então `App.test.tsx` (que renderiza `App` sem provider) continua valendo. O `useTheme` usado fora do provider cai no contexto padrão (`setTheme` no-op) em vez de lançar erro, senão o teste atual quebra (Q1.1).
- **Mudança do tema do sistema com a página aberta está fora de escopo:** quem está em `system` vê o tema novo ao recarregar (Q5.1).
- **`localStorage` pode lançar** (dados de site bloqueados): leitura e gravação em `try/catch`; candidato a teste da Fase 6b, com `Storage.prototype` stubado para lançar e a página renderizando no tema padrão (Q5.2).
- Candidatos a teste para a Fase 6b: CA-2 e CA-3 renderizando o provider com o toggle (`localStorage` limpo a cada teste, `document.documentElement.classList`); CA-1 com `matchMedia` stubado para `matches: true` (categoria B). CA-4 é de teste de mesa (foco visível).
- Vitest roda em jsdom com `localStorage` real; limpar a chave `fornalha-theme` em `afterEach` para os testes não vazarem estado.

## Premissas e Incertezas

### Premissas

1. O provider aceita `system`, mas o botão só alterna claro/escuro (TASK P1).
2. Os tokens `.dark` de `src/index.css` bastam (TASK P2).
3. O `ThemeProvider` envolve a árvore em `main.tsx` (TASK P3).
4. O padrão do provider segue o guia de dark mode do shadcn para Vite, citado pela TASK, com duas divergências deliberadas: `useTheme` não lança fora do provider e o contexto expõe `resolvedTheme` (Q1.1, Q2.1). O guia não está no repositório; a estrutura acima vem do conhecimento dele, não de código existente.
5. `defaultTheme` do provider é `"system"`: é o que faz a primeira visita seguir o sistema (CA-1). A TASK não nomeia o padrão; é derivado do Comportamento 3.
6. `lucide-react` já está nas dependências (`Sun`, `Moon` existem nele); nenhuma dependência nova.
7. Botão com `variant="ghost" size="icon"` é escolha deste PLAN (a TASK só pede "botão só com ícone"); `size="icon"` mede `size-8`, o que fica a confirmar no TEST.md contra o alvo de toque.

### Incertezas

Nenhuma aberta. Fechadas na Fase 3:

1. **I1 da TASK** — `aria-label` fixo "Alternar tema" (Q3.1).
2. **I2 da TASK** — primeiro clique em `system` vai para o oposto do tema efetivo (Q3.2).
3. Onde mora `useTheme` — no mesmo arquivo do provider (Q1.1).
4. Ícone do botão — o do tema atual: sol no claro, lua no escuro (Q3.3).
