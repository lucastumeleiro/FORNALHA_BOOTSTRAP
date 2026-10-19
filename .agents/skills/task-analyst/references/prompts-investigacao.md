# Prompts de Investigação

Use estes prompts ao instruir um subagent `Explore` (ou ao investigar diretamente) na Fase 2.

## 1. Investigação inicial

Quando: ao iniciar a investigação de um bug ou problema reportado.

```
Preciso investigar um problema reportado por um usuário/suporte. Vou te dar o contexto e preciso que você me ajude a encontrar a causa raiz.

## Problema Reportado
[Colar aqui o relato]

## O que preciso:
1. Encontre os arquivos e funções responsáveis pelo fluxo descrito.
2. Trace o caminho do dado desde a entrada (request / evento / mensagem) até o ponto onde o problema ocorre.
3. Identifique possíveis causas raiz.
4. Verifique se existem testes cobrindo esse cenário.
5. Mapeie outros módulos que usam o mesmo código ou são afetados.

## Formato da resposta:
- Arquivos envolvidos (caminhos completos com `arquivo.ts:linha` quando relevante)
- Fluxo do dado (passo a passo)
- Causa raiz provável (ou hipóteses ranqueadas)
- Testes existentes (sim/não — quais)
- Impacto em outros módulos
- Sugestão de correção
```

## 2. Análise de impacto

Quando: depois de identificar o ponto do problema, antes de propor a solução final.

```
Identifiquei que o problema está em [arquivo / função].

Preciso que você analise o impacto de alterações neste ponto:

1. Quais outros arquivos importam ou chamam essa função/módulo?
2. Existem testes que vão quebrar se eu mudar isso?
3. Tem algum comportamento dependente que pode ser afetado?
4. Se eu aplicar [descrever mudança planejada], o que pode dar errado?

Liste todos os pontos de atenção, sem minimizar riscos.
```

## 3. Validação de solução

Quando: antes de fechar a investigação e seguir para o detalhamento (Fase 3).

```
Estou propondo a seguinte solução para o problema investigado:

## Solução
[Descrever a solução]

## Preciso que você valide:
1. Essa solução resolve o problema descrito?
2. Ela introduz algum efeito colateral?
3. Cobre os edge cases? Liste os que conseguir identificar.
4. Existe uma abordagem mais simples ou mais segura?
5. Que testes eu deveria criar para garantir que isso funcione?

Seja crítico. Prefiro ouvir os problemas agora do que em code review.
```

## 4. Features pequenas

Quando: o input é uma solicitação de feature, não um bug.

```
Recebemos uma solicitação de feature pequena:

## Solicitação
[Colar aqui o que foi enviado]

## O que preciso:
1. Mapeie onde essa funcionalidade se encaixa na arquitetura atual.
2. Identifique os arquivos que precisariam ser criados ou modificados.
3. Avalie o tamanho real do esforço (é realmente pequeno? 1-3 dias?).
4. Identifique dependências ou pré-requisitos técnicos.
5. Sugira uma abordagem de implementação.
6. Liste o que pode dar errado ou o que devemos considerar.

Se o esforço parecer maior do que uma task de 1-3 dias, me avise explicitamente — vamos quebrar em múltiplas tasks.

Se o projeto tiver guidelines de arquitetura documentados (ex.: `FEATURE_GUIDELINES.md` ou skills de domínio), siga-os. Se ainda não existirem, infira o padrão a partir do código já escrito e sinalize a lacuna.
```
