# Fornalha — repositório de teste do Uno SDD

> **Para quem é este arquivo:** o agente de IA que vai montar este repositório do zero (§0–§7) e a pessoa que vai pilotar os testes do Uno SDD depois (§8–§9).
>
> **Como usar:** coloque este arquivo na raiz do repositório novo (vazio, com o remoto `origin` já criado no GitHub) e peça ao agente: _"Leia `FORNALHA-BOOTSTRAP.md` e execute o bootstrap de ponta a ponta."_ Depois do bootstrap o arquivo pode ser apagado: o que continua valendo foi copiado para `CLAUDE.md`, `tasks/` e `docs/roteiro-de-teste.md`.

---

## 0. Regras do bootstrap (para o agente)

1. **Você não commita, não faz push e não cria branch.** Ao terminar, entregue à pessoa a lista de comandos (§7). Isso vale para sempre neste repositório: quem commita é a pessoa.
2. **Português em tudo que a pessoa lê** (artefato SDD, doc, skill, comentário, texto de UI, mensagem de erro); **inglês em todo identificador** (arquivo, função, variável, tipo, campo, variável de ambiente).
3. **A fonte do fluxo SDD é `F:\Unobject\sdd\.claude\`** e ela é só leitura. Nunca escreva lá. **Nunca copie `F:\Unobject\sdd\.claude\uno\`**: é o estado local do daemon daquela máquina, com token.
4. **Os três bugs de §3.5 são plantados de propósito.** Não os corrija, não os "melhore" e não os comente no código.
5. **Não rode `npm run dev`.** Para provar que o scaffold funciona bastam `typecheck`, `test`, `build` e `check:cores`.
6. **Pequeno é requisito.** Se algo aqui parecer pedir mais código do que o descrito, faça o mínimo e registre a dúvida no relatório (§7). Não expanda.
7. **Ordem:** §2 (conferir) → §3 (app) → §4 (`.claude`) → §5 (tasks) → §6 (conferência) → §7 (relatório).

---

## 1. O que é e por que é assim

Repositório **descartável** para testar o Uno SDD de ponta a ponta: worktree por task, fases SDD disparadas pelo app, agentes, terminal embutido, handoff para o VS Code e board. A condição é que as tasks **fechem em minutos, não em horas**.

O produto é fictício: **Fornalha**, uma padaria de fermentação natural. O site tem uma página só (SPA em React), sem backend, sem roteador e sem banco. O cardápio e os textos são arquivos `.ts`, e o formulário de encomenda só confirma na tela.

Três decisões de desenho, todas para ganhar velocidade:

- **Uma task, um PLAN.** Dois só com o motivo escrito no PLAN. Uma task que pede três está mal cortada.
- **Skills de domínio curtas.** Cada regra verificável é uma linha que as Fases 5 e 7 auditam, então uma regra a mais custa minutos em toda task.
- **O `TASK.md` já nasce detalhado.** A exceção é FOR-004, um relato cru de propósito, para exercitar o `/spec`. Por isso a fase `spec` nasce pulada, como manda o catálogo default.

**Orçamento de tempo:** nenhuma fase de uma task daqui deveria passar de **~10 min de relógio**, e a task inteira, do `/plan` ao `/verify` e contando os gates, deveria caber em **~1 h**. Se passar disso, registre como achado sobre o Uno SDD (§9), não sobre a task.

---

## 2. Pré-requisitos da máquina

A pessoa resolve estes itens. O agente **só roda os probes e relata**: não instala nada e não muda configuração global.

| #   | Item                       | Probe                                                         | Esperado                   | Se falhar                                                                                                                             |
| --- | -------------------------- | ------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Node ≥ 24                  | `node --version`                                              | `v24.x` ou maior           | instalar Node 24 LTS                                                                                                                  |
| 2   | Repositório com remoto     | `git remote get-url origin` · `git branch --show-current`     | uma URL · `main`           | `git remote add origin <url>` · `git branch -M main`                                                                                  |
| 3   | `core.longpaths` (Windows) | `git config --get core.longpaths`                             | `true`                     | `git config --global core.longpaths true`. **Na máquina de origem ainda não está ligado**, e o `worktree doctor` reprova sem ele |
| 4   | Identidade Git             | `git config user.email`                                       | o e-mail corporativo       | `git config --global user.email <e-mail>`. É ele que vira o `author` do `SUMARIO.md`                                                  |
| 5   | `claude` standalone        | `claude --version`, num terminal **fora** do VS Code          | uma versão                 | instalar o CLI; a extensão do VS Code não conta                                                                                       |
| 6   | CLI `worktree`             | `worktree --help`                                             | a ajuda, em português      | ver abaixo                                                                                                                            |
| 7   | `gh` (opcional)            | `gh --version`                                                | uma versão, ou ausência    | sem `gh` a coluna de PR do board não aparece. É ausência esperada, não defeito                                                        |
| 8   | App Uno SDD                | aberto uma vez                                                | janela do app              | releases do repositório do Uno SDD                                                                                                    |

**O CLI `worktree` não vem no instalador do app.** Na máquina que tem o Uno SDD clonado:

```powershell
cd F:\Unobject\sdd
npm run build
cd packages\worktree
npm link        # põe o binário `worktree` no PATH
```

Se preferir não usar `npm link`, um atalho no perfil do PowerShell serve:
`function worktree { node F:\Unobject\sdd\packages\worktree\dist\bin\bin.js @args }`.

---

## 3. O app Fornalha

### 3.1 Stack

- **Vite + React + TypeScript** (template `react-ts`) com **npm**. O `package-lock.json` é o que permite ao `worktree new` compartilhar `node_modules` por hardlink.
- **Tailwind CSS v4**, pelo plugin `@tailwindcss/vite`.
- **shadcn/ui** pelo CLI `shadcn@latest`, com estilo e cor base default (`neutral`), variáveis CSS ligadas e ícones `lucide-react`.
- **Vitest + Testing Library** (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`) + `jsdom`.
- **Sem ESLint.** Remova o que o template do Vite traz: as dependências, o `eslint.config.js` e o script `lint`. **Sem Prettier obrigatório.** Os portões são `typecheck`, `test`, `build` e `check:cores`.
- Sem roteador, sem biblioteca de estado e sem `fetch`.

Siga a documentação **atual** do shadcn para Vite: Tailwind v4 pelo plugin, alias `@/*` em `tsconfig.json` + `tsconfig.app.json` + `vite.config.ts`, e depois `npx shadcn@latest init`. As versões mudam; este arquivo fixa o **resultado**, não os comandos exatos.

No bootstrap entram **só** estes primitivos: `npx shadcn@latest add button card badge`. Os outros (accordion, sheet, input, label, textarea) entram pelas tasks, de propósito.

> **Sobre o lockfile:** se a versão atual do shadcn usar o pacote unificado `radix-ui`, adicionar um primitivo pode **não** mudar o `package-lock.json`. A task que muda o lockfile com certeza é a FOR-009 (fonte). Relate no §7 qual dos dois casos aconteceu.

O Vitest fica configurado dentro do `vite.config.ts` (`test.environment: "jsdom"`, `test.setupFiles: ["./src/test/setup.ts"]`) e herda o alias `@/`. Os `*.test.tsx` **entram no `typecheck`**.

### 3.2 Scripts do `package.json`

```json
{
  "scripts": {
    "dev": "vite --port 5173 --strictPort",
    "build": "tsc -b && vite build",
    "preview": "vite preview --port 4173 --strictPort",
    "typecheck": "tsc -b",
    "test": "vitest run",
    "check:cores": "node scripts/check-colors.mjs"
  }
}
```

O `--strictPort` é deliberado: uma segunda aplicação no ar **falha** em vez de subir sem aviso na porta 5174. É o limite de "1 task com a aplicação no ar" virando trava física.

### 3.3 Mapa de arquivos

```
index.html                       # lang="en" e title do template: bug plantado nº 3 (§3.5)
.env.example                     # VITE_WHATSAPP_NUMBER=   (versionado, sem valor)
uno.config.json                  # §3.6
components.json                  # gerado pelo shadcn
scripts/check-colors.mjs         # §3.7
tasks/EPIC.md                    # §5.1
tasks/FOR-001 … FOR-017/TASK.md  # §5
src/
  main.tsx
  App.tsx                        # só compõe as seções, na ordem da página
  index.css                      # Tailwind + tokens do shadcn (:root e .dark); único lugar com cor literal
  lib/utils.ts                   # cn(), gerado pelo shadcn
  components/ui/                 # primitivos do shadcn, gerados pelo CLI
  components/product-card.tsx    # um produto: nome, selo da categoria, descrição, preço
  sections/site-header.tsx       # <header>: marca + <nav> com âncoras
  sections/hero.tsx              # h1, subtítulo, CTA (Button asChild com <a>)
  sections/products-section.tsx  # "Cardápio": grade de ProductCard, id="cardapio"
  sections/site-footer.tsx       # <footer id="contato">: endereço + ©
  content/header.ts              # textos e itens de navegação do cabeçalho
  content/hero.ts
  content/products-section.ts    # título, subtítulo e rótulos das categorias
  content/footer.ts
  data/products.ts               # os seis produtos e seus tipos
  test/setup.ts                  # jest-dom + polyfills do jsdom: matchMedia, ResizeObserver, scrollIntoView
  App.test.tsx                   # fumaça: a página renderiza o h1 do hero
```

Layout mínimo: um contêiner `mx-auto max-w-5xl px-4`; grade do cardápio `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`; cada produto num `Card`, com a categoria num `Badge` de variante `secondary`; o CTA do hero é um `Button` primário. Use só classes semânticas do tema (DS-02).

O teste de fumaça consulta o título **pelo conteúdo importado**, e não pela string repetida no teste. Assim ele continua passando quando FOR-002 reescrever o texto:

```tsx
render(<App />);
expect(screen.getByRole("heading", { level: 1, name: heroContent.title })).toBeInTheDocument();
```

### 3.4 Conteúdo inicial

Os textos iniciais são **genéricos de propósito**, para as tasks de copy terem o que melhorar.

```ts
// src/data/products.ts
export type ProductCategory = "breads" | "sweets" | "drinks";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
};
```

| `id`            | `name`                     | `price` | `category` |
| --------------- | -------------------------- | ------- | ---------- |
| `sourdough`     | Pão de fermentação natural | `28`    | `breads`   |
| `rye`           | Pão de centeio             | `32`    | `breads`   |
| `focaccia`      | Focaccia de alecrim        | `24.5`  | `breads`   |
| `croissant`     | Croissant de manteiga      | `12.5`  | `sweets`   |
| `orange-cake`   | Bolo de laranja (fatia)    | `9.9`   | `sweets`   |
| `filter-coffee` | Café coado                 | `7`     | `drinks`   |

A `description` de todos é `"Descrição em breve."`.

| Arquivo                       | Conteúdo                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `content/header.ts`           | `brand: "Fornalha"`; `navItems`: `{ label: "Cardápio", href: "#produtos" }` (bug nº 2), `{ label: "Contato", href: "#contato" }` |
| `content/hero.ts`             | `title: "Bem-vindo à Fornalha"`, `subtitle: "Pães artesanais feitos com carinho."`, `cta: { label: "Saiba mais", href: "#cardapio" }` |
| `content/products-section.ts` | `title: "Cardápio"`, `subtitle: "Conheça nossos produtos."`, `categoryLabels: { breads: "Pães", sweets: "Doces", drinks: "Bebidas" }` |
| `content/footer.ts`           | `address: "Rua do Forno, 120 — Centro"`, `copyright: "© 2025 Fornalha"`                                                          |

Cada arquivo de conteúdo exporta um objeto `as const` com nome em inglês (`headerContent`, `heroContent`, `productsSectionContent`, `footerContent`).

### 3.5 Bugs plantados (não corrigir)

| #   | Onde                                | O que                                                                                   | Quem corrige             |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| 1   | `src/components/product-card.tsx`   | o preço é `` `R$ ${product.price.toFixed(2)}` `` e sai `R$ 12.50`, `R$ 28.00`            | FOR-003                  |
| 2   | `src/content/header.ts`             | "Cardápio" aponta para `#produtos`, mas a seção é `id="cardapio"`: o clique não faz nada | FOR-004 (relato cru)     |
| 3   | `index.html`                        | `lang="en"` e o `<title>` do template (ex.: "Vite + React + TS")                         | FOR-017                  |

### 3.6 `uno.config.json`

```json
{ "version": 1, "baseBranch": "main" }
```

O único valor que foge do default é `baseBranch`, porque o default é `develop`. O resto fica no default: `branchPrefix` `feature/`, `tasksDir` `tasks`, `worktreesDir` `.claude/worktrees`, `envPaths` `[".env"]`, `nodeModulesStrategy` `hardlink`. **Sem `phaseCatalog`**, o repositório roda as oito fases do default; o §8 tem um cenário que muda isso pelo app.

### 3.7 `scripts/check-colors.mjs`

É o verificador determinístico das regras DS-01 e DS-02, e é ele que a Etapa 5.0 da revisão roda. Node puro, ESM, sem dependência e com menos de 70 linhas.

- **Varre** `src/**/*.{ts,tsx,css}`.
- **Ignora** `src/index.css` (é a folha de tokens) e `src/components/ui/**` (é gerado pelo CLI; a DS-04 cobre). Na regra de hex, ignora também `src/content/**` e `src/data/**`, porque uma âncora como `#cafe` não é cor.
- **Reprova, por linha:**
  1. hex — `/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/`
  2. função de cor — `/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/`
  3. paleta de fábrica — `/\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to|decoration|divide|shadow|accent|caret|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/` e `/\b(?:bg|text|border|ring|fill|stroke)-(?:black|white)\b/`
  4. valor arbitrário de cor — `/-\[(?:#|rgb|hsl|oklch|color:)/`
- **Saída:** uma linha por violação, `arquivo:linha — DS-0N — trecho`, ordenada por arquivo e linha. No fim, `check:cores: N violações`. Sai com código `1` se `N > 0` e `0` caso contrário.

### 3.8 `.gitignore`, `.claudeignore` e `.env`

Mescle o `.gitignore` do template com:

```text
node_modules/
dist/
coverage/
*.tsbuildinfo
.env
.env.*
!.env.example
tasks/**/.review-scratch/
tasks/**/SUMARIO.md.lock
tasks/**/SUMARIO.md.*.tmp
```

Crie o `.claudeignore`:

```text
node_modules/
dist/
coverage/
package-lock.json
.env
.env.*
```

**Não acrescente `.claude/worktrees/` nem `.claude/uno/` a nenhum dos dois.** Quem instala essas duas linhas é o app (§4.6), e isso é um dos testes.

O `.env` **nunca** é versionado. Se ele entrasse no Git, o `worktree new` recusaria a branch. O `.env.example` é versionado e tem `VITE_WHATSAPP_NUMBER=`, sem valor.

### 3.9 `CLAUDE.md` (texto integral)

````markdown
# CLAUDE.md — Fornalha

Site de uma página da Fornalha, padaria fictícia. É um **repositório de teste do Uno SDD**: as tasks existem para exercitar o fluxo e são pequenas de propósito.

## Comandos

| Script                | O que faz                                                                         |
| --------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`         | só a pessoa roda; porta 5173 fixa (`--strictPort`)                                |
| `npm run build`       | `tsc -b && vite build`                                                            |
| `npm test`            | Vitest em jsdom                                                                   |
| `npm run typecheck`   | `tsc -b`, com os testes incluídos                                                 |
| `npm run check:cores` | DS-01/DS-02: cor literal e paleta de fábrica fora de `src/index.css`              |

**Sem lint.** Nunca adicionar ESLint nem Biome.

## Onde fica o quê

| Caminho                | O que é                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `src/sections/`        | uma seção da página por arquivo                                      |
| `src/content/`         | todo texto visível, um arquivo por seção                             |
| `src/data/products.ts` | o cardápio                                                           |
| `src/components/`      | componentes da casa; `components/ui/` são os primitivos do shadcn    |
| `src/lib/`             | funções puras: formatar, filtrar, validar, montar URL                |
| `src/index.css`        | tokens de cor dos dois temas, único lugar com cor literal            |
| `tasks/`               | `EPIC.md` + uma pasta por task (`FOR-NNN/TASK.md`)                   |
| `.claude/`             | fluxo SDD importado do Uno SDD + as skills deste repositório         |

## Regras críticas

- Artefato em português, identificador em inglês.
- **Uma task, um PLAN.** Dois com o motivo escrito; três ou mais, parar e perguntar. Nenhuma fase deveria passar de ~10 min; se passar, avisar a pessoa.
- **Nenhum agente commita, faz push ou cria branch.** Worktree e branch são criados pela pessoa com `worktree new`.
- **Nenhum agente roda `npm run dev`.** Executar o `TEST.md` é da pessoa.
- Nenhum agente edita `SUMARIO.md` à mão nem pula fase por conta própria.
- `.env` nunca é versionado; `.env.example` sim.

Skills de domínio: `arquitetura` (onde o código mora), `design-system` (cor, token, componente), `teste-automatizado`, `teste-de-mesa`. Fluxo: skill `sdd`.
````

---

## 4. Migrar o `.claude`

### 4.1 O que acontece com cada arquivo

A origem é `F:\Unobject\sdd\.claude\`.

| Origem                                                                                                                    | Ação                                                             | Por quê                                                     |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `commands/*.md` (os 8)                                                                                                    | copiar; ajustar `feature.md`, `review-feature.md` e `verify.md` (§4.2) | genéricos, exceto três menções                         |
| `skills/sdd-spec/`, `sdd-question/`, `sdd-test-plan/`, `sdd-autotest/`                                                    | copiar sem mudança                                               | genéricas: dizem "skill do projeto, se existir"             |
| `skills/task-analyst/`, com `references/`                                                                                 | copiar; preencher "Convenções do projeto" (§4.2)                 | genérica                                                    |
| `skills/sdd/SKILL.md`                                                                                                     | copiar e ajustar (§4.2)                                          | cita o Uno SDD e links relativos para `docs/`               |
| `skills/sdd-plan/SKILL.md`                                                                                                | copiar e acrescentar a regra de um PLAN (§4.2)                   | é a maior alavanca de velocidade                            |
| `skills/sdd-feature/SKILL.md`                                                                                             | copiar e trocar a tabela da Etapa 2 (§4.2)                       | não há backend                                              |
| `skills/sdd-verify/SKILL.md`                                                                                              | copiar e trocar o link de `docs/` (§4.2)                         |                                                             |
| `agents/reviewer-agent.md`                                                                                                | copiar e ajustar (§4.2)                                          | stack, pré-passo 5.0, tabela glob → skill                   |
| `agents/frontend-agent.md`                                                                                                | **reescrever** com o texto de §4.4                               | o original descreve o app Electron do Uno SDD               |
| `agents/backend-agent.md`                                                                                                 | não copiar                                                       | não há backend                                              |
| `skills/arquitetura`, `daemon`, `desktop`, `estrutura`, `frontend-design-system`, `worktree`, `teste-automatizado`, `teste-de-mesa` | **não copiar**; escrever as quatro de §4.3                 | são regras do produto Uno SDD                               |
| `hooks/sdd-session-title.mjs`                                                                                             | copiar sem mudança                                               | nomeia a sessão como `SDD-PLAN-FOR-001` e afins             |
| `hooks/sdd-summary.mjs`                                                                                                   | **não copiar**: o app instala (§4.6)                             | é o teste do instalador                                     |
| `hooks/summary/**`, `hooks/*.test.ts`, `hooks/tsconfig.json`                                                              | não copiar                                                       | são a fonte e os testes do bundle, do Uno SDD               |
| `settings.json`                                                                                                           | não copiar; escrever o de §4.5                                   | o app mescla o resto                                        |
| `uno/`                                                                                                                    | **nunca copiar**                                                 | estado local do daemon, com token                           |
| `F:\Unobject\sdd\.agents\`, `F:\Unobject\sdd\.codex\`                                                                     | não copiar                                                       | runtime Codex; só se a pessoa pedir                         |

### 4.2 Ajustes exatos

A URL canônica dos docs do Uno SDD é `https://github.com/lucastumeleiro/sdd/blob/main/docs/<arquivo>.md`. O repositório é privado, e os links são para humanos com acesso. Onde abaixo aparece **URL canônica**, é essa URL com o arquivo citado no link original.

**`skills/sdd/SKILL.md`**

1. No primeiro parágrafo, troque o link `../../../docs/adocao-no-repositorio-consumidor.md` pela URL canônica.
2. Troque inteiro o bloco que começa com "> Este fluxo foi **adaptado deste formato genérico para o produto Uno SDD**" por este:

   ```markdown
   > Fluxo importado do Uno SDD para o repositório de teste Fornalha. As skills de domínio daqui são `arquitetura`, `design-system`, `teste-automatizado` e `teste-de-mesa`; onde uma sub-skill diz "skill do projeto, se existir", são estas.
   ```
3. Em §Worktree, WIP…, remova `(EPIC §4 item 6)`, que se refere ao EPIC do Uno SDD, e troque o link `../../../docs/worktree-e-wip.md` pela URL canônica.
4. Em §0.2, troque o parágrafo "**Estas skills de domínio ainda não existem neste repositório** …" e a lista que o segue por esta lista, **sem a linha de backend**:
   - **Sempre:** `arquitetura`
   - **Frontend/UI** (qualquer `.tsx`, `src/index.css`, fonte, tema): `design-system`
   - **Teste manual (6a):** `teste-de-mesa`
   - **Teste automatizado (6b e Check 6 da 7):** `teste-automatizado`
5. **Não toque** em §Fechamento de fase. É o bloco normativo espelhado entre runtimes e continua chamando `node .claude/hooks/sdd-summary.mjs`.

**`skills/sdd-plan/SKILL.md`**: logo abaixo do título `## Etapa 1 — Decomposição em PLANs`, acrescente:

> **Fornalha:** as tasks deste repositório são cortadas para caber em **um** PLAN. Dois só com o motivo escrito no próprio PLAN. Se a decomposição pedir três ou mais, pare e pergunte à pessoa se a task deve ser partida.

**`skills/sdd-feature/SKILL.md`**: na Etapa 2, troque a tabela por esta e troque `.claude/agents/{backend,frontend}-agent.md` por `.claude/agents/frontend-agent.md` na nota logo abaixo.

| Domínio detectado                                                                                                                                                  | `subagent_type`                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `src/**`, `index.html`, `public/**`, inclusive um PLAN que rode `npx shadcn@latest add` (aí o `package.json` e o lockfile mudam como consequência)                  | `frontend-agent`                                                                                       |
| Só configuração de raiz (`package.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `uno.config.json`), `scripts/**`, `.claude/**` ou documentos       | `general-purpose`, instruído a invocar `arquitetura` (e `design-system` se tocar `src/index.css`)      |

**`skills/sdd-verify/SKILL.md`**: troque a menção `docs/worktree-e-wip.md` §5 pela URL canônica, §5.

**`commands/feature.md`**: no passo 4, onde se lê "conforme o domínio do PLAN (`backend-agent` | `frontend-agent`, ver skill `sdd-feature`)", deixe só `frontend-agent` dentro do parêntese.

**`commands/verify.md`**: troque `docs/worktree-e-wip.md` §5 pela URL canônica, §5.

**`commands/review-feature.md`**

1. Na Etapa 5.0, troque o parêntese "(ver skill `reviewer-agent` para o que preencher — ex.: dependency-cruiser, ast-grep)" por "(`npm run typecheck` e `npm run check:cores`, conforme a tabela do reviewer-agent)".
2. Troque o link `../../docs/worktree-e-wip.md` pela URL canônica.

**`agents/reviewer-agent.md`**

1. No `description` do frontmatter, troque "despacha backend-agent e/ou frontend-agent" por "despacha correções de frontend".
2. Em §Contexto técnico, troque as três linhas ("Stack backend…", "Stack frontend…" e "Padrões de projeto estão documentados…") por:
   "Stack: Vite + React + TypeScript strict + Tailwind v4 + shadcn/ui, com Vitest + Testing Library em jsdom. Sem backend. Skills de domínio: `arquitetura`, `design-system`, `teste-automatizado`, `teste-de-mesa`."
3. Em §Leitura obrigatória, o `<branch-base>` é `origin/main`. No parágrafo dos "dois casos", apague a oração sobre o histórico do Uno SDD ("que é como o histórico deste repositório nasceu (um commit por task, sem branch de feature)"). A regra continua valendo.
4. Em §Fase 5.0, troque a tabela por:

   | Ferramenta            | O que cobre                                                           |
   | --------------------- | --------------------------------------------------------------------- |
   | `npm run typecheck`   | tipos de produção e de teste                                          |
   | `npm run check:cores` | DS-01 e DS-02: cor literal e classe de paleta fora de `src/index.css` |

   Apague o bloco "**Limitação de ambiente conhecida:** …". Ele se refere ao devcontainer do Uno SDD.
5. Em §Resolução de escopo, troque a tabela por:

   | Glob                                                                                                                  | Skill                                                |
   | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
   | `src/index.css`                                                                                                       | `design-system`                                      |
   | `src/components/ui/**`                                                                                                | `design-system` (só DS-04; demais regras `N-A`: código gerado pelo CLI) |
   | `src/components/**`, `src/sections/**`                                                                                | `design-system` + `arquitetura`                      |
   | `src/lib/**`, `src/content/**`, `src/data/**`, `src/App.tsx`, `src/main.tsx`, `index.html`                            | `arquitetura`                                        |
   | `**/*.test.ts`, `**/*.test.tsx`, `src/test/**`                                                                        | `teste-automatizado`                                 |
   | `package.json`, `vite.config.ts`, `tsconfig*.json`, `components.json`, `uno.config.json`, `.env.example`, `scripts/**` | `arquitetura`                                        |
   | `.claude/**`                                                                                                          | sem skill de domínio: lacuna declarada               |

   No parágrafo **Precedência** logo abaixo, troque o exemplo `apps/daemon/src/x.test.ts` (que casa em `apps/daemon/**` e em `**/*.test.ts`) por `src/sections/faq-section.test.tsx` (que casa em `src/sections/**` e em `**/*.test.tsx`).

6. No sub-agente **(b) Segurança e I/O**, troque a lista do sweep (authz, N+1, paginação…) por: segredo ou número de telefone real no código; `.env` versionado; `dangerouslySetInnerHTML`; link externo sem `rel="noopener noreferrer"`; dado do formulário em `console.*`; `import.meta.env` fora do prefixo `VITE_`.
7. Em §Fase 5.2:
   - apague a linha "Arquivos de backend → Template backend" e o **Template para correção backend** inteiro;
   - troque "se há correções em backend E frontend, despache ambos na mesma mensagem" por "correções independentes, em arquivos diferentes, podem ir na mesma mensagem";
   - troque as menções a `docs/worktree-e-wip.md` pela URL canônica.

**`skills/task-analyst/SKILL.md`**: em §Convenções do projeto, troque o texto de preenchimento por:
"Ver `CLAUDE.md` (mapa) e a skill `arquitetura` (onde cada coisa mora). Nome de arquivo em kebab-case, em inglês; componente em PascalCase; texto visível sempre em `src/content/`."

### 4.3 Skills de domínio novas (texto integral)

#### `.claude/skills/arquitetura/SKILL.md`

````markdown
---
name: arquitetura
description: Onde cada coisa mora no site da Fornalha (SPA React + Vite) — seções, conteúdo, dados, componentes, funções puras e ambiente. Invocar em todo PLAN e antes de criar arquivo novo.
---

# Arquitetura — Fornalha

Uma página só, sem backend. O código se separa pelo que a pessoa vê (a seção) e pelo que muda sozinho (texto, dados, lógica). Assim uma task de copy não toca em componente e uma task de cor não toca em texto.

| Caminho                     | Mora aqui                                                        | Não mora aqui                                |
| --------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| `src/App.tsx`               | a ordem das seções e os landmarks da página                      | lógica, texto                                |
| `src/sections/<nome>.tsx`   | uma seção, com o `id` da âncora                                  | texto literal                                |
| `src/content/<secao>.ts`    | todo texto visível da seção, inclusive `aria-label` e mensagens  | JSX                                          |
| `src/data/products.ts`      | o cardápio e seus tipos                                          | texto de interface                           |
| `src/components/<nome>.tsx` | componente da casa reutilizável; recebe dados por prop           | import de valor de `src/data/`               |
| `src/components/ui/`        | primitivos do shadcn, gerados pelo CLI                           | edição à mão                                 |
| `src/lib/<nome>.ts`         | função pura: formatar, filtrar, validar, montar URL              | React, DOM, `import.meta.env`                |

Seção nova se chama `<nome>-section.tsx`; as quatro do bootstrap (`site-header`, `hero`, `products-section`, `site-footer`) ficam como estão.

## Regras verificáveis

### AR-01 — Texto visível mora em `src/content/`, nunca literal no JSX

**Bloqueia:** sim
**Verificação:** julgamento

Inclui `aria-label`, `alt`, placeholder e mensagem de erro. Exceção: nome e preço de produto, que vêm de `src/data/`.

### AR-02 — Seção nova é um arquivo em `src/sections/`, um em `src/content/` e uma linha em `App.tsx`

**Bloqueia:** não
**Verificação:** julgamento

### AR-03 — Lógica com regra é função pura em `src/lib/`

**Bloqueia:** não
**Verificação:** julgamento

Pura quer dizer sem React, sem DOM e sem `import.meta.env`: o que ela precisa chega por parâmetro. É isso que a torna teste de categoria A.

### AR-04 — Sem backend, sem `fetch`, sem roteador, sem estado global

**Bloqueia:** sim
**Verificação:** julgamento

O estado é `useState` local; a navegação é por âncora (`#id`). Dependência nova só entra se a TASK pedir ou o PLAN justificar.

### AR-05 — Ambiente só por `import.meta.env.VITE_*`, tipado, com a ausência tratada

**Bloqueia:** sim
**Verificação:** julgamento

Variável nova entra no `.env.example`, sem valor real, e na tipagem de `ImportMetaEnv`. A página funciona sem `.env`, porque o worktree nasce sem ele.

### AR-06 — Import por `@/`, nunca `../../`

**Bloqueia:** não
**Verificação:** julgamento

### AR-07 — Arquivo de produção com até 150 linhas

**Bloqueia:** não
**Verificação:** julgamento

Se passar, a seção se divide em componentes em `src/components/`.
````

#### `.claude/skills/design-system/SKILL.md`

````markdown
---
name: design-system
description: Aparência do site da Fornalha — tokens de cor do shadcn nos dois temas, classes semânticas, como primitivo e fonte entram, contraste e foco. Invocar em todo PLAN que crie ou altere componente, seção, src/index.css, fonte ou tema.
---

# Design system — Fornalha

O tema é o do shadcn: variáveis CSS em `src/index.css` (`:root` para o claro, `.dark` para o escuro), mapeadas para o Tailwind no bloco `@theme inline`. O componente pede **papel** (`bg-primary`, `text-muted-foreground`, `border-border`), nunca **tom**. Por isso trocar a cor da marca é editar tokens, e nenhum componente muda.

## Como as coisas entram

- **Cor nova:** variável em `:root` **e** em `.dark`, mais a linha `--color-<nome>: var(--<nome>)` no `@theme inline`. Formato `oklch()`, como o shadcn gera.
- **Fonte:** pacote `@fontsource-variable/*` importado em `src/index.css`, com a família exposta como token `--font-*` no `@theme inline`.
- **Primitivo novo:** `npx shadcn@latest add <nome>`, que gera em `src/components/ui/` e instala a dependência. Não se escreve à mão nem se copia de outro projeto.
- **Variante:** `cva` no componente da casa, com um grupo por eixo.
- **Tema escuro:** classe `dark` no `<html>`, como no guia do shadcn para Vite. Nada de `prefers-color-scheme` espalhado por componente.
- **Canvas/mockup** aprovado na Fase 2 define arranjo e hierarquia. Cor, espaçamento e raio vêm daqui; em divergência, o token ganha.

## Regras verificáveis

### DS-01 — Cor literal só em `src/index.css`

**Bloqueia:** sim
**Verificação:** `npm run check:cores`

Hex, `rgb()`, `hsl()` ou `oklch()` fora da folha de tokens é violação, inclusive em `style=`.

### DS-02 — Classe de cor é semântica, nunca paleta de fábrica nem valor arbitrário

**Bloqueia:** sim
**Verificação:** `npm run check:cores`

`bg-primary` ✅ · `bg-orange-600` ❌ · `bg-[#c2410c]` ❌ · `text-white` ❌ (o certo é `text-primary-foreground`).

### DS-03 — Token novo existe nos dois temas e no `@theme inline`

**Bloqueia:** sim
**Verificação:** julgamento

### DS-04 — `src/components/ui/` sai do CLI; ajuste de aparência se faz no componente da casa ou no token

**Bloqueia:** sim
**Verificação:** julgamento

### DS-05 — Texto sobre cor de marca tem contraste ≥ 4,5:1 (≥ 3:1 se tiver 24 px ou mais) nos dois temas

**Bloqueia:** sim
**Verificação:** julgamento

O PLAN que muda cor registra os pares medidos (DevTools → contraste), e o `TEST.md` confere.

### DS-06 — Elemento interativo tem foco visível (o `ring` do tema) e nome acessível

**Bloqueia:** sim
**Verificação:** julgamento

Botão só com ícone leva `aria-label`, com o texto em `src/content/` (AR-01).
````

#### `.claude/skills/teste-automatizado/SKILL.md`

````markdown
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

| Categoria               | Neste produto                                                    | Exemplos                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **A — unit**            | função pura de `src/lib/`                                        | formatar preço em BRL, filtrar produtos, validar telefone, montar URL do WhatsApp                                         |
| **B — integração leve** | componente ou seção renderizado em jsdom, com `user-event`       | abrir item do FAQ, filtrar o cardápio, alternar o tema (classe `dark` + `localStorage`), enviar o formulário vazio       |
| **C — não automatizar** | o que só um navegador de verdade mostra                          | cor e contraste percebidos, fonte carregada, layout em 375 px, rolagem até a âncora, o Vite lendo o `.env` real           |
| **Toolchain**           | fica fora de A/B/C, registrado à parte no `AUTOTEST.md`          | "compila", "sem cor literal": `npm run typecheck`, `npm run build`, `npm run check:cores`                                 |

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
````

#### `.claude/skills/teste-de-mesa/SKILL.md`

````markdown
---
name: teste-de-mesa
description: Padrão do TEST.md da Fornalha — cenários executados no navegador com a aplicação no ar a partir do worktree da task, nos dois temas e nas duas larguras quando cabe. Consumida por sdd-test-plan (Fase 6a).
---

# Teste de mesa — Fornalha

Todo CT é `Via: UI`: este produto não tem API. Quem executa é a pessoa, no navegador, com a aplicação no ar **a partir do worktree da task**:

1. abrir um terminal em `.claude/worktrees/<ID>/` (ou usar o terminal embutido do app, que já abre ali);
2. se a task lê `.env`, rodar `worktree hot <ID>` antes;
3. `npm run dev` e abrir `http://localhost:5173`. A porta é fixa: se outra task estiver no ar, o comando falha, e é preciso derrubar a outra.

## O que cada CT declara

- **Pré-condição:** tema (claro ou escuro), largura (375 px ou ≥ 1280 px no DevTools), com ou sem `.env`.
- **Passos:** cliques e teclas. Só teclado (`Tab`, `Enter`, `Esc`) quando a task cria elemento interativo.
- **Resultado esperado:** o que se vê **e** o que se confere no DevTools quando o olho não basta (contraste, `lang`, `aria-*`, `href`/`id`, classe `dark` no `<html>`, `localStorage`).

## Regras verificáveis

### TM-01 — Mudança de cor, fonte ou tema tem CT nos dois temas

**Bloqueia:** sim
**Verificação:** julgamento

### TM-02 — Mudança de layout tem CT em 375 px e em ≥ 1280 px

**Bloqueia:** sim
**Verificação:** julgamento

### TM-03 — Task que lê `.env` tem um CT sem `.env` (worktree frio) e outro com `.env` (depois do `worktree hot`)

**Bloqueia:** sim
**Verificação:** julgamento

### TM-04 — Elemento interativo novo tem CT só com teclado

**Bloqueia:** não
**Verificação:** julgamento
````

### 4.4 `.claude/agents/frontend-agent.md` (texto integral)

````markdown
---
name: frontend-agent
description: Agente de frontend da Fornalha — implementa PLANs que tocam src/, index.html ou public/ (React + Vite + Tailwind v4 + shadcn/ui).
color: yellow
---

Você é o agente de frontend da Fornalha e implementa **um** PLAN de uma task.

## Contexto técnico

Vite + React + TypeScript strict, Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (primitivos em `src/components/ui/`, tokens em `src/index.css`), `lucide-react`, Vitest + Testing Library. Alias `@/` → `src/`. Sem backend e sem roteador. Mapa completo: `CLAUDE.md` e skill `arquitetura`.

## Leitura obrigatória ANTES de qualquer ação

1. `tasks/{TASK_ID}/MEMORY.md`
2. `tasks/{TASK_ID}/plans/{PLAN_FILE}` — siga FIELMENTE
3. `tasks/{TASK_ID}/TASK.md`
4. `tasks/{TASK_ID}/QUESTION.md`, se existir — decisão registrada ali não se re-litiga
5. Os arquivos que o PLAN lista como impactados, e só eles

## Skills — invoque as que o PLAN exige

- `arquitetura`: sempre
- `design-system`: quando o PLAN cria ou altera componente, seção, `src/index.css`, fonte ou tema

## Regras de execução

- Execute os passos na ordem do PLAN; nada fora do escopo.
- Primitivo shadcn novo entra por `npx shadcn@latest add <nome>`. Se o lockfile mudar, é esperado: relate.
- Ao terminar, rode `npm run typecheck`, `npm test` e `npm run check:cores`. Os três precisam sair com código 0; se algum falhar, relate com a saída.
- Bloqueio ou contradição: PARE e relate.
- NUNCA `npm run dev`, NUNCA lint, NUNCA commit/push/branch, NUNCA `.md` novo sem pedido.

## Relatório obrigatório ao concluir

1. Arquivos criados/modificados (caminho + operação)
2. Passos executados
3. Contratos exportados (nome + arquivo)
4. Dependências adicionadas (pacote + versão), se houver
5. Desvios, com o motivo
6. Bloqueios
````

### 4.5 `.claude/settings.json` inicial

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/sdd-session-title.mjs"
          }
        ]
      }
    ]
  }
}
```

Só isso. O `PostToolUse` do carimbador e as três entradas de `permissions.deny` o app mescla (§4.6). Deixá-los de fora testa se a mescla preserva um hook que já existe.

### 4.6 O que o app instala, e por que não à mão

Quando a pessoa tentar adotar a primeira task (ou abrir a instalação do fluxo SDD nas Configurações), o app diagnostica o repositório e oferece instalar, com confirmação:

- `.claude/hooks/sdd-summary.mjs`, o carimbador do `SUMARIO.md`, e `.claude/hooks/sdd-summary.origin.txt`;
- no `.claude/settings.json`, o `PostToolUse` do carimbador e as três entradas de `permissions.deny` para `.claude/worktrees/**`;
- as linhas `.claude/worktrees/` e `.claude/uno/` no `.gitignore` e no `.claudeignore`.

É o primeiro cenário do roteiro (§8.1). **Até essa instalação, nenhuma fase SDD consegue carimbar**, então não se roda SDD antes dela.

Se o instalador falhar, a instalação manual está no doc canônico `adocao-no-repositorio-consumidor.md`, itens 6.1 a 6.3, copiando de `F:\Unobject\sdd\.claude\hooks\sdd-summary.mjs`.

---

## 5. As tasks

### 5.1 `tasks/EPIC.md` (texto integral)

```markdown
# EPIC — Site da Fornalha

## Produto

A Fornalha é uma padaria de fermentação natural (fictícia). O site é uma página só: apresenta a padaria, mostra o cardápio, diz quando abre e recebe encomendas de fim de semana. Sem login, sem pagamento, sem backend.

## Para quem

Vizinhos do bairro, no celular, com pressa: "tem pão hoje?", "que horas abre?", "dá para encomendar?".

## Marca

- **Voz:** trata por "você"; frases curtas; o concreto no lugar do adjetivo. Sem emoji, sem exclamação em série, sem superlativo vazio ("o melhor", "incrível", "delicioso").
- **Cor:** terracota como primária (forno, tijolo), fundo claro quente, texto carvão. No escuro, um terracota mais claro.
- **Tipografia:** títulos com serifa (Fraunces), corpo na fonte do sistema.

## Fatos da marca (use nos textos; não invente outros)

- Fermentação natural de 36 horas; o fermento está vivo desde 2019.
- Fornadas às 7h e às 16h.
- Farinha orgânica de moinho de pedra.
- Endereço: Rua do Forno, 120 — Centro.
- Horários: segunda, fechado; terça a sexta, 7h–19h; sábado, 7h–14h; domingo, 7h–12h.
- Encomendas de fim de semana até sexta, 18h.
- Instagram: @fornalha.padaria. O WhatsApp vem do `.env` (número fictício).

## Perguntas frequentes (usadas em FOR-010)

1. **Vocês abrem na segunda?** Não. Segunda é o dia de alimentar o fermento e limpar o forno.
2. **Até quando posso encomendar para o fim de semana?** Até sexta, 18h.
3. **Tem pão sem glúten?** Não. Tudo que sai do forno leva trigo, e não dá para garantir ausência de contaminação.
4. **O pão dura quantos dias?** De três a quatro, embrulhado em pano. Para durar mais, fatie e congele.
5. **Aceitam cartão?** Sim: débito, crédito e Pix.

## Seções, na ordem final da página

Cabeçalho · Hero · Cardápio · Quem já provou · Encomenda · Perguntas frequentes · Horários e endereço · Rodapé

## Fora do escopo do épico

Backend, pagamento, login, CMS, i18n, analytics, SEO além do básico.

## Glossário

| Na tela              | No código                          |
| -------------------- | ---------------------------------- |
| Cardápio             | `products`, `ProductsSection`      |
| Quem já provou       | `testimonials`                     |
| Encomenda            | `order`                            |
| Perguntas frequentes | `faq`                              |
| Horários e endereço  | `hours`                            |
```

### 5.2 Formato de cada `tasks/FOR-NNN/TASK.md`

```markdown
# [FEATURE|BUG] FOR-NNN — <título>

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** <tipo> · **Depende de:** <…> · **Vem depois de:** <…> · **Pode rodar em paralelo com:** <…> · **Precede:** <…>

## Contexto

## Comportamento Esperado

## Arquivos/Módulos Afetados

## Critérios de Aceite

- [ ] **CA-1** — Dado …, quando …, então …

## Fora de escopo

## Premissas e Incertezas
```

- **Depende de** é contrato: a task usa algo que outra cria. **Vem depois de** e **Precede** são conflito de arquivo. **Pode rodar em paralelo com** quer dizer sem arquivo em comum.
- **Premissas e Incertezas:** escreva três premissas e duas incertezas **reais**, uma linha cada. Elas alimentam o `/question`, então não encha.
- Os blocos abaixo são o conteúdo de cada `TASK.md`. Transcreva-os no formato acima, **sem acrescentar escopo**.
- **Não escreva nos `TASK.md` nada sobre o que a task testa no Uno SDD.** Isso fica no roteiro (§8). Anotação de teste dentro da task enviesa o agente que vai executá-la.

### 5.3 Mapa de conflitos e ondas

| Onda | Task    | Tipo                          | Arquivos principais                                                                                  | Depende de | Vem depois de      |
| ---- | ------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| 1    | FOR-001 | cor                           | `index.css`                                                                                          | —          | —                  |
| 1    | FOR-002 | copy                          | `content/hero.ts`                                                                                    | —          | —                  |
| 1    | FOR-003 | bug + componente              | `lib/format-price.ts`, `components/price-tag.tsx`, `components/product-card.tsx`                      | —          | —                  |
| 2    | FOR-004 | bug (relato cru)              | a descobrir: `content/header.ts` ou `sections/products-section.tsx`                                  | —          | —                  |
| 2    | FOR-005 | componente + ambiente         | `lib/whatsapp.ts`, `components/whatsapp-button.tsx`, `sections/hero.tsx`, `content/hero.ts`, `.env.example` | —   | FOR-002            |
| 2    | FOR-006 | copy                          | `data/products.ts`, `content/products-section.ts`                                                    | —          | —                  |
| 3    | FOR-007 | design (estrutural)           | `sections/hours-section.tsx`, `content/hours.ts`, `App.tsx`                                           | —          | —                  |
| 3    | FOR-008 | componente                    | `components/theme-*.tsx`, `sections/site-header.tsx`, `content/header.ts`, `main.tsx`                | —          | FOR-004            |
| 3    | FOR-009 | design + dependência          | `index.css`, `package.json`, lockfile                                                                | —          | FOR-001            |
| 4    | FOR-010 | design (estrutural) + primitivo | `ui/accordion`, `sections/faq-section.tsx`, `content/faq.ts`, `App.tsx`, lockfile                  | —          | FOR-007, FOR-009   |
| 4    | FOR-011 | ajuste pontual                | `sections/site-footer.tsx`, `content/footer.ts`                                                      | FOR-005    | —                  |
| 4    | FOR-014 | componente                    | `data/products.ts`, `components/product-card.tsx`, `content/products-section.ts`                     | —          | FOR-003, FOR-006   |
| 5    | FOR-012 | componente + lógica pura      | `lib/filter-products.ts`, `sections/products-section.tsx`, `content/products-section.ts`             | —          | FOR-004, FOR-014   |
| 5    | FOR-013 | design (estrutural)           | `sections/testimonials-section.tsx`, `content/testimonials.ts`, `App.tsx`                            | —          | FOR-010            |
| 5    | FOR-015 | design (responsivo) + primitivo | `ui/sheet`, `components/mobile-nav.tsx`, `sections/site-header.tsx`, `content/header.ts`, lockfile | —          | FOR-008, FOR-010   |
| 6    | FOR-016 | componente + design + primitivos | `ui/input,label,textarea`, `lib/validate-order.ts`, `sections/order-section.tsx`, `content/order.ts`, `App.tsx`, lockfile | — | FOR-013, FOR-015 |
| 7    | FOR-017 | acessibilidade                | `index.html`, `App.tsx`, `sections/site-header.tsx`, `content/header.ts`                             | —          | FOR-015, FOR-016   |

Dentro de uma onda, nenhuma task tem arquivo em comum com outra. Cada onda tem no máximo três tasks, que é o limite de WIP de fases frias.

### 5.4 Conteúdo das tasks

---

#### FOR-001 — Paleta terracota · `[FEATURE]` · cor

**Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-002, FOR-003 · **Precede:** FOR-009

**Contexto.** O site usa a paleta neutra de fábrica do shadcn. A marca é terracota (EPIC §Marca).

**Comportamento Esperado.**
1. `--primary` passa a ser terracota nos dois temas, e `--primary-foreground` garante contraste.
2. `--ring` acompanha o primário, para o foco aparecer na cor da marca.
3. Nenhum componente muda; só tokens.

**Arquivos.** `src/index.css`

**Critérios de Aceite.**
- **CA-1** — Dado o tema claro, quando abro a página, então o botão do hero aparece em terracota.
- **CA-2** — Dado o tema escuro (classe `dark` no `<html>`, pelo DevTools), então o primário é um terracota mais claro, legível sobre o fundo escuro.
- **CA-3** — Dado o botão primário, então o contraste entre texto e fundo é ≥ 4,5:1 nos dois temas, com os pares medidos registrados no PLAN.
- **CA-4** — Dado o repositório, quando rodo `npm run check:cores`, então há 0 violações, e o diff só toca `src/index.css`.

**Fora de escopo.** Fundo creme, fontes, alternador de tema (FOR-008).

---

#### FOR-002 — Copy do hero · `[FEATURE]` · copy

**Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-001, FOR-003 · **Precede:** FOR-005

**Contexto.** O hero diz "Bem-vindo à Fornalha / Pães artesanais feitos com carinho. / Saiba mais". É genérico e não diz o que a padaria tem de diferente.

**Comportamento Esperado.**
1. Título com até 6 palavras, subtítulo com até 20 e CTA com até 3, na voz do EPIC.
2. O texto usa ao menos um fato de §Fatos da marca.
3. O CTA continua levando a `#cardapio`.

**Arquivos.** `src/content/hero.ts`

**Critérios de Aceite.**
- **CA-1** — Dado o hero, então o título tem ≤ 6 palavras, o subtítulo ≤ 20 e o CTA ≤ 3.
- **CA-2** — Dado o texto, então ele cita ao menos um fato de §Fatos da marca e não usa nenhum superlativo vazio.
- **CA-3** — Dado o CTA, quando clico, então a página vai para o Cardápio.
- **CA-4** — Dado o diff, então só `src/content/hero.ts` mudou.

**Fora de escopo.** Botão de WhatsApp (FOR-005), layout do hero.

---

#### FOR-003 — Preço em reais · `[BUG]` · bug + componente

**Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-001, FOR-002 · **Precede:** FOR-014

**Contexto.** O cardápio mostra `R$ 12.50` e `R$ 28.00`, com ponto decimal, no formato americano.

**Comportamento Esperado.**
1. Função pura `formatPrice(value: number): string` em `src/lib/format-price.ts`, com `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
2. Componente `PriceTag` (`src/components/price-tag.tsx`) que mostra o preço formatado em destaque (`font-semibold`, `tabular-nums`).
3. O `ProductCard` usa o `PriceTag`.

**Arquivos.** `src/lib/format-price.ts` (novo), `src/components/price-tag.tsx` (novo), `src/components/product-card.tsx`

**Critérios de Aceite.**
- **CA-1** — Dado o croissant (12,5), então o card mostra `R$ 12,50`.
- **CA-2** — Dado o pão de fermentação natural (28), então `R$ 28,00`, sempre com duas casas.
- **CA-3** — Dado `formatPrice(1234.5)`, então `R$ 1.234,50`.
- **CA-4** — Dado o diff, então não sobra nenhum `toFixed` em `src/`.

**Fora de escopo.** Produtos novos, preço promocional.

---

#### FOR-004 — Cardápio no menu não funciona · `[BUG]` · relato cru

**Este é o único `TASK.md` que nasce cru, e de propósito:** é a entrada do `/spec`. Transcreva **exatamente** isto e não investigue nem enriqueça no bootstrap:

```markdown
# [BUG] FOR-004 — Cardápio no menu não funciona

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** bug · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-005, FOR-006 · **Precede:** FOR-008, FOR-012

## Relato

> "Oi, cliquei em Cardápio lá em cima e não aconteceu nada. No celular também. O botão do meio da página funciona." — cliente, por WhatsApp
```

---

#### FOR-005 — Encomendar pelo WhatsApp · `[FEATURE]` · componente + ambiente

**Depende de:** — · **Vem depois de:** FOR-002 (`content/hero.ts`) · **Pode rodar em paralelo com:** FOR-004, FOR-006 · **Precede:** FOR-011 (contrato)

**Contexto.** A maior parte das encomendas chega por WhatsApp. O número muda por ambiente e não é versionado.

**Comportamento Esperado.**
1. Função pura `buildWhatsappUrl(phone: string, message: string): string` em `src/lib/whatsapp.ts`, que devolve `https://wa.me/<só os dígitos>?text=<mensagem codificada>`.
2. `WhatsappButton` em `src/components/whatsapp-button.tsx`: um link com cara de botão (`Button` `asChild`, variante `outline`), ícone `MessageCircle` do lucide, abrindo em nova aba com `rel="noopener noreferrer"`.
3. O número vem de `import.meta.env.VITE_WHATSAPP_NUMBER`, tipado. **Sem a variável, o botão não aparece**, e nada quebra.
4. O rótulo do botão e a mensagem pré-preenchida ficam em `src/content/hero.ts`.
5. O `.env.example` documenta a variável sem valor real.

**Arquivos.** `src/lib/whatsapp.ts` (novo), `src/components/whatsapp-button.tsx` (novo), `src/sections/hero.tsx`, `src/content/hero.ts`, `.env.example`, a tipagem de `import.meta.env`

**Critérios de Aceite.**
- **CA-1** — Dado o worktree sem `.env`, quando abro a página, então o hero mostra só o CTA do cardápio, sem erro no console.
- **CA-2** — Dado um `.env` com `VITE_WHATSAPP_NUMBER=5547999999999` (depois do `worktree hot FOR-005`), então aparece "Encomendar pelo WhatsApp" ao lado do CTA.
- **CA-3** — Dado o botão, quando clico, então abre em nova aba `https://wa.me/5547999999999?text=…`, com a mensagem de `content/hero.ts`.
- **CA-4** — Dado `buildWhatsappUrl("+55 (47) 99999-9999", "Olá!")`, então o resultado é `https://wa.me/5547999999999?text=Ol%C3%A1!`.
- **CA-5** — Dado o diff, então o `.env` não está versionado e o `.env.example` tem a variável sem número.

**Fora de escopo.** Formulário (FOR-016), rodapé (FOR-011).

---

#### FOR-006 — Copy do cardápio · `[FEATURE]` · copy

**Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-004, FOR-005 · **Precede:** FOR-014

**Contexto.** Os seis produtos dizem "Descrição em breve.", e a seção diz "Conheça nossos produtos."

**Comportamento Esperado.**
1. Uma descrição por produto, com 8 a 18 palavras e um detalhe concreto (ingrediente, tempo, textura) coerente com o EPIC.
2. O subtítulo da seção é reescrito, com até 12 palavras.
3. Nomes e preços não mudam.

**Arquivos.** `src/data/products.ts` (só o campo `description`), `src/content/products-section.ts`

**Critérios de Aceite.**
- **CA-1** — Dado cada card, então a descrição tem de 8 a 18 palavras e nenhuma é "Descrição em breve.".
- **CA-2** — Dado o conjunto, então nenhuma descrição repete a estrutura de outra (por exemplo, todas começando com "Feito com…") e nenhuma usa superlativo vazio.
- **CA-3** — Dado o diff de `products.ts`, então só o campo `description` mudou.

**Fora de escopo.** Fotos, produtos novos.

---

#### FOR-007 — Horários e endereço · `[FEATURE]` · design (estrutural)

**Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-008, FOR-009 · **Precede:** FOR-010 (`App.tsx`)

**Contexto.** A pergunta mais comum no WhatsApp é "que horas abre?", e a página não responde.

**Comportamento Esperado.**
1. Seção nova "Horários e endereço" (`id="horarios"`), entre o Cardápio e o rodapé.
2. Os sete dias, de segunda a domingo, com os horários do EPIC; segunda aparece como "Fechado".
3. O dia de hoje aparece destacado, com `aria-current="date"`.
4. Endereço com o link "Como chegar" para `https://www.google.com/maps/search/?api=1&query=<endereço codificado>`, em nova aba.

**Arquivos.** `src/sections/hours-section.tsx` (novo), `src/content/hours.ts` (novo), `src/App.tsx`

**Critérios de Aceite.**
- **CA-1** — Dado a página, então a seção aparece entre o Cardápio e o rodapé, com os sete dias em ordem.
- **CA-2** — Dado a linha de segunda, então ela diz "Fechado".
- **CA-3** — Dado que hoje é sábado, então a linha de sábado está destacada e tem `aria-current="date"`.
- **CA-4** — Dado o "Como chegar", então ele abre o Google Maps com o endereço, em nova aba e com `rel="noopener noreferrer"`.
- **CA-5** — Dado 375 px, então a seção não cria rolagem horizontal.

**Fora de escopo.** Mapa embutido, feriados, item no menu.

---

#### FOR-008 — Tema escuro com alternância · `[FEATURE]` · componente

**Depende de:** — · **Vem depois de:** FOR-004 (`content/header.ts`) · **Pode rodar em paralelo com:** FOR-007, FOR-009 · **Precede:** FOR-015, FOR-017

**Contexto.** Os tokens `.dark` existem desde o bootstrap, mas não há como ligá-los.

**Comportamento Esperado.**
1. `ThemeProvider` no padrão do guia de dark mode do shadcn para Vite: tema `light`, `dark` ou `system`; classe `dark` no `<html>`; persistência em `localStorage` na chave `fornalha-theme`.
2. `ThemeToggle` no cabeçalho: botão só com ícone (`Sun`/`Moon`) que alterna entre claro e escuro, com `aria-label` em `content/header.ts`.
3. A primeira visita segue o sistema (`prefers-color-scheme`).

**Arquivos.** `src/components/theme-provider.tsx` (novo), `src/components/theme-toggle.tsx` (novo), `src/sections/site-header.tsx`, `src/content/header.ts`, `src/main.tsx`

**Critérios de Aceite.**
- **CA-1** — Dado a primeira visita com o sistema em modo escuro, então a página abre escura.
- **CA-2** — Dado o botão, quando clico, então o tema alterna e o `<html>` ganha ou perde a classe `dark`.
- **CA-3** — Dado que escolhi o escuro, quando recarrego, então continua escuro.
- **CA-4** — Dado só o teclado, então chego ao botão com `Tab`, vejo o foco e alterno com `Enter` ou `Espaço`.

**Fora de escopo.** Menu com a opção "sistema", evitar o piscar do tema no carregamento.

---

#### FOR-009 — Títulos com serifa · `[FEATURE]` · design + dependência

**Depende de:** — · **Vem depois de:** FOR-001 (`src/index.css`) · **Pode rodar em paralelo com:** FOR-007, FOR-008 · **Precede:** FOR-010 (lockfile)

**Contexto.** Tudo usa a fonte do sistema, e a marca pede títulos com personalidade (EPIC §Marca).

**Comportamento Esperado.**
1. Instalar `@fontsource-variable/fraunces`.
2. Token `--font-heading` no `@theme inline`; `h1`, `h2` e `h3` usam essa família, pelo `@layer base`.
3. O corpo continua na fonte do sistema.

**Arquivos.** `package.json`, `package-lock.json`, `src/index.css`

**Critérios de Aceite.**
- **CA-1** — Dado a página, então os títulos saem em Fraunces (DevTools → Computed → Rendered Fonts) e o corpo, na fonte do sistema.
- **CA-2** — Dado o `npm run build`, então a fonte sai empacotada no `dist`, sem requisição a serviço externo de fontes.
- **CA-3** — Dado o diff, então nenhum componente mudou: só `index.css` e as dependências.

**Fora de escopo.** Fonte do corpo, pesos por seção.

---

#### FOR-010 — Perguntas frequentes · `[FEATURE]` · design (estrutural) + primitivo

**Depende de:** — · **Vem depois de:** FOR-007 (`App.tsx`), FOR-009 (lockfile) · **Pode rodar em paralelo com:** FOR-011, FOR-014 · **Precede:** FOR-013, FOR-015

**Contexto.** As mesmas cinco perguntas chegam toda semana.

**Comportamento Esperado.**
1. `npx shadcn@latest add accordion`.
2. Seção "Perguntas frequentes" (`id="perguntas"`) logo antes de Horários, com as cinco perguntas de EPIC §Perguntas frequentes.
3. Uma pergunta aberta por vez; todas começam fechadas.

**Arquivos.** `src/components/ui/accordion.tsx` (gerado), `src/sections/faq-section.tsx` (novo), `src/content/faq.ts` (novo), `src/App.tsx`, `package.json` e lockfile (se mudarem)

**Critérios de Aceite.**
- **CA-1** — Dado a página, então aparecem as cinco perguntas, fechadas.
- **CA-2** — Dado uma pergunta aberta, quando abro outra, então a primeira fecha.
- **CA-3** — Dado só o teclado, então passo pelas perguntas com `Tab` e abro com `Enter` ou `Espaço`, com foco visível.
- **CA-4** — Dado o `src/components/ui/accordion.tsx`, então ele é o que o CLI gerou.

**Fora de escopo.** Busca, perguntas vindas de CMS.

---

#### FOR-011 — Rodapé com redes e ano automático · `[FEATURE]` · ajuste pontual

**Depende de:** FOR-005 (`buildWhatsappUrl`) · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-010, FOR-014 · **Precede:** —

**Contexto.** O rodapé diz "© 2025 Fornalha" fixo e não tem redes.

**Comportamento Esperado.**
1. O ano é calculado na renderização: "© {ano} Fornalha".
2. Links para o Instagram (`https://instagram.com/fornalha.padaria`) e para o WhatsApp (reusa `buildWhatsappUrl`, e some sem `.env`, como no hero), cada um com ícone do `lucide-react` quando houver um adequado e com `aria-label`.
3. O `id="contato"` continua no rodapé.

**Arquivos.** `src/sections/site-footer.tsx`, `src/content/footer.ts`

**Critérios de Aceite.**
- **CA-1** — Dado o relógio em 2027, então o rodapé mostra "© 2027 Fornalha".
- **CA-2** — Dado que não há `.env`, então só o link do Instagram aparece.
- **CA-3** — Dado os links, então abrem em nova aba, com `rel="noopener noreferrer"`, e têm nome acessível.

**Fora de escopo.** Newsletter, mapa.

---

#### FOR-012 — Filtro do cardápio por categoria · `[FEATURE]` · componente + lógica pura

**Depende de:** — · **Vem depois de:** FOR-004 (`products-section.tsx`, se a correção tocar ali), FOR-014 (`content/products-section.ts`) · **Pode rodar em paralelo com:** FOR-013, FOR-015 · **Precede:** —

**Contexto.** Hoje são seis produtos, e o plano é chegar a trinta. "Pães", "Doces" e "Bebidas" ajudam quem só quer café.

**Comportamento Esperado.**
1. Função pura `filterProducts(products, category)` em `src/lib/filter-products.ts`, com `category` sendo uma `ProductCategory` ou `"all"`.
2. Acima da grade, quatro botões feitos com o `Button` que já existe: "Todos", "Pães", "Doces" e "Bebidas". O ativo usa a variante default e tem `aria-pressed="true"`; os demais usam `outline`.
3. "Todos" é o filtro inicial. A contagem aparece ao lado ("3 produtos"), com singular e plural certos.

**Arquivos.** `src/lib/filter-products.ts` (novo), `src/sections/products-section.tsx`, `src/content/products-section.ts`

**Critérios de Aceite.**
- **CA-1** — Dado o filtro "Pães", então aparecem só os três pães e "3 produtos".
- **CA-2** — Dado o filtro "Bebidas", então aparece um produto e "1 produto", no singular.
- **CA-3** — Dado o filtro "Todos", então aparecem os seis.
- **CA-4** — Dado o botão ativo, então ele tem `aria-pressed="true"` e os demais, `false`.

**Fora de escopo.** Busca por texto, ordenação, filtro na URL.

---

#### FOR-013 — Quem já provou · `[FEATURE]` · design (estrutural)

**Depende de:** — · **Vem depois de:** FOR-010 (`App.tsx`) · **Pode rodar em paralelo com:** FOR-012, FOR-015 · **Precede:** FOR-016

**Contexto.** Falta prova social: três clientes (fictícios) falando de um produto específico.

**Comportamento Esperado.**
1. Seção "Quem já provou" (`id="depoimentos"`), logo depois do Cardápio.
2. Três cards (o `Card` que já existe) com a citação, o nome e o bairro, e as iniciais num círculo `bg-secondary`.
3. Três colunas a partir de 1024 px; uma coluna abaixo disso.
4. Os textos são escritos por esta task, na voz do EPIC, e cada depoimento cita um produto do cardápio pelo nome.

**Arquivos.** `src/sections/testimonials-section.tsx` (novo), `src/content/testimonials.ts` (novo), `src/App.tsx`

**Critérios de Aceite.**
- **CA-1** — Dado a página, então aparecem três depoimentos logo depois do Cardápio.
- **CA-2** — Dado cada depoimento, então ele cita pelo nome um produto que existe em `src/data/products.ts`.
- **CA-3** — Dado 375 px, então uma coluna, sem rolagem horizontal; dado 1280 px, então três colunas.
- **CA-4** — Dado o markup, então cada depoimento é um `<figure>` com `<blockquote>` e `<figcaption>`.

**Fora de escopo.** Carrossel, estrelas, fotos.

---

#### FOR-014 — Selo "Esgotado" · `[FEATURE]` · componente

**Depende de:** — · **Vem depois de:** FOR-003 (`product-card.tsx`), FOR-006 (`products.ts`, `content/products-section.ts`) · **Pode rodar em paralelo com:** FOR-010, FOR-011 · **Precede:** FOR-012

**Contexto.** A focaccia acaba cedo, e o site não avisa.

**Comportamento Esperado.**
1. Campo `available: boolean` em `Product`: a focaccia é `false` e os demais, `true`.
2. No card indisponível: selo "Esgotado" (`Badge` na variante `outline`), nome e preço em `text-muted-foreground`, e o estado anunciado a leitor de tela.
3. O produto continua na grade, na mesma posição.

**Arquivos.** `src/data/products.ts`, `src/components/product-card.tsx`, `src/content/products-section.ts`

**Critérios de Aceite.**
- **CA-1** — Dado a focaccia, então ela mostra o selo "Esgotado" e o texto esmaecido.
- **CA-2** — Dado os demais produtos, então nenhum mostra o selo.
- **CA-3** — Dado a árvore de acessibilidade do DevTools, então o card da focaccia expõe "Esgotado".
- **CA-4** — Dado o `npm run typecheck`, então ele passa, porque todo produto declara `available`.

**Fora de escopo.** Esgotar por horário, estoque real.

---

#### FOR-015 — Menu no celular · `[FEATURE]` · design (responsivo) + primitivo

**Depende de:** — · **Vem depois de:** FOR-008 (`site-header.tsx`, `content/header.ts`), FOR-010 (lockfile) · **Pode rodar em paralelo com:** FOR-012, FOR-013 · **Precede:** FOR-016 (lockfile), FOR-017

**Contexto.** Em 375 px, os itens do menu ficam espremidos ao lado da marca.

**Comportamento Esperado.**
1. `npx shadcn@latest add sheet`.
2. Abaixo de 768 px, a navegação some e aparece o botão "Abrir menu" (ícone `Menu`), que abre um `Sheet` lateral com os mesmos itens de `content/header.ts` e o alternador de tema.
3. Clicar num item fecha o `Sheet` e navega; `Esc` fecha; o foco volta ao botão.
4. A partir de 768 px, fica como hoje.

**Arquivos.** `src/components/ui/sheet.tsx` (gerado), `src/components/mobile-nav.tsx` (novo), `src/sections/site-header.tsx`, `src/content/header.ts`, `package.json` e lockfile (se mudarem)

**Critérios de Aceite.**
- **CA-1** — Dado 375 px, então o cabeçalho mostra só a marca e o botão de menu.
- **CA-2** — Dado o menu aberto, quando clico em "Cardápio", então o `Sheet` fecha e a página vai à seção.
- **CA-3** — Dado o menu aberto, quando aperto `Esc`, então ele fecha e o foco volta ao botão.
- **CA-4** — Dado 1280 px, então a navegação aparece em linha e não há botão de menu.

**Fora de escopo.** Cabeçalho fixo ao rolar, animação própria.

---

#### FOR-016 — Encomenda para o fim de semana · `[FEATURE]` · componente + design (estrutural) + primitivos

**Depende de:** — · **Vem depois de:** FOR-013 (`App.tsx`), FOR-015 (lockfile) · **Pode rodar em paralelo com:** — · **Precede:** FOR-017

**Contexto.** A encomenda de fim de semana precisa chegar até sexta, e hoje só chega por WhatsApp.

**Comportamento Esperado.**
1. `npx shadcn@latest add input label textarea`.
2. Seção "Encomende para o fim de semana" (`id="encomenda"`), entre "Quem já provou" e "Perguntas frequentes", com os campos Nome, Telefone e Pedido.
3. Validação ao enviar, pura, em `src/lib/validate-order.ts`: nome obrigatório; telefone com 10 ou 11 dígitos, ignorando símbolos; pedido com ao menos 10 caracteres. O erro aparece embaixo do campo, com `aria-invalid` e `aria-describedby`, e o foco vai para o primeiro campo inválido.
4. Se estiver válido, o formulário some e aparece "Recebemos sua encomenda, {nome}. Confirmamos pelo telefone até sexta.", com `role="status"`. **Nada é enviado a lugar nenhum.**

**Arquivos.** `src/components/ui/{input,label,textarea}.tsx` (gerados), `src/lib/validate-order.ts` (novo), `src/sections/order-section.tsx` (novo), `src/content/order.ts` (novo), `src/App.tsx`, `package.json` e lockfile (se mudarem)

**Critérios de Aceite.**
- **CA-1** — Dado o formulário vazio, quando envio, então aparecem três erros e o foco vai para Nome.
- **CA-2** — Dado o telefone "(47) 9999-999", que tem 9 dígitos, então aparece o erro de telefone.
- **CA-3** — Dado tudo válido, então aparece a confirmação com o nome, com `role="status"`.
- **CA-4** — Dado o console, então nenhum dado do formulário é registrado.

**Fora de escopo.** Envio real, máscara de telefone, data de retirada.

---

#### FOR-017 — Acessibilidade básica · `[FEATURE]` · acessibilidade

**Depende de:** — · **Vem depois de:** FOR-015 (`site-header.tsx`), FOR-016 (`App.tsx`) · **Pode rodar em paralelo com:** — · **Precede:** —

**Contexto.** A página declara `lang="en"`, a aba mostra o título do template e não há atalho para o conteúdo.

**Comportamento Esperado.**
1. No `index.html`: `lang="pt-BR"`, `<title>Fornalha — padaria de fermentação natural</title>` e um `<meta name="description">` baseado no EPIC.
2. Link "Pular para o conteúdo" como primeiro elemento focável, visível só com foco, levando a `<main id="conteudo">`.
3. Cabeçalho em `<header>`, navegação em `<nav aria-label="Principal">` e rodapé em `<footer>`. Conferir e corrigir o que faltar.

**Arquivos.** `index.html`, `src/App.tsx`, `src/sections/site-header.tsx`, `src/content/header.ts`

**Critérios de Aceite.**
- **CA-1** — Dado a aba do navegador, então ela mostra "Fornalha — padaria de fermentação natural".
- **CA-2** — Dado o `<html>`, então ele tem `lang="pt-BR"`.
- **CA-3** — Dado o primeiro `Tab`, então aparece "Pular para o conteúdo", e `Enter` leva o foco para o `<main>`.
- **CA-4** — Dado o painel de acessibilidade do DevTools, então existem os landmarks banner, navigation "Principal", main e contentinfo.

**Fora de escopo.** Auditoria WCAG completa, Lighthouse.

---

## 6. Conferência final (o agente roda e cola a saída no relatório)

| #   | Comando                                                                                                                     | Esperado                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | `npm run typecheck`                                                                                                         | código 0                                                                                                    |
| 2   | `npm test`                                                                                                                  | código 0; 1 teste (o de fumaça)                                                                             |
| 3   | `npm run build`                                                                                                             | código 0                                                                                                    |
| 4   | `npm run check:cores`                                                                                                       | `check:cores: 0 violações`                                                                                  |
| 5   | `git check-ignore -q .env && echo ignorado`                                                                                 | `ignorado`                                                                                                  |
| 6   | `grep -n "toFixed" src/components/product-card.tsx` · `grep -n "#produtos" src/content/header.ts` · `grep -n 'lang="en"' index.html` | um resultado em cada: os três bugs plantados estão lá                                              |
| 7   | `grep -rl "sdd-summary.mjs" .claude/skills .claude/agents \| sort`                                                          | o master `sdd`, as sete `sdd-*` e o `reviewer-agent`: 9 arquivos                                            |
| 8   | o grep de resíduo do Uno SDD, logo abaixo da tabela                                                                         | nenhum resultado, ou cada um justificado no relatório                                                       |
| 9   | `ls tasks`                                                                                                                  | `EPIC.md` e `FOR-001` … `FOR-017`, cada pasta só com `TASK.md` e **sem** `SUMARIO.md` (quem cria é o primeiro carimbo) |
| 10  | `worktree doctor`                                                                                                           | reprovação **esperada** na cobertura de `.claude/worktrees/` nos ignores (o app instala); relatar e não consertar |

Grep de resíduo (item 8):

```bash
grep -rn -E '@uno/|apps/|packages/|SDD-0[0-9]{2}|backend-agent|frontend-design-system|`daemon`|`desktop`|`estrutura`' .claude
```

Menções a "o daemon" como peça do Uno SDD (por exemplo, "`worktree doctor` e o daemon reconciliam" na `sdd-feature`) são legítimas: o daemon também roda neste repositório. O grep só pega nomes de pacote, caminho e skill.

## 7. Relatório e entrega à pessoa

O relatório do agente tem: o que foi feito, seção por seção; a saída dos dez itens de §6; se o `shadcn add` muda o lockfile nesta versão (§3.1); os desvios e as dúvidas.

Depois, os comandos que **a pessoa** roda:

```powershell
copy .env.example .env     # e preencher VITE_WHATSAPP_NUMBER=5547999999999 (número fictício)
git add -A
git status                 # conferir: .env fora; .claude/uno/ ainda não existe
git commit -m "Bootstrap do site da Fornalha e do fluxo SDD"
git push -u origin main
```

Por último, o agente copia §8 e §9 deste arquivo para `docs/roteiro-de-teste.md`.

---

## 8. Roteiro de teste do Uno SDD (para a pessoa)

### 8.1 Preparação (uma vez)

1. Bootstrap commitado e pushado (§7). **Os worktrees nascem da branch.** Tudo que precisa estar dentro deles (skills, carimbador, `uno.config.json`) tem que estar commitado na `main` antes do primeiro `worktree new`.
2. `worktree doctor` no checkout principal. Anote o que reprova; o esperado é a cobertura de ignore e, se ainda não ligou, o `core.longpaths`.
3. No app: **Escolher pasta do repositório** → a raiz da Fornalha. O esperado é conectar e o `.claude/uno/daemon.json` aparecer como não rastreado no `git status`. É a única escrita que o daemon faz sozinho.
4. Instalar o fluxo pelo app (ao adotar a primeira task, ou nas Configurações). Confira:
   - a tela lista, **antes** de gravar, o que será criado e o que será mesclado;
   - surgem `sdd-summary.mjs` + `sdd-summary.origin.txt`;
   - o `settings.json` mantém o `UserPromptSubmit` e ganha o `PostToolUse` e os três `deny`;
   - os dois ignores ganham as duas linhas;
   - o `git status` mostra só isso.

   Commit + push.
5. `worktree doctor` de novo. Nenhum bloqueante.

### 8.2 Ondas sugeridas

Uma onda por vez, com até três tasks frias, sempre **um gate humano por vez** e **uma aplicação no ar por vez**.

| Onda | Tasks                     |
| ---- | ------------------------- |
| 1    | FOR-001, FOR-002, FOR-003 |
| 2    | FOR-004, FOR-005, FOR-006 |
| 3    | FOR-007, FOR-008, FOR-009 |
| 4    | FOR-010, FOR-011, FOR-014 |
| 5    | FOR-012, FOR-013, FOR-015 |
| 6    | FOR-016                   |
| 7    | FOR-017                   |

Para começar uma task: `worktree new FOR-00X --create`. Isso cria `feature/FOR-00X` a partir de `origin/main` em `.claude/worktrees/FOR-00X/`. Depois dispare as fases pelo board, ou rode `/plan FOR-00X` numa sessão aberta **dentro** do worktree. Faça o merge na ordem das ondas.

### 8.3 Cenários

| #   | Cenário                                  | Task              | Como                                                                                                                                                             | O que observar                                                                                                                                              |
| --- | ---------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Três worktrees frios em paralelo         | FOR-001/002/003   | `worktree new` nas três; `/plan` nas três pelo board                                                                                                              | três cards ativos; `worktree ls` com as três; título das sessões `SDD-PLAN-FOR-00X`                                                                          |
| 2   | Gate humano e notificação                | FOR-001           | `/question` e deixar esperando                                                                                                                                   | card em "Precisa de você"; notificação do tray; o `SUMARIO.md` não carimba `question` antes de você aprovar                                                  |
| 3   | Terminal embutido e VS Code              | qualquer, no `/feature` | abrir o terminal da task; "Abrir no VS Code"                                                                                                               | `pwd` no terminal é o worktree certo; o VS Code abre a pasta do worktree e depois a sessão; se o deep link falhar, o fallback `claude attach` está visível |
| 4   | Pular fase com motivo                    | FOR-002           | pular `test-plan`, `autotest` e `verify` com o motivo "mudança só de texto; conferida no review"                                                                  | a UI exige o motivo; o `SUMARIO.md` mostra os três pulos com o motivo; a task chega (ou não) a pronta para PR — anotar qual                                |
| 5   | `/spec` sobre relato cru                 | FOR-004           | `/spec FOR-004`                                                                                                                                                  | o task-analyst investiga, pergunta só o que sobrar e reescreve o `TASK.md`; `spec: done` no `SUMARIO.md`                                                    |
| 6   | `.env` como bastão                       | FOR-005           | no `TEST.md`, rodar o CT sem `.env` no worktree frio; `worktree hot FOR-005`; rodar o CT com `.env`                                                              | o board mostra o ambiente local nessa task; um `hot` em outra task tira o `.env` desta                                                                     |
| 7   | Uma aplicação no ar por vez              | FOR-005 + outra   | `npm run dev` em dois worktrees                                                                                                                                  | o segundo falha na porta 5173                                                                                                                               |
| 8   | Gate de layout (canvas)                  | FOR-007           | `/plan`                                                                                                                                                          | o plano classifica como "mudança estrutural", publica o canvas e **espera** a aprovação; o PLAN registra `Layout aprovado:` e o bloco de blindagem           |
| 9   | Empate na triagem visual                 | FOR-008           | `/plan`                                                                                                                                                          | o agente **pergunta** se é ajuste pontual ou mudança estrutural, em vez de decidir sozinho                                                                  |
| 10  | Guard rail de remoção + lockfile divergente | FOR-009        | depois do `/feature`, commit + push da branch; `worktree rm FOR-009`; `worktree rm --force FOR-009`; `worktree new FOR-009`                                     | o primeiro `rm` recusa e lista os commits; o novo worktree nasce **sem** `node_modules` compartilhado e orienta `npm ci`; o `node_modules` do principal fica intacto |
| 11  | Lockfile igual, `node_modules` velho (hipótese) | FOR-010    | depois do merge da FOR-009: `git pull` no principal **sem** `npm install`; `worktree new FOR-010 --create`; `npm run build` no worktree                          | hipótese: o `new` não percebe e o build falha por falta da fonte. Se acontecer, é achado                                                                    |
| 12  | Review BLOQUEADO → correção 5.2          | FOR-011           | antes do `/review-feature`, pôr à mão `text-orange-600` num link do `site-footer.tsx` e commitar                                                                  | a 5.0 (`check:cores`) acusa; `REVIEW.md` BLOQUEADO; você pede a correção; o sub-agente corrige; o veredito vira APROVADO e o `SUMARIO.md` é recarimbado     |
| 13  | Verify FAIL                              | FOR-003           | depois do `/autotest`, enfraquecer um teste (`expect(formatPrice(12.5)).toBeTruthy()`); `/verify` numa sessão nova                                                | o sensor de discriminação acusa a asserção fraca; `verify: blocked · FAIL`                                                                                  |
| 14  | Task parada                              | FOR-012           | `/plan`; commit + push da branch; `worktree rm --force FOR-012`; depois `worktree new FOR-012`                                                                    | a task aparece em "paradas" com a fase derivada; o `new` retoma de onde parou                                                                               |
| 15  | Task concluída no histórico              | FOR-001           | merge do PR na `main`; `git fetch`; `worktree rm FOR-001`                                                                                                        | ela sai das ativas e aparece nas concluídas, com o `SUMARIO.md` da base. O daemon não faz `fetch` sozinho                                                  |
| 16  | Ordem de merge                           | FOR-002 × FOR-005 | fazer o merge de FOR-005 **antes** de FOR-002                                                                                                                    | conflito em `content/hero.ts`: é o que o `Vem depois de` previne                                                                                            |
| 17  | Catálogo enxuto                          | antes da FOR-017  | Configurações → catálogo: tirar `test-plan`, `autotest` e `verify`; passar o papel `autoriza_pr` ao `review`                                                     | `worktree doctor` sem aviso de `phase_commands`; a FOR-017 com cinco fases; o carimbador recusa `--phase verify`                                           |

### 8.4 Cronômetro

Anote as fases de toda task. É a medida que responde se o Uno SDD ficou rápido o bastante.

| Task    | Fase     | Início | Fim | Min | Observação |
| ------- | -------- | ------ | --- | --- | ---------- |
| FOR-001 | plan     |        |     |     |            |
| FOR-001 | question |        |     |     |            |
| …       |          |        |     |     |            |

---

## 9. Registro de achados

Um bloco por achado. Achado vira task `SDD-0NN` no repositório do Uno SDD, do mesmo jeito que a SDD-031 nasceu do primeiro uso real.

```markdown
### A-NN — <título curto>

- **Onde:** app (tela) | daemon | CLI `worktree` | skill/command | carimbador
- **Task / fase:** FOR-00X · /plan
- **Passos:** 1. … 2. …
- **Esperado:** …
- **Observado:** … (print, saída colada)
- **Tempo da fase:** … min
- **Severidade:** bloqueia | atrapalha | cosmético
```
