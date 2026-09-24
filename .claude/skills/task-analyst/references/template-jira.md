# Template — Task Detalhada

Use este template como esqueleto na Fase 3. Preencha **todos** os campos. Nenhum `[placeholder]` deve sobrar no output final.

```markdown
# [TIPO] Título curto e descritivo (BUG | FEATURE | INCIDENTE)

## Contexto

[O que aconteceu, quem reportou, qual a situação atual. 2-4 linhas.]

## Problema

[Descrição técnica precisa — causa raiz ou hipótese forte. Se hipótese, marcar como "Hipótese:" e listar o que falta confirmar.]

## Comportamento Atual

[O que o sistema faz hoje, com evidências: trechos de log, prints, snippets de código com caminho do arquivo.]

## Comportamento Esperado

[O que deveria acontecer após a correção/implementação. Numerado se houver múltiplos cenários.]

## Solução Proposta

[Direção técnica — o que mudar, onde mudar, abordagem recomendada.]
[Se houver mais de uma opção viável, listar com prós e contras de cada uma e indicar a recomendada com justificativa.]

## Arquivos/Módulos Afetados

- `caminho/do/arquivo.ts` — [o que muda aqui]
- `caminho/outro/arquivo.ts` — [o que muda aqui]
- ...

## Checklist de Implementação

- [ ] [Passo 1 concreto]
- [ ] [Passo 2 concreto]
- [ ] [Passo 3 concreto]
- [ ] Atualizar/criar testes para o cenário
- [ ] Testar no ambiente de staging
- [ ] Verificar se não quebrou [módulo X relacionado]

## Perguntas Estratégicas (P&R)

### Antes de codar

- **O que exatamente muda no fluxo de dados?**
  R: [resposta da investigação]
- **Isso pode afetar outro cliente/módulo?**
  R: [resposta da investigação]
- **Existe edge case que não estamos cobrindo?**
  R: [resposta da investigação]

### Riscos e efeitos colaterais

- **Isso pode quebrar X?**
  R: [resposta da investigação]
- **O que acontece se a solução falhar em produção?**
  R: [rollback plan]
- **Tem migração de dados ou mudança de schema?**
  R: [sim/não — detalhes]

### Decisões tomadas

- **Por que escolhemos essa abordagem e não outra?**
  R: [registro da decisão com contexto]
- **O que ficou de fora do escopo de propósito?**
  R: [registro do que NÃO fazer nesta task]
- **Tem dependência de outra task/time/deploy?**
  R: [sim/não — detalhes]

## Critérios de Aceite

- [ ] **Cenário 1**: Dado [contexto], quando [ação], então [resultado]
- [ ] **Cenário 2**: Dado [contexto], quando [ação], então [resultado]
- [ ] Testes passando (unit + integração se aplicável)
- [ ] Sem regressão nos módulos relacionados

## Referências

- Ticket original: [link]
- Investigação / conversa com IA: [link, se salva]
- Tasks relacionadas: [links]
```

## Checklist final (antes de entregar)

- [ ] Nenhum campo com `[placeholder]` restante
- [ ] Pelo menos 3 perguntas estratégicas com resposta concreta (não em aberto)
- [ ] Critérios de aceite no formato Dado/Quando/Então
- [ ] Escopo fechado: o que NÃO faz parte está explícito
- [ ] Arquivos afetados com caminhos completos e o que muda em cada um
