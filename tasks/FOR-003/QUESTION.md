# QUESTION — FOR-003

Registro da rodada de questionamento adversarial (Fase 3/7 do SDD).
IDs `QN.M`: `N` = frente da crítica (1-6), `M` = item dentro da frente. Citáveis por TASK, PLANs e MEMORY.

## Resumo

| ID   | Frente                       | Desfecho             | Artefatos afetados |
| ---- | ----------------------------- | --------------------- | ------------------- |
| Q1.1 | Confronto com código existente | ✅ Aceito             | PLAN-01             |
| Q2.1 | Coerência TASK ↔ PLAN         | ✅ Aceito             | TASK.md, PLAN-01    |
| Q2.2 | Coerência TASK ↔ PLAN         | ✅ Aceito             | TASK.md, PLAN-01    |
| Q3.1 | Ataque às premissas declaradas | ✅ Aceito             | PLAN-01             |
| Q4.1 | Premissas não declaradas      | ⏳ Incerteza aberta   | —                   |
| Q5.1 | Cenários esquecidos           | ✅ Aceito             | PLAN-01             |
| Q5.2 | Cenários esquecidos           | ⏳ Incerteza aberta   | —                   |
| Q6.1 | Escopo e complexidade         | ✅ Aceito             | TASK.md             |

## Decisões

### Q1.1 — Troca de elemento de bloco por inline em `ProductCard`

**Problema:** PLAN-01 passo 3 troca `<p className="font-medium">` (bloco) por `<PriceTag>`, cujo elemento raiz é inline. Isso só é visualmente seguro hoje porque `PriceTag` é filho único de `CardContent` (`src/components/ui/card.tsx:71-79`, sem `flex`/`grid`) — o PLAN não registrava esse raciocínio.

**Decisão:** manter a troca; registrar explicitamente no PLAN-01 que a segurança depende de `PriceTag` continuar sendo o único filho de `CardContent`, com aviso para revisar se isso mudar.

**Impacto:** `plans/PLAN-01-preco-em-reais.md` — nota adicionada no passo 3.

### Q2.1 — Elemento raiz do `PriceTag`

**Problema:** TASK.md (Incerteza I1) e PLAN-01 passo 2 deixavam em aberto `<span>` vs `<p>` vs `<data value="…">`.

**Decisão:** usar `<data value={String(value)}>` — elemento HTML5 desenhado para "texto legível por humano associado a valor legível por máquina", semanticamente mais correto que `<span>` para um preço, com o mesmo custo de layout (inline, sem estilo próprio).

**Impacto:** `TASK.md` — Incerteza I1 fechada. `plans/PLAN-01-preco-em-reais.md` passo 2 — elemento raiz trocado de `<span>` para `<data value={String(value)}>`.

### Q2.2 — Escopo da instância de `Intl.NumberFormat`

**Problema:** TASK.md (Incerteza I2) e PLAN-01 passo 1 deixavam em aberto se a instância de `Intl.NumberFormat` deveria ser criada uma vez no módulo ou a cada chamada.

**Decisão:** confirmar a escolha já feita pelo PLAN — instância única no escopo do módulo. Não há troca de locale em runtime (i18n é fora de escopo do EPIC), então recriar a cada chamada não tem vantagem.

**Impacto:** `TASK.md` — Incerteza I2 fechada (decisão confirmada, nenhuma mudança de código).

### Q3.1 — Espaço não separável (`U+00A0`) na saída de `Intl.NumberFormat`

**Problema:** P3 do TASK/PLAN afirma que o espaço entre `R$` e o número "conta como `R$ 12,50`". Verificado empiricamente (Node 24.13.1, ICU completo, neste worktree): `Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(12.5)` gera `U+00A0` (espaço não separável, codepoints `52 24 a0 31 32 2c 35 30`), não `U+0020`. CA-1/CA-2/CA-3 do TASK.md escrevem a string com espaço normal digitado — o padrão que a própria skill `teste-automatizado` (§Armadilhas do jsdom) já avisa para nunca comparar literalmente.

**Decisão:** manter CA-1/CA-2/CA-3 como estão (descrevem o que a pessoa vê, não são string literal para asserção); registrar no PLAN-01 um lembrete explícito para a Fase 6b não comparar `formatPrice(...)` com string digitada.

**Impacto:** `plans/PLAN-01-preco-em-reais.md` — nota adicionada em "Pontos de Atenção", citando `teste-automatizado §Armadilhas do jsdom`.

### Q5.1 — Acoplamento com FOR-014 (ausência de cor própria no `PriceTag`)

**Problema:** `tasks/FOR-014/TASK.md` (Incerteza I2) depende de o `PriceTag` não ter cor própria para poder esmaecê-lo só com uma classe do card, sem prop nova. PLAN-01 já decide isso (passo 2), mas não registrava que é a decisão que mantém FOR-014 desbloqueado.

**Decisão:** manter `PriceTag` sem cor própria (herda do contexto); registrar explicitamente essa dependência para não ser revertida sem querer numa fase futura.

**Impacto:** `plans/PLAN-01-preco-em-reais.md` — nota adicionada no passo 2 e em "Pontos de Atenção", citando FOR-014 I2.

### Q6.1 — Mudança de peso tipográfico (`font-medium` → `font-semibold`)

**Problema:** TASK.md rotulado `[BUG]`, mas Comportamento Esperado item 2 pede `font-semibold` — hoje é `font-medium` (`product-card.tsx:30`). §Contexto só reclama do formato de locale, não menciona a mudança de peso.

**Decisão:** manter `font-semibold` — intencional (mais destaque ao preço), não efeito colateral da correção de locale.

**Impacto:** `TASK.md` — nota adicionada ao item 2 do Comportamento Esperado, esclarecendo que o peso visual é decisão intencional.

## Incertezas abertas

Não bloqueiam a Fase 4 — resolver durante a execução ou depois.

- **Q4.1** — Dependência de dados ICU completos (full-icu) no runtime Node usado em `npm test`/`npm run build`, não declarada em `engines` no `package.json` nem em CI (que não existe neste repositório). Risco baixo — builds oficiais do Node ≥ 13 vêm com full-icu por padrão —, mas confirmar se algum CI futuro usar imagem small-icu.
- **Q5.2** — `formatPrice` virou contrato exportado reutilizável (`Contratos Exportados`), mas TASK/PLAN só cobrem os valores atuais do cardápio (positivos, poucas casas decimais). Comportamento para `0`, negativo ou `NaN` fica delegado ao padrão do `Intl`, sem tratamento especial — confirmar se isso é suficiente se `formatPrice` for reusado (ex.: preço promocional).

## Alterações aplicadas

| Arquivo                           | O que mudou                                                                                   | Origem |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- | ------ |
| `TASK.md`                          | Incerteza I1 fechada (elemento raiz = `<data value="…">`)                                       | Q2.1   |
| `TASK.md`                          | Incerteza I2 fechada (confirma escopo de módulo)                                                | Q2.2   |
| `TASK.md`                          | Comportamento Esperado item 2: nota sobre `font-semibold` ser intencional                       | Q6.1   |
| `plans/PLAN-01-preco-em-reais.md` | Passo 2: elemento raiz trocado de `<span>` para `<data value={String(value)}>`                  | Q2.1   |
| `plans/PLAN-01-preco-em-reais.md` | Passo 2: nota sobre `PriceTag` sem cor própria proteger `tasks/FOR-014`                          | Q5.1   |
| `plans/PLAN-01-preco-em-reais.md` | Passo 3: nota sobre `PriceTag` ser filho único de `CardContent` hoje (bloco → inline)            | Q1.1   |
| `plans/PLAN-01-preco-em-reais.md` | Pontos de Atenção: reforço da nota de FOR-014                                                   | Q5.1   |
| `plans/PLAN-01-preco-em-reais.md` | Pontos de Atenção: lembrete sobre `U+00A0` em testes automatizados                               | Q3.1   |
| `plans/PLAN-01-preco-em-reais.md` | Incertezas: I1 e I2 fechadas                                                                    | Q2.1, Q2.2 |
