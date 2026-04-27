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

Sprint SIGMA Fase 3 ✅ Polimento Final + Integração Total
  ├── BadgeContext: badge sigma-master (🔬) — desbloqueado ao completar os 11
  │   checkpoints da Fase 2 (knock-admin-flow, audit-knock-script, nat-5-functions,
  │   prerouting-deep-dive, conntrack-dnat-mapping, squid-flow-understood + outros 5)
  ├── searchItems.ts: +6 itens para as novas seções avançadas → 66 itens total
  │   (t-knock-admin, t-forense-knock, t-nat-anatomy, t-prerouting-k,
  │    t-squid-flow, c-knock-monitor — Ctrl+K encontra tudo)
  ├── topicos/page.tsx: +5 tópicos (IDs 38–42) nos grupos existentes
  │   (Port Knocking, Segurança Avançada, WAN/NAT, DNAT, LAN/Proxy)
  ├── dashboard: totalTopics 38→43
  ├── seo.ts: descrições enriquecidas para 5 rotas (port-knocking, audit-logs,
  │   wan-nat, dnat, lan-proxy) — mencionam forense, conntrack, PREROUTING e Squid
  └── CLAUDE.md: constante totalTopics atualizada para 43

Sprint W ✅ Windows-to-Linux — Módulo Zero para alunos Windows
  ├── Boxes.tsx: novo componente WindowsComparisonBox (grid lado a lado 🪟|🐧)
  ├── /instalacao: seção #terminal-do-zero (pwd, ls, sudo, Tab, Ctrl+Shift+C)
  ├── /instalacao: seção #sysadmin-mindset (systemctl vs services.msc, journalctl vs Event Viewer)
  ├── /cheat-sheet: seção #windows-linux — tabela 4 grupos (Navegação, Rede, Processos, Admin)
  ├── BadgeContext: +3 checkpoints (terminal-basico, sudo-entendido, sysadmin-mindset)
  ├── searchItems: +3 itens (t-terminal-zero, t-sysadmin-mindset, t-win-linux-table) → 69 total
  ├── topicos: +2 entradas IDs 43–44 no grupo "Fundação & Terminal"
  └── checklistItemsCount 56→59 · totalTopics 43→45

Sprint W2 ✅ RosettaStone + Botão de Pânico + Badge Explorador de Mundos
  ├── RosettaStone.tsx: tabela interativa 25 comandos (busca + filtro por categoria:
  │   Sistema, Rede, Processos, Serviços, Admin) — prop onFirstInteraction para checkpoint
  ├── public/scripts/resgate-gold.sh: Botão de Pânico — limpa iptables, garante SSH,
  │   ativa ip_forward, salva backup em /etc/firewall/ com timestamp
  ├── /cheat-sheet#scripts: terceiro card de download (grid 2→3 colunas, card vermelho)
  ├── /instalacao: seção #rosetta-stone (RosettaStone interativa com checkpoint)
  ├── /instalacao: seção #troubleshooting-map (FluxoCard OSI — 6 passos L1→L7)
  ├── /certificado: seção "Como apresentar este projeto profissionalmente"
  │   (título currículo + headline LinkedIn + 8 competências técnicas)
  ├── BadgeContext: badge 🧭 explorador-mundos (trigger: 4 checkpoints Módulo Zero)
  ├── BadgeContext: +1 checkpoint rosetta-stone-explored
  ├── searchItems: +2 itens (t-rosetta-stone, c-resgate-gold) → 71 total
  └── checklistItemsCount 59→60 · badges 24→25

Sprint Polish ✅ Navegação Sequencial + Saída Esperada Certbot
  ├── src/data/courseOrder.ts: novo arquivo — sequência canônica de 21 módulos
  │   (instalacao → wan-nat → dns → nginx-ssl → lan-proxy → dnat → port-knocking →
  │    vpn-ipsec → wireguard → nftables → fail2ban → audit-logs → ataques-avancados →
  │    pivoteamento → laboratorio → proxmox → evolucao → cheat-sheet → glossario →
  │    quiz → certificado) — /web-server excluído (página de referência, não módulo)
  ├── src/components/ui/ModuleNav.tsx: novo componente 'use client'
  │   ← Anterior (btn-outline) / Próximo → (btn-primary), aria-label a11y,
  │   responsive (nome completo sm+, "Anterior/Próximo" em mobile)
  ├── 20 páginas de conteúdo: ModuleNav inserido no rodapé de cada rota
  │   (lotes validados com npm run lint após cada batch)
  ├── /nginx-ssl: link avulso para /web-server "Módulo anterior" removido e
  │   substituído pelo ModuleNav padronizado
  ├── /nginx-ssl: labels JSX "▶ Saída esperada — certbot certificates:" e
  │   "▶ Saída esperada — certbot renew --dry-run:" adicionados antes dos
  │   blocos de output do Certbot (alinha com padrão Sprint P de /dns e /wireguard)
  └── Constantes inalteradas: 60 checkpoints · 45 tópicos · 25 badges · 71 searchItems · 33/33 build

Sprint Audit Fix ✅ Consolidação Pós-Cursor Review
  Objetivo: reconciliar 8 inconsistências confirmadas (números, comentários, boilerplate legacy)
  ├── BadgeContext.tsx
  │   ├── deep-diver.desc: "18 páginas" → "20 páginas de conteúdo"
  │   ├── Comentário CONTENT_PAGES_COUNT: "16 rotas" → lista completa das 20 rotas
  │   └── Threshold linux-ninja: 15 → 45 (75% dos 60 checkpoints — coerente com o título)
  ├── app/layout.tsx
  │   └── Comentário "middleware.ts" → "proxy.ts" (Next.js 16 renomeou no Sprint E)
  ├── app/dashboard/page.tsx
  │   ├── Comentários contraditórios limpos (sprint history removido, texto descritivo)
  │   └── totalTopics: 45 → 44 (alinhado ao array TOPICS real em app/topicos/page.tsx)
  ├── app/page.tsx
  │   └── Hero "40+ tópicos práticos" → "44 tópicos práticos"
  ├── .env.example
  │   └── Remove boilerplate AI Studio morto (GEMINI_API_KEY, APP_URL)
  │       Mantém apenas NEXT_PUBLIC_SITE_URL com comentário explicativo
  └── Constantes pós-Audit Fix: totalTopics=44 · 60 checkpoints · 25 badges · 71 searchItems · 33/33 build

Sprint V + Topics + UX ✅ E2E Fixes · Tópico #45 · Dashboard Módulos
  Objetivo: fechar 3 débitos técnicos pós-Audit Fix em sequência
  ├── Sprint V — Playwright E2E
  │   ├── 07-dashboard-counters.spec.ts: 3/35→3/60, 0/21→0/25, comentário header
  │   ├── 03-quiz-expert-badge.spec.ts: fallback parseInt '27'→'33'
  │   └── 08-module-nav.spec.ts: NOVO spec (3 testes — início, meio, fim da sequência)
  ├── Sprint Topics — Tópico #45
  │   ├── app/topicos/page.tsx: nova entrada id='45' grupo "Fundação & Terminal"
  │   │   "RosettaStone interativa: 25 equivalências Windows→Linux" → /instalacao#rosetta-stone
  │   └── app/dashboard/page.tsx: totalTopics 44→45
  ├── Sprint UX — Dashboard Módulos do Curso
  │   ├── Import COURSE_ORDER de @/data/courseOrder
  │   └── Nova seção "Módulos do Curso" entre stats grid e badges:
  │       grid 21 módulos com ✓ verde (visitado) ou número (pendente)
  │       counter "X de 21" no cabeçalho
  └── Constantes: totalTopics=45 · 60 checkpoints · 25 badges · 8 specs E2E · 33/33 build

Sprint T₃ ✅ Testes Unitários courseOrder + ModuleNav
  Objetivo: cobrir os dois arquivos críticos do Sprint Polish com vitest
  ├── src/data/courseOrder.test.ts (NOVO — 9 testes)
  │   ├── 21 módulos exatos
  │   ├── sem paths duplicados
  │   ├── primeiro prev=null · último next=null
  │   ├── começa em /instalacao · termina em /certificado
  │   ├── todos prev (não-null) existem na sequência
  │   ├── todos next (não-null) existem na sequência
  │   ├── bidirecionalidade: se A.next=B então B.prev=A
  │   ├── todos os titles não-vazios
  │   └── todos os paths começam com /
  ├── src/components/ui/ModuleNav.test.tsx (NOVO — 5 testes)
  │   ├── null para path desconhecido
  │   ├── /instalacao: sem Anterior, Próximo→/wan-nat
  │   ├── /wan-nat: Anterior→/instalacao, Próximo→/dns
  │   ├── /certificado: Anterior→/quiz, sem Próximo
  │   └── /nginx-ssl: hrefs corretos /dns e /lan-proxy
  └── Total: 6 suítes · 42 testes vitest · lint ✓ · build 33/33 ✓

Sprint Badge V2 + Search+1 ✅ Mestre do Curso + Busca Módulos
  ├── BadgeContext.tsx
  │   ├── BadgeId: + 'course-master'
  │   ├── BADGE_DEFS: 🎯 Mestre do Curso — "Visitou todos os 21 módulos do curso"
  │   └── useEffect visitedPages: COURSE_ORDER.every() → unlockBadge('course-master')
  ├── searchItems.ts: id='p-modulos' → "Módulos do Curso" → /dashboard#modulos (72 itens)
  ├── e2e/07-dashboard-counters.spec.ts: 0/25 → 0/26 (BADGE_DEFS agora tem 26 chaves)
  └── Constantes: badges 25→26 · searchItems 71→72 · lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint UI-H ✅ Hybrid Progress (ProgressDropdown)
  ├── src/components/ui/ProgressDropdown.tsx (NOVO — dropdown no header)
  │   ├── Trigger: ícone ListChecks + "{completed}/21" (aria-expanded, aria-haspopup=menu)
  │   ├── Painel (motion.div, z-50): barra de progresso + lista dos 21 módulos
  │   ├── Estados por módulo: ✓ visitado · 🟡 atual (1º não-visitado) · ⬜ pendente
  │   ├── A11y: role=dialog, useFocusTrap, ESC fecha, click fora fecha
  │   └── Mobile: sheet full-width ancorada ao topo-right (<sm)
  ├── ClientLayout.tsx: <ProgressDropdown /> inserido após theme toggle
  ├── ContinueFloatingButton removido — ModuleNav no rodapé já cobre navegação sequencial
  └── Zero mudanças em BadgeContext/courseOrder · lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint PV ✅ Polish Visual (Padrão Ouro em Todas as Páginas)
  ├── app/audit-logs/page.tsx
  │   ├── FluxoCard "Anatomia de uma Linha de Log iptables" (5 steps: Timestamp → Host → Prefix → SRC/DST → PROTO/DPT)
  │   └── HighlightBox "Por que o Prefix é seu melhor amigo no forense"
  ├── app/offline/page.tsx
  │   └── Migração de 8 classes hardcoded (#0d1117, #30363d, etc.) para tokens de tema (bg-bg, border-border, text-err, text-ok, text-warn, text-info)
  ├── app/dns/page.tsx
  │   └── WindowsComparisonBox dig↔nslookup (Linux: dig @192.168.56.10 / Windows: nslookup) na seção de Diagnóstico
  ├── app/instalacao/page.tsx
  │   └── FluxoCard "As 3 Interfaces do Firewall — Zonas de Segurança" (eth0 WAN · eth1 DMZ · eth2 LAN) antes do grid principal
  ├── app/page.tsx (Home)
  │   ├── STATS array: 4 cards (45 tópicos / 21 módulos / 26 badges / 7 camadas OSI) com whileInView
  │   ├── Terminal: botões hardcoded (#ff5f57/febc2e/28c840) → bg-err/bg-warn/bg-ok
  │   ├── Terminal: cursor piscante animate-pulse após última linha de comando
  │   └── Features Grid: motion.div com whileInView (opacity+y, delay escalonado, respeita prefers-reduced-motion)
  ├── /dnat · /port-knocking · /nginx-ssl · /lan-proxy · /vpn-ipsec — sem alteração (já no padrão)
  └── lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint CE ✅ Celebração & Engajamento — 3 camadas proporcionais à conquista
  ├── Camada 1 — Quiz Feedback Instantâneo (app/quiz/page.tsx)
  │   ├── Feedback visual imediato ao selecionar opção: verde (correta) · vermelho (errada)
  │   ├── Opções incorretas → opacity-40 · cursor-default (lock após 1ª resposta)
  │   └── Chip abaixo das opções: "✓ Correto!" ou "✗ Resposta correta: [texto]"
  ├── Camada 2 — MilestoneCelebration Modal (src/components/ui/MilestoneCelebration.tsx — NOVO)
  │   ├── Overlay full-screen z-[200] + card centralizado (max-w-sm, backdrop-blur)
  │   ├── Emoji animado (bounce) · título · descrição · barra auto-close 5s
  │   ├── CTA contextual por badge (course-master→/certificado, quiz-master→/dashboard, etc.)
  │   ├── canvas-confetti lazy (3KB gzip, zero deps): disparado apenas para course-master e quiz-master
  │   ├── A11y: useFocusTrap · role=dialog · aria-modal · ESC fecha · foco restaurado
  │   └── prefers-reduced-motion: sem confetti, animações instantâneas
  ├── Camada 3 — Card "Próxima Conquista" (app/dashboard/page.tsx — sidebar)
  │   ├── Calcula milestone mais próxima ainda não desbloqueada
  │   │   (prioridade: linux-ninja → course-master → quiz-master → sigma-master)
  │   ├── Barra de progresso com X/Y e CTA para o módulo mais relevante
  │   └── CTA inteligente: course-master aponta para o 1º módulo ainda não visitado
  ├── BadgeContext.tsx
  │   ├── MILESTONE_BADGES distingue 5 badges especiais dos 21 comuns
  │   ├── Milestones → disparam milestoneBadge (modal) em vez do toast de 4s
  │   ├── Estado milestoneBadge + clearMilestoneBadge() expostos no contexto
  │   └── MilestoneCelebration lazy-loaded via Suspense (não entra no bundle inicial)
  ├── globals.css: @keyframes milestone-close (5s linear) para barra de auto-close
  ├── package.json: + canvas-confetti + @types/canvas-confetti
  └── lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint CERT ✅ Certificado Compartilhável + Imprimível
  ├── app/certificado/page.tsx
  │   ├── Web Share API: navigator.share() no mobile/suportado;
  │   │   fallback navigator.clipboard.writeText() no desktop
  │   ├── Botão "Compartilhar" com feedback "✓ Link copiado!" (3s, aria-live=polite)
  │   └── id="cert-page" no container raiz (alvo do CSS de print)
  ├── app/globals.css: @media print
  │   ├── Oculta header e .no-print (breadcrumb, inputs, botões, seção profissional)
  │   ├── Fundo branco, sem sombras/text-shadow no papel
  │   └── #cert-page: max-width:none · padding:0 · margin:0
  ├── Certificado já usa bg-white/cores slate fixas — imprime limpo em dark e light mode
  ├── Ciclo motivacional fechado: course-master → modal → /certificado → compartilhar/imprimir
  └── lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint CE-E2E ✅ Cobertura E2E para MilestoneCelebration
  ├── e2e/09-milestone-celebration.spec.ts (NOVO — 6 testes)
  │   ├── modal aparece ao hidratar com quiz-score=100 (milestone fresca)
  │   ├── exibe título correto ("Mestre") + label "Badge Desbloqueado!"
  │   ├── ESC fecha o modal
  │   ├── botão × fecha o modal
  │   ├── CTA "Ver meu progresso" navega para /dashboard
  │   └── milestone NÃO exibe toast genérico simultaneamente
  ├── Estratégia: seed localStorage.quiz-score=100 sem workshop-badges
  │   → BadgeContext.useEffect → unlockBadge → MILESTONE_BADGES → modal
  └── Total E2E: 9 specs · lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint ANIM ✅ Micro-animações no Checklist
  ├── app/globals.css
  │   ├── @keyframes checklist-pop (scale 0.3→1.22→0.92→1 · opacity 0→1 · 0.28s ease-out)
  │   └── button > svg.text-ok { animation: checklist-pop 0.28s ease-out }
  │       Quando um item é marcado, React desmonta <Circle> e monta <CheckCircle2
  │       className="text-ok"> — CSS mount-animation dispara automaticamente.
  │       Cobre ChecklistItem (Steps.tsx) e todos os botões inline das 15+ páginas
  │       sem tocar em nenhum arquivo de página.
  │       prefers-reduced-motion: coberto pelo bloco global (animation-duration: 0.01ms).
  ├── app/dashboard/page.tsx
  │   └── Barra "Checklist do Lab": transition-all → transition-[width] duration-700 ease-out
  │       Desliza suavemente ao chegar no dashboard após marcar checkpoints.
  └── lint ✓ · test 42/42 ✓ · build 33/33 ✓

Sprint EVOL ✅ Roadmap Visual em /evolucao
  ├── app/evolucao/page.tsx: nova seção #roadmap-evolucao (3 fases v2.0/v3.0/v4.0)
  │   ├── Grids de módulos disponíveis/em breve por fase
  │   ├── Botão localStorage "Me avise sobre v2.0" (persiste interesse)
  │   └── +1 searchItem (t-roadmap-evolucao)
  └── lint ✓ · test 42/42 ✓ · build ✓

Sprint I.3 ✅ Módulo Hardening (/hardening)
  ├── SSH hardening (PasswordAuthentication no, Ed25519, AllowUsers)
  ├── sysctl security (SYN cookies, ASLR, rp_filter)
  ├── AppArmor (aa-enforce Nginx, aa-logprof, aa-status)
  ├── Badge 🔐 hardening-master · 3 checkpoints · module-accent #a3e635
  └── CONTENT_PAGES_COUNT 20→21 · checklistItemsCount 60→63 · totalTopics 45→46

Sprint I.4 ✅ Módulo Docker Networking (/docker)
  ├── Bridge/host/none drivers · redes customizadas + DNS interno
  ├── Port mapping = DNAT automático · chains DOCKER/DOCKER-USER no iptables
  ├── Docker Compose redes declarativas (frontend/backend/internal)
  ├── Badge 🐳 docker-master · 3 checkpoints · module-accent #2496ed
  └── CONTENT_PAGES_COUNT 21→22 · checklistItemsCount 63→66 · totalTopics 46→47

Sprint F1-F3 ✅ Trilha Fundamentos Linux v2.0 (10 módulos)
  ├── /fundamentos (índice) + /fhs + /comandos + /editores + /processos
  │   + /permissoes + /discos + /logs-basicos + /backup + /shell-script + /cron
  ├── FUNDAMENTOS_ORDER em courseOrder.ts · ModuleNav com prop order=
  ├── Badge 🐧 fundamentos-master · 10 checkpoints · CTA "Novo no Linux?" na home
  ├── +11 searchItems (85 total) · tópicos F01-F10 em /topicos
  └── CONTENT_PAGES_COUNT 22→24 · checklistItemsCount 66→76 · totalTopics 47→57

Sprint Polish-F ✅ Fundamentos Rich Edition
  ├── 7 módulos enriquecidos: /processos, /permissoes, /discos, /logs-basicos,
  │   /backup, /shell-script, /cron
  └── FluxoCard + WindowsComparisonBox + InfoBox/WarnBox + exercícios expandidos

Sprint I.5 ✅ SSH com 2FA / TOTP (/ssh-2fa)
  ├── libpam-google-authenticator · /etc/pam.d/sshd · KbdInteractiveAuthentication
  ├── TOTP teoria (HMAC + RFC 6238) · rollback seguro · integração Fail2ban
  ├── Badge 📱 ssh-2fa-master · 3 checkpoints · module-accent #f59e0b
  └── CONTENT_PAGES_COUNT 24→25(?) · checklistItemsCount 76→79 · totalTopics 57→58

Sprint I.6 ✅ Docker Compose (/docker-compose)
  ├── Anatomia completa do docker-compose.yml · redes frontend/backend/internal
  ├── Volumes nomeados/bind/tmpfs · .env + Docker Secrets · healthcheck + replicas
  ├── Badge 🐙 compose-master · 3 checkpoints · module-accent #1d63ed
  └── CONTENT_PAGES_COUNT →25 · checklistItemsCount 79→82 · totalTopics 58→59

Sprint Polish-I ✅ Módulos Intermediários Rich Edition + Quiz++
  ├── /wireguard: geração de chaves, wg0.conf, wg-quick, wg show, troubleshooting
  ├── /fail2ban: tail auth.log → failregex → maxretry → iptables REJECT → auto-unban
  ├── /nftables: basic ruleset, blocklist set, iptables-translate (fix: trackPageVisit ausente)
  └── Quiz: 33→50 perguntas (+17: WireGuard×3, Fail2ban×3, nftables×3, Hardening×2, Docker×2, Compose×2, SSH 2FA×2)

Sprint F4 ✅ Instalação de Programas (/pacotes)
  ├── apt (update/upgrade/install/purge/autoremove/search) · dpkg · repositórios + PPAs
  ├── snap (sandboxed, auto-update) · pip3 + venv (melhor prática Python)
  ├── Badge 📦 pacotes-master · 3 checkpoints · module-accent #22c55e
  └── checklistItemsCount 82→85 · totalTopics 59→60 · FUNDAMENTOS_ORDER 10→11

Sprint F5 ✅ Processo de Boot (/boot)
  ├── BIOS/UEFI → POST → GRUB2 (update-grub, parâmetros kernel) → kernel+initrd
  ├── systemd PID 1 (targets: poweroff/rescue/multi-user/graphical) · systemd-analyze blame
  ├── Badge 🖥️ boot-master · 3 checkpoints · module-accent warn
  └── checklistItemsCount 85→88 · totalTopics 60→61 · FUNDAMENTOS_ORDER 11→12

Sprint F6 ✅ Comandos Avançados (/comandos-avancados)
  ├── sed (substituição in-place, filtro linhas) · dd (backup de disco, gravar ISO — "disk destroyer")
  ├── nc/NetCat (testar portas, listener, banner grabbing, transferência de arquivo)
  ├── Links simbólicos vs hard links (ln -s, ln, inodes) · compactação (tar+gzip/bzip2/xz, zip)
  ├── Badge 🔧 cmd-avancados-master · 3 checkpoints · module-accent layer-5
  └── checklistItemsCount 88→91 · totalTopics 61→62 · FUNDAMENTOS_ORDER 12→13

Sprint F7 ✅ Logs Centralizados com Rsyslog (/rsyslog)
  ├── rsyslog vs journald · facilities (kern/auth/daemon/mail/user) · priorities (emerg→debug)
  ├── Servidor central (imtcp/imudp porta 514) · cliente remoto (@@servidor:514)
  ├── logrotate · filtros $programname · integração SIEM
  ├── Badge 📡 rsyslog-master · 3 checkpoints · module-accent layer-4
  └── checklistItemsCount 91→94 · totalTopics 62→63 · FUNDAMENTOS_ORDER 13→14 · v2.0 COMPLETO ✅

Sprint I.7 ✅ Servidor DHCP (/dhcp)
  ├── DORA (Discover/Offer/Request/Ack) · isc-dhcp-server · dhcpd.conf
  ├── Subnet/range/routers/dns-servers · reservas por MAC · leases · iptables 67/68 UDP
  ├── Badge 🌐 dhcp-master · 3 checkpoints · module-accent info
  └── checklistItemsCount 94→97 · totalTopics 63→64 · novo grupo "Servidores e Serviços" em /topicos

Sprint I.8 ✅ Samba File Sharing (/samba)
  ├── smb.conf (workgroup, shares público/privado/homes) · smbpasswd · permissões
  ├── Firewall 137/138 UDP + 139/445 TCP · acesso Windows \\IP\pasta · smbclient + mount.cifs
  ├── Badge 🗂️ samba-master · 3 checkpoints · module-accent layer-6
  └── checklistItemsCount 97→100 · totalTopics 64→65

Sprint I.9 ✅ Apache Web Server (/apache)
  ├── /etc/apache2/ · a2ensite/a2dissite · a2enmod · .htaccess · SSL Certbot + autoassinado
  ├── Proxy reverso (ProxyPass/ProxyPassReverse) · Apache vs Nginx tabela comparativa
  ├── Badge 🌍 apache-master · 3 checkpoints · module-accent warn
  └── checklistItemsCount 100→103 · totalTopics 65→66

Sprint I.10 ✅ OpenVPN (/openvpn)
  ├── PKI com Easy-RSA (init-pki, build-ca, build-server, gen-dh, ta.key)
  ├── server.conf (porta 1194 UDP, dev tun, AES-256-GCM) · script gerar-cliente.sh
  ├── iptables NAT+FORWARD para 10.8.0.0/24 · revogação com CRL
  ├── Badge 🔒 openvpn-master · 3 checkpoints · module-accent layer-3
  └── checklistItemsCount 103→106 · totalTopics 66→67

Sprint I.11 ✅ Traefik Proxy Reverso (/traefik)
  ├── docker-compose com Traefik (exposedbydefault=false, ACME/Let's Encrypt)
  ├── Middlewares: redirect HTTP→HTTPS, basicauth htpasswd, rate-limit, HSTS headers
  ├── Dashboard seguro · stack completa (traefik+app+postgres, redes public/internal)
  ├── Badge 🔀 traefik-master · 3 checkpoints · module-accent accent-2
  └── checklistItemsCount 106→109 · totalTopics 67→68

Sprint I.12 ✅ LDAP / OpenLDAP (/ldap)
  ├── DIT (DN, dc, ou, cn, uid, objectClass) · slapd + dpkg-reconfigure
  ├── LDIF (OUs usuarios/grupos) · inetOrgPerson+posixAccount+shadowAccount
  ├── LDAPS (TLS autoassinado + OLC) · PAM (libpam-ldapd+nslcd → login SSH via LDAP)
  ├── Badge 👥 ldap-master · 3 checkpoints · module-accent layer-7
  └── checklistItemsCount 109→112 · totalTopics 68→69

Sprint I.13 ✅ Pi-hole (/pihole)
  ├── DNS sinkhole · Docker Compose (macvlan) · porta 53 conflito systemd-resolved
  ├── DHCP distribui Pi-hole como DNS · iptables DNAT forçar DNS · gravity + blocklists
  ├── Unbound como resolver recursivo local (porta 5335)
  ├── Badge 🕳️ pihole-master · 3 checkpoints · module-accent ok
  └── checklistItemsCount 112→115 · totalTopics 69→70 · v3.0 COMPLETO ✅

Sprint I.14 ✅ Ansible para SysAdmins (/ansible)
  ├── Ansible vs Puppet/Chef/Salt · inventário INI · ad-hoc · playbooks YAML
  ├── Jinja2 templates (loop/when/register) · roles (galaxy init, estrutura completa)
  ├── Ansible Galaxy + Vault (create/edit/view, --vault-password-file)
  ├── Badge ⚙️ ansible-master · 3 checkpoints · module-accent err
  └── checklistItemsCount 115→118 · totalTopics 70→71 · novo grupo "Infraestrutura Moderna"

Sprint I.15 ✅ Prometheus + Grafana (/monitoring)
  ├── 3 pilares observabilidade · Prometheus pull-based TSDB (scraping 15s)
  ├── Docker Compose (prometheus+node_exporter+alertmanager+grafana)
  ├── PromQL (rate/irate/increase/sum/avg) · dashboards ID 1860 · alert_rules.yml
  ├── Alertmanager (routes, group_by, email+Slack, inhibit_rules)
  ├── Badge 📊 monitoring-master · 3 checkpoints · module-accent warn
  └── checklistItemsCount 118→121 · totalTopics 71→72

Sprint I.16 ✅ Kubernetes / K3s (/kubernetes)
  ├── K3s vs K8s vs minikube · conceitos core (Pod/Deployment/Service/Ingress/ConfigMap/Secret/PVC)
  ├── kubectl · manifestos YAML (RollingUpdate + readinessProbe) · ConfigMap+Secret
  ├── Ingress Traefik + cert-manager · NetworkPolicy (requer Calico em K3s) · Helm
  ├── Badge ☸️ k8s-master · 3 checkpoints · module-accent layer-3
  └── checklistItemsCount 121→124 · totalTopics 72→73 · CONTENT_PAGES_COUNT →38

Sprint I.17 ✅ Terraform IaC (/terraform)
  ├── Terraform vs Ansible (provisionamento vs configuração)
  ├── 7 conceitos core: Provider/Resource/Data Source/Variable/Output/State/Module
  ├── Projeto Docker provider (main.tf+variables.tf+outputs.tf)
  ├── Workflow init→plan→apply→destroy · .tfvars · workspaces · state remoto (S3/GitLab/TFC)
  ├── Módulos reutilizáveis · provider AWS (EC2+SG+EIP+user_data) · lifecycle/count/for_each
  ├── Badge 🏗️ terraform-master (46º) · 3 checkpoints · module-accent layer-6
  └── checklistItemsCount 124→127 · totalTopics 73→74 · CONTENT_PAGES_COUNT 38→39

Sprint I.18 ✅ Suricata IDS/IPS (/suricata)
  ├── IDS vs IPS vs Firewall (tabela comparativa) · arquitetura af-packet (passivo) vs NFQUEUE (inline)
  ├── suricata.yaml (HOME_NET, af-packet, eve-log) · anatomia de regras (ação/protocolo/cabeçalho/opções)
  ├── Emerging Threats via suricata-update (et/open ~40.000 regras, cron de atualização)
  ├── EVE JSON (eve.json, jq: top IPs, filtro por sid, alertas em tempo real)
  ├── Modo IPS NFQUEUE (nftables queue + bypass + fail-closed) · integração Grafana/Loki/SIEM
  ├── Badge 🛡️ suricata-master (47º) · 3 checkpoints · module-accent #dc2626
  └── checklistItemsCount 127→130 · totalTopics 74→75 · CONTENT_PAGES_COUNT 39→40

Sprint I.19 ✅ eBPF & XDP (/ebpf)
  ├── eBPF vs módulos do kernel (tabela 5 critérios) · arquitetura: programa→verifier→JIT→hook
  ├── BCC tools (execsnoop, tcptracer, biolatency, opensnoop, funclatency)
  ├── bpftrace (sintaxe AWK-like, probes: kprobe/uprobe/tracepoint/usdt/hardware)
  ├── XDP (eXpress Data Path): XDP_DROP/PASS/TX/REDIRECT, 3 modos (native/offload/generic)
  ├── XDP drop em flood: programa C comentado + Makefile + teste hping3
  ├── Observabilidade com cilium/ebpf-go · integração Grafana (métricas eBPF)
  ├── Badge ⚡ ebpf-master (48º) · 3 checkpoints · module-accent #8b5cf6
  └── checklistItemsCount 130→133 · totalTopics 75→76 · CONTENT_PAGES_COUNT 40→41

Sprint I.20 ✅ Service Mesh com Istio (/service-mesh)
  ├── Problema sem mesh (10 cards: service discovery, mTLS manual, observabilidade zero, etc.)
  ├── Istio vs Linkerd vs Consul (tabela 7 critérios) · arquitetura: istiod→Envoy sidecar→mTLS→Kiali
  ├── Instalação: istioctl precheck/install + namespace label + addons (kiali/jaeger/grafana)
  ├── mTLS STRICT (PeerAuthentication YAML) · SPIFFE X.509 · AuthorizationPolicy deny-all + allow
  ├── VirtualService: canary 90/10, A/B por header, retry+timeout, fault injection (delay/abort)
  ├── DestinationRule: subsets v1/v2, circuit breaker (outlierDetection)
  ├── Observabilidade: Kiali (grafo de serviços), Jaeger (tracing), Grafana (métricas Envoy)
  ├── Badge 🕸️ service-mesh-master (49º) · 3 checkpoints · module-accent #06b6d4
  └── checklistItemsCount 133→136 · totalTopics 76→77 · CONTENT_PAGES_COUNT 41→42

Sprint I.21 ✅ SRE & SLOs (/sre) — v4.0 COMPLETO
  ├── SLI/SLO/SLA hierarquia (SLI=métrica, SLO=meta interna, SLA=contrato externo, regra SLA < SLO)
  ├── Error budget: tabela dos 9s (99.9%=8.7h/ano, 99.99%=52min), grid verde=acelerar/vermelho=congelar
  ├── PromQL para SLIs: recording rules de disponibilidade + latência P99 + burn rates (1h/6h)
  ├── Alertas de burn rate: crítico 14.4× (1h) + alerta 6× (6h) · Grafana dashboard restante de budget
  ├── On-call: anti-padrões (WarnBox alert fatigue) · checklist acionável · runbook template markdown
  ├── Postmortem blameless: Just Culture · template 5 seções · grid blame vs sistêmico
  ├── Toil: tabela 5 linhas com como eliminar (automação, self-service, fixar root cause)
  ├── Badge 🎯 sre-master (50º) · 3 checkpoints · module-accent #f59e0b
  └── checklistItemsCount 136→139 · totalTopics 77→78 · CONTENT_PAGES_COUNT 42→43

Sprint I.22 ✅ CI/CD com GitHub Actions (/cicd) — v5.0 INICIADA
  ├── 6 conceitos core: Workflow/Job/Step/Action/Runner/Artifact
  ├── CI pipeline: jobs paralelos lint+test → encadeamento via needs → build → artifact upload
  ├── Docker build+push: login-action, metadata-action (semver+sha tags), build-push-action + cache GHA
  ├── Environments (staging auto + production com required reviewers) · deploy via SSH
  ├── Matrix strategy: node 18/20/22 × ubuntu/windows, fail-fast false, exclude
  ├── Secrets (3 escopos: repo/env/org) · masking de valores dinâmicos · GITHUB_TOKEN
  ├── Self-hosted runner (register+config.sh, svc.sh systemd) · WarnBox repo público
  ├── Workflows reutilizáveis (workflow_call) · Slack notification on-failure
  ├── Badge 🚀 cicd-master (51º) · 3 checkpoints · module-accent #2563eb
  ├── checklistItemsCount 139→142 · totalTopics 78→79 · CONTENT_PAGES_COUNT 43→44
  └── Novo grupo "Cloud & Platform Engineering" em /topicos (tópico C01)

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON implementada (Sprint J).

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---
[<- Voltar ao indice](README.md)
