'use client';

import React, { useEffect, useCallback } from 'react';
import { Users, UserPlus, UserCheck, Shield, Lock, Terminal, Key, AlertTriangle } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ChecklistItem } from '@/components/ui/Steps';
import { useBadges } from '@/context/BadgeContext';
import { useTabFilter } from '@/hooks/useTabFilter';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

type UsuariosTab = 'conceito' | 'grupos' | 'sudo';

const TABS: { id: UsuariosTab; label: string }[] = [
  { id: 'conceito', label: '👤 Usuários & /etc/passwd' },
  { id: 'grupos',   label: '👥 Grupos e /etc/group' },
  { id: 'sudo',     label: '🔐 sudo e Sudoers' },
];

const CHECKLIST_ITEMS = [
  { id: 'usuario-criado',   label: 'Novo usuário criado com adduser e senha definida' },
  { id: 'grupo-criado',     label: 'Grupo criado e usuário adicionado ao grupo' },
  { id: 'sudo-configurado', label: 'Usuário adicionado ao grupo sudo e testado com sudo -l' },
];

// ── Code snippets ────────────────────────────────────────────────────────────

const CODE_USUARIOS_BASICOS = `# Ver usuários do sistema
cat /etc/passwd
getent passwd

# Criar usuário (interativo — recomendado para iniciantes)
sudo adduser joao

# Criar usuário manualmente
sudo useradd -m -s /bin/bash joao   # -m cria /home, -s define shell

# Definir / alterar senha
sudo passwd joao

# Informações sobre usuário
id joao
whoami
who

# Ver usuários logados no momento
w
last | head -10`;

const CODE_USERMOD = `# Modificar usuário
sudo usermod -s /bin/zsh joao       # mudar shell padrão
sudo usermod -l novonome joao       # renomear login
sudo usermod -L joao                # bloquear conta (Lock)
sudo usermod -U joao                # desbloquear conta (Unlock)

# Remover usuário
sudo userdel joao                   # mantém /home/joao
sudo userdel -r joao                # remove /home também — cuidado!`;

const CODE_PASSWD_ANATOMIA = `# Cada linha de /etc/passwd tem 7 campos separados por ":"
#
# usuario:x:1001:1001:Nome Completo:/home/usuario:/bin/bash
#    1    2   3    4        5              6            7
#
# 1. Username     — nome de login
# 2. Senha        — "x" significa que o hash está em /etc/shadow
# 3. UID          — User ID numérico (0 = root)
# 4. GID          — Group ID primário
# 5. GECOS        — nome completo / descrição (campo informativo)
# 6. Home dir     — diretório inicial do usuário
# 7. Shell        — interpretador de comandos padrão

# Ver só campos interessantes
awk -F: '{print $1, $3, $7}' /etc/passwd | column -t`;

const CODE_GRUPOS_BASICOS = `# Criar grupo
sudo groupadd desenvolvedores
sudo groupadd -g 2000 ti            # GID específico

# Adicionar usuário a grupo secundário
sudo usermod -aG docker joao        # -a = APPEND (nunca omita o -a!)
sudo usermod -aG sudo,docker joao   # múltiplos grupos de uma vez

# Verificar grupos do usuário
groups joao
id joao

# Ver todos os grupos do sistema
cat /etc/group
getent group

# Remover usuário de um grupo
sudo gpasswd -d joao docker

# Deletar grupo
sudo groupdel desenvolvedores`;

const CODE_GROUP_ANATOMIA = `# Cada linha de /etc/group tem 4 campos separados por ":"
#
# docker:x:999:joao,maria
#   1    2  3      4
#
# 1. Nome do grupo
# 2. Senha do grupo (raramente usado — quase sempre "x")
# 3. GID — Group ID numérico
# 4. Membros — lista separada por vírgula

# Ver grupos aos quais EU pertenço
groups
id`;

const CODE_SUDO_BASICO = `# Forma mais segura: adicionar ao grupo sudo
sudo usermod -aG sudo joao

# Verificar privilégios do usuário atual
sudo -l

# Verificar privilégios de outro usuário (como root)
sudo -l -U joao

# Testar se sudo está funcionando
sudo whoami                         # deve retornar "root"

# Logar como root temporariamente
sudo -i                             # shell root completo
exit                                # sair e voltar ao usuário normal`;

const CODE_VISUDO = `# SEMPRE use visudo — ele valida a sintaxe antes de salvar
sudo visudo

# Exemplos de regras em /etc/sudoers:
# Formato: USUÁRIO  HOST=(COMO_QUEM) COMANDOS

# Acesso total (equivalente ao grupo sudo)
joao ALL=(ALL:ALL) ALL

# Sem senha para comandos específicos (deploy de serviços)
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart nginx

# Grupo inteiro com restrição de comandos
%desenvolvedores ALL=(ALL) /usr/bin/apt, /bin/systemctl`;

const CODE_LABS = `# Lab 1 — Criar e inspecionar usuário
sudo adduser lab-joao               # siga o assistente interativo
id lab-joao                         # confirma UID/GID/grupos
cat /etc/passwd | grep lab-joao     # vê os 7 campos

# Lab 2 — Criar grupo e adicionar membro
sudo groupadd lab-team
sudo usermod -aG lab-team lab-joao
groups lab-joao                     # deve listar lab-team

# Lab 3 — Conceder e verificar sudo
sudo usermod -aG sudo lab-joao
sudo -l -U lab-joao                 # lista permissões sudo
# Testar como lab-joao:
su - lab-joao
sudo whoami                         # deve retornar "root"
exit`;

const WINDOWS_USUARIOS = `# Windows — Painel de Controle → Contas de Usuário
# CMD: net user joao senha123 /add
# PowerShell: New-LocalUser "joao" -Password (Read-Host -AsSecureString)
# net localgroup "Administradores" joao /add`;

const LINUX_USUARIOS = `# Linux — Terminal
sudo adduser joao          # cria com home e shell
sudo passwd joao           # define senha
sudo usermod -aG sudo joao # eleva a administrador`;

const WINDOWS_GRUPOS = `# Gerenciamento de Grupos no Windows
# GUI: Computador → Gerenciar → Usuários e Grupos Locais
# CMD: net localgroup desenvolvedores /add
# CMD: net localgroup desenvolvedores joao /add
# PowerShell: Add-LocalGroupMember -Group "Developers" -Member "joao"`;

const LINUX_GRUPOS = `# Gerenciamento de Grupos no Linux
sudo groupadd desenvolvedores      # cria grupo
sudo usermod -aG desenvolvedores joao  # adiciona membro
cat /etc/group | grep desenvolvedores  # confirma`;

// ── Componente principal ──────────────────────────────────────────────────────

export default function UsuariosPage() {
  const { checklist, updateChecklist, trackPageVisit, unlockBadge } = useBadges();
  const { isActive, tabButtonProps } = useTabFilter<UsuariosTab>('conceito');

  useEffect(() => {
    trackPageVisit('/usuarios');
  }, [trackPageVisit]);

  // Desbloqueia badge quando todos os 3 checkpoints estiverem marcados
  useEffect(() => {
    if (
      checklist['usuario-criado'] &&
      checklist['grupo-criado'] &&
      checklist['sudo-configurado']
    ) {
      unlockBadge('usuarios-master');
    }
  }, [checklist, unlockBadge]);

  const handleCheck = useCallback(
    (id: string, val: boolean) => updateChecklist(id, val),
    [updateChecklist],
  );

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-12"
      style={{ '--mod': '#6366f1' } as React.CSSProperties}
    >
      {/* Header ──────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="section-label" style={{ color: 'var(--mod)' }}>
            Fundamentos Linux · Módulo 05-B
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Users size={36} style={{ color: 'var(--mod)' }} />
          Gerenciamento de Usuários e Grupos
        </h1>
        <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
          Aprenda a criar usuários, gerenciar grupos e configurar sudo no Linux. Todo processo
          roda como algum usuário — dominar isso é a base da segurança do sistema.
        </p>
      </div>

      {/* Checklist lateral + tabs ─────────────────────────────── */}
      <div className="flex gap-8">
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">

          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Seções do módulo de usuários"
            className="flex gap-1 mb-8 border-b border-border overflow-x-auto"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                {...tabButtonProps(tab.id)}
                className={[
                  'px-4 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors',
                  isActive(tab.id)
                    ? 'border-b-2 -mb-px text-text bg-bg-2'
                    : 'text-text-2 hover:text-text',
                ].join(' ')}
                style={isActive(tab.id) ? { borderColor: 'var(--mod)' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Aba 1: Usuários & /etc/passwd ──────────────────── */}
          {isActive('conceito') && (
            <div className="space-y-8">

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Terminal size={20} style={{ color: 'var(--mod)' }} />
                  Por que gerenciar usuários?
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {[
                    {
                      icon: <Shield size={18} />,
                      title: 'Segurança',
                      text: 'Todo processo Linux roda como um usuário. Controlar usuários é controlar o que pode ser executado.',
                    },
                    {
                      icon: <AlertTriangle size={18} />,
                      title: 'Risco do root',
                      text: 'Um único comando errado como root pode apagar o sistema inteiro. Evite usar root diretamente.',
                    },
                    {
                      icon: <Key size={18} />,
                      title: 'Menor privilégio',
                      text: 'Princípio fundamental de segurança: dê apenas as permissões que o usuário realmente precisa.',
                    },
                  ].map((card) => (
                    <div key={card.title} className="p-4 rounded-xl bg-bg-2 border border-border">
                      <div className="flex items-center gap-2 mb-2 font-semibold" style={{ color: 'var(--mod)' }}>
                        {card.icon}
                        {card.title}
                      </div>
                      <p className="text-sm text-text-2 leading-relaxed">{card.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <FluxoCard
                title="Ciclo de vida de um usuário"
                steps={[
                  { label: 'adduser',       sub: 'cria conta + home' },
                  { label: 'passwd',        sub: 'define senha' },
                  { label: 'usermod -aG',   sub: 'adiciona a grupos' },
                  { label: 'testar acesso', sub: 'su - usuário' },
                  { label: 'userdel -r',    sub: 'remove quando sair' },
                ]}
              />

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Terminal size={20} style={{ color: 'var(--mod)' }} />
                  Anatomia do <code className="code-block text-sm px-2 py-0.5">/etc/passwd</code>
                </h2>
                <CodeBlock code={CODE_PASSWD_ANATOMIA} />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <UserPlus size={20} style={{ color: 'var(--mod)' }} />
                  Comandos básicos
                </h2>
                <CodeBlock code={CODE_USUARIOS_BASICOS} />
                <div className="mt-4">
                  <CodeBlock code={CODE_USERMOD} />
                </div>
                <WarnBox className="mt-4" title="Atenção ao deletar">
                  <p className="text-sm">
                    Nunca delete um usuário com processos rodando. Verifique primeiro com{' '}
                    <code className="code-block text-xs px-1">ps aux | grep joao</code> e encerre
                    a sessão com <code className="code-block text-xs px-1">loginctl terminate-user joao</code>.
                  </p>
                </WarnBox>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <UserCheck size={20} style={{ color: 'var(--mod)' }} />
                  Windows ↔ Linux
                </h2>
                <WindowsComparisonBox
                  windowsLabel="Windows (Painel de Controle / CMD / PowerShell)"
                  linuxLabel="Linux (terminal)"
                  windowsCode={WINDOWS_USUARIOS}
                  linuxCode={LINUX_USUARIOS}
                />
              </section>

            </div>
          )}

          {/* ── Aba 2: Grupos e /etc/group ─────────────────────── */}
          {isActive('grupos') && (
            <div className="space-y-8">

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} style={{ color: 'var(--mod)' }} />
                  Conceito de grupos
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-bg-2 border border-border">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--mod)' }}>Grupo primário</h3>
                    <p className="text-sm text-text-2 leading-relaxed">
                      Definido em <code className="code-block text-xs px-1">/etc/passwd</code>, criado
                      automaticamente com o usuário. É o grupo padrão dos arquivos que o usuário cria.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-2 border border-border">
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--mod)' }}>Grupos secundários</h3>
                    <p className="text-sm text-text-2 leading-relaxed">
                      Acesso a recursos adicionais. Ex: grupo <code className="code-block text-xs px-1">docker</code>{' '}
                      para usar containers, <code className="code-block text-xs px-1">sudo</code> para executar
                      comandos como root.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Terminal size={20} style={{ color: 'var(--mod)' }} />
                  Anatomia do <code className="code-block text-sm px-2 py-0.5">/etc/group</code>
                </h2>
                <CodeBlock code={CODE_GROUP_ANATOMIA} />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <UserPlus size={20} style={{ color: 'var(--mod)' }} />
                  Comandos de grupos
                </h2>
                <CodeBlock code={CODE_GRUPOS_BASICOS} />
                <InfoBox className="mt-4" title="O -a em usermod -aG é crítico">
                  <p className="text-sm">
                    Sem o <code className="code-block text-xs px-1">-a</code> (append), o{' '}
                    <code className="code-block text-xs px-1">usermod -G</code> substitui TODOS os grupos
                    secundários do usuário pela lista informada. É um dos erros mais comuns de iniciantes
                    — o usuário perde acesso ao Docker, sudo, e outros grupos de uma só vez.
                  </p>
                </InfoBox>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield size={20} style={{ color: 'var(--mod)' }} />
                  Grupos importantes do sistema
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-2 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">Grupo</th>
                        <th className="text-left px-4 py-3 font-semibold">Propósito</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        ['sudo / wheel', 'Executar comandos como root'],
                        ['docker',       'Usar Docker sem precisar de sudo'],
                        ['www-data',     'Servidor web — Nginx / Apache'],
                        ['adm',          'Ler logs do sistema em /var/log/'],
                        ['ssh',          'Conectar via SSH (quando restrito no sshd_config)'],
                      ].map(([grupo, desc]) => (
                        <tr key={grupo} className="hover:bg-bg-2/50 transition-colors">
                          <td className="px-4 py-3">
                            <code className="code-block text-xs px-2 py-0.5">{grupo}</code>
                          </td>
                          <td className="px-4 py-3 text-text-2">{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <UserCheck size={20} style={{ color: 'var(--mod)' }} />
                  Windows ↔ Linux
                </h2>
                <WindowsComparisonBox
                  windowsLabel="Windows (Gerenciador de Computador / CMD / PowerShell)"
                  linuxLabel="Linux (terminal)"
                  windowsCode={WINDOWS_GRUPOS}
                  linuxCode={LINUX_GRUPOS}
                />
              </section>

            </div>
          )}

          {/* ── Aba 3: sudo e Sudoers ──────────────────────────── */}
          {isActive('sudo') && (
            <div className="space-y-8">

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock size={20} style={{ color: 'var(--mod)' }} />
                  sudo vs su — qual usar?
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-2 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold"></th>
                        <th className="text-left px-4 py-3 font-semibold">
                          <code className="code-block text-xs px-2">su</code>
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          <code className="code-block text-xs px-2">sudo</code>
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          <code className="code-block text-xs px-2">sudo -i</code>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        ['Requer senha de',    'root',            'do próprio usuário',      'do próprio usuário'],
                        ['Muda para root?',    'Sim',             'Não (executa 1 cmd)',      'Sim (abre shell root)'],
                        ['Auditável?',         'Não (sem log)',   '✅ /var/log/auth.log',     '✅ /var/log/auth.log'],
                        ['Recomendado?',       '❌ Nunca em prod', '✅ Sempre',               '⚠️ Só em emergência'],
                      ].map(([label, su, sudo_, sudoi]) => (
                        <tr key={label} className="hover:bg-bg-2/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-text-2">{label}</td>
                          <td className="px-4 py-3">{su}</td>
                          <td className="px-4 py-3">{sudo_}</td>
                          <td className="px-4 py-3">{sudoi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield size={20} style={{ color: 'var(--mod)' }} />
                  Configurar sudo
                </h2>
                <CodeBlock code={CODE_SUDO_BASICO} />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Key size={20} style={{ color: 'var(--mod)' }} />
                  Editar <code className="code-block text-base px-2">/etc/sudoers</code> com segurança
                </h2>
                <CodeBlock code={CODE_VISUDO} />
                <WarnBox className="mt-4" title="Nunca edite sudoers diretamente">
                  <p className="text-sm">
                    NUNCA use <code className="code-block text-xs px-1">vim /etc/sudoers</code> ou{' '}
                    <code className="code-block text-xs px-1">nano /etc/sudoers</code>. Use{' '}
                    <code className="code-block text-xs px-1">sudo visudo</code> — ele valida a sintaxe
                    antes de salvar. Um erro no sudoers pode bloquear seu acesso root permanentemente,
                    tornando o sistema irrecuperável sem um live USB.
                  </p>
                </WarnBox>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Terminal size={20} style={{ color: 'var(--mod)' }} />
                  Exercícios Guiados
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      num: 1,
                      title: 'Criar usuário e inspecionar',
                      desc: 'Crie o usuário lab-joao com adduser, defina uma senha e confirme com id lab-joao e cat /etc/passwd | grep lab-joao.',
                    },
                    {
                      num: 2,
                      title: 'Criar grupo e adicionar membro',
                      desc: 'Crie o grupo lab-team com groupadd, adicione lab-joao com usermod -aG lab-team lab-joao e confirme com groups lab-joao.',
                    },
                    {
                      num: 3,
                      title: 'Conceder e verificar sudo',
                      desc: 'Adicione lab-joao ao grupo sudo, verifique com sudo -l -U lab-joao e teste executando sudo whoami como esse usuário.',
                    },
                  ].map((lab) => (
                    <div key={lab.num} className="p-5 rounded-xl bg-bg-2 border border-border flex gap-4">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
                        style={{ backgroundColor: 'var(--mod)' }}
                      >
                        {lab.num}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{lab.title}</h4>
                        <p className="text-sm text-text-2 leading-relaxed">{lab.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CodeBlock code={CODE_LABS} className="mt-6" />
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} style={{ color: 'var(--mod)' }} />
                  Erros Comuns e Soluções
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      title: 'usermod: user joao is currently used by process X',
                      solution: 'O usuário está com uma sessão ativa. Encerre com loginctl terminate-user joao ou pkill -u joao antes de modificar.',
                    },
                    {
                      title: 'userdel: user joao is currently logged in',
                      solution: 'Desconecte o usuário antes de deletar: pkill -KILL -u joao. Em seguida, execute userdel -r joao.',
                    },
                    {
                      title: 'sudo: command not found / usuário não pode executar sudo',
                      solution: 'O usuário não está no grupo sudo. Verifique com groups joao. Corrija com: sudo usermod -aG sudo joao (precisa relogar para valer).',
                    },
                    {
                      title: "usermod: group 'docker' does not exist",
                      solution: 'O grupo docker só existe depois que o Docker é instalado. Instale o Docker ou crie o grupo manualmente com groupadd docker.',
                    },
                  ].map((item, i) => (
                    <details key={i} className="group rounded-xl border border-border bg-bg-2 overflow-hidden">
                      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-bg-3 transition-colors list-none">
                        <AlertTriangle size={16} className="text-warn flex-shrink-0" />
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="ml-auto text-text-3 text-xs group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-5 pb-4 pt-2 text-sm text-text-2 leading-relaxed border-t border-border">
                        {item.solution}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

            </div>
          )}

        </div>

        {/* Sidebar — checklist ──────────────────────────────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 rounded-xl border border-border bg-bg-2 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-3 mb-4">
              Checklist do Lab
            </h3>
            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => (
                <ChecklistItem
                  key={item.id}
                  text={item.label}
                  checked={!!checklist[item.id]}
                  onToggle={() => handleCheck(item.id, !checklist[item.id])}
                />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-text-3 text-center">
              {CHECKLIST_ITEMS.filter((i) => checklist[i.id]).length} / {CHECKLIST_ITEMS.length} concluídos
            </div>
          </div>
        </aside>
      </div>

      {/* ModuleNav ───────────────────────────────────────────────── */}
      <div className="mt-12">
        <ModuleNav order={FUNDAMENTOS_ORDER} currentPath="/usuarios" />
      </div>
    </div>
  );
}
