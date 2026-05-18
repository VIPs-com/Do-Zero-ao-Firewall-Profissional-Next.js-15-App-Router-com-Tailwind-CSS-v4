'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { LogIn, Network, Shuffle, Link2, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint FORTALEZA — Tailscale, VPN mesh zero-port. Conteúdo adaptado do guia
   "Fortaleza Proxmox" (CC BY-SA 4.0). */

type TsTab = 'conceito' | 'config' | 'rede';

const CHECKLIST_ITEMS = [
  { id: 'tailscale-instalado', label: 'Instalei o Tailscale, fiz tailscale up com login SSO e a máquina apareceu na tailnet' },
  { id: 'tailscale-mesh',      label: 'Conectei um segundo dispositivo e acessei o servidor pelo IP 100.x / MagicDNS — sem abrir porta' },
  { id: 'tailscale-subnet',    label: 'Configurei um subnet router (--advertise-routes) ou um exit node' },
];

export default function TailscalePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<TsTab>('conceito');

  useEffect(() => {
    trackPageVisit('/tailscale');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-tailscale min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Tailscale</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo C07 · Hardening do Host</div>
          <h1 className="text-4xl font-bold mb-4">🔗 Tailscale — VPN Mesh Zero-Port</h1>
          <p className="text-text-2 text-lg mb-6">
            Você configurou o <strong>WireGuard</strong> à mão — chaves, IPs, <code>AllowedIPs</code>,
            port forwarding. O <strong>Tailscale</strong> usa o mesmo protocolo WireGuard, mas
            monta a rede sozinho: <strong>nenhuma porta aberta na internet</strong>, login por
            identidade, e cada dispositivo enxerga o outro como se estivesse na mesma LAN.
          </p>
        </div>

        <FluxoCard
          title="Como o Tailscale conecta dois dispositivos sem abrir porta"
          steps={[
            { label: 'Login SSO',   sub: 'cada nó autentica com sua identidade (Google, etc.)', icon: <LogIn size={14}/>,   color: 'border-accent/50' },
            { label: 'Coordenação', sub: 'o servidor de controle troca as chaves públicas',     icon: <Network size={14}/>, color: 'border-info/50' },
            { label: 'NAT traversal', sub: 'os nós furam o NAT; DERP relay como plano B',        icon: <Shuffle size={14}/>, color: 'border-warn/50' },
            { label: 'Túnel direto', sub: 'tráfego criptografado WireGuard ponta a ponta',       icon: <Link2 size={14}/>,   color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '🔗 Conceito & Tailnet' },
              { id: 'config',   label: '⚙️ Instalação & ACLs' },
              { id: 'rede',     label: '🌐 Subnet Router & Exit Node' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TsTab)}
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
        {isActive('conceito') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Tailscale vs WireGuard puro</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-2">Critério</th>
                  <th className="text-left py-2 pr-4 text-info">WireGuard puro</th>
                  <th className="text-left py-2 text-ok">Tailscale</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Protocolo de cripto</td>
                  <td className="py-2 pr-4">WireGuard</td>
                  <td className="py-2">WireGuard (o mesmo — por baixo)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Porta exposta</td>
                  <td className="py-2 pr-4">Sim — UDP 51820 com port forwarding</td>
                  <td className="py-2">Nenhuma — NAT traversal automático</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Chaves e IPs</td>
                  <td className="py-2 pr-4">Você gera e configura à mão em cada peer</td>
                  <td className="py-2">O plano de controle distribui automaticamente</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Topologia</td>
                  <td className="py-2 pr-4">Hub-and-spoke (você desenha)</td>
                  <td className="py-2">Mesh — todo nó fala direto com todo nó</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-text">Identidade</td>
                  <td className="py-2 pr-4">Chave pública = identidade</td>
                  <td className="py-2">Login SSO (conta) = identidade</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox title="Não substitui o WireGuard — abstrai">
            Aprender WireGuard à mão (módulo anterior) ensina o que acontece de verdade:
            chaves, túnel, <code>AllowedIPs</code>. O Tailscale automatiza tudo isso —
            entender a base te deixa diagnosticar quando a mágica falha.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. A tailnet e o acesso zero-port</h2>
          <p className="text-text-2 mb-4">
            A <strong>tailnet</strong> é a sua rede privada Tailscale. Cada dispositivo que
            faz login recebe um IP estável na faixa <code>100.64.0.0/10</code> (CGNAT) e passa
            a enxergar todos os outros. Como a conexão é <em>iniciada de dentro para fora</em>
            por ambos os lados, <strong>nenhuma porta precisa ser aberta</strong> no firewall
            de borda — o atacante não tem o que escanear.
          </p>
          <WarnBox title="Por que isso é mais seguro que port forwarding">
            Expor SSH/Proxmox via port forwarding coloca um alvo na internet — scanners acham
            em minutos. Com a tailnet, o serviço só responde a quem já está autenticado na sua
            rede privada. Superfície de ataque pública: zero.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Instalação e primeiro login</h2>
          <CodeBlock lang="bash" code={`# Instalação (script oficial — funciona em Debian/Ubuntu e derivados)
curl -fsSL https://tailscale.com/install.sh | sh

# Subir o Tailscale — abre uma URL para login SSO no navegador
sudo tailscale up

# Ver o IP da tailnet desta máquina (faixa 100.x)
tailscale ip -4

# Listar todos os dispositivos da tailnet e o status da conexão
tailscale status`} />
          <InfoBox title="MagicDNS" className="mt-4">
            Com o MagicDNS ativo no admin da tailnet, você acessa cada máquina pelo
            <em> nome</em> em vez do IP: <code>ssh usuario@servidor</code> em vez de
            <code> ssh usuario@100.x.y.z</code>. O Tailscale resolve o nome dentro da rede.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['tailscale-instalado']} onChange={e => updateChecklist('tailscale-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['tailscale-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('config') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Conectar um segundo dispositivo (mesh)</h2>
          <p className="text-text-2 mb-4">
            Instale o Tailscale no seu notebook ou celular, faça login com <strong>a mesma
            conta</strong>, e os dois aparecem na tailnet. A partir daí, acesso direto — em
            casa, no 4G, em qualquer lugar.
          </p>
          <CodeBlock lang="bash" code={`# No segundo dispositivo (mesma conta SSO)
sudo tailscale up

# Do notebook, acesse o servidor pelo IP da tailnet — sem VPN manual, sem porta:
ssh usuario@100.x.y.z
# ou, com MagicDNS:
ssh usuario@servidor

# Ver se a conexão é direta (melhor) ou via DERP relay (fallback)
tailscale status      # "direct" vs "relay \"...\""
tailscale ping servidor`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. ACLs — quem fala com quem</h2>
          <p className="text-text-2 mb-4">
            Por padrão todos os nós da tailnet se enxergam. O arquivo de <strong>política de
            ACL</strong> (editado no admin da tailnet) restringe isso — o princípio do menor
            privilégio aplicado à rede.
          </p>
          <CodeBlock lang="json" code={`{
  "tagOwners": {
    "tag:servidor": ["autogroup:admin"],
    "tag:lab":      ["autogroup:admin"]
  },
  "acls": [
    // Admins acessam tudo
    { "action": "accept", "src": ["autogroup:admin"], "dst": ["*:*"] },
    // Máquinas "lab" NÃO alcançam o servidor — só a internet via exit node
    { "action": "accept", "src": ["tag:lab"], "dst": ["tag:servidor:0"] }
  ]
}`} />
          <InfoBox title="Tailscale SSH" className="mt-4">
            O Tailscale pode até gerenciar o SSH: com <code>tailscale up --ssh</code> e uma
            regra <code>ssh</code> na ACL, a autenticação usa a identidade da tailnet — sem
            distribuir chaves manualmente. Útil, mas entenda o SSH por chave primeiro.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['tailscale-mesh']} onChange={e => updateChecklist('tailscale-mesh', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['tailscale-mesh'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('rede') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Subnet router — alcançar a LAN inteira</h2>
          <p className="text-text-2 mb-4">
            Você não precisa instalar o Tailscale em <em>cada</em> dispositivo da LAN. Um nó
            pode atuar como <strong>subnet router</strong> e expor uma sub-rede inteira para a
            tailnet — ótimo para alcançar impressoras, NAS ou VMs que não rodam Tailscale.
          </p>
          <CodeBlock lang="bash" code={`# No nó que tem acesso à LAN — anuncia a sub-rede 192.168.1.0/24
sudo tailscale up --advertise-routes=192.168.1.0/24

# É preciso habilitar o encaminhamento de pacotes no kernel:
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

# A rota anunciada precisa ser APROVADA no admin da tailnet
# (Machines → o nó → Edit route settings → aprovar a sub-rede).`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Exit node — sair pela internet de outro lugar</h2>
          <p className="text-text-2 mb-4">
            Um <strong>exit node</strong> faz todo o tráfego de internet de um dispositivo
            sair por <em>outro</em> nó da tailnet — como um VPN tradicional, mas dentro da sua
            própria rede. Útil em redes públicas não confiáveis.
          </p>
          <CodeBlock lang="bash" code={`# No nó que servirá de saída
sudo tailscale up --advertise-exit-node
# (aprove o exit node no admin da tailnet)

# No cliente que quer usar essa saída
sudo tailscale up --exit-node=100.x.y.z
tailscale status        # confirma "exit node: ..."

# Voltar a sair pela internet local
sudo tailscale up --exit-node=`} />

          <WindowsComparisonBox
            windowsLabel="Windows (RRAS / Always On VPN)"
            linuxLabel="Linux (Tailscale)"
            windowsCode={`# VPN tradicional no Windows Server
# RRAS (Routing and Remote Access) ou Always On VPN:
# - Servidor VPN exposto na internet (porta aberta)
# - Certificados/políticas distribuídos por GPO
# - Topologia hub-and-spoke (tudo passa pelo servidor)
# Funciona, mas é um alvo público e dá trabalho de manter.`}
            linuxCode={`# Tailscale — mesh sem porta exposta
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up        # login SSO, e pronto
# - Zero porta aberta na internet (NAT traversal)
# - Identidade via SSO, ACLs centralizadas
# - Mesh: cada nó fala direto com cada nó`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['tailscale-subnet']} onChange={e => updateChecklist('tailscale-subnet', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['tailscale-subnet'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section id="tor-hidden-service" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold mb-6">8. Horizonte — Tor Hidden Service</h2>
          <p className="text-text-2 mb-4">
            A tailnet te dá acesso <em>privado</em> sem abrir portas. O <strong>Tor Hidden
            Service</strong> resolve um problema diferente: publicar um serviço de forma{' '}
            <strong>anônima e resistente a censura</strong> — acessível a qualquer um, mas sem
            revelar o IP do servidor nem abrir porta no firewall de borda. O serviço ganha um
            endereço <code>.onion</code> e só responde pela rede Tor.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-bg-2 border border-info/30">
              <p className="font-bold text-info mb-2 text-sm">🔗 Tailscale</p>
              <p className="text-sm text-text-2">Acesso <strong>privado</strong> — só quem está na sua tailnet entra. Identidade conhecida, baixa latência.</p>
            </div>
            <div className="p-4 rounded-lg bg-bg-2 border border-accent/30">
              <p className="font-bold text-accent mb-2 text-sm">🧅 Tor Hidden Service</p>
              <p className="text-sm text-text-2">Acesso <strong>público e anônimo</strong> — qualquer um com o <code>.onion</code> acessa, sem saber seu IP. Resistente a censura, mais lento.</p>
            </div>
          </div>
          <p className="text-text-2 mb-3">
            Publicar um serviço local (ex.: um site na porta 80) como hidden service:
          </p>
          <CodeBlock lang="bash" code={`# Instalar o Tor
sudo apt install tor -y

# Declarar o hidden service em /etc/tor/torrc
sudo tee -a /etc/tor/torrc << 'EOF'
HiddenServiceDir /var/lib/tor/meu_site/
HiddenServicePort 80 127.0.0.1:80
EOF

sudo systemctl restart tor

# O Tor gera o endereço .onion na primeira execução:
sudo cat /var/lib/tor/meu_site/hostname
# → algo como: abcd1234...xyz.onion  (acesse pelo Tor Browser)`} />
          <InfoBox title="Como o .onion não precisa de porta aberta" className="mt-4">
            O serviço nunca recebe conexões de entrada da internet. O daemon Tor, rodando no
            servidor, abre conexões <em>de saída</em> para a rede Tor e atua como ponte. O
            tráfego é criptografado fim a fim e o IP real do servidor nunca é exposto — o
            mesmo princípio de &quot;não dar o que escanear&quot; da tailnet, levado ao extremo.
          </InfoBox>
          <WarnBox title="Uso legítimo" className="mt-4">
            Hidden services existem para <strong>privacidade e resistência a censura</strong> —
            jornalismo, denúncia segura, acesso em redes hostis, publicar um serviço sem expor
            infraestrutura. Use para fins legítimos. Para a maioria dos homelabs, a tailnet
            (acesso privado) já basta; o <code>.onion</code> entra quando você precisa de
            acesso <em>público</em> sem revelar o servidor.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Subnet router não funciona — a LAN não responde', sol: 'Faltou habilitar ip_forward no kernel OU aprovar a rota anunciada no admin da tailnet. Os dois passos são obrigatórios.' },
              { erro: 'Conexão sempre via "relay" (DERP), nunca direta', sol: 'O NAT traversal não furou. Geralmente é firewall de borda bloqueando UDP — o DERP funciona, mas é mais lento. Verifique com tailscale netcheck.' },
              { erro: 'Outro dispositivo não aparece na tailnet', sol: 'Login com conta diferente. Os dois precisam usar a MESMA conta/organização para estarem na mesma tailnet.' },
              { erro: 'Achei que o Tailscale dispensa hardening do SSH', sol: 'A tailnet reduz a superfície, mas mantenha SSH por chave e sem root — defesa em profundidade não some porque a rede ficou privada.' },
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

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/tailscale" />

      </div>
    </main>
  );
}
