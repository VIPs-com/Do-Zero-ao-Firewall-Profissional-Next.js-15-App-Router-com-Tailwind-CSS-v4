'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Activity, Search, XCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'processos-controlados', text: 'Usei ps aux, top e kill para controlar processos; reiniciei um serviço com systemctl' },
];

const VER_PROCESSOS = `ps aux                        # todos os processos de todos os usuários
ps aux | grep nginx           # filtrar processos do nginx
ps aux --sort=-%cpu | head -10  # top 10 por CPU
top                           # interativo — pressione q para sair
htop                          # versão colorida (sudo apt install htop)`;

const CONTROLAR = `# Matar processo pelo PID (obter PID com ps aux | grep nome)
kill 1234                     # sinal TERM — pede para terminar graciosamente
kill -9 1234                  # sinal KILL — força encerramento imediato
killall nginx                 # matar todos os processos chamados nginx
pkill -f "python script.py"   # matar por padrão no nome do processo

# Ver status de saída do último comando
echo $?   # 0 = sucesso, qualquer outro valor = erro`;

const SYSTEMCTL = `# Gerenciar serviços com systemd
systemctl status nginx        # ver status e últimas linhas de log
systemctl start nginx         # iniciar
systemctl stop nginx          # parar
systemctl restart nginx       # reiniciar (para + inicia)
systemctl reload nginx        # recarregar config sem reiniciar (se suportado)
systemctl enable nginx        # iniciar automaticamente no boot
systemctl disable nginx       # não iniciar no boot
systemctl list-units --type=service  # listar todos os serviços ativos

# Verificar se está ativo (útil em scripts)
systemctl is-active nginx && echo "rodando" || echo "parado"`;

const TROUBLESHOOT = `# Cenário: processo consumindo 100% de CPU
top                            # identificar o PID do processo problemático
ps aux --sort=-%cpu | head -5  # confirmar ranking
lsof -p 1234                   # arquivos/sockets abertos por esse processo

# Cenário: serviço não inicia
systemctl status nginx         # ver mensagem de erro resumida
journalctl -u nginx -n 50      # últimas 50 linhas de log do serviço
nginx -t                       # checar sintaxe da config (nginx específico)
sshd -T                        # checar config do SSH`;

export default function ProcessosPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/processos');
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
        <span className="text-text-2">Gerenciamento de Processos</span>
      </div>

      <div className="section-label">Módulo 04 · Trilha Fundamentos</div>
      <h1 className="section-title">⚙️ Gerenciamento de Processos</h1>
      <p className="section-sub">
        Saiba o que está rodando no seu servidor. <strong>ps</strong>, <strong>top</strong>, <strong>kill</strong> e{' '}
        <strong>systemctl</strong> são as ferramentas para controlar processos — equivalente ao
        Gerenciador de Tarefas do Windows, porém muito mais poderoso e scriptável.
      </p>

      <FluxoCard
        title="Fluxo: diagnóstico e controle de processos"
        steps={[
          { label: 'ps aux / top',   sub: 'listar processos',    icon: <Search size={14} />,   color: 'border-info/50' },
          { label: 'grep / sort',    sub: 'filtrar e ordenar',   icon: <Activity size={14} />, color: 'border-accent/50' },
          { label: 'kill / killall', sub: 'encerrar processo',   icon: <XCircle size={14} />,  color: 'border-err/50' },
          { label: 'systemctl',      sub: 'gerenciar serviços',  icon: <Settings size={14} />, color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`Gerenciador de Tarefas (Ctrl+Shift+Esc)
  Aba Processos: CPU, memória, PID
  Aba Serviços: iniciar/parar serviços
  Botão "Finalizar Tarefa"
  services.msc para gerenciar serviços`}
        linuxCode={`top ou htop           # processos em tempo real
ps aux | grep nome    # buscar processo específico
kill PID              # encerrar pelo ID
kill -9 PID           # forçar encerramento
systemctl start|stop  # gerenciar serviços`}
        windowsLabel="Windows — Gerenciador de Tarefas"
        linuxLabel="Linux — ps, top, kill, systemctl"
      />

      <div className="space-y-14">

        <section id="ver-processos">
          <h2 className="text-2xl font-bold mb-2">Ver Processos em Execução</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>ps aux</code> é a combinação mais usada — mostra todos os processos com usuário, PID, CPU e memória.
          </p>
          <CodeBlock code={VER_PROCESSOS} lang="bash" title="Listar processos" />
          <InfoBox className="mt-4" title="O que significa PID?">
            <p className="text-sm text-text-2">
              <strong>PID = Process ID</strong>. Cada processo tem um número único. Use{' '}
              <code>ps aux | grep nome</code> para encontrar o PID de um processo específico.
              O PID 1 é sempre o <code>systemd</code> — o pai de todos os outros processos.
            </p>
          </InfoBox>
        </section>

        <section id="controlar">
          <h2 className="text-2xl font-bold mb-2">Controlar e Encerrar Processos</h2>
          <CodeBlock code={CONTROLAR} lang="bash" title="kill, killall, pkill" />
          <WarnBox className="mt-4" title="kill -9 é o último recurso">
            <p className="text-sm text-text-2">
              <code>kill -9</code> (SIGKILL) mata o processo imediatamente — sem chance de limpar arquivos
              temporários ou fechar conexões abertas. Use <code>kill</code> (SIGTERM) primeiro e só escale
              para <code>-9</code> se o processo não responder em alguns segundos.
            </p>
          </WarnBox>
        </section>

        <section id="systemctl">
          <h2 className="text-2xl font-bold mb-2">systemctl — Gerenciar Serviços</h2>
          <p className="text-text-2 text-sm mb-4">
            No Ubuntu/Debian moderno, os serviços são gerenciados pelo <strong>systemd</strong>.
            Nginx, SSH, Fail2ban, Docker — tudo usa systemctl.
          </p>
          <CodeBlock code={SYSTEMCTL} lang="bash" title="systemctl" />
          <InfoBox className="mt-4" title="enable vs start — qual a diferença?">
            <p className="text-sm text-text-2">
              <code>start</code> inicia o serviço <em>agora</em>. <code>enable</code> configura para iniciar
              <em> no próximo boot</em>. Em produção use os dois juntos:{' '}
              <code>systemctl enable --now nginx</code>.
            </p>
          </InfoBox>
        </section>

        <section id="troubleshoot">
          <h2 className="text-2xl font-bold mb-2">Diagnóstico — Serviço que Não Inicia</h2>
          <p className="text-text-2 text-sm mb-4">
            Quando um serviço trava ou não sobe, esse é o fluxo de diagnóstico.
          </p>
          <CodeBlock code={TROUBLESHOOT} lang="bash" title="Diagnóstico de processos" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>htop com filtros, árvore de processos e cores por estado</li>
            <li>nice/renice — prioridade de CPU para processos</li>
            <li>cgroups — limites de recursos por serviço (memória, CPU)</li>
            <li>strace — diagnóstico de processos travados (rastrear syscalls)</li>
            <li>lsof — quais arquivos e portas cada processo está usando</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Identificar processos</p>
              <CodeBlock code={`ps aux | grep ssh              # ver processo do SSH
ps aux --sort=-%mem | head -5  # top 5 por uso de memória
top                            # pressione 'q' para sair`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Controlar serviço nginx</p>
              <CodeBlock code={`sudo systemctl status nginx
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl enable --now nginx  # iniciar + habilitar no boot
systemctl is-active nginx          # confirmar`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Listar todos os serviços rodando</p>
              <CodeBlock code={`systemctl list-units --type=service --state=running
# Quantos serviços estão ativos no seu sistema?`} lang="bash" />
            </div>
          </div>
        </section>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 04
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
                ✅ Módulo 04 concluído! Próximo: Permissões e Usuários →
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/processos" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
