# PLAN-01 — FOR-012: filtro do cardápio por categoria

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** ajuste pontual — uma linha com quatro `Button` existentes e a contagem entra acima da grade da seção Cardápio; título, subtítulo, grade e card ficam como estão. A classe foi decidida pela pessoa em 2026-10-19, porque o caso estava no empate.

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-012/TASK.md · tasks/EPIC.md

## Escopo

Função pura `filterProducts` em `src/lib/` e, na `ProductsSection`, os botões "Todos / Pães / Doces / Bebidas" com `aria-pressed` e a contagem de produtos no singular ou no plural.

**Por que um PLAN só:** são três arquivos de um único domínio (frontend). A função pura não tem outro consumidor e é pequena demais para virar um PLAN separado.

## Passos de Implementação (ordenados)

### Passo 1 — Função pura `filterProducts`

**Fonte:** comportamento: TASK.md §Comportamento Esperado 1 | padrão: skill `arquitetura` AR-03 + `src/lib/weekday.ts` (uma função exportada, sem React)

- Criar `src/lib/filter-products.ts` com:
  - `export type ProductFilter = ProductCategory | "all"`, com o tipo importado de `@/data/products` por `import type`.
  - `export function filterProducts(products: Product[], category: ProductFilter): Product[]`.
- `"all"` devolve todos os produtos. Uma categoria devolve só os produtos dela, **na ordem original**.
- A função não muta a lista de entrada. `products` chega por parâmetro e o arquivo não importa o valor `products` de `src/data/`.

### Passo 2 — Textos novos em `content/products-section.ts`

**Fonte:** comportamento: TASK.md §Comportamento Esperado 2–3, P1 | padrão: skill `arquitetura` AR-01 + `src/content/products-section.ts`

- Acrescentar ao objeto, **sem alterar** `title`, `subtitle` nem `categoryLabels` (o teste `src/content/products-section.test.ts` trava os três):
  - `allLabel: "Todos"`
  - `filterGroupLabel: "Filtrar por categoria"` (nome acessível do grupo; I2 decidida, **Fonte:** decisão da Fase 3 (Q3.2))
  - `productCount: { one: "produto", other: "produtos" }`
- Manter o `as const`.

### Passo 3 — Botões de filtro e contagem na `ProductsSection`

**Fonte:** comportamento: TASK.md §Comportamento Esperado 2–3, CA-1..CA-4, P2 | padrão: `src/sections/hours-section.tsx` (uso de `Button`, `@/lib/utils` e estado derivado na seção) + skill `design-system` DS-02/DS-06 | decisão da Fase 3 (Q3.1, Q4.1, Q4.2, Q5.1)

- `useState<ProductFilter>("all")` local na seção (P2, AR-04).
- Montar as opções como `"all"` com `allLabel`, seguido de `Object.keys(categoryLabels) as ProductCategory[]` com os rótulos de `categoryLabels`. A ordem de inserção já é Pães, Doces, Bebidas. Uma categoria nova em `categoryLabels` ganha botão sem mexer na seção, e `categoryLabels` não muda. Os rótulos vêm do content e nenhum texto fica literal no JSX (AR-01). **Fonte:** decisão da Fase 3 (Q4.2)
- Clicar no botão que já está ativo **não faz nada**: o `onClick` só faz `setFilter(option)`, sem alternar de volta. Sempre há exatamente um `aria-pressed="true"`, e "Todos" é o único jeito de voltar à lista completa. **Fonte:** decisão da Fase 3 (Q4.1)
- Entre o subtítulo e a grade, uma linha com:
  - um contêiner `role="group"` com `aria-label={filterGroupLabel}` e `flex flex-wrap gap-2` em volta dos quatro `Button` (`type="button"`, `size="lg"`). O ativo usa `variant="default"` e `aria-pressed={true}`; os demais usam `variant="outline"` e `aria-pressed={false}`. `aria-pressed` vai **sempre** como booleano, para que o DOM fique com `"true"`/`"false"` e nunca sem o atributo (CA-4). **Fonte:** decisão da Fase 3 (Q3.2, Q5.1)
  - a contagem num elemento **à parte** do grupo, com `basis-full sm:basis-auto` (em 375 px fica numa linha própria e previsível), em `text-muted-foreground`, com `aria-live="polite"` **e** `aria-atomic="true"`. O texto é **uma única string**, `` `${n} ${n === 1 ? one : other}` ``, com `n` igual ao tamanho da lista filtrada (CA-1, CA-2). Nunca `{n} {word}` solto no JSX, porque isso gera nós de texto separados e o anúncio sai pela metade. **Fonte:** decisão da Fase 3 (Q3.1, Q5.1)
- A grade mapeia `filterProducts(products, filter)` no lugar de `products`. `ProductCard` não muda.
- Layout com utilitários do Tailwind e classes semânticas (`flex flex-wrap items-center gap-*`). Nada de cor literal nem paleta de fábrica (DS-01/DS-02). O foco visível vem do próprio `Button` (DS-06), e o `size="lg"` sai do `buttonVariants` existente, sem editar `button.tsx` (DS-04).
- O arquivo deve ficar bem abaixo de 150 linhas (AR-07), sem precisar extrair componente.

### Passo 4 — Ajustar a asserção existente que a mudança quebra

**Fonte:** leitura de código (`src/sections/products-section.test.tsx:51-53`) | decisão da Fase 3 (Q1.1)

- O teste "deve mostrar nome, preço e categoria…" conta `getAllByText("Pães")` = 3, `"Doces"` = 2 e `"Bebidas"` = 1. Com os botões, cada rótulo aparece uma vez a mais e o teste fica vermelho.
- Correção mínima: restringir a contagem aos badges dos cards com `getAllByText("Pães", { selector: '[data-slot="badge"]' })`, e o mesmo para "Doces" e "Bebidas". O `Badge` já expõe `data-slot="badge"` (`src/components/ui/badge.tsx:40`), então a seção não ganha `data-testid` nem `role` só para o teste. A intenção do teste não muda. Nenhum teste novo entra aqui: os testes dos CAs são da Fase 6b.
- Rodar `npm test`, `npm run typecheck` e `npm run check:cores`, todos verdes.

## Arquivos Impactados

| Arquivo                                  | Operação | Justificativa                                                  |
| ---------------------------------------- | -------- | -------------------------------------------------------------- |
| `src/lib/filter-products.ts`             | Criar    | Função pura `filterProducts` + tipo `ProductFilter` (TASK §1)  |
| `src/content/products-section.ts`        | Alterar  | Rótulo "Todos", nome do grupo, singular/plural da contagem     |
| `src/sections/products-section.tsx`      | Alterar  | Estado do filtro, botões, contagem, grade filtrada             |
| `src/sections/products-section.test.tsx` | Alterar  | Só a asserção de rótulos que os botões quebram (Passo 4)       |

## Contratos Exportados

- `type ProductFilter = ProductCategory | "all"` em `src/lib/filter-products.ts`
- `function filterProducts(products: Product[], category: ProductFilter): Product[]` em `src/lib/filter-products.ts`
- `productsSectionContent.allLabel`, `.filterGroupLabel` e `.productCount` em `src/content/products-section.ts`

## Convenções Aplicáveis

- Skill `arquitetura`: AR-01 (texto no content), AR-03 (lógica pura em `src/lib/`), AR-04 (`useState` local), AR-06 (import `@/`), AR-07 (≤150 linhas)
- Skill `design-system`: DS-01/DS-02 (sem cor literal), DS-04 (`components/ui/button.tsx` não se edita), DS-06 (foco e nome acessível)
- Comentários em português; identificadores em inglês

## Pontos de Atenção

- **Teste existente quebra.** Como o rótulo "Pães" passa a aparecer também no botão, `products-section.test.tsx:51-53` falha sem o Passo 4. Esse arquivo não está na lista da TASK; ele entra aqui só para manter a suíte verde. (Q1.1)
- **Conflito previsto com o FOR-014.** O FOR-014 precede esta task na TASK, mas ainda não está no `main`, e a ordem foi invertida de propósito. Ele também acrescenta o texto "Esgotado" ao objeto de `src/content/products-section.ts`. Quem mergear depois resolve o conflito mantendo as duas adições (`allLabel`, `filterGroupLabel`, `productCount` e o texto do FOR-014). **Fonte:** decisão da Fase 3 (Q2.1)
- `src/components/ui/button.tsx` não se edita (DS-04). A diferença entre ativo e inativo vem só de `variant`.
- O `cn` do projeto vem do pacote npm `cn` (`src/lib/utils.ts`), não do `clsx` + `tailwind-merge` de sempre do shadcn. Se precisar compor classes, importe de `@/lib/utils`, como em `hours-section.tsx`.
- Com o filtro "Todos", a página precisa ficar idêntica à de hoje (seis cards, na mesma ordem), mais a linha de filtros.

## Premissas e Incertezas

### Premissas

1. Os rótulos reusam `categoryLabels`, mais `allLabel: "Todos"` (TASK P1). A ordem dos botões segue a da TASK: Todos, Pães, Doces, Bebidas.
2. O filtro é `useState` local e volta para "Todos" ao recarregar (TASK P2).
3. **P3 da TASK vale por construção:** hoje `Product` (`src/data/products.ts`) não tem campo de esgotado, porque o FOR-014 ainda não entrou. `filterProducts` filtra só por `category`, então todo produto da lista, esgotado ou não, entra na grade e na contagem, também depois do FOR-014. O PLAN não cria esse campo. (Q2.1)
4. A escolha entre singular e plural fica na seção (`n === 1`). É a única regra de plural do site e não justifica um arquivo novo em `src/lib/`. Zero não ocorre com os dados atuais; se ocorrer, vira "0 produtos".
5. `filterProducts` preserva a ordem de `src/data/products.ts`.

### Incertezas

Nenhuma em aberto. As três da versão anterior foram decididas na Fase 3:

1. **I1 da TASK — `aria-live` na contagem.** Decidida (Q3.1): `aria-live="polite"` + `aria-atomic="true"`, com o texto como uma única string (passo 3).
2. **I2 da TASK — grupo com rótulo.** Decidida (Q3.2): `role="group"` + `aria-label="Filtrar por categoria"` (passos 2 e 3).
3. **Forma da asserção do Passo 4.** Decidida (Q1.1): `selector: '[data-slot="badge"]'` (passo 4).
