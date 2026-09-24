# [FEATURE] FOR-011 — Rodapé com redes e ano automático

**Épico:** [../EPIC.md](../EPIC.md) · **Tipo:** ajuste pontual · **Depende de:** FOR-005 (`buildWhatsappUrl`) · **Vem depois de:** — · **Pode rodar em paralelo com:** FOR-010, FOR-014 · **Precede:** —

## Contexto

O rodapé diz "© 2025 Fornalha" fixo e não tem redes.

## Comportamento Esperado

1. O ano é calculado na renderização: "© {ano} Fornalha".
2. Links para o Instagram (`https://instagram.com/fornalha.padaria`) e para o WhatsApp (reusa `buildWhatsappUrl`, e some sem `.env`, como no hero), cada um com ícone do `lucide-react` quando houver um adequado e com `aria-label`.
3. O `id="contato"` continua no rodapé.

## Arquivos/Módulos Afetados

- `src/sections/site-footer.tsx`
- `src/content/footer.ts`

## Critérios de Aceite

- [ ] **CA-1** — Dado o relógio em 2027, então o rodapé mostra "© 2027 Fornalha".
- [ ] **CA-2** — Dado que não há `.env`, então só o link do Instagram aparece.
- [ ] **CA-3** — Dado os links, então abrem em nova aba, com `rel="noopener noreferrer"`, e têm nome acessível.

## Fora de escopo

Newsletter, mapa.

## Premissas e Incertezas

**Premissas**

- P1 — O ano vem de `new Date().getFullYear()` no momento da renderização.
- P2 — O link do WhatsApp do rodapé segue a mesma regra do hero: sem `VITE_WHATSAPP_NUMBER`, ele não aparece.
- P3 — O endereço que já está no rodapé continua como está.

**Incertezas**

- I1 — Se a mensagem pré-preenchida do WhatsApp no rodapé é a mesma do hero ou uma própria em `content/footer.ts`.
- I2 — Qual ícone usar para o Instagram se o `lucide-react` desta versão não tiver o da marca: um genérico ou nenhum.
