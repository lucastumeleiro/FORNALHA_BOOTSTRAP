# TEST — FOR-008: Tema escuro com alternância

Teste de mesa executado pela pessoa, no navegador. Todo CT é `Via: UI` (o produto não tem API).

## 1. Pré-requisitos

- Terminal aberto em `.claude/worktrees/FOR-008/`, `npm run dev`, página em `http://localhost:5180`. A porta é fixa: se outra task estiver no ar, derrubar a outra.
- Navegador Chromium com DevTools. Dois recursos usados nos CTs:
  - **Simular o tema do sistema:** DevTools → `⋮` → _More tools_ → _Rendering_ → _Emulate CSS media feature `prefers-color-scheme`_ → `dark` ou `light`. Vale enquanto o DevTools está aberto.
  - **Limpar a escolha salva:** DevTools → _Application_ → _Local Storage_ → `http://localhost:5180` → apagar a chave `fornalha-theme` (ou _Clear All_), e recarregar.
- Largura: _Responsive_ do DevTools em **375 px** ou janela em **≥ 1280 px**, conforme o CT.
- A task **não lê `.env`**: TM-03 não se aplica.
- Fonte de dados: nenhuma (sem banco nem API). **Dados de base: nenhum a reutilizar, nenhum a criar.** O único estado é `localStorage["fornalha-theme"]`, que cada CT declara.

Como conferir o tema no DevTools: aba _Elements_ → elemento `<html>`. O atributo `class` deve conter **`dark`** (escuro) ou **`light`** (claro), nunca os dois.

Antes de cada CT sem pré-condição de armazenamento declarada: limpar `fornalha-theme` e recarregar.

## 2. Cenários de Teste

### CT-01 — Primeira visita com sistema escuro abre escura (CA-1)

**Via:** UI · **Tema:** sistema escuro · **Largura:** ≥ 1280 px

**Pré-condição:** `fornalha-theme` ausente; _Emulate prefers-color-scheme_ = `dark`.

**Passos:**

1. Recarregar a página (`F5`).

**Resultado esperado:**

- A página abre com fundo escuro e texto claro (cabeçalho, hero, cardápio, rodapé).
- `<html class="dark">` (sem `light`).
- O botão do cabeçalho mostra a **lua** (ícone do tema atual).
- _Application → Local Storage_: a chave `fornalha-theme` **continua ausente** (nada é gravado sem clique).

### CT-02 — Primeira visita com sistema claro abre clara (CA-1, contraprova)

**Via:** UI · **Tema:** sistema claro · **Largura:** ≥ 1280 px

**Pré-condição:** `fornalha-theme` ausente; _Emulate prefers-color-scheme_ = `light`.

**Passos:**

1. Recarregar a página.

**Resultado esperado:**

- Página clara; `<html class="light">`.
- O botão mostra o **sol**.
- `fornalha-theme` continua ausente.

### CT-03 — Clique alterna claro ↔ escuro e a classe do `<html>` acompanha (CA-2)

**Via:** UI · **Tema:** parte do claro · **Largura:** ≥ 1280 px

**Pré-condição:** sistema `light` (emulado), `fornalha-theme` ausente, página recarregada e clara.

**Passos:**

1. Clicar no botão do cabeçalho (sol).
2. Clicar de novo (lua).
3. Clicar uma terceira vez.

**Resultado esperado:**

- Passo 1: a página fica escura; `<html class="dark">`; o ícone vira **lua**; `fornalha-theme` = `dark`.
- Passo 2: volta ao claro; `<html class="light">`; ícone **sol**; `fornalha-theme` = `light`.
- Passo 3: escuro de novo; `dark` / lua / `dark`.
- A classe `dark` aparece e some no `<html>` a cada clique; nunca `light` e `dark` juntos. Sem recarregar a página nem rolar de volta ao topo.

### CT-04 — Primeiro clique em `system` vai para o oposto do tema na tela (CA-2, Q3.2)

**Via:** UI · **Largura:** ≥ 1280 px

**Pré-condição:** `fornalha-theme` ausente (provider em `system`).

**Passos:**

1. Emular sistema `dark`, recarregar (página escura). Clicar no botão uma vez.
2. Limpar `fornalha-theme`. Emular sistema `light`, recarregar (página clara). Clicar no botão uma vez.

**Resultado esperado:**

- Passo 1: a página **muda para o claro** (`<html class="light">`, `fornalha-theme` = `light`). O clique nunca "não faz nada".
- Passo 2: a página **muda para o escuro** (`<html class="dark">`, `fornalha-theme` = `dark`).

### CT-05 — A escolha persiste ao recarregar (CA-3)

**Via:** UI · **Largura:** ≥ 1280 px

**Pré-condição:** sistema `light` (emulado), `fornalha-theme` ausente.

**Passos:**

1. Recarregar; clicar no botão até a página ficar escura (`fornalha-theme` = `dark`).
2. Recarregar (`F5`).
3. Fechar a aba, abrir `http://localhost:5180` em outra aba.
4. Clicar no botão para voltar ao claro (`fornalha-theme` = `light`). Trocar a emulação do sistema para `dark`. Recarregar.

**Resultado esperado:**

- Passos 2 e 3: continua escura, `<html class="dark">`, ícone lua.
- Passo 4: a escolha explícita vence o sistema: a página abre **clara** (`<html class="light">`) mesmo com o sistema escuro.

### CT-06 — Só teclado: chegar, ver o foco, alternar (CA-4)

**Via:** UI · **Largura:** ≥ 1280 px · **Executar nos dois temas** (repetir com a página clara e com a escura)

**Pré-condição:** sem usar o mouse depois de carregar. Clicar uma vez numa área vazia da página só para tirar o foco da barra de endereço, ou recarregar e começar pelo `Tab`.

**Passos:**

1. Pressionar `Tab` repetidamente a partir do topo da página, anotando a ordem do foco.
2. Com o foco no botão do tema, pressionar `Enter`.
3. Pressionar `Espaço`.
4. Pressionar `Enter` outra vez.

**Resultado esperado:**

- Passo 1: o foco passa pelos links do menu (Cardápio, Contato) e **chega ao botão de tema** logo depois deles, sem armadilha de foco.
- Com o foco no botão há **anel de foco visível** (contorno/ring), perceptível em ambos os temas contra o fundo do cabeçalho.
- Passos 2, 3 e 4: cada acionamento alterna o tema (claro→escuro→claro→escuro); o foco **permanece** no botão depois de cada alternância (anel continua visível); `Espaço` não rola a página.
- `Shift+Tab` volta do botão para o link "Contato".

### CT-07 — Cabeçalho com o botão em 375 px e em ≥ 1280 px, nos dois temas

**Via:** UI

**Pré-condição:** repetir nas quatro combinações: {claro, escuro} × {375 px, ≥ 1280 px}.

**Passos:**

1. Observar o cabeçalho: marca "Fornalha" à esquerda; menu e botão à direita.
2. Em 375 px, conferir se há rolagem horizontal da página.
3. Inspecionar o botão (_Elements_ → _Computed_) e anotar a largura e a altura.
4. Alternar o tema e observar o cabeçalho na outra cor.

**Resultado esperado:**

- Marca à esquerda; "Cardápio", "Contato" e o botão agrupados à direita, alinhados na vertical, com espaço entre o menu e o botão. O botão **não fica no meio** do cabeçalho nem sobre o menu.
- Em 375 px: nada quebra de linha nem corta; **sem rolagem horizontal**.
- Botão com **32 × 32 px** (`size-8`). Registrar o valor: é o tamanho decidido no PLAN (premissa 7), ao qual a pessoa confere se serve de alvo de toque. Não é defeito se for 32 px; se a pessoa o considerar pequeno em celular, anotar como pendência de design, não como falha do CT.
- O botão não tem fundo próprio por padrão (variante `ghost`) e mostra fundo sutil ao passar o mouse, legível nos dois temas.

### CT-08 — Acessibilidade do botão (CA-2, CA-4)

**Via:** UI · **Largura:** ≥ 1280 px

**Passos:**

1. _Elements_ → selecionar o botão do cabeçalho.
2. Conferir o elemento e os atributos.
3. Alternar o tema e conferir os atributos de novo.
4. _Accessibility_ (painel ao lado de _Computed_): ler o nome acessível.

**Resultado esperado:**

- É um `<button>` nativo com `aria-label="Alternar tema"`.
- Os dois `<svg>` (sol e lua) têm `aria-hidden="true"`; apenas um é exibido por vez (o outro tem `display: none`).
- O `aria-label` **não muda** quando o tema alterna (rótulo fixo, Q3.1).
- Nome acessível = "Alternar tema"; papel = _button_.

### CT-09 — Valor salvo inválido cai no padrão (borda)

**Via:** UI · **Largura:** ≥ 1280 px

**Pré-condição:** sistema `dark` emulado.

**Passos:**

1. _Application → Local Storage_: criar/editar `fornalha-theme` com o valor `roxo` (qualquer texto fora de `light`, `dark`, `system`).
2. Recarregar.
3. Clicar no botão.
4. Editar `fornalha-theme` para `system` e recarregar.

**Resultado esperado:**

- Passo 2: a página abre **sem erro** (sem tela em branco) no tema do sistema (escuro); `<html class="dark">`. O Console não mostra erro vermelho.
- Passo 3: alterna para o claro e `fornalha-theme` passa a `light` (o valor inválido é sobrescrito).
- Passo 4: com `system` e sistema escuro, a página abre escura.

### CT-10 — `localStorage` bloqueado: a página abre e o botão ainda alterna na sessão (borda, Q5.2)

**Via:** UI · **Largura:** ≥ 1280 px

**Pré-condição:** Chromium com dados de site bloqueados: `chrome://settings/cookies` → _Block all cookies_ (ou equivalente do navegador usado). Sistema `light`. Aba nova com `http://localhost:5180`.

**Passos:**

1. Abrir a página com o armazenamento bloqueado.
2. Clicar no botão.
3. Clicar de novo.
4. Recarregar.
5. Ao terminar, **restaurar** a configuração de cookies do navegador.

**Resultado esperado:**

- Passo 1: a página **abre normalmente** (não fica em branco); tema do sistema (claro). Console sem erro não tratado de `localStorage`.
- Passos 2 e 3: o tema alterna na sessão (classe do `<html>` muda; ícone muda), sem persistir.
- Passo 4: volta ao tema do sistema, pois nada foi salvo.

> Se o navegador não bloquear `localStorage` em `localhost` com essa configuração, o CT não é executável pela UI; registrar em Premissas e Incertezas e deixar a cobertura para o teste automatizado (Fase 6b, `Storage.prototype` stubado, como previsto no PLAN).

### CT-11 — Mudar o sistema com a página aberta não atualiza a tela (comportamento declarado, Q5.1)

**Via:** UI · **Largura:** ≥ 1280 px

**Pré-condição:** `fornalha-theme` ausente (`system`); sistema `light` emulado; página recarregada e clara.

**Passos:**

1. Trocar a emulação de _prefers-color-scheme_ para `dark`, **sem recarregar**.
2. Observar a página.
3. Recarregar.

**Resultado esperado:**

- Passo 2: a página **continua clara** — esse comportamento está declarado como fora de escopo (a TASK e o PLAN dizem que quem está em `system` vê o tema novo ao recarregar). Não é defeito.
- Passo 3: a página abre escura.

### CT-12 — Página inteira legível no tema escuro, sem mudança de cor (TM-01, premissa P2)

**Via:** UI · **Tema:** escuro (e claro como referência) · **Largura:** ≥ 1280 px **e** 375 px

**Passos:**

1. Com a página escura, rolar do topo ao rodapé: cabeçalho, hero, cardápio (cartões, filtros/botões se houver), contato, rodapé.
2. Repetir em 375 px.
3. Comparar com o tema claro: nada novo foi introduzido, apenas troca dos tokens `.dark` já existentes.
4. Nos textos secundários (menu em `text-muted-foreground`, descrições dos cartões), conferir o contraste no DevTools (_Inspect_ → o seletor de cor mostra a razão de contraste; mínimo 4,5:1 para texto normal).

**Resultado esperado:**

- Nenhum texto, borda, cartão ou botão some, fica ilegível ou continua claro sobre fundo claro (sem "ilhas" brancas no escuro).
- Contraste ≥ 4,5:1 nos textos conferidos, nos dois temas.
- Se algo ficar ilegível, é **defeito de token em `src/index.css`**, fora do escopo desta task: registrar no `MEMORY.md`, não corrigir aqui (PLAN §Pontos de Atenção).

## 3. Matriz de Rastreabilidade

| Critério | Descrição                                                          | CTs                                  |
| -------- | ------------------------------------------------------------------ | ------------------------------------ |
| CA-1     | Primeira visita com sistema escuro abre escura                     | CT-01, CT-02, CT-09, CT-10, CT-11    |
| CA-2     | Clique alterna o tema e o `<html>` ganha/perde a classe `dark`     | CT-03, CT-04, CT-08, CT-10           |
| CA-3     | Escolhi o escuro, recarrego, continua escuro                       | CT-05, CT-09                         |
| CA-4     | Só teclado: `Tab` chega ao botão, foco visível, `Enter`/`Espaço`   | CT-06, CT-08                         |
| —        | Layout do cabeçalho com o botão (TM-02, PLAN passo 4)              | CT-07                                |
| —        | Legibilidade nos dois temas (TM-01, TASK P2)                       | CT-12                                |

Regras do `teste-de-mesa`: TM-01 → CT-01 a CT-06, CT-12 (os dois temas); TM-02 → CT-07 e CT-12 (375 px e ≥ 1280 px); TM-03 → não se aplica (sem `.env`); TM-04 → CT-06 (só teclado).

Decisões da Fase 3 cobertas: Q3.1 (rótulo fixo) → CT-08; Q3.2 (oposto do tema efetivo) → CT-04; Q3.3 (ícone do tema atual) → CT-01, CT-02, CT-03; Q5.1 (sem reação ao sistema ao vivo) → CT-11; Q5.2 (`localStorage` que lança) → CT-10; Q1.2 (wrapper do cabeçalho) → CT-07. Nenhum item ❌ (descartado) em `QUESTION.md`; nenhum CT para cenário descartado.

## 4. Premissas e Incertezas

**Premissas**

1. A emulação de _prefers-color-scheme_ do DevTools representa o tema do sistema para `matchMedia` (é o mecanismo que o provider lê).
2. Nada é gravado em `localStorage` antes do primeiro clique (o provider só grava em `setTheme`), logo a "primeira visita" de CT-01/CT-02 é verificável pela ausência da chave.
3. Para o estado inicial limpo vale apagar só `fornalha-theme`; a página não usa outras chaves.

**Incertezas**

1. **Alvo de toque (PLAN premissa 7):** o botão mede `size-8` = 32 × 32 px. CT-07 registra a medida; se serve em celular é decisão de design da pessoa, não critério da TASK.
2. **CT-10:** depende de o navegador lançar erro em `localStorage` em `localhost` com cookies bloqueados. Se não lançar, a cobertura fica só no teste automatizado da Fase 6b.
3. **Piscar do tema no carregamento:** fora de escopo; pode aparecer um relance de tema claro antes do escuro em CT-01/CT-05. Não é falha.
4. **Contraste do tema escuro (CT-12):** a TASK assume que os tokens `.dark` bastam (P2), mas nenhuma task anterior os conferiu. Falha aqui vira registro no `MEMORY.md`, não correção desta task.
