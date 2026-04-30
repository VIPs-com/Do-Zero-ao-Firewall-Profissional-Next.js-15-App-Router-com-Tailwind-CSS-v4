'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Shield, Globe, Zap, Settings, Lock, ChevronLeft, ChevronRight,
  Server, Network, AlertTriangle, CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'opnsense-instalado',
    text: 'OPNsense instalado e interfaces WAN/LAN/DMZ configuradas',
    sub: 'ISO baixado, VM criada com 3 NICs, boot completo, acesso à Web UI em https://192.168.1.1',
  },
  {
    id: 'opnsense-regras',
    text: 'Regras de firewall e NAT configuradas via GUI',
    sub: 'Aliases criados, regras LAN→WAN permitidas, DNAT (Port Forward) para servidor DMZ testado',
  },
  {
    id: 'opnsense-vpn',
    text: 'VPN e IDS/IPS habilitados no OPNsense',
    sub: 'WireGuard ou OpenVPN configurado via wizard + plugin Suricata instalado com regras Emerging Threats',
  },
];

const commonErrors = [
  {
    title: 'Web UI inacessível após instalação',
    detail: 'Por padrão a Web UI responde apenas na interface LAN (192.168.1.1). Se sua VM não tem a interface LAN corretamente mapeada para uma rede interna, você não acessa. Verifique a ordem das NICs no VirtualBox/KVM: em0 = WAN, em1 = LAN. No console do OPNsense, opção 2 "Set interface IP address" permite resetar o IP da LAN.',
  },
  {
    title: 'Regra criada mas tráfego ainda bloqueado',
    detail: 'No OPNsense, regras de firewall são avaliadas por interface no sentido de ENTRADA (ingress). Uma regra na interface LAN controla o que sai da LAN. O estado padrão é "block all" — não existe "deny" explícito, tudo que não tem ALLOW é bloqueado. Certifique-se que a regra está na interface correta e com origem/destino corretos.',
  },
  {
    title: 'NAT (Port Forward) configurado mas não funciona',
    detail: 'Dois pontos de atenção: (1) Em Firewall → NAT → Port Forward, ao criar o forward, marque "Add associated filter rule" — sem essa regra associada, o pacote é redirecionado mas bloqueado no filtro. (2) O servidor de destino precisa ter o OPNsense como gateway padrão, senão a resposta não volta pelo firewall e a conexão fica assimétrica.',
  },
  {
    title: 'Suricata instalado mas não detecta nada',
    detail: 'Verifique: (1) Serviços → Suricata → Interfaces — confirme que a interface WAN está selecionada e o modo IDS ativado; (2) Regras → Download — clique em "Update Rules" para baixar as listas Emerging Threats; (3) Modo IPS requer "Inline IPS" ativado nas configurações e pode impactar performance em hardware modesto. Comece com IDS (apenas detecção) antes de ativar IPS.',
  },
];

export default function OPNsensePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/opnsense');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-opnsense">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Hero */}
        <section className="module-hero space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <LayerBadge layer="Firewall Enterprise · GUI" />
            <span className="text-xs text-text-3 font-mono">Sprint I.23</span>
          </div>
          <h1 className="section-title">OPNsense / pfSense</h1>
          <p className="text-text-2 text-lg leading-relaxed">
            Você aprendeu iptables e nftables linha por linha. Agora veja como tudo isso é empacotado
            num <strong className="text-text">firewall profissional</strong> com GUI, HA, VPN integrada e IDS/IPS
            com um clique — o mesmo nível que protege redes corporativas reais.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              { icon: <Globe size={18}/>, label: 'Web UI', desc: 'Configuração visual — sem digitar uma linha' },
              { icon: <Shield size={18}/>, label: 'IDS/IPS Integrado', desc: 'Suricata via plugin — regras com 1 clique' },
              { icon: <Zap size={18}/>, label: 'Alta Disponibilidade', desc: 'CARP — failover automático entre firewalls' },
            ].map(c => (
              <div key={c.label} className="p-4 rounded-lg border border-border bg-bg-2 flex gap-3">
                <span className="text-[var(--mod)] mt-0.5 shrink-0">{c.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-text">{c.label}</div>
                  <div className="text-xs text-text-3 mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 1 — OPNsense vs pfSense */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">1. OPNsense vs pfSense — qual escolher?</h2>
          <p className="text-text-2">
            Ambos derivam do m0n0wall/FreeBSD e são soluções enterprise maduras. A diferença é filosofia de desenvolvimento e ciclo de releases:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-bg-3 text-text-2">
                <tr>
                  {['Critério', 'OPNsense', 'pfSense CE', 'pfSense Plus'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-semibold border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-text-2">
                {[
                  ['Licença',          'BSD-2 (código aberto)',   'Apache 2.0',           'Proprietária'],
                  ['Releases',         'Bimestrais previsíveis',  'Irregular',            'Regular (NetGate)'],
                  ['UI/UX',            'Moderna, MVC PHP',        'Legada (em migração)',  'Moderna'],
                  ['Plugins',          'OPNsense Ports',          'pfSense Packages',      'pfSense Packages'],
                  ['Suricata/Zeek',    '✅ Plugin oficial',       '✅ Package',           '✅ Package'],
                  ['API REST',         '✅ Nativa v1',            '❌ Limitada',           '✅ Parcial'],
                  ['Recomendação',     '🏆 Lab e produção',       '⚠️ Legado',            '💰 NetGate hardware'],
                ].map(([crit, opn, pf, pfp]) => (
                  <tr key={crit} className="border-b border-border hover:bg-bg-3/50 transition-colors">
                    <td className="px-4 py-2 font-medium text-text">{crit}</td>
                    <td className="px-4 py-2 text-ok">{opn}</td>
                    <td className="px-4 py-2">{pf}</td>
                    <td className="px-4 py-2">{pfp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InfoBox title="Por que OPNsense no nosso lab?">
            Código aberto, releases bimestrais previsíveis, API REST nativa e UI moderna. O mesmo kernel FreeBSD
            do pfSense, mas com desenvolvimento mais ágil. Ideal para aprender sem depender de hardware NetGate.
          </InfoBox>
        </section>

        {/* 2 — Instalação */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">2. Instalação no laboratório virtual</h2>
          <p className="text-text-2">
            OPNsense roda em VirtualBox, KVM ou bare metal. Para o lab, usamos a mesma topologia do workshop:
            3 interfaces (WAN/DMZ/LAN).
          </p>

          <HighlightBox title="🖥️ Requisitos mínimos para o lab">
            RAM: 1 GB (recomendado 2 GB) · Disco: 8 GB · NICs: 3 (WAN + DMZ + LAN)
            · CPU: 1 core (recomendado 2) · ISO: opnsense-XX.X-dvd-amd64.iso (~1 GB)
          </HighlightBox>

          <StepItem
            number={1}
            title="Criar a VM com 3 interfaces de rede"
            description="No VirtualBox: Nova VM → FreeBSD 64-bit → 2 GB RAM → 8 GB disco. Adicionar 3 adaptadores: em0 (NAT/Bridged = WAN), em1 (Rede Interna 'dmz'), em2 (Rede Interna 'lan'). No KVM: virt-install com --network bridge=br-wan,bridge=br-dmz,bridge=br-lan."
          />

          <StepItem
            number={2}
            title="Instalar a partir do ISO"
            description="Boot pelo ISO → Login: installer / opnsense → Guided installation → ZFS ou UFS → Confirmar particionamento → Reboot. Ao reiniciar sem o ISO, o sistema inicializa o OPNsense."
          />

          <StepItem
            number={3}
            title="Atribuir interfaces no console"
            description="Menu inicial → opção 1 'Assign Interfaces'. Configurar: WAN = em0, LAN = em2 (192.168.1.1/24), DMZ = em1 (192.168.56.1/24). Confirmar com 'y'. O sistema reinicia os serviços."
          />

          <StepItem
            number={4}
            title="Acessar a Web UI"
            description="De uma máquina na rede LAN, abrir https://192.168.1.1 (aceitar o certificado autoassinado). Login padrão: root / opnsense. Assistente de configuração inicial — hostname, DNS, NTP, senha de admin."
          />

          <WarnBox title="⚠️ Porta 443 bloqueada na LAN?">
            Se a Web UI não abre, verifique: (1) A VM LAN está na mesma rede interna da sua máquina de teste?
            (2) No console, opção 2 → confirmar IP da LAN. (3) Firewall da VM não está interceptando HTTPS?
          </WarnBox>
        </section>

        {/* 3 — Visão geral da interface */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">3. Mapa da Web UI — onde está cada coisa</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { menu: 'Interfaces', desc: 'Configurar WAN/LAN/DMZ — IPs, DHCP client, VLAN' },
              { menu: 'Firewall → Rules', desc: 'Regras por interface — equivalente às chains INPUT/FORWARD/OUTPUT' },
              { menu: 'Firewall → NAT', desc: 'Port Forward (DNAT) e Outbound NAT (SNAT/MASQUERADE)' },
              { menu: 'Firewall → Aliases', desc: 'Grupos reutilizáveis de IPs e portas — use em vez de IPs hardcoded' },
              { menu: 'Services → DHCPv4', desc: 'Servidor DHCP por interface — substitui o isc-dhcp-server' },
              { menu: 'VPN → OpenVPN / WireGuard', desc: 'Wizards visuais — gera config de cliente automaticamente' },
              { menu: 'Services → Intrusion Detection', desc: 'Suricata integrado — IDS/IPS com regras Emerging Threats' },
              { menu: 'System → High Availability', desc: 'CARP — IP virtual compartilhado entre par de firewalls' },
            ].map(({ menu, desc }) => (
              <div key={menu} className="flex gap-3 p-3 rounded-lg border border-border bg-bg-2">
                <Settings size={16} className="text-[var(--mod)] mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-text font-mono">{menu}</span>
                  <p className="text-xs text-text-3 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 — Firewall Rules */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">4. Regras de Firewall via GUI</h2>
          <p className="text-text-2">
            No OPNsense, regras são avaliadas <strong className="text-text">na entrada de cada interface</strong> (ingress).
            Uma regra na aba LAN controla o que entra vindo da LAN — equivalente à chain FORWARD do iptables.
          </p>

          <HighlightBox title="💡 Princípio fundamental">
            OPNsense usa <strong>default deny</strong>: tudo que não tem regra ALLOW explícita é bloqueado.
            A regra padrão &quot;Default allow LAN to any rule&quot; criada durante a instalação é o que permite
            a LAN acessar a internet — pode (e deve) ser refinada em produção.
          </HighlightBox>

          <h3 className="font-semibold text-text mt-4">Criar um Alias (grupo reutilizável)</h3>
          <p className="text-text-2 text-sm">
            Antes de criar regras, crie Aliases para IPs e portas frequentes. Em <strong>Firewall → Aliases → +</strong>:
          </p>
          <CodeBlock lang="yaml" code={`# Alias: Servidores da DMZ
Nome: DMZ_Servers
Tipo: Host(s)
IPs: 192.168.56.10, 192.168.56.20

# Alias: Portas Web
Nome: HTTP_HTTPS
Tipo: Port(s)
Portas: 80, 443`} />

          <h3 className="font-semibold text-text mt-4">Regra: LAN pode acessar DMZ apenas nas portas web</h3>
          <p className="text-sm text-text-2">Em <strong>Firewall → Rules → LAN → +</strong>:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
              <thead className="bg-bg-3 text-text-2">
                <tr>
                  {['Campo', 'Valor'].map(h => (
                    <th key={h} className="px-3 py-2 text-left border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-text-2 font-mono">
                {[
                  ['Action', 'Pass'],
                  ['Interface', 'LAN'],
                  ['Protocol', 'TCP'],
                  ['Source', 'LAN net'],
                  ['Destination', 'DMZ_Servers (alias)'],
                  ['Destination Port', 'HTTP_HTTPS (alias)'],
                  ['Description', 'LAN acessa DMZ somente Web'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border">
                    <td className="px-3 py-2 text-text font-semibold">{k}</td>
                    <td className="px-3 py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-text mt-4">Port Forward (DNAT) — servidor DMZ acessível da WAN</h3>
          <p className="text-sm text-text-2">
            Em <strong>Firewall → NAT → Port Forward → +</strong>:
          </p>
          <CodeBlock lang="yaml" code={`Interface:       WAN
Protocol:        TCP
Destination:     WAN address
Dest. Port:      80
Redirect Target: 192.168.56.10
Redirect Port:   80
Description:     Forward HTTP WAN → Web Server DMZ

✅ Marcar: "Add associated filter rule"
   (cria automaticamente a regra FORWARD correspondente)`} />
        </section>

        {/* 5 — VPN Integrada */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">5. VPN Integrada — WireGuard e OpenVPN</h2>
          <p className="text-text-2">
            O OPNsense inclui WireGuard e OpenVPN como plugins nativos, com wizards que geram toda a configuração —
            incluindo o arquivo <code className="code-block">.ovpn</code> do cliente.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-ok" />
                <span className="font-semibold text-text">WireGuard</span>
                <span className="text-xs bg-ok/15 text-ok px-2 py-0.5 rounded-full">Recomendado</span>
              </div>
              <p className="text-xs text-text-2">
                VPN → WireGuard → Local → +. Criar instância com IP do tunnel (ex: 10.0.0.1/24).
                Adicionar peer com a chave pública do cliente. OPNsense gera QR Code para mobile.
              </p>
              <CodeBlock lang="bash" code={`# Gerar par de chaves no cliente Linux
wg genkey | tee privkey | wg pubkey > pubkey
cat pubkey   # copiar para o campo Public Key no OPNsense`} />
            </div>
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-info" />
                <span className="font-semibold text-text">OpenVPN</span>
                <span className="text-xs bg-info/15 text-info px-2 py-0.5 rounded-full">Wizard</span>
              </div>
              <p className="text-xs text-text-2">
                VPN → OpenVPN → Wizard → Road Warrior. O wizard cria a CA, o certificado do servidor e
                exporta o <code className="code-block">.ovpn</code> do cliente em um único fluxo.
              </p>
              <CodeBlock lang="bash" code={`# Instalar plugin de exportação de clientes
System → Firmware → Plugins:
  os-openvpn-client-export

# Exportar .ovpn em VPN → OpenVPN → Client Export`} />
            </div>
          </div>
        </section>

        {/* 6 — IDS/IPS com Suricata */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">6. IDS/IPS com Suricata — integração nativa</h2>
          <p className="text-text-2">
            O plugin Suricata do OPNsense é a mesma engine que estudamos no{' '}
            <Link href="/suricata" className="text-[var(--mod)] underline underline-offset-2">Sprint I.18</Link>,
            mas com configuração visual. A diferença: aqui o Suricata roda <em>inline</em> — cada pacote
            passa pelo motor de detecção antes de ser roteado.
          </p>

          <StepItem
            number={1}
            title="Instalar o plugin Suricata"
            description="System → Firmware → Plugins → buscar 'suricata' → instalar os-suricata. Após instalação, aparece Services → Intrusion Detection no menu."
          />

          <StepItem
            number={2}
            title="Configurar e baixar regras"
            description="Services → Intrusion Detection → Download. Habilitar 'ET open' (Emerging Threats Open — gratuito, ~40.000 regras). Clicar em 'Download & Update Rules'. Em Administration → Enable IDS."
          />

          <StepItem
            number={3}
            title="Modo IPS inline (bloqueio real)"
            description="Em Administration → marcar 'IPS mode'. Selecionar a interface WAN como ponto de inspeção. Em modo IPS, pacotes que disparam regras drop são descartados antes de chegar ao stack TCP/IP."
          />

          <CodeBlock lang="bash" code={`# Visualizar alertas em tempo real
Services → Intrusion Detection → Alerts

# Filtrar por SID específico
sid: 2001219   # ET SCAN Potential SSH Scan

# Ver estatísticas de drops em modo IPS
Services → Intrusion Detection → Stats`} />

          <InfoBox title="Suricata no OPNsense vs instalação manual (Sprint I.18)">
            A engine é idêntica. A diferença está na integração: no OPNsense, a atualização de regras,
            o modo IPS inline e os alertas são gerenciados pela GUI. Em ambientes de alta performance,
            a instalação manual (Sprint I.18) oferece mais controle sobre af-packet e tuning de workers.
          </InfoBox>
        </section>

        {/* 7 — Alta Disponibilidade */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">7. Alta Disponibilidade com CARP</h2>
          <p className="text-text-2">
            CARP (Common Address Redundancy Protocol) cria um <strong className="text-text">IP virtual compartilhado</strong>{' '}
            entre dois firewalls. Se o primário cair, o secundário assume o IP virtual em segundos —
            sem alterar configurações nos clientes.
          </p>

          <FluxoCard
            title="Fluxo: CARP failover"
            steps={[
              { label: 'Firewall Master', sub: 'CARP MASTER — anuncia VIP via multicast', icon: <Server size={14}/>, color: 'border-ok/50' },
              { label: 'CARP VIP', sub: '10.0.0.1 (virtual) — usado pelos clientes como gateway', icon: <Globe size={14}/>, color: 'border-[var(--mod)]/50' },
              { label: 'Heartbeat', sub: 'pfsync mantém estados de conexão sincronizados', icon: <Zap size={14}/>, color: 'border-info/50' },
              { label: 'Failover <2s', sub: 'Backup assume o VIP — conexões ativas continuam', icon: <Shield size={14}/>, color: 'border-warn/50' },
            ]}
          />

          <CodeBlock lang="bash" code={`# Configurar no OPNsense Master
System → High Availability → Settings:
  Synchronize States: ✅ (pfsync)
  Synchronize Config: ✅
  Remote System IP: 192.168.100.2  # IP real do Backup
  Password: <senha-sync>

# Criar o Virtual IP (CARP)
Interfaces → Virtual IPs → +
  Type: CARP
  Interface: WAN
  IP: 10.0.0.1/24
  VHID: 1
  Password: <carp-pass>
  Skew: 0  # Master tem skew 0 — Backup tem skew 100`} />

          <WarnBox title="⚠️ pfsync — sincronização de estados">
            O pfsync sincroniza a tabela de conntrack entre firewalls. Use uma interface dedicada
            (terceiro NIC ou VLAN) exclusivamente para o tráfego pfsync — nunca use a LAN ou WAN.
            Exposição do pfsync na rede pública permite ataques de injeção de estados.
          </WarnBox>
        </section>

        {/* 8 — FluxoCard equivalência ao lab */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">8. OPNsense vs nosso lab iptables — equivalências</h2>
          <p className="text-text-2">
            Tudo que fizemos com iptables/nftables existe no OPNsense. A diferença é a interface:
          </p>

          <FluxoCard
            title="Do iptables manual ao OPNsense"
            steps={[
              { label: 'iptables -t nat MASQUERADE', sub: 'Firewall → NAT → Outbound (Automatic)', icon: <Network size={14}/>, color: 'border-ok/50' },
              { label: 'iptables FORWARD', sub: 'Firewall → Rules (por interface)', icon: <Shield size={14}/>, color: 'border-[var(--mod)]/50' },
              { label: 'DNAT PREROUTING', sub: 'Firewall → NAT → Port Forward', icon: <Zap size={14}/>, color: 'border-info/50' },
              { label: 'nftables set', sub: 'Firewall → Aliases (grupos de IPs/portas)', icon: <CheckCircle size={14}/>, color: 'border-warn/50' },
              { label: 'fail2ban + Suricata', sub: 'Services → IDS + Firewall → Automation', icon: <AlertTriangle size={14}/>, color: 'border-err/50' },
            ]}
          />

          <WindowsComparisonBox
            windowsCode={`# Windows Server — RRAS + Windows Firewall
# GUI: Server Manager → Routing and Remote Access
# Regras: Windows Defender Firewall Advanced
# NAT: RRAS → IPv4 → NAT (Interface WAN)
# VPN: RRAS → Network Policies (PPTP/L2TP)

netsh routing ip nat show interface
netsh advfirewall firewall show rule all`}
            linuxCode={`# OPNsense (FreeBSD) — pf + GUI
# GUI: https://192.168.1.1 (Web UI)
# Regras: Firewall → Rules → (por interface)
# NAT: Firewall → NAT → Outbound / Port Forward
# VPN: VPN → WireGuard / OpenVPN (wizard)

# Equivalente no cli do OPNsense (ssh):
pfctl -sr        # ver regras pf
pfctl -sn        # ver tabela NAT`}
            windowsLabel="Windows — RRAS"
            linuxLabel="OPNsense — pf + GUI"
          />
        </section>

        {/* 9 — Backup e API */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">9. Backup de configuração e API REST</h2>
          <p className="text-text-2">
            Toda a configuração do OPNsense vive num único arquivo XML — fácil de versionar com Git.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <h3 className="font-semibold text-text text-sm">Backup manual</h3>
              <CodeBlock lang="bash" code={`# System → Configuration → Backups
# Download: config-opnsense-20260427.xml
# Restore: upload do XML → Apply

# Backup automático via cron (System → Cron):
# 0 3 * * * /usr/local/opnsense/scripts/
#           menu.sh backup backup`} />
            </div>
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <h3 className="font-semibold text-text text-sm">API REST — automação com Ansible/Terraform</h3>
              <CodeBlock lang="bash" code={`# Criar API Key: System → Access → Users
# → Edit user → API Keys → +

# Listar regras via API
curl -s -k \
  --user "API_KEY:API_SECRET" \
  https://192.168.1.1/api/firewall/filter/searchRule \
  | jq '.rows[] | {description, action}'`} />
            </div>
          </div>

          <InfoBox title="OPNsense + Ansible — infraestrutura como código">
            A collection <code>ansibleguy.opnsense</code> (Ansible Galaxy) permite gerenciar regras,
            aliases, VPN e configurações inteiras via playbooks. Combina tudo que aprendemos:
            Ansible (Sprint I.14) + OPNsense = firewall versionado em Git.
          </InfoBox>
        </section>

        {/* Checklist */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-text">Checklist do Laboratório</h2>
          <div className="space-y-2">
            {checklistItems.map(item => (
              <ChecklistItem
                key={item.id}
                text={item.text}
                sub={item.sub}
                checked={!!checklist[item.id]}
                onToggle={() => updateChecklist(item.id, !checklist[item.id])}
              />
            ))}
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-text">Erros Comuns</h2>
          <div className="space-y-2">
            {commonErrors.map((err, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-4 py-3 bg-bg-2 hover:bg-bg-3 transition-colors text-left"
                  onClick={() => setOpenError(openError === i ? null : i)}
                  aria-expanded={openError === i}
                >
                  <span className="font-medium text-sm text-text flex items-center gap-2">
                    <AlertTriangle size={15} className="text-warn shrink-0" />
                    {err.title}
                  </span>
                  <span className="text-text-3 text-xs">{openError === i ? '▲' : '▼'}</span>
                </button>
                {openError === i && (
                  <div className="px-4 py-3 text-sm text-text-2 border-t border-border bg-bg leading-relaxed">
                    {err.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <ModuleNav currentPath="/opnsense" order={ADVANCED_ORDER} />
      </div>
    </div>
  );
}
