'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { HardDrive, Server, Shield, Network, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

type NfsTab = 'servidor' | 'cliente' | 'diagnostico';

const CHECKLIST_ITEMS = [
  { id: 'nfs-instalado', label: 'Instalei nfs-kernel-server, criei os diretórios e verifiquei com exportfs -v' },
  { id: 'nfs-share',     label: 'Configurei /etc/exports com opções seguras e executei exportfs -ra + showmount -e' },
  { id: 'nfs-cliente',   label: 'Montei o compartilhamento NFS com mount -t nfs4 e adicionei ao /etc/fstab com _netdev' },
];

export default function NfsPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { activeTab, setActiveTab, isActive, tabButtonProps } = useTabFilter<NfsTab>('servidor');

  useEffect(() => {
    trackPageVisit('/nfs');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-nfs min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Servidores</span>
          <span>/</span>
          <span className="text-text-2">NFS</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo S09 · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">🗂️ NFS — Network File System</h1>
          <p className="text-text-2 text-lg mb-6">
            /etc/exports · NFSv4 · mount persistente · iptables — compartilhamento de arquivos Linux nativo de alta performance
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo de Acesso NFS: do /etc/exports à montagem no cliente"
          steps={[
            { label: '/etc/exports',   sub: 'define quais diretórios e hosts podem montar',        icon: <HardDrive size={14}/>, color: 'border-accent/50' },
            { label: 'exportfs -ra',   sub: 'recarrega exports e notifica o nfsd',                 icon: <Server size={14}/>,   color: 'border-info/50' },
            { label: 'RPC / port 111', sub: 'rpcbind mapeia serviços (NFSv3); NFSv4 dispensa',     icon: <Network size={14}/>,  color: 'border-warn/50' },
            { label: 'nfsd (2049)',    sub: 'daemon NFS processa requisições do cliente via TCP',   icon: <Server size={14}/>,   color: 'border-ok/50' },
            { label: 'VFS / kernel',   sub: 'cliente vê o diretório remoto como filesystem local', icon: <CheckCircle size={14}/>, color: 'border-layer-3/50' },
          ]}
        />

        {/* Tabs de navegação */}
        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2">
            {[
              { id: 'servidor',    label: '🗂️ Conceito & Servidor' },
              { id: 'cliente',     label: '🔗 Cliente & Segurança' },
              { id: 'diagnostico', label: '🔬 Diagnóstico & Exercícios' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NfsTab)}
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

        {/* ── TAB 1: Conceito & Servidor ─────────────────────────────────────── */}
        {isActive('servidor') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. NFS vs Samba — quando usar cada um</h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-text-2">Critério</th>
                  <th className="text-left py-2 pr-4 text-ok">NFS</th>
                  <th className="text-left py-2 text-info">Samba (SMB)</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Protocolo</td>
                  <td className="py-2 pr-4">NFS v3/v4 — nativo Linux/UNIX</td>
                  <td className="py-2">SMB/CIFS — protocolo Microsoft</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Performance</td>
                  <td className="py-2 pr-4 text-ok">Até 30% mais rápido Linux↔Linux</td>
                  <td className="py-2">Melhor para ambientes mistos</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Integração Windows</td>
                  <td className="py-2 pr-4">Requer &quot;Client for NFS&quot; no Windows</td>
                  <td className="py-2 text-info">Nativa — Explorer/drive mapeado</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">NFSv4 vs SMB3</td>
                  <td className="py-2 pr-4">TCP único, firewall-friendly (2049)</td>
                  <td className="py-2">SMB3 com signing e criptografia AES</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-text">Autenticação</td>
                  <td className="py-2 pr-4">UID/GID do kernel; Kerberos opcional</td>
                  <td className="py-2">smbpasswd ou AD/LDAP</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-text">Caso de uso ideal</td>
                  <td className="py-2 pr-4">Storage Linux, home dirs, VMs/K8s PVC</td>
                  <td className="py-2">Ambiente misto Windows/Linux</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Versões do NFS</h2>

          <InfoBox title="Use sempre NFSv4">
            NFSv4 usa apenas a porta 2049/TCP, facilitando regras de firewall. NFSv3 usa rpcbind (porta 111) + portas dinâmicas do <code>mountd</code>, o que complica o iptables. NFSv4.1 adiciona pNFS (acesso paralelo); NFSv4.2 adiciona server-side copy.
          </InfoBox>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              { ver: 'NFSv3', desc: 'Stateless, suporta UDP e TCP. Requer rpcbind (porta 111) + mountd com porta dinâmica. Ainda funciona, mas dificulta firewall.', status: 'Legado' },
              { ver: 'NFSv4', desc: 'Stateful, TCP only, single port 2049. Sem rpcbind externo. ID mapping via /etc/idmapd.conf. Recomendado para novos deploys.', status: 'Recomendado' },
              { ver: 'NFSv4.1', desc: 'Adiciona pNFS (parallel NFS) — clientes lêem dados de múltiplos servidores simultaneamente. Usado em storage de alto desempenho.', status: 'Avançado' },
              { ver: 'NFSv4.2', desc: 'Server-side copy (sem transferência pelo cliente), hole punching em arquivos esparsos e modo de acesso MAC (SELinux labels).', status: 'Moderno' },
            ].map(item => (
              <div key={item.ver} className="border border-border rounded-lg p-4 bg-bg-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text">{item.ver}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'Recomendado' ? 'bg-ok/20 text-ok' : item.status === 'Legado' ? 'bg-warn/20 text-warn' : 'bg-info/20 text-info'}`}>{item.status}</span>
                </div>
                <p className="text-sm text-text-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Instalação do servidor</h2>

          <CodeBlock lang="bash" code={`sudo apt update
sudo apt install nfs-kernel-server

# Habilitar e iniciar o serviço:
sudo systemctl enable --now nfs-server

# Verificar status:
sudo systemctl status nfs-server

# Verificar versões NFS suportadas pelo kernel:
cat /proc/fs/nfsd/versions`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['nfs-instalado']} onChange={e => updateChecklist('nfs-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['nfs-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Configurando /etc/exports</h2>

          <p className="text-text-2 mb-4">
            O arquivo <code>/etc/exports</code> define quais diretórios são compartilhados e para quais hosts, com quais opções.
          </p>

          <CodeBlock lang="bash" code={`# Criar os diretórios de export:
sudo mkdir -p /srv/nfs/dados /srv/nfs/publico

# Editar /etc/exports:
sudo nano /etc/exports`} />

          <CodeBlock lang="text" code={`# /etc/exports — sintaxe: <caminho> <host>(<opções>)

# Dados RW para sub-rede LAN — root do cliente NÃO tem privilégio root no servidor
/srv/nfs/dados    192.168.1.0/24(rw,sync,no_subtree_check,root_squash)

# Diretório público somente leitura para qualquer host
/srv/nfs/publico  *(ro,sync,no_subtree_check)

# Home de usuário específico — mapeia root para UID/GID 1000
/home/usuario     192.168.1.100(rw,sync,no_subtree_check,all_squash,anonuid=1000,anongid=1000)`} />

          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Opções explicadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { opt: 'rw / ro', desc: 'Leitura+escrita ou somente leitura.' },
                { opt: 'sync', desc: 'Confirma escrita em disco antes de responder ao cliente. Mais seguro que async.' },
                { opt: 'no_subtree_check', desc: 'Desativa verificação de subárvore — melhora performance e evita bugs com arquivos renomeados.' },
                { opt: 'root_squash', desc: 'UID 0 do cliente é mapeado para usuário anônimo. Padrão e recomendado.' },
                { opt: 'no_root_squash', desc: 'Root do cliente tem root no servidor. PERIGOSO — evite em produção.' },
                { opt: 'all_squash', desc: 'Todos os usuários são mapeados para o usuário anônimo (anonuid/anongid).' },
                { opt: 'anonuid/anongid', desc: 'Define o UID/GID do usuário anônimo quando all_squash está ativo.' },
                { opt: 'async', desc: 'Responde antes de confirmar escrita. Mais rápido mas pode corromper dados em crash.' },
              ].map(item => (
                <div key={item.opt} className="flex gap-2 text-sm">
                  <code className="text-accent shrink-0">{item.opt}</code>
                  <span className="text-text-2">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Aplicar as mudanças no /etc/exports:
sudo exportfs -ra        # recarrega sem reiniciar o daemon

# Verificar exports ativos:
sudo exportfs -v

# Listar exports do servidor local:
showmount -e localhost`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['nfs-share']} onChange={e => updateChecklist('nfs-share', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['nfs-share'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2: Cliente & Segurança ─────────────────────────────────────── */}
        {isActive('cliente') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Instalação do cliente NFS</h2>

          <CodeBlock lang="bash" code={`sudo apt install nfs-common

# Verificar se o pacote inclui os utilitários necessários:
which mount.nfs4   # deve retornar /sbin/mount.nfs4
which showmount`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Mount manual NFSv4</h2>

          <CodeBlock lang="bash" code={`# Criar ponto de montagem:
sudo mkdir -p /mnt/nfs-dados

# Montar com NFSv4 (TCP, apenas porta 2049):
sudo mount -t nfs4 192.168.1.1:/srv/nfs/dados /mnt/nfs-dados

# Verificar montagem:
mount | grep nfs

# Verificar espaço disponível:
df -h /mnt/nfs-dados

# Testar leitura/escrita:
ls /mnt/nfs-dados
touch /mnt/nfs-dados/teste.txt`} />

          <InfoBox title="NFSv4 vs montagem genérica">
            Use sempre <code>-t nfs4</code> para forçar NFSv4 e garantir que apenas a porta 2049/TCP seja usada. A montagem genérica <code>-t nfs</code> pode negociar NFSv3 dependendo da configuração do servidor.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Montagem persistente com /etc/fstab</h2>

          <CodeBlock lang="text" code={`# /etc/fstab — linha para montagem NFS persistente:
# <servidor>:<export>  <ponto-de-montagem>  <tipo>  <opções>  <dump>  <pass>

192.168.1.1:/srv/nfs/dados  /mnt/nfs-dados  nfs4  defaults,_netdev,nofail,soft,timeo=60  0  0`} />

          <div className="mt-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Opções do fstab explicadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { opt: '_netdev', desc: 'Aguarda a rede estar ativa antes de montar — essencial para NFS no boot.' },
                { opt: 'nofail', desc: 'Boot continua mesmo se a montagem falhar — evita sistema travado.' },
                { opt: 'soft', desc: 'Retorna erro ao cliente se o servidor não responder após timeo — evita travamento de processos.' },
                { opt: 'timeo=60', desc: 'Timeout em décimos de segundo (60 = 6s) antes de tentar novamente.' },
                { opt: 'defaults', desc: 'Inclui: rw, suid, dev, exec, auto, nouser, async.' },
                { opt: 'hard', desc: 'Alternativa ao soft: fica tentando indefinidamente. Bom para dados críticos.' },
              ].map(item => (
                <div key={item.opt} className="flex gap-2 text-sm">
                  <code className="text-accent shrink-0">{item.opt}</code>
                  <span className="text-text-2">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Testar o fstab sem reiniciar (monta tudo que está no fstab e não montado):
sudo mount -a

# Verificar se montou corretamente:
mount | grep nfs
df -h | grep nfs`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-4">
            <input type="checkbox" checked={!!checklist['nfs-cliente']} onChange={e => updateChecklist('nfs-cliente', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['nfs-cliente'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. iptables para NFSv4</h2>

          <InfoBox title="NFSv4: apenas porta 2049/TCP">
            Uma das grandes vantagens do NFSv4 é precisar de apenas uma porta no firewall. NFSv3 exige rpcbind (111) + portas dinâmicas do mountd, tornando o iptables muito mais complexo.
          </InfoBox>

          <CodeBlock lang="bash" code={`# NFSv4: apenas porta 2049/TCP da sub-rede LAN:
sudo iptables -A INPUT -p tcp --dport 2049 -s 192.168.1.0/24 -j ACCEPT

# Rejeitar NFS de fora da LAN:
sudo iptables -A INPUT -p tcp --dport 2049 ! -s 192.168.1.0/24 -j DROP

# --- NFSv3 legado (somente se necessário) ---
# rpcbind:
# sudo iptables -A INPUT -p tcp --dport 111 -s 192.168.1.0/24 -j ACCEPT
# sudo iptables -A INPUT -p udp --dport 111 -s 192.168.1.0/24 -j ACCEPT
# mountd (fixar a porta em /etc/nfs.conf):
# sudo iptables -A INPUT -p tcp --dport 20048 -s 192.168.1.0/24 -j ACCEPT`} />

          <WarnBox title="Nunca exponha NFS para a WAN">
            NFS foi projetado para redes internas de confiança. Expor a porta 2049 para a internet permite que qualquer host monte seus diretórios (dependendo das regras de export). Use sempre VPN ou iptables restritivo à sub-rede da LAN.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. ID Mapping NFSv4</h2>

          <p className="text-text-2 mb-4">
            NFSv4 usa nomes <code>usuario@domínio</code> para mapear UIDs/GIDs. O domínio deve ser idêntico em servidor e cliente em <code>/etc/idmapd.conf</code>.
          </p>

          <CodeBlock lang="text" code={`# /etc/idmapd.conf (servidor E cliente devem ter o mesmo Domain):
[General]
Verbosity = 0
Pipefs-Directory = /run/rpc_pipefs
Domain = workshop.local   # <-- deve ser igual em TODOS os nós

[Mapping]
Nobody-User = nobody
Nobody-Group = nogroup`} />

          <CodeBlock lang="bash" code={`# Após editar idmapd.conf, reiniciar o serviço:
sudo systemctl restart nfs-idmapd

# No cliente, também reiniciar:
sudo systemctl restart nfs-idmapd`} />
        </section>

        <WindowsComparisonBox
          windowsLabel="Windows (DFS / CIFS)"
          linuxLabel="Linux (NFS)"
          windowsCode={`# Compartilhamento via CIFS/SMB3 (nativo no Windows)
# GUI: Server Manager → File and Storage Services
# → New Share → SMB Share Quick

# Acesso via Explorer:
# \\\\servidor\\pasta
# Mapear unidade: net use Z: \\\\srv\\pasta

# Feature opcional para montar NFS:
# Instalar em: Painel de Controle
# → Programas → Ativar/Desativar recursos do Windows
# → Serviços para NFS → Cliente NFS

# Montar NFS no Windows (após instalar Cliente NFS):
# mount \\\\192.168.1.1\\srv\\nfs\\dados Z:

# Firewall Windows libera 445 automaticamente para SMB`}
          linuxCode={`# Compartilhamento via NFS — protocolo nativo Linux/UNIX

# Configurar /etc/exports no servidor:
# /srv/nfs/dados 192.168.1.0/24(rw,sync,no_subtree_check,root_squash)

# Recarregar exports:
sudo exportfs -ra
showmount -e localhost

# Montar no cliente NFSv4 (única porta 2049/TCP):
sudo mount -t nfs4 192.168.1.1:/srv/nfs/dados /mnt/nfs-dados

# /etc/fstab para persistência no boot:
# 192.168.1.1:/srv/nfs/dados /mnt/nfs-dados nfs4 defaults,_netdev,nofail,soft,timeo=60 0 0

# NFS é ~30% mais rápido que SMB3 para workloads Linux↔Linux`}
        />

        </>)}

        {/* ── TAB 3: Diagnóstico & Exercícios ───────────────────────────────── */}
        {isActive('diagnostico') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns e Soluções</h2>

          <div className="space-y-3">
            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">mount.nfs: access denied by server while mounting</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> O IP do cliente não está autorizado em /etc/exports, ou o export não foi recarregado.</p>
                <CodeBlock lang="bash" code={`# 1. Verificar se o IP do cliente está no /etc/exports:
cat /etc/exports

# 2. Recarregar exports:
sudo exportfs -ra

# 3. Confirmar que o export está ativo:
sudo exportfs -v

# 4. Verificar iptables no servidor:
sudo iptables -L INPUT -n | grep 2049`} />
                <p>Verifique também que a sub-rede do cliente bate com a regra (ex: 192.168.1.100 deve estar em 192.168.1.0/24).</p>
              </div>
            </details>

            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">Permission denied ao criar arquivos após montar</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> Mismatch de UID/GID entre servidor e cliente — o usuário local tem UID 1000 mas o diretório no servidor pertence ao UID 1001.</p>
                <CodeBlock lang="bash" code={`# Verificar UID do usuário local no cliente:
id

# Verificar dono do diretório no servidor:
ls -la /srv/nfs/dados

# Solução 1: sincronizar UIDs (criar usuário com mesmo UID):
sudo useradd -u 1000 nfsuser  # no servidor

# Solução 2: usar all_squash + anonuid no /etc/exports:
# /srv/nfs/dados 192.168.1.0/24(rw,sync,no_subtree_check,all_squash,anonuid=1000,anongid=1000)
sudo exportfs -ra`} />
              </div>
            </details>

            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">rpc.statd: unable to register (NFSv3)</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> Problema no rpcbind — serviço NFS não consegue registrar o statd no portmapper. Específico do NFSv3.</p>
                <CodeBlock lang="bash" code={`# Reiniciar o rpcbind:
sudo systemctl restart rpcbind
sudo systemctl restart nfs-server

# Verificar registro dos serviços RPC:
rpcinfo -p localhost

# Solução definitiva: migrar para NFSv4
# No /etc/exports, os clientes NFSv4 usarão apenas porta 2049
# e este problema não ocorre.`} />
              </div>
            </details>

            <details className="border border-border rounded-lg overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-bg-2 hover:bg-bg-3 transition-colors">
                <AlertTriangle size={16} className="text-warn shrink-0" />
                <span className="font-medium">Stale NFS file handle — arquivos inacessíveis</span>
              </summary>
              <div className="px-4 py-3 bg-bg border-t border-border text-sm text-text-2 space-y-2">
                <p><strong className="text-text">Causa:</strong> O servidor NFS reiniciou ou o export foi alterado sem recarregar — os file handles que o cliente tinha em cache ficaram inválidos.</p>
                <CodeBlock lang="bash" code={`# No cliente — desmontar (lazy se processos estão usando):
sudo umount -l /mnt/nfs-dados

# Remontar:
sudo mount -t nfs4 192.168.1.1:/srv/nfs/dados /mnt/nfs-dados

# No servidor — sempre executar após reiniciar:
sudo exportfs -ra

# Prevenir: nunca reiniciar nfs-server sem avisar os clientes.
# Shutdown ordenado: exportfs -ua (unexport tudo) → parar clientes → reiniciar.`} />
              </div>
            </details>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>

          <div className="space-y-8">
            {/* Lab 1 */}
            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-ok" />
                <h3 className="font-bold text-lg">Lab 1: Servidor NFS básico</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Instale e configure um servidor NFS na VM do laboratório, exportando um diretório para a sub-rede LAN.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Instalar o servidor NFS</p>
                    <CodeBlock lang="bash" code={`sudo apt install nfs-kernel-server
sudo systemctl enable --now nfs-server
sudo systemctl status nfs-server`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Criar o diretório de export com permissões corretas</p>
                    <CodeBlock lang="bash" code={`sudo mkdir -p /srv/nfs/dados
sudo chown nobody:nogroup /srv/nfs/dados
sudo chmod 755 /srv/nfs/dados`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Configurar /etc/exports e exportar</p>
                    <CodeBlock lang="bash" code={`echo "/srv/nfs/dados 192.168.1.0/24(rw,sync,no_subtree_check,root_squash)" | sudo tee -a /etc/exports
sudo exportfs -ra
sudo exportfs -v`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">4.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Verificar com showmount</p>
                    <CodeBlock lang="bash" code={`showmount -e localhost
# Saída esperada:
# Export list for localhost:
# /srv/nfs/dados 192.168.1.0/24`} />
                  </div>
                </li>
              </ol>
            </div>

            {/* Lab 2 */}
            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Network size={18} className="text-info" />
                <h3 className="font-bold text-lg">Lab 2: Cliente NFS persistente</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Configure o cliente para montar o compartilhamento NFS manualmente e persistir no /etc/fstab com opções seguras para boot.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Instalar e montar manualmente</p>
                    <CodeBlock lang="bash" code={`sudo apt install nfs-common
sudo mkdir -p /mnt/nfs-dados
sudo mount -t nfs4 192.168.1.1:/srv/nfs/dados /mnt/nfs-dados
mount | grep nfs`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Adicionar ao /etc/fstab</p>
                    <CodeBlock lang="bash" code={`echo "192.168.1.1:/srv/nfs/dados /mnt/nfs-dados nfs4 defaults,_netdev,nofail,soft,timeo=60 0 0" | sudo tee -a /etc/fstab`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Testar mount -a (simula o boot)</p>
                    <CodeBlock lang="bash" code={`# Desmontar primeiro:
sudo umount /mnt/nfs-dados
# Remontar via fstab:
sudo mount -a
df -h | grep nfs`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">4.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Validar leitura e escrita</p>
                    <CodeBlock lang="bash" code={`echo "teste NFS" > /mnt/nfs-dados/validacao.txt
cat /mnt/nfs-dados/validacao.txt`} />
                  </div>
                </li>
              </ol>
            </div>

            {/* Lab 3 */}
            <div className="border border-border rounded-lg p-6 bg-bg-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-warn" />
                <h3 className="font-bold text-lg">Lab 3: NFSv4 + iptables</h3>
              </div>
              <p className="text-text-2 text-sm mb-4">
                Configure regras iptables para permitir NFS apenas da LAN e valide a versão NFS negociada entre servidor e cliente.
              </p>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">1.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Adicionar regra iptables no servidor</p>
                    <CodeBlock lang="bash" code={`sudo iptables -A INPUT -p tcp --dport 2049 -s 192.168.1.0/24 -j ACCEPT
sudo iptables -L INPUT -n -v | grep 2049`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">2.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Verificar versão NFS suportada e negociada</p>
                    <CodeBlock lang="bash" code={`# No servidor:
cat /proc/fs/nfsd/versions
# Saída esperada: -2 -3 +4 +4.1 +4.2

# No cliente (após montar):
nfsstat -m | grep vers`} />
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">3.</span>
                  <div>
                    <p className="text-text font-medium mb-1">Confirmar que apenas a porta 2049 é usada</p>
                    <CodeBlock lang="bash" code={`# No servidor, verificar conexões NFS ativas:
ss -tnp | grep :2049

# Confirmar que rpcbind NÃO é necessário para NFSv4:
# O cliente monta direto na porta 2049 sem consultar portmapper`} />
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/nfs" />

      </div>
    </main>
  );
}
