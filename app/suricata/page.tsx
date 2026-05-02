'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Shield, AlertTriangle, Eye, Zap, FileText,
  Terminal, Server, Activity, ChevronLeft, ChevronRight, Network,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'suricata-instalado',
    text: 'Instalar Suricata e verificar versão',
    sub: 'sudo add-apt-repository ppa:oisf/suricata-stable && apt install suricata suricata-update && suricata --build-info',
  },
  {
    id: 'suricata-regras',
    text: 'Criar regra customizada e confirmar alerta no EVE JSON',
    sub: 'tee /etc/suricata/rules/custom.rules — sid único >= 1000000 — reload com kill -USR2',
  },
  {
    id: 'suricata-ips',
    text: 'Configurar modo IPS com NFQUEUE e testar drop',
    sub: 'nft add rule inet filter forward queue num 0 bypass && suricata -q 0 -D',
  },
];

const erros = [
  {
    title: 'Regra sem SID único — Suricata recusa carregar',
    desc: 'Todo rule deve ter um sid: único. SIDs duplicados causam falha silenciosa ao recarregar.',
    fix: 'sudo suricata -T -c /etc/suricata/suricata.yaml\n# -T valida config completa sem subir o processo',
  },
  {
    title: 'Interface errada no suricata.yaml — zero capturas',
    desc: 'Se af-packet aponta para eth0 mas o tráfego passa em eth1, Suricata monitora a interface errada.',
    fix: 'ip link show                  # listar interfaces ativas\nip -s link show eth1          # ver contadores de pacotes na interface',
  },
  {
    title: 'NFQUEUE sem regra nftables — modo IPS não funciona',
    desc: 'No modo IPS, sem a regra "queue" ativa no nftables os pacotes passam direto, ignorando o Suricata.',
    fix: 'nft list ruleset | grep queue # confirmar que a regra queue existe\nsudo systemctl status suricata # verificar se está rodando',
  },
  {
    title: 'EVE JSON vazio — outputs não configurados',
    desc: 'O formato fast.log pode estar habilitado mas eve-log precisa de "enabled: yes" explicitamente no yaml.',
    fix: 'grep -A5 "eve-log" /etc/suricata/suricata.yaml\n# Deve mostrar: enabled: yes',
  },
];

export default function SuricataPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/suricata');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-suricata min-h-screen">
      {/* Hero */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayerBadge layer="Camada 4" />
            <span className="section-label">Segurança · IDS/IPS</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🛡️ Suricata IDS/IPS
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            O olho que vê o que o firewall não vê. Enquanto nftables filtra por IPs e portas (Camadas 3–4),
            o Suricata inspeciona o <strong className="text-text">payload real</strong> do tráfego —
            detecta exploits, scans e malware que passariam invisíveis pelas regras tradicionais.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['IDS', 'IPS', 'NFQUEUE', 'EVE JSON', 'Regras Suricata', 'Emerging Threats', 'af-packet'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* IDS vs IPS vs Firewall */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Eye className="text-[var(--mod)]" size={22} />
            IDS vs IPS vs Firewall
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-2 border-b border-border">
                  <th className="text-left p-3 text-text-2 font-mono">Ferramenta</th>
                  <th className="text-left p-3 text-text-2 font-mono">Inspeciona</th>
                  <th className="text-left p-3 text-text-2 font-mono">Pode Bloquear</th>
                  <th className="text-left p-3 text-text-2 font-mono">Exemplos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-mono text-text">Firewall</td>
                  <td className="p-3 text-text-2">IP, porta, protocolo (L3–L4)</td>
                  <td className="p-3 text-ok font-medium">✅ Sim</td>
                  <td className="p-3 text-text-2 font-mono text-xs">nftables, iptables</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-mono text-text">IDS</td>
                  <td className="p-3 text-text-2">Payload (L7), assinaturas, anomalias</td>
                  <td className="p-3 text-err font-medium">❌ Só alerta</td>
                  <td className="p-3 text-text-2 font-mono text-xs">Suricata af-packet</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[var(--mod)] font-semibold">IPS</td>
                  <td className="p-3 text-text-2">Payload (L7), assinaturas, anomalias</td>
                  <td className="p-3 text-ok font-medium">✅ Bloqueia inline</td>
                  <td className="p-3 text-text-2 font-mono text-xs">Suricata NFQUEUE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox title="Um Suricata, dois modos">
            O mesmo processo Suricata pode rodar como IDS (af-packet — lê cópia do tráfego, passivo, zero impacto)
            ou IPS (NFQUEUE — tráfego passa pelo Suricata inline, pode <strong>dropar em tempo real</strong>).
            A diferença está apenas em como você o inicia e no que o kernel entrega.
          </InfoBox>
        </section>

        {/* Arquitetura */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Network className="text-[var(--mod)]" size={22} />
            Arquitetura de Integração
          </h2>
          <FluxoCard
            title="Fluxo IPS: pacote → NFQUEUE → Suricata → veredicto"
            steps={[
              { label: 'Pacote WAN', sub: 'eth0 / eth1', icon: <Network size={14} />, color: 'border-info/50' },
              { label: 'nftables', sub: 'queue num 0', icon: <Shield size={14} />, color: 'border-accent/50' },
              { label: 'Suricata Engine', sub: 'regras + assinaturas', icon: <Eye size={14} />, color: 'border-[var(--color-layer-4)]/50' },
              { label: 'Veredicto', sub: 'alert / drop / pass', icon: <AlertTriangle size={14} />, color: 'border-warn/50' },
              { label: 'EVE JSON', sub: '/var/log/suricata/', icon: <FileText size={14} />, color: 'border-ok/50' },
            ]}
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-bg-2 border border-border">
              <h3 className="font-semibold text-text mb-2">Modo IDS — af-packet</h3>
              <p className="text-sm text-text-2 mb-2">
                Suricata lê uma <strong className="text-text">cópia do tráfego</strong> via kernel bypass.
                Não interfere no fluxo. Gera alertas no EVE JSON. Zero impacto em latência.
              </p>
              <code className="text-xs font-mono text-ok block">suricata -i eth1 --af-packet</code>
            </div>
            <div className="p-4 rounded-lg bg-bg-2 border border-[var(--mod)]/40">
              <h3 className="font-semibold text-[var(--mod)] mb-2">Modo IPS — NFQUEUE</h3>
              <p className="text-sm text-text-2 mb-2">
                Pacotes passam <strong className="text-text">pelo</strong> Suricata antes de continuar.
                Pode dropar em tempo real. Requer regra nftables com <code className="font-mono text-xs">queue</code>.
              </p>
              <code className="text-xs font-mono text-warn block">suricata -q 0 -D</code>
            </div>
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Terminal className="text-[var(--mod)]" size={22} />
            Instalação
          </h2>
          <div className="space-y-6">
            <div>
              <StepItem number={1} title="Adicionar repositório OISF" description="O PPA OISF traz sempre a versão estável mais recente com todos os recursos compilados." />
              <div className="mt-3 space-y-3">
                <CodeBlock lang="bash" code={`# Ubuntu 22.04 / 24.04
sudo add-apt-repository ppa:oisf/suricata-stable
sudo apt update`} />
                <InfoBox title="PPA OISF vs pacote Ubuntu padrão">
                  O pacote do Ubuntu main pode estar algumas versões atrás. O PPA oficial da OISF
                  (Open Information Security Foundation) traz sempre a última estável com todos os recursos compilados.
                </InfoBox>
              </div>
            </div>
            <div>
              <StepItem number={2} title="Instalar Suricata e gerenciador de regras" description="suricata-update é o gerenciador de fontes de regras (Emerging Threats, etc.)." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`sudo apt install -y suricata suricata-update
suricata --build-info        # confirmar versão e recursos compilados`} />
              </div>
            </div>
            <div>
              <StepItem number={3} title="Verificar serviço e baixar primeiras regras" description="Na primeira instalação o Suricata inicia em modo IDS com a interface padrão do yaml." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`sudo systemctl status suricata
sudo suricata-update          # baixa Emerging Threats Open (~40.000 regras)
ls /var/lib/suricata/rules/   # confirmar download`} />
              </div>
            </div>
          </div>
        </section>

        {/* Configuração */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Server className="text-[var(--mod)]" size={22} />
            Configuração Básica — <code className="font-mono text-base">/etc/suricata/suricata.yaml</code>
          </h2>
          <p className="text-text-2 mb-4">
            O arquivo <code className="font-mono text-sm">suricata.yaml</code> tem ~2000 linhas.
            As seções críticas para um lab com três zonas (WAN/DMZ/LAN):
          </p>
          <CodeBlock lang="yaml" code={`# /etc/suricata/suricata.yaml — trechos essenciais

vars:
  address-groups:
    HOME_NET: "[192.168.56.0/24,192.168.57.0/24]"  # DMZ + LAN
    EXTERNAL_NET: "!\$HOME_NET"
  port-groups:
    HTTP_PORTS:  "80"
    HTTPS_PORTS: "443"
    SSH_PORTS:   "22"

# Modo IDS — captura passiva na interface que enxerga o tráfego
af-packet:
  - interface: eth1            # interface DMZ/LAN (ajuste ao seu lab)
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes

# Logs de saída
outputs:
  - fast:
      enabled: yes
      filename: fast.log       # log legível por humanos
  - eve-log:
      enabled: yes             # ← CRÍTICO: JSON estruturado
      filetype: regular
      filename: eve.json
      types:
        - alert:
            payload: yes
        - http:
        - dns:
        - tls:
        - flow:

# Arquivos de regras a carregar
rule-files:
  - suricata.rules             # regras do suricata-update
  - /etc/suricata/rules/custom.rules`} />
          <WarnBox title="Sempre validar antes de reiniciar">
            {`sudo suricata -T -c /etc/suricata/suricata.yaml`}<br />
            O flag <code className="font-mono text-xs">-T</code> valida a config completa (regras incluídas)
            sem subir o processo. Erros de sintaxe numa regra impedem o reload silenciosamente.
          </WarnBox>
        </section>

        {/* Anatomia de uma Regra */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <FileText className="text-[var(--mod)]" size={22} />
            Anatomia de uma Regra
          </h2>
          <div className="p-4 rounded-lg bg-bg-2 border border-[var(--mod)]/30 font-mono text-sm mb-6 overflow-x-auto">
            <div className="text-text-2 text-xs mb-3">Estrutura:</div>
            <div className="text-text leading-relaxed">
              <span className="text-ok font-bold">alert</span>{' '}
              <span className="text-info">tcp</span>{' '}
              <span className="text-text-2">any any </span>
              <span className="text-text">{'→'} </span>
              <span className="text-warn">\$HOME_NET 22 </span>
              <span className="text-text-2">(</span>
              <span className="text-accent">msg:</span><span className="text-text">&quot;SSH scan&quot;</span>
              <span className="text-text-2">; </span>
              <span className="text-accent">sid:</span><span className="text-info">1000001</span>
              <span className="text-text-2">; </span>
              <span className="text-accent">rev:</span><span className="text-info">1</span>
              <span className="text-text-2">;)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-text-2 text-sm mb-3 uppercase tracking-wide">Ações</h3>
              <div className="space-y-2 text-sm">
                {([
                  ['alert', 'gera alerta no EVE JSON (IDS)', 'text-warn'],
                  ['drop',  'descarta pacote + alerta (IPS)', 'text-err'],
                  ['pass',  'permite pacote sem inspecionar', 'text-ok'],
                  ['reject','envia RST/ICMP + descarta (TCP/UDP)', 'text-err'],
                ] as [string, string, string][]).map(([action, desc, color]) => (
                  <div key={action} className="flex gap-3 items-start">
                    <code className={`font-mono ${color} w-14 shrink-0 font-bold`}>{action}</code>
                    <span className="text-text-2">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-text-2 text-sm mb-3 uppercase tracking-wide">Opções Essenciais</h3>
              <div className="space-y-2 text-sm">
                {([
                  ['msg',       'descrição humana do alerta'],
                  ['sid',       'ID único (>= 1.000.000 para customizados)'],
                  ['rev',       'versão da regra'],
                  ['content',   'busca literal no payload'],
                  ['pcre',      'regex no payload'],
                  ['flow',      'direção (to_server, established)'],
                  ['threshold', 'limitar alertas repetidos'],
                ] as [string, string][]).map(([opt, desc]) => (
                  <div key={opt} className="flex gap-2 items-start">
                    <code className="font-mono text-info text-xs w-20 shrink-0">{opt}</code>
                    <span className="text-text-2 text-xs">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Criar regras customizadas
sudo mkdir -p /etc/suricata/rules
sudo tee /etc/suricata/rules/custom.rules << 'EOF'
# Detectar scan SSH (mais de 5 tentativas em 60s)
alert tcp any any -> \$HOME_NET 22 (
  msg:"Possivel scan SSH";
  flags:S;
  threshold: type threshold, track by_src, count 5, seconds 60;
  sid:1000001; rev:1;
)

# Detectar curl no User-Agent (pode indicar script automatizado)
alert http any any -> \$HOME_NET any (
  msg:"User-Agent curl detectado";
  http.user_agent; content:"curl/";
  sid:1000002; rev:1;
)

# Detectar credenciais em HTTP claro (POST com password=)
alert http any any -> \$HOME_NET any (
  msg:"Possiveis credenciais em HTTP sem criptografia";
  flow:to_server,established;
  http.method; content:"POST";
  http.request_body; content:"password="; nocase;
  sid:1000003; rev:1;
)
EOF

# Recarregar regras sem reiniciar (zero downtime)
sudo kill -USR2 \$(cat /var/run/suricata.pid)
# ou via suricatasc:
sudo suricatasc -c reload-rules`} />
        </section>

        {/* Emerging Threats */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Zap className="text-[var(--mod)]" size={22} />
            Emerging Threats — Regras da Comunidade
          </h2>
          <p className="text-text-2 mb-4">
            O <code className="font-mono text-sm">suricata-update</code> gerencia fontes de regras externas.
            A <strong className="text-text">ET Open</strong> (Emerging Threats Open) é gratuita,
            cobre ~40.000 ameaças conhecidas e é atualizada diariamente.
          </p>
          <CodeBlock lang="bash" code={`# Atualizar regras
sudo suricata-update

# Ver todas as fontes disponíveis
sudo suricata-update list-sources

# Habilitar fontes adicionais (gratuitas)
sudo suricata-update enable-source et/open
sudo suricata-update enable-source oisf/trafficid
sudo suricata-update enable-source ptresearch/attackdetection

# Quantas regras foram carregadas?
grep "rules loaded" /var/log/suricata/suricata.log

# Cron para atualização diária às 03:00
echo "0 3 * * * root suricata-update && kill -USR2 \$(cat /var/run/suricata.pid)" \\
  | sudo tee /etc/cron.d/suricata-update`} />
          <InfoBox title="Fontes de regras disponíveis">
            <ul className="text-sm space-y-1 mt-1">
              <li><code className="font-mono text-xs text-ok">et/open</code> — Emerging Threats Open (gratuito, ~40.000 regras)</li>
              <li><code className="font-mono text-xs text-ok">oisf/trafficid</code> — identificação de protocolos (gratuito)</li>
              <li><code className="font-mono text-xs text-ok">ptresearch/attackdetection</code> — PT Research (gratuito)</li>
              <li><code className="font-mono text-xs text-warn">et/pro</code> — ET Pro (pago — cobertura maior e tempo de resposta menor)</li>
            </ul>
          </InfoBox>
        </section>

        {/* EVE JSON */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <FileText className="text-[var(--mod)]" size={22} />
            EVE JSON — Logs Estruturados
          </h2>
          <p className="text-text-2 mb-4">
            O <code className="font-mono text-sm">eve.json</code> é o coração da análise Suricata:
            cada evento (alerta, fluxo, DNS, HTTP, TLS) é uma linha JSON separada, pronta para
            ingestão por Loki, Elasticsearch ou Grafana.
          </p>
          <CodeBlock lang="bash" code={`# Acompanhar alertas em tempo real
tail -f /var/log/suricata/eve.json | jq 'select(.event_type == "alert")'

# Exemplo de alerta EVE JSON:
{
  "timestamp": "2026-04-27T14:32:10.541+00:00",
  "event_type": "alert",
  "src_ip": "203.0.113.42",     "src_port": 54321,
  "dest_ip": "192.168.56.10",   "dest_port": 22,
  "proto": "TCP",
  "alert": {
    "action": "allowed",
    "signature_id": 1000001,
    "signature": "Possivel scan SSH",
    "severity": 2
  }
}

# Top IPs gerando mais alertas
sudo jq -r 'select(.event_type=="alert") | .src_ip' /var/log/suricata/eve.json \\
  | sort | uniq -c | sort -rn | head -10

# Filtrar por assinatura específica
sudo jq 'select(.event_type=="alert" and .alert.signature_id==1000001)' \\
  /var/log/suricata/eve.json

# Alertas das últimas 1h (requer jq 1.6+)
sudo jq 'select(.event_type=="alert" and (.timestamp > "2026-04-27T13"))' \\
  /var/log/suricata/eve.json`} />
          <HighlightBox title="Integração com Prometheus + Grafana (Sprint I.15)">
            O <code className="font-mono text-xs">eve.json</code> encaixa perfeitamente no stack de monitoramento já configurado:
            <strong className="text-text"> Promtail</strong> lê o eve.json →
            <strong className="text-text"> Loki</strong> indexa →
            <strong className="text-text"> Grafana</strong> exibe alertas em tempo real num dashboard dedicado.
            <br />
            Query Loki de exemplo:{' '}
            <code className="font-mono text-xs bg-bg-3 px-1 rounded">
              {'{'} filename=&quot;/var/log/suricata/eve.json&quot; {'}'} | json | event_type=&quot;alert&quot;
            </code>
          </HighlightBox>
        </section>

        {/* Modo IPS */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Shield className="text-[var(--mod)]" size={22} />
            Modo IPS — NFQUEUE
          </h2>
          <WarnBox title="⚠️ Teste SEMPRE em lab antes de produção">
            No modo IPS, uma regra de <code className="font-mono text-xs">drop</code> errada pode bloquear
            tráfego legítimo instantaneamente. Protocolo seguro: comece com <code className="font-mono text-xs">alert</code>,
            valide no EVE JSON por 24–48h, só então mude para <code className="font-mono text-xs">drop</code>.
          </WarnBox>
          <div className="mt-6 space-y-6">
            <div>
              <StepItem number={1} title="Configurar nftables para desviar tráfego para Suricata" description='Cria uma chain dedicada com "queue bypass" — fail-open garante tráfego mesmo se Suricata cair.' />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`# Criar tabela e chain dedicadas
sudo nft add table inet suricata
sudo nft add chain inet suricata forward \\
  '{ type filter hook forward priority -1 ; }'

# Enviar todo tráfego FORWARD para queue 0
# "bypass" = se Suricata não estiver rodando, pacote passa (fail-open)
# Remova "bypass" em produção para fail-closed (segurança máxima)
sudo nft add rule inet suricata forward queue num 0 bypass

# Confirmar
nft list ruleset | grep -A5 "suricata"`} />
              </div>
            </div>
            <div>
              <StepItem number={2} title="Iniciar Suricata em modo IPS (NFQUEUE)" description="Use -q 0 para ler da NFQUEUE 0. Para produção, edite o unit systemd." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`# Iniciar manualmente (modo daemon)
sudo suricata -q 0 -D

# Verificar que está lendo da queue
sudo suricatasc -c dump-counters | grep nfq

# Para uso permanente, editar o unit systemd
sudo systemctl edit suricata
# Adicionar:
# [Service]
# ExecStart=
# ExecStart=/usr/bin/suricata -q 0 -D -l /var/log/suricata

sudo systemctl restart suricata`} />
              </div>
            </div>
            <div>
              <StepItem number={3} title="Testar um drop (porta fictícia na rede)" description="Crie uma regra temporária de drop, valide no EVE JSON e remova após o teste." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`# Criar regra de drop temporária para teste
echo 'drop tcp any any -> \$HOME_NET 9999 (msg:"Teste IPS drop"; sid:9999999; rev:1;)' \\
  | sudo tee /tmp/test-drop.rules

# Adicionar ao yaml e recarregar
echo "  - /tmp/test-drop.rules" | sudo tee -a /etc/suricata/suricata.yaml
sudo kill -USR2 \$(cat /var/run/suricata.pid)

# De outra máquina: tentar conectar na porta 9999
nc -zv 192.168.56.10 9999
# Esperado: "Connection timed out" (drop silencioso) ou "refused" (reject)

# Confirmar no EVE JSON
tail -5 /var/log/suricata/eve.json | jq '.alert.action'
# "blocked"

# Remover regra de teste após validar
sudo sed -i '/test-drop.rules/d' /etc/suricata/suricata.yaml
sudo kill -USR2 \$(cat /var/run/suricata.pid)`} />
              </div>
            </div>
          </div>
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsLabel="Windows — Defender ATP / Snort"
          linuxLabel="Linux — Suricata"
          windowsCode={`# Windows Defender ATP (Microsoft 365)
# Regras via KQL no Microsoft Sentinel:
SecurityAlert
| where AlertName contains "SSH"
| project TimeGenerated, AlertName,
          RemoteIP, AlertSeverity
| order by TimeGenerated desc

# Alternativa open-source no Windows:
# Snort para Windows (mais antigo que Suricata)
# snort.exe -i 1 -c snort.conf -l C:\\Snort\\log

# Limitações Windows:
# - Sem NFQUEUE nativo (modo IPS limitado)
# - WinPcap/Npcap em vez de af-packet
# - Performance menor que Linux`}
          linuxCode={`# Suricata no Linux — IDS/IPS inline real

# Ver alertas em tempo real:
tail -f /var/log/suricata/eve.json \\
  | jq 'select(.event_type=="alert")'

# Regra de detecção SSH brute-force:
alert ssh any any -> \$HOME_NET 22 (
  msg:"SSH Brute Force";
  threshold: type both,
    track by_src,
    count 10, seconds 60;
  sid:2001219; rev:20;
)

# Top IPs atacando:
jq -r '.src_ip' eve.json \\
  | sort | uniq -c | sort -rn | head

# Recarregar regras sem parar o serviço:
sudo kill -USR2 \$(cat /var/run/suricata.pid)`}
        />

        {/* Exercícios */}
        <section>
          <h2 className="section-title text-2xl mb-4 flex items-center gap-2">
            <Activity className="text-[var(--mod)]" size={22} />
            Exercícios Guiados
          </h2>
          <div className="space-y-3">
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
        <section>
          <h2 className="section-title text-2xl mb-4">⚠️ Erros Comuns</h2>
          <div className="space-y-3">
            {erros.map((e, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 flex justify-between items-center bg-bg-2 hover:bg-bg-3 transition-colors"
                  onClick={() => setOpenError(openError === i ? null : i)}
                  aria-expanded={openError === i}
                  aria-controls={`error-${i}`}
                >
                  <span className="font-medium text-text text-sm">{e.title}</span>
                  <span className="text-text-2 text-xs">{openError === i ? '▲' : '▼'}</span>
                </button>
                {openError === i && (
                  <div id={`error-${i}`} className="px-4 py-3 bg-bg space-y-2">
                    <p className="text-text-2 text-sm">{e.desc}</p>
                    <CodeBlock lang="bash" code={e.fix} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Exercícios Guiados ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Instalar Suricata e Testar Detecção</p>
              <CodeBlock lang="bash" code={`# Instalar Suricata via PPA OISF
add-apt-repository ppa:oisf/suricata-stable -y
apt update && apt install suricata -y

# Verificar versão
suricata --version

# Configurar interface no suricata.yaml
IFACE=$(ip route show default | awk '/default/{print $5}')
sed -i "s/interface: eth0/interface: $IFACE/" /etc/suricata/suricata.yaml

# Atualizar regras Emerging Threats
suricata-update

# Testar modo IDS em background
suricata -c /etc/suricata/suricata.yaml -i $IFACE -D

# Verificar que está rodando
sleep 3 && suricatasc -c /var/run/suricata/suricata-command.socket version`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Criar Regra Customizada e Testar Alerta</p>
              <CodeBlock lang="bash" code={`# Criar regra personalizada para detectar acesso a /test-suricata
cat > /etc/suricata/rules/local.rules << 'EOF'
# Detectar requisições HTTP para /test-suricata
alert http any any -> any any (
  msg:"TESTE Acesso a URL suspeita";
  content:"/test-suricata";
  http_uri;
  sid:9000001;
  rev:1;
)

# Detectar scan de portas (SYN a muitas portas)
alert tcp any any -> $HOME_NET any (
  msg:"SCAN Port scan detectado";
  flags:S;
  threshold: type both, track by_src, count 20, seconds 10;
  sid:9000002;
  rev:1;
)
EOF

# Adicionar arquivo de regras ao suricata.yaml
echo "  - /etc/suricata/rules/local.rules" >> /etc/suricata/suricata.yaml

# Testar regras sem iniciar (verificar sintaxe)
suricata -T -c /etc/suricata/suricata.yaml

# Gerar tráfego de teste
curl http://localhost/test-suricata 2>/dev/null || true

# Ver alertas no EVE JSON
tail -f /var/log/suricata/eve.json | python3 -c "
import sys, json
for line in sys.stdin:
    e = json.loads(line.strip())
    if e.get('event_type') == 'alert':
        print(f'ALERTA: {e[\"alert\"][\"signature\"]} ({e[\"src_ip\"]})')
" &`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Analisar EVE JSON com jq</p>
              <CodeBlock lang="bash" code={`# Instalar jq para análise de JSON
apt install jq -y

# Ver alertas recentes
cat /var/log/suricata/eve.json | \
  jq 'select(.event_type == "alert") | {ts: .timestamp, sig: .alert.signature, src: .src_ip}' | \
  head -40

# Top 10 IPs gerando alertas
cat /var/log/suricata/eve.json | \
  jq -r 'select(.event_type == "alert") | .src_ip' | \
  sort | uniq -c | sort -rn | head -10

# Ver detalhes de alerta por SID
cat /var/log/suricata/eve.json | \
  jq 'select(.event_type == "alert" and .alert.signature_id == 9000001)'

# Estatísticas de tráfego
cat /var/log/suricata/eve.json | \
  jq -r '.event_type' | sort | uniq -c | sort -rn

# Monitorar em tempo real (equivalente a tail -f filtrado)
tail -f /var/log/suricata/eve.json | \
  jq --unbuffered 'select(.event_type == "alert") | "\(.timestamp) ALERTA: \(.alert.signature)"'`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/suricata" order={ADVANCED_ORDER} />
      </div>
    </div>
  );
}
