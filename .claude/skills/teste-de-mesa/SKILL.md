---
name: teste-de-mesa
description: Padrão do TEST.md da Fornalha — cenários executados no navegador com a aplicação no ar a partir do worktree da task, nos dois temas e nas duas larguras quando cabe. Consumida por sdd-test-plan (Fase 6a).
---

# Teste de mesa — Fornalha

Todo CT é `Via: UI`: este produto não tem API. Quem executa é a pessoa, no navegador, com a aplicação no ar **a partir do worktree da task**:

1. abrir um terminal em `.claude/worktrees/<ID>/` (ou usar o terminal embutido do app, que já abre ali);
2. se a task lê `.env`, rodar `worktree hot <ID>` antes;
3. `npm run dev` e abrir `http://localhost:5180`. A porta é fixa: se outra task estiver no ar, o comando falha, e é preciso derrubar a outra.

## O que cada CT declara

- **Pré-condição:** tema (claro ou escuro), largura (375 px ou ≥ 1280 px no DevTools), com ou sem `.env`.
- **Passos:** cliques e teclas. Só teclado (`Tab`, `Enter`, `Esc`) quando a task cria elemento interativo.
- **Resultado esperado:** o que se vê **e** o que se confere no DevTools quando o olho não basta (contraste, `lang`, `aria-*`, `href`/`id`, classe `dark` no `<html>`, `localStorage`).

## Regras verificáveis

### TM-01 — Mudança de cor, fonte ou tema tem CT nos dois temas

**Bloqueia:** sim
**Verificação:** julgamento

### TM-02 — Mudança de layout tem CT em 375 px e em ≥ 1280 px

**Bloqueia:** sim
**Verificação:** julgamento

### TM-03 — Task que lê `.env` tem um CT sem `.env` (worktree frio) e outro com `.env` (depois do `worktree hot`)

**Bloqueia:** sim
**Verificação:** julgamento

### TM-04 — Elemento interativo novo tem CT só com teclado

**Bloqueia:** não
**Verificação:** julgamento
