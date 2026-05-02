'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Laptop, Shield, Globe, Terminal, Lock, ArrowRight, ChevronRight, AlertTriangle, BookOpen, Filter, Zap, Activity } from 'lucide-react';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';

import { useBadges } from '@/context/BadgeContext';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { Circle, CheckCircle2 } from 'lucide-react';

const PROXY_CHECKLIST = [
  { id: 'proxy-funciona', text: 'Squid Proxy resolve e navega na internet' },
  { id: 'proxy-bloqueio', text: 'Bloqueio de domínios (negados.txt) funcional' },
  { id: 'proxy-log', text: 'Logs de acesso visíveis em /var/log/squid/access.log' },
];

export default function LanProxyPage() {
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('lan-proxy');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-lan-proxy">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">LAN, DNS & Proxy</span>
      </div>

      <div className="section-label">Tópico 01 · Camadas 3, 4 e 7</div>
      <h1 className="section-title">💻 LAN, DNS & Proxy</h1>
      <p className="section-sub">
        O cliente da LAN não acessa a internet diretamente — tudo passa pelo Firewall.
        Para acessar o Web Server interno, o cliente precisa primeiro resolver o nome via DNS,
        depois abrir a conexão HTTPS. Para navegar na internet, o navegador usa o Squid Proxy.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: DNS Access */}
          <section id="cliente-lan">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Acessando o DNS (porta UDP 53)</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-text-2 leading-relaxed">
                O cliente não acessa o DNS "manualmente" — ele é usado automaticamente toda vez que você digita um nome no navegador ou terminal.
              </p>

              <div className="bg-bg-2 border border-border rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  {[
                    'Navegador recebe o nome www.dominio.local',
                    'Sistema pergunta ao DNS configurado: DNS-SERVER:53',
                    'Pacote UDP 53 atravessa o Firewall via regra FORWARD',
                    'BIND9 responde com o IP: www → WEB-SERVER',
                    'Resposta volta via ESTABLISHED — sem precisar de nova regra'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-sm text-text-2">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <CodeBlock 
                  title="Resolução automática"
                  code="nslookup www.dominio.local" 
                  lang="bash" 
                />
                <CodeBlock 
                  title="Forçar servidor DNS"
                  code="dig @DNS-SERVER www.dominio.local" 
                  lang="bash" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: Fluxo Squid */}
          <section id="fluxo-squid">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Filter size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Fluxo completo via Squid</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              O Squid é o intermediário total — recebe o pedido, verifica as ACLs, busca na internet e entrega ao cliente.
            </p>

            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border mb-8">
              {[
                { t: 'Conexão TCP', d: 'Navegador abre TCP para FIREWALL-LAN:3128', l: 'L4' },
                { t: 'Avaliação de ACLs', d: 'Squid lê a URL e consulta as regras do squid.conf', l: 'L7' },
                { t: 'Resolução DNS', d: 'Squid resolve o nome de destino usando o DNS local', l: 'L7' },
                { t: 'Saída via SNAT', d: 'O IP privado do Firewall vira o IP público na WAN', l: 'L3' }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-bg-2 border-2 border-accent flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 flex items-center gap-3">
                    {step.t}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-3 border border-border text-text-3">{step.l}</span>
                  </h4>
                  <p className="text-xs text-text-3">{step.d}</p>
                </div>
              ))}
            </div>

            <HighlightBox title="Proxy Transparente vs Autenticado">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-xs mb-1">Transparente</h5>
                  <p className="text-[10px] text-text-3">O usuário não sabe que está usando um proxy. O Firewall redireciona a porta 80 para a 3128 via iptables.</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs mb-1">Autenticado</h5>
                  <p className="text-[10px] text-text-3">O navegador solicita usuário e senha. Permite criar regras baseadas em grupos (ex: Diretoria vs RH).</p>
                </div>
              </div>
            </HighlightBox>
          </section>

          {/* Section 3: ACLs */}
          <section id="dstdomain">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configuração do Squid (ACLs)</h2>
            </div>
            
            <div className="space-y-8">
              <CodeBlock 
                title="/etc/squid/squid.conf (Trecho Principal)"
                code={`# Definição das Redes Locais\nacl localnet src 192.168.0.0/16\n\n# Minhas ACLs Customizadas\nacl lan src 192.168.57.0/24\nacl liberados url_regex -i "/etc/squid/liberados.txt"\nacl negados url_regex -i "/etc/squid/negados.txt"\n\n# Regras de Acesso (A ORDEM IMPORTA!)\nhttp_access allow localhost\nhttp_access allow liberados\nhttp_access deny negados\nhttp_access allow lan\nhttp_access deny all`} 
                lang="squid" 
              />

              <div className="grid md:grid-cols-2 gap-6">
                <CodeBlock 
                  title="/etc/squid/liberados.txt"
                  code={`.gov.br\n.microsoft.com\n.google.com`} 
                  lang="txt" 
                />
                <CodeBlock 
                  title="/etc/squid/negados.txt"
                  code={`sexy.com\nplayboy.com\nwhitehouse.com`} 
                  lang="txt" 
                />
              </div>

              <HighlightBox title="A Ordem Importa!">
                <p className="text-sm text-text-2">
                  O Squid lê as regras de cima para baixo. Se você colocar <code>http_access deny all</code> no topo, ninguém navega. Se colocar <code>allow lan</code> antes de <code>deny negados</code>, os sites proibidos serão liberados para a LAN.
                </p>
              </HighlightBox>
            </div>
          </section>

          {/* Section 4: ACL Privilégio Mínimo */}
          <section id="privilegio-minimo">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. ACL Avançada — Princípio do Privilégio Mínimo</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              A configuração padrão do Squid é permissiva para a rede interna. Em ambientes corporativos, o padrão deve ser <strong>deny-all</strong> com exceções explícitas — liberar apenas o que é necessário para cada IP ou grupo.
            </p>

            <CodeBlock
              title="/etc/squid/squid.conf — Privilégio Mínimo por IP"
              lang="bash"
              code={`# Definir grupos de acesso\nacl admin     src 192.168.57.10/32   # IP do administrador\nacl lan_users src 192.168.57.0/24    # LAN inteira\n\n# Lógica: admin tem acesso total, LAN é bloqueada\nhttp_access allow admin       # admin: libera tudo\nhttp_access deny  lan_users   # LAN: nega tudo\nhttp_access deny  all         # padrão final: nega\n\n# Aplicar sem reiniciar\nsquid -k reconfigure`}
            />

            <InfoBox title="Por que esse padrão é mais seguro?">
              <p className="text-sm text-text-2">
                Esta configuração implementa <strong>deny-all com exceções explícitas</strong> — o oposto do padrão permissivo.
                Se um novo usuário ou dispositivo entrar na LAN, ele <em>não terá acesso</em> até que uma regra explícita o libere.
                Em produção, use grupos LDAP ou certificados ao invés de IPs fixos para maior escabilidade.
              </p>
            </InfoBox>
          </section>

          {/* Section 6: Fluxo Completo de Navegação via Squid */}
          <section id="fluxo-navegacao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-bold">6. Fluxo Completo de Navegação via Squid</h2>
            </div>

            <InfoBox title="🌐 O cliente NUNCA fala diretamente com o destino">
              <pre className="text-xs font-mono overflow-x-auto">{`Cliente LAN                  Firewall/Squid              Internet
(192.168.57.50)             (192.168.57.250)
     │                           │                          │
     │  1. TCP → :3128           │                          │
     │──────────────────────────►│  2. Verifica ACLs        │
     │                           │  3. TCP → :443           │
     │                           │─────────────────────────►│
     │◄──────────────────────────│◄─── resposta ────────────│
     │  4. entrega ao cliente    │                          │`}</pre>
            </InfoBox>

            <div className="mt-6 mb-6">
              <FluxoCard
                title="Timeline de Navegação — t=0ms até t=52ms"
                steps={[
                  { label: 't=0ms  TCP → Squid :3128', sub: 'SYN/SYN-ACK/ACK — handshake com o proxy. Cliente configura proxy: 192.168.57.250:3128.', icon: <Terminal size={16} />, color: 'text-info' },
                  { label: 't=2ms  Squid avalia ACLs', sub: 'Lê URL completa (HTTP) ou domínio (HTTPS), verifica liberados/negados/lan em ordem.', icon: <Filter size={16} />, color: 'text-accent' },
                  { label: 't=4ms  DNS + conexão saída', sub: 'Squid resolve o nome e abre TCP em nome do cliente. SNAT troca IP de origem.', icon: <Globe size={16} />, color: 'text-ok' },
                  { label: 't=51ms Resposta recebida', sub: 'Servidor remoto entrega conteúdo ao Squid. Cache salva se possível (TCP_HIT nas próximas).', icon: <ArrowRight size={16} />, color: 'text-warn' },
                  { label: 't=52ms Entregue ao cliente', sub: 'Log registra: 192.168.57.50 TCP_MISS/200 ... github.com (ou TCP_HIT se em cache).', icon: <Laptop size={16} />, color: 'text-ok' },
                ]}
              />
            </div>

            <div className="space-y-4">
              <CodeBlock code={`# Os 4 cenários de ACL — monitorar ao vivo:
tail -f /var/log/squid/access.log

# Cenário A — site liberado (gov.br):
# 192.168.57.50 TCP_MISS/200  ... gov.br     ← buscou na rede

# Cenário B — bloqueado (facebook.com):
# 192.168.57.50 TCP_DENIED/403 ... facebook.com ← bloqueado pela ACL

# Cenário C — site neutro (github.com):
# 192.168.57.50 TCP_MISS/200  ... github.com  ← LAN liberada

# Cenário D — segundo acesso ao mesmo recurso:
# 192.168.57.50 TCP_HIT/200   ... github.com  ← veio do cache!

# Filtrar só bloqueados:
tail -f /var/log/squid/access.log | grep TCP_DENIED`} />

              <HighlightBox title="🔒 HTTP vs HTTPS — o que o Squid consegue ver">
                <CodeBlock code={`# HTTP (porta 80) — Squid lê TUDO:
# URL completa: http://site.com/pagina/artigo?id=123
# Cabeçalhos, cookies, conteúdo
# Pode: filtrar por URL, cachear, modificar

# HTTPS (porta 443) — Squid vê SÓ o domínio:
# Cliente envia: CONNECT www.facebook.com:443
# Squid vê:      www.facebook.com  (só isso!)
# NÃO vê: /pagina/post/123  (criptografado pela Camada 6/TLS)
# Pode:    bloquear domínio inteiro com dstdomain

# Por isso dstdomain é a prática correta para HTTPS:
acl negados dstdomain "/etc/squid/negados.txt"
# Bloqueia: www.facebook.com, m.facebook.com, api.facebook.com
# Qualquer subdomínio de facebook.com é bloqueado.`} />
              </HighlightBox>

              <div className="space-y-3 mt-4">
                {[
                  { id: 'squid-flow-understood', text: 'Segui o fluxo t=0ms→t=52ms no tail -f access.log em tempo real' },
                  { id: 'squid-http-vs-https', text: 'Entendi por que HTTPS só permite bloquear por dstdomain (não por URL)' },
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

            <WarnBox title="⚠️ Problemas frequentes com Squid Proxy">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>Cliente não consegue navegar com proxy configurado</strong> → <code className="text-xs">http_access deny all</code> está antes de <code className="text-xs">http_access allow lan</code>
                  → verificar ordem: allow deve vir antes de deny; Squid lê de cima para baixo
                </li>
                <li>
                  <strong>Sites liberados ainda bloqueados</strong> → arquivo <code className="text-xs">liberados.txt</code> não encontrado
                  → usar caminho absoluto: <code className="text-xs">/etc/squid/liberados.txt</code> e verificar permissão <code className="text-xs">chmod 644</code>
                </li>
                <li>
                  <strong>Squid inicia mas logs ficam em branco</strong> → cliente não está usando o proxy
                  → verificar configuração de proxy no browser (IP:3128) ou configurar proxy transparente com iptables REDIRECT
                </li>
                <li>
                  <strong>squid -k reconfigure falha</strong> → erro de sintaxe no squid.conf
                  → testar com <code className="text-xs">squid -k parse</code> antes de recarregar
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Proxy Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist Proxy
            </h3>
            <div className="space-y-3">
              {PROXY_CHECKLIST.map(item => (
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
              Regras iptables
            </h3>
            <div className="space-y-4">
              <CodeBlock title="Liberar DNS" code="iptables -A FORWARD -p udp --dport 53 -j ACCEPT" lang="bash" />
              <CodeBlock title="Liberar Proxy" code="iptables -A INPUT -p tcp --dport 3128 -j ACCEPT" lang="bash" />
              <CodeBlock title="Proxy Transparente" code="iptables -t nat -A PREROUTING -i eth1 -p tcp --dport 80 -j REDIRECT --to-port 3128" lang="bash" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-err/5 border border-err/20">
            <h4 className="font-bold text-sm text-err mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Segurança de Rede
            </h4>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Por que isolar a LAN da DMZ? Entenda como evitar que um servidor invadido comprometa seus usuários.
            </p>
            <Link href="/pivoteamento" className="text-[10px] font-bold text-err hover:underline flex items-center gap-1 uppercase tracking-wider">
              Ver aula de Pivoteamento
              <ChevronRight size={10} />
            </Link>
          </div>

          <WarnBox title="HTTPS e o Proxy">
            <p className="text-xs text-text-2 leading-relaxed">
              O HTTPS é criptografado ponta-a-ponta. Para filtrar conteúdo HTTPS, você precisa do <strong>SSL Bump</strong> (interceptação SSL), o que exige instalar um certificado do Firewall em todas as estações.
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Aprenda como configurar o SSL Bump para filtrar sites HTTPS sem quebrar o cadeado do navegador.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'squid-https') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Squid HTTPS Filtering</span>
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
          windowsLabel="Windows — ISA Server / Forefront TMG / WPAD"
          linuxLabel="Linux — Squid Proxy Transparente"
          windowsCode={`# Windows — Proxy corporativo (ISA Server / Forefront TMG)
# Alternativa moderna: Microsoft Entra ID + Azure Web Filter

# 1. Configurar proxy manualmente no Windows:
# Configurações → Rede → Proxy →
#   "Usar servidor proxy": IP=192.168.57.250, Porta=3128

# 2. Via GPO (para toda a empresa):
# Computer Config → Windows Settings → Internet Settings →
#   Connections → LAN Settings → Proxy Server

# 3. WPAD (Web Proxy Auto-Discovery) — automático:
#    DNS: wpad.empresa.com → IP do proxy
#    HTTP GET http://wpad/wpad.dat retorna configuração
#    Browsers modernos descobrem o proxy automaticamente

# 4. Proxy transparente no Windows (sem WPAD):
# Não há equivalente direto ao Squid transparente no Windows.
# Soluções: Forefront TMG (descontinuado) ou
#            Zscaler / Netskope (cloud proxy)

# 5. Verificar configurações de proxy no Windows:
netsh winhttp show proxy
reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings"`}
          linuxCode={`# Linux Squid — Proxy Transparente na LAN

# Instalação e configuração básica:
apt install squid -y

# /etc/squid/squid.conf — configuração essencial:
# http_port 3128          # proxy explícito
# http_port 3129 intercept # proxy transparente

# ACLs de acesso:
# acl lan src 192.168.57.0/24
# http_access allow lan
# http_access deny all

# iptables — forçar tráfego HTTP pela porta do Squid:
iptables -t nat -A PREROUTING \\
  -i eth2 -p tcp --dport 80 \\
  -j REDIRECT --to-port 3129

# Verificar cache e acessos:
tail -f /var/log/squid/access.log

# Configurar clientes explicitamente:
export http_proxy=http://192.168.57.250:3128
export https_proxy=http://192.168.57.250:3128`}
        />
      </div>

      {/* ── Exercícios Guiados ── */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Instalar Squid e testar proxy explícito</p>
            <CodeBlock lang="bash" code={`# Instalar Squid
sudo apt install squid -y

# Configuração mínima para lab
sudo tee /etc/squid/squid.conf << 'EOF'
http_port 3128
acl localnet src 192.168.57.0/24
http_access allow localnet
http_access deny all
EOF

sudo systemctl restart squid

# Testar proxy explícito de um cliente:
curl -x http://192.168.57.250:3128 http://example.com -o /dev/null -w "%{http_code}\n"

# Monitorar em tempo real:
sudo tail -f /var/log/squid/access.log`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Proxy transparente com iptables REDIRECT</p>
            <CodeBlock lang="bash" code={`# Ativar proxy transparente no Squid
# Adicionar em squid.conf:
# http_port 3129 intercept

# Redirecionar HTTP da LAN para o Squid (no firewall)
sudo iptables -t nat -A PREROUTING \\
  -i eth2 -p tcp --dport 80 \\
  -j REDIRECT --to-port 3129

# Verificar: clientes na LAN não precisam configurar proxy
# O tráfego HTTP é capturado automaticamente

# Ver conexões ativas no Squid:
sudo squidclient mgr:active_requests

# Ver estatísticas de cache:
sudo squidclient mgr:info | grep -E "requests|hit|miss"`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Bloquear categorias de sites com ACL</p>
            <CodeBlock lang="bash" code={`# Criar lista de domínios bloqueados
sudo tee /etc/squid/blocked-domains.txt << 'EOF'
.facebook.com
.instagram.com
.tiktok.com
.youtube.com
EOF

# Adicionar ao squid.conf:
# acl blocked_sites dstdomain "/etc/squid/blocked-domains.txt"
# http_access deny blocked_sites

sudo systemctl reload squid

# Testar bloqueio:
curl -x http://192.168.57.250:3128 http://facebook.com -o /dev/null -w "%{http_code}\n"
# Deve retornar 403 (Forbidden)

# Ver no log de acesso:
sudo grep "DENIED" /var/log/squid/access.log | tail -5`} />
          </div>
        </div>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/lan-proxy" />
    </div>
  );
}
