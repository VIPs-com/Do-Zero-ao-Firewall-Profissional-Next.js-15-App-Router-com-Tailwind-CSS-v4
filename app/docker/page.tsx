'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Network, Shield, Terminal, AlertTriangle, CheckCircle2, Circle, Layers, Lock, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, type DeepDive } from '@/data/deepDives';

const DOCKER_CHECKLIST = [
  { id: 'docker-installed', text: 'Docker instalado, daemon ativo e hello-world executado com sucesso' },
  { id: 'docker-bridge',    text: 'Rede bridge customizada criada e dois containers se comunicando por nome' },
  { id: 'docker-iptables',  text: 'Regras Docker inspecionadas: chain DOCKER e DNAT do port mapping visíveis' },
];

const DOCKER_INSTALL = `# Instalar Docker Engine no Ubuntu/Debian (método oficial)
curl -fsSL https://get.docker.com | sh

# Adicionar seu usuário ao grupo docker (sem sudo)
usermod -aG docker $USER
newgrp docker   # ou fazer logout/login

# Verificar instalação
docker --version
docker info | grep "Docker Root Dir"

# Primeiro teste
docker run hello-world

# Ver containers em execução
docker ps
docker ps -a   # incluindo parados`;

const NETWORK_DRIVERS = `# Listar redes existentes (criadas automaticamente na instalação)
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# abc123...      bridge    bridge    local   ← rede padrão (docker0)
# def456...      host      host      local   ← compartilha pilha de rede do host
# ghi789...      none      null      local   ← sem rede (isolamento total)

# Inspecionar a rede bridge padrão
docker network inspect bridge

# Ver a interface docker0 no host
ip addr show docker0
ip route show
# 172.17.0.0/16 dev docker0 proto kernel scope link`;

const BRIDGE_CUSTOM = `# ── Criar rede bridge customizada ────────────────────────────────
docker network create \\
  --driver bridge \\
  --subnet 172.20.0.0/16 \\
  --ip-range 172.20.0.0/24 \\
  --gateway 172.20.0.1 \\
  minha-rede

# ── Iniciar containers na rede customizada ────────────────────────
docker run -d --name web --network minha-rede nginx:alpine
docker run -d --name app --network minha-rede alpine sleep 3600

# ── Testar resolução DNS interna ──────────────────────────────────
# Na rede customizada, Docker atua como DNS interno (127.0.0.11)
docker exec app ping web       # funciona! Docker resolve "web" pelo nome
docker exec app wget -qO- web  # HTTP funciona por nome de container

# ── Na rede padrão (bridge), DNS por nome NÃO funciona ───────────
docker run -d --name srv1 nginx
docker run --rm alpine ping srv1  # FALHA — sem DNS na rede padrão`;

const PORT_MAPPING = `# Port mapping = DNAT automático gerenciado pelo Docker daemon
# docker run -p HOST_PORT:CONTAINER_PORT

# Exemplo: Nginx exposto na porta 8080 do host
docker run -d -p 8080:80 --name webserver nginx

# ── Verificar a "mágica" do iptables ─────────────────────────────
# Docker criou automaticamente uma regra DNAT equivalente a:
# iptables -t nat -A DOCKER -p tcp --dport 8080 -j DNAT --to 172.17.0.2:80

# Ver a regra na tabela NAT:
iptables -t nat -L DOCKER -n --line-numbers
# Chain DOCKER (2 references)
# num  target  prot  opt  source    dest      extras
#  1   DNAT    tcp   --   0.0.0.0  0.0.0.0   tcp dpt:8080 to:172.17.0.2:80

# Também aparece no FORWARD:
iptables -L DOCKER -n --line-numbers
# ACCEPT  tcp  --  0.0.0.0  172.17.0.2  tcp dpt:80`;

const IPTABLES_CHAINS = `# Docker cria e gerencia 4 chains principais automaticamente:

# ── Tabela FILTER ─────────────────────────────────────────────────
iptables -L -n --line-numbers
# DOCKER-USER         → suas regras customizadas (NÃO sobrescritas pelo Docker)
# DOCKER-ISOLATION-STAGE-1 → isolamento entre redes bridge diferentes
# DOCKER-ISOLATION-STAGE-2 → segunda fase do isolamento
# DOCKER              → regras de acesso aos containers

# ── Tabela NAT ────────────────────────────────────────────────────
iptables -t nat -L -n
# DOCKER              → DNAT para port mappings
# POSTROUTING         → MASQUERADE para tráfego de saída dos containers

# ── Ver todas de uma vez ──────────────────────────────────────────
iptables -L -n -v --line-numbers && echo "---NAT---" && iptables -t nat -L -n -v`;

const DOCKER_USER = `# ── DOCKER-USER: onde você coloca suas regras ────────────────────
# O Docker NUNCA sobrescreve a chain DOCKER-USER.
# É o lugar correto para regras de firewall + Docker.

# Bloquear acesso externo ao container na porta 8080 (só localhost)
iptables -I DOCKER-USER -p tcp --dport 80 -s 0.0.0.0/0 -j DROP
iptables -I DOCKER-USER -p tcp --dport 80 -s 127.0.0.1 -j ACCEPT

# Bloquear comunicação entre redes bridge (inter-container isolation)
iptables -I DOCKER-USER -i docker0 -o docker0 -j DROP

# Ver regras da DOCKER-USER
iptables -L DOCKER-USER -n --line-numbers

# Atenção: regras em DOCKER-USER são perdidas no reboot sem persistência
# Usar iptables-persistent (como aprendido no módulo iptables):
iptables-save > /etc/iptables/rules.v4`;

const COMPOSE_NETWORK = `# docker-compose.yml — rede isolada automática
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"        # port mapping → DNAT automático
    networks:
      - frontend

  app:
    image: node:alpine
    networks:
      - frontend
      - backend          # app conecta às duas redes

  db:
    image: postgres:15
    networks:
      - backend          # db só acessível internamente
    environment:
      POSTGRES_PASSWORD: segredo

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true       # sem acesso à internet (mais seguro para DB)`;

const VERIFY_DOCKER = `# ── Checklist de verificação ─────────────────────────────────────

# 1. Docker instalado e daemon ativo
docker --version && docker info | grep "Server Version"

# 2. Rede bridge customizada criada
docker network ls | grep minha-rede
docker network inspect minha-rede | grep Subnet

# 3. Dois containers comunicando por nome (DNS interno)
docker exec app ping -c 2 web
# Saída esperada: 2 packets transmitted, 2 received

# 4. Port mapping criou DNAT no iptables
docker run -d -p 8080:80 --name test-nat nginx
iptables -t nat -L DOCKER -n | grep 8080
# Saída esperada: DNAT ... tcp dpt:8080 to:172.17.x.x:80

# Limpeza após teste
docker stop test-nat && docker rm test-nat
docker stop web app && docker rm web app`;

export default function DockerPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);

  useEffect(() => {
    trackPageVisit('/docker');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = DOCKER_CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-docker">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Docker Networking</span>
      </div>

      <div className="section-label">Tópico 47 · Camada 3 / 4</div>
      <h1 className="section-title">🐳 Docker Networking</h1>
      <p className="section-sub">
        Docker não existe num vácuo — ele <strong>manipula o iptables automaticamente</strong> nas
        suas costas. Cada <code>-p 8080:80</code> vira uma regra DNAT na chain <code>DOCKER</code>.
        Cada <code>docker network create</code> vira uma bridge e novas regras de roteamento.
        Neste módulo você conecta tudo que aprendeu sobre redes Linux com a realidade dos containers.
      </p>

      <FluxoCard
        title="Como o Docker usa o iptables"
        steps={[
          { label: 'docker run -p', sub: 'daemon recebe comando', icon: <Terminal className="w-4 h-4" />, color: 'border-[var(--color-layer-7)]' },
          { label: 'bridge docker0', sub: 'interface virtual criada', icon: <Network className="w-4 h-4" />, color: 'border-[var(--color-layer-3)]' },
          { label: 'chain DOCKER', sub: 'DNAT automático + FORWARD', icon: <Layers className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'container', sub: 'IP 172.17.x.x isolado', icon: <Shield className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">

          {/* ── Seção 1: Instalação ── */}
          <section id="instalacao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">Instalação e Primeiros Passos</h2>
            </div>

            <CodeBlock code={DOCKER_INSTALL} lang="bash" />

            <div className="mt-6">
              <InfoBox title="Como o Docker daemon funciona">
                O <code>dockerd</code> roda como root e tem acesso total ao iptables. Quando você executa
                qualquer comando <code>docker run</code> ou <code>docker network</code>, o daemon
                configura automaticamente as interfaces de rede, rotas e regras iptables necessárias.
              </InfoBox>
            </div>
          </section>

          {/* ── Seção 2: Drivers de rede ── */}
          <section id="redes">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-3/10 flex items-center justify-center text-layer-3">
                <Network size={24} />
              </div>
              <h2 className="text-2xl font-bold">Drivers de Rede — bridge, host e none</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              Docker suporta múltiplos drivers de rede. O <strong>bridge</strong> é o padrão —
              cria uma interface virtual (<code>docker0</code>) e isola containers via NAT,
              exatamente como o firewall do laboratório isola a LAN da WAN.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { name: 'bridge', icon: '🌉', desc: 'NAT via iptables. Containers isolados, acessíveis via port mapping. Padrão.', color: 'border-ok/30 bg-ok/5' },
                { name: 'host', icon: '🖥️', desc: 'Compartilha pilha de rede do host. Sem isolamento. Performance máxima.', color: 'border-warn/30 bg-warn/5' },
                { name: 'none', icon: '🚫', desc: 'Sem interface de rede. Isolamento total. Útil para jobs de processamento.', color: 'border-border bg-bg-3' },
              ].map(d => (
                <div key={d.name} className={`p-4 rounded-xl border ${d.color}`}>
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <code className="font-bold text-sm">{d.name}</code>
                  <p className="text-xs text-text-2 mt-2 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>

            <CodeBlock code={NETWORK_DRIVERS} lang="bash" />
          </section>

          {/* ── Seção 3: Bridge customizada ── */}
          <section id="bridge-custom">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Layers size={24} />
              </div>
              <h2 className="text-2xl font-bold">Redes Bridge Customizadas</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              A rede bridge <em>padrão</em> do Docker (<code>docker0</code>) tem uma limitação importante:
              containers não se resolvem por nome. Criando uma rede bridge <em>customizada</em>,
              o Docker ativa um servidor DNS interno (em <code>127.0.0.11</code>) e containers
              se comunicam diretamente pelo nome — sem precisar de IPs fixos.
            </p>

            <CodeBlock code={BRIDGE_CUSTOM} lang="bash" />

            <div className="mt-6">
              <HighlightBox title="💡 Rede customizada vs padrão — a diferença crucial">
                Na rede <strong>padrão</strong> (<code>bridge</code>): containers se veem por IP, mas não por nome.
                Na rede <strong>customizada</strong>: Docker injeta um resolvedor DNS (<code>127.0.0.11</code>)
                — <code>ping web</code> funciona porque Docker resolve &quot;web&quot; para o IP atual do container.
                Containers podem reiniciar com IPs diferentes sem quebrar a comunicação.
              </HighlightBox>
            </div>
          </section>

          {/* ── Seção 4: Port mapping = DNAT ── */}
          <section id="port-mapping">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">Port Mapping é DNAT Automático</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              Quando você faz <code>docker run -p 8080:80</code>, o Docker daemon executa
              internamente o equivalente a um <code>iptables -t nat -A DOCKER ... -j DNAT</code>.
              É exatamente o mesmo mecanismo que você configurou manualmente no módulo DNAT —
              só que agora o Docker gerencia o ciclo de vida automaticamente.
            </p>

            <CodeBlock code={PORT_MAPPING} lang="bash" />

            <div className="mt-6">
              <InfoBox title="Por que isso importa para o SysAdmin">
                Se você tem um firewall (<code>iptables</code>) e instala Docker no mesmo servidor,
                o Docker <strong>vai modificar suas regras</strong>. Ele insere chains próprias e
                pode abrir portas que você pensava estar bloqueadas. Conhecer esse mecanismo é
                essencial para manter a postura de segurança do servidor.
              </InfoBox>
            </div>
          </section>

          {/* ── Seção 5: Chains do iptables ── */}
          <section id="iptables-chains">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-4/10 flex items-center justify-center text-layer-4">
                <Layers size={24} />
              </div>
              <h2 className="text-2xl font-bold">As 4 Chains do Docker no iptables</h2>
            </div>

            <CodeBlock code={IPTABLES_CHAINS} lang="bash" />

            <div className="mt-6">
              <WarnBox title="⚠️ Docker bypassa regras na chain INPUT e FORWARD">
                Por padrão, o Docker adiciona regras que permitem tráfego para containers <em>antes</em>
                de suas regras DROP. Isso significa que um container exposto com <code>-p</code>
                é acessível de qualquer IP mesmo que você tenha <code>iptables -P INPUT DROP</code>.
                A solução é usar a chain <code>DOCKER-USER</code>.
              </WarnBox>
            </div>
          </section>

          {/* ── Seção 6: DOCKER-USER e Segurança ── */}
          <section id="docker-user">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">DOCKER-USER — Suas Regras, Respeitadas</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              A chain <code>DOCKER-USER</code> é a única que o Docker daemon <em>nunca</em> modifica
              ou limpa. É o lugar correto para colocar regras de firewall que coexistam com Docker.
              Também é onde você implementa isolamento adicional entre containers e redes.
            </p>

            <CodeBlock code={DOCKER_USER} lang="bash" />
          </section>

          {/* ── Seção 7: Docker Compose ── */}
          <section id="compose">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-6/10 flex items-center justify-center text-layer-6">
                <Network size={24} />
              </div>
              <h2 className="text-2xl font-bold">Docker Compose — Redes Declarativas</h2>
            </div>

            <p className="text-text-2 mb-4 leading-relaxed">
              O <code>docker-compose.yml</code> permite definir topologias de rede complexas de
              forma declarativa. O campo <code>internal: true</code> cria redes bridge sem rota
              para a internet — ideal para bancos de dados que não devem ter saída WAN.
            </p>

            <CodeBlock code={COMPOSE_NETWORK} lang="yaml" />

            <div className="mt-6">
              <HighlightBox title="💡 Analogia com o laboratório">
                A rede <strong>frontend</strong> é sua DMZ — acessível de fora via port mapping.
                A rede <strong>backend</strong> com <code>internal: true</code> é sua LAN —
                o banco de dados (<code>db</code>) nunca vê a internet.
                Mesma arquitetura WAN/DMZ/LAN que você construiu com iptables, mas declarativa.
              </HighlightBox>
            </div>
          </section>

          {/* ── Verificação Final ── */}
          <section id="verificacao">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="text-warn" />
              Verificação Final
            </h2>
            <CodeBlock code={VERIFY_DOCKER} lang="bash" />
          </section>

        </div>

        {/* ── Sidebar: Checklist ── */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="p-6 rounded-2xl bg-bg-2 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Network className="text-accent w-5 h-5" />
              <h3 className="font-bold text-lg">Checklist do Lab</h3>
            </div>

            <div className="space-y-3">
              {DOCKER_CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors',
                    checklist[item.id]
                      ? 'bg-ok/10 border border-ok/30'
                      : 'bg-bg-3 border border-border hover:border-accent/30',
                  )}
                >
                  {checklist[item.id]
                    ? <CheckCircle2 className="text-ok mt-0.5 shrink-0 w-5 h-5" />
                    : <Circle className="text-text-3 mt-0.5 shrink-0 w-5 h-5" />}
                  <span className={cn('text-sm leading-snug', checklist[item.id] ? 'text-ok' : 'text-text-2')}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>

            {allDone && (
              <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-center">
                <div className="text-2xl mb-2">🐳</div>
                <p className="text-sm font-bold text-accent">Docker Master desbloqueado!</p>
                <p className="text-xs text-text-2 mt-1">Badge adicionado ao seu perfil</p>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs text-text-3 mb-3 font-bold uppercase tracking-wider">Progresso</p>
              <div className="w-full bg-bg-3 rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2 transition-[width] duration-700 ease-out"
                  style={{ width: `${(DOCKER_CHECKLIST.filter(c => checklist[c.id]).length / DOCKER_CHECKLIST.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-3 mt-2 text-right">
                {DOCKER_CHECKLIST.filter(c => checklist[c.id]).length}/{DOCKER_CHECKLIST.length} concluídos
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-bg-2 border border-border">
            <Terminal className="text-accent w-5 h-5 mb-3" />
            <h4 className="font-bold mb-2 text-sm">Comandos Rápidos</h4>
            <div className="space-y-2 font-mono text-xs text-text-2">
              <div><span className="text-text-3">►</span> <code>docker network ls</code></div>
              <div><span className="text-text-3">►</span> <code>docker network inspect bridge</code></div>
              <div><span className="text-text-3">►</span> <code>iptables -t nat -L DOCKER -n</code></div>
              <div><span className="text-text-3">►</span> <code>iptables -L DOCKER-USER -n</code></div>
              <div><span className="text-text-3">►</span> <code>ip addr show docker0</code></div>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-bg-2 border border-border">
            <h4 className="font-bold mb-3 text-sm flex items-center gap-2">
              <Shield size={14} className="text-ok" />
              Conexão com módulos anteriores
            </h4>
            <div className="space-y-2 text-xs text-text-2">
              <div className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span><Link href="/dnat" className="text-accent hover:underline">DNAT</Link> — port mapping é DNAT automático</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span><Link href="/wan-nat" className="text-accent hover:underline">NAT</Link> — containers usam MASQUERADE para sair</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent shrink-0">→</span>
                <span><Link href="/hardening" className="text-accent hover:underline">Hardening</Link> — AppArmor também afeta containers</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Windows Comparison */}
      <div className="mt-12">
        <WindowsComparisonBox
          windowsLabel="Windows — Docker Desktop / Hyper-V"
          linuxLabel="Linux — Docker Engine nativo"
          windowsCode={`# Docker Desktop no Windows
# Requer: WSL2 + Windows 10 v2004+ ou Hyper-V

# Instalar via winget:
winget install Docker.DockerDesktop

# Docker Desktop usa HyperV ou WSL2 como backend
# Verificar backend ativo:
docker info | findstr "Operating System"

# Redes no Windows — diferença importante:
# bridge network NÃO é acessível do host no Windows
# (limitação do HyperV networking)
# Use "host" mode no WSL2 ou exponha via -p

# iptables NÃO existe no Windows — Docker Desktop
# usa regras do Windows Firewall internamente

# Ver regras de firewall que o Docker criou:
netsh advfirewall firewall show rule name=all |
  findstr -i docker

# Equivalente ao docker network inspect:
docker network ls
docker network inspect bridge`}
          linuxCode={`# Docker Engine no Linux — sem virtualization overhead
# O daemon roda direto no kernel host

# Instalar o Docker Engine oficial:
apt install ca-certificates curl gnupg -y
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg |
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
apt install docker-ce docker-ce-cli containerd.io -y
usermod -aG docker $USER

# Docker cria chains no iptables automaticamente:
# DOCKER, DOCKER-USER, DOCKER-ISOLATION-STAGE-1/2
iptables -L -n | grep -E "DOCKER|Chain"

# Regra para bloquear acesso externo ao container:
# (adicionar na chain DOCKER-USER, não FORWARD!)
iptables -I DOCKER-USER -i eth0 \\
  -d 172.17.0.2 -p tcp --dport 6379 -j DROP

# Ver redes Docker:
docker network ls
docker network inspect bridge`}
        />
      </div>

      {/* ── Exercícios Guiados ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Rede bridge isolada com DNS interno</p>
            <CodeBlock lang="bash" code={`# Criar rede customizada (tem DNS interno!)
docker network create --driver bridge app-net

# Iniciar dois containers na mesma rede
docker run -d --name web --network app-net nginx:alpine
docker run -d --name db  --network app-net redis:alpine

# Testar DNS interno — containers se resolvem por nome
docker exec web ping -c 2 db   # deve funcionar!
docker exec db  ping -c 2 web  # deve funcionar!

# Limpar
docker stop web db && docker rm web db
docker network rm app-net`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Inspecionar chains do iptables criadas pelo Docker</p>
            <CodeBlock lang="bash" code={`# Ver chains criadas pelo Docker
iptables -L -n | grep -E "^Chain (DOCKER|FORWARD)"

# Iniciar um container com porta exposta
docker run -d --name nginx-test -p 8080:80 nginx:alpine

# Ver regra DNAT automática criada
iptables -t nat -L -n | grep 8080

# Proteger Redis de acesso externo (via DOCKER-USER)
docker run -d --name redis-ext -p 6379:6379 redis:alpine
iptables -I DOCKER-USER -i eth0 -p tcp --dport 6379 -j DROP

# Testar: acesso externo bloqueado, interno funciona
docker exec redis-ext redis-cli ping  # OK (interno)

# Limpar
docker stop nginx-test redis-ext && docker rm nginx-test redis-ext`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Rede internal (sem acesso externo)</p>
            <CodeBlock lang="bash" code={`# Rede interna — containers sem acesso à internet
docker network create --internal backend-net

# Banco de dados só na rede interna
docker run -d --name postgres --network backend-net \\
  -e POSTGRES_PASSWORD=senha postgres:alpine

# App com acesso às duas redes
docker run -d --name app \\
  --network backend-net nginx:alpine

# Verificar: postgres não tem rota para internet
docker exec postgres ping -c 2 8.8.8.8  # deve falhar
docker exec app ping -c 2 8.8.8.8       # funciona (app não é --internal)

docker stop postgres app && docker rm postgres app
docker network rm backend-net`} />
          </div>
        </div>
      </section>

      {/* ── Erros Comuns ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle size={22} className="text-warn" /> Erros Comuns e Soluções
        </h2>
        {[
          {
            err: 'docker: permission denied while trying to connect to the Docker daemon socket',
            fix: 'Adicionar o usuário ao grupo docker: sudo usermod -aG docker $USER — sair e entrar novamente na sessão (newgrp docker ou logout/login). Nunca rodar docker com sudo em produção.',
          },
          {
            err: 'Error response from daemon: network not found',
            fix: 'Rede foi removida ou o nome está errado. Listar redes: docker network ls. Recriar: docker network create --driver bridge minha-rede. Confirmar que o compose usa o mesmo nome.',
          },
          {
            err: 'Container não consegue acessar outro container pelo nome',
            fix: 'Containers na rede bridge padrão (docker0) não têm DNS interno. Criar uma rede bridge customizada: docker network create app-net e conectar ambos os containers. Na rede customizada, o nome do container vira hostname.',
          },
          {
            err: 'Port is already allocated — bind: address already in use',
            fix: 'Outra aplicação está usando a porta. Verificar: ss -tuln | grep :80. Parar o serviço conflitante (systemctl stop nginx) ou alterar o mapeamento de porta no docker run (-p 8080:80).',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      {/* ── Mergulho Técnico ── */}
      <div className="p-6 rounded-xl bg-bg-2 border border-border mb-8">
        <h3 className="font-bold text-sm text-accent mb-3">🤿 Mergulho Técnico</h3>
        <p className="text-xs text-text-2 leading-relaxed mb-4">
          Entenda como o Docker realmente conecta containers — bridges Linux, iptables DNAT e por que a chain DOCKER-USER existe.
        </p>
        <button
          onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'docker-networking-internals') ?? null)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-bg border border-border hover:border-accent transition-all group"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent" />
            <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Docker Networking Internals</span>
          </div>
          <ArrowRight size={12} className="text-text-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <DeepDiveModal dive={activeDeepDive} onClose={() => setActiveDeepDive(null)} />

      <ModuleNav currentPath="/docker" />
    </div>
  );
}
