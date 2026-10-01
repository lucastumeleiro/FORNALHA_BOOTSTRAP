# PLAN-01 — FOR-007: seção Horários e endereço

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** mudança estrutural — seção nova (`id="horarios"`) que não existe na página
**Layout aprovado:** https://claude.ai/artifact/39hNMbopC72PBDfCsT4Qoz (aprovado pela pessoa em 2026-10-01)

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-007/TASK.md

## Escopo

Criar a seção "Horários e endereço" com os sete dias (hoje destacado) e o link "Como chegar", montada em `App.tsx` entre o Cardápio e o rodapé.

**Por que um PLAN só:** são cinco arquivos pequenos de um mesmo domínio (frontend), com dependência linear entre eles (lib → content → section → App). Partir não traria paralelismo.

## Passos de Implementação (ordenados)

### Passo 1 — Função pura do dia de hoje

**Fonte:** TASK.md §Premissas P1, P2 | padrão: skill `arquitetura` AR-03 + `src/lib/format-price.ts`

- Criar `src/lib/weekday.ts` exportando `getWeekdayIndex(date: Date): number`, que devolve o índice com **segunda = 0 … domingo = 6** a partir de `date.getDay()` (domingo = 0 no JS).
- Sem React, sem DOM: a data chega por parâmetro (é o que permite teste categoria A).
- Fuso: usa `getDay()` (horário local do navegador) — P1.

### Passo 2 — Função pura da URL do Google Maps

**Fonte:** TASK.md §Comportamento Esperado 4 | padrão: AR-03 + `src/lib/whatsapp.ts` (`buildWhatsappUrl`)

- Criar `src/lib/maps.ts` exportando `buildMapsUrl(address: string): string` → `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`.

### Passo 3 — Conteúdo da seção

**Fonte:** TASK.md §Comportamento Esperado 1, 2, 4 + P3 | EPIC §Fatos da marca (horários, endereço, fornadas) | layout aprovado (subtítulo e selo "Hoje") | padrão: AR-01 + `src/content/hero.ts`, `src/content/footer.ts` | decisão da Fase 3 (Q2.2, Q4.1)

- Criar `src/content/hours.ts` exportando `hoursContent` (`as const`) com:
  - `title`: "Horários e endereço"
  - `subtitle`: "Fornadas às 7h e às 16h."
  - `todayLabel`: "Hoje"
  - `days`: os sete, **em ordem de segunda a domingo** (o índice casa com `getWeekdayIndex`), cada um com `label` e `hours`; segunda com `hours: "Fechado"` e `closed: true`. Horários do EPIC: terça a sexta 7h–19h, sábado 7h–14h, domingo 7h–12h (usar en dash `–`, como no EPIC).
    - Rótulos fixos, por extenso e sem sufixo: "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo" (Q4.1).
    - Contrato do item: `{ label: string; hours: string; closed?: true }`. `hours` é o texto exibido; o estilo de dia fechado é derivado de `closed` (Q2.2).
    - A Fase 6b inclui um teste A em `content/hours.ts`: "todo dia com `closed` tem `hours` igual a 'Fechado'" (Q2.2).
  - `address`: "Rua do Forno, 120 — Centro" (duplicado de `footerContent`, sem tocar no rodapé — P3)
  - `addressLabel`: "Endereço"
  - `directions.label`: "Como chegar"
- Nenhum texto visível fica no JSX.

### Passo 4 — Componente da seção

**Fonte:** arranjo — canvas https://claude.ai/artifact/39hNMbopC72PBDfCsT4Qoz | tokens e componentes — skill `design-system` + `src/sections/products-section.tsx` (estrutura da seção), `src/components/product-card.tsx` (uso de `Card`), `src/components/whatsapp-button.tsx` (`Button asChild` + `<a>` externo + ícone lucide) | decisão da Fase 3 (Q1.1, Q2.1, Q5.1)

- Criar `src/sections/hours-section.tsx` exportando `HoursSection`.
- `<section id="horarios" className="py-16">` + `mx-auto max-w-5xl px-4`, `h2` e subtítulo com as mesmas classes da `ProductsSection`.
- Grade: empilhada no mobile, duas colunas a partir de `md` (`grid gap-8 md:grid-cols-2 md:items-start`), conforme canvas.
- **Coluna 1 — dias:** `Card` > `CardContent` > `<dl>` (o padding lateral vem do `CardContent`, como no `ProductCard`; Q1.1); cada dia é um `<div>` com `<dt>` (nome do dia) e `<dd>` (horário).
  - Hoje = `index === getWeekdayIndex(new Date())`, calculado na renderização.
  - Linha de hoje: `aria-current="date"` no `<div>` da linha, fundo `bg-primary/10`, `rounded-md px-2 py-1.5` (respiro dentro do `CardContent`; Q1.1), `font-semibold`, e `Badge` (variante padrão) com `hoursContent.todayLabel` **dentro do `<dt>`**, ao lado do nome (é o que faz o leitor de tela ler "Hoje" junto ao dia; Q5.1).
  - Dia fechado que não é hoje: `<dd>` com `text-muted-foreground`. Na linha de hoje, o `<dd>` usa sempre `text-foreground`, mesmo fechado (DS-05; Q2.1).
  - Horário com `tabular-nums`.
- **Coluna 2 — endereço:** `Card` > `CardContent` (Q1.1) com ícone `MapPin` (lucide, `aria-hidden="true"`, `text-primary`), rótulo `addressLabel`, `<address className="not-italic text-muted-foreground">` e o `Button asChild` (variante padrão) sobre `<a href={buildMapsUrl(hoursContent.address)} target="_blank" rel="noopener noreferrer">` com o label e o ícone `ExternalLink` (`aria-hidden="true"`).
- Nada de cor literal, `style=` ou valor arbitrário (DS-01/DS-02). Foco visível vem do `Button` (DS-06).

### Passo 5 — Montar no `App.tsx`

**Fonte:** TASK.md §Comportamento Esperado 1 + EPIC §Seções na ordem final | padrão: AR-02 + `src/App.tsx`

- Importar `HoursSection` e renderizá-la dentro de `<main>`, **depois** de `<ProductsSection />` (fica imediatamente antes de `<SiteFooter />`).
- As seções de FOR-008/FOR-009/FOR-010 vão entrar entre Cardápio e Horários depois; manter `HoursSection` como a última dentro de `<main>`.

## Arquivos Impactados

| Arquivo                         | Operação | Justificativa                                                                  |
| ------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `src/lib/weekday.ts`            | Criar    | Converter o dia da semana para começar na segunda (AR-03) — não está na TASK |
| `src/lib/maps.ts`               | Criar    | Montar a URL do Maps (AR-03) — não está na TASK                                 |
| `src/content/hours.ts`          | Criar    | Todo texto da seção (AR-01)                                                    |
| `src/sections/hours-section.tsx` | Criar    | Seção nova (AR-02)                                                             |
| `src/App.tsx`                   | Alterar  | Posição da seção na página                                                     |

## Contratos Exportados

- `getWeekdayIndex(date: Date): number` — `src/lib/weekday.ts`
- `buildMapsUrl(address: string): string` — `src/lib/maps.ts`
- `hoursContent` — `src/content/hours.ts`
- `HoursSection` — `src/sections/hours-section.tsx` (FOR-010 mexe em `App.tsx` depois desta)

## Convenções Aplicáveis

- Skill `arquitetura`: AR-01, AR-02, AR-03, AR-04, AR-06, AR-07
- Skill `design-system`: DS-01, DS-02, DS-04, DS-05, DS-06
- Rodar `npm run typecheck`, `npm test` e `npm run check:cores` ao final.

## Pontos de Atenção

> **O canvas é referência visual, não fonte de código.** A implementação usa
> obrigatoriamente os **tokens/estilos do design system do projeto** e
> **componentes que já existem no projeto** (quando houver biblioteca de componentes definida).
> Proibido no código: hex ou rgb do canvas, valor arbitrário fora do sistema de estilos do projeto,
> `style=` inline, px cravado onde há token, e markup próprio onde existe
> componente. **Divergir visualmente do canvas para respeitar token e componente do projeto
> é o comportamento correto — não é desvio de plano e não precisa de aprovação.**

- **CA-5 (375 px sem rolagem horizontal):** a linha do dia usa `flex justify-between gap-*` com o nome e o selo de um lado e o horário do outro; nada de largura fixa.
- **DS-05:** o fundo `bg-primary/10` só leva texto `text-foreground` (contraste alto nos dois temas), inclusive no `<dd>` "Fechado" quando hoje é segunda: `text-muted-foreground` nunca entra na linha de hoje. O caso "hoje = segunda" (CA-2 + CA-3 juntos) entra como cenário do teste de mesa (Q2.1). O selo usa o par `primary`/`primary-foreground`, que já existe. Se a Fase 4 quiser horário em `text-primary` na linha de hoje, medir o contraste nos dois temas antes de usar.
- **`new Date()` na renderização:** a seção não se atualiza se a página ficar aberta na virada do dia. Isso é aceitável (fora de escopo), e os testes vão precisar de `vi.useFakeTimers()`/`vi.setSystemTime()` para fixar sábado (CA-3). O teste de CA-3 localiza a linha pelo texto do `<dt>` (`getByText("Sábado").closest("[aria-current]")`), não por papel: o `<div>` da linha não tem papel acessível (Q5.1).
- **Endereço duplicado** em `content/footer.ts` e `content/hours.ts` (P3): é uma decisão da TASK, não unificar. A Fase 6b inclui um teste A `hoursContent.address === footerContent.address` para pegar divergência (P3; Q3.1).
- `App.tsx` também vai ser alterado por FOR-010 (e talvez FOR-008/009): a mudança aqui deve ser só uma linha de import e uma de JSX, para o conflito ser trivial.

## Premissas e Incertezas

### Premissas

1. O destaque considera **só o dia**, sem indicar "aberto agora" (resolve I1; o canvas aprovado não tem esse estado).
2. Os dias ficam em `<dl>` com pares `<dt>`/`<dd>` dentro de um `<div>` por linha (resolve I2; o canvas aprovado usa `<dl>`; `<div>` dentro de `<dl>` é HTML válido).
3. `aria-current="date"` vai no `<div>` da linha, não no `<dt>`. Como leitores de tela costumam ignorar `aria-current` em elemento genérico, o anúncio de "hoje" fica a cargo do selo "Hoje" **dentro** do `<dt>` (Q5.1).
4. Subtítulo "Fornadas às 7h e às 16h." e selo "Hoje" entram no conteúdo: não estão na TASK, mas vieram do canvas aprovado e o subtítulo usa um fato do EPIC.
5. `src/lib/weekday.ts` e `src/lib/maps.ts` não estão na lista de arquivos da TASK; entram por AR-03 (lógica com regra é função pura).
6. A grade passa a duas colunas em `md`, e não em `sm` como os cards do Cardápio, para o card de dias não ficar estreito demais.

### Incertezas

1. O link "Como chegar" abre em nova aba sem avisar quem usa leitor de tela. O `WhatsappButton` faz igual, então seguimos o padrão da casa; avisar seria um texto a mais em `content/`.
