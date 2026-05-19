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

## Quantidade de itens

292 itens indexados — todos os módulos com ≥3 itens de busca; cobre rotas, tópicos, comandos, glossário, incidentes e ferramentas.

## Deep Dives — Modais avançados (16 total)

Arquivo: `src/data/deepDives.tsx`

| ID | Título | Categoria |
|---|---|---|
| `knocking-vs-stateful` | Port Knocking vs Stateful Firewall | Firewall |
| `kernel-hooks` | Os Hooks do Netfilter (Kernel) | Kernel |
| `dns-failure-points` | Por que o DNS é a primeira coisa que quebra? | DNS |
| `squid-https-filtering` | Squid Proxy e o Desafio do HTTPS | Proxy |
| `ipsec-ike-phases` | As Fases do IKE (IPSec) | VPN |
| `nftables-vs-iptables` | nftables vs iptables — Por que migrar? | Firewall |
| `docker-networking-internals` | Docker Networking Internals | Containers |
| `k8s-service-discovery` | Kubernetes Service Discovery | Kubernetes |
| `ansible-idempotency` | Ansible Idempotência e Ciclo de Execução | Ansible |
| `sre-error-budget-math` | SRE Error Budget — Matemática dos Noves | SRE |
| `ebpf-maps-memory` | eBPF Maps — Memória Compartilhada | eBPF |
| `github-actions-secure-pipeline` | GitHub Actions — Pipeline Seguro | CI/CD |
| `tls-1.3-handshake` | TLS 1.3 Handshake Detalhado | VPN |
| `wireguard-noise-protocol` | WireGuard Noise Protocol | VPN |
| `fail2ban-internal-arch` | Fail2ban Arquitetura Interna | Firewall |
| `hardening-defense-in-depth` | Hardening Defense in Depth | Firewall |

Os modais seguem o padrão a11y (`role="dialog"` + focus trap) — veja [acessibilidade.md](acessibilidade.md).

---
[← Voltar ao indice](README.md)
