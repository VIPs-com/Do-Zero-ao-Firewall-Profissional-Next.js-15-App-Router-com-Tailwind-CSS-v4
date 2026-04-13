# Glossario Tecnico

**App Router** — Sistema de roteamento do Next.js baseado em pastas. Cada pasta com `page.tsx` vira uma rota publica automaticamente.

**Client Component** — Componente que roda no browser. Exige `'use client';` no topo. Necessario para hooks (`useState`, `useEffect`) e eventos DOM.

**Server Component** — Componente que roda apenas no servidor. Mais rapido e seguro, mas sem interatividade direta. Padrao no App Router quando nao ha `'use client'`.

**BadgeContext** — Provedor de estado global que rastreia progresso do usuario (badges, paginas visitadas, checkpoints concluidos).

**FOUC** (Flash of Unstyled Content) — Piscada visual quando o estilo e aplicado depois da renderizacao inicial. No Dark Mode, manifesta como flash branco antes do tema escuro carregar.

**Tailwind CSS v4** — Framework CSS utilitario. Nesta versao, os tokens ficam em `@theme {}` no CSS (nao em `tailwind.config`). Classes utilitarias diretamente no JSX.

**ACL** (Access Control List) — Lista de regras que define quem pode acessar o que. Usada no Squid (web) e iptables (rede).

**conntrack** — Modulo do kernel Linux que rastreia o estado de conexoes ativas. Base do Stateful Firewall — permite regras `ESTABLISHED,RELATED`.

**DNAT** — Destination NAT. Muda o IP de destino de um pacote antes do roteamento. Usado em port forwarding para expor servidores internos.

**SNAT / Masquerade** — Source NAT. Muda o IP de origem de um pacote na saida. Permite que a rede interna navegue com o IP publico do Firewall.

**Netfilter Hooks** — 5 pontos do kernel onde o iptables intercepta pacotes: `PREROUTING -> INPUT -> FORWARD -> OUTPUT -> POSTROUTING`.

**PSK** (Pre-Shared Key) — Senha compartilhada entre os dois lados de uma VPN IPSec. Deve ser identica nos dois Firewalls.

**IKE** (Internet Key Exchange) — Protocolo que negocia e estabelece as chaves criptograficas da VPN IPSec em duas fases.

**SSL Bump** — Tecnica avancada do Squid que intercepta e decripta trafego HTTPS para inspecao de conteudo. Exige instalar um certificado do Proxy em todas as maquinas da rede.

**CSP nonce** — Valor criptografico aleatorio gerado por requisicao, aplicado como atributo `nonce=` em scripts inline e declarado no header CSP. Permite scripts inline confiaveis sem precisar de `'unsafe-inline'` (que derrotaria o CSP).

**`'strict-dynamic'`** — Diretiva CSP moderna que permite scripts confiaveis (com nonce) carregarem dinamicamente outros scripts, sem precisar manter uma allowlist de dominios. Substitui `script-src 'self' https://cdn...` por uma cadeia de confianca baseada em nonce.

**`proxy.ts`** — Arquivo renomeado do antigo `middleware.ts` no Next.js 16. Roda na edge antes do render, ideal para headers dinamicos como CSP nonce.

**HSTS** (HTTP Strict Transport Security) — Header que instrui o browser a so acessar o site via HTTPS por um periodo definido (aqui: 2 anos). Com `preload`, pode ser inscrito na lista do Chromium para protecao no primeiro acesso.

**FOUC** (Flash of Unstyled Content) — Piscada visual quando o estilo e aplicado depois da renderizacao inicial. No Dark Mode, manifesta como flash branco antes do tema escuro carregar. Resolvido por script sincrono no `<head>` que aplica a classe antes do primeiro paint.

**WCAG 2.1 AA** — Web Content Accessibility Guidelines. Nivel AA e o padrao de conformidade exigido pela maioria das legislacoes (LBI no Brasil, ADA nos EUA, EN 301 549 na UE).

**next/og** — API do Next.js que gera imagens dinamicamente (OG, icones) usando JSX no edge runtime. Substitui PNGs binarios no repositorio.

---
[<- Voltar ao indice](README.md)
