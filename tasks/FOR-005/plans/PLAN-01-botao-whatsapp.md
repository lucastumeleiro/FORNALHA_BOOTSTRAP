# PLAN-01 — FOR-005: botão "Encomendar pelo WhatsApp" no hero

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** todos os demais (único PLAN da task)
**Triagem visual:** mudança estrutural — componente novo (`WhatsappButton`) na página; classificado assim pela pessoa após empate com _ajuste pontual_ (o botão entra na fileira de CTAs que já existe)
**Layout aprovado:** https://claude.ai/artifact/E25pdSGVNEtA52cANfhk1Z

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-005/TASK.md

## Escopo

Função pura que monta a URL do `wa.me`, componente `WhatsappButton`, tipagem de `VITE_WHATSAPP_NUMBER` e o botão no hero ao lado do CTA do cardápio, escondido quando o número não existe.

**Um PLAN só:** são seis arquivos pequenos de um único domínio (frontend estático, sem backend nem estado); separar lib, componente e seção criaria PLANs de 1 arquivo encadeados em série, sem ganho de paralelismo.

## Passos de Implementação (ordenados)

### Passo 1 — Tipar `import.meta.env.VITE_WHATSAPP_NUMBER`

**Fonte:** TASK.md §Comportamento 3 e P3 | skill `arquitetura` AR-05 | leitura de código (`tsconfig.app.json` — `"types": ["vite/client"]`, `"include": ["src"]`; não existe `src/vite-env.d.ts`)

- Criar `src/env.d.ts` estendendo `ImportMetaEnv` (e `ImportMeta.env`) com `VITE_WHATSAPP_NUMBER` **opcional** (`readonly VITE_WHATSAPP_NUMBER?: string`), porque o worktree nasce sem `.env` (AR-05).
- Não criar `/// <reference types="vite/client" />`: o `tsconfig.app.json` já carrega os tipos do Vite.

### Passo 2 — `buildWhatsappUrl` em `src/lib/whatsapp.ts`

**Fonte:** TASK.md §Comportamento 1, CA-4, P1 | skill `arquitetura` AR-03 | padrão: `src/lib/format-price.ts`

- `export function buildWhatsappUrl(phone: string, message: string): string`.
- Remove do `phone` tudo que não é dígito; não acrescenta DDI (P1).
- Codifica a mensagem com `encodeURIComponent` (CA-4: `"Olá!"` → `Ol%C3%A1!`; `!` não é codificado por ela, o que bate com o CA).
- Devolve `https://wa.me/<dígitos>?text=<mensagem codificada>`.
- Função pura: sem React, sem DOM, sem `import.meta.env` (AR-03).

### Passo 3 — Texto em `src/content/hero.ts`

**Fonte:** TASK.md §Comportamento 4, CA-2, P2 | skill `arquitetura` AR-01 | leitura de código (`src/content/hero.ts:1-5`) | EPIC.md §Marca (voz)

- Acrescentar a `heroContent` a chave `whatsapp: { label, message }`, mantendo `as const` e as chaves existentes.
- `label`: "Encomendar pelo WhatsApp" (texto do CA-2).
- `message`: frase fixa, sem dado de produto (P2), na voz do EPIC (trata por "você", sem exclamação em série, sem emoji). Proposta: "Olá, quero fazer uma encomenda." — ver Premissa 4.

### Passo 4 — Componente `src/components/whatsapp-button.tsx`

**Fonte:** arranjo — canvas https://claude.ai/artifact/E25pdSGVNEtA52cANfhk1Z | comportamento: TASK.md §Comportamento 2 | tokens e componentes — skill `design-system` + `src/components/ui/button.tsx` (variante `outline`, tamanho `lg`) | padrão de props: `src/components/product-card.tsx` (texto chega por prop, ex. `categoryLabel`)

- Props: `phone`, `label`, `message` (todas `string`). O componente não lê `import.meta.env` nem importa de `src/content/` — recebe tudo por prop, como a skill `arquitetura` pede para `src/components/`.
- Renderiza `<Button asChild variant="outline" size="lg">` com um `<a>` dentro:
  - `href={buildWhatsappUrl(phone, message)}`
  - `target="_blank"` e `rel="noopener noreferrer"`
  - ícone `MessageCircle` de `lucide-react` antes do rótulo, decorativo (`aria-hidden`); o nome acessível é o próprio `label` (DS-06).
- Nenhuma classe de cor própria: a aparência vem da variante `outline` do `Button` (DS-01, DS-02, DS-04). Não editar `src/components/ui/button.tsx`.
- `size="lg"` é o mesmo tamanho do CTA do cardápio (`src/sections/hero.tsx:15`), para os dois ficarem com a mesma altura, como no canvas.

### Passo 5 — Ligar o botão em `src/sections/hero.tsx`

**Fonte:** arranjo — canvas https://claude.ai/artifact/E25pdSGVNEtA52cANfhk1Z (artboards "com WhatsApp" e "sem .env") | comportamento: TASK.md §Comportamento 3, CA-1, CA-2 | decisão de I1: skill `arquitetura` (componente recebe dados por prop; lib não lê `import.meta.env`) | leitura de código (`src/sections/hero.tsx:14-18`)

- Ler `import.meta.env.VITE_WHATSAPP_NUMBER` no `hero.tsx` (resolve I1: a seção lê o ambiente e passa por prop).
- Renderizar `<WhatsappButton>` **depois** do CTA do cardápio, dentro da mesma `div` `flex flex-wrap gap-3` que já existe — sem mexer em classes, ordem nem hierarquia do resto.
- Passar `label` e `message` de `heroContent.whatsapp`.
- Esconder o botão quando o número não existe. "Não existe" inclui a string vazia: `VITE_WHATSAPP_NUMBER=` (o valor do `.env.example`) chega como `""`. Tratamento de valor sem nenhum dígito: ver Incerteza 1.
- O arquivo segue abaixo de 150 linhas (AR-07).

### Passo 6 — `.env.example`

**Fonte:** TASK.md §Comportamento 5, CA-5 | skill `arquitetura` AR-05 | leitura de código (`.env.example` já contém `VITE_WHATSAPP_NUMBER=`; `.gitignore` já ignora `.env` e `.env.*` e libera `!.env.example`)

- A variável já está documentada sem valor. Acrescentar acima dela uma linha de comentário dizendo o formato esperado (com DDI e DDD; máscara é aceita e removida), sem número real.
- Manter o fim de linha do arquivo (CRLF).
- Não criar `.env`: ativar o número para o CA-2 é da pessoa, via `worktree hot FOR-005`.

### Passo 7 — Conferir

**Fonte:** CLAUDE.md §Comandos | TASK.md CA-5

- `npm run typecheck`, `npm test` e `npm run check:cores`.
- `git status` não lista `.env`; `git diff --stat` lista só os arquivos da tabela abaixo.
- Não rodar `npm run dev` (regra do repositório): CA-1, CA-2 e CA-3 são conferidos pela pessoa no `TEST.md`.

## Arquivos Impactados

| Arquivo                             | Operação | Justificativa                                       |
| ----------------------------------- | -------- | --------------------------------------------------- |
| `src/env.d.ts`                      | Criar    | Tipagem de `VITE_WHATSAPP_NUMBER` em `ImportMetaEnv` |
| `src/lib/whatsapp.ts`               | Criar    | `buildWhatsappUrl`, função pura                     |
| `src/components/whatsapp-button.tsx` | Criar    | Link com cara de botão para o WhatsApp              |
| `src/content/hero.ts`               | Editar   | Rótulo e mensagem pré-preenchida                    |
| `src/sections/hero.tsx`             | Editar   | Lê o ambiente e mostra o botão ao lado do CTA       |
| `.env.example`                      | Editar   | Comentário com o formato da variável                |

## Contratos Exportados

- `buildWhatsappUrl(phone: string, message: string): string` — `src/lib/whatsapp.ts` (FOR-011 vai reusar no rodapé)
- `WhatsappButton({ phone, label, message })` — `src/components/whatsapp-button.tsx`
- `ImportMetaEnv.VITE_WHATSAPP_NUMBER?: string` — `src/env.d.ts`
- `heroContent.whatsapp: { label, message }` — `src/content/hero.ts`

## Convenções Aplicáveis

- Skill `arquitetura`: AR-01 (texto em `content/`), AR-03 (lib pura), AR-05 (ambiente tipado, ausência tratada), AR-06 (import por `@/`), AR-07 (≤ 150 linhas).
- Skill `design-system`: DS-01/DS-02 (sem cor literal nem classe de paleta), DS-04 (não editar `ui/button.tsx`), DS-06 (foco visível do `Button`, nome acessível pelo texto).
- Artefatos e comentários em português; identificadores em inglês.

## Pontos de Atenção

- > **O canvas é referência visual, não fonte de código.** A implementação usa
  > obrigatoriamente os **tokens/estilos do design system do projeto** e
  > **componentes que já existem no projeto** (quando houver biblioteca de componentes definida).
  > Proibido no código: hex ou rgb do canvas, valor arbitrário fora do sistema de estilos do projeto,
  > `style=` inline, px cravado onde há token, e markup próprio onde existe
  > componente. **Divergir visualmente do canvas para respeitar token e componente do projeto
  > é o comportamento correto — não é desvio de plano e não precisa de aprovação.**
- Em concreto: o canvas desenha o botão com `oklch(...)` e px à mão; no código ele é só `Button variant="outline" size="lg"` + `MessageCircle`.
- `.env.example` tem `VITE_WHATSAPP_NUMBER=`. Quem copiar o arquivo para `.env` sem preencher recebe `""`, não `undefined`, e o botão não pode aparecer com `https://wa.me/?text=…`.
- Vitest também carrega `.env` pelo Vite. O `App.test.tsx` atual continua válido sem `.env`. Na Fase 6b, os testes do botão devem fixar a variável com `vi.stubEnv` em vez de depender de um `.env` do worktree.
- Candidatos a teste para a Fase 6b: CA-4 em `src/lib/whatsapp.test.ts` (categoria A); CA-1 e CA-2/CA-3 renderizando `Hero` com e sem a variável (categoria B: `href`, `target`, `rel`).
- FOR-011 (rodapé) vai consumir `buildWhatsappUrl` e o mesmo número; não amarrar a função ao hero.
- O link abre em nova aba sem aviso para leitor de tela. A TASK não pede aviso; fica registrado para a Fase 3.

## Premissas e Incertezas

### Premissas

1. O número já vem com DDI e DDD; a função só remove o que não é dígito (TASK P1).
2. A mensagem é fixa, sem dado de produto (TASK P2).
3. A tipagem fica em `src/env.d.ts`, estendendo `ImportMetaEnv` (TASK P3; o nome do arquivo é escolha deste PLAN, já que não existe `vite-env.d.ts`).
4. Texto da mensagem pré-preenchida: "Olá, quero fazer uma encomenda." A TASK não traz o texto; é proposta na voz do EPIC, a confirmar na Fase 3.
5. I1 resolvida pela skill `arquitetura`: `hero.tsx` lê `import.meta.env` e passa `phone`, `label` e `message` por prop ao `WhatsappButton`.
6. `size="lg"` no botão do WhatsApp, igual ao CTA do cardápio (canvas mostra os dois com a mesma altura).

### Incertezas

1. **I2 da TASK** — valor presente mas sem nenhum dígito (ex.: `VITE_WHATSAPP_NUMBER=xxx`). Proposta: esconder o botão, tratando como número ausente, com a regra "tem pelo menos um dígito" numa função pura em `src/lib/whatsapp.ts` (AR-03). A decidir na Fase 3.
2. Se a regra da Incerteza 1 entrar, o nome e o formato do helper (`hasWhatsappNumber(phone?: string): boolean` ou devolver `null` de uma função de normalização) ficam em aberto. O padrão não existe no código.
