'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Terminal, AlertTriangle, CheckCircle2, Circle, Eye, Server, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { TroubleshootingCard } from '@/components/ui/TroubleshootingCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, type DeepDive } from '@/data/deepDives';
import { useTabFilter } from '@/hooks/useTabFilter';

const HARDENING_CHECKLIST = [
  { id: 'ssh-hardened',    text: 'SSH endurecido: PasswordAuthentication no + PermitRootLogin no' },
  { id: 'sysctl-secured',  text: 'sysctl aplicado: SYN cookies, ASLR e filtro de rota ativados' },
  { id: 'apparmor-enabled', text: 'AppArmor ativo com perfil Nginx em enforce mode' },
];

const SSH_CONFIG = `# /etc/ssh/sshd_config — edite com: nano /etc/ssh/sshd_config

# Desativar login por senha (usar apenas chaves)
PasswordAuthentication no

# Nunca logar diretamente como root
PermitRootLogin no

# Apenas usuários específicos podem conectar
AllowUsers admin devops

# Porta alternativa (obscuridade básica — combine com Port Knocking)
# Port 2222

# Desconectar sessões inativas após 5 minutos (2 tentativas × 150s)
ClientAliveInterval 150
ClientAliveCountMax 2

# Máximo de tentativas de autenticação por conexão
MaxAuthTries 3

# Número máximo de conexões simultâneas não autenticadas
MaxStartups 10:30:60

# Versão 2 do protocolo apenas
Protocol 2`;

const SSH_KEYGEN = `# ── No cliente (sua máquina local) ──────────────────────────────────
# Gerar par de chaves Ed25519 (mais seguro que RSA 2048)
ssh-keygen -t ed25519 -C "meu-servidor-workshop"

# Copiar chave pública para o servidor
ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@192.168.56.10

# Testar login com chave (antes de desativar senha!)
ssh -i ~/.ssh/id_ed25519 admin@192.168.56.10

# ── No servidor — só após confirmar que chave funciona ─────────────
# Recarregar SSH (sem reiniciar — mantém sessão atual)
systemctl reload ssh

# Verificar status
systemctl status ssh`;

const SSH_AGENT = `# ── ssh-keygen — gerar e gerenciar chaves ───────────────────────────
ssh-keygen -t ed25519 -C "ada@laptop"    # gera ~/.ssh/id_ed25519 (+ .pub)
ssh-keygen -p -f ~/.ssh/id_ed25519       # troca a passphrase de uma chave
ssh-keygen -l -f ~/.ssh/id_ed25519.pub   # mostra o fingerprint da chave

# ── ssh-agent — digite a passphrase UMA vez por sessão ──────────────
eval "$(ssh-agent)"                # inicia o agente na sessão atual
ssh-add ~/.ssh/id_ed25519          # carrega a chave (pede a passphrase)
ssh-add -l                         # lista as chaves carregadas no agente
ssh-add -D                         # remove todas as chaves do agente

# ── ~/.ssh/config — apelidos por host ───────────────────────────────
# Host firewall
#   HostName 192.168.56.10
#   User admin
#   IdentityFile ~/.ssh/id_ed25519
# → agora basta:  ssh firewall`;

const SYSCTL_CONFIG = `# /etc/sysctl.d/99-hardening.conf — criar este arquivo
# Aplicar com: sysctl --system  (ou sysctl -p /etc/sysctl.d/99-hardening.conf)

# ── Proteção contra SYN Flood ──────────────────────────────────────
# SYN cookies evitam esgotamento da tabela de conexões semi-abertas
net.ipv4.tcp_syncookies = 1

# ── ASLR — Address Space Layout Randomization ─────────────────────
# Randomiza endereços de memória — dificulta exploits de buffer overflow
# 0 = desativado, 1 = parcial, 2 = completo (recomendado)
kernel.randomize_va_space = 2

# ── Proteção contra IP Spoofing ───────────────────────────────────
# Descarta pacotes que chegam por interface inconsistente com a rota
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# ── Ignorar broadcasts ICMP (Smurf Attack) ────────────────────────
net.ipv4.icmp_echo_ignore_broadcasts = 1

# ── Ignorar ICMP Redirect (MITM) ──────────────────────────────────
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0

# ── Log de martian packets (IPs impossíveis de rotear) ───────────
net.ipv4.conf.all.log_martians = 1

# ── IP Forward (já configurado na Aula 1 — manter ativado) ────────
net.ipv4.ip_forward = 1`;

const SYSCTL_APPLY = `# Aplicar todas as configurações imediatamente (sem reboot)
sysctl --system

# Verificar um valor específico
sysctl net.ipv4.tcp_syncookies
# Saída esperada: net.ipv4.tcp_syncookies = 1

sysctl kernel.randomize_va_space
# Saída esperada: kernel.randomize_va_space = 2

# Ver todos os parâmetros do kernel de uma vez
sysctl -a | grep -E "syncookies|randomize|rp_filter"`;

const APPARMOR_STATUS = `# Verificar se o AppArmor está ativo
aa-status
# ou
systemctl status apparmor

# Saída esperada:
# apparmor module is loaded.
# 45 profiles are loaded.
# 40 profiles are in enforce mode.
# 5 profiles are in complain mode.

# Instalar ferramentas extras (se não estiver disponível)
apt install apparmor-utils -y`;

const APPARMOR_NGINX = `# ── Ver perfil atual do Nginx ────────────────────────────────────
aa-status | grep nginx
# Exemplo de saída: /usr/sbin/nginx → enforce  (bom!)
# ou:               /usr/sbin/nginx → complain (apenas registra, não bloca)

# ── Colocar perfil em enforce mode ───────────────────────────────
aa-enforce /etc/apparmor.d/usr.sbin.nginx

# ── Testar Nginx após mudança de perfil ──────────────────────────
nginx -t && systemctl reload nginx

# ── Verificar se há violações registradas ─────────────────────────
journalctl -k | grep apparmor | tail -20
# ou no syslog:
grep "apparmor" /var/log/syslog | tail -20`;

const APPARMOR_COMPLAIN = `# Quando um serviço QUEBRA após ativar enforce mode:
# Passo 1: Colocar em complain mode (só registra, não bloca)
aa-complain /etc/apparmor.d/usr.sbin.nginx

# Passo 2: Reproduzir o problema e ver o log
journalctl -k -f | grep apparmor

# Passo 3: Gerar regras automaticamente do log
# (instalar aa-logprof se necessário: apt install apparmor-utils)
aa-logprof

# Passo 4: Voltar para enforce com as novas regras
aa-enforce /etc/apparmor.d/usr.sbin.nginx`;

const VERIFY_ALL = `# ── Checklist de verificação rápida ─────────────────────────────

# SSH: confirmar que senha está desabilitada
sshd -T | grep passwordauthentication
# Saída esperada: passwordauthentication no

# SSH: confirmar que root está bloqueado
sshd -T | grep permitrootlogin
# Saída esperada: permitrootlogin no

# sysctl: confirmar SYN cookies
sysctl net.ipv4.tcp_syncookies
# Saída esperada: net.ipv4.tcp_syncookies = 1

# sysctl: confirmar ASLR
sysctl kernel.randomize_va_space
# Saída esperada: kernel.randomize_va_space = 2

# AppArmor: confirmar enforce mode
aa-status | grep -A1 "enforce mode"`;

export default function HardeningPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const { activeTab, setActiveTab, isActive, tabButtonProps } = useTabFilter<'conceito' | 'apparmor' | 'exercicios'>('conceito');

  useEffect(() => {
    trackPageVisit('/hardening');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = HARDENING_CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-hardening">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Hardening Linux</span>
      </div>

      <div className="section-label">Tópico 46 · Camada 7</div>
      <h1 className="section-title">🔐 Hardening Linux</h1>
      <p className="section-sub">
        Você configurou firewall, VPN e IDS — agora é hora de <strong>endurecer o próprio servidor</strong>.
        Hardening é o processo de reduzir a superfície de ataque: desativar o que não precisa,
        restringir o que resta e registrar tudo o que acontece. Três camadas independentes e complementares.
      </p>

      <FluxoCard
        title="As 3 Camadas de Hardening"
        steps={[
          { label: 'SSH', sub: 'Acesso sem senha · Sem root · Chaves Ed25519', icon: <Lock className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'sysctl', sub: 'SYN cookies · ASLR · rp_filter', icon: <Server className="w-4 h-4" />, color: 'border-[var(--color-layer-3)]' },
          { label: 'AppArmor', sub: 'Perfis de confinamento · Enforce mode', icon: <Shield className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      {/* Tabs de navegação */}
      <div className="flex gap-2 mb-10 border-b border-border">
        {[
          { id: 'conceito',   label: '🔐 SSH & sysctl' },
          { id: 'apparmor',   label: '🛡️ AppArmor' },
          { id: 'exercicios', label: '🔬 Exercícios & Ref.' },
        ].map(tab => (
          <button
            key={tab.id}
            {...tabButtonProps(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              isActive(tab.id)
                ? 'border-[var(--mod)] text-[var(--mod)]'
                : 'border-transparent text-text-2 hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div>

          {isActive('conceito') && (
          <div className="space-y-16">

          {/* ── Seção 1: SSH Hardening ── */}
          <section id="ssh-hardening">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">SSH Hardening</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              O SSH é a porta de entrada do servidor — e o alvo favorito de bots de força bruta.
              Desativar autenticação por senha e exigir chaves criptográficas elimina praticamente
              todos os ataques de força bruta automatizados.
            </p>

            <WarnBox title="⚠️ Ordem Importa — Não se tranque do lado de fora">
              Antes de desativar <code>PasswordAuthentication</code>, confirme que seu par de chaves
              funciona em outra sessão SSH aberta. Só então recarregue o SSH. Se travar o acesso,
              você precisará de acesso console à VM (Proxmox / VirtualBox).
            </WarnBox>

            <div className="mt-6 mb-6">
              <CodeBlock code={SSH_KEYGEN} lang="bash" />
            </div>

            <InfoBox title="Por que Ed25519 em vez de RSA?">
              Ed25519 usa criptografia de curva elíptica — chaves menores, mais rápidas e mais seguras
              que RSA 2048. É o padrão atual recomendado pelo NIST e suportado em todos os clientes
              SSH modernos (OpenSSH 6.5+).
            </InfoBox>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Configuração do sshd_config</h3>
              <CodeBlock code={SSH_CONFIG} lang="bash" />
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">SSH Agent e Gestão de Chaves</h3>
              <p className="text-text-2 text-sm mb-3">
                Uma chave protegida por <em>passphrase</em> pede a senha a cada conexão. O{' '}
                <code>ssh-agent</code> guarda a chave destravada na memória da sessão — você digita
                a passphrase uma vez e o <code>ssh-add</code> cuida do resto. O <code>~/.ssh/config</code>{' '}
                transforma comandos longos em apelidos curtos.
              </p>
              <CodeBlock code={SSH_AGENT} lang="bash" />
              <InfoBox title="Foco na Prova — LPIC-1 / CompTIA Linux+">
                A chave PRIVADA (<code>id_ed25519</code>) nunca sai da sua máquina; só a PÚBLICA
                (<code>.pub</code>) vai para o servidor, em <code>~/.ssh/authorized_keys</code>.
                {' '}<code>ssh-agent</code> + <code>ssh-add</code> evitam redigitar a passphrase sem
                nunca gravá-la em disco.
              </InfoBox>
            </div>
          </section>

          {/* ── Seção 2: sysctl Security ── */}
          <section id="sysctl-security">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-3/10 flex items-center justify-center text-layer-3">
                <Server size={24} />
              </div>
              <h2 className="text-2xl font-bold">sysctl — Parâmetros do Kernel</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              O <code>sysctl</code> expõe parâmetros do kernel via <code>/proc/sys/</code>.
              Vários deles controlam comportamentos de segurança de rede que estão desabilitados
              por padrão para compatibilidade máxima — mas que todo servidor de produção deveria ter ativados.
            </p>

            <CodeBlock code={SYSCTL_CONFIG} lang="bash" />

            <div className="mt-6">
              <CodeBlock code={SYSCTL_APPLY} lang="bash" />
            </div>

            <div className="mt-6">
              <HighlightBox title="💡 Por que ASLR impede exploits?">
                Sem ASLR, um buffer overflow pode calcular exatamente onde injetar código malicioso
                na memória. Com <code>kernel.randomize_va_space = 2</code>, o endereço muda a cada
                execução — o exploit teria que adivinhar entre bilhões de posições possíveis.
              </HighlightBox>
            </div>
          </section>

          </div>
          )}

          {isActive('apparmor') && (
          <div className="space-y-16">

          {/* ── Seção 3: AppArmor ── */}
          <section id="apparmor">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">AppArmor — Confinamento de Processos</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              AppArmor é um sistema de Mandatory Access Control (MAC) integrado ao kernel Linux.
              Ele define, por perfil, quais arquivos, redes e capacidades cada processo pode acessar.
              Mesmo que um atacante explore uma falha no Nginx, o AppArmor impede que o processo
              acesse arquivos fora do seu perfil.
            </p>

            <CodeBlock code={APPARMOR_STATUS} lang="bash" />

            <div className="mt-6 mb-6">
              <h3 className="font-bold text-lg mb-3">Aplicar perfil Nginx em enforce mode</h3>
              <CodeBlock code={APPARMOR_NGINX} lang="bash" />
            </div>

            <InfoBox title="enforce vs complain">
              <strong>enforce</strong>: bloqueia qualquer ação não permitida pelo perfil (produção). <br />
              <strong>complain</strong>: apenas registra no log sem bloquear (útil para criar novos perfis). <br />
              Comece em <em>complain</em>, gere as regras com <code>aa-logprof</code>, depois mude para <em>enforce</em>.
            </InfoBox>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Quando o serviço quebra após enforce</h3>
              <CodeBlock code={APPARMOR_COMPLAIN} lang="bash" />
            </div>
          </section>

          {/* ── TroubleshootingCard: AppArmor Permission Denied ── */}
          <section id="troubleshooting">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="text-warn" />
              Diagnóstico — &quot;Permission Denied mesmo com chmod 777&quot;
            </h2>
            <p className="text-text-2 mb-6 leading-relaxed">
              Este é o sintoma clássico de um perfil AppArmor em enforce mode bloqueando um serviço.
              O Nginx (ou outro processo) recebe <code>EACCES</code> mesmo que as permissões de arquivo
              estejam corretas — porque o bloqueio acontece uma camada abaixo, no kernel.
            </p>
            <TroubleshootingCard
              steps={[
                {
                  layer: 1,
                  name: 'Física',
                  symptom: 'Nginx não sobe',
                  command: 'systemctl status nginx',
                  detail: 'Procure "failed" ou "Active: failed" na saída',
                },
                {
                  layer: 3,
                  name: 'Rede',
                  symptom: 'Porta 80/443 não responde',
                  command: 'ss -tlnp | grep nginx',
                  detail: 'Se vazio, Nginx não iniciou. Não é problema de firewall.',
                },
                {
                  layer: 6,
                  name: 'Apresentação',
                  symptom: 'Log mostra "Permission denied"',
                  command: 'journalctl -u nginx | grep -i denied',
                  detail: 'chmod 777 não resolve — o bloqueio é do AppArmor, não do filesystem',
                },
                {
                  layer: 7,
                  name: 'Aplicação',
                  symptom: 'AppArmor bloqueando acesso a arquivo',
                  command: 'journalctl -k | grep apparmor | tail -10',
                  detail: 'Procure "DENIED" com o path do arquivo. Use aa-complain + aa-logprof para criar a regra faltante.',
                },
              ]}
            />
          </section>

          {/* ── Verificação final ── */}
          <section id="verificacao">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Eye className="text-info" />
              Verificação Final
            </h2>
            <CodeBlock code={VERIFY_ALL} lang="bash" />
          </section>

          </div>
          )}

          {isActive('exercicios') && (
          <div className="space-y-16">

          {/* Erros Comuns */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">Erros Comuns</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'SSH inacessível após desativar PasswordAuthentication',
                  cause: 'Não testou a chave SSH antes de recarregar o sshd. O daemon rejeitou a conexão sem senha e sem chave válida.',
                  fix: 'Acesse pelo console da VM (Proxmox / VirtualBox → tela de login). Reative temporariamente com: sed -i \'s/PasswordAuthentication no/PasswordAuthentication yes/\' /etc/ssh/sshd_config && systemctl reload sshd. Depois copie a chave corretamente: ssh-copy-id user@IP.',
                },
                {
                  title: 'sysctl: setting key failed — read-only',
                  cause: 'Tentou aplicar um parâmetro que não é suportado pelo kernel atual, ou que requer módulo específico carregado.',
                  fix: 'Verifique se o parâmetro existe: sysctl -a | grep nome_parametro. Para net.ipv4.tcp_syncookies, certifique-se que o kernel foi compilado com CONFIG_SYN_COOKIES (praticamente todo kernel de distribuição tem).',
                },
                {
                  title: 'AppArmor "Permission denied" mesmo com chmod 777',
                  cause: 'O bloqueio está no kernel (MAC layer), não nas permissões POSIX. O Nginx pode ter arquivo legível mas o perfil AppArmor proíbe a leitura.',
                  fix: 'Cheque o log: journalctl -k | grep apparmor | grep DENIED. Mude para complain temporariamente: aa-complain nginx. Reproduza o acesso, depois execute aa-logprof para gerar as regras faltantes. Volte para enforce: aa-enforce nginx.',
                },
                {
                  title: 'Chave Ed25519 funciona localmente mas não no servidor',
                  cause: 'A chave pública não foi copiada corretamente para ~/.ssh/authorized_keys, ou as permissões do diretório .ssh estão erradas.',
                  fix: 'No servidor: chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys. Verifique com: ls -la ~/.ssh/. Em caso de dúvida, use ssh-copy-id para garantir o formato correto. Debug: ssh -vvv user@server para ver qual chave está sendo tentada.',
                },
              ].map(({ title, cause, fix }) => (
                <details key={title} className="group bg-bg-2 border border-border rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-3 transition-colors list-none">
                    <span className="font-semibold text-sm text-warn flex items-center gap-2">
                      <AlertTriangle size={14} className="shrink-0" />
                      {title}
                    </span>
                    <span className="text-text-3 text-xs group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 space-y-2 border-t border-border">
                    <p className="text-xs text-text-3 mt-3"><strong className="text-text-2">Causa:</strong> {cause}</p>
                    <p className="text-xs text-text-3"><strong className="text-text-2">Solução:</strong> {fix}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Auditoria Rápida */}
          <section id="auditoria">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Eye size={24} />
              </div>
              <h2 className="text-2xl font-bold">Auditoria em 60 Segundos</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              Execute estes comandos em qualquer servidor Linux para verificar rapidamente o status das 3 camadas de hardening. Um resultado verde em todas indica configuração de produção.
            </p>
            <CodeBlock lang="bash" code={`# ── Camada 1: SSH ──────────────────────────────────────────
sshd -T | grep -E 'passwordauth|pubkeyauth|permitrootlogin|protocol'
# Esperado: passwordauthentication no | pubkeyauthentication yes
#           permitrootlogin no | protocol 2

# Verificar algoritmos de chave aceitos:
sshd -T | grep hostkeyalgorithms

# ── Camada 2: sysctl ───────────────────────────────────────
sysctl kernel.randomize_va_space net.ipv4.tcp_syncookies \\
       net.ipv4.conf.all.rp_filter net.ipv4.conf.all.accept_redirects
# Esperado: randomize=2 | syncookies=1 | rp_filter=1 | redirects=0

# ── Camada 3: AppArmor ─────────────────────────────────────
aa-status | grep -E 'profiles.*loaded|processes.*enforce'
# Esperado: N profiles in enforce mode

# Ver quais perfis estão ativos:
aa-status --json 2>/dev/null | python3 -m json.tool | grep -A2 'enforce'

# ── Resumo geral ───────────────────────────────────────────
echo "=== SSH ===" && sshd -T | grep passwordauth
echo "=== ASLR ===" && cat /proc/sys/kernel/randomize_va_space
echo "=== AppArmor ===" && aa-status 2>/dev/null | head -3`} />

            <InfoBox title="💡 Automatizar a auditoria com Ansible">
              <p className="text-sm text-text-2">
                Para auditar múltiplos servidores de uma vez, use o módulo Ansible <code>command</code> + <code>assert</code>. Veja o módulo <strong>/ansible</strong> para um playbook completo de auditoria de hardening — ele verifica as 3 camadas e reporta não-conformidades automaticamente.
              </p>
            </InfoBox>
          </section>

          </div>
          )}

        </div>

        {/* ── Sidebar: Checklist ── */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="p-6 rounded-2xl bg-bg-2 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-accent w-5 h-5" />
              <h3 className="font-bold text-lg">Checklist do Lab</h3>
            </div>

            <div className="space-y-3">
              {HARDENING_CHECKLIST.map(item => (
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
                <div className="text-2xl mb-2">🔐</div>
                <p className="text-sm font-bold text-accent">Hardening Master desbloqueado!</p>
                <p className="text-xs text-text-2 mt-1">Badge adicionado ao seu perfil</p>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs text-text-3 mb-3 font-bold uppercase tracking-wider">Progresso</p>
              <div className="w-full bg-bg-3 rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2 transition-[width] duration-700 ease-out"
                  style={{ width: `${(HARDENING_CHECKLIST.filter(c => checklist[c.id]).length / HARDENING_CHECKLIST.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-3 mt-2 text-right">
                {HARDENING_CHECKLIST.filter(c => checklist[c.id]).length}/{HARDENING_CHECKLIST.length} concluídos
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-bg-2 border border-border">
            <Terminal className="text-accent w-5 h-5 mb-3" />
            <h4 className="font-bold mb-2 text-sm">Comandos Rápidos</h4>
            <div className="space-y-2 font-mono text-xs text-text-2">
              <div><span className="text-text-3">►</span> <code>sshd -T | grep passwordauth</code></div>
              <div><span className="text-text-3">►</span> <code>sysctl kernel.randomize_va_space</code></div>
              <div><span className="text-text-3">►</span> <code>aa-status | grep enforce</code></div>
              <div><span className="text-text-3">►</span> <code>journalctl -k | grep apparmor</code></div>
            </div>
          </div>
        </aside>
      </div>

      {isActive('exercicios') && (<>
      {/* Windows Comparison */}
      <div className="mt-12">
        <WindowsComparisonBox
          windowsLabel="Windows — Group Policy / CIS Baseline"
          linuxLabel="Linux — SSH + sysctl + AppArmor"
          windowsCode={`# Windows Security Hardening — via Group Policy (GPO)
# Equivalente ao sshd_config + sysctl + AppArmor

# 1. Desabilitar autenticação NTLM (equivalente: PasswordAuth no)
#    GPO: Computer Config → Windows Settings → Security Settings
#         → Network Security → LAN Manager Auth Level
#         → Definir como "Send NTLMv2 response only. Refuse LM & NTLM"

# 2. ASLR — habilitado por padrão no Windows Vista+
#    Verificar via registro:
Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management" \\
  -Name "MoveImages"

# 3. Windows Defender Credential Guard (= AppArmor para credenciais)
#    GPO: Computer Config → Administrative Templates →
#         System → Device Guard → Turn on Virtualization Based Security

# 4. CIS Benchmark (equivalente ao nosso checklist sysctl):
# https://www.cisecurity.org/cis-benchmarks
# PowerShell: instalar módulo CIS Compliance Check
Install-Module -Name CISBenchmark -Force
Invoke-CISCheck -Level 1 -OutputPath C:\\audit.html

# 5. Windows Firewall (equivalente ao iptables -A INPUT):
netsh advfirewall set allprofiles firewallpolicy blockinbound,allowoutbound`}
          linuxCode={`# Linux Hardening — SSH + sysctl + AppArmor

# 1. SSH: desabilitar autenticação por senha
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' \\
  /etc/ssh/sshd_config
echo "PermitRootLogin no" >> /etc/ssh/sshd_config
systemctl restart sshd

# 2. sysctl — kernnel hardening (ASLR, SYN cookies, rp_filter)
cat >> /etc/sysctl.d/99-hardening.conf << 'EOF'
kernel.randomize_va_space = 2          # ASLR completo
net.ipv4.tcp_syncookies = 1            # SYN flood protection
net.ipv4.conf.all.rp_filter = 1        # Anti-spoofing
net.ipv4.conf.all.accept_redirects = 0 # Sem ICMP redirects
kernel.dmesg_restrict = 1              # Ocultar dmesg de não-root
EOF
sysctl --system

# 3. AppArmor — MAC (Mandatory Access Control)
apt install apparmor apparmor-utils -y
aa-enforce /etc/apparmor.d/usr.sbin.nginx  # Forçar perfil Nginx
aa-status | grep enforce

# Verificar postura de segurança:
lynis audit system  # lynis = CIS Benchmark para Linux`}
        />
      </div>

      {/* ── Defense in Depth (Códice de Sobrevivência, Vol. II) ── */}
      <section id="defense-in-depth" className="mt-12 scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold mb-2">🛡️ Defense in Depth — defesa em camadas</h2>
        <p className="text-text-2">
          Hardening de SSH, sysctl e AppArmor é poderoso — mas é <strong>uma</strong> camada.
          Segurança real é <strong>defesa em profundidade</strong>: cada camada que um atacante
          precisa quebrar significa mais tempo, mais ruído e mais chance de você detectar antes
          que ele alcance o que importa.
        </p>
        <div className="grid sm:grid-cols-5 gap-2 my-4 text-center text-xs">
          {[
            { n: '1', l: 'Borda', d: 'Firewall de borda — regras inter-VLAN, IDS/IPS' },
            { n: '2', l: 'Segmentação', d: 'VLANs isoladas: IoT, lab, gerência, servidores' },
            { n: '3', l: 'Hypervisor', d: 'Proxmox hardened — 2FA, web só na VLAN de gerência' },
            { n: '4', l: 'Host', d: 'Cada VM: SSH por chave, UFW, fail2ban, sem root' },
            { n: '5', l: 'Serviço', d: 'Menor privilégio — cada serviço no seu usuário' },
          ].map(c => (
            <div key={c.n} className="p-3 rounded-lg bg-bg-2 border border-border">
              <div className="text-lg font-black text-[var(--mod)]">{c.n}</div>
              <div className="font-bold text-text mb-1">{c.l}</div>
              <div className="text-text-3 leading-snug">{c.d}</div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mt-6 mb-2">O que o Kali faz — e como você se defende</h3>
        <p className="text-text-2 mb-3">
          Conhecer as ferramentas do atacante é a melhor defesa. Eis o que alguém com Kali
          Linux tentaria no seu ambiente — e a camada que neutraliza cada ataque:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-err">Ferramenta do atacante</th>
                <th className="text-left py-2 pr-4 text-text-2">O que faz</th>
                <th className="text-left py-2 text-ok">Sua defesa</th>
              </tr>
            </thead>
            <tbody className="text-text-2">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono">nmap</td>
                <td className="py-2 pr-4">Descobre portas e serviços abertos</td>
                <td className="py-2">Feche o que não usa; rode <code>ss -tlnp</code> e faça nmap em si mesmo</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono">Hydra / Medusa</td>
                <td className="py-2 pr-4">Força bruta de senha em SSH e outros serviços</td>
                <td className="py-2">Chave SSH obrigatória + <code>PasswordAuthentication no</code> + fail2ban</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono">Metasploit</td>
                <td className="py-2 pr-4">Explora vulnerabilidades de software desatualizado</td>
                <td className="py-2">Patch é a melhor proteção — mantenha tudo atualizado</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4 font-mono">Wireshark / tcpdump</td>
                <td className="py-2 pr-4">Captura tráfego para ler senhas e dados</td>
                <td className="py-2">Criptografia em tudo (HTTPS, SSH, VPN) + VLANs isolam segmentos</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">LinPEAS</td>
                <td className="py-2 pr-4">Busca caminho de escalada de privilégio após entrar</td>
                <td className="py-2">Menor privilégio; nenhum arquivo de config world-writable (777)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <HighlightBox title="A regra de ouro da defesa" className="mt-4">
          Se você não precisa que esteja aberto → feche. Se não precisa que esteja rodando →
          pare. Se não precisa que esteja instalado → remova. <strong>Superfície de ataque
          zero = nada para atacar.</strong>
        </HighlightBox>
      </section>

      {/* ── Exercícios Guiados ── */}
      <section className="space-y-4 mt-12">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Gerar e copiar chave SSH Ed25519</p>
            <CodeBlock lang="bash" code={`# Na sua máquina LOCAL (não no servidor):
ssh-keygen -t ed25519 -C "workshop-firewall" -f ~/.ssh/workshop_key

# Copiar a chave para o servidor (antes de desabilitar senha!)
ssh-copy-id -i ~/.ssh/workshop_key.pub usuario@IP-SERVIDOR

# Testar login com chave (deve funcionar SEM pedir senha):
ssh -i ~/.ssh/workshop_key usuario@IP-SERVIDOR

# Só depois de confirmar que a chave funciona, desabilitar senha:
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/'  /etc/ssh/sshd_config
sudo systemctl restart sshd`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Aplicar sysctl hardening e verificar</p>
            <CodeBlock lang="bash" code={`# Aplicar configurações de kernel
sudo tee /etc/sysctl.d/99-hardening.conf << 'EOF'
kernel.randomize_va_space = 2
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
kernel.dmesg_restrict = 1
EOF

sudo sysctl --system   # Aplicar sem reiniciar

# Verificar valores aplicados:
sysctl kernel.randomize_va_space   # deve ser 2
sysctl net.ipv4.tcp_syncookies     # deve ser 1
sysctl net.ipv4.conf.all.rp_filter # deve ser 1`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Auditoria com Lynis</p>
            <CodeBlock lang="bash" code={`# Instalar Lynis (auditor de segurança CIS)
sudo apt install lynis -y

# Rodar auditoria completa
sudo lynis audit system 2>&1 | tee /tmp/lynis-report.txt

# Ver score e avisos de alta prioridade:
grep "Hardening index" /tmp/lynis-report.txt
grep "\\[WARNING\\]" /tmp/lynis-report.txt | head -10

# Ver sugestões de melhoria:
grep "\\* " /tmp/lynis-report.txt | head -15`} />
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
            err: 'SSH recusa conexão após desabilitar PasswordAuthentication',
            fix: 'A chave pública não foi copiada antes de desabilitar senha. Solução: acessar o servidor via console/VNC, verificar ~/.ssh/authorized_keys do usuário, copiar a chave pública com ssh-copy-id e reativar a conexão. Sempre testar em sessão separada antes de fechar a atual.',
          },
          {
            err: 'sysctl: setting key net.ipv4.conf.all.rp_filter: Read-only file system',
            fix: 'O sysctl está sendo aplicado antes do sistema de arquivos /proc estar montado (raro em boot). Aguardar o boot completo e rodar sysctl --system. Em containers Docker, alguns parâmetros de kernel são somente leitura (namespace não permite).',
          },
          {
            err: "AppArmor: DENIED — nginx não inicia após aa-enforce",
            fix: 'O perfil AppArmor está bloqueando algum acesso legítimo. Verificar os logs: grep "DENIED" /var/log/syslog | grep nginx. Usar aa-complain para modo reclamação enquanto ajusta: aa-complain /etc/apparmor.d/usr.sbin.nginx. Adicionar a permissão faltante ao perfil e retornar com aa-enforce.',
          },
          {
            err: 'lynis score baixo mesmo após hardening aplicado',
            fix: 'Lynis verifica dezenas de controles — é normal ter pontos a melhorar. Focar nos itens de risco ALTO primeiro. Cada sugestão inclui o comando exato. Score 65+ já é considerado bom para servidor de produção. Score 80+ é excelente.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      {/* Deep Dive — Defense in Depth */}
      <div className="mt-12 border border-border rounded-xl p-6 bg-bg-2">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} className="text-warn" />
          <span className="text-warn font-semibold text-sm uppercase tracking-wider">Mergulho Técnico</span>
        </div>
        <h3 className="text-lg font-bold text-text mb-2">Defense in Depth — 3 Camadas de Segurança do Servidor</h3>
        <p className="text-text-2 text-sm mb-4">
          Como SSH hardening, sysctl de defesa e AppArmor MAC formam 3 camadas independentes que, juntas, tornam a penetração exponencialmente mais difícil — mesmo que uma camada seja comprometida.
        </p>
        <button
          onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'hardening-defense-depth') ?? null)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-bg border border-border hover:border-warn transition-all group"
        >
          <span className="text-sm text-text-2 group-hover:text-text transition-colors">Ver as 3 camadas em detalhe técnico →</span>
          <ArrowRight size={14} className="text-text-3 group-hover:text-warn transition-colors" />
        </button>
      </div>

      </>)}

      <DeepDiveModal dive={activeDeepDive} onClose={() => setActiveDeepDive(null)} />
      <ModuleNav currentPath="/hardening" />
    </div>
  );
}
