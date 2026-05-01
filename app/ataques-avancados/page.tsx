'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ShieldAlert, Zap, Terminal, Info, AlertTriangle, ShieldCheck, Bug, Clock, Globe, Network, Radio, Circle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

const CHECKLIST = [
  { id: 'ataques-recon',   text: 'Entendeu técnicas de reconhecimento: nmap, fragmentação e DNS rebinding' },
  { id: 'ataques-syn',     text: 'Configurou proteção contra SYN flood com connlimit e SYN cookies' },
  { id: 'ataques-arp',     text: 'Compreendeu ARP spoofing e aplicou defesa com arptables/entradas estáticas' },
];

const attacks = [
  {
    id: 'recon',
    title: 'Reconhecimento com nmap',
    icon: <Radio className="text-info" />,
    concept: 'Antes de qualquer exploração, o atacante mapeia a rede. nmap identifica hosts ativos, portas abertas, versões de serviços e sistema operacional — tudo sem precisar de acesso privilegiado.',
    mitigation: 'Rate limiting por IP (hashlimit), iptables DROP de pacotes SYN em excesso, Fail2ban com filtro nmap, honeypot de portas falsas para detectar scanners.',
    code: `# Do ponto de vista do ATACANTE (para entender o que defender):
# Scan SYN furtivo (requer root)
nmap -sS -p 1-65535 192.168.57.10

# Detecção de OS e versões de serviço
nmap -O -sV 192.168.57.0/24

# DEFESA — rate-limit no iptables (máx 10 pacotes/seg por IP):
iptables -A INPUT -p tcp --syn -m hashlimit \\
  --hashlimit-above 10/sec \\
  --hashlimit-burst 20 \\
  --hashlimit-mode srcip \\
  --hashlimit-name syn-scan \\
  -j DROP

# DEFESA — Fail2ban com filtro para nmap:
# /etc/fail2ban/filter.d/portscan.conf
# failregex = <HOST> .*SYN.*
# bantime = 3600`,
  },
  {
    id: 'fragmentation',
    title: 'Fragmentação de Pacotes',
    icon: <Bug className="text-err" />,
    concept: 'Dividir um pacote malicioso em fragmentos tão pequenos que o IDS/Firewall não consegue remontar para analisar a assinatura — mas o destino final remonta e executa o payload.',
    mitigation: 'Ativar remontagem de fragmentos antes da inspeção (net.ipv4.ipfrag_high_thresh). O conntrack/netfilter do Linux já remonta automaticamente para firewall stateful. Firewalls legacy sem estado são vulneráveis.',
    code: `# ATAQUE — nmap com fragmentação:
nmap -f --mtu 8 192.168.57.10

# DEFESA — sysctl para controle de fragmentação:
# Limitar fragmentos pendentes na memória
sysctl -w net.ipv4.ipfrag_high_thresh=262144
sysctl -w net.ipv4.ipfrag_low_thresh=196608
sysctl -w net.ipv4.ipfrag_time=30

# Bloquear fragmentos inválidos com iptables:
iptables -A INPUT -f -j DROP         # descarta fragmentos
iptables -A INPUT -m conntrack \\
  --ctstate INVALID -j DROP          # descarta estado inválido`,
  },
  {
    id: 'syn-flood',
    title: 'SYN Flood (DDoS)',
    icon: <Zap className="text-err" />,
    concept: 'O atacante envia milhares de pacotes SYN por segundo sem completar o handshake TCP. A tabela de conexões semi-abertas do servidor esgota a memória, recusando conexões legítimas.',
    mitigation: 'SYN Cookies (net.ipv4.tcp_syncookies=1) — o kernel não aloca estado até o cliente confirmar o handshake. connlimit e hashlimit no iptables limitam conexões simultâneas por IP.',
    code: `# Ativar SYN cookies no kernel (ESSENCIAL):
sysctl -w net.ipv4.tcp_syncookies=1
# Tornar permanente em /etc/sysctl.conf:
echo "net.ipv4.tcp_syncookies = 1" >> /etc/sysctl.conf

# Limitar novas conexões por IP com connlimit:
iptables -A INPUT -p tcp --syn \\
  -m connlimit --connlimit-above 20 \\
  -j REJECT --reject-with tcp-reset

# Rate limit de SYN por IP com hashlimit:
iptables -A INPUT -p tcp --syn \\
  -m hashlimit --hashlimit-above 25/sec \\
  --hashlimit-burst 50 --hashlimit-mode srcip \\
  --hashlimit-name syn-flood -j DROP

# Verificar efetividade:
ss -s        # mostra estado das conexões TCP
watch -n1 'netstat -an | grep SYN_RECV | wc -l'`,
  },
  {
    id: 'arp-spoofing',
    title: 'ARP Spoofing / MITM na LAN',
    icon: <Network className="text-warn" />,
    concept: 'Na mesma LAN, o atacante envia respostas ARP forjadas afirmando que seu MAC é o do gateway. O tráfego da vítima passa pelo atacante antes do roteador — MITM completo sem quebrar criptografia fraca.',
    mitigation: 'Entradas ARP estáticas para hosts críticos (gateway, servidor DNS). arptables para bloquear respostas ARP não solicitadas. Switches gerenciados com Dynamic ARP Inspection (DAI). 802.1X para autenticação de porta.',
    code: `# ATAQUE — envenenar cache ARP (requer arping ou arpspoof):
# arpspoof -i eth0 -t 192.168.1.10 192.168.1.1
# (dizendo para 192.168.1.10 que o IP .1 tem nosso MAC)

# DEFESA — ARP estático para o gateway (previne envenenamento):
ip neigh add 192.168.1.1 lladdr aa:bb:cc:dd:ee:ff \\
  dev eth0 nud permanent

# Listar entradas ARP estáticas configuradas:
ip neigh show

# DEFESA — arptables para bloquear ARP não solicitado:
apt install arptables -y
arptables -A INPUT -s 0.0.0.0/0 \\
  ! --source-mac aa:bb:cc:dd:ee:ff -j DROP

# Detectar ARP spoofing em progresso:
arp -a                     # ver cache ARP
ip -s neigh show           # ver estatísticas
tcpdump -i eth0 arp        # capturar pacotes ARP`,
  },
  {
    id: 'timing',
    title: 'Timing Attack no Port Knocking',
    icon: <Clock className="text-warn" />,
    concept: 'Análise do tempo de resposta do firewall para diferentes sequências de knock. Portas em estado "escutando" respondem diferente de portas completamente descartadas — vaza informação da sequência válida.',
    mitigation: 'Garantir tempo de processamento constante para todas as tentativas (Constant Time). Usar SPA (Single Packet Authorization) com HMAC em vez de sequência simples. Janela de tempo mínima (1-2 segundos entre knocks).',
    code: `# DEFESA — Port Knocking com HMAC via knockd:
# /etc/knockd.conf com SHA-256 HMAC
[options]
  logfile = /var/log/knockd.log

[openSSH]
  sequence = 7000,8000,9000
  seq_timeout = 5         # máximo 5s entre cada knock
  command = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
  tcpflags = syn

# Alternativa mais segura: fwknop (Single Packet Auth)
# Um único pacote UDP/ICMP cifrado com HMAC-SHA256
# Sem sequência de portas → sem timing analysis
apt install fwknop-server fwknop-client`,
  },
  {
    id: 'dns-rebinding',
    title: 'DNS Rebinding',
    icon: <Globe className="text-accent" />,
    concept: 'Site malicioso usa TTL de 1 segundo: primeiro resolve para o IP do atacante, depois muda para 127.0.0.1 ou IP da LAN. O browser do usuário passa a fazer requisições para a rede interna — bypass do same-origin policy.',
    mitigation: 'Validar o header "Host" no proxy e no web server. DNS Pinning no browser. Configurar resolvers locais para não resolver IPs privados em respostas externas (rebind-localhost-ok=no no dnsmasq). Pi-hole bloqueia muitos domínios de rebinding.',
    code: `# DEFESA — dnsmasq com bloqueio de DNS rebinding:
# /etc/dnsmasq.conf
stop-dns-rebind             # bloqueia IPs RFC1918 de servidores externos
rebind-localhost-ok         # mas permite 127.0.0.1 local

# DEFESA — Nginx: validar o header Host:
server {
  listen 80 default_server;
  return 444;  # Conexão fechada sem resposta para hosts desconhecidos
}
server {
  listen 80;
  server_name meudominio.com www.meudominio.com;
  # ... configuração normal
}

# DEFESA — Squid: bloquear requisições sem Host válido:
acl valid_sites dstdomain .meudominio.com
http_access deny !valid_sites`,
  },
];

export default function AdvancedAttacksPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('ataques-avancados');
  }, [trackPageVisit]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-ataques-avancados">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Ataques Avançados</span>
      </div>

      <div className="section-label">Nível Profissional</div>
      <h1 className="section-title">Ataques Avançados na Topologia</h1>
      <p className="section-sub">
        Para ser um profissional de segurança, você precisa pensar como um atacante.
        Entenda como burlar proteções básicas e como implementar defesas robustas.
      </p>

      {/* Aviso ético */}
      <WarnBox title="Uso Ético — Pentest Autorizado">
        Este módulo descreve técnicas de ataque para fins <strong>exclusivamente defensivos e educacionais</strong>.
        Nunca execute ataques em redes ou sistemas sem autorização expressa por escrito.
        O uso não autorizado dessas técnicas é crime (Lei 12.737/2012 — Lei Carolina Dieckmann).
      </WarnBox>

      {/* Kill Chain */}
      <div className="mt-8">
        <FluxoCard
          title="Cyber Kill Chain — Cadeia de Ataque"
          steps={[
            { label: 'Reconhecimento', sub: 'nmap, OSINT, shodan', icon: <Radio size={14} />, color: 'border-info/50' },
            { label: 'Varredura', sub: 'ports, versions, OS', icon: <Radio size={14} />, color: 'border-warn/50' },
            { label: 'Exploração', sub: 'CVE, misconfig, brute', icon: <Bug size={14} />, color: 'border-err/50' },
            { label: 'Persistência', sub: 'backdoor, cron, SSH key', icon: <Terminal size={14} />, color: 'border-err/50' },
            { label: 'Mov. Lateral', sub: 'pivot DMZ → LAN', icon: <Network size={14} />, color: 'border-err/50' },
            { label: 'Exfiltração', sub: 'DNS tunnel, HTTPS C2', icon: <Globe size={14} />, color: 'border-err/50' },
          ]}
        />
      </div>

      {/* Cards de Ataque */}
      <div className="grid grid-cols-1 gap-10 mt-10">
        {attacks.map((attack, idx) => (
          <motion.section
            key={attack.id}
            id={attack.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="bg-bg-2 border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 md:p-8 border-b border-border bg-bg-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg-2 border border-border flex items-center justify-center shadow-inner">
                {attack.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{attack.title}</h2>
                <div className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Ataque &amp; Defesa</div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-accent mb-2 flex items-center gap-2">
                    <Info size={16} />
                    O Conceito
                  </h3>
                  <p className="text-text-2 text-sm leading-relaxed">{attack.concept}</p>
                </div>
                <div className="p-4 rounded-lg bg-ok/5 border border-ok/20">
                  <h3 className="text-sm font-bold text-ok mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Como Mitigar
                  </h3>
                  <p className="text-text-2 text-xs leading-relaxed">{attack.mitigation}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Terminal size={14} />
                  Ataque &amp; Defesa na Prática
                </h3>
                <CodeBlock lang="bash" code={attack.code} />
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* WindowsComparisonBox */}
      <div className="mt-10">
        <WindowsComparisonBox
          windowsLabel="Windows Defender ATP / Microsoft Sentinel"
          linuxLabel="iptables + Fail2ban + tcpdump"
          windowsCode={`# Windows — defesa passiva via GUI:
- Windows Defender Firewall (bloquear por porta/app)
- Microsoft Defender ATP (detecção comportamental)
- Microsoft Sentinel (SIEM cloud)
- Event Viewer → Security Log (audit)
- netstat -an (ver conexões)
- IPsec Policies (criptografia interna)`}
          linuxCode={`# Linux — defesa ativa via CLI:
# Bloquear scan (hashlimit):
iptables -A INPUT -p tcp --syn \\
  -m hashlimit --hashlimit-above 15/sec \\
  --hashlimit-name scan -j DROP

# SYN cookies (anti-SYN flood):
sysctl -w net.ipv4.tcp_syncookies=1

# Capturar tráfego suspeito:
tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0'

# Ban automático com Fail2ban:
fail2ban-client status sshd`}
        />
      </div>

      {/* Seção: Análise de Tráfego com tcpdump */}
      <section id="analise" className="mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <ShieldAlert className="text-warn" size={24} />
          Analisar Ataques em Tempo Real com tcpdump
        </h2>
        <InfoBox title="tcpdump é a câmera de segurança da rede">
          Quando um ataque acontece, você precisa de evidências. tcpdump captura pacotes em tempo real
          e salva em formato PCAP para análise no Wireshark.
        </InfoBox>
        <div className="mt-4">
          <CodeBlock lang="bash" code={`# Capturar todo tráfego TCP na interface de WAN:
tcpdump -i eth0 -nn -w ataque.pcap

# Filtrar apenas SYN flood (conexões novas em excesso):
tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0 and not tcp-ack'

# Ver tentativas de port scan (muitas portas em sequência):
tcpdump -i eth0 -nn 'tcp and not port 22 and not port 80 and not port 443'

# Detectar ARP spoofing (múltiplas respostas ARP):
tcpdump -i eth0 arp

# Análise posterior com o PCAP gerado:
# tcpdump -r ataque.pcap -nn | grep "192.168.57."
# Abrir no Wireshark: Statistics > I/O Graphs, Protocol Hierarchy`} />
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="mt-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <ShieldCheck className="text-ok" size={24} />
          Checklist do Lab — Ataques Avançados
        </h2>
        <div className="space-y-3">
          {CHECKLIST.map(item => (
            <label
              key={item.id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                checklist[item.id]
                  ? 'bg-ok/5 border-ok/30'
                  : 'bg-bg-2 border-border hover:border-accent/30',
              )}
            >
              <button
                type="button"
                onClick={() => updateChecklist(item.id, !checklist[item.id])}
                className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                aria-label={checklist[item.id] ? 'Desmarcar checkpoint' : 'Marcar checkpoint'}
              >
                {checklist[item.id]
                  ? <CheckCircle2 className="text-ok" size={22} />
                  : <Circle className="text-text-3" size={22} />}
              </button>
              <span className={cn('text-sm font-medium', checklist[item.id] ? 'line-through text-text-3' : 'text-text')}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-accent/5 border border-accent/20 text-center">
        <Zap className="text-accent mx-auto mb-4" size={32} />
        <h3 className="text-xl font-bold mb-2">Pronto para o Próximo Nível?</h3>
        <p className="text-text-2 text-sm max-w-2xl mx-auto mb-8">
          Entendeu os ataques, agora aprenda como um invasor usa um servidor comprometido na DMZ
          para atacar toda a rede interna — e como impedir isso.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/pivoteamento" className="btn-primary px-8 py-3">Próximo: Pivoteamento</Link>
          <Link href="/quiz" className="btn-outline px-8 py-3">Testar no Quiz</Link>
        </div>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/ataques-avancados" />
    </div>
  );
}
