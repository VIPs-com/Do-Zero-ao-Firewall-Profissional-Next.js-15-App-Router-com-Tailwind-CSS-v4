'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Eye, Edit3, Shield, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'permissoes-configuradas', text: 'Alterei permissões com chmod, criei um usuário com useradd e executei comandos com sudo' },
];

const CHMOD = `# Ver permissões de um arquivo
ls -la /etc/ssh/sshd_config
# Saída: -rw-r--r-- 1 root root 3287 ... sshd_config
#         └──┬──┘└──┬──┘└──┬──┘
#           dono   grupo  outros
# r=4 (leitura)  w=2 (escrita)  x=1 (execução)

chmod 600 ~/.ssh/authorized_keys   # rw------- (só dono lê/escreve)
chmod 644 /etc/hosts               # rw-r--r-- (padrão para arquivos config)
chmod 755 /var/www/html            # rwxr-xr-x (padrão para diretórios web)
chmod +x script.sh                 # adicionar permissão de execução
chmod -x script.sh                 # remover permissão de execução`;

const USUARIOS = `whoami                               # meu usuário atual
id                                   # uid, gid e grupos

# Criar usuário
sudo useradd -m -s /bin/bash devops  # -m cria home, -s define shell
sudo passwd devops                   # definir senha

# Adicionar ao grupo sudo
sudo usermod -aG sudo devops         # -a append, -G grupo

# Ver grupos do usuário
groups devops

# Deletar usuário (cuidado!)
sudo userdel -r devops               # -r remove home também`;

const SUDO_CMD = `# Executar comando como root
sudo apt update
sudo systemctl restart nginx

# Abrir shell como root (evite em produção)
sudo -i          # shell root interativo

# Editar sudoers com segurança (NUNCA edite diretamente!)
sudo visudo

# Exemplo de entrada no sudoers:
# devops ALL=(ALL:ALL) ALL
# devops ALL=(ALL) NOPASSWD: /usr/bin/systemctl

# Auditar ações sudo
sudo grep "sudo" /var/log/auth.log | tail -10`;

const CHMOD_NUMERICO = `# Tabela de valores numéricos
# r=4  w=2  x=1   →   soma define as permissões
#
# 7 = rwx  (dono total)
# 6 = rw-  (ler e escrever)
# 5 = r-x  (ler e executar)
# 4 = r--  (só ler)
# 0 = ---  (nenhuma)
#
# Exemplos práticos:
chmod 700 ~/.ssh             # só dono acessa (diretório SSH)
chmod 600 ~/.ssh/id_rsa      # chave privada: só dono lê
chmod 644 ~/.ssh/id_rsa.pub  # chave pública: todos leem
chmod 777 /tmp/shared        # NUNCA em produção!`;

export default function PermissoesPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/permissoes');
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
        <span className="text-text-2">Permissões e Usuários</span>
      </div>

      <div className="section-label">Módulo 05 · Trilha Fundamentos</div>
      <h1 className="section-title">🔑 Permissões e Usuários</h1>
      <p className="section-sub">
        No Linux, cada arquivo tem um <strong>dono</strong>, um <strong>grupo</strong> e permissões para{' '}
        <strong>outros</strong>. Entender <code>rwxr-xr-x</code> é fundamental — configurações erradas
        expõem dados sensíveis ou bloqueiam serviços inteiros.
      </p>

      <FluxoCard
        title="Fluxo: controle de acesso no Linux"
        steps={[
          { label: 'ls -la',    sub: 'ver permissões',      icon: <Eye size={14} />,      color: 'border-info/50' },
          { label: 'chmod',     sub: 'alterar permissões',  icon: <Edit3 size={14} />,    color: 'border-accent/50' },
          { label: 'useradd',   sub: 'criar usuários',      icon: <UserPlus size={14} />, color: 'border-warn/50' },
          { label: 'sudo',      sub: 'privilégios root',    icon: <Shield size={14} />,   color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`Propriedades do arquivo → Segurança
  → Usuários e Grupos listados
  → Permissões: Controle Total, Modificar,
    Leitura e Execução, Leitura, Gravação
  → Herança de permissões da pasta pai
  Painel de Controle → Contas de Usuário`}
        linuxCode={`ls -la arquivo     # ver dono, grupo, bits rwx
chmod 644 arquivo  # rw-r--r--
chmod 755 pasta/   # rwxr-xr-x
chown user:group arquivo
useradd -m devops  # criar usuário
sudo comando       # executar como root`}
        windowsLabel="Windows — Propriedades / Contas"
        linuxLabel="Linux — chmod, chown, useradd, sudo"
      />

      <div className="space-y-14">

        <section id="permissoes">
          <h2 className="text-2xl font-bold mb-2">Permissões — chmod e ls -la</h2>
          <p className="text-text-2 text-sm mb-4">
            Permissões são lidas como 3 grupos de bits: dono, grupo, outros. Numericamente: r=4, w=2, x=1.
            Assim, <code>755</code> = rwxr-xr-x e <code>600</code> = rw-------.
          </p>
          <CodeBlock code={CHMOD} lang="bash" title="chmod — permissões" />
          <CodeBlock code={CHMOD_NUMERICO} lang="bash" title="chmod — referência numérica" />
        </section>

        <section id="usuarios">
          <h2 className="text-2xl font-bold mb-2">Usuários e Grupos</h2>
          <p className="text-text-2 text-sm mb-4">
            No servidor de firewall você vai criar um usuário <code>devops</code> para operações diárias —
            nunca opere diretamente como root em produção.
          </p>
          <CodeBlock code={USUARIOS} lang="bash" title="useradd, usermod, groups" />
          <WarnBox className="mt-4" title="Nunca use root direto em produção">
            <p className="text-sm text-text-2">
              Crie um usuário com sudo. Operações como root direto significam que um erro de digitação
              pode apagar configurações críticas sem confirmação.
            </p>
          </WarnBox>
        </section>

        <section id="sudo">
          <h2 className="text-2xl font-bold mb-2">sudo — Privilégios Controlados</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>sudo</code> executa comandos com privilégios de root de forma auditada.
            Toda ação fica registrada em <code>/var/log/auth.log</code>.
          </p>
          <CodeBlock code={SUDO_CMD} lang="bash" title="sudo e sudoers" />
          <InfoBox className="mt-4" title="visudo valida a sintaxe">
            <p className="text-sm text-text-2">
              Use sempre <code>sudo visudo</code> — ele valida a sintaxe antes de salvar.
              Um sudoers malformado pode bloquear o sudo completamente.
            </p>
          </InfoBox>
        </section>

        <section id="armadilhas">
          <div className="p-5 rounded-xl bg-[rgba(239,68,68,0.06)] border border-err/30">
            <h3 className="font-bold text-base mb-3 text-err">⚠️ Armadilhas Comuns</h3>
            <div className="space-y-2 text-sm text-text-2">
              <p><code className="text-err">chmod 777 /var/www</code> — expõe o servidor: qualquer usuário pode modificar arquivos.</p>
              <p><code className="text-err">chown root arquivo</code> sem sudo — silenciosamente falha ou bloqueia o acesso.</p>
              <p><code className="text-err">sudo visudo</code> — se esquecer e editar diretamente <code>/etc/sudoers</code>, um erro pode travar o sistema.</p>
            </div>
          </div>
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>ACLs com getfacl/setfacl — permissões granulares por usuário</li>
            <li>SUID/SGID bits — executar como dono do arquivo</li>
            <li>chattr +i — tornar arquivo imutável mesmo para root</li>
            <li>PAM modules — autenticação plugável (2FA, LDAP)</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Ler e alterar permissões</p>
              <CodeBlock code={`ls -la /etc/ssh/sshd_config   # ver permissões atuais
touch /tmp/teste.sh
chmod +x /tmp/teste.sh        # adicionar execução
ls -la /tmp/teste.sh          # confirmar -rwxr-xr-x`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Criar usuário devops</p>
              <CodeBlock code={`sudo useradd -m -s /bin/bash devops
sudo passwd devops
sudo usermod -aG sudo devops
groups devops                  # confirmar grupo sudo`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — sudo em ação</p>
              <CodeBlock code={`sudo whoami                    # deve retornar "root"
sudo grep "sudo" /var/log/auth.log | tail -5
# Confirmar que sua ação ficou registrada no log`} lang="bash" />
            </div>
          </div>
        </section>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 05
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
                ✅ Módulo 05 concluído! Próximo: Discos e Partições →
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ── Erros Comuns ── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-warn">⚠️</span> Erros Comuns e Soluções
        </h2>
        {[
          {
            err: 'chmod 777 aplicado em tudo — "funciona mas é inseguro"',
            fix: '777 (rwxrwxrwx) dá acesso total a qualquer usuário do sistema. Em servidores web: arquivos de conteúdo = 644, diretórios = 755, scripts PHP = 644 (nunca 777). Para diagnóstico temporário, 755 é quase sempre suficiente e muito mais seguro.',
          },
          {
            err: 'Permission denied ao executar script .sh mesmo sendo o dono',
            fix: 'Script sem bit de execução. Adicionar: chmod +x script.sh. Verificar: ls -la script.sh deve mostrar -rwxr-xr-x. Alternativa sem chmod: bash script.sh (o bash interpreta, não precisa do +x).',
          },
          {
            err: 'Servidor web não acessa arquivos — 403 Forbidden mesmo com arquivos existindo',
            fix: 'Verificar permissões em cadeia: cada diretório no caminho precisa ter x (execute) para o usuário do servidor web (www-data). Ex: chmod o+x /home/usuario para que www-data possa atravessar. Melhor prática: mover o site para /var/www/ onde o servidor já tem acesso.',
          },
          {
            err: 'sudo: user não está no grupo sudo — acesso sudo negado',
            fix: 'Adicionar ao grupo sudo: usermod -aG sudo usuario (como root). O usuário precisa fazer logout/login para o grupo ser aplicado. Verificar grupos atuais: id usuario. Em Debian, o grupo pode ser "sudo"; em alguns sistemas, "wheel".',
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
            <p className="font-bold text-sm mb-2">Lab 1 — Criar Usuários e Grupos</p>
            <CodeBlock lang="bash" code={`# Criar novo usuário de sistema
useradd -m -s /bin/bash joao
passwd joao

# Criar grupo para desenvolvedores
groupadd devteam

# Adicionar usuário ao grupo
usermod -aG devteam joao

# Verificar grupos do usuário
id joao
groups joao

# Ver entrada no /etc/passwd
grep joao /etc/passwd

# Ver grupos em /etc/group
grep devteam /etc/group

# Remover usuário (sem apagar home)
# userdel joao`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — chmod e chown na Prática</p>
            <CodeBlock lang="bash" code={`# Criar estrutura de teste
mkdir /tmp/lab-permissoes
cd /tmp/lab-permissoes
touch arquivo.txt script.sh segredo.conf

# Ver permissões iniciais
ls -la

# Definir permissões com notação octal
chmod 644 arquivo.txt   # rw-r--r--
chmod 755 script.sh     # rwxr-xr-x
chmod 600 segredo.conf  # rw-------

# Confirmar mudanças
ls -la

# Mudar dono e grupo
chown root:devteam /tmp/lab-permissoes/
chown joao:devteam arquivo.txt

# Permissões recursivas
chmod -R 750 /tmp/lab-permissoes/

# Limpar
rm -rf /tmp/lab-permissoes`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Bits Especiais: SUID, SGID e Sticky</p>
            <CodeBlock lang="bash" code={`# Ver exemplos de SUID no sistema (executam como dono)
find /usr/bin -perm -4000 -type f
# Nota: passwd e sudo têm SUID — executam como root

# Ver o bit sticky no /tmp (apenas dono pode deletar)
ls -la / | grep tmp
# drwxrwxrwt — o 't' no final é o sticky bit

# Criar diretório compartilhado com SGID
mkdir /tmp/compartilhado
chown :devteam /tmp/compartilhado
chmod 2775 /tmp/compartilhado  # 2 = SGID
ls -la /tmp/ | grep compartilhado
# drwxrwsr-x — o 's' no grupo = SGID

# Aplicar sticky bit em diretório compartilhado
chmod +t /tmp/compartilhado
ls -la /tmp/ | grep compartilhado`} />
          </div>
        </div>
      </section>

      <ModuleNav currentPath="/permissoes" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
