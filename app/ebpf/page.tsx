'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Cpu, Eye, Zap, Network, Shield, Activity,
  ChevronLeft, ChevronRight, Terminal, Server, Search,
} from 'lucide-react';
import Link from 'next/link';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const checklistItems = [
  {
    id: 'ebpf-instalado',
    text: 'Instalar BCC tools e bpftrace, verificar suporte do kernel',
    sub: 'apt install bpfcc-tools bpftrace linux-headers-$(uname -r) && bpftool prog list',
  },
  {
    id: 'ebpf-trace',
    text: 'Rastrear syscalls em tempo real com execsnoop e bpftrace',
    sub: 'execsnoop-bpfcc — ver todos os exec() do sistema + bpftrace -e \'tracepoint:syscalls:sys_enter_openat { printf("%s\\n", comm); }\'',
  },
  {
    id: 'ebpf-xdp',
    text: 'Carregar programa XDP para drop de pacotes em velocidade de linha',
    sub: 'xdp-loader load -m skb eth0 xdp_drop.o && xdp-loader status',
  },
];

const erros = [
  {
    title: 'Kernel sem suporte a eBPF — "operation not permitted"',
    desc: 'eBPF requer kernel >= 4.18 e CONFIG_BPF=y. Kernels Ubuntu 20.04+ têm suporte completo.',
    fix: 'uname -r                          # verificar versão\ngrep CONFIG_BPF /boot/config-$(uname -r) # deve ser =y',
  },
  {
    title: 'bpftrace falha com "No BTF found for kernel"',
    desc: 'BTF (BPF Type Format) é necessário para o bpftrace acessar estruturas do kernel. Requer linux-image-generic com padbf habilitado.',
    fix: 'ls /sys/kernel/btf/vmlinux        # deve existir\napt install linux-image-generic   # garantir kernel com BTF',
  },
  {
    title: 'XDP_DROP não funciona — interface não suporta XDP nativo',
    desc: 'XDP tem 3 modos: native (driver), generic (skb) e offloaded (NIC firmware). Drivers mais antigos só suportam o modo generic (mais lento).',
    fix: 'ip link show eth0 | grep xdp       # ver modo ativo\nxdp-loader load -m skb eth0 prog.o # forçar modo generic (SKB)',
  },
  {
    title: 'CAP_BPF negado — permissão insuficiente',
    desc: 'A maioria dos programas eBPF requer privilégio root ou a capability CAP_BPF (kernel >= 5.8).',
    fix: 'sudo execsnoop-bpfcc              # rodar com sudo\n# ou conceder capability ao binário:\nsudo setcap cap_bpf+eip /usr/bin/bpftrace',
  },
];

export default function EbpfPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/ebpf');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-ebpf min-h-screen">
      {/* Hero */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <LayerBadge layer="Kernel" />
            <span className="section-label">Kernel Linux · Observabilidade · XDP</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🔬 eBPF &amp; XDP
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            eBPF (Extended Berkeley Packet Filter) permite executar programas
            <strong className="text-text"> dentro do kernel Linux</strong> com segurança verificada
            — sem módulos, sem patches, sem reinicialização. É a tecnologia por trás de ferramentas
            como Cilium, Falco, bpftrace e toda a nova geração de observabilidade e networking.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['eBPF', 'XDP', 'bpftrace', 'BCC', 'Cilium', 'kprobe', 'tracepoint', 'XDP_DROP'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* O que é eBPF */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Cpu className="text-[var(--mod)]" size={22} />
            O que é eBPF
          </h2>
          <p className="text-text-2 mb-6">
            O BPF original (1992) era um filtro simples de pacotes para o tcpdump. O eBPF moderno
            é completamente diferente: uma máquina virtual segura dentro do kernel que executa
            programas arbitrários em hooks pré-definidos — syscalls, eventos de rede, I/O de disco,
            tracing de CPU — com performance nativa.
          </p>

          <FluxoCard
            title="Ciclo de vida de um programa eBPF"
            steps={[
              { label: 'Código eBPF', sub: 'C restrito / bpftrace', icon: <Terminal size={14} />, color: 'border-info/50' },
              { label: 'Compilar', sub: 'clang → bytecode', icon: <Cpu size={14} />, color: 'border-accent/50' },
              { label: 'Verificador', sub: 'segurança + limites', icon: <Shield size={14} />, color: 'border-ok/50' },
              { label: 'JIT Compiler', sub: 'bytecode → x86/ARM', icon: <Zap size={14} />, color: 'border-[var(--color-layer-4)]/50' },
              { label: 'Hook Kernel', sub: 'kprobe/XDP/tracepoint', icon: <Eye size={14} />, color: 'border-warn/50' },
            ]}
          />

          <InfoBox title="eBPF está para o kernel como JavaScript está para o browser">
            Assim como JS estende o browser sem modificar o Chrome/Firefox, o eBPF estende o kernel
            sem precisar de módulos (que podem travar o sistema) ou patches (que requerem compilação).
            O <strong>verificador estático</strong> garante que o programa não faz loops infinitos
            nem acessa memória inválida — segurança formal antes de executar uma única instrução.
          </InfoBox>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🔭', title: 'Observabilidade', desc: 'Rastrear syscalls, I/O, CPU, rede sem overhead de ptrace/strace' },
              { icon: '⚡', title: 'Networking/XDP', desc: 'Processar pacotes antes do stack TCP/IP — velocidade de linha' },
              { icon: '🛡️', title: 'Segurança', desc: 'Detectar comportamento suspeito no kernel (Falco, Tetragon, Cilium)' },
            ].map(c => (
              <div key={c.title} className="p-4 rounded-lg bg-bg-2 border border-border">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-semibold text-text text-sm mb-1">{c.title}</h3>
                <p className="text-xs text-text-2">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Terminal className="text-[var(--mod)]" size={22} />
            Instalação das Ferramentas
          </h2>
          <div className="space-y-6">
            <div>
              <StepItem number={1} title="Verificar suporte do kernel e instalar headers" description="eBPF requer kernel >= 4.18 e headers para compilar programas. Ubuntu 20.04+ já vem com suporte completo." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`# Verificar versão e suporte
uname -r
grep CONFIG_BPF /boot/config-\$(uname -r)   # deve ser =y

# Instalar headers e ferramentas base
sudo apt install -y linux-headers-\$(uname -r) bpfcc-tools bpftrace
sudo apt install -y linux-tools-common linux-tools-\$(uname -r)  # bpftool`} />
              </div>
            </div>
            <div>
              <StepItem number={2} title="Verificar bpftool e programas eBPF carregados" description="bpftool inspeciona programas eBPF ativos no sistema, maps e interfaces." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`# Listar programas eBPF em execução no kernel
sudo bpftool prog list

# Ver detalhes de um programa (ex: id 42)
sudo bpftool prog show id 42

# Listar maps eBPF (estruturas de dados compartilhadas)
sudo bpftool map list

# Ver feature support do kernel
sudo bpftool feature probe kernel`} />
              </div>
            </div>
            <div>
              <StepItem number={3} title="Instalar xdp-tools para experimentos XDP" description="xdp-tools fornece utilitários para carregar programas XDP em interfaces de rede." />
              <div className="mt-3">
                <CodeBlock lang="bash" code={`sudo apt install -y xdp-tools clang llvm

# Verificar instalação
xdp-loader --version
xdp-filter --version`} />
              </div>
            </div>
          </div>
        </section>

        {/* BCC Tools — Observabilidade */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Search className="text-[var(--mod)]" size={22} />
            BCC Tools — Observabilidade Sem Overhead
          </h2>
          <p className="text-text-2 mb-4">
            O pacote <code className="font-mono text-sm">bpfcc-tools</code> instala dezenas de
            ferramentas prontas baseadas em eBPF. Cada uma usa kprobes ou tracepoints para
            observar o sistema em tempo real com impacto mínimo (diferente de strace que
            usa ptrace e pode custar 2–3× em overhead).
          </p>
          <CodeBlock lang="bash" code={`# execsnoop — rastrear todos os exec() do sistema (quem executa o quê)
sudo execsnoop-bpfcc
# Saída: PCOMM  PID    PPID   RET ARGS
#        bash   12345  1234     0 /usr/bin/ls -la /tmp

# opensnoop — rastrear todos os open() (quais arquivos são acessados)
sudo opensnoop-bpfcc
# Útil para descobrir quais configs/logs uma app lê na inicialização

# tcpconnect — rastrear conexões TCP (quem conecta para onde)
sudo tcpconnect-bpfcc
# PID    COMM         IP SADDR            DADDR            DPORT
# 1234   curl         4  192.168.56.10    93.184.216.34    443

# biolatency — latência de I/O de disco (histogram em microsegundos)
sudo biolatency-bpfcc -d 10  # coletar por 10 segundos
# Mostra distribuição de latência como histograma ASCII

# profile — CPU profiler (como perf, mas via eBPF)
sudo profile-bpfcc -F 99 10  # 99 Hz, 10 segundos → flame graph data

# tcplife — rastrear duração + bytes de cada conexão TCP
sudo tcplife-bpfcc

# fileslower — arquivos acessados com latência > X ms
sudo fileslower-bpfcc 10      # leituras/escritas mais lentas que 10ms`} />
          <HighlightBox title="Diagnóstico de produção com eBPF">
            Quando uma aplicação está lenta e você não sabe por quê: <code className="font-mono text-xs">execsnoop-bpfcc</code> mostra
            se está fazendo fork excessivo, <code className="font-mono text-xs">opensnoop-bpfcc</code> mostra se está lendo arquivos
            que não deveria, <code className="font-mono text-xs">tcpconnect-bpfcc</code> mostra conexões inesperadas, e
            <code className="font-mono text-xs">biolatency-bpfcc</code> revela gargalos de disco — tudo em tempo real, sem reiniciar.
          </HighlightBox>
        </section>

        {/* bpftrace */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Eye className="text-[var(--mod)]" size={22} />
            bpftrace — Scripts eBPF de Alto Nível
          </h2>
          <p className="text-text-2 mb-4">
            O <code className="font-mono text-sm">bpftrace</code> é uma linguagem de scripting de
            alto nível para eBPF — sintaxe inspirada em awk/DTrace. Ideal para queries ad-hoc
            sem precisar escrever programas C completos.
          </p>
          <CodeBlock lang="bash" code={`# Sintaxe: probe /filtro/ { ação }

# Rastrear todos os arquivos abertos por processo
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_openat {
  printf("%s abre: %s\\n", comm, str(args->filename));
}'

# Detectar execve de comandos específicos (ex: sudo, su)
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_execve /
  str(args->filename) == "/usr/bin/sudo" / {
  printf("ALERTA: sudo por PID %d (%s)\\n", pid, comm);
}'

# Medir latência de chamadas read() por processo (histograma)
sudo bpftrace -e '
tracepoint:syscalls:sys_enter_read { @start[tid] = nsecs; }
tracepoint:syscalls:sys_exit_read  /@start[tid]/ {
  @latencia_us[comm] = hist((nsecs - @start[tid]) / 1000);
  delete(@start[tid]);
}' -c 10

# Top processos por syscall count (30 segundos)
sudo bpftrace -e 'tracepoint:raw_syscalls:sys_enter {
  @[comm] = count();
}' -c 30

# Ver todos os programas eBPF carregados (one-liner de diagnóstico)
sudo bpftrace -l | head -20   # listar todos os tracepoints disponíveis`} />
          <InfoBox title="bpftrace vs BCC tools">
            <strong>BCC tools:</strong> ferramentas prontas para uso imediato — melhor para diagnósticos rápidos.<br />
            <strong>bpftrace:</strong> linguagem para queries customizadas — melhor quando você precisa de algo específico.<br />
            <strong>Programas C+libbpf:</strong> para produção, Cilium, Falco etc. — máxima performance e controle.
          </InfoBox>
        </section>

        {/* XDP */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Zap className="text-[var(--mod)]" size={22} />
            XDP — eXpress Data Path
          </h2>
          <p className="text-text-2 mb-4">
            XDP é o ponto de hook eBPF mais próximo da NIC — o pacote é processado
            <strong className="text-text"> antes de ser alocado no sk_buff</strong> do kernel.
            Resultado: throughput de dezenas de Mpps (milhões de pacotes por segundo) para
            firewall, DDoS mitigation e load balancing.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-2 border-b border-border">
                  <th className="text-left p-3 text-text-2 font-mono">Modo XDP</th>
                  <th className="text-left p-3 text-text-2 font-mono">Onde Executa</th>
                  <th className="text-left p-3 text-text-2 font-mono">Performance</th>
                  <th className="text-left p-3 text-text-2 font-mono">Requisito</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-mono text-[var(--mod)] font-bold">Native</td>
                  <td className="p-3 text-text-2">Driver da NIC (pré-sk_buff)</td>
                  <td className="p-3 text-ok">🚀 Máxima (~25 Mpps)</td>
                  <td className="p-3 text-text-2 text-xs">Driver com suporte XDP</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-mono text-warn font-bold">Generic (SKB)</td>
                  <td className="p-3 text-text-2">Após alocação sk_buff</td>
                  <td className="p-3 text-warn">⚡ Moderada (~1 Mpps)</td>
                  <td className="p-3 text-text-2 text-xs">Qualquer interface</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-info font-bold">Offloaded</td>
                  <td className="p-3 text-text-2">Firmware da NIC</td>
                  <td className="p-3 text-ok">🚀🚀 Ultra (~100 Mpps)</td>
                  <td className="p-3 text-text-2 text-xs">NICs Netronome/etc.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-text mb-3">Ações XDP (return codes)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              ['XDP_PASS',     'Entregar ao stack normal', 'text-ok'],
              ['XDP_DROP',     'Descartar (silencioso)', 'text-err'],
              ['XDP_TX',       'Reenviar pela mesma NIC', 'text-info'],
              ['XDP_REDIRECT', 'Redirecionar para outra NIC/CPU', 'text-warn'],
            ].map(([action, desc, color]) => (
              <div key={action} className="p-3 rounded-lg bg-bg-2 border border-border text-center">
                <code className={`font-mono text-xs font-bold ${color} block mb-1`}>{action}</code>
                <span className="text-xs text-text-2">{desc}</span>
              </div>
            ))}
          </div>

          <CodeBlock lang="c" code={`/* xdp_drop_icmp.c — Bloquear todo ICMP (ping) com XDP */
#include <linux/bpf.h>
#include <linux/if_ether.h>
#include <linux/ip.h>
#include <bpf/bpf_helpers.h>

SEC("xdp")
int xdp_drop_icmp(struct xdp_md *ctx) {
    void *data_end = (void *)(long)ctx->data_end;
    void *data     = (void *)(long)ctx->data;

    struct ethhdr *eth = data;
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;

    if (eth->h_proto != __constant_htons(ETH_P_IP))
        return XDP_PASS;          // não é IPv4 → deixa passar

    struct iphdr *ip = (void *)(eth + 1);
    if ((void *)(ip + 1) > data_end)
        return XDP_PASS;

    if (ip->protocol == IPPROTO_ICMP)
        return XDP_DROP;          // é ICMP → descarta

    return XDP_PASS;
}

char LICENSE[] SEC("license") = "GPL";`} />

          <CodeBlock lang="bash" code={`# Compilar o programa XDP
clang -O2 -g -target bpf -c xdp_drop_icmp.c -o xdp_drop_icmp.o

# Carregar na interface (modo generic para VMs)
sudo xdp-loader load -m skb eth0 xdp_drop_icmp.o

# Verificar que está ativo
xdp-loader status

# Testar: ping deve ser bloqueado agora
ping -c3 192.168.56.10    # deve retornar timeout

# Remover o programa XDP
sudo xdp-loader unload eth0 --all

# Alternativa rápida com xdp-filter (sem escrever C):
sudo xdp-filter load --mode skb eth0
sudo xdp-filter icmp --action deny          # bloquear ICMP
sudo xdp-filter status`} />
          <WarnBox title="XDP em VMs tem limitações">
            Drivers de NIC virtual (virtio, vmxnet3, e1000) geralmente só suportam o modo
            <code className="font-mono text-xs"> generic (SKB)</code>. Para testar XDP nativo,
            use hardware real ou drivers com suporte: <code className="font-mono text-xs">mlx5</code>,
            <code className="font-mono text-xs">i40e</code>, <code className="font-mono text-xs">bnxt</code>.
          </WarnBox>
        </section>

        {/* Cilium + Kubernetes */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Network className="text-[var(--mod)]" size={22} />
            Cilium — eBPF Nativo para Kubernetes
          </h2>
          <p className="text-text-2 mb-4">
            Cilium é o CNI (Container Network Interface) mais avançado para Kubernetes,
            construído inteiramente sobre eBPF. Substitui <code className="font-mono text-sm">kube-proxy</code> e
            iptables por programas XDP/TC, resultando em menor latência e maior throughput.
          </p>
          <CodeBlock lang="bash" code={`# Instalar Cilium no K3s (Sprint I.16 — substituir CNI padrão)
# 1. Desabilitar flannel/kube-proxy no K3s:
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--flannel-backend=none \\
  --disable-kube-proxy --disable-network-policy" sh -

# 2. Instalar Cilium via Helm
helm repo add cilium https://helm.cilium.io/
helm install cilium cilium/cilium --version 1.15.0 \\
  --namespace kube-system \\
  --set kubeProxyReplacement=true \\
  --set k8sServiceHost=127.0.0.1 \\
  --set k8sServicePort=6443

# 3. Verificar instalação
cilium status
cilium connectivity test   # testa conectividade end-to-end

# 4. Hubble — observabilidade L7 do tráfego entre pods
cilium hubble enable
hubble observe --follow    # ver fluxo de tráfego em tempo real
hubble observe --type drop # ver apenas pacotes dropados

# CiliumNetworkPolicy — mais expressiva que NetworkPolicy padrão K8s
kubectl apply -f - <<'EOF'
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  endpointSelector:
    matchLabels:
      app: backend
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: frontend
    toPorts:
    - ports:
      - port: "8080"
        protocol: TCP
EOF`} />
          <InfoBox title="Vantagens do Cilium vs iptables">
            <ul className="text-sm space-y-1 mt-1">
              <li>🚀 <strong>Performance:</strong> XDP/TC eBPF em vez de iptables (menos overhead por pacote)</li>
              <li>🔭 <strong>Observabilidade:</strong> Hubble vê fluxos L3/L4/L7 entre pods em tempo real</li>
              <li>🛡️ <strong>Políticas L7:</strong> bloquear por método HTTP, path, headers — não só IP/porta</li>
              <li>⚡ <strong>Escalabilidade:</strong> iptables tem O(n) para n regras; eBPF usa hash maps O(1)</li>
            </ul>
          </InfoBox>
        </section>

        {/* Segurança com eBPF */}
        <section>
          <h2 className="section-title text-2xl mb-6 flex items-center gap-2">
            <Shield className="text-[var(--mod)]" size={22} />
            Segurança em Runtime — Falco &amp; Tetragon
          </h2>
          <p className="text-text-2 mb-4">
            Enquanto o Suricata (Sprint I.18) inspeciona tráfego de rede, ferramentas eBPF de
            segurança monitoram o <strong className="text-text">comportamento no kernel</strong> —
            quais syscalls um processo faz, quais arquivos acessa, quais conexões abre.
          </p>
          <CodeBlock lang="bash" code={`# Falco — detecção de comportamento anômalo via eBPF
curl -fsSL https://falco.org/repo/falcosecurity-packages.asc \\
  | sudo gpg --dearmor -o /usr/share/keyrings/falco.gpg
echo "deb [signed-by=/usr/share/keyrings/falco.gpg] \\
  https://download.falco.org/packages/deb stable main" \\
  | sudo tee /etc/apt/sources.list.d/falcosecurity.list
sudo apt update && sudo apt install -y falco

# Iniciar Falco em modo eBPF (driver moderno, sem módulo de kernel)
sudo falco --modern-bpf

# Exemplo de alerta Falco (regra padrão):
# 18:30:05.123 Warning Sensitive file opened for reading
#   (user=www-data file=/etc/shadow container=nginx)
# → Um processo web abrindo /etc/shadow é altamente suspeito!

# Regras Falco customizadas (/etc/falco/falco_rules.local.yaml)
cat << 'EOF' | sudo tee /etc/falco/falco_rules.local.yaml
- rule: Execução inesperada em /tmp
  desc: Processo executado a partir de /tmp (possível malware)
  condition: >
    spawned_process and proc.exepath startswith "/tmp"
  output: >
    Processo suspeito em /tmp (cmd=%proc.cmdline user=%user.name)
  priority: WARNING
EOF

sudo systemctl restart falco`} />
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsLabel="Windows — ETW / WFP"
          linuxLabel="Linux — eBPF / XDP"
          windowsCode={`# Windows ETW (Event Tracing for Windows)
# Similar ao tracing eBPF, mas fechado e menos flexível

# Rastrear processos com ETW:
logman start MyTrace -p Microsoft-Windows-Kernel-Process
logman stop MyTrace
# Analisar com: wpr, wpa, perfview

# Windows Filtering Platform (WFP) = firewall kernel
# Equivalente mais próximo do XDP nativo
netsh wfp show filters

# Sysmon (sysinternals) = mais próximo de Falco/bpftrace
sysmon -i sysmon_config.xml
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational"

# Limitações vs eBPF:
# - ETW não é programável (só coleta eventos fixos)
# - WFP não tem velocidade XDP nativa
# - Sysmon requer instalação separada`}
          linuxCode={`# Linux eBPF — programável, nativo, zero overhead

# Rastrear qualquer syscall em tempo real:
sudo bpftrace -e 'tracepoint:syscalls:sys_enter_execve {
  printf("%s → %s\\n", comm, str(args->filename));
}'

# XDP firewall (drop na NIC, antes do stack):
sudo xdp-filter load --mode skb eth0
sudo xdp-filter ip --action deny 203.0.113.42

# Falco — detectar comportamento malicioso:
sudo falco --modern-bpf
# Alerta automático: shell em container,
# acesso a /etc/shadow, /proc/*/mem, etc.

# Cilium — políticas L7 em Kubernetes:
hubble observe --type drop --follow
# Ver todos os pacotes bloqueados por política`}
        />

        {/* Exercícios */}
        <section>
          <h2 className="section-title text-2xl mb-4 flex items-center gap-2">
            <Activity className="text-[var(--mod)]" size={22} />
            Exercícios Guiados
          </h2>
          <div className="space-y-3">
            {checklistItems.map(item => (
              <ChecklistItem
                key={item.id}
                text={item.text}
                sub={item.sub}
                checked={!!checklist[item.id]}
                onToggle={() => updateChecklist(item.id, !checklist[item.id])}
              />
            ))}
          </div>
        </section>

        {/* Erros Comuns */}
        <section>
          <h2 className="section-title text-2xl mb-4">⚠️ Erros Comuns</h2>
          <div className="space-y-3">
            {erros.map((e, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <button
                  className="w-full text-left px-4 py-3 flex justify-between items-center bg-bg-2 hover:bg-bg-3 transition-colors"
                  onClick={() => setOpenError(openError === i ? null : i)}
                  aria-expanded={openError === i}
                  aria-controls={`error-${i}`}
                >
                  <span className="font-medium text-text text-sm">{e.title}</span>
                  <span className="text-text-2 text-xs">{openError === i ? '▲' : '▼'}</span>
                </button>
                {openError === i && (
                  <div id={`error-${i}`} className="px-4 py-3 bg-bg space-y-2">
                    <p className="text-text-2 text-sm">{e.desc}</p>
                    <CodeBlock lang="bash" code={e.fix} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <ModuleNav currentPath="/ebpf" order={ADVANCED_ORDER} />
      </div>
    </div>
  );
}
