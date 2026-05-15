'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Search, Network, Wifi, Terminal, AlertCircle, CheckCircle, Activity, Server, Globe } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { useTabFilter } from '@/hooks/useTabFilter';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

type TroubleTab = 'conectividade' | 'servicos' | 'diagnostico';

const CHECKLIST_ITEMS = [
  { id: 'trouble-conectividade', label: 'Diagnosticou falha de conectividade com ping, ip e traceroute' },
  { id: 'trouble-porta',         label: 'Verificou portas abertas e serviços com ss -tulpn e curl' },
  { id: 'trouble-logs',          label: 'Localizou causa raiz de problema via journalctl e /var/log' },
];

export default function TroubleshootingPage() {
  const { checklist, updateChecklist, unlockBadge, trackPageVisit } = useBadges();
  const { activeTab, tabButtonProps } = useTabFilter<TroubleTab>('conectividade');

  useEffect(() => {
    trackPageVisit('/troubleshooting');
  }, [trackPageVisit]);

  useEffect(() => {
    if (
      checklist['trouble-conectividade'] &&
      checklist['trouble-porta'] &&
      checklist['trouble-logs']
    ) {
      unlockBadge('troubleshooting-master');
    }
  }, [checklist, unlockBadge]);

  const allDone = CHECKLIST_ITEMS.every(item => checklist[item.id]);

  return (
    <main style={{ '--mod': '#6366f1' } as React.CSSProperties} className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <Link href="/fundamentos" className="hover:text-accent transition-colors">Fundamentos</Link>
          <span>/</span>
          <span className="text-text-2">Troubleshooting de Rede</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo F16 · Fundamentos Linux</div>
          <h1 className="text-4xl font-bold mb-4">🔎 Troubleshooting de Rede</h1>
          <p className="text-text-2 text-lg mb-6">
            ping · ip · ss · curl · journalctl — quando "o site não abre", você sabe o que fazer
          </p>
          <div className="flex flex-wrap gap-2">
            <LayerBadge layer="Camada 3 · Rede" />
            <LayerBadge layer="Camada 4 · Transporte" />
            <LayerBadge layer="Camada 7 · Aplicação" />
          </div>
        </div>

        {/* FluxoCard: Metodologia OSI */}
        <FluxoCard
          title="Metodologia OSI de Troubleshooting — de baixo para cima"
          steps={[
            { label: 'L1: Interface ativa?',  sub: 'ip link show — UP ou DOWN?',                     icon: <Network size={14}/>,   color: 'border-layer-1/50' },
            { label: 'L2: ARP/MAC ok?',       sub: 'ip neigh — gateway resolvido?',                  icon: <Wifi size={14}/>,      color: 'border-layer-2/50' },
            { label: 'L3: IP e rota?',        sub: 'ip addr; ip route — default gateway existe?',    icon: <Globe size={14}/>,     color: 'border-layer-3/50' },
            { label: 'L4: Porta aberta?',     sub: 'ss -tulpn; nc -zv — serviço escutando?',         icon: <Server size={14}/>,    color: 'border-layer-4/50' },
            { label: 'L5–6: TLS/sessão?',     sub: 'curl -v; openssl s_client — certificado válido?', icon: <Activity size={14}/>,  color: 'border-layer-5/50' },
            { label: 'L7: App responde?',     sub: 'curl -I http://host — código HTTP correto?',      icon: <CheckCircle size={14}/>, color: 'border-layer-7/50' },
          ]}
        />

        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <div role="tablist" className="flex gap-1 -mb-px">
            <button
              {...tabButtonProps('conectividade')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'conectividade'
                  ? 'border-[var(--mod)] text-[var(--mod)]'
                  : 'border-transparent text-text-3 hover:text-text-2'
              }`}
            >
              🌐 Conectividade e Rotas
            </button>
            <button
              {...tabButtonProps('servicos')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'servicos'
                  ? 'border-[var(--mod)] text-[var(--mod)]'
                  : 'border-transparent text-text-3 hover:text-text-2'
              }`}
            >
              🔌 Portas e Serviços
            </button>
            <button
              {...tabButtonProps('diagnostico')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'diagnostico'
                  ? 'border-[var(--mod)] text-[var(--mod)]'
                  : 'border-transparent text-text-3 hover:text-text-2'
              }`}
            >
              🔍 Logs e Causa Raiz
            </button>
          </div>
        </div>

        {/* ── ABA 1: Conectividade e Rotas ─────────────────────────────────────── */}
        <div hidden={activeTab !== 'conectividade'}>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe size={20} className="text-[var(--mod)]" />
              Camada 3 — IP e Roteamento
            </h2>

            <CodeBlock code={`# Ver interfaces de rede
ip addr show
ip addr show eth0           # interface específica
ip link show                # só status (up/down)

# Ver tabela de rotas
ip route show
ip route get 8.8.8.8        # qual rota seria usada para chegar em 8.8.8.8

# Testar conectividade básica
ping -c 4 8.8.8.8           # 4 pacotes para o DNS do Google
ping -c 4 192.168.1.1       # gateway da rede local
ping -c 4 google.com        # se falhar mas 8.8.8.8 ok = problema DNS

# Rastrear o caminho
traceroute 8.8.8.8
traceroute -T -p 443 github.com  # via TCP (passa por firewalls)
mtr --report google.com          # traceroute interativo (apt install mtr)`} />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Tabela de Diagnóstico Rápido</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-bg-2">
                  <tr>
                    <th className="text-left p-3 border-b border-border font-semibold">Sintoma</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Causa Provável</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Comando de Diagnóstico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-bg-2/50">
                    <td className="p-3 text-err">Ping gateway falha</td>
                    <td className="p-3 text-text-2">Interface down ou IP errado</td>
                    <td className="p-3"><code className="text-accent text-xs">ip addr; ip link</code></td>
                  </tr>
                  <tr className="hover:bg-bg-2/50">
                    <td className="p-3 text-err">Ping gateway ok, internet falha</td>
                    <td className="p-3 text-text-2">Rota default faltando</td>
                    <td className="p-3"><code className="text-accent text-xs">ip route show</code></td>
                  </tr>
                  <tr className="hover:bg-bg-2/50">
                    <td className="p-3 text-warn">Ping 8.8.8.8 ok, google.com falha</td>
                    <td className="p-3 text-text-2">DNS não configurado</td>
                    <td className="p-3"><code className="text-accent text-xs">cat /etc/resolv.conf</code></td>
                  </tr>
                  <tr className="hover:bg-bg-2/50">
                    <td className="p-3 text-warn">Ping ok, site não abre</td>
                    <td className="p-3 text-text-2">Porta bloqueada ou serviço down</td>
                    <td className="p-3"><code className="text-accent text-xs">curl -v http://site</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Search size={20} className="text-[var(--mod)]" />
              DNS — Diagnóstico
            </h2>

            <CodeBlock code={`# Ver servidor DNS configurado
cat /etc/resolv.conf
resolvectl status            # systemd-resolved

# Testar resolução DNS
dig google.com               # resposta completa
dig @8.8.8.8 google.com      # forçar DNS do Google
dig +short google.com        # só o IP
nslookup google.com          # alternativa ao dig

# Verificar se resolução reversa funciona
dig -x 8.8.8.8`} />
          </section>

          <WindowsComparisonBox
            windowsCode={`ipconfig /all               # interfaces e IPs
route print                  # tabela de roteamento
tracert host                 # rota até o destino
nslookup google.com          # resolução DNS
netstat -an                  # portas abertas
ping host                    # conectividade básica
Test-NetConnection -Port 443 # testar porta específica`}
            linuxCode={`ip addr show                 # interfaces e IPs
ip route show                # tabela de roteamento
traceroute host              # rota até o destino
dig google.com               # resolução DNS
ss -tulpn                    # portas abertas
ping -c 4 host               # conectividade básica
nc -zv host 443              # testar porta específica`}
          />
        </div>

        {/* ── ABA 2: Portas e Serviços ─────────────────────────────────────────── */}
        <div hidden={activeTab !== 'servicos'}>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Server size={20} className="text-[var(--mod)]" />
              Verificar o que está escutando
            </h2>

            <CodeBlock code={`# ss — substituto moderno do netstat (mais rápido)
ss -tulpn                    # TCP+UDP, Listening, processos, numérico
ss -tulpn | grep :80         # filtrar porta 80
ss -tulpn | grep nginx       # filtrar por processo

# netstat (legado mas ainda muito usado)
sudo netstat -tulpn          # mesma função

# Ver quem está usando uma porta específica
sudo lsof -i :80
sudo lsof -i :443
sudo fuser 80/tcp            # só o PID`} />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Portas Comuns</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead className="bg-bg-2">
                  <tr>
                    <th className="text-left p-3 border-b border-border font-semibold">Porta</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Protocolo</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Serviço</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-2">
                  {[
                    ['22', 'TCP', 'SSH'],
                    ['25 / 587', 'TCP', 'SMTP / E-mail'],
                    ['53', 'TCP/UDP', 'DNS'],
                    ['80', 'TCP', 'HTTP'],
                    ['443', 'TCP', 'HTTPS'],
                    ['3306', 'TCP', 'MySQL'],
                    ['5432', 'TCP', 'PostgreSQL'],
                    ['8080', 'TCP', 'HTTP alternativo'],
                  ].map(([port, proto, service]) => (
                    <tr key={port} className="hover:bg-bg-2/50">
                      <td className="p-3 font-mono text-accent">{port}</td>
                      <td className="p-3">{proto}</td>
                      <td className="p-3">{service}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-[var(--mod)]" />
              Testar Conectividade em uma Porta
            </h2>

            <CodeBlock code={`# curl — testa HTTP/HTTPS completamente
curl -v http://localhost:80
curl -I https://google.com           # só os headers (HEAD request)
curl --connect-timeout 5 http://10.0.0.1

# nc (netcat) — testa qualquer porta TCP/UDP
nc -zv 192.168.1.1 22                # TCP
nc -zv -u 8.8.8.8 53                 # UDP

# Teste rápido com bash
timeout 3 bash -c "echo >/dev/tcp/google.com/443" && echo "ABERTA" || echo "FECHADA"`} />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-warn" />
              Verificar Firewall
            </h2>

            <CodeBlock code={`# iptables (legacy)
sudo iptables -L -n -v
sudo iptables -L INPUT -n

# nftables (moderno)
sudo nft list ruleset

# UFW (Ubuntu)
sudo ufw status verbose

# Se uma porta está escutando mas inacessível = FIREWALL`} />

            <InfoBox className="mt-4">
              <strong>Regra de ouro:</strong> se <code>ss -tulpn</code> mostra a porta mas de fora não conecta, o problema é <strong>FIREWALL</strong>. Se não mostra a porta, o problema é o <strong>serviço não iniciou</strong>.
            </InfoBox>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Erros Comuns e Soluções</h2>
            <div className="space-y-3">
              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>ping: connect: Network is unreachable</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>A tabela de rotas está vazia — não existe rota default (gateway).</p>
                  <CodeBlock code={`ip route show            # não aparece linha "default via ..."
# Adicionar rota temporária:
sudo ip route add default via 192.168.1.1
# Ou verificar se o DHCP funcionou:
sudo dhclient eth0`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>curl: (7) Failed to connect to port 80</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>Dois cenários: serviço não está rodando OU firewall bloqueando.</p>
                  <CodeBlock code={`ss -tulpn | grep :80    # se não aparecer = serviço down
sudo systemctl status nginx
sudo ufw status         # ou iptables -L -n`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>dig: SERVFAIL</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>O servidor DNS respondeu mas não conseguiu resolver o domínio. Isole o problema trocando o servidor DNS:</p>
                  <CodeBlock code={`dig @8.8.8.8 google.com   # se funcionar = problema no DNS local
dig @1.1.1.1 google.com   # confirma com DNS da Cloudflare
cat /etc/resolv.conf       # ver qual DNS está configurado`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>Address already in use (EADDRINUSE)</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>Outro processo já está usando a porta. Identifique-o e decida se deve parar ou usar porta diferente.</p>
                  <CodeBlock code={`sudo lsof -i :80          # quem está usando a porta 80?
sudo fuser 80/tcp         # só o PID
sudo kill -9 <PID>        # forçar parada (cuidado!)`} />
                </div>
              </details>
            </div>
          </section>
        </div>

        {/* ── ABA 3: Logs e Causa Raiz ─────────────────────────────────────────── */}
        <div hidden={activeTab !== 'diagnostico'}>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal size={20} className="text-[var(--mod)]" />
              A Primeira Pergunta: Qual Serviço Falhou?
            </h2>

            <CodeBlock code={`# Ver status geral do sistema
systemctl status               # overview de todos os serviços
systemctl list-units --failed  # listar falhas

# Ver status de um serviço específico
systemctl status nginx
systemctl status postgresql

# Reiniciar e ver log ao vivo
sudo systemctl restart nginx
journalctl -u nginx -f         # -f = follow (ao vivo)
journalctl -u nginx -n 50      # últimas 50 linhas
journalctl -u nginx --since "1 hour ago"`} />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Logs Tradicionais (sem systemd)</h2>

            <CodeBlock code={`# Logs do sistema
tail -f /var/log/syslog
tail -f /var/log/auth.log      # tentativas de login
grep "error\\|fail\\|Error" /var/log/syslog | tail -20

# Logs de aplicações
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
tail -f /var/log/mysql/error.log

# Logs do boot atual
journalctl -b                  # boot atual
journalctl -b -p err           # só erros do boot atual`} />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Search size={20} className="text-[var(--mod)]" />
              Script de Diagnóstico Rápido
            </h2>

            <p className="text-text-2 mb-4">
              Quando algo quebra em produção, o primeiro passo é coletar informações. Este script faz isso em segundos.
            </p>

            <CodeBlock code={`#!/bin/bash
# diagnose.sh — colar no terminal quando algo quebra
echo "=== INTERFACES ===" && ip addr show | grep "inet "
echo "=== ROTA DEFAULT ===" && ip route show default
echo "=== DNS ===" && cat /etc/resolv.conf | grep nameserver
echo "=== PING GATEWAY ===" && ping -c 2 $(ip route | grep default | awk '{print $3}')
echo "=== PORTAS ABERTAS ===" && ss -tulpn | grep LISTEN
echo "=== ÚLTIMOS ERROS ===" && journalctl -p err -n 20 --no-pager`} />

            <InfoBox className="mt-4">
              Salve como <code>~/diagnose.sh</code> e dê <code>chmod +x ~/diagnose.sh</code>. Em 90% dos casos, a causa raiz aparece no output — sem precisar correr atrás de cada comando individualmente.
            </InfoBox>
          </section>

          {/* Exercícios Guiados */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>

            <div className="space-y-6">
              {/* Lab 1 */}
              <div className="bg-bg-2 border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-[var(--mod)] text-white text-xs font-bold px-2 py-1 rounded shrink-0">Lab 1</span>
                  <div>
                    <h3 className="font-bold mb-1">Verificar Conectividade Completa</h3>
                    <p className="text-sm text-text-2">
                      Execute cada passo na sequência e interprete o resultado antes de avançar.
                    </p>
                  </div>
                </div>
                <CodeBlock code={`# Passo 1: Interface ativa?
ip link show

# Passo 2: IP configurado?
ip addr show

# Passo 3: Rota default existe?
ip route show

# Passo 4: Ping no gateway (substitua pelo seu gateway)
ping -c 4 192.168.1.1

# Passo 5: Ping na internet
ping -c 4 8.8.8.8

# Passo 6: Resolução DNS
ping -c 4 google.com
dig +short google.com`} />
                <p className="text-sm text-text-2 mt-3">
                  Se algum passo falhar mas o anterior funcionar, o problema está exatamente nessa camada. Você acabou de usar a metodologia OSI de baixo para cima.
                </p>
              </div>

              {/* Lab 2 */}
              <div className="bg-bg-2 border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-[var(--mod)] text-white text-xs font-bold px-2 py-1 rounded shrink-0">Lab 2</span>
                  <div>
                    <h3 className="font-bold mb-1">Serviço Ativo e Porta Aberta</h3>
                    <p className="text-sm text-text-2">
                      Instale o Nginx, verifique a porta e observe o que acontece ao parar o serviço.
                    </p>
                  </div>
                </div>
                <CodeBlock code={`# Instalar e iniciar nginx
sudo apt install nginx -y
sudo systemctl start nginx

# Verificar que a porta 80 está aberta
ss -tulpn | grep :80

# Testar via HTTP
curl -I http://localhost

# Agora parar o serviço e repetir
sudo systemctl stop nginx
ss -tulpn | grep :80      # a porta deve desaparecer
curl -I http://localhost  # deve falhar com "Connection refused"`} />
              </div>

              {/* Lab 3 */}
              <div className="bg-bg-2 border border-border rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-[var(--mod)] text-white text-xs font-bold px-2 py-1 rounded shrink-0">Lab 3</span>
                  <div>
                    <h3 className="font-bold mb-1">Script diagnose.sh em Ação</h3>
                    <p className="text-sm text-text-2">
                      Crie e execute o script de diagnóstico, depois interprete cada seção do output.
                    </p>
                  </div>
                </div>
                <CodeBlock code={`# Criar o script
cat > ~/diagnose.sh << 'EOF'
#!/bin/bash
echo "=== INTERFACES ===" && ip addr show | grep "inet "
echo "=== ROTA DEFAULT ===" && ip route show default
echo "=== DNS ===" && cat /etc/resolv.conf | grep nameserver
echo "=== PING GATEWAY ===" && ping -c 2 $(ip route | grep default | awk '{print $3}')
echo "=== PORTAS ABERTAS ===" && ss -tulpn | grep LISTEN
echo "=== ÚLTIMOS ERROS ===" && journalctl -p err -n 20 --no-pager
EOF

chmod +x ~/diagnose.sh

# Executar e analisar
~/diagnose.sh`} />
                <p className="text-sm text-text-2 mt-3">
                  Para cada seção do output, responda: <em>está como esperado?</em> A causa raiz do problema geralmente aparece na primeira seção que mostra algo inesperado.
                </p>
              </div>
            </div>
          </section>

          {/* Erros Comuns */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Erros Comuns e Soluções</h2>
            <div className="space-y-3">
              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>journalctl: No entries</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>O serviço é muito novo, reiniciou recentemente, ou não usa systemd. Verifique <code>/var/log/</code> diretamente.</p>
                  <CodeBlock code={`ls /var/log/nginx/
tail -f /var/log/nginx/error.log
# Para ver todos os logs do boot atual:
journalctl -b --no-pager | grep -i error`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>systemctl status: activating (auto-restart)</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>O serviço está crashando e sendo reiniciado pelo systemd em loop. O log de erro está nos detalhes.</p>
                  <CodeBlock code={`journalctl -u nome-do-servico -n 50 --no-pager
# Procure por "error", "failed", "fatal" no output`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>dig: SERVFAIL</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p>Servidor DNS respondeu mas não conseguiu resolver. Isole se é o DNS local ou o domínio em si.</p>
                  <CodeBlock code={`dig @8.8.8.8 google.com   # se funcionar = problema no DNS local
dig @1.1.1.1 google.com   # confirma com Cloudflare`} />
                </div>
              </details>

              <details className="bg-bg-2 border border-border rounded-lg">
                <summary className="p-4 cursor-pointer font-medium flex items-center gap-2 hover:text-accent">
                  <AlertCircle size={16} className="text-err shrink-0" />
                  <code>ssh: Connection refused / Connection timed out</code>
                </summary>
                <div className="px-4 pb-4 text-sm text-text-2 space-y-2">
                  <p><strong>Refused</strong> = serviço SSH down ou firewall rejeitando. <strong>Timed out</strong> = pacote descartado silenciosamente (firewall DROP).</p>
                  <CodeBlock code={`ss -tulpn | grep :22           # SSH está escutando?
sudo systemctl status sshd     # serviço ativo?
sudo iptables -L INPUT -n | grep 22  # regra de firewall?`} />
                </div>
              </details>
            </div>
          </section>
        </div>

        {/* ── Checklist ─────────────────────────────────────────────────────────── */}
        <section className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">Checklist do Módulo</h2>
          {allDone && (
            <div className="mb-4 p-4 bg-ok/10 border border-ok/30 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-ok shrink-0" />
              <span className="text-ok font-medium">Badge 🔎 Troubleshooting Master desbloqueado!</span>
            </div>
          )}
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-[var(--mod)] transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 accent-[var(--mod)]"
                />
                <span className={`text-sm ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* ModuleNav */}
        <ModuleNav order={FUNDAMENTOS_ORDER} currentPath="/troubleshooting" />
      </div>
    </main>
  );
}
