'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { Server, Network, BookOpen, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const CHECKLIST_ITEMS = [
  { id: 'dhcp-instalado', label: 'Instalei isc-dhcp-server e configurei a interface LAN corretamente em /etc/default/isc-dhcp-server' },
  { id: 'dhcp-subnet',    label: 'Configurei subnet, range e opções DNS/gateway no dhcpd.conf e testei com um cliente real' },
  { id: 'dhcp-reserva',   label: 'Criei reserva por MAC address para um servidor na LAN e confirmei o IP fixo atribuído' },
];

export default function DhcpPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/dhcp');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-dhcp min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Servidores</span>
          <span>/</span>
          <span className="text-text-2">Servidor DHCP</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo S01 · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">🌐 Servidor DHCP</h1>
          <p className="text-text-2 text-lg mb-6">
            isc-dhcp-server · dhcpd.conf · reservas por MAC · leases — distribua IPs na LAN automaticamente
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: DORA — Como o DHCP funciona"
          steps={[
            { label: 'Discover',  sub: 'cliente envia broadcast "quem é o servidor DHCP?"', icon: <Network size={14}/>,  color: 'border-info/50' },
            { label: 'Offer',     sub: 'servidor responde: "use o IP 192.168.1.50"',          icon: <Server size={14}/>,  color: 'border-accent/50' },
            { label: 'Request',   sub: 'cliente confirma: "aceito o IP 192.168.1.50"',        icon: <Network size={14}/>, color: 'border-ok/50' },
            { label: 'Ack',       sub: 'servidor confirma e registra no dhcpd.leases',        icon: <BookOpen size={14}/>, color: 'border-warn/50' },
          ]}
        />

        {/* 1. Instalação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Instalação e Configuração Inicial</h2>

          <CodeBlock lang="bash" code={`# Instalar o ISC DHCP Server
sudo apt update
sudo apt install isc-dhcp-server

# Verificar status (esperado: falha na primeira vez — ainda não configurado)
sudo systemctl status isc-dhcp-server`} />

          <InfoBox title="Qual interface o DHCP deve escutar?">
            <p className="text-sm text-text-2 mb-2">
              O servidor DHCP deve responder <strong>somente na interface LAN</strong> (ex: <code>eth1</code> ou <code>enp3s0</code>).
              Nunca na WAN — isso causaria conflito com o roteador do seu provedor.
            </p>
            <p className="text-sm text-text-2">
              No lab com 3 zonas: WAN (<code>eth0</code>), DMZ (<code>eth1</code>), LAN (<code>eth2</code>) — configure apenas <code>eth2</code>.
            </p>
          </InfoBox>

          <CodeBlock lang="bash" code={`# Definir a interface que o DHCP vai escutar
sudo nano /etc/default/isc-dhcp-server`} />

          <CodeBlock lang="bash" code={`# /etc/default/isc-dhcp-server
# Linha a editar — coloque a interface da LAN:
INTERFACESv4="eth2"
# Se tiver múltiplas interfaces LAN:
# INTERFACESv4="eth2 eth3"`} />
        </section>

        {/* 2. dhcpd.conf */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Configuração do dhcpd.conf</h2>

          <CodeBlock lang="bash" code={`sudo nano /etc/dhcp/dhcpd.conf`} />

          <CodeBlock lang="bash" code={`# /etc/dhcp/dhcpd.conf — configuração básica

# Parâmetros globais
default-lease-time 600;      # tempo de concessão padrão: 10 minutos
max-lease-time 7200;         # tempo máximo de concessão: 2 horas
authoritative;               # este é o servidor DHCP autoritativo da rede

# Servidor DNS que os clientes vão usar
option domain-name-servers 192.168.1.1, 8.8.8.8;
option domain-name "lan.local";

# ── Declaração da Subnet ──────────────────────────────
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.50 192.168.1.200;      # pool de IPs disponíveis
    option routers 192.168.1.1;             # gateway padrão (o firewall)
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.1.255;
}`} />

          <CodeBlock lang="bash" code={`# Testar a sintaxe do arquivo de configuração:
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf
# Saída esperada: "Wrote 0 leases to leases file."

# Iniciar e habilitar o serviço:
sudo systemctl restart isc-dhcp-server
sudo systemctl enable isc-dhcp-server
sudo systemctl status isc-dhcp-server`} />

          <WarnBox title="O serviço não sobe? Cheque o log">
            <CodeBlock lang="bash" code={`# Ver o motivo do erro:
sudo journalctl -u isc-dhcp-server -n 50

# Erros comuns:
# "No subnet declaration for eth0" → a interface declarada não tem subnet configurada
# "Can't open /etc/dhcp/dhcpd.conf" → erro de sintaxe — rodar dhcpd -t primeiro`} />
          </WarnBox>
        </section>

        {/* 3. Reservas por MAC */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Reservas por MAC Address — IP Fixo sem IP Estático</h2>

          <p className="text-text-2 mb-4">
            Reservas garantem que um dispositivo específico <strong>sempre receba o mesmo IP</strong>
            via DHCP — sem configurar IP estático no cliente. Ideal para servidores, impressoras e câmeras.
          </p>

          <CodeBlock lang="bash" code={`# /etc/dhcp/dhcpd.conf — adicionar reservas dentro ou fora da subnet

subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.50 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 192.168.1.1;

    # Reserva para o servidor web (DMZ interna)
    host web-server {
        hardware ethernet 00:11:22:33:44:55;   # MAC do servidor
        fixed-address 192.168.1.10;             # IP reservado
    }

    # Reserva para a impressora
    host impressora-rh {
        hardware ethernet aa:bb:cc:dd:ee:ff;
        fixed-address 192.168.1.11;
    }

    # Reserva para câmera IP
    host camera-entrada {
        hardware ethernet 11:22:33:44:55:66;
        fixed-address 192.168.1.12;
    }
}`} />

          <CodeBlock lang="bash" code={`# Como descobrir o MAC de um dispositivo na rede:

# No próprio dispositivo Linux:
ip link show eth0
# ou:
cat /sys/class/net/eth0/address

# Via ARP (após o dispositivo pingar o gateway):
arp -n | grep 192.168.1.50

# Via nmap (scan da rede):
sudo nmap -sn 192.168.1.0/24`} />
        </section>

        {/* 4. Leases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Gerenciando Concessões (Leases)</h2>

          <p className="text-text-2 mb-4">
            O arquivo <code>/var/lib/dhcp/dhcpd.leases</code> é o banco de dados de concessões ativas.
            Cada entrada mostra quem está usando qual IP e até quando.
          </p>

          <CodeBlock lang="bash" code={`# Ver todas as concessões ativas:
cat /var/lib/dhcp/dhcpd.leases`} />

          <CodeBlock lang="bash" code={`# Saída típica de uma concessão:
lease 192.168.1.53 {
  starts 5 2026/04/25 18:30:00;
  ends 5 2026/04/25 18:40:00;
  binding state active;
  next binding state free;
  hardware ethernet 08:00:27:ab:cd:ef;
  client-hostname "pc-joao";
}`} />

          <CodeBlock lang="bash" code={`# Monitorar concessões em tempo real:
sudo journalctl -u isc-dhcp-server -f

# Saída esperada ao receber um cliente:
# Apr 25 18:30:01 firewall dhcpd: DHCPDISCOVER from 08:00:27:ab:cd:ef via eth2
# Apr 25 18:30:01 firewall dhcpd: DHCPOFFER on 192.168.1.53 to 08:00:27:ab:cd:ef
# Apr 25 18:30:01 firewall dhcpd: DHCPREQUEST for 192.168.1.53 from 08:00:27:ab:cd:ef
# Apr 25 18:30:01 firewall dhcpd: DHCPACK on 192.168.1.53 to 08:00:27:ab:cd:ef

# Forçar renovação no cliente Linux (para testar):
sudo dhclient -r eth0   # libera IP atual
sudo dhclient eth0      # solicita novo IP`} />
        </section>

        {/* 5. Firewall */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Integração com iptables</h2>

          <p className="text-text-2 mb-4">
            O DHCP usa as portas UDP 67 (servidor) e 68 (cliente). Em redes com iptables restritivo,
            essas portas devem ser explicitamente liberadas.
          </p>

          <CodeBlock lang="bash" code={`# Liberar DHCP na interface LAN (eth2):
sudo iptables -A INPUT -i eth2 -p udp --dport 67 -j ACCEPT
sudo iptables -A OUTPUT -o eth2 -p udp --sport 67 -j ACCEPT

# Verificar:
sudo iptables -L INPUT -n -v | grep 67

# Por que o DHCP funciona mesmo com DROP default?
# O DHCPDISCOVER é um broadcast para 255.255.255.255 — não passa pelo FORWARD,
# apenas pelo INPUT do servidor. A regra acima é suficiente.`} />

          <InfoBox title="DHCP Relay — DHCP atravessando roteadores">
            <p className="text-sm text-text-2 mb-2">
              Por padrão, broadcasts DHCP não atravessam roteadores. Em redes com múltiplas VLANs/subnets,
              o <strong>DHCP Relay Agent</strong> (<code>isc-dhcp-relay</code>) encaminha as requisições para o servidor central:
            </p>
            <CodeBlock lang="bash" code={`sudo apt install isc-dhcp-relay
# Configurar em /etc/default/isc-dhcp-relay:
# SERVERS="192.168.1.1"   → IP do servidor DHCP central
# INTERFACES="eth1 eth2"  → interfaces para escutar e encaminhar`} />
          </InfoBox>
        </section>

        {/* 6. Troubleshooting */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Diagnóstico e Troubleshooting</h2>

          <CodeBlock lang="bash" code={`# 1. Verificar se o serviço está rodando:
sudo systemctl status isc-dhcp-server

# 2. Verificar se está escutando na porta 67:
sudo ss -ulnp | grep 67

# 3. Capturar tráfego DHCP com tcpdump:
sudo tcpdump -i eth2 -n port 67 or port 68
# BOOTP Request = DISCOVER ou REQUEST do cliente
# BOOTP Reply   = OFFER ou ACK do servidor

# 4. Testar configuração manualmente:
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf

# 5. Forçar cliente a pegar novo IP:
sudo dhclient -r && sudo dhclient eth0

# 6. Ver log completo do último boot do serviço:
sudo journalctl -u isc-dhcp-server -b`} />

          <WindowsComparisonBox
            windowsLabel="Windows Server"
            linuxLabel="Linux (isc-dhcp-server)"
            windowsCode={`# GUI: Server Manager → DHCP
# Add Role → DHCP Server

# Configurar scope via wizard:
# New Scope → nome, range, exclusões
# Opção 3 = Router (gateway)
# Opção 6 = DNS Servers
# Opção 15 = Domain Name

# Reservas: IPv4 → Reservations
# MAC: 00-11-22-33-44-55
# (formato com hífens)

# Leases: DHCP → Address Leases
# Exportar: netsh dhcp server export

# Log: Visualizador de Eventos
# → DHCP Server`}
            linuxCode={`# CLI: apt install isc-dhcp-server
# Arquivo: /etc/dhcp/dhcpd.conf

# Configurar subnet no arquivo:
# subnet 192.168.1.0 netmask ... {
#     range 192.168.1.50 .200;
#     option routers 192.168.1.1;
#     option domain-name-servers ...;
# }

# Reservas:
# host pc-joao {
#     hardware ethernet 00:11:22:33:44:55;
#     fixed-address 192.168.1.20;
# }
# (formato com dois pontos)

# Leases: /var/lib/dhcp/dhcpd.leases
# Log: journalctl -u isc-dhcp-server`}
          />
        </section>

        {/* Exercícios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧪 Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 1 — Servidor DHCP Básico</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Instale: <code>sudo apt install isc-dhcp-server</code></li>
                <li>Configure <code>/etc/default/isc-dhcp-server</code>: <code>INTERFACESv4=&quot;eth2&quot;</code></li>
                <li>Configure <code>/etc/dhcp/dhcpd.conf</code> com subnet 192.168.1.0/24, range .50-.200</li>
                <li>Adicione routers 192.168.1.1 e domain-name-servers 8.8.8.8</li>
                <li>Reinicie: <code>sudo systemctl restart isc-dhcp-server</code></li>
                <li>Conecte um cliente à LAN e verifique: <code>ip addr show</code> — IP no range configurado?</li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 2 — Reserva por MAC</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>No cliente, anote o MAC: <code>ip link show eth0</code></li>
                <li>No servidor, adicione o bloco <code>host</code> no dhcpd.conf com o MAC e IP fora do range dinâmico</li>
                <li>Valide: <code>sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf</code></li>
                <li>Reinicie o servidor DHCP</li>
                <li>No cliente: <code>sudo dhclient -r eth0 &amp;&amp; sudo dhclient eth0</code></li>
                <li>Confirme que o cliente recebeu o IP reservado: <code>ip addr show eth0</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 3 — Monitorar com tcpdump + journalctl</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>No servidor: <code>sudo tcpdump -i eth2 -n port 67 or port 68 &amp;</code></li>
                <li>Em outro terminal: <code>sudo journalctl -u isc-dhcp-server -f &amp;</code></li>
                <li>No cliente: force renovação: <code>sudo dhclient -r eth0; sudo dhclient eth0</code></li>
                <li>Observe no tcpdump o DISCOVER → OFFER → REQUEST → ACK</li>
                <li>Confirme no journalctl as 4 linhas de log correspondentes</li>
                <li>Verifique o lease criado: <code>sudo cat /var/lib/dhcp/dhcpd.leases</code></li>
              </ol>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">✅ Checklist do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <div className="flex items-start gap-2">
                  {checklist[item.id]
                    ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" />
                    : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
                  <span className="text-sm text-text-2">{item.label}</span>
                </div>
              </label>
            ))}
          </div>
          {CHECKLIST_ITEMS.every(i => checklist[i.id]) && (
            <div className="mt-4 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <span className="text-ok font-bold">🌐 Badge dhcp-master desbloqueado!</span>
              <p className="text-sm text-text-2 mt-1">Sua LAN agora distribui IPs automaticamente — exatamente como em produção.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle size={22} className="text-warn" /> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'isc-dhcp-server fails to start: No subnet declaration for eth0',
              fix: 'O arquivo /etc/default/isc-dhcp-server define a interface, mas dhcpd.conf não tem subnet para ela. Adicionar o bloco subnet correspondente ao IP da interface LAN (ex: 192.168.1.0/24). Verificar: ip a para confirmar o IP da interface.',
            },
            {
              err: 'Clientes recebem IP mas não conseguem acessar a internet',
              fix: 'DNS ou gateway incorreto no dhcpd.conf. Verificar option routers (IP do firewall/gateway) e option domain-name-servers. Testar: ping 8.8.8.8 no cliente (rede), depois ping google.com (DNS). Um falha → problema diferente.',
            },
            {
              err: 'Reserva de MAC não funciona — cliente recebe IP do pool dinâmico',
              fix: 'Endereço MAC no dhcpd.conf deve estar em minúsculas com ":" (aa:bb:cc:dd:ee:ff). Verificar o MAC real do cliente: ip link show | grep ether. Após corrigir, reiniciar o serviço e o cliente.',
            },
            {
              err: 'Cliente fica com IP antigo após reconfigurar o servidor DHCP',
              fix: 'O lease ainda é válido. No cliente: dhclient -r (release) && dhclient (renew). No servidor, verificar /var/lib/dhcp/dhcpd.leases para ver leases ativos. Reduzir default-lease-time durante testes (ex: 120 segundos).',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        <ModuleNav currentPath="/dhcp" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
