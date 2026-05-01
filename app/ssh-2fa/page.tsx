'use client';

import React, { useEffect } from 'react';
import { Smartphone, Key, Lock, ShieldCheck, Terminal, AlertTriangle, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

const CHECKLIST = [
  { id: 'totp-instalado',  text: 'libpam-google-authenticator instalado e QR code gerado com google-authenticator' },
  { id: 'pam-configurado', text: '/etc/pam.d/sshd atualizado com a linha do PAM TOTP' },
  { id: 'ssh-2fa-testado', text: 'SSH autenticado com sucesso usando código TOTP de 6 dígitos' },
];

const INSTALL = `# Instalar o módulo PAM e o gerador de QR code
sudo apt update
sudo apt install -y libpam-google-authenticator qrencode

# Executar o assistente de configuração (como o usuário que fará SSH)
# IMPORTANTE: rode como o USUÁRIO real, não como root
google-authenticator

# O assistente fará uma série de perguntas — respostas recomendadas:
# Do you want authentication tokens to be time-based? → y  (TOTP)
# Update the .google_authenticator file?              → y
# Disallow multiple uses of the same token?           → y
# Increase window for time skew?                      → n  (30s é suficiente)
# Enable rate-limiting?                               → y  (3 tentativas / 30s)`;

const QR_CODE = `# O google-authenticator exibe:
# 1. Um QR code ASCII (escaneie com Google Authenticator ou Authy)
# 2. Uma secret key de 32 caracteres (anote em local seguro)
# 3. Códigos de emergência de uso único (guarde offline!)

# Exemplo de saída:
# Your new secret key is: JBSWY3DPEHPK3PXP
# Your verification code is: 123456
# Your emergency scratch codes are:
#   12345678
#   87654321
#   ...

# Para regenerar ou ver o QR code depois:
cat ~/.google_authenticator | head -1 | qrencode -t UTF8`;

const PAM_CONFIG = `# /etc/pam.d/sshd — adicionar no INÍCIO do arquivo (antes de @include common-auth)
sudo nano /etc/pam.d/sshd

# Adicionar esta linha NO TOPO:
auth required pam_google_authenticator.so

# O arquivo deve ficar assim:
# auth required pam_google_authenticator.so
# @include common-auth
# ...

# O parâmetro "nullok" permite login sem 2FA para usuários que ainda não configuraram:
# auth required pam_google_authenticator.so nullok
# (útil durante migração — remova quando todos tiverem configurado)`;

const SSHD_CONFIG = `# /etc/ssh/sshd_config — habilitar challenge-response
sudo nano /etc/ssh/sshd_config

# Encontrar e alterar estas linhas:
KbdInteractiveAuthentication yes

# Se a linha abaixo existir, altere também:
UsePAM yes

# Em servidores mais antigos pode aparecer como:
# ChallengeResponseAuthentication yes

# Recarregar o SSH sem derrubar sessões existentes
sudo systemctl reload ssh

# Verificar status
sudo systemctl status ssh`;

const TEST_SESSION = `# ── REGRA DE OURO: nunca feche a sessão atual antes de testar! ────────

# Terminal 1 (sessão atual — MANTER ABERTA)
# Esta sessão é seu "seguro de vida" caso algo dê errado

# Terminal 2 (nova tentativa de SSH)
ssh usuario@192.168.56.10

# O prompt pedirá:
# Password:               ← senha normal do usuário
# Verification code:      ← código TOTP de 6 dígitos do app

# Se funcionar: 2FA ativo com sucesso!
# Se der erro: use o Terminal 1 para corrigir sem perder acesso`;

const ROLLBACK = `# Como reverter o 2FA se algo der errado

# Opção 1: remover a linha do PAM (mais rápido)
sudo nano /etc/pam.d/sshd
# Apagar ou comentar: auth required pam_google_authenticator.so

# Opção 2: reverter sshd_config
sudo nano /etc/ssh/sshd_config
# KbdInteractiveAuthentication no

# Recarregar SSH
sudo systemctl reload ssh

# Opção 3: usar códigos de emergência (quando perdeu o celular)
# Os scratch codes gerados pelo google-authenticator funcionam uma vez cada
# Estão em ~/.google_authenticator (últimas 5 linhas)

# Remover completamente o 2FA de um usuário:
rm ~/.google_authenticator`;

const HARDENING_EXTRA = `# Configurações adicionais em /etc/ssh/sshd_config para maior segurança

# Exigir 2FA APENAS para usuários externos (excluir usuários locais/sudo)
Match Address 192.168.56.0/24
    KbdInteractiveAuthentication no

# Ou exigir 2FA para todos exceto um usuário de emergência
Match User admin-emergency
    KbdInteractiveAuthentication no

# Timeout se o código não for inserido em 60 segundos
LoginGraceTime 60

# Recarregar para aplicar
sudo systemctl reload ssh`;

export default function Ssh2faPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/ssh-2fa');
  }, [trackPageVisit]);

  const completed = CHECKLIST.filter(item => checklist[item.id]).length;

  return (
    <main className="module-accent-ssh-2fa min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="section-label">Segurança Avançada</span>
          </div>
          <h1 className="text-3xl font-bold text-text flex items-center gap-3">
            <Smartphone className="text-[var(--mod)]" size={32} />
            SSH com 2FA — TOTP
          </h1>
          <p className="text-text-2 text-lg leading-relaxed">
            Adicione uma segunda camada de segurança ao seu SSH com <strong>Time-based One-Time Passwords (TOTP)</strong>.
            Mesmo que alguém descubra sua senha, precisará do código temporário do seu celular para entrar.
          </p>
        </div>

        {/* Checklist Progress */}
        <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text flex items-center gap-2">
              <ShieldCheck size={18} className="text-[var(--mod)]" />
              Checklist do Módulo
            </h2>
            <span className="text-sm text-text-3">{completed}/{CHECKLIST.length} concluídos</span>
          </div>
          <div className="space-y-3">
            {CHECKLIST.map(item => (
              <button
                key={item.id}
                onClick={() => updateChecklist(item.id, !checklist[item.id])}
                className={cn(
                  'w-full flex items-start gap-3 text-left px-4 py-3 rounded-lg border transition-colors',
                  checklist[item.id]
                    ? 'bg-ok/10 border-ok/30 text-text'
                    : 'bg-bg border-border text-text-2 hover:border-[var(--mod)]/40'
                )}
              >
                {checklist[item.id]
                  ? <CheckCircle2 size={18} className="text-ok mt-0.5 shrink-0" />
                  : <Circle size={18} className="text-text-3 mt-0.5 shrink-0" />}
                <span className="text-sm">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* O que é TOTP */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Conceito</span>
            <h2 className="section-title mt-1">O que é TOTP?</h2>
          </div>

          <FluxoCard
            title="Fluxo: como o 2FA protege o SSH"
            steps={[
              { label: 'Senha + Chave SSH', sub: 'fator 1: algo que você sabe/tem', icon: <Key size={14} />, color: 'border-info/50' },
              { label: 'App TOTP gera código', sub: 'Google Authenticator / Authy', icon: <Smartphone size={14} />, color: 'border-[var(--mod)]/50' },
              { label: 'Código válido por 30s', sub: 'HMAC + timestamp Unix / 30', icon: <Terminal size={14} />, color: 'border-ok/50' },
              { label: 'PAM valida o código', sub: '/etc/pam.d/sshd', icon: <Lock size={14} />, color: 'border-warn/50' },
              { label: 'Acesso concedido', sub: 'ambos os fatores corretos', icon: <ShieldCheck size={14} />, color: 'border-ok/50' },
            ]}
          />

          <InfoBox title="Como o TOTP funciona por dentro">
            <div className="space-y-2 text-sm text-text-2">
              <p>
                <strong>TOTP (Time-based One-Time Password)</strong> é definido na RFC 6238.
                Ele combina uma <em>secret key</em> compartilhada com o <em>timestamp Unix atual</em> dividido por 30 (janela de 30 segundos).
              </p>
              <p>
                A fórmula é: <code className="bg-bg-3 px-1 rounded text-text font-mono text-xs">TOTP = HMAC-SHA1(secret, floor(unixtime / 30))</code>
              </p>
              <p>
                O servidor e o app calculam o mesmo resultado sem se comunicar — desde que os relógios estejam sincronizados (NTP).
                É por isso que o código muda a cada 30 segundos e cada código serve apenas uma vez.
              </p>
            </div>
          </InfoBox>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-2 border border-border rounded-lg p-4 space-y-2">
              <div className="text-[var(--mod)] font-mono text-2xl font-bold">2FA</div>
              <div className="text-text font-medium text-sm">Dois Fatores</div>
              <p className="text-text-3 text-xs">Senha + código temporário. Ambos necessários.</p>
            </div>
            <div className="bg-bg-2 border border-border rounded-lg p-4 space-y-2">
              <div className="text-[var(--mod)] font-mono text-2xl font-bold">30s</div>
              <div className="text-text font-medium text-sm">Janela TOTP</div>
              <p className="text-text-3 text-xs">Cada código expira em 30 segundos automaticamente.</p>
            </div>
            <div className="bg-bg-2 border border-border rounded-lg p-4 space-y-2">
              <div className="text-[var(--mod)] font-mono text-2xl font-bold">RFC 6238</div>
              <div className="text-text font-medium text-sm">Padrão aberto</div>
              <p className="text-text-3 text-xs">Google Auth, Authy, Bitwarden, 1Password — todos compatíveis.</p>
            </div>
          </div>
        </section>

        {/* Instalação */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 1</span>
            <h2 className="section-title mt-1">Instalação e QR Code</h2>
          </div>

          <CodeBlock code={INSTALL} lang="bash" title="Instalar libpam-google-authenticator" />

          <WarnBox title="Execute como o usuário correto — não como root">
            <p className="text-sm text-text-2">
              O arquivo <code className="font-mono">~/.google_authenticator</code> é criado no home do usuário que executar <code className="font-mono">google-authenticator</code>.
              Se você rodar como root, o 2FA ficará configurado para root — não para seu usuário normal.
              Rode <strong>sempre como o usuário que fará SSH</strong>.
            </p>
          </WarnBox>

          <CodeBlock code={QR_CODE} lang="bash" title="Escaneando o QR code e códigos de emergência" />

          <InfoBox title="Guarde os códigos de emergência">
            <p className="text-sm text-text-2">
              Os <strong>scratch codes</strong> (5 códigos de 8 dígitos) são de uso único e funcionam mesmo sem o celular.
              Imprima ou anote em local seguro offline — eles são sua saída de emergência se perder o celular.
              O arquivo <code className="font-mono">~/.google_authenticator</code> contém a secret key e os scratch codes.
            </p>
          </InfoBox>
        </section>

        {/* PAM Config */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 2</span>
            <h2 className="section-title mt-1">Configurar PAM</h2>
          </div>

          <p className="text-text-2">
            O PAM (Pluggable Authentication Modules) é o sistema que o Linux usa para autenticação.
            Adicionamos o módulo do Google Authenticator ao pipeline de autenticação do SSH.
          </p>

          <CodeBlock code={PAM_CONFIG} lang="bash" title="/etc/pam.d/sshd — adicionar módulo TOTP" />

          <WarnBox title="Posição importa: coloque no início do arquivo">
            <p className="text-sm text-text-2">
              A linha <code className="font-mono">auth required pam_google_authenticator.so</code> deve vir
              <strong> antes</strong> de <code className="font-mono">@include common-auth</code>.
              O PAM processa as regras em ordem — se colocar depois, o SSH pode aceitar sem pedir o código.
            </p>
          </WarnBox>
        </section>

        {/* sshd_config */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 3</span>
            <h2 className="section-title mt-1">Configurar sshd_config</h2>
          </div>

          <CodeBlock code={SSHD_CONFIG} lang="bash" title="/etc/ssh/sshd_config — habilitar KbdInteractiveAuthentication" />

          <InfoBox title="KbdInteractiveAuthentication vs ChallengeResponseAuthentication">
            <p className="text-sm text-text-2">
              Em versões mais recentes do OpenSSH (8.7+), o parâmetro foi renomeado para
              <code className="font-mono"> KbdInteractiveAuthentication</code>.
              Em versões antigas (Debian 10, Ubuntu 20.04), use <code className="font-mono">ChallengeResponseAuthentication</code>.
              O <code className="font-mono">UsePAM yes</code> é obrigatório para que o PAM processe os módulos adicionais.
            </p>
          </InfoBox>
        </section>

        {/* Teste */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Passo 4 — CRÍTICO</span>
            <h2 className="section-title mt-1">Testar sem fechar a sessão atual</h2>
          </div>

          <WarnBox title="Nunca feche o terminal atual antes de testar">
            <p className="text-sm text-text-2">
              Se o 2FA estiver mal configurado e você fechar a sessão SSH atual, ficará <strong>bloqueado</strong> do servidor.
              Sempre abra um <strong>segundo terminal</strong> para testar, mantendo o primeiro aberto como seguro de vida.
            </p>
          </WarnBox>

          <CodeBlock code={TEST_SESSION} lang="bash" title="Testando o 2FA em sessão separada" />

          <HighlightBox title="✅ Sessão funcionou? Marque o checkpoint!">
            <p className="text-sm text-text-2">
              Se o SSH pediu senha E código de verificação, o 2FA está ativo.
              Marque o checkpoint <strong>"ssh-2fa-testado"</strong> acima e desbloqueie o badge 📱 SSH 2FA Master.
            </p>
          </HighlightBox>
        </section>

        {/* Rollback */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Emergência</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <RotateCcw size={22} className="text-warn" />
              Rollback — como reverter se travar
            </h2>
          </div>

          <CodeBlock code={ROLLBACK} lang="bash" title="Revertendo o 2FA" />

          <InfoBox title="Acesso de console como último recurso">
            <p className="text-sm text-text-2">
              Se perder acesso via SSH por completo, use o console do hypervisor (VirtualBox, KVM, Proxmox).
              O console local não passa pelo SSH nem pelo PAM — você acessa o servidor diretamente como se estivesse fisicamente na frente da máquina.
            </p>
          </InfoBox>
        </section>

        {/* Hardening extra */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Avançado</span>
            <h2 className="section-title mt-1">Políticas por usuário ou rede</h2>
          </div>

          <CodeBlock code={HARDENING_EXTRA} lang="bash" title="Match blocks — 2FA seletivo" />

          <InfoBox title="Combinar com Port Knocking e Fail2ban">
            <p className="text-sm text-text-2">
              O 2FA é mais eficaz quando combinado com as outras camadas que você já configurou:
              <strong> Port Knocking</strong> oculta a porta SSH de scanners,
              <strong> Fail2ban</strong> bane IPs que erram o código TOTP repetidamente, e
              <strong> Hardening SSH</strong> desativa autenticação por senha.
              Juntos, tornam o acesso SSH virtualmente invulnerável a ataques automatizados.
            </p>
          </InfoBox>
        </section>

        {/* Exercícios */}
        <section className="space-y-6">
          <div>
            <span className="section-label">Prática</span>
            <h2 className="section-title mt-1 flex items-center gap-2">
              <Terminal size={22} className="text-[var(--mod)]" />
              Exercícios Guiados
            </h2>
          </div>

          <div className="space-y-6">
            {/* Exercício 1 */}
            <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-text flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">1</span>
                Configuração completa do 2FA
              </h3>
              <p className="text-sm text-text-2">
                Execute o fluxo completo: instale o PAM, configure o QR code e ative no SSH.
              </p>
              <CodeBlock
                lang="bash"
                title="Sequência completa de configuração"
                code={`# 1. Instalar dependências
sudo apt install -y libpam-google-authenticator qrencode

# 2. Gerar configuração TOTP (como usuário normal, não root)
google-authenticator -t -d -f -r 3 -R 30 -w 3
# Flags: -t TOTP, -d descartar reuso, -f forçar, -r 3 tentativas, -w 3 janelas

# 3. Ver o QR code no terminal
# (o google-authenticator já exibe durante a configuração)

# 4. Verificar o arquivo gerado
cat ~/.google_authenticator

# 5. Configurar PAM
echo "auth required pam_google_authenticator.so" | sudo tee -a /etc/pam.d/sshd

# 6. Habilitar no sshd_config
sudo sed -i 's/KbdInteractiveAuthentication no/KbdInteractiveAuthentication yes/' /etc/ssh/sshd_config

# 7. Recarregar SSH
sudo systemctl reload ssh`}
              />
            </div>

            {/* Exercício 2 */}
            <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-text flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">2</span>
                Testar com código inválido (simular ataque)
              </h3>
              <p className="text-sm text-text-2">
                Entenda como o sistema rejeita códigos inválidos e como o Fail2ban pode monitorar isso.
              </p>
              <CodeBlock
                lang="bash"
                title="Monitorar tentativas de 2FA em tempo real"
                code={`# Terminal 1 — monitorar logs em tempo real
sudo journalctl -f -u ssh | grep -E "pam|google|authenticat"

# Terminal 2 — tentar SSH com código errado (propositalmente)
ssh usuario@192.168.56.10
# Password: [senha correta]
# Verification code: 000000  ← código errado

# No Terminal 1, você verá:
# sshd[PID]: pam_google_authenticator: Invalid verification code

# Ver todas as tentativas falhas de 2FA
sudo grep "google_authenticator" /var/log/auth.log | tail -20`}
              />
            </div>

            {/* Exercício 3 */}
            <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-text flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">3</span>
                Integrar com Fail2ban
              </h3>
              <p className="text-sm text-text-2">
                Crie uma jail no Fail2ban para banir IPs que errarem o código TOTP.
              </p>
              <CodeBlock
                lang="bash"
                title="Fail2ban jail para tentativas TOTP inválidas"
                code={`# Criar filtro para erros de google-authenticator
sudo tee /etc/fail2ban/filter.d/sshd-2fa.conf << 'EOF'
[Definition]
failregex = sshd\[.*\]: pam_google_authenticator: Invalid verification code for <HOST>
            sshd\[.*\]: error: PAM: Authentication failure for .* from <HOST>
ignoreregex =
EOF

# Adicionar jail no jail.local
sudo tee -a /etc/fail2ban/jail.local << 'EOF'
[sshd-2fa]
enabled  = true
port     = ssh
filter   = sshd-2fa
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 3600
findtime = 600
EOF

# Recarregar Fail2ban
sudo systemctl reload fail2ban

# Verificar se a jail está ativa
sudo fail2ban-client status sshd-2fa`}
              />
            </div>
          </div>
        </section>

        {/* Badge hint */}
        <HighlightBox title="📱 Badge: SSH 2FA Master">
          <p className="text-sm text-text-2">
            Complete os 3 checkpoints deste módulo para desbloquear o badge <strong>SSH 2FA Master</strong>.
            Você terá protegido seu servidor com autenticação de dois fatores — uma das práticas mais eficazes contra acesso não autorizado.
          </p>
        </HighlightBox>

        <WindowsComparisonBox
          windowsLabel="Windows — Windows Hello / Microsoft Authenticator"
          linuxLabel="Linux — PAM + Google Authenticator (TOTP)"
          windowsCode={`# Windows — MFA para login e RDP

# 1. Windows Hello for Business (biometria + PIN)
#    Configurar via Intune ou GPO:
#    Computer Config → Admin Templates →
#      Windows Components → Windows Hello for Business →
#      "Use Windows Hello for Business" → Enabled

# 2. Microsoft Authenticator para Azure AD / RDP:
#    Azure AD → Security → MFA → Conditional Access →
#    Exigir MFA para: RDP / VPN / SSH via Azure Bastion

# 3. Duo Security — MFA para RDP (on-premise):
#    Instalar Duo Authentication for Windows Logon
#    Configurar: duo.com → Applications → Microsoft RDP
#    O usuário recebe push no app após inserir a senha

# 4. Windows SSH com MFA via OpenSSH + TOTP:
#    (OpenSSH nativo no Windows 10+)
Add-WindowsCapability -Online -Name OpenSSH.Server
Set-Service -Name sshd -StartupType Automatic
Start-Service sshd

# Configurar MFA: instalar win-totp e editar sshd_config
# Localização: C:\\ProgramData\\ssh\\sshd_config
# KbdInteractiveAuthentication yes`}
          linuxCode={`# Linux — SSH com 2FA via PAM + Google Authenticator

# 1. Instalar a biblioteca PAM do Google Authenticator:
apt install libpam-google-authenticator -y

# 2. Configurar para cada usuário:
google-authenticator
# Escolhas recomendadas:
# - Time-based tokens: y (TOTP — RFC 6238)
# - Atualizar .google_authenticator: y
# - Limitar a 3 códigos simultâneos: y
# - Rate limiting (3 tentativas a cada 30s): y
# Escanear QR code com o Microsoft/Google Authenticator

# 3. Configurar PAM para SSH usar o autenticador:
# Adicionar em /etc/pam.d/sshd (no INÍCIO):
# auth required pam_google_authenticator.so

# 4. Configurar sshd para pedir o código TOTP:
# /etc/ssh/sshd_config:
# KbdInteractiveAuthentication yes
# AuthenticationMethods publickey,keyboard-interactive
systemctl restart sshd

# 5. Testar login (pede senha + código TOTP):
# ssh usuario@servidor
# Verification code: [6 dígitos do app]`}
        />

        <ModuleNav currentPath="/ssh-2fa" />
      </div>
    </main>
  );
}
