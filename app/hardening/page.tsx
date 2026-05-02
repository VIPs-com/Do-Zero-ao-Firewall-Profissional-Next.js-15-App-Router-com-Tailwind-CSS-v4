'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, Terminal, AlertTriangle, CheckCircle2, Circle, Eye, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { TroubleshootingCard } from '@/components/ui/TroubleshootingCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

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

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
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

      {/* ── Exercícios Guiados ── */}
      <section className="space-y-4">
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

      <ModuleNav currentPath="/hardening" />
    </div>
  );
}
