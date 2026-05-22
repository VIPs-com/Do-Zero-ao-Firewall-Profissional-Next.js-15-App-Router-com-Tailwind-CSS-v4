# Documentacao Tecnica — Workshop Linux

> Indice completo da documentacao do projeto.
> Para onboarding rapido: [QUICKSTART.md](../QUICKSTART.md) · Para visao geral: [README.md](../README.md)
>
> 🏁 **Status (Maio 2026): projeto completo.** A trilha do zero ao avançado está inteira
> (Fundamentos → Firewall → Avançados → Capstone DFIR, 80 módulos em `/jornada`), com
> acessibilidade WCAG 2.1 AA validada em 100% das rotas e infraestrutura turn-key
> versionada. Daqui em diante é **perfumaria** — melhorias opcionais, não requisitos.

---

## Arquitetura & Desenvolvimento

- [Arquitetura & Estrutura de Pastas](arquitetura.md) — diagrama de sistema, arvore de pastas, constantes criticas
- [Sistema de Temas (Dark / Light)](temas.md) — tokens de cor, fluxo anti-FOUC, tokens de modulo (Sprint M)
- [Como Desenvolver — Tarefas Comuns](desenvolvimento.md) — nova pagina, novo badge, novo item de busca, variaveis de ambiente
- [Git Workflow](git-workflow.md) — branches, commits semanticos, armadilhas PowerShell

## Funcionalidades

- [Gamificacao & Badges](gamificacao.md) — 79 badges · 223 checkpoints · 7 milestones · como adicionar
- [Busca Global](busca-global.md) — CMD+K, searchItems (313 itens), deep dives
- [SEO — Fonte Unica](seo.md) — ROUTE_SEO (92 rotas), buildMetadata(), sitemap, OG image, JSON-LD
- [Acessibilidade — WCAG 2.1 AA](acessibilidade.md) — modais, focus trap, reduced motion, ESLint jsx-a11y
- [PWA Lite & Boundaries](pwa-boundaries.md) — manifest.ts, error/not-found/loading boundaries

## Seguranca & Infraestrutura

- [Seguranca — Headers & CSP Nonce](seguranca.md) — HSTS, X-Frame-Options, CSP per-request via proxy.ts
- [Deploy & Infraestrutura](deploy.md) — Operação Go-Live: Nginx proxy reverso, TLS/Certbot, artefatos versionados (`Dockerfile`, `infra/`)
- [Exposição & Proteção (Home Lab → Produção)](deploy-homelab.md) — LAN-only sem exposição, Tailscale, Cloudflare Tunnel, DNS-01, CGNAT, NAT loopback
- [Manutencao Preventiva](manutencao.md) — auditoria de deps, cache, monitoramento

## Conteudo do Laboratorio

- [Modulos Linux](modulos-linux.md) — v1.0 Firewall (25) + v2.0 Fundamentos (17) + v3.0 Servidores (9) + v4.0 Infra (9) + v5.0 Cloud & Platform (20) · rota `/jornada` une as trilhas · `/comece-aqui` é o guia de entrada

## Referencia

- [Roadmap Tecnico](roadmap.md) — histórico completo de sprints (A → ARTEFATOS-INFRA)
- [Diagnostico Curricular](DIAGNOSTICO-CURRICULAR.md) — cobertura vs. currículo profissional + roadmap Fases 0–3
- [Glossario Tecnico](glossario.md) — termos de infraestrutura, Next.js e seguranca
- [Apresentacao Executiva](apresentacao.md) — slide deck atualizado para apresentacoes rapidas

---

## Estado atual (Maio 2026)

| Métrica | Valor |
|---------|-------|
| Rotas no build | ~97 (80 páginas de conteúdo + suporte + sitemap/robots/OG/icons/manifest) |
| ROUTE_SEO | 92 rotas |
| Tópicos | 106 |
| Badges | 79 (7 milestones) |
| Checkpoints | 223 |
| Quiz (perguntas) | 338 |
| searchItems | 313 |
| Glossário | 136 termos |
| v1.0 Firewall | 25 módulos ✅ |
| v2.0 Fundamentos | 17 módulos ✅ |
| v3.0 Servidores | 9 módulos ✅ |
| v4.0 Infra Moderna | 9 módulos ✅ |
| v5.0 Cloud & Platform | 20 módulos ✅ |
| Testes vitest | 19 suítes · 258 testes |
| Testes E2E | 25 specs Playwright (inclui baseline a11y axe nas 92 rotas) |
| Acessibilidade | 0 violações axe-core WCAG 2.1 AA (todas as rotas) |
| Build | `output: 'standalone'` · Docker turn-key (`Dockerfile`, `infra/`) |
| CI | GitHub Actions — lint + testes + build + E2E em todo push/PR |
| Vulnerabilidades | 0 (`npm audit`) |
| TypeScript | `strict: true` |
| Stack | Next.js 16.2.6 · React 19 · TS 5.8 · Tailwind v4 |
