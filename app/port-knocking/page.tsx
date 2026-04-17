'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Key, Lock, ArrowRight, Terminal, Shield, Zap, EyeOff, Unlock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { useBadges } from '@/context/BadgeContext';
import { Circle, CheckCircle2 } from 'lucide-react';

const KNOCKING_CHECKLIST = [
  { id: 'port-knocking', text: 'Port Knocking configurado e funcional' },
  { id: 'knocking-timeout', text: 'Timeout de 10s configurado no iptables' },
  { id: 'knocking-stealth', text: 'Porta 22 invisível no nmap' },
];

export default function PortKnockingPage() {
  const [activeDeepDive, setActiveDeepDive] = React.useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('port-knocking');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-port-knocking">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Port Knocking</span>
      </div>

      <div className="section-label">Tópico 12 · Segurança Avançada</div>
      <h1 className="section-title">🚪 Port Knocking</h1>
      <p className="section-sub">
        Segurança por obscuridade que funciona. Mantenha suas portas administrativas (como SSH)
        totalmente fechadas para o mundo, abrindo-as apenas para quem conhece a "batida secreta".
      </p>

      <FluxoCard
        title="Sequência de Batidas — Port Knocking"
        steps={[
          { label: 'Bate :1000', sub: 'iptables recent add FASE1', icon: <Lock className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'Bate :2000', sub: 'verifica lista FASE1', icon: <Key className="w-4 h-4" />, color: 'border-accent/50' },
          { label: 'Aguarda <30s', sub: 'janela de tempo', icon: <Shield className="w-4 h-4" />, color: 'border-[var(--color-layer-5)]' },
          { label: 'SSH Aberto!', sub: 'porta 22 liberada', icon: <Unlock className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: How it works */}
          <section id="conceito">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. O Conceito da Batida</h2>
            </div>
            
            <p className="text-text-2 mb-8 leading-relaxed">
              Diferente de serviços tradicionais de Port Knocking (como o <code>knockd</code>), aqui usamos apenas o módulo <strong>recent</strong> do iptables. Isso é mais performático e não requer processos extras rodando.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { t: 'Estado Inicial', d: 'Porta 22 está fechada (DROP).', i: <EyeOff size={18} /> },
                { t: 'Bata na Porta 1', d: 'O IP entra na lista "FASE1"', i: '✊' },
                { t: 'Bata na Porta 2', d: 'Se estiver na "FASE1", vai para "FASE2"', i: '✊' },
                { t: 'Porta SSH Abre', d: 'Se estiver na "FASE2", o SSH é liberado', i: '🔓' }
              ].map((step, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-bg-2 border border-border text-center relative">
                  <div className="text-2xl mb-3 flex justify-center text-accent">{step.i}</div>
                  <h4 className="font-bold text-sm mb-2">{step.t}</h4>
                  <p className="text-[10px] text-text-3 leading-relaxed">{step.d}</p>
                  {idx < 3 && <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border" size={20} />}
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Implementation */}
          <section id="implementacao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Implementação com iptables</h2>
            </div>

            <div className="space-y-6">
              <CodeBlock 
                title="Passo 1: A primeira batida (Porta 1000)"
                code={`iptables -A INPUT -p tcp --dport 1000 -m recent --set --name FASE1 -j DROP`} 
                lang="bash" 
              />
              
              <CodeBlock 
                title="Passo 2: A segunda batida (Porta 2000)"
                code={`iptables -A INPUT -p tcp --dport 2000 -m recent --rcheck --name FASE1 -m recent --set --name FASE2 -j DROP`} 
                lang="bash" 
              />

              <CodeBlock 
                title="Passo 3: Liberar SSH (Porta 22)"
                code={`iptables -A INPUT -p tcp --dport 22 -m recent --rcheck --name FASE2 -j ACCEPT`} 
                lang="bash" 
              />
            </div>
          </section>

          {/* Section 3: Security */}
          <section id="seguranca">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Por que isso é seguro?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <HighlightBox title="Invisibilidade">
                <p className="text-xs text-text-2">
                  Um port scan (nmap) verá a porta 22 como <code>filtered</code> ou <code>closed</code>. Não há como saber que ela pode ser aberta.
                </p>
              </HighlightBox>
              <HighlightBox title="Timeout Automático">
                <p className="text-xs text-text-2">
                  Podemos configurar para que a "permissão" expire em segundos, exigindo uma nova batida para novas conexões.
                </p>
              </HighlightBox>
            </div>

            <HighlightBox title="💡 Pulo do Gato">
              <p className="text-sm text-text-2">
                Use <strong>--seconds 30 --reap</strong> nas regras de timeout.
                O <code className="text-xs">--reap</code> remove automaticamente entradas expiradas da lista <code className="text-xs">recent</code> no kernel.
                Sem ele, a lista cresce indefinidamente na memória até o próximo reboot — potencial vetor de DoS em produção.
              </p>
            </HighlightBox>
          </section>

          {/* Section 4: Erros Comuns */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Erros Comuns</h2>
            </div>

            <WarnBox title="⚠️ Problemas frequentes com Port Knocking">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>Knock correto mas SSH não abre</strong> → pacotes enviados muito rápido (sem delay entre portas)
                  → aguardar 200-500ms entre cada porta: <code className="text-xs">nmap -p 1000 IP; sleep 0.5; nmap -p 2000 IP; sleep 0.5; ssh user@IP</code>
                </li>
                <li>
                  <strong>Porta abre mas fecha imediatamente</strong> → <code className="text-xs">--seconds</code> muito curto
                  → aumentar para 30s: <code className="text-xs">-m recent --rcheck --seconds 30 --name FASE2</code>
                </li>
                <li>
                  <strong>iptables: No chain/target/match by that name</strong> → módulo <code className="text-xs">recent</code> não carregado
                  → <code className="text-xs">modprobe xt_recent</code> e adicionar ao <code className="text-xs">/etc/modules</code>
                </li>
                <li>
                  <strong>Sessão SSH cai após o timeout do knocking</strong> → regra ESTABLISHED ausente
                  → adicionar <strong>antes</strong> do knocking: <code className="text-xs">iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT</code>
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Knocking Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist Knocking
            </h3>
            <div className="space-y-3">
              {KNOCKING_CHECKLIST.map(item => (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-start gap-3 text-left group"
                >
                  {checklist[item.id] ? (
                    <CheckCircle2 size={14} className="text-ok shrink-0 mt-0.5" />
                  ) : (
                    <Circle size={14} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                  )}
                  <span className={cn(
                    "text-[10px] leading-tight transition-colors",
                    checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                  )}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              Comando para "Bater"
            </h3>
            <p className="text-[10px] text-text-3 mb-4">Use o nmap ou telnet para enviar os pacotes:</p>
            <CodeBlock code={`nmap -p 1000 IP-FIREWALL\nnmap -p 2000 IP-FIREWALL\nssh user@IP-FIREWALL`} lang="bash" />
          </div>

          <WarnBox title="Dica de Ouro">
            <p className="text-xs text-text-2 leading-relaxed">
              Sempre use a regra <strong>ESTABLISHED</strong> antes do Port Knocking. Assim, uma vez que você logou no SSH, sua conexão não cairá mesmo que o "ticket" do knocking expire.
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Veja como o módulo <code>recent</code> gerencia as listas de IPs no diretório <code>/proc/net/xt_recent/</code>.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'knocking-vs-stateful') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Knocking vs Stateful</span>
              </div>
              <ArrowRight size={12} className="text-text-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>

      <DeepDiveModal 
        dive={activeDeepDive} 
        onClose={() => setActiveDeepDive(null)} 
      />
    </div>
  );
}
