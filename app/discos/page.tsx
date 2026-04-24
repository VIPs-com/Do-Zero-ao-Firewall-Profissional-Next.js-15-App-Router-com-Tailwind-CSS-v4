'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, HardDrive, Search, Link2, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'discos-mapeados', text: 'Identifiquei discos com lsblk, verifiquei espaço com df -h e entendi o conceito de mount' },
];

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
      <h1 className="section-title">💾 Discos e Partições</h1>
      <p className="section-sub">
        No Linux não existe <code>D:\</code>. Discos e partições são <strong>montados</strong> em diretórios
        da árvore de arquivos. <code>lsblk</code>, <code>df</code>, <code>mount</code> e <code>fstab</code> são
        as ferramentas para gerenciar armazenamento em servidores reais.
      </p>

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

      <div className="space-y-14">

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

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Mapear os discos do sistema</p>
              <CodeBlock code={`lsblk -f          # ver discos, partições e UUIDs
df -h             # ver uso de espaço
# Qual partição tem menos espaço livre?`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Encontrar o que ocupa mais espaço</p>
              <CodeBlock code={`du -sh /var/log/* | sort -hr | head -10
du -sh /home/*
# Qual diretório é o maior consumidor?`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Ver conteúdo do fstab</p>
              <CodeBlock code={`cat /etc/fstab
# Quantas partições estão configuradas para montar no boot?
# Qual é o UUID da partição raiz (/)?`} lang="bash" />
            </div>
          </div>
        </section>

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
                    : <Circle size={18} className="text-text-3 shrink-0 group-hover:text-[#6366f1] transition-colors" />
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
