# TEST — FOR-006: Copy do cardápio

Teste de mesa (Fase 6a/7). Todos os CTs são `Via: UI`: o produto não tem API. Quem executa é a pessoa, no navegador.

**Fontes:** `TASK.md` (CA-1 a CA-3) · `plans/PLAN-01-copy-cardapio.md` · `QUESTION.md` (Q1.1, Q1.2, Q2.1, Q2.2, Q3.1, Q3.2, Q4.1, Q5.1) · `REVIEW.md` (APROVADO).

**Natureza da mudança:** só texto. Nenhum layout, cor, fonte ou token foi tocado, então TM-01 e TM-02 não são obrigatórios. Mesmo assim, o CT-07 confere a quebra de linha da copy nova em 375 px e ≥ 1280 px, e nos dois temas, porque as frases são mais longas que "Descrição em breve.".

## 1. Pré-requisitos

- Terminal aberto em `.claude/worktrees/FOR-006/`.
- `npm run dev` rodando a partir desse worktree; abrir `http://localhost:5180` (porta fixa; se outra task estiver no ar, o comando falha e é preciso derrubá-la).
- A task **não lê `.env`**: não há `worktree hot` nem CT com/sem `.env` (TM-03 não se aplica).
- DevTools disponível, para trocar a largura (375 px e ≥ 1280 px) e o tema (classe `dark` no `<html>`).
- Para o CT-08 (diff), um terminal na raiz do worktree.

### Dados de base

Sem fonte de dados externa (sem banco, sem API): o cardápio é o arquivo `src/data/products.ts`, já presente no worktree.

**(a) Reutilizados** — os seis produtos que já existem; nada a localizar nem a criar. Os valores esperados de nome e preço vêm do `HEAD` (`git show HEAD:src/data/products.ts`), antes da task:

| `id`            | Nome na tela                | Categoria (badge) | Preço na tela |
| --------------- | --------------------------- | ----------------- | ------------- |
| `sourdough`     | Pão de fermentação natural  | Pães              | R$ 28,00      |
| `rye`           | Pão de centeio              | Pães              | R$ 32,00      |
| `focaccia`      | Focaccia de alecrim         | Pães              | R$ 24,50      |
| `croissant`     | Croissant de manteiga       | Doces             | R$ 12,50      |
| `orange-cake`   | Bolo de laranja (fatia)     | Doces             | R$ 9,90       |
| `filter-coffee` | Café coado                  | Bebidas           | R$ 7,00       |

> O formato exato do preço (`R$ 28,00`) vem da FOR-003. Se a tela mostrar outro formato de moeda, o que vale aqui é o preço não ter mudado em relação ao `main`; compare com o `main` antes de reportar defeito.

**(b) A criar** — nenhum.

### Copy esperada (fixada no PLAN-01, passo 1 e 2)

| `id`            | Descrição esperada                                                      | Palavras |
| --------------- | ----------------------------------------------------------------------- | -------- |
| `sourdough`     | Fermento vivo desde 2019 e 36 horas de fermentação até a casca grossa.  | 13       |
| `rye`           | Centeio de miolo denso e sabor firme, bom com manteiga ou queijo.       | 12       |
| `focaccia`      | Alecrim e azeite por cima, massa alta e borda dourada.                  | 10       |
| `croissant`     | Camadas finas de manteiga que estalam na primeira mordida.              | 9        |
| `orange-cake`   | Laranja ralada na massa, textura úmida e fatia que pede café.           | 11       |
| `filter-coffee` | Coado na hora, passo a passo, e servido quente na xícara.               | 11       |
| (subtítulo)     | Da fermentação lenta ao forno, sai fresco em cada fornada.              | 10       |

Contagem de palavras: token separado por espaço (`texto.trim().split(/\s+/).length`); hífen e pontuação colada não separam.

## 2. Cenários de Teste

### CT-01 — Os seis cards mostram a descrição nova (happy path)

**Via:** UI · **Cobre:** CA-1
**Pré-condição:** tema claro, largura ≥ 1280 px.

**Passos:**
1. Abrir `http://localhost:5180`.
2. Rolar até a seção "Cardápio" (ou clicar em "Cardápio" no menu; âncora `#cardapio`).
3. Ler a descrição de cada um dos seis cards, na ordem em que aparecem.

**Resultado esperado:**
- A seção mostra seis cards; cada um tem uma descrição **igual, caractere a caractere,** à tabela "Copy esperada" (incluindo acentos, vírgulas e o ponto final).
- Nenhum card mostra "Descrição em breve.".
- Nenhum card está com a descrição vazia.

### CT-02 — Cada descrição tem de 8 a 18 palavras (limites)

**Via:** UI · **Cobre:** CA-1
**Pré-condição:** a mesma do CT-01.

**Passos:**
1. Para cada card, copiar o texto da descrição da tela.
2. Contar as palavras (tokens separados por espaço). Conferência opcional, no console do DevTools:
   ```js
   [...document.querySelectorAll('#cardapio [data-slot="card-description"]')]
     .map(e => e.textContent.trim().split(/\s+/).length)
   ```
   Se o seletor `data-slot` não existir nesta versão do shadcn, usar "Inspecionar" em uma descrição e adaptar o seletor ao elemento que contém o texto.

**Resultado esperado:**
- Contagens, na ordem dos cards: **13, 12, 10, 9, 11, 11**.
- Todas dentro de 8 a 18. A menor (croissant, 9) está acima do piso de 8, e a maior (sourdough, 13) abaixo do teto de 18.

### CT-03 — Aberturas e vocabulário distintos, sem superlativo vazio (estrutura)

**Via:** UI · **Cobre:** CA-2
**Pré-condição:** a mesma do CT-01.

**Passos:**
1. Ler as seis descrições em sequência, como o vizinho leria no grid.
2. Anotar a primeira palavra de cada uma.
3. Procurar, no conjunto, as palavras "melhor", "incrível", "delicioso", "perfeito", "irresistível", "maravilhoso", além de emoji e "!".
4. Procurar repetições: "36 horas", "miolo", "úmido/úmida".

**Resultado esperado:**
- Primeiras palavras, nesta ordem: **Fermento, Centeio, Alecrim, Camadas, Laranja, Coado** — todas diferentes; nenhuma é "Feito".
- Nenhum superlativo vazio, nenhum emoji, nenhuma exclamação.
- "36 horas" aparece **uma vez** no conjunto de descrições (só no Pão de fermentação natural; Q4.1).
- "miolo" aparece uma vez (só no Pão de centeio) e "úmida" uma vez (só no Bolo de laranja); Q2.1.
- Nenhuma descrição cita a farinha de moinho de pedra (Q1.1), nem origem ou torra do café (Q3.1).

### CT-04 — Subtítulo novo, dentro do limite e sem repetir o que já está na página (subtítulo)

**Via:** UI · **Cobre:** Comportamento Esperado 2 (sem CA numerado; ver Incertezas)
**Pré-condição:** a mesma do CT-01.

**Passos:**
1. Na seção "Cardápio", ler o texto logo abaixo do título "Cardápio".
2. Contar as palavras.
3. Comparar com o subtítulo do Hero (topo da página) e com os rótulos das categorias.

**Resultado esperado:**
- O título continua sendo "Cardápio" (P3).
- O subtítulo é exatamente "Da fermentação lenta ao forno, sai fresco em cada fornada." — 10 palavras, dentro do limite de 12.
- Não é mais "Conheça nossos produtos.".
- Não lista categorias, não cita horário de fornada (7h/16h) e não repete "36 horas", que já é o título do Hero (Q1.2, Q3.2, Q5.1).

### CT-05 — Nomes, preços e categorias não mudaram (regressão)

**Via:** UI · **Cobre:** Comportamento Esperado 3, CA-3
**Pré-condição:** a mesma do CT-01.

**Passos:**
1. Ler, em cada card, o nome, o badge de categoria e o preço.
2. Comparar com a tabela "Dados de base (a)".
3. Ler os três badges de categoria presentes na seção.

**Resultado esperado:**
- Nomes, preços e categorias idênticos à tabela, na mesma ordem dos cards.
- Os rótulos de categoria continuam "Pães", "Doces" e "Bebidas" (P3).
- Nenhum card perdeu o preço, o badge ou o título.

### CT-06 — Copy coerente com os fatos da marca (coerência com o EPIC)

**Via:** UI · **Cobre:** Comportamento Esperado 1 (detalhe concreto coerente com o EPIC), P1
**Pré-condição:** a mesma do CT-01.

**Passos:**
1. Abrir `tasks/EPIC.md`, seção "Fatos da marca".
2. Conferir cada afirmação factual da copy contra ela:
   - "Fermento vivo desde 2019" e "36 horas de fermentação" (Pão de fermentação natural).
3. Conferir que os demais detalhes (centeio, alecrim, azeite, manteiga, laranja, café coado) vêm do nome do produto ou são descrição de textura/ingrediente/serviço, não fato novo da marca.
4. Conferir que a copy segue a voz do EPIC: "você" quando aparecer, frases curtas, concreto no lugar do adjetivo.

**Resultado esperado:**
- "2019" e "36 horas" batem com o EPIC.
- Nenhuma afirmação de horário, origem, torra, fornecedor ou preço que o EPIC não traga.
- Nenhuma descrição contradiz a seção "Horários e endereço" mais abaixo na página.

### CT-07 — Copy legível em 375 px e em ≥ 1280 px, nos dois temas (visual)

**Via:** UI · **Cobre:** regressão visual do texto novo (não é CA; TM-01/TM-02 não obrigam, a mudança é só texto)
**Pré-condição:** executar as quatro combinações: {claro, escuro} × {375 px, ≥ 1280 px}. Tema escuro: alternar pelo controle de tema da página, ou, se ele não existir, definir a classe `dark` no `<html>` pelo DevTools.

**Passos:**
1. Em cada combinação, rolar até "Cardápio".
2. Olhar o subtítulo e os seis cards.
3. Em 375 px, conferir se a página tem rolagem horizontal.

**Resultado esperado:**
- Texto do subtítulo e das descrições quebra em linhas, sem cortar, sem estourar o card e sem sobrepor o badge de categoria nem o preço.
- A descrição mais longa em caracteres (Pão de fermentação natural) continua dentro do card em 375 px.
- Sem rolagem horizontal em 375 px.
- Descrição legível nos dois temas (texto secundário com contraste suficiente sobre o fundo do card; sem texto apagado a ponto de não ler).
- Grid: 1 coluna em 375 px e 3 colunas em ≥ 1280 px, como antes da task.

### CT-08 — O diff de `products.ts` só mexe em `description` (escopo)

**Via:** UI · **Cobre:** CA-3
**Justificativa:** CA-3 fala do diff do código, que não é exercitável na tela do navegador. O passo abaixo é uma verificação de leitura no terminal, sem alterar nada. A parte visível do CA-3 (nomes e preços) já é exercida pelo CT-05.
**Pré-condição:** terminal na raiz do worktree.

**Passos:**
1. Rodar `git diff -- src/data/products.ts`.
2. Ler as linhas `+` e `-`.
3. Rodar `git diff -- src/content/products-section.ts`.
4. Rodar `git status --short` e conferir os arquivos de `src/`.

**Resultado esperado:**
- No `products.ts`, as únicas linhas removidas são `description: "Descrição em breve.",` (6 vezes); as únicas linhas adicionadas são as seis descrições novas (a quebra em duas linhas, com a string na linha seguinte, é só formatação).
- Nenhuma linha de `id`, `name`, `price`, `category` nem dos tipos aparece como alterada.
- No `products-section.ts`, só a linha `subtitle` muda; `title` e `categoryLabels` ficam intactos.
- Em `src/`, só esses dois arquivos aparecem alterados.

### CT-09 — Nenhum resto do texto antigo na página (erro)

**Via:** UI · **Cobre:** CA-1 (nenhuma "Descrição em breve."), regressão
**Pré-condição:** tema claro, qualquer largura.

**Passos:**
1. Na página aberta, usar `Ctrl+F` e buscar "Descrição em breve".
2. Buscar também "Conheça nossos produtos".
3. Recarregar a página (`F5`) e repetir as duas buscas, para descartar cache.

**Resultado esperado:**
- As duas buscas retornam **0 resultados**, antes e depois do recarregamento.
- O console do DevTools não mostra erros nem avisos novos ao carregar a página.

## 3. Matriz de Rastreabilidade

| Critério | Descrição resumida                                              | CTs                          |
| -------- | --------------------------------------------------------------- | ---------------------------- |
| CA-1     | Cada descrição tem 8 a 18 palavras; nenhuma é "em breve"        | CT-01, CT-02, CT-09          |
| CA-2     | Sem estrutura repetida e sem superlativo vazio                  | CT-03                        |
| CA-3     | Só `description` mudou em `products.ts`                         | CT-05, CT-08                 |
| CE-1     | Detalhe concreto coerente com o EPIC (Comportamento Esperado 1) | CT-01, CT-06                 |
| CE-2     | Subtítulo reescrito, até 12 palavras                            | CT-04                        |
| CE-3     | Nomes e preços não mudam                                        | CT-05                        |
| Q1.1, Q3.1, Q4.1, Q2.1 | Decisões da Fase 3 sobre as descrições            | CT-03, CT-06                 |
| Q1.2, Q3.2, Q5.1       | Decisões da Fase 3 sobre o subtítulo              | CT-04                        |
| (regressão visual)     | Quebra de linha e temas                           | CT-07                        |

Todos os CAs do TASK têm ao menos um CT. Os itens "CE-n" (Comportamento Esperado) e "Qn.m" (QUESTION) não são CAs; estão na matriz para mostrar que as decisões da Fase 3 também têm cobertura.

## 4. Premissas e Incertezas

**Premissas**

1. Os textos esperados são os fixados no PLAN-01 e já aplicados no working tree (confirmados em `src/data/products.ts` e `src/content/products-section.ts`). Qualquer divergência na tela é defeito, não variação aceitável (Q6.2).
2. A contagem de palavras segue a regra da TASK (P2): token separado por espaço; "36" e "2019" contam como palavra.
3. A feature ainda não foi commitada (ver `REVIEW.md`); o CT-08 usa `git diff` do working tree, e não `origin/main...HEAD`. Depois do commit, usar `git diff origin/main...HEAD -- src/data/products.ts`.
4. Os preços e o formato de moeda vêm de tasks anteriores (FOR-003) e só são conferidos aqui contra regressão.

**Incertezas**

1. **O subtítulo não tem CA numerado.** A TASK o descreve em Comportamento Esperado 2 ("até 12 palavras"), mas nenhum CA o cobre. O CT-04 o cobre mesmo assim; sugere-se, se a TASK for revisitada, acrescentar um CA.
2. **"Detalhe concreto" é julgamento.** Não há regra mecânica: CT-06 depende de leitura humana. "Azeite" e "casca grossa" não vêm do EPIC nem do nome do produto; a Premissa 4 do PLAN-01 os aceita como descrição genérica, e o `REVIEW.md` os registra como observação de baixa confiança. Se a pessoa quiser a copy estritamente limitada aos fatos do EPIC, é decisão dela e fora deste teste.
3. **"Superlativo vazio" (CA-2) não tem lista fechada.** O CT-03 usa uma lista de exemplos; a pessoa julga o que fugir dela.
4. **Controle de tema.** Se a página não tiver botão de tema, o CT-07 usa a classe `dark` no `<html>` pelo DevTools; ela só reproduz o tema escuro se o CSS usar essa classe, como o `design-system` descreve.
5. **CA-3 não é exercitável só pela tela.** O CT-08 usa o terminal (somente leitura) por necessidade; não há outro modo de ver um diff.
