'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { HardDrive, Boxes, Layers, FolderTree, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint LVM-RAID — LVM, RAID e Armazenamento Avançado.
   Conteúdo didático alinhado a LPIC-1 / CompTIA Linux+. */

type StorageTab = 'lvm' | 'raid' | 'snapshots';

const CHECKLIST_ITEMS = [
  { id: 'lvm-configurado', label: 'Montei a pilha LVM completa — PV → VG → LV — e estendi um volume com lvextend + resize2fs' },
  { id: 'raid-montado',    label: 'Criei um array RAID com mdadm, conferi /proc/mdstat e simulei a recuperação de um disco falho' },
  { id: 'snapshot-criado', label: 'Criei um snapshot LVM para backup consistente e entendi como o ZFS faz snapshots instantâneos' },
];

export default function LvmRaidPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<StorageTab>('lvm');

  useEffect(() => {
    trackPageVisit('/lvm-raid');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-lvm-raid min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">LVM, RAID e Armazenamento</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo · Armazenamento Avançado</div>
          <h1 className="text-4xl font-bold mb-4">💽 LVM, RAID e Armazenamento Avançado</h1>
          <p className="text-text-2 text-lg mb-6">
            Partição fixa é uma camisa de força: dimensionou errado, tem que reinstalar.
            Com <strong>LVM</strong> o disco vira massa moldável — cresce e encolhe a quente.
            Com <strong>RAID por software</strong> você sobrevive à morte de um disco. E os{' '}
            <strong>snapshots</strong> congelam o estado para um backup consistente. Aqui você
            sai do zero: do disco cru ao filesystem montado, resiliente e flexível.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado a LPIC-1 (tópico 104) e CompTIA Linux+ (XK0-005).
          </p>
        </div>

        <FluxoCard
          title="A pilha de armazenamento LVM — do disco físico ao filesystem"
          steps={[
            { label: 'Disco físico',  sub: '/dev/sdb — o hardware cru',           icon: <HardDrive size={14}/>,  color: 'border-text-3/40' },
            { label: 'PV',            sub: 'Physical Volume — disco preparado',    icon: <Layers size={14}/>,     color: 'border-info/50' },
            { label: 'VG',            sub: 'Volume Group — pool de espaço',        icon: <Boxes size={14}/>,      color: 'border-accent/50' },
            { label: 'LV',            sub: 'Logical Volume — a "partição" elástica', icon: <Layers size={14}/>,   color: 'border-ok/50' },
            { label: 'Filesystem',    sub: 'ext4/xfs montado em /dados',           icon: <FolderTree size={14}/>, color: 'border-warn/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'lvm',       label: '💽 LVM' },
              { id: 'raid',      label: '🛡️ RAID por Software' },
              { id: 'snapshots', label: '📸 Snapshots & ZFS' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StorageTab)}
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

        {/* ── TAB 1 — LVM ── */}
        {isActive('lvm') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Por que LVM em vez de partição fixa</h2>
          <p className="text-text-2 mb-4">
            Uma partição clássica (<code>/dev/sda1</code>) tem tamanho cravado na tabela de
            partições. Encheu? Não dá para crescê-la se houver outra partição logo depois —
            só restaria fazer backup, repartir e restaurar. O <strong>LVM (Logical Volume
            Management)</strong> insere uma camada de abstração entre o disco e o filesystem:
            o espaço vira um <em>pool</em> de onde você corta volumes do tamanho que quiser,
            quando quiser — sem reinício.
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Redimensionar a quente</strong> — crescer um LV com o filesystem montado e em uso.</li>
            <li><strong>Somar discos</strong> — vários discos físicos formam um único Volume Group contínuo.</li>
            <li><strong>Snapshots</strong> — congelar o estado para backup (veja a aba 3).</li>
            <li><strong>Mover dados</strong> — migrar um LV de um disco para outro sem desmontar (<code>pvmove</code>).</li>
          </ul>
          <InfoBox title="Os três níveis — PV, VG, LV">
            <strong>PV</strong> (Physical Volume) é um disco/partição preparado para o LVM.
            <strong> VG</strong> (Volume Group) é o pool que junta um ou mais PVs.
            <strong> LV</strong> (Logical Volume) é o pedaço cortado do VG — é nele que você
            cria o filesystem e monta. A regra: disco vira PV, PVs entram num VG, do VG saem LVs.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Montando a pilha LVM do zero</h2>
          <p className="text-text-2 mb-4">
            Com um disco novo (<code>/dev/sdb</code>), a sequência é sempre a mesma:
            <code> pvcreate</code> → <code>vgcreate</code> → <code>lvcreate</code> →
            formatar → montar.
          </p>
          <CodeBlock lang="bash" code={`# 1) Preparar o disco como Physical Volume
sudo pvcreate /dev/sdb

# 2) Criar o Volume Group "vg_dados" com esse PV
sudo vgcreate vg_dados /dev/sdb

# 3) Cortar um Logical Volume de 10 GiB chamado "lv_app"
sudo lvcreate -L 10G -n lv_app vg_dados
#    (use -l 100%FREE para consumir todo o espaço livre do VG)

# 4) Formatar o LV — o device fica em /dev/<vg>/<lv>
sudo mkfs.ext4 /dev/vg_dados/lv_app

# 5) Montar
sudo mkdir -p /dados
sudo mount /dev/vg_dados/lv_app /dados`} />
          <InfoBox title="Inspecionar a pilha" className="mt-4">
            <code>pvdisplay</code> / <code>pvs</code> mostram os Physical Volumes;
            <code> vgdisplay</code> / <code>vgs</code>, os Volume Groups (espaço livre!);
            <code> lvdisplay</code> / <code>lvs</code>, os Logical Volumes. As versões curtas
            (<code>pvs</code>, <code>vgs</code>, <code>lvs</code>) dão um resumo em tabela.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Crescendo e encolhendo volumes</h2>
          <p className="text-text-2 mb-4">
            Aqui está o superpoder do LVM. <strong>Atenção à ordem</strong>: ao crescer,
            primeiro o LV, depois o filesystem. Ao encolher, o inverso — primeiro o
            filesystem, depois o LV — senão você corta dados.
          </p>
          <CodeBlock lang="bash" code={`# CRESCER — adicionar 5 GiB ao lv_app (precisa haver espaço livre no VG)
sudo lvextend -L +5G /dev/vg_dados/lv_app

# ...e crescer o filesystem para ocupar o novo espaço:
sudo resize2fs /dev/vg_dados/lv_app          # ext4 — pode ser feito a quente
# para XFS, use (XFS só cresce, nunca encolhe):
sudo xfs_growfs /dados

# Atalho: lvextend faz os dois passos de uma vez com -r
sudo lvextend -r -L +5G /dev/vg_dados/lv_app

# ENCOLHER ext4 (XFS NÃO encolhe) — filesystem PRIMEIRO, depois o LV
sudo umount /dados
sudo e2fsck -f /dev/vg_dados/lv_app
sudo resize2fs /dev/vg_dados/lv_app 8G       # encolhe o FS para 8 GiB
sudo lvreduce -L 8G /dev/vg_dados/lv_app     # só então reduz o LV`} />
          <WarnBox title="A pegadinha clássica do lvextend" className="mt-4">
            <code>lvextend</code> sem <code>-r</code> aumenta só o <em>contêiner</em> — o
            filesystem continua do tamanho antigo e o espaço novo fica invisível. Sempre
            rode <code>resize2fs</code>/<code>xfs_growfs</code> depois, ou use a flag{' '}
            <code>-r</code>. Já encolher <strong>XFS é impossível</strong>: ele só cresce.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Montagem permanente no /etc/fstab</h2>
          <p className="text-text-2 mb-4">
            O <code>mount</code> manual não sobrevive a um reboot. Para tornar o LV
            permanente, adicione uma linha ao <code>/etc/fstab</code>:
          </p>
          <CodeBlock lang="bash" code={`# /etc/fstab — o device-mapper expõe o LV num caminho estável
/dev/mapper/vg_dados-lv_app   /dados   ext4   defaults   0   2

# Testar a entrada SEM reiniciar (evita um servidor que não sobe!)
sudo mount -a
df -h /dados                                  # confirma que montou`} />
          <InfoBox title="device-mapper — /dev/mapper/vg-lv" className="mt-4">
            O LVM expõe cada LV em dois caminhos equivalentes:
            <code> /dev/vg_dados/lv_app</code> e <code>/dev/mapper/vg_dados-lv_app</code>.
            No <code>fstab</code> prefira a forma <code>/dev/mapper/</code> — é a canônica.
            Sempre valide com <code>mount -a</code> antes de reiniciar.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['lvm-configurado']} onChange={e => updateChecklist('lvm-configurado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['lvm-configurado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 — RAID ── */}
        {isActive('raid') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. RAID por software com mdadm</h2>
          <p className="text-text-2 mb-4">
            Disco é peça mecânica/eletrônica — ele <em>vai</em> falhar. O <strong>RAID</strong>
            (Redundant Array of Independent Disks) combina vários discos num só dispositivo
            lógico para ganhar <strong>desempenho</strong>, <strong>redundância</strong> ou
            ambos. No Linux, o <code>mdadm</code> faz RAID por software — sem controladora
            cara, portátil entre máquinas e auditável.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { n: 'RAID 0', d: 'Stripe — dados divididos entre N discos. Máximo desempenho e capacidade, ZERO redundância: um disco morre, tudo morre.', c: 'border-err/40' },
              { n: 'RAID 1', d: 'Mirror — cópia idêntica em 2+ discos. Sobrevive à perda de um disco; capacidade útil = a de um disco só.', c: 'border-ok/40' },
              { n: 'RAID 5', d: 'Stripe + paridade distribuída (mín. 3 discos). Tolera 1 falha; perde a capacidade de 1 disco para a paridade.', c: 'border-info/40' },
              { n: 'RAID 10', d: 'Espelho de stripes (mín. 4 discos). Une o desempenho do 0 com a redundância do 1 — o favorito de bancos de dados.', c: 'border-accent/40' },
            ].map((r, i) => (
              <div key={i} className={`p-3 rounded-lg bg-bg-2 border ${r.c}`}>
                <p className="font-bold text-text">{r.n}</p>
                <p className="text-text-3 mt-1 leading-snug">{r.d}</p>
              </div>
            ))}
          </div>
          <WarnBox title="RAID NÃO é backup">
            RAID protege contra <em>falha de hardware</em> — ele não te salva de um
            <code> rm -rf</code> acidental, de ransomware ou de corrupção lógica: o erro é
            replicado instantaneamente em todos os discos. RAID garante <strong>disponibilidade</strong>;
            backup garante <strong>recuperação</strong>. Você precisa dos dois.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Criando e persistindo um array</h2>
          <p className="text-text-2 mb-4">
            Vamos montar um RAID 1 (espelho) com dois discos. O array surge como{' '}
            <code>/dev/md0</code> — daí em diante ele é tratado como um disco comum
            (pode até virar um PV do LVM!).
          </p>
          <CodeBlock lang="bash" code={`# Criar um RAID 1 (mirror) com 2 discos
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc

# Acompanhar a sincronização inicial e o estado do array
cat /proc/mdstat
sudo mdadm --detail /dev/md0

# Formatar e montar o array como um disco normal
sudo mkfs.ext4 /dev/md0
sudo mount /dev/md0 /raid

# PERSISTIR — sem isto o array some no próximo boot:
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u`} />
          <InfoBox title="Hot spare — o disco reserva" className="mt-4">
            Adicione um disco extra como <strong>hot spare</strong> com{' '}
            <code>--spare-devices=1</code>. Quando um disco ativo falha, o <code>mdadm</code>
            promove o reserva e reconstrói o array <em>automaticamente</em>, sem intervenção
            humana — você troca o disco morto com calma depois.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Simulando e recuperando um disco falho</h2>
          <p className="text-text-2 mb-4">
            O melhor momento para aprender a recuperar um RAID é <em>antes</em> do disco
            morrer de verdade. O <code>mdadm</code> deixa você simular a falha:
          </p>
          <CodeBlock lang="bash" code={`# 1) Marcar um disco como falho (simulação controlada)
sudo mdadm /dev/md0 --fail /dev/sdc
cat /proc/mdstat                              # mostra [U_] — array degradado

# 2) Remover o disco falho do array
sudo mdadm /dev/md0 --remove /dev/sdc

# 3) (Trocar o disco físico) e adicionar o substituto
sudo mdadm /dev/md0 --add /dev/sdc
cat /proc/mdstat                              # recovery em andamento: [recovery] %

# Quando a barra chegar a 100%, o estado volta a [UU] — array íntegro`} />
          <WarnBox title="Array degradado é uma corrida contra o tempo" className="mt-4">
            Com um RAID 1/5 degradado você está <strong>sem rede de proteção</strong>: a
            falha do <em>segundo</em> disco durante a reconstrução significa perda total.
            Monitore com <code>mdadm --monitor</code> (envia e-mail no evento de falha) e
            troque o disco morto o mais rápido possível.
          </WarnBox>

          <WindowsComparisonBox
            windowsLabel="Windows (Storage Spaces / Disk Management)"
            linuxLabel="Linux (mdadm + LVM)"
            windowsCode={`# Windows agrupa discos via Storage Spaces
New-StoragePool -FriendlyName Pool1 \\
  -StorageSubSystemFriendlyName "*" \\
  -PhysicalDisks (Get-PhysicalDisk -CanPool $true)

# Volume virtual com resiliência (espelho)
New-VirtualDisk -StoragePoolFriendlyName Pool1 \\
  -FriendlyName Dados -ResiliencySettingName Mirror \\
  -UseMaximumSize

# Disk Management (diskmgmt.msc): GUI para
# volumes spanned / striped / mirrored.`}
            linuxCode={`# Linux separa as duas responsabilidades:
# mdadm cuida da REDUNDÂNCIA (RAID)
sudo mdadm --create /dev/md0 --level=1 \\
  --raid-devices=2 /dev/sdb /dev/sdc

# LVM cuida da FLEXIBILIDADE (volumes elásticos)
sudo pvcreate /dev/md0
sudo vgcreate vg_dados /dev/md0
sudo lvcreate -L 20G -n lv_app vg_dados

# Combinação clássica: RAID embaixo, LVM em cima.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['raid-montado']} onChange={e => updateChecklist('raid-montado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['raid-montado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 — Snapshots & ZFS ── */}
        {isActive('snapshots') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Snapshots LVM — backup consistente</h2>
          <p className="text-text-2 mb-4">
            Fazer backup de um banco de dados em uso é arriscado: os arquivos mudam <em>durante</em>
            a cópia e o backup sai inconsistente. O <strong>snapshot LVM</strong> resolve isso —
            ele congela um instantâneo do LV num ponto exato no tempo. Você faz o backup do
            snapshot (estado parado) enquanto o sistema continua escrevendo no LV original.
          </p>
          <CodeBlock lang="bash" code={`# Criar um snapshot de 2 GiB do lv_app — o -L dimensiona a área de cópia-na-escrita
sudo lvcreate --snapshot --size 2G --name snap_app /dev/vg_dados/lv_app

# Montar o snapshot só-leitura e fazer o backup do estado congelado
sudo mkdir -p /mnt/snap
sudo mount -o ro /dev/vg_dados/snap_app /mnt/snap
sudo tar czf /backup/app-\${HOSTNAME}-\$(date +%F).tar.gz -C /mnt/snap .

# Backup feito — descartar o snapshot
sudo umount /mnt/snap
sudo lvremove /dev/vg_dados/snap_app

# Alternativa: reverter o LV ao estado do snapshot (merge) — desfaz mudanças
sudo lvconvert --merge /dev/vg_dados/snap_app`} />
          <WarnBox title="O snapshot tem tamanho — e pode estourar" className="mt-4">
            O snapshot LVM usa <em>copy-on-write</em>: cada bloco alterado no LV original é
            copiado para a área do snapshot. Se essa área (<code>--size</code>) encher antes
            de você descartar o snapshot, ele é <strong>invalidado</strong> e fica inútil.
            Dimensione conforme o volume de escrita esperado e <strong>remova o snapshot
            assim que o backup terminar</strong> — snapshot esquecido degrada o desempenho.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. ZFS — o filesystem que faz tudo</h2>
          <p className="text-text-2 mb-4">
            LVM + mdadm + ext4 são três camadas que você empilha. O <strong>ZFS</strong>
            unifica gerenciador de volumes, RAID e filesystem numa coisa só — com{' '}
            <strong>snapshots instantâneos</strong> (custo zero, criados em milissegundos),
            <strong> checksums end-to-end</strong> (detecta e corrige corrupção silenciosa) e
            compressão transparente. É o coração do armazenamento no Proxmox e no TrueNAS.
          </p>
          <CodeBlock lang="bash" code={`# Criar um pool ZFS com redundância — raidz1 ≈ RAID 5 (tolera 1 disco)
sudo zpool create tank raidz1 /dev/sdb /dev/sdc /dev/sdd

# Datasets — "pastas" com propriedades próprias (cota, compressão, etc.)
sudo zfs create tank/dados
sudo zfs create tank/backups
sudo zfs set compression=lz4 tank/dados       # compressão transparente
sudo zfs set quota=50G tank/backups           # limite de tamanho

# Snapshot ZFS — instantâneo, custo praticamente zero
sudo zfs snapshot tank/dados@antes-do-deploy
sudo zfs list -t snapshot

# Reverter o dataset inteiro ao snapshot (rollback)
sudo zfs rollback tank/dados@antes-do-deploy

# Estado do pool e saúde dos discos
sudo zpool status tank`} />
          <InfoBox title="RAID-Z — o RAID do ZFS" className="mt-4">
            O ZFS tem seu próprio RAID: <code>raidz1</code> (1 disco de paridade ≈ RAID 5),
            <code> raidz2</code> (2 discos ≈ RAID 6) e <code>raidz3</code>. Ele resolve o
            &quot;write hole&quot; do RAID 5 tradicional e, graças aos checksums, detecta
            corrupção que um RAID por hardware nem perceberia.
          </InfoBox>

          <h3 className="text-xl font-bold mt-8 mb-3">LVM + mdadm + ext4/xfs &nbsp;vs&nbsp; ZFS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-bg-3 text-text-2 text-left">
                  <th className="p-3 font-bold">Critério</th>
                  <th className="p-3 font-bold">LVM + mdadm + ext4/xfs</th>
                  <th className="p-3 font-bold">ZFS</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                {[
                  ['Arquitetura', 'Três camadas empilhadas', 'Camada única integrada'],
                  ['Snapshots', 'CoW com área dimensionada (pode estourar)', 'Instantâneos, custo ~zero, ilimitados'],
                  ['Integridade', 'Sem checksum de dados', 'Checksum end-to-end + autocura'],
                  ['Compressão', 'Não nativa', 'Transparente (lz4, zstd)'],
                  ['Maturidade no Linux', 'Padrão, no kernel, em toda distro', 'Módulo à parte (licença CDDL)'],
                  ['Uso de RAM', 'Modesto', 'Gosta de muita RAM (cache ARC)'],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 font-medium text-text">{row[0]}</td>
                    <td className="p-3">{row[1]}</td>
                    <td className="p-3">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <InfoBox title="Qual escolher?" className="mt-4">
            Em servidores comuns e VMs, <strong>LVM + mdadm</strong> é o padrão sólido,
            previsível e onipresente — todo Linux já tem. Para NAS, storage de virtualização
            (Proxmox/TrueNAS) e dados que <em>não podem</em> corromper silenciosamente, o{' '}
            <strong>ZFS</strong> compensa a RAM extra com integridade e snapshots de graça.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['snapshot-criado']} onChange={e => updateChecklist('snapshot-criado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['snapshot-criado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns e Soluções</h2>
          <div className="space-y-3">
            {[
              { erro: 'Esquecer o resize2fs/xfs_growfs depois do lvextend', sol: 'lvextend só aumenta o contêiner — o filesystem continua do tamanho antigo e o espaço novo fica invisível. Rode resize2fs (ext4) ou xfs_growfs (xfs), ou use lvextend -r para fazer os dois passos juntos.' },
              { erro: 'Tentar remover um PV ainda em uso pelo VG', sol: 'vgreduce/pvremove falham se houver extents alocados no PV. Primeiro mova os dados com pvmove /dev/sdb, depois vgreduce vg_dados /dev/sdb e só então pvremove /dev/sdb.' },
              { erro: 'Usar RAID 0 achando que há redundância', sol: 'RAID 0 é puro stripe: zero proteção. A falha de qualquer disco destrói TODO o array. Para tolerar falhas use RAID 1, 5 ou 10 — RAID 0 só serve quando desempenho importa e os dados são descartáveis.' },
              { erro: 'Snapshot LVM que enche e é invalidado', sol: 'O snapshot usa copy-on-write numa área de tamanho fixo (--size). Se ela encher, o snapshot vira inválido e inútil. Dimensione conforme a escrita esperada e remova o snapshot assim que o backup terminar — snapshot esquecido também degrada o desempenho.' },
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

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">

            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Pilha LVM completa e crescimento a quente</p>
              <CodeBlock lang="bash" code={`# Com um disco de teste /dev/sdb (use um disco virtual na VM!)
sudo pvcreate /dev/sdb
sudo vgcreate vg_lab /dev/sdb
sudo lvcreate -L 4G -n lv_lab vg_lab
sudo mkfs.ext4 /dev/vg_lab/lv_lab
sudo mkdir -p /lab && sudo mount /dev/vg_lab/lv_lab /lab
df -h /lab                                   # anote o tamanho: ~4G

# Cresça o volume a quente, com o filesystem montado:
sudo lvextend -r -L +3G /dev/vg_lab/lv_lab
df -h /lab                                   # agora deve mostrar ~7G`} />
            </div>

            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — RAID 1 e simulação de falha de disco</p>
              <CodeBlock lang="bash" code={`# Com dois discos de teste /dev/sdc e /dev/sdd
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdc /dev/sdd
cat /proc/mdstat                             # aguarde a sincronização [UU]
sudo mkfs.ext4 /dev/md0
sudo mkdir -p /raid && sudo mount /dev/md0 /raid
echo "dado importante" | sudo tee /raid/teste.txt

# Simule a morte de um disco e recupere:
sudo mdadm /dev/md0 --fail /dev/sdd --remove /dev/sdd
cat /raid/teste.txt                          # os dados continuam acessíveis!
sudo mdadm /dev/md0 --add /dev/sdd           # disco substituto reconstrói o array
cat /proc/mdstat                             # acompanhe o [recovery] até [UU]`} />
            </div>

            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Snapshot LVM para backup consistente</p>
              <CodeBlock lang="bash" code={`# Reusando o lv_lab do Lab 1, com alguns arquivos dentro de /lab
sudo lvcreate --snapshot --size 1G --name snap_lab /dev/vg_lab/lv_lab

# Monte o snapshot só-leitura e faça o backup do estado congelado
sudo mkdir -p /mnt/snap
sudo mount -o ro /dev/vg_lab/snap_lab /mnt/snap
sudo tar czf /tmp/backup-\$(date +%F).tar.gz -C /mnt/snap .

# Enquanto isso, /lab pode receber escritas normalmente.
# Limpe o snapshot ao terminar:
sudo umount /mnt/snap
sudo lvremove -y /dev/vg_lab/snap_lab`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/lvm-raid" />

      </div>
    </main>
  );
}
