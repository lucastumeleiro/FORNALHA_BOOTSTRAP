# PLAN-01 — FOR-011: rodapé com redes e ano automático

**Identificador:** PLAN-01
**Dependências:** nenhuma (usa `buildWhatsappUrl` e `hasWhatsappNumber` de FOR-005, já em `src/lib/whatsapp.ts`)
**Paralelizável com:** — (PLAN único)
**Triagem visual:** ajuste pontual — links novos dentro do `<footer>` que já existe; nenhuma seção, componente ou layout novo, sem reorganização

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-011/TASK.md

**Por que um PLAN só:** 2 arquivos de produção, mesmo domínio (rodapé), sem dependência interna.

## Escopo

Rodapé calcula o ano na renderização e ganha links de Instagram e WhatsApp (este só com `VITE_WHATSAPP_NUMBER`), mantendo `id="contato"` e o endereço.

## Passos de Implementação (ordenados)

### Passo 1 — Conteúdo do rodapé

**Fonte:** TASK.md §Comportamento Esperado 1–2; skill `arquitetura` (AR-01) | padrão: `src/content/hero.ts` (`whatsapp.label` / `whatsapp.message`)

- Em `src/content/footer.ts`, trocar `copyright: "© 2025 Fornalha"` por partes que permitam compor o ano no componente (o nome da marca sem o ano fixo). O símbolo "©" também vive no content (ex.: `copyright: { symbol: "©", brand: "Fornalha" }`), nunca literal no JSX.

**Fonte:** decisão da Fase 3 (Q1.1)
- Adicionar o bloco de redes: Instagram (URL `https://instagram.com/fornalha.padaria`, `label` e `aria-label`) e WhatsApp (`label`, `aria-label`, `message` própria — ver Incerteza 1).
- Todo texto visível e todo `aria-label` ficam aqui, nunca literais no JSX.
- Manter `address` como está (P3).

### Passo 2 — Ano calculado na renderização

**Fonte:** TASK.md §Comportamento Esperado 1, P1 | leitura de código (`src/sections/site-footer.tsx:8`)

- Em `src/sections/site-footer.tsx`, calcular o ano com `new Date().getFullYear()` **dentro do corpo do componente** (não no escopo do módulo), para que um relógio simulado nos testes (CA-1) seja respeitado.
- Renderizar "© {ano} Fornalha" a partir do conteúdo do Passo 1: o JSX compõe só `{símbolo} {ano} {marca}`, sem texto literal.

**Fonte:** decisão da Fase 3 (Q1.1)

### Passo 3 — Links de redes

**Fonte:** comportamento: TASK.md §Comportamento Esperado 2, CA-2, CA-3, P2 | padrão: `src/sections/hero.tsx` (leitura de `import.meta.env.VITE_WHATSAPP_NUMBER` + `hasWhatsappNumber`) e `src/components/whatsapp-button.tsx` (`target="_blank"`, `rel="noopener noreferrer"`, ícone com `aria-hidden`)

- Instagram sempre renderiza; WhatsApp só quando `hasWhatsappNumber(...)` for verdadeiro, com href de `buildWhatsappUrl(phone, message)`.
- Ambos: `target="_blank"`, `rel="noopener noreferrer"` e `aria-label` vindo de `content/footer.ts`.
- **Sem ícone** em nenhum dos dois links: Instagram e WhatsApp só com texto (o `lucide-react` não tem a marca; `MessageCircle` sai do rodapé).

**Fonte:** decisão da Fase 3 (Q1.2)
- Links são `<a>` simples (não o `WhatsappButton`, que é um `Button` outline `lg` grande demais para rodapé).
- Aparência: classes semânticas (`text-muted-foreground`, `hover:text-foreground`) e foco visível via `ring` do tema; **sem** cor literal nem paleta de fábrica (DS-01/DS-02/DS-06).
- Arranjo: endereço e copyright continuam como estão; links numa linha própria no mesmo contêiner `max-w-5xl`.
- Não ultrapassar 150 linhas no arquivo (AR-07); se o JSX crescer, extrair componente para `src/components/`.

### Passo 4 — Teste

**Fonte:** skill `teste-automatizado` | padrão: `src/sections/products-section.test.tsx`

- Teste de componente ao lado de `site-footer.tsx` (`site-footer.test.tsx`), nomes em português, cobrindo CA-1 (relógio em 2027 via `vi.useFakeTimers` + `vi.setSystemTime`), CA-2 (sem número → só Instagram; `vi.stubEnv`) e CA-3 (`target`, `rel`, nome acessível). O nome acessível é comparado com o `ariaLabel` esperado de cada link (`toHaveAccessibleName(<string>)`), nunca com `/\S/`.

**Fonte:** decisão da Fase 3 (Q5.1) Também: com número, WhatsApp aparece com href `wa.me`; `id="contato"` presente.
- Classificação A/B/C final fica para a Fase 6b (`/autotest`); este passo só garante que os CAs têm cobertura.

## Arquivos Impactados

| Arquivo                          | Operação | Justificativa                                         |
| -------------------------------- | -------- | ----------------------------------------------------- |
| `src/content/footer.ts`          | Editar   | Marca sem ano fixo; textos e `aria-label` das redes   |
| `src/sections/site-footer.tsx`   | Editar   | Ano dinâmico e links de Instagram/WhatsApp            |
| `src/sections/site-footer.test.tsx` | Criar | Cobertura de CA-1, CA-2 e CA-3                        |

## Contratos Exportados

- _Nenhum_ (`footerContent` muda de forma, mas só `site-footer.tsx` o consome).

## Convenções Aplicáveis

- Skills: `arquitetura` (AR-01, AR-03, AR-05, AR-06, AR-07), `design-system` (DS-01, DS-02, DS-06), `teste-automatizado`.
- Sem backend, sem dependência nova, sem variável de ambiente nova (reusa `VITE_WHATSAPP_NUMBER`, já tipada em `src/vite-env.d.ts`).

## Pontos de Atenção

- A seção `contato` é âncora de navegação (`id="contato"`); não pode se perder na edição.
- Grep por `2025` em `src/` na hora de implementar, para não sobrar o ano fixo em outro lugar.
- Qualquer outro consumidor de `footerContent.copyright` deve ser achado e ajustado ao remover a chave.
- `node_modules` não existe neste worktree: `npm install` antes de rodar `typecheck`/`test`.
- A implementação antecedeu a Fase 3; os ajustes de código e teste de Q1.1, Q1.2 e Q5.1 são feitos pela Fase 5 (`/review-feature`). **Fonte:** decisão da Fase 3 (Q2.1)

## Premissas e Incertezas

### Premissas

1. O ano vem de `new Date().getFullYear()` no momento da renderização (TASK P1).
2. WhatsApp do rodapé some sem `VITE_WHATSAPP_NUMBER`, igual ao hero (TASK P2).
3. O endereço atual do rodapé não muda (TASK P3).

### Incertezas

1. **Mensagem do WhatsApp (TASK I1):** não confirmada. Default deste PLAN: mensagem própria em `content/footer.ts` (AR-01 pede texto da seção no content da seção), em vez de importar de `hero.ts`. **Decidida na Fase 3 (Q2.2):** mensagem própria "Olá, vim pelo site da Fornalha.".
2. **Ícone do Instagram (TASK I2):** `lucide-react` está em `^1.48.0` e `node_modules` não está instalado, então não foi possível verificar. Ícones de marca foram removidos do lucide nas versões recentes, então é provável que não exista `Instagram`. Default deste PLAN: verificar após `npm install`; se não houver, o link do Instagram fica **só com texto** (sem ícone genérico enganoso). **Decidida na Fase 3 (Q1.2, Q2.2):** `Instagram` não existe no `lucide-react` 1.48.0; os dois links ficam só com texto.
