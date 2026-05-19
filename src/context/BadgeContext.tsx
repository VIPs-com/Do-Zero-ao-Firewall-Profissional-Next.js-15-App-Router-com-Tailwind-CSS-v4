import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { COURSE_ORDER, ADVANCED_ORDER } from '@/data/courseOrder';
import { BADGE_DEFS } from '@/data/badges';
import type { BadgeId, BadgeDef } from '@/data/badges';
import { runStorageMigrations } from '@/lib/migrations';

// Re-exporta para compatibilidade com imports existentes
export type { BadgeId, BadgeDef };
export { BADGE_DEFS };

// Lazy — o modal de celebração só entra no bundle quando necessário
const MilestoneCelebration = lazy(() =>
  import('@/components/ui/MilestoneCelebration').then(m => ({ default: m.MilestoneCelebration }))
);

export const ALL_CHECKLIST_IDS = [
  'ping-internet', 'dns-resolve', 'dns-interno', 'proxy-funciona', 'proxy-bloqueio',
  'web-server', 'dnat-funciona', 'port-knocking', 'snat-config', 'established-config',
  'forward-config', 'audit-log', 'dns-recursivo', 'dns-reverso', 'dns-firewall',
  'dnat-web', 'dnat-ssh', 'forward-web', 'forward-ssh', 'knocking-timeout',
  'knocking-stealth', 'proxy-log', 'vpn-up', 'vpn-ping', 'vpn-psk', 'pivoting-risk',
  // Sprint I.1 — WireGuard
  'wg-keys', 'wg-server', 'wg-tunnel',
  // Sprint I.2 — Fail2ban
  'f2b-install', 'f2b-sshd', 'f2b-ban-test',
  // Sprint R — Alinhamento com material original (Aula 2)
  'firewall-persistence', 'firewall-service', 'firewall-log',
  // Sprint SIGMA — Ambientes de Laboratório
  'lab-comparison-read', 'lab-kvm-installed', 'lab-kvm-vm',
  // Sprint SIGMA — Proxmox VE
  'proxmox-iso', 'proxmox-bridges', 'proxmox-vms', 'proxmox-snapshot',
  // Sprint SIGMA — Certbot para Produção
  'certbot-installed', 'certbot-certificate', 'certbot-renewal',
  // Sprint SIGMA Fase 2 — /port-knocking
  'knock-admin-flow', 'knock-visibility',
  // Sprint SIGMA Fase 2 — /audit-logs
  'audit-knock-script', 'knock-monitor-script', 'audit-log-rotation',
  // Sprint SIGMA Fase 2 — /wan-nat
  'nat-5-functions', 'nat-conntrack-magic',
  // Sprint SIGMA Fase 2 — /dnat
  'prerouting-deep-dive', 'conntrack-dnat-mapping',
  // Sprint SIGMA Fase 2 — /lan-proxy
  'squid-flow-understood', 'squid-http-vs-https',
  // Sprint W — Windows-to-Linux (/instalacao)
  'terminal-basico', 'sudo-entendido', 'sysadmin-mindset',
  // Sprint W2 — RosettaStone interativa
  'rosetta-stone-explored',
  // Sprint I.3 — Hardening Linux
  'ssh-hardened', 'sysctl-secured', 'apparmor-enabled',
  // Sprint I.4 — Docker Networking
  'docker-installed', 'docker-bridge', 'docker-iptables',
  // Sprint F1-F3 — Trilha Fundamentos Linux (v2.0)
  'fhs-explorado', 'comandos-praticados', 'editores-usados',
  'processos-controlados', 'permissoes-configuradas', 'discos-mapeados',
  'logs-lidos', 'backup-criado', 'script-escrito', 'tarefa-agendada',
  // Sprint I.5 — SSH com 2FA (TOTP)
  'totp-instalado', 'pam-configurado', 'ssh-2fa-testado',
  // Sprint I.6 — Docker Compose
  'compose-instalado', 'compose-stack', 'compose-networks',
  // Sprint F4 — Instalação de Programas (/pacotes)
  'apt-atualizado', 'pacote-instalado', 'repo-adicionado',
  // Sprint F5 — Processo de Boot (/boot)
  'bios-uefi-entendido', 'grub-configurado', 'systemd-targets-explorados',
  // Sprint F6 — Comandos Avançados (/comandos-avancados)
  'sed-dominado', 'links-criados', 'compactacao-praticada',
  // Sprint F7 — Logs Centralizados com Rsyslog (/rsyslog)
  'rsyslog-configurado', 'log-remoto-enviado', 'logrotate-configurado',
  // Sprint I.7 — Servidor DHCP (/dhcp)
  'dhcp-instalado', 'dhcp-subnet', 'dhcp-reserva',
  // Sprint I.8 — Samba File Sharing (/samba)
  'samba-instalado', 'samba-share', 'samba-windows',
  // Sprint I.9 — Apache Web Server (/apache)
  'apache-instalado', 'apache-vhost', 'apache-ssl',
  // Sprint I.10 — OpenVPN (/openvpn)
  'openvpn-instalado', 'openvpn-pki', 'openvpn-cliente',
  // Sprint I.11 — Traefik Proxy Reverso (/traefik)
  'traefik-instalado', 'traefik-https', 'traefik-middleware',
  // Sprint I.12 — LDAP / OpenLDAP (/ldap)
  'ldap-instalado', 'ldap-usuarios', 'ldap-autenticacao',
  // Sprint I.13 — Pi-hole (/pihole)
  'pihole-instalado', 'pihole-dhcp', 'pihole-bloqueando',
  // Sprint I.14 — Ansible (/ansible)
  'ansible-instalado', 'ansible-playbook', 'ansible-roles',
  // Sprint I.15 — Prometheus + Grafana (/monitoring)
  'monitoring-instalado', 'monitoring-dashboard', 'monitoring-alertas',
  // Sprint I.16 — Kubernetes / K3s (/kubernetes)
  'k8s-instalado', 'k8s-deploy', 'k8s-network',
  // Sprint I.17 — Terraform IaC (/terraform)
  'terraform-instalado', 'terraform-plan', 'terraform-modulos',
  // Sprint I.18 — Suricata IDS/IPS (/suricata)
  'suricata-instalado', 'suricata-regras', 'suricata-ips',
  // Sprint I.19 — eBPF & XDP (/ebpf)
  'ebpf-instalado', 'ebpf-trace', 'ebpf-xdp',
  // Sprint I.20 — Service Mesh com Istio (/service-mesh)
  'service-mesh-instalado', 'service-mesh-mtls', 'service-mesh-traffic',
  // Sprint I.21 — SRE & SLOs (/sre)
  'sre-slo-definido', 'sre-error-budget', 'sre-postmortem',
  // Sprint I.22 — CI/CD com GitHub Actions (/cicd)
  'cicd-pipeline', 'cicd-secrets', 'cicd-runner',
  // Sprint I.23 — OPNsense / pfSense (/opnsense)
  'opnsense-instalado', 'opnsense-regras', 'opnsense-vpn',
  // Sprint I.24 — Nextcloud (/nextcloud)
  'nextcloud-instalado', 'nextcloud-ssl', 'nextcloud-apps',
  // Sprint I.25 — eBPF Avançado + Cilium (/ebpf-avancado)
  'cilium-instalado', 'hubble-habilitado', 'tetragon-seguranca',
  // Sprint SSH-PROXY — SSH como Proxy SOCKS (/ssh-proxy)
  'ssh-dinamico', 'ssh-local', 'ssh-jump',
  // Sprint CONTENT-ATAQUES — Ataques Avançados (/ataques-avancados)
  'ataques-recon', 'ataques-syn', 'ataques-arp',
  // Sprint CONTENT-PIVOTING — Pivoteamento DMZ→LAN (/pivoteamento)
  'pivote-forward-drop', 'pivote-egress', 'pivote-honeypot',
  // Sprint NFS — Network File System (/nfs)
  'nfs-instalado', 'nfs-share', 'nfs-cliente',
  // Sprint VAULT — HashiCorp Vault (/vault)
  'vault-instalado', 'vault-politicas', 'vault-dinamico',
  // Sprint FOUNDATION — /usuarios (Gerenciamento de Usuários e Grupos)
  'usuario-criado', 'grupo-criado', 'sudo-configurado',
  // Sprint FOUNDATION — /troubleshooting (Troubleshooting de Rede)
  'trouble-conectividade', 'trouble-porta', 'trouble-logs',
  // Sprint HAPROXY — /haproxy (Load Balancer L4/L7)
  'haproxy-instalado', 'haproxy-backend', 'haproxy-stats',
  // Sprint CÓDICE — /resposta-incidentes (Resposta a Incidentes / DFIR)
  'ir-deteccao', 'ir-contencao', 'ir-pos-incidente',
  // Sprint FORTALEZA — /crowdsec, /tailscale, /proxmox-backup-server
  'crowdsec-instalado', 'crowdsec-cenarios', 'crowdsec-bouncer',
  'tailscale-instalado', 'tailscale-mesh', 'tailscale-subnet',
  'pbs-datastore', 'pbs-job', 'pbs-restore',
  // Sprint GPG — /gpg (OpenPGP / GPG)
  'gpg-chave', 'gpg-cifrar', 'gpg-git',
]; // 190 checkpoints — deve bater com checklistItemsCount no dashboard

/*
 * PÁGINAS DE CONTEÚDO (59 rotas técnicas — threshold). Base do badge 'deep-diver'.
 * Total disponível: 72 rotas (69 módulos + /fundamentos + /avancados + /dashboard).
 * Inclui agora: /glossario, /certificado, /evolucao (corrigido Sprint TRACK-FIX).
 * ClientLayout chama trackPageVisit(pathname) em toda navegação.
 * Atualizar este número e a lista se novas rotas forem adicionadas.
 *
 *  1. /instalacao          12. /hardening
 *  2. /wan-nat             13. /docker
 *  3. /dns                 14. /docker-compose
 *  4. /nginx-ssl           15. /audit-logs
 *  5. /lan-proxy           16. /ataques-avancados
 *  6. /dnat                17. /pivoteamento
 *  7. /port-knocking       18. /laboratorio
 *  8. /vpn-ipsec           19. /proxmox
 *  9. /wireguard           20. /evolucao
 * 10. /nftables            21. /cheat-sheet
 * 11. /fail2ban            22. /glossario
 * 12. /hardening           23. /web-server
 * 13. /ssh-2fa             24. /docker-compose
 * 25. /pacotes
 * 26. /boot
 * 27. /comandos-avancados
 * 28. /rsyslog
 * 29. /dhcp
 * 30. /samba
 * 31. /apache
 * 32. /openvpn
 * 33. /traefik
 * 34. /ldap
 * 35. /pihole
 * 36. /ansible
 * 37. /monitoring
 * 38. /kubernetes
 * 39. /terraform
 * 40. /suricata
 * 41. /ebpf
 * 42. /service-mesh
 * 43. /sre
 * 44. /cicd
 * 45. /opnsense
 * 46. /nextcloud
 * 47. /ebpf-avancado
 * 48. /ssh-proxy
 * 49. /avancados     (índice trilha avançada — Sprint AVANCADOS-INDEX)
 * 50. /nfs           (Sprint NFS — Network File System)
 * 51. /vault         (Sprint VAULT — HashiCorp Vault)
 * + /fundamentos já era parte dos 48 implicitamente; corrigido na contagem 49
 */
export const CONTENT_PAGES_COUNT = 59;

// Badges que merecem celebração especial ao desbloquear
const MILESTONE_BADGES = new Set<BadgeId>([
  'course-master', 'advanced-master', 'quiz-master', 'linux-ninja', 'sigma-master', 'certificado', 'ground-zero',
]);

interface BadgeContextType {
  unlockedBadges: Set<BadgeId>;
  unlockBadge: (id: BadgeId) => void;
  visitedPages: Set<string>;
  trackPageVisit: (page: string) => void;
  topologyClicks: number;
  trackTopologyClick: () => void;
  clickedRisks: Set<string>;
  trackRiskClick: (riskId: string) => void;
  checklist: Record<string, boolean>;
  updateChecklist: (id: string, value: boolean) => void;
  checklistPercentage: number;
  quizScore: number;
  updateQuizScore: (score: number) => void;
  exportProgress: () => void;
  importProgress: (json: string) => { ok: boolean; error?: string };
  // milestoneBadge e clearMilestoneBadge são estado INTERNO do BadgeProvider
  // (usados pelo modal MilestoneCelebration via prop direta, não via contexto).
  // Removidos da API pública para que eventos de milestone não disparem re-renders
  // em todos os 59+ consumers — apenas o Provider re-renderiza ao abrir o modal.
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unlockedBadges, setUnlockedBadges] = useState<Set<BadgeId>>(new Set());
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());
  const [topologyClicks, setTopologyClicks] = useState(0);
  const [clickedRisks, setClickedRisks] = useState<Set<string>>(new Set());
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [lastNotification, setLastNotification] = useState<BadgeId | null>(null);
  const [milestoneBadge, setMilestoneBadge] = useState<BadgeId | null>(null);

  // Hidratação do localStorage — cada read é defensivo:
  // se o JSON estiver corrompido (manipulação manual, versão antiga, etc.),
  // logamos o erro e descartamos a chave em vez de quebrar a árvore React.
  useEffect(() => {
    // Sprint STORAGE-MIGRATIONS — roda as migrações de schema ANTES de ler
    // as chaves, garantindo que dados de alunos antigos estejam no formato atual.
    runStorageMigrations();

    const safeParseArray = <T,>(key: string): T[] | null => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : null;
      } catch (err) {
        console.warn(`[BadgeContext] localStorage corrompido em "${key}", descartando.`, err);
        localStorage.removeItem(key);
        return null;
      }
    };

    const safeParseObject = <T extends object>(key: string): T | null => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as T) : null;
      } catch (err) {
        console.warn(`[BadgeContext] localStorage corrompido em "${key}", descartando.`, err);
        localStorage.removeItem(key);
        return null;
      }
    };

    const safeParseInt = (key: string): number | null => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    };

    const badges    = safeParseArray<BadgeId>('workshop-badges');
    const pages     = safeParseArray<string>('workshop-visited-pages');
    const clicks    = safeParseInt('workshop-topo-clicks');
    const risks     = safeParseArray<string>('workshop-clicked-risks');
    const checklistData = safeParseObject<Record<string, boolean>>('workshop-checklist-v2');
    const score     = safeParseInt('workshop-quiz-score');

    if (badges)        setUnlockedBadges(new Set(badges));
    if (pages)         setVisitedPages(new Set(pages));
    if (clicks !== null) setTopologyClicks(clicks);
    if (risks)         setClickedRisks(new Set(risks));
    if (checklistData) setChecklist(checklistData);
    if (score !== null)  setQuizScore(score);
  }, []);

  useEffect(() => {
    localStorage.setItem('workshop-badges', JSON.stringify(Array.from(unlockedBadges)));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('workshop-visited-pages', JSON.stringify(Array.from(visitedPages)));
    if (visitedPages.size >= 5)                  unlockBadge('explorer');
    if (visitedPages.size >= CONTENT_PAGES_COUNT) unlockBadge('deep-diver');
    if (visitedPages.has('laboratorio') && visitedPages.has('proxmox')) unlockBadge('resgate-gold');
    // Mestre do Curso: todos os 25 módulos de COURSE_ORDER visitados
    const allVisited = COURSE_ORDER.every(m => {
      const slug = m.path.slice(1); // '/wan-nat' → 'wan-nat'
      return visitedPages.has(m.path) || visitedPages.has(slug);
    });
    if (allVisited) unlockBadge('course-master');
    // Advanced Master: todos os 19 módulos avançados (v3.0→v5.0) visitados
    const allAdvancedVisited = ADVANCED_ORDER.every(m => {
      const slug = m.path.slice(1);
      return visitedPages.has(m.path) || visitedPages.has(slug);
    });
    if (allAdvancedVisited) unlockBadge('advanced-master');
  }, [visitedPages]);

  useEffect(() => {
    localStorage.setItem('workshop-topo-clicks', topologyClicks.toString());
    if (topologyClicks >= 5) unlockBadge('topology-pro');
  }, [topologyClicks]);

  useEffect(() => {
    localStorage.setItem('workshop-clicked-risks', JSON.stringify(Array.from(clickedRisks)));
    if (clickedRisks.size >= 3) unlockBadge('defensor-topologia');
  }, [clickedRisks]);

  useEffect(() => {
    localStorage.setItem('workshop-checklist-v2', JSON.stringify(checklist));

    // Badges por checklist — mapeamento direto
    if (checklist['dns-interno'] && checklist['dns-reverso'])       unlockBadge('dns-master');
    if (checklist['web-server']  || checklist['nginx-ssl'])         unlockBadge('ssl-master');
    if (checklist['proxy-funciona'] && checklist['proxy-bloqueio']) unlockBadge('proxy-master');
    if (checklist['port-knocking'])                                  unlockBadge('knocking-master');
    if (checklist['vpn-up'] && checklist['vpn-ping'])               unlockBadge('vpn-master');
    if (checklist['snat-config'] && checklist['established-config']) unlockBadge('firewall-master');
    if (checklist['pivoting-risk'])                                  unlockBadge('pivoting-master');
    if (checklist['wg-keys'] && checklist['wg-server'] && checklist['wg-tunnel']) unlockBadge('wireguard-master');
    if (checklist['f2b-install'] && checklist['f2b-sshd'] && checklist['f2b-ban-test']) unlockBadge('fail2ban-master');
    if (checklist['ssh-hardened'] && checklist['sysctl-secured'] && checklist['apparmor-enabled']) unlockBadge('hardening-master');
    if (checklist['docker-installed'] && checklist['docker-bridge'] && checklist['docker-iptables']) unlockBadge('docker-master');
    if (checklist['totp-instalado'] && checklist['pam-configurado'] && checklist['ssh-2fa-testado']) unlockBadge('ssh-2fa-master');
    if (checklist['compose-instalado'] && checklist['compose-stack'] && checklist['compose-networks']) unlockBadge('compose-master');
    if (checklist['apt-atualizado'] && checklist['pacote-instalado'] && checklist['repo-adicionado']) unlockBadge('pacotes-master');
    if (checklist['bios-uefi-entendido'] && checklist['grub-configurado'] && checklist['systemd-targets-explorados']) unlockBadge('boot-master');
    if (checklist['sed-dominado'] && checklist['links-criados'] && checklist['compactacao-praticada']) unlockBadge('cmd-avancados-master');
    if (checklist['rsyslog-configurado'] && checklist['log-remoto-enviado'] && checklist['logrotate-configurado']) unlockBadge('rsyslog-master');
    if (checklist['dhcp-instalado'] && checklist['dhcp-subnet'] && checklist['dhcp-reserva']) unlockBadge('dhcp-master');
    if (checklist['samba-instalado'] && checklist['samba-share'] && checklist['samba-windows']) unlockBadge('samba-master');
    if (checklist['apache-instalado'] && checklist['apache-vhost'] && checklist['apache-ssl']) unlockBadge('apache-master');
    if (checklist['openvpn-instalado'] && checklist['openvpn-pki'] && checklist['openvpn-cliente']) unlockBadge('openvpn-master');
    if (checklist['traefik-instalado'] && checklist['traefik-https'] && checklist['traefik-middleware']) unlockBadge('traefik-master');
    if (checklist['ldap-instalado'] && checklist['ldap-usuarios'] && checklist['ldap-autenticacao']) unlockBadge('ldap-master');
    if (checklist['pihole-instalado'] && checklist['pihole-dhcp'] && checklist['pihole-bloqueando']) unlockBadge('pihole-master');
    if (checklist['ansible-instalado'] && checklist['ansible-playbook'] && checklist['ansible-roles']) unlockBadge('ansible-master');
    if (checklist['monitoring-instalado'] && checklist['monitoring-dashboard'] && checklist['monitoring-alertas']) unlockBadge('monitoring-master');
    if (checklist['k8s-instalado'] && checklist['k8s-deploy'] && checklist['k8s-network']) unlockBadge('k8s-master');
    if (checklist['terraform-instalado'] && checklist['terraform-plan'] && checklist['terraform-modulos']) unlockBadge('terraform-master');
    if (checklist['suricata-instalado'] && checklist['suricata-regras'] && checklist['suricata-ips']) unlockBadge('suricata-master');
    if (checklist['ebpf-instalado'] && checklist['ebpf-trace'] && checklist['ebpf-xdp']) unlockBadge('ebpf-master');
    if (checklist['service-mesh-instalado'] && checklist['service-mesh-mtls'] && checklist['service-mesh-traffic']) unlockBadge('service-mesh-master');
    if (checklist['sre-slo-definido'] && checklist['sre-error-budget'] && checklist['sre-postmortem']) unlockBadge('sre-master');
    if (checklist['cicd-pipeline'] && checklist['cicd-secrets'] && checklist['cicd-runner']) unlockBadge('cicd-master');
    if (checklist['opnsense-instalado'] && checklist['opnsense-regras'] && checklist['opnsense-vpn']) unlockBadge('opnsense-master');
    if (checklist['nextcloud-instalado'] && checklist['nextcloud-ssl'] && checklist['nextcloud-apps']) unlockBadge('nextcloud-master');
    if (checklist['cilium-instalado'] && checklist['hubble-habilitado'] && checklist['tetragon-seguranca']) unlockBadge('ebpf-avancado-master');
    if (checklist['haproxy-instalado'] && checklist['haproxy-backend'] && checklist['haproxy-stats']) unlockBadge('haproxy-master');
    if (checklist['ir-deteccao'] && checklist['ir-contencao'] && checklist['ir-pos-incidente']) unlockBadge('incident-master');
    if (checklist['crowdsec-instalado'] && checklist['crowdsec-cenarios'] && checklist['crowdsec-bouncer']) unlockBadge('crowdsec-master');
    if (checklist['tailscale-instalado'] && checklist['tailscale-mesh'] && checklist['tailscale-subnet']) unlockBadge('tailscale-master');
    if (checklist['pbs-datastore'] && checklist['pbs-job'] && checklist['pbs-restore']) unlockBadge('pbs-master');
    if (checklist['gpg-chave'] && checklist['gpg-cifrar'] && checklist['gpg-git']) unlockBadge('gpg-master');
    // Sprint SSH-PROXY — SSH como Proxy SOCKS
    if (checklist['ssh-dinamico'] && checklist['ssh-local'] && checklist['ssh-jump']) unlockBadge('ssh-proxy-master');
    if (checklist['proxmox-iso'] && checklist['proxmox-bridges'] && checklist['proxmox-vms'] && checklist['proxmox-snapshot']) unlockBadge('proxmox-pioneer');
    // Sprint SIGMA Fase 2 — todos os 11 checkpoints avançados
    if (
      checklist['knock-admin-flow'] && checklist['knock-visibility'] &&
      checklist['audit-knock-script'] && checklist['knock-monitor-script'] && checklist['audit-log-rotation'] &&
      checklist['nat-5-functions'] && checklist['nat-conntrack-magic'] &&
      checklist['prerouting-deep-dive'] && checklist['conntrack-dnat-mapping'] &&
      checklist['squid-flow-understood'] && checklist['squid-http-vs-https']
    ) unlockBadge('sigma-master');

    // Sprint W2 — Explorador de Mundos (Módulo Zero completo)
    if (
      checklist['terminal-basico'] &&
      checklist['sudo-entendido'] &&
      checklist['sysadmin-mindset'] &&
      checklist['rosetta-stone-explored']
    ) unlockBadge('explorador-mundos');

    // Sprint F1-F7 + SSH-PROXY — Trilha Fundamentos Linux (15 módulos)
    if (
      checklist['fhs-explorado'] && checklist['comandos-praticados'] && checklist['editores-usados'] &&
      checklist['processos-controlados'] && checklist['permissoes-configuradas'] && checklist['discos-mapeados'] &&
      checklist['logs-lidos'] && checklist['backup-criado'] && checklist['script-escrito'] && checklist['tarefa-agendada'] &&
      checklist['apt-atualizado'] && checklist['bios-uefi-entendido'] &&
      checklist['sed-dominado'] && checklist['rsyslog-configurado'] && checklist['ssh-dinamico']
    ) unlockBadge('fundamentos-master');

    // Sprint NFS — Network File System (/nfs)
    if (checklist['nfs-instalado'] && checklist['nfs-share'] && checklist['nfs-cliente']) unlockBadge('nfs-master');

    // Sprint VAULT — HashiCorp Vault
    if (checklist['vault-instalado'] && checklist['vault-politicas'] && checklist['vault-dinamico']) unlockBadge('vault-master');

    // Sprint FOUNDATION — /usuarios
    if (checklist['usuario-criado'] && checklist['grupo-criado'] && checklist['sudo-configurado']) unlockBadge('usuarios-master');

    // Sprint FOUNDATION — /troubleshooting
    if (checklist['trouble-conectividade'] && checklist['trouble-porta'] && checklist['trouble-logs']) unlockBadge('troubleshooting-master');

    // Sprint FOUNDATION — Ground Zero: completou todos os 17 módulos da Trilha Fundamentos
    if (
      checklist['fhs-explorado'] && checklist['comandos-praticados'] && checklist['editores-usados'] &&
      checklist['processos-controlados'] && checklist['permissoes-configuradas'] && checklist['usuario-criado'] &&
      checklist['discos-mapeados'] && checklist['logs-lidos'] && checklist['backup-criado'] &&
      checklist['script-escrito'] && checklist['tarefa-agendada'] && checklist['apt-atualizado'] &&
      checklist['bios-uefi-entendido'] && checklist['sed-dominado'] && checklist['rsyslog-configurado'] &&
      checklist['ssh-dinamico'] && checklist['trouble-conectividade']
    ) unlockBadge('ground-zero');

    // Linux Ninja: desbloqueado com 75% do checklist (floor(190*0.75) = 142).
    if (Object.values(checklist).filter(v => v).length >= 142) unlockBadge('linux-ninja');
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('workshop-quiz-score', quizScore.toString());
    if (quizScore > 0)    unlockBadge('quiz-beginner'); // FIX: qualquer tentativa = badge
    if (quizScore >= 80)  unlockBadge('quiz-expert');
    if (quizScore === 100) unlockBadge('quiz-master');
  }, [quizScore]);

  const clearMilestoneBadge = useCallback(() => setMilestoneBadge(null), []);

  const unlockBadge = useCallback((id: BadgeId) => {
    setUnlockedBadges(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      // Badge normal: toast de 4s
      if (!MILESTONE_BADGES.has(id)) {
        setLastNotification(id);
        setTimeout(() => setLastNotification(null), 4000);
      }
      // Badge de milestone: dispara modal de celebração (não mostra toast simultâneo)
      if (MILESTONE_BADGES.has(id)) {
        setMilestoneBadge(id);
      }
      return next;
    });
  }, []);

  const trackPageVisit = useCallback((page: string) => {
    setVisitedPages(prev => {
      if (prev.has(page)) return prev;
      const next = new Set(prev);
      next.add(page);
      return next;
    });
  }, []);

  const trackTopologyClick = useCallback(() => {
    setTopologyClicks(prev => prev + 1);
  }, []);

  const trackRiskClick = useCallback((riskId: string) => {
    setClickedRisks(prev => {
      if (prev.has(riskId)) return prev;
      const next = new Set(prev);
      next.add(riskId);
      return next;
    });
  }, []);

  const updateChecklist = useCallback((id: string, value: boolean) => {
    setChecklist(prev => ({ ...prev, [id]: value }));
  }, []);

  const checklistPercentage = useMemo(() => {
    const completed = Object.values(checklist).filter(v => v).length;
    return ALL_CHECKLIST_IDS.length > 0
      ? Math.round((completed / ALL_CHECKLIST_IDS.length) * 100)
      : 0;
  }, [checklist]);

  const updateQuizScore = useCallback((score: number) => {
    setQuizScore(score);
  }, []);

  const exportProgress = useCallback(() => {
    const snapshot = {
      version: 1,
      exportedAt: new Date().toISOString(),
      badges: Array.from(unlockedBadges),
      visitedPages: Array.from(visitedPages),
      topologyClicks,
      clickedRisks: Array.from(clickedRisks),
      checklist,
      quizScore,
      theme: localStorage.getItem('workshop-theme'),
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop-linux-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Delay revocation to give the browser time to start the download.
    // Without this, Chromium may cancel the blob download if revoked synchronously.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [unlockedBadges, visitedPages, topologyClicks, clickedRisks, checklist, quizScore]);

  const importProgress = useCallback((json: string): { ok: boolean; error?: string } => {
    try {
      const data = JSON.parse(json) as Record<string, unknown>;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Formato inválido');
      }

      if (Array.isArray(data.badges)) {
        const badges = data.badges as BadgeId[];
        setUnlockedBadges(new Set(badges));
        localStorage.setItem('workshop-badges', JSON.stringify(badges));
      }
      if (Array.isArray(data.visitedPages)) {
        const pages = data.visitedPages as string[];
        setVisitedPages(new Set(pages));
        localStorage.setItem('workshop-visited-pages', JSON.stringify(pages));
      }
      if (typeof data.topologyClicks === 'number') {
        setTopologyClicks(data.topologyClicks);
        localStorage.setItem('workshop-topo-clicks', String(data.topologyClicks));
      }
      if (Array.isArray(data.clickedRisks)) {
        const risks = data.clickedRisks as string[];
        setClickedRisks(new Set(risks));
        localStorage.setItem('workshop-clicked-risks', JSON.stringify(risks));
      }
      if (data.checklist && typeof data.checklist === 'object' && !Array.isArray(data.checklist)) {
        const cl = data.checklist as Record<string, boolean>;
        setChecklist(cl);
        localStorage.setItem('workshop-checklist-v2', JSON.stringify(cl));
      }
      if (typeof data.quizScore === 'number') {
        setQuizScore(data.quizScore);
        localStorage.setItem('workshop-quiz-score', String(data.quizScore));
      }
      if (typeof data.theme === 'string') {
        localStorage.setItem('workshop-theme', data.theme);
      }

      // Concede o badge após importação bem-sucedida
      unlockBadge('time-traveler');

      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  }, [unlockBadge]);

  // Memoizar o valor do contexto — evita re-renders em cascata nos 59+ consumers
  // quando o Provider re-renderiza por causas externas. Todas as funções já são
  // useCallback estáveis; o useMemo só recria o objeto quando um estado realmente muda.
  // milestoneBadge/clearMilestoneBadge ficam de fora — são estado interno do Provider.
  // A abertura do modal não mais causa re-render nos 59+ consumers do contexto.
  const contextValue = useMemo(() => ({
    unlockedBadges,
    unlockBadge,
    visitedPages,
    trackPageVisit,
    topologyClicks,
    trackTopologyClick,
    clickedRisks,
    trackRiskClick,
    checklist,
    updateChecklist,
    checklistPercentage,
    quizScore,
    updateQuizScore,
    exportProgress,
    importProgress,
  }), [
    unlockedBadges, unlockBadge,
    visitedPages, trackPageVisit,
    topologyClicks, trackTopologyClick,
    clickedRisks, trackRiskClick,
    checklist, updateChecklist, checklistPercentage,
    quizScore, updateQuizScore,
    exportProgress, importProgress,
  ]);

  return (
    <BadgeContext.Provider value={contextValue}>
      {children}
      {lastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-bg-2 border border-accent/40 rounded-xl px-5 py-4 shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <span className="text-2xl">{BADGE_DEFS[lastNotification].icon}</span>
          <div>
            <p className="text-xs text-accent font-mono uppercase tracking-wider">Badge desbloqueado!</p>
            <p className="font-bold text-sm">{BADGE_DEFS[lastNotification].title}</p>
            <p className="text-xs text-text-3">{BADGE_DEFS[lastNotification].desc}</p>
          </div>
        </div>
      )}
      {/* Modal de celebração para badges de milestone — lazy (não entra no bundle inicial) */}
      {milestoneBadge && (
        <Suspense fallback={null}>
          <MilestoneCelebration badgeId={milestoneBadge} onClose={clearMilestoneBadge} />
        </Suspense>
      )}
    </BadgeContext.Provider>
  );
};

export const useBadges = () => {
  const ctx = useContext(BadgeContext);
  if (!ctx) throw new Error('useBadges must be used within BadgeProvider');
  return ctx;
};
