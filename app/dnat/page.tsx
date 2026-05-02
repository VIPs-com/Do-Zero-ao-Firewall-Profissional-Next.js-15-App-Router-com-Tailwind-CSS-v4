'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Target, ArrowRight, Shield, Terminal, AlertCircle, ChevronRight, Globe, Server, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { useBadges } from '@/context/BadgeContext';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { Circle, CheckCircle2 } from 'lucide-react';

const DNAT_CHECKLIST = [
  { id: 'dnat-web', text: 'DNAT para Web Server (Porta 443)' },
  { id: 'dnat-ssh', text: 'DNAT para SSH da DMZ (Porta 2222)' },
  { id: 'forward-web', text: 'Regra FORWARD para Web Server liberada' },
  { id: 'forward-ssh', text: 'Regra FORWARD para SSH da DMZ liberada' },
];

export default function DnatPage() {
  const [activeDeepDive, setActiveDeepDive] = React.useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('dnat');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-dnat">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">DNAT & PREROUTING</span>
      </div>

      <div className="section-label">Tópico 11 · Camada 3</div>
      <h1 className="section-title">🎯 DNAT & PREROUTING</h1>
      <p className="section-sub">
        DNAT (Destination NAT) permite que alguém de fora da rede acesse um servidor que está
        dentro da DMZ. O Firewall recebe o pacote e troca o IP de destino.
      </p>

      <FluxoCard
        title="Fluxo DNAT: Internet → Servidor DMZ"
        steps={[
          { label: 'Internet', sub: 'IP público :80', icon: <Globe className="w-4 h-4" />, color: 'border-[var(--color-layer-3)]' },
          { label: 'PREROUTING', sub: 'iptables -t nat', icon: <Shield className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'Firewall', sub: 'Traduz destino', icon: <ArrowRight className="w-4 h-4" />, color: 'border-accent/50' },
          { label: 'Servidor DMZ', sub: '192.168.56.120:80', icon: <Server className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: How it works */}
          <section id="acesso-externo">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Acesso Externo via DNAT</h2>
            </div>
            
            <div className="bg-bg-3 border border-border rounded-xl p-6 font-mono text-xs space-y-4 mb-8">
              <div className="pb-4 border-b border-border/50">
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📥 Pacote chegando na WAN</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span>USUARIO-EXTERNO</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span className="text-err">192.168.20.200:443</span>
                </div>
              </div>
              <div className="text-center text-accent py-1">↓ PREROUTING aplica DNAT ↓</div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📤 Pacote indo para a DMZ</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span>USUARIO-EXTERNO</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span className="text-ok">192.168.56.120:443</span>
                </div>
              </div>
            </div>

            <HighlightBox title="Analogia do Prédio">
              <p className="text-sm text-text-2">
                🎯 <strong>DNAT</strong> = recepcionista que redireciona o visitante: "vai para a sala 120"<br />
                🚪 <strong>FORWARD</strong> = segurança no corredor que verifica se pode entrar: "tem autorização?"
              </p>
            </HighlightBox>
          </section>

          {/* Section 2: PREROUTING */}
          <section id="prerouting">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <ArrowRight size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Por que PREROUTING?</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              O PREROUTING intercepta o pacote <strong>antes</strong> do kernel decidir para onde rotear. Se o IP fosse trocado depois, o kernel já teria decidido enviar o pacote para o próprio Firewall (INPUT) em vez de encaminhá-lo (FORWARD).
            </p>

            <CodeBlock 
              title="Regra DNAT no iptables"
              code="iptables -t nat -A PREROUTING -p tcp -d 192.168.20.200 --dport 443 -j DNAT --to 192.168.56.120:443" 
              lang="bash" 
            />
          </section>

          {/* Section 3: FORWARD */}
          <section id="forward">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. FORWARD Obrigatório</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              Essa é a dúvida que mais trava iniciantes. O DNAT apenas troca o IP. Você ainda precisa de uma regra na tabela filter para <strong>autorizar</strong> a passagem do pacote.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-ok">
                <h4 className="font-bold text-ok mb-3">✅ Regra Correta</h4>
                <div className="mb-4">
                  <CodeBlock code="iptables -A FORWARD -p tcp -d 192.168.56.120 --dport 443 -j ACCEPT" lang="bash" />
                </div>
                <p className="text-[10px] text-text-3">Usa o IP <strong>após o DNAT</strong> (192.168.56.120).</p>
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-err">
                <h4 className="font-bold text-err mb-3">❌ Erro Comum</h4>
                <div className="mb-4">
                  <CodeBlock code="iptables -A FORWARD -p tcp -d 192.168.20.200 --dport 443 -j ACCEPT" lang="bash" />
                </div>
                <p className="text-[10px] text-text-3">Usa o IP <strong>antes do DNAT</strong> (192.168.20.200). Nunca combina.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Múltiplos Serviços */}
          <section id="multiplos-servicos">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Múltiplos Serviços no Mesmo IP Público</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              Com um único IP público você pode expor vários serviços da DMZ usando portas diferentes. O Firewall redireciona cada porta para o servidor correto.
            </p>

            <div className="space-y-6">
              <CodeBlock
                title="HTTPS, FTP e SSH alternativo via DNAT"
                lang="bash"
                code={`# HTTPS para Web Server (DMZ)\niptables -t nat -A PREROUTING -p tcp -d IP-WAN --dport 443 \\\n  -j DNAT --to-destination 192.168.56.120:443\n\n# FTP Controle — conexão de comando (porta 21)\niptables -t nat -A PREROUTING -p tcp -d IP-WAN --dport 21 \\\n  -j DNAT --to-destination 192.168.56.200:21\n\n# FTP Passivo — portas de transferência de dados\niptables -t nat -A PREROUTING -p tcp -d IP-WAN --dport 50000:51000 \\\n  -j DNAT --to-destination 192.168.56.200\n\n# SSH via porta alternativa (obscurece a porta 22 no scan)\niptables -t nat -A PREROUTING -p tcp -d IP-WAN --dport 2222 \\\n  -j DNAT --to-destination 192.168.56.250:22\n\n# FORWARD para cada serviço (IP APÓS o DNAT)\niptables -A FORWARD -p tcp -d 192.168.56.120 --dport 443 -j ACCEPT\niptables -A FORWARD -p tcp -d 192.168.56.200 --dport 21 -j ACCEPT\niptables -A FORWARD -p tcp -d 192.168.56.200 --dport 50000:51000 -j ACCEPT\niptables -A FORWARD -p tcp -d 192.168.56.250 --dport 22 -j ACCEPT`}
              />

              <InfoBox title="Por que FTP precisa de duas faixas de porta?">
                <p className="text-sm text-text-2">
                  O FTP em modo passivo usa a <strong>porta 21</strong> para o canal de controle (comandos) e portas efêmeras altas (ex: 50000-51000) para os canais de dados.
                  Configure o servidor FTP com <code className="text-xs">PassivePorts 50000 51000</code> e exponha ambas as faixas via DNAT.
                </p>
              </InfoBox>

              <CodeBlock
                title="Monitorar tabela NAT em tempo real"
                lang="bash"
                code={`watch -n 1 'iptables -t nat -L PREROUTING -vnv'`}
              />
            </div>
          </section>

          {/* Section 6: PREROUTING — O Kernel Visto Por Dentro */}
          <section id="prerouting-kernel">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Server size={24} />
              </div>
              <h2 className="text-2xl font-bold">6. PREROUTING — O Kernel Visto Por Dentro</h2>
            </div>

            <InfoBox title="🔬 Os 5 Hooks do Netfilter — onde cada regra vive">
              <pre className="text-xs font-mono overflow-x-auto">{`Pacote chega na placa de rede (enp0s3):
         │
    ┌────▼────────┐
    │ PREROUTING  │ ← DNAT acontece AQUI (antes de decidir destino)
    └────┬────────┘
         │
    ┌────▼────────┐
    │   ROUTING   │ ← kernel decide: "é para mim?" (INPUT) ou encaminhar? (FORWARD)
    └────┬────────┘
         ├─── "é para mim" ──► INPUT  (SSH, Squid, serviços do próprio FW)
         │
    ┌────▼──────────────┐
    │  FORWARD           │ ← filtragem de pacotes que atravessam o FW
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │  POSTROUTING       │ ← SNAT acontece aqui (antes de sair pela placa)
    └───────────────────┘`}</pre>
            </InfoBox>

            <WarnBox title="⚡ Por que o DNAT TEM que ser no PREROUTING">
              <p className="text-sm">Se o DNAT acontecesse <em>depois</em> do ROUTING, o kernel veria <code className="text-xs">dst=192.168.20.200</code> (IP público = <em>&quot;sou eu&quot;</em>) e mandaria o pacote para <strong>INPUT</strong>. O pacote nunca chegaria no FORWARD nem no Web Server. O PREROUTING intercepta <strong>antes</strong> de qualquer decisão de destino — é a única janela possível para a troca.</p>
            </WarnBox>

            <div className="mt-4 space-y-4">
              <CodeBlock code={`# A troca cirúrgica no cabeçalho IP:

# ANTES da regra DNAT (pacote chega na placa WAN):
# src: 203.0.113.50    dst: 192.168.20.200  ← IP público do Firewall
# checksum: 0xA3F2

# DEPOIS (kernel trocou e recalculou o checksum):
# src: 203.0.113.50    dst: 192.168.56.120  ← IP privado do Web Server
# checksum: 0xB1C4    ← recalculado! pacote permanece íntegro

# Ver a regra e seu contador (pkts aumenta a cada nova conexão):
watch -n 1 "iptables -t nat -L PREROUTING -n -v"
# pkts  bytes  target  prot  ...
# 143   8580   DNAT    tcp   dpt:443  to:192.168.56.120:443`} />

              <CodeBlock code={`# O conntrack registra o mapeamento para o retorno automático:
conntrack -L | grep 192.168.56.120

# tcp 6 118 SYN_SENT
#   src=203.0.113.50 dst=192.168.20.200 sport=54876 dport=443  ← IDA (IP original)
#   src=192.168.56.120 dst=203.0.113.50 sport=443 dport=54876  ← VOLTA (desfaz o DNAT)
#   [UNREPLIED]  → muda para [ASSURED] após SYN-ACK
#
# Linha 1 = caminho de IDA (como o pacote chegou)
# Linha 2 = caminho de VOLTA esperado (conntrack vai desfazer o DNAT na resposta)`} />

              <CodeBlock code={`# Experimento com 2 terminais — veja a troca acontecendo ao vivo:

# TERMINAL 1 — antes do DNAT (placa WAN, IP público ainda):
tcpdump -i enp0s3 -nn dst port 443
# 203.0.113.50.54876 > 192.168.20.200.443: Flags [S]
#                      ^^^^^^^^^^^^^^^^
#                      IP público — antes da troca!

# TERMINAL 2 — depois do DNAT (placa DMZ, IP privado):
tcpdump -i enp0s8 -nn dst port 443
# 203.0.113.50.54876 > 192.168.56.120.443: Flags [S]
#                      ^^^^^^^^^^^^^^^^
#                      IP privado — depois da troca!

# TERMINAL 3 — gerar o tráfego:
curl -k https://192.168.20.200`} />

              <HighlightBox title="📋 DNAT + FORWARD — sempre duas regras obrigatórias">
                <div className="space-y-2 text-sm font-mono">
                  <p><span className="text-ok">Regra 1</span> (tabela nat):    PREROUTING → troca o endereço de destino</p>
                  <p><span className="text-ok">Regra 2</span> (tabela filter): FORWARD    → dá a permissão de passar</p>
                  <p className="text-err pt-1">DNAT sozinho = endereço trocado, mas FORWARD=DROP bloqueia o pacote</p>
                  <p className="text-err">FORWARD sozinho = permissão dada, mas pacote vai para o IP errado</p>
                </div>
              </HighlightBox>

              <div className="space-y-3 mt-4">
                {[
                  { id: 'prerouting-deep-dive', text: 'Entendi por que o DNAT deve acontecer antes do ROUTING (kernel)' },
                  { id: 'conntrack-dnat-mapping', text: 'Executei conntrack -L e li as duas linhas: IDA e VOLTA esperada' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    {checklist[item.id] ? (
                      <CheckCircle2 size={16} className="text-ok shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                    )}
                    <span className={cn(
                      "text-sm leading-tight transition-colors",
                      checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                    )}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 7: Erros Comuns (renumerado — era 5) */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">7. Erros Comuns</h2>
            </div>

            <WarnBox title="⚠️ Problemas frequentes com DNAT">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>curl no IP público falha de dentro da LAN</strong> → Hairpin NAT não configurado
                  → DNAT só funciona para tráfego externo; de dentro da rede use o IP interno direto (192.168.56.120)
                </li>
                <li>
                  <strong>Pacotes chegam ao servidor mas resposta não volta</strong> → regra FORWARD de retorno ausente
                  → adicionar <code className="text-xs">iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT</code>
                </li>
                <li>
                  <strong>dnat-web funciona mas dnat-ssh não</strong> → porta diferente ou SSH não está rodando na DMZ
                  → verificar se <code className="text-xs">-p tcp --dport 2222</code> aponta para porta correta e <code className="text-xs">ss -tlnp | grep 22</code>
                </li>
                <li>
                  <strong>iptables -t nat -L mostra a regra mas não funciona</strong> → ip_forward desabilitado
                  → <code className="text-xs">echo 1 &gt; /proc/sys/net/ipv4/ip_forward</code> e verificar <code className="text-xs">sysctl net.ipv4.ip_forward</code>
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* DNAT Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist DNAT
            </h3>
            <div className="space-y-3">
              {DNAT_CHECKLIST.map(item => (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-start gap-3 text-left group"
                >
                  {checklist[item.id] ? (
                    <CheckCircle2 size={14} className="text-ok shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={14} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                  )}
                  <span className={cn(
                    "text-[10px] leading-tight transition-colors",
                    checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                  )}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-accent" />
              Diagnóstico
            </h3>
            <div className="space-y-4">
              <CodeBlock title="Ver contadores DNAT" code="iptables -t nat -L -n -v" lang="bash" />
              <CodeBlock title="Ver autorizações" code="iptables -L FORWARD -n -v" lang="bash" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-err/5 border border-err/20">
            <h4 className="font-bold text-sm text-err mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              Risco de Pivoteamento
            </h4>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Ao abrir portas para o mundo, você cria um ponto de entrada. Se o servidor for invadido, ele pode ser usado para atacar a LAN.
            </p>
            <Link href="/pivoteamento" className="text-[10px] font-bold text-err hover:underline flex items-center gap-1 uppercase tracking-wider">
              Saiba como se proteger
              <ChevronRight size={10} />
            </Link>
          </div>

          <WarnBox title="Hairpin NAT">
            <p className="text-xs text-text-2 leading-relaxed">
              Se você tentar acessar o IP público de dentro da LAN e não funcionar, você precisa do Hairpin NAT (Loopback NAT).
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Entenda por que o DNAT precisa ser no PREROUTING e como o kernel processa cada pacote.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'kernel-hooks') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Hooks do Kernel</span>
              </div>
              <ArrowRight size={12} className="text-text-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>

      <DeepDiveModal
        dive={activeDeepDive}
        onClose={() => setActiveDeepDive(null)}
      />

      {/* Windows Comparison */}
      <div className="mt-12">
        <WindowsComparisonBox
          windowsLabel="Windows — Port Forwarding (RRAS / netsh)"
          linuxLabel="Linux — iptables DNAT"
          windowsCode={`# Windows Port Forwarding via netsh (sem RRAS)
# Encaminhar porta 80 do host para servidor interno
netsh interface portproxy add v4tov4 \\
  listenport=80 listenaddress=0.0.0.0 \\
  connectport=80 connectaddress=192.168.56.10

# Verificar regras ativas:
netsh interface portproxy show all

# Remover uma regra:
netsh interface portproxy delete v4tov4 \\
  listenport=80 listenaddress=0.0.0.0

# RRAS — Port Forwarding em ambiente corporativo:
# Server Manager → RRAS → NAT →
#   Interface WAN → Serviços e Portas →
#   Adicionar → Tipo: Web Server (HTTP) →
#   Endereço interno: 192.168.56.10
#   Porta privada: 80

# Windows Firewall — abrir porta de entrada:
netsh advfirewall firewall add rule \\
  name="HTTP Inbound" dir=in action=allow protocol=TCP localport=80`}
          linuxCode={`# Linux iptables DNAT — redirecionamento de porta

# Encaminhar porta 80 (WAN) → servidor DMZ 192.168.56.10:80
iptables -t nat -A PREROUTING \\
  -i eth0 -p tcp --dport 80 \\
  -j DNAT --to-destination 192.168.56.10:80

# Permitir o FORWARD desta conexão:
iptables -A FORWARD \\
  -d 192.168.56.10 -p tcp --dport 80 \\
  -m state --state NEW,ESTABLISHED \\
  -j ACCEPT

# Verificar regras DNAT ativas:
iptables -t nat -L PREROUTING -n -v

# Múltiplas portas (80 e 443):
iptables -t nat -A PREROUTING \\
  -i eth0 -p tcp \\
  -m multiport --dports 80,443 \\
  -j DNAT --to-destination 192.168.56.10

# Persistir:
iptables-save > /etc/iptables/rules.v4`}
        />
      </div>

      {/* ── Exercícios Guiados ── */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — DNAT básico: expor servidor HTTP da DMZ</p>
            <CodeBlock lang="bash" code={`# Cenário: WAN = eth0 (IP público), DMZ = eth1 (192.168.56.0/24)
# Objetivo: tráfego HTTP da internet → servidor web na DMZ

# 1. Ativar ip_forward (necessário para DNAT funcionar!)
echo 1 > /proc/sys/net/ipv4/ip_forward

# 2. Regra PREROUTING: interceptar e redirecionar
iptables -t nat -A PREROUTING \\
  -i eth0 -p tcp --dport 80 \\
  -j DNAT --to-destination 192.168.56.10:80

# 3. Permitir o tráfego no FORWARD
iptables -A FORWARD -i eth0 -o eth1 \\
  -p tcp --dport 80 -m state \\
  --state NEW,ESTABLISHED -j ACCEPT

# 4. Testar de fora:
# curl http://IP-WAN-DO-FIREWALL

# 5. Verificar regra criada:
iptables -t nat -L PREROUTING -n -v`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — DNAT com porta personalizada (segurança por obscuridade)</p>
            <CodeBlock lang="bash" code={`# Expor SSH interno na porta 2222 externamente
# (SSH real está na porta 22 do servidor 192.168.57.100)

iptables -t nat -A PREROUTING \\
  -i eth0 -p tcp --dport 2222 \\
  -j DNAT --to-destination 192.168.57.100:22

iptables -A FORWARD -i eth0 -o eth2 \\
  -p tcp --dport 22 \\
  -m state --state NEW,ESTABLISHED -j ACCEPT

# Testar:
# ssh -p 2222 usuario@IP-WAN-FIREWALL
# (isso se conecta na verdade ao servidor .100:22)

# Ver NAT em ação — conexões ativas:
conntrack -L | grep dport=22`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Verificar DNAT com tcpdump em duas interfaces</p>
            <CodeBlock lang="bash" code={`# Terminal 1: capturar na interface WAN (entrada)
sudo tcpdump -i eth0 -n 'tcp port 80' &

# Terminal 2: capturar na interface DMZ (saída reescrita)
sudo tcpdump -i eth1 -n 'tcp port 80' &

# Terminal 3: gerar tráfego de teste
curl -s http://IP-WAN-FIREWALL/ &> /dev/null

# No Terminal 1 você verá o IP de origem real
# No Terminal 2 você verá o destino reescrito para 192.168.56.10

# Explicação: o DNAT acontece ANTES do roteamento (PREROUTING)
# Por isso o tcpdump em eth0 vê o destino original (IP WAN)
# E o tcpdump em eth1 vê o destino reescrito (IP DMZ)

kill %1 %2`} />
          </div>
        </div>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/dnat" />
    </div>
  );
}
