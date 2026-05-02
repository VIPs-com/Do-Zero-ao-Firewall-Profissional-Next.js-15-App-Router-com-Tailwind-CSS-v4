'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Network, Globe, Server, Activity, Lock } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function PiholePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/pihole');
  }, [trackPageVisit]);

  const items = [
    { id: 'pihole-instalado',   label: 'Pi-hole instalado e dashboard acessível em http://IP/admin' },
    { id: 'pihole-dhcp',        label: 'DHCP ou roteador configurado para apontar DNS para o Pi-hole — clientes usam Pi-hole automaticamente' },
    { id: 'pihole-bloqueando',  label: 'Acesso a domínio de anúncio bloqueado confirmado (Query Log mostra BLOCKED) e whitelist configurada' },
  ];

  return (
    <main className="module-accent-pihole min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🕳️</span>
            <div>
              <p className="section-label">Servidores e Serviços — S07</p>
              <h1 className="text-3xl font-bold text-text">Pi-hole</h1>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-2xl">
            DNS sinkhole que bloqueia anúncios, rastreadores e domínios maliciosos
            para <strong>toda a rede</strong> — sem instalar nada nos clientes.
            Integra com o DHCP que você configurou e com o DNS que você já conhece.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: DNS Sinkhole para toda a rede"
          steps={[
            { label: 'Instalar Pi-hole',    sub: 'Docker ou script one-line',                      icon: <Server   size={14}/>, color: 'border-ok/50' },
            { label: 'Configurar DHCP/DNS', sub: 'apontar DNS da rede para o Pi-hole',              icon: <Network  size={14}/>, color: 'border-accent/50' },
            { label: 'Blocklists',          sub: 'adicionar listas de domínios maliciosos/ads',     icon: <Shield   size={14}/>, color: 'border-info/50' },
            { label: 'Gravity update',      sub: 'baixar e compilar listas (pihole -g)',            icon: <Activity size={14}/>, color: 'border-layer-5/50' },
            { label: 'Whitelist/Blacklist',  sub: 'ajustar exceções por domínio',                  icon: <Globe    size={14}/>, color: 'border-layer-6/50' },
            { label: 'Dashboard',           sub: 'monitorar queries, bloqueios e top clientes',    icon: <Activity size={14}/>, color: 'border-warn/50' },
          ]}
        />

        {/* Como funciona */}
        <section>
          <h2 className="section-title">Como o Pi-hole funciona — DNS Sinkhole</h2>
          <p className="text-text-2 mb-4">
            Quando um cliente resolve <code className="text-accent">ads.doubleclick.net</code>, a consulta DNS vai para o Pi-hole.
            Se o domínio estiver na blocklist, o Pi-hole responde com <code className="text-accent">0.0.0.0</code> (sinkhole)
            — o anúncio nunca carrega porque o endereço não existe. Domínios legítimos são encaminhados
            para o upstream resolver (Cloudflare, Google, ou Unbound local).
          </p>
          <div className="bg-bg-2 border border-border rounded-lg p-4 font-mono text-sm mt-4">
            <p className="text-text-2 mb-2 font-sans font-semibold text-xs uppercase tracking-wide">Fluxo de uma query DNS</p>
            <div className="space-y-1 text-xs">
              <p><span className="text-info">Cliente</span> → DNS query: <span className="text-accent">ads.doubleclick.net</span></p>
              <p className="pl-4 text-text-2">↓ Pi-hole recebe a query</p>
              <p className="pl-4"><span className="text-err">❌ Na blocklist</span> → responde <span className="text-accent">0.0.0.0</span> → anúncio bloqueado</p>
              <p className="pl-4"><span className="text-ok">✅ Não na blocklist</span> → encaminha para <span className="text-accent">1.1.1.1</span> → retorna IP real</p>
            </div>
          </div>
          <InfoBox className="mt-4">
            <strong>Vantagem sobre extensões de browser:</strong> Pi-hole bloqueia em nível de rede — funciona em <em>todos</em> os dispositivos (smart TV, celular, console, IoT) sem instalar nada. Mesmo apps que ignoram extensões do browser são bloqueados.
          </InfoBox>
        </section>

        {/* Instalação Docker */}
        <section>
          <h2 className="section-title">Instalação via Docker Compose (recomendado)</h2>
          <CodeBlock lang="yaml" code={`# docker-compose.yml

services:
  pihole:
    image: pihole/pihole:latest
    container_name: pihole
    restart: unless-stopped
    ports:
      - "53:53/tcp"        # DNS TCP
      - "53:53/udp"        # DNS UDP
      - "80:80/tcp"        # Dashboard web
    environment:
      TZ: "America/Sao_Paulo"
      WEBPASSWORD: "senha_do_dashboard"   # trocar antes de subir
      PIHOLE_DNS_1: "1.1.1.1"             # upstream DNS primário
      PIHOLE_DNS_2: "8.8.8.8"             # upstream DNS secundário
      DNSSEC: "true"                       # validação DNSSEC
      REV_SERVER: "true"                   # DNS reverso para a LAN
      REV_SERVER_CIDR: "192.168.1.0/24"
      REV_SERVER_TARGET: "192.168.1.1"     # seu roteador/gateway
      REV_SERVER_DOMAIN: "lan"
    volumes:
      - "./pihole/etc-pihole:/etc/pihole"
      - "./pihole/etc-dnsmasq.d:/etc/dnsmasq.d"
    cap_add:
      - NET_ADMIN           # necessário para DHCP (se usar Pi-hole como DHCP)
    networks:
      pihole_net:
        ipv4_address: 192.168.1.2   # IP fixo na LAN

networks:
  pihole_net:
    driver: macvlan         # container fica visível na LAN como dispositivo real
    driver_opts:
      parent: eth1          # interface LAN do servidor
    ipam:
      config:
        - subnet: 192.168.1.0/24
          gateway: 192.168.1.1`} />
          <CodeBlock lang="bash" code={`# Subir o Pi-hole
docker compose up -d

# Verificar logs na primeira inicialização
docker compose logs pihole -f

# Acessar dashboard
# http://192.168.1.2/admin  (senha = WEBPASSWORD acima)

# Testar DNS direto no Pi-hole
dig @192.168.1.2 google.com      # deve resolver
dig @192.168.1.2 ads.doubleclick.net  # deve retornar 0.0.0.0`} />
        </section>

        {/* Instalação script */}
        <section>
          <h2 className="section-title">Instalação via Script (sem Docker)</h2>
          <CodeBlock lang="bash" code={`# Instalação one-line (em Debian/Ubuntu/Raspberry Pi OS)
curl -sSL https://install.pi-hole.net | bash

# O assistente interativo vai perguntar:
# 1. Interface de rede → eth0 (ou sua interface LAN)
# 2. Upstream DNS → Cloudflare (1.1.1.1) recomendado
# 3. Blocklists → StevenBlack (padrão)
# 4. Admin Web Interface → Yes
# 5. Log queries → Yes
# 6. Privacy mode → Show everything

# Alterar senha do dashboard após instalação
pihole -a -p nova_senha

# Verificar serviço
pihole status
systemctl status pihole-FTL

# Ver versão e estatísticas
pihole version
pihole -c          # estatísticas no terminal`} />
          <WarnBox className="mt-3">
            <strong>Porta 53 em uso?</strong> Ubuntu usa <code>systemd-resolved</code> que ocupa a porta 53. Desabilitar antes:
            <code className="block mt-2 text-sm">systemctl disable --now systemd-resolved; rm /etc/resolv.conf; echo "nameserver 1.1.1.1" &gt; /etc/resolv.conf</code>
          </WarnBox>
        </section>

        {/* Configurar DNS na rede */}
        <section>
          <h2 className="section-title">Apontar DNS da Rede para o Pi-hole</h2>
          <p className="text-text-2 mb-4">
            Para que <strong>todos os dispositivos</strong> usem o Pi-hole automaticamente,
            configure-o como servidor DNS no seu servidor DHCP.
          </p>
          <h3 className="font-semibold text-text mb-3">Via isc-dhcp-server (Sprint I.7)</h3>
          <CodeBlock lang="bash" code={`# /etc/dhcp/dhcpd.conf — adicionar opção dns
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option domain-name-servers 192.168.1.2;  # ← IP do Pi-hole
  option domain-name "lan";
  default-lease-time 86400;
  max-lease-time 604800;
}

# Reiniciar DHCP para distribuir novo DNS
systemctl restart isc-dhcp-server

# Clientes precisam renovar o lease para pegar o novo DNS:
# Linux: dhclient -r && dhclient
# Windows: ipconfig /release && ipconfig /renew`} />
          <h3 className="font-semibold text-text mt-6 mb-3">Via iptables — forçar DNS (evitar bypass)</h3>
          <CodeBlock lang="bash" code={`# Redirecionar TODA consulta DNS da LAN para o Pi-hole
# (impede clientes de usar 8.8.8.8 diretamente)
iptables -t nat -A PREROUTING \\
  -i eth1 \\                             # interface LAN
  -p udp --dport 53 \\
  ! -d 192.168.1.2 \\                   # exceto o próprio Pi-hole
  -j DNAT --to-destination 192.168.1.2:53

iptables -t nat -A PREROUTING \\
  -i eth1 -p tcp --dport 53 \\
  ! -d 192.168.1.2 \\
  -j DNAT --to-destination 192.168.1.2:53

iptables-save > /etc/iptables/rules.v4`} />
        </section>

        {/* Blocklists */}
        <section>
          <h2 className="section-title">Blocklists — Alimentar o Gravity</h2>
          <p className="text-text-2 mb-4">
            O Pi-hole usa o conceito de <strong>Gravity</strong> — uma banco de dados SQLite compilado
            a partir de múltiplas listas de domínios bloqueados.
          </p>
          <CodeBlock lang="bash" code={`# Adicionar listas via CLI
pihole -a adlist add "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts"
pihole -a adlist add "https://someonewhocares.org/hosts/zero/hosts"
pihole -a adlist add "https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt"

# Atualizar o Gravity (baixar e compilar todas as listas)
pihole -g
# Saída: [i] Target: URL  [✓] Status: Retrieving blocklist...
# ...
# [✓] Compiled 1234567 unique domains

# Ver estatísticas do gravity
pihole -q -adlists            # ver listas cadastradas
sqlite3 /etc/pihole/gravity.db "SELECT COUNT(*) FROM gravity;"

# Listas recomendadas:
# StevenBlack Unified Hosts: ~100k domínios (ads + malware)
# OISD Big: ~400k domínios (agressivo)
# URLHaus: domínios de malware ativos`} />
          <InfoBox className="mt-3">
            <strong>Gravity update automático:</strong> Pi-hole já configura um cron para atualizar as listas às 1:30 da manhã nos domingos. Para forçar agora: <code>pihole -g</code>
          </InfoBox>
        </section>

        {/* Whitelist / Blacklist */}
        <section>
          <h2 className="section-title">Whitelist e Blacklist — Ajustar Exceções</h2>
          <CodeBlock lang="bash" code={`# ── WHITELIST — permitir domínio bloqueado erroneamente ────────
pihole -w github.com
pihole -w cdn.jsdelivr.net
pihole -w fonts.gstatic.com

# Listar whitelist
pihole -w -l

# ── BLACKLIST — bloquear domínio específico manualmente ─────────
pihole -b facebook.com        # bloquear Facebook na rede toda
pihole -b tiktok.com

# Listar blacklist
pihole -b -l

# ── REGEX BLACKLIST — padrões mais poderosos ────────────────────
pihole --regex "^ads?[0-9]*\\..*"        # bloquear ad1.site.com, ads2.site.com
pihole --regex "^tracking\\..*"          # bloquear tracking.qualquersite.com

# ── REMOVER da whitelist ────────────────────────────────────────
pihole -w -d facebook.com    # remover da whitelist

# ── DESABILITAR temporariamente (ex: para debugar) ──────────────
pihole disable 30            # desabilitar por 30 segundos
pihole disable 5m            # desabilitar por 5 minutos
pihole enable                # reabilitar imediatamente`} />
        </section>

        {/* Dashboard e monitoramento */}
        <section>
          <h2 className="section-title">Dashboard — Monitorar a Rede em Tempo Real</h2>
          <p className="text-text-2 mb-4">
            O dashboard web em <code className="text-accent">http://IP-do-pihole/admin</code> mostra:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              { title: '📊 Estatísticas', items: ['Total de queries nas últimas 24h', '% de queries bloqueadas', 'Domínios únicos consultados', 'Top bloqueados e top permitidos'] },
              { title: '🔍 Query Log', items: ['Cada query em tempo real: cliente, domínio, status', 'BLOCKED (cinza) vs ALLOWED (verde)', 'FORWARDED (upstream) vs CACHED', 'Filtrar por cliente, domínio ou status'] },
              { title: '📋 Listas', items: ['Gerenciar adlists (blocklists)', 'Whitelist e Blacklist por domínio', 'Regex patterns', 'Grupo de clientes (por IP)'] },
              { title: '🌐 DNS', items: ['Configurar upstream resolvers', 'Conditional forwarding (LAN)', 'Custom DNS records (hosts locais)', 'DNSSEC on/off'] },
            ].map(({ title, items }) => (
              <div key={title} className="bg-bg-2 border border-border rounded-lg p-4">
                <p className="font-semibold text-text text-sm mb-2">{title}</p>
                <ul className="space-y-1">
                  {items.map(i => <li key={i} className="text-text-2 text-sm">• {i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <CodeBlock lang="bash" code={`# Monitoramento via terminal (ao vivo, estilo htop)
pihole -c

# Ver top 10 domínios bloqueados hoje
pihole -c -j | python3 -m json.tool | grep -A 5 "top_blocked"

# Ver log de queries em tempo real
tail -f /var/log/pihole/FTL.log

# Estatísticas sumárias
pihole -q -a
pihole -l                    # últimas queries no terminal`} />
        </section>

        {/* Unbound como resolver local */}
        <section>
          <h2 className="section-title">Unbound — Resolver Recursivo Local (Privacidade Máxima)</h2>
          <p className="text-text-2 mb-4">
            Em vez de encaminhar queries para a Cloudflare (1.1.1.1) ou Google (8.8.8.8),
            você pode usar o <strong>Unbound</strong> para resolver diretamente nos root servers.
            Zero dependência de um resolver externo.
          </p>
          <CodeBlock lang="bash" code={`# Instalar Unbound
apt install unbound -y

# /etc/unbound/unbound.conf.d/pihole.conf
server:
    verbosity: 0
    interface: 127.0.0.1
    port: 5335
    do-ip4: yes
    do-udp: yes
    do-tcp: yes
    do-ip6: no
    prefer-ip6: no
    harden-glue: yes
    harden-dnssec-stripped: yes
    use-caps-for-id: no
    edns-buffer-size: 1472
    prefetch: yes
    num-threads: 1
    so-rcvbuf: 1m
    private-address: 192.168.0.0/16
    private-address: 10.0.0.0/8

# Reiniciar Unbound
systemctl restart unbound

# Testar Unbound direto na porta 5335
dig @127.0.0.1 -p 5335 google.com

# Configurar Pi-hole para usar Unbound como upstream:
# Admin → Settings → DNS → Custom 1: 127.0.0.1#5335
# Desmarcar Cloudflare/Google`} />
        </section>

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows — DNS Forwarder"
          linuxLabel="Linux — Pi-hole"
          windowsCode={`# Windows Server DNS com RPZ (Response Policy Zone)
# ou Windows Defender com Network Protection

# DNS Manager → Forward Lookup Zones
# → New Zone → Stub Zone → ads.doubleclick.net
# Apontar para 0.0.0.0 (sinkhole manual)

# PowerShell:
Add-DnsServerPrimaryZone \`
  -Name "ads.doubleclick.net" \`
  -ZoneFile "ads.doubleclick.net.dns"

# Problema: manual — 1 zona por domínio bloqueado
# Não escala para listas de 100k domínios

# Para proteção em escala: Windows Defender ATP
# ou ferramentas de terceiros (NetShield, DNS Filter)`}
          linuxCode={`# Pi-hole: automatizado + dashboard
# Instalar (uma vez):
curl -sSL https://install.pi-hole.net | bash

# Adicionar blocklist com 100k domínios:
pihole -a adlist add "https://url-da-lista"
pihole -g   # compilar em segundos

# Bloquear domínio específico:
pihole -b "ads.doubleclick.net"

# Permitir exceção:
pihole -w "cdn.site-legitimo.com"

# Resultado instantâneo para toda a rede
# sem configurar nada nos clientes

# Dashboard em tempo real:
# http://IP/admin`}
        />

        {/* Exercícios */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'Instalar e acessar o dashboard',
                desc: 'Instale Pi-hole via Docker Compose ou script. Acesse o dashboard em /admin. Execute dig @IP-pihole ads.doubleclick.net e confirme que retorna 0.0.0.0.' },
              { n: 2, title: 'Conectar toda a rede',
                desc: 'Configure o isc-dhcp-server (Sprint I.7) para distribuir o IP do Pi-hole como DNS. Ou adicione a regra iptables de redirecionamento forçado. Confirme no dashboard que as queries dos clientes aparecem.' },
              { n: 3, title: 'Blocklists + whitelist + monitoramento',
                desc: 'Adicione a lista StevenBlack e execute pihole -g. Adicione um domínio à blacklist manualmente. Acesse um site com muitos anúncios e compare o Query Log. Faça whitelist de algum domínio que foi bloqueado erroneamente.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-bg-2 border border-border rounded-lg p-4 flex gap-4">
                <span className="text-accent font-bold text-xl min-w-[1.5rem]">{n}</span>
                <div>
                  <p className="font-semibold text-text">{title}</p>
                  <p className="text-text-2 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section>
          <h2 className="section-title">Checklist do Lab</h2>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span className={`text-sm ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2'} group-hover:text-text transition-colors`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <p className="text-ok font-semibold">🕳️ Pi-hole Master desbloqueado!</p>
              <p className="text-text-2 text-sm mt-1">DNS sinkhole protegendo toda a rede — anúncios e rastreadores bloqueados na fonte.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'Pi-hole container não inicia: address already in use — porta 53',
              fix: 'systemd-resolved está ocupando a porta 53. Desabilitar: systemctl disable --now systemd-resolved. Editar /etc/systemd/resolved.conf: DNSStubListener=no. Criar link: ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf e reiniciar o container.',
            },
            {
              err: 'Sites não estão sendo bloqueados — Pi-hole ativo mas sem efeito',
              fix: 'Clientes não estão usando o Pi-hole como DNS. Verificar: nslookup google.com IP-DO-PIHOLE. Se funcionar, o problema é no DHCP. Confirmar que o DHCP distribui o IP do Pi-hole como DNS primário. Testar manualmente: configurar DNS estático no cliente.',
            },
            {
              err: 'pihole -g falha: Gravity update failed — download de listas bloqueado',
              fix: 'O próprio Pi-hole está bloqueando as URLs das listas de bloqueio (whitelist circular). Desabilitar temporariamente: pihole disable. Rodar pihole -g. Reativar: pihole enable. Adicionar às listas de whitelist os domínios de download das listas.',
            },
            {
              err: 'Dashboard inacessível — Pi-hole responde DNS mas HTTP 404',
              fix: 'O lighttpd não está rodando ou a porta 80 está ocupada. No container: docker compose logs pihole | grep lighttpd. Verificar variável de ambiente WEBPASSWORD no compose. Recriar o container com docker compose up -d --force-recreate.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        {/* ── Exercícios Guiados ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Instalar Pi-hole com Docker Compose</p>
              <CodeBlock lang="bash" code={`# Resolver conflito com systemd-resolved na porta 53
systemctl stop systemd-resolved
sed -i 's/^DNSStubListener=yes/DNSStubListener=no/' /etc/systemd/resolved.conf
systemctl restart systemd-resolved

# Criar stack Docker Compose do Pi-hole
mkdir -p /opt/pihole && cd /opt/pihole

cat > docker-compose.yml << 'EOF'
services:
  pihole:
    image: pihole/pihole:latest
    container_name: pihole
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "8080:80/tcp"
    environment:
      WEBPASSWORD: "minha-senha-segura"
      PIHOLE_DNS_: "1.1.1.1;8.8.8.8"
      TZ: "America/Sao_Paulo"
    volumes:
      - ./etc-pihole:/etc/pihole
      - ./etc-dnsmasq:/etc/dnsmasq.d
    restart: unless-stopped
EOF

docker compose up -d
docker compose logs -f pihole`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Testar Bloqueio e Gerenciar Listas</p>
              <CodeBlock lang="bash" code={`# Testar que o Pi-hole está respondendo DNS
dig @127.0.0.1 google.com        # deve resolver
dig @127.0.0.1 ads.google.com    # pode bloquear (NXDOMAIN ou 0.0.0.0)

# Atualizar gravity (blocklists)
docker exec pihole pihole -g
# ou: pihole -g (se instalado diretamente)

# Ver estatísticas de bloqueio
docker exec pihole pihole -c

# Adicionar domínio à whitelist (des-bloquear)
docker exec pihole pihole -w meuservico.com

# Adicionar domínio à blacklist (bloquear)
docker exec pihole pihole -b ads.trafego.com

# Ver queries recentes no log
docker exec pihole pihole -t

# Acessar o dashboard web
echo "Dashboard: http://$(hostname -I | awk '{print $1}'):8080/admin"`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Forçar DNS da LAN via iptables DNAT</p>
              <CodeBlock lang="bash" code={`# Forçar todos os clientes da LAN a usar o Pi-hole como DNS
# (previne que clientes usem 8.8.8.8 diretamente, bypassando o filtro)

PI_HOLE_IP="192.168.57.5"   # IP do servidor Pi-hole
LAN_IFACE="eth1"

# Redirecionar qualquer query DNS da LAN para o Pi-hole
iptables -t nat -A PREROUTING \
  -i $LAN_IFACE \
  -p udp --dport 53 \
  ! -d $PI_HOLE_IP \
  -j DNAT --to-destination $PI_HOLE_IP:53

iptables -t nat -A PREROUTING \
  -i $LAN_IFACE \
  -p tcp --dport 53 \
  ! -d $PI_HOLE_IP \
  -j DNAT --to-destination $PI_HOLE_IP:53

# Verificar regras
iptables -t nat -L PREROUTING -n -v | grep dpt:53

# Testar — mesmo usando 8.8.8.8, a query vai para o Pi-hole
dig @8.8.8.8 google.com   # ainda deve retornar resposta`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/pihole" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
