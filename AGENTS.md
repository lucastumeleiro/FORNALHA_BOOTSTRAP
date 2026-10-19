# AGENTS.md — Fornalha

Site de uma página da Fornalha, padaria fictícia. É um **repositório de teste do Uno SDD**: as tasks existem para exercitar o fluxo e são pequenas de propósito.

## Comandos

| Script                | O que faz                                                            |
| --------------------- | -------------------------------------------------------------------- |
| `npm run dev`         | só a pessoa roda; porta 5180 fixa (`--strictPort`)                   |
| `npm run build`       | `tsc -b && vite build`                                               |
| `npm test`            | Vitest em jsdom                                                      |
| `npm run typecheck`   | `tsc -b`, com os testes incluídos                                    |
| `npm run check:cores` | DS-01/DS-02: cor literal e paleta de fábrica fora de `src/index.css` |

**Sem lint.** Nunca adicionar ESLint nem Biome.

## Onde fica o quê

| Caminho                | O que é                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `src/sections/`        | uma seção da página por arquivo                                   |
| `src/content/`         | todo texto visível, um arquivo por seção                          |
| `src/data/products.ts` | o cardápio                                                        |
| `src/components/`      | componentes da casa; `components/ui/` são os primitivos do shadcn |
| `src/lib/`             | funções puras: formatar, filtrar, validar, montar URL             |
| `src/index.css`        | tokens de cor dos dois temas, único lugar com cor literal         |
| `tasks/`               | `EPIC.md` + uma pasta por task (`FOR-NNN/TASK.md`)                |
| `.Codex/`             | fluxo SDD importado do Uno SDD + as skills deste repositório      |

## Regras críticas

- Artefato em português, identificador em inglês.
- **Uma task, um PLAN.** Dois com o motivo escrito; três ou mais, parar e perguntar. Nenhuma fase deveria passar de ~10 min; se passar, avisar a pessoa.
- **Nenhum agente commita, faz push ou cria branch.** Worktree e branch são criados pela pessoa com `worktree new`.
- **Nenhum agente roda `npm run dev`.** Executar o `TEST.md` é da pessoa.
- Nenhum agente edita `SUMARIO.md` à mão nem pula fase por conta própria.
- `.env` nunca é versionado; `.env.example` sim.

Skills de domínio: `arquitetura` (onde o código mora), `design-system` (cor, token, componente), `teste-automatizado`, `teste-de-mesa`. Fluxo: skill `sdd`.
