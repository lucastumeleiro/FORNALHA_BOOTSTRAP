# [FEATURE] FOR-016 — Encomenda para o fim de semana

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** componente + design (estrutural) + primitivos · **Depende de:** — · **Vem depois de:** FOR-013 (`App.tsx`), FOR-015 (lockfile) · **Pode rodar em paralelo com:** — · **Precede:** FOR-017

## Contexto

A encomenda de fim de semana precisa chegar até sexta, e hoje só chega por WhatsApp.

## Comportamento Esperado

1. `npx shadcn@latest add input label textarea`.
2. Seção "Encomende para o fim de semana" (`id="encomenda"`), entre "Quem já provou" e "Perguntas frequentes", com os campos Nome, Telefone e Pedido.
3. Validação ao enviar, pura, em `src/lib/validate-order.ts`: nome obrigatório; telefone com 10 ou 11 dígitos, ignorando símbolos; pedido com ao menos 10 caracteres. O erro aparece embaixo do campo, com `aria-invalid` e `aria-describedby`, e o foco vai para o primeiro campo inválido.
4. Se estiver válido, o formulário some e aparece "Recebemos sua encomenda, {nome}. Confirmamos pelo telefone até sexta.", com `role="status"`. **Nada é enviado a lugar nenhum.**

## Arquivos/Módulos Afetados

- `src/components/ui/{input,label,textarea}.tsx` (gerados)
- `src/lib/validate-order.ts` (novo)
- `src/sections/order-section.tsx` (novo)
- `src/content/order.ts` (novo)
- `src/App.tsx`
- `package.json` e lockfile (se mudarem)

## Critérios de Aceite

- [ ] **CA-1** — Dado o formulário vazio, quando envio, então aparecem três erros e o foco vai para Nome.
- [ ] **CA-2** — Dado o telefone "(47) 9999-999", que tem 9 dígitos, então aparece o erro de telefone.
- [ ] **CA-3** — Dado tudo válido, então aparece a confirmação com o nome, com `role="status"`.
- [ ] **CA-4** — Dado o console, então nenhum dado do formulário é registrado.

## Fora de escopo

Envio real, máscara de telefone, data de retirada.

## Premissas e Incertezas

**Premissas**

- P1 — Nome "preenchido" quer dizer ao menos um caractere que não seja espaço.
- P2 — O "até sexta, 18h" é só texto; o formulário não bloqueia por data.
- P3 — O primeiro campo inválido segue a ordem da tela: Nome, Telefone, Pedido.

**Incertezas**

- I1 — Se os erros aparecem só ao enviar ou também ao sair do campo depois da primeira tentativa.
- I2 — Se a confirmação recebe o foco ao aparecer, além do `role="status"`.
