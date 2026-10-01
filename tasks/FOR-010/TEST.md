# TEST — FOR-010: Perguntas frequentes

**Referências:** [TASK.md](TASK.md) · [plans/PLAN-01-faq.md](plans/PLAN-01-faq.md) · [MEMORY.md](MEMORY.md)
**Fase 3 (`/question`):** pulada; não há `QUESTION.md`, então nenhum cenário foi descartado e nenhuma decisão mudou o comportamento esperado.
**Fase 5 (`/review-feature`):** pulada; este plano parte do código como está no worktree.

## 1. Pré-requisitos

### Ambiente

1. Abrir um terminal em `.claude/worktrees/FOR-010/`.
2. `npm run dev` e abrir `http://localhost:5180`. A porta é fixa: se outra task estiver no ar, derrubar a outra antes.
3. A task **não lê `.env`** (a seção não usa WhatsApp nem variável de ambiente), então não há CT com e sem `.env` (TM-03 não se aplica).
4. Navegador com DevTools aberto (aba Elements para conferir `aria-*` e `<html class>`, aba Console para erros).

### Como trocar tema e largura

- **Tema claro:** `<html>` sem a classe `dark` (estado inicial).
- **Tema escuro:** no DevTools, em Elements, adicionar a classe `dark` ao `<html>`. A página não tem botão de tema.
- **Largura:** DevTools → modo dispositivo → 375 px (celular) ou ≥ 1280 px (desktop).

### Dados de base

Não há fonte de dados (sem banco, API ou storage). O conteúdo vem de `src/content/faq.ts`.

- **(a) Reutilizados:** nenhum cadastro. O cardápio (`src/data/products.ts`) e os horários (`src/content/hours.ts`) já existem e só são conferidos como regressão no CT-10.
- **(b) A criar:** nada.

### Texto de referência (EPIC §Perguntas frequentes)

| #   | Pergunta                                         | Resposta                                                                                |
| --- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| 1   | Vocês abrem na segunda?                          | Não. Segunda é o dia de alimentar o fermento e limpar o forno.                          |
| 2   | Até quando posso encomendar para o fim de semana? | Até sexta, 18h.                                                                         |
| 3   | Tem pão sem glúten?                              | Não. Tudo que sai do forno leva trigo, e não dá para garantir ausência de contaminação. |
| 4   | O pão dura quantos dias?                         | De três a quatro, embrulhado em pano. Para durar mais, fatie e congele.                 |
| 5   | Aceitam cartão?                                  | Sim: débito, crédito e Pix.                                                             |

## 2. Cenários de Teste

### CT-01 — As cinco perguntas aparecem, fechadas, entre Cardápio e Horários

**Cobre:** CA-1, Comportamento Esperado 2 e 3
**Via:** UI
**Pré-condição:** tema claro, ≥ 1280 px.

**Passos**

1. Abrir `http://localhost:5180` e rolar até a seção "Perguntas frequentes".

**Resultado esperado**

- A seção fica **depois** de "Cardápio" e **logo antes** de "Horários e endereço".
- Título "Perguntas frequentes" e, abaixo, o subtítulo "O que mais perguntam por aqui." (provisório, ver Incerteza I3).
- Cinco perguntas, na ordem da tabela acima, cada uma com chevron para baixo à direita e um separador entre itens (sem separador depois da última).
- **Nenhuma resposta visível.** No DevTools, os cinco botões têm `aria-expanded="false"` e `data-state="closed"`.
- A lista não ocupa a largura toda do container (fica mais estreita que o título/container).
- No DevTools, `<section id="perguntas">` existe.

### CT-02 — Textos idênticos aos do EPIC

**Cobre:** CA-1, TASK P1
**Via:** UI
**Pré-condição:** tema claro, ≥ 1280 px.

**Passos**

1. Abrir uma pergunta por vez (1 a 5) e ler a resposta.

**Resultado esperado**

- Pergunta e resposta de cada item são **idênticas** às da tabela de referência, caractere a caractere (acentos, "18h", "Pix", dois-pontos em "Sim: débito…").

### CT-03 — Abrir outra pergunta fecha a primeira

**Cobre:** CA-2, TASK P2
**Via:** UI
**Pré-condição:** tema claro, ≥ 1280 px, página recém-carregada.

**Passos**

1. Clicar na pergunta 1. Conferir que a resposta 1 aparece e o chevron vira para cima.
2. Clicar na pergunta 3.
3. Clicar na pergunta 5.

**Resultado esperado**

- Após o passo 2: resposta 3 visível; resposta 1 **fechada** (`aria-expanded="false"`); chevron da pergunta 1 volta para baixo.
- Após o passo 3: só a resposta 5 visível.
- Em nenhum momento há dois itens com `aria-expanded="true"`.
- Não há salto de layout além do esperado pela abertura/fechamento (os itens abaixo sobem e descem).

### CT-04 — Clicar de novo na pergunta aberta a fecha (`collapsible`)

**Cobre:** TASK I1 (decisão provisória do PLAN: `collapsible`)
**Via:** UI
**Pré-condição:** tema claro, ≥ 1280 px.

**Passos**

1. Clicar na pergunta 2 (abre).
2. Clicar na pergunta 2 de novo.

**Resultado esperado**

- A resposta fecha e **todas** as perguntas voltam a ficar fechadas.
- Se a pessoa decidir que a pergunta aberta não deve fechar, este CT falha por decisão, não por defeito (ver Incerteza I1).

### CT-05 — Navegação só com teclado: `Tab`, `Enter`, `Espaço`, foco visível

**Cobre:** CA-3, TM-04
**Via:** UI (sem usar o mouse em nenhum passo)
**Pré-condição:** tema claro, ≥ 1280 px, página recém-carregada, foco no corpo da página (clicar numa área vazia e não usar mais o mouse, ou recarregar).

**Passos**

1. Pressionar `Tab` repetidamente até o foco chegar na seção "Perguntas frequentes" (passa por links do cabeçalho, botão do Hero, etc.).
2. Anotar quando o foco cair na pergunta 1.
3. Pressionar `Tab` até a pergunta 5, anotando a ordem.
4. Voltar com `Shift+Tab` até a pergunta 2. Pressionar `Enter`.
5. Com o foco ainda na pergunta 2, pressionar `Enter` de novo.
6. Pressionar `Tab` para a pergunta 3 e pressionar `Espaço`.
7. Pressionar `Tab` para a pergunta 4 e pressionar `Espaço` (a 3 deve fechar).
8. Pressionar `Tab` mais uma vez a partir da pergunta 5, aberta ou não.

**Resultado esperado**

- Cada uma das cinco perguntas recebe foco **uma vez**, na ordem visual (1 → 5). Respostas fechadas não recebem foco.
- O foco é **visível** em cada pergunta: borda e anel (`ring`) na cor do tema ao redor do botão. Conferir no DevTools que `:focus-visible` aplica `ring`/`border-ring`.
- Passo 4: `Enter` abre a resposta 2. Passo 5: `Enter` fecha (CT-04).
- Passo 6: `Espaço` abre a resposta 3. Passo 7: `Espaço` abre a 4 e a 3 fecha.
- A página **não rola sozinha** ao pressionar `Espaço` sobre uma pergunta (o `Espaço` aciona o botão, não rola).
- Passo 8: o foco sai da lista e segue para o próximo elemento focável da página (sem armadilha de foco).
- Extra, sem bloquear: `↓`, `↑`, `Home` e `End` movem o foco entre as perguntas (comportamento do Radix). Se funcionarem, registrar; se não, não é falha.

### CT-06 — Tema escuro: leitura, separador e foco

**Cobre:** CA-1, CA-3, TM-01
**Via:** UI
**Pré-condição:** tema escuro (`class="dark"` no `<html>`), ≥ 1280 px.

**Passos**

1. Rolar até a seção. Abrir a pergunta 3.
2. Com `Tab`, levar o foco a outra pergunta.
3. No DevTools, conferir o contraste do texto da resposta (`text-muted-foreground`) contra o fundo da página.

**Resultado esperado**

- Título, subtítulo, perguntas, respostas, chevrons e separadores legíveis sobre o fundo escuro; nada some nem fica branco sobre branco.
- O separador entre itens é visível, ainda que sutil.
- O anel de foco é visível no escuro.
- Contraste do texto da resposta **≥ 4,5:1** (o inspetor de cor do DevTools mostra a razão).
- Voltar ao tema claro (remover `dark`) restaura o visual do CT-01.

### CT-07 — Celular (375 px): layout e quebra de linha

**Cobre:** CA-1, CA-2, TM-02
**Via:** UI
**Pré-condição:** 375 px, tema claro.

**Passos**

1. Abrir a página e rolar até a seção.
2. Conferir a pergunta 2 ("Até quando posso encomendar para o fim de semana?"), a mais longa.
3. Abrir a pergunta 3 (resposta mais longa), depois a 1.
4. Repetir os passos 2 e 3 no tema escuro.

**Resultado esperado**

- A lista ocupa a largura do container, com a margem lateral do resto da página.
- A pergunta 2 **quebra em duas linhas** sem estourar o container; o chevron fica à direita, alinhado ao topo da primeira linha, e **não é espremido** nem sobrepõe o texto.
- A resposta 3 quebra linha normalmente.
- **Sem rolagem horizontal** na página (a barra horizontal não aparece).
- O alvo de toque de cada pergunta é confortável (toda a linha da pergunta responde ao toque, não só o texto).
- Abrir a 1 fecha a 3 (CA-2 no celular).

### CT-08 — Semântica: hierarquia de títulos e atributos ARIA

**Cobre:** TASK I2, CA-3 (acessibilidade do gatilho)
**Via:** UI (conferência no DevTools)
**Pré-condição:** ≥ 1280 px, tema claro.

**Passos**

1. No DevTools → Elements, expandir `<section id="perguntas">`.
2. Conferir o `h2` e, em cada item, o elemento que envolve o botão da pergunta.
3. Conferir, no botão aberto, `aria-expanded` e `aria-controls`, e, no painel, `role="region"` e `aria-labelledby`.
4. Na aba Accessibility do DevTools (ou em uma extensão de outline de títulos), ver a hierarquia de títulos da página.

**Resultado esperado**

- Um único `h1` na página (Hero) e o `h2` da seção.
- Cada pergunta é um `h3` (`<h3 data-orientation… >` do `AccordionPrimitive.Header`) com o `<button>` dentro.
- Hierarquia sem salto: `h1 → h2 (Cardápio) → h2 (Perguntas frequentes) → h3 ×5 → h2 (Horários)`.
- `aria-controls` do botão aponta para o `id` do painel; `aria-labelledby` do painel aponta para o `id` do botão.
- Resultado alimenta a decisão da Incerteza I2.

### CT-09 — Âncora `#perguntas` e menu do cabeçalho inalterado

**Cobre:** Comportamento Esperado 2 (`id="perguntas"`), TASK P3
**Via:** UI
**Pré-condição:** ≥ 1280 px, tema claro.

**Passos**

1. No cabeçalho, conferir os itens do menu.
2. Clicar em "Cardápio" e depois em "Contato".
3. Na barra de endereço, abrir `http://localhost:5180/#perguntas`.

**Resultado esperado**

- O menu continua com **só** "Cardápio" e "Contato" (nenhum item novo, TASK P3).
- "Cardápio" e "Contato" continuam rolando para suas seções.
- `/#perguntas` rola até o título "Perguntas frequentes", com as cinco perguntas fechadas.

### CT-10 — Regressão: demais seções e console

**Cobre:** Passo 4 do PLAN (mudança em `App.tsx`)
**Via:** UI
**Pré-condição:** ≥ 1280 px, tema claro.

**Passos**

1. Rolar a página inteira, do cabeçalho ao rodapé.
2. Olhar a aba Console do DevTools durante o carregamento e depois de abrir e fechar perguntas.

**Resultado esperado**

- Ordem das seções: Cabeçalho · Hero · Cardápio · **Perguntas frequentes** · Horários e endereço · Rodapé. (Quem já provou e Encomenda são de outras tasks e podem ainda não existir.)
- Cardápio, Horários e rodapé aparecem como antes, sem alteração visual.
- **Nenhum erro nem aviso** no Console (em particular, nenhum aviso de `key` duplicada ou de `aria`).
- A animação de abrir e fechar não deixa o conteúdo cortado nem um espaço vazio ao final.

### CT-11 — `accordion.tsx` é o que o CLI gerou

**Cobre:** CA-4
**Via:** inspeção de arquivo e terminal. **Justificativa:** a UI não mostra a origem do arquivo; este critério é sobre o código-fonte.
**Pré-condição:** terminal em `.claude/worktrees/FOR-010/`. **Não** rodar `npm run dev` para este CT.

**Passos**

1. `git status --short` e conferir que `src/components/ui/accordion.tsx` aparece como novo e que **não** há alteração em `src/index.css`, `src/components/ui/button.tsx`, `badge.tsx` nem `card.tsx`.
2. `git diff -- package.json package-lock.json` deve vir vazio.
3. Comparar o arquivo com a saída do CLI sem escrever nada: `npx shadcn@latest add accordion --dry-run` (ou `npx shadcn@latest view accordion`, conforme a versão instalada) e confirmar que o conteúdo de `accordion.tsx` coincide, ignorando a troca de alias `cn` do projeto (ver Incerteza I4).
4. Abrir `src/components/ui/accordion.tsx` e conferir que não há `style=` inline, hex/rgb nem comentário da casa.
5. `npm run check:cores` deve passar.

**Resultado esperado**

- Arquivo novo, sem edição manual: mesma estrutura do que o CLI emite (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `data-slot="accordion*"`, `ChevronDownIcon`/`ChevronUpIcon`).
- `package.json` e lockfile sem mudança (o registro do `radix-ui` e do `lucide-react` já existiam).
- Estilo do arquivo é o mesmo dos outros primitivos (`button.tsx`, `card.tsx`): importa `cn` de `"cn"`.
- `check:cores` com saída de sucesso.

## 3. Matriz de Rastreabilidade

| Critério / item da TASK                       | CTs                        |
| --------------------------------------------- | -------------------------- |
| **CA-1** cinco perguntas, fechadas            | CT-01, CT-02, CT-06, CT-07 |
| **CA-2** abrir outra fecha a primeira         | CT-03, CT-07               |
| **CA-3** teclado, `Tab`, `Enter`/`Espaço`, foco visível | CT-05, CT-06, CT-08 |
| **CA-4** `accordion.tsx` é o gerado pelo CLI  | CT-11                      |
| Comportamento Esperado 1 (`add accordion`)    | CT-11                      |
| Comportamento Esperado 2 (`id="perguntas"`, antes de Horários) | CT-01, CT-09, CT-10 |
| Comportamento Esperado 3 (uma aberta, todas fechadas) | CT-01, CT-03       |
| P1 texto do EPIC sem reescrita                | CT-02                      |
| P2 `type="single"`                            | CT-03                      |
| P3 menu do cabeçalho inalterado               | CT-09                      |
| I1 `collapsible`                              | CT-04, CT-05               |
| I2 hierarquia de títulos                      | CT-08                      |

**Regras do teste de mesa:** TM-01 (dois temas) em CT-06 e CT-07; TM-02 (375 px e ≥ 1280 px) em CT-01 a CT-06 e CT-07; TM-03 não se aplica (sem `.env`); TM-04 (só teclado) em CT-05.

## 4. Premissas e Incertezas

### Premissas

- Valem as da TASK (P1 a P3) e as do PLAN. Cinco itens, ordem do EPIC.
- Nenhum CT precisa de dado novo: o conteúdo é estático.
- O tema escuro se testa pondo `class="dark"` no `<html>`, porque a página não tem alternador.

### Incertezas

- **I1 — `collapsible`:** a TASK não define se a pergunta aberta fecha ao ser clicada de novo. A implementação usa `collapsible` (default do PLAN, sem passar pela `/question`). CT-04 documenta o comportamento atual; se a decisão for outra, o CT e o código mudam.
- **I2 — Hierarquia de títulos:** o gatilho gerado envolve cada pergunta num `h3`. CT-08 confere o resultado, mas a decisão de manter cinco `h3` na página é da pessoa.
- **I3 — Subtítulo:** "O que mais perguntam por aqui." é provisório (o EPIC não define). CT-01 só confere que o subtítulo aparece, não que o texto é o definitivo.
- **I4 — Importação de `cn`:** `accordion.tsx` importa `cn` de `"cn"`, igual a `button.tsx`, `badge.tsx` e `card.tsx`, o que indica que é a saída do CLI com a configuração deste repositório. Não há como provar o byte a byte sem rodar o CLI; o CT-11 (passo 3) depende de a versão instalada suportar `--dry-run` ou `view`. Se não suportar, a conferência fica por comparação visual com os outros primitivos.
- **Lacuna — CA-4 sem UI:** CA-4 é sobre arquivo, não há CT pela UI. É a única exceção à regra "todo CT é UI" deste produto.
- **Lacuna — leitor de tela:** não há CT com leitor de tela real; CT-08 confere só os atributos ARIA.
- **Não coberto:** animação de abrir e fechar além da checagem de CT-10; `prefers-reduced-motion`; navegador diferente do que a pessoa usar.
