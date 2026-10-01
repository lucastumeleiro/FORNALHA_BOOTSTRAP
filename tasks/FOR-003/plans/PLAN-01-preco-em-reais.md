# PLAN-01 — FOR-003: preço formatado em reais (pt-BR)

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** ajuste pontual — troca do markup de preço dentro do `ProductCard` que já existe (mesma posição, mesma informação); não cria tela, componente estrutural novo nem reorganiza layout

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-003/TASK.md

## Escopo

Substituir a formatação manual (`R\$ ${value.toFixed(2)}`) por `formatPrice` + `PriceTag`, usando `Intl.NumberFormat("pt-BR")`.

## Passos de Implementação (ordenados)

### Passo 1 — Criar `formatPrice` em `src/lib/format-price.ts`

**Fonte:** TASK.md §Comportamento Esperado item 1 | arquitetura skill (`src/lib/<nome>.ts`: função pura — sem React, sem DOM, sem `import.meta.env`)

- Função `formatPrice(value: number): string` usando `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`.
- Instância do `Intl.NumberFormat` criada uma vez no escopo do módulo (fora da função), não a cada chamada — ver Incerteza I2.
- Export nomeado, sem export default (segue padrão de módulo único do projeto).

### Passo 2 — Criar componente `PriceTag` em `src/components/price-tag.tsx`

**Fonte:** TASK.md §Comportamento Esperado item 2 | arquitetura skill (`src/components/<nome>.tsx`: componente da casa reutilizável, recebe dados por prop) | import via `@/` (AR-06) | decisão da Fase 3 (Q2.1, Q5.1)

- Prop `value: number`; renderiza `formatPrice(value)` (importado de `@/lib/format-price`) como conteúdo do elemento.
- Classes: `font-semibold tabular-nums` (comportamento pedido pela TASK), sem cor literal nem classe de paleta de fábrica — herda a cor de texto do contexto onde é usado (DS-01/DS-02 não se aplicam: nenhuma cor é declarada no componente). **Decisão deliberada** (Fase 3, Q5.1): `PriceTag` sem cor própria não é só ausência de necessidade — é o que permite `tasks/FOR-014` (selo "Esgotado") esmaecer preço e nome só com uma classe do card (`text-muted-foreground`), sem prop nova no `PriceTag`. Não adicionar cor própria ao componente sem revisar FOR-014 antes.
- Elemento raiz: `<data value={String(value)}>` — decisão da Fase 3 (Q2.1): mais correto semanticamente que `<span>` para "texto legível por humano associado a valor legível por máquina", mesmo custo de layout (inline, sem estilo próprio).

### Passo 3 — `ProductCard` passa a usar `PriceTag`

**Fonte:** TASK.md §Comportamento Esperado item 3 | leitura de código (`src/components/product-card.tsx:30`)

- Trocar `<p className="font-medium">{\`R\$ ${product.price.toFixed(2)}\`}</p>` por `<PriceTag value={product.price} />`.
- Import de `PriceTag` via `@/components/price-tag`.
- Confirmar (CA-4) que não sobra nenhum `toFixed` em `src/` após a troca — hoje é a única ocorrência no projeto.
- A troca substitui um elemento de bloco (`<p>`) por um elemento inline (`<data>`, decisão Q2.1) — seguro hoje porque `PriceTag` é o único filho de `CardContent` (`src/components/ui/card.tsx:71-79`, sem `flex`/`grid`). Decisão da Fase 3 (Q1.1): se `CardContent` ganhar outro filho no futuro, revisar se o elemento inline ainda é adequado.

## Arquivos Impactados

| Arquivo                          | Operação | Justificativa                                    |
| --------------------------------- | -------- | ------------------------------------------------- |
| `src/lib/format-price.ts`         | Criar    | Função pura de formatação (TASK item 1)            |
| `src/components/price-tag.tsx`    | Criar    | Componente de exibição do preço (TASK item 2)      |
| `src/components/product-card.tsx` | Editar   | Passa a usar `PriceTag` em vez de `toFixed` manual |

## Contratos Exportados

- `formatPrice(value: number): string` — `src/lib/format-price.ts`
- `PriceTag` (componente, prop `value: number`) — `src/components/price-tag.tsx`

## Convenções Aplicáveis

- Arquitetura: AR-03 (lógica com regra é função pura em `src/lib/`), AR-06 (import por `@/`)
- Design system: nenhuma cor nova nem token novo — DS-01/DS-02/DS-03 não se aplicam; `PriceTag` usa só utilitários de tipografia (`font-semibold`, `tabular-nums`), sem `style=` inline nem hex/paleta de fábrica

## Pontos de Atenção

- `PriceTag` não deve fixar cor própria — precisa continuar legível nos dois temas por herdar a cor de texto do `CardContent`, e é o que mantém `tasks/FOR-014` desbloqueado (Fase 3, Q5.1).
- Conferir que a troca em `product-card.tsx` não deixa `toFixed` residual em nenhum outro arquivo de `src/` (CA-4).
- `formatPrice` (via `Intl.NumberFormat`) separa `R$` do número com espaço não separável (`U+00A0`), não espaço normal (`U+0020`) — decisão da Fase 3 (Q3.1). Teste automatizado da Fase 6b nunca compara a saída com string digitada tipo `"R$ 12,50"`; compara com o próprio `Intl.NumberFormat(...).format(...)` ou normaliza o espaço. Ver `teste-automatizado §Armadilhas do jsdom`.

## Premissas e Incertezas

### Premissas

1. P1 — O preço chega em reais como `number` (não em centavos), como está em `src/data/products.ts`.
2. P2 — O `PriceTag` recebe o valor numérico por prop (`value`) e formata internamente com `formatPrice`.
3. P3 — O espaço entre `R$` e o número é o que o `Intl` gera (espaço não separável), e conta como `R$ 12,50` para efeito de CA-1/CA-2.

### Incertezas

1. ~~I1 — Elemento HTML raiz do `PriceTag`~~ — decidido: `<data value="…">` (Fase 3, Q2.1).
2. ~~I2 — Instância do `Intl.NumberFormat` no escopo do módulo vs. criada a cada chamada~~ — decidido: escopo do módulo, confirmado (Fase 3, Q2.2).
