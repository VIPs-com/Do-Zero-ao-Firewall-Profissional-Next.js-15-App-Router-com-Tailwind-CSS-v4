'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, FolderOpen, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const FHS_CHECKLIST = [
  { id: 'fhs-explorado', text: 'Explorei o FHS: naveguei por /etc, /var, /usr e /home no terminal' },
];

const EXPLORE_CMD = `# Explore a hierarquia de diretórios do seu Linux
ls /           # Raiz — tudo começa aqui
ls /etc        # Arquivos de configuração do sistema
ls /var/log    # Logs do sistema e dos serviços
ls /usr/bin    # Programas instalados para todos os usuários
ls /home       # Diretório pessoal dos usuários
ls /tmp        # Arquivos temporários (limpo a cada boot)
ls /proc       # Informações ao vivo do kernel (não é disco!)
ls /dev        # Dispositivos (HD, USB, terminais)`;

const FIND_FILES_CMD = `# Encontrar arquivos de configuração
find /etc -name "*.conf" -type f | head -20

# Qual pacote criou esse arquivo?
dpkg -S /etc/ssh/sshd_config
# Saída: openssh-server: /etc/ssh/sshd_config

# Ver estrutura de um diretório (instalar se necessário)
sudo apt install tree -y
tree /etc/ssh`;

const DIRS = [
  { path: '/etc',      icon: '⚙️',  desc: 'Configurações do sistema e serviços', windows: 'C:\\Windows\\System32 (configs)', color: 'text-accent' },
  { path: '/var',      icon: '📊',  desc: 'Dados variáveis: logs, cache, filas', windows: 'C:\\Windows\\Logs', color: 'text-info' },
  { path: '/usr',      icon: '📦',  desc: 'Programas e bibliotecas instalados',   windows: 'C:\\Program Files', color: 'text-ok' },
  { path: '/home',     icon: '🏠',  desc: 'Diretório pessoal de cada usuário',   windows: 'C:\\Users\\', color: 'text-warn' },
  { path: '/root',     icon: '👑',  desc: 'Home do superusuário (root)',          windows: 'C:\\Users\\Administrator', color: 'text-err' },
  { path: '/tmp',      icon: '🗑️',  desc: 'Arquivos temporários — limpo no boot', windows: 'C:\\Windows\\Temp', color: 'text-text-2' },
  { path: '/bin & /sbin', icon: '⚡', desc: 'Programas essenciais e de sistema', windows: 'C:\\Windows\\System32 (exe)', color: 'text-layer-3' },
  { path: '/lib',      icon: '📚',  desc: 'Bibliotecas compartilhadas (.so)',    windows: 'C:\\Windows\\System32 (dll)', color: 'text-layer-6' },
  { path: '/dev',      icon: '🔌',  desc: 'Dispositivos físicos e virtuais',     windows: 'Gerenciador de Dispositivos', color: 'text-layer-4' },
  { path: '/proc',     icon: '🔬',  desc: 'Pseudo-fs do kernel (não é disco!)',  windows: 'Task Manager → APIs', color: 'text-layer-7' },
  { path: '/opt',      icon: '🎁',  desc: 'Software de terceiros (opcional)',     windows: 'C:\\Program Files (x86)', color: 'text-text-3' },
  { path: '/boot',     icon: '🚀',  desc: 'Kernel e arquivos de boot',           windows: 'Partição EFI / Boot', color: 'text-text-3' },
];

export default function FHSPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/fhs');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = FHS_CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-accent-fundamentos">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/fundamentos">Fundamentos Linux</Link>
        <span>/</span>
        <span className="text-text-2">Estrutura FHS</span>
      </div>

      <div className="section-label">Módulo 01 · Trilha Fundamentos</div>
      <h1 className="section-title">🗂️ Estrutura do Sistema (FHS)</h1>
      <p className="section-sub">
        No Windows você tem <code>C:\</code>. No Linux existe o <strong>FHS — Filesystem Hierarchy Standard</strong>.
        Tudo no Linux é um arquivo, e todos os arquivos nascem da raiz (<code>/</code>).
        Entender onde cada coisa fica é o primeiro passo para administrar qualquer servidor.
      </p>

      <FluxoCard
        title="O Mapa do Sistema Linux"
        steps={[
          { label: '/',      sub: 'A raiz — tudo começa aqui',        icon: <HardDrive className="w-4 h-4" />, color: 'border-accent/50' },
          { label: '/etc',   sub: 'Configurações dos serviços',        icon: <span className="text-xs">⚙️</span>, color: 'border-info/50' },
          { label: '/var',   sub: 'Logs e dados variáveis',            icon: <span className="text-xs">📊</span>, color: 'border-warn/50' },
          { label: '/home',  sub: 'Seus arquivos pessoais',            icon: <span className="text-xs">🏠</span>, color: 'border-ok/50' },
          { label: '/usr',   sub: 'Programas instalados',              icon: <FolderOpen className="w-4 h-4" />, color: 'border-layer-6/50' },
        ]}
      />

      <div className="space-y-14">

        {/* ── Seção 1: Tabela de Diretórios ── */}
        <section id="diretorios">
          <h2 className="text-2xl font-bold mb-2">Os Diretórios Essenciais</h2>
          <p className="text-text-2 text-sm mb-6">
            Cada diretório tem um propósito bem definido. Compare com o que você já conhece do Windows:
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {DIRS.map(d => (
              <div key={d.path} className="flex gap-3 p-4 rounded-xl bg-bg-2 border border-border hover:border-[rgba(99,102,241,0.4)] transition-colors">
                <span className="text-xl shrink-0">{d.icon}</span>
                <div className="min-w-0">
                  <code className={cn("text-sm font-bold font-mono", d.color)}>{d.path}</code>
                  <p className="text-xs text-text-2 mt-0.5">{d.desc}</p>
                  <p className="text-[10px] text-text-3 mt-1 font-mono">Windows: {d.windows}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Seção 2: Prática ── */}
        <section id="pratica">
          <h2 className="text-2xl font-bold mb-2">Explore no Terminal</h2>
          <p className="text-text-2 text-sm mb-4">
            Abra um terminal e rode cada comando. Não precisa ser root para explorar — apenas para modificar.
          </p>
          <CodeBlock code={EXPLORE_CMD} lang="bash" title="Exploração básica do FHS" />

          <InfoBox title="Tudo é arquivo" className="mt-6">
            <p className="text-sm text-text-2">
              No Linux, <strong>dispositivos, processos, sockets e configurações</strong> são todos representados como arquivos.
              Um HD é <code>/dev/sda</code>, a memória RAM vive em <code>/proc/meminfo</code> e
              a configuração do SSH fica em <code>/etc/ssh/sshd_config</code>.
              Esta abstração é o que torna o Linux tão poderoso para automação.
            </p>
          </InfoBox>
        </section>

        {/* ── Seção 3: Encontrar arquivos ── */}
        <section id="encontrar">
          <h2 className="text-2xl font-bold mb-2">Encontrando Arquivos</h2>
          <p className="text-text-2 text-sm mb-4">
            Saber <em>onde</em> um arquivo fica é fundamental para configurar serviços e diagnosticar problemas.
          </p>
          <CodeBlock code={FIND_FILES_CMD} lang="bash" title="Localizar configurações" />
        </section>

        {/* ── Seção 4: Dicas rápidas ── */}
        <section id="dicas">
          <h2 className="text-2xl font-bold mb-4">Referência Rápida</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">📌 Logs do sistema</p>
              <code className="text-xs text-ok font-mono">/var/log/syslog</code>
              <p className="text-xs text-text-3 mt-1">Principal log do sistema no Ubuntu/Debian. Veja com <code>tail -f /var/log/syslog</code></p>
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">📌 Configuração do SSH</p>
              <code className="text-xs text-ok font-mono">/etc/ssh/sshd_config</code>
              <p className="text-xs text-text-3 mt-1">Você vai editar este arquivo no módulo de Hardening.</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">📌 Resolução de DNS</p>
              <code className="text-xs text-ok font-mono">/etc/resolv.conf</code>
              <p className="text-xs text-text-3 mt-1">Define quais servidores DNS o sistema usa.</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">📌 Hosts locais</p>
              <code className="text-xs text-ok font-mono">/etc/hosts</code>
              <p className="text-xs text-text-3 mt-1">Mapeamento IP → nome antes do DNS. Equivale ao <code>C:\Windows\System32\drivers\etc\hosts</code>.</p>
            </div>
          </div>
        </section>

        {/* ── HighlightBox Expansão Futura ── */}
        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>Montagem de partições e fstab — persistindo mounts no boot</li>
            <li>Links simbólicos vs hard links — como o Linux evita duplicação</li>
            <li>Permissões de diretórios — diferença entre <code>r</code>, <code>w</code>, <code>x</code> em pastas</li>
            <li>Inodes — como o kernel identifica arquivos internamente</li>
          </ul>
        </HighlightBox>

        {/* ── Exercícios ── */}
        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — O que tem em /proc?</p>
              <CodeBlock code={`cat /proc/version       # Versão do kernel\ncat /proc/cpuinfo      # Detalhes da CPU\ncat /proc/meminfo | grep MemTotal  # RAM total`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Qual é seu diretório home?</p>
              <CodeBlock code={`echo $HOME             # Variável de ambiente\npwd                    # Diretório atual\ncd ~                   # Atalho para home\nls -la ~               # Listar tudo (inclusive arquivos ocultos .)`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Encontre configurações de rede</p>
              <CodeBlock code={`cat /etc/hosts         # Mapeamentos locais\ncat /etc/resolv.conf   # Servidores DNS\nls /etc/netplan/       # Configuração de rede (Ubuntu 18+)`} lang="bash" />
            </div>
          </div>
        </section>

        {/* ── Checkpoint ── */}
        <section id="checkpoint" className="mt-8">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 01
            </h3>
            <div className="space-y-3">
              {FHS_CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-3 border border-border hover:border-[rgba(99,102,241,0.5)] transition-all text-left group"
                >
                  {checklist[item.id]
                    ? <CheckCircle2 size={18} className="text-ok shrink-0" />
                    : <Circle size={18} className="text-text-3 shrink-0 group-hover:text-[#6366f1] transition-colors" />
                  }
                  <span className={cn("text-sm", checklist[item.id] && "line-through text-text-3")}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            {allDone && (
              <div className="mt-4 p-3 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-semibold text-center">
                ✅ Módulo 01 concluído! Próximo: Comandos Essenciais →
              </div>
            )}
          </div>
        </section>

      </div>

      <WindowsComparisonBox
        windowsLabel="Windows — Estrutura de Diretórios"
        linuxLabel="Linux — FHS (Filesystem Hierarchy Standard)"
        windowsCode={`# Windows — estrutura de pastas típica
C:\\Windows\\          → Sistema operacional (kernel, DLLs)
C:\\Windows\\System32\\ → Binários e DLLs do SO
C:\\Program Files\\    → Programas instalados (64-bit)
C:\\Program Files (x86)\\ → Programas 32-bit
C:\\Users\\            → Perfis de usuários (equiv. /home)
C:\\Users\\joao\\AppData\\ → Dados de aplicativos (equiv. ~/.config)
C:\\ProgramData\\      → Dados compartilhados de apps
C:\\Windows\\Temp\\    → Arquivos temporários (equiv. /tmp)
# Sem conceito de "devices como arquivos"
# Discos são C:\\, D:\\ (letras de unidade)
# Configurações ficam no Registro (regedit)
# não em arquivos texto em /etc

# Registro do Windows:
# HKLM\\SOFTWARE\\ → configurações globais (equiv. /etc)
# HKCU\\           → configurações do usuário (equiv. ~)`}
        linuxCode={`# Linux FHS — tudo em um único árore
/                 → raiz do sistema (único ponto de montagem)
/bin, /usr/bin    → binários essenciais (ls, cp, bash)
/sbin, /usr/sbin  → binários administrativos (fdisk, iptables)
/etc/             → configurações em texto puro (editáveis!)
/home/joao/       → arquivos do usuário (equiv. C:\\Users\\joao)
/root/            → home do superusuário (equiv. C:\\Users\\Admin)
/var/log/         → logs do sistema e aplicações
/var/www/         → arquivos de sites web
/tmp/             → temporários (apagados no boot)
/proc/            → sistema de arquivos virtual (info do kernel)
/dev/             → dispositivos como arquivos (disco = /dev/sda)
/mnt/, /media/    → pontos de montagem de discos externos
# Discos não têm letras — são montados em /mnt/disco
# Configurações são arquivos texto em /etc (editáveis com vim)
# Sem registro binário — tudo é transparente`}
      />

      {/* ── Erros Comuns ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-warn">⚠️</span> Erros Comuns e Soluções
        </h2>
        {[
          {
            err: 'Arquivo de configuração editado mas sistema usa versão antiga',
            fix: 'Muitos serviços em /etc/ têm diretórios .d/ (ex: /etc/nginx/conf.d/). Arquivos nesses diretórios sobrescrevem o arquivo principal. Verificar: ls /etc/nginx/conf.d/ — pode haver um arquivo sobreescrevendo suas mudanças.',
          },
          {
            err: 'Instalei um programa mas o binário não está em /usr/bin — comando não encontrado',
            fix: 'Verificar onde foi instalado: which programa ou find /usr -name "programa". Programas de terceiros vão para /usr/local/bin ou /opt/. Adicionar ao PATH: export PATH="$PATH:/usr/local/bin" e colocar no ~/.bashrc para persistir.',
          },
          {
            err: '/tmp cheio — aplicação falha ao criar arquivos temporários',
            fix: '/tmp é limpo no reboot mas pode encher antes. Verificar: df -h /tmp. Em Ubuntu/Debian, /tmp pode ser tmpfs (memória RAM). Limpar: rm -rf /tmp/* (cuidado com processos usando /tmp). Aumentar o tamanho: mount -o remount,size=2G /tmp.',
          },
          {
            err: 'df -h mostra /dev/sda1 100% cheio mas não vejo arquivos grandes',
            fix: '/var/log pode estar enorme. Verificar: du -sh /var/log/*. Logs rotativos podem ter acumulado. Limpar logs antigos: journalctl --vacuum-size=100M ou truncar: truncate -s 0 /var/log/syslog. Configurar logrotate para evitar recorrência.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      <ModuleNav currentPath="/fhs" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
