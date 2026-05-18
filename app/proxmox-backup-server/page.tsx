'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Server, Layers, Database, ShieldCheck, RotateCcw, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint FORTALEZA — Proxmox Backup Server. Conteúdo adaptado do guia
   "Fortaleza Proxmox" (CC BY-SA 4.0). */

type PbsTab = 'conceito' | 'jobs' | 'restore';

const CHECKLIST_ITEMS = [
  { id: 'pbs-datastore', label: 'Instalei o PBS, criei um datastore e o adicionei como storage no Proxmox VE' },
  { id: 'pbs-job',       label: 'Configurei um backup job agendado e uma política de retenção (prune + GC)' },
  { id: 'pbs-restore',   label: 'Rodei um verify job e testei um restore (file-level e/ou VM completa)' },
];

export default function ProxmoxBackupServerPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<PbsTab>('conceito');

  useEffect(() => {
    trackPageVisit('/proxmox-backup-server');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-proxmox-backup-server min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Proxmox Backup Server</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo C08 · Hardening do Host</div>
          <h1 className="text-4xl font-bold mb-4">💾 Proxmox Backup Server</h1>
          <p className="text-text-2 text-lg mb-6">
            O <code>vzdump</code> faz backup completo da VM toda vez — lento e pesado. O{' '}
            <strong>Proxmox Backup Server (PBS)</strong> faz backup <strong>incremental e
            deduplicado</strong>: só os blocos que mudaram, com verificação de integridade e
            restore granular. É a diferença entre &quot;ter um backup&quot; e &quot;confiar nele&quot;.
          </p>
        </div>

        <FluxoCard
          title="O ciclo de backup do PBS"
          steps={[
            { label: 'PVE',        sub: 'Proxmox VE dispara o backup da VM/CT',          icon: <Server size={14}/>,      color: 'border-accent/50' },
            { label: 'Incremental', sub: 'só os blocos alterados sobem (dirty bitmap)',  icon: <Layers size={14}/>,      color: 'border-info/50' },
            { label: 'Datastore',  sub: 'deduplicação — blocos idênticos guardados 1×',  icon: <Database size={14}/>,    color: 'border-warn/50' },
            { label: 'Verify',     sub: 'checksum confirma a integridade do backup',     icon: <ShieldCheck size={14}/>, color: 'border-ok/50' },
            { label: 'Restore',    sub: 'VM inteira ou um único arquivo de dentro dela', icon: <RotateCcw size={14}/>,   color: 'border-layer-3/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '💾 Conceito & Instalação' },
              { id: 'jobs',     label: '⚙️ Datastore & Jobs' },
              { id: 'restore',  label: '🔄 Restore & Verificação' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PbsTab)}
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

        {/* ── TAB 1 ── */}
        {isActive('conceito') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. PBS vs vzdump puro</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-2">Critério</th>
                  <th className="text-left py-2 pr-4 text-info">vzdump (backup nativo)</th>
                  <th className="text-left py-2 text-ok">Proxmox Backup Server</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Tipo de backup</td>
                  <td className="py-2 pr-4">Completo a cada execução</td>
                  <td className="py-2">Incremental — só os blocos que mudaram</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Espaço em disco</td>
                  <td className="py-2 pr-4">N cópias = N × tamanho da VM</td>
                  <td className="py-2">Deduplicação — blocos idênticos guardados 1×</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Verificação</td>
                  <td className="py-2 pr-4">Manual</td>
                  <td className="py-2"><em>Verify jobs</em> — checksum automático</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Restore granular</td>
                  <td className="py-2 pr-4">VM inteira</td>
                  <td className="py-2">VM inteira <strong>ou</strong> um arquivo isolado</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-text">Quando usar</td>
                  <td className="py-2 pr-4">Lab simples, poucos backups</td>
                  <td className="py-2">Vários backups, retenção longa, recuperação séria</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox title="Deduplicação — por que economiza tanto">
            Duas VMs Debian têm quase o mesmo sistema de arquivos. O PBS reconhece os blocos
            idênticos e guarda cada um <strong>uma só vez</strong>. 10 backups diários de uma
            VM podem ocupar pouco mais que um backup completo — porque o que muda entre os
            dias é uma fração pequena.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Arquitetura</h2>
          <ul className="space-y-2 text-text-2 mb-6 list-disc pl-5">
            <li><strong>PBS server</strong> — máquina (física ou VM) que roda o Proxmox Backup Server. Idealmente <em>separada</em> do PVE — backup no mesmo host não sobrevive à perda do host.</li>
            <li><strong>Datastore</strong> — o repositório onde os backups (deduplicados) ficam. Um disco ou dataset dedicado.</li>
            <li><strong>Namespace</strong> — subdivisão lógica de um datastore (ex.: separar prod/lab).</li>
            <li><strong>Verify / Prune / GC</strong> — tarefas: verificar integridade, aplicar a retenção, e recuperar o espaço dos blocos órfãos.</li>
          </ul>
          <WarnBox title="Backup no mesmo host não é backup">
            Se o PBS roda como VM <em>dentro</em> do mesmo Proxmox que ele protege, a perda do
            host leva tudo junto. Regra 3-2-1: o datastore (ou um <em>sync</em> dele) precisa
            estar em outra máquina ou offsite.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Instalação e datastore</h2>
          <CodeBlock lang="bash" code={`# Opção A — ISO dedicada do Proxmox Backup Server (recomendado: máquina separada)
# Baixe em proxmox.com/downloads e instale como faria com o PVE.

# Opção B — sobre um Debian existente, via repositório no-subscription:
echo "deb http://download.proxmox.com/debian/pbs trixie pbs-no-subscription" \\
  | sudo tee /etc/apt/sources.list.d/pbs.list
sudo apt update && sudo apt install proxmox-backup-server -y

# Web UI: https://IP-DO-PBS:8007

# Criar o datastore (CLI) — aponte para um disco/dataset dedicado
sudo proxmox-backup-manager datastore create backup-principal /mnt/datastore/backup
sudo proxmox-backup-manager datastore list`} />
          <p className="text-text-2 mt-4 mb-3">
            No <strong>Proxmox VE</strong>, adicione o PBS como storage para que ele apareça
            como destino de backup:
          </p>
          <CodeBlock lang="text" code={`PVE → Datacenter → Storage → Add → Proxmox Backup Server
  ID:          pbs
  Server:      IP-DO-PBS
  Datastore:   backup-principal
  Username:    root@pam   (ou um usuário PBS dedicado)
  Fingerprint: copie o fingerprint exibido na Web UI do PBS`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['pbs-datastore']} onChange={e => updateChecklist('pbs-datastore', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['pbs-datastore'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('jobs') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Backup job agendado</h2>
          <p className="text-text-2 mb-4">
            Com o PBS adicionado como storage, crie um <strong>backup job</strong> no PVE —
            quais VMs, com que frequência, para qual storage. O primeiro backup é completo; os
            seguintes, incrementais.
          </p>
          <CodeBlock lang="text" code={`PVE → Datacenter → Backup → Add
  Storage:   pbs
  Schedule:  02:00          (todo dia às 2h — formato de calendário systemd)
  Selection: as VMs/CTs a proteger
  Mode:      Snapshot       (sem downtime — usa snapshot do disco)`} />
          <p className="text-text-2 mt-4 mb-3">Ou dispare manualmente pela linha de comando:</p>
          <CodeBlock lang="bash" code={`# Backup manual de uma VM (ID 101) para o storage "pbs"
vzdump 101 --storage pbs --mode snapshot

# Listar os snapshots de backup já existentes no PBS
proxmox-backup-client snapshot list --repository root@pam@IP-PBS:backup-principal`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Retenção — prune e garbage collection</h2>
          <p className="text-text-2 mb-4">
            Sem retenção, o datastore cresce para sempre. O <strong>prune</strong> decide
            <em> quais snapshots manter</em> (ex.: 7 diários, 4 semanais, 6 mensais). O{' '}
            <strong>garbage collection (GC)</strong> é o que de fato <em>libera o espaço</em>
            dos blocos que nenhum snapshot referencia mais.
          </p>
          <CodeBlock lang="bash" code={`# Política de retenção no datastore
sudo proxmox-backup-manager datastore update backup-principal \\
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6

# Prune aplica a política (remove snapshots fora da regra)
sudo proxmox-backup-manager prune-job ...   # ou agende pela Web UI

# Garbage collection — recupera o espaço dos blocos órfãos
sudo proxmox-backup-manager garbage-collection start backup-principal`} />
          <InfoBox title="Prune ≠ liberar espaço" className="mt-4">
            O <code>prune</code> só <em>marca</em> snapshots como removidos. Por causa da
            deduplicação, o espaço só volta quando o <strong>GC</strong> roda e confirma que
            nenhum outro snapshot ainda usa aqueles blocos. Agende os dois.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['pbs-job']} onChange={e => updateChecklist('pbs-job', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['pbs-job'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('restore') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Verify — um backup que você não verificou não existe</h2>
          <p className="text-text-2 mb-4">
            O <strong>verify job</strong> relê os backups e confere o checksum de cada bloco.
            É o que transforma &quot;eu acho que tenho backup&quot; em &quot;eu sei que o
            backup está íntegro&quot;.
          </p>
          <CodeBlock lang="bash" code={`# Verificar a integridade de todos os snapshots de um datastore
sudo proxmox-backup-manager verify backup-principal

# Agende um verify job recorrente na Web UI:
#   PBS → Datastore → Verify Jobs → Add → schedule semanal`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Restore — VM inteira ou um único arquivo</h2>
          <p className="text-text-2 mb-4">
            O grande diferencial: você não precisa restaurar a VM toda para recuperar um
            arquivo. O <strong>file-level restore</strong> abre o backup e deixa você navegar
            dentro dele.
          </p>
          <CodeBlock lang="bash" code={`# Restore de VM completa (para um novo VMID, para não sobrescrever):
qmrestore <arquivo-de-backup> 999 --storage local-lvm

# File-level restore — montar o backup e copiar só o que precisa:
proxmox-backup-client mount \\
  vm/101/2026-05-18T02:00:00Z root.pxar /mnt/restore \\
  --repository root@pam@IP-PBS:backup-principal
# ... navegue em /mnt/restore, copie o arquivo, depois:
proxmox-backup-client unmap`} />
          <WarnBox title="Teste o restore — de verdade" className="mt-4">
            Backup que nunca foi restaurado é uma suposição, não um seguro. Faça um restore de
            teste para um VMID descartável periodicamente. O dia do incidente não é o dia de
            descobrir que o backup estava corrompido.
          </WarnBox>

          <WindowsComparisonBox
            windowsLabel="Windows (Windows Server Backup / Veeam)"
            linuxLabel="Linux (Proxmox Backup Server)"
            windowsCode={`# Backup no mundo Windows
# Windows Server Backup (wbadmin) — backup de volume,
# completo ou incremental, agendado por GUI/cmd.
# Veeam Backup & Replication — solução enterprise:
# backup incremental, deduplicação, verificação,
# restore granular. Robusto, porém licenciado.`}
            linuxCode={`# Proxmox Backup Server — open-source
# Backup incremental + deduplicação + verify +
# restore file-level, sem custo de licença.
proxmox-backup-manager datastore create ...
vzdump 101 --storage pbs --mode snapshot
proxmox-backup-manager verify backup-principal`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['pbs-restore']} onChange={e => updateChecklist('pbs-restore', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['pbs-restore'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'PBS rodando como VM dentro do Proxmox que ele protege', sol: 'A perda do host leva o backup junto. O datastore (ou um sync dele) precisa estar em outra máquina ou offsite — regra 3-2-1.' },
              { erro: 'O datastore encheu mesmo com prune configurado', sol: 'Prune só marca; o espaço só volta após o garbage collection. Agende o GC, não só o prune.' },
              { erro: 'Adicionar o storage PBS no PVE falha por fingerprint', sol: 'O PVE precisa do fingerprint do certificado do PBS. Copie-o da Web UI do PBS (Dashboard → Show Fingerprint).' },
              { erro: 'Nunca testou um restore', sol: 'Verify confere o checksum, mas só o restore real prova que você consegue recuperar. Faça restores de teste para um VMID descartável.' },
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

        <ModuleNav order={ADVANCED_ORDER} currentPath="/proxmox-backup-server" />

      </div>
    </main>
  );
}
