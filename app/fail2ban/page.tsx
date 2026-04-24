'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Eye, FileText, Ban, ArrowRight, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

const F2B_CHECKLIST = [
  { id: 'f2b-install', text: 'Fail2ban instalado e serviço ativo' },
  { id: 'f2b-sshd',    text: 'Jail [sshd] habilitado e configurado' },
  { id: 'f2b-ban-test', text: 'Ban testado e IP aparece em fail2ban-client status' },
];

const INSTALL_CODE = `# Instalar Fail2ban (Debian/Ubuntu)
apt install fail2ban -y

# Verificar se o serviço está rodando
systemctl status fail2ban

# Habilitar na inicialização
systemctl enable fail2ban

# Ver versão
fail2ban-client --version`;

const JAIL_LOCAL = `# /etc/fail2ban/jail.local — NUNCA edite jail.conf diretamente
# jail.local sobrescreve apenas as chaves que você define

[DEFAULT]
# Tempo de ban em segundos (10 minutos)
bantime  = 600

# Janela de observação (10 minutos)
findtime = 600

# Máximo de tentativas antes do ban
maxretry = 5

# Ação padrão: ban via iptables + envio de e-mail (opcional)
banaction = iptables-multiport

# Endereços que NUNCA serão banidos
ignoreip = 127.0.0.1/8 ::1 10.0.0.0/24

[sshd]
enabled  = true
port     = ssh
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600`;

const NGINX_JAIL = `# /etc/fail2ban/jail.local — adicionar ao final

[nginx-http-auth]
enabled  = true
port     = http,https
filter   = nginx-http-auth
logpath  = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled  = true
port     = http,https
filter   = nginx-limit-req
logpath  = /var/log/nginx/error.log
maxretry = 10
bantime  = 600`;

const FILTER_CUSTOM = `# /etc/fail2ban/filter.d/nginx-bad-request.conf
# Filtro customizado para bloquear bots com User-Agent suspeito

[Definition]
failregex = ^<HOST> .* "(GET|POST) .* HTTP/.*" 400
ignoreregex =`;

const CLIENT_CMDS = `# Ver todas as jails ativas
fail2ban-client status

# Ver detalhes de uma jail específica
fail2ban-client status sshd

# Banir um IP manualmente
fail2ban-client set sshd banip 192.168.1.100

# Desbanir um IP
fail2ban-client set sshd unbanip 192.168.1.100

# Recarregar configuração (após editar jail.local)
fail2ban-client reload`;

const IPTABLES_CHECK = `# Ver as regras criadas pelo Fail2ban
iptables -L f2b-sshd -n -v --line-numbers

# Exemplo de saída:
# Chain f2b-sshd (1 references)
# num   target     prot  source           destination
# 1     REJECT     all   192.168.1.100    0.0.0.0/0    reject-with icmp-port-unreachable
# 2     RETURN     all   0.0.0.0/0        0.0.0.0/0`;

const LOG_CHECK = `# Acompanhar bans em tempo real
tail -f /var/log/fail2ban.log

# Filtrar apenas bans e unbans
grep -E "Ban|Unban" /var/log/fail2ban.log

# Contar bans por IP (top 10 atacantes)
grep "Ban" /var/log/fail2ban.log | \\
  awk '{print $NF}' | sort | uniq -c | sort -rn | head -10`;

export default function Fail2banPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/fail2ban');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-fail2ban">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Fail2ban</span>
      </div>

      <div className="section-label">Tópico 26 · Camada 7</div>
      <h1 className="section-title">🚫 Fail2ban — Proteção contra Brute Force</h1>
      <p className="section-sub">
        <strong>Fail2ban</strong> monitora logs de serviços (SSH, Nginx, etc.) e bane
        automaticamente IPs que excedem o limite de tentativas falhas. É a primeira linha de
        defesa contra ataques de força bruta em qualquer servidor Linux.
      </p>

      <FluxoCard
        title="Fluxo: como o Fail2ban bane um atacante"
        steps={[
          { label: 'tail -f auth.log', sub: 'monitora logs via inotify em tempo real', icon: <Eye size={14}/>, color: 'border-info/50' },
          { label: 'failregex match', sub: 'regex captura IP do atacante', icon: <FileText size={14}/>, color: 'border-[var(--mod)]/50' },
          { label: 'maxretry atingido', sub: 'N falhas dentro do findtime', icon: <AlertTriangle size={14}/>, color: 'border-warn/50' },
          { label: 'iptables REJECT', sub: 'ação executada automaticamente', icon: <Shield size={14}/>, color: 'border-err/50' },
          { label: 'auto-unban', sub: 'ban expirado após bantime segundos', icon: <Ban size={14}/>, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">

          {/* Section 1: Como funciona */}
          <section id="como-funciona">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Como o Fail2ban Funciona</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { step: '1', title: 'Monitora Logs', desc: 'Lê /var/log/auth.log, nginx/error.log, etc. em tempo real via inotify.' },
                { step: '2', title: 'Aplica Filtro', desc: 'Compara cada linha com um regex (failregex). Extrai o IP do atacante.' },
                { step: '3', title: 'Executa Ação', desc: 'Após maxretry falhas em findtime, cria regra iptables para bloquear o IP.' },
              ].map(item => (
                <div key={item.step} className="p-5 rounded-xl bg-bg-2 border border-border">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-black text-sm flex items-center justify-center mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <InfoBox title="Jail = Log + Filtro + Ação">
              <p className="text-sm text-text-2">
                Uma <strong>jail</strong> é a unidade de configuração do Fail2ban. Cada jail
                combina: um arquivo de log (<code>logpath</code>), um filtro regex
                (<code>filter</code>) e uma ação de ban (<code>banaction</code>).
                O Fail2ban vem com dezenas de jails prontas para SSH, Nginx, Apache, Postfix e mais.
              </p>
            </InfoBox>
          </section>

          {/* Section 2: Instalação e jail.local */}
          <section id="instalacao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Instalação e Configuração Base</h2>
            </div>

            <WindowsComparisonBox
              windowsLabel="Windows (Account Lockout Policy via GPO)"
              linuxLabel="Linux (fail2ban)"
              windowsCode={`# Via Group Policy (gpedit.msc):
# Computer Config → Windows Settings →
# Security Settings → Account Policies →
# Account Lockout Policy:
#   Threshold: 5 tentativas
#   Duration: 30 min
#   Reset counter: 30 min
# (só funciona para contas Windows locais)`}
              linuxCode={`apt install fail2ban
nano /etc/fail2ban/jail.local
# [sshd]
# enabled = true
# maxretry = 3
# bantime = 3600
# findtime = 600
systemctl enable --now fail2ban
fail2ban-client status sshd`}
            />
            <div className="mt-6">
              <CodeBlock lang="bash" title="Instalar e ativar" code={INSTALL_CODE} />
            </div>

            <div className="mt-6">
              <CodeBlock lang="ini" title="/etc/fail2ban/jail.local (SSH + defaults)" code={JAIL_LOCAL} />
            </div>

            <div className="mt-6">
              <WarnBox title="Nunca edite jail.conf">
                <p className="text-sm text-text-2">
                  O arquivo <code>jail.conf</code> é sobrescrito a cada atualização do pacote.
                  Crie um <code>jail.local</code> que herda os defaults e sobrescreve apenas
                  o que você precisa. O Fail2ban lê <code>.local</code> depois de <code>.conf</code>.
                </p>
              </WarnBox>
            </div>

            <div className="mt-6">
              <HighlightBox title="ignoreip — proteja-se">
                <p className="text-sm text-text-2">
                  Sempre inclua seu IP/rede em <code>ignoreip</code>. Se você errar a senha
                  do SSH 3 vezes, o Fail2ban vai banir <em>você</em>. Em um servidor remoto sem
                  console de emergência, isso significa ficar trancado do lado de fora.
                </p>
              </HighlightBox>
            </div>
          </section>

          {/* Section 3: Jails para Nginx */}
          <section id="nginx">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <FileText size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Jails para Nginx</h2>
            </div>

            <p className="text-text-2 mb-6">
              Além do SSH, proteja o Nginx contra tentativas de login HTTP e abusos de rate limit.
              O Fail2ban já inclui filtros prontos para esses cenários.
            </p>

            <CodeBlock lang="ini" title="Jails Nginx em jail.local" code={NGINX_JAIL} />

            <div className="mt-6">
              <CodeBlock lang="ini" title="Filtro customizado (exemplo)" code={FILTER_CUSTOM} />
            </div>

            <div className="mt-6">
              <InfoBox title="Criando filtros próprios">
                <p className="text-sm text-text-2">
                  Filtros ficam em <code>/etc/fail2ban/filter.d/</code>. A diretiva <code>failregex</code>
                  {' '}usa regex Python com o placeholder <code>&lt;HOST&gt;</code> para capturar o IP
                  do atacante. Teste com: <code>fail2ban-regex /var/log/nginx/error.log /etc/fail2ban/filter.d/nginx-bad-request.conf</code>
                </p>
              </InfoBox>
            </div>
          </section>

          {/* Section 4: Comandos e monitoramento */}
          <section id="monitoramento">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Ban size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Comandos e Monitoramento</h2>
            </div>

            <CodeBlock lang="bash" title="fail2ban-client — gestão de jails" code={CLIENT_CMDS} />

            <div className="mt-6">
              <CodeBlock lang="bash" title="Verificar regras iptables do Fail2ban" code={IPTABLES_CHECK} />
            </div>

            <div className="mt-6">
              <CodeBlock lang="bash" title="Analisar logs de ban" code={LOG_CHECK} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[
                {
                  title: 'bantime.increment',
                  desc: 'Ativa ban progressivo — IPs reincidentes recebem bans cada vez mais longos. Configurável em jail.local com bantime.increment = true.',
                },
                {
                  title: 'Ban persistente',
                  desc: 'Com bantime = -1, o IP é banido permanentemente. Use com cuidado — combine com ignoreip e revise periodicamente.',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-bg-2 border border-border">
                  <h3 className="font-bold text-sm mb-2 text-accent">{item.title}</h3>
                  <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Erros Comuns */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">5. Erros Comuns</h2>
            </div>

            <WarnBox title="⚠️ Problemas frequentes com Fail2ban">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>fail2ban-server não inicia após editar jail.local</strong> → erro de sintaxe na configuração
                  → testar com: <code className="text-xs">fail2ban-client -t</code> e verificar saída
                </li>
                <li>
                  <strong>IP banido mas ainda consegue conectar</strong> → banaction não está usando iptables corretamente
                  → verificar com <code className="text-xs">fail2ban-client status sshd</code> e <code className="text-xs">iptables -L f2b-sshd -n -v</code>
                </li>
                <li>
                  <strong>SSH ban não funciona mas não há erros</strong> → logpath errado — journald vs arquivo
                  → em sistemas com journald: <code className="text-xs">backend = systemd</code> em vez de <code className="text-xs">backend = auto</code>
                </li>
                <li>
                  <strong>Baniu o próprio IP de gerência</strong> → ignoreip não configurado
                  → adicionar em [DEFAULT]: <code className="text-xs">ignoreip = 127.0.0.1/8 192.168.57.0/24</code> e <code className="text-xs">fail2ban-client set sshd unbanip SEU-IP</code>
                </li>
              </ul>
            </WarnBox>
          </section>

          {/* Section 6: Exercícios Guiados */}
          <section id="exercicios">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--mod)]/10 flex items-center justify-center text-[var(--mod)]">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">6. Exercícios Guiados</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">1</span>
                  Configurar, testar e verificar jail SSH
                </h3>
                <p className="text-sm text-text-2">Configure a jail do SSH, simule falhas de autenticação e confirme o ban via iptables.</p>
                <CodeBlock lang="bash" title="Exercício 1 — jail SSH completa" code={`# Criar/editar jail.local
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 300
findtime = 60
maxretry = 3
ignoreip = 127.0.0.1/8 10.0.0.0/8

[sshd]
enabled = true
port    = ssh
EOF

# Reiniciar Fail2ban
systemctl restart fail2ban

# Verificar que a jail está ativa
fail2ban-client status sshd

# Simular falhas (em outro terminal, tente SSH com senha errada 3x)
# ssh usuario_inexistente@localhost  # 3 vezes

# Ver o ban
fail2ban-client status sshd
# Banned IP list: 127.0.0.1

# Ver regra iptables criada
iptables -L f2b-sshd -n -v

# Desbanir para limpar
fail2ban-client set sshd unbanip 127.0.0.1`} />
              </div>

              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">2</span>
                  Testar filtro customizado antes de ativar
                </h3>
                <p className="text-sm text-text-2">Use <code className="font-mono">fail2ban-regex</code> para validar o regex do filtro contra o log real antes de ativar a jail.</p>
                <CodeBlock lang="bash" title="Exercício 2 — testar filtro" code={`# Criar filtro para login HTTP básico
cat > /etc/fail2ban/filter.d/nginx-auth.conf << 'EOF'
[Definition]
failregex = ^<HOST> .* "GET .* HTTP/.*" 401
ignoreregex =
EOF

# Testar o filtro contra o log do Nginx (sem precisar ativar a jail)
fail2ban-regex /var/log/nginx/access.log /etc/fail2ban/filter.d/nginx-auth.conf

# Saída esperada mostra linhas que casaram com o failregex:
# Lines: X matched, Y missed, Z ignored

# Se nenhuma linha casou, ajustar o failregex e testar novamente
# Dica: ver uma linha real do log para ajustar o regex
tail -5 /var/log/nginx/access.log`} />
              </div>

              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">3</span>
                  Analisar top atacantes nos logs
                </h3>
                <p className="text-sm text-text-2">Extraia os IPs mais agressivos dos logs do Fail2ban e do auth.log para entender o perfil dos atacantes.</p>
                <CodeBlock lang="bash" title="Exercício 3 — análise de logs" code={`# Top 10 IPs mais banidos hoje
grep "Ban " /var/log/fail2ban.log | \\
  grep "$(date +%Y-%m-%d)" | \\
  awk '{print $NF}' | \\
  sort | uniq -c | sort -rn | head -10

# Quantos bans ocorreram por jail
grep "Ban " /var/log/fail2ban.log | \\
  awk '{print $6}' | \\
  sort | uniq -c | sort -rn

# Ver tentativas de login SSH com usuário inválido
grep "Invalid user" /var/log/auth.log | \\
  awk '{print $8, $10}' | \\
  sort | uniq -c | sort -rn | head -20

# Estatísticas de bans ativos agora
fail2ban-client status | grep "Jail list" | \\
  tr ',' '\\n' | xargs -I{} fail2ban-client status {}`} />
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Checklist */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Shield className="text-ok" size={16} />
              Checklist do Lab
            </h3>
            <div className="space-y-3">
              {F2B_CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all text-xs',
                    checklist[item.id]
                      ? 'bg-ok/5 border-ok/30 text-text'
                      : 'bg-bg-3 border-border text-text-2 hover:border-accent/40',
                  )}
                >
                  {checklist[item.id]
                    ? <CheckCircle2 className="text-ok shrink-0 mt-0.5" size={16} />
                    : <Circle className="text-text-3 shrink-0 mt-0.5" size={16} />}
                  <span className="leading-relaxed">{item.text}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-text-3 text-center">
              {F2B_CHECKLIST.filter(i => checklist[i.id]).length}/{F2B_CHECKLIST.length} concluídos
              {F2B_CHECKLIST.every(i => checklist[i.id]) && (
                <p className="mt-1 text-ok font-bold">🚫 Fail2ban Master desbloqueado!</p>
              )}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4">Referência Rápida</h3>
            <div className="space-y-3 font-mono text-xs">
              {[
                ['fail2ban-client status', 'Listar jails ativas'],
                ['fail2ban-client status sshd', 'Ver IPs banidos'],
                ['fail2ban-client set sshd banip IP', 'Ban manual'],
                ['fail2ban-client set sshd unbanip IP', 'Desban manual'],
                ['fail2ban-client reload', 'Recarregar config'],
                ['fail2ban-regex LOG FILTRO', 'Testar filtro'],
              ].map(([cmd, desc]) => (
                <div key={cmd} className="flex flex-col gap-0.5">
                  <code className="text-accent">{cmd}</code>
                  <span className="text-text-3 text-[10px]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4">Relacionado</h3>
            <div className="space-y-2">
              {[
                { href: '/port-knocking', label: 'Port Knocking — SSH Invisível' },
                { href: '/audit-logs', label: 'Audit Logs & Monitoramento' },
                { href: '/ataques-avancados', label: 'Ataques Avançados & Reconhecimento' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-xs text-text-2 hover:text-accent transition-colors group"
                >
                  <ArrowRight size={12} className="text-text-3 group-hover:text-accent" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/fail2ban" />
    </div>
  );
}
