'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox } from '@/components/ui/Boxes';
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
du -sh /var/log/              # tamanho do diretório /var/log
du -sh /var/log/* | sort -hr | head -10  # 10 maiores em /var/log
du -sh /home/*                # espaço por usuário em /home`;

const MOUNT = `# Montar manualmente (temporário — não persiste após reboot)
sudo mount /dev/sdb1 /mnt/dados

# Desmontar
sudo umount /mnt/dados

# Ver o que está montado atualmente
mount | grep /dev/sd

# Mounts persistentes — editar /etc/fstab
cat /etc/fstab
# Exemplo de linha fstab:
# UUID=abc123 /mnt/dados ext4 defaults 0 2
# (use 'blkid' para obter o UUID correto)`;

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

      <div className="space-y-14">

        <section id="identificar">
          <h2 className="text-2xl font-bold mb-2">Identificar Discos e Partições</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>lsblk</code> mostra a árvore de discos e partições. <code>fdisk -l</code> dá detalhes completos.
          </p>
          <CodeBlock code={IDENTIFICAR} lang="bash" title="Listar discos" />
          <InfoBox className="mt-4" title="Nomenclatura Linux">
            <p className="text-sm text-text-2">
              <code>/dev/sda</code> = primeiro disco SATA/SCSI. <code>/dev/sda1</code> = primeira partição.
              <code>/dev/nvme0n1</code> = disco NVMe. <code>/dev/vda</code> = disco virtual (VirtualBox/KVM).
            </p>
          </InfoBox>
        </section>

        <section id="espaco">
          <h2 className="text-2xl font-bold mb-2">Verificar Uso de Espaço</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>df -h</code> mostra o espaço livre de cada partição montada. <code>du -sh</code> mostra o tamanho de um diretório.
          </p>
          <CodeBlock code={ESPACO} lang="bash" title="df e du" />
        </section>

        <section id="mount">
          <h2 className="text-2xl font-bold mb-2">Montar Discos e fstab</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>mount</code> anexa um disco à árvore de diretórios. Para persistir após reboot, edite <code>/etc/fstab</code>.
          </p>
          <CodeBlock code={MOUNT} lang="bash" title="mount e fstab" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>LVM — Logical Volume Manager para redimensionar partições online</li>
            <li>RAID com mdadm — redundância de dados</li>
            <li>ext4 vs xfs vs btrfs — quando usar cada filesystem</li>
            <li>quotas de disco por usuário</li>
            <li>dd — clonar discos e criar imagens</li>
          </ul>
        </HighlightBox>

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
