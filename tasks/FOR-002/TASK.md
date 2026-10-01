# [FEATURE] FOR-002 — Copy do hero

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** copy · **Depende de:** — · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-001, FOR-003 · **Precede:** FOR-005

## Contexto

O hero diz "Bem-vindo à Fornalha / Pães artesanais feitos com carinho. / Saiba mais". É genérico e não diz o que a padaria tem de diferente.

## Comportamento Esperado

1. Título com até 6 palavras, subtítulo com até 20 e CTA com até 3, na voz do EPIC.
2. O texto usa ao menos um fato de §Fatos da marca.
3. O CTA continua levando a `#cardapio`.

## Arquivos/Módulos Afetados

- `src/content/hero.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado o hero, então o título tem ≤ 6 palavras, o subtítulo ≤ 20 e o CTA ≤ 3.
- [ ] **CA-2** — Dado o texto, então ele cita ao menos um fato de §Fatos da marca e não usa nenhum superlativo vazio.
- [ ] **CA-3** — Dado o CTA, quando clico, então a página vai para o Cardápio.
- [ ] **CA-4** — Dado o diff, então só `src/content/hero.ts` mudou.

## Fora de escopo

Botão de WhatsApp (FOR-005), layout do hero.

## Premissas e Incertezas

**Premissas**

- P1 — A contagem de palavras é a do texto como aparece na tela, sem contar pontuação.
- P2 — O `href` do CTA (`#cardapio`) não muda; só o rótulo.
- P3 — Nenhum fato fora de EPIC §Fatos da marca entra no texto.

**Incertezas**

- ~~I1 — Qual fato sustenta melhor o título: as 36 horas de fermentação ou as fornadas das 7h e das 16h.~~ Resolvido na Fase 3 (Q2.1, Q2.2): título usa "fermentação natural de 36 horas"; subtítulo usa "farinha orgânica de moinho de pedra"; "fornadas às 7h e às 16h" fica livre para FOR-006. Ver QUESTION.md.
- ~~I2 — Se o CTA nomeia o destino ("Ver cardápio") ou chama para uma ação ("Escolher o pão").~~ Resolvido na Fase 3 (Q2.1): CTA nomeia o destino, "Ver cardápio". Ver QUESTION.md.
