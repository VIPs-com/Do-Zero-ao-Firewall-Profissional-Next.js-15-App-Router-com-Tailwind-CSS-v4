'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { Server, FileText, Radio, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

const CHECKLIST_ITEMS = [
  { id: 'rsyslog-configurado',  label: 'Configurei facilities e priorities no /etc/rsyslog.conf e reiniciei o serviço' },
  { id: 'log-remoto-enviado',   label: 'Enviei logs de uma máquina cliente para um servidor central via TCP 514' },
  { id: 'logrotate-configurado', label: 'Configurei logrotate para rotacionar e comprimir logs automaticamente' },
];

export default function RsyslogPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/rsyslog');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-rsyslog min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <Link href="/fundamentos" className="hover:text-accent transition-colors">Fundamentos</Link>
          <span>/</span>
          <span className="text-text-2">Logs Centralizados</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo F14 · Fundamentos Linux</div>
          <h1 className="text-4xl font-bold mb-4">📡 Logs Centralizados com Rsyslog</h1>
          <p className="text-text-2 text-lg mb-6">
            rsyslog · facilities · priorities · servidor central · logrotate — logs de produção do jeito certo
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do Log Local ao Servidor Central"
          steps={[
            { label: 'rsyslog.conf',     sub: 'define facilities, priorities e destinos',        icon: <FileText size={14}/>,   color: 'border-accent/50' },
            { label: 'facility.priority', sub: 'ex: auth.warning → /var/log/auth.log',           icon: <Radio size={14}/>,      color: 'border-info/50' },
            { label: 'Arquivo local',    sub: 'log gravado em /var/log no próprio servidor',      icon: <FileText size={14}/>,   color: 'border-ok/50' },
            { label: 'Servidor remoto',  sub: '@@servidor:514 — encaminha via TCP para central',  icon: <Server size={14}/>,     color: 'border-warn/50' },
            { label: 'logrotate',        sub: 'rotaciona, comprime e expira logs antigos',        icon: <RotateCcw size={14}/>,  color: 'border-layer-3/50' },
          ]}
        />

        {/* 1. rsyslog vs journald */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. rsyslog vs journald — Quando Usar Cada Um</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-bg-2 border border-border rounded-lg p-5">
              <div className="text-2xl mb-2">📓</div>
              <h3 className="font-bold text-info mb-2">journald (systemd)</h3>
              <ul className="text-sm text-text-2 space-y-1">
                <li>• Logs binários em <code>/run/log/journal</code></li>
                <li>• Integrado ao systemd desde o boot</li>
                <li>• Busca poderosa com <code>journalctl</code></li>
                <li>• <strong>Não persiste por padrão</strong> (apenas RAM)</li>
                <li>• Ideal para: debug local e troubleshooting</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-border rounded-lg p-5">
              <div className="text-2xl mb-2">📡</div>
              <h3 className="font-bold text-accent mb-2">rsyslog</h3>
              <ul className="text-sm text-text-2 space-y-1">
                <li>• Logs texto em <code>/var/log/</code></li>
                <li>• Encaminha para servidores remotos</li>
                <li>• Filtros avançados por programa/facility</li>
                <li>• <strong>Persiste em disco</strong> por padrão</li>
                <li>• Ideal para: produção, compliance, SIEM</li>
              </ul>
            </div>
          </div>

          <InfoBox title="Por que centralizar logs é obrigatório em produção">
            <p className="text-sm text-text-2 mb-2">
              <strong>Compliance:</strong> normas como PCI-DSS, ISO 27001 e LGPD exigem retenção de logs por meses ou anos.
              Logs locais são perdidos se o servidor for comprometido ou formatado.
            </p>
            <p className="text-sm text-text-2 mb-2">
              <strong>Forense:</strong> após um incidente, um atacante pode apagar <code>/var/log/*</code> no servidor comprometido.
              Logs já enviados ao servidor central ficam intactos.
            </p>
            <p className="text-sm text-text-2">
              <strong>Correlação:</strong> um servidor SIEM (como Graylog ou Elasticsearch) ingere logs de dezenas de máquinas
              e correlaciona eventos — impossível com logs espalhados em cada servidor.
            </p>
          </InfoBox>
        </section>

        {/* 2. Facilities e Priorities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Facilities e Priorities — A Gramática do rsyslog</h2>

          <p className="text-text-2 mb-4">
            Cada mensagem de log tem dois atributos: <strong>facility</strong> (quem gerou) e <strong>priority</strong> (quão grave é).
            O rsyslog usa isso para rotear mensagens para diferentes destinos.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-3 text-info">Facilities Principais</h3>
              <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-bg-3">
                    <th className="text-left p-3">Facility</th>
                    <th className="text-left p-3">O que gera</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ['kern',   'Kernel Linux'],
                      ['auth',   'SSH, sudo, login'],
                      ['daemon', 'Serviços do sistema'],
                      ['mail',   'Postfix, Exim'],
                      ['user',   'Processos de usuário'],
                      ['local0-7', 'Reservado — configure você'],
                    ].map(([f, d]) => (
                      <tr key={f} className="border-b border-border/50">
                        <td className="p-3 font-mono text-accent">{f}</td>
                        <td className="p-3 text-text-2">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-warn">Priorities (do mais grave ao mais leve)</h3>
              <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-bg-3">
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Quando usar</th>
                  </tr></thead>
                  <tbody>
                    {[
                      ['emerg',   'Sistema inutilizável'],
                      ['alert',   'Ação imediata necessária'],
                      ['crit',    'Condição crítica'],
                      ['err',     'Erro de serviço'],
                      ['warning', 'Aviso — monitorar'],
                      ['notice',  'Normal mas significativo'],
                      ['info',    'Informação de rotina'],
                      ['debug',   'Depuração — muito verbose'],
                    ].map(([p, d]) => (
                      <tr key={p} className="border-b border-border/50">
                        <td className="p-3 font-mono text-warn">{p}</td>
                        <td className="p-3 text-text-2">{d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <h3 className="font-semibold mb-3">Sintaxe de Regras</h3>
          <CodeBlock lang="bash" code={`# Formato: facility.priority  destino
# Regra lê: "auth.warning ou mais grave → /var/log/auth.log"

# auth.warning inclui: warning, err, crit, alert, emerg
auth.warning                         /var/log/auth.log

# * = qualquer facility/priority
*.info                               /var/log/syslog
*.emerg                              :omusrmsg:*    # envia para todos os terminais

# Separar múltiplas facilities com vírgula:
auth,authpriv.*                      /var/log/auth.log

# Excluir uma facility com none:
*.info;mail.none;authpriv.none       /var/log/messages

# Filtro por programa (rsyslog property-based filter):
if $programname == 'nginx' then      /var/log/nginx/rsyslog.log`} />
        </section>

        {/* 3. Configuração Local */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Configuração Local — /etc/rsyslog.conf</h2>

          <CodeBlock lang="bash" code={`# Instalação (geralmente já está instalado)
sudo apt install rsyslog

# Verificar status
sudo systemctl status rsyslog

# Estrutura do arquivo principal:
sudo nano /etc/rsyslog.conf`} />

          <CodeBlock lang="bash" code={`# /etc/rsyslog.conf — seções principais

# ── Módulos ──────────────────────────────────────────
module(load="imuxsock")   # logs via socket Unix (programas locais)
module(load="imklog")     # logs do kernel

# ── Regras de Roteamento ─────────────────────────────
auth,authpriv.*           /var/log/auth.log
*.*;auth,authpriv.none    /var/log/syslog
kern.*                    /var/log/kern.log
mail.*                    /var/log/mail.log
daemon.*                  /var/log/daemon.log

# ── Inclusão de regras extras ─────────────────────────
$IncludeConfig /etc/rsyslog.d/*.conf`} />

          <CodeBlock lang="bash" code={`# Criar arquivo de regra customizada para nginx
sudo nano /etc/rsyslog.d/nginx.conf`} />

          <CodeBlock lang="bash" code={`# /etc/rsyslog.d/nginx.conf
if $programname == 'nginx' then {
    /var/log/nginx/nginx-rsyslog.log
    stop   # não processar nas regras seguintes
}`} />

          <CodeBlock lang="bash" code={`# Testar sintaxe e reiniciar
sudo rsyslogd -N1          # valida configuração
sudo systemctl restart rsyslog

# Verificar se está recebendo logs
sudo tail -f /var/log/syslog
sudo logger "Teste rsyslog $(date)"  # envia mensagem de teste`} />
        </section>

        {/* 4. Servidor Central */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Servidor Central de Logs</h2>

          <p className="text-text-2 mb-4">
            Uma máquina dedicada recebe logs de todas as outras via TCP/UDP porta 514.
            Requer configuração no servidor (receber) e no cliente (enviar).
          </p>

          <h3 className="font-semibold mb-3 text-info">4.1 Configurar o Servidor (quem recebe)</h3>
          <CodeBlock lang="bash" code={`# /etc/rsyslog.conf no SERVIDOR CENTRAL

# ── Habilitar módulos de recepção TCP e UDP ───────────
module(load="imtcp")
input(type="imtcp" port="514")

module(load="imudp")
input(type="imudp" port="514")

# ── Template: separar logs por IP de origem ───────────
$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"
*.* ?RemoteLogs

# Salvar e reiniciar
sudo systemctl restart rsyslog`} />

          <WarnBox title="Firewall: abrir porta 514 apenas para IPs internos">
            <CodeBlock lang="bash" code={`# Abrir TCP e UDP 514 apenas para a rede interna (ex: 192.168.1.0/24)
sudo iptables -A INPUT -p tcp --dport 514 -s 192.168.1.0/24 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 514 -s 192.168.1.0/24 -j ACCEPT

# Bloquear de qualquer outra origem:
sudo iptables -A INPUT -p tcp --dport 514 -j DROP
sudo iptables -A INPUT -p udp --dport 514 -j DROP`} />
          </WarnBox>

          <h3 className="font-semibold mb-3 mt-6 text-info">4.2 Configurar o Cliente (quem envia)</h3>
          <CodeBlock lang="bash" code={`# /etc/rsyslog.d/remote.conf no CLIENTE

# @@ = TCP (confiável, recomendado para produção)
# @  = UDP (mais rápido, sem garantia de entrega)

# Enviar TUDO para o servidor central via TCP:
*.* @@192.168.1.100:514

# Ou enviar apenas auth e daemon (seletivo):
auth,daemon.* @@192.168.1.100:514

# Salvar e reiniciar
sudo systemctl restart rsyslog`} />

          <CodeBlock lang="bash" code={`# No SERVIDOR CENTRAL — verificar chegada dos logs
sudo ls /var/log/remote/
# cliente01/  cliente02/  web-server/

sudo tail -f /var/log/remote/cliente01/sshd.log
# Apr 25 10:31:14 cliente01 sshd: Accepted publickey for admin...

# Contar logs chegando:
sudo watch -n 2 'ls -la /var/log/remote/*/*.log | wc -l'`} />
        </section>

        {/* 5. Logrotate */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. logrotate — Rotação e Compressão de Logs</h2>

          <p className="text-text-2 mb-4">
            Sem logrotate, <code>/var/log/syslog</code> cresceria indefinidamente até encher o disco.
            O logrotate renomeia, comprime e expira logs automaticamente.
          </p>

          <CodeBlock lang="bash" code={`# Ver configuração padrão (rodada via cron diariamente):
cat /etc/logrotate.conf

# Regras específicas por serviço ficam em:
ls /etc/logrotate.d/
# apache2  apt  dpkg  nginx  rsyslog  syslog  ...`} />

          <CodeBlock lang="bash" code={`# /etc/logrotate.d/meu-app — exemplo completo
/var/log/meu-app/*.log {
    daily           # rotar diariamente
    missingok       # não errar se arquivo não existir
    rotate 30       # manter 30 rotações (30 dias)
    compress        # comprimir com gzip (cria .gz)
    delaycompress   # comprimir apenas a rotação anterior (não a atual)
    notifempty      # não rotar se o arquivo estiver vazio
    create 640 www-data adm  # permissões do novo arquivo
    postrotate
        # reiniciar serviço para ele abrir o novo arquivo:
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}`} />

          <CodeBlock lang="bash" code={`# Testar configuração sem executar:
sudo logrotate --debug /etc/logrotate.d/meu-app

# Forçar rotação agora (para testar):
sudo logrotate --force /etc/logrotate.d/meu-app

# Ver resultado:
ls -lh /var/log/meu-app/
# app.log          (novo, vazio)
# app.log.1        (ontem, sem compressão — delaycompress)
# app.log.2.gz     (anteontem, comprimido)
# app.log.30.gz    (30 dias atrás — será deletado na próxima rotação)`} />

          <WindowsComparisonBox
            windowsLabel="Windows"
            linuxLabel="Linux"
            windowsCode={`# Event Viewer (Visualizador de Eventos)
# GUI: Win + R → eventvwr.msc
# Fontes: Application, System, Security

# Encaminhar para servidor:
# Subscription (Inscrições) → Windows
# Event Forwarding via WinRM

# Retenção: botão direito no log
# → Properties → Maximum log size
# → Overwrite events as needed

# Agente SIEM: instalar manualmente
# Winlogbeat, Splunk Universal Forwarder`}
            linuxCode={`# rsyslog + journald (nativo)
# Arquivo: /etc/rsyslog.conf
# Facilities: auth, kern, daemon, mail

# Encaminhar para servidor:
# *.* @@servidor:514
# (1 linha no rsyslog.conf)

# Retenção: logrotate
# rotate 90 → guarda 90 arquivos
# compress → economiza 90% de espaço

# Agente SIEM: rsyslog native
# já envia direto para Graylog, ELK`}
          />
        </section>

        {/* 6. Filtros Avançados */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Filtros Avançados e Casos Reais</h2>

          <CodeBlock lang="bash" code={`# Filtrar por conteúdo da mensagem (property-based filter):
if $msg contains 'Failed password' then /var/log/ssh-falhas.log

# Múltiplos programas em um arquivo consolidado:
if $programname == 'nginx' or $programname == 'apache2' then {
    /var/log/webservers.log
}

# Encaminhar apenas logs críticos para servidor remoto:
*.crit @@servidor-alertas:514

# Descartar logs irrelevantes (descarta ao invés de gravar):
if $programname == 'cron' and $syslogseverity > 5 then stop`} />

          <InfoBox title="Integração com SIEM — Graylog e Elasticsearch">
            <p className="text-sm text-text-2 mb-2">
              Em infraestruturas maiores, o rsyslog envia logs para um SIEM que indexa, correlaciona e gera alertas:
            </p>
            <CodeBlock lang="bash" code={`# Enviar para Graylog (GELF via TCP):
module(load="omfwd")
*.* action(type="omfwd"
    target="graylog.empresa.local"
    port="12201"
    protocol="tcp"
    template="RSYSLOG_SyslogProtocol23Format")`} />
          </InfoBox>
        </section>

        {/* Exercícios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧪 Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 1 — Configurar Facilities e Prioridades Locais</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Edite <code>/etc/rsyslog.d/lab.conf</code> e adicione: <code>auth.warning /var/log/lab-auth.log</code></li>
                <li>Valide com <code>sudo rsyslogd -N1</code> e reinicie: <code>sudo systemctl restart rsyslog</code></li>
                <li>Gere um evento de auth: <code>sudo su nobody -s /bin/bash -c exit</code></li>
                <li>Confirme: <code>sudo tail /var/log/lab-auth.log</code></li>
                <li>Envie mensagem manual: <code>sudo logger -p auth.warning &quot;Teste Lab rsyslog&quot;</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 2 — Servidor Central de Logs (Lab com 2 VMs)</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>No <strong>Servidor</strong>: habilite <code>imtcp port=&quot;514&quot;</code> no rsyslog.conf</li>
                <li>No <strong>Servidor</strong>: adicione o template <code>RemoteLogs</code> e reinicie rsyslog</li>
                <li>No <strong>Servidor</strong>: abra a porta: <code>sudo iptables -A INPUT -p tcp --dport 514 -j ACCEPT</code></li>
                <li>No <strong>Cliente</strong>: adicione <code>*.* @@IP-servidor:514</code> no rsyslog.d/remote.conf</li>
                <li>No <strong>Cliente</strong>: reinicie rsyslog e envie: <code>sudo logger &quot;Ola do cliente&quot;</code></li>
                <li>No <strong>Servidor</strong>: verifique em <code>/var/log/remote/</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 3 — Configurar logrotate</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Crie <code>/var/log/meu-app/app.log</code> com conteúdo de teste</li>
                <li>Crie <code>/etc/logrotate.d/meu-app</code> com rotate 7, compress, daily</li>
                <li>Teste: <code>sudo logrotate --debug /etc/logrotate.d/meu-app</code></li>
                <li>Force rotação: <code>sudo logrotate --force /etc/logrotate.d/meu-app</code></li>
                <li>Verifique: <code>ls -lh /var/log/meu-app/</code> — novo arquivo + .1 criado</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">✅ Checklist do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <div className="flex items-start gap-2">
                  {checklist[item.id]
                    ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" />
                    : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
                  <span className="text-sm text-text-2">{item.label}</span>
                </div>
              </label>
            ))}
          </div>
          {CHECKLIST_ITEMS.every(i => checklist[i.id]) && (
            <div className="mt-4 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <span className="text-ok font-bold">🏅 Badge rsyslog-master desbloqueado!</span>
              <p className="text-sm text-text-2 mt-1">Você domina logs centralizados — padrão de produção real.</p>
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
              err: 'rsyslog não recebe logs remotos na porta 514 — imtcp/imudp ativo mas sem dados',
              fix: 'Verificar firewall no servidor de logs: iptables -L INPUT | grep 514. Abrir: iptables -A INPUT -p tcp --dport 514 -s 192.168.0.0/24 -j ACCEPT. Testar envio manual: logger --server IP -P 514 "teste". Confirmar com: tcpdump -i eth0 port 514.',
            },
            {
              err: 'Logs remotos chegam mas sem hostname — aparecem como IP',
              fix: 'O template de log não usa $HOSTNAME. Verificar o template em rsyslog.conf: deve ter %HOSTNAME% no padrão. Alternativa: configurar DNS reverso para os IPs dos clientes. Garantir que os clientes enviam hostname no cabeçalho syslog.',
            },
            {
              err: 'logrotate não rotaciona os logs — arquivo cresce indefinidamente',
              fix: 'Verificar configuração: logrotate -d /etc/logrotate.d/syslog (modo dry-run). O usuário que roda logrotate deve ter permissão de escrita. Executar manualmente: logrotate -f /etc/logrotate.conf. Verificar lastrun: cat /var/lib/logrotate/status.',
            },
            {
              err: 'rsyslog para de receber após alguns dias — buffer cheio ou conexão perdida',
              fix: 'Em modo TCP ($ActionQueueType LinkedList), o buffer pode encher se o servidor ficar offline. Configurar reenvio: $ActionResumeRetryCount -1 (infinito) e $ActionQueueSaveOnShutdown on. Para UDP: adicionar fallback local com & ~/. no final da regra de encaminhamento.',
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
              <p className="font-bold text-sm mb-2">Lab 1 — Configurar rsyslog Local por Facility</p>
              <CodeBlock lang="bash" code={`# Ver configuração atual
cat /etc/rsyslog.conf | grep -v "^#\|^$" | head -30

# Criar regra para separar logs de auth
cat > /etc/rsyslog.d/10-auth-separado.conf << 'EOF'
# Enviar auth para arquivo dedicado
auth,authpriv.*  /var/log/auth-separado.log

# Logs de kernel para arquivo próprio
kern.*           /var/log/kernel.log

# Ignorar mensagens de info do cron
cron.info        ~
EOF

# Reiniciar rsyslog
systemctl restart rsyslog

# Gerar entrada de teste
logger -p auth.info "Teste rsyslog auth - usuário fez login"
logger -p kern.warning "Teste rsyslog kernel warning"

# Verificar se chegou nos arquivos corretos
cat /var/log/auth-separado.log | tail -3
cat /var/log/kernel.log | tail -3`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Servidor Central de Logs</p>
              <CodeBlock lang="bash" code={`# Habilitar rsyslog para receber logs na porta 514 TCP
cat > /etc/rsyslog.d/01-servidor-central.conf << 'EOF'
# Carregar módulo TCP
module(load="imtcp")
input(type="imtcp" port="514")

# Salvar logs remotos separados por hostname
template(name="RemoteLogs" type="string"
  string="/var/log/hosts/%HOSTNAME%/%PROGRAMNAME%.log")

# Aplicar template para logs remotos
if $FROMHOST != "localhost" then {
  action(type="omfile" DynaFile="RemoteLogs")
  stop
}
EOF

systemctl restart rsyslog

# Criar diretório para logs remotos
mkdir -p /var/log/hosts

# Testar enviando log para si mesmo
logger --server 127.0.0.1 --port 514 --tcp "Teste de log remoto"

# Ver se chegou
find /var/log/hosts -type f | head -5`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Configurar logrotate para Gestão de Logs</p>
              <CodeBlock lang="bash" code={`# Ver configuração padrão do logrotate
cat /etc/logrotate.conf

# Criar configuração de rotação para logs customizados
cat > /etc/logrotate.d/meus-logs << 'EOF'
/var/log/auth-separado.log
/var/log/kernel.log
/var/log/hosts/*/*.log
{
    rotate 14           # manter 14 arquivos
    daily               # rotacionar diariamente
    compress            # comprimir com gzip
    delaycompress       # comprimir rotação anterior (não a atual)
    missingok           # não falhar se o arquivo não existir
    notifempty          # não rotacionar arquivo vazio
    create 640 syslog adm  # permissões do novo arquivo
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
EOF

# Testar sem executar
logrotate -d /etc/logrotate.d/meus-logs

# Forçar rotação para testar
logrotate -f /etc/logrotate.d/meus-logs
ls -la /var/log/auth-separado.log* 2>/dev/null`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/rsyslog" order={FUNDAMENTOS_ORDER} />
      </div>
    </main>
  );
}
