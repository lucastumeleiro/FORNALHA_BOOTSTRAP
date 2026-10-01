# [FEATURE] FOR-009 — Títulos com serifa

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** design + dependência · **Depende de:** — · **Vem depois de:** FOR-001 (`src/index.css`) · **Pode rodar em paralelo com:** FOR-007, FOR-008 · **Precede:** FOR-010 (lockfile)

## Contexto

Tudo usa a fonte do sistema, e a marca pede títulos com personalidade (EPIC §Marca).

## Comportamento Esperado

1. Instalar `@fontsource-variable/fraunces`.
2. Token `--font-heading` no `@theme inline`; `h1`, `h2` e `h3` usam essa família, pelo `@layer base`.
3. O corpo continua na fonte do sistema.

## Arquivos/Módulos Afetados

- `package.json`
- `package-lock.json`
- `src/index.css`

## Critérios de Aceite

- [ ] **CA-1** — Dado a página, então os títulos saem em Fraunces (DevTools → Computed → Rendered Fonts) e o corpo, na fonte do sistema.
- [ ] **CA-2** — Dado o `npm run build`, então a fonte sai empacotada no `dist`, sem requisição a serviço externo de fontes.
- [ ] **CA-3** — Dado o diff, então nenhum arquivo em `src/` mudou além de `src/index.css`, e fora de `src/` só `package.json` e `package-lock.json`. _(decisão da Fase 3, Q2.2)_

## Fora de escopo

Fonte do corpo, pesos por seção.

## Premissas e Incertezas

**Premissas**

- P1 — O `--font-heading` que o shadcn já declara no `@theme inline` é o token a ajustar; não se cria outro.
- P2 — "Fonte do sistema" é a pilha `font-sans` padrão do Tailwind, que o `html` já usa.
- P3 — O pacote variável cobre os pesos que os títulos usam hoje (`font-semibold`, `font-bold`).

**Incertezas**

- I1 — ~~Se texto com cara de título que não é `h1`–`h3` (a marca "Fornalha" no cabeçalho) também passa para a serifa.~~ **Resolvida (Q2.1):** a marca fica fora de escopo, porque CA-3 proíbe mudar componente; follow-up.
- I2 — ~~Se o eixo óptico (`opsz`) da Fraunces precisa de ajuste nos tamanhos grandes do hero.~~ **Resolvida (Q3.1):** importar a variante com `opsz` (`@fontsource-variable/fraunces/opsz.css`), confirmando o nome do arquivo e da família no pacote instalado.
