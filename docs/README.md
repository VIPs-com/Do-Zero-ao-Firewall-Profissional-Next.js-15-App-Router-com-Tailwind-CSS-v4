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

- [Gamificacao & Badges](gamificacao.md) — 76 badges · 214 checkpoints · 7 milestones · como adicionar
- [Busca Global](busca-global.md) — CMD+K, searchItems (292 itens), deep dives
- [SEO — Fonte Unica](seo.md) — ROUTE_SEO (88 rotas), buildMetadata(), sitemap, OG image, JSON-LD
- [Acessibilidade — WCAG 2.1 AA](acessibilidade.md) — modais, focus trap, reduced motion, ESLint jsx-a11y
- [PWA Lite & Boundaries](pwa-boundaries.md) — manifest.ts, error/not-found/loading boundaries

## Seguranca & Infraestrutura

- [Seguranca — Headers & CSP Nonce](seguranca.md) — HSTS, X-Frame-Options, CSP per-request via proxy.ts
- [Deploy & Infraestrutura](deploy.md) — producao, Nginx proxy reverso, checklist de deploy
- [Manutencao Preventiva](manutencao.md) — auditoria de deps, cache, monitoramento

## Conteudo do Laboratorio

- [Modulos Linux](modulos-linux.md) — v1.0 Firewall (25) + v2.0 Fundamentos (17) + v3.0 Servidores + v4.0 Infra + v5.0 Cloud · rota `/jornada` une as 3 trilhas

## Referencia

- [Roadmap Tecnico](roadmap.md) — histórico completo de sprints (A → GPG)
- [Diagnostico Curricular](DIAGNOSTICO-CURRICULAR.md) — cobertura vs. currículo profissional + roadmap Fases 0–3
- [Glossario Tecnico](glossario.md) — termos de infraestrutura, Next.js e seguranca
- [Apresentacao Executiva](apresentacao.md) — slide deck atualizado para apresentacoes rapidas

---

## Estado atual (Maio 2026)

| Métrica | Valor |
|---------|-------|
| Rotas no build | 93 (77 páginas de conteúdo + suporte + sitemap/robots/OG/icons/manifest) |
| ROUTE_SEO | 88 rotas |
| Tópicos | 103 |
| Badges | 76 (7 milestones) |
| Checkpoints | 214 |
| Quiz (perguntas) | 326 |
| v1.0 Firewall | 25 módulos ✅ |
| v2.0 Fundamentos | 17 módulos ✅ |
| v3.0 Servidores | 9 módulos ✅ |
| v4.0 Infra Moderna | 9 módulos ✅ |
| v5.0 Cloud & Platform | 17 módulos ✅ |
| Testes vitest | 19 suítes · 258 testes |
| Testes E2E | 25 specs Playwright |
| CI | GitHub Actions — lint + testes + build + E2E em todo push/PR |
| Vulnerabilidades | 0 (`npm audit`) |
| TypeScript | `strict: true` |
| Stack | Next.js 16.2.6 · React 19 · TS 5.8 · Tailwind v4 |
