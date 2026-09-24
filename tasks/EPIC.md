# EPIC — Site da Fornalha

## Produto

A Fornalha é uma padaria de fermentação natural (fictícia). O site é uma página só: apresenta a padaria, mostra o cardápio, diz quando abre e recebe encomendas de fim de semana. Sem login, sem pagamento, sem backend.

## Para quem

Vizinhos do bairro, no celular, com pressa: "tem pão hoje?", "que horas abre?", "dá para encomendar?".

## Marca

- **Voz:** trata por "você"; frases curtas; o concreto no lugar do adjetivo. Sem emoji, sem exclamação em série, sem superlativo vazio ("o melhor", "incrível", "delicioso").
- **Cor:** terracota como primária (forno, tijolo), fundo claro quente, texto carvão. No escuro, um terracota mais claro.
- **Tipografia:** títulos com serifa (Fraunces), corpo na fonte do sistema.

## Fatos da marca (use nos textos; não invente outros)

- Fermentação natural de 36 horas; o fermento está vivo desde 2019.
- Fornadas às 7h e às 16h.
- Farinha orgânica de moinho de pedra.
- Endereço: Rua do Forno, 120 — Centro.
- Horários: segunda, fechado; terça a sexta, 7h–19h; sábado, 7h–14h; domingo, 7h–12h.
- Encomendas de fim de semana até sexta, 18h.
- Instagram: @fornalha.padaria. O WhatsApp vem do `.env` (número fictício).

## Perguntas frequentes (usadas em FOR-010)

1. **Vocês abrem na segunda?** Não. Segunda é o dia de alimentar o fermento e limpar o forno.
2. **Até quando posso encomendar para o fim de semana?** Até sexta, 18h.
3. **Tem pão sem glúten?** Não. Tudo que sai do forno leva trigo, e não dá para garantir ausência de contaminação.
4. **O pão dura quantos dias?** De três a quatro, embrulhado em pano. Para durar mais, fatie e congele.
5. **Aceitam cartão?** Sim: débito, crédito e Pix.

## Seções, na ordem final da página

Cabeçalho · Hero · Cardápio · Quem já provou · Encomenda · Perguntas frequentes · Horários e endereço · Rodapé

## Fora do escopo do épico

Backend, pagamento, login, CMS, i18n, analytics, SEO além do básico.

## Glossário

| Na tela              | No código                     |
| -------------------- | ----------------------------- |
| Cardápio             | `products`, `ProductsSection` |
| Quem já provou       | `testimonials`                |
| Encomenda            | `order`                       |
| Perguntas frequentes | `faq`                         |
| Horários e endereço  | `hours`                       |
