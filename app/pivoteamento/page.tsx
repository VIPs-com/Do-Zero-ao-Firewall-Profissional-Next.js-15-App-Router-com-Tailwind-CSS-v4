'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, Zap, Terminal, Info, AlertTriangle, ArrowRightLeft, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

export default function PivotingPage() {
  const { trackPageVisit, unlockBadge } = useBadges();

  React.useEffect(() => {
    trackPageVisit('pivoteamento');
    unlockBadge('pivoting-master');
  }, [trackPageVisit, unlockBadge]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-pivoteamento">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Pivoteamento DMZ → LAN</span>
      </div>

      <div className="section-label text-err">Conteúdo Avançado</div>
      <h1 className="section-title flex items-center gap-3">
        <Skull className="text-err" size={32} />
        Pivoteamento: O Perigo da DMZ
      </h1>
      <p className="section-sub">
        O que acontece se o seu Web Server for invadido? Se as regras de firewall não forem restritivas, 
        o invasor usará o servidor comprometido como "ponte" (pivô) para atacar a sua rede interna (LAN).
      </p>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="space-y-16">
          {/* Cenário de Ataque */}
          <section id="cenario">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-err/10 flex items-center justify-center text-err">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">O Vetor de Ataque</h2>
            </div>
            
            <div className="bg-bg-2 border border-border rounded-xl p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 text-sm font-mono">
                  <div className="px-3 py-1 rounded bg-bg-3 border border-border text-text-3">Atacante</div>
                  <ArrowRightLeft size={16} className="text-err" />
                  <div className="px-3 py-1 rounded bg-err/10 border border-err/30 text-err">Web Server (Comprometido)</div>
                  <ArrowRightLeft size={16} className="text-err" />
                  <div className="px-3 py-1 rounded bg-info/10 border border-info/30 text-info">Cliente LAN</div>
                </div>
                
                <p className="text-text-2 leading-relaxed">
                  Uma vez que o atacante ganha um shell no Nginx (ex: via vulnerabilidade na aplicação PHP), 
                  ele não quer apenas os dados do site. Ele quer o <strong>Active Directory</strong> ou as 
                  <strong>estações de trabalho</strong> na LAN.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-bg-3 border border-border">
                    <h4 className="font-bold text-xs uppercase text-text-3 mb-2">Ação do Invasor</h4>
                    <ul className="text-xs text-text-2 space-y-2">
                      <li>• Scan de rede interna (nmap)</li>
                      <li>• Exploração de SMB/RDP na LAN</li>
                      <li>• Exfiltração de dados via túnel</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-3 border border-border">
                    <h4 className="font-bold text-xs uppercase text-text-3 mb-2">Falha no Firewall</h4>
                    <ul className="text-xs text-text-2 space-y-2">
                      <li>• FORWARD DMZ → LAN permitido</li>
                      <li>• Falta de inspeção de estado</li>
                      <li>• DNS recursivo aberto na DMZ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabela Ataque x Defesa */}
          <section id="ataque-defesa">
            <h2 className="text-2xl font-bold mb-8">Ataque × Defesa</h2>
            <div className="bg-bg-2 border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-3 border-b border-border">
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-err">Técnica de Ataque</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-widest text-ok">Mitigação (Firewall)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 align-top">
                      <div className="font-bold text-sm mb-1">Lateral Movement</div>
                      <p className="text-xs text-text-3">Tentar SSH/RDP do Web Server para a LAN.</p>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-sm mb-1">Default DROP no FORWARD</div>
                      <p className="text-xs text-text-3">Bloquear explicitamente qualquer tráfego que inicie na DMZ com destino à LAN.</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 align-top">
                      <div className="font-bold text-sm mb-1">Reverse Shell</div>
                      <p className="text-xs text-text-3">O servidor comprometido inicia conexão para fora.</p>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-sm mb-1">Egress Filtering</div>
                      <p className="text-xs text-text-3">Limitar quais portas o servidor DMZ pode usar para acessar a internet.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Comandos Práticos */}
          <section id="mitigacao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-bold">Configuração de Segurança Máxima</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-text-2">
                Para evitar o pivoteamento, aplique estas regras no seu script de firewall. 
                A regra de ouro é: <strong>A DMZ nunca inicia conexões, ela apenas responde.</strong>
              </p>

              <div className="code-block">
                <div className="code-header">
                  <div className="code-title">Mitigação de Pivoteamento no iptables</div>
                  <div className="code-lang">iptables</div>
                </div>
                <pre>
                  <span className="text-text-3"># 1. Bloquear QUALQUER início de conexão da DMZ para a LAN</span>{'\n'}
                  <span className="text-err">iptables -A FORWARD -s 192.168.56.0/24 -d 192.168.57.0/24 -m state --state NEW -j DROP</span>{'\n\n'}
                  
                  <span className="text-text-3"># 2. Permitir apenas que a LAN acesse a DMZ (e as respostas voltem)</span>{'\n'}
                  <span className="text-ok">iptables -A FORWARD -s 192.168.57.0/24 -d 192.168.56.0/24 -j ACCEPT</span>{'\n'}
                  <span className="text-ok">iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT</span>{'\n\n'}
                  
                  <span className="text-text-3"># 3. Limitar saída da DMZ para a Internet (apenas atualizações)</span>{'\n'}
                  <span className="text-accent-2">iptables -A FORWARD -s 192.168.56.0/24 -p tcp --dport 80 -j ACCEPT</span>{'\n'}
                  <span className="text-accent-2">iptables -A FORWARD -s 192.168.56.0/24 -p tcp --dport 443 -j ACCEPT</span>{'\n'}
                  <span className="text-err">iptables -A FORWARD -s 192.168.56.0/24 -j DROP</span>
                </pre>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              Desafio Prático
            </h3>
            <p className="text-xs text-text-2 leading-relaxed mb-6">
              Tente dar um <code>ping</code> do seu Web Server para o Cliente LAN. 
              Se as regras acima estiverem ativas, o ping deve falhar, mas o acesso do Cliente ao Site deve continuar funcionando.
            </p>
            <div className="p-4 rounded-lg bg-bg-3 border border-border font-mono text-[10px] text-text-3">
              web$ ping 192.168.57.50{'\n'}
              <span className="text-err">Destination Port Unreachable</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h4 className="font-bold text-sm text-accent-2 mb-2 flex items-center gap-2">
              <Info size={16} />
              Conceito Chave
            </h4>
            <p className="text-xs text-text-2 leading-relaxed">
              Em redes profissionais, a DMZ é considerada uma "zona de sacrifício". 
              Assumimos que ela será invadida e focamos em garantir que o invasor 
              fique preso nela.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
