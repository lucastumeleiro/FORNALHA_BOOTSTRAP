# VERIFY — FOR-006: Copy do cardápio

**Ciclo 2 de 3**
**Veredito:** PASS ✅
**Verificado por:** sub-agente independente (author ≠ verifier)
**Diff coberto:** 2 arquivos de produção (`src/data/products.ts`, `src/content/products-section.ts`) + `tasks/FOR-006/TASK.md` (escopo acordado, Fase 3) · 3 arquivos de teste (`src/data/products.test.ts`, `src/content/products-section.test.ts`, `src/sections/products-section.test.tsx`)

Sensor estático: nenhum teste, build, typecheck ou dev foi executado. Os regex foram avaliados à mão contra os textos atuais; contagens e valores de `HEAD` foram conferidos por leitura (`git show HEAD:src/data/products.ts`, `git diff`).

## Check 1 — Conclusão

Todos PLANs ✅: sim. `MEMORY.md` tem PLAN-01 `✅ Concluído`, sem bloqueios ativos. Os três arquivos de teste e o `AUTOTEST.md` existem.

Recontagem independente (token separado por espaço, TASK P2): `sourdough` 13 (`products.ts:16`), `rye` 12 (`:24`), `focaccia` 10 (`:31`), `croissant` 9 (`:38`), `orange-cake` 11 (`:46`), `filter-coffee` 11 (`:53`), subtítulo 10 (`products-section.ts:3`). Batem com MEMORY.md e com o PLAN-01 (textos copiados literalmente). Os valores de `id`/`name`/`price`/`category` no working tree são idênticos aos de `HEAD`.

## Check 2 — Cobertura ancorada nos CAs

| CA / CE | Estado | Evidência (linhas atuais) | Observação |
| ------- | ------ | ------------------------- | ---------- |
| CA-1 (8 a 18 palavras, nenhuma "em breve") | ✅ auto | `products.test.ts:19-20` (>= 8, <= 18, inclusivos); `:29` (`toEqual([13,12,10,9,11,11])`); `:57-58` (vazio e `/em breve/i`); `products-section.test.tsx:32-35` (seis descrições na tela); `:81` (sem "Descrição em breve" na página) | Limites e forma de contar batem com TASK/P2. Vínculo descrição ↔ produto agora em `:44-50` (ver Check 3). |
| CA-2 (estrutura não repetida; sem superlativo vazio) | ✅ auto | estrutura: `products.test.ts:69-70` (primeira palavra única, sem "feito"), `:95-96` (miolo/úmid uma vez), `:86-90` ("36 horas" só no sourdough); superlativo: `:76-80` (radicais + emoji + "!") | "Estrutura" = proxy da própria TASK ("por exemplo… Feito com…"). Lexicon de superlativo é finito por natureza (ver Check 3, resíduo R2). |
| CA-3 (só `description` mudou) | ✅ auto (proxy de valores) + 🧪 manual | `products.test.ts:119-151` (id, name, price, category, ordem e total de seis, por `toEqual`); `:157-163` (conjunto exato de chaves); manual: TEST.md CT-08 (leitura do `git diff`) | Valores fixados conferidos contra `HEAD`. O diff em si não é assertável depois do commit (TEST.md Premissa 3). |
| CE-1 (detalhe concreto coerente com o EPIC) | 🧪 manual (julgamento) + parte mecânica auto | TEST.md CT-06; auto: `products.test.ts:34-51` (termo-chave e "desde 2019" por id), `:86-90`, `:101-104` | Sem CA numerado. "2019" e "36 horas" conferem com `tasks/EPIC.md:19`. |
| CE-2 (subtítulo novo, até 12 palavras) | ✅ auto | `products-section.test.ts:12-13` (`> 0`, `<= 12`); `:18-19` (texto antigo ausente); `:27-31` (fermentação, sem `Nh`, sem "36 horas", sem rótulo de categoria); `products-section.test.tsx:24` | Sem CA numerado. O limite bate com "até 12" (inclusivo). |
| CE-3 (nomes e preços não mudam) | ✅ auto | `products.test.ts:119-151`; `products-section.test.tsx:44-49` e `:61-71` (preços literais `R$ 28,00`…`R$ 7,00`), `:51-53` (3/2/1 por categoria); `products-section.test.ts:37-42` | — |

Lacunas de precisão da spec:

1. Comportamento Esperado 1 ("detalhe concreto") e 2 (subtítulo) não têm CA numerado; só CA-1 a CA-3 existem (TEST.md Incerteza 1).
2. CA-2: "estrutura" e "superlativo vazio" não têm definição mecânica nem lista fechada (TEST.md Incerteza 3).
3. CA-3 fala de "diff", artefato do repositório; só o proxy de valores é assertável.

Nenhum CA ficou sem `arquivo:linha` nem CT. Nenhum CA em ❌.

## Check 3 — Sensor de discriminação estático

| Teste (`arquivo:linha`) | Mutante tentado | Veredito |
| ----------------------- | --------------- | -------- |
| `products.test.ts:10-22` (8..18) | Inserir/remover palavra para 7 ou 19: falha aqui e em `:29`. | ✅ discrimina |
| `products.test.ts:24-30` (contagens exatas) | Qualquer mudança de contagem em qualquer produto falha. Troca entre produtos de mesmo tamanho (`orange-cake` ↔ `filter-coffee`, 11/11) passa aqui, mas é pega por `:44-50` (abaixo). | ✅ discrimina |
| `products.test.ts:32-52` (termo-chave por id, ordem dos ids) | Recontei em `products.ts` onde cada termo aparece: `/desde 2019/` só em `sourdough`; `/centeio/` só em `rye`; `/alecrim/` só em `focaccia`; `/laranja/` só em `orange-cake`; `/coad/` só em `filter-coffee`; `/manteiga/` aparece em **duas** (`rye`, `croissant`) e por isso não discrimina sozinho `rye` ↔ `croissant`. Mas qualquer permutação não trivial move ao menos um produto diferente de `croissant`, e os outros cinco termos são únicos, então a troca falha em algum deles (ex.: `rye` ↔ `croissant`: `rye` perde "centeio"). Pares testados: `orange-cake` ↔ `filter-coffee` (falha por `laranja`/`coad`), `sourdough` ↔ qualquer (falha por `desde 2019`), `croissant` ↔ `rye` (falha por `centeio`), `croissant` ↔ `orange-cake` (falha por `manteiga` e `laranja`). Cópia da descrição de `rye` em `croissant` (mantém "manteiga"): falha em `:29` (12 no lugar de 9), `:69` (abertura repetida) e `:95` (miolo duas vezes). Ano 2019→2018: falha por `desde 2019`. Reordenar produtos: falha em `:44-46`. | ✅ discrimina |
| `products.test.ts:54-60` (texto provisório) | Voltar "Descrição em breve." em qualquer produto: `/em breve/i` falha (e a contagem). | ✅ discrimina |
| `products.test.ts:62-71` (aberturas únicas, sem "feito") | Duas aberturas iguais: `Set` falha; "Feito" em qualquer posição de abertura: `not.toContain`. Resíduo teórico: "Feita…"/"Feitas…" em duas descrições distintas (estrutura repetida com flexão diferente). Fora do exemplo do TASK e contrived. | ✅ discrimina (proxy da TASK) |
| `products.test.ts:73-81` (superlativo, "!", emoji) | `focaccia` "alta" → "perfeita" (`perfeit`), "deliciosa(s)" (`delicios`), "maravilhosa" (`maravilhos`), "saborosíssima" (`[ií]ssim`), "incríveis" (`incr[ií]ve`), "irresistíveis", "melhores": todos falham. Falsos positivos nos textos atuais: nenhum (`ssim`/`íssim`, `delicios`, `perfeit`, `melhor`, `incr`, `maravilh` não ocorrem; "massa", "passo a passo" não casam `[ií]ssim`). `!` e `\p{Extended_Pictographic}` não casam dígitos nem letras. | ✅ discrimina |
| `products.test.ts:83-91` ("36 horas" só no sourdough) | Pôr "36 horas" em outro produto: `comTrintaESeis` ≠ `["sourdough"]`. Tirar do `sourdough`: idem. Resíduo: "36 Horas" com H maiúsculo em outro produto (o regex aqui é case-sensitive e o `:101-104` o mascara por usar texto em minúsculas). Implausível numa frase. | ✅ discrimina |
| `products.test.ts:93-97` ("miolo", "úmid" exatamente uma vez) | Remover ou duplicar "miolo"/"úmid": falha. O nome do teste agora diz "exatamente uma vez", igual à asserção. | ✅ discrimina |
| `products.test.ts:99-105` (fora da marca + horário) | `farinha\|moinho\|origem\|torra\|fornecedor`: nenhum casa nos textos atuais. Horário, após `.replace(/36 horas/g, "")`: "às 7 horas", "7h", "7h30", "16h", "7 h", "12h" casam (`7h30`: depois de `h` vem `3`, que não está em `[a-zà-ú]`). O regex não casa "2019" (sem fronteira entre `20` e `19`; depois de `19` vem espaço, não `h`). O `replace` poderia mascarar "36 horas" em outro produto, mas isso é pego de forma independente por `:86-90`; a conjunção dos dois testes não deixa passar. Sobrevivem: "7 hs", "7:30", "sete horas" (por extenso) — marginais, fora de CA. Possível falso positivo futuro: "torra" casa "torrada"; não afeta os textos atuais. | ✅ discrimina |
| `products.test.ts:109-152` (invariante) | Alterar id, name, price, category, ordem ou total de produtos falha o `toEqual`. | ✅ discrimina |
| `products.test.ts:154-165` (chaves) | Chave nova, removida ou renomeada falha. | ✅ discrimina |
| `products-section.test.ts:7-14` (subtítulo `<= 12`) | 13 palavras ou mais falha; `> 0` evita subtítulo vazio. | ✅ discrimina |
| `products-section.test.ts:16-20` (subtítulo antigo) | Voltar "Conheça nossos produtos." falha. | ✅ discrimina |
| `products-section.test.ts:22-33` (fermentação, horário, 36 horas, categoria) | Subtítulo com "36 horas" ou "36h": falha (`:29` e `:28`). Repetir o título do Hero ("Fermentação natural de 36 horas") falha em `:29`; a remoção da asserção `heroContent.title` não deixou lacuna, porque o título do Hero sempre carrega "36 horas". Rótulos "pães", "doces", "bebidas": falha. **Resíduo R1:** o regex de horário do subtítulo (`:28`, `\b\d{1,2}h\b`) só pega "7h"/"16h"; "às 7 horas" e "7h30" no subtítulo sobrevivem (o regex dos produtos foi endurecido, o do subtítulo não). Avaliado frente ao TASK: o Comportamento Esperado 2 só exige "reescrito, até 12 palavras"; o "sem horário" vem da decisão I2/Q5.1 (registrada no TASK em Premissas e Incertezas), não de um CA, e o TEST.md CT-04 dá como exemplos "7h/16h", justamente o formato guardado. Mutante contra decisão, não contra o requisito. | ✅ discrimina o CE-2 (R1 registrado, não bloqueia) |
| `products-section.test.ts:35-43` (título e rótulos) | Alterar título ou rótulo falha. | ✅ discrimina |
| `products-section.test.tsx:13-25` (título/subtítulo na tela) | Sobrevive a trocar o subtítulo (esperado importado do `src/content/`, convenção da skill); o valor é travado em `products-section.test.ts`. Tirar o render do subtítulo falha. | ✅ discrimina (leitura de render) |
| `products-section.test.tsx:27-36` (seis descrições na tela) | Não renderizar `CardDescription` falha; `getAllByRole(h3)` fixa seis cards. Descrições trocadas no dado são pegas em `products.test.ts:44-50`. Trocar a descrição entre cards exigiria mexer em `ProductCard`, que recebe um único `product` e lê `name` e `description` do mesmo objeto (`product-card.tsx`): não plausível. | ✅ discrimina |
| `products-section.test.tsx:38-72` (nome, preço, categoria) | Preço literal em `:61-71` fixa `28,00`…`7,00`; contagens 3/2/1 fixam categorias. O bloco `:44-49` usa `formatPrice` (autorreferente), mas `:61-71` é literal. | ✅ discrimina |
| `products-section.test.tsx:76-86` (texto antigo na `App`) | Voltar qualquer dos dois textos antigos falha. | ✅ discrimina |

Resíduos (mutantes que sobrevivem, nenhum contra CA):

- **R1 (P3, fora de CA):** subtítulo com "às 7 horas" ou "7h30" passa em `products-section.test.ts:28`. Endurecer com o mesmo regex de `products.test.ts:104`.
- **R2 (P3, spec):** o léxico de superlativo é finito. "sensacional", "espetacular" ou "saboroso" no lugar de "alta" passam. Qualquer lista é incompleta e o CA-2 não fecha uma; o julgamento humano fica no TEST.md CT-03. Sem ação obrigatória.

## Check 4 — Payload/conjunção

Nenhum uso de `toHaveBeenCalled*`. As asserções de valor miram o valor: `toEqual` em arrays e objetos, `toMatch` com regex único por id, `toHaveLength(n)` fixo, `toBe("Cardápio")`. Só-ocorrência: `products-section.test.tsx:34` (`getByText(product.description)`, não diz em qual card; o vínculo por produto está em `products.test.ts:44-50`) e `:24` (autorreferente; o valor real é travado em `products-section.test.ts`). Nenhuma deixa mutante plausível vivo contra um CA. Asserções fracas contra CA: 0.

## Check 5 — Escopo e fechamento do REVIEW.md

- Produção tocada: `src/data/products.ts` (só `description`; seis linhas de texto mais a quebra de formatação) e `src/content/products-section.ts` (só `subtitle`), ambos em "Arquivos Impactados" do PLAN-01. O `git diff` confirma que nenhuma linha de `id`, `name`, `price`, `category` nem de tipos mudou.
- `tasks/FOR-006/TASK.md` (I1 e I2 marcadas como resolvidas): escopo acordado, Q3.1 e Q3.2 listam "Afeta: TASK §Premissas e Incertezas" e a tabela "Alterações aplicadas" do QUESTION.md registra a edição. Não é vazamento.
- Os três arquivos de teste não estão em "Arquivos Impactados", mas são entregáveis da Fase 6b e ficam ao lado do código (TA-01). O REVIEW.md ("Sem testes novos") ficou desatualizado em relação à 6b; informativo.
- Respostas do QUESTION.md: as dez são `aceito`; nenhum comportamento rejeitado implementado. As decisões aparecem respeitadas em código (rye sem farinha, subtítulo sem categoria/horário/"36 horas", "36 horas" só no sourdough, café sem origem nem torra).
- A remoção da asserção/import `heroContent` de `products-section.test.ts` não deixou CA ou CE sem cobertura (ver Check 3).
- Código morto ou especulativo: nada em produção; nos testes, sem helper ou import sem uso (`noUnusedLocals` ativo e nenhum símbolo importado ficou sem uso).

Bloqueantes do REVIEW.md em aberto: nenhum (veredito APROVADO, `## Bloqueantes` vazio, 0 violações).

## Check 6 — Auditoria das exclusões (AUTOTEST.md)

Âncoras do AUTOTEST.md conferidas contra os arquivos: contagens por arquivo (11 / 4 / 5 = 20) batem; A = 15 (11 + 4), B = 5 (tsx); faixas `products.test.ts:10-30`, `:32-52`, `:54-60`, `:62-106` (5 testes), `:108-166` (2 testes), `products-section.test.ts:7-33` e `:35-43`, `products-section.test.tsx:13-25`, `:27-36`, `:38-72`, `:76-86` existem e dizem o que o AUTOTEST afirma; `card.tsx:14` e `:27` (strings de classe), `products-section.tsx:15` (`sm:grid-cols-2 lg:grid-cols-3`), `TEST.md:168-178`, `:198`, `:222`, `:228`, `PLAN-01:90` também. A afirmação de `AUTOTEST.md` sobre o regex ("pega `7h`, `7h30` e `7 horas`, depois de tirar o '36 horas'") é verdadeira para `products.test.ts:104`. Não há afirmação sobre o subtítulo além de "sem horário", que vale para o formato `Nh` (R1).

| CT | Justificativa da 6b | Refutação tentada | Veredito |
| -- | ------------------- | ----------------- | -------- |
| CT-07 (375 px, 1280 px, dois temas) | CSS/layout; jsdom sem motor de layout; vestígio só em strings de classe | Atributo semântico? Só `class`, e TA-03 proíbe seletor de classe. Dependência injetável? É CSS. Mock de 1 nível produz layout? Não. A linha C da skill cita "layout em 375 px" e "cor e contraste percebidos". Âncoras conferidas. | ✅ C legítimo |
| CT-06 (coerência com o EPIC) | julgamento editorial; oráculo em `tasks/EPIC.md`, fora de `src/`; a 6b admite que a linha C não cobre isso e sustenta pela autoauditoria | Dependência injetável? Não. Ler `EPIC.md` num teste acoplaria código a artefato do SDD. Mock? Mockar o EPIC é testar o mock. A parte mecânica já é automática: fatos "2019" e "36 horas" fixados (`products.test.ts:35`, `:86-90`), sem farinha/origem/torra/fornecedor/horário (`:101-104`), subtítulo (`products-section.test.ts:22-33`). O que sobra ("detalhe concreto", voz) é leitura humana. | ✅ C legítimo (parte editorial) |
| CT-08 (resto: leitura do `git diff`) | depende do working tree e perde sentido depois do commit; invariante de dado já automatizado | Teste sobre `git diff` exigiria `child_process` contra o repositório, fora do produto, sem função pura nem dependência injetável; mock do git é testar o mock. Os campos estão automatizados em `products.test.ts:109-165` e `products-section.test.ts:35-43`. Agora tem bloco em `## Exclusões`. | ✅ C legítimo (repositório) |
| CT-09 (resto: console do DevTools) | só o navegador mostra; texto ausente já é B | `vi.spyOn(console, "error")` em volta de `render(<App />)` caberia em poucas linhas, mas só pegaria avisos do React no jsdom, não rede, fonte nem extensões; a mudança é texto estático e não origina erro de execução novo. Caminho real mas parcial, sem valor sobre o que o jsdom já exerce em `tsx:76-86`. Agora tem bloco em `## Exclusões`. | ✅ C legítimo |
| CT-01 (resto: "caractere a caractere") | não fixar a frase inteira; só termo-chave por id | A alegação de "snapshot disfarçado" continua a objeção errada (snapshot é `toMatchSnapshot`), mas o caminho de automação que importava foi aberto: o vínculo descrição ↔ produto e o "desde 2019" estão pinados por id em `products.test.ts:34-51`, e toda permutação é pega (Check 3). O resíduo é só a redação exata, que não é CA (CA-1 a CA-3 são regras; a redação fixa é decisão de PLAN, Q6.2) e fica no CT-01 manual. Nenhum CA depende dele, então não há CA a rebaixar. Nota de forma: o resíduo vive em "Lacunas sinalizadas", não em `## Exclusões` (P3, abaixo). | ✅ C legítimo para o resíduo; achado de forma P3 |

Exclusões refutadas: nenhuma.
AUTOTEST.md ausente (fluxo antigo): não

Consistência interna do AUTOTEST.md: contagens A/B/C e por arquivo conferem com os testes reais; rastreabilidade CA → CT → asserção aponta para linhas existentes; a tabela de classificação (CT-01 A/B, CT-02, CT-03, CT-04, CT-05, CT-08, CT-09) bate com o código. Observação menor: o texto do Resumo lista CT-06/CT-07 como C sem contagem e, em `## Exclusões`, o CT-01 residual não tem bloco (ver acima).

## Fechamento das lacunas do ciclo 1

| Lacuna (ciclo 1) | Estado | Evidência atual |
| ---------------- | ------ | --------------- |
| P1 — superlativo vazio sem guarda real (CA-2) | **Fechada** | `products.test.ts:76-78`: `/melhor\|incr[ií]ve\|delicios\|perfeit\|irresist[ií]ve\|maravilhos\|[ií]ssim/` sobre o texto em minúsculas. Cobre `perfeita` (focaccia alta→perfeita), feminino, plural e `-íssim`; sem falso positivo nos textos atuais. Resíduo teórico do léxico finito: R2 (P3, não bloqueia). |
| P2 — descrições sem vínculo com o produto; "2019" (CA-1/CE-1, CT-01) | **Fechada** | `products.test.ts:34-51`: mapa de termo-chave por id, com `Object.keys(termosChave)` igual à ordem dos ids. Cinco dos seis termos são únicos; qualquer permutação é pega. Troca `orange-cake` ↔ `filter-coffee` e `2019` → `2018` agora falham. |
| P3 — horário só pegava `Nh` | **Fechada** (descrições) | `products.test.ts:104`: `/\b\d{1,2}\s?(h\|horas?)(?![a-zà-ú])/` após `replace(/36 horas/g, "")`; pega "7h30" e "às 7 horas"; não casa "2019". O `replace` não mascara "36 horas" alheio porque `:86-90` o proíbe fora do `sourdough`. O subtítulo manteve o regex `Nh` (R1, P3, fora de CA). |
| P4 — nome "no máximo uma vez" vs asserção; `:31` quase vácuo | **Fechada** | `products.test.ts:93` agora diz "exatamente uma vez"; a asserção `heroContent.title` e o import foram removidos de `products-section.test.ts`, sem perder cobertura (`:29` pega "36 horas"). |
| P5 — restos manuais de CT-01, CT-08, CT-09 fora de `## Exclusões` | **Fechada para CT-08 e CT-09** (blocos adicionados); **CT-01** reduzido ao resíduo de redação exata, ainda em "Lacunas sinalizadas" (forma, P3) | `AUTOTEST.md` `## Exclusões`; ver Check 6. |

## Lacunas priorizadas

Nenhuma lacuna bloqueante. Recomendações não bloqueantes:

1. [P3] R1 — `src/content/products-section.test.ts:28` — usar o mesmo regex de horário de `products.test.ts:104` (`/\b\d{1,2}\s?(h|horas?)(?![a-zà-ú])/`) no subtítulo, depois de tirar nada (o subtítulo não pode ter "36 horas", já vedado em `:29`).
2. [P3] `tasks/FOR-006/AUTOTEST.md` — registrar o resíduo "redação exata do CT-01" como bloco em `## Exclusões` (hoje em "Lacunas sinalizadas").
3. [P3] R2 — nenhum ajuste exigido; o léxico de superlativo é finito e o julgamento humano está no TEST.md CT-03.
