# Deploy & Infraestrutura

## Opcao 1 — Deploy Dinamico (Node.js + PM2) — Padrao atual

```bash
npm install
npm run build
pm2 start npm --name "workshop-linux" -- run start
```

**Nginx como proxy reverso:**
```nginx
server {
    listen 80;
    server_name workshop.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Opcao 2 — Vercel (mais simples)

Conectar o repositorio GitHub na Vercel. O Next.js e detectado automaticamente, zero configuracao.

> **Static Export nao e mais viavel** apos o Sprint E. O root layout le `headers()` para o nonce CSP, o que torna todas as rotas dinamicas. `output: 'export'` falharia.

## Checklist de deploy

- [ ] `npm install` sem erros
- [ ] `npm run lint` — zero erros TypeScript
- [ ] `npm run lint:eslint` — zero warnings de acessibilidade
- [ ] `npm test` — suite vitest passando
- [ ] `npm run build` — **30/30 paginas** (23 proprias + sitemap + robots + opengraph-image + icon + apple-icon + manifest + `_not-found`)
- [ ] Verificar constantes criticas (`CONTENT_PAGES_COUNT = 18`, `totalTopics = 26`, `checklistItemsCount = 35`)
- [ ] `.env.production` com `NEXT_PUBLIC_SITE_URL=https://seu-dominio.tld`
- [ ] PM2 ou Docker configurado para restart automatico
- [ ] SSL/HTTPS ativo no Nginx (Certbot recomendado) — HSTS ja e emitido pelo `next.config.ts`
- [ ] Porta 3000 nao exposta diretamente (apenas via Nginx)
- [ ] Validar CSP em producao via [securityheaders.com](https://securityheaders.com) — meta: nota A+

---
[<- Voltar ao indice](README.md)
