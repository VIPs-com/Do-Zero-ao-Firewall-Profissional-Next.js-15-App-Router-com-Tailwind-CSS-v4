'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Server, Shield, Database, Zap, CheckCircle, ExternalLink, GitFork } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { StepItem } from '@/components/ui/Steps';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';

export default function ProxmoxPage() {
  const { trackPageVisit, updateChecklist, checklist, unlockBadge } = useBadges();

  useEffect(() => {
    trackPageVisit('proxmox');
  }, [trackPageVisit]);

  const allProxmoxDone =
    checklist['proxmox-iso'] && checklist['proxmox-bridges'] &&
    checklist['proxmox-vms'] && checklist['proxmox-snapshot'];

  useEffect(() => {
    if (allProxmoxDone) unlockBadge('proxmox-pioneer');
  }, [allProxmoxDone, unlockBadge]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-hero" style={{ '--module-color': 'var(--color-accent)' } as React.CSSProperties}>
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/laboratorio">Ambientes de Laboratório</Link>
        <span>/</span>
        <span className="text-text-2">Proxmox VE</span>
      </div>

      <div className="section-label">Laboratório Profissional</div>
      <h1 className="section-title">⚡ Proxmox VE — Lab de Produção</h1>
      <p className="section-sub">
        A plataforma de virtualização empresarial em código aberto. Mesmo hypervisor usado em data centers reais — aprenda o padrão do mercado.
      </p>

      {/* ── Por que Proxmox ───────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">1. Por que Proxmox para Produção?</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            { icon: <Server size={20} className="text-accent" />, title: 'Web UI Completa', desc: 'Gerencie todas as VMs, redes e storage via browser na porta 8006 — sem instalar software no cliente.' },
            { icon: <Database size={20} className="text-ok" />, title: 'Snapshot Nativo', desc: 'Snapshots com 1 clique antes de qualquer mudança. Rollback instantâneo se algo der errado.' },
            { icon: <Shield size={20} className="text-info" />, title: 'Backup Agendado', desc: 'vzdump faz backup de VMs inteiras para NFS, CIFS ou disco local. Agendável pela Web UI.' },
            { icon: <GitFork size={20} className="text-warn" />, title: 'Cluster & HA', desc: 'Cluster nativo de múltiplos nodes com Live Migration de VMs e failover automático.' },
          ].map(item => (
            <div key={item.title} className="bg-bg-2 border border-border rounded-xl p-5 flex gap-4 hover:border-accent/30 transition-colors">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div>
                <p className="font-bold mb-1">{item.title}</p>
                <p className="text-sm text-text-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <FluxoCard title="Stack do Proxmox VE" steps={[
          { label: 'Proxmox Web UI', sub: 'https://IP:8006', icon: <Server size={16} />, color: 'border-accent/50' },
          { label: 'API REST Proxmox', sub: 'pvesh / CLI', icon: <Zap size={16} />, color: 'border-info/50' },
          { label: 'KVM / QEMU', sub: 'Hypervisor de VMs', icon: <Server size={16} />, color: 'border-ok/50' },
          { label: 'Linux Host', sub: 'Debian sob o Proxmox', icon: <Shield size={16} />, color: 'border-warn/50' },
        ]} />
      </section>

      {/* ── Instalação ────────────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">2. Instalação do Proxmox VE</h2>

        <WarnBox title="Proxmox instala no bare-metal">
          Proxmox VE substitui o sistema operacional do servidor — não é instalado dentro do Windows ou Linux existente. Você precisa de uma máquina dedicada (física ou VM de hypervisor aninhado para fins de estudo).
        </WarnBox>

        <div className="grid md:grid-cols-2 gap-4 mt-6 mb-6">
          <StepItem number={1} title="Baixar ISO do Proxmox VE" description="Acesse proxmox.com/en/downloads e baixe a ISO mais recente do Proxmox VE (ex: proxmox-ve_8.x.iso — sempre pegue a versão estável mais nova)." />
          <StepItem number={2} title="Criar USB bootável" description="Use Rufus (Windows) ou dd (Linux): dd if=proxmox-ve.iso of=/dev/sdX bs=1M conv=fdatasync" />
          <StepItem number={3} title="Boot pelo USB e instalar" description="Siga o assistente gráfico: aceite a licença, escolha o disco de destino, configure senha root e endereço IP estático da management interface." />
          <StepItem number={4} title="Acessar a Web UI" description="Após reiniciar, acesse https://IP-DO-SERVIDOR:8006 no browser. O certificado autoassinado vai gerar aviso — clique em Avançado e continue. Login: root + senha." />
        </div>

        <CodeBlock
          title="Verificação pós-instalação (na console do servidor)"
          lang="bash"
          code={`# Verificar versão do Proxmox:
pveversion
# Output: pve-manager/8.x.x (running kernel: 6.x.x-pve)

# Ver status do cluster (mesmo com 1 node):
pvecm status

# Listar VMs existentes (inicialmente vazio):
qm list

# Ver logs recentes:
journalctl -b 0 --no-pager | tail -20`}
        />

        <button
          onClick={() => updateChecklist('proxmox-iso', !checklist['proxmox-iso'])}
          className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['proxmox-iso'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
        >
          <CheckCircle size={16} />
          {checklist['proxmox-iso'] ? 'Proxmox instalado e Web UI acessível ✓' : 'Proxmox instalado e Web UI acessível'}
        </button>
      </section>

      {/* ── Configuração de Rede ──────────────────────────────────────────────── */}
      <section id="bridges" className="mb-16">
        <h2 className="text-2xl font-bold mb-6">3. Configuração de Rede — Bridges para 3 Zonas</h2>

        <p className="text-text-2 mb-4">
          Proxmox usa bridges Linux (<code>vmbr</code>) para conectar VMs às redes. Para replicar a topologia WAN/DMZ/LAN, criamos 3 bridges:
        </p>

        <div className="overflow-x-auto rounded-xl border border-border mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-3 border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-text-2">Bridge</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Zona</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Interface física</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">IP do host Proxmox</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-accent font-bold">vmbr0</td>
                <td className="px-4 py-3">WAN</td>
                <td className="px-4 py-3 font-mono text-xs">enp0s3 (placa física)</td>
                <td className="px-4 py-3 font-mono text-xs">192.168.20.200/24</td>
              </tr>
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-info font-bold">vmbr1</td>
                <td className="px-4 py-3">DMZ</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">sem placa (bridge interna)</td>
                <td className="px-4 py-3 font-mono text-xs">192.168.56.1/24</td>
              </tr>
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-ok font-bold">vmbr2</td>
                <td className="px-4 py-3">LAN</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">sem placa (bridge interna)</td>
                <td className="px-4 py-3 font-mono text-xs">192.168.57.1/24</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="/etc/network/interfaces — Configuração completa das bridges"
          lang="bash"
          code={`# Proxmox usa ifupdown (não Netplan!)
# Editar: nano /etc/network/interfaces

auto lo
iface lo inet loopback

# vmbr0: WAN — conectada à placa física
auto vmbr0
iface vmbr0 inet static
    address 192.168.20.200/24
    gateway 192.168.20.1
    bridge-ports enp0s3
    bridge-stp off
    bridge-fd 0

# vmbr1: DMZ — bridge interna sem placa física
auto vmbr1
iface vmbr1 inet static
    address 192.168.56.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0

# vmbr2: LAN — bridge interna
auto vmbr2
iface vmbr2 inet static
    address 192.168.57.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0`}
        />

        <CodeBlock
          title="Aplicar e verificar as bridges"
          lang="bash"
          code={`# Aplicar configuração (pode perder conexão brevemente):
ifreload -a

# Verificar bridges criadas:
brctl show
# bridge name    bridge id    STP    interfaces
# vmbr0         ...           no     enp0s3
# vmbr1         ...           no
# vmbr2         ...           no

# Verificar IPs atribuídos:
ip addr show vmbr0
ip addr show vmbr1
ip addr show vmbr2`}
        />

        <button
          onClick={() => updateChecklist('proxmox-bridges', !checklist['proxmox-bridges'])}
          className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['proxmox-bridges'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
        >
          <CheckCircle size={16} />
          {checklist['proxmox-bridges'] ? 'vmbr0, vmbr1 e vmbr2 configuradas ✓' : 'Bridges vmbr0/vmbr1/vmbr2 configuradas e verificadas'}
        </button>
      </section>

      {/* ── Criando VMs ───────────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">4. Criando as VMs do Laboratório</h2>

        <div className="overflow-x-auto rounded-xl border border-border mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-3 border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-text-2">VM ID</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Nome</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">RAM</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Disco</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Interfaces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['100', '🔥 Firewall', '2 GB', '20 GB', 'vmbr0 + vmbr1 + vmbr2'],
                ['101', '📖 DNS Server', '1 GB', '10 GB', 'vmbr1 (DMZ)'],
                ['102', '🌐 Web Server', '1 GB', '10 GB', 'vmbr1 (DMZ)'],
                ['103', '💻 Cliente LAN', '1 GB', '10 GB', 'vmbr2 (LAN)'],
              ].map(([id, name, ram, disk, ifaces]) => (
                <tr key={id} className="hover:bg-bg-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-accent">{id}</td>
                  <td className="px-4 py-3 font-bold">{name}</td>
                  <td className="px-4 py-3">{ram}</td>
                  <td className="px-4 py-3">{disk}</td>
                  <td className="px-4 py-3 font-mono text-xs">{ifaces}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Criar VMs via CLI do Proxmox (qm)"
          lang="bash"
          code={`# VM Firewall (ID 100) com 3 interfaces de rede:
qm create 100 \\
  --name firewall \\
  --memory 2048 \\
  --cores 2 \\
  --net0 virtio,bridge=vmbr0 \\
  --net1 virtio,bridge=vmbr1 \\
  --net2 virtio,bridge=vmbr2 \\
  --scsi0 local-lvm:20 \\
  --ide2 local:iso/ubuntu-22.04-live-server.iso,media=cdrom \\
  --boot order=ide2 \\
  --ostype l26

# VM DNS Server (ID 101) — apenas DMZ:
qm create 101 \\
  --name dns-server \\
  --memory 1024 \\
  --cores 1 \\
  --net0 virtio,bridge=vmbr1 \\
  --scsi0 local-lvm:10 \\
  --ide2 local:iso/ubuntu-22.04-live-server.iso,media=cdrom \\
  --boot order=ide2 \\
  --ostype l26

# Iniciar VMs:
qm start 100
qm start 101

# Console da VM (via terminal):
qm terminal 100

# Listar todas as VMs:
qm list`}
        />

        <InfoBox title="Alternativa: via Web UI do Proxmox">
          Na Web UI (https://IP:8006), vá em <strong>Datacenter → Nó → Create VM</strong>. O assistente gráfico guia cada etapa. Em <strong>Network</strong>, selecione a bridge correta (vmbr0/vmbr1/vmbr2) para cada interface. Para o Firewall, clique em <strong>Add</strong> para adicionar interfaces extras.
        </InfoBox>

        <button
          onClick={() => updateChecklist('proxmox-vms', !checklist['proxmox-vms'])}
          className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['proxmox-vms'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
        >
          <CheckCircle size={16} />
          {checklist['proxmox-vms'] ? '4 VMs criadas e iniciadas ✓' : '4 VMs (Firewall, DNS, Web, Cliente) criadas'}
        </button>
      </section>

      {/* ── Snapshots e Backup ────────────────────────────────────────────────── */}
      <section id="backup" className="mb-16">
        <h2 className="text-2xl font-bold mb-6">5. Snapshots e Backup — A Killer Feature</h2>

        <p className="text-text-2 mb-4">
          Snapshots são a razão mais forte para usar Proxmox. Tire um snapshot antes de qualquer mudança — se algo quebrar, reverta em segundos sem reinstalar o sistema.
        </p>

        <CodeBlock
          title="Snapshots com qm snapshot"
          lang="bash"
          code={`# Tirar snapshot antes de começar (estado zerado):
qm snapshot 100 snap-base --description "Firewall — estado inicial limpo"
qm snapshot 101 snap-base --description "DNS Server — estado inicial"

# Listar snapshots da VM 100:
qm listsnapshot 100
# current   *current*                       now
# snap-base  Firewall - estado inicial       2026-04-17 10:00:00

# Após configurar iptables — novo snapshot:
qm snapshot 100 snap-iptables --description "Firewall — iptables configurado"

# Reverter para estado inicial (se algo der errado):
qm rollback 100 snap-base

# Deletar snapshot (libera espaço em disco):
qm delsnapshot 100 snap-iptables`}
        />

        <CodeBlock
          title="Backup completo com vzdump"
          lang="bash"
          code={`# Backup da VM 100 para storage local:
vzdump 100 --storage local --compress gzip

# Backup de TODAS as VMs de uma vez:
vzdump --all --storage local --compress gzip

# Backup para NFS (padrão em produção):
vzdump 100 --storage nfs-backup --compress lzo --mode snapshot

# Listar backups disponíveis:
ls -lh /var/lib/vz/dump/
# vzdump-qemu-100-2026_04_17-10_00_00.vma.gz

# Restaurar VM a partir de backup (novo ID 200):
qmrestore /var/lib/vz/dump/vzdump-qemu-100-*.vma.gz 200`}
        />

        <InfoBox title="Backup agendado via Web UI">
          Em <strong>Datacenter → Backup</strong> na Web UI, crie um job agendado: selecione as VMs, horário (ex: 02:00 todo dia), storage de destino e política de retenção (ex: manter últimos 7 backups). Clique em <strong>Run now</strong> para testar imediatamente.
        </InfoBox>

        <button
          onClick={() => updateChecklist('proxmox-snapshot', !checklist['proxmox-snapshot'])}
          className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['proxmox-snapshot'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
        >
          <CheckCircle size={16} />
          {checklist['proxmox-snapshot'] ? 'Snapshot tirado e rollback testado ✓' : 'Snapshot criado e rollback funcionando'}
        </button>
      </section>

      {/* ── Cluster básico ────────────────────────────────────────────────────── */}
      <section id="cluster" className="mb-16">
        <h2 className="text-2xl font-bold mb-6">6. Cluster Proxmox — Conceito para Produção</h2>

        <p className="text-text-2 mb-4">
          Em empresas, o Proxmox raramente roda em um único servidor. Um cluster com 3+ nodes permite alta disponibilidade real:
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: '🔄', title: 'Live Migration', desc: 'Mover VMs entre nodes sem desligar — manutenção sem downtime para os usuários.' },
            { icon: '⚡', title: 'HA (Alta Disponibilidade)', desc: 'Se um node cair, as VMs reiniciam automaticamente em outro node em segundos.' },
            { icon: '🗄️', title: 'Storage Compartilhado', desc: 'Ceph (nativo) ou NFS como storage entre todos os nodes — VMs acessíveis de qualquer lugar.' },
          ].map(item => (
            <div key={item.title} className="bg-bg-2 border border-border rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-text-3">{item.desc}</p>
            </div>
          ))}
        </div>

        <CodeBlock
          title="Criar e gerenciar cluster Proxmox"
          lang="bash"
          code={`# Node 1 — criar o cluster:
pvecm create workshop-cluster

# Nodes 2 e 3 — entrar no cluster (executar em cada node):
pvecm add IP-DO-NODE-1

# Ver status do cluster:
pvecm status
# Quorum information
# ------------------
# Members: 3
# Quorum: Yes

# Ver todos os nodes no cluster:
pvecm nodes

# Live Migration de VM do node 1 para o node 2:
qm migrate 100 node2 --online`}
        />
      </section>

      {/* ── Badge conquista ───────────────────────────────────────────────────── */}
      {allProxmoxDone && (
        <div className="bg-gradient-to-r from-accent/10 to-ok/10 border border-accent/30 rounded-xl p-6 text-center mb-8">
          <div className="text-4xl mb-3">🥇</div>
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-1">Badge Desbloqueado!</p>
          <p className="font-bold text-lg">Proxmox Pioneer</p>
          <p className="text-text-2 text-sm">Você configurou um laboratório profissional completo no Proxmox VE.</p>
        </div>
      )}

      {/* ── Próximos passos ───────────────────────────────────────────────────── */}
      <div className="bg-bg-2 border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <ExternalLink size={16} className="text-accent" />
          Referências e Próximos Passos
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-text-2 mb-2">Documentação oficial</p>
            <ul className="space-y-1 text-text-3">
              <li>• pve.proxmox.com/wiki (documentação completa)</li>
              <li>• forum.proxmox.com (comunidade ativa)</li>
              <li>• youtube: Techno Tim — Proxmox series</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-text-2 mb-2">Configurar o laboratório</p>
            <ul className="space-y-1">
              <li><Link href="/wan-nat" className="text-accent hover:underline">→ WAN e NAT com iptables</Link></li>
              <li><Link href="/dns" className="text-accent hover:underline">→ DNS BIND9 na DMZ</Link></li>
              <li><Link href="/nginx-ssl" className="text-accent hover:underline">→ Nginx com SSL/TLS</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Windows Comparison */}
      <div className="mt-12">
        <WindowsComparisonBox
          windowsLabel="Windows — Hyper-V / VMware vSphere"
          linuxLabel="Linux — Proxmox VE (KVM + LXC)"
          windowsCode={`# Windows Hyper-V — virtualização nativa no Windows Server

# 1. Instalar Hyper-V no Windows Server:
Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart

# 2. Criar VM via PowerShell (equivalente ao virt-install):
New-VM -Name "Firewall-VM" -MemoryStartupBytes 2GB \\
  -Generation 2 -NewVHDPath "C:\\VMs\\Firewall.vhdx" \\
  -NewVHDSizeBytes 20GB -SwitchName "Default Switch"

Set-VMProcessor "Firewall-VM" -Count 2
Add-VMDvdDrive "Firewall-VM"
Set-VMDvdDrive "Firewall-VM" -Path "C:\\ISOs\\ubuntu.iso"
Start-VM "Firewall-VM"

# 3. Snapshot (Checkpoint no Hyper-V):
Checkpoint-VM -Name "Firewall-VM" -SnapshotName "Base"
Get-VMSnapshot -VMName "Firewall-VM"
Restore-VMCheckpoint -Name "Firewall-VM" \\
  -VMCheckpoint (Get-VMSnapshot -VMName "Firewall-VM" -Name "Base")

# 4. Cluster HA no Windows (Failover Clustering):
Install-WindowsFeature Failover-Clustering -IncludeManagementTools
New-Cluster -Name "HVCluster" -Node Server1,Server2 \\
  -StaticAddress 10.0.0.10`}
          linuxCode={`# Proxmox VE — plataforma profissional de virtualização

# 1. Instalar Proxmox (ISO bare-metal — sem apt install):
#    Baixar ISO: proxmox.com/downloads → Proxmox VE 8.x ISO
#    Gravar em USB e bootar. Instala Debian + Proxmox automaticamente.

# 2. Acessar Web UI após instalação:
#    https://IP-DO-SERVIDOR:8006
#    Login: root / senha definida no instalador

# 3. Criar VM via CLI (equivalente ao New-VM do PowerShell):
qm create 100 --name "Firewall" --memory 2048 \\
  --cores 2 --net0 virtio,bridge=vmbr0
qm importdisk 100 ubuntu-22.04.iso local-lvm
qm set 100 --ide2 local-lvm:iso/ubuntu.iso,media=cdrom
qm start 100

# 4. Snapshot via CLI (equivalente ao Checkpoint-VM):
qm snapshot 100 snap-base "Estado inicial"
qm listsnapshot 100
qm rollback 100 snap-base

# 5. Cluster HA (nativo, via Web UI ou pvecm):
pvecm create "meu-cluster"   # Nó inicial
pvecm add IP-NO-2            # Adicionar segundo nó
pvecm status                  # Status do cluster`}
        />
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/proxmox" />
    </div>
  );
}
