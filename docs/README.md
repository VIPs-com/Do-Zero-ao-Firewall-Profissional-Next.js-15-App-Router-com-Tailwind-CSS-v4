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

- [Gamificacao & Badges](gamificacao.md) — 46 badges · 127 checkpoints · 5 milestones · como adicionar
- [Busca Global](busca-global.md) — CMD+K, searchItems (121 itens), deep dives
- [SEO — Fonte Unica](seo.md) — ROUTE_SEO (47 rotas), buildMetadata(), sitemap, OG image, JSON-LD
- [Acessibilidade — WCAG 2.1 AA](acessibilidade.md) — modais, focus trap, reduced motion, ESLint jsx-a11y
- [PWA Lite & Boundaries](pwa-boundaries.md) — manifest.ts, error/not-found/loading boundaries

## Seguranca & Infraestrutura

- [Seguranca — Headers & CSP Nonce](seguranca.md) — HSTS, X-Frame-Options, CSP per-request via proxy.ts
- [Deploy & Infraestrutura](deploy.md) — producao, Nginx proxy reverso, checklist de deploy
- [Manutencao Preventiva](manutencao.md) — auditoria de deps, cache, monitoramento

## Conteudo do Laboratorio

- [Modulos Linux](modulos-linux.md) — v1.0 (9 módulos core) + v2.0 Fundamentos (14) + v3.0 Servidores (9) + v4.0 Infra (4)

## Referencia

- [Roadmap Tecnico](roadmap.md) — histórico completo de sprints (A → I.17 Terraform)
- [Glossario Tecnico](glossario.md) — termos de infraestrutura, Next.js e seguranca
- [Apresentacao Executiva](apresentacao.md) — slide deck atualizado para apresentacoes rapidas

---

## Estado atual (Abril 2026)

| Métrica | Valor |
|---------|-------|
| Rotas públicas | 47 (52 total com sitemap/robots/OG/icons/manifest) |
| Tópicos | 74 |
| Badges | 46 |
| Checkpoints | 127 |
| Quiz (perguntas) | 50 |
| v1.0 Firewall | 25 módulos ✅ |
| v2.0 Fundamentos | 14 módulos ✅ |
| v3.0 Servidores | 9 módulos ✅ |
| v4.0 Infra Moderna | 4/8 módulos ✅ |
| Testes vitest | 6 suítes · 51 testes |
| Testes E2E | 9 specs Playwright |
