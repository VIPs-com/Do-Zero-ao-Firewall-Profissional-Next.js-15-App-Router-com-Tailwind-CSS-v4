/**
 * Dados estáticos da página /topicos.
 *
 * Extraído de app/topicos/page.tsx (Sprint CONSOLIDACAO) para separar
 * dados de conteúdo da lógica de componente React.
 */

export type TrailTab = 'firewall' | 'fundamentos' | 'avancados';

export interface Topic {
  id: string;
  num: string;
  title: string;
  layer: string;
  layerClass: string;
  href: string;
  group: string;
}

export interface ModuleMeta {
  label: string;
  icon: string;
  trail: TrailTab;
}

export const TOPICS: Topic[] = [
  // ── LAN, DNS & Proxy ─────────────────────────────────────────────────────────
  { id: '01', num: '01', title: 'Como o cliente da LAN acessa o Web Server e o DNS? Configuração do proxy Squid no navegador.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#cliente-lan', group: 'LAN, DNS & Proxy' },
  { id: '07', num: '07', title: 'Fluxo completo de navegação do cliente via proxy Squid — do navegador até a internet.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#fluxo-squid', group: 'LAN, DNS & Proxy' },
  { id: '08', num: '08', title: 'Squid: dstdomain vs url_regex. Ordem correta das regras http_access e boas práticas.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#dstdomain', group: 'LAN, DNS & Proxy' },

  // ── WAN, NAT & ESTABLISHED ───────────────────────────────────────────────────
  { id: '02', num: '02', title: 'Como o tráfego da internet chega ao firewall? WAN, IP público e o papel do NAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#wan-nat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '09', num: '09', title: 'SNAT: como o IP privado do cliente vira IP público do Firewall. SNAT vs MASQUERADE.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#snat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '10', num: '10', title: 'Como a resposta da internet volta para o cliente interno via ESTABLISHED e conntrack.', layer: 'Camada 5 · Sessão', layerClass: 'l5', href: '/wan-nat#established', group: 'WAN, NAT & ESTABLISHED' },

  // ── Funções do Firewall ───────────────────────────────────────────────────────
  { id: '03', num: '03', title: 'Todas as funções do Firewall: iptables, NAT, SNAT, DNAT, ip_forward, Port Knocking e Squid.', layer: 'Camadas 3 e 4 · Rede e Transporte', layerClass: 'l4', href: '/wan-nat', group: 'Funções do Firewall' },

  // ── DNS com BIND9 ─────────────────────────────────────────────────────────────
  { id: '04', num: '04', title: 'Como o BIND9 funciona? Registros A, CNAME e PTR. Por que o DNS é a primeira coisa que quebra?', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/dns', group: 'DNS com BIND9' },

  // ── Nginx, SSL & PKI ─────────────────────────────────────────────────────────
  { id: '05', num: '05', title: 'Como o Nginx com SSL funciona? PKI, certificado autoassinado, cadeia de confiança.', layer: 'Camada 6 · Apresentação', layerClass: 'l6', href: '/nginx-ssl', group: 'Nginx, SSL & PKI' },
  { id: '14', num: '14', title: 'Como o Nginx recebe a conexão via DNAT? Ele sabe que passou pelo firewall?', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/nginx-ssl#reverse-proxy', group: 'Nginx, SSL & PKI' },

  // ── DNAT & PREROUTING ─────────────────────────────────────────────────────────
  { id: '11', num: '11', title: 'O que acontece quando alguém da internet acessa o site pelo IP público? Fluxo do DNAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat', group: 'DNAT & PREROUTING' },
  { id: '12', num: '12', title: 'Por que o DNAT fica no PREROUTING? A importância da ordem no roteamento.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat#prerouting', group: 'DNAT & PREROUTING' },
  { id: '13', num: '13', title: 'Por que sem FORWARD o DNAT não funciona? As duas regras obrigatórias juntas.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/dnat#forward', group: 'DNAT & PREROUTING' },

  // ── Port Knocking ─────────────────────────────────────────────────────────────
  { id: '06', num: '06', title: 'Configurando Port Knocking para FTP: batida secreta + DNAT + FORWARD.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#ftp-knock', group: 'Port Knocking' },
  { id: '15', num: '15', title: 'Fluxo do SSH via Port Knocking: como o administrador abre a porta 22.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#fluxo-ssh', group: 'Port Knocking' },
  { id: '16', num: '16', title: 'O arquivo /proc/net/xt_recent: como ver e manipular a lista de IPs autorizados.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#proc-recent', group: 'Port Knocking' },
  { id: '17', num: '17', title: 'Janela de tempo vs conexão ativa: o que acontece se demorar para conectar?', layer: 'Camada 5 · Sessão', layerClass: 'l5', href: '/port-knocking#janela-tempo', group: 'Port Knocking' },
  { id: '18', num: '18', title: 'Por que o Port Knocking deixa o SSH invisível para scanners e bots?', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#invisivel', group: 'Port Knocking' },
  { id: '19', num: '19', title: 'Auditoria forense com syslog: monitorando batidas e correlacionando com logins.', layer: 'Forense · Logs', layerClass: 'l4', href: '/port-knocking#auditoria', group: 'Port Knocking' },

  // ── VPN & IPSec ───────────────────────────────────────────────────────────────
  { id: '20', num: '20', title: 'O que é IPSec? Autenticação, criptografia, integridade e proteção anti-replay.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/vpn-ipsec#ipsec', group: 'VPN & IPSec' },
  { id: '28', num: '28', title: 'Configuração prática de VPN Site-to-Site com StrongSwan e iptables.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/vpn-ipsec#configuracao', group: 'VPN & IPSec' },
  { id: '25', num: '25', title: 'WireGuard: VPN moderna com Curve25519, configuração de servidor e cliente, integração com iptables.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wireguard', group: 'VPN & IPSec' },

  // ── Segurança Avançada ────────────────────────────────────────────────────────
  { id: '26', num: '26', title: 'Fail2ban: proteção contra brute force em SSH e Nginx com jails, filtros regex e ações iptables.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/fail2ban', group: 'Segurança Avançada' },
  { id: '21', num: '21', title: 'Pivoteamento DMZ → LAN: como um invasor usa o Web Server para atacar a rede interna.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/pivoteamento#cenario', group: 'Segurança Avançada' },
  { id: '22', num: '22', title: 'Mitigação de Pivoteamento: regras de FORWARD e isolamento de estado no iptables.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/pivoteamento#mitigacao', group: 'Segurança Avançada' },
  { id: '23', num: '23', title: 'Ataques Avançados: Fragmentação, Timing Attacks e DNS Rebinding na prática.', layer: 'Camadas 3-7 · Multi-layer', layerClass: 'l7', href: '/ataques-avancados', group: 'Segurança Avançada' },
  { id: '24', num: '24', title: 'Análise Forense de Logs: identificando ataques e acessos legítimos no kernel.', layer: 'Forense · Logs', layerClass: 'l4', href: '/audit-logs', group: 'Segurança Avançada' },

  // ── Web Server & PKI ──────────────────────────────────────────────────────────
  { id: '27', num: '27', title: 'Web Server na DMZ: Cadeia de Confiança PKI, certificados autoassinados com OpenSSL e Nginx com HTTPS.', layer: 'Camada 6 · Apresentação', layerClass: 'l6', href: '/web-server', group: 'Web Server & PKI' },
  { id: '27b', num: '27', title: 'Gerando certificados com OpenSSL: chave privada, CSR e certificado autoassinado passo a passo.', layer: 'Camada 6 · Apresentação', layerClass: 'l6', href: '/web-server#certificados', group: 'Web Server & PKI' },

  // ── nftables ──────────────────────────────────────────────────────────────────
  { id: '29', num: '29', title: 'nftables: o sucessor moderno do iptables. Tables, chains, rules e por que migrar agora.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/nftables', group: 'nftables' },
  { id: '30', num: '30', title: 'Sets no nftables: bloqueio eficiente de múltiplos IPs. Tabela de equivalência iptables ↔ nftables.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/nftables#sets', group: 'nftables' },

  // ── Referência ────────────────────────────────────────────────────────────────
  { id: '31', num: '31', title: 'Glossário Hacker: dicionário técnico com termos de redes, segurança, firewall e criptografia.', layer: 'Referência · Consulta', layerClass: 'l7', href: '/glossario', group: 'Referência' },
  { id: '32', num: '32', title: 'Evolução do Laboratório: próximos módulos, roadmap técnico e o caminho para o nível profissional.', layer: 'Sobre o Projeto', layerClass: 'l7', href: '/evolucao', group: 'Referência' },

  // ── Ambientes de Lab ──────────────────────────────────────────────────────────
  { id: '33', num: '33', title: 'VirtualBox vs KVM vs Proxmox: qual ambiente de laboratório usar em cada estágio da carreira?', layer: 'Infraestrutura · Lab', layerClass: 'l3', href: '/laboratorio', group: 'Ambientes de Lab' },
  { id: '34', num: '34', title: 'KVM / libvirt: criar e gerenciar VMs no Linux com virt-install, virsh, snapshots e redes virtuais.', layer: 'Infraestrutura · Lab', layerClass: 'l3', href: '/laboratorio#kvm', group: 'Ambientes de Lab' },
  { id: '35', num: '35', title: 'Proxmox VE: instalação, bridges vmbr, criação das 4 VMs do laboratório e snapshots profissionais.', layer: 'Infraestrutura · Lab', layerClass: 'l3', href: '/proxmox', group: 'Ambientes de Lab' },
  { id: '36', num: '36', title: 'Cluster Proxmox: Live Migration de VMs, Alta Disponibilidade (HA) e storage compartilhado com Ceph.', layer: 'Infraestrutura · Lab', layerClass: 'l3', href: '/proxmox#cluster', group: 'Ambientes de Lab' },
  { id: '37', num: '37', title: 'vzdump e backups agendados: proteja seu lab com backups completos de VMs no Proxmox VE.', layer: 'Infraestrutura · Lab', layerClass: 'l3', href: '/proxmox#backup', group: 'Ambientes de Lab' },

  // ── Sprint SIGMA Fase 2 ───────────────────────────────────────────────────────
  { id: '38', num: '38', title: 'Fluxo do administrador com Port Knocking: ~/entrar.sh, janela de 10s e por que bots nunca descobrem a porta.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#admin-em-acao', group: 'Port Knocking' },
  { id: '39', num: '39', title: 'Auditoria forense do Port Knocking: tail -f com awk, scripts audit-knock e knock-monitor, rotação 90 dias.', layer: 'Forense · Logs', layerClass: 'l4', href: '/audit-logs#forense-knock', group: 'Segurança Avançada' },
  { id: '40', num: '40', title: 'As 5 funções simultâneas do Firewall (Roteador+Filtro+Tradutor+Proxy+Guardião) e a magia do conntrack IDA/VOLTA.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#anatomia-nat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '41', num: '41', title: 'PREROUTING pelo kernel: os 5 hooks do Netfilter, a troca cirúrgica do IP e tcpdump antes e depois do DNAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat#prerouting-kernel', group: 'DNAT & PREROUTING' },
  { id: '42', num: '42', title: 'Fluxo completo de navegação via Squid: timeline t=0ms→t=52ms, HTTP vs HTTPS e os 4 cenários de ACL.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#fluxo-navegacao', group: 'LAN, DNS & Proxy' },

  // ── Sprint W — Windows-to-Linux ───────────────────────────────────────────────
  { id: '43', num: '43', title: 'Terminal do Zero para Windows users: pwd, ls, sudo, Tab autocompletar, Ctrl+Shift+C para copiar.', layer: 'Fundação · Terminal', layerClass: 'l7', href: '/instalacao#terminal-do-zero', group: 'Fundação & Terminal' },
  { id: '44', num: '44', title: 'Mindset SysAdmin: systemctl vs Serviços Windows, journalctl vs Event Viewer, /etc/ vs Program Files.', layer: 'Fundação · Conceitos', layerClass: 'l7', href: '/instalacao#sysadmin-mindset', group: 'Fundação & Terminal' },
  { id: '45', num: '45', title: 'RosettaStone interativa: 25 equivalências Windows → Linux com filtro por categoria — ls, grep, systemctl e mais.', layer: 'Fundação · Conceitos', layerClass: 'l7', href: '/instalacao#rosetta-stone', group: 'Fundação & Terminal' },

  // ── Hardening Linux ───────────────────────────────────────────────────────────
  { id: '46', num: '46', title: 'Hardening Linux: SSH sem senha (Ed25519), sysctl de segurança (SYN cookies, ASLR) e AppArmor enforce para Nginx.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/hardening', group: 'Hardening Linux' },
  { id: '48', num: '48', title: 'SSH com 2FA: TOTP com Google Authenticator, libpam-google-authenticator, PAM config e sshd_config para autenticação de dois fatores.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/ssh-2fa', group: 'Hardening Linux' },

  // ── Docker & Containers ───────────────────────────────────────────────────────
  { id: '47', num: '47', title: 'Docker Networking: bridge, host e none. Como o Docker manipula o iptables automaticamente.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/docker#redes', group: 'Docker & Containers' },
  { id: '47b', num: '47', title: 'Port mapping (-p 8080:80) é DNAT automático: Docker cria regras iptables na chain DOCKER.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/docker#port-mapping', group: 'Docker & Containers' },
  { id: '49', num: '49', title: 'Docker Compose: docker-compose.yml declarativo, redes frontend/backend/internal isoladas, volumes persistentes e stack completa Nginx+App+PostgreSQL.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/docker-compose', group: 'Docker & Containers' },

  // ── Trilha Fundamentos Linux (v2.0) ──────────────────────────────────────────
  { id: 'f01', num: 'F01', title: 'Estrutura do Sistema (FHS): /etc, /var, /usr, /home, /tmp — o mapa do Linux comparado com C:\\Windows\\', layer: 'Fundamentos · Sistema', layerClass: 'l7', href: '/fhs', group: 'Fundamentos Linux' },
  { id: 'f02', num: 'F02', title: 'Comandos Essenciais: ls, cd, cp, mv, rm, grep, find, cat, less e o operador pipe — navegando o terminal.', layer: 'Fundamentos · Terminal', layerClass: 'l7', href: '/comandos', group: 'Fundamentos Linux' },
  { id: 'f03', num: 'F03', title: 'Editores de Texto: nano para edições rápidas, VIM para produção — modos, atalhos e como sair do vim.', layer: 'Fundamentos · Ferramentas', layerClass: 'l7', href: '/editores', group: 'Fundamentos Linux' },
  { id: 'f04', num: 'F04', title: 'Gerenciamento de Processos: ps, top, htop, kill, systemctl — equivalente ao Gerenciador de Tarefas do Windows.', layer: 'Fundamentos · Sistema', layerClass: 'l7', href: '/processos', group: 'Fundamentos Linux' },
  { id: 'f05', num: 'F05', title: 'Permissões e Usuários: chmod, chown, useradd, groups, sudo — controle de acesso e segurança básica.', layer: 'Fundamentos · Segurança', layerClass: 'l7', href: '/permissoes', group: 'Fundamentos Linux' },
  { id: 'f06', num: 'F06', title: 'Discos e Partições: fdisk, lsblk, mount, df, du, dd — gerenciamento de armazenamento e filesystems.', layer: 'Fundamentos · Armazenamento', layerClass: 'l3', href: '/discos', group: 'Fundamentos Linux' },
  { id: 'f07', num: 'F07', title: 'Logs e Monitoramento: journalctl, /var/log/, tail -f, grep — leitura e análise de logs como um SysAdmin.', layer: 'Fundamentos · Diagnóstico', layerClass: 'l7', href: '/logs-basicos', group: 'Fundamentos Linux' },
  { id: 'f08', num: 'F08', title: 'Backup e Restauração: rsync, tar, scp — proteja dados com backups locais, remotos e automatizados.', layer: 'Fundamentos · Administração', layerClass: 'l7', href: '/backup', group: 'Fundamentos Linux' },
  { id: 'f09', num: 'F09', title: 'Shell Script: variáveis, if, for, funções e $() em bash — automatize tarefas de administração de sistemas.', layer: 'Fundamentos · Automação', layerClass: 'l7', href: '/shell-script', group: 'Fundamentos Linux' },
  { id: 'f10', num: 'F10', title: 'Agendamento de Tarefas: crontab, @reboot, systemd timers e at — automatize manutenção periódica do servidor.', layer: 'Fundamentos · Automação', layerClass: 'l7', href: '/cron', group: 'Fundamentos Linux' },
  { id: 'f11', num: 'F11', title: 'Instalação de Programas: apt, dpkg, snap, pip — gerencie repositórios, instale pacotes .deb e use ambientes virtuais Python.', layer: 'Fundamentos · Administração', layerClass: 'l7', href: '/pacotes', group: 'Fundamentos Linux' },
  { id: 'f12', num: 'F12', title: 'Processo de Boot: BIOS/UEFI, GRUB2, kernel, initrd e systemd targets — do botão Power ao prompt de login.', layer: 'Fundamentos · Sistema', layerClass: 'l7', href: '/boot', group: 'Fundamentos Linux' },
  { id: 'f13', num: 'F13', title: 'Comandos Avançados: sed, dd, nc (NetCat), links simbólicos e compactação tar/gzip/zip — a caixa de ferramentas do SysAdmin.', layer: 'Fundamentos · Administração', layerClass: 'l7', href: '/comandos-avancados', group: 'Fundamentos Linux' },
  { id: 'f14', num: 'F14', title: 'Logs Centralizados com Rsyslog: facilities, priorities, servidor central via TCP 514 e logrotate — padrão de produção real.', layer: 'Fundamentos · Administração', layerClass: 'l7', href: '/rsyslog', group: 'Fundamentos Linux' },
  { id: 'f16', num: 'F16', title: 'Gerenciamento de Usuários e Grupos: adduser, usermod, groupadd, /etc/passwd, /etc/group e sudo — ciclo de vida completo da identidade Linux.', layer: 'Fundamentos · Segurança', layerClass: 'l7', href: '/usuarios', group: 'Fundamentos Linux' },
  { id: 'f17', num: 'F17', title: 'Troubleshooting de Rede: ping, ip addr/route, ss -tulpn, dig, curl -v, journalctl — metodologia OSI de baixo para cima para diagnosticar qualquer problema.', layer: 'Fundamentos · Diagnóstico', layerClass: 'l4', href: '/troubleshooting', group: 'Fundamentos Linux' },

  // ── Servidores e Serviços (v3.0) ──────────────────────────────────────────────
  { id: 's01', num: 'S01', title: 'Servidor DHCP: isc-dhcp-server, subnet declaration, range, reservas por MAC e monitoramento de leases — distribua IPs na LAN automaticamente.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dhcp', group: 'Servidores e Serviços' },
  { id: 's02', num: 'S02', title: 'Samba: smb.conf, shares públicos e privados, smbpasswd, acesso via Windows Explorer e mount.cifs — ponte Linux↔Windows na mesma rede.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/samba', group: 'Servidores e Serviços' },
  { id: 's03', num: 'S03', title: 'Apache Web Server: VirtualHosts por nome, módulos essenciais (ssl, rewrite, proxy), HTTPS com Certbot e proxy reverso — compare com Nginx.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/apache', group: 'Servidores e Serviços' },
  { id: 's04', num: 'S04', title: 'OpenVPN: PKI com Easy-RSA, certificados CA/servidor/cliente, server.conf, client.ovpn inline e iptables NAT+FORWARD — VPN SSL corporativa completa.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/openvpn', group: 'Servidores e Serviços' },
  { id: 's05', num: 'S05', title: 'Traefik Proxy Reverso: labels Docker, HTTPS automático via ACME, middlewares (redirect, basicauth, rate-limit) e dashboard integrado — cloud-native.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/traefik', group: 'Servidores e Serviços' },
  { id: 's06', num: 'S06', title: 'LDAP / OpenLDAP: DIT, OUs, usuários posixAccount, ldapadd/ldapsearch, LDAPS com TLS e PAM — autenticação única para SSH, Samba e apps.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/ldap', group: 'Servidores e Serviços' },
  { id: 's07', num: 'S07', title: 'Pi-hole: DNS sinkhole com blocklists gravity, whitelist/blacklist, integração DHCP, iptables DNS redirect e Unbound resolver local para toda a rede.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/pihole', group: 'Servidores e Serviços' },
  { id: 's08', num: 'S08', title: 'SSH como Proxy SOCKS: ssh -D (SOCKS5 dinâmico), -L port forwarding local, -R remoto, Jump Host com -J, autossh persistente e ~/.ssh/config para produção.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/ssh-proxy', group: 'Servidores e Serviços' },
  { id: 's09', num: 'S09', title: 'NFS — Network File System: NFSv4 /etc/exports, mount -t nfs4, /etc/fstab com _netdev — compartilhamento de arquivos Linux nativo de alta performance na porta 2049/TCP.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/nfs', group: 'Servidores e Serviços' },
  { id: 's10', num: 'S10', title: 'HAProxy — Load Balancer L4/L7: frontend/backend, algoritmos (roundrobin, leastconn), health checks, terminação SSL, stick-tables e página de estatísticas.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/haproxy', group: 'Servidores e Serviços' },

  // ── Infraestrutura Moderna (v4.0) ─────────────────────────────────────────────
  { id: 'i01', num: 'I01', title: 'Ansible para SysAdmins: inventário, comandos ad-hoc, playbooks YAML com tasks/handlers/templates, roles reutilizáveis, Ansible Galaxy e Vault para segredos.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/ansible', group: 'Infraestrutura Moderna' },
  { id: 'i02', num: 'I02', title: 'Prometheus + Grafana: node_exporter, PromQL (rate/increase/sum), dashboards ID 1860, regras de alerta e Alertmanager com email/Slack — observabilidade real.', layer: 'Infraestrutura · Observabilidade', layerClass: 'l7', href: '/monitoring', group: 'Infraestrutura Moderna' },
  { id: 'i03', num: 'I03', title: 'Kubernetes / K3s: Pod, Deployment, Service, ConfigMap/Secret, Ingress Traefik, NetworkPolicy com Calico e Helm — orquestração de containers do zero.', layer: 'Infraestrutura · Orquestração', layerClass: 'l3', href: '/kubernetes', group: 'Infraestrutura Moderna' },
  { id: 'i04', num: 'I04', title: 'Terraform IaC: HCL declarativo, providers Docker/AWS, init→plan→apply→destroy, state remoto (S3/GitLab), módulos reutilizáveis e workspaces para múltiplos ambientes.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/terraform', group: 'Infraestrutura Moderna' },
  { id: 'i05', num: 'I05', title: 'Suricata IDS/IPS: modo IDS passivo (af-packet) e IPS inline (NFQUEUE), regras customizadas com EVE JSON, Emerging Threats e integração com nftables.', layer: 'Segurança · IDS/IPS', layerClass: 'l4', href: '/suricata', group: 'Infraestrutura Moderna' },
  { id: 'i06', num: 'I06', title: 'eBPF & XDP: BCC tools (execsnoop, tcpconnect, biolatency), bpftrace scripting, filtros XDP de alta performance, Cilium CNI para Kubernetes e Falco para segurança em runtime.', layer: 'Kernel · Observabilidade', layerClass: 'l3', href: '/ebpf', group: 'Infraestrutura Moderna' },
  { id: 'i07', num: 'I07', title: 'Service Mesh com Istio: sidecar Envoy, mTLS automático (SPIFFE/X.509), VirtualService (canary/A-B), DestinationRule (circuit breaker), AuthorizationPolicy e observabilidade com Kiali/Jaeger.', layer: 'Camada 7 · mTLS', layerClass: 'l7', href: '/service-mesh', group: 'Infraestrutura Moderna' },
  { id: 'i09', num: 'I09', title: 'HashiCorp Vault: gestão de segredos e identidades dinâmicas — Unseal (Shamir), Secrets Engines (KV, PKI, Database), políticas HCL e AppRole para autenticação de máquinas.', layer: 'Segurança · Secrets', layerClass: 'l6', href: '/vault', group: 'Infraestrutura Moderna' },
  { id: 'i08', num: 'I08', title: 'SRE & SLOs: SLIs/SLOs com Prometheus (recording rules + burn rate), error budget como ferramenta de decisão, alertas por sintoma, runbooks acionáveis e postmortem blameless.', layer: 'Cultura · Confiabilidade', layerClass: 'l7', href: '/sre', group: 'Infraestrutura Moderna' },

  // ── Cloud & Platform Engineering (v5.0) ───────────────────────────────────────
  { id: 'c01', num: 'C01', title: 'CI/CD com GitHub Actions: lint/test/build em paralelo, Docker build+push ghcr.io, environments com aprovação manual, matrix strategy e self-hosted runner como serviço systemd.', layer: 'DevOps · Automação', layerClass: 'l5', href: '/cicd', group: 'Cloud & Platform Engineering' },
  { id: 'c02', num: 'C02', title: 'OPNsense: firewall enterprise com Web UI — regras por interface (ingress), Aliases, Port Forward (DNAT), VPN WireGuard/OpenVPN wizard, Suricata IDS/IPS integrado e Alta Disponibilidade com CARP.', layer: 'Firewall · Enterprise', layerClass: 'l3', href: '/opnsense', group: 'Cloud & Platform Engineering' },
  { id: 'c03', num: 'C03', title: 'Nextcloud self-hosted: Docker Compose (Nextcloud+MariaDB+Redis+Traefik), CalDAV/CardDAV, integração LDAP, object storage MinIO, backup 3-2-1 automatizado e apps Calendar/Contacts/Talk.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/nextcloud', group: 'Cloud & Platform Engineering' },
  { id: 'c04', num: 'C04', title: 'eBPF Avançado + Cilium: CNI nativo eBPF substituindo kube-proxy e flannel, Hubble para observabilidade de fluxos L7 em tempo real, CiliumNetworkPolicy HTTP path e DNS (toFQDNs), Tetragon TracingPolicy para runtime security.', layer: 'eBPF · CNI', layerClass: 'l3', href: '/ebpf-avancado', group: 'Cloud & Platform Engineering' },
  { id: 'c05', num: 'C05', title: 'Resposta a Incidentes (DFIR): o ciclo NIST SP 800-61 — detecção de comprometimento, contenção sem destruir evidências, preservação volátil, timeline forense, erradicação, recuperação validada e pós-incidente.', layer: 'Segurança · DFIR', layerClass: 'l3', href: '/resposta-incidentes', group: 'Cloud & Platform Engineering' },
  { id: 'c06', num: 'C06', title: 'CrowdSec: IPS colaborativo com threat intelligence — agent + LAPI + bouncers, cenários comportamentais (vs regex estática do Fail2ban), collections do Hub, bouncer nftables e community blocklist.', layer: 'Segurança · IPS', layerClass: 'l3', href: '/crowdsec', group: 'Cloud & Platform Engineering' },
  { id: 'c07', num: 'C07', title: 'Tailscale: VPN mesh zero-port — protocolo WireGuard + NAT traversal (DERP), login SSO identidade-first, MagicDNS, ACLs da tailnet, subnet router e exit node sem abrir uma porta.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/tailscale', group: 'Cloud & Platform Engineering' },
  { id: 'c08', num: 'C08', title: 'Proxmox Backup Server: backup incremental deduplicado de VMs/CTs — datastore, namespaces, jobs agendados, prune + garbage collection, verify de integridade e restore file-level ou VM completa.', layer: 'Infra · Backup', layerClass: 'l6', href: '/proxmox-backup-server', group: 'Cloud & Platform Engineering' },
  { id: 'c09', num: 'C09', title: 'OpenPGP / GPG: chave mestra [C] + subchaves ECC [S][E][A], cifrar/decifrar/assinar/verificar, backup de subchaves, certificado de revogação e commits Git assinados.', layer: 'Segurança · Criptografia', layerClass: 'l6', href: '/gpg', group: 'Cloud & Platform Engineering' },
  { id: 'c10', num: 'C10', title: 'LVM, RAID & Armazenamento: volumes lógicos (PV/VG/LV), redimensionamento a quente, RAID por software com mdadm, snapshots e introdução ao ZFS.', layer: 'Infra · Armazenamento', layerClass: 'l6', href: '/lvm-raid', group: 'Cloud & Platform Engineering' },
  { id: 'c11', num: 'C11', title: 'Banco de Dados: administração de PostgreSQL e MariaDB — instalação, usuários e permissões, backup/restore (pg_dump/mysqldump) e replicação primária-réplica.', layer: 'Infra · Dados', layerClass: 'l7', href: '/banco-de-dados', group: 'Cloud & Platform Engineering' },
  { id: 'c12', num: 'C12', title: 'Servidor de E-mail: Postfix (MTA/SMTP) + Dovecot (IMAP/POP3), autenticação SASL, TLS e anti-spam com SpamAssassin.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/mail-server', group: 'Cloud & Platform Engineering' },
  { id: 'c13', num: 'C13', title: 'Redes Camada 2 & 3: VLANs 802.1Q, agregação de links (bonding/LACP), bridges, IPv6 e roteamento estático e dinâmico (OSPF/BGP com FRR).', layer: 'Camada 2/3 · Rede', layerClass: 'l3', href: '/redes-l2-l3', group: 'Cloud & Platform Engineering' },
  { id: 'c14', num: 'C14', title: 'Alta Disponibilidade: IP virtual flutuante com keepalived/VRRP, clustering com Pacemaker/Corosync, quorum, STONITH/fencing e failover testado.', layer: 'Infra · Resiliência', layerClass: 'l4', href: '/alta-disponibilidade', group: 'Cloud & Platform Engineering' },
  { id: 'c15', num: 'C15', title: 'Cloud Pública (AWS): fundamentos de cloud — IAM (usuários, grupos, políticas), VPC (sub-redes, security groups), EC2 e deploy de aplicações.', layer: 'Cloud · IaaS', layerClass: 'l7', href: '/cloud-publica', group: 'Cloud & Platform Engineering' },
  { id: 'c16', num: 'C16', title: 'Git — Controle de Versão: commits, branches, merge, resolução de conflitos e fluxo colaborativo (feature branch, pull request).', layer: 'Infra · DevOps', layerClass: 'l6', href: '/git', group: 'Cloud & Platform Engineering' },
  { id: 'c17', num: 'C17', title: 'Carreira: preparação para o mercado — certificações (LPIC-1, CompTIA Linux+), portfólio técnico e entrevista de SysAdmin/DevOps.', layer: 'Carreira', layerClass: 'l7', href: '/carreira', group: 'Cloud & Platform Engineering' },
];

// ─── Metadados de módulo (slug → label + ícone + trilha) ─────────────────────
export const MODULE_META: Record<string, ModuleMeta> = {
  // Firewall v1.0
  '/instalacao':        { label: 'Instalação & Lab',           icon: '🛠️', trail: 'firewall' },
  '/wan-nat':           { label: 'WAN & NAT',                  icon: '🌐', trail: 'firewall' },
  '/dns':               { label: 'DNS com BIND9',              icon: '📖', trail: 'firewall' },
  '/nginx-ssl':         { label: 'Nginx & SSL/TLS',            icon: '🔒', trail: 'firewall' },
  '/lan-proxy':         { label: 'LAN & Proxy Squid',          icon: '💻', trail: 'firewall' },
  '/dnat':              { label: 'DNAT & Port Forward',        icon: '🔀', trail: 'firewall' },
  '/port-knocking':     { label: 'Port Knocking',              icon: '🚪', trail: 'firewall' },
  '/vpn-ipsec':         { label: 'VPN IPSec',                  icon: '🔐', trail: 'firewall' },
  '/wireguard':         { label: 'WireGuard VPN',              icon: '🔑', trail: 'firewall' },
  '/nftables':          { label: 'nftables',                   icon: '🔥', trail: 'firewall' },
  '/fail2ban':          { label: 'Fail2ban',                   icon: '🛡️', trail: 'firewall' },
  '/hardening':         { label: 'Hardening Linux',            icon: '🔐', trail: 'firewall' },
  '/ssh-2fa':           { label: 'SSH com 2FA',                icon: '📱', trail: 'firewall' },
  '/docker':            { label: 'Docker Networking',          icon: '🐳', trail: 'firewall' },
  '/docker-compose':    { label: 'Docker Compose',             icon: '🐙', trail: 'firewall' },
  '/audit-logs':        { label: 'Auditoria & Logs',           icon: '🔬', trail: 'firewall' },
  '/ataques-avancados': { label: 'Ataques Avançados',          icon: '⚠️', trail: 'firewall' },
  '/pivoteamento':      { label: 'Pivoteamento',               icon: '🎭', trail: 'firewall' },
  '/laboratorio':       { label: 'Ambientes de Lab',           icon: '🧪', trail: 'firewall' },
  '/proxmox':           { label: 'Proxmox VE',                 icon: '🖥️', trail: 'firewall' },
  '/web-server':        { label: 'Web Server & PKI',           icon: '🌍', trail: 'firewall' },
  '/glossario':         { label: 'Glossário Técnico',          icon: '📚', trail: 'firewall' },
  '/evolucao':          { label: 'Roadmap & Evolução',         icon: '🗺️', trail: 'firewall' },
  // Fundamentos v2.0
  '/fhs':                { label: 'Estrutura do Sistema (FHS)',    icon: '📁', trail: 'fundamentos' },
  '/comandos':           { label: 'Comandos Essenciais',           icon: '⌨️', trail: 'fundamentos' },
  '/editores':           { label: 'Editores de Texto',             icon: '✏️', trail: 'fundamentos' },
  '/processos':          { label: 'Gerenciamento de Processos',    icon: '⚙️', trail: 'fundamentos' },
  '/permissoes':         { label: 'Permissões & Usuários',         icon: '🔑', trail: 'fundamentos' },
  '/discos':             { label: 'Discos & Partições',            icon: '💾', trail: 'fundamentos' },
  '/logs-basicos':       { label: 'Logs e Monitoramento',          icon: '📋', trail: 'fundamentos' },
  '/backup':             { label: 'Backup & Restauração',          icon: '💿', trail: 'fundamentos' },
  '/shell-script':       { label: 'Shell Script',                  icon: '📜', trail: 'fundamentos' },
  '/cron':               { label: 'Cron & Agendamento',            icon: '⏰', trail: 'fundamentos' },
  '/pacotes':            { label: 'Instalação de Programas',       icon: '📦', trail: 'fundamentos' },
  '/boot':               { label: 'Processo de Boot',              icon: '🖥️', trail: 'fundamentos' },
  '/comandos-avancados': { label: 'Comandos Avançados (SED/DD/NC)',icon: '🔧', trail: 'fundamentos' },
  '/rsyslog':            { label: 'Logs Centralizados (Rsyslog)',  icon: '📡', trail: 'fundamentos' },
  '/usuarios':           { label: 'Gerenciamento de Usuários',    icon: '👤', trail: 'fundamentos' },
  '/troubleshooting':    { label: 'Troubleshooting de Rede',      icon: '🔎', trail: 'fundamentos' },
  // Avançados v3.0–v5.0
  '/dhcp':          { label: 'Servidor DHCP',               icon: '🌐', trail: 'avancados' },
  '/samba':         { label: 'Samba File Sharing',          icon: '🗂️', trail: 'avancados' },
  '/apache':        { label: 'Apache Web Server',           icon: '🌍', trail: 'avancados' },
  '/openvpn':       { label: 'OpenVPN',                     icon: '🔒', trail: 'avancados' },
  '/traefik':       { label: 'Traefik Proxy Reverso',       icon: '🔀', trail: 'avancados' },
  '/ldap':          { label: 'LDAP / OpenLDAP',             icon: '👥', trail: 'avancados' },
  '/pihole':        { label: 'Pi-hole DNS Sinkhole',        icon: '🕳️', trail: 'avancados' },
  '/ssh-proxy':     { label: 'SSH como Proxy SOCKS',        icon: '🚇', trail: 'avancados' },
  '/nfs':           { label: 'NFS — Network File System',  icon: '🗂️', trail: 'avancados' },
  '/haproxy':       { label: 'HAProxy — Load Balancer',    icon: '⚖️', trail: 'avancados' },
  '/ansible':       { label: 'Ansible',                     icon: '⚙️', trail: 'avancados' },
  '/monitoring':    { label: 'Prometheus + Grafana',        icon: '📊', trail: 'avancados' },
  '/kubernetes':    { label: 'Kubernetes / K3s',            icon: '☸️', trail: 'avancados' },
  '/terraform':     { label: 'Terraform IaC',               icon: '🏗️', trail: 'avancados' },
  '/suricata':      { label: 'Suricata IDS/IPS',            icon: '🛡️', trail: 'avancados' },
  '/ebpf':          { label: 'eBPF & XDP',                  icon: '⚡', trail: 'avancados' },
  '/service-mesh':  { label: 'Service Mesh (Istio)',        icon: '🕸️', trail: 'avancados' },
  '/sre':           { label: 'SRE & SLOs',                  icon: '🎯', trail: 'avancados' },
  '/vault':         { label: 'HashiCorp Vault',              icon: '🔐', trail: 'avancados' },
  '/cicd':          { label: 'CI/CD GitHub Actions',        icon: '🚀', trail: 'avancados' },
  '/opnsense':      { label: 'OPNsense',                    icon: '🔥', trail: 'avancados' },
  '/nextcloud':     { label: 'Nextcloud',                   icon: '☁️', trail: 'avancados' },
  '/ebpf-avancado': { label: 'eBPF Avançado + Cilium',      icon: '🧬', trail: 'avancados' },
  '/resposta-incidentes': { label: 'Resposta a Incidentes', icon: '🚨', trail: 'avancados' },
  '/crowdsec':              { label: 'CrowdSec — IPS Colaborativo', icon: '🛰️', trail: 'avancados' },
  '/tailscale':             { label: 'Tailscale — VPN Mesh',        icon: '🔗', trail: 'avancados' },
  '/proxmox-backup-server': { label: 'Proxmox Backup Server',       icon: '💾', trail: 'avancados' },
  '/gpg':                   { label: 'OpenPGP / GPG',               icon: '🔑', trail: 'avancados' },
  '/lvm-raid':              { label: 'LVM, RAID & Armazenamento',   icon: '💽', trail: 'avancados' },
  '/banco-de-dados':        { label: 'Banco de Dados',              icon: '🗄️', trail: 'avancados' },
  '/mail-server':           { label: 'Servidor de E-mail',          icon: '📧', trail: 'avancados' },
  '/redes-l2-l3':           { label: 'Redes Camada 2 & 3',          icon: '🌐', trail: 'avancados' },
  '/alta-disponibilidade':  { label: 'Alta Disponibilidade',        icon: '♻️', trail: 'avancados' },
  '/cloud-publica':         { label: 'Cloud Pública (AWS)',         icon: '☁️', trail: 'avancados' },
  '/git':                   { label: 'Git — Controle de Versão',    icon: '🔀', trail: 'avancados' },
  '/carreira':              { label: 'Carreira',                    icon: '🎖️', trail: 'avancados' },
};

// Ordem dos módulos por trilha (segue COURSE_ORDER / FUNDAMENTOS_ORDER / ADVANCED_ORDER)
export const TRAIL_MODULES: Record<TrailTab, string[]> = {
  firewall: [
    '/instalacao', '/wan-nat', '/dns', '/nginx-ssl', '/lan-proxy',
    '/dnat', '/port-knocking', '/vpn-ipsec', '/wireguard', '/nftables',
    '/fail2ban', '/hardening', '/ssh-2fa', '/docker', '/docker-compose',
    '/audit-logs', '/ataques-avancados', '/pivoteamento', '/laboratorio',
    '/proxmox', '/web-server', '/glossario', '/evolucao',
  ],
  fundamentos: [
    '/fhs', '/comandos', '/editores', '/processos', '/permissoes',
    '/usuarios', '/discos', '/logs-basicos', '/backup', '/shell-script', '/cron',
    '/pacotes', '/boot', '/comandos-avancados', '/rsyslog', '/ssh-proxy',
    '/troubleshooting',
  ],
  avancados: [
    '/dhcp', '/samba', '/apache', '/openvpn', '/traefik',
    '/ldap', '/pihole', '/ssh-proxy', '/nfs', '/haproxy', '/ansible', '/monitoring',
    '/kubernetes', '/terraform', '/suricata', '/ebpf', '/service-mesh',
    '/sre', '/vault', '/cicd', '/opnsense', '/nextcloud', '/ebpf-avancado',
    '/crowdsec', '/tailscale', '/proxmox-backup-server', '/gpg',
    '/lvm-raid', '/banco-de-dados', '/mail-server',
    '/redes-l2-l3', '/alta-disponibilidade',
    '/cloud-publica', '/git', '/carreira', '/resposta-incidentes',
  ],
};

// Configuração visual por trilha
export const TRAIL_CONFIG = {
  firewall:    { label: '🔥 Firewall',    color: 'border-accent',      barColor: 'bg-accent',      activeTab: 'border-accent text-accent',         hrefStart: '/instalacao', desc: 'Do zero ao firewall profissional' },
  fundamentos: { label: '🐧 Fundamentos', color: 'border-[#6366f1]',   barColor: 'bg-[#6366f1]',   activeTab: 'border-[#6366f1] text-[#6366f1]',   hrefStart: '/fundamentos', desc: 'Base Linux sólida para SysAdmins' },
  avancados:   { label: '🚀 Avançados',   color: 'border-info',        barColor: 'bg-info',        activeTab: 'border-info text-info',              hrefStart: '/avancados',  desc: 'Servidores, IaC e Cloud' },
} as const;
