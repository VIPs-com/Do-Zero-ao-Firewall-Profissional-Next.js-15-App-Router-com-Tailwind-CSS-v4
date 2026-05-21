# Artefatos de Infraestrutura

Arquivos versionados de deploy do **Workshop Linux**. Escolha pelo cenário —
detalhes e trade-offs em [`docs/deploy.md`](../docs/deploy.md) (Go-Live) e
[`docs/deploy-homelab.md`](../docs/deploy-homelab.md) (exposição & proteção).

## Mapa por cenário

| Cenário | Arquivos a usar |
|---|---|
| **VPS pública** (TLS Certbot) | `nginx/workshop-linux.conf` + `systemd/workshop-linux.service` + `../Dockerfile` |
| **Home Lab LAN-only** (sem exposição, mkcert) | `nginx/workshop-linux.lan.conf` + `systemd/workshop-linux.service` |
| **Cloudflare Tunnel** (público, sem abrir portas) | `../docker-compose.yml` + `nginx/compose-tunnel.conf` (Docker) **ou** `cloudflared/config.yml` + `nginx/workshop-linux.conf` (host) |

## Arquivos

| Arquivo | O quê |
|---|---|
| `../Dockerfile` | Imagem multi-stage standalone (non-root, healthcheck) |
| `../.dockerignore` | Mantém o contexto de build enxuto |
| `../docker-compose.yml` | Stack app + nginx + cloudflared (Cloudflare Tunnel, método token) |
| `nginx/workshop-linux.conf` | Nginx bare-metal: TLS Certbot, redirect 80→443, cache `/_next/static`, `stub_status` |
| `nginx/workshop-linux.lan.conf` | Nginx bare-metal LAN-only: TLS mkcert, sem ACME |
| `nginx/compose-tunnel.conf` | Nginx para Docker atrás do Cloudflare (HTTP, `upstream app:3000`, `X-Forwarded-Proto https`) |
| `systemd/workshop-linux.service` | Unit systemd blindada (`ProtectSystem=strict`, etc.) |
| `cloudflared/config.yml` | Config do túnel para cloudflared rodando no host (systemd) |

## Regra de ouro (vale para todos)

Os **headers de segurança** (CSP, HSTS, X-Frame-Options, etc.) são emitidos pela
**aplicação** (`next.config.ts` + `proxy.ts`). **Nunca** os duplique no Nginx — dois CSP
fazem o browser aplicar a interseção e quebram o site.
