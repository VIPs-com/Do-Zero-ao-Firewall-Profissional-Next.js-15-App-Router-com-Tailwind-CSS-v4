'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Laptop, Shield, Globe, Terminal, Lock, ArrowRight, ChevronRight, AlertTriangle, BookOpen, Filter, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';

import { useBadges } from '@/context/BadgeContext';
import { Circle, CheckCircle2 } from 'lucide-react';

const PROXY_CHECKLIST = [
  { id: 'proxy-funciona', text: 'Squid Proxy resolve e navega na internet' },
  { id: 'proxy-bloqueio', text: 'Bloqueio de domínios (negados.txt) funcional' },
  { id: 'proxy-log', text: 'Logs de acesso visíveis em /var/log/squid/access.log' },
];

export default function LanProxyPage() {
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('lan-proxy');
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
        <span className="text-text-2">LAN, DNS & Proxy</span>
      </div>

      <div className="section-label">Tópico 01 · Camadas 3, 4 e 7</div>
      <h1 className="section-title">💻 LAN, DNS & Proxy</h1>
      <p className="section-sub">
        O cliente da LAN não acessa a internet diretamente — tudo passa pelo Firewall.
        Para acessar o Web Server interno, o cliente precisa primeiro resolver o nome via DNS,
        depois abrir a conexão HTTPS. Para navegar na internet, o navegador usa o Squid Proxy.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: DNS Access */}
          <section id="cliente-lan">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Globe size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Acessando o DNS (porta UDP 53)</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-text-2 leading-relaxed">
                O cliente não acessa o DNS "manualmente" — ele é usado automaticamente toda vez que você digita um nome no navegador ou terminal.
              </p>

              <div className="bg-bg-2 border border-border rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  {[
                    'Navegador recebe o nome www.dominio.local',
                    'Sistema pergunta ao DNS configurado: DNS-SERVER:53',
                    'Pacote UDP 53 atravessa o Firewall via regra FORWARD',
                    'BIND9 responde com o IP: www → WEB-SERVER',
                    'Resposta volta via ESTABLISHED — sem precisar de nova regra'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                      <p className="text-sm text-text-2">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <CodeBlock 
                  title="Resolução automática"
                  code="nslookup www.dominio.local" 
                  lang="bash" 
                />
                <CodeBlock 
                  title="Forçar servidor DNS"
                  code="dig @DNS-SERVER www.dominio.local" 
                  lang="bash" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: Fluxo Squid */}
          <section id="fluxo-squid">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Filter size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Fluxo completo via Squid</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              O Squid é o intermediário total — recebe o pedido, verifica as ACLs, busca na internet e entrega ao cliente.
            </p>

            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border mb-8">
              {[
                { t: 'Conexão TCP', d: 'Navegador abre TCP para FIREWALL-LAN:3128', l: 'L4' },
                { t: 'Avaliação de ACLs', d: 'Squid lê a URL e consulta as regras do squid.conf', l: 'L7' },
                { t: 'Resolução DNS', d: 'Squid resolve o nome de destino usando o DNS local', l: 'L7' },
                { t: 'Saída via SNAT', d: 'O IP privado do Firewall vira o IP público na WAN', l: 'L3' }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[29px] top-1 w-6 h-6 rounded-full bg-bg-2 border-2 border-accent flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 flex items-center gap-3">
                    {step.t}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg-3 border border-border text-text-3">{step.l}</span>
                  </h4>
                  <p className="text-xs text-text-3">{step.d}</p>
                </div>
              ))}
            </div>

            <HighlightBox title="Proxy Transparente vs Autenticado">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-xs mb-1">Transparente</h5>
                  <p className="text-[10px] text-text-3">O usuário não sabe que está usando um proxy. O Firewall redireciona a porta 80 para a 3128 via iptables.</p>
                </div>
                <div>
                  <h5 className="font-bold text-xs mb-1">Autenticado</h5>
                  <p className="text-[10px] text-text-3">O navegador solicita usuário e senha. Permite criar regras baseadas em grupos (ex: Diretoria vs RH).</p>
                </div>
              </div>
            </HighlightBox>
          </section>

          {/* Section 3: ACLs */}
          <section id="dstdomain">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configuração do Squid (ACLs)</h2>
            </div>
            
            <div className="space-y-8">
              <CodeBlock 
                title="/etc/squid/squid.conf (Trecho Principal)"
                code={`# Definição das Redes Locais\nacl localnet src 192.168.0.0/16\n\n# Minhas ACLs Customizadas\nacl lan src 192.168.57.0/24\nacl liberados url_regex -i "/etc/squid/liberados.txt"\nacl negados url_regex -i "/etc/squid/negados.txt"\n\n# Regras de Acesso (A ORDEM IMPORTA!)\nhttp_access allow localhost\nhttp_access allow liberados\nhttp_access deny negados\nhttp_access allow lan\nhttp_access deny all`} 
                lang="squid" 
              />

              <div className="grid md:grid-cols-2 gap-6">
                <CodeBlock 
                  title="/etc/squid/liberados.txt"
                  code={`.gov.br\n.microsoft.com\n.google.com`} 
                  lang="txt" 
                />
                <CodeBlock 
                  title="/etc/squid/negados.txt"
                  code={`sexy.com\nplayboy.com\nwhitehouse.com`} 
                  lang="txt" 
                />
              </div>

              <HighlightBox title="A Ordem Importa!">
                <p className="text-sm text-text-2">
                  O Squid lê as regras de cima para baixo. Se você colocar <code>http_access deny all</code> no topo, ninguém navega. Se colocar <code>allow lan</code> antes de <code>deny negados</code>, os sites proibidos serão liberados para a LAN.
                </p>
              </HighlightBox>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {/* Proxy Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist Proxy
            </h3>
            <div className="space-y-3">
              {PROXY_CHECKLIST.map(item => (
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
              Regras iptables
            </h3>
            <div className="space-y-4">
              <CodeBlock title="Liberar DNS" code="iptables -A FORWARD -p udp --dport 53 -j ACCEPT" lang="bash" />
              <CodeBlock title="Liberar Proxy" code="iptables -A INPUT -p tcp --dport 3128 -j ACCEPT" lang="bash" />
              <CodeBlock title="Proxy Transparente" code="iptables -t nat -A PREROUTING -i eth1 -p tcp --dport 80 -j REDIRECT --to-port 3128" lang="bash" />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-err/5 border border-err/20">
            <h4 className="font-bold text-sm text-err mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Segurança de Rede
            </h4>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Por que isolar a LAN da DMZ? Entenda como evitar que um servidor invadido comprometa seus usuários.
            </p>
            <Link href="/pivoteamento" className="text-[10px] font-bold text-err hover:underline flex items-center gap-1 uppercase tracking-wider">
              Ver aula de Pivoteamento
              <ChevronRight size={10} />
            </Link>
          </div>

          <WarnBox title="HTTPS e o Proxy">
            <p className="text-xs text-text-2 leading-relaxed">
              O HTTPS é criptografado ponta-a-ponta. Para filtrar conteúdo HTTPS, você precisa do <strong>SSL Bump</strong> (interceptação SSL), o que exige instalar um certificado do Firewall em todas as estações.
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Aprenda como configurar o SSL Bump para filtrar sites HTTPS sem quebrar o cadeado do navegador.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'squid-https') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Squid HTTPS Filtering</span>
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
