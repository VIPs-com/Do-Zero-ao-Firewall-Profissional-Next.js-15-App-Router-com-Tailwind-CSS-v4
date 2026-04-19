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
import { ModuleNav } from '@/components/ui/ModuleNav';
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

          {/* Section 4: Gerenciando a Lista recent */}
          <section id="proc-recent">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Gerenciando a Lista recent</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              O módulo <code>xt_recent</code> expõe as listas de IPs como arquivos em <code>/proc/net/xt_recent/</code>. Você pode inspecionar e manipular essas listas diretamente — útil em situações de emergência ou para depuração.
            </p>

            <div className="space-y-6">
              <CodeBlock
                title="Inspecionar e manipular /proc/net/xt_recent/"
                lang="bash"
                code={`# Ver IPs que bateram nas portas (campos: src, ttl, last_seen, oldest_pkt, count)\ncat /proc/net/xt_recent/FASE1\ncat /proc/net/xt_recent/FASE2\n\n# Adicionar IP manualmente (acesso de emergência — bypass do knock)\necho "+192.168.57.50" > /proc/net/xt_recent/FASE2\n\n# Remover IP específico (revogar acesso)\necho "-185.234.12.43" > /proc/net/xt_recent/FASE2\n\n# Limpar lista completa (reset total)\necho "/" > /proc/net/xt_recent/FASE2`}
              />

              <InfoBox title="Lendo o arquivo /proc/net/xt_recent/FASE1">
                <p className="text-sm text-text-2 mb-2">Cada linha representa um IP e seus metadados:</p>
                <code className="text-xs block bg-bg-3 p-2 rounded">src=185.234.12.43 ttl: 118 last_seen: 123456789 oldest_pkt: 123456700 count: 3</code>
                <ul className="mt-3 space-y-1 text-sm text-text-2 list-disc pl-4">
                  <li><strong>src</strong> → IP de origem do atacante</li>
                  <li><strong>ttl</strong> → TTL do pacote — revela o sistema operacional</li>
                  <li><strong>last_seen</strong> → timestamp da última batida (jiffies)</li>
                  <li><strong>count</strong> → número de pacotes registrados</li>
                </ul>
              </InfoBox>

              <HighlightBox title="💡 TTL como Fingerprint de SO">
                <p className="text-sm text-text-2">
                  O campo <strong>ttl</strong> no arquivo <code>/proc/net/xt_recent</code> revela o sistema operacional de quem está batendo nas portas:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-text-2 list-disc pl-4">
                  <li><strong>64</strong> → Linux / macOS</li>
                  <li><strong>128</strong> → Windows</li>
                  <li><strong>255</strong> → equipamento de rede (roteador, switch gerenciável)</li>
                </ul>
                <p className="text-sm text-text-2 mt-2">
                  TTL entre esses valores (ex: 118) indica que o pacote passou por alguns roteadores antes de chegar. 118 ≈ Windows (128 - 10 hops).
                </p>
              </HighlightBox>
            </div>
          </section>

          {/* Section 6: O Administrador em Ação */}
          <section id="admin-em-acao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">6. O Administrador em Ação</h2>
            </div>

            <WarnBox title="⏱️ O curl vai travar — e isso é NORMAL">
              <p className="text-sm">O <code className="text-xs">curl --max-time 1</code> vai travar <strong>~1 segundo</strong> sem resposta. Isso é NORMAL — a porta está sendo <code className="text-xs">DROP</code>ada intencionalmente pelo kernel. Não é erro de rede, não é erro de configuração. É o mecanismo funcionando perfeitamente.</p>
            </WarnBox>

            <div className="mt-6 mb-6">
              <FluxoCard
                title="Fluxo Completo do Admin — 4 Atos"
                steps={[
                  { label: 'Porta Invisível', sub: "nmap vê 'filtered' — nem open nem closed. Bots desistem.", icon: <EyeOff size={16} />, color: 'text-text-3' },
                  { label: 'Bate em :59991', sub: 'curl --max-time 1 192.168.57.250:59991 — kernel anota o IP com timestamp.', icon: <Key size={16} />, color: 'text-accent' },
                  { label: 'Janela 10s', sub: 'Porta 22 abre SOMENTE para aquele IP pelos próximos 10 segundos.', icon: <Zap size={16} />, color: 'text-warn' },
                  { label: 'SSH Conecta', sub: 'Sessão ESTABLISHED — independente do knock após conectar.', icon: <Unlock size={16} />, color: 'text-ok' },
                ]}
              />
            </div>

            <div className="space-y-4">
              <CodeBlock code={`# Fluxo manual (3 linhas):
curl --max-time 1 192.168.57.250:59991 2>/dev/null
# ↑ trava ~1s — DROP silencioso (normal!)
ssh usuario@192.168.57.250
# ↑ conectar nos próximos 10 segundos!

# Script ~/entrar.sh — automatiza tudo:
cat > ~/entrar.sh << 'EOF'
#!/bin/bash
HOST=\${1:-192.168.57.250}
echo "Batendo na porta 59991..."
curl --max-time 1 \$HOST:59991 2>/dev/null
sleep 1
echo "Conectando via SSH..."
ssh usuario@\$HOST
# Após sair do SSH, fechar o acesso:
curl --max-time 1 \$HOST:59992 2>/dev/null
echo "Acesso fechado."
EOF
chmod +x ~/entrar.sh
./entrar.sh`} />

              <HighlightBox title="🤖 Por que bots NUNCA descobrem a porta">
                <CodeBlock code={`# SSH exposto (sem Port Knocking):
grep "Failed password" /var/log/auth.log | wc -l
# 847  ← tentativas de invasão SÓ HOJE

# SSH com Port Knocking:
grep "Failed password" /var/log/auth.log | wc -l
# 0    ← nenhum bot sequer chega ao SSH

# Por quê? O scanner vê:
# nmap -p 22 192.168.20.200
# PORT   STATE    SERVICE
# 22/tcp filtered ssh
#        ^^^^^^^^
#        Sem resposta. Para o bot, não existe servidor.`} />
              </HighlightBox>

              <InfoBox title="💡 Os Dois Sistemas Independentes — recent vs conntrack">
                <div className="space-y-2 text-sm">
                  <p><strong>Módulo recent</strong> — guarda quem tem permissão de <em>iniciar</em> conexão. Timer: 10s. Após conectar, não é mais consultado.</p>
                  <p><strong>conntrack (ESTABLISHED)</strong> — guarda sessões <em>já estabelecidas</em>. Timer: 5 dias (432000s). Renovado a cada pacote trocado.</p>
                  <p className="text-ok font-medium">Você pode deixar o timer do knock expirar que a sessão SSH continua ativa pelo conntrack.</p>
                </div>
              </InfoBox>

              <div className="space-y-3">
                {[
                  { id: 'knock-admin-flow', text: 'Executei o fluxo curl + ssh completo e entrei no servidor' },
                  { id: 'knock-visibility', text: 'Verifiquei os 0 logins no auth.log com Port Knocking ativo' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    {checklist[item.id] ? (
                      <CheckCircle2 size={16} className="text-ok shrink-0 mt-0.5" />
                    ) : (
                      <Circle size={16} className="text-text-3 shrink-0 mt-0.5 group-hover:text-accent" />
                    )}
                    <span className={cn(
                      "text-sm leading-tight transition-colors",
                      checklist[item.id] ? "text-text-2 line-through opacity-50" : "text-text-3 group-hover:text-text-2"
                    )}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Section 7: Erros Comuns (renumerado — era 5) */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">7. Erros Comuns</h2>
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
              Comando para &quot;Bater&quot;
            </h3>
            <p className="text-[10px] text-text-3 mb-4">Use o nmap ou telnet para enviar os pacotes:</p>
            <CodeBlock code={`nmap -p 1000 IP-FIREWALL\nnmap -p 2000 IP-FIREWALL\nssh user@IP-FIREWALL`} lang="bash" />
            <div className="mt-4 space-y-2">
              <a
                href="/scripts/entrar.sh"
                download
                className="flex items-center gap-2 px-3 py-2 bg-ok/10 hover:bg-ok/20 border border-ok/30 rounded-lg text-xs font-bold text-ok transition-all"
              >
                ⬇ entrar.sh (auto-knock)
              </a>
              <a
                href="/scripts/knock-monitor.sh"
                download
                className="flex items-center gap-2 px-3 py-2 bg-info/10 hover:bg-info/20 border border-info/30 rounded-lg text-xs font-bold text-info transition-all"
              >
                ⬇ knock-monitor.sh
              </a>
            </div>
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

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/port-knocking" />
    </div>
  );
}
