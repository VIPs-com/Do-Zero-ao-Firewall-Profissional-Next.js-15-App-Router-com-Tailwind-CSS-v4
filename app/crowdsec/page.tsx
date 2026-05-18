'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { FileText, Filter, Brain, Radio, Ban, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint FORTALEZA — CrowdSec, o IPS colaborativo. Conteúdo adaptado do guia
   "Fortaleza Proxmox" (CC BY-SA 4.0). */

type CrowdsecTab = 'conceito' | 'cenarios' | 'bouncer';

const CHECKLIST_ITEMS = [
  { id: 'crowdsec-instalado', label: 'Instalei o CrowdSec e inspecionei os alertas com cscli metrics / cscli alerts list' },
  { id: 'crowdsec-cenarios',  label: 'Instalei uma collection do Hub (ex.: crowdsecurity/sshd) e entendi cenário comportamental vs regex' },
  { id: 'crowdsec-bouncer',   label: 'Instalei o firewall-bouncer-nftables e confirmei que decisões viram bloqueios reais' },
];

export default function CrowdsecPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<CrowdsecTab>('conceito');

  useEffect(() => {
    trackPageVisit('/crowdsec');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-crowdsec min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">CrowdSec</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo C06 · Hardening do Host</div>
          <h1 className="text-4xl font-bold mb-4">🛰️ CrowdSec — IPS Colaborativo</h1>
          <p className="text-text-2 text-lg mb-6">
            O <strong>Fail2ban</strong> te ensinou a anatomia de um log e de um IPS local por
            regex. O <strong>CrowdSec</strong> leva o mesmo conceito adiante: cenários
            <em> comportamentais</em>, defesa <em>colaborativa</em> e uma blocklist alimentada
            por toda a comunidade. Você não defende sozinho.
          </p>
        </div>

        <FluxoCard
          title="Como o CrowdSec decide bloquear"
          steps={[
            { label: 'Log',     sub: 'auth.log, nginx, journald — fontes de eventos',     icon: <FileText size={14}/>, color: 'border-info/50' },
            { label: 'Parser',  sub: 'normaliza o log em eventos estruturados',            icon: <Filter size={14}/>,   color: 'border-accent/50' },
            { label: 'Cenário', sub: 'detecta padrões de comportamento (não só 1 regex)',  icon: <Brain size={14}/>,    color: 'border-warn/50' },
            { label: 'LAPI',    sub: 'registra a decisão (ban X por Y horas)',             icon: <Radio size={14}/>,    color: 'border-layer-6/50' },
            { label: 'Bouncer', sub: 'aplica a decisão — bloqueia o IP no firewall',       icon: <Ban size={14}/>,      color: 'border-err/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '🛰️ Conceito & Instalação' },
              { id: 'cenarios', label: '⚙️ Collections & Cenários' },
              { id: 'bouncer',  label: '🚧 Bouncers & Console' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CrowdsecTab)}
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
          <h2 className="text-2xl font-bold mb-6">1. CrowdSec vs Fail2ban</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-2">Critério</th>
                  <th className="text-left py-2 pr-4 text-info">Fail2ban</th>
                  <th className="text-left py-2 text-ok">CrowdSec</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Detecção</td>
                  <td className="py-2 pr-4">Regex estática por linha de log</td>
                  <td className="py-2">Cenários comportamentais (padrões no tempo)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Inteligência</td>
                  <td className="py-2 pr-4">Local — só vê o seu servidor</td>
                  <td className="py-2">Colaborativa — blocklist da comunidade</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Aplicação do bloqueio</td>
                  <td className="py-2 pr-4">O próprio Fail2ban escreve no firewall</td>
                  <td className="py-2"><em>Bouncers</em> desacoplados (firewall, nginx, etc.)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-text">Arquitetura</td>
                  <td className="py-2 pr-4">Monolítica (um daemon)</td>
                  <td className="py-2">Agent + LAPI + bouncers + Hub de cenários</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox title="Não é substituir — é evoluir">
            Aprenda Fail2ban primeiro: ele ensina a anatomia de um log e de um IPS. O CrowdSec
            é o passo seguinte — o mesmo conceito, mas com detecção comportamental e a força
            de uma rede de defesa coletiva. Os dois podem até coexistir.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Arquitetura — as 4 peças</h2>
          <ul className="space-y-2 text-text-2 mb-6 list-disc pl-5">
            <li><strong>Agent</strong> — lê os logs, aplica <em>parsers</em> e <em>cenários</em>, detecta comportamento malicioso.</li>
            <li><strong>LAPI</strong> (Local API) — recebe os alertas e mantém a lista de <em>decisões</em> (quem está banido e até quando).</li>
            <li><strong>Bouncers</strong> — componentes que <em>consultam</em> a LAPI e aplicam as decisões (no firewall, no Nginx, no Cloudflare…).</li>
            <li><strong>Hub</strong> — repositório de <em>collections</em>: parsers + cenários prontos para cada serviço (SSH, Nginx, etc.).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Instalação</h2>
          <CodeBlock lang="bash" code={`# Repositório oficial do CrowdSec + instalação do agent
curl -s https://install.crowdsec.net | sudo sh
sudo apt install crowdsec -y

# O serviço sobe e já começa a ler os logs declarados em /etc/crowdsec/acquis.yaml
systemctl status crowdsec

# Painel de saúde — eventos lidos, cenários carregados, decisões ativas
sudo cscli metrics

# Alertas detectados e decisões (bans) em vigor
sudo cscli alerts list
sudo cscli decisions list`} />
          <InfoBox title="cscli — sua ferramenta de linha de comando" className="mt-4">
            Tudo no CrowdSec passa pelo <code>cscli</code>: <code>cscli metrics</code> (saúde),
            <code> cscli hub list</code> (o que está instalado), <code>cscli decisions</code>
            (bans), <code>cscli alerts</code> (detecções). É o <code>fail2ban-client</code> —
            só que para um sistema bem maior.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['crowdsec-instalado']} onChange={e => updateChecklist('crowdsec-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['crowdsec-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('cenarios') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Collections — parsers e cenários do Hub</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>collection</strong> empacota os parsers e cenários de um serviço. Em
            vez de escrever regex à mão, você instala a collection oficial e ganha detecção
            pronta e mantida pela comunidade.
          </p>
          <CodeBlock lang="bash" code={`# O que já está instalado
sudo cscli collections list

# Instalar a collection de SSH (parsers do sshd + cenários de brute force)
sudo cscli collections install crowdsecurity/sshd

# Outras collections úteis
sudo cscli collections install crowdsecurity/nginx
sudo cscli collections install crowdsecurity/base-http-scenarios
sudo cscli collections install crowdsecurity/linux

# Aplicar — recarrega o agent
sudo systemctl reload crowdsec`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Cenário comportamental vs regex estática</h2>
          <p className="text-text-2 mb-4">
            O Fail2ban olha <em>uma linha</em>: &quot;esta linha casa o failregex? conta +1&quot;.
            O CrowdSec olha o <em>comportamento ao longo do tempo</em> — e isso pega ataques
            que uma regex sozinha não vê.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-bg-2 border border-info/30">
              <p className="font-bold text-info mb-2 text-sm">Fail2ban — regex</p>
              <p className="text-sm text-text-2">5 linhas &quot;Failed password&quot; em 10 min → ban. Simples e eficaz para força bruta óbvia.</p>
            </div>
            <div className="p-4 rounded-lg bg-bg-2 border border-ok/30">
              <p className="font-bold text-ok mb-2 text-sm">CrowdSec — cenário</p>
              <p className="text-sm text-text-2">&quot;mesmo IP varrendo muitos usuários diferentes&quot;, &quot;crawl HTTP agressivo&quot;, &quot;tentativa de path traversal&quot; — padrões, não uma linha.</p>
            </div>
          </div>
          <CodeBlock lang="bash" code={`# Ver os cenários ativos e quantas vezes cada um disparou
sudo cscli scenarios list
sudo cscli metrics | grep -A20 "Scenario Metrics"

# Simular: gerar tentativas falhas de SSH e observar o alerta nascer
sudo cscli alerts list      # após algumas tentativas, o IP aparece aqui
sudo cscli decisions list   # e a decisão de ban também`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['crowdsec-cenarios']} onChange={e => updateChecklist('crowdsec-cenarios', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['crowdsec-cenarios'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('bouncer') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Bouncers — quem aplica a decisão</h2>
          <p className="text-text-2 mb-4">
            O agent <em>detecta</em> e a LAPI <em>registra</em> a decisão — mas nada é
            bloqueado até um <strong>bouncer</strong> entrar em cena. O bouncer consulta a
            LAPI e aplica os bans. O mais comum num servidor: o bouncer de firewall.
          </p>
          <CodeBlock lang="bash" code={`# Bouncer de firewall — variante nftables (use a iptables se o host usar iptables)
sudo apt install crowdsec-firewall-bouncer-nftables -y

# Confirmar que o bouncer está registrado e conectado à LAPI
sudo cscli bouncers list

# Ver, no nftables, a tabela que o bouncer cria com os IPs banidos
sudo nft list ruleset | grep -i crowdsec

# Testar: banir um IP manualmente e ver o bouncer aplicar
sudo cscli decisions add --ip 203.0.113.10 --duration 4h --reason "teste manual"
sudo cscli decisions list
# Remover depois:
sudo cscli decisions delete --ip 203.0.113.10`} />
          <WarnBox title="Não se banir sozinho" className="mt-4">
            Antes de testar, adicione o seu IP de administração à whitelist
            (<code>/etc/crowdsec/parsers/s02-enrich/whitelists.yaml</code>). Se você se banir,
            recupere o acesso pelo console local/KVM e rode{' '}
            <code>cscli decisions delete --ip SEU_IP</code>.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Console & blocklist da comunidade</h2>
          <p className="text-text-2 mb-4">
            Ao registrar a instância no <strong>Console do CrowdSec</strong>, você passa a
            receber a <em>community blocklist</em> — IPs já reportados por milhares de outras
            instalações. Você bloqueia o atacante <em>antes</em> de ele te atacar.
          </p>
          <CodeBlock lang="bash" code={`# Registrar a instância no Console (pegue o token em app.crowdsec.net)
sudo cscli console enroll <SEU_TOKEN_DO_CONSOLE>

# Ativar a community blocklist (decisões compartilhadas pela rede CrowdSec)
sudo cscli collections install crowdsecurity/linux
sudo systemctl reload crowdsec

# As decisões com origem "lists" vêm da comunidade:
sudo cscli decisions list -o human | grep lists`} />

          <WindowsComparisonBox
            windowsLabel="Windows / Nuvem"
            linuxLabel="Linux (CrowdSec)"
            windowsCode={`# Detecção colaborativa no mundo Windows/cloud
# Microsoft Defender + threat intelligence da Microsoft
# Azure Sentinel (SIEM) correlaciona sinais e
# consome feeds de threat intelligence.
# Modelo: telemetria centralizada no fornecedor.`}
            linuxCode={`# CrowdSec — threat intelligence open-source
sudo cscli console enroll <TOKEN>
# A rede CrowdSec agrega sinais de milhares de
# instâncias e devolve uma blocklist comunitária.
# Modelo: defesa coletiva, você contribui e consome.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['crowdsec-bouncer']} onChange={e => updateChecklist('crowdsec-bouncer', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['crowdsec-bouncer'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'CrowdSec instalado, mas nada é bloqueado', sol: 'O agent só detecta. Sem um bouncer instalado e registrado (cscli bouncers list), nenhuma decisão vira bloqueio real.' },
              { erro: 'cscli metrics mostra 0 eventos lidos', sol: 'O caminho do log em /etc/crowdsec/acquis.yaml está errado ou o serviço não tem permissão de leitura. Confira e reload.' },
              { erro: 'Me bani e perdi o SSH', sol: 'Recupere pelo console local, rode cscli decisions delete --ip SEU_IP e adicione seu IP ao whitelists.yaml para não repetir.' },
              { erro: 'Misturar Fail2ban e CrowdSec mexendo nas mesmas regras', sol: 'Os dois escrevem no firewall. Rodando juntos, escolha quem gerencia o quê — ou desative o jail do Fail2ban que o CrowdSec já cobre.' },
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

        <ModuleNav order={ADVANCED_ORDER} currentPath="/crowdsec" />

      </div>
    </main>
  );
}
