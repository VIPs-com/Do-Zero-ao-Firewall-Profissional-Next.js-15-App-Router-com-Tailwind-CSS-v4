# Busca Global

## Ativação

`⌘K` (Mac) ou `Ctrl+K` (Windows/Linux)

## Arquivo

`src/data/searchItems.ts`

## Categorias disponíveis

`'Tópico'` | `'Glossário'` | `'Página'` | `'Comando'`

## Como adicionar item à busca

```typescript
// src/data/searchItems.ts — adicionar ao array SEARCH_ITEMS
{
  id: 'id-unico',          // string único
  title: 'Título visível',
  description: 'Descrição curta que aparece nos resultados',
  category: 'Tópico',      // uma das 4 categorias
  href: '/rota-da-pagina',
  icon: Terminal,          // ícone do lucide-react
}
```

## Deep Dives — Modais avançados

Arquivo: `src/data/deepDives.tsx`

| ID | Título | Categoria |
|---|---|---|
| `knocking-vs-stateful` | Port Knocking vs Stateful Firewall | Firewall |
| `kernel-hooks` | Os Hooks do Netfilter (Kernel) | Kernel |
| `dns-failure-points` | Por que o DNS é a primeira coisa que quebra? | DNS |
| `squid-https-filtering` | Squid Proxy e o Desafio do HTTPS | Proxy |
| `ipsec-ike-phases` | As Fases do IKE (IPSec) | VPN |
| `nftables-vs-iptables` | nftables vs iptables — Por que migrar? | Firewall |

Os modais seguem o padrão a11y (`role="dialog"` + focus trap) — veja [acessibilidade.md](acessibilidade.md).

---
[← Voltar ao indice](README.md)
