'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { AlertOctagon, Eye, ShieldOff, Archive, Clock, Search, Trash2, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint CÓDICE — Resposta a Incidentes (DFIR), baseado no NIST SP 800-61.
   Capstone de segurança: o que fazer quando, mesmo com toda a defesa, algo deu errado. */

type IrTab = 'deteccao' | 'analise' | 'recuperacao';

const CHECKLIST_ITEMS = [
  { id: 'ir-deteccao',     label: 'Sei reconhecer os sinais de comprometimento e rodar os comandos de detecção rápida sem reiniciar a máquina' },
  { id: 'ir-contencao',    label: 'Sei isolar a máquina sem desligar, tirar snapshot e coletar os dados voláteis (ir_collect.sh) antes de qualquer análise' },
  { id: 'ir-pos-incidente', label: 'Completei o ciclo: erradicação, recuperação validada com nmap e o pós-incidente documentado' },
];

export default function RespostaIncidentesPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<IrTab>('deteccao');

  useEffect(() => {
    trackPageVisit('/resposta-incidentes');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-resposta-incidentes min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Resposta a Incidentes</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo C05 · Capstone de Segurança</div>
          <h1 className="text-4xl font-bold mb-4">🚨 Resposta a Incidentes (DFIR)</h1>
          <p className="text-text-2 text-lg mb-6">
            Detecção · contenção · preservação · timeline · análise · erradicação · recuperação ·
            pós-incidente — o que fazer quando, mesmo com firewall, hardening e Fail2ban,{' '}
            <strong>algo deu errado</strong>. Você não improvisa: segue o ciclo do NIST.
          </p>
          <p className="text-text-3 text-sm">
            Um sistema nunca é 100% seguro. A diferença entre o amador e o profissional não é
            nunca ser comprometido — é saber exatamente o que fazer quando isso acontece.
          </p>
        </div>

        {/* FluxoCard — ciclo NIST */}
        <FluxoCard
          title="O ciclo de Resposta a Incidentes (NIST SP 800-61)"
          steps={[
            { label: 'Detecção',     sub: 'perceber que algo está errado',                icon: <Eye size={14}/>,        color: 'border-warn/50' },
            { label: 'Contenção',    sub: 'isolar sem desligar — parar o sangramento',     icon: <ShieldOff size={14}/>,  color: 'border-err/50' },
            { label: 'Preservação',  sub: 'coletar evidências voláteis antes que sumam',   icon: <Archive size={14}/>,    color: 'border-info/50' },
            { label: 'Timeline',     sub: 'reconstruir o que aconteceu e quando',          icon: <Clock size={14}/>,      color: 'border-accent/50' },
            { label: 'Análise',      sub: 'entender como entrou e o que fez',              icon: <Search size={14}/>,     color: 'border-layer-6/50' },
            { label: 'Erradicação',  sub: 'remover o invasor e a persistência',            icon: <Trash2 size={14}/>,     color: 'border-err/50' },
            { label: 'Recuperação',  sub: 'voltar a operar — devagar e validado',          icon: <RotateCcw size={14}/>,  color: 'border-ok/50' },
            { label: 'Pós-incidente', sub: 'documentar, aprender, melhorar',               icon: <CheckCircle size={14}/>, color: 'border-layer-3/50' },
          ]}
        />

        {/* Tabs */}
        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'deteccao',    label: '🔍 Detecção & Contenção' },
              { id: 'analise',     label: '🔬 Preservação, Timeline & Análise' },
              { id: 'recuperacao', label: '🛠️ Erradicação, Recuperação & Exercícios' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as IrTab)}
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

        {/* ── TAB 1: Detecção & Contenção ───────────────────────────────────── */}
        {isActive('deteccao') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. A regra de ouro — NÃO reinicie</h2>
          <p className="text-text-2 mb-4">
            Reiniciar parece a solução mais óbvia. Na maioria das vezes, é a pior coisa que
            você pode fazer. O reboot <strong>destrói as evidências voláteis</strong>: conexões
            de rede ativas, processos em execução (incluindo o do atacante), conteúdo da RAM e
            sessões abertas. Sem isso, você nunca saberá <em>como</em> ele entrou nem <em>se</em>{' '}
            ele ainda está lá.
          </p>
          <WarnBox title="PRESERVE ANTES DE AGIR">
            Só reinicie a máquina <strong>depois</strong> de: (1) coletar os dados voláteis,
            (2) tirar o snapshot no Proxmox e (3) preservar os logs em local seguro. Calma,
            foco — nesta ordem.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Detecção — como saber que algo está errado</h2>
          <p className="text-text-2 mb-4">
            Nem toda invasão chega com bandeira vermelha. Os <strong>sinais sutis</strong> são
            os mais perigosos porque passam despercebidos por dias.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-bg-2 border border-err/30">
              <p className="font-bold text-err mb-2 text-sm">🚩 Sinais óbvios</p>
              <ul className="text-sm text-text-2 space-y-1 list-disc pl-4">
                <li>Página web trocada por &quot;YOU HAVE BEEN HACKED&quot;</li>
                <li>Arquivos criptografados com extensão estranha (ransomware)</li>
                <li>Sua senha de root não funciona mais</li>
                <li>Alerta de intrusão no IDS/IPS do firewall de borda</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-bg-2 border border-warn/30">
              <p className="font-bold text-warn mb-2 text-sm">🔍 Sinais sutis (os perigosos)</p>
              <ul className="text-sm text-text-2 space-y-1 list-disc pl-4">
                <li>CPU/RAM alta sem processo aparente (mineração de cripto)</li>
                <li>Tráfego de saída alto e inexplicado (exfiltração)</li>
                <li>Usuário, cron job ou serviço que você não criou</li>
                <li>Processo com nome genérico (<code>kworker2</code>, <code>systemd-x</code>)</li>
                <li>Logs apagados ou com gaps · comandos estranhos no history</li>
              </ul>
            </div>
          </div>
          <p className="text-text-2 mb-3">Comandos de detecção rápida — rode sem reiniciar nada:</p>
          <CodeBlock lang="bash" code={`# Quem está logado AGORA?
w ; who
last -F | head -20            # últimos logins com data/hora
lastb | head -20              # tentativas de login que FALHARAM

# Conexões de rede ativas neste instante
ss -tuna                      # todas as conexões TCP/UDP
ss -tnp                       # conexões com o processo associado

# Processos suspeitos
ps auxf                       # árvore de processos
lsof | grep deleted           # binário apagado mas ainda em execução (ocultação clássica)

# Arquivos suspeitos
find /tmp /var/tmp /dev/shm -type f -executable   # executáveis em diretórios temporários
find / -xdev -mtime -1 -type f 2>/dev/null        # modificados nas últimas 24h

# Cron jobs de TODOS os usuários
for u in $(cut -f1 -d: /etc/passwd); do
    echo "=== $u ==="; crontab -u "$u" -l 2>/dev/null
done`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Contenção — parar o sangramento</h2>
          <p className="text-text-2 mb-4">
            Confirmou o comprometimento? O primeiro passo é <strong>cortar o acesso do
            atacante</strong> — sem desligar a máquina, para não perder a RAM e os processos.
          </p>
          <InfoBox title="Isolar a VM sem desligar — via Proxmox">
            No Proxmox, selecione a VM → <strong>Network</strong> → desconecte a interface de
            rede. A VM continua rodando e você acessa pelo <strong>console</strong> do Proxmox
            — o atacante perde a conexão, mas os dados voláteis ficam preservados.
          </InfoBox>
          <p className="text-text-2 mt-4 mb-3">
            Se precisar conter pelo terminal da própria máquina — bloqueie a entrada, mas
            mantenha a saída livre para conseguir coletar e enviar as evidências:
          </p>
          <CodeBlock lang="bash" code={`# Contenção via iptables — bloqueia entrada, preserva a coleta de evidências
iptables -P INPUT   DROP
iptables -P FORWARD DROP
iptables -P OUTPUT  ACCEPT          # mantém a saída livre (envio de logs/evidências)
iptables -A INPUT -i lo -j ACCEPT
iptables -A INPUT -s <SEU_IP_ADMIN> -j ACCEPT   # não se tranque para fora!

# Encerrar a sessão ativa do invasor
ps auxf | grep sshd                 # achar o PID da sessão SSH dele
kill -9 <PID>

# Bloquear o IP do atacante (sem destruir evidências)
iptables -A INPUT -s <IP-ATACANTE> -j DROP

# Travar a conta suspeita SEM deletar (preserva a evidência)
passwd -l <usuario-suspeito>
usermod -s /sbin/nologin <usuario-suspeito>`} />
          <WarnBox title="Por que OUTPUT ACCEPT e não DROP?" className="mt-4">
            Bloquear toda a saída interrompe a coleta remota de logs e o envio de evidências.
            Em contenção de homelab, cortar a <strong>entrada</strong> já corta o atacante. Só
            bloqueie a saída depois de garantir seu acesso e copiar as evidências para fora.
          </WarnBox>
          <p className="text-text-2 mt-4 mb-3">
            E o passo que vale ouro — o <strong>snapshot</strong>, sua evidência forense:
          </p>
          <CodeBlock lang="text" code={`Proxmox → VM → Snapshots → Take Snapshot → "comprometida-[data-hora]"

Esse snapshot congela o estado exato da máquina para análise posterior.
NÃO DELETE — é a sua prova forense.`} />

          <WindowsComparisonBox
            windowsLabel="Windows (DFIR)"
            linuxLabel="Linux (DFIR)"
            windowsCode={`# Detecção e coleta no Windows
Get-EventLog Security -Newest 50      # eventos de segurança
Get-Process | Sort CPU -Descending    # processos por CPU
Get-NetTCPConnection                  # conexões de rede ativas
# Sysmon (Sysinternals) registra processos,
# conexões e criação de arquivos para forense.
# Coleta de RAM: ferramentas como WinPmem / Magnet RAM Capture.`}
            linuxCode={`# Detecção e coleta no Linux
last -F ; lastb                        # logins (ok e falhos)
ps auxf ; top -n 1                     # processos
ss -tuna                               # conexões de rede ativas
# journald + auth.log registram a história do sistema.
# Coleta de RAM: LiME / volatility para dump de memória.
# Princípio idêntico: preservar o volátil ANTES de mexer.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['ir-deteccao']} onChange={e => updateChecklist('ir-deteccao', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['ir-deteccao'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2: Preservação, Timeline & Análise ────────────────────────── */}
        {isActive('analise') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Preservação — salvar as evidências</h2>
          <p className="text-text-2 mb-4">
            Evidência volátil desaparece com o tempo — ou com o reboot. Colete agora, analise
            depois. A ordem importa: do <strong>mais volátil para o menos volátil</strong>.
          </p>
          <CodeBlock lang="bash" code={`# Registre o incidente e grave tudo que você digitar no terminal
echo "$(date -Is) - Início IR em $(hostname)" >> /var/log/incident_$(date +%F).log
script /tmp/ir_session_$(date +%F_%H%M).log   # grava a sessão; encerre com: exit

OUTDIR="/tmp/ir_$(hostname)_$(date +%F_%H%M)"; mkdir -p "$OUTDIR"
date > "$OUTDIR/datetime.txt"          # 1. âncora de tempo da timeline
w > "$OUTDIR/logged_users.txt"         # 2. usuários logados
ss -tuna > "$OUTDIR/connections.txt"   # 3. conexões de rede
ps auxf > "$OUTDIR/processes.txt"      # 4. processos
lsof -n > "$OUTDIR/open_files.txt"     # 5. arquivos abertos
cp /var/log/auth.log "$OUTDIR/"        # 6. logs críticos
journalctl --no-pager -n 2000 > "$OUTDIR/journal.txt"

# Compactar e calcular o hash — garante a integridade da evidência
tar czf /tmp/ir_evidence_$(hostname)_$(date +%F_%H%M).tgz "$OUTDIR"
sha256sum /tmp/ir_evidence_*.tgz > /tmp/ir_evidence.sha256

# Copie as evidências para FORA da máquina comprometida (do seu PC confiável):
#   scp usuario@servidor:/tmp/ir_evidence_*.tgz ./evidencias/`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Timeline — reconstruir o que aconteceu</h2>
          <p className="text-text-2 mb-4">
            A timeline responde as perguntas mais importantes: <strong>quando</strong> o invasor
            entrou, <strong>o que fez primeiro</strong> e <strong>quanto tempo</strong> ficou
            sem ser detectado (o <em>dwell time</em>). Sem timeline, você opera no escuro.
          </p>
          <CodeBlock lang="bash" code={`# Eventos do sistema e logins ordenados
journalctl --since "24 hours ago" --no-pager > /tmp/timeline_journal.txt
last -F > /tmp/timeline_logins.txt

# Quando arquivos críticos foram modificados pela última vez —
# essas datas são as ÂNCORAS da timeline:
stat /root/.ssh/authorized_keys   # quando a chave foi adicionada?
stat /etc/passwd                  # quando um usuário foi criado?
stat /etc/crontab                 # quando um cron job foi inserido?
stat /etc/sudoers                 # quando permissões sudo mudaram?

# Se stat /etc/passwd mostra modificação às 03:52 e o login suspeito
# foi às 03:47 → você tem a sequência exata do ataque.`} />
          <InfoBox title="Perguntas que a timeline deve responder" className="mt-4">
            Quando o invasor entrou pela primeira vez? Quanto tempo ficou sem ser detectado?
            Qual foi a primeira ação dele? Ele criou persistência (usuário, cron, chave SSH)?
            Acessou outros sistemas a partir daqui? Exfiltrou dados?
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Análise — entender como entrou</h2>
          <p className="text-text-2 mb-4">
            Só depois de preservar e construir a timeline você analisa. O objetivo: entender{' '}
            <strong>como entrou</strong>, <strong>o que fez</strong> e <strong>onde mais pode
            estar</strong>.
          </p>
          <CodeBlock lang="bash" code={`# De onde vieram os logins SSH bem-sucedidos
grep "Accepted" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn

# O que o invasor fez — histórico e arquivos recentes
cat /root/.bash_history
find / -xdev -newer /var/log/auth.log -type f 2>/dev/null

# Integridade dos binários do sistema (detecta rootkit clássico)
debsums -s                        # lista pacotes com arquivos alterados

# Persistência — como ele planejava voltar
cat /root/.ssh/authorized_keys                          # chaves não autorizadas
awk -F: '$3 >= 1000 {print $1, $3, $6}' /etc/passwd     # usuários criados
find / -xdev -perm /4000 -type f 2>/dev/null            # binários SUID suspeitos

# Tráfego em tempo real — ele ainda está se comunicando? Para onde?
tcpdump -i any -nn not port 22                          # tudo exceto seu SSH

# Verificadores de rootkit (segunda e terceira opinião)
chkrootkit ; rkhunter --check ; lynis audit system`} />
          <InfoBox title="Hash de binário suspeito" className="mt-4">
            Calcule <code>sha256sum /caminho/do/binario</code> e pesquise o hash no VirusTotal
            ou no MalwareBazaar. Hash encontrado nessas bases = malware confirmado. Hash limpo
            <strong> não garante</strong> que é seguro — malware novo pode ainda não estar indexado.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['ir-contencao']} onChange={e => updateChecklist('ir-contencao', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['ir-contencao'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. O kit de resposta — <code>ir_collect.sh</code></h2>
          <p className="text-text-2 mb-4">
            Em crise, você não tem tempo de lembrar comandos. Salve este script{' '}
            <strong>antes</strong> de precisar — em <code>/usr/local/bin/ir_collect.sh</code>{' '}
            com <code>chmod +x</code> — e rode <code>sudo bash ir_collect.sh</code> assim que
            suspeitar de um incidente.
          </p>
          <CodeBlock lang="bash" code={`#!/bin/bash
# ir_collect.sh — coleta de dados voláteis para resposta a incidente
OUTDIR="/tmp/ir_$(hostname)_$(date +%F_%H%M)"; mkdir -p "$OUTDIR"
log() { echo "$(date -Is) $1" | tee -a "$OUTDIR/ir_log.txt"; }

log "Início da coleta em $(hostname)"
date              > "$OUTDIR/datetime.txt"
w                 > "$OUTDIR/logged_users.txt"
last -F | head -50 > "$OUTDIR/last_logins.txt"
lastb  | head -50 > "$OUTDIR/failed_logins.txt"
ss -tuna          > "$OUTDIR/connections.txt"
ps auxf           > "$OUTDIR/processes.txt"
lsof | grep deleted > "$OUTDIR/deleted_but_running.txt"
cat /etc/passwd   > "$OUTDIR/passwd.txt"
cat /etc/crontab  > "$OUTDIR/crontab_system.txt"
crontab -l -u root >> "$OUTDIR/crontab_root.txt" 2>/dev/null
find /tmp /var/tmp /dev/shm -type f -executable > "$OUTDIR/suspicious_exec.txt"
cp /root/.bash_history "$OUTDIR/root_history.txt" 2>/dev/null
cp /var/log/auth.log "$OUTDIR/" 2>/dev/null
journalctl --no-pager -n 2000 > "$OUTDIR/journal.txt"
iptables-save     > "$OUTDIR/iptables_rules.txt"

ARCHIVE="/tmp/ir_evidence_$(hostname)_$(date +%F_%H%M).tgz"
tar czf "$ARCHIVE" "$OUTDIR"
sha256sum "$ARCHIVE" > "$ARCHIVE.sha256"
log "Coleta concluída — evidências em: $ARCHIVE"`} />
        </section>

        </>)}

        {/* ── TAB 3: Erradicação, Recuperação & Exercícios ──────────────────── */}
        {isActive('recuperacao') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Erradicação — remover o invasor</h2>
          <p className="text-text-2 mb-4">
            Depois de entender o que aconteceu, você limpa. Mas só limpa o que tem{' '}
            <strong>certeza</strong> do que é.
          </p>
          <CodeBlock lang="bash" code={`# Remover acesso não autorizado
userdel -r <usuario-invasor>           # deletar usuário criado pelo invasor
kill -9 <PID>                          # matar processo malicioso
crontab -e -u root                     # remover a linha de cron suspeita

# Trocar TODAS as credenciais — sem exceção
passwd root ; passwd <seu-usuario>
> /root/.ssh/authorized_keys           # limpa as chaves
ssh-keygen -t ed25519                  # gera novo par
rm /etc/ssh/ssh_host_* && dpkg-reconfigure openssh-server   # novos host keys

# Fechar o vetor de entrada — patch é a melhor proteção
apt update && apt dist-upgrade -y`} />
          <WarnBox title="Quando NÃO tentar limpar — e reconstruir do zero" className="mt-4">
            Se você não consegue identificar com certeza <strong>tudo</strong> que o invasor
            fez, não confie mais na máquina. Máquina comprometida sem forense clara ={' '}
            <strong>reconstruir do zero</strong>: destrua a VM, crie uma nova, restaure apenas
            os <em>dados</em> (não o sistema) do backup e feche o vetor antes de recolocar no ar.
            É mais rápido e mais seguro do que limpar o que você não vê.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Recuperação — voltar com segurança</h2>
          <p className="text-text-2 mb-4">
            Voltar rápido demais é cometer o mesmo erro. Volte devagar, volte certo — e{' '}
            <strong>valide com nmap externo</strong> antes de reintegrar à rede.
          </p>
          <CodeBlock lang="bash" code={`# Validação externa — do Kali na VLAN de lab, escaneie o servidor recuperado:
nmap -sS -p- <IP-do-servidor>

# Compare com a lista de portas ESPERADAS:
#   22 (SSH), 80 (HTTP), 443 (HTTPS) → esperadas
#   qualquer outra porta aberta → ALERTA, investigue antes de liberar

# Confirme também o que escuta internamente:
ss -tlnp`} />
          <div className="mt-4 p-4 rounded-lg bg-bg-2 border border-border">
            <p className="font-bold text-sm text-text mb-2">☑ Checklist antes de voltar ao ar</p>
            <ul className="text-sm text-text-2 space-y-1 list-disc pl-5">
              <li>Sistema reinstalado do zero ou snapshot limpo restaurado</li>
              <li>Todas as senhas trocadas · novas chaves SSH geradas</li>
              <li>Software atualizado · vetor de entrada identificado e FECHADO</li>
              <li>Fail2ban rodando · firewall revisado · monitoramento de logs ativo</li>
              <li>Resultado do <code>nmap</code> bate com as portas esperadas</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Pós-incidente — o mais ignorado e o mais valioso</h2>
          <p className="text-text-2 mb-4">
            A maioria resolve o incidente e segue em frente. Quem aprende de verdade faz o
            pós-incidente — um <em>postmortem</em> sem culpa, focado no sistema, não na pessoa.
          </p>
          <InfoBox title="Análise de causa raiz — as perguntas que importam">
            Por que o incidente aconteceu? (senha fraca? software desatualizado? porta
            desnecessária aberta?) · Como foi detectado — e, se você não viu, o que faltava
            de monitoramento? · Qual foi o <em>dwell time</em>? · Ele se moveu lateralmente
            para outras VMs? · O que muda nos seus playbooks de prevenção a partir de agora?
          </InfoBox>
          <p className="text-text-2 mt-4">
            Documente o incidente completo, atualize o checklist de defesa com o que faltava
            e — crucial — <strong>teste o backup agora</strong>. Backup não testado não existe.
          </p>

          <div className="mt-6 p-5 rounded-xl bg-bg-2 border border-[var(--mod)]/40">
            <p className="font-bold text-text mb-3">💡 Os 7 mandamentos da resposta a incidente</p>
            <ol className="text-sm text-text-2 space-y-1.5 list-decimal pl-5">
              <li>Não reinicie imediatamente. Preserve evidências antes de agir.</li>
              <li>Isole antes de analisar. Corte o acesso do atacante primeiro.</li>
              <li>Documente tudo com timestamp. Cada ação, cada descoberta.</li>
              <li>Colete evidências voláteis primeiro — elas somem com o tempo.</li>
              <li>Entenda como entrou antes de limpar. Sem isso, ele volta.</li>
              <li>Quando em dúvida: destrua e reconstrua do zero.</li>
              <li>Pós-incidente é obrigatório. Aprenda, melhore, documente.</li>
            </ol>
          </div>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['ir-pos-incidente']} onChange={e => updateChecklist('ir-pos-incidente', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['ir-pos-incidente'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados — Tabletop Exercise</h2>
          <p className="text-text-2 mb-6">
            Um <strong>tabletop exercise</strong> é um simulado de incidente — você percorre o
            cenário no papel e descobre onde sua resposta falharia. Empresas com SOC fazem isso
            trimestralmente; descobrir os buracos no treino é infinitamente melhor do que
            descobrir durante um incidente real às 2h da manhã.
          </p>

          <div className="space-y-5">
            <div className="p-5 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-ok mb-1">🎯 Exercício 1 — O Intruso Silencioso <span className="text-text-3 font-normal text-xs">· Iniciante</span></p>
              <p className="text-text-2 text-sm mb-2">
                14h de uma terça. O monitoramento alerta: CPU da VM de produção em 95% há 20
                minutos. Você não rodou nada que justifique isso.
              </p>
              <p className="text-sm text-text-3"><strong className="text-text-2">Responda:</strong> Qual seu primeiro comando? Como determina se o processo é legítimo ou malicioso? Como isola sem derrubar a VM? Quais evidências coleta antes de agir? Como sabe se ele criou persistência?</p>
            </div>

            <div className="p-5 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-warn mb-1">🎯 Exercício 2 — A Porta dos Fundos <span className="text-text-3 font-normal text-xs">· Intermediário</span></p>
              <p className="text-text-2 text-sm mb-2">
                Domingo de manhã, revisando logs, você acha no <code>auth.log</code>:{' '}
                <code className="text-xs">Accepted publickey for root from 185.220.101.47</code> —
                login às 03:47, um IP que você não reconhece. Você estava dormindo.
              </p>
              <p className="text-sm text-text-3"><strong className="text-text-2">Responda:</strong> Como descobre o que o invasor fez entre 03:47 e agora? Como sabe se ele ainda está no sistema? Como a chave dele chegou no <code>authorized_keys</code>? Como fecha o acesso sem se trancar para fora?</p>
            </div>

            <div className="p-5 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-err mb-1">🎯 Exercício 3 — O Efeito Dominó <span className="text-text-3 font-normal text-xs">· Avançado</span></p>
              <p className="text-text-2 text-sm mb-2">
                Segunda de manhã: três VMs do Proxmox inacessíveis, a quarta responde ping mas
                não conecta SSH. Você não mexeu em nada no fim de semana.
              </p>
              <p className="text-sm text-text-3"><strong className="text-text-2">Responda:</strong> Qual a sequência dos primeiros 10 minutos? Como acessa as VMs sem SSH? Como determina se é falha de config ou comprometimento? Seus backups são anteriores à invasão? Em que ordem recupera os serviços?</p>
            </div>
          </div>

          <InfoBox title="Como conduzir o seu" className="mt-6">
            Escolha um cenário, abra este módulo e percorra cada bloco respondendo &quot;o que
            eu faria agora?&quot;. Onde você travar ou não souber = lacuna no seu preparo.
            Estude o que faltava e repita depois. Faça a primeira vez <strong>antes</strong> de
            qualquer incidente real.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Reiniciar a máquina assim que percebe o problema', sol: 'O reboot apaga RAM, processos e conexões — as evidências mais valiosas. Preserve primeiro, reinicie por último.' },
              { erro: 'Começar a deletar arquivos do atacante imediatamente', sol: 'Sem entender o vetor de entrada e a persistência, ele volta em horas. Analise antes de erradicar.' },
              { erro: 'Bloquear OUTPUT inteiro na contenção', sol: 'Interrompe a coleta e o envio de evidências — e pode te trancar para fora. Corte a ENTRADA; libere a saída até copiar tudo.' },
              { erro: 'Confiar numa máquina "limpa" sem forense clara', sol: 'Se você não tem certeza de tudo que o invasor fez, reconstrua do zero. Limpeza parcial é falsa sensação de segurança.' },
              { erro: 'Restaurar backup sem verificar a data da invasão', sol: 'Você pode restaurar um backup que já está comprometido. Use a timeline para escolher um ponto anterior ao dwell time.' },
              { erro: 'Resolver o incidente e seguir em frente', sol: 'Sem pós-incidente, o mesmo vetor é explorado de novo. O postmortem blameless é onde o aprendizado real acontece.' },
            ].map((e, i) => (
              <details key={i} className="p-4 rounded-lg bg-bg-2 border border-border">
                <summary className="cursor-pointer font-medium text-text flex items-center gap-2">
                  <AlertOctagon size={15} className="text-err shrink-0" /> {e.erro}
                </summary>
                <p className="text-sm text-text-2 mt-2 pl-6">{e.sol}</p>
              </details>
            ))}
          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/resposta-incidentes" />

      </div>
    </main>
  );
}
