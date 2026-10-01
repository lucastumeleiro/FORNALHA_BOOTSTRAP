# MEMORY — FOR-005: Encomendar pelo WhatsApp

> Contexto compartilhado entre sub-agentes de execução.
> Leitura obrigatória antes de iniciar qualquer PLAN.

## Estado dos PLANs

| PLAN                     | Status      | Observações |
| ------------------------ | ----------- | ----------- |
| PLAN-01-botao-whatsapp   | ✅ Concluído | Onda 1. Passos 1–5 já existiam de execução anterior e foram conferidos; Passo 6 (`.env.example`) feito; typecheck, testes e `check:cores` com exit 0 |

## Contratos Disponíveis

- `buildWhatsappUrl(phone: string, message: string): string` — `src/lib/whatsapp.ts` (FOR-011 reusa no rodapé)
- `hasWhatsappNumber(phone?: string): phone is string` — `src/lib/whatsapp.ts` (**fora da lista do PLAN**; implementa a proposta da Incerteza 1: valor sem nenhum dígito conta como ausente)
- `WhatsappButton({ phone, label, message })` — `src/components/whatsapp-button.tsx`
- `ImportMetaEnv.VITE_WHATSAPP_NUMBER?: string` — `src/env.d.ts`
- `heroContent.whatsapp: { label, message }` — `src/content/hero.ts`

## Desvios

- Helper `hasWhatsappNumber` exportado além dos contratos do PLAN (nome e formato eram a Incerteza 2). A confirmar pela pessoa.
- Texto da mensagem ("Olá, quero fazer uma encomenda.") é a Premissa 4 do PLAN, ainda não confirmada.

## Bloqueios Ativos

_Nenhum._
