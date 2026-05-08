'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

type TrailTab = 'firewall' | 'fundamentos' | 'avancados';

interface Topic {
  id: string;
  num: string;
  title: string;
  layer: string;
  layerClass: string;
  href: string;
  group: string;
}

type IntentMode = 'estudo' | 'incendio';
type SortFn = (a: Topic, b: Topic) => number;

const SORT_STRATEGIES: Record<IntentMode, SortFn> = {
  estudo: () => 0,
  incendio: (a, b) => {
    const rank: Record<string, number> = { l3: 0, l4: 1, l5: 2, l6: 3, l7: 4 };
    return (rank[a.layerClass] ?? 5) - (rank[b.layerClass] ?? 5);
  },
};

const INTENT_LS_KEY = 'workshop-intent-mode' as const;

// Exportar para testabilidade (tree-shaken em produção)
export { SORT_STRATEGIES, INTENT_LS_KEY };

const TOPICS: Topic[] = [
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

  // ── Servidores e Serviços (v3.0) ──────────────────────────────────────────────
  { id: 's01', num: 'S01', title: 'Servidor DHCP: isc-dhcp-server, subnet declaration, range, reservas por MAC e monitoramento de leases — distribua IPs na LAN automaticamente.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dhcp', group: 'Servidores e Serviços' },
  { id: 's02', num: 'S02', title: 'Samba: smb.conf, shares públicos e privados, smbpasswd, acesso via Windows Explorer e mount.cifs — ponte Linux↔Windows na mesma rede.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/samba', group: 'Servidores e Serviços' },
  { id: 's03', num: 'S03', title: 'Apache Web Server: VirtualHosts por nome, módulos essenciais (ssl, rewrite, proxy), HTTPS com Certbot e proxy reverso — compare com Nginx.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/apache', group: 'Servidores e Serviços' },
  { id: 's04', num: 'S04', title: 'OpenVPN: PKI com Easy-RSA, certificados CA/servidor/cliente, server.conf, client.ovpn inline e iptables NAT+FORWARD — VPN SSL corporativa completa.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/openvpn', group: 'Servidores e Serviços' },
  { id: 's05', num: 'S05', title: 'Traefik Proxy Reverso: labels Docker, HTTPS automático via ACME, middlewares (redirect, basicauth, rate-limit) e dashboard integrado — cloud-native.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/traefik', group: 'Servidores e Serviços' },
  { id: 's06', num: 'S06', title: 'LDAP / OpenLDAP: DIT, OUs, usuários posixAccount, ldapadd/ldapsearch, LDAPS com TLS e PAM — autenticação única para SSH, Samba e apps.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/ldap', group: 'Servidores e Serviços' },
  { id: 's07', num: 'S07', title: 'Pi-hole: DNS sinkhole com blocklists gravity, whitelist/blacklist, integração DHCP, iptables DNS redirect e Unbound resolver local para toda a rede.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/pihole', group: 'Servidores e Serviços' },
  { id: 's08', num: 'S08', title: 'SSH como Proxy SOCKS: ssh -D (SOCKS5 dinâmico), -L port forwarding local, -R remoto, Jump Host com -J, autossh persistente e ~/.ssh/config para produção.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/ssh-proxy', group: 'Servidores e Serviços' },

  // ── Infraestrutura Moderna (v4.0) ─────────────────────────────────────────────
  { id: 'i01', num: 'I01', title: 'Ansible para SysAdmins: inventário, comandos ad-hoc, playbooks YAML com tasks/handlers/templates, roles reutilizáveis, Ansible Galaxy e Vault para segredos.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/ansible', group: 'Infraestrutura Moderna' },
  { id: 'i02', num: 'I02', title: 'Prometheus + Grafana: node_exporter, PromQL (rate/increase/sum), dashboards ID 1860, regras de alerta e Alertmanager com email/Slack — observabilidade real.', layer: 'Infraestrutura · Observabilidade', layerClass: 'l7', href: '/monitoring', group: 'Infraestrutura Moderna' },
  { id: 'i03', num: 'I03', title: 'Kubernetes / K3s: Pod, Deployment, Service, ConfigMap/Secret, Ingress Traefik, NetworkPolicy com Calico e Helm — orquestração de containers do zero.', layer: 'Infraestrutura · Orquestração', layerClass: 'l3', href: '/kubernetes', group: 'Infraestrutura Moderna' },
  { id: 'i04', num: 'I04', title: 'Terraform IaC: HCL declarativo, providers Docker/AWS, init→plan→apply→destroy, state remoto (S3/GitLab), módulos reutilizáveis e workspaces para múltiplos ambientes.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/terraform', group: 'Infraestrutura Moderna' },
  { id: 'i05', num: 'I05', title: 'Suricata IDS/IPS: modo IDS passivo (af-packet) e IPS inline (NFQUEUE), regras customizadas com EVE JSON, Emerging Threats e integração com nftables.', layer: 'Segurança · IDS/IPS', layerClass: 'l4', href: '/suricata', group: 'Infraestrutura Moderna' },
  { id: 'i06', num: 'I06', title: 'eBPF & XDP: BCC tools (execsnoop, tcpconnect, biolatency), bpftrace scripting, filtros XDP de alta performance, Cilium CNI para Kubernetes e Falco para segurança em runtime.', layer: 'Kernel · Observabilidade', layerClass: 'l3', href: '/ebpf', group: 'Infraestrutura Moderna' },
  { id: 'i07', num: 'I07', title: 'Service Mesh com Istio: sidecar Envoy, mTLS automático (SPIFFE/X.509), VirtualService (canary/A-B), DestinationRule (circuit breaker), AuthorizationPolicy e observabilidade com Kiali/Jaeger.', layer: 'Camada 7 · mTLS', layerClass: 'l7', href: '/service-mesh', group: 'Infraestrutura Moderna' },
  { id: 'i08', num: 'I08', title: 'SRE & SLOs: SLIs/SLOs com Prometheus (recording rules + burn rate), error budget como ferramenta de decisão, alertas por sintoma, runbooks acionáveis e postmortem blameless.', layer: 'Cultura · Confiabilidade', layerClass: 'l7', href: '/sre', group: 'Infraestrutura Moderna' },

  // ── Cloud & Platform Engineering (v5.0) ───────────────────────────────────────
  { id: 'c01', num: 'C01', title: 'CI/CD com GitHub Actions: lint/test/build em paralelo, Docker build+push ghcr.io, environments com aprovação manual, matrix strategy e self-hosted runner como serviço systemd.', layer: 'DevOps · Automação', layerClass: 'l5', href: '/cicd', group: 'Cloud & Platform Engineering' },
  { id: 'c02', num: 'C02', title: 'OPNsense: firewall enterprise com Web UI — regras por interface (ingress), Aliases, Port Forward (DNAT), VPN WireGuard/OpenVPN wizard, Suricata IDS/IPS integrado e Alta Disponibilidade com CARP.', layer: 'Firewall · Enterprise', layerClass: 'l3', href: '/opnsense', group: 'Cloud & Platform Engineering' },
  { id: 'c03', num: 'C03', title: 'Nextcloud self-hosted: Docker Compose (Nextcloud+MariaDB+Redis+Traefik), CalDAV/CardDAV, integração LDAP, object storage MinIO, backup 3-2-1 automatizado e apps Calendar/Contacts/Talk.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/nextcloud', group: 'Cloud & Platform Engineering' },
  { id: 'c04', num: 'C04', title: 'eBPF Avançado + Cilium: CNI nativo eBPF substituindo kube-proxy e flannel, Hubble para observabilidade de fluxos L7 em tempo real, CiliumNetworkPolicy HTTP path e DNS (toFQDNs), Tetragon TracingPolicy para runtime security.', layer: 'eBPF · CNI', layerClass: 'l3', href: '/ebpf-avancado', group: 'Cloud & Platform Engineering' },
];

// ─── Metadados de módulo (slug → label + ícone + trilha) ─────────────────────
interface ModuleMeta { label: string; icon: string; trail: TrailTab }

const MODULE_META: Record<string, ModuleMeta> = {
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
  // Avançados v3.0–v5.0
  '/dhcp':          { label: 'Servidor DHCP',               icon: '🌐', trail: 'avancados' },
  '/samba':         { label: 'Samba File Sharing',          icon: '🗂️', trail: 'avancados' },
  '/apache':        { label: 'Apache Web Server',           icon: '🌍', trail: 'avancados' },
  '/openvpn':       { label: 'OpenVPN',                     icon: '🔒', trail: 'avancados' },
  '/traefik':       { label: 'Traefik Proxy Reverso',       icon: '🔀', trail: 'avancados' },
  '/ldap':          { label: 'LDAP / OpenLDAP',             icon: '👥', trail: 'avancados' },
  '/pihole':        { label: 'Pi-hole DNS Sinkhole',        icon: '🕳️', trail: 'avancados' },
  '/ssh-proxy':     { label: 'SSH como Proxy SOCKS',        icon: '🚇', trail: 'avancados' },
  '/ansible':       { label: 'Ansible',                     icon: '⚙️', trail: 'avancados' },
  '/monitoring':    { label: 'Prometheus + Grafana',        icon: '📊', trail: 'avancados' },
  '/kubernetes':    { label: 'Kubernetes / K3s',            icon: '☸️', trail: 'avancados' },
  '/terraform':     { label: 'Terraform IaC',               icon: '🏗️', trail: 'avancados' },
  '/suricata':      { label: 'Suricata IDS/IPS',            icon: '🛡️', trail: 'avancados' },
  '/ebpf':          { label: 'eBPF & XDP',                  icon: '⚡', trail: 'avancados' },
  '/service-mesh':  { label: 'Service Mesh (Istio)',        icon: '🕸️', trail: 'avancados' },
  '/sre':           { label: 'SRE & SLOs',                  icon: '🎯', trail: 'avancados' },
  '/cicd':          { label: 'CI/CD GitHub Actions',        icon: '🚀', trail: 'avancados' },
  '/opnsense':      { label: 'OPNsense',                    icon: '🔥', trail: 'avancados' },
  '/nextcloud':     { label: 'Nextcloud',                   icon: '☁️', trail: 'avancados' },
  '/ebpf-avancado': { label: 'eBPF Avançado + Cilium',      icon: '🧬', trail: 'avancados' },
};

// Ordem dos módulos por trilha (segue COURSE_ORDER / FUNDAMENTOS_ORDER / ADVANCED_ORDER)
const TRAIL_MODULES: Record<TrailTab, string[]> = {
  firewall: [
    '/instalacao', '/wan-nat', '/dns', '/nginx-ssl', '/lan-proxy',
    '/dnat', '/port-knocking', '/vpn-ipsec', '/wireguard', '/nftables',
    '/fail2ban', '/hardening', '/ssh-2fa', '/docker', '/docker-compose',
    '/audit-logs', '/ataques-avancados', '/pivoteamento', '/laboratorio',
    '/proxmox', '/web-server', '/glossario', '/evolucao',
  ],
  fundamentos: [
    '/fhs', '/comandos', '/editores', '/processos', '/permissoes',
    '/discos', '/logs-basicos', '/backup', '/shell-script', '/cron',
    '/pacotes', '/boot', '/comandos-avancados', '/rsyslog',
  ],
  avancados: [
    '/dhcp', '/samba', '/apache', '/openvpn', '/traefik',
    '/ldap', '/pihole', '/ssh-proxy', '/ansible', '/monitoring',
    '/kubernetes', '/terraform', '/suricata', '/ebpf', '/service-mesh',
    '/sre', '/cicd', '/opnsense', '/nextcloud', '/ebpf-avancado',
  ],
};

// Configuração visual por trilha
const TRAIL_CONFIG = {
  firewall:    { label: '🔥 Firewall',    color: 'border-accent',      barColor: 'bg-accent',      activeTab: 'border-accent text-accent',         hrefStart: '/instalacao', desc: 'Do zero ao firewall profissional' },
  fundamentos: { label: '🐧 Fundamentos', color: 'border-[#6366f1]',   barColor: 'bg-[#6366f1]',   activeTab: 'border-[#6366f1] text-[#6366f1]',   hrefStart: '/fundamentos', desc: 'Base Linux sólida para SysAdmins' },
  avancados:   { label: '🚀 Avançados',   color: 'border-info',        barColor: 'bg-info',        activeTab: 'border-info text-info',              hrefStart: '/avancados',  desc: 'Servidores, IaC e Cloud' },
} as const;

function getModuleBase(href: string): string {
  return '/' + href.split('#')[0].replace(/^\//, '');
}

export default function TopicsPage() {
  const [activeTrail, setActiveTrail] = useState<TrailTab>('firewall');

  const [intentMode, setIntentMode] = useState<IntentMode>(() => {
    if (typeof window === 'undefined') return 'estudo';
    return localStorage.getItem(INTENT_LS_KEY) === 'incendio' ? 'incendio' : 'estudo';
  });

  const [openModules, setOpenModules] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set<string>();
    return localStorage.getItem(INTENT_LS_KEY) === 'incendio'
      ? new Set<string>(TRAIL_MODULES['firewall'])
      : new Set<string>();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTooltip, setExpandedTooltip] = useState<string | null>(null);
  const { visitedPages } = useBadges();

  // Verifica se um path (módulo) foi visitado
  const isVisited = useCallback((path: string): boolean => {
    const clean = path.replace(/^\//, '');
    return visitedPages.has(clean) || visitedPages.has('/' + clean);
  }, [visitedPages]);

  // Agrupa tópicos pelo path base do href (ex: /lan-proxy#x → /lan-proxy)
  // Em modo INCÊNDIO, os tópicos são ordenados por camada OSI (L3 antes de L7)
  const topicsByModule = useMemo(() => {
    const sortFn = SORT_STRATEGIES[intentMode];
    const map = new Map<string, Topic[]>();
    for (const topic of TOPICS) {
      const base = getModuleBase(topic.href);
      if (!map.has(base)) map.set(base, []);
      map.get(base)!.push(topic);
    }
    for (const topics of map.values()) {
      topics.sort(sortFn);
    }
    return map;
  }, [intentMode]);

  // Progresso por trilha (contagem de módulos visitados)
  const trailStats = useMemo(() => {
    const stats: Record<TrailTab, { total: number; visited: number }> = {
      firewall:    { total: 0, visited: 0 },
      fundamentos: { total: 0, visited: 0 },
      avancados:   { total: 0, visited: 0 },
    };
    for (const [path, meta] of Object.entries(MODULE_META)) {
      stats[meta.trail].total++;
      if (isVisited(path)) stats[meta.trail].visited++;
    }
    return stats;
  }, [isVisited]);

  // Abre/fecha accordion de um módulo
  const toggleModule = useCallback((slug: string) => {
    setExpandedTooltip(null);
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  // Toggle de intenção: 📚 Estudo ↔ 🔥 Incêndio
  const toggleIntentMode = useCallback(() => {
    setIntentMode(prev => {
      const next: IntentMode = prev === 'estudo' ? 'incendio' : 'estudo';
      setOpenModules(
        next === 'incendio'
          ? new Set<string>(TRAIL_MODULES[activeTrail])
          : new Set<string>()
      );
      return next;
    });
  }, [activeTrail]);

  // Resultados de busca (flat, todas as trilhas)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.layer.toLowerCase().includes(q) ||
      (MODULE_META[getModuleBase(t.href)]?.label ?? '').toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Persistência da preferência de intenção
  useEffect(() => {
    localStorage.setItem(INTENT_LS_KEY, intentMode);
  }, [intentMode]);

  // Manter módulos expandidos ao mudar trilha em modo INCÊNDIO
  useEffect(() => {
    if (intentMode === 'incendio') {
      setOpenModules(new Set<string>(TRAIL_MODULES[activeTrail]));
    }
  }, [activeTrail, intentMode]);

  const tc = TRAIL_CONFIG[activeTrail];
  const ts = trailStats[activeTrail];
  const pct = ts.total ? Math.round((ts.visited / ts.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Tópicos</span>
      </div>

      <div className="section-label">Guia Completo</div>
      <h1 className="section-title">Todos os Tópicos</h1>
      <p className="section-sub">
        {TOPICS.length} tópicos organizados em {Object.keys(MODULE_META).length} módulos.
        Escolha sua trilha, expanda um módulo para ver os tópicos e clique para ir direto ao conteúdo.
      </p>

      {/* ── Trail tabs ── */}
      <div role="tablist" className="flex gap-0 border-b border-border mt-10 mb-0">
        {(Object.entries(TRAIL_CONFIG) as [TrailTab, typeof TRAIL_CONFIG[TrailTab]][]).map(([id, cfg]) => {
          const s = trailStats[id];
          return (
            <button
              key={id}
              role="tab"
              aria-selected={activeTrail === id}
              onClick={() => setActiveTrail(id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
                activeTrail === id ? cfg.activeTab : 'border-transparent text-text-2 hover:text-text'
              )}
            >
              {cfg.label}
              <span className="text-[11px] font-mono opacity-60 tabular-nums">
                {s.visited}/{s.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Trail hero ── */}
      {!searchQuery && (
        <div className={cn('flex items-center gap-5 bg-bg-2 border rounded-b-xl rounded-tr-xl p-5 mb-6', tc.color + '/30')}>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm mb-0.5">{tc.label}</div>
            <div className="text-xs text-text-3 mb-3">{tc.desc} · {TRAIL_MODULES[activeTrail].length} módulos</div>
            {intentMode === 'estudo' && (
              <>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-700', tc.barColor)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[11px] text-text-3 mt-1.5">
                  {ts.visited} de {ts.total} módulos visitados · {pct}%
                </div>
              </>
            )}
          </div>
          <Link
            href={tc.hrefStart}
            className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition-colors"
          >
            {ts.visited === 0 ? 'Começar →' : ts.visited === ts.total ? 'Revisar →' : 'Continuar →'}
          </Link>
        </div>
      )}

      {/* ── Busca ── */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" size={15} />
        <input
          type="text"
          placeholder="Buscar em todos os módulos... (ex: DNS, iptables, SNAT, chmod)"
          className="w-full bg-bg-2 border border-border rounded-lg py-2.5 pl-9 pr-20 text-sm focus:border-accent outline-none transition-colors"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-3 hover:text-text px-2 py-1 rounded hover:bg-bg-3 transition-colors"
          >
            ✕ limpar
          </button>
        )}
      </div>

      {/* ── Toggle de intenção: Estudo ↔ Incêndio ── */}
      {!searchQuery && (
        <div className="flex items-center justify-between mb-4">
          <button
            aria-pressed={intentMode === 'incendio'}
            onClick={toggleIntentMode}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all',
              intentMode === 'incendio'
                ? 'bg-[rgba(248,81,73,0.12)] border-[rgba(248,81,73,0.4)] text-[var(--color-err)]'
                : 'bg-bg-2 border-border text-text-2 hover:border-accent/50 hover:text-text'
            )}
          >
            <span aria-hidden="true">{intentMode === 'incendio' ? '🔥' : '📚'}</span>
            {intentMode === 'incendio' ? 'MODO OPERACIONAL' : 'Modo Estudo'}
          </button>
          {intentMode === 'incendio' && (
            <span aria-live="polite" className="text-[11px] font-mono text-[var(--color-err)] opacity-70 uppercase tracking-wider">
              L3/L4 primeiro · todos expandidos
            </span>
          )}
        </div>
      )}

      {/* ── Resultados de busca (flat) ── */}
      {searchResults ? (
        <div className="space-y-2">
          <p className="text-xs text-text-3 mb-4">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para &ldquo;<strong className="text-text">{searchQuery}</strong>&rdquo;
          </p>
          {searchResults.map(topic => {
            const base = getModuleBase(topic.href);
            const meta = MODULE_META[base];
            return (
              <Link
                key={topic.id}
                href={topic.href}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border hover:border-accent/50 rounded-xl transition-colors group"
              >
                <span className="text-xl mt-0.5 shrink-0">{meta?.icon ?? '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-text-3 mb-1 font-medium">{meta?.label ?? base}</p>
                  <p className="text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed">{topic.title}</p>
                  <span className={cn('layer-badge mt-2', topic.layerClass)}>{topic.layer}</span>
                </div>
                {isVisited(base) && <span className="text-ok text-xs font-bold self-center shrink-0">✓</span>}
                <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" size={14} />
              </Link>
            );
          })}
          {searchResults.length === 0 && (
            <div className="text-center py-16 bg-bg-2 border border-dashed border-border rounded-xl">
              <div className="text-3xl mb-3">🔍</div>
              <p className="text-text-3">Nenhum tópico encontrado para &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Accordion por módulo ── */
        <div className="space-y-1.5">
          {TRAIL_MODULES[activeTrail].map(modulePath => {
            const meta = MODULE_META[modulePath];
            if (!meta) return null;
            const topics = topicsByModule.get(modulePath) ?? [];
            const visited = isVisited(modulePath);
            const isOpen = openModules.has(modulePath);

            return (
              <div
                key={modulePath}
                className={cn(
                  'border rounded-xl overflow-hidden transition-all',
                  visited ? 'border-ok/25 bg-bg-2' : 'border-border bg-bg-2',
                  isOpen && 'border-accent/30'
                )}
              >
                {/* Cabeçalho do módulo */}
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-4 text-left hover:bg-bg-3 transition-colors',
                    intentMode === 'incendio' ? 'py-2.5' : 'py-3.5'
                  )}
                  onClick={() => toggleModule(modulePath)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base shrink-0">{meta.icon}</span>
                  <span className={cn(
                    'flex-1 text-sm font-semibold leading-snug',
                    visited ? 'text-text' : 'text-text-2',
                    intentMode === 'incendio' && 'truncate'
                  )}>
                    {meta.label}
                  </span>
                  {topics.length > 0 && (
                    <span className="text-[10px] text-text-3 font-mono tabular-nums shrink-0">
                      {topics.length} tópico{topics.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {visited && (
                    <span className="text-ok text-[11px] font-bold shrink-0 ml-1">✓</span>
                  )}
                  <Link
                    href={modulePath}
                    onClick={e => e.stopPropagation()}
                    className="text-[11px] text-accent hover:text-accent-2 font-bold px-2.5 py-1 rounded-lg hover:bg-accent/10 transition-colors shrink-0"
                  >
                    Abrir →
                  </Link>
                  {topics.length > 0 ? (
                    isOpen
                      ? <ChevronDown size={14} className="text-text-3 shrink-0" />
                      : <ChevronRight size={14} className="text-text-3 shrink-0" />
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                </button>

                {/* Lista de tópicos (expandida) */}
                {isOpen && topics.length > 0 && (
                  <div className="border-t border-border/60">
                    {topics.map((topic, idx) => (
                      <div key={topic.id} className={cn('group', idx > 0 && 'border-t border-border/40')}>
                        <Link
                          href={topic.href}
                          className="relative flex items-start gap-3 px-4 py-3 hover:bg-bg-3 transition-colors"
                        >
                          <span className="font-mono text-[10px] text-text-3 bg-bg-3 px-1.5 py-0.5 rounded shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-white transition-colors">
                            {topic.num}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed',
                              intentMode === 'incendio' && 'truncate'
                            )}>
                              {topic.title}
                            </p>
                            <span className={cn(
                              'layer-badge mt-1.5',
                              topic.layerClass,
                              intentMode === 'incendio' && (topic.layerClass === 'l3' || topic.layerClass === 'l4') && 'text-[var(--color-err)] bg-[rgba(248,81,73,0.1)] border-[rgba(248,81,73,0.3)]'
                            )}>
                              {topic.layer}
                            </span>
                          </div>
                          <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0" size={13} />
                          {/* Tooltip desktop — CSS puro */}
                          <div
                            role="tooltip"
                            className="hidden md:block absolute left-full top-0 ml-3 z-50 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 bg-bg-2 border border-border rounded-lg p-3 shadow-lg"
                          >
                            <p className="text-xs text-text-3">{topic.layer}</p>
                            <p className="text-xs text-text-2 mt-1">{topic.group}</p>
                            <span className="text-[10px] text-accent">→ {topic.href.split('#')[0]}</span>
                          </div>
                        </Link>
                        {/* Expand mobile */}
                        <button
                          className="md:hidden w-full text-left px-4 pb-1 text-[11px] text-text-3 hover:text-accent transition-colors"
                          onClick={() => setExpandedTooltip(prev => prev === topic.id ? null : topic.id)}
                        >
                          {expandedTooltip === topic.id ? '▲ ocultar' : '▼ detalhes'}
                        </button>
                        {expandedTooltip === topic.id && (
                          <div className="md:hidden px-4 pb-2 text-[11px] text-text-3 bg-bg-3 border-t border-border/40">
                            {topic.layer} · {topic.group} · {topic.href.split('#')[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
