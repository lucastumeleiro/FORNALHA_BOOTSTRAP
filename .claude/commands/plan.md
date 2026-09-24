---
description: Fase 2/7 SDD — decompõe TASK.md em múltiplos PLANs independentes (plans/) e cria MEMORY.md
argument-hint: "[TASK-ID] (opcional — se omitido, detecta da branch)"
---

# /plan — Fase 2/7 do Spec Driven Development

## Detecção da task

Se `$ARGUMENTS` foi fornecido, usar como `<NOME>`.

Se não foi fornecido:

1. Detectar branch atual
2. Se branch tem padrão de ticket (ex.: `feature/TASK-123`), extrair o identificador e perguntar:
   ```
   Detectei `TASK-123` na branch atual. É essa a task?
   [s] sim
   [n] informar outra
   ```
3. Senão, perguntar: `Qual identificador da task?`

Confirmar que `tasks/<NOME>/TASK.md` existe antes de prosseguir. Se não existir, parar e avisar.
TASK.md é sempre a fonte de verdade.

## Execução

1. Invocar skill `sdd-plan` para padrões e estrutura obrigatória
2. Seguir Etapa 0 (revisão de contexto) e Etapa 1 (decomposição em PLANs)
3. **Se a task tem frontend:** seguir Etapa 1.5 — classificar a mudança em _sem UI_,
   _ajuste pontual_ ou _mudança estrutural_. Só _mudança estrutural_ (tela/componente novo,
   layout reorganizado) aciona a ferramenta de canvas/mockup disponível: publicar o mockup e **aguardar aprovação
   explícita** antes do passo 4. Ajuste pontual (campo, coluna, label, filtro em painel que
   já existe) segue direto. Caso de empate → perguntar ao usuário, não decidir sozinho.
4. Criar diretório `tasks/<NOME>/plans/` e gerar os arquivos `PLAN-NN-<slug>.md` — PLAN de
   frontend registra `**Triagem visual:**` e, se estrutural, a URL em `**Layout aprovado:**`
   mais o bloco de blindagem do canvas em `Pontos de Atenção` (Etapa 1.5, Passo C): o canvas
   é referência de **arranjo**, a aparência vem do design system do projeto e de
   componentes existentes — divergir do canvas por causa disso é o esperado
5. Criar `tasks/<NOME>/MEMORY.md` com esqueleto inicial
6. Apresentar ao usuário: lista de PLANs, grafo de dependências, ondas de execução e a
   triagem visual (com link do canvas quando houver)

Ao terminar, avisar o usuário para revisar antes de avançar pra `/question`.
