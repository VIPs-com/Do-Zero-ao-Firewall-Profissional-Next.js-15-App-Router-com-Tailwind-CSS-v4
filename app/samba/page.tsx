'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { FolderOpen, Users, Shield, Network, AlertTriangle, CheckCircle } from 'lucide-react';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

const CHECKLIST_ITEMS = [
  { id: 'samba-instalado', label: 'Instalei samba, configurei workgroup e testei com testparm sem erros' },
  { id: 'samba-share',     label: 'Criei um compartilhamento com valid users, configurei permissões e acessei via smbclient' },
  { id: 'samba-windows',   label: 'Acessei o compartilhamento Samba pelo Windows Explorer via \\\\IP\\pasta' },
];

export default function SambaPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/samba');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-samba min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Servidores</span>
          <span>/</span>
          <span className="text-text-2">Samba</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo S02 · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">🗂️ Samba — File Sharing Linux↔Windows</h1>
          <p className="text-text-2 text-lg mb-6">
            smb.conf · shares · smbpasswd · mount.cifs — compartilhe arquivos entre Linux e Windows na mesma rede
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do smb.conf ao \\\\IP\\pasta no Explorer"
          steps={[
            { label: 'smb.conf',     sub: 'define workgroup, netbios name e shares',          icon: <FolderOpen size={14}/>, color: 'border-accent/50' },
            { label: 'smbpasswd',    sub: 'cria usuário Samba (separado do Linux)',            icon: <Users size={14}/>,     color: 'border-info/50' },
            { label: 'Permissões',   sub: 'valid users, create mask, read only',               icon: <Shield size={14}/>,    color: 'border-ok/50' },
            { label: 'Firewall',     sub: 'libera 137/138 UDP e 139/445 TCP',                  icon: <Network size={14}/>,   color: 'border-warn/50' },
            { label: '\\\\IP\\pasta', sub: 'Windows Explorer ou smbclient no Linux',           icon: <FolderOpen size={14}/>, color: 'border-layer-3/50' },
          ]}
        />

        {/* 1. Instalação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Instalação</h2>

          <CodeBlock lang="bash" code={`sudo apt update
sudo apt install samba samba-common-bin

# Verificar versão instalada:
samba --version

# Fazer backup do arquivo de configuração padrão:
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.bak

# Verificar a configuração a qualquer momento:
testparm
# Saída esperada: "Loaded services file OK." sem erros`} />

          <InfoBox title="O que é o Samba?">
            <p className="text-sm text-text-2">
              Samba implementa o protocolo <strong>SMB/CIFS</strong> (Server Message Block) no Linux,
              permitindo que máquinas Windows acessem pastas e impressoras Linux como se fossem
              recursos nativos de rede Windows. É a ponte entre os dois mundos.
            </p>
          </InfoBox>
        </section>

        {/* 2. smb.conf básico */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Configuração do smb.conf</h2>

          <p className="text-text-2 mb-4">
            O arquivo <code>/etc/samba/smb.conf</code> tem duas partes: a seção <code>[global]</code>
            com parâmetros gerais, e as seções de shares (<code>[nome]</code>) que definem cada pasta compartilhada.
          </p>

          <CodeBlock lang="bash" code={`sudo nano /etc/samba/smb.conf`} />

          <CodeBlock lang="bash" code={`# /etc/samba/smb.conf — configuração completa

[global]
    workgroup = WORKGROUP          # mesmo workgroup do Windows (padrão: WORKGROUP)
    server string = Samba Server
    netbios name = linux-server    # nome visível no "Rede" do Windows Explorer
    security = user                # autenticação por usuário (recomendado)
    map to guest = Bad User        # usuário inválido → acesso como guest (se shares públicos)
    dns proxy = no

    # Protocolo mínimo — desabilitar SMB1 por segurança:
    min protocol = SMB2

# ── Share público — sem autenticação ──────────────────
[publico]
    path = /srv/samba/publico
    browseable = yes               # aparece ao navegar na rede
    read only = yes                # somente leitura para todos
    guest ok = yes                 # acesso sem senha
    comment = Arquivos públicos

# ── Share privado — requer autenticação ───────────────
[privado]
    path = /srv/samba/privado
    browseable = yes
    read only = no                 # leitura e escrita
    guest ok = no                  # requer usuário/senha
    valid users = joao, maria      # apenas estes usuários têm acesso
    create mask = 0660             # permissão dos arquivos criados
    directory mask = 0770          # permissão dos diretórios criados

# ── Share homes — cada usuário acessa sua pasta ───────
[homes]
    comment = Home Directories
    browseable = no                # não aparece na lista (segurança)
    read only = no
    create mask = 0700
    directory mask = 0700
    valid users = %S               # %S = nome do share (= nome do usuário)`} />
        </section>

        {/* 3. Criar pastas e usuários */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Criar Pastas e Usuários Samba</h2>

          <WarnBox title="Usuário Samba ≠ Usuário Linux">
            <p className="text-sm text-text-2">
              O Samba mantém seu <strong>próprio banco de senhas</strong>, separado do <code>/etc/shadow</code>.
              Um usuário deve existir no Linux E ter senha no Samba para acessar shares protegidos.
              O comando <code>smbpasswd -a usuario</code> registra a senha Samba de um usuário Linux existente.
            </p>
          </WarnBox>

          <CodeBlock lang="bash" code={`# Criar as pastas compartilhadas:
sudo mkdir -p /srv/samba/publico
sudo mkdir -p /srv/samba/privado

# Permissões para o share público (todos podem ler):
sudo chmod 755 /srv/samba/publico
sudo chown nobody:nogroup /srv/samba/publico

# Permissões para o share privado (dono = grupo samba-users):
sudo chmod 770 /srv/samba/privado
sudo chown root:sambashare /srv/samba/privado`} />

          <CodeBlock lang="bash" code={`# Criar usuário Linux (se não existir):
sudo adduser joao

# Adicionar ao grupo samba e criar senha Samba:
sudo usermod -aG sambashare joao
sudo smbpasswd -a joao
# New SMB password: (digitar senha)
# Retype new SMB password: (confirmar)
# Added user joao.

# Habilitar/desabilitar usuário Samba:
sudo smbpasswd -e joao   # enable
sudo smbpasswd -d joao   # disable

# Listar usuários Samba:
sudo pdbedit -L -v`} />

          <CodeBlock lang="bash" code={`# Validar configuração:
testparm
# "Loaded services file OK." — zero erros

# Reiniciar os serviços:
sudo systemctl restart smbd nmbd
sudo systemctl enable smbd nmbd

# Verificar se está escutando nas portas corretas:
sudo ss -tlnp | grep -E "smbd|nmbd"
sudo ss -ulnp | grep nmbd`} />
        </section>

        {/* 4. Firewall */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Firewall — Portas do Samba</h2>

          <div className="bg-bg-2 border border-border rounded-lg overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-bg-3">
                <th className="text-left p-3">Porta</th>
                <th className="text-left p-3">Protocolo</th>
                <th className="text-left p-3">Serviço</th>
                <th className="text-left p-3">Função</th>
              </tr></thead>
              <tbody>
                {[
                  ['137', 'UDP', 'nmbd', 'NetBIOS Name Service — resolução de nomes Windows'],
                  ['138', 'UDP', 'nmbd', 'NetBIOS Datagram — browsing da rede (vizinhança)'],
                  ['139', 'TCP', 'smbd', 'NetBIOS Session — SMB sobre NetBIOS (legado)'],
                  ['445', 'TCP', 'smbd', 'SMB direto — protocolo moderno, usar este'],
                ].map(([p, proto, svc, fn]) => (
                  <tr key={p} className="border-b border-border/50">
                    <td className="p-3 font-mono text-accent">{p}</td>
                    <td className="p-3 text-text-2">{proto}</td>
                    <td className="p-3 font-mono text-info">{svc}</td>
                    <td className="p-3 text-text-2">{fn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock lang="bash" code={`# Liberar Samba no iptables (apenas para a rede LAN):
sudo iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 139 -j ACCEPT
sudo iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 445 -j ACCEPT
sudo iptables -A INPUT -s 192.168.1.0/24 -p udp --dport 137 -j ACCEPT
sudo iptables -A INPUT -s 192.168.1.0/24 -p udp --dport 138 -j ACCEPT`} />
        </section>

        {/* 5. Acesso */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Acessar o Compartilhamento</h2>

          <h3 className="font-semibold mb-3 text-info">5.1 Pelo Windows Explorer</h3>
          <CodeBlock lang="bash" code={`# No Windows Explorer (Win + R ou barra de endereço):
\\\\192.168.1.100\\publico
\\\\192.168.1.100\\privado
\\\\linux-server\\privado    # usando o netbios name

# Mapear como unidade de rede permanente (cmd.exe):
net use Z: \\\\192.168.1.100\\privado /user:joao /persistent:yes

# Desconectar:
net use Z: /delete`} />

          <h3 className="font-semibold mb-3 mt-6 text-info">5.2 Pelo Linux — smbclient</h3>
          <CodeBlock lang="bash" code={`# Instalar cliente:
sudo apt install smbclient cifs-utils

# Listar shares disponíveis no servidor:
smbclient -L //192.168.1.100 -U joao

# Conectar interativamente (como FTP):
smbclient //192.168.1.100/privado -U joao
# smb: \> ls          — listar arquivos
# smb: \> get file    — baixar arquivo
# smb: \> put file    — enviar arquivo
# smb: \> exit        — sair`} />

          <h3 className="font-semibold mb-3 mt-6 text-info">5.3 Montar como sistema de arquivos (mount.cifs)</h3>
          <CodeBlock lang="bash" code={`# Montar manualmente:
sudo mount -t cifs //192.168.1.100/privado /mnt/samba \
    -o username=joao,password=senha123,uid=1000,gid=1000

# Verificar montagem:
df -h | grep samba

# Desmontar:
sudo umount /mnt/samba

# Montar automaticamente no boot — /etc/fstab:
//192.168.1.100/privado  /mnt/samba  cifs  credentials=/etc/samba/.creds,uid=1000,gid=1000,_netdev  0  0

# Arquivo de credenciais (mais seguro que senha no fstab):
sudo nano /etc/samba/.creds
# username=joao
# password=senha123
sudo chmod 600 /etc/samba/.creds`} />

          <WindowsComparisonBox
            windowsLabel="Windows (Compartilhamento)"
            linuxLabel="Linux (Samba)"
            windowsCode={`# GUI: botão direito na pasta
# → Propriedades → Compartilhamento
# → Compartilhar... → adicionar usuários
# → Permissões: Leitura / Leitura e Escrita

# Acesso via Explorer:
# \\\\servidor\\pasta
# Mapear unidade: net use Z: \\\\srv\\pasta

# Usuários: Painel de Controle
# → Contas de Usuário
# Senha = senha da conta Windows

# Portas: 139 (NetBIOS) e 445 (SMB)
# Firewall Windows as libera automaticamente
# ao habilitar "Compartilhamento de Arquivo"`}
            linuxCode={`# CLI: editar /etc/samba/smb.conf
# [minha-pasta]
# path = /srv/samba/minha-pasta
# valid users = joao
# read only = no

# Acesso via Explorer Windows:
# \\\\192.168.1.100\\minha-pasta
# Montar no Linux: mount -t cifs

# Usuários: DOIS bancos separados
# Linux: /etc/shadow (adduser)
# Samba: smbpasswd -a usuario
# (ambos necessários para autenticação)

# Portas: liberar manualmente no iptables
# 137/138 UDP (nmbd) + 139/445 TCP (smbd)`}
          />
        </section>

        {/* 6. Diagnóstico */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Diagnóstico e Troubleshooting</h2>

          <CodeBlock lang="bash" code={`# 1. Verificar configuração:
testparm -v 2>&1 | head -30

# 2. Status dos serviços:
sudo systemctl status smbd nmbd

# 3. Ver conexões ativas:
sudo smbstatus

# 4. Log do Samba (nível de detalhe ajustável):
sudo tail -f /var/log/samba/log.smbd
sudo tail -f /var/log/samba/log.nmbd

# 5. Testar autenticação do usuário:
smbclient //localhost/privado -U joao
# Se "NT_STATUS_LOGON_FAILURE" → senha Samba incorreta → sudo smbpasswd -a joao

# 6. Verificar permissões da pasta compartilhada:
ls -la /srv/samba/privado
# O processo smbd roda como o usuário que se conecta
# → a pasta deve ter permissão para esse usuário/grupo`} />

          <InfoBox title="Problema comum: acesso negado mesmo com senha correta">
            <p className="text-sm text-text-2 mb-2">
              Verifique três coisas nesta ordem:
            </p>
            <ol className="text-sm text-text-2 list-decimal list-inside space-y-1">
              <li>Usuário existe no Linux? <code>id joao</code></li>
              <li>Usuário tem senha no Samba? <code>sudo pdbedit -L | grep joao</code></li>
              <li>Usuário está em <code>valid users</code> do share? <code>testparm -s</code></li>
              <li>A pasta tem permissão para o usuário? <code>ls -la /srv/samba/privado</code></li>
            </ol>
          </InfoBox>
        </section>

        {/* Exercícios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧪 Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 1 — Share Público e Privado</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Instale: <code>sudo apt install samba</code></li>
                <li>Crie as pastas: <code>sudo mkdir -p /srv/samba/{'{'}publico,privado{'}'}</code></li>
                <li>Configure <code>/etc/samba/smb.conf</code> com os shares público e privado do exemplo</li>
                <li>Valide: <code>testparm</code> — deve terminar sem erros</li>
                <li>Crie o usuário: <code>sudo adduser joao &amp;&amp; sudo smbpasswd -a joao</code></li>
                <li>Reinicie: <code>sudo systemctl restart smbd nmbd</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 2 — Acesso via smbclient</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Instale: <code>sudo apt install smbclient</code></li>
                <li>Liste os shares: <code>smbclient -L //127.0.0.1 -U joao</code></li>
                <li>Conecte ao share privado: <code>smbclient //127.0.0.1/privado -U joao</code></li>
                <li>Crie um arquivo: <code>smb: \&gt; mkdir teste; put /etc/hostname hostname.txt</code></li>
                <li>Saia e verifique no sistema: <code>ls /srv/samba/privado/</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 3 — Acesso pelo Windows</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Libere as portas no firewall: <code>sudo iptables -A INPUT -p tcp --dport 445 -j ACCEPT</code></li>
                <li>No Windows: pressione Win + R e digite <code>\\\\IP-do-servidor</code></li>
                <li>Entre com usuário <code>joao</code> e a senha configurada no smbpasswd</li>
                <li>Arraste um arquivo para o share <code>privado</code></li>
                <li>Confirme no servidor Linux: <code>ls -la /srv/samba/privado/</code></li>
                <li>Verifique quem está conectado: <code>sudo smbstatus</code></li>
              </ol>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">✅ Checklist do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <div className="flex items-start gap-2">
                  {checklist[item.id]
                    ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" />
                    : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
                  <span className="text-sm text-text-2">{item.label}</span>
                </div>
              </label>
            ))}
          </div>
          {CHECKLIST_ITEMS.every(i => checklist[i.id]) && (
            <div className="mt-4 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <span className="text-ok font-bold">🗂️ Badge samba-master desbloqueado!</span>
              <p className="text-sm text-text-2 mt-1">Linux e Windows agora falam a mesma língua na sua rede.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: "Windows não encontra o compartilhamento: \\\\192.168.1.10\\pasta não acessível",
              fix: 'Verificar 3 camadas: (1) firewall Linux — portas 137/138 UDP + 139/445 TCP abertas; (2) smb.conf — share definido corretamente com valid users; (3) smbpasswd — usuário criado com smbpasswd -a usuario. Testar do Linux: smbclient -L localhost -U usuario.',
            },
            {
              err: 'smbclient retorna NT_STATUS_LOGON_FAILURE',
              fix: 'Usuário Samba não existe ou senha incorreta. O Samba mantém senha separada do sistema Linux. Criar/redefinir: smbpasswd -a usuario. Verificar se o usuário Linux existe: id usuario.',
            },
            {
              err: 'Arquivos criados no share têm permissões erradas (root:root)',
              fix: 'Configurar force user e force group no smb.conf para o share: force user = usuario e force group = grupo. Aplicar também ao diretório: chown -R usuario:grupo /srv/samba/pasta.',
            },
            {
              err: 'Samba funciona na rede local mas não de fora (VPN)',
              fix: 'SMB não atravessa NAT bem. Preferir VPN (WireGuard/OpenVPN) e conectar ao compartilhamento pelo IP interno. Nunca expor as portas Samba (139/445) diretamente na WAN — é um vetor de ataque clássico (EternalBlue/WannaCry).',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        {/* ── Exercícios Guiados ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Instalar Samba e Criar Share Público</p>
              <CodeBlock lang="bash" code={`# Instalar Samba
apt install samba -y

# Fazer backup da config original
cp /etc/samba/smb.conf /etc/samba/smb.conf.bak

# Criar diretório para compartilhamento público
mkdir -p /srv/samba/publico
chmod 0777 /srv/samba/publico

# Configurar share público em /etc/samba/smb.conf
cat >> /etc/samba/smb.conf << 'EOF'

[publico]
   path = /srv/samba/publico
   browseable = yes
   read only = no
   guest ok = yes
   comment = Pasta Pública
EOF

# Verificar configuração
testparm -s

# Reiniciar Samba
systemctl restart smbd nmbd
systemctl status smbd`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Criar Share com Autenticação</p>
              <CodeBlock lang="bash" code={`# Criar usuário Linux e usuário Samba
useradd -M -s /sbin/nologin joao 2>/dev/null || true
smbpasswd -a joao   # Definir senha Samba (diferente da senha Linux)
smbpasswd -e joao   # Habilitar usuário

# Criar diretório privado
mkdir -p /srv/samba/privado
chown joao:joao /srv/samba/privado
chmod 0770 /srv/samba/privado

# Adicionar share autenticado
cat >> /etc/samba/smb.conf << 'EOF'

[privado]
   path = /srv/samba/privado
   browseable = no
   read only = no
   valid users = joao
   create mask = 0644
   directory mask = 0755
   comment = Pasta Privada do Joao
EOF

testparm -s
systemctl restart smbd

# Ver usuários Samba cadastrados
pdbedit -L`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Acessar Compartilhamento com smbclient</p>
              <CodeBlock lang="bash" code={`# Instalar cliente Samba
apt install smbclient cifs-utils -y

# Listar compartilhamentos disponíveis no servidor
smbclient -L //127.0.0.1 -N    # -N = sem senha (para share público)

# Acessar share público via linha de comando
smbclient //127.0.0.1/publico -N

# Dentro do smbclient:
# ls          → listar arquivos
# put teste.txt → enviar arquivo
# get arquivo → baixar arquivo
# exit        → sair

# Montar share no sistema de arquivos (persistente)
mkdir /mnt/samba-publico
mount -t cifs //127.0.0.1/publico /mnt/samba-publico -o guest,rw
ls /mnt/samba-publico/

# Ver sessões Samba ativas
smbstatus --shares
smbstatus --processes`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/samba" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
