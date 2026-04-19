# Roadmap Tecnico

```
Fase 1 ✅ Concluida — Fundacao
  ├── Migracao Vite -> Next.js App Router
  ├── Sistema de Badges & Busca Global (⌘K)
  ├── 21 rotas com conteudo tecnico completo
  ├── Topologia interativa clicavel
  └── Dark Mode corrigido (4 bugs resolvidos)

Sprint A ✅ Robustez
  ├── try/catch em todos os acessos a localStorage
  ├── next/font (Space Grotesk + JetBrains Mono) — self-hosted, zero CLS, LGPD-safe
  └── Web Share API funcional com fallback

Sprint B ✅ SEO
  ├── src/lib/seo.ts — fonte unica (SITE_CONFIG, ROUTE_SEO, buildMetadata)
  ├── Metadata por rota via layout.tsx Server Component
  ├── sitemap.ts + robots.ts dinamicos
  ├── opengraph-image + icon + apple-icon via next/og (edge runtime)
  └── JSON-LD LearningResource no root layout

Sprint C ✅ Acessibilidade WCAG 2.1 AA
  ├── Modais: role="dialog" + aria-modal + focus trap (useFocusTrap)
  ├── GlobalSearch: padrao WAI-ARIA combobox + listbox
  ├── prefers-reduced-motion global + useReducedMotion nos modais
  ├── :focus-visible com outline accent
  └── ESLint jsx-a11y como gate estatico

Sprint D ✅ PWA Lite + Headers de Seguranca
  ├── manifest.ts — PWA Lite (instalavel, sem service worker)
  ├── Icons dinamicos via next/og edge runtime
  ├── HSTS, X-Frame-Options, Permissions-Policy via next.config.ts
  └── Boundaries: error.tsx, not-found.tsx, loading.tsx

Sprint E ✅ CSP nonce per-request (Next.js 16)
  ├── middleware.ts -> proxy.ts (renomeacao Next.js 16)
  ├── Nonce criptografico propagado via x-nonce header
  ├── script-src 'self' 'nonce-XXX' 'strict-dynamic' — sem 'unsafe-inline'
  └── Trade-off: todas as rotas viram dynamic (aceito — nota A+ securityheaders.com)

Sprint G ✅ A11y do TopologyInteractive
  ├── SVG <title> + <desc> descrevendo a topologia
  ├── Nos clicaveis acessiveis por teclado (Enter/Space)
  └── Focus ring visivel via :focus-visible

Sprint F ✅ Performance & Code Splitting
  ├── TopologyInteractive, GlobalSearch, DeepDive -> next/dynamic lazy
  ├── Quiz: dados extraidos para src/data/quizQuestions.ts
  └── @next/bundle-analyzer condicional (ANALYZE=1)

Sprint M ✅ Maquiagem Cyber-Industrial
  ├── Tokens de cor por modulo (--module-<slug>) em globals.css
  ├── Utility classes .module-accent-<slug> + .module-hero
  └── Micro-interacoes: CodeBlock hover glow, badge unlock shine

Sprint T₀ ✅ Testes BadgeContext (vitest)
  ├── vitest + @testing-library/react + happy-dom
  └── 10 testes cobrindo badges, checklist, persistencia

Sprint T₁ ✅ Testes ClientLayout + GlobalSearch + SEO
  └── 18 testes adicionais (nav, tema, busca, metadata)

Sprint J ✅ Export/Import de Progresso
  ├── exportProgress() / importProgress() no BadgeContext
  ├── Botoes Download/Upload no Dashboard
  └── Badge time-traveler na primeira importacao

Sprint I.1 ✅ WireGuard (/wireguard)
  ├── Rota completa: teoria, config servidor/cliente, iptables
  ├── Badge wireguard-master + 3 checkpoints
  └── CONTENT_PAGES_COUNT 16 -> 17

Sprint I.2 ✅ Fail2ban (/fail2ban)
  ├── Rota completa: jails, filtros, monitoramento
  ├── Badge fail2ban-master + 3 checkpoints
  └── CONTENT_PAGES_COUNT 17 -> 18

Polish ✅ Module-accent em 18 paginas
  └── Border-top colorida + radial-gradient glow no hero de cada rota

Sprint T₂ ✅ E2E Playwright (12 testes)
  ├── playwright.config.ts — build prod + start (CSP nonce real)
  ├── e2e/fixtures.ts — resetStorage auto fixture (isolamento entre testes)
  ├── 7 arquivos spec: home topology, explorer badge, quiz, global search,
  │   theme toggle, export/import time-traveler, dashboard counters
  └── npm run test:e2e / test:e2e:ui / test:e2e:headed

Sprint R ✅ Realismo — Alinhamento com Material Original (Aula 1+2)
  ├── /wan-nat expandido: scripts start/stop-firewall, sem-regras.ipt,
  │   LOG porta 80, regras FORWARD e-mail (multiport), 3 novos checkpoints
  ├── Cheat-sheet: +15 comandos (iptables-save/restore, systemd, WireGuard,
  │   Fail2ban, tcpdump, openssl, conntrack, nft)
  ├── Glossário: +11 termos (iptables-save, ip_forward, systemd, journalctl,
  │   Fail2ban, WireGuard, SOA, Vim, tcpdump, multiport, iptables-restore)
  ├── Quiz: +6 perguntas procedurais (persistência, systemd, multiport, LOG)
  ├── Search index: +7 itens (iptables-restore, systemctl, wg, f2b, conntrack…)
  └── ALL_CHECKLIST_IDS: 32 → 35 (+firewall-persistence/service/log)

Sprint P ✅ Diamond Polish — Visual, Textos, Diagramas & Experiência do Aluno
  ├── FluxoCard adicionado a 5 páginas: dns, dnat, port-knocking, vpn-ipsec, nginx-ssl
  ├── "Erros Comuns" (WarnBox) adicionado a 10 páginas: dns, dnat, port-knocking,
  │   vpn-ipsec, nginx-ssl, wireguard, fail2ban, wan-nat, lan-proxy, nftables
  ├── Saídas esperadas de comandos: dns (dig), wireguard (wg show), vpn-ipsec (ipsec statusall)
  ├── "Pulo do Gato" (HighlightBox) adicionado em: dns (serial), port-knocking (--reap),
  │   audit-logs (log-prefix), nftables (bytecode BPF)
  ├── /audit-logs refatorado: usa CodeBlock/InfoBox/WarnBox em vez de divs raw,
  │   adicionado checklist, Section 3 journalctl, trackPageVisit
  ├── /certificado: 5 competências genéricas → grid de 10 competências com ícones
  ├── /dns: adicionado apt install bind9, Section 2 renomeada "Instalação e Configuração"
  └── /nginx-ssl: adicionado trackPageVisit (estava ausente)

Sprint L ✅ Legacy Gold — Resgate Técnico + Profundidade de Elite
  ├── Eixo 1 — Diagnóstico: TroubleshootingCard (OSI Ladder interativo L1-L7),
  │   anatomia visual de linha de log iptables (IN/OUT/SRC/DST/TTL/DPT/SYN)
  ├── Eixo 2 — Profundidade: zona DNS reversa (db.56.168.192 + PTR records),
  │   /proc/net/xt_recent manipulation, IPSec iptables prereqs (UDP 500/4500/ESP),
  │   dhparam.pem + ssl_protocols TLSv1.2/1.3 + Certbot, TTL fingerprinting
  ├── Eixo 3 — Ferramentas: FTP DNAT (portas 21 + 50000:51000) + SSH porta 2222,
  │   MSS Clamping (TCPMSS), conntrack tuning, tcpdump duplo (LAN vs WAN),
  │   Netplan YAML 3-interface, tabela de pacotes por VM, Squid deny-all/admin-only,
  │   scripts /public/scripts/entrar.sh + knock-monitor.sh (download direto)
  ├── Eixo 4 — UX Premium: FluxoCard TLS Handshake 4-etapas, VIM mini-guia,
  │   Remote Access vs Site-to-Site HighlightBox, página /offline terminal-style
  └── Novo componente: TroubleshootingCard.tsx (OSI Ladder expand/collapse, aria-*)

fix(wan-nat) ✅ Revisão de aluno — numeração duplicada
  └── Seção 7 "Erros Comuns" renomeada para "8. Erros Comuns" (conflito com nova Seção 7 Diagnóstico Avançado)

Sprint SIGMA ✅ Resgate Total + Elite Lab
  ├── Eixo 1 — Ambientes de Laboratório (2 novas páginas):
  │   ├── /laboratorio: hub comparativo VirtualBox vs KVM vs Proxmox,
  │   │   KVM/libvirt completo (virt-install, virsh, redes XML, snapshots),
  │   │   tabela de pacotes por VM, 3 checkpoints
  │   └── /proxmox: Proxmox VE instalação, bridges vmbr0/1/2 (/etc/network/interfaces),
  │       criação de VMs via qm, snapshots qm snapshot/rollback, vzdump backup,
  │       cluster HA (pvecm), badge proxmox-pioneer (4 checkpoints)
  ├── Eixo 2 — Certbot Completo para Produção:
  │   └── /nginx-ssl: Seção 3 nova com certbot --nginx, certbot certificates,
  │       certbot renew --dry-run, systemd timer, FluxoCard HTTP-01 challenge,
  │       WarnBox "lab IP privado não funciona", 3 checkpoints
  ├── Eixo 3 — Conteúdo Bonus (20 arquivos integrados):
  │   ├── Navegação: +6 entradas no /topicos para páginas antes invisíveis
  │   │   (/web-server, /nftables, /glossario, /evolucao + novos grupos)
  │   └── Search: +6 itens em searchItems.ts (laboratorio, proxmox, kvm, certbot x2, qm)
  └── Eixo 4 — Badges & Constantes:
      ├── Badge proxmox-pioneer (🖥️): 4 checkpoints Proxmox concluídos
      ├── Badge resgate-gold (🏅): visitar /laboratorio + /proxmox
      └── CONTENT_PAGES_COUNT: 18→20 · checklistItemsCount: 35→45 · totalTopics: 26→38

Sprint SIGMA Fase 2 ✅ Integração dos 20 Arquivos Bônus (Eixo 3)
  ├── /port-knocking — Seção 6 "O Administrador em Ação":
  │   FluxoCard 4 atos (invisível→knock→janela 10s→ESTABLISHED independente),
  │   script ~/entrar.sh, comparativo 847 bots vs 0 com Port Knocking,
  │   dois sistemas: módulo recent (10s de autorização) vs conntrack (5 dias sessão ativa)
  ├── /audit-logs — Seção 5 "Auditoria Forense — Port Knocking":
  │   3 níveis: tail -f | awk ao vivo, análise histórica (top IPs + horários de pico),
  │   correlação batidas+logins (reconhecimento ativo vs admin legítimo),
  │   scripts /usr/local/bin/audit-knock (relatório) + knock-monitor (alertas coloridos),
  │   rotação 90 dias + rsyslog.d/knock.conf (arquivo separado)
  ├── /wan-nat — Seção 9 "A Anatomia do NAT — 5 Funções Simultâneas":
  │   FluxoCard (Roteador+Filtro+Tradutor+Proxy+Guardião),
  │   conntrack -L com mapeamento IDA/VOLTA automático sem regra explícita
  ├── /dnat — Seção 6 "PREROUTING — O Kernel Visto Por Dentro":
  │   Diagrama 5 hooks Netfilter, troca cirúrgica do header IP + recálculo checksum,
  │   conntrack entry IDA+VOLTA, tcpdump duplo (placa WAN vs placa DMZ)
  ├── /lan-proxy — Seção 6 "Fluxo Completo de Navegação via Squid":
  │   FluxoCard timeline t=0ms→t=52ms, 4 cenários ACL,
  │   HTTP vs HTTPS: URL completa vs só domínio → por que dstdomain é obrigatório
  └── checklistItemsCount: 45→56 · ALL_CHECKLIST_IDS: 56 entradas (8 arquivos, 0 páginas novas)

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON implementada (Sprint J).

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---
[<- Voltar ao indice](README.md)
