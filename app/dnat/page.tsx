'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Target, ArrowRight, Shield, Terminal, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { useBadges } from '@/context/BadgeContext';
import { Circle, CheckCircle2 } from 'lucide-react';

const DNAT_CHECKLIST = [
  { id: 'dnat-web', text: 'DNAT para Web Server (Porta 443)' },
  { id: 'dnat-ssh', text: 'DNAT para SSH da DMZ (Porta 2222)' },
  { id: 'forward-web', text: 'Regra FORWARD para Web Server liberada' },
  { id: 'forward-ssh', text: 'Regra FORWARD para SSH da DMZ liberada' },
];

export default function DnatPage() {
  const [activeDeepDive, setActiveDeepDive] = React.useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('dnat');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-dnat">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">DNAT & PREROUTING</span>
      </div>

      <div className="section-label">Tópico 11 · Camada 3</div>
      <h1 className="section-title">🎯 DNAT & PREROUTING</h1>
      <p className="section-sub">
        DNAT (Destination NAT) permite que alguém de fora da rede acesse um servidor que está
        dentro da DMZ. O Firewall recebe o pacote e troca o IP de destino.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: How it works */}
          <section id="acesso-externo">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Acesso Externo via DNAT</h2>
            </div>
            
            <div className="bg-bg-3 border border-border rounded-xl p-6 font-mono text-xs space-y-4 mb-8">
              <div className="pb-4 border-b border-border/50">
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📥 Pacote chegando na WAN</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span>USUARIO-EXTERNO</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span className="text-err">192.168.20.200:443</span>
                </div>
              </div>
              <div className="text-center text-accent py-1">↓ PREROUTING aplica DNAT ↓</div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📤 Pacote indo para a DMZ</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span>USUARIO-EXTERNO</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span className="text-ok">192.168.56.120:443</span>
                </div>
              </div>
            </div>

            <HighlightBox title="Analogia do Prédio">
              <p className="text-sm text-text-2">
                🎯 <strong>DNAT</strong> = recepcionista que redireciona o visitante: "vai para a sala 120"<br />
                🚪 <strong>FORWARD</strong> = segurança no corredor que verifica se pode entrar: "tem autorização?"
              </p>
            </HighlightBox>
          </section>

          {/* Section 2: PREROUTING */}
          <section id="prerouting">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <ArrowRight size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Por que PREROUTING?</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              O PREROUTING intercepta o pacote <strong>antes</strong> do kernel decidir para onde rotear. Se o IP fosse trocado depois, o kernel já teria decidido enviar o pacote para o próprio Firewall (INPUT) em vez de encaminhá-lo (FORWARD).
            </p>

            <CodeBlock 
              title="Regra DNAT no iptables"
              code="iptables -t nat -A PREROUTING -p tcp -d 192.168.20.200 --dport 443 -j DNAT --to 192.168.56.120:443" 
              lang="bash" 
            />
          </section>

          {/* Section 3: FORWARD */}
          <section id="forward">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. FORWARD Obrigatório</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              Essa é a dúvida que mais trava iniciantes. O DNAT apenas troca o IP. Você ainda precisa de uma regra na tabela filter para <strong>autorizar</strong> a passagem do pacote.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-ok">
                <h4 className="font-bold text-ok mb-3">✅ Regra Correta</h4>
                <div className="mb-4">
                  <CodeBlock code="iptables -A FORWARD -p tcp -d 192.168.56.120 --dport 443 -j ACCEPT" lang="bash" />
                </div>
                <p className="text-[10px] text-text-3">Usa o IP <strong>após o DNAT</strong> (192.168.56.120).</p>
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-err">
                <h4 className="font-bold text-err mb-3">❌ Erro Comum</h4>
                <div className="mb-4">
                  <CodeBlock code="iptables -A FORWARD -p tcp -d 192.168.20.200 --dport 443 -j ACCEPT" lang="bash" />
                </div>
                <p className="text-[10px] text-text-3">Usa o IP <strong>antes do DNAT</strong> (192.168.20.200). Nunca combina.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* DNAT Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist DNAT
            </h3>
            <div className="space-y-3">
              {DNAT_CHECKLIST.map(item => (
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
              <Terminal size={16} className="text-accent" />
              Diagnóstico
            </h3>
            <div className="space-y-4">
              <CodeBlock title="Ver contadores DNAT" code="iptables -t nat -L -n -v" lang="bash" />
              <CodeBlock title="Ver autorizações" code="iptables -L FORWARD -n -v" lang="bash" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-err/5 border border-err/20">
            <h4 className="font-bold text-sm text-err mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              Risco de Pivoteamento
            </h4>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Ao abrir portas para o mundo, você cria um ponto de entrada. Se o servidor for invadido, ele pode ser usado para atacar a LAN.
            </p>
            <Link href="/pivoteamento" className="text-[10px] font-bold text-err hover:underline flex items-center gap-1 uppercase tracking-wider">
              Saiba como se proteger
              <ChevronRight size={10} />
            </Link>
          </div>

          <WarnBox title="Hairpin NAT">
            <p className="text-xs text-text-2 leading-relaxed">
              Se você tentar acessar o IP público de dentro da LAN e não funcionar, você precisa do Hairpin NAT (Loopback NAT).
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Entenda por que o DNAT precisa ser no PREROUTING e como o kernel processa cada pacote.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'kernel-hooks') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Hooks do Kernel</span>
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
