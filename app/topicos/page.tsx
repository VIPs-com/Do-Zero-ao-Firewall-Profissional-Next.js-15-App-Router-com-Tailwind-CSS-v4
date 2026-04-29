'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

interface Topic {
  id: string;
  num: string;
  title: string;
  layer: string;
  layerClass: string;
  href: string;
  group: string;
}

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
  {
    id: '03', num: '03',
    title: 'Todas as funções do Firewall: iptables, NAT, SNAT, DNAT, ip_forward, Port Knocking e Squid.',
    layer: 'Camadas 3 e 4 · Rede e Transporte', layerClass: 'l4',
    // FIX: era '/#firewall' — id="firewall" não existe em page.tsx. Agora aponta para /wan-nat que cobre o conteúdo correto.
    href: '/wan-nat',
    group: 'Funções do Firewall'
  },

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

  // ── Defesa Ativa ─────────────────────────────────────────────────────────────
  { id: '26', num: '26', title: 'Fail2ban: proteção contra brute force em SSH e Nginx com jails, filtros regex e ações iptables.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/fail2ban', group: 'Segurança Avançada' },

  // ── Segurança Avançada ────────────────────────────────────────────────────────
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

  // ── Sprint SIGMA Fase 2 — seções avançadas ────────────────────────────────────
  { id: '38', num: '38', title: 'Fluxo do administrador com Port Knocking: ~/entrar.sh, janela de 10s e por que bots nunca descobrem a porta.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/port-knocking#admin-em-acao', group: 'Port Knocking' },
  { id: '39', num: '39', title: 'Auditoria forense do Port Knocking: tail -f com awk, scripts audit-knock e knock-monitor, rotação 90 dias.', layer: 'Forense · Logs', layerClass: 'l4', href: '/audit-logs#forense-knock', group: 'Segurança Avançada' },
  { id: '40', num: '40', title: 'As 5 funções simultâneas do Firewall (Roteador+Filtro+Tradutor+Proxy+Guardião) e a magia do conntrack IDA/VOLTA.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/wan-nat#anatomia-nat', group: 'WAN, NAT & ESTABLISHED' },
  { id: '41', num: '41', title: 'PREROUTING pelo kernel: os 5 hooks do Netfilter, a troca cirúrgica do IP e tcpdump antes e depois do DNAT.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/dnat#prerouting-kernel', group: 'DNAT & PREROUTING' },
  { id: '42', num: '42', title: 'Fluxo completo de navegação via Squid: timeline t=0ms→t=52ms, HTTP vs HTTPS e os 4 cenários de ACL.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/lan-proxy#fluxo-navegacao', group: 'LAN, DNS & Proxy' },

  // ── Sprint W — Windows-to-Linux ───────────────────────────────────────────────
  { id: '43', num: '43', title: 'Terminal do Zero para Windows users: pwd, ls, sudo, Tab autocompletar, Ctrl+Shift+C para copiar.', layer: 'Fundação · Terminal', layerClass: 'l7', href: '/instalacao#terminal-do-zero', group: 'Fundação & Terminal' },
  { id: '44', num: '44', title: 'Mindset SysAdmin: systemctl vs Serviços Windows, journalctl vs Event Viewer, /etc/ vs Program Files.', layer: 'Fundação · Conceitos', layerClass: 'l7', href: '/instalacao#sysadmin-mindset', group: 'Fundação & Terminal' },
  { id: '45', num: '45', title: 'RosettaStone interativa: 25 equivalências Windows → Linux com filtro por categoria — ls, grep, systemctl e mais.', layer: 'Fundação · Conceitos', layerClass: 'l7', href: '/instalacao#rosetta-stone', group: 'Fundação & Terminal' },

  // ── Sprint I.3 — Hardening Linux ─────────────────────────────────────────────
  { id: '46', num: '46', title: 'Hardening Linux: SSH sem senha (Ed25519), sysctl de segurança (SYN cookies, ASLR) e AppArmor enforce para Nginx.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/hardening', group: 'Hardening Linux' },
  // ── Sprint I.5 — SSH com 2FA ──────────────────────────────────────────────────
  { id: '48', num: '48', title: 'SSH com 2FA: TOTP com Google Authenticator, libpam-google-authenticator, PAM config e sshd_config para autenticação de dois fatores.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/ssh-2fa', group: 'Hardening Linux' },

  // ── Sprint I.4 — Docker Networking ───────────────────────────────────────────
  { id: '47', num: '47', title: 'Docker Networking: bridge, host e none. Como o Docker manipula o iptables automaticamente.', layer: 'Camada 3 · Rede', layerClass: 'l3', href: '/docker#redes', group: 'Docker & Containers' },
  { id: '47b', num: '47', title: 'Port mapping (-p 8080:80) é DNAT automático: Docker cria regras iptables na chain DOCKER.', layer: 'Camada 4 · Transporte', layerClass: 'l4', href: '/docker#port-mapping', group: 'Docker & Containers' },
  // ── Sprint I.6 — Docker Compose ───────────────────────────────────────────────
  { id: '49', num: '49', title: 'Docker Compose: docker-compose.yml declarativo, redes frontend/backend/internal isoladas, volumes persistentes e stack completa Nginx+App+PostgreSQL.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/docker-compose', group: 'Docker & Containers' },

  // ── Sprint F1-F3 — Trilha Fundamentos Linux (v2.0) ────────────────────────
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
  // Sprint I.14 — Ansible (v4.0 Infraestrutura Moderna)
  { id: 'i01', num: 'I01', title: 'Ansible para SysAdmins: inventário, comandos ad-hoc, playbooks YAML com tasks/handlers/templates, roles reutilizáveis, Ansible Galaxy e Vault para segredos.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/ansible', group: 'Infraestrutura Moderna' },
  // Sprint I.15 — Prometheus + Grafana (v4.0 Infraestrutura Moderna)
  { id: 'i02', num: 'I02', title: 'Prometheus + Grafana: node_exporter, PromQL (rate/increase/sum), dashboards ID 1860, regras de alerta e Alertmanager com email/Slack — observabilidade real.', layer: 'Infraestrutura · Observabilidade', layerClass: 'l7', href: '/monitoring', group: 'Infraestrutura Moderna' },
  // Sprint I.16 — Kubernetes / K3s (v4.0 Infraestrutura Moderna)
  { id: 'i03', num: 'I03', title: 'Kubernetes / K3s: Pod, Deployment, Service, ConfigMap/Secret, Ingress Traefik, NetworkPolicy com Calico e Helm — orquestração de containers do zero.', layer: 'Infraestrutura · Orquestração', layerClass: 'l3', href: '/kubernetes', group: 'Infraestrutura Moderna' },
  // Sprint I.17 — Terraform IaC (v4.0 Infraestrutura Moderna)
  { id: 'i04', num: 'I04', title: 'Terraform IaC: HCL declarativo, providers Docker/AWS, init→plan→apply→destroy, state remoto (S3/GitLab), módulos reutilizáveis e workspaces para múltiplos ambientes.', layer: 'Infraestrutura · IaC', layerClass: 'l3', href: '/terraform', group: 'Infraestrutura Moderna' },
  // Sprint I.18 — Suricata IDS/IPS (v4.0 Infraestrutura Moderna)
  { id: 'i05', num: 'I05', title: 'Suricata IDS/IPS: modo IDS passivo (af-packet) e IPS inline (NFQUEUE), regras customizadas com EVE JSON, Emerging Threats e integração com nftables.', layer: 'Segurança · IDS/IPS', layerClass: 'l4', href: '/suricata', group: 'Infraestrutura Moderna' },
  // Sprint I.19 — eBPF & XDP (v4.0 Infraestrutura Moderna)
  { id: 'i06', num: 'I06', title: 'eBPF & XDP: BCC tools (execsnoop, tcpconnect, biolatency), bpftrace scripting, filtros XDP de alta performance, Cilium CNI para Kubernetes e Falco para segurança em runtime.', layer: 'Kernel · Observabilidade', layerClass: 'l2', href: '/ebpf', group: 'Infraestrutura Moderna' },
  // Sprint I.20 — Service Mesh com Istio (v4.0 Infraestrutura Moderna)
  { id: 'i07', num: 'I07', title: 'Service Mesh com Istio: sidecar Envoy, mTLS automático (SPIFFE/X.509), VirtualService (canary/A-B), DestinationRule (circuit breaker), AuthorizationPolicy e observabilidade com Kiali/Jaeger.', layer: 'Camada 7 · mTLS', layerClass: 'l7', href: '/service-mesh', group: 'Infraestrutura Moderna' },
  // Sprint I.21 — SRE & SLOs (v4.0 Infraestrutura Moderna)
  { id: 'i08', num: 'I08', title: 'SRE & SLOs: SLIs/SLOs com Prometheus (recording rules + burn rate), error budget como ferramenta de decisão, alertas por sintoma, runbooks acionáveis e postmortem blameless.', layer: 'Cultura · Confiabilidade', layerClass: 'l7', href: '/sre', group: 'Infraestrutura Moderna' },
  // Sprint I.22 — CI/CD com GitHub Actions (v5.0 Cloud & Platform Engineering)
  { id: 'c01', num: 'C01', title: 'CI/CD com GitHub Actions: lint/test/build em paralelo, Docker build+push ghcr.io, environments com aprovação manual, matrix strategy e self-hosted runner como serviço systemd.', layer: 'DevOps · Automação', layerClass: 'l5', href: '/cicd', group: 'Cloud & Platform Engineering' },
  // Sprint I.23 — OPNsense / pfSense (v5.0 Cloud & Platform Engineering)
  { id: 'c02', num: 'C02', title: 'OPNsense: firewall enterprise com Web UI — regras por interface (ingress), Aliases, Port Forward (DNAT), VPN WireGuard/OpenVPN wizard, Suricata IDS/IPS integrado e Alta Disponibilidade com CARP.', layer: 'Firewall · Enterprise', layerClass: 'l3', href: '/opnsense', group: 'Cloud & Platform Engineering' },
  // Sprint I.24 — Nextcloud (v5.0 Cloud & Platform Engineering)
  { id: 'c03', num: 'C03', title: 'Nextcloud self-hosted: Docker Compose (Nextcloud+MariaDB+Redis+Traefik), CalDAV/CardDAV, integração LDAP, object storage MinIO, backup 3-2-1 automatizado e apps Calendar/Contacts/Talk.', layer: 'Camada 7 · Aplicação', layerClass: 'l7', href: '/nextcloud', group: 'Cloud & Platform Engineering' },
  // Sprint I.25 — eBPF Avançado + Cilium (v5.0 Cloud & Platform Engineering)
  { id: 'c04', num: 'C04', title: 'eBPF Avançado + Cilium: CNI nativo eBPF substituindo kube-proxy e flannel, Hubble para observabilidade de fluxos L7 em tempo real, CiliumNetworkPolicy HTTP path e DNS (toFQDNs), Tetragon TracingPolicy para runtime security.', layer: 'eBPF · CNI', layerClass: 'l3', href: '/ebpf-avancado', group: 'Cloud & Platform Engineering' },
];

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { visitedPages } = useBadges();

  const filteredTopics = useMemo(() => {
    return TOPICS.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           topic.group.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || topic.layerClass === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, Topic[]>();
    filteredTopics.forEach(topic => {
      if (!map.has(topic.group)) map.set(topic.group, []);
      map.get(topic.group)!.push(topic);
    });
    return Array.from(map.entries());
  }, [filteredTopics]);

  const completionPercentage = useMemo(() => {
    // FIX: era 20 — agora bate com TOPICS.length (24 tópicos reais no índice)
    const totalPages = TOPICS.length;
    return Math.round((visitedPages.size / totalPages) * 100);
  }, [visitedPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Tópicos</span>
      </div>

      <div className="section-label">Guia Completo</div>
      <h1 className="section-title">Todos os Tópicos</h1>
      <p className="section-sub">
        {TOPICS.length} tópicos organizados por tema, cobrindo cada camada do Modelo OSI.
        Cada página traz explicações completas, diagramas de fluxo e blocos de código comentados.
      </p>

      {/* Progress Global */}
      <div className="bg-bg-2 border border-border rounded-xl p-6 mb-12 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-accent">📊</span> Seu Progresso no Workshop
          </h3>
          <span className="text-xs font-mono text-text-3 uppercase tracking-widest">Beta</span>
        </div>
        <div className="w-full h-3 bg-bg-3 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(completionPercentage, 100)}%` }}
            className="h-full bg-gradient-to-r from-ok to-accent"
          />
        </div>
        <div className="flex justify-between text-sm text-text-2">
          <span>{Math.min(completionPercentage, 100)}% concluído</span>
          {/* FIX: era hardcoded "20" — agora usa TOPICS.length dinamicamente */}
          <span>{visitedPages.size} de {TOPICS.length} páginas visitadas</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar tópico, camada ou serviço... (ex: DNS, Camada 4, SNAT)"
            className="w-full bg-bg-2 border border-border rounded-lg py-3.5 pl-12 pr-4 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: '📚 Todos' },
            { id: 'l7',  label: '📡 Camada 7' },
            { id: 'l6',  label: '🔒 Camada 6' },
            { id: 'l5',  label: '🔄 Camada 5' },
            { id: 'l4',  label: '🔌 Camada 4' },
            { id: 'l3',  label: '🌐 Camada 3' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                activeFilter === filter.id
                  ? "bg-accent border-accent text-white"
                  : "bg-bg-2 border-border text-text-2 hover:border-accent hover:text-accent"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map(([groupName, topics]) => (
          <div key={groupName} className="bg-bg-2 border border-border rounded-xl overflow-hidden flex flex-col hover:border-accent/30 transition-colors">
            <div className="px-5 py-4 border-b border-border bg-bg-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent text-lg">
                {groupName.includes('LAN') ? '💻' : groupName.includes('WAN') ? '🌐' : groupName.includes('DNS') ? '📖' : groupName.includes('Web Server') ? '🖥️' : groupName.includes('nftables') ? '🔥' : groupName.includes('Referência') ? '📚' : groupName.includes('Ambientes') ? '⚡' : '🛡️'}
              </div>
              <h3 className="font-bold text-sm">{groupName}</h3>
            </div>
            <div className="flex-1 py-2">
              {topics.map(topic => (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="group flex gap-4 px-5 py-4 hover:bg-bg-3 border-l-2 border-transparent hover:border-accent transition-all"
                >
                  <span className="font-mono text-[10px] text-text-3 bg-bg-3 px-2 py-1 rounded-full h-fit group-hover:bg-accent group-hover:text-white transition-colors">
                    {topic.num}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-text-2 group-hover:text-text transition-colors leading-relaxed">
                      {topic.title}
                    </p>
                    <span className={cn("layer-badge mt-3", topic.layerClass)}>
                      {topic.layer}
                    </span>
                  </div>
                  <ChevronRight className="text-text-3 opacity-0 group-hover:opacity-100 transition-opacity self-center" size={16} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">Nenhum tópico encontrado</h3>
          <p className="text-text-3">Tente buscar por outros termos ou limpar os filtros.</p>
        </div>
      )}
    </div>
  );
}
