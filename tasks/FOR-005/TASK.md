# [FEATURE] FOR-005 — Encomendar pelo WhatsApp

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** componente + ambiente · **Depende de:** — · **Vem depois de:** FOR-002 (`content/hero.ts`) · **Pode rodar em paralelo com:** FOR-004, FOR-006 · **Precede:** FOR-011 (contrato)

## Contexto

A maior parte das encomendas chega por WhatsApp. O número muda por ambiente e não é versionado.

## Comportamento Esperado

1. Função pura `buildWhatsappUrl(phone: string, message: string): string` em `src/lib/whatsapp.ts`, que devolve `https://wa.me/<só os dígitos>?text=<mensagem codificada>`.
2. `WhatsappButton` em `src/components/whatsapp-button.tsx`: um link com cara de botão (`Button` `asChild`, variante `outline`), ícone `MessageCircle` do lucide, abrindo em nova aba com `rel="noopener noreferrer"`.
3. O número vem de `import.meta.env.VITE_WHATSAPP_NUMBER`, tipado. **Sem a variável, o botão não aparece**, e nada quebra.
4. O rótulo do botão e a mensagem pré-preenchida ficam em `src/content/hero.ts`.
5. O `.env.example` documenta a variável sem valor real.

## Arquivos/Módulos Afetados

- `src/lib/whatsapp.ts` (novo)
- `src/components/whatsapp-button.tsx` (novo)
- `src/sections/hero.tsx`
- `src/content/hero.ts`
- `.env.example`
- a tipagem de `import.meta.env`

## Critérios de Aceite

- [ ] **CA-1** — Dado o worktree sem `.env`, quando abro a página, então o hero mostra só o CTA do cardápio, sem erro no console.
- [ ] **CA-2** — Dado um `.env` com `VITE_WHATSAPP_NUMBER=5547999999999` (depois do `worktree hot FOR-005`), então aparece "Encomendar pelo WhatsApp" ao lado do CTA.
- [ ] **CA-3** — Dado o botão, quando clico, então abre em nova aba `https://wa.me/5547999999999?text=…`, com a mensagem de `content/hero.ts`.
- [ ] **CA-4** — Dado `buildWhatsappUrl("+55 (47) 99999-9999", "Olá!")`, então o resultado é `https://wa.me/5547999999999?text=Ol%C3%A1!`.
- [ ] **CA-5** — Dado o diff, então o `.env` não está versionado e o `.env.example` tem a variável sem número.

## Fora de escopo

Formulário (FOR-016), rodapé (FOR-011).

## Premissas e Incertezas

**Premissas**

- P1 — O número do `.env` já vem com DDI e DDD; a função só remove o que não é dígito e não acrescenta `55`.
- P2 — A mensagem pré-preenchida é fixa e não leva dado de produto.
- P3 — A tipagem de `VITE_WHATSAPP_NUMBER` fica num arquivo de declaração dentro de `src/`, estendendo `ImportMetaEnv`.

**Incertezas**

- I1 — Onde `import.meta.env` é lido: em `hero.tsx`, que passa o número por prop, ou dentro do `WhatsappButton`.
- I2 — O que fazer com valor presente mas sem nenhum dígito: esconder o botão ou montar a URL assim mesmo.
