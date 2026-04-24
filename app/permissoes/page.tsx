'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
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

      <div className="space-y-14">

        <section id="permissoes">
          <h2 className="text-2xl font-bold mb-2">Permissões — chmod e ls -la</h2>
          <p className="text-text-2 text-sm mb-4">
            Permissões são lidas como 3 grupos de bits: dono, grupo, outros. Numericamente: r=4, w=2, x=1.
            Assim, <code>755</code> = rwxr-xr-x e <code>600</code> = rw-------.
          </p>
          <CodeBlock code={CHMOD} lang="bash" title="chmod — permissões" />
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

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>ACLs com getfacl/setfacl — permissões granulares por usuário</li>
            <li>SUID/SGID bits — executar como dono do arquivo</li>
            <li>chattr +i — tornar arquivo imutável mesmo para root</li>
            <li>PAM modules — autenticação plugável (2FA, LDAP)</li>
          </ul>
        </HighlightBox>

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

      <ModuleNav currentPath="/permissoes" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
