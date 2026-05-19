'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Network, Layers, Cable, Globe, Router, Share2, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint REDES-L23 — Redes Camada 2 & 3: VLAN, bonding, bridges, IPv6 e
   roteamento. Alinhado a LPIC-2 / CompTIA Network+. */

type RedesTab = 'vlan' | 'bonding' | 'ipv6';

const CHECKLIST_ITEMS = [
  { id: 'vlan-configurada', label: 'Criei uma VLAN tagueada (802.1Q) sobre uma interface física e validei o isolamento de broadcast' },
  { id: 'bonding-ativo',    label: 'Agreguei dois links num bond (active-backup ou LACP) e testei a tolerância à falha de um cabo' },
  { id: 'ipv6-roteado',     label: 'Configurei endereçamento IPv6 e uma rota estática, e habilitei o encaminhamento entre redes' },
];

export default function RedesL2L3Page() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<RedesTab>('vlan');

  useEffect(() => {
    trackPageVisit('/redes-l2-l3');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-redes-l2-l3 min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Redes Camada 2 &amp; 3</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Infraestrutura &amp; Redes</div>
          <h1 className="text-4xl font-bold mb-4">🌐 Redes Camada 2 &amp; 3</h1>
          <p className="text-text-2 text-lg mb-6">
            Abaixo do firewall e do roteamento existe a fundação: <strong>switching</strong> na
            camada 2 e <strong>endereçamento</strong> na camada 3. Aqui você segmenta a rede com
            <strong> VLANs</strong>, agrega links com <strong>bonding</strong>, cria
            <strong> bridges</strong> para máquinas virtuais e domina o <strong>IPv6</strong> e o
            roteamento que o mercado já exige.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de LPIC-2 e CompTIA Network+.
          </p>
        </div>

        <FluxoCard
          title="Da porta física à rede roteada"
          steps={[
            { label: 'Interface física', sub: 'eth0 — o cabo de cobre/fibra', icon: <Cable size={14}/>, color: 'border-info/50' },
            { label: 'Camada 2', sub: 'switch, MAC, VLAN, bridge', icon: <Layers size={14}/>, color: 'border-ok/50' },
            { label: 'Camada 3', sub: 'IP, sub-rede, gateway', icon: <Network size={14}/>, color: 'border-accent/50' },
            { label: 'Roteamento', sub: 'rotas estáticas e dinâmicas', icon: <Router size={14}/>, color: 'border-warn/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'vlan',    label: '🔀 VLANs & Camada 2' },
              { id: 'bonding', label: '🔗 Bonding & Bridges' },
              { id: 'ipv6',    label: '🌐 IPv6 & Roteamento' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as RedesTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive(tab.id)
                    ? 'border-[var(--mod)] text-[var(--mod)]'
                    : 'border-transparent text-text-2 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1 ── */}
        {isActive('vlan') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Camada 2 — switching e domínio de broadcast</h2>
          <p className="text-text-2 mb-4">
            A <strong>camada 2</strong> (enlace) move quadros entre placas pelo endereço
            <strong> MAC</strong>. Um switch aprende em que porta vive cada MAC e encaminha o
            quadro direto ao destino. Mas o tráfego de <strong>broadcast</strong> (ARP, DHCP
            discover) inunda <em>todas</em> as portas: esse alcance é o <strong>domínio de
            broadcast</strong>. Quanto maior a rede plana, mais ruído — e menos segurança, porque
            todo mundo enxerga todo mundo.
          </p>
          <InfoBox title="Por que segmentar">
            Numa rede plana, um host comprometido fala diretamente com qualquer outro. Segmentar
            em redes menores reduz o ruído de broadcast <em>e</em> cria fronteiras: o tráfego
            entre segmentos passa a depender de um roteador — onde você aplica firewall.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. VLAN — segmentar sem trocar de switch</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>VLAN</strong> (Virtual LAN) divide um switch físico em vários switches
            lógicos. Cada VLAN é um domínio de broadcast independente — hosts em VLANs diferentes
            só se falam <em>através de um roteador</em>. O padrão <strong>IEEE 802.1Q</strong>
            insere uma <em>tag</em> de 4 bytes no quadro Ethernet com o <strong>VLAN ID</strong>
            (1–4094).
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Porta de acesso</strong> — pertence a uma VLAN só; o host nem sabe que existe tag.</li>
            <li><strong>Porta trunk</strong> — transporta várias VLANs tagueadas entre switches (e até o servidor Linux).</li>
            <li><strong>VLAN nativa</strong> — a VLAN cujo tráfego trafega <em>sem</em> tag no trunk.</li>
          </ul>
          <p className="text-text-2 mb-4">
            No Linux, uma interface VLAN é uma sub-interface da física, no formato
            <code> eth0.ID</code>:
          </p>
          <CodeBlock lang="bash" code={`# Carregar o módulo de VLAN (geralmente já está)
sudo modprobe 8021q

# Criar a VLAN 10 sobre a eth0 (a eth0 deve estar num trunk)
sudo ip link add link eth0 name eth0.10 type vlan id 10
sudo ip addr add 192.168.10.1/24 dev eth0.10
sudo ip link set eth0.10 up

# Conferir
ip -d link show eth0.10        # mostra "vlan protocol 802.1Q id 10"
ip -br addr show`} />
          <p className="text-text-2 my-4">
            Para tornar permanente no Ubuntu/Debian moderno, use o <strong>Netplan</strong>:
          </p>
          <CodeBlock lang="text" title="/etc/netplan/01-vlans.yaml" code={`network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
  vlans:
    eth0.10:
      id: 10
      link: eth0
      addresses: [192.168.10.1/24]
    eth0.20:
      id: 20
      link: eth0
      addresses: [192.168.20.1/24]`} />
          <p className="text-text-2 my-4">
            Aplique com <code>sudo netplan apply</code>. Agora o servidor tem um pé em duas
            VLANs ao mesmo tempo — base de um roteador <em>router-on-a-stick</em>.
          </p>
          <WarnBox title="VLAN não é firewall">
            VLAN <strong>segmenta</strong>, não <strong>filtra</strong>. Hosts de VLANs diferentes
            só se falam por um roteador — e é <em>nele</em> que você aplica
            <Link href="/nftables" className="text-accent hover:underline"> nftables</Link>.
            Sem regras, um roteador inter-VLAN simplesmente reconecta tudo o que a VLAN separou.
          </WarnBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['vlan-configurada']} onChange={e => updateChecklist('vlan-configurada', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['vlan-configurada'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('bonding') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Bonding — agregação de links</h2>
          <p className="text-text-2 mb-4">
            <strong>Bonding</strong> (ou <em>link aggregation</em>, <em>teaming</em>) une duas ou
            mais placas físicas numa interface lógica — o <code>bond0</code>. Os ganhos: se um
            cabo cai, o tráfego segue pelo outro (<strong>redundância</strong>); somando os links,
            cresce a <strong>banda</strong> agregada. É o equivalente, na camada 2, do que o
            cluster faz na camada de serviço.
          </p>
          <FluxoCard
            direction="vertical"
            title="Os modos de bonding mais usados"
            steps={[
              { label: 'active-backup (modo 1)', sub: 'um link ativo, o outro reserva — redundância pura', icon: <Share2 size={14}/>, color: 'border-ok/50' },
              { label: '802.3ad / LACP (modo 4)', sub: 'agrega banda; exige switch com LACP configurado', icon: <Cable size={14}/>, color: 'border-accent/50' },
              { label: 'balance-rr (modo 0)', sub: 'round-robin entre links — banda sem exigir switch', icon: <Network size={14}/>, color: 'border-info/50' },
            ]}
          />
          <p className="text-text-2 mb-4">
            O <strong>active-backup</strong> é o mais seguro: funciona com qualquer switch e nunca
            embaralha pacotes. O <strong>LACP (802.3ad)</strong> entrega banda de verdade, mas o
            switch precisa estar com o <em>port-channel</em> LACP configurado do outro lado —
            senão o link nem sobe.
          </p>
          <CodeBlock lang="bash" code={`# Criar um bond active-backup com ip (teste rápido)
sudo modprobe bonding
sudo ip link add bond0 type bond mode active-backup miimon 100
sudo ip link set eth1 down && sudo ip link set eth1 master bond0
sudo ip link set eth2 down && sudo ip link set eth2 master bond0
sudo ip link set bond0 up

# Estado do bond — qual link está ativo
cat /proc/net/bonding/bond0`} />
          <p className="text-text-2 my-4">
            Permanente via Netplan, agora com LACP:
          </p>
          <CodeBlock lang="text" title="/etc/netplan/02-bond.yaml" code={`network:
  version: 2
  ethernets:
    eth1: {dhcp4: no}
    eth2: {dhcp4: no}
  bonds:
    bond0:
      interfaces: [eth1, eth2]
      addresses: [10.0.0.10/24]
      parameters:
        mode: 802.3ad        # LACP
        lacp-rate: fast
        mii-monitor-interval: 100`} />
          <WarnBox title="miimon — o monitor que detecta a falha">
            O parâmetro <code>miimon</code> (em ms) define de quanto em quanto tempo o kernel
            checa o estado do link. Sem ele (ou com 0), o bond não percebe um cabo arrancado e
            continua mandando tráfego para o vazio. <code>miimon 100</code> é o valor padrão
            sensato.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Bridges — o switch virtual</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>bridge</strong> Linux (<code>br0</code>) é um switch em software. É a peça
            que conecta <strong>máquinas virtuais</strong> e <strong>containers</strong> à rede
            física: a VM ganha uma <code>tap</code>, a <code>tap</code> entra na bridge, a bridge
            tem a <code>eth0</code> — e a VM aparece na LAN como um host de verdade.
          </p>
          <CodeBlock lang="bash" code={`# Criar uma bridge e colocar a eth0 dentro dela
sudo ip link add name br0 type bridge
sudo ip link set eth0 master br0
sudo ip link set br0 up

# Conferir os membros da bridge
bridge link show
ip -br link show type bridge`} />
          <InfoBox title="Você já viu bridges sem saber">
            O <Link href="/proxmox" className="text-accent hover:underline">Proxmox</Link> usa
            bridges <code>vmbr0</code> para ligar VMs à rede; o
            <Link href="/docker" className="text-accent hover:underline"> Docker</Link> cria a
            <code> docker0</code> automaticamente. Entender a bridge crua é entender o que essas
            ferramentas montam por baixo. E sim — uma bridge pode ter VLANs: é assim que um host
            de virtualização entrega VLANs diferentes a VMs diferentes.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['bonding-ativo']} onChange={e => updateChecklist('bonding-ativo', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['bonding-ativo'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('ipv6') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. IPv6 — o endereçamento que já chegou</h2>
          <p className="text-text-2 mb-4">
            O IPv4 acabou — os blocos públicos se esgotaram. O <strong>IPv6</strong> traz
            128 bits (contra 32), escritos em 8 grupos hexadecimais. Regras de escrita: zeros à
            esquerda somem, e uma sequência de grupos zerados vira <code>::</code> (uma só vez por
            endereço).
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { n: 'fe80::/10', d: 'Link-local — existe em toda interface, não roteável' },
              { n: 'fc00::/7',  d: 'ULA — endereço privado (o equivalente ao 192.168.x.x)' },
              { n: '2000::/3',  d: 'Global Unicast — endereço público roteável na internet' },
              { n: 'ff00::/8',  d: 'Multicast — IPv6 não tem broadcast, só multicast' },
            ].map((u, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-accent font-mono">{u.n}</p>
                <p className="text-text-3 mt-1 leading-snug">{u.d}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2 mb-4">
            Hosts IPv6 se autoconfiguram por <strong>SLAAC</strong>: o roteador anuncia o prefixo
            (Router Advertisement) e cada host monta seu próprio endereço. Não há &quot;sem
            gateway&quot; — o link-local sempre existe.
          </p>
          <CodeBlock lang="bash" code={`# Ver endereços IPv6 das interfaces
ip -6 addr show

# Adicionar um endereço IPv6 estático
sudo ip -6 addr add 2001:db8:1::10/64 dev eth0

# Testar conectividade IPv6
ping6 -c 3 2001:db8:1::1
ip -6 route show`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Roteamento estático e encaminhamento</h2>
          <p className="text-text-2 mb-4">
            Um host só fala com a própria sub-rede. Para alcançar outra rede, ele precisa de uma
            <strong> rota</strong> — e de um <strong>roteador</strong> que encaminhe o pacote.
            Transformar um Linux em roteador é ligar uma chave do kernel:
          </p>
          <CodeBlock lang="bash" code={`# Ver a tabela de rotas
ip route show

# Rota estática: para chegar na 192.168.20.0/24, use o gateway 10.0.0.1
sudo ip route add 192.168.20.0/24 via 10.0.0.1

# Habilitar o encaminhamento de pacotes (o que faz dele um roteador)
sudo sysctl -w net.ipv4.ip_forward=1
sudo sysctl -w net.ipv6.conf.all.forwarding=1

# Tornar permanente
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-router.conf
echo 'net.ipv6.conf.all.forwarding=1' | sudo tee -a /etc/sysctl.d/99-router.conf
sudo sysctl --system`} />
          <InfoBox title="Estático até onde a topologia couber na cabeça">
            Rotas estáticas são previsíveis e ótimas para redes pequenas. Mas quando há dezenas de
            redes e múltiplos caminhos, mantê-las à mão vira inviável. Aí entram os protocolos de
            roteamento <strong>dinâmico</strong> — e o Linux roda todos eles.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Roteamento dinâmico — noções de OSPF e BGP</h2>
          <p className="text-text-2 mb-4">
            O <strong>FRRouting (FRR)</strong> transforma um Linux num roteador completo, falando
            os mesmos protocolos de um equipamento Cisco/Juniper:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>OSPF</strong> — protocolo <em>interno</em> (IGP). Os roteadores trocam um mapa da rede e calculam o caminho mais curto. Reage rápido a falhas; usado <em>dentro</em> de uma organização.</li>
            <li><strong>BGP</strong> — protocolo <em>externo</em> (EGP). É o protocolo que <em>cola a internet</em>: cada provedor (AS) anuncia ao BGP quais redes alcança. Decide por políticas, não por &quot;menor caminho&quot;.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Instalar o FRRouting
sudo apt install -y frr

# Habilitar os daemons desejados em /etc/frr/daemons (ospfd=yes, bgpd=yes)
sudo systemctl restart frr

# Configurar pelo shell integrado (estilo Cisco IOS)
sudo vtysh
#   configure terminal
#   router ospf
#    network 10.0.0.0/24 area 0
#   end
#   write memory`} />
          <WarnBox title="OSPF e BGP são um universo — aqui é a porta de entrada">
            Operar OSPF/BGP em produção é uma especialidade inteira (e foco de certificações de
            rede dedicadas). O objetivo deste módulo é você <strong>reconhecer</strong> os
            conceitos, saber que o Linux + FRR fazem o papel de roteador, e diferenciar
            roteamento interno de externo. O aprofundamento é uma trilha à parte.
          </WarnBox>

          <WindowsComparisonBox
            windowsLabel="Windows Server (RRAS)"
            linuxLabel="Linux (iproute2 + FRR)"
            windowsCode={`# Windows — Routing and Remote Access (RRAS)
# Interface NIC Teaming p/ agregação de links
New-NetLbfoTeam -Name Team1 -TeamMembers eth1,eth2
# VLAN pela GUI do adaptador / Set-NetAdapter
# Roteamento e rotas:
route add 192.168.20.0 mask 255.255.255.0 10.0.0.1
# OSPF/BGP via função RRAS`}
            linuxCode={`# Linux — tudo via iproute2 + Netplan + FRR
sudo ip link add bond0 type bond mode 802.3ad   # teaming
sudo ip link add link eth0 name eth0.10 type vlan id 10
sudo ip route add 192.168.20.0/24 via 10.0.0.1
sudo sysctl -w net.ipv4.ip_forward=1
sudo vtysh   # OSPF/BGP estilo Cisco IOS`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['ipv6-roteado']} onChange={e => updateChecklist('ipv6-roteado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['ipv6-roteado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'A VLAN sobe mas não passa tráfego — porta do switch não é trunk', sol: 'Uma sub-interface eth0.10 só funciona se a porta do switch do outro lado estiver configurada como trunk (tagged) para a VLAN 10. Em porta de acesso, o switch descarta o quadro tagueado.' },
              { erro: 'Bond LACP não sobe — switch sem port-channel', sol: 'O modo 802.3ad exige LACP nos DOIS lados. Se o switch não tem o port-channel/LACP configurado, use active-backup (modo 1), que funciona com qualquer switch.' },
              { erro: 'Bond não detecta cabo arrancado', sol: 'Sem miimon, o kernel não monitora o estado do link e segue enviando ao link morto. Defina mii-monitor-interval: 100 (Netplan) ou miimon 100.' },
              { erro: 'Roteamento entre redes não funciona mesmo com a rota certa', sol: 'A rota define o caminho, mas o kernel só encaminha pacotes de terceiros se net.ipv4.ip_forward=1. Para IPv6, net.ipv6.conf.all.forwarding=1. Persista em /etc/sysctl.d/.' },
            ].map((e, i) => (
              <details key={i} className="p-4 rounded-lg bg-bg-2 border border-border">
                <summary className="cursor-pointer font-medium text-text flex items-center gap-2">
                  <AlertOctagon size={15} className="text-err shrink-0" /> {e.erro}
                </summary>
                <p className="text-sm text-text-2 mt-2 pl-6">{e.sol}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
          <div className="space-y-4">

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Duas VLANs num servidor</p>
              <p className="text-sm text-text-2 mb-3">
                Crie as VLANs 10 e 20 sobre a <code>eth0</code> via Netplan, cada uma com sua
                sub-rede. Confirme com <code>ip -d link show</code> que o protocolo 802.1Q
                aparece. De um host na VLAN 10, tente um <code>ping</code> para a VLAN 20 sem
                roteamento — deve falhar. Esse é o isolamento de broadcast em ação.
              </p>
              <CodeBlock lang="bash" code={`sudo ip link add link eth0 name eth0.10 type vlan id 10
sudo ip link add link eth0 name eth0.20 type vlan id 20
sudo ip addr add 192.168.10.1/24 dev eth0.10
sudo ip addr add 192.168.20.1/24 dev eth0.20
sudo ip link set eth0.10 up && sudo ip link set eth0.20 up
ip -d link show eth0.10`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Bond tolerante a falha</p>
              <p className="text-sm text-text-2 mb-3">
                Agregue <code>eth1</code> e <code>eth2</code> num <code>bond0</code> em modo
                <code> active-backup</code> com <code>miimon 100</code>. Veja o link ativo em
                <code> /proc/net/bonding/bond0</code>, derrube o link ativo
                (<code>ip link set ethX down</code>) e confirme que o tráfego migrou para o outro
                sem queda.
              </p>
              <CodeBlock lang="bash" code={`sudo ip link add bond0 type bond mode active-backup miimon 100
sudo ip link set eth1 master bond0
sudo ip link set eth2 master bond0
sudo ip link set bond0 up
cat /proc/net/bonding/bond0     # veja o "Currently Active Slave"
sudo ip link set eth1 down      # derrube o ativo e re-confira`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — Linux como roteador inter-VLAN</p>
              <p className="text-sm text-text-2 mb-3">
                Use o servidor das VLANs 10 e 20 do Lab 1. Habilite
                <code> ip_forward</code>, ponha um host em cada VLAN apontando o gateway para o IP
                do servidor naquela VLAN e confirme o <code>ping</code> entre VLANs. Depois aplique
                uma regra <code>nftables</code> bloqueando o tráfego VLAN 10 → VLAN 20 e veja a
                segmentação virar firewall.
              </p>
              <CodeBlock lang="bash" code={`sudo sysctl -w net.ipv4.ip_forward=1
# host VLAN10: gateway 192.168.10.1  |  host VLAN20: gateway 192.168.20.1
ping -c3 192.168.20.50      # do host da VLAN 10
# bloquear o sentido 10 -> 20:
sudo nft add rule inet filter forward ip saddr 192.168.10.0/24 \\
  ip daddr 192.168.20.0/24 drop`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/redes-l2-l3" />

      </div>
    </main>
  );
}
