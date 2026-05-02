'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, FileText, Shield, Eye, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'logs-lidos', text: 'Li logs com journalctl e tail -f, filtrei com grep e identifiquei erros no sistema' },
];

const JOURNALCTL = `journalctl -u nginx                        # logs do serviço nginx
journalctl -u ssh --since "1 hour ago"     # SSH na última hora
journalctl -f                              # seguir em tempo real (Ctrl+C para parar)
journalctl --since "2024-01-01" --until "2024-01-02"
journalctl -p err                          # apenas entradas de erro (emerg,alert,crit,err)
journalctl -p warning                      # erros + warnings
journalctl --no-pager | grep "Failed"      # buscar falhas`;

const VAR_LOG = `ls /var/log/                               # ver todos os logs disponíveis
tail -f /var/log/syslog                    # seguir log principal
tail -f /var/log/auth.log                  # logins SSH e sudo
grep "Invalid user" /var/log/auth.log      # tentativas de usuário inválido
grep "Accepted" /var/log/auth.log          # logins bem-sucedidos
grep -c "Failed password" /var/log/auth.log  # contar falhas de senha`;

const MONITORAR = `# watch — repetir comando periodicamente
watch -n 2 'ss -tlnp'           # monitorar portas abertas a cada 2s
watch -n 5 df -h                # monitorar espaço a cada 5s
watch -n 1 'systemctl status nginx | tail -5'  # status do nginx

# Filtrar log do nginx em tempo real
tail -f /var/log/nginx/access.log | grep "404"
tail -f /var/log/nginx/error.log`;

const NIVEIS = `# Níveis de severidade do syslog (do mais ao menos grave)
# 0 emerg   — sistema inutilizável
# 1 alert   — ação imediata necessária
# 2 crit    — condição crítica
# 3 err     — erro (journalctl -p err)
# 4 warning — aviso (journalctl -p warning)
# 5 notice  — condição normal mas significativa
# 6 info    — mensagem informativa
# 7 debug   — mensagem de depuração

# Filtrar por nível mínimo (mostra esse nível e acima = mais graves)
journalctl -p err      # erros, críticos, alertas, emergências
journalctl -p warning  # warnings + todos acima`;

export default function LogsBasicosPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/logs-basicos');
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
        <span className="text-text-2">Logs e Monitoramento</span>
      </div>

      <div className="section-label">Módulo 07 · Trilha Fundamentos</div>
      <h1 className="section-title">📋 Logs e Monitoramento</h1>
      <p className="section-sub">
        Logs são a memória do sistema — todo problema tem um rastro.{' '}
        <strong>journalctl</strong>, <strong>/var/log/</strong> e <strong>tail -f</strong> são
        as ferramentas que você vai usar diariamente para diagnosticar falhas em servidores reais.
      </p>

      <FluxoCard
        title="Fluxo: investigar um problema no servidor"
        steps={[
          { label: 'journalctl',   sub: 'logs do systemd',     icon: <FileText size={14} />, color: 'border-info/50' },
          { label: '/var/log/',    sub: 'logs tradicionais',   icon: <Eye size={14} />,      color: 'border-accent/50' },
          { label: 'grep / filter', sub: 'filtrar por padrão', icon: <Filter size={14} />,   color: 'border-warn/50' },
          { label: 'auth.log',     sub: 'segurança / SSH',     icon: <Shield size={14} />,   color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`Visualizador de Eventos (eventvwr.msc)
  → Logs do Windows: Sistema, Aplicativo,
    Segurança, Instalação
  → Filtrar por nível: Erro, Aviso, Info
  → Filtrar por origem e ID do evento
  → Exportar para .evtx ou .csv`}
        linuxCode={`journalctl -u nginx    # logs por serviço
journalctl -p err      # filtrar por nível
tail -f /var/log/syslog  # seguir em tempo real
grep "Failed" /var/log/auth.log
# Nível: emerg,alert,crit,err,warning,notice,info,debug`}
        windowsLabel="Windows — Visualizador de Eventos"
        linuxLabel="Linux — journalctl, /var/log, grep"
      />

      <div className="space-y-14">

        <section id="journalctl">
          <h2 className="text-2xl font-bold mb-2">journalctl — Logs do systemd</h2>
          <p className="text-text-2 text-sm mb-4">
            No Ubuntu/Debian moderno, todos os serviços systemd escrevem para o journal centralizado.
            <code> journalctl</code> é a interface principal — mais poderosa que ler arquivos de texto direto.
          </p>
          <CodeBlock code={JOURNALCTL} lang="bash" title="journalctl" />
        </section>

        <section id="niveis">
          <h2 className="text-2xl font-bold mb-2">Níveis de Severidade</h2>
          <p className="text-text-2 text-sm mb-4">
            Logs têm 8 níveis de gravidade. Em produção você foca em <code>err</code> e <code>warning</code>.
          </p>
          <CodeBlock code={NIVEIS} lang="bash" title="Níveis syslog" />
          <InfoBox className="mt-4" title="Diagnóstico rápido após incidente">
            <p className="text-sm text-text-2">
              Após qualquer problema, execute <code>journalctl -p err --since "1 hour ago"</code> para
              ver todos os erros da última hora. Se o servidor acabou de reiniciar:{' '}
              <code>journalctl -b -1 -p err</code> mostra os erros do boot anterior.
            </p>
          </InfoBox>
        </section>

        <section id="var-log">
          <h2 className="text-2xl font-bold mb-2">/var/log/ — Logs Tradicionais</h2>
          <p className="text-text-2 text-sm mb-4">
            Além do journal, muitos serviços ainda escrevem em <code>/var/log/</code>.
            O mais importante para segurança é <code>auth.log</code>.
          </p>
          <CodeBlock code={VAR_LOG} lang="bash" title="/var/log e auth.log" />
          <InfoBox className="mt-4" title="Conexão com o curso de Firewall">
            <p className="text-sm text-text-2">
              No módulo <strong>Audit Logs</strong> você vai correlacionar logs do iptables,
              SSH e Port Knocking para identificar ataques em andamento. A base é o que você
              aprende aqui com <code>grep</code> e <code>tail -f</code>.
            </p>
          </InfoBox>
        </section>

        <section id="monitorar">
          <h2 className="text-2xl font-bold mb-2">Monitorar em Tempo Real</h2>
          <CodeBlock code={MONITORAR} lang="bash" title="watch e tail -f" />
          <WarnBox className="mt-4" title="Logs crescem e enchem o disco">
            <p className="text-sm text-text-2">
              <code>/var/log</code> cresce continuamente. O serviço <code>logrotate</code> (já instalado
              no Ubuntu) rotaciona automaticamente, mas verifique periodicamente com{' '}
              <code>du -sh /var/log/* | sort -hr | head -5</code>.
            </p>
          </WarnBox>
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>logrotate — configuração de rotação automática para evitar disco cheio</li>
            <li>rsyslog centralizado — logs de múltiplos servidores em um lugar</li>
            <li>Elastic Stack (ELK) — análise e visualização avançada de logs</li>
            <li>alertas automáticos quando grep encontra padrão de erro</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Investigar erros recentes</p>
              <CodeBlock code={`journalctl -p err --since "24 hours ago"
journalctl -p warning --since "1 hour ago"
# Algum serviço reportou erros?`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Investigar tentativas de login</p>
              <CodeBlock code={`sudo grep "Invalid user" /var/log/auth.log | tail -10
sudo grep "Failed password" /var/log/auth.log | wc -l
# Quantas tentativas falhas de senha existem?`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Seguir logs do SSH em tempo real</p>
              <CodeBlock code={`# Em um terminal, siga o log:
tail -f /var/log/auth.log
# Em outro terminal, faça login SSH (mesmo servidor):
ssh localhost
# Veja a entrada de login aparecer em tempo real`} lang="bash" />
            </div>
          </div>
        </section>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 07
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
                ✅ Módulo 07 concluído! Próximo: Backup e Restauração →
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
            err: 'journalctl: No journal files were found',
            fix: 'Diretório do journal não existe ou sem permissão. Verificar: ls -la /var/log/journal. Criar: mkdir -p /var/log/journal && systemd-tmpfiles --create --prefix /var/log/journal. Reiniciar: systemctl restart systemd-journald.',
          },
          {
            err: 'tail -f /var/log/syslog — arquivo não existe no sistema',
            fix: 'Ubuntu/Debian modernos usam rsyslog + systemd-journald. Em sistemas só com journald, syslog pode não existir. Instalar rsyslog: apt install rsyslog. Alternativa nativa: journalctl -f (equivalente a tail -f para todos os serviços).',
          },
          {
            err: 'grep no log não encontra erros mesmo que o serviço esteja com problema',
            fix: 'Serviços modernos logam via journald, não em /var/log. Verificar: journalctl -u nome-servico --since "1 hour ago". Para buscar: journalctl | grep -i error. Alguns serviços têm log próprio: Nginx em /var/log/nginx/, Apache em /var/log/apache2/.',
          },
          {
            err: 'Log de autenticação vazio — /var/log/auth.log não tem entradas SSH',
            fix: 'rsyslog pode estar desabilitado ou o serviço SSH está logando via journald. Verificar: journalctl -u ssh --since today. Se auth.log existe mas vazio: systemctl status rsyslog. Reiniciar: systemctl restart rsyslog.',
          },
        ].map(({ err, fix }) => (
          <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
            <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
            <p className="text-sm text-text-2">✅ {fix}</p>
          </div>
        ))}
      </section>

      <ModuleNav currentPath="/logs-basicos" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
