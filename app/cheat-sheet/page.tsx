'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Terminal, Copy, Check, Search, Filter, BookOpen, Shield, Zap, Globe, Lock, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { TroubleshootingCard, TroubleshootingStep } from '@/components/ui/TroubleshootingCard';
import { ModuleNav } from '@/components/ui/ModuleNav';

interface Command {
  id: string;
  cmd: string;
  desc: string;
  layer: string;
  layerClass: string;
  category: string;
}

const COMMANDS: Command[] = [
  // Camada 3 - Rede
  { id: 'ip-addr', cmd: 'ip addr show', desc: 'Verifica IPs e estado das interfaces de rede.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'ip-route', cmd: 'ip route show', desc: 'Exibe a tabela de roteamento do kernel.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'ping', cmd: 'ping -c 4 8.8.8.8', desc: 'Testa conectividade básica via ICMP.', layer: 'Camada 3', layerClass: 'l3', category: 'Rede' },
  { id: 'sysctl-forward', cmd: 'sysctl net.ipv4.ip_forward', desc: 'Verifica se o roteamento de pacotes está ativo.', layer: 'Camada 3', layerClass: 'l3', category: 'Firewall' },
  
  // Camada 4 - Transporte
  { id: 'iptables-list', cmd: 'iptables -L -n -v', desc: 'Lista todas as regras de filtro com contadores.', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'iptables-nat', cmd: 'iptables -t nat -L -n -v', desc: 'Lista as regras de NAT (PREROUTING/POSTROUTING).', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'ss-tulpn', cmd: 'ss -tulpn', desc: 'Lista portas abertas e processos ouvindo.', layer: 'Camada 4', layerClass: 'l4', category: 'Diagnóstico' },
  { id: 'nmap-scan', cmd: 'nmap -sS -p 1-1000 192.168.56.120', desc: 'Scan de portas TCP (Syn Scan).', layer: 'Camada 4', layerClass: 'l4', category: 'Segurança' },
  
  // Camada 7 - Aplicação
  { id: 'dig-dns', cmd: 'dig @192.168.56.100 www.workshop.local', desc: 'Consulta DNS específica para um servidor.', layer: 'Camada 7', layerClass: 'l7', category: 'DNS' },
  { id: 'dig-mx', cmd: 'dig +short MX workshop.local && dig +short PTR 100.56.168.192.in-addr.arpa', desc: 'Consulta registro MX e reverso PTR — essencial para diagnóstico de e-mail e rDNS.', layer: 'Camada 7', layerClass: 'l7', category: 'DNS' },
  { id: 'curl-proxy', cmd: 'curl -x http://192.168.57.250:3128 http://google.com', desc: 'Testa navegação via Proxy Squid.', layer: 'Camada 7', layerClass: 'l7', category: 'Proxy' },
  { id: 'squid-check', cmd: 'squid -k check && squid -k reconfigure', desc: 'Valida a configuração do Squid e recarrega sem reiniciar — equivalente ao nginx -t && reload.', layer: 'Camada 7', layerClass: 'l7', category: 'Proxy' },
  { id: 'nginx-test', cmd: 'nginx -t', desc: 'Valida a sintaxe dos arquivos de configuração do Nginx.', layer: 'Camada 7', layerClass: 'l7', category: 'Web' },
  { id: 'tail-squid', cmd: 'tail -f /var/log/squid/access.log', desc: 'Monitora logs de acesso do Proxy em tempo real.', layer: 'Camada 7', layerClass: 'l7', category: 'Logs' },
  
  // Segurança & VPN
  { id: 'strongswan-status', cmd: 'swanctl --list-sas', desc: 'Lista as Security Associations (SAs) da VPN IPSec.', layer: 'Camada 3', layerClass: 'l3', category: 'VPN' },
  { id: 'knock-test', cmd: 'knock 192.168.20.200 7000 8000 9000', desc: 'Envia sequência de batidas para o Port Knocking.', layer: 'Camada 4', layerClass: 'l4', category: 'Segurança' },
  { id: 'openssl-cert', cmd: 'openssl x509 -in cert.pem -text -noout', desc: 'Lê o conteúdo de um certificado SSL.', layer: 'Camada 6', layerClass: 'l6', category: 'SSL/TLS' },

  // Persistência & systemd (Sprint R)
  { id: 'ipt-save', cmd: 'iptables-save > /etc/firewall/regras.ipt', desc: 'Salva todas as regras iptables em arquivo (formato restaurável).', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'ipt-restore', cmd: 'iptables-restore < /etc/firewall/regras.ipt', desc: 'Restaura regras iptables atomicamente a partir de um arquivo.', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },
  { id: 'systemctl-enable-fw', cmd: 'systemctl enable firewall.service', desc: 'Habilita o serviço de firewall para iniciar no boot.', layer: 'Camada 7', layerClass: 'l7', category: 'systemd' },
  { id: 'systemctl-status-fw', cmd: 'systemctl status firewall', desc: 'Verifica o estado atual do serviço de firewall.', layer: 'Camada 7', layerClass: 'l7', category: 'systemd' },
  { id: 'systemd-analyze', cmd: 'systemd-analyze blame | head -20', desc: 'Lista os 20 serviços que mais atrasaram o boot, em ordem decrescente de tempo.', layer: 'Camada 7', layerClass: 'l7', category: 'systemd' },
  { id: 'conntrack-list', cmd: 'conntrack -L', desc: 'Lista todas as conexões rastreadas pelo kernel (conntrack table).', layer: 'Camada 4', layerClass: 'l4', category: 'Diagnóstico' },

  // WireGuard (Sprint R)
  { id: 'wg-show', cmd: 'wg show', desc: 'Mostra interfaces WireGuard ativas, peers e tráfego.', layer: 'Camada 3', layerClass: 'l3', category: 'VPN' },
  { id: 'wg-quick-up', cmd: 'wg-quick up wg0', desc: 'Levanta a interface WireGuard wg0 usando configuração em /etc/wireguard/.', layer: 'Camada 3', layerClass: 'l3', category: 'VPN' },

  // Fail2ban (Sprint R)
  { id: 'f2b-status', cmd: 'fail2ban-client status sshd', desc: 'Mostra IPs banidos e estatísticas da jail SSH.', layer: 'Camada 7', layerClass: 'l7', category: 'Segurança' },
  { id: 'f2b-banip', cmd: 'fail2ban-client set sshd banip 192.168.1.100', desc: 'Bane manualmente um IP na jail SSH.', layer: 'Camada 7', layerClass: 'l7', category: 'Segurança' },

  // Diagnóstico avançado (Sprint R)
  { id: 'tcpdump-443', cmd: 'tcpdump -i any -nn port 443 -w captura.pcap', desc: 'Captura tráfego HTTPS em formato PCAP para análise no Wireshark.', layer: 'Camada 4', layerClass: 'l4', category: 'Diagnóstico' },
  { id: 'journalctl-f2b', cmd: 'journalctl -u fail2ban --no-pager -n 50', desc: 'Últimas 50 linhas de log do Fail2ban via journald.', layer: 'Camada 7', layerClass: 'l7', category: 'Logs' },
  { id: 'logrotate-force', cmd: 'logrotate -f /etc/logrotate.conf', desc: 'Força rotação imediata de todos os logs — útil para liberar espaço ou testar a configuração do logrotate.', layer: 'Camada 7', layerClass: 'l7', category: 'Logs' },

  // SSL workflow completo (Sprint R)
  { id: 'openssl-genrsa', cmd: 'openssl genrsa -out key.pem 2048', desc: 'Gera uma chave privada RSA de 2048 bits.', layer: 'Camada 6', layerClass: 'l6', category: 'SSL/TLS' },
  { id: 'openssl-req', cmd: 'openssl req -new -key key.pem -out req.csr', desc: 'Cria uma requisição de assinatura de certificado (CSR).', layer: 'Camada 6', layerClass: 'l6', category: 'SSL/TLS' },
  { id: 'openssl-sclient', cmd: 'openssl s_client -connect host:443', desc: 'Testa o handshake SSL/TLS e exibe certificado do servidor.', layer: 'Camada 6', layerClass: 'l6', category: 'SSL/TLS' },

  // nftables (Sprint R)
  { id: 'nft-list', cmd: 'nft list ruleset', desc: 'Lista todas as tabelas, chains e regras nftables ativas.', layer: 'Camada 4', layerClass: 'l4', category: 'Firewall' },

  // Docker & Docker Compose (v3.0+)
  { id: 'docker-ps', cmd: 'docker ps -a', desc: 'Lista todos os containers (rodando e parados) com status.', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'docker-logs', cmd: 'docker logs -f --tail 100 nome', desc: 'Segue logs de um container em tempo real (últimas 100 linhas).', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'docker-exec', cmd: 'docker exec -it nome bash', desc: 'Abre shell interativo dentro de um container rodando.', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'docker-stats', cmd: 'docker stats --no-stream', desc: 'Snapshot de uso de CPU, memória e rede por container.', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'compose-up', cmd: 'docker compose up -d --build', desc: 'Sobe a stack em background, reconstruindo imagens alteradas.', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'compose-logs', cmd: 'docker compose logs -f servico', desc: 'Segue logs de um serviço específico da stack Compose.', layer: 'Camada 7', layerClass: 'l7', category: 'Docker' },
  { id: 'docker-net', cmd: 'docker network inspect nome-da-rede', desc: 'Inspeciona sub-rede, gateway e containers de uma bridge Docker.', layer: 'Camada 3', layerClass: 'l3', category: 'Docker' },

  // Ansible (v4.0)
  { id: 'ansible-ping', cmd: 'ansible all -m ping -i inventory.ini', desc: 'Testa conectividade SSH com todos os hosts do inventário.', layer: 'Camada 7', layerClass: 'l7', category: 'Ansible' },
  { id: 'ansible-check', cmd: 'ansible-playbook -i inventory.ini playbook.yml --check', desc: 'Dry-run do playbook — mostra o que mudaria sem aplicar.', layer: 'Camada 7', layerClass: 'l7', category: 'Ansible' },
  { id: 'ansible-vault', cmd: 'ansible-vault encrypt group_vars/all/secrets.yml', desc: 'Criptografa arquivo de variáveis sensíveis com AES-256.', layer: 'Camada 7', layerClass: 'l7', category: 'Ansible' },

  // Kubernetes / K3s (v4.0)
  { id: 'kubectl-get', cmd: 'kubectl get pods -n namespace -o wide', desc: 'Lista pods com IPs, nós e tempo de execução.', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },
  { id: 'kubectl-logs', cmd: 'kubectl logs -f pod/nome -n namespace', desc: 'Segue logs de um pod em tempo real (equivalente ao docker logs -f).', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },
  { id: 'kubectl-describe', cmd: 'kubectl describe pod nome -n namespace', desc: 'Exibe eventos, condições e estado detalhado de um pod. Essencial para debug.', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },
  { id: 'kubectl-apply', cmd: 'kubectl apply -f manifest.yaml', desc: 'Aplica ou atualiza recursos a partir de um manifesto declarativo.', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },

  // Terraform (v4.0)
  { id: 'tf-plan', cmd: 'terraform plan -out=tfplan', desc: 'Calcula e salva as mudanças necessárias sem aplicá-las.', layer: 'Camada 7', layerClass: 'l7', category: 'Terraform' },
  { id: 'tf-apply', cmd: 'terraform apply tfplan', desc: 'Aplica exatamente o plano gerado pelo terraform plan.', layer: 'Camada 7', layerClass: 'l7', category: 'Terraform' },
  { id: 'tf-state', cmd: 'terraform state list', desc: 'Lista todos os recursos gerenciados no state file.', layer: 'Camada 7', layerClass: 'l7', category: 'Terraform' },

  // Servidores e Serviços v3.0 (Sprint CHEAT-SERVERS)
  // — DHCP
  { id: 'dhcp-test', cmd: 'dhcpd -t -cf /etc/dhcp/dhcpd.conf', desc: 'Valida a sintaxe do dhcpd.conf sem reiniciar o serviço.', layer: 'Camada 3', layerClass: 'l3', category: 'DHCP' },
  { id: 'dhcp-leases', cmd: 'cat /var/lib/dhcp/dhcpd.leases | grep -A5 "binding state active"', desc: 'Lista concessões DHCP ativas com IP, MAC e tempo de expiração.', layer: 'Camada 3', layerClass: 'l3', category: 'DHCP' },
  { id: 'dhcp-journal', cmd: 'journalctl -u isc-dhcp-server -f', desc: 'Segue os logs do servidor DHCP em tempo real — mostra DISCOVER, OFFER, REQUEST, ACK.', layer: 'Camada 3', layerClass: 'l3', category: 'DHCP' },
  // — Samba
  { id: 'smb-status', cmd: 'smbstatus', desc: 'Mostra conexões SMB ativas, arquivos abertos e locks.', layer: 'Camada 7', layerClass: 'l7', category: 'Samba' },
  { id: 'smb-client', cmd: 'smbclient -L //192.168.57.10 -U usuario', desc: 'Lista shares disponíveis no servidor Samba. Pede senha interativamente.', layer: 'Camada 7', layerClass: 'l7', category: 'Samba' },
  { id: 'smb-testparm', cmd: 'testparm -s 2>/dev/null | grep -A3 "\\[public\\]"', desc: 'Mostra a configuração efetiva do share [public] após parsing completo do smb.conf.', layer: 'Camada 7', layerClass: 'l7', category: 'Samba' },
  // — Apache
  { id: 'apache-test', cmd: 'apachectl configtest', desc: 'Valida a sintaxe de todos os arquivos de configuração do Apache.', layer: 'Camada 7', layerClass: 'l7', category: 'Apache' },
  { id: 'apache-ensite', cmd: 'a2ensite meusite.conf && systemctl reload apache2', desc: 'Ativa um VirtualHost e recarrega o Apache — equivalente ao nginx -t + reload.', layer: 'Camada 7', layerClass: 'l7', category: 'Apache' },
  { id: 'apache-vhosts', cmd: 'apachectl -S 2>&1 | head -30', desc: 'Lista todos os VirtualHosts ativos com porta, ServerName e caminho do arquivo de configuração.', layer: 'Camada 7', layerClass: 'l7', category: 'Apache' },
  // — LDAP
  { id: 'ldap-search', cmd: 'ldapsearch -x -H ldap://localhost -b "dc=workshop,dc=local" "(uid=usuario)"', desc: 'Busca um usuário no diretório LDAP por uid (sem autenticação bind).', layer: 'Camada 7', layerClass: 'l7', category: 'LDAP' },
  { id: 'ldap-add', cmd: 'ldapadd -x -D "cn=admin,dc=workshop,dc=local" -W -f usuarios.ldif', desc: 'Importa entradas de um arquivo LDIF no diretório. -W pede a senha do admin.', layer: 'Camada 7', layerClass: 'l7', category: 'LDAP' },
  { id: 'slapcat', cmd: 'slapcat -n 1 -l /tmp/backup-ldap.ldif', desc: 'Exporta toda a árvore de diretório LDAP para arquivo LDIF — backup completo sem necessitar credenciais.', layer: 'Camada 7', layerClass: 'l7', category: 'LDAP' },
  // — Suricata
  { id: 'suricata-update', cmd: 'suricata-update && systemctl reload suricata', desc: 'Atualiza as regras Emerging Threats (~40k) e recarrega o motor de detecção.', layer: 'Camada 7', layerClass: 'l7', category: 'Suricata' },
  { id: 'suricata-test', cmd: 'suricata -T -c /etc/suricata/suricata.yaml', desc: 'Testa a configuração e valida todas as regras sem iniciar a captura.', layer: 'Camada 7', layerClass: 'l7', category: 'Suricata' },
  { id: 'suricata-eve', cmd: 'tail -f /var/log/suricata/eve.json | jq -r "select(.event_type==\"alert\") | [.timestamp,.src_ip,.alert.signature] | @tsv"', desc: 'Exibe alertas Suricata em tempo real com timestamp, IP origem e assinatura disparada.', layer: 'Camada 7', layerClass: 'l7', category: 'Suricata' },
  // — Pi-hole
  { id: 'pihole-status', cmd: 'pihole status', desc: 'Mostra se o DNS sinkhole está ativo e quantas queries foram bloqueadas.', layer: 'Camada 3', layerClass: 'l3', category: 'Pi-hole' },
  { id: 'pihole-update', cmd: 'pihole -g', desc: 'Atualiza as blocklists (gravity update) — baixa e compila as listas de domínios bloqueados.', layer: 'Camada 3', layerClass: 'l3', category: 'Pi-hole' },
  { id: 'pihole-monitor', cmd: 'pihole -c', desc: 'Dashboard terminal em tempo real com queries por segundo, % bloqueadas e top domínios.', layer: 'Camada 3', layerClass: 'l3', category: 'Pi-hole' },

  // SSH Proxy & Tunnels (Sprint SSH-PROXY)
  { id: 'ssh-socks', cmd: 'ssh -D 1080 -N usuario@servidor', desc: 'Cria proxy SOCKS5 dinâmico na porta 1080. Configure o browser para usar localhost:1080.', layer: 'Camada 7', layerClass: 'l7', category: 'SSH' },
  { id: 'ssh-local-fwd', cmd: 'ssh -L 8080:localhost:80 usuario@servidor', desc: 'Redireciona porta local 8080 para porta 80 do servidor remoto (port forward local).', layer: 'Camada 7', layerClass: 'l7', category: 'SSH' },
  { id: 'ssh-jump', cmd: 'ssh -J bastion usuario@servidor-interno', desc: 'Conecta ao servidor interno via bastião/jump host. Equivale a duas sessões SSH encadeadas.', layer: 'Camada 7', layerClass: 'l7', category: 'SSH' },

  // CI/CD — GitHub Actions (Sprint I.22)
  { id: 'gh-workflow-run', cmd: 'gh workflow run "CI Pipeline" --ref main', desc: 'Dispara um workflow do GitHub Actions manualmente via CLI.', layer: 'Camada 7', layerClass: 'l7', category: 'CI/CD' },
  { id: 'gh-run-list', cmd: 'gh run list --workflow=ci.yml --limit 10', desc: 'Lista as últimas 10 execuções de um workflow com status (success/failure/in_progress).', layer: 'Camada 7', layerClass: 'l7', category: 'CI/CD' },
  { id: 'gh-run-watch', cmd: 'gh run watch', desc: 'Monitora em tempo real uma execução de workflow em andamento. Mostra logs de cada step.', layer: 'Camada 7', layerClass: 'l7', category: 'CI/CD' },

  // Monitoring — Prometheus + Grafana (Sprint I.15)
  { id: 'promtool-check', cmd: 'promtool check config /etc/prometheus/prometheus.yml', desc: 'Valida o arquivo de configuração do Prometheus e verifica sintaxe das alert rules.', layer: 'Camada 7', layerClass: 'l7', category: 'Monitoring' },
  { id: 'prom-query', cmd: "curl -sG 'http://localhost:9090/api/v1/query' --data-urlencode 'query=up' | jq .data.result", desc: 'Consulta instantânea via API do Prometheus — verifica se todos os targets estão UP.', layer: 'Camada 7', layerClass: 'l7', category: 'Monitoring' },
  { id: 'prom-targets', cmd: "curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, state: .health, err: .lastError}'", desc: 'Lista todos os targets do Prometheus com estado (up/down) e último erro de scraping.', layer: 'Camada 7', layerClass: 'l7', category: 'Monitoring' },

  // Kubernetes avançado
  { id: 'kubectl-rollout', cmd: 'kubectl rollout status deployment/nome -n namespace', desc: 'Aguarda e exibe o progresso de um rolling update até conclusão ou timeout.', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },
  { id: 'kubectl-undo', cmd: 'kubectl rollout undo deployment/nome -n namespace', desc: 'Reverte o deployment para a revisão anterior. Usar após falha em rolling update.', layer: 'Camada 7', layerClass: 'l7', category: 'Kubernetes' },
];

const SOS_STEPS: TroubleshootingStep[] = [
  {
    layer: 1,
    name: 'Física',
    symptom: 'sem link / cabo desconectado',
    command: 'ip link show',
    detail: 'Verifique se a interface está UP. No VirtualBox, confirme que o adaptador de rede está conectado e o cabo virtual ativo. "state DOWN" indica problema físico ou driver.',
  },
  {
    layer: 2,
    name: 'Enlace',
    symptom: 'ARP sem resposta / MAC não resolve',
    command: 'ip neigh show',
    detail: 'Lista a tabela ARP. Se o gateway não aparecer ou mostrar FAILED, há problema de L2. Verifique VLAN, modo bridge do hypervisor e se os hosts estão na mesma rede L2.',
  },
  {
    layer: 3,
    name: 'Rede',
    symptom: 'ping falha / rota ausente',
    command: 'ip route show && ip addr show',
    detail: 'Verifique se existe rota default (0.0.0.0/0 via ...) e se o IP da interface está correto. ip_forward deve estar = 1 no firewall: sysctl net.ipv4.ip_forward',
  },
  {
    layer: 4,
    name: 'Transporte',
    symptom: 'conexão recusada / porta fechada',
    command: 'ss -tlnp | grep :PORTA && nc -zv HOST PORTA',
    detail: 'ss mostra quem está ouvindo. nc -zv testa se a porta está acessível. Se a porta está aberta localmente mas nc falha remotamente, há regra de firewall bloqueando.',
  },
  {
    layer: 5,
    name: 'Sessão',
    symptom: 'TLS falha / conexão cai',
    command: 'openssl s_client -connect HOST:443',
    detail: 'Verifica o handshake TLS completo e exibe a cadeia de certificados. Útil para detectar certificado expirado, CA não confiável ou cipher mismatch.',
  },
  {
    layer: 6,
    name: 'Apresentação',
    symptom: 'certificado inválido / encoding',
    command: 'openssl x509 -in cert.pem -text -noout | grep -E "Subject|Issuer|Not"',
    detail: 'Inspeciona o certificado: subject (para quem), issuer (quem assinou), datas de validade. Certificado autoassinado sempre gerará aviso no browser a menos que a CA seja importada.',
  },
  {
    layer: 7,
    name: 'Aplicação',
    symptom: 'HTTP erro / serviço não responde',
    command: 'curl -Iv http://HOST && journalctl -u nginx -f',
    detail: 'curl -I mostra headers HTTP de resposta. journalctl -u SERVICE -f acompanha logs em tempo real. nginx -t valida a sintaxe antes de recarregar. systemctl status SERVICE mostra o estado atual.',
  },
];

export default function CheatSheetPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('cheat-sheet');
  }, [trackPageVisit]);

  const DEVOPS_CATEGORIES   = ['Docker', 'Ansible', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'];
  const SERVERS_CATEGORIES  = ['DHCP', 'Samba', 'Apache', 'LDAP', 'Suricata', 'Pi-hole', 'SSH'];

  const filteredCommands = COMMANDS.filter(cmd => {
    const matchesSearch = cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cmd.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all'
      || (activeFilter === 'devops'   ? DEVOPS_CATEGORIES.includes(cmd.category)  :
          activeFilter === 'servers'  ? SERVERS_CATEGORIES.includes(cmd.category) :
          cmd.layerClass === activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-cheat-sheet">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Cheat Sheet</span>
      </div>

      <div className="section-label">Referência Rápida</div>
      <h1 className="section-title">Comandos Essenciais</h1>
      <p className="section-sub">
        Uma coleção dos comandos mais utilizados durante o workshop, organizados por camada OSI e categoria.
      </p>

      {/* SOS Troubleshooting */}
      <TroubleshootingCard steps={SOS_STEPS} />

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar comando ou descrição... (ex: iptables, dns, proxy)"
            className="w-full bg-bg-2 border border-border rounded-lg py-3.5 pl-12 pr-4 text-sm focus:border-accent focus:ring-2 focus:ring-accent/10 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: '📚 Todos' },
            { id: 'l7', label: '📡 Camada 7' },
            { id: 'l6', label: '🔒 Camada 6' },
            { id: 'l4', label: '🔌 Camada 4' },
            { id: 'l3', label: '🌐 Camada 3' },
            { id: 'devops',   label: '🚀 DevOps' },
            { id: 'servers',  label: '🌐 Servidores' },
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

      <div className="grid gap-6">
        {filteredCommands.length > 0 ? (
          filteredCommands.map(cmd => (
            <div key={cmd.id} className="bg-bg-2 border border-border rounded-xl overflow-hidden hover:border-accent/30 transition-all group">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded border", 
                      cmd.layerClass === 'l7' ? "bg-layer-7/10 border-layer-7/20 text-layer-7" :
                      cmd.layerClass === 'l6' ? "bg-layer-6/10 border-layer-6/20 text-layer-6" :
                      cmd.layerClass === 'l4' ? "bg-layer-4/10 border-layer-4/20 text-layer-4" :
                      "bg-layer-3/10 border-layer-3/20 text-layer-3"
                    )}>
                      {cmd.layer}
                    </span>
                    <span className="text-[10px] font-mono text-text-3 uppercase tracking-widest">{cmd.category}</span>
                  </div>
                  <h3 className="font-bold text-text mb-1 flex items-center gap-2">
                    <Terminal size={14} className="text-accent" />
                    <code className="text-accent-2">{cmd.cmd}</code>
                  </h3>
                  <p className="text-sm text-text-2">{cmd.desc}</p>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(cmd.cmd)}
                  className="flex items-center gap-2 px-4 py-2 bg-bg-3 hover:bg-accent hover:text-white border border-border rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  <Copy size={14} />
                  Copiar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-bold mb-2">Nenhum comando encontrado</h3>
            <p className="text-text-3">Tente buscar por outros termos ou limpar os filtros.</p>
          </div>
        )}
      </div>

      <HighlightBox className="mt-12" title="Dica de Produtividade">
        <p className="text-sm text-text-2">
          Você pode usar o atalho <code>Ctrl + K</code> em qualquer página para abrir a busca global e encontrar comandos rapidamente.
        </p>
      </HighlightBox>

      {/* VIM Guide */}
      <div className="mt-12 p-6 rounded-xl bg-bg-2 border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-accent" aria-hidden="true" />
          Sobrevivência no Terminal — Guia VIM
        </h2>
        <p className="text-sm text-text-2 mb-6">
          VIM é o editor padrão em servidores Linux. Conheça os comandos mínimos para não ficar preso.
        </p>
        <CodeBlock
          lang="bash"
          code={`# Modos principais\ni          → entrar no modo INSERT (começar a digitar)\nESC        → voltar ao modo NORMAL (parar de digitar)\n\n# Salvar e sair (modo NORMAL)\n:w         → salvar\n:q         → sair (falha se há mudanças não salvas)\n:wq        → salvar e sair\n:q!        → sair SEM salvar (forçar)\n\n# Edição básica\ndd         → deletar (cortar) linha atual\nyy         → copiar linha atual\np          → colar abaixo da linha atual\nu          → desfazer (undo)\nCtrl+r     → refazer (redo)\n\n# Navegação e busca\n/termo     → buscar no arquivo (Enter confirma)\nn          → próxima ocorrência\nN          → ocorrência anterior\n:%s/velho/novo/g → substituir todas as ocorrências no arquivo`}
        />
        <InfoBox title="Dica: Se você ficou preso no VIM">
          <p className="text-sm text-text-2">
            Pressione <strong>ESC</strong> (várias vezes se necessário) para garantir que está no modo NORMAL,
            depois digite <strong>:q!</strong> e pressione Enter. Isso sai sem salvar e nunca falha.
          </p>
        </InfoBox>
      </div>

      {/* Windows → Linux: Tabela de Equivalências */}
      <section id="windows-linux" className="mt-8 p-6 rounded-xl bg-bg-2 border border-border">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span aria-hidden="true">🪟→🐧</span>
          Windows → Linux — Tabela de Equivalências
        </h2>
        <p className="text-sm text-text-2 mb-6">
          Referência rápida para quem migra do Windows para administração Linux.
        </p>

        {[
          {
            group: 'Navegação e Arquivos',
            rows: [
              ['Listar arquivos',    'dir',            'ls -la'],
              ['Navegar pasta',      'cd C:\\pasta',   'cd /pasta'],
              ['Ver arquivo',        'type arq.txt',   'cat arq.txt'],
              ['Criar pasta',        'mkdir pasta',    'mkdir -p pasta'],
              ['Copiar arquivo',     'copy src dst',   'cp src dst'],
              ['Mover / renomear',   'move src dst',   'mv src dst'],
              ['Deletar arquivo',    'del arquivo',    'rm arquivo'],
              ['Limpar tela',        'cls',            'clear  /  Ctrl+L'],
            ],
          },
          {
            group: 'Rede e Diagnóstico',
            rows: [
              ['Ver IPs',            'ipconfig',          'ip addr  /  ifconfig'],
              ['Ping',               'ping -n 4 IP',      'ping -c 4 IP'],
              ['Tabela de rotas',    'route print',       'ip route'],
              ['Portas abertas',     'netstat -ano',      'ss -tlnp'],
              ['DNS lookup',         'nslookup host',     'dig host'],
              ['Traçar rota',        'tracert host',      'traceroute host'],
              ['IP público',         '(navegador)',        'curl ifconfig.me'],
            ],
          },
          {
            group: 'Processos e Serviços',
            rows: [
              ['Ver processos',      'tasklist',          'ps aux  /  htop'],
              ['Matar processo',     'taskkill /PID NNN', 'kill -9 PID'],
              ['Listar serviços',    'services.msc',      'systemctl list-units --type=service'],
              ['Iniciar serviço',    'net start svc',     'systemctl start svc'],
              ['Parar serviço',      'net stop svc',      'systemctl stop svc'],
              ['Boot automático',    '(checkbox GUI)',     'systemctl enable svc'],
            ],
          },
          {
            group: 'Admin e Logs',
            rows: [
              ['Executar como admin', 'Run as Admin',     'sudo comando'],
              ['Instalar software',   '.exe  /  winget',  'apt install pacote'],
              ['Ver logs',            'Visualizador de Eventos', 'journalctl -u svc -f'],
              ['Editor de texto',     'notepad arq',      'vim arq  /  nano arq'],
              ['Variável de ambiente','set VAR=val',       'export VAR=val'],
              ['Editar hosts',        'C:\\Windows\\System32\\drivers\\etc\\hosts', 'sudo vim /etc/hosts'],
            ],
          },
        ].map(section => (
          <div key={section.group} className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-3 mb-3 px-1">{section.group}</h3>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-bg-3">
                    <th className="text-left p-2 text-xs font-bold text-text-3 border-b border-border w-1/3">Ação</th>
                    <th className="text-left p-2 text-xs font-bold text-blue-400 border-b border-border border-l w-1/3">🪟 Windows</th>
                    <th className="text-left p-2 text-xs font-bold text-ok border-b border-border border-l w-1/3">🐧 Linux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {section.rows.map(([action, win, linux]) => (
                    <tr key={action} className="bg-bg-2 hover:bg-bg-3 transition-colors">
                      <td className="p-2 text-xs text-text-2">{action}</td>
                      <td className="p-2 font-mono text-[11px] text-blue-300 border-l border-border">{win}</td>
                      <td className="p-2 font-mono text-[11px] text-ok border-l border-border">{linux}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Scripts para Download */}
      <div className="mt-8 p-6 rounded-xl bg-bg-2 border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Terminal size={20} className="text-ok" aria-hidden="true" />
          Scripts do Laboratório
        </h2>
        <p className="text-sm text-text-2 mb-6">
          Scripts prontos para uso no laboratório. Baixe e adapte conforme o seu ambiente.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-bg-3 border border-border">
            <h3 className="font-bold text-sm mb-2">entrar.sh</h3>
            <p className="text-xs text-text-3 mb-3">Auto-knock (Port Knocking automático) + conexão SSH em sequência.</p>
            <a
              href="/scripts/entrar.sh"
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-ok/10 hover:bg-ok/20 border border-ok/30 rounded-lg text-xs font-bold text-ok transition-all"
            >
              ⬇ Baixar entrar.sh
            </a>
          </div>
          <div className="p-4 rounded-lg bg-bg-3 border border-border">
            <h3 className="font-bold text-sm mb-2">knock-monitor.sh</h3>
            <p className="text-xs text-text-3 mb-3">Monitora a lista <code>/proc/net/xt_recent</code> em tempo real com watch.</p>
            <a
              href="/scripts/knock-monitor.sh"
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-ok/10 hover:bg-ok/20 border border-ok/30 rounded-lg text-xs font-bold text-ok transition-all"
            >
              ⬇ Baixar knock-monitor.sh
            </a>
          </div>
          <div className="p-4 rounded-lg bg-bg-3 border border-err/20">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
              <span aria-hidden="true">🆘</span> resgate-gold.sh
            </h3>
            <p className="text-xs text-text-3 mb-3">
              <strong className="text-err">Botão de Pânico</strong> — restaura o firewall para estado estável com SSH garantido.
            </p>
            <a
              href="/scripts/resgate-gold.sh"
              download
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-err/10 hover:bg-err/20 border border-err/30 rounded-lg text-xs font-bold text-err transition-all"
            >
              ⬇ Baixar resgate-gold.sh
            </a>
          </div>
        </div>
      </div>

      {/* DevOps & Infraestrutura Moderna */}
      <section id="devops" className="mt-8 p-6 rounded-xl bg-bg-2 border border-border">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Server size={20} className="text-accent" aria-hidden="true" />
          DevOps &amp; Infraestrutura Moderna — Workflows de Referência
        </h2>
        <p className="text-sm text-text-2 mb-6">
          Workflows completos para os módulos v3.0–v5.0. Do container ao cluster, do playbook ao pipeline.
        </p>

        {/* Docker Compose */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🐳</span> Docker Compose — Ciclo Completo
          </h3>
          <CodeBlock lang="bash" code={`# Subir stack (build + start em background)
docker compose up -d --build

# Ver status dos serviços
docker compose ps

# Seguir logs de um serviço específico
docker compose logs -f nginx

# Escalar serviço horizontalmente
docker compose up -d --scale app=3

# Executar comando em container rodando
docker exec -it $(docker compose ps -q app) bash

# Parar e remover containers + redes (preserva volumes)
docker compose down

# Parar e remover TUDO (containers + redes + volumes)
docker compose down -v

# Inspecionar rede criada pelo Compose
docker network inspect projeto_backend`} />
        </div>

        {/* Ansible */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
            <span aria-hidden="true">⚙️</span> Ansible — Ad-hoc + Playbooks
          </h3>
          <CodeBlock lang="bash" code={`# Testar conectividade com todos os hosts
ansible all -m ping -i inventory.ini

# Executar comando ad-hoc em grupo de servidores
ansible webservers -m shell -a "systemctl status nginx" -i inventory.ini

# Instalar pacote em todos os hosts (com sudo)
ansible all -m apt -a "name=nginx state=present" -b -i inventory.ini

# Dry-run: ver o que o playbook mudaria (sem aplicar)
ansible-playbook -i inventory.ini playbook.yml --check --diff

# Executar playbook com vault (pede senha interativa)
ansible-playbook -i inventory.ini playbook.yml --ask-vault-pass

# Limitar execução a um host específico
ansible-playbook -i inventory.ini playbook.yml --limit servidor-web-01

# Rodar apenas as tasks com tag "nginx"
ansible-playbook -i inventory.ini playbook.yml --tags nginx`} />
        </div>

        {/* kubectl */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
            <span aria-hidden="true">☸️</span> kubectl — Operações Essenciais
          </h3>
          <CodeBlock lang="bash" code={`# Ver todos os recursos no namespace
kubectl get all -n producao

# Aplicar/atualizar manifesto declarativo
kubectl apply -f deployment.yaml

# Detalhar eventos de um pod (debug de CrashLoopBackOff)
kubectl describe pod nome-do-pod -n producao

# Seguir logs em tempo real
kubectl logs -f deployment/minha-app -n producao

# Abrir shell em pod rodando
kubectl exec -it pod/nome -n producao -- bash

# Escalar deployment
kubectl scale deployment minha-app --replicas=3 -n producao

# Rollback para versão anterior
kubectl rollout undo deployment/minha-app -n producao

# Ver histórico de rollouts
kubectl rollout history deployment/minha-app -n producao

# Port-forward para testar localmente
kubectl port-forward svc/minha-app 8080:80 -n producao`} />
        </div>

        {/* Terraform */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🏗️</span> Terraform — Fluxo IaC
          </h3>
          <CodeBlock lang="bash" code={`# Inicializar providers e backend
terraform init

# Formatar código HCL automaticamente
terraform fmt -recursive

# Validar sintaxe dos arquivos .tf
terraform validate

# Planejar mudanças e salvar em arquivo
terraform plan -out=tfplan

# Aplicar exatamente o plano salvo
terraform apply tfplan

# Listar recursos gerenciados no state
terraform state list

# Ver detalhes de um recurso no state
terraform state show aws_instance.web

# Importar recurso existente para o state
terraform import aws_instance.web i-0abc123def456

# Destruir TODA a infraestrutura gerenciada
terraform destroy

# Usar workspace para ambientes separados
terraform workspace new staging
terraform workspace select staging`} />
          <WarnBox title="terraform destroy é irreversível">
            <p className="text-sm text-text-2">
              Sempre rode <code>terraform plan</code> antes de <code>destroy</code> para confirmar o que será removido.
              Em produção, use <code>prevent_destroy = true</code> no lifecycle de recursos críticos.
            </p>
          </WarnBox>
        </div>

        {/* CI/CD GitHub Actions */}
        <div className="mb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🚀</span> GitHub Actions — CLI de Observabilidade
          </h3>
          <CodeBlock lang="bash" code={`# Listar workflows do repositório
gh workflow list

# Ver últimas execuções de um workflow
gh run list --workflow=ci.yml --limit 10

# Ver logs de uma execução específica
gh run view RUN_ID --log

# Disparar workflow manualmente (workflow_dispatch)
gh workflow run ci.yml --ref main

# Cancelar execução em andamento
gh run cancel RUN_ID

# Ver segredos do repositório (apenas nomes, não valores)
gh secret list

# Definir segredo via CLI
gh secret set DEPLOY_KEY < ~/.ssh/id_ed25519

# Listar environments e seus status
gh api repos/:owner/:repo/environments | jq '.environments[].name'`} />
        </div>
      </section>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/cheat-sheet" />
    </div>
  );
}
