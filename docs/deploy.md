# Deploy & Infraestrutura — Operação Go-Live

> Guia de produção real para o **Workshop Linux** (Next.js 16 · App Router · CSP nonce
> per-request). O app é **100% dinâmico** (todas as rotas `ƒ`) — `output: 'export'` não
> é viável (o root layout lê `headers()` para o nonce do CSP, ver `proxy.ts`).

---

## 0. Divisão de responsabilidades (leia antes de tudo)

A aplicação **já emite** os headers de segurança. Não duplique no Nginx — dois CSP fazem
o browser aplicar a **interseção**, o que costuma quebrar o site.

| Camada | Responsável | Headers |
|--------|-------------|---------|
| **App Next.js** | `next.config.ts` (estático) | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control |
| **App Next.js** | `proxy.ts` (per-request) | `Content-Security-Policy` com `nonce` + `strict-dynamic` |
| **Nginx** | reverse proxy | TLS termination, gzip/brotli, cache de `/_next/static`, rate limit (opcional) |

> **Regra de ouro:** o Nginx faz **TLS + proxy + cache de assets**. Os headers de
> segurança HTTP **pertencem ao app** (passam direto pelo `proxy_pass`). Só mova-os para
> o Nginx se desligar a emissão no app — nunca os dois ao mesmo tempo.

---

## 1. Pré-voo (rodar ANTES de buildar em produção)

```bash
npm ci                       # install reprodutível (usa package-lock.json)
npm run lint                 # tsc --noEmit — zero erros de tipo
npm run lint:eslint          # jsx-a11y — zero warnings
npm test                     # vitest — 258 testes
npx tsx scripts/check-constants.ts   # 7/7 reconciliações
npm run build                # ~97 rotas (92 do ROUTE_SEO + sitemap/robots/og/icon/apple-icon/manifest/_not-found)
npm audit                    # alvo: 0 vulnerabilidades
```

Constantes esperadas (ou rode `check-constants`): `ROUTE_SEO = 92` · `CONTENT_PAGES_COUNT = 80`
· `totalTopics = 106` · `checklistItemsCount = 223` · `badges = 79` · `searchItems = 313`
· `QUIZ_QUESTIONS = 338`.

`.env.production` mínimo:

```ini
NEXT_PUBLIC_SITE_URL=https://workshop.seudominio.com
NODE_ENV=production
```

---

## 2. Rodar a aplicação (escolha uma)

> **Artefatos versionados** (Sprint ARTEFATOS-INFRA): os arquivos abaixo existem
> prontos no repositório — `Dockerfile` (raiz), `infra/systemd/workshop-linux.service`
> e `infra/nginx/workshop-linux.conf`. Os blocos abaixo são a referência comentada deles.

### 2a. systemd (recomendado para VPS própria)

Arquivo versionado: **`infra/systemd/workshop-linux.service`** → instalar em
`/etc/systemd/system/workshop-linux.service`:

```ini
[Unit]
Description=Workshop Linux (Next.js)
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/opt/workshop-linux
EnvironmentFile=/opt/workshop-linux/.env.production
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
# Hardening do serviço (defesa em profundidade)
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/opt/workshop-linux/.next

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now workshop-linux
sudo systemctl status workshop-linux
journalctl -u workshop-linux -f      # logs ao vivo
```

### 2b. PM2

```bash
npm ci && npm run build
pm2 start npm --name workshop-linux -- run start
pm2 save && pm2 startup            # restart no boot
```

### 2c. Docker (build standalone — `Dockerfile` na raiz)

O `Dockerfile` versionado é multi-stage (`deps → build → runner`) e usa o
**output standalone** do Next (`output: 'standalone'` em `next.config.ts`): a imagem
final roda `node server.js` com apenas as dependências rastreadas — sem o
`node_modules` completo, como usuário não-root, com `HEALTHCHECK` embutido.

```bash
docker build -t workshop-linux:latest .
docker run -d --name workshop-linux \
  --env-file .env.production \
  -p 127.0.0.1:3000:3000 \
  --restart unless-stopped \
  workshop-linux:latest
```

> A porta **3000 só escuta em `127.0.0.1`** — quem fala com o mundo é o Nginx.
> O `.dockerignore` mantém o contexto enxuto (sem `node_modules`, `.next`, `e2e`, `docs`).

---

## 3. Nginx — proxy reverso + TLS + cache

Arquivo versionado: **`infra/nginx/workshop-linux.conf`** → instalar em
`/etc/nginx/sites-available/workshop-linux.conf` (inclui `upstream` com keepalive,
`stub_status` para métricas e cache imutável de `/_next/static`):

```nginx
# Redireciona todo HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name workshop.seudominio.com;
    # Deixa o Certbot validar o desafio ACME em HTTP
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name workshop.seudominio.com;

    # Certificados gerenciados pelo Certbot (seção 4)
    ssl_certificate     /etc/letsencrypt/live/workshop.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/workshop.seudominio.com/privkey.pem;

    # TLS hardening — só TLS 1.2/1.3, ciphers modernos (Mozilla "intermediate")
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Compressão (o Next já comprime, mas o Nginx cobre assets servidos por ele)
    gzip on;
    gzip_types text/plain text/css application/json application/javascript application/xml image/svg+xml;
    gzip_min_length 1024;

    # IMPORTANTE: NÃO adicione add_header de CSP/HSTS aqui — o app já emite.
    # Adicionar duplicaria o CSP e o browser aplicaria a interseção (quebra).

    # Cache agressivo dos assets versionados (hash no nome = imutável)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Todo o resto → app Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/workshop-linux.conf /etc/nginx/sites-enabled/
sudo nginx -t            # valida a config (sempre antes de recarregar)
sudo systemctl reload nginx
```

---

## 4. TLS — emissão e renovação automática (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
# Emite o certificado e injeta a config TLS automaticamente
sudo certbot --nginx -d workshop.seudominio.com
```

**Renovação automática** — o pacote Certbot já instala um `systemd timer` que roda 2×/dia
e renova certificados a < 30 dias do vencimento. Confirme:

```bash
systemctl list-timers | grep certbot       # deve listar certbot.timer
sudo certbot renew --dry-run                # simula a renovação sem emitir
```

> Se preferir cron em vez de timer: `0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"`.

**HSTS preload:** o app já emite `Strict-Transport-Security: max-age=63072000;
includeSubDomains; preload`. Depois de validar o HTTPS, submeta o domínio em
[hstspreload.org](https://hstspreload.org) para inclusão na lista dos browsers.

---

## 5. CSP em produção (referência — gerado por `proxy.ts`)

```
default-src 'self';
script-src 'self' 'nonce-<aleatório-por-request>' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self' data:;
connect-src 'self';
frame-src 'none';
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests
```

- `script-src` usa **nonce + `strict-dynamic`** (sem `'unsafe-inline'`) — defesa forte contra XSS.
- `style-src 'unsafe-inline'` permanece — Tailwind v4 e motion/react injetam `<style>` dinâmicos.
- O matcher do `proxy.ts` exclui `/_next/static`, `/api`, e os ícones edge (`icon`, `apple-icon`, `opengraph-image`).

---

## 6. Monitoramento de performance

O próprio curso ensina o stack (módulo `/monitoring`). Para o Go-Live:

- **Disponibilidade:** healthcheck HTTP externo (UptimeRobot, Better Uptime ou um `curl`
  no cron) contra `https://workshop.seudominio.com/` — espera HTTP 200.
- **Métricas do host:** `node_exporter` + Prometheus + Grafana (dashboard ID 1860).
- **Métricas do Nginx:** habilite `stub_status` num location interno e raspe com
  `nginx-prometheus-exporter`.
- **Logs:** `journalctl -u workshop-linux` (app) e `/var/log/nginx/access.log` (Nginx).
  Para frota, centralize com Loki/Promtail (ver o HorizonteBox em `/rsyslog`).
- **Erros de runtime:** o `app/error.tsx` captura no client; para produção séria,
  pluge um Sentry self-hosted ou GlitchTip.
- **Web Vitals:** rode o Lighthouse CI contra a URL pública e acompanhe LCP/CLS/INP.

---

## 7. Vercel (alternativa zero-config)

Conectar o repositório na Vercel — o Next.js 16 é detectado automaticamente, headers e CSP
(via `proxy.ts`) funcionam nativamente. TLS e CDN são gerenciados pela plataforma. Indicado
para quem não quer operar VPS.

---

## ✅ Checklist Go-Live (estrito)

- [ ] `npm ci` reprodutível, sem erros
- [ ] `npm run lint` · `npm run lint:eslint` · `npm test` · `check-constants` (7/7) — verdes
- [ ] `npm run build` — ~97 rotas, sem erro de tipo
- [ ] `npm audit` — 0 vulnerabilidades
- [ ] `.env.production` com `NEXT_PUBLIC_SITE_URL` no domínio real
- [ ] App sob systemd/PM2/Docker com **restart automático** e porta 3000 **não exposta**
- [ ] Nginx `nginx -t` ok · proxy_pass para `127.0.0.1:3000` · cache em `/_next/static`
- [ ] **Headers de segurança NÃO duplicados** no Nginx (o app os emite)
- [ ] Certbot emitiu o cert · `certbot renew --dry-run` ok · `certbot.timer` ativo
- [ ] HTTP → HTTPS 301 funcionando
- [ ] Nota **A+** em [securityheaders.com](https://securityheaders.com) e [ssllabs.com](https://www.ssllabs.com/ssltest/)
- [ ] Domínio submetido ao [hstspreload.org](https://hstspreload.org)
- [ ] Healthcheck externo + monitoramento de métricas/logs ativo

---
[<- Voltar ao indice](README.md)
</content>
