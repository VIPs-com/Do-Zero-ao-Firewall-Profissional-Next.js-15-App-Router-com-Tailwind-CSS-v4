'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Shield, Zap, Terminal, RefreshCw, CheckCircle2, Save, Power, BookOpen, ArrowRight, Circle, Activity, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { useBadges } from '@/context/BadgeContext';

const FIREWALL_CHECKLIST = [
  { id: 'lan-internet', text: 'Rede LAN pode sair para Internet' },
  { id: 'lan-dmz', text: 'Rede LAN pode acessar DNS e WEB na DMZ' },
  { id: 'lan-ping', text: 'Rede LAN pode pingar na Internet e na DMZ' },
  { id: 'dmz-internet', text: 'DMZ pode sair para Internet (DNS/HTTP/HTTPS)' },
  { id: 'web-lan', text: 'WEB pode ser acessado pela Rede LAN' },
  { id: 'web-internet', text: 'WEB pode ser acessado pela Internet' },
  { id: 'firewall-ping', text: 'FIREWALL pode ser pingado pela Rede LAN e DMZ' },
  { id: 'firewall-ssh', text: 'FIREWALL pode ser acessado via SSH (LAN/DMZ/Internet*)' },
];

export default function WanNatPage() {
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('wan-nat');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">WAN, NAT & ESTABLISHED</span>
      </div>

      <div className="section-label">Tópico 02 · Camada 3</div>
      <h1 className="section-title">🌐 WAN, NAT & ESTABLISHED</h1>
      <p className="section-sub">
        O problema fundamental: endereços IPv4 acabaram. A solução foi criar dois mundos separados —
        IPs públicos (únicos na internet) e IPs privados (repetidos em todo lugar). O Firewall fica
        na fronteira entre esses dois mundos.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: WAN & NAT */}
          <section id="wan-nat">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Como o tráfego chega ao Firewall?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-bg-2 border border-border">
                <div className="text-2xl mb-3">🌍</div>
                <h4 className="font-bold text-sm mb-2">IP Público</h4>
                <p className="text-xs text-text-3 leading-relaxed">
                  Endereço globalmente roteável. Seu Firewall tem um na interface WAN. É o "endereço do prédio".
                </p>
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border">
                <div className="text-2xl mb-3">🏠</div>
                <h4 className="font-bold text-sm mb-2">IP Privado</h4>
                <p className="text-xs text-text-3 leading-relaxed">
                  Endereços que podem se repetir em redes diferentes. Usados nas zonas LAN e DMZ.
                </p>
              </div>
            </div>

            <HighlightBox title="Analogia do Prédio">
              <p className="text-sm text-text-2">
                Cada apartamento tem um número interno (192.168.x.x).
                Para receber correspondência do mundo externo, todos usam o endereço do prédio (IP público).
                O porteiro (NAT) sabe para qual apartamento entregar cada correspondência.
              </p>
            </HighlightBox>
          </section>

          {/* Section 2: SNAT */}
          <section id="snat">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <RefreshCw size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. SNAT (Source NAT)</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              SNAT troca o IP de <strong>origem</strong> dos pacotes. Quando um cliente interno quer acessar a internet, o Firewall substitui o IP privado pelo IP público.
            </p>

            <FluxoCard 
              title="Fluxo de Saída (SNAT)"
              steps={[
                { label: "Cliente LAN", sub: "192.168.57.50", icon: <Terminal size={16} /> },
                { label: "Firewall (POSTROUTING)", sub: "Troca IP Origem", icon: <Shield size={16} /> },
                { label: "Internet", sub: "200.150.x.x", icon: <Globe size={16} /> }
              ]}
            />

            <div className="bg-bg-3 border border-border rounded-xl p-6 font-mono text-xs space-y-4 mb-8">
              <div className="pb-4 border-b border-border/50">
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📦 Pacote saindo da LAN</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span className="text-err">192.168.57.50 (Privado)</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span>8.8.8.8 (Google)</span>
                </div>
              </div>
              <div className="text-center text-accent py-1">↓ Firewall aplica SNAT ↓</div>
              <div>
                <div className="text-text-3 uppercase tracking-widest text-[10px] mb-2">📦 Pacote saindo pela WAN</div>
                <div className="flex justify-between">
                  <span className="text-text-2">Origem:</span>
                  <span className="text-ok">IP-PUBLICO (Roteável)</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-text-2">Destino:</span>
                  <span>8.8.8.8 (Google)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CodeBlock 
                title="SNAT — Use quando o IP Público é Fixo"
                code="iptables -t nat -A POSTROUTING -s 192.168.57.0/24 -o eth0 -j SNAT --to-source IP-PUBLICO" 
                lang="bash" 
              />
              <CodeBlock 
                title="MASQUERADE — Use quando o IP Público é Dinâmico"
                code="iptables -t nat -A POSTROUTING -s 192.168.57.0/24 -o eth0 -j MASQUERADE" 
                lang="bash" 
              />
            </div>
          </section>

          {/* Section 3: ESTABLISHED */}
          <section id="established">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Zap size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. A Regra ESTABLISHED</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              A resposta volta porque o kernel mantém um "caderno" de cada conexão ativa — a tabela de <strong>conntrack</strong> (Connection Tracking).
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <InfoBox title="O que é o Conntrack?">
                <p className="text-xs text-text-3 leading-relaxed">
                  É um módulo do kernel que monitora o estado das conexões. Ele sabe que se você enviou um pacote para o Google, o pacote que volta do Google é uma resposta legítima e deve ser aceito.
                </p>
              </InfoBox>
              <HighlightBox title="Por que usar?">
                <p className="text-xs text-text-2 leading-relaxed">
                  Sem essa regra, você teria que abrir manualmente todas as portas de volta da internet, o que tornaria o firewall inseguro e impossível de gerenciar.
                </p>
              </HighlightBox>
            </div>

            <div className="bg-bg-2 border border-border rounded-xl overflow-hidden mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-bg-3 border-b border-border text-[10px] uppercase font-bold text-text-3">
                  <tr>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Significado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-accent">NEW</td>
                    <td className="px-6 py-4 text-text-2">Primeiro pacote (SYN). Avalia regras de ACCEPT/DROP.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-ok">ESTABLISHED</td>
                    <td className="px-6 py-4 text-text-2">Conexão confirmada. Passa automaticamente.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono text-xs text-info">RELATED</td>
                    <td className="px-6 py-4 text-text-2">Nova conexão relacionada a uma existente (ex: FTP).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock 
              title="A regra mais importante do firewall"
              code={`iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT\niptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT`} 
              lang="bash" 
            />
          </section>

          {/* Section 4: Persistence & Automation */}
          <section id="persistence">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Save size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Persistência e Automação</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              Regras de iptables são voláteis. Se o servidor reiniciar, elas desaparecem. 
              Em um ambiente profissional, usamos scripts e serviços do systemd para garantir que o firewall suba com o sistema.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <CodeBlock 
                title="1. Salvar Regras"
                code="iptables-save > /etc/firewall/regras.ipt" 
                lang="bash" 
              />
              <CodeBlock 
                title="2. Restaurar Regras"
                code="iptables-restore < /etc/firewall/regras.ipt" 
                lang="bash" 
              />
            </div>

            <InfoBox title="Firewall como Serviço (systemd)">
              <p className="text-xs text-text-3 mb-4 leading-relaxed">
                Crie o arquivo <code>/etc/systemd/system/firewall.service</code> para automatizar o processo.
              </p>
              <CodeBlock 
                title="firewall.service"
                code={`[Unit]\nDescription=Firewall Service\nAfter=network-online.target\n\n[Service]\nType=oneshot\nRemainAfterExit=yes\nExecStart=/usr/local/bin/start-firewall\nExecStop=/usr/local/bin/stop-firewall\n\n[Install]\nWantedBy=multi-user.target`} 
                lang="ini" 
              />
            </InfoBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Professional Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist de Segurança
            </h3>
            <div className="space-y-3">
              {FIREWALL_CHECKLIST.map(item => (
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
              Comandos de Auditoria
            </h3>
            <div className="space-y-4">
              <CodeBlock code="iptables -nL --line-numbers" lang="bash" />
              <CodeBlock code="iptables -nvL -t filter" lang="bash" />
              <CodeBlock code="conntrack -L" lang="bash" />
            </div>
          </div>

          <WarnBox title="Persistência do Roteamento">
            <p className="text-[10px] text-text-2 leading-relaxed">
              O comando <code>sysctl -w net.ipv4.ip_forward=1</code> é temporário. 
              Para tornar permanente, edite <code>/etc/sysctl.conf</code> e descomente a linha correspondente.
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Entenda a diferença entre o Port Knocking (que abre a porta) e o ESTABLISHED (que te mantém dentro).
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'knocking-vs-stateful') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Port Knocking vs Stateful</span>
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
