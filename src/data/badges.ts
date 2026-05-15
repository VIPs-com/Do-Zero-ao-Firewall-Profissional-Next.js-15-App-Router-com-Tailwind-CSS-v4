/**
 * Definições estáticas dos badges do Workshop Linux.
 *
 * Extraído de BadgeContext.tsx (Sprint CONSOLIDACAO) para separar
 * dados estáticos da lógica de Provider React.
 *
 * Consumers:
 *  - src/context/BadgeContext.tsx  (lógica de desbloqueio)
 *  - app/dashboard/page.tsx        (galeria de badges)
 *  - src/components/ui/MilestoneCelebration.tsx (modal de celebração)
 */

export type BadgeId =
  | 'quiz-beginner' | 'quiz-expert' | 'quiz-master'
  | 'explorer' | 'deep-diver' | 'night-owl' | 'searcher' | 'topology-pro'
  | 'firewall-master' | 'dns-master' | 'ssl-master' | 'vpn-master'
  | 'proxy-master' | 'knocking-master' | 'certificado' | 'linux-ninja' | 'pivoting-master' | 'defensor-topologia'
  | 'time-traveler'
  | 'wireguard-master'
  | 'fail2ban-master'
  | 'proxmox-pioneer'
  | 'resgate-gold'
  | 'sigma-master'
  | 'explorador-mundos'
  | 'course-master'
  | 'hardening-master'
  | 'docker-master'
  | 'fundamentos-master'
  | 'ssh-2fa-master'
  | 'compose-master'
  | 'pacotes-master'
  | 'boot-master'
  | 'cmd-avancados-master'
  | 'rsyslog-master'
  | 'dhcp-master'
  | 'samba-master'
  | 'apache-master'
  | 'openvpn-master'
  | 'traefik-master'
  | 'ldap-master'
  | 'pihole-master'
  | 'ansible-master'
  | 'monitoring-master'
  | 'k8s-master'
  | 'terraform-master'
  | 'suricata-master'
  | 'ebpf-master'
  | 'service-mesh-master'
  | 'sre-master'
  | 'cicd-master'
  | 'opnsense-master'
  | 'nextcloud-master'
  | 'ebpf-avancado-master'
  | 'ssh-proxy-master'
  | 'advanced-master'
  | 'srs-streak-7'
  | 'nfs-master';

export interface BadgeDef {
  icon: string;
  title: string;
  desc: string;
}

export const BADGE_DEFS: Record<BadgeId, BadgeDef> = {
  'quiz-beginner':      { icon: '🥉', title: 'Iniciante',          desc: 'Completou o Quiz pela primeira vez' },
  'quiz-expert':        { icon: '🥇', title: 'Expert',             desc: 'Score ≥ 80% no Quiz' },
  'quiz-master':        { icon: '🏆', title: 'Mestre',             desc: 'Score 100% no Quiz' },
  'explorer':           { icon: '🗺️', title: 'Explorador',         desc: 'Visitou 5+ páginas diferentes' },
  'deep-diver':         { icon: '🤿', title: 'Mergulhador',        desc: 'Explorou 50+ páginas de conteúdo do workshop (63 disponíveis)' },
  'night-owl':          { icon: '🦉', title: 'Coruja Noturna',     desc: 'Ativou o Dark Mode' },
  'searcher':           { icon: '🔍', title: 'Investigador',       desc: 'Usou a busca global' },
  'topology-pro':       { icon: '🖧', title: 'Topólogo',           desc: 'Clicou em 5+ elementos da topologia' },
  'firewall-master':    { icon: '🛡️', title: 'Firewall Master',    desc: 'Configurou todas as regras de firewall' },
  'dns-master':         { icon: '📖', title: 'DNS Master',         desc: 'Configurou zonas direta e reversa no BIND9' },
  'ssl-master':         { icon: '🔒', title: 'SSL Master',         desc: 'Gerou certificado e configurou HTTPS no Nginx' },
  'vpn-master':         { icon: '🔒', title: 'VPN Architect',      desc: 'Configurou uma VPN IPSec com StrongSwan' },
  'proxy-master':       { icon: '🚪', title: 'Proxy Master',       desc: 'Configurou Squid com ACLs e dstdomain' },
  'knocking-master':    { icon: '🔑', title: 'Knocking Master',    desc: 'Configurou Port Knocking no firewall' },
  'certificado':        { icon: '🎓', title: 'Graduado',           desc: 'Gerou o certificado de conclusão' },
  'linux-ninja':        { icon: '🥷', title: 'Linux Ninja',        desc: 'Completou todos os desafios do workshop' },
  'pivoting-master':    { icon: '💀', title: 'Pivoting Master',    desc: 'Entendeu os riscos de pivoteamento na DMZ' },
  'defensor-topologia': { icon: '🛡️', title: 'Defensor da Topologia', desc: 'Identificou todos os riscos críticos na rede' },
  'time-traveler':      { icon: '⏳', title: 'Viajante do Tempo',     desc: 'Importou um snapshot de progresso' },
  'wireguard-master':   { icon: '🔐', title: 'WireGuard Master',      desc: 'Configurou um túnel WireGuard do zero' },
  'fail2ban-master':    { icon: '🚫', title: 'Fail2ban Master',       desc: 'Protegeu serviços com Fail2ban' },
  'proxmox-pioneer':    { icon: '🖥️', title: 'Proxmox Pioneer',      desc: 'Configurou um laboratório completo no Proxmox VE' },
  'resgate-gold':       { icon: '🏅', title: 'Agente de Resgate',     desc: 'Explorou os ambientes de laboratório avançados' },
  'sigma-master':       { icon: '🔬', title: 'SIGMA Master',          desc: 'Dominou forense de rede, anatomia do NAT e internos do kernel' },
  'explorador-mundos':  { icon: '🧭', title: 'Explorador de Mundos',  desc: 'Completou o Módulo Zero e dominou a transição Windows → Linux' },
  'course-master':      { icon: '🎯', title: 'Mestre do Curso',       desc: 'Visitou todos os 25 módulos do curso em sequência' },
  'hardening-master':   { icon: '🔐', title: 'Hardening Master',      desc: 'SSH, sysctl e AppArmor configurados corretamente' },
  'docker-master':      { icon: '🐳', title: 'Docker Master',         desc: 'Redes Docker, bridge customizada e iptables integrado' },
  'fundamentos-master': { icon: '🐧', title: 'Fundamentos Master',    desc: 'Completou todos os 15 módulos da Trilha Fundamentos Linux' },
  'ssh-2fa-master':     { icon: '📱', title: 'SSH 2FA Master',        desc: 'SSH protegido com autenticação de dois fatores (TOTP)' },
  'compose-master':     { icon: '🐙', title: 'Compose Master',        desc: 'Orquestrou uma stack completa com Docker Compose — redes, volumes e secrets' },
  'pacotes-master':     { icon: '📦', title: 'Package Master',        desc: 'Dominou apt, dpkg, snap e pip — instalação e gestão de software no Linux' },
  'boot-master':        { icon: '🖥️', title: 'Boot Master',           desc: 'Dominou BIOS/UEFI, GRUB2, kernel, initrd e systemd targets — do Power ao prompt' },
  'cmd-avancados-master': { icon: '🔧', title: 'Cmd Avançados Master', desc: 'Dominou sed, dd, nc, links e compactação — a caixa de ferramentas do SysAdmin profissional' },
  'rsyslog-master':       { icon: '📡', title: 'Rsyslog Master',       desc: 'Configurou logs locais, servidor central de logs e logrotate em produção' },
  'dhcp-master':          { icon: '🌐', title: 'DHCP Master',          desc: 'Configurou isc-dhcp-server com subnet, reservas por MAC e monitoramento de leases' },
  'samba-master':         { icon: '🗂️', title: 'Samba Master',         desc: 'Configurou compartilhamento de arquivos Linux↔Windows com Samba e smbpasswd' },
  'apache-master':        { icon: '🌍', title: 'Apache Master',        desc: 'Configurou VirtualHosts, SSL e proxy reverso no Apache — o servidor web mais usado do mundo' },
  'openvpn-master':       { icon: '🔒', title: 'OpenVPN Master',       desc: 'Criou PKI com Easy-RSA, configurou servidor OpenVPN e conectou cliente com arquivo .ovpn' },
  'traefik-master':       { icon: '🔀', title: 'Traefik Master',       desc: 'Proxy reverso cloud-native com HTTPS automático via ACME e middlewares declarativos via labels Docker' },
  'ldap-master':          { icon: '👥', title: 'LDAP Master',          desc: 'Diretório centralizado com OpenLDAP — usuários e grupos unificados para SSH, Samba e apps' },
  'pihole-master':        { icon: '🕳️', title: 'Pi-hole Master',       desc: 'DNS sinkhole protegendo toda a rede — anúncios e rastreadores bloqueados antes de carregar' },
  'ansible-master':       { icon: '⚙️', title: 'Ansible Master',       desc: 'Infraestrutura como Código — playbooks, roles e Vault automatizando dezenas de servidores via SSH' },
  'monitoring-master':    { icon: '📊', title: 'Monitoring Master',    desc: 'Observabilidade real: Prometheus coletando métricas, Grafana com dashboards e Alertmanager notificando incidentes' },
  'k8s-master':           { icon: '☸️', title: 'Kubernetes Master',    desc: 'Orquestração de containers com K3s — Pods, Deployments, Services, NetworkPolicy e Ingress dominados' },
  'terraform-master':     { icon: '🏗️', title: 'Terraform Master',     desc: 'Infraestrutura declarativa com HCL — providers, state, módulos e workspaces dominados do init ao apply' },
  'suricata-master':      { icon: '🛡️', title: 'Suricata Master',      desc: 'IDS/IPS configurado — regras customizadas, EVE JSON estruturado e modo IPS inline com NFQUEUE dominados' },
  'ebpf-master':          { icon: '⚡', title: 'eBPF Master',           desc: 'Programas eBPF no kernel — BCC tools, bpftrace, XDP e Cilium dominados para observabilidade e segurança em tempo real' },
  'service-mesh-master':  { icon: '🕸️', title: 'Service Mesh Master',  desc: 'Istio dominado — mTLS automático, VirtualService, DestinationRule, circuit breaker e observabilidade com Kiali/Jaeger sem alterar a aplicação' },
  'sre-master':           { icon: '🎯', title: 'SRE Master',            desc: 'Confiabilidade como engenharia — SLIs/SLOs definidos, error budget calculado, alertas de burn rate e postmortem blameless estruturado' },
  'cicd-master':          { icon: '🚀', title: 'CI/CD Master',          desc: 'Pipeline automatizado do zero — lint/test/build em paralelo, Docker push, deploy com environments e self-hosted runner configurado' },
  'opnsense-master':      { icon: '🔥', title: 'OPNsense Master',       desc: 'Firewall enterprise dominado — regras via GUI, Port Forward, VPN (WireGuard/OpenVPN) e IDS/IPS com Suricata integrado' },
  'nextcloud-master':       { icon: '☁️', title: 'Nextcloud Master',        desc: 'Nuvem pessoal self-hosted operacional — Docker Compose com MariaDB+Redis, HTTPS via Traefik, apps CalDAV/CardDAV e backup automatizado' },
  'ebpf-avancado-master':   { icon: '🧬', title: 'eBPF Avançado Master',    desc: 'Cilium CNI substituindo kube-proxy, Hubble para observabilidade de fluxos L7, CiliumNetworkPolicy DNS/HTTP e Tetragon detectando anomalias runtime' },
  'ssh-proxy-master':       { icon: '🚇', title: 'SSH Tunnel Master',       desc: 'Dominou SSH como proxy SOCKS5 (-D), port forwarding local/remoto (-L/-R) e Jump Hosts para acesso seguro a redes privadas' },
  'advanced-master':        { icon: '🌐', title: 'Advanced Master',         desc: 'Explorou todos os 19 módulos avançados — Servidores (v3.0), Infraestrutura (v4.0) e Cloud & Platform Engineering (v5.0)' },
  'srs-streak-7':           { icon: '🔥', title: 'Streak 7 Dias',           desc: '7 dias consecutivos de Treinamento Tático — a repetição espaçada funciona!' },
  'nfs-master':             { icon: '🗂️', title: 'NFS Master',             desc: 'Configurou servidor NFS com /etc/exports, montou cliente e configurou /etc/fstab com opções seguras' },
};
