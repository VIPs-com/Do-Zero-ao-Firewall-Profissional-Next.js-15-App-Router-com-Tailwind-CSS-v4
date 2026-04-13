# Seguranca — Headers e CSP Nonce (Sprint D + E)

## Headers estaticos em `next.config.ts`

| Header | Valor | Funcao |
|--------|-------|--------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forca HTTPS por 2 anos (HSTS preload-ready) |
| `X-Frame-Options` | `DENY` | Bloqueia iframe (defesa adicional ao `frame-ancestors`) |
| `X-Content-Type-Options` | `nosniff` | Impede MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Vaza apenas origem em navegacao cross-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | Desativa APIs sensiveis e FLoC |
| `X-DNS-Prefetch-Control` | `on` | Acelera navegacao via prefetch DNS |

Tambem: `poweredByHeader: false` (nao vaza versao do Next.js) e `compress: true` (gzip/brotli).

## CSP per-request com nonce (Sprint E — `proxy.ts`)

O `Content-Security-Policy` **nao e estatico**. Ele e gerado por requisicao em **`proxy.ts`** (Next.js 16 renomeou `middleware.ts` -> `proxy.ts`):

1. `proxy.ts` gera um nonce criptografico (16 bytes base64) por requisicao
2. Propaga via request header `x-nonce`
3. `app/layout.tsx` le com `await headers()` e aplica `nonce={nonce}` nos dois `<script>` inline (anti-FOUC + JSON-LD)
4. A resposta recebe CSP com `'nonce-XXX' 'strict-dynamic'` em `script-src` — **sem `'unsafe-inline'`**

**Diretivas finais do CSP (producao):**

```
default-src 'self';
script-src 'self' 'nonce-XXX' 'strict-dynamic';
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

> `style-src 'unsafe-inline'` **permanece** — Tailwind v4 e motion/react injetam `<style>` dinamicos. Resolver isso exigiria ou hash de cada estilo (impraticavel) ou nonce em styles (Next.js ainda nao propaga nonce para styles).

## Trade-off aceito

Ler `headers()` no root layout torna **todas as rotas dinamicas** (`f` em vez de `○`). Para um site educacional leve sem necessidade de cache CDN agressivo, o ganho de seguranca (nota **A+** no securityheaders.com) compensa.

**Rotas estaticas apos Sprint E:** apenas `/sitemap.xml`, `/robots.txt` e `/manifest.webmanifest` (nao passam pelo proxy via matcher).

## Regras de ouro na aplicacao

| Area | Pratica |
|---|---|
| Variaveis | `NEXT_PUBLIC_` apenas para o que o browser precisa ler |
| Secrets | Nunca no codigo — `.env` no `.gitignore` |
| Inputs | Sanitizacao de XSS antes de qualquer `localStorage.setItem` |
| Dependencias | `npm audit` mensal |

---
[<- Voltar ao indice](README.md)
