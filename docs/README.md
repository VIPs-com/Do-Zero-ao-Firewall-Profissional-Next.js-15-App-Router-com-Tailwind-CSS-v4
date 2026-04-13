# Documentacao Tecnica — Workshop Linux

> Indice completo da documentacao do projeto.
> Para onboarding rapido: [QUICKSTART.md](../QUICKSTART.md) · Para visao geral: [README.md](../README.md)

---

## Arquitetura & Desenvolvimento

- [Arquitetura & Estrutura de Pastas](arquitetura.md) — diagrama de sistema, arvore de pastas, constantes criticas
- [Sistema de Temas (Dark / Light)](temas.md) — tokens de cor, fluxo anti-FOUC, tokens de modulo (Sprint M)
- [Como Desenvolver — Tarefas Comuns](desenvolvimento.md) — nova pagina, novo badge, novo item de busca, variaveis de ambiente
- [Git Workflow](git-workflow.md) — branches, commits semanticos, armadilhas PowerShell

## Funcionalidades

- [Gamificacao & Badges](gamificacao.md) — 21 badges, 32 checkpoints, como adicionar novos
- [Busca Global](busca-global.md) — CMD+K, searchItems, deep dives
- [SEO — Fonte Unica](seo.md) — ROUTE_SEO, buildMetadata(), sitemap, OG image, JSON-LD
- [Acessibilidade — WCAG 2.1 AA](acessibilidade.md) — modais, focus trap, reduced motion, ESLint jsx-a11y
- [PWA Lite & Boundaries](pwa-boundaries.md) — manifest.ts, error/not-found/loading boundaries

## Seguranca & Infraestrutura

- [Seguranca — Headers & CSP Nonce](seguranca.md) — HSTS, X-Frame-Options, CSP per-request via proxy.ts
- [Deploy & Infraestrutura](deploy.md) — producao, Nginx proxy reverso, checklist de deploy
- [Manutencao Preventiva](manutencao.md) — auditoria de deps, cache, monitoramento

## Conteudo do Laboratorio

- [Modulos Linux (11 modulos)](modulos-linux.md) — Instalacao, WAN/NAT, DNS, Nginx, Squid, DNAT, Port Knocking, VPN, nftables, WireGuard, Fail2ban

## Referencia

- [Roadmap Tecnico](roadmap.md) — todos os sprints (A-E, G, F, M, T0/T1, J, I.1, I.2, Polish)
- [Glossario Tecnico](glossario.md) — termos de infraestrutura, Next.js e seguranca
- [Apresentacao Executiva](apresentacao.md) — slide deck para apresentacoes rapidas
