# Apresentacao Executiva — Slide Deck

*Use este conteudo para apresentacoes rapidas. Copie para PowerPoint, Google Slides ou qualquer visualizador Markdown.*

---

**Slide 1 — Visao Geral**
- **Projeto:** Workshop Linux — Do Zero ao Firewall Profissional
- **Stack:** Next.js 16, Tailwind CSS v4, TypeScript 5.8, React 19
- **Missao:** Democratizar infraestrutura Linux com experiencia gamificada e imersiva
- **Escopo:** 23 rotas, 11 modulos tecnicos, 21 badges, laboratorio Linux real

---

**Slide 2 — Arquitetura**
- **Frontend:** Client + Server Components hibridos (estado reativo + metadata SEO)
- **Persistencia:** `localStorage` como fonte unica (Backend descartado — escopo educacional)
- **Build:** Turbopack · 30/30 paginas · Sprint E torna tudo dynamic (trade-off CSP)
- **Infraestrutura:** Nginx como Proxy Reverso + PM2 para alta disponibilidade

---

**Slide 3 — Seguranca (Sprint D + E)**
- **Headers:** HSTS (2y preload), X-Frame-Options DENY, Permissions-Policy restritiva
- **CSP:** Nonce per-request via `proxy.ts` — `'strict-dynamic'` sem `'unsafe-inline'`
- **A11y:** WCAG 2.1 AA com ESLint `jsx-a11y` como gate estatico
- **Meta:** Nota A+ no securityheaders.com

---

**Slide 4 — SEO & Performance (Sprint B)**
- **Fonte unica:** `src/lib/seo.ts` com `ROUTE_SEO` e `buildMetadata()`
- **Geracao automatica:** sitemap, robots, OG image, favicon, apple-icon, manifest — todos via `next/og` edge
- **Fontes:** `next/font` self-hospedado (zero CLS, LGPD-safe)
- **JSON-LD:** `LearningResource` no root layout

---

**Slide 5 — Sprints Concluidos**
- **Sprint A ✅** Robustez (localStorage try/catch, next/font, Web Share)
- **Sprint B ✅** SEO (seo.ts, sitemap, OG, JSON-LD)
- **Sprint C ✅** A11y WCAG 2.1 AA (focus trap, aria-*, prefers-reduced-motion)
- **Sprint D ✅** PWA Lite + Headers de seguranca
- **Sprint E ✅** CSP nonce per-request via `proxy.ts` (Next.js 16)
- **Sprint G ✅** A11y TopologyInteractive (SVG acessivel, teclado)
- **Sprint F ✅** Code Splitting (lazy load, quiz data, bundle-analyzer)
- **Sprint M ✅** Maquiagem Cyber-Industrial (tokens por modulo)
- **Sprint T₀/T₁ ✅** Testes vitest (BadgeContext, ClientLayout, GlobalSearch, SEO)
- **Sprint J ✅** Export/Import JSON (portabilidade + badge time-traveler)
- **Sprint I.1 ✅** WireGuard (/wireguard + badge + checkpoints)
- **Sprint I.2 ✅** Fail2ban (/fail2ban + badge + checkpoints)
- **Polish ✅** Module-accent glow em 18 paginas de conteudo

---

**Slide 6 — Mensagens-Chave**
- **Seguro por design:** CSP nonce + HSTS + ESLint a11y como gate
- **Escopo honesto:** Sem backend, sem SW — localStorage e PWA Lite bastam
- **Educacional primeiro:** Toda decisao tecnica prioriza clareza de aprendizado

---
[<- Voltar ao indice](README.md)
