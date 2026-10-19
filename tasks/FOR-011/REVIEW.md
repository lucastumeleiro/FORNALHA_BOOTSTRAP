# REVIEW — FOR-011: Rodapé com redes e ano automático

**Veredito:** APROVADO ✅ _(atualizado após correção 5.2 — veredito original da 5.1: BLOQUEADO ❌; ver Correções aplicadas)_

**Auditado por:** sub-agentes independentes (author ≠ verifier)
**Arquivos de produção no diff:** 2 (`src/content/footer.ts`, `src/sections/site-footer.tsx`) + 1 de teste (`src/sections/site-footer.test.tsx`)

> **Entrada canônica:** `git diff origin/main...HEAD --name-only` veio vazio (trabalho não commitado, branch sem commits próprios). Foi usada a união das listas "Arquivos Impactados" dos PLANs (PLAN-01), conferida contra `git status` do worktree.

## 5.0 — Pré-passo determinístico

| Ferramenta            | Status    | Violações |
| --------------------- | --------- | --------- |
| `npm run typecheck`   | executado | 0         |
| `npm run check:cores` | executado | 0         |

Saída: `tsc -b` sem erros; `check:cores: 0 violações`.

## 5.1a — Reconciliação de regras

Escopo resolvido:

- `src/content/footer.ts` → `src/content/**` → `arquitetura`
- `src/sections/site-footer.tsx` → `src/sections/**` → `design-system` + `arquitetura`
- `src/sections/site-footer.test.tsx` → `src/sections/**` + `**/*.test.tsx` → `design-system` + `arquitetura` + `teste-automatizado`

IDs esperados: 18 · avaliados: 18 · sem seção de regras: nenhuma

| ID    | Regra                                                      | Veredito | Evidência                                                                                                                       |
| ----- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| AR-01 | Texto visível em `src/content/`, nunca literal no JSX      | VIOLAÇÃO | `src/sections/site-footer.tsx:45` — "©" literal no JSX; `src/content/footer.ts:1-16` — sem símbolo/prefixo de copyright (Q1.1) |
| AR-02 | Seção nova = arquivo + content + linha em `App.tsx`        | N-A      | nenhuma seção nova; `site-footer` é do bootstrap                                                                                |
| AR-03 | Lógica com regra é função pura em `src/lib/`               | PASS     | `site-footer.tsx:29,32` consome `hasWhatsappNumber`/`buildWhatsappUrl` de `src/lib/whatsapp.ts`; `getFullYear()` (`:9`) é leitura trivial |
| AR-04 | Sem backend, `fetch`, roteador, estado global              | PASS     | `site-footer.tsx:1-50` — só `<a href>`; nenhuma dependência nova                                                                |
| AR-05 | Ambiente só por `VITE_*`, tipado, ausência tratada         | PASS     | `site-footer.tsx:10,29`; `src/env.d.ts:3`; `.env.example:2`                                                                     |
| AR-06 | Import por `@/`                                            | PASS     | `site-footer.tsx:2-3`; `site-footer.test.tsx:3-4`                                                                               |
| AR-07 | Arquivo de produção ≤ 150 linhas                           | PASS     | `site-footer.tsx` (50 linhas); `footer.ts` (16 linhas)                                                                          |
| DS-01 | Cor literal só em `src/index.css`                          | PASS     | `check:cores: 0 violações`; `site-footer.tsx:6`                                                                                 |
| DS-02 | Classe de cor semântica                                    | PASS     | `check:cores: 0 violações`; `site-footer.tsx:6` (`text-muted-foreground`, `ring-ring/50`)                                       |
| DS-03 | Token novo nos dois temas e no `@theme inline`             | N-A      | nenhum token novo; `src/index.css` intacto                                                                                      |
| DS-04 | `src/components/ui/` sai do CLI                            | N-A      | nada em `src/components/ui/` foi tocado                                                                                         |
| DS-05 | Contraste ≥ 4,5:1 sobre cor de marca                       | N-A      | nenhuma cor de marca nem token alterado                                                                                         |
| DS-06 | Foco visível e nome acessível                              | PASS     | `site-footer.tsx:6` (`focus-visible:ring-[3px] focus-visible:ring-ring/50`); `:23,:35` (`aria-label` vindo do content)          |
| TA-01 | Teste ao lado do código                                    | PASS     | `src/sections/site-footer.test.tsx` ao lado de `site-footer.tsx`                                                                |
| TA-02 | Nome "deve … quando …" em português                        | PASS     | `site-footer.test.tsx:12,25,41,58,75`                                                                                           |
| TA-03 | Consulta por papel/rótulo; sem seletor de classe/snapshot  | PASS     | `site-footer.test.tsx:34,49,66,80` (`getByRole`); a fraqueza de asserção está em A1, abaixo                                     |
| TA-04 | Exclusão C cita a seção da skill                           | N-A      | o arquivo não tem exclusão C; classificação A/B/C é da Fase 6b                                                                  |
| TA-05 | Mock só na fronteira                                       | PASS     | `site-footer.test.tsx:8,14-15,27,43,60` — relógio e `stubEnv`, com limpeza no `afterEach`                                       |

**Nota sobre DS-06:** o sub-agente (a) marcou VIOLAÇÃO por causa do ícone `MessageCircle`. A regra, pela letra, trata de foco e nome acessível, e os dois existem; por isso fica PASS aqui. O ícone é divergência de decisão da Fase 3 (Q1.2) e está registrado como achado de aderência (A2), que também bloqueia.

### Achados de aderência às decisões da Fase 3 (sem ID de regra)

| ID | Decisão | Achado                                                                                                                                                                  | Evidência                                 |
| -- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| A1 | Q5.1    | `toHaveAccessibleName(/\S/)` aceita qualquer nome não vazio; não compara com o `ariaLabel` esperado de cada link (CA-3, PLAN-01 passo 4)                                 | `src/sections/site-footer.test.tsx:71`    |
| A2 | Q1.2    | `MessageCircle` continua importado e renderizado no link do WhatsApp; a decisão manda os dois links só com texto (PLAN-01 passo 3)                                       | `src/sections/site-footer.tsx:1,38`       |

## 5.1b — Segurança e I/O

| Severidade | Achado     | Evidência |
| ---------- | ---------- | --------- |
| —          | 0 achados  | —         |

Sweep dos 7 itens, todos limpos: segredo/telefone real (números do teste são fictícios, `99999-0000`), `.env` versionado (só `.env.example`), `dangerouslySetInnerHTML`, `rel="noopener noreferrer"` nos dois links externos (`site-footer.tsx:22,34`), `console.*`, `import.meta.env` fora de `VITE_` (`site-footer.tsx:10`) e URL do WhatsApp (`src/lib/whatsapp.ts:2,11` — número reduzido a dígitos, mensagem com `encodeURIComponent`, esquema `https:` fixo).

## Arquivos sem nenhum achado

Nenhum. Todos os três receberam achado:

- `src/content/footer.ts` — AR-01 (sem símbolo/prefixo de copyright)
- `src/sections/site-footer.tsx` — AR-01 e A2
- `src/sections/site-footer.test.tsx` — A1

Fora esses pontos, os arquivos estão limpos: imports por `@/`, 50 e 16 linhas, só tokens semânticos, `id="contato"` mantido (`site-footer.tsx:14`), `target`/`rel` corretos, mocks na fronteira. O sub-agente (b) declarou os três limpos de segurança.

## Placar

| Dimensão           | Violações | Bloqueantes |
| ------------------ | --------- | ----------- |
| Regras/arquitetura | 3         | 0           |
| Segurança          | 0         | 0           |
| Performance/IO     | 0         | 0           |

Regras/arquitetura: 1 violação de ID (AR-01) + 2 achados de aderência à Fase 3 (A1, A2), todos resolvidos em 5.2. Retrato da 5.1: 3 violações, 3 bloqueantes.

## Bloqueantes

1. ✅ Resolvido em 5.2 (correção 1) — [AR-01 · Q1.1] `src/sections/site-footer.tsx:45` e `src/content/footer.ts:1-16` — mover o símbolo "©" para o content (ex.: `copyright: { symbol: "©", brand: "Fornalha" }`, substituindo o `brand` solto se não houver outro uso) e fazer o JSX compor só `{symbol} {year} {brand}`, sem texto literal. Ajustar o teste da linha 21 para montar o esperado a partir do content.
2. ✅ Resolvido em 5.2 (correção 2) — [A2 · Q1.2] `src/sections/site-footer.tsx:1,38` — remover o import e o uso de `MessageCircle`. Opcional: tirar `inline-flex items-center gap-1.5` de `linkClass` (`:6`), que só servia ao ícone.
3. ✅ Resolvido em 5.2 (correção 3) — [A1 · Q5.1] `src/sections/site-footer.test.tsx:71` — trocar `toHaveAccessibleName(/\S/)` por comparação com o `ariaLabel` esperado de cada link (`footerContent.social.instagram.ariaLabel` e `...whatsapp.ariaLabel`), de preferência amarrando href ↔ nome.

## Observações (não bloqueia)

- O PLAN-01 cita `src/vite-env.d.ts`, que não existe; a tipagem de `VITE_WHATSAPP_NUMBER` está em `src/env.d.ts:3`. O código está correto, o PLAN está desatualizado.
- `src/sections/site-footer.test.tsx:21` repete "© 2027 Fornalha" literal, e `:37` repete a URL do Instagram; a skill `teste-automatizado` pede importar o texto de `src/content/`. O primeiro se resolve com o bloqueante 1.
- Os testes das linhas 12 e 75 não fazem `stubEnv`: passam com ou sem `.env`, mas sem isolamento explícito do ambiente.
- Grep por `2025` em `src/`: só a asserção negativa em `site-footer.test.tsx:22`. Nenhum consumidor restante de `footerContent.copyright`.
- Os bloqueantes 1–3 já estavam previstos: a Q2.1 registrou que a implementação antecedeu a Fase 3 e que o código seria ajustado pela Fase 5.

## Pontos fortes

- **(a) Regras:** a lógica de WhatsApp fica em `src/lib/whatsapp.ts` e o rodapé só consome; `getFullYear()` está dentro do componente, então o relógio simulado do CA-1 funciona; ausência de `VITE_WHATSAPP_NUMBER` tratada (CA-2).
- **(b) Segurança:** `rel="noopener noreferrer"` e `target="_blank"` nos dois links; URL do WhatsApp sanitizada e codificada; nenhum segredo nem `console.*`.

## Correções aplicadas (5.2)

Despachada a pedido do usuário ("ajustar"), via Agent tool (`general-purpose`, foreground), a partir do worktree da task. Os três bloqueantes foram corrigidos num único despacho.

| # | Regra / decisão | Arquivo | O que mudou |
| - | --------------- | ------- | ----------- |
| 1 | AR-01 · Q1.1 | `src/content/footer.ts:3`, `src/sections/site-footer.tsx:11,43` | `brand` solto virou `copyright: { symbol: "©", brand: "Fornalha" }`; o JSX compõe `` `${symbol} ${year} ${brand}` `` sem texto literal (um único nó de texto) |
| 2 | A2 · Q1.2 | `src/sections/site-footer.tsx:1,5,38` | removidos o import e o uso de `MessageCircle` e `inline-flex items-center gap-1.5` de `linkClass`; os dois links ficam só com texto |
| 3 | A1 · Q5.1 | `src/sections/site-footer.test.tsx:21-22,38,67-88` | `toHaveAccessibleName(/\S/)` trocado por laço sobre pares `{name, href}`, com `getByRole("link", { name })` + `toHaveAccessibleName(name)` + `href`/`target`/`rel`; CA-1 e CA-2 passam a ler texto e URL do content |

**Verificação (feita pelo revisor, não pelo sub-agente de correção):**

- Releitura dos três arquivos: o "©" não aparece mais literal no JSX (`site-footer.tsx:43`); `MessageCircle` não existe mais em `site-footer.tsx`; o teste de CA-3 compara com o `ariaLabel` de cada link (`site-footer.test.tsx:68-88`).
- `npm run typecheck`: `exit=0`. `npm run check:cores`: `0 violações`, `exit=0`.
- `npm test` não foi rodado pelo revisor (fora dos comandos autorizados na fase). O sub-agente relatou 5 arquivos e 26 testes passando; `/test-plan` e `/autotest` cobrem a execução.

**Observações da 5.1 também resolvidas:** a repetição de "© 2027 Fornalha" e da URL do Instagram em `site-footer.test.tsx` (antes `:21` e `:37`) agora vem do content. Seguem de pé: o PLAN-01 cita `src/vite-env.d.ts` (a tipagem está em `src/env.d.ts:3`) e dois testes sem `stubEnv`.
