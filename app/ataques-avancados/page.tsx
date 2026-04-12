'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ShieldAlert, Zap, Terminal, Info, AlertTriangle, ShieldCheck, Bug, Clock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

export default function AdvancedAttacksPage() {
  const { trackPageVisit } = useBadges();

  React.useEffect(() => {
    trackPageVisit('ataques-avancados');
  }, [trackPageVisit]);

  const attacks = [
    {
      id: 'fragmentation',
      title: 'Fragmentação de Pacotes',
      icon: <Bug className="text-err" />,
      concept: 'Dividir um pacote malicioso em fragmentos tão pequenos que o IDS/Firewall não consegue remontar para analisar a assinatura, mas o destino final sim.',
      mitigation: 'Configurar o kernel para remontar pacotes antes da inspeção (net.ipv4.ip_always_defrag) ou usar firewalls stateful modernos.',
      code: '# No Linux, o conntrack já lida com isso automaticamente\n# mas você pode forçar a remontagem se necessário.'
    },
    {
      id: 'timing',
      title: 'Timing Attack no Port Knocking',
      icon: <Clock className="text-warn" />,
      concept: 'Analisar o tempo que o firewall leva para processar pacotes. Se uma porta "fechada" responde mais rápido que uma "batida válida", o atacante descobre a sequência.',
      mitigation: 'Adicionar um "delay" randômico ou garantir que o tempo de processamento seja constante (Constant Time) para todas as tentativas.',
      code: '# Use o módulo "recent" com cautela\niptables -A INPUT -m recent --update --seconds 1 ...'
    },
    {
      id: 'dns-rebinding',
      title: 'DNS Rebinding',
      icon: <Globe className="text-accent" />,
      concept: 'Um site malicioso responde com um TTL de 1 segundo. Na primeira consulta, aponta para o IP do atacante. Na segunda, aponta para 127.0.0.1 ou um IP da LAN.',
      mitigation: 'O navegador do usuário agora ataca a rede interna. Mitigação: Validar o "Host" header no Proxy/Web Server e usar DNS Pinning.',
      code: '# No Squid, force a verificação do Host\nhttp_access deny !allowed_hosts'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-ataques-avancados">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Ataques Avançados</span>
      </div>

      <div className="section-label">Nível Profissional</div>
      <h1 className="section-title">Ataques Avançados na Topologia</h1>
      <p className="section-sub">
        Para ser um profissional de segurança, você precisa pensar como um atacante. 
        Entenda como burlar proteções básicas e como implementar defesas robustas.
      </p>

      <div className="grid grid-cols-1 gap-12 mt-12">
        {attacks.map((attack, idx) => (
          <motion.section 
            key={attack.id}
            id={attack.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-bg-2 border border-border rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="p-6 md:p-8 border-b border-border bg-bg-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg-2 border border-border flex items-center justify-center shadow-inner">
                {attack.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{attack.title}</h2>
                <div className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Vulnerabilidade & Mitigação</div>
              </div>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-accent mb-2 flex items-center gap-2">
                    <Info size={16} />
                    O Conceito
                  </h3>
                  <p className="text-text-2 text-sm leading-relaxed">
                    {attack.concept}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-ok/5 border border-ok/20">
                  <h3 className="text-sm font-bold text-ok mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Como Mitigar
                  </h3>
                  <p className="text-text-2 text-xs leading-relaxed">
                    {attack.mitigation}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={14} />
                    Referência Técnica
                  </h3>
                </div>
                <div className="relative group">
                  <pre className="p-4 bg-bg-3 rounded-lg border border-border text-[11px] font-mono text-accent-2 overflow-x-auto">
                    <code>{attack.code}</code>
                  </pre>
                </div>
                <div className="p-4 rounded-lg bg-warn/5 border border-warn/20 flex gap-3">
                  <AlertTriangle size={18} className="text-warn shrink-0" />
                  <p className="text-[10px] text-text-2 leading-tight">
                    <strong>Atenção:</strong> Estes ataques exploram comportamentos padrão de protocolos. 
                    A defesa exige inspeção profunda de pacotes (DPI) ou configurações rígidas de kernel.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-accent/5 border border-accent/20 text-center">
        <Zap className="text-accent mx-auto mb-4" size={32} />
        <h3 className="text-xl font-bold mb-2">Pronto para o Próximo Nível?</h3>
        <p className="text-text-2 text-sm max-w-2xl mx-auto mb-8">
          Agora que você entende os ataques, que tal testar seus conhecimentos no Quiz Final ou revisar a Cheat Sheet de comandos?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/quiz" className="btn-primary px-8 py-3">Ir para o Quiz</Link>
          <Link href="/cheat-sheet" className="btn-secondary px-8 py-3">Ver Cheat Sheet</Link>
        </div>
      </div>
    </div>
  );
}
