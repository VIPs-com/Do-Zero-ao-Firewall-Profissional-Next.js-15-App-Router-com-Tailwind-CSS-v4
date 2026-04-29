'use client';

import { useEffect, useState } from 'react';
import { Terminal, Network, Shield, Wifi, Globe, Lock, AlertTriangle } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { WindowsComparisonBox } from '@/components/ui/Boxes';

function ErrorModal({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left px-4 py-3 rounded-lg border border-border bg-bg-2 hover:border-err/50 hover:bg-err/5 transition-colors flex items-center gap-3 text-sm"
      >
        <span className="text-err">{icon ?? '⚠️'}</span>
        <span className="text-text-2">{title}</span>
        <span className="ml-auto text-text-3 text-xs">ver solução →</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setOpen(false)}>
          <div className="bg-bg-2 border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-text-3 hover:text-text text-xl leading-none">×</button>
            </div>
            <div className="text-sm text-text-2 space-y-2">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SshProxyPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/ssh-proxy');
  }, [trackPageVisit]);

  const items = [
    { id: 'ssh-dinamico', text: 'Proxy SOCKS5 configurado', sub: 'ssh -D 1080 + browser apontando para localhost:1080' },
    { id: 'ssh-local',    text: 'Port forwarding local testado', sub: 'ssh -L acessa serviço remoto pelo localhost' },
    { id: 'ssh-jump',     text: 'Jump Host funcional', sub: 'ssh -J bastion host-interno — saltou sem VPN' },
  ];

  return (
    <div className="module-accent-ssh-proxy max-w-4xl mx-auto px-4 py-10 space-y-10">

      {/* Navegação Anterior / Próximo */}
      <ModuleNav currentPath="/ssh-proxy" order={FUNDAMENTOS_ORDER} />

      {/* Hero */}
      <section className="module-hero pb-2">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🚇</span>
          <div>
            <p className="section-label">Serviços Avançados</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text">SSH como Proxy SOCKS</h1>
          </div>
        </div>
        <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
          SSH não é só acesso remoto — é um <strong>canivete suíço de rede</strong>. Com uma única conexão
          você cria proxies SOCKS5, redireciona portas, salta entre hosts e mantém túneis persistentes.
          Tudo cifrado, sem precisar de VPN.
        </p>
      </section>

      {/* Os 3 tipos de tunneling */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Network size={22} className="text-[color:var(--mod)]" />
          Os 3 Modos de Tunneling SSH
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { flag: '-D', title: 'Dynamic / SOCKS5', desc: 'Proxy dinâmico para qualquer destino. O cliente decide para onde vai — ideal para browser seguro.', color: 'border-ok/40 bg-ok/5', tag: 'text-ok' },
            { flag: '-L', title: 'Local Forward', desc: 'Porta local → porta remota. Acesse um banco de dados interno como se fosse localhost.', color: 'border-info/40 bg-info/5', tag: 'text-info' },
            { flag: '-R', title: 'Remote Forward', desc: 'Porta remota → porta local. Exponha seu servidor local via um host público.', color: 'border-warn/40 bg-warn/5', tag: 'text-warn' },
          ].map(m => (
            <div key={m.flag} className={`rounded-xl border p-5 ${m.color}`}>
              <p className={`text-2xl font-mono font-bold mb-1 ${m.tag}`}>{m.flag}</p>
              <p className="font-semibold text-text mb-2">{m.title}</p>
              <p className="text-sm text-text-2">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FluxoCard */}
      <FluxoCard
        title="Fluxo: SSH como Proxy SOCKS5"
        steps={[
          { label: 'ssh -D 1080 user@servidor', sub: 'cria listener SOCKS5 em localhost:1080', icon: <Terminal size={14} />, color: 'border-ok/50' },
          { label: 'Browser → proxy SOCKS5 localhost:1080', sub: 'todo o tráfego sai pelo servidor SSH', icon: <Globe size={14} />, color: 'border-info/50' },
          { label: 'Servidor SSH faz DNS + conexão TCP', sub: 'destino nunca vê seu IP real', icon: <Shield size={14} />, color: 'border-[color:var(--mod)]/50' },
          { label: 'Sessão encerrada → proxy some', sub: 'sem rastros, sem porta exposta no servidor', icon: <Lock size={14} />, color: 'border-ok/50' },
        ]}
      />

      {/* Seção 1: SOCKS5 Dinâmico */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Globe size={22} className="text-[color:var(--mod)]" />
          1. Proxy SOCKS5 Dinâmico (<code className="text-sm bg-bg-3 px-1 rounded">-D</code>)
        </h2>
        <p className="text-text-2">
          O modo <code>-D</code> transforma seu cliente SSH em um <strong>proxy SOCKS5 local</strong>.
          Qualquer aplicação que suporte SOCKS pode rotear seu tráfego por ele — browser, curl, git.
        </p>

        <div className="space-y-4">
          <StepItem
            number={1}
            title="Abrir o túnel SOCKS5"
            description="O parâmetro -N evita abrir shell remoto. -f coloca em background. -D define a porta local."
          />
          <CodeBlock lang="bash" code={`# Forma interativa (terminal bloqueado enquanto ativo)
ssh -D 1080 user@servidor.exemplo.com

# Forma background (recomendado para uso contínuo)
ssh -N -f -D 1080 user@servidor.exemplo.com

# Com porta SSH não-padrão
ssh -N -f -D 1080 -p 2222 user@servidor.exemplo.com`} />

          <StepItem
            number={2}
            title="Configurar o Firefox para usar o proxy"
            description="Preferências → Geral → Configurações de Rede → Configurações → Proxy SOCKS manual."
          />
          <CodeBlock lang="bash" code={`# Opções:
# Host: localhost
# Porta: 1080
# Tipo: SOCKS v5
# ✅ Marcar "Proxy DNS via SOCKS5" (evita DNS leak)

# Verificar IP via curl com SOCKS5:
curl --socks5-hostname localhost:1080 https://ifconfig.me`} />

          <StepItem
            number={3}
            title="Usar com qualquer aplicação via proxychains"
            description="Instale proxychains-ng para rotear qualquer programa pelo SOCKS5."
          />
          <CodeBlock lang="bash" code={`# Instalar
sudo apt install proxychains-ng

# Editar /etc/proxychains.conf (última linha):
# socks5 127.0.0.1 1080

# Usar com qualquer comando:
proxychains curl https://ifconfig.me
proxychains git clone https://github.com/usuario/repo.git
proxychains nmap -sT -Pn alvo.interno`} />
        </div>
      </section>

      {/* Seção 2: Port Forwarding Local */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Terminal size={22} className="text-[color:var(--mod)]" />
          2. Port Forwarding Local (<code className="text-sm bg-bg-3 px-1 rounded">-L</code>)
        </h2>
        <p className="text-text-2">
          <strong>Cenário clássico:</strong> banco de dados PostgreSQL na porta 5432 do servidor, mas o firewall
          bloqueia acesso externo. Com <code>-L</code> você acessa como se fosse <code>localhost:5432</code>.
        </p>

        <InfoBox>
          <strong>Sintaxe:</strong> <code>ssh -L [bind:]porta_local:host_destino:porta_destino user@bastion</code><br />
          O <code>host_destino</code> é resolvido <em>pelo servidor SSH</em> — pode ser um host interno que você não alcança diretamente.
        </InfoBox>

        <CodeBlock lang="bash" code={`# Acessar PostgreSQL interno via localhost:5432
ssh -N -L 5432:db-interno.lan:5432 user@bastion.empresa.com

# Conectar normalmente — o SSH faz o redirecionamento transparente:
psql -h localhost -U app_user nome_do_banco

# Acessar painel web interno na porta 8080:
ssh -N -L 8080:painel.interno.lan:80 user@bastion.empresa.com
# Abrir http://localhost:8080 no browser

# Múltiplos forwards na mesma sessão:
ssh -N \
  -L 5432:postgres.lan:5432 \
  -L 6379:redis.lan:6379 \
  -L 8080:app.lan:80 \
  user@bastion.empresa.com`} />

        <div className="space-y-4">
          <StepItem
            number={1}
            title="Verificar o forward ativo"
            description="Liste as sessões SSH abertas e as portas que estão em escuta."
          />
          <CodeBlock lang="bash" code={`# Ver sessões SSH em background
ps aux | grep 'ssh -N'

# Ver portas escutando localmente
ss -tlnp | grep 5432

# Matar um forward específico
kill $(pgrep -f 'ssh -N -L 5432')`} />
        </div>
      </section>

      {/* Seção 3: Port Forwarding Remoto */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Wifi size={22} className="text-[color:var(--mod)]" />
          3. Port Forwarding Remoto (<code className="text-sm bg-bg-3 px-1 rounded">-R</code>)
        </h2>
        <p className="text-text-2">
          <strong>Cenário inverso:</strong> você está atrás de NAT/firewall e quer que um servidor público
          exponha sua aplicação local. Com <code>-R</code> o servidor remoto escuta em uma porta e
          redireciona para a sua máquina.
        </p>

        <CodeBlock lang="bash" code={`# Expor seu servidor local (porta 3000) via servidor público:
ssh -N -R 8080:localhost:3000 user@servidor-publico.com
# Agora http://servidor-publico.com:8080 → sua porta 3000

# Liberar o GatewayPorts no servidor remoto (sshd_config):
# GatewayPorts yes   # permite bind em 0.0.0.0, não só 127.0.0.1

# Caso de uso: webhook durante desenvolvimento
ssh -N -R 9000:localhost:3000 user@vps.exemplo.com
# GitHub envia webhook para vps.exemplo.com:9000 → sua máquina:3000`} />

        <WarnBox>
          <strong>Segurança:</strong> por padrão <code>-R</code> faz bind apenas em <code>127.0.0.1</code> do servidor
          remoto. Para expor publicamente é necessário <code>GatewayPorts yes</code> no <code>sshd_config</code> — habilite
          apenas se souber o que está fazendo.
        </WarnBox>
      </section>

      {/* Seção 4: Jump Host */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Shield size={22} className="text-[color:var(--mod)]" />
          4. Jump Host (<code className="text-sm bg-bg-3 px-1 rounded">-J</code> / ProxyJump)
        </h2>
        <p className="text-text-2">
          Em ambientes corporativos o acesso a hosts internos passa por um <strong>bastion host</strong> (jump server).
          O flag <code>-J</code> (ProxyJump) encadeia as conexões sem precisar abrir uma sessão interativa no bastion.
        </p>

        <div className="space-y-4">
          <StepItem
            number={1}
            title="Salto simples: bastion → host interno"
            description="Uma conexão direta ao host interno passando pelo bastion transparentemente."
          />
          <CodeBlock lang="bash" code={`# Sintaxe: ssh -J usuario@bastion usuario@host-interno
ssh -J deploy@bastion.empresa.com admin@192.168.10.50

# Com portas diferentes:
ssh -J deploy@bastion.empresa.com:2222 admin@192.168.10.50

# Copiar arquivo via SCP passando pelo bastion:
scp -J deploy@bastion.empresa.com arquivo.tar.gz admin@192.168.10.50:/tmp/`} />

          <StepItem
            number={2}
            title="Cadeia de saltos: bastion → DMZ → rede interna"
            description="Múltiplos saltos encadeados com vírgula."
          />
          <CodeBlock lang="bash" code={`# Dois saltos: bastion → dmz-host → destino final
ssh -J deploy@bastion.empresa.com,svc@dmz.lan admin@10.10.10.50

# Três saltos (infraestrutura segmentada):
ssh -J hop1.ext.com,hop2.dmz.lan,hop3.int.lan user@servidor-final`} />

          <StepItem
            number={3}
            title="Configurar ~/.ssh/config para simplificar"
            description="Defina uma vez, use sempre. O alias cuida de tudo automaticamente."
          />
          <CodeBlock lang="bash" code={`# ~/.ssh/config

# Bastion público
Host bastion
    HostName bastion.empresa.com
    User deploy
    IdentityFile ~/.ssh/id_ed25519
    Port 2222

# Host interno — salta automaticamente pelo bastion
Host db-prod
    HostName 192.168.10.50
    User admin
    ProxyJump bastion

# Uso simples depois de configurado:
ssh db-prod
scp arquivo.sql db-prod:/tmp/`} />
        </div>
      </section>

      {/* Seção 5: autossh — Túneis Persistentes */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-text flex items-center gap-2">
          <Lock size={22} className="text-[color:var(--mod)]" />
          5. autossh — Túneis Persistentes
        </h2>
        <p className="text-text-2">
          O SSH comum cai quando a conexão é interrompida. O <strong>autossh</strong> monitora a sessão
          e a reconecta automaticamente — essencial para túneis de produção.
        </p>

        <CodeBlock lang="bash" code={`# Instalar
sudo apt install autossh

# Túnel persistente SOCKS5 (reconecta automaticamente):
autossh -M 0 -N -f \
  -o "ServerAliveInterval 30" \
  -o "ServerAliveCountMax 3" \
  -D 1080 user@servidor.exemplo.com

# Túnel -L persistente:
autossh -M 0 -N -f \
  -o "ServerAliveInterval 30" \
  -o "ServerAliveCountMax 3" \
  -L 5432:db.lan:5432 user@bastion.empresa.com

# -M 0: desabilita porta de monitoramento (usa ServerAlive no lugar)
# -f: background
# ServerAliveInterval: envia keepalive a cada 30s`} />

        <div className="space-y-4">
          <StepItem
            number={1}
            title="Criar serviço systemd para o túnel"
            description="Assim o túnel sobe automaticamente no boot e é gerenciado pelo systemd."
          />
          <CodeBlock lang="bash" code={`# /etc/systemd/system/ssh-tunnel-db.service
[Unit]
Description=SSH Tunnel para banco de dados interno
After=network.target

[Service]
User=deploy
ExecStart=/usr/bin/autossh -M 0 -N \
  -o "ServerAliveInterval=30" \
  -o "ServerAliveCountMax=3" \
  -o "StrictHostKeyChecking=no" \
  -L 5432:db.lan:5432 \
  -i /home/deploy/.ssh/id_ed25519 \
  deploy@bastion.empresa.com
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`} />
          <CodeBlock lang="bash" code={`sudo systemctl daemon-reload
sudo systemctl enable --now ssh-tunnel-db
sudo systemctl status ssh-tunnel-db`} />
        </div>
      </section>

      {/* Seção 6: ~/.ssh/config completo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text">6. ~/.ssh/config — Produtividade Máxima</h2>
        <p className="text-text-2">
          Um <code>~/.ssh/config</code> bem organizado transforma comandos longos em aliases curtos.
          Configurações globais evitam repetição.
        </p>
        <CodeBlock lang="bash" code={`# ~/.ssh/config

# ──── Configurações Globais ─────────────────────────────────
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    Compression yes
    ControlMaster auto
    ControlPath ~/.ssh/sockets/%r@%h:%p
    ControlPersist 10m

# ──── Hosts de Produção ─────────────────────────────────────
Host bastion-prod
    HostName bastion.empresa.com
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_prod
    ForwardAgent no

Host db-prod
    HostName 10.10.1.20
    User postgres
    ProxyJump bastion-prod
    LocalForward 5432 localhost:5432

Host app-prod
    HostName 10.10.1.30
    User app
    ProxyJump bastion-prod

# ──── Ambiente de Desenvolvimento ───────────────────────────
Host dev
    HostName dev.exemplo.com
    User vagrant
    IdentityFile ~/.ssh/id_rsa_dev
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null

# ──── Proxy SOCKS para navegação segura ─────────────────────
Host proxy-socks
    HostName servidor.exemplo.com
    User user
    DynamicForward 1080
    RequestTTY no`} />

        <HighlightBox>
          <strong>ControlMaster + ControlPersist:</strong> reutiliza conexões SSH já abertas para o mesmo host.
          O segundo <code>ssh db-prod</code> é instantâneo — aproveita o socket da primeira conexão.
          Enorme ganho em automações e rsync frequentes.
        </HighlightBox>
      </section>

      {/* WindowsComparisonBox */}
      <WindowsComparisonBox
        windowsLabel="PuTTY / Windows"
        linuxLabel="OpenSSH / Linux"
        windowsCode={`# PuTTY: SSH Tunnels via GUI
# Connection → SSH → Tunnels
# Source port: 1080
# Destination: (vazio para SOCKS)
# ● Dynamic → Add

# PuTTY -L (Local):
# Source: 5432
# Destination: db.lan:5432
# ● Local → Add

# Plink (linha de comando PuTTY):
plink -N -D 1080 user@servidor.com
plink -N -L 5432:db.lan:5432 user@bastion.com

# Windows OpenSSH (PowerShell/cmd):
ssh -N -D 1080 user@servidor.com
# (idêntico ao Linux desde Windows 10 1803)`}
        linuxCode={`# OpenSSH nativo — mesmo binário em Linux/macOS

# SOCKS5 dinâmico:
ssh -N -f -D 1080 user@servidor.com

# Port forward local:
ssh -N -L 5432:db.lan:5432 user@bastion.com

# Jump Host:
ssh -J bastion.com user@host-interno

# Arquivo ~/.ssh/config:
# Host db-prod
#   ProxyJump bastion
#   LocalForward 5432 localhost:5432

# autossh (reconexão automática):
autossh -M 0 -N -f -D 1080 user@servidor.com`}
      />

      {/* Exercícios */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text">Exercícios Guiados</h2>
        <div className="space-y-4">
          {[
            {
              n: 1, title: 'Navegar anonimamente via SOCKS5',
              steps: [
                'Em uma máquina com acesso SSH a um servidor: ssh -N -f -D 1080 user@servidor',
                'Abrir Firefox → about:preferences → Configurações de Rede → Proxy SOCKS manual: localhost:1080',
                'Marcar "DNS via SOCKS5" e acessar https://ifconfig.me',
                'Verificar que o IP exibido é o do servidor, não o seu',
                'Confirmar: ps aux | grep ssh e kill o processo quando terminar',
              ]
            },
            {
              n: 2, title: 'Acessar banco de dados interno',
              steps: [
                'Configurar forward: ssh -N -L 15432:db.interno:5432 user@bastion',
                'Conectar: psql -h localhost -p 15432 -U app_user meu_banco',
                'O tráfego vai: localhost:15432 → bastion → db.interno:5432',
                'Verificar porta ativa: ss -tlnp | grep 15432',
              ]
            },
            {
              n: 3, title: 'Saltar pelo bastion sem VPN',
              steps: [
                'Criar ~/.ssh/config com Host bastion e Host host-interno ProxyJump bastion',
                'Conectar diretamente: ssh host-interno',
                'Verificar o caminho: ssh -v host-interno 2>&1 | grep -i "jump\\|via\\|proxy"',
                'Copiar arquivo: scp arquivo.tar.gz host-interno:/tmp/',
              ]
            },
          ].map(ex => (
            <div key={ex.n} className="rounded-xl border border-border bg-bg-2 p-5">
              <h3 className="font-semibold text-text mb-3">Exercício {ex.n}: {ex.title}</h3>
              <ol className="space-y-1 text-sm text-text-2 list-decimal list-inside">
                {ex.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-text">Checklist do Lab</h2>
        {items.map(item => (
          <ChecklistItem
            key={item.id}
            text={item.text}
            sub={item.sub}
            checked={!!checklist[item.id]}
            onToggle={() => updateChecklist(item.id, !checklist[item.id])}
          />
        ))}
      </section>

      {/* Erros comuns */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-text">Erros Comuns</h2>
        <div className="space-y-2">
          <ErrorModal title="channel 1: open failed: connect failed — Connection refused" icon={<AlertTriangle size={14} />}>
            <p>O host de destino (<code>db.lan</code>) não está acessível a partir do servidor SSH.</p>
            <p>Verifique: o serviço está rodando no destino? A porta está certa? O servidor SSH consegue fazer DNS para esse hostname?</p>
            <CodeBlock lang="bash" code={`# Testar a partir do servidor SSH (não da sua máquina):
ssh user@bastion "nc -zv db.lan 5432"
ssh user@bastion "ping -c 2 db.lan"`} />
          </ErrorModal>
          <ErrorModal title="bind: Address already in use — porta local ocupada" icon={<AlertTriangle size={14} />}>
            <p>Outra instância do mesmo forward ainda está ativa em background.</p>
            <CodeBlock lang="bash" code={`# Ver processos SSH em background:
ps aux | grep 'ssh -N'

# Ou ver quem está usando a porta:
ss -tlnp | grep 5432
lsof -i :5432

# Matar o processo antigo:
kill $(pgrep -f 'ssh -N -L 5432')`} />
          </ErrorModal>
          <ErrorModal title="AllowTcpForwarding no — servidor bloqueou o forwarding" icon={<AlertTriangle size={14} />}>
            <p>O <code>sshd_config</code> do servidor tem <code>AllowTcpForwarding no</code>.</p>
            <CodeBlock lang="bash" code={`# No servidor remoto (como root):
grep -i tcpforward /etc/ssh/sshd_config

# Editar para permitir:
sudo sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/' /etc/ssh/sshd_config
sudo systemctl reload sshd

# Para SOCKS5 (-D) também é necessário:
# AllowTcpForwarding yes (ou omitido — yes é o padrão)`} />
          </ErrorModal>
          <ErrorModal title="DNS leak — o SOCKS5 não anonimiza o DNS" icon={<AlertTriangle size={14} />}>
            <p>O browser resolve DNS localmente antes de usar o SOCKS, revelando os domínios que você visita.</p>
            <p>No Firefox: <em>about:config</em> → <code>network.proxy.socks_remote_dns</code> → <strong>true</strong>.</p>
            <p>No curl: usar <code>--socks5-hostname</code> (não <code>--socks5</code>) para enviar o DNS pelo túnel.</p>
            <CodeBlock lang="bash" code={`# ✅ Correto — DNS resolve no servidor remoto:
curl --socks5-hostname localhost:1080 https://ifconfig.me

# ❌ Errado — DNS resolve localmente:
curl --socks5 localhost:1080 https://ifconfig.me`} />
          </ErrorModal>
        </div>
      </section>

      {/* Navegação Rodapé */}
      <ModuleNav currentPath="/ssh-proxy" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
