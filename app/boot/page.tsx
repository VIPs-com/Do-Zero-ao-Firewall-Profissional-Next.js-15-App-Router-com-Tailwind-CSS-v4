'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { Monitor, Cpu, HardDrive, Layers, Settings, AlertTriangle, CheckCircle, Terminal, Zap, RotateCcw } from 'lucide-react';

const CHECKLIST_ITEMS = [
  { id: 'bios-uefi-entendido',        label: 'Entendi a diferença entre BIOS e UEFI e como o GRUB é carregado' },
  { id: 'grub-configurado',           label: 'Explorei /etc/default/grub e executei update-grub com sucesso' },
  { id: 'systemd-targets-explorados', label: 'Listei os targets do systemd e usei systemd-analyze blame' },
];

export default function BootPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/boot');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-boot min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <Link href="/fundamentos" className="hover:text-accent transition-colors">Fundamentos</Link>
          <span>/</span>
          <span className="text-text-2">Processo de Boot</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo F12 · Fundamentos Linux</div>
          <h1 className="text-4xl font-bold mb-4">🖥️ Processo de Boot do Linux</h1>
          <p className="text-text-2 text-lg mb-6">
            Do botão Power até o prompt de login — entenda cada etapa do boot: BIOS/UEFI, GRUB2, kernel, initrd e systemd targets.
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do botão Power ao prompt de login"
          steps={[
            { label: 'BIOS/UEFI',    sub: 'POST — verifica hardware, encontra disco bootável',   icon: <Cpu size={14}/>,      color: 'border-warn/50' },
            { label: 'GRUB2',        sub: 'Bootloader — mostra menu, carrega kernel + initrd',    icon: <HardDrive size={14}/>, color: 'border-accent/50' },
            { label: 'Kernel Linux', sub: 'Descomprime-se, detecta hardware, monta initramfs',   icon: <Layers size={14}/>,   color: 'border-info/50' },
            { label: 'systemd',      sub: 'PID 1 — sobe serviços em paralelo por target',        icon: <Settings size={14}/>, color: 'border-layer-3/50' },
            { label: 'Login',        sub: 'getty / SSH / display manager — pronto para usar',    icon: <Terminal size={14}/>, color: 'border-ok/50' },
          ]}
        />

        {/* Comparação Windows vs Linux */}
        <div className="mt-10 mb-10">
          <WindowsComparisonBox
            windowsLabel="Windows — Boot"
            linuxLabel="Linux — Boot"
            windowsCode={"BIOS/UEFI → Windows Boot Manager\nWinload.exe carrega o kernel NT\nSMSS.exe → Winlogon → Explorer\nMSConfig → gerenciar inicialização\nTask Manager → aba Inicialização"}
            linuxCode={"BIOS/UEFI → GRUB2 → kernel + initrd\nkernel monta rootfs e inicia systemd\nsystemctl list-units --type=target\nsystemd-analyze blame       # tempo por serviço\nsystemctl disable nome      # desabilitar do boot"}
          />
        </div>

        {/* Seção 1 — BIOS/UEFI e POST */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="text-warn" size={22} />
            BIOS/UEFI e POST
          </h2>
          <p className="text-text-2 mb-4">
            Ao ligar o computador, o primeiro código a rodar é o firmware: <strong>BIOS</strong> (Basic Input/Output System) ou seu sucessor <strong>UEFI</strong> (Unified Extensible Firmware Interface).
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-bg-2 border border-border rounded-lg p-4">
              <h3 className="font-bold text-warn mb-2">BIOS (legado)</h3>
              <ul className="text-sm text-text-2 space-y-1">
                <li>• Usa tabela de partição MBR</li>
                <li>• Limite de 2 TB por disco</li>
                <li>• Interface texto básica</li>
                <li>• Inicialização mais lenta</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-border rounded-lg p-4">
              <h3 className="font-bold text-ok mb-2">UEFI (moderno)</h3>
              <ul className="text-sm text-text-2 space-y-1">
                <li>• Usa tabela de partição GPT</li>
                <li>• Suporte a discos &gt; 2 TB</li>
                <li>• Secure Boot — bloqueia código não assinado</li>
                <li>• Boot mais rápido</li>
              </ul>
            </div>
          </div>
          <p className="text-text-2 mb-4">
            O <strong>POST</strong> (Power-On Self Test) é o processo de diagnóstico: o firmware verifica CPU, RAM, placa de vídeo e dispositivos de armazenamento antes de procurar o bootloader. Em sistemas UEFI, o firmware encontra a <strong>EFI System Partition (ESP)</strong> montada em <code className="font-mono text-sm bg-bg-3 px-1 rounded">/boot/efi</code>.
          </p>
          <CodeBlock lang="bash" code={`# Ver se o sistema usa BIOS ou UEFI
[ -d /sys/firmware/efi ] && echo "UEFI" || echo "BIOS"

# Listar a partição EFI (sistemas UEFI)
ls /boot/efi/EFI/

# Ver entradas de boot UEFI
efibootmgr -v`} />
          <div className="mt-4">
            <InfoBox title="Secure Boot em servidores">
              Em servidores, UEFI com Secure Boot pode bloquear módulos de kernel não assinados. Em labs, geralmente desabilitado para facilitar a instalação.
            </InfoBox>
          </div>
        </section>

        {/* Seção 2 — GRUB2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HardDrive className="text-accent" size={22} />
            GRUB2 — O Bootloader
          </h2>
          <p className="text-text-2 mb-4">
            O <strong>GRUB2</strong> (Grand Unified Bootloader 2) é o bootloader padrão da maioria das distribuições Linux. Ele é responsável por apresentar o menu de boot, permitir escolher entre kernels e sistemas operacionais, e carregar o kernel escolhido junto com o initrd na memória RAM.
          </p>

          <HighlightBox title="Arquivos importantes do GRUB">
            <ul className="text-sm space-y-1 text-text-2">
              <li><code className="font-mono bg-bg-3 px-1 rounded">/boot/grub/grub.cfg</code> — configuração final <strong>gerada automaticamente</strong> (nunca editar)</li>
              <li><code className="font-mono bg-bg-3 px-1 rounded">/etc/default/grub</code> — configuração do usuário (editar aqui)</li>
              <li><code className="font-mono bg-bg-3 px-1 rounded">/etc/grub.d/</code> — scripts que geram o grub.cfg</li>
            </ul>
          </HighlightBox>

          <div className="mt-4">
            <CodeBlock lang="bash" code={`# Arquivo de configuração do GRUB (NUNCA editar diretamente)
cat /etc/default/grub

# Opções importantes:
# GRUB_DEFAULT=0                    # qual entrada do menu é padrão (0 = primeira)
# GRUB_TIMEOUT=5                    # segundos para mostrar o menu
# GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"  # parâmetros do kernel

# Após editar /etc/default/grub — regenerar sempre:
update-grub

# Ver kernels disponíveis
ls /boot/vmlinuz-*

# Adicionar parâmetro permanente ao kernel (ex: desabilitar IPv6)
# Em /etc/default/grub:
# GRUB_CMDLINE_LINUX_DEFAULT="quiet splash ipv6.disable=1"
update-grub`} />
          </div>
          <div className="mt-4">
            <WarnBox title="Nunca edite grub.cfg diretamente">
              NUNCA edite /boot/grub/grub.cfg diretamente — ele é gerado pelo update-grub. Suas mudanças serão sobrescritas. Sempre edite /etc/default/grub.
            </WarnBox>
          </div>
        </section>

        {/* Seção 3 — Kernel e initrd */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Layers className="text-info" size={22} />
            Kernel e initrd
          </h2>
          <p className="text-text-2 mb-4">
            O <strong>kernel Linux</strong> é armazenado comprimido como <code className="font-mono text-sm bg-bg-3 px-1 rounded">vmlinuz-x.x.x</code> em <code className="font-mono text-sm bg-bg-3 px-1 rounded">/boot/</code>. Junto com ele, o GRUB carrega o <strong>initrd</strong> (initial RAM disk) ou <strong>initramfs</strong> — um sistema de arquivos temporário em RAM que contém os drivers mínimos necessários para montar o disco real.
          </p>

          <div className="bg-bg-2 border border-border rounded-lg p-4 mb-4">
            <h3 className="font-bold text-text mb-2">Sequência detalhada:</h3>
            <ol className="text-sm text-text-2 space-y-1 list-decimal list-inside">
              <li>Kernel descomprime a si mesmo na RAM</li>
              <li>Detecta hardware (CPU, memória, dispositivos)</li>
              <li>Monta o initramfs como sistema de arquivos raiz temporário</li>
              <li>Carrega drivers necessários para acessar o disco real</li>
              <li>Monta o sistema de arquivos raiz real (rootfs)</li>
              <li>Entrega o controle ao PID 1 (systemd)</li>
            </ol>
          </div>

          <CodeBlock lang="bash" code={`# Kernel atual em execução
uname -r
uname -a   # versão completa + arquitetura

# Kernels instalados
dpkg -l linux-image-* | grep "^ii"

# Ver parâmetros passados ao kernel no boot atual
cat /proc/cmdline

# Logs do kernel no boot (dmesg)
dmesg | head -30           # início do boot
dmesg | grep -i error      # erros de hardware
dmesg | grep -i usb        # dispositivos USB detectados`} />
        </section>

        {/* Seção 4 — systemd: o PID 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Settings className="text-layer-3" size={22} />
            systemd — O PID 1
          </h2>
          <p className="text-text-2 mb-4">
            O <strong>systemd</strong> é o sistema de init moderno adotado pela maioria das distribuições Linux. Como <strong>PID 1</strong> (primeiro processo após o kernel), é responsável por inicializar todos os outros processos e serviços do sistema.
          </p>
          <p className="text-text-2 mb-4">
            Ao contrário do SysV init (que executava scripts em sequência), o systemd sobe serviços <strong>em paralelo</strong> quando possível, baseando-se em dependências declaradas — tornando o boot significativamente mais rápido.
          </p>

          <HighlightBox title="Targets do systemd (equivalente aos runlevels do SysV)">
            <ul className="text-sm space-y-1 text-text-2 font-mono">
              <li><span className="text-err">poweroff.target</span>   — desligar o sistema</li>
              <li><span className="text-warn">rescue.target</span>     — modo manutenção (root, sem rede)</li>
              <li><span className="text-ok">multi-user.target</span>  — servidor (sem GUI) ← use em servidores</li>
              <li><span className="text-info">graphical.target</span>  — desktop (com GUI)</li>
              <li><span className="text-accent">reboot.target</span>   — reiniciar</li>
            </ul>
          </HighlightBox>

          <div className="mt-4">
            <CodeBlock lang="bash" code={`# Ver target padrão
systemctl get-default

# Mudar target padrão (ex: servidor sem GUI)
systemctl set-default multi-user.target

# Analisar tempo de boot
systemd-analyze                        # tempo total
systemd-analyze blame                  # tempo por serviço (ordenado)
systemd-analyze blame | head -10       # top 10 serviços mais lentos
systemd-analyze critical-chain         # cadeia crítica do boot

# Listar units ativos
systemctl list-units --type=service --state=running

# Desabilitar serviços desnecessários (acelerar boot)
systemctl disable bluetooth
systemctl disable cups       # impressão (se não usar)`} />
          </div>
          <div className="mt-4">
            <InfoBox title="multi-user.target em servidores">
              O target <code className="font-mono">multi-user.target</code> é o padrão para servidores Linux. Não instale nem ative o <code className="font-mono">graphical.target</code> em servidores de produção — aumenta superfície de ataque e consome memória.
            </InfoBox>
          </div>
        </section>

        {/* Seção 5 — Logs de boot com journalctl */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="text-text-2" size={22} />
            Logs de Boot com journalctl
          </h2>
          <p className="text-text-2 mb-4">
            O systemd registra todos os logs do boot (e de todos os serviços) no <strong>journal</strong>, acessível via <code className="font-mono text-sm bg-bg-3 px-1 rounded">journalctl</code>. É a primeira ferramenta a usar quando algo não sobe durante o boot.
          </p>
          <CodeBlock lang="bash" code={`# Logs do boot atual
journalctl -b              # boot atual completo
journalctl -b -1           # boot anterior
journalctl -b --priority=err  # só erros do boot atual

# Boot em tempo real (acompanhar subida dos serviços)
journalctl -f              # follow mode

# Ver quanto tempo levou o boot
systemd-analyze time`} />
        </section>

        {/* Seção 6 — Modo recovery e rescue */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <RotateCcw className="text-warn" size={22} />
            Modo Recovery e Rescue
          </h2>
          <InfoBox title="Quando o servidor não sobe">
            <ol className="text-sm space-y-1 list-decimal list-inside text-text-2">
              <li>Pressione <strong>e</strong> no menu GRUB para editar a entrada de boot</li>
              <li>Encontre a linha que começa com <code className="font-mono bg-bg-3 px-1 rounded">linux</code></li>
              <li>Adicione <code className="font-mono bg-bg-3 px-1 rounded">single</code> ou <code className="font-mono bg-bg-3 px-1 rounded">init=/bin/bash</code> ao final da linha</li>
              <li>Pressione <strong>Ctrl+X</strong> para bootar com as alterações</li>
              <li>Monte root em leitura/escrita: <code className="font-mono bg-bg-3 px-1 rounded">mount -o remount,rw /</code></li>
              <li>Corrija o problema e reinicie com <code className="font-mono bg-bg-3 px-1 rounded">reboot -f</code></li>
            </ol>
          </InfoBox>
          <div className="mt-4">
            <WarnBox title="Acesso físico = root">
              Acesso físico ao servidor = root completo se o GRUB não estiver protegido por senha. Em produção, proteja o GRUB com senha e habilite Secure Boot.
            </WarnBox>
          </div>
        </section>

        {/* Exercícios Guiados */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-warn" size={22} />
            Exercícios Guiados
          </h2>

          {/* Exercício 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 1 — Diagnóstico de boot lento
            </h3>
            <CodeBlock lang="bash" code={`# Quanto tempo levou o boot?
systemd-analyze time

# Quais serviços são mais lentos?
systemd-analyze blame | head -15

# Ver a cadeia crítica (o caminho mais longo)
systemd-analyze critical-chain

# Desabilitar um serviço desnecessário (ex: avahi-daemon)
systemctl disable avahi-daemon
systemctl stop avahi-daemon`} />
          </div>

          {/* Exercício 2 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 2 — Explorar o GRUB
            </h3>
            <CodeBlock lang="bash" code={`# Ver configuração atual
cat /etc/default/grub

# Reduzir timeout para 2 segundos (ambiente de lab)
# Editar /etc/default/grub:
# GRUB_TIMEOUT=2
nano /etc/default/grub

# Regenerar
update-grub

# Verificar resultado
grep TIMEOUT /boot/grub/grub.cfg`} />
          </div>

          {/* Exercício 3 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 3 — Gerenciar targets
            </h3>
            <CodeBlock lang="bash" code={`# Qual target está ativo?
systemctl get-default
systemctl list-units --type=target

# Confirmar que é multi-user (servidor correto)
systemctl is-active multi-user.target

# Ver dependências do multi-user.target
systemctl list-dependencies multi-user.target

# Quantos serviços estão habilitados no boot?
systemctl list-unit-files --type=service | grep enabled | wc -l`} />
          </div>
        </section>

        {/* Checkpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Checkpoints do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => updateChecklist(item.id, !checklist[item.id])}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
                  checklist[item.id]
                    ? 'bg-ok/10 border-ok/40 text-ok'
                    : 'bg-bg-2 border-border hover:border-accent/40 text-text-2',
                )}
              >
                {checklist[item.id]
                  ? <CheckCircle size={18} className="mt-0.5 shrink-0 text-ok" />
                  : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-text-3" />
                }
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ModuleNav */}
        <ModuleNav currentPath="/boot" order={FUNDAMENTOS_ORDER} />

      </div>
    </main>
  );
}
