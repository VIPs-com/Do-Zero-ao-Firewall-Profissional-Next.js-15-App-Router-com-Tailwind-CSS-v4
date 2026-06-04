'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, HardDrive, Search, Link2, Database, MemoryStick, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';
import { useTabFilter } from '@/hooks/useTabFilter';

type DiscosTab = 'discos' | 'swap' | 'fstab';
const TABS: { id: DiscosTab; label: string }[] = [
  { id: 'discos', label: '💾 Discos & Partições' },
  { id: 'swap',   label: '🔄 SWAP & Memória Virtual' },
  { id: 'fstab',  label: '📋 fstab & Exercícios' },
];

const CHECKLIST = [
  { id: 'discos-mapeados',      text: 'Identifiquei discos com lsblk, verifiquei espaço com df -h e entendi o conceito de mount' },
  { id: 'swap-criado',          text: 'Criei arquivo de SWAP, ativei com swapon e persisti no fstab' },
  { id: 'swappiness-ajustado',  text: 'Ajustei vm.swappiness e entendi quando não usar SWAP' },
];

// ── Aba 1 — Discos & Partições ──────────────────────────────────────────────
const IDENTIFICAR = `lsblk                    # listar discos e partições em árvore
lsblk -f                 # com tipo de filesystem e UUID
sudo fdisk -l            # informações detalhadas de todos os discos
sudo blkid               # UUID e tipo de cada partição`;

const ESPACO = `df -h                         # espaço em todos os filesystems montados
df -h /                       # só a partição raiz
du -sh /var/log/              # tamanho total do diretório /var/log
du -sh /var/log/* | sort -hr | head -10  # 10 maiores em /var/log
du -sh /home/*                # espaço por usuário em /home`;

const MOUNT = `# Montar manualmente (temporário — não persiste após reboot)
sudo mkdir -p /mnt/dados
sudo mount /dev/sdb1 /mnt/dados

# Desmontar
sudo umount /mnt/dados

# Ver o que está montado atualmente
mount | grep /dev/sd`;

// ── Aba 2 — SWAP & Memória Virtual ──────────────────────────────────────────
const FREE_H = `free -h
#              total        used        free      shared  buff/cache   available
# Mem:          15Gi        4.2Gi       8.1Gi       312Mi       2.9Gi      10Gi
# Swap:          2Gi          0B         2Gi
#
# total    = RAM física instalada
# used     = RAM em uso agora
# available = quanto o kernel pode dar a novos processos (inclui cache liberável)
# Swap used = quanto do SWAP está sendo usado (ideal: 0)`;

const PROC_MEMINFO = `cat /proc/meminfo | grep -E "MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree|Cached"
# MemTotal:       16384000 kB   # RAM total
# MemFree:         8294912 kB   # RAM completamente livre
# MemAvailable:   10485760 kB   # RAM disponível para apps (mais preciso)
# Cached:          2097152 kB   # Cache de disco (pode ser liberado)
# SwapTotal:       2097152 kB   # SWAP total configurado
# SwapFree:        2097152 kB   # SWAP livre`;

const VMSTAT = `vmstat 1 5
# procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
#  r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
#  1  0      0 8294912  51200 2097152   0    0     0     1   42  123  2  1 97  0  0
#
# si (swap-in)  = páginas lidas do disco para RAM (alto = pressão de memória)
# so (swap-out) = páginas escritas da RAM para disco (alto = RAM esgotando)
# wa (iowait)   = CPU esperando I/O — thrashing gera wa alto`;

const SWAP_CRIAR_ARQUIVO = `# Opção A — arquivo de SWAP (mais flexível, recomendado para VMs e cloud)
sudo fallocate -l 2G /swapfile      # alocar 2 GB
# alternativa se fallocate não disponível:
# dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile            # OBRIGATÓRIO antes do mkswap
sudo mkswap /swapfile               # formatar como área de SWAP
sudo swapon /swapfile               # ativar imediatamente (sem reboot)
swapon --show                       # confirmar (formato longo)
swapon -s                           # confirmar (formato curto — igual ao anterior)
free -h                             # verificar linha Swap`;

const SWAP_CRIAR_PARTICAO = `# Opção B — partição de SWAP com cfdisk (TUI interativa, mais amigável)
sudo cfdisk /dev/sdb                # TUI: criar partição → Tipo → "Linux swap"
sudo mkswap /dev/sdb1               # formatar a partição criada
sudo swapon /dev/sdb1               # ativar

# Múltiplos SWAPs com prioridade (kernel usa o de maior prioridade primeiro)
sudo swapon /dev/sdb1 -p 10         # prioridade explícita
swapon -s                           # mostra NAME, TYPE, SIZE, USED, PRIO

# Desativar SWAP
sudo swapoff /swapfile
sudo swapoff /dev/sdb1`;

const SWAP_FSTAB = `# Persistir no /etc/fstab — linha a adicionar:
/swapfile   none   swap   sw   0   0

# Para partição:
UUID=xxxx-yyyy   none   swap   sw   0   0

# Verificar se está correto (sem reboot):
sudo mount -a   # não monta swap, mas valida o fstab
sudo swapon -a  # ativa todos os swaps do fstab`;

const SWAPPINESS = `# Ver valor atual (padrão do kernel: 60)
cat /proc/sys/vm/swappiness

# Mudar em tempo real (voltará ao padrão no reboot):
sudo sysctl -w vm.swappiness=10

# Persistir — criar arquivo em /etc/sysctl.d/:
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swap.conf
sudo sysctl --system   # aplicar sem reboot

# Referência:
# 0  = evitar SWAP ao máximo (arriscado se RAM for baixa)
# 10 = recomendado para servidores (usar RAM enquanto possível)
# 60 = padrão — equilíbrio desktop/servidor
# 100 = agressivo — troca páginas cedo, libera RAM para cache`;

const VFS_CACHE = `# vfs_cache_pressure — controla agressividade ao liberar cache de inodes/dentries
cat /proc/sys/vm/vfs_cache_pressure    # padrão: 100

# 100 = comportamento equilibrado (padrão)
# 50  = mantém mais cache de sistema de arquivos em RAM (bom para servidores de arquivos)
# 200 = libera cache agressivamente (economiza RAM mas aumenta I/O)

# Ver todos os parâmetros de memória disponíveis:
ls /proc/sys/vm/

# Persistir junto com swappiness:
echo "vm.swappiness=10"            | sudo tee    /etc/sysctl.d/99-swap.conf
echo "vm.vfs_cache_pressure=50"    | sudo tee -a /etc/sysctl.d/99-swap.conf
sudo sysctl --system`;

const SMEM = `# smem — ver uso de swap e RAM por processo (mais preciso que ps aux)
sudo apt install smem

# Ver processos ordenados por uso de SWAP (maior primeiro):
smem -k -t -s swap -r
# PID  User  Command          Swap   USS    PSS    RSS
# ...
# -k = mostrar em KB legível (K/M/G)
# -t = linha de totais no final
# -s swap = ordenar pela coluna swap
# -r = ordem reversa (maior no topo)

# Ver ordenado por RSS (memória residente total):
smem -k -t -s rss -r | head -15

# Ver uso por usuário (resumo):
smem -u`;

const ZRAM = `# ZRAM — swap comprimido em RAM (ideal para sistemas com pouca RAM: < 2 GB)
# Ao invés de ir ao disco, comprime a página e mantém em RAM
sudo modprobe zram
sudo zramctl --find --size 512M --algorithm lz4
# /dev/zram0

sudo mkswap /dev/zram0
sudo swapon /dev/zram0 -p 100  # prioridade alta (usa zram antes do disco)
free -h                         # SWAP agora inclui zram

# Ubuntu 22.04+ tem zram-config:
sudo apt install zram-config`;

// ── Aba 3 — fstab & Exercícios ───────────────────────────────────────────────
const FSTAB = `# /etc/fstab — mounts persistentes (editado com sudo nano)
# Formato: dispositivo   ponto-de-montagem   tipo   opções   dump   pass
UUID=abc123-def456  /mnt/dados  ext4  defaults  0  2

# IMPORTANTE: sempre use UUID, não /dev/sdb1
# O nome /dev/sdb1 pode mudar entre reboots; UUID é permanente
sudo blkid /dev/sdb1    # obter UUID do disco
sudo nano /etc/fstab    # editar
sudo mount -a           # testar sem reiniciar (monta tudo do fstab)`;

export default function DiscosPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();
  const { activeTab, tabButtonProps, isActive } = useTabFilter<DiscosTab>('discos');

  useEffect(() => {
    trackPageVisit('/discos');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-accent-fundamentos">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/fundamentos">Fundamentos Linux</Link>
        <span>/</span>
        <span className="text-text-2">Discos e Partições</span>
      </div>

      <div className="section-label">Módulo 06 · Trilha Fundamentos</div>
      <h1 className="section-title">💾 Discos, Partições e SWAP</h1>
      <p className="section-sub">
        No Linux não existe <code>D:\</code>. Discos e partições são <strong>montados</strong> em diretórios
        da árvore de arquivos. E quando a RAM acaba, o kernel usa <strong>SWAP</strong> — espaço em disco como
        memória virtual de emergência. Entender os dois é essencial para operar qualquer servidor Linux.
      </p>

      {/* ── Abas ── */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-2" role="tablist" aria-label="Seções do módulo Discos e SWAP">
          {TABS.map(tab => (
            <button
              key={tab.id}
              {...tabButtonProps(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                isActive(tab.id)
                  ? 'border-[var(--module-fundamentos)] text-text'
                  : 'border-transparent text-text-2 hover:text-text'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABA 1 — Discos & Partições
      ══════════════════════════════════════════════════════════════════════ */}
      <div hidden={!isActive('discos')} className="space-y-14">

        <FluxoCard
          title="Fluxo: adicionar um novo disco ao servidor"
          steps={[
            { label: 'lsblk',    sub: 'identificar disco',    icon: <Search size={14} />,   color: 'border-info/50' },
            { label: 'fdisk',    sub: 'criar partição',       icon: <HardDrive size={14} />, color: 'border-accent/50' },
            { label: 'mkfs',     sub: 'formatar (ext4/xfs)',  icon: <Database size={14} />, color: 'border-warn/50' },
            { label: 'mount + fstab', sub: 'montar e persistir', icon: <Link2 size={14} />, color: 'border-ok/50' },
          ]}
        />

        <WindowsComparisonBox
          windowsCode={`Gerenciamento de Disco (diskmgmt.msc)
  → Ver discos e partições graficamente
  → Formatar: clique direito → Formatar
  → Letra de unidade (C:, D:, E:...)
  → Partição automática "aparece" como
    letra nova no Explorer`}
          linuxCode={`lsblk               # listar discos e partições
sudo fdisk /dev/sdb # particionar
sudo mkfs.ext4 /dev/sdb1  # formatar
sudo mount /dev/sdb1 /mnt/dados
# Editar /etc/fstab para persistir`}
          windowsLabel="Windows — Gerenciamento de Disco"
          linuxLabel="Linux — lsblk, fdisk, mount, fstab"
        />

        <section id="identificar">
          <h2 className="text-2xl font-bold mb-2">Identificar Discos e Partições</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>lsblk</code> mostra a árvore de discos e partições. <code>fdisk -l</code> dá detalhes completos.
          </p>
          <CodeBlock code={IDENTIFICAR} lang="bash" title="Listar discos" />
          <InfoBox className="mt-4" title="Nomenclatura Linux de discos">
            <p className="text-sm text-text-2">
              <code>/dev/sda</code> = primeiro disco SATA/SCSI · <code>/dev/sda1</code> = primeira partição ·
              <code> /dev/nvme0n1</code> = disco NVMe · <code>/dev/vda</code> = disco virtual (VirtualBox/KVM).
              O sistema de arquivos raiz (<code>/</code>) é sempre o primeiro disco.
            </p>
          </InfoBox>
        </section>

        <section id="espaco">
          <h2 className="text-2xl font-bold mb-2">Verificar Uso de Espaço</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>df -h</code> mostra o espaço livre de cada partição montada. <code>du -sh</code> mostra o tamanho de um diretório específico.
          </p>
          <CodeBlock code={ESPACO} lang="bash" title="df e du" />
          <InfoBox className="mt-4" title="Disco cheio trava o servidor">
            <p className="text-sm text-text-2">
              Quando uma partição chega a 100%, serviços param de escrever logs e podem travar.
              Configure alertas para avisar aos 80%: <code>df -h | grep -E &apos;[89][0-9]%&apos;</code>.
              O maior consumidor geralmente é <code>/var/log</code> — verifique com <code>du -sh /var/log/*</code>.
            </p>
          </InfoBox>
        </section>

        <section id="mount">
          <h2 className="text-2xl font-bold mb-2">Montar Discos</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>mount</code> anexa um dispositivo à árvore de diretórios. Desmonte com <code>umount</code> antes de remover o disco fisicamente.
          </p>
          <CodeBlock code={MOUNT} lang="bash" title="mount e umount" />
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABA 2 — SWAP & Memória Virtual
      ══════════════════════════════════════════════════════════════════════ */}
      <div hidden={!isActive('swap')} className="space-y-14">

        <FluxoCard
          title="Ciclo de Vida da Memória Linux"
          steps={[
            { label: 'RAM livre',         sub: 'app inicia normalmente',     icon: <MemoryStick size={14} />, color: 'border-ok/50' },
            { label: 'Pressão de memória', sub: 'RAM > 80% usada',           icon: <Cpu size={14} />,         color: 'border-warn/50' },
            { label: 'Swapping',          sub: 'páginas frias vão ao disco', icon: <HardDrive size={14} />,   color: 'border-accent/50' },
            { label: 'Thrashing',         sub: 'I/O contínuo, sistema lento',icon: <Database size={14} />,    color: 'border-err/50' },
            { label: 'OOM Killer',        sub: 'mata processos para liberar',icon: <Search size={14} />,      color: 'border-err/70' },
          ]}
        />

        <InfoBox title="O que é SWAP?">
          <p className="text-sm text-text-2">
            SWAP é um espaço em disco que o kernel Linux usa como <strong>extensão da RAM</strong>.
            Quando a memória física esgota, o kernel move páginas de memória &quot;frias&quot; (pouco usadas)
            para o SWAP, liberando RAM para o que está ativo. É lento (disco vs. RAM), mas evita
            o <strong>OOM Killer</strong> — o mecanismo do kernel que mata processos quando a RAM
            acaba sem SWAP disponível.
          </p>
        </InfoBox>

        {/* ── Monitorar RAM ── */}
        <section id="ram-monitoring">
          <h2 className="text-2xl font-bold mb-2">Monitorar RAM e SWAP</h2>
          <p className="text-text-2 text-sm mb-4">
            Antes de criar SWAP, entenda como ler o uso atual de memória.
          </p>
          <CodeBlock code={FREE_H} lang="bash" title="free -h — visão geral de memória" />
          <CodeBlock code={PROC_MEMINFO} lang="bash" title="/proc/meminfo — detalhe do kernel" className="mt-4" />
          <CodeBlock code={VMSTAT} lang="bash" title="vmstat 1 5 — monitorar si/so em tempo real" className="mt-4" />
          <InfoBox className="mt-4" title="si e so: os indicadores de thrashing">
            <p className="text-sm text-text-2">
              <code>si</code> (swap-in) e <code>so</code> (swap-out) consistentemente acima de zero
              indicam que o servidor está usando SWAP ativamente. Se forem altos e constantes, o
              sistema está em <strong>thrashing</strong> — trocar páginas de/para disco
              constantemente, tornando tudo lento. Solução: adicionar RAM, não mais SWAP.
            </p>
          </InfoBox>
          <CodeBlock code={SMEM} lang="bash" title="smem — uso de SWAP por processo" className="mt-4" />
          <InfoBox className="mt-4" title="Por que smem é mais preciso que ps aux?">
            <p className="text-sm text-text-2">
              <code>ps aux</code> mostra RSS (memória física total do processo), mas não distingue
              memória <em>compartilhada</em> de memória <em>privada</em>. <code>smem</code> mostra:
              <strong> USS</strong> (só do processo — o que seria liberado ao matar),
              <strong> PSS</strong> (proporcional — USS + parte do compartilhado) e
              <strong> RSS</strong> (total bruto). A coluna <strong>Swap</strong> mostra exatamente
              quanto cada processo está usando do SWAP.
            </p>
          </InfoBox>
        </section>

        {/* ── Criar SWAP ── */}
        <section id="criar-swap">
          <h2 className="text-2xl font-bold mb-2">Criar SWAP — Arquivo vs Partição</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-ok/30">
              <p className="font-bold text-sm text-ok mb-1">✅ Arquivo de SWAP</p>
              <p className="text-xs text-text-2">Recomendado para VMs, cloud e a maioria dos servidores. Pode ser criado e removido sem reparticionar. Sem diferença de performance perceptível em produção.</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-info/30">
              <p className="font-bold text-sm text-info mb-1">ℹ️ Partição de SWAP</p>
              <p className="text-xs text-text-2">Marginal vantagem de performance em bare metal. Necessário definir na instalação. Não flexível — tamanho fixo.</p>
            </div>
          </div>
          <CodeBlock code={SWAP_CRIAR_ARQUIVO} lang="bash" title="Opção A — arquivo de SWAP (recomendado)" />
          <CodeBlock code={SWAP_CRIAR_PARTICAO} lang="bash" title="Opção B — partição de SWAP" className="mt-4" />
          <CodeBlock code={SWAP_FSTAB} lang="bash" title="Persistir SWAP no /etc/fstab" className="mt-4" />
        </section>

        {/* ── Quando NÃO usar ── */}
        <section id="quando-nao-usar">
          <WarnBox title="⚠️ Quando NÃO usar SWAP (ou desabilitar)">
            <ul className="text-sm text-text-2 space-y-2 list-disc list-inside mt-2">
              <li>
                <strong>Kubernetes / containers:</strong> o scheduler do K8s assume latência de memória
                previsível. SWAP quebra essa premissa e é explicitamente desabilitado:
                <code className="text-xs"> swapoff -a && sed -i &apos;/swap/d&apos; /etc/fstab</code>
              </li>
              <li>
                <strong>SSDs NVMe de alta carga:</strong> thrashing em SSD degrada o armazenamento
                (ciclos de escrita limitados) e aumenta latência de I/O — pior que OOM Killer.
              </li>
              <li>
                <strong>Bancos de dados de alta performance</strong> (PostgreSQL, MySQL, Redis):
                DBAs preferem OOM Killer a thrashing. Configure <code>vm.swappiness=1</code> ou
                desabilite completamente e dimensione a RAM corretamente.
              </li>
              <li>
                <strong>Regra prática:</strong> se <code>si</code>/<code>so</code> estão constantemente
                altos, <em>adicione RAM</em> — mais SWAP não resolve o problema, só atrasa o colapso.
              </li>
            </ul>
          </WarnBox>
        </section>

        {/* ── Tuning swappiness ── */}
        <section id="swappiness">
          <h2 className="text-2xl font-bold mb-2">Tuning: vm.swappiness</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>vm.swappiness</code> controla a <em>disposição</em> do kernel de usar SWAP.
            Valores baixos fazem o kernel preferir manter tudo em RAM; valores altos fazem o kernel
            usar SWAP mais cedo (liberando RAM para cache de disco).
          </p>
          <CodeBlock code={SWAPPINESS} lang="bash" title="vm.swappiness — configurar e persistir" />

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-text-2 font-medium">Valor</th>
                  <th className="text-left p-2 text-text-2 font-medium">Comportamento</th>
                  <th className="text-left p-2 text-text-2 font-medium">Ideal para</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ['0',   'Nunca usar SWAP (a não ser em emergência extrema)', 'Apenas se RAM for abundante'],
                  ['1',   'Usar SWAP só em último recurso',                    'Bancos de dados em produção'],
                  ['10',  'Forte preferência por RAM',                        'Servidores Linux em geral ✅'],
                  ['60',  'Equilíbrio (padrão do kernel)',                     'Desktop, uso geral'],
                  ['100', 'Swap agressivo — libera RAM para cache',            'Workloads de muita leitura de disco'],
                ].map(([val, desc, ideal]) => (
                  <tr key={val} className="hover:bg-bg-2 transition-colors">
                    <td className="p-2 font-mono text-accent">{val}</td>
                    <td className="p-2 text-text-2">{desc}</td>
                    <td className="p-2 text-text-3 text-xs">{ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── vfs_cache_pressure ── */}
        <section id="vfs-cache">
          <h2 className="text-2xl font-bold mb-2">Outro parâmetro importante: vfs_cache_pressure</h2>
          <p className="text-text-2 text-sm mb-4">
            Além do <code>swappiness</code>, o <code>/proc/sys/vm/</code> expõe dezenas de parâmetros
            de memória. O mais relevante junto ao SWAP é o <code>vfs_cache_pressure</code>, que controla
            com que agressividade o kernel libera cache de inodes e dentries (metadados do sistema de arquivos).
          </p>
          <CodeBlock code={VFS_CACHE} lang="bash" title="vfs_cache_pressure e /proc/sys/vm/" />
        </section>

        {/* ── ZRAM ── */}
        <section id="zram">
          <h2 className="text-2xl font-bold mb-2">ZRAM — Swap em RAM Comprimida</h2>
          <p className="text-text-2 text-sm mb-4">
            ZRAM cria um dispositivo de bloco na própria RAM que comprime as páginas antes de armazenar.
            É até 3× mais rápido que SWAP em disco e é a solução padrão em sistemas com pouca RAM
            (Raspberry Pi, VMs pequenas, Android).
          </p>
          <CodeBlock code={ZRAM} lang="bash" title="ZRAM — swap comprimido em RAM" />
          <InfoBox className="mt-4" title="ZRAM vs SWAP em disco">
            <p className="text-sm text-text-2">
              Use ZRAM <strong>e</strong> SWAP em disco juntos com prioridades diferentes:
              <code className="text-xs"> swapon /dev/zram0 -p 100</code> (prioridade alta) e
              <code className="text-xs"> swapon /swapfile -p 0</code> (fallback). O kernel usará
              ZRAM primeiro (rápido) e só vai ao disco quando ZRAM encher.
            </p>
          </InfoBox>
        </section>

        <WindowsComparisonBox
          windowsCode={`Arquivo de Paginação (pagefile.sys)
  → Gerenciado automaticamente pelo Windows
  → Ou: Sistema → Desempenho → Avançado
     → Memória Virtual → Alterar
  → Padrão: tamanho automático baseado na RAM
  → Localização: C:\\pagefile.sys (oculto)
  → Não há controle de "agressividade" equivalente`}
          linuxCode={`# SWAP — controle explícito e granular
fallocate -l 2G /swapfile
chmod 600 /swapfile && mkswap /swapfile
swapon /swapfile

# Ajustar agressividade:
vm.swappiness=10  # servidor
vm.swappiness=60  # desktop

# Múltiplos dispositivos com prioridades:
swapon /dev/zram0 -p 100  # RAM comprimida
swapon /swapfile   -p 0   # disco (fallback)`}
          windowsLabel="Windows — Arquivo de Paginação"
          linuxLabel="Linux — SWAP com controle total"
        />

        {/* ── Erros Comuns SWAP ── */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns com SWAP
          </h2>
          {[
            {
              err: 'mkswap: /swapfile: insecure permissions 0644, fix with: chmod 0600 /swapfile',
              fix: 'O arquivo de SWAP não pode ser legível por outros usuários (risco de vazar dados de RAM). Execute: sudo chmod 600 /swapfile e tente novamente.',
            },
            {
              err: 'SWAP some após reboot — swapon --show retorna vazio',
              fix: 'Faltou adicionar ao /etc/fstab. Adicione a linha: /swapfile none swap sw 0 0. Teste com sudo swapon -a.',
            },
            {
              err: 'vm.swappiness=0 e o OOM Killer mata processos aleatoriamente',
              fix: 'swappiness=0 não desabilita o SWAP — apenas o desencoraja. Mas com RAM muito baixa o kernel ainda pode fazer OOM. Solução: use swappiness=1 (não zero) OU adicione mais RAM.',
            },
            {
              err: 'swapon: /swapfile: swapon failed: Invalid argument (em btrfs)',
              fix: 'btrfs não suporta SWAP em arquivo padrão. Crie com: truncate -s 0 /swapfile; chattr +C /swapfile; btrfs property set /swapfile compression none; dd if=/dev/zero of=/swapfile bs=1M count=2048. Ou use uma partição separada.',
            },
          ].map(({ err, fix }) => (
            <details key={err} className="border border-err/20 bg-err/5 rounded-xl p-5 group">
              <summary className="font-mono text-sm text-err cursor-pointer list-none flex items-start gap-2">
                <span className="shrink-0">❌</span> {err}
              </summary>
              <p className="text-sm text-text-2 mt-3 pl-5">✅ {fix}</p>
            </details>
          ))}
        </section>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABA 3 — fstab & Exercícios
      ══════════════════════════════════════════════════════════════════════ */}
      <div hidden={!isActive('fstab')} className="space-y-14">

        <section id="fstab">
          <h2 className="text-2xl font-bold mb-2">fstab — Mounts Persistentes</h2>
          <p className="text-text-2 text-sm mb-4">
            Mounts manuais desaparecem no reboot. Para persistir, edite <code>/etc/fstab</code>.
          </p>
          <CodeBlock code={FSTAB} lang="bash" title="/etc/fstab" />
          <WarnBox className="mt-4" title="Erro no fstab pode impedir o boot">
            <p className="text-sm text-text-2">
              Uma linha malformada no <code>/etc/fstab</code> pode fazer o sistema entrar em modo de
              recuperação no próximo boot. Sempre teste com <code>sudo mount -a</code> antes de reiniciar.
              Em VMs, tire um snapshot antes de editar o fstab.
            </p>
          </WarnBox>
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>LVM — Logical Volume Manager para redimensionar partições online</li>
            <li>RAID com mdadm — redundância de dados sem hardware especial</li>
            <li>ext4 vs xfs vs btrfs — quando usar cada filesystem</li>
            <li>quotas de disco por usuário (edquota)</li>
            <li>dd — clonar discos e criar imagens byte a byte</li>
          </ul>
        </HighlightBox>

        {/* ── Erros Comuns Discos ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'mount: /dev/sdb1: can\'t read superblock — disco não monta',
              fix: 'Filesystem corrompido ou partição sem formatação. Verificar: file -s /dev/sdb1 (deve mostrar o tipo de FS). Se novo: mkfs.ext4 /dev/sdb1. Se corrompido: fsck -y /dev/sdb1 (nunca em partição montada).',
            },
            {
              err: '/etc/fstab errado — sistema não inicia após edição (emergency shell)',
              fix: 'UUID incorreto ou opções inválidas. No emergency shell: montar root em modo leitura/escrita: mount -o remount,rw /. Editar: nano /etc/fstab. Verificar UUIDs: blkid. Remontar: mount -a para testar antes de reiniciar.',
            },
            {
              err: 'df -h mostra disco cheio mas du -sh não encontra arquivos grandes',
              fix: 'Arquivo deletado mas ainda aberto por processo. O kernel mantém o inode até o processo fechar. Encontrar: lsof | grep deleted. Reiniciar o processo que segura o arquivo (ex: systemctl restart nginx). O espaço será liberado imediatamente.',
            },
            {
              err: 'LVM: device not found — lvm2 não reconhece volumes após reinstalação',
              fix: 'Metadados do LVM intactos mas não ativos. Escanear e ativar: pvscan, vgscan, vgchange -ay. Se os volumes apareceram: lvdisplay. Montar normalmente após ativação. Em live USB, pode precisar de vgscan --mknodes.',
            },
          ].map(({ err, fix }) => (
            <details key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <summary className="font-mono text-sm text-err cursor-pointer list-none flex items-start gap-2">
                <span className="shrink-0">❌</span> {err}
              </summary>
              <p className="text-sm text-text-2 mt-3 pl-5">✅ {fix}</p>
            </details>
          ))}
        </section>

        {/* ── Exercícios ── */}
        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Inspecionar Discos e Partições</p>
              <CodeBlock lang="bash" code={`lsblk -f
fdisk -l 2>/dev/null | grep -E "^Disk|^/dev"
df -hT
df -i
du -sh /* 2>/dev/null | sort -h | tail -10`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Criar Arquivo de SWAP de 1 GB</p>
              <CodeBlock lang="bash" code={`# Verificar RAM e SWAP atual
free -h
swapon --show

# Criar e ativar SWAP
sudo fallocate -l 1G /swapfile-lab
sudo chmod 600 /swapfile-lab
sudo mkswap /swapfile-lab
sudo swapon /swapfile-lab
free -h             # verificar nova linha Swap

# Ajustar swappiness
cat /proc/sys/vm/swappiness
sudo sysctl -w vm.swappiness=10

# Limpeza (não persistir no fstab em lab)
sudo swapoff /swapfile-lab
sudo rm /swapfile-lab`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Monitorar Memória em Tempo Real</p>
              <CodeBlock lang="bash" code={`# Monitorar si/so (swap-in/out) a cada 1 segundo
vmstat 1 10

# Ver top consumidores de RAM
ps aux --sort=-%mem | head -10

# Ver memória por processo (requer smem)
# apt install smem -y && smem -s rss -r | head -10

# Verificar /proc/meminfo completo
cat /proc/meminfo`} />
            </div>
          </div>
        </section>

        {/* ── Checkpoint ── */}
        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 06
            </h3>
            <div className="space-y-3">
              {CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-3 border border-border hover:border-[rgba(99,102,241,0.5)] transition-all text-left group"
                >
                  {checklist[item.id]
                    ? <CheckCircle2 size={18} className="text-ok shrink-0" />
                    : <Circle size={18} className="text-text-3 shrink-0 group-hover:text-[#818cf8] transition-colors" />
                  }
                  <span className={cn('text-sm', checklist[item.id] && 'line-through text-text-3')}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            {allDone && (
              <div className="mt-4 p-3 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-semibold text-center">
                ✅ Módulo 06 concluído! Próximo: Logs e Monitoramento →
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/discos" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
