'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Award, Download, Share2, CheckCircle2, AlertCircle, Printer, Terminal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

export default function CertificatePage() {
  const [name, setName] = useState('');
  const { checklistPercentage, quizScore, unlockBadge } = useBadges();

  useEffect(() => {
    const savedName = localStorage.getItem('workshop-student-name');
    if (savedName) setName(savedName);
  }, []);

  const isReady = checklistPercentage >= 90 && quizScore >= 80;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    localStorage.setItem('workshop-student-name', val);
  };

  const generateHash = (name: string) => {
    const str = `${name}|${new Date().toLocaleDateString()}|workshop-linux-2026`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'WL' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  };

  const date = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  const certHash = generateHash(name || 'Estudante');

  const handlePrint = () => {
    unlockBadge('certificado');
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8 no-print">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Certificado</span>
      </div>

      <div className="text-center mb-12 no-print">
        <div className="section-label">Conquista Final</div>
        <h1 className="section-title">🎓 Certificado de Conclusão</h1>
        <p className="section-sub mx-auto">
          Parabéns pela jornada! Se você cumpriu os requisitos, preencha seu nome abaixo para gerar seu certificado.
        </p>
      </div>

      {!isReady ? (
        <div className="bg-bg-2 border border-border rounded-2xl p-12 text-center no-print">
          <div className="w-16 h-16 rounded-full bg-warn/10 flex items-center justify-center text-warn mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold mb-4">Requisitos Pendentes</h3>
          <p className="text-text-2 mb-8 max-w-md mx-auto">
            Para liberar o certificado, você precisa completar o laboratório e o quiz final.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-10">
            <div className={cn(
              "p-6 rounded-xl border text-left transition-all",
              checklistPercentage >= 90 ? "bg-ok/5 border-ok/30" : "bg-bg-3 border-border"
            )}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Laboratório</span>
                {checklistPercentage >= 90 ? <CheckCircle2 size={16} className="text-ok" /> : <Shield size={16} className="text-text-3" />}
              </div>
              <div className="text-2xl font-bold mb-1">{checklistPercentage}%</div>
              <p className="text-[10px] text-text-3">Mínimo necessário: 90%</p>
              <div className="mt-4 w-full h-1 bg-bg-2 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all", checklistPercentage >= 90 ? "bg-ok" : "bg-accent")} style={{ width: `${checklistPercentage}%` }} />
              </div>
            </div>

            <div className={cn(
              "p-6 rounded-xl border text-left transition-all",
              quizScore >= 80 ? "bg-ok/5 border-ok/30" : "bg-bg-3 border-border"
            )}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-3">Quiz Final</span>
                {quizScore >= 80 ? <CheckCircle2 size={16} className="text-ok" /> : <Award size={16} className="text-text-3" />}
              </div>
              <div className="text-2xl font-bold mb-1">{quizScore}%</div>
              <p className="text-[10px] text-text-3">Mínimo necessário: 80%</p>
              <div className="mt-4 w-full h-1 bg-bg-2 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all", quizScore >= 80 ? "bg-ok" : "bg-accent")} style={{ width: `${quizScore}%` }} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/topicos" className="btn-outline">Completar Tópicos</Link>
            <Link href="/quiz" className="btn-primary">Fazer o Quiz</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="max-w-md mx-auto space-y-4 no-print">
            <label className="block text-sm font-bold text-text-3 uppercase tracking-widest text-center">Seu Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={handleNameChange}
              placeholder="Digite como aparecerá no certificado"
              className="w-full bg-bg-2 border-2 border-border rounded-xl py-4 px-6 text-center text-xl font-bold focus:border-accent outline-none transition-all"
            />
          </div>

          <div className="flex justify-center gap-4 no-print">
            <button onClick={handlePrint} className="btn-primary px-8 py-3">
              <Printer size={18} />
              Imprimir / Salvar PDF
            </button>
            <button className="btn-outline px-8 py-3">
              <Share2 size={18} />
              Compartilhar
            </button>
          </div>

          {/* Certificate Design */}
          <div className="relative bg-white text-slate-900 p-12 md:p-20 rounded-sm shadow-2xl overflow-hidden border-[20px] border-slate-50 aspect-[1.414/1] flex flex-col items-center justify-between text-center group">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Shield size={600} className="rotate-12" />
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-40 h-40 border-t-[1px] border-l-[1px] border-slate-200 m-6" />
            <div className="absolute top-0 right-0 w-40 h-40 border-t-[1px] border-r-[1px] border-slate-200 m-6" />
            <div className="absolute bottom-0 left-0 w-40 h-40 border-b-[1px] border-l-[1px] border-slate-200 m-6" />
            <div className="absolute bottom-0 right-0 w-40 h-40 border-b-[1px] border-r-[1px] border-slate-200 m-6" />

            {/* Header */}
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg mb-2">
                  <Terminal size={32} />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Certificado Oficial</div>
                  <div className="text-xl font-bold tracking-tight text-slate-900 uppercase">Workshop Linux 2026</div>
                </div>
                <div className="h-0.5 w-32 bg-accent/20" />
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 space-y-10 py-8">
              <div className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Certificado de Conclusão</h2>
                <p className="text-slate-400 font-serif italic text-lg">Certificamos solenemente que</p>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-serif text-slate-900 tracking-tight px-8">
                  {name || 'Seu Nome Aqui'}
                </h1>
                <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              </div>

              <div className="max-w-2xl mx-auto text-slate-600 leading-relaxed text-lg">
                concluiu com distinção o treinamento intensivo <br />
                <strong className="text-slate-900 font-bold uppercase tracking-wide text-sm">Do Zero ao Firewall Profissional</strong>
                <p className="text-sm mt-4 text-slate-500">
                  Demonstrando proficiência avançada em infraestrutura de redes Linux, segurança com iptables, 
                  serviços DNS BIND9, Nginx com SSL/TLS e túneis VPN IPSec.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 w-full pt-12 border-t border-slate-100 grid grid-cols-3 gap-8 items-center">
              <div className="text-left space-y-1.5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Data de Emissão</div>
                <div className="text-sm font-bold text-slate-800">{date}</div>
              </div>

              <div className="flex justify-center">
                <div className="w-20 h-20 border-4 border-double border-slate-200 rounded-full flex items-center justify-center relative">
                  <Award size={40} className="text-slate-300" />
                  <div className="absolute -bottom-2 bg-white px-2 text-[8px] font-black uppercase tracking-tighter text-slate-400 border border-slate-100">Verificado</div>
                </div>
              </div>

              <div className="text-right space-y-1.5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Código de Autenticidade</div>
                <div className="text-[10px] font-mono font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 inline-block">{certHash}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
