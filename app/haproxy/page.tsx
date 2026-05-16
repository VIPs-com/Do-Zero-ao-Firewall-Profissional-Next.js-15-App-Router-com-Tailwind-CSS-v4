'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Scale, Server, Network, Activity, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

type HaproxyTab = 'conceito' | 'config' | 'operacao';

const CHECKLIST_ITEMS = [
  { id: 'haproxy-instalado', label: 'Instalei o HAProxy, validei o haproxy.cfg com haproxy -c e iniciei o serviço' },
  { id: 'haproxy-backend',   label: 'Configurei um frontend e um backend com 2+ servidores, algoritmo de balanceamento e health check' },
  { id: 'haproxy-stats',     label: 'Habilitei a página de estatísticas e testei o balanceamento distribuindo requisições' },
];

export default function HaproxyPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<HaproxyTab>('conceito');

  useEffect(() => {
    trackPageVisit('/haproxy');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-haproxy min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Servidores</span>
          <span>/</span>
          <span className="text-text-2">HAProxy</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo S10 · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">⚖️ HAProxy — Load Balancer L4/L7</h1>
          <p className="text-text-2 text-lg mb-6">
            frontend · backend · algoritmos de balanceamento · health checks · stats — distribua
            carga entre múltiplos servidores com o balanceador mais usado em produção.
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo de uma requisição através do HAProxy"
          steps={[
            { label: 'Cliente',     sub: 'requisição chega no IP público',                     icon: <Network size={14}/>,  color: 'border-accent/50' },
            { label: 'frontend',    sub: 'bind *:80 recebe e aplica ACLs / regras',             icon: <Shield size={14}/>,   color: 'border-info/50' },
            { label: 'balance',     sub: 'algoritmo escolhe o servidor (roundrobin, leastconn)', icon: <Scale size={14}/>,    color: 'border-warn/50' },
            { label: 'health check', sub: 'só envia para servidores marcados UP',               icon: <Activity size={14}/>, color: 'border-ok/50' },
            { label: 'backend',     sub: 'servidor real processa e devolve a resposta',         icon: <Server size={14}/>,   color: 'border-layer-3/50' },
          ]}
        />

        {/* Tabs */}
        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '⚖️ Conceito & Instalação' },
              { id: 'config',   label: '⚙️ Frontend, Backend & SSL' },
              { id: 'operacao', label: '📊 Stats, Diagnóstico & Exercícios' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as HaproxyTab)}
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

        {/* ── TAB 1: Conceito & Instalação ──────────────────────────────────── */}
        {isActive('conceito') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que é um Load Balancer</h2>
          <p className="text-text-2 mb-4">
            Um único servidor web tem limite de conexões e é um ponto único de falha. O{' '}
            <strong>load balancer</strong> fica na frente de vários servidores idênticos
            (o <em>backend pool</em>) e distribui as requisições entre eles — ganhando{' '}
            <strong>escalabilidade</strong> (mais servidores = mais capacidade) e{' '}
            <strong>alta disponibilidade</strong> (se um cai, o tráfego vai para os outros).
          </p>

          <InfoBox title="HAProxy vs Nginx vs Traefik">
            <strong>HAProxy</strong> é um balanceador dedicado — L4 (TCP) e L7 (HTTP), health
            checks ricos, stick-tables e a melhor performance sob carga extrema. <strong>Nginx</strong>{' '}
            equilibra bem servir conteúdo + proxy. <strong>Traefik</strong> brilha em ambientes
            dinâmicos (Docker/K8s) com autodescoberta. Para LB puro de alta carga, HAProxy é o padrão.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Camada 4 vs Camada 7</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-2">Critério</th>
                  <th className="text-left py-2 pr-4 text-info">L4 — modo TCP</th>
                  <th className="text-left py-2 text-ok">L7 — modo HTTP</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">O que enxerga</td>
                  <td className="py-2 pr-4">IP e porta — não abre o pacote</td>
                  <td className="py-2">cabeçalhos HTTP, URL, cookies</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Decisão de rota</td>
                  <td className="py-2 pr-4">só por algoritmo de balanceamento</td>
                  <td className="py-2">por path, host, header (ACLs)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Performance</td>
                  <td className="py-2 pr-4 text-info">máxima — quase sem overhead</td>
                  <td className="py-2">ótima, com leve custo de parsing</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-text">Uso típico</td>
                  <td className="py-2 pr-4">banco de dados, SMTP, qualquer TCP</td>
                  <td className="py-2">sites, APIs, roteamento por URL</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-2 text-sm">
            No HAProxy a camada é definida pela diretiva <code>mode</code>: <code>mode tcp</code>{' '}
            (L4) ou <code>mode http</code> (L7).
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Instalação</h2>
          <CodeBlock lang="bash" code={`sudo apt update
sudo apt install haproxy

# Verificar a versão (use 2.4+ — LTS):
haproxy -v

# Habilitar e iniciar:
sudo systemctl enable --now haproxy
sudo systemctl status haproxy

# SEMPRE valide o arquivo de config antes de recarregar:
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
# → "Configuration file is valid"`} />

          <InfoBox title="haproxy -c salva produção">
            Recarregar o HAProxy com um <code>haproxy.cfg</code> inválido derruba o serviço e o
            site sai do ar. O <code>haproxy -c -f ...</code> faz um <em>dry-run</em> de validação —
            torne isso um hábito antes de todo <code>systemctl reload haproxy</code>.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['haproxy-instalado']} onChange={e => updateChecklist('haproxy-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['haproxy-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2: Frontend, Backend & SSL ────────────────────────────────── */}
        {isActive('config') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Anatomia do haproxy.cfg</h2>
          <p className="text-text-2 mb-4">
            O <code>/etc/haproxy/haproxy.cfg</code> tem quatro tipos de seção: <code>global</code>{' '}
            (processo), <code>defaults</code> (herança), <code>frontend</code> (recebe) e{' '}
            <code>backend</code> (servidores reais).
          </p>
          <CodeBlock lang="text" code={`# /etc/haproxy/haproxy.cfg

global
    log /dev/log local0
    maxconn 4096
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    timeout connect 5s
    timeout client  30s
    timeout server  30s

frontend web_frontend
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /health
    server web1 192.168.1.11:80 check
    server web2 192.168.1.12:80 check
    server web3 192.168.1.13:80 check backup`} />
          <p className="text-text-2 text-sm mt-3">
            O servidor <code>web3</code> tem a flag <code>backup</code> — só recebe tráfego se{' '}
            <code>web1</code> e <code>web2</code> caírem.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Algoritmos de balanceamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {[
              { alg: 'roundrobin', desc: 'Distribui em ciclo, um para cada servidor. Padrão — ideal quando os servidores têm capacidade parecida.' },
              { alg: 'leastconn', desc: 'Envia para o servidor com MENOS conexões ativas. Ideal para sessões longas (bancos, WebSocket).' },
              { alg: 'source', desc: 'Hash do IP de origem — o mesmo cliente sempre cai no mesmo servidor (persistência simples, sem cookie).' },
              { alg: 'uri', desc: 'Hash da URL — útil para cache: o mesmo recurso sempre vai ao mesmo backend.' },
            ].map(item => (
              <div key={item.alg} className="border border-border rounded-lg p-4 bg-bg-2">
                <code className="text-[var(--mod)] font-bold">{item.alg}</code>
                <p className="text-sm text-text-2 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2 text-sm">
            Servidores com capacidade diferente? Some <code>weight</code>:{' '}
            <code>server web1 ... check weight 3</code> recebe 3× mais que um <code>weight 1</code>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Health checks</h2>
          <p className="text-text-2 mb-4">
            O HAProxy só envia tráfego para servidores saudáveis. A flag <code>check</code> ativa
            a verificação; <code>option httpchk</code> define como testar.
          </p>
          <CodeBlock lang="text" code={`backend web_servers
    balance roundrobin
    # Faz GET /health e espera resposta 2xx/3xx
    option httpchk GET /health
    http-check expect status 200
    # inter = intervalo · fall = falhas p/ marcar DOWN · rise = sucessos p/ voltar UP
    default-server inter 3s fall 3 rise 2
    server web1 192.168.1.11:80 check
    server web2 192.168.1.12:80 check`} />
          <InfoBox title="Por que um endpoint /health dedicado">
            Checar <code>GET /</code> pode dar falso-positivo: a home pode responder 200 mesmo com
            o banco fora. Um endpoint <code>/health</code> que testa as dependências reais
            (banco, cache) faz o HAProxy tirar de rotação um servidor de fato quebrado.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Modo TCP (L4) — balancear um banco</h2>
          <CodeBlock lang="text" code={`frontend mysql_front
    bind *:3306
    mode tcp
    default_backend mysql_pool

backend mysql_pool
    mode tcp
    balance leastconn
    server db1 10.0.0.21:3306 check
    server db2 10.0.0.22:3306 check backup`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Terminação SSL/TLS</h2>
          <p className="text-text-2 mb-4">
            O HAProxy pode encerrar o HTTPS — descriptografa na borda e fala HTTP simples com o
            backend (<em>SSL termination</em>). O certificado é o <code>fullchain + key</code>{' '}
            concatenados num único <code>.pem</code>.
          </p>
          <CodeBlock lang="text" code={`frontend https_frontend
    bind *:443 ssl crt /etc/haproxy/certs/site.pem
    bind *:80
    # Força HTTPS — redireciona quem chegou em HTTP simples
    http-request redirect scheme https unless { ssl_fc }
    default_backend web_servers`} />
          <CodeBlock lang="bash" code={`# Gerar o .pem combinado (Certbot/Let's Encrypt):
sudo cat /etc/letsencrypt/live/site.com/fullchain.pem \\
         /etc/letsencrypt/live/site.com/privkey.pem \\
  | sudo tee /etc/haproxy/certs/site.pem

sudo haproxy -c -f /etc/haproxy/haproxy.cfg && sudo systemctl reload haproxy`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['haproxy-backend']} onChange={e => updateChecklist('haproxy-backend', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['haproxy-backend'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        <WindowsComparisonBox
          windowsLabel="Windows (NLB / ARR)"
          linuxLabel="Linux (HAProxy)"
          windowsCode={`# Network Load Balancing (NLB) — recurso do Windows Server
# GUI: Server Manager → Add Roles → Network Load Balancing
# Cluster gerenciado pelo "NLB Manager" (nlbmgr)

# Balanceamento L7 via IIS + ARR:
# Application Request Routing (ARR) — extensão do IIS
# Server Farm criado na console do IIS Manager

# Health check e regras configurados em janelas;
# difícil de versionar e automatizar.`}
          linuxCode={`# HAProxy — configuração declarativa em um único arquivo

# /etc/haproxy/haproxy.cfg versionável em git:
frontend web_frontend
    bind *:443 ssl crt /etc/haproxy/certs/site.pem
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /health
    server web1 192.168.1.11:80 check
    server web2 192.168.1.12:80 check

# Validar + recarregar sem downtime:
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl reload haproxy`}
        />

        </>)}

        {/* ── TAB 3: Stats, Diagnóstico & Exercícios ────────────────────────── */}
        {isActive('operacao') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Página de estatísticas</h2>
          <p className="text-text-2 mb-4">
            O HAProxy expõe um painel web em tempo real: estado de cada servidor (UP/DOWN),
            conexões, taxa de requisições e bytes. Essencial para operar em produção.
          </p>
          <CodeBlock lang="text" code={`# Adicione ao haproxy.cfg:
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 10s
    stats auth admin:senhaForte
    # Restrinja o acesso — nunca exponha o painel à internet:
    # acl rede_interna src 192.168.1.0/24
    # http-request deny unless rede_interna`} />
          <CodeBlock lang="bash" code={`# Acesse no navegador:
# http://IP-DO-HAPROXY:8404/stats   (login: admin)

# Liberar a porta do painel só para a LAN:
sudo iptables -A INPUT -p tcp --dport 8404 -s 192.168.1.0/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8404 -j DROP`} />
          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['haproxy-stats']} onChange={e => updateChecklist('haproxy-stats', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['haproxy-stats'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Stick-tables — persistência e rate limit</h2>
          <p className="text-text-2 mb-4">
            <em>Stick-tables</em> guardam dados por chave (geralmente o IP de origem) na memória.
            Servem para persistência de sessão e para limitar taxa de requisições — uma defesa
            simples contra abuso.
          </p>
          <CodeBlock lang="text" code={`frontend web_frontend
    bind *:80
    # Tabela: chave = IP, guarda a taxa de requisições dos últimos 10s
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    # Bloqueia (429) quem passar de 100 req em 10s
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 100 }
    default_backend web_servers`} />
          <WarnBox title="Rate limit não substitui um WAF">
            A stick-table é uma primeira barreira contra abuso e bots simples, mas opera por IP —
            um ataque distribuído passa por ela. Combine com Fail2ban, firewall e, para ataques
            sérios, um WAF dedicado.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns e Soluções</h2>
          <div className="space-y-3">
            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">cannot bind socket — Address already in use</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> outro serviço (Nginx, Apache) já ocupa a porta 80/443.</p>
                <CodeBlock lang="bash" code={`# Descobrir quem está na porta 80:
sudo ss -tulpn | grep :80

# Parar o serviço conflitante (ex.: nginx):
sudo systemctl disable --now nginx`} />
              </div>
            </details>
            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">Todos os servidores aparecem DOWN no /stats</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> o health check falha — endpoint errado, firewall do backend bloqueando, ou status inesperado.</p>
                <CodeBlock lang="bash" code={`# Testar o endpoint de health manualmente a partir do HAProxy:
curl -i http://192.168.1.11:80/health

# Ver o motivo da falha no log:
sudo journalctl -u haproxy -e | grep -i check`} />
                <p>Ajuste <code>option httpchk</code> para o path correto e confira o <code>http-check expect status</code>.</p>
              </div>
            </details>
            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">503 Service Unavailable — No server is available</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> nenhum servidor do backend está UP — todos falharam no health check ou o backend está vazio.</p>
                <CodeBlock lang="bash" code={`# Conferir o estado no painel ou via socket:
echo "show servers state" | sudo socat stdio /run/haproxy/admin.sock

# Verificar conectividade HAProxy → backend:
curl -v http://192.168.1.11:80/`} />
              </div>
            </details>
            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">O backend recebe sempre o IP do HAProxy, não do cliente</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> em modo HTTP o HAProxy faz proxy — o backend vê o IP do balanceador. É preciso repassar o IP real.</p>
                <CodeBlock lang="text" code={`backend web_servers
    # Adiciona o cabeçalho X-Forwarded-For com o IP do cliente
    option forwardfor
    server web1 192.168.1.11:80 check`} />
                <p>No servidor backend, configure o log/app para ler <code>X-Forwarded-For</code>.</p>
              </div>
            </details>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
          <div className="space-y-8">
            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Scale size={18} className="text-ok" />
                <h3 className="font-bold text-lg">Lab 1: Balanceador HTTP básico</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Coloque o HAProxy na frente de dois servidores web e veja o tráfego se dividir.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Suba dois &ldquo;servidores&rdquo; web simples</p>
                    <CodeBlock lang="bash" code={`# Em duas VMs (ou containers), conteúdo distinto p/ identificar:
echo "Servidor WEB1" > index.html && python3 -m http.server 80
echo "Servidor WEB2" > index.html && python3 -m http.server 80`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Configure o frontend + backend</p>
                    <CodeBlock lang="text" code={`frontend web
    bind *:80
    default_backend pool

backend pool
    balance roundrobin
    server web1 192.168.1.11:80 check
    server web2 192.168.1.12:80 check`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Valide e recarregue</p>
                    <CodeBlock lang="bash" code={`sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl reload haproxy`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">4.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Veja o roundrobin em ação</p>
                    <CodeBlock lang="bash" code={`for i in $(seq 1 6); do curl -s http://IP-HAPROXY/; done
# Saída alternando: WEB1, WEB2, WEB1, WEB2...`} />
                  </div>
                </li>
              </ol>
            </div>

            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-info" />
                <h3 className="font-bold text-lg">Lab 2: Health check e failover</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Derrube um servidor e comprove que o HAProxy tira ele de rotação sozinho.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Ative o health check e a página de stats</p>
                    <CodeBlock lang="text" code={`backend pool
    option httpchk GET /
    default-server inter 2s fall 2 rise 2
    server web1 192.168.1.11:80 check
    server web2 192.168.1.12:80 check

listen stats
    bind *:8404
    stats enable
    stats uri /stats`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Derrube o WEB1 e observe o /stats</p>
                    <CodeBlock lang="bash" code={`# No WEB1, pare o servidor (Ctrl+C no python3 -m http.server)
# Abra http://IP-HAPROXY:8404/stats — web1 fica VERMELHO (DOWN)`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Confirme que o tráfego só vai para o WEB2</p>
                    <CodeBlock lang="bash" code={`for i in $(seq 1 6); do curl -s http://IP-HAPROXY/; done
# Agora só responde WEB2 — failover automático, sem erro para o cliente`} />
                  </div>
                </li>
              </ol>
            </div>

            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-warn" />
                <h3 className="font-bold text-lg">Lab 3: Rate limit com stick-table</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Limite as requisições por IP e veja o HAProxy responder 429 ao excesso.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Adicione a stick-table ao frontend</p>
                    <CodeBlock lang="text" code={`frontend web
    bind *:80
    stick-table type ip size 100k expire 30s store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 20 }
    default_backend pool`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Dispare uma rajada de requisições</p>
                    <CodeBlock lang="bash" code={`for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code}\\n" http://IP-HAPROXY/; done
# As primeiras ~20 → 200; depois → 429 Too Many Requests`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Inspecione a stick-table ao vivo</p>
                    <CodeBlock lang="bash" code={`echo "show table web" | sudo socat stdio /run/haproxy/admin.sock
# Mostra cada IP e sua http_req_rate atual`} />
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/haproxy" />

      </div>
    </main>
  );
}
