# Sistema de Temas (Dark / Light Mode)

## Regra fundamental

```
<html>               → Dark Mode (padrão — sem classe)
<html class="light"> → Light Mode
```

O Tailwind CSS v4 usa `@theme` para definir tokens. O bloco `html.light {}` no `globals.css` sobrescreve apenas as variáveis que mudam.

## Fluxo completo (sem FOUC)

```
1. layout.tsx carrega
      ↓
2. <script> síncrono no <head> lê localStorage ANTES do primeiro paint
      ↓
3. Se theme === 'light' → adiciona class="light" no <html> imediatamente
      ↓
4. React hidrata → ClientLayout lê classList do DOM para estado inicial
      ↓
5. Usuário clica ☀️/🌙 → toggleTheme() → adiciona/remove 'light' + salva localStorage
      ↓
6. globals.css → html.light { } entra em efeito via CSS variables
```

## Tokens de cor por tema

| Token CSS | Dark | Light | Muda? |
|---|---|---|---|
| `--color-bg` | `#0d1117` | `#ffffff` | ✅ |
| `--color-bg-2` | `#161b22` | `#f6f8fa` | ✅ |
| `--color-bg-3` | `#21262d` | `#eaeef2` | ✅ |
| `--color-border` | `#30363d` | `#d0d7de` | ✅ |
| `--color-border-2` | `#484f58` | `#afb8c1` | ✅ |
| `--color-text` | `#e6edf3` | `#1f2328` | ✅ |
| `--color-text-2` | `#8b949e` | `#656d76` | ✅ |
| `--color-text-3` | `#7d8590` | `#818b98` | ✅ |
| `--color-accent` | `#e05a2b` | `#e05a2b` | ❌ invariante |
| `--color-ok/warn/err/info` | — | — | ❌ invariante |
| Camadas OSI (layer-1 a 7) | — | — | ❌ invariante |

## Tokens de módulo (Sprint M — Cyber-Industrial)

Cada rota de conteúdo tem um accent dedicado. Os tokens ficam em `@theme` e alimentam as utility classes `.module-accent-<slug>`. Todas as páginas de conteúdo aplicam `module-accent-<slug>` + `module-hero`:

### v1.0 — Zero ao Firewall

| Slug | Cor | Módulo |
|---|---|---|
| `instalacao` | `#9ca3af` | Instalação (neutro-tech) |
| `wan-nat` | `#60a5fa` | WAN & NAT |
| `dns` | `#22d3ee` | DNS (BIND9) |
| `nginx-ssl` | `#34d399` | Nginx + SSL/TLS |
| `lan-proxy` | `#fbbf24` | LAN + Squid Proxy |
| `dnat` | `#a78bfa` | DNAT |
| `port-knocking` | `#fb923c` | Port Knocking |
| `vpn-ipsec` | `#3b82f6` | VPN IPSec |
| `nftables` | `#f85149` | nftables (firewall) |
| `ataques-avancados` | `#ec4899` | Ataques avançados |
| `pivoteamento` | `#dc2626` | Pivoteamento |
| `web-server` | `#67e8f9` | Web Server |
| `evolucao` | `#f59e0b` | Evolução |
| `audit-logs` | `#14b8a6` | Audit logs |
| `cheat-sheet` | `#818cf8` | Cheat sheet |
| `glossario` | `#94a3b8` | Glossário |
| `wireguard` | `#2dd4bf` | WireGuard VPN |
| `fail2ban` | `#f87171` | Fail2ban |
| `hardening` | `#a3e635` | Hardening Linux |
| `docker` | `#2496ed` | Docker Networking |
| `ssh-2fa` | `#f59e0b` | SSH com 2FA |
| `compose` | `#1d63ed` | Docker Compose |

### v2.0 — Fundamentos Linux

| Slug | Cor/Token | Módulo |
|---|---|---|
| `fundamentos` | `#6366f1` | Índice Fundamentos |
| `pacotes` | `#22c55e` | Instalação de Programas |
| `boot` | `var(--color-warn)` | Processo de Boot |
| `comandos-avancados` | `var(--color-layer-5)` | Comandos Avançados |
| `rsyslog` | `var(--color-layer-4)` | Logs Centralizados |

### v3.0 — Servidores e Serviços

| Slug | Cor/Token | Módulo |
|---|---|---|
| `dhcp` | `var(--color-info)` | Servidor DHCP |
| `samba` | `var(--color-layer-6)` | Samba File Sharing |
| `apache` | `var(--color-warn)` | Apache Web Server |
| `openvpn` | `var(--color-layer-3)` | OpenVPN |
| `traefik` | `var(--color-accent-2)` | Traefik Proxy Reverso |
| `ldap` | `var(--color-layer-7)` | LDAP / OpenLDAP |
| `pihole` | `var(--color-ok)` | Pi-hole |
| `ssh-proxy` | `#0ea5e9` | SSH como Proxy SOCKS |

### v4.0 — Infraestrutura Moderna

| Slug | Cor/Token | Módulo |
|---|---|---|
| `ansible` | `var(--color-err)` | Ansible |
| `monitoring` | `var(--color-warn)` | Prometheus + Grafana |
| `kubernetes` | `var(--color-layer-3)` | Kubernetes / K3s |
| `terraform` | `var(--color-layer-6)` | Terraform IaC |
| `suricata` | `#dc2626` | Suricata IDS/IPS |
| `ebpf` | `#8b5cf6` | eBPF & XDP |
| `service-mesh` | `#06b6d4` | Service Mesh (Istio) |
| `sre` | `#f59e0b` | SRE & SLOs |

### v5.0 — Cloud & Platform Engineering

| Slug | Cor/Token | Módulo |
|---|---|---|
| `cicd` | `#2563eb` | CI/CD com GitHub Actions |
| `opnsense` | `#d94f00` | OPNsense / pfSense |
| `nextcloud` | `#0082c9` | Nextcloud — Nuvem Pessoal |
| `ebpf-avancado` | `#6d28d9` | eBPF Avançado + Cilium |

## Como usar numa rota

```tsx
// app/dns/page.tsx
return (
  <div className="module-accent-dns">
    <section className="module-hero">…conteúdo do hero…</section>
    {/* resto da página inalterado */}
  </div>
);
```

A classe raiz define `--mod` e qualquer `.module-hero` descendente recebe automaticamente a borda superior colorida e um halo radial difuso. Sem JS, sem wrapping extra.

## Micro-interações globais (`globals.css`)

- `.code-block:hover` → borda anima para `color-mix(accent 55%, border)` + box-shadow `--glow-accent`
- `.info-box/.warn-box/.highlight-box` → gradiente lateral de aura (`::after`, opacity 0.04, z-index -1)
- `.fluxo-card:hover` → box-shadow duplo (halo + elevação)
- `.badge-unlock-glow` → animação `badge-unlock-shine` de 1.1s ao desbloquear (ver `BadgeDisplay` prop `justUnlocked`)

## WCAG 2.3.3

Todas as animações são zeradas pelo bloco `@media (prefers-reduced-motion: reduce)` já existente — não é necessário tratamento por componente.

## Bugs históricos (já corrigidos — não repetir)

| Bug | Causa | Correção aplicada |
|---|---|---|
| Tema não mudava visualmente | `html.light {}` ausente no CSS | Bloco adicionado ao `globals.css` |
| Flash branco ao carregar | `useEffect` rodava tarde demais | Script síncrono no `<head>` |
| Ícone Sol/Lua incorreto | `useState(true)` sem ler o DOM | Estado derivado de `classList` |
| Badge 🦉 no momento errado | `unlockBadge` no bloco `else` invertido | Movido para ativação do dark mode |

---
[← Voltar ao indice](README.md)
