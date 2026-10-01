# PLAN-01 — FOR-004: apontar o item "Cardápio" do menu para a âncora certa

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** todos os demais (não há outro PLAN nesta task)
**Triagem visual:** ajuste pontual — só o destino (`href`) de um item de menu que já existe muda; nenhum elemento é criado, movido ou redesenhado, então não há canvas

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-004/TASK.md

## Escopo

Corrigir o `href` do item "Cardápio" em `src/content/header.ts` para que o clique (desktop e celular) leve à seção do cardápio.

## Causa raiz (investigada no código)

- `src/content/header.ts:4` — o item "Cardápio" aponta para `#produtos`.
- `src/sections/products-section.tsx:7` — a seção do cardápio tem `id="cardapio"`. Nenhum elemento da página tem `id="produtos"`, então o navegador não tem para onde rolar e "não acontece nada".
- `src/content/hero.ts:4` — o botão "Ver cardápio" usa `#cardapio`, por isso funciona (bate com o relato).
- O item "Contato" (`#contato`) bate com `src/sections/site-footer.tsx:5` (`id="contato"`); não está quebrado.
- O mesmo `navItems` renderiza desktop e celular (`src/sections/site-header.tsx:10`), então uma correção cobre os dois.

## Passos de Implementação (ordenados)

### Passo 1 — Corrigir o destino do item "Cardápio"

**Fonte:** TASK.md §Relato | leitura de código (`src/content/header.ts:4`, `src/sections/products-section.tsx:7`, `src/content/hero.ts:4`)

- Em `src/content/header.ts`, trocar o `href` do item "Cardápio" de `#produtos` para `#cardapio`, o `id` que a seção já tem.
- Não renomear o `id` da seção: o botão do hero já depende dele e o glossário do épico chama a seção de "Cardápio".
- Não mexer em `site-header.tsx`: o componente já renderiza o que vem de `headerContent` (AR-01, AR-02).
- Não tocar no item "Contato".

## Arquivos Impactados

| Arquivo                 | Operação | Justificativa                                      |
| ----------------------- | -------- | -------------------------------------------------- |
| `src/content/header.ts` | Editar   | `href` do item "Cardápio": `#produtos` → `#cardapio` |

## Contratos Exportados

- _Nenhum_ (`headerContent` mantém o mesmo formato)

## Convenções Aplicáveis

- Skill `arquitetura`: AR-01 (destino e rótulo do menu moram em `src/content/`), AR-04 (navegação por âncora `#id`, sem roteador).
- Skill `design-system`: não se aplica — nenhuma classe, cor ou componente muda.

## Pontos de Atenção

- Nada que a correção precise tocar em `src/index.css`; sem `scroll-behavior` ou offset de scroll novos, pois a TASK não pede (ver Incertezas).
- O bug nasceu de dois arquivos de `content/` e uma `id` de seção divergirem em silêncio. Um teste que garanta que todo `href` de `headerContent.navItems` aponta para um `id` existente na página pegaria essa classe de erro. Isso é decisão da Fase 6b (`/autotest`), não deste PLAN.
- Comportamento no navegador (rolar até o cardápio, em desktop e celular) é verificado pela pessoa no `TEST.md`; nenhum agente roda `npm run dev`.

## Premissas e Incertezas

### Premissas

1. O resultado esperado é rolar até a seção `id="cardapio"`, a mesma que o botão "Ver cardápio" do hero já alcança (TASK.md §Relato: "O botão do meio da página funciona").
2. O relato "no celular também" é o mesmo defeito: não existe menu separado para celular, só o `navItems` compartilhado.

### Incertezas

1. O cabeçalho não é `sticky` hoje (`src/sections/site-header.tsx:5`), então a seção não fica escondida atrás dele ao rolar. Se FOR-005 ou FOR-006 (que rodam em paralelo) tornarem o cabeçalho fixo, o offset de âncora será um problema dessas tasks.
