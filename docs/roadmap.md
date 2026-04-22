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

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON implementada (Sprint J).

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---
[<- Voltar ao indice](README.md)
