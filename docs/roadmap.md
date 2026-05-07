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

Sprint I.23 ✅ OPNsense / pfSense (/opnsense) — v5.0
  ├── OPNsense vs pfSense: tabela 7 critérios (base, GUI, plugins, HA, updates, licença, comunidade)
  ├── Instalação VM com 3 NICs (WAN/LAN/DMZ) · mapa da Web UI · regras por interface (pf ingress)
  ├── Aliases (IP/Network/Port/URL) · Port Forward = DNAT · equivalências iptables↔OPNsense
  ├── VPN: WireGuard nativo + OpenVPN wizard · Suricata IDS/IPS plugin (3 etapas)
  ├── CARP HA: FluxoCard MASTER→BACKUP→failover→VIP reassign
  ├── API REST (GET /api/firewall/filter) · backup automático via cron
  ├── Badge 🔥 opnsense-master (52º) · 3 checkpoints · module-accent #d94f00
  └── checklistItemsCount 142→145 · totalTopics 79→80 · CONTENT_PAGES_COUNT 44→45

Sprint I.24 ✅ Nextcloud — Nuvem Pessoal Self-hosted (/nextcloud) — v5.0
  ├── Nextcloud vs ownCloud/Seafile/Google Drive: tabela comparativa
  ├── Docker Compose stack: Nextcloud + MariaDB + Redis + Traefik (labels ACME, volumes persistentes)
  ├── Pós-instalação: occ config:system, Redis cache/locking, cron container, 2FA TOTP
  ├── 8 apps: Calendar(CalDAV), Contacts(CardDAV), Talk, Collabora Online, Mail, Deck, Maps, Backup
  ├── Integração LDAP: server discovery, user mapping, group mapping (link → Sprint I.12)
  ├── Object storage MinIO: S3-compatible, .env OBJECTSTORE_*, lifecycle policies
  ├── Backup 3-2-1: script bash (rsync local + rsync remoto + rclone cloud)
  ├── Badge ☁️ nextcloud-master (53º) · 3 checkpoints · module-accent #0082c9
  └── checklistItemsCount 145→148 · totalTopics 80→81 · CONTENT_PAGES_COUNT 45→46

Sprint I.25 ✅ eBPF Avançado + Cilium (/ebpf-avancado) — v5.0 COMPLETA
  ├── Cilium vs kube-proxy/flannel: O(1) eBPF map vs O(N) iptables · sem VXLAN overhead
  ├── Instalação K3s bare (--flannel-backend=none) + helm install Cilium (kubeProxyReplacement=true)
  ├── Hubble: CLI (observe --verdict DROPPED, port-forward relay:4245) · Hubble UI service map
  ├── CiliumNetworkPolicy L3/L4: default-deny + whitelist por labels
  ├── CiliumNetworkPolicy L7: HTTP path/method · DNS toFQDNs (update dinâmico sem restart)
  ├── eBPF LB: cilium bpf lb list · DSR mode · Maglev hashing
  ├── Tetragon: TracingPolicy Sigkill para nc/ncat · detectar acesso /etc/shadow · tetra getevents
  ├── eBPF maps: LRU_HASH/PERCPU_HASH/RINGBUF/PROG_ARRAY — tabela de tipos e casos de uso
  ├── bpftrace avançado: kprobes (latência read()), uprobes (app Go), tracepoint I/O disco
  ├── Badge 🧬 ebpf-avancado-master (54º) · 3 checkpoints · module-accent #6d28d9
  ├── checklistItemsCount 148→151 · totalTopics 81→82 · CONTENT_PAGES_COUNT 46→47
  └── /evolucao v5.0 COMPLETO: 4 disponíveis · 0 em breve ✅

Sprint Quiz++ ✅ Cobertura de todos os módulos
  ├── +58 perguntas cobrindo 23 módulos sem coverage (F4-F7 · I.7-I.25)
  └── Total quiz: 50→108 perguntas

Sprint SSH-PROXY ✅ SSH como Proxy SOCKS (/ssh-proxy) — v3.0 COMPLETA
  ├── SOCKS5 dinâmico (-D): ssh -D 1080, proxychains, curl --socks5-hostname
  ├── Port forwarding local (-L): postgresql via localhost, múltiplos forwards
  ├── Port forwarding remoto (-R): expor serviço local via servidor público
  ├── Jump Host (-J / ProxyJump): saltos simples e encadeados
  ├── autossh + systemd: serviço de túnel persistente com restart automático
  ├── ~/.ssh/config: ControlMaster, ControlPersist, ProxyJump declarativo
  ├── WindowsComparisonBox: PuTTY/plink ↔ OpenSSH
  ├── 4 erros comuns: connection refused, bind in use, AllowTcpForwarding, DNS leak
  ├── Badge 🚇 ssh-proxy-master (55º) · 3 checkpoints · module-accent #0ea5e9
  ├── checklistItemsCount 151→154 · totalTopics 82→83 · CONTENT_PAGES_COUNT 47→48
  └── /evolucao v3.0: 10 disponíveis · 0 em breve ✅

Sprint Quiz Completo ✅ Cobertura de ≥3 questões por módulo
  ├── +17 perguntas para módulos com apenas 2 questões (F5, F7, I.7-I.13, I.15, I.17-I.24)
  └── Total quiz: 108→122 perguntas (todos os módulos com ≥3 questões)

Sprint Quiz Fundamentos F1-F10 ✅ Trilha Fundamentos com zero cobertura
  ├── +30 perguntas — 3 por módulo: FHS, Comandos, Editores, Processos, Permissões,
  │   Discos, Logs Básicos, Backup, Shell Script, Cron
  └── Total quiz: 122→152 perguntas

Sprint Polish-Stale ✅ Referências "10 módulos" → "15 módulos" Fundamentos
  ├── app/page.tsx hero, app/cron/page.tsx checkpoint
  ├── src/data/courseOrder.ts comment, src/lib/seo.ts description
  └── Sem mudanças em constantes de código

Sprint Counter-Sync + Evolucao Fix ✅ Sincronização de contadores
  ├── totalTopics 84→85 (TOPICS.length confirmado = 85, inclui s08 SSH Proxy + sub-entries 27b/47b)
  ├── Home stats '84'→'85' e "84 tópicos" → "85 tópicos"
  ├── /evolucao: "Roadmap em 3 fases" → "4 fases (v2.0→v5.0)"
  └── Botão "Me avise sobre v3.0" → "Me avise sobre novos módulos" (v3.0 COMPLETO)

Sprint Advanced-Trail ✅ Trilha Avançada com 19 módulos
  ├── ADVANCED_ORDER (19 módulos v3.0→v5.0) em courseOrder.ts
  ├── Badge 🌐 advanced-master (56º — visitar todos os 19 módulos avançados)
  ├── Seção "Módulos Avançados" no dashboard com barra de progresso + grid de módulos
  ├── MILESTONE_BADGES inclui advanced-master
  ├── home stats badges 55→56
  ├── +6 novos testes vitest para ADVANCED_ORDER (57 testes total)
  └── E2E 07-dashboard-counters 0/55→0/56

Sprint Advanced-Nav ✅ ModuleNav em todos os módulos avançados
  ├── ModuleNav estendido para aceitar SimpleModule[] (prev/next derivados do índice)
  ├── ModuleNav adicionado em todos os 19 módulos avançados
  └── Fix de import mislocado em monitoring/page.tsx

Sprint PROGRESS-DROPDOWN ✅ ProgressDropdown com 3 abas
  ├── 3 abas: Firewall (25 módulos) / Fundamentos (15) / Avançados (19)
  ├── Botão exibe total X/59 com barra de progresso e lista por aba
  ├── Cores distintas por trilha (accent/indigo/info)
  └── A11y preservada (role=tablist, aria-selected, focus trap)

Sprint QUIZ-TRAIL ✅ Campo trail em todas as 152 questões
  ├── Campo trail: QuizTrail adicionado a todas as questões via script
  │   (firewall=50, fundamentos=45, avancados=57)
  └── Seletor de trilha (4 opções: Todas/Firewall/Fundamentos/Avançados) na tela inicial do quiz

Sprint TOPICOS-TRAIL ✅ Filtro de trilha na página /topicos
  ├── Filtro de trilha (🗂️ Todas / 🔥 Firewall / 🐧 Fundamentos / 🚀 Avançados)
  ├── Mapeamento group→trail via TRAIL_BY_GROUP (sem modificar os 85 objetos Topic)
  └── Filtros de trilha e camada OSI são independentes (AND)

Sprint AVANCADOS-INDEX ✅ Índice da trilha avançada (/avancados)
  ├── 19 módulos em 3 seções (v3.0 Servidores / v4.0 Infraestrutura / v5.0 Cloud)
  ├── Hero com CTA inteligente (Começar/Continuar/Revisar)
  ├── Nav link 🚀 Avançados adicionado em ClientLayout.tsx
  ├── CONTENT_PAGES_COUNT 48→49 · SEO /avancados em seo.ts
  └── +2 searchItems (145 total)

Sprint GLOSSARIO-ADVANCED ✅ +12 termos ao glossário (73→85 termos)
  ├── mTLS, Sidecar Proxy, VirtualService, Circuit Breaker, CNI, NetworkPolicy,
  │   Pipeline CI/CD, GitOps, IDS/IPS, CARP, Burn Rate, Trace/Tracing
  ├── trackPageVisit em /glossario, /certificado, /evolucao (contam para deep-diver)
  └── +4 searchItems glossário (148 total)

Sprint QUIZ-FIX ✅ Correção de trail para SSH-PROXY
  └── 3 questões SSH-PROXY: trail 'avancados'→'fundamentos' (fundamentos 42→45, avancados 60→57)

Sprint QUIZ-COVER ✅ +13 questões para módulos com <3 cobertura
  ├── DNAT(+2), Port Knocking(+2), Diagnóstico SSL(+2), Camada 3(+1), Análise de Pacotes(+1)
  ├── systemd(+1), Hardening(+1), Docker(+1), Compose(+1), SSH 2FA(+1)
  └── Total: 151→164 (firewall=62, fundamentos=45, avancados=57)

Sprint QUIZ-LATE-MODULES ✅ +9 questões para módulos sem cobertura
  ├── Pivoteamento (🎭 +3), Laboratório (🧪 +3), Proxmox (🖥️ +3)
  └── Total: 164→173 (firewall=71, fundamentos=45, avancados=57)

Sprint QUIZ-UX ✅ Embaralhamento + Tamanho de Sessão
  ├── Fisher-Yates shuffle — questões embaralhadas aleatoriamente em cada sessão
  ├── Seletor de tamanho: Rápido (20 questões ~5min) / Normal (40) / Completo (todas)
  ├── aria-label="Começar Quiz" para estabilidade nos testes E2E
  └── E2E spec atualizado

Sprint SEARCH-EXPAND ✅ +15 itens de busca para módulos com cobertura única
  ├── 15 módulos: ataques-avancados, pivoteamento, hardening, docker, fundamentos,
  │   fhs, comandos, editores, processos, permissoes, discos, logs-basicos,
  │   backup, shell-script, cron
  └── searchItems 148→163

Sprint CONTENT-ATAQUES ✅ /ataques-avancados enriquecida
  ├── 6 tipos de ataque: recon nmap, fragmentação, SYN flood+connlimit, ARP spoofing,
  │   timing attack/SPA, DNS rebinding
  ├── FluxoCard Cyber Kill Chain · WindowsComparisonBox · tcpdump analysis · WarnBox ético
  ├── 3 checkpoints (ataques-recon, ataques-syn, ataques-arp)
  └── checklistItemsCount 154→157 · linux-ninja 115→117

Sprint CONTENT-PIVOTING ✅ /pivoteamento enriquecida
  ├── FluxoCard cadeia 6 etapas · FORWARD DROP com logging · egress filtering completo
  ├── Anti-DNS-tunneling DNAT · tabela técnicas evasão×defesa · script anti-pivoteamento
  ├── WindowsComparisonBox (Azure NSG ↔ iptables) · detecção de IoC · exercícios guiados
  ├── 3 checkpoints (pivote-forward-drop, pivote-egress, pivote-honeypot)
  └── checklistItemsCount 157→160 · linux-ninja 117→120

Sprint CONTENT-LABORATORIO ✅ /laboratorio enriquecida
  ├── FluxoCard evolução do lab (VirtualBox→KVM→Proxmox→Cluster HA)
  ├── WarnBox requisitos de hardware · WindowsComparisonBox (Hyper-V ↔ KVM/libvirt)
  └── Sem mudanças em constantes (checkpoints já existiam)

Sprint WINDOWS-POLISH ✅ WindowsComparisonBox em 10 páginas (3 rounds)
  ├── Round 1: audit-logs, wan-nat, dnat, hardening
  ├── Round 2: docker, nginx-ssl, lan-proxy, proxmox
  ├── Round 3: ssh-2fa, port-knocking
  └── 100% de cobertura WindowsComparisonBox em todos os módulos da trilha v1.0

Sprint FUNDAMENTOS-WINDOWS ✅ WindowsComparisonBox na trilha Fundamentos
  ├── fhs (C:\Windows↔/etc, Registry↔/proc)
  ├── editores (Notepad/PowerShell↔nano/vim)
  ├── comandos (dir↔ls, type↔cat, 20+ equivalências)
  ├── vpn-ipsec (RRAS IKEv2↔StrongSwan)
  └── 100% de cobertura em TODOS os módulos

Sprint ERROS-COMUNS ✅ Seção "Erros Comuns e Soluções" em 100% das páginas
  ├── 4 cards por página — causa, solução, comando de diagnóstico
  ├── 3 rodadas cobrindo 33 módulos adicionais (59 páginas total)
  └── Sem mudanças em constantes

Sprint DEEP-DIVES-V2 ✅ +2 deep dives (6→8)
  ├── "Docker Networking Internals" em /docker (bridge docker0, veth, DOCKER chains)
  └── "Kubernetes Service Discovery" em /kubernetes (CoreDNS, iptables, Cilium eBPF)

Sprint DEEP-DIVES-V3 ✅ +4 deep dives (8→12)
  ├── "Ansible Idempotência e Ciclo de Execução" em /ansible
  ├── "SRE Error Budget — Matemática dos Noves" em /sre
  ├── "eBPF Maps — Memória Compartilhada" em /ebpf
  └── "GitHub Actions — Pipeline Seguro" em /cicd

Sprint GLOSSARIO-V2 ✅ +15 termos (85→100)
  └── TOTP, PAM, SMB/CIFS, DN, objectClass, PFS, XDP, SLI, Postmortem, Toil,
      ACME, Cilium, Artifact, Runner, DHCP Relay

Sprint GLOSSARIO-V3 ✅ +15 termos (100→115)
  └── Idempotência, Handler Ansible, eBPF Verifier, BPF Map, CrashLoopBackOff,
      ImagePullBackOff, ForceNew Terraform, Concurrency GitHub Actions, mTLS, SPIFFE,
      VirtualService Istio, Envoy Proxy, PodDisruptionBudget, Recording Rule, Deployment Strategy

Sprint CHEAT-V2 ✅ +11 comandos no cheat-sheet (69→80)
  └── DNS (dig PTR+MX), Proxy (squid -k), systemd (systemd-analyze blame), Logs (logrotate -f),
      DHCP (journalctl DORA), Samba (testparm -s), Apache (apachectl -S), LDAP (slapcat backup),
      Suricata (eve.json jq), Pi-hole (pihole -c), Monitoring (targets API)

Sprint CHEAT-V3 ✅ +17 comandos (80→97)
  └── DNS (dig +trace), Proxy (awk access.log), nftables (3 cmds), Traefik (3 cmds),
      eBPF (3 cmds), SRE (promtool/amtool/kubectl hpa), Service Mesh (3 cmds istioctl/hubble)

Sprint QUIZ-200 ✅ +27 perguntas de profundidade (173→200)
  └── conntrack, DNAT, DNS reversa, HSTS, IPSec PFS, WireGuard, Fail2ban, nftables,
      Hardening, Port Knocking, Squid, Docker host, Ansible, PromQL, K8s, Suricata,
      SRE toil, CI/CD matrix

Sprint SEARCH-V2 ✅ +17 itens de busca (163→180)
  └── Terceiro item (glossário técnico) para cada módulo avançado com apenas 2 itens:
      dhcp, samba, apache, openvpn, traefik, ldap, pihole, ansible, monitoring,
      kubernetes, terraform, ebpf, ebpf-avancado, sre, opnsense, nextcloud, ssh-proxy

Sprint EXERCICIOS ✅ Seções "Exercícios Guiados" — 100% cobertura (59 páginas)
  ├── 3 labs hands-on por página em TODOS os módulos de conteúdo
  ├── Lotes: Round 1-4 (v1.0 principais), Round 5 (v4.0+v5.0 avançados),
  │   Fundamentos v2.0 (14 módulos), v1.0 restantes, v3.0 Servidores, v4.0 Infra
  └── Sem mudanças em constantes

Sprint QUIZ-FUNDAMENTOS-DEPTH ✅ +15 perguntas de profundidade Fundamentos (200→215)
  └── 1 pergunta adicional para cada um dos 15 módulos da trilha Fundamentos
      (firewall=92, fundamentos=60, avancados=63)

Sprint QUIZ-AVANCADOS-DEPTH ✅ +19 perguntas de profundidade Avançados (215→234)
  └── 1 pergunta adicional para cada um dos 19 módulos da trilha Avançados
      (firewall=92, fundamentos=60, avancados=82)

Sprint QUIZ-FIREWALL-DEPTH ✅ +9 perguntas para módulos Firewall com <4 questões (234→243)
  └── Diagnóstico, Análise de Pacotes, Diagnóstico SSL, systemd, Compose,
      SSH 2FA, Pivoteamento, Laboratório, Proxmox
      (firewall=101, fundamentos=60, avancados=82)

Sprint QUIZ-SCENARIOS ✅ +10 questões de cenário real de produção (243→253)
  └── DNS sem IP, iptables ordem de regras, certbot force-renewal, Docker sem internet,
      Ansible always-changed, K8s CrashLoopBackOff, Prometheus InstanceDown,
      Terraform ForceNew, GitHub Actions secrets, SRE error budget negativo
      (firewall=105, fundamentos=60, avancados=88)

Sprint DEEP-DIVES-V3 FIX ✅ IDs corrigidos + nftables novo deep dive
  ├── vpn-ipsec: 'ipsec-deep'→'ipsec-ike-phases'
  ├── lan-proxy: 'squid-https'→'squid-https-filtering'
  └── Adicionado 'nftables-vs-iptables' em /nftables (12 deep dives todos acessíveis)

Sprint SEARCH-COMPLETE ✅ 100% de módulos com ≥3 itens de busca (185→220)
  ├── 3º item adicionado para TODOS os módulos com cobertura dupla (31 módulos de conteúdo)
  ├── /topicos (2→3), /quiz (1→3), /certificado (1→3), /dashboard, /evolucao
  ├── +1 quiz question K8s (Deployment vs StatefulSet)
  └── Total quiz: 253→254 (avancados=89)

Sprint DEEP-DIVES-V4 ✅ +4 deep dives (12→16)
  ├── "TLS 1.3 Handshake Detalhado" em /nginx-ssl
  ├── "WireGuard Noise Protocol" em /wireguard
  ├── "Fail2ban Arquitetura Interna" em /fail2ban
  └── "Hardening Defense in Depth" em /hardening

Sprint UX-TABS ✅ Navegação por 3 abas em 8 páginas extensas
  ├── /ansible, /kubernetes, /terraform, /monitoring, /cicd,
  │   /service-mesh, /suricata, /ldap
  ├── Padrão: useState + border-b-2 -mb-px + border-[var(--mod)] ativo
  └── Zero mudanças em constantes de badge/checkpoint

Sprint UX-PAGES ✅ UX enriquecida em /topicos e /cheat-sheet
  ├── /topicos: seção "Por onde começar?" com 3 cards de trilha (barra de progresso dinâmica),
  │   ✓ verde por tópico visitado, pill de trilha nos cabeçalhos de grupo
  └── /cheat-sheet: 4 abas (Comandos/Workflows/Windows↔Linux/Scripts&VIM),
      feedback "Copiado!" 2s por botão via copiedId state

Sprint EVOLUCAO-FIX ✅ /evolucao reflete exatamente as 4 trilhas
  ├── ssh-proxy movido de PHASE_V2 para PHASE_V3 (slug correto)
  ├── PHASE_V2.status '17 disponíveis' → '16 disponíveis'
  ├── PHASE_V3.status '9 disponíveis' → '10 disponíveis'
  └── Roadmap reflete: v1.0 (25) + v2.0 (16 Fundamentos) + v3.0 (10 Servidores) + v4.0 (8 Infra) + v5.0 (4 Cloud)

Sprint UX-TABS-2 ✅ Navegação por 3 abas em 5 páginas (13 total)
  └── /ebpf, /sre, /opnsense, /nextcloud, /ebpf-avancado
      (100% de cobertura das páginas extensas do workshop)

Sprint UX-TABS-3 ✅ Navegação por 3 abas em 19 páginas restantes (100% cobertura)
  ├── Páginas max-w-4xl/5xl single-column (11):
  │   /docker, /docker-compose, /wan-nat, /wireguard, /audit-logs, /ssh-2fa,
  │   /fail2ban, /hardening, /proxmox, /laboratorio, /traefik, /openvpn, /apache, /samba
  ├── Páginas grid com sidebar (6):
  │   /port-knocking, /lan-proxy, /dnat, /nginx-ssl, /pivoteamento, /ssh-proxy
  ├── Padrão de abas (single-column): tab nav inline, content wrapped com {activeTab === 'x' && (<>...</>)}
  ├── Padrão de abas (grid): tab nav before grid, main column <div> com conditional wrappers,
  │   sidebar sempre visível, conteúdo fora do grid wrapped em {activeTab === 'exercicios' && (<>...</>)}
  ├── Fix openvpn: closing </>)} antes de <ModuleNav> que estava ausente
  └── 100% de cobertura de abas em TODAS as páginas extensas · lint ✓ · 57 testes · 71/71 build ✓

Sprint QUIZ-v2 ✅ 3 melhorias de UX no quiz (app/quiz/page.tsx)
  ├── (1) Explicação inline: ao errar, q.explanation aparece no chip de feedback
  │   (ícone BookOpen, border-t separador, text-xs text-text-2)
  ├── (2) Histórico de sessões: últimas 3 sessões em workshop-quiz-history
  │   (date/score/total/percentage/trail/sessionSize), mini-cards na tela inicial,
  │   cor ok/warn/err por percentagem, carregados via safeReadLS helper
  ├── (3) Revisão de erros: questões erradas mapeadas para índices em QUIZ_QUESTIONS,
  │   salvas em workshop-quiz-wrong-ids; botão "Revisar X erros" na tela inicial e resultado
  │   (RotateCcw icon, border-warn); handleReview() com useCallback filtra e inicia sessão
  ├── finishQuiz convertido para useCallback; imports: BookOpen, History, RotateCcw
  └── lint ✓ · 57 testes ✓ (zero mudanças em constantes de badge/checkpoint)

Sprint Advanced-E2E ✅ Spec E2E para trilha avançada (e2e/11-advanced-trail.spec.ts)
  ├── 6 casos espelhando 10-fundamentos-trail.spec.ts:
  │   índice /avancados (3 fases), rastreamento visita /dhcp,
  │   badge advanced-master seeded no dashboard,
  │   ModuleNav /dhcp (sem Anterior, Próximo→/samba),
  │   ModuleNav /ebpf-avancado (Anterior→/nextcloud, sem Próximo),
  │   desbloqueio badge via seed 19 paths visitados
  ├── Fix 10-fundamentos-trail.spec.ts: contador 1/154 → 1/160 (checklistItemsCount)
  ├── tsconfig.json: .next/dev adicionado ao exclude (fix erro TS Turbopack dev server)
  │   .next/dev/types/**/*.ts removido do include para evitar TS1434/TS1128
  └── Total E2E: 11 specs (10 spec files + fixtures) · lint ✓ · 57 testes ✓

Sprint CHEAT-v4 ✅ Cheat Sheet Interativo (app/cheat-sheet/page.tsx)
  ├── (1) Filtro de trilha: 4 botões Todas/Firewall/Fundamentos/Avançados (activeTrail state)
  │   cmdTrail() module-level mapeia categorias:
  │     AVANCADOS: Docker/Ansible/K8s/Terraform/CI-CD/Monitoring/eBPF/SRE/ServiceMesh/Traefik/Suricata
  │     FUNDAMENTOS: DHCP/Samba/Apache/LDAP/Pi-hole/SSH/systemd/Logs
  │     resto = firewall
  │   filtros de trilha e camada OSI são independentes (AND logic)
  ├── (2) Contador: pill "X / 97 comandos" atualizado em tempo real
  ├── (3) Scroll spy: IntersectionObserver (rootMargin -20%/-60%) monitora
  │   5 seções de workflow (wf-docker/wf-ansible/wf-kubectl/wf-terraform/wf-cicd)
  │   activeWorkflowSection state atualizado conforme seção visível
  ├── (4) Mini-TOC: nav com 5 links de âncora no topo da aba Workflows
  │   link ativo com bg-accent; smooth scroll via scrollIntoView
  │   cada seção com scroll-mt-20 para offset do sticky header
  ├── Fix: ID duplicado nft-list renomeado para nft-list-fw (categoria Firewall)
  └── lint ✓ · 57 testes ✓ · zero mudanças em constantes de badge/checkpoint

❌ Backend/Supabase — DESCARTADO
   localStorage atende ao escopo educacional.
   Portabilidade via export/import JSON implementada (Sprint J).

⏸️ Service Worker offline — AVALIAR DEPOIS
   Complexidade desproporcional ao caso de uso.
```

---
[<- Voltar ao indice](README.md)
