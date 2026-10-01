# MEMORY — FOR-008: Tema escuro com alternância

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                 | Status      | Observações |
| -------------------- | ----------- | ----------- |
| PLAN-01-tema-escuro  | ✅ Concluído | Onda 1 (única). typecheck, test (21) e check:cores OK. CA-1 a CA-4 ficam para o TEST.md. Conferir `size-8` do `size="icon"` contra o alvo de toque (premissa 7). |

## Contratos Disponíveis

- `type Theme = "light" | "dark" | "system"` — `src/components/theme-provider.tsx`
- `ThemeProvider({ children, defaultTheme?, storageKey? })` — `src/components/theme-provider.tsx` (padrões `"system"` e `"fornalha-theme"`)
- `useTheme(): { theme, resolvedTheme: "light" | "dark", setTheme }` — `src/components/theme-provider.tsx`; fora do provider não lança, devolve `{ theme: "system", resolvedTheme: "light", setTheme: () => {} }`
- `ThemeToggle({ label })` — `src/components/theme-toggle.tsx`
- `headerContent.themeToggle.label` ("Alternar tema") — `src/content/header.ts`

## Bloqueios Ativos

_Nenhum._
