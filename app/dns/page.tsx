'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Search, CheckCircle2, BookOpen, ArrowRight, Globe, Server, Database, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { Circle } from 'lucide-react';

const DNS_CHECKLIST = [
  { id: 'dns-recursivo', text: 'DNS resolve nomes externos (Recursão)' },
  { id: 'dns-interno', text: 'DNS resolve nomes da rede local (Zona Direta)' },
  { id: 'dns-reverso', text: 'DNS resolve IPs da rede local (Zona Reversa)' },
  { id: 'dns-firewall', text: 'Firewall usa o DNS local como primário' },
];

export default function DnsPage() {
  const [activeDeepDive, setActiveDeepDive] = React.useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('dns');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-dns">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">DNS BIND9</span>
      </div>

      <div className="section-label">Tópico 04 · Camada 7</div>
      <h1 className="section-title">📖 DNS BIND9</h1>
      <p className="section-sub">
        O DNS é o "catálogo telefônico" da internet — traduz nomes de domínio em endereços IP.
        No modelo OSI, o DNS opera na Camada 7 (Aplicação).
      </p>

      <FluxoCard
        title="Fluxo de Resolução DNS"
        steps={[
          { label: 'Cliente', sub: 'dig workshop.lab', icon: <Globe className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'BIND9 :53', sub: 'named em 0.0.0.0', icon: <Server className="w-4 h-4" />, color: 'border-[var(--color-layer-5)]' },
          { label: 'Zona Local?', sub: 'named.conf.local', icon: <Database className="w-4 h-4" />, color: 'border-[var(--color-layer-7)]' },
          { label: 'Resposta A', sub: '192.168.57.x', icon: <CheckCircle2 className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: How it works */}
          <section id="bind9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Como o BIND9 funciona?</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { t: 'Resolução Direta', d: 'Nome → IP (Registro A)', i: '🌐' },
                { t: 'Resolução Reversa', d: 'IP → Nome (Registro PTR)', i: '🔄' },
                { t: 'Alias', d: 'Apelido (Registro CNAME)', i: '🔗' }
              ].map(type => (
                <div key={type.t} className="p-6 rounded-xl bg-bg-2 border border-border text-center">
                  <div className="text-2xl mb-3">{type.i}</div>
                  <h4 className="font-bold text-sm mb-2">{type.t}</h4>
                  <p className="text-[10px] text-text-3 leading-relaxed">{type.d}</p>
                </div>
              ))}
            </div>

            <WarnBox title="Atenção ao ponto final!">
              <p className="text-sm text-text-2">
                No BIND9, todos os nomes de domínio completos (FQDN) <strong>devem terminar com um ponto</strong>. Ex: <code>dns.workshop.local.</code>
              </p>
            </WarnBox>
          </section>

          {/* Section 2: Configuration */}
          <section id="config">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Instalação e Configuração</h2>
            </div>

            <div className="space-y-8">
              <CodeBlock
                title="Instalar BIND9 e utilitários"
                lang="bash"
                code={`apt install bind9 bind9utils dnsutils -y\nsystemctl enable named\nsystemctl start named\nsystemctl status named`}
              />
              <CodeBlock 
                title="/etc/bind/named.conf.options"
                code={`options {\n  directory "/var/cache/bind";\n  forwarders { 8.8.8.8; 9.9.9.9; };\n  dnssec-validation yes;\n  listen-on-v6 { none; };\n  listen-on { any; };\n  allow-recursion { any; };\n  allow-query { any; };\n};`} 
                lang="bind" 
              />

              <CodeBlock
                title="/etc/bind/named.conf.local"
                code={`zone "workshop.local" {\n  type master;\n  file "db.workshop.local";\n};\n\n# Zona Reversa — resolve IP → nome (PTR records)\nzone "56.168.192.in-addr.arpa" {\n  type master;\n  file "db.56.168.192";\n};`}
                lang="bind"
              />

              <CodeBlock
                title="/var/cache/bind/db.workshop.local (Zona Direta)"
                code={`$TTL 3600\n@ IN SOA ns1.workshop.local. admin.workshop.local. (\n  2026030901 ; Serial\n  3600 ; refresh\n  1800 ; retry\n  604800 ; expire\n  3600 ) ; ttl negativo\n\n@ IN NS ns1.workshop.local.\n\nns1      IN A     192.168.56.100\nfirewall IN A     192.168.56.250\nwww      IN A     192.168.56.120\nwindows  IN A     192.168.57.50\nweb      IN CNAME www`} 
                lang="bind" 
              />

              <CodeBlock
                title="/var/cache/bind/db.56.168.192 (Zona Reversa — Registros PTR)"
                code={`$TTL 3600
@ IN SOA ns1.workshop.local. admin.workshop.local. (
  2026030901 ; Serial
  3600       ; Refresh
  1800       ; Retry
  604800     ; Expire
  3600 )     ; TTL Negativo

@ IN NS ns1.workshop.local.

100 IN PTR ns1.workshop.local.
120 IN PTR www.workshop.local.
250 IN PTR firewall.workshop.local.`}
                lang="bind"
              />

              <CodeBlock
                title="Validar zonas e recarregar BIND9"
                lang="bash"
                code={`named-checkconf
named-checkzone workshop.local /var/cache/bind/db.workshop.local
named-checkzone 56.168.192.in-addr.arpa /var/cache/bind/db.56.168.192
systemctl reload named`}
              />
            </div>
          </section>

          {/* Section 3: Diagnosis */}
          <section id="diagnostico">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Search size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Validação e Diagnóstico</h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-bg-2 border border-border flex gap-4 items-start">
                <CheckCircle2 size={20} className="text-ok shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">Validar Sintaxe</h4>
                  <p className="text-xs text-text-3 mb-3">Sempre valide antes de reiniciar o serviço.</p>
                  <CodeBlock code={`named-checkconf\nnamed-checkzone workshop.local /etc/bind/db.workshop.local`} lang="bash" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-bg-2 border border-border flex gap-4 items-start">
                <Terminal size={20} className="text-info shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">Testar Resolução</h4>
                  <p className="text-xs text-text-3 mb-3">Use o dig para consultas detalhadas.</p>
                  <CodeBlock code={`dig @127.0.0.1 www.workshop.local\ndig @127.0.0.1 -x 192.168.56.120`} lang="bash" />
                  <p className="text-[10px] text-text-3 mt-3 mb-2">Saída esperada (resolução direta):</p>
                  <CodeBlock code={`;; ANSWER SECTION:\nwww.workshop.local. 3600 IN A 192.168.56.120\n\n;; Query time: 1 msec\n;; SERVER: 127.0.0.1#53(127.0.0.1)`} lang="log" />
                  <p className="text-[10px] text-text-3 mt-3 mb-2">Saída esperada (resolução reversa — dig -x):</p>
                  <CodeBlock code={`;; ANSWER SECTION:\n120.56.168.192.in-addr.arpa. 3600 IN PTR www.workshop.local.\n\n;; Query time: 1 msec\n;; SERVER: 127.0.0.1#53(127.0.0.1)`} lang="log" />
                </div>
              </div>

              <WindowsComparisonBox
                linuxCode={`# Consulta direta ao servidor DNS local\ndig @192.168.56.10 workshop.local\n\n# Resolução reversa (IP → nome)\ndig -x 192.168.56.120 @192.168.56.10`}
                windowsCode={`# Consulta direta ao servidor DNS local\nnslookup workshop.local 192.168.56.10\n\n# Resolução reversa (IP → nome)\nnslookup 192.168.56.120 192.168.56.10`}
                linuxLabel="Linux — dig"
                windowsLabel="Windows — nslookup"
              />

              <div className="p-5 rounded-xl bg-bg-2 border border-border flex gap-4 items-start">
                <Terminal size={20} className="text-accent shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">Monitorar Logs do BIND9</h4>
                  <p className="text-xs text-text-3 mb-3">Acompanhe erros em tempo real durante a configuração:</p>
                  <CodeBlock code={`journalctl -u named -f`} lang="bash" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Erros Comuns */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Erros Comuns</h2>
            </div>

            <HighlightBox title="💡 Pulo do Gato">
              <p className="text-sm text-text-2">
                Sempre incremente o <strong>serial</strong> da zona (formato YYYYMMDDNN) antes de recarregar o BIND9.
                Sem isso, servidores secundários e resolvedores externos ignoram as mudanças.
                O serial <code className="text-xs">2026030901</code> significa: 2026-03-09, revisão 01.
              </p>
            </HighlightBox>

            <WarnBox title="⚠️ Problemas frequentes com BIND9">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>named não inicia após editar zona</strong> → erro de sintaxe na zona
                  → <code className="text-xs">named-checkzone workshop.local /var/cache/bind/db.workshop.local</code>
                </li>
                <li>
                  <strong>dig retorna SERVFAIL</strong> → named não está autoridade para a zona
                  → verificar <code className="text-xs">type master</code> no named.conf.local e reiniciar com <code className="text-xs">systemctl restart named</code>
                </li>
                <li>
                  <strong>Resolução interna funciona, reversa falha</strong> → zona reversa não configurada
                  → criar <code className="text-xs">db.192</code> e adicionar ao named.conf.local: <code className="text-xs">zone &quot;57.168.192.in-addr.arpa&quot;</code>
                </li>
                <li>
                  <strong>dig funciona mas Windows não resolve</strong> → cliente usando DNS do DHCP em vez do seu BIND9
                  → configurar DNS primário como 192.168.57.254 no adaptador de rede do Windows
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* DNS Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist DNS
            </h3>
            <div className="space-y-3">
              {DNS_CHECKLIST.map(item => (
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

          <WarnBox title="Troubleshooting">
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Se o DNS não resolver, verifique:
            </p>
            <ul className="text-[10px] text-text-3 space-y-2 list-disc pl-4">
              <li>Ponto final no FQDN</li>
              <li>Serial da zona incrementado</li>
              <li>Porta 53 liberada no Firewall</li>
              <li>Status: <code>systemctl status named</code></li>
            </ul>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Dica do Professor</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              O DNS é a primeira coisa que quebra porque quase todos os serviços dependem de nomes. Se o ping por IP funciona mas por nome não, o culpado é o DNS.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'dns-failure-points') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">Mergulho Profundo: Falhas de DNS</span>
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

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/dns" />
    </div>
  );
}
