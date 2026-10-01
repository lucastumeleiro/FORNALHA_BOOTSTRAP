# PLAN-01 — FOR-006: copy do cardápio

**Identificador:** PLAN-01
**Dependências:** nenhuma
**Paralelizável com:** — (PLAN único)
**Triagem visual:** sem UI — só o texto de dois arquivos de dados/conteúdo muda; nenhum componente, layout ou token é tocado

> ⚠️ **IMPORTANTE:** Este plano deve ser seguido fielmente durante a
> execução. Qualquer desvio deve ser comunicado e aprovado antes da execução.

Referencia: tasks/FOR-006/TASK.md

**Por que um PLAN só:** 2 arquivos, só texto, sem dependência entre eles.

## Escopo

Trocar as seis descrições "Descrição em breve." e o subtítulo da seção por copy com detalhe concreto, dentro dos limites de palavras da TASK.

## Passos de Implementação (ordenados)

### Passo 1 — Reescrever `description` dos seis produtos

**Fonte:** TASK.md §Comportamento Esperado 1 e 3, CA-1, CA-2, CA-3 | EPIC.md §Marca e §Fatos da marca | leitura de código (`src/data/products.ts:11-54`) | skill `arquitetura` (dados do cardápio moram em `src/data/products.ts`)

- Alterar **somente** o campo `description` de cada item; `id`, `name`, `price`, `category` ficam intactos (CA-3).
- Cada descrição com 8 a 18 palavras, contadas por separação em espaços (P2). Números como "36" e "7h" contam como palavra.
- Detalhe concreto vindo do EPIC ou do nome do produto (P1). Sem emoji, sem exclamação, sem superlativo vazio ("o melhor", "delicioso", "incrível").
- Cada descrição abre de um jeito diferente; nenhuma começa com "Feito com…" nem repete a abertura de outra (CA-2).
- Textos finais, aprovados na Fase 3. O executor **copia literalmente**; qualquer mudança de redação é desvio e precisa ser comunicada e aprovada antes (contagem entre parênteses).
- **Fonte:** decisão da Fase 3 (Q1.1, Q2.1, Q2.2, Q4.1, Q6.2)

| `id`            | Descrição final                                                          | Palavras |
| --------------- | ------------------------------------------------------------------------ | -------- |
| `sourdough`     | Fermento vivo desde 2019 e 36 horas de fermentação até a casca grossa.   | 13       |
| `rye`           | Centeio de miolo denso e sabor firme, bom com manteiga ou queijo.        | 12       |
| `focaccia`      | Alecrim e azeite por cima, massa alta e borda dourada.                   | 10       |
| `croissant`     | Camadas finas de manteiga que estalam na primeira mordida.               | 9        |
| `orange-cake`   | Laranja ralada na massa, textura úmida e fatia que pede café.            | 11       |
| `filter-coffee` | Coado na hora, passo a passo, e servido quente na xícara.                | 11       |

- "36 horas" só no `sourdough` (Q4.1); "miolo" e "úmido" uma vez cada (Q2.1); `rye` não cita a farinha, que é o subtítulo do Hero (Q1.1); café sem origem nem torra (Q3.1).

### Passo 2 — Reescrever o subtítulo da seção

**Fonte:** TASK.md §Comportamento Esperado 2 e 3, P3 | EPIC.md §Fatos da marca (fermentação natural) | decisão da Fase 3 (Q1.2, Q3.2, Q5.1) | leitura de código (`src/content/products-section.ts:3`)

- Alterar **somente** `subtitle` em `productsSectionContent`; `title` e `categoryLabels` não mudam (P3).
- Até 12 palavras. Texto final (copiar literalmente): "Da fermentação lenta ao forno, sai fresco em cada fornada." (10 palavras).
- Sem enumerar categorias (os rótulos logo abaixo já fazem isso, Q1.2), sem horário de fornada (a das 16h não existe no fim de semana, Q5.1) e sem "36 horas", que já é o título do Hero (Q3.2).
- O texto continua vindo de `src/content/` e renderizado por `products-section.tsx` como hoje; nenhum JSX muda (AR-01).

### Passo 3 — Conferir

**Fonte:** TASK.md §Critérios de Aceite | CLAUDE.md §Comandos | decisão da Fase 3 (Q6.1)

- Conferir a contagem de cada descrição (8 a 18) e do subtítulo (até 12) com um one-liner descartável `node -e` que importa os textos e aplica `texto.trim().split(/\s+/).length` — palavra = token separado por espaço; hífen e pontuação colada não separam. Sem criar arquivo versionado nem teste novo.
- Confirmar que nenhuma descrição sobrou como "Descrição em breve.".
- `git diff src/data/products.ts` mostra apenas linhas de `description`.
- Rodar `npm run typecheck` e `npm test`. Não rodar `npm run dev` (é da pessoa).

## Arquivos Impactados

| Arquivo                           | Operação | Justificativa                              |
| --------------------------------- | -------- | ------------------------------------------ |
| `src/data/products.ts`            | Editar   | só o campo `description` dos seis produtos |
| `src/content/products-section.ts` | Editar   | só o campo `subtitle`                      |

## Contratos Exportados

_Nenhum_ — os tipos e as chaves exportadas não mudam.

## Convenções Aplicáveis

- Frontend/UI: skill `arquitetura` (texto em `src/content/`, dados em `src/data/`). A skill `design-system` não se aplica: nenhum componente, token ou tema é alterado.
- Artefato e texto de interface em português; identificadores em inglês.

## Pontos de Atenção

- FOR-014 vem depois desta task e depende da copy final; não mudar nomes nem preços evita retrabalho.
- Não há teste que referencie "Descrição em breve." nem o subtítulo antigo (busca em `src/`: só os arquivos editados os contêm).
- Descrição de produto é a única exceção de texto visível que mora em `src/data/` (AR-01).

## Premissas e Incertezas

### Premissas

1. O detalhe concreto vem do EPIC ou do nome do produto (TASK P1).
2. O limite de 8 a 18 palavras vale por descrição isolada (TASK P2).
3. `title` e `categoryLabels` não mudam (TASK P3).
4. "Casca grossa", "miolo denso", "massa alta", "borda dourada", "camadas que estalam", "textura úmida", "azeite", "laranja ralada" e "coado na hora, passo a passo" são descrição de textura/ingrediente/serviço genérica, não fato novo da marca. Só o `sourdough` cita as 36 horas (Q4.1).

### Incertezas

_Nenhuma._ Resolvidas na Fase 3:

1. Café coado não cita origem nem torra (Q3.1).
2. Subtítulo fala da fermentação, sem horário de fornada (Q3.2, Q5.1).
3. Extrapolação da farinha no `rye` eliminada: a descrição não cita mais a farinha (Q1.1).
