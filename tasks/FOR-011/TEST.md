# TEST — FOR-011: Rodapé com redes e ano automático

Teste de mesa, executado pela pessoa no navegador. Todo CT é `Via: UI` (o produto não tem API).

## 1. Pré-requisitos

**Ambiente**

1. Terminal aberto em `.claude/worktrees/FOR-011/` (ou o terminal embutido do app).
2. `node_modules` já existe neste worktree. Se não existir, `npm install` antes.
3. O ambiente tem dois estados, e a task lê `.env` (TM-03):
   - **Frio (sem `.env`):** estado inicial do worktree. Confirmar com `dir .env` (deve falhar).
   - **Quente (com `.env`):** rodar `worktree hot FOR-011`. Confirmar que o `.env` existe e que `VITE_WHATSAPP_NUMBER` tem dígitos. Se o `.env` copiado vier sem número, editar a linha para `VITE_WHATSAPP_NUMBER=5547999990000`.
4. `npm run dev` e abrir `http://localhost:5180` (porta fixa; se outra task estiver no ar, o comando falha e é preciso derrubar a outra). **Depois de trocar de estado frio ↔ quente, parar o `npm run dev` e subir de novo**: o Vite lê o `.env` só na partida.

**Como mudar o tema.** O site não tem botão de tema. Para o escuro: DevTools → Elements → `<html>` → adicionar a classe `dark` (clique direito no elemento → *Edit attribute* → `class="dark"`). Para voltar ao claro, remover a classe. Recarregar a página volta ao claro.

**Como mudar a largura.** DevTools → *Toggle device toolbar* (`Ctrl+Shift+M`) → *Dimensions: Responsive* → 375 px, ou fechar o toolbar para ≥ 1280 px.

**Onde fica o rodapé.** Último bloco da página (`<footer id="contato">`), abaixo da seção de horários. Contém: endereço, linha com os links de redes e linha de copyright.

**Textos esperados** (vêm de `src/content/footer.ts`):

| Item                      | Valor                                                  |
| ------------------------- | ------------------------------------------------------ |
| Endereço                  | `Rua do Forno, 120 — Centro`                           |
| Link Instagram (texto)    | `Instagram`                                            |
| Link Instagram (aria)     | `Abrir o Instagram da Fornalha em nova aba`            |
| Link Instagram (href)     | `https://instagram.com/fornalha.padaria`               |
| Link WhatsApp (texto)     | `WhatsApp`                                             |
| Link WhatsApp (aria)      | `Abrir conversa com a Fornalha no WhatsApp em nova aba` |
| Mensagem do WhatsApp      | `Olá, vim pelo site da Fornalha.`                      |
| Copyright                 | `© {ano} Fornalha`                                     |

**Ano atual da máquina:** o testador anota aqui o ano que o relógio do sistema mostra (`____`). Nos CTs, `{ano}` é esse valor.

## 2. Dados de Base

Não há fonte de dados (sem banco, sem API, sem storage). Nada a reaproveitar nem a criar. A única "massa" é a variável `VITE_WHATSAPP_NUMBER`:

- **(a) Reutilizado:** o `.env` do checkout principal, copiado por `worktree hot FOR-011`. Localização: arquivo `.env` na raiz do worktree, linha `VITE_WHATSAPP_NUMBER=`.
- **(b) A criar:** nada, a menos que o `.env` copiado esteja sem número (aí o passo 3 de Ambiente).

Número de referência usado nos CTs: `5547999990000`. Se o seu `.env` tiver outro, trocar nos resultados esperados (só os dígitos entram na URL; a máscara é removida).

## 3. Cenários de Teste

### Bloco A — Sem `.env` (worktree frio)

#### CT-01 — Ano vem do relógio e o rodapé não mostra "2025"

- **Cobre:** CA-1 (parte observável), Comportamento Esperado 1 · **Tipo:** happy path · **Via:** UI
- **Pré-condição:** estado frio, tema claro, ≥ 1280 px. Aplicação no ar.
- **Passos:**
  1. Abrir `http://localhost:5180`.
  2. Rolar até o fim da página.
  3. Ler a linha de copyright no rodapé.
  4. No DevTools → Console, rodar `new Date().getFullYear()` e comparar.
  5. No DevTools → Elements, buscar (`Ctrl+F`) por `2025` dentro de `<footer>`.
- **Resultado esperado:**
  - A linha mostra `© {ano} Fornalha`, com o ano igual ao do Console (em 2026-10-02, `© 2026 Fornalha`).
  - O símbolo, o ano e a marca estão separados por um espaço cada, sem espaço duplo nem texto cortado.
  - A busca por `2025` no `<footer>` não encontra nada.
  - O endereço `Rua do Forno, 120 — Centro` continua acima, igual a antes (P3).

#### CT-02 — Ano muda com o relógio (cenário 2027 do CA-1)

- **Cobre:** CA-1 · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado frio, tema claro, ≥ 1280 px. Requer alterar a data do sistema operacional; **opcional**, só se a pessoa aceitar mexer no relógio da máquina.
- **Passos:**
  1. Parar o `npm run dev`.
  2. Desligar a hora automática do Windows e ajustar a data para qualquer dia de 2027 (ex.: 15/01/2027).
  3. Subir `npm run dev`, abrir `http://localhost:5180` (aba nova, ou `Ctrl+Shift+R`).
  4. Rolar até o rodapé.
  5. **Restaurar a hora automática do Windows** ao terminar.
- **Resultado esperado:** a linha de copyright mostra `© 2027 Fornalha`.
- **Observação:** se a pessoa não quiser alterar o relógio, este CT fica como **não executado** e o CA-1 é coberto pelo teste automatizado (`vi.setSystemTime` em 2027, Fase 6b `/autotest`). Registrar o motivo.

#### CT-03 — Sem número, só o Instagram aparece

- **Cobre:** CA-2, Comportamento Esperado 2 (P2) · **Tipo:** happy path / erro de configuração · **Via:** UI
- **Pré-condição:** estado **frio** (`dir .env` falha), `npm run dev` iniciado depois disso. Tema claro, ≥ 1280 px.
- **Passos:**
  1. Abrir `http://localhost:5180` e rolar até o rodapé.
  2. Contar os links da linha de redes.
  3. No DevTools → Elements, expandir `<footer id="contato">` → `<ul>` e contar os `<li>`.
  4. Procurar (`Ctrl+F` no Elements) por `wa.me` e por `WhatsApp` na página inteira.
- **Resultado esperado:**
  - Aparece **apenas** `Instagram`.
  - A `<ul>` tem exatamente 1 `<li>`.
  - A busca por `wa.me` não encontra nada no rodapé. (O hero também não deve mostrar o botão de WhatsApp: mesma regra, só conferência de coerência.)
  - Nenhum buraco visual onde o WhatsApp estaria; o Instagram fica alinhado à esquerda, com o mesmo recuo do endereço.
  - Console sem erros nem avisos de React.

#### CT-04 — Link do Instagram: destino, nova aba e nome acessível

- **Cobre:** CA-3, Comportamento Esperado 2 · **Tipo:** happy path · **Via:** UI
- **Pré-condição:** estado frio, tema claro, ≥ 1280 px.
- **Passos:**
  1. No rodapé, DevTools → Elements → selecionar o `<a>` do Instagram.
  2. Ler os atributos `href`, `target`, `rel` e `aria-label`.
  3. Na aba *Accessibility* do DevTools, ler *Computed Properties → Name* e *Role*.
  4. Passar o mouse sobre o link e ver a barra de status do navegador.
  5. Clicar no link.
- **Resultado esperado:**
  - `href="https://instagram.com/fornalha.padaria"`; `target="_blank"`; `rel="noopener noreferrer"` (os dois tokens); `aria-label="Abrir o Instagram da Fornalha em nova aba"`.
  - *Role:* `link`; *Name:* `Abrir o Instagram da Fornalha em nova aba`.
  - O texto visível é `Instagram`, **sem ícone** (nem `<svg>` dentro do `<a>`).
  - O clique abre o Instagram em **nova aba**; a aba da Fornalha continua aberta e no mesmo ponto da rolagem.
  - No hover, a cor do texto passa de `muted-foreground` para `foreground` (fica mais escura no claro).

#### CT-05 — Tema escuro, sem `.env`

- **Cobre:** TM-01, DS-02 (aparência), CA-3 (nome acessível preservado) · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado frio, ≥ 1280 px. Adicionar a classe `dark` no `<html>`.
- **Passos:**
  1. Rolar até o rodapé.
  2. Observar o endereço, o link `Instagram` e o copyright.
  3. Passar o mouse sobre o link `Instagram`.
  4. No DevTools, inspecionar o contraste do texto do link (seletor de cor → razão de contraste) e do copyright.
- **Resultado esperado:**
  - Todos os textos legíveis sobre o fundo escuro; nada preto sobre preto nem branco sobre branco.
  - Contraste de endereço, link e copyright ≥ 4,5:1.
  - No hover o link clareia (fica mais próximo de `foreground`), sem sumir.
  - A borda superior do rodapé continua visível.

#### CT-06 — Largura 375 px, sem `.env`

- **Cobre:** TM-02 · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado frio, tema claro, largura 375 px.
- **Passos:**
  1. Rolar até o rodapé.
  2. Observar a disposição das três linhas (endereço, redes, copyright).
  3. Tentar rolar na horizontal.
- **Resultado esperado:**
  - Endereço, `Instagram` e copyright visíveis, um abaixo do outro, com o mesmo recuo lateral (`px-4`) do resto da página.
  - Nenhuma barra de rolagem horizontal; nenhum texto cortado.
  - O alvo do link é fácil de tocar (o texto está visível e separado do endereço e do copyright).

### Bloco B — Com `.env` (depois de `worktree hot FOR-011`)

> Antes de começar: parar o `npm run dev`, rodar `worktree hot FOR-011`, conferir o `VITE_WHATSAPP_NUMBER` no `.env` e subir `npm run dev` de novo.

#### CT-07 — Com número, os dois links aparecem, na ordem Instagram → WhatsApp

- **Cobre:** CA-2 (lado positivo), Comportamento Esperado 2 · **Tipo:** happy path · **Via:** UI
- **Pré-condição:** estado **quente**, tema claro, ≥ 1280 px.
- **Passos:**
  1. Abrir `http://localhost:5180` e rolar até o rodapé.
  2. Observar a linha de redes.
  3. No DevTools, contar os `<li>` da `<ul>` do rodapé.
- **Resultado esperado:**
  - Aparecem `Instagram` e `WhatsApp`, nessa ordem, lado a lado, com espaço entre eles (`gap-4`).
  - A `<ul>` tem 2 `<li>`.
  - Os dois são só texto, **sem ícone**, e têm a mesma aparência (cor, tamanho).
  - Endereço acima e copyright abaixo, como no CT-01.

#### CT-08 — Link do WhatsApp: URL, mensagem, nova aba e nome acessível

- **Cobre:** CA-3, Comportamento Esperado 2, I1 · **Tipo:** happy path · **Via:** UI
- **Pré-condição:** estado quente, tema claro, ≥ 1280 px.
- **Passos:**
  1. No rodapé, DevTools → Elements → selecionar o `<a>` do WhatsApp.
  2. Ler `href`, `target`, `rel` e `aria-label`.
  3. Aba *Accessibility* → *Name* e *Role*.
  4. Clicar no link.
- **Resultado esperado:**
  - `href="https://wa.me/5547999990000?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Fornalha."` (só dígitos no número; se o `.env` tiver máscara, ela não aparece na URL).
  - `target="_blank"`; `rel="noopener noreferrer"`; `aria-label="Abrir conversa com a Fornalha no WhatsApp em nova aba"`.
  - *Role:* `link`; *Name:* igual ao `aria-label`; texto visível `WhatsApp`, sem ícone.
  - O clique abre o WhatsApp (web ou app) em **nova aba**, com a mensagem `Olá, vim pelo site da Fornalha.` pré-preenchida; a aba da Fornalha continua aberta.
  - A mensagem é a do rodapé, não a do hero. Comparar com o botão do hero (se ele aparecer): textos diferentes são esperados.

#### CT-09 — Os dois links têm nomes acessíveis diferentes e não trocados

- **Cobre:** CA-3 (discriminação, Q5.1) · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado quente, tema claro, ≥ 1280 px.
- **Passos:**
  1. DevTools → aba *Accessibility* → *Accessibility Tree* → expandir `contentinfo` (o `<footer>`).
  2. Ler o nome de cada `link`.
  3. Conferir qual `href` pertence a qual nome (selecionar cada nó e olhar o elemento).
- **Resultado esperado:**
  - Dois `link` dentro do rodapé: `Abrir o Instagram da Fornalha em nova aba` → `instagram.com/fornalha.padaria`; `Abrir conversa com a Fornalha no WhatsApp em nova aba` → `wa.me/...`.
  - Nenhum link sem nome, nenhum nome repetido, nenhum nome trocado.

#### CT-10 — Só teclado: foco visível e ativação nos dois links

- **Cobre:** TM-04, DS-06, CA-3 · **Tipo:** happy path · **Via:** UI
- **Pré-condição:** estado quente, tema claro, ≥ 1280 px. Sem usar o mouse.
- **Passos:**
  1. Clicar em uma área vazia do topo da página (só para dar foco ao documento) e apertar `Tab` repetidamente até chegar ao rodapé.
  2. Ao focar `Instagram`, observar o contorno.
  3. `Tab` para `WhatsApp`; observar o contorno.
  4. `Shift+Tab` volta para `Instagram`; `Enter` ativa o link.
  5. Fechar a aba aberta, voltar à Fornalha, focar `WhatsApp` e apertar `Enter`.
- **Resultado esperado:**
  - A ordem de foco no rodapé é `Instagram` → `WhatsApp`, sem foco em elemento oculto nem parada extra.
  - Cada link focado mostra um anel de foco visível (3 px, cor `ring` do tema), com cantos levemente arredondados, sem ser cortado pelo contêiner.
  - `Enter` abre cada destino em nova aba.
  - Depois do `WhatsApp`, o próximo `Tab` sai da página (rodapé é o último elemento focável).

#### CT-11 — Tema escuro, com `.env`

- **Cobre:** TM-01 · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado quente, ≥ 1280 px, classe `dark` no `<html>`.
- **Passos:**
  1. Rolar até o rodapé.
  2. Observar os dois links, o endereço e o copyright.
  3. Focar cada link com `Tab` e observar o anel.
  4. Passar o mouse sobre cada link.
- **Resultado esperado:**
  - Os dois links legíveis, com contraste ≥ 4,5:1 sobre o fundo escuro.
  - O anel de foco visível no escuro (não some contra o fundo).
  - O hover clareia o texto, igual nos dois links.

#### CT-12 — Largura 375 px, com `.env`

- **Cobre:** TM-02 · **Tipo:** edge · **Via:** UI
- **Pré-condição:** estado quente, tema claro, largura 375 px.
- **Passos:**
  1. Rolar até o rodapé.
  2. Observar a linha de redes e as demais.
  3. Repetir com a classe `dark` no `<html>`.
  4. Tentar rolar na horizontal.
- **Resultado esperado:**
  - `Instagram` e `WhatsApp` cabem na mesma linha (ou quebram para a linha de baixo sem cortar, graças ao `flex-wrap`), com espaço entre eles.
  - Nenhuma barra de rolagem horizontal; nenhum texto cortado, nos dois temas.
  - Os dois links continuam clicáveis e abrem em nova aba.

#### CT-13 — Âncora `#contato` continua levando ao rodapé

- **Cobre:** Comportamento Esperado 3 · **Tipo:** regressão · **Via:** UI
- **Pré-condição:** estado quente (vale também no frio), tema claro, ≥ 1280 px. Página no topo.
- **Passos:**
  1. No DevTools → Elements, confirmar que `<footer>` tem `id="contato"`.
  2. Procurar no cabeçalho um link/botão que aponte para `#contato` e clicar nele. Se o cabeçalho não tiver, digitar `http://localhost:5180/#contato` na barra de endereço e dar Enter.
- **Resultado esperado:**
  - `<footer id="contato" ...>` presente, uma única vez no documento (`Ctrl+F` por `id="contato"` dá 1 resultado).
  - A página rola até o rodapé; o rodapé fica visível na tela.

#### CT-14 — Número com máscara no `.env` vira só dígitos na URL

- **Cobre:** CA-2 (borda), P2 · **Tipo:** edge · **Via:** UI
- **Pré-condição:** parar o `npm run dev`; editar o `.env` para `VITE_WHATSAPP_NUMBER=+55 (47) 99999-0000`; subir `npm run dev`. Tema claro, ≥ 1280 px. **Restaurar o valor anterior do `.env` ao terminar.**
- **Passos:**
  1. Abrir a página e rolar até o rodapé.
  2. Selecionar o `<a>` do WhatsApp e ler o `href`.
- **Resultado esperado:** o link `WhatsApp` aparece; `href` começa com `https://wa.me/5547999990000?text=` (sem `+`, espaços, parênteses ou hífens).

#### CT-15 — Número vazio ou sem dígitos no `.env` esconde o WhatsApp

- **Cobre:** CA-2 (borda), P2 · **Tipo:** erro · **Via:** UI
- **Pré-condição:** parar o `npm run dev`; editar o `.env` para `VITE_WHATSAPP_NUMBER=` (vazio) e subir `npm run dev`. Tema claro, ≥ 1280 px. Repetir com `VITE_WHATSAPP_NUMBER=xxx`. **Restaurar o valor anterior do `.env` ao terminar.**
- **Passos:**
  1. Abrir a página e rolar até o rodapé.
  2. Contar os links da linha de redes.
- **Resultado esperado (nos dois valores):** só `Instagram`; nenhum link `WhatsApp`; nenhum `wa.me/?text=` quebrado no DOM; sem erro no Console.

## 4. Matriz de Rastreabilidade

| Item do TASK | Descrição | CTs |
| ------------ | --------- | --- |
| CA-1 | Relógio em 2027 → "© 2027 Fornalha" | CT-01 (ano do relógio atual), CT-02 (2027 via relógio do SO, opcional); automático: Fase 6b |
| CA-2 | Sem `.env` → só o Instagram | CT-03, CT-05, CT-06 (lado "sem número"); CT-07 (lado "com número"); CT-14, CT-15 (bordas) |
| CA-3 | Nova aba, `rel="noopener noreferrer"`, nome acessível | CT-04 (Instagram), CT-08 (WhatsApp), CT-09 (nomes não trocados), CT-10 (teclado) |
| Comp. Esperado 1 | Ano calculado na renderização | CT-01, CT-02 |
| Comp. Esperado 2 | Links de Instagram e WhatsApp, só texto, com `aria-label` | CT-03, CT-04, CT-07, CT-08, CT-09 |
| Comp. Esperado 3 | `id="contato"` no rodapé | CT-13 |
| P3 | Endereço continua como está | CT-01, CT-07 |
| TM-01 (dois temas) | Mudança de cor/aparência | CT-05, CT-11 |
| TM-02 (375 e ≥ 1280) | Layout dos links | CT-06, CT-12 |
| TM-03 (sem e com `.env`) | Task lê `.env` | Bloco A (frio), Bloco B (quente) |
| TM-04 (só teclado) | Elemento interativo novo | CT-10 |

Todo CA tem ao menos um CT. O CA-1 na sua forma literal (2027) depende do CT-02 ou do teste automatizado (ver Incertezas).

## 5. Premissas e Incertezas

**Premissas**

1. O número de referência é `5547999990000`; se o `.env` do testador tiver outro, o resultado esperado muda só nos dígitos.
2. O hero segue a regra "sem número, sem botão" (FOR-005); o CT-03 só usa isso como conferência de coerência, e o hero não é objeto desta task.
3. Dark mode se simula pela classe `dark` no `<html>`, pois o site não tem alternador de tema.
4. O `worktree hot` copia o `.env` do checkout principal; o testador confere o conteúdo antes do Bloco B.

**Incertezas / lacunas**

1. **CA-1 literal (2027) não é verificável sem mexer no relógio do SO.** O navegador não tem como simular a data apenas via DevTools antes do carregamento. Por isso o CT-01 confere o ano **atual** (prova que o ano deixou de ser fixo e é calculado) e o CT-02 é opcional. A prova de "2027" fica com o teste automatizado (`vi.setSystemTime`), a ser garantido no `/autotest`/`/verify`.
2. **CT-02 e CT-14/CT-15 mexem em estado da máquina** (relógio do SO; `.env`). Ao terminar, restaurar a hora automática e o valor original do `VITE_WHATSAPP_NUMBER`.
3. **Destinos externos (Instagram, WhatsApp):** o CT confere que a nova aba abre na URL certa; não confere que o perfil existe nem que o WhatsApp está instalado/logado. O Instagram pode pedir login; isso não é falha da task.
4. **Contraste (CT-05, CT-11):** a conferência é pelo seletor de cor do DevTools; se o valor ficar em torno de 4,5:1, registrar o número lido em vez de só "passou".
5. O PLAN-01 cita `src/vite-env.d.ts` (não existe; a tipagem está em `src/env.d.ts`). Não afeta nenhum CT.
