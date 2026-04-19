'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Server, Cpu, Layers, CheckCircle, ArrowRight, Terminal, Package, Zap } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { StepItem } from '@/components/ui/Steps';
import { InfoBox } from '@/components/ui/Boxes';
import { ModuleNav } from '@/components/ui/ModuleNav';

export default function LaboratorioPage() {
  const { trackPageVisit, updateChecklist, checklist } = useBadges();

  useEffect(() => {
    trackPageVisit('laboratorio');
  }, [trackPageVisit]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-hero" style={{ '--module-color': 'var(--color-layer-4)' } as React.CSSProperties}>
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Ambientes de Laboratório</span>
      </div>

      <div className="section-label">Infraestrutura</div>
      <h1 className="section-title">🖥️ Ambientes de Laboratório</h1>
      <p className="section-sub">
        Três plataformas de virtualização para cada estágio da sua carreira — do aprendizado inicial ao ambiente de produção profissional.
      </p>

      {/* ── Tabela Comparativa ────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">1. Qual Ambiente Escolher?</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-3 border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-text-2 w-32">Critério</th>
                <th className="text-left px-4 py-3 font-bold text-blue-400">VirtualBox</th>
                <th className="text-left px-4 py-3 font-bold text-purple-400">KVM / libvirt</th>
                <th className="text-left px-4 py-3 font-bold text-accent">Proxmox VE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['Custo',        'Gratuito', 'Gratuito', 'Gratuito (Community)', 'text-ok', 'text-ok', 'text-ok'],
                ['Interface',    'GUI Desktop', 'CLI + virt-manager', 'Web UI (porta 8006)', '', '', 'text-accent font-semibold'],
                ['Overhead',     'Médio', 'Baixo', 'Baixo (bare-metal)', 'text-warn', 'text-ok', 'text-ok'],
                ['Snapshot',     'Básico (GUI)', 'virsh snapshot', 'Nativo + agendado', '', '', 'text-accent font-semibold'],
                ['Cluster / HA', 'Não', 'Manual', 'Nativo', 'text-err', 'text-warn', 'text-ok font-semibold'],
                ['Caso de uso',  'Aprendizado inicial', 'Dev / testes rápidos', 'Produção / empresa', '', '', 'text-accent font-semibold'],
                ['Recomendado para', 'Iniciante', 'Intermediário', 'Avançado / Profissional', '', '', 'text-accent font-semibold'],
              ].map(([label, vbox, kvm, prox, vboxClass, kvmClass, proxClass]) => (
                <tr key={label} className="hover:bg-bg-3 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-text-3">{label}</td>
                  <td className={`px-4 py-3 ${vboxClass}`}>{vbox}</td>
                  <td className={`px-4 py-3 ${kvmClass}`}>{kvm}</td>
                  <td className={`px-4 py-3 ${proxClass}`}>{prox}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => updateChecklist('lab-comparison-read', !checklist['lab-comparison-read'])}
          className={`mt-4 flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['lab-comparison-read'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
        >
          <CheckCircle size={16} />
          {checklist['lab-comparison-read'] ? 'Tabela comparativa lida ✓' : 'Marcar tabela como lida'}
        </button>
      </section>

      {/* ── VirtualBox ────────────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Layers className="text-blue-400" size={22} />
          </div>
          <h2 className="text-2xl font-bold">2. VirtualBox — Laboratório de Aprendizado</h2>
        </div>

        <div className="bg-bg-2 border border-blue-500/20 rounded-xl p-6 mb-6">
          <p className="text-text-2 mb-4">
            VirtualBox é a plataforma ideal para iniciar. Roda no seu sistema operacional atual (Windows, macOS ou Linux), tem interface gráfica intuitiva e não exige hardware dedicado.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-ok mb-2">✅ Vantagens</p>
              <ul className="space-y-1 text-text-2">
                <li>• Instala no Windows / macOS</li>
                <li>• GUI para criar e gerenciar VMs</li>
                <li>• Guest Additions para melhor desempenho</li>
                <li>• Rede NAT automática sem configuração</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-warn mb-2">⚠️ Limitações</p>
              <ul className="space-y-1 text-text-2">
                <li>• Rodando sobre outro OS (overhead duplo)</li>
                <li>• Sem web UI centralizada</li>
                <li>• Snapshots manuais e lentos</li>
                <li>• Não é usado em produção</li>
              </ul>
            </div>
          </div>
        </div>

        <Link href="/instalacao" className="inline-flex items-center gap-2 btn-outline text-sm">
          <ArrowRight size={16} />
          Ver guia completo de instalação com VirtualBox
        </Link>
      </section>

      {/* ── KVM / libvirt ─────────────────────────────────────────────────────── */}
      <section id="kvm" className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Cpu className="text-purple-400" size={22} />
          </div>
          <h2 className="text-2xl font-bold">3. KVM / libvirt — Laboratório de Desenvolvimento</h2>
        </div>

        <p className="text-text-2 mb-6">
          KVM (Kernel-based Virtual Machine) é o hypervisor nativo do Linux. É o que o Proxmox usa por baixo. Aprender KVM diretamente dá fluência no vocabulário de virtualização profissional.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <StepItem number={1} title="Instalar KVM + libvirt" description="Requisito: processador com suporte a Intel VT-x ou AMD-V. Verificar com: egrep -c '(vmx|svm)' /proc/cpuinfo — resultado > 0 = OK." />
          <StepItem number={2} title="Habilitar libvirtd" description="O daemon libvirtd gerencia VMs, redes virtuais e storage pools. Habilitar no boot com systemctl enable --now libvirtd." />
          <StepItem number={3} title="Criar primeira VM" description="virt-install é a CLI para criar VMs com parâmetros precisos: nome, RAM, disco, interfaces de rede e ISO de instalação." />
          <StepItem number={4} title="Gerenciar com virsh" description="virsh é o cliente de linha de comando do libvirt — equivale ao 'docker' para VMs. virsh list --all, start, stop, snapshot." />
        </div>

        <CodeBlock
          title="Instalação do KVM e libvirt"
          lang="bash"
          code={`# Verificar suporte do CPU (deve retornar > 0):
egrep -c "(vmx|svm)" /proc/cpuinfo

# Instalar tudo necessário:
apt install qemu-kvm libvirt-daemon-system libvirt-clients \\
    virtinst virt-manager bridge-utils -y

# Habilitar e iniciar o daemon:
systemctl enable --now libvirtd

# Adicionar seu usuário ao grupo libvirt (não precisar de sudo):
usermod -aG libvirt $USER
newgrp libvirt

# Verificar instalação:
virsh version
# Output esperado: Compiled against library: libvirt 8.x.x`}
        />

        <CodeBlock
          title="Criar as VMs do laboratório com virt-install"
          lang="bash"
          code={`# VM Firewall (3 interfaces: WAN + DMZ + LAN):
virt-install \\
  --name firewall \\
  --ram 2048 \\
  --vcpus 2 \\
  --disk path=/var/lib/libvirt/images/firewall.qcow2,size=20 \\
  --cdrom /tmp/ubuntu-22.04-server.iso \\
  --network network=default,model=virtio \\
  --network network=dmz,model=virtio \\
  --network network=lan,model=virtio \\
  --os-variant ubuntu22.04 \\
  --graphics none \\
  --console pty,target_type=serial

# VM DNS Server (apenas DMZ):
virt-install \\
  --name dns-server \\
  --ram 1024 --vcpus 1 \\
  --disk path=/var/lib/libvirt/images/dns.qcow2,size=10 \\
  --cdrom /tmp/ubuntu-22.04-server.iso \\
  --network network=dmz,model=virtio \\
  --os-variant ubuntu22.04

# Verificar todas as VMs:
virsh list --all`}
        />

        <CodeBlock
          title="Gerenciamento com virsh — comandos essenciais"
          lang="bash"
          code={`# Listar VMs:
virsh list --all
#  Id   Name        State
# --------------------------
#  1    firewall    running
#  -    dns-server  shut off

# Iniciar / parar / reiniciar:
virsh start firewall
virsh shutdown firewall    # graceful (ACPI)
virsh destroy firewall     # forçado (como desligar na tomada)
virsh reboot firewall

# Console serial (sem GUI):
virsh console firewall
# Pressione Ctrl+] para sair

# Snapshot — o superpoder do KVM:
virsh snapshot-create-as firewall snap-base "Estado inicial limpo"
virsh snapshot-list firewall
virsh snapshot-revert firewall snap-base

# Clonar VM inteira:
virt-clone --original firewall --name firewall-backup \\
    --file /var/lib/libvirt/images/firewall-backup.qcow2`}
        />

        <CodeBlock
          title="Criar redes virtuais (DMZ e LAN) com virsh"
          lang="bash"
          code={`# Criar definição para rede DMZ:
cat > /tmp/rede-dmz.xml << 'EOF'
<network>
  <name>dmz</name>
  <bridge name="virbr-dmz" stp="on" delay="0"/>
  <ip address="192.168.56.1" netmask="255.255.255.0"/>
</network>
EOF

# Criar definição para rede LAN:
cat > /tmp/rede-lan.xml << 'EOF'
<network>
  <name>lan</name>
  <bridge name="virbr-lan" stp="on" delay="0"/>
  <ip address="192.168.57.1" netmask="255.255.255.0"/>
</network>
EOF

# Definir, iniciar e habilitar no boot:
virsh net-define /tmp/rede-dmz.xml && virsh net-start dmz && virsh net-autostart dmz
virsh net-define /tmp/rede-lan.xml && virsh net-start lan && virsh net-autostart lan

# Verificar redes ativas:
virsh net-list --all`}
        />

        <InfoBox title="virt-manager como alternativa gráfica">
          Se preferir interface gráfica, <code>virt-manager</code> oferece uma GUI completa para gerenciar VMs KVM — similar ao VirtualBox, mas integrado ao libvirt. Instale com <code>apt install virt-manager -y</code>.
        </InfoBox>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => updateChecklist('lab-kvm-installed', !checklist['lab-kvm-installed'])}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['lab-kvm-installed'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
          >
            <CheckCircle size={16} />
            {checklist['lab-kvm-installed'] ? 'KVM instalado ✓' : 'KVM instalado e verificado'}
          </button>
          <button
            onClick={() => updateChecklist('lab-kvm-vm', !checklist['lab-kvm-vm'])}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all ${checklist['lab-kvm-vm'] ? 'bg-ok/10 border-ok text-ok' : 'border-border text-text-3 hover:border-accent hover:text-accent'}`}
          >
            <CheckCircle size={16} />
            {checklist['lab-kvm-vm'] ? 'Primeira VM KVM criada ✓' : 'Primeira VM KVM criada'}
          </button>
        </div>
      </section>

      {/* ── Proxmox ───────────────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Server className="text-accent" size={22} />
          </div>
          <h2 className="text-2xl font-bold">4. Proxmox VE — Laboratório de Produção</h2>
        </div>

        <p className="text-text-2 mb-4">
          Proxmox VE é a plataforma escolhida por empresas para virtualização profissional. Usa KVM por baixo, mas adiciona uma web UI poderosa, snapshots nativos, backup agendado e clustering. É o padrão de fato em data centers.
        </p>

        <div className="bg-bg-2 border border-accent/20 rounded-xl p-6 mb-6 flex items-start gap-4">
          <Zap className="text-accent flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-bold mb-1">Por que Proxmox para o laboratório de produção?</p>
            <ul className="text-text-2 text-sm space-y-1">
              <li>• Gerencia múltiplas VMs via browser (sem instalar software no cliente)</li>
              <li>• Snapshot com 1 clique — indispensável para experimentação segura</li>
              <li>• Backup agendado com <code>vzdump</code> para storage externo</li>
              <li>• Cluster de alta disponibilidade (HA) nativo — o que você encontrará em empresas</li>
              <li>• Suporte a containers LXC além de VMs KVM</li>
            </ul>
          </div>
        </div>

        <Link href="/proxmox" className="inline-flex items-center gap-2 btn-primary text-sm">
          <ArrowRight size={16} />
          Ver guia completo do Proxmox VE
        </Link>
      </section>

      {/* ── Resumo de escolha ─────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">5. Qual usar agora?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Layers className="text-blue-400" size={28} />,
              title: 'VirtualBox',
              tag: 'Iniciante',
              tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              when: 'Primeiro contato com Linux, estudo em notebook pessoal, Windows/macOS como host.',
              where: '/instalacao',
              label: 'Guia VirtualBox',
            },
            {
              icon: <Cpu className="text-purple-400" size={28} />,
              title: 'KVM / libvirt',
              tag: 'Intermediário',
              tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              when: 'Host Linux disponível, automação com scripts, pipeline CI/CD, múltiplos labs em paralelo.',
              where: '#kvm',
              label: 'Seção KVM acima',
            },
            {
              icon: <Server className="text-accent" size={28} />,
              title: 'Proxmox VE',
              tag: 'Profissional',
              tagColor: 'bg-accent/10 text-accent border-accent/20',
              when: 'Hardware dedicado disponível, laboratório permanente, ambiente corporativo, HA necessário.',
              where: '/proxmox',
              label: 'Guia Proxmox',
            },
          ].map(item => (
            <div key={item.title} className="bg-bg-2 border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="font-bold">{item.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${item.tagColor}`}>{item.tag}</span>
                </div>
              </div>
              <p className="text-xs text-text-3 flex-1">{item.when}</p>
              <Link href={item.where} className="text-xs text-accent hover:underline flex items-center gap-1 mt-auto">
                <Terminal size={12} /> {item.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pacotes por VM ────────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Referência: Pacotes por Papel de VM</h2>
        <p className="text-text-2 mb-4 text-sm">Aplica-se a qualquer plataforma. Cada VM instala apenas o necessário para sua função.</p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-3 border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-text-2">VM</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Função</th>
                <th className="text-left px-4 py-3 font-bold text-text-2">Pacotes essenciais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-bold">🔥 Firewall</td>
                <td className="px-4 py-3 text-text-2">Gateway + NAT + Proxy</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">iptables iptables-persistent squid curl tcpdump conntrack net-tools</td>
              </tr>
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-bold">📖 DNS Server</td>
                <td className="px-4 py-3 text-text-2">BIND9 autoritativo</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">bind9 bind9utils dnsutils</td>
              </tr>
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-bold">🌐 Web Server</td>
                <td className="px-4 py-3 text-text-2">Nginx + SSL</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">nginx openssl certbot python3-certbot-nginx</td>
              </tr>
              <tr className="hover:bg-bg-3 transition-colors">
                <td className="px-4 py-3 font-bold">💻 Cliente LAN</td>
                <td className="px-4 py-3 text-text-2">Testes e diagnóstico</td>
                <td className="px-4 py-3 font-mono text-xs text-text-3">curl wget telnet dnsutils netcat-openbsd</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-3 mt-3 flex items-center gap-2">
          <Package size={14} />
          Instale com <code className="font-mono bg-bg-3 px-1 rounded">apt install &lt;pacotes&gt; -y</code> em cada VM após o primeiro boot.
        </p>
      </section>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/laboratorio" />
    </div>
  );
}
