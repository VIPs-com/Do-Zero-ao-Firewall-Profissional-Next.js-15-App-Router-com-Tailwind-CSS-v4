'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Lock, Shield, Zap, Globe, Key as KeyIcon, ArrowRight, Info, AlertTriangle, Terminal, Search, Activity, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal.lazy';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { Circle, CheckCircle2 } from 'lucide-react';

const VPN_CHECKLIST = [
  { id: 'vpn-up', text: 'Túnel IPSec estabelecido (Status: UP)' },
  { id: 'vpn-ping', text: 'Ping entre redes internas via túnel' },
  { id: 'vpn-psk', text: 'Chave PSK configurada com segurança' },
];

export default function VpnIpsecPage() {
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('vpn-ipsec');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-vpn-ipsec">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">IPSec & VPN</span>
      </div>

      <div className="section-label">Tópico 07 · Camada 3</div>
      <h1 className="section-title">🛡️ IPSec & VPN</h1>
      <p className="section-sub">
        <strong>IPSec (Internet Protocol Security)</strong> é um conjunto de protocolos que autentica e criptografa 
        pacotes IP para garantir comunicação segura entre dois pontos. É a base das VPNs corporativas.
      </p>

      <FluxoCard
        title="Handshake IKE — Estabelecimento do Túnel"
        steps={[
          { label: 'IKE Fase 1', sub: 'ISAKMP SA (identidade)', icon: <Shield className="w-4 h-4" />, color: 'border-[var(--color-layer-4)]' },
          { label: 'IKE Fase 2', sub: 'IPSec SA (dados)', icon: <Lock className="w-4 h-4" />, color: 'border-[var(--color-layer-5)]' },
          { label: 'Túnel ESP', sub: 'pacotes criptografados', icon: <Globe className="w-4 h-4" />, color: 'border-[var(--color-layer-6)]' },
          { label: 'Ping remoto', sub: 'ipsec statusall', icon: <CheckCircle2 className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: IPSec Pillars */}
          <section id="ipsec">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Os Pilares do IPSec</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: <Lock />, title: 'Autenticação', tag: 'Quem é você?', desc: 'Garante que os dados vêm de quem dizem vir. Usa certificados ou PSK.' },
                { icon: <Shield />, title: 'Criptografia', tag: 'Conteúdo protegido', desc: 'Cifra os dados para que apenas o destinatário autorizado possa ler.' },
                { icon: <CheckCircle2 />, title: 'Integridade', tag: 'Dados intactos', desc: 'Verifica se os dados não foram alterados durante o trânsito.' },
                { icon: <Activity />, title: 'Anti-Replay', tag: 'Proteção avançada', desc: 'Impede que um pacote capturado seja reenviado por um atacante.' }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-bg-2 border border-border hover:border-accent/50 transition-all">
                  <div className="text-accent mb-4">{item.icon}</div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <div className="text-[10px] font-mono text-accent-2 uppercase mb-3">{item.tag}</div>
                  <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <InfoBox title="Onde o IPSec é usado?">
              <ul className="space-y-1 ml-6 list-disc text-sm text-text-2">
                <li>VPN Site-to-Site entre filiais de empresas</li>
                <li>VPN Remote Access para funcionários remotos</li>
                <li>Proteção de comunicação entre servidores críticos</li>
                <li>Protocolo padrão em firewalls corporativos (Fortinet, Cisco, pfSense)</li>
              </ul>
            </InfoBox>
          </section>

          {/* Section 2: Modes */}
          <section id="modos">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <ArrowRight size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Modos de Operação</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              O IPSec opera em dois modos principais. A escolha define quanto do pacote original é protegido.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-info">
                <h3 className="font-bold text-info mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-info" /> Modo Transporte
                </h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">
                  <strong>Usado quando:</strong> Comunicação direta entre dois hosts (ex: servidor para servidor).<br/>
                  <strong>O que é protegido:</strong> Apenas o payload do pacote. O cabeçalho IP original é mantido.
                </p>
                <div className="p-3 rounded bg-bg-3 font-mono text-[10px] text-text-3 border border-border">
                  [IP Original] + [IPSec Header] + [Dados Criptografados]
                </div>
              </div>
              <div className="p-6 rounded-xl bg-bg-2 border border-border border-t-4 border-t-accent">
                <h3 className="font-bold text-accent mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" /> Modo Túnel
                </h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">
                  <strong>Usado quando:</strong> VPN Site-to-Site entre gateways.<br/>
                  <strong>O que é protegido:</strong> Todo o pacote original. Um novo cabeçalho IP é adicionado.
                </p>
                <div className="p-3 rounded bg-bg-3 font-mono text-[10px] text-text-3 border border-border">
                  [Novo IP] + [IPSec Header] + [IP Original + Dados Criptografados]
                </div>
              </div>
            </div>

            <HighlightBox title="💡 Site-to-Site vs Remote Access — Quando usar cada um?">
              <ul className="space-y-2 text-sm text-text-2">
                <li>
                  <strong>Site-to-Site</strong> — Conecta <em>permanentemente</em> duas filiais (gateway ↔ gateway).
                  Configuração no ipsec.conf com <code className="text-xs">right=IP-PUBLICO-FILIAL</code>.
                  Ambos os lados precisam ter IP fixo ou DDNS.
                </li>
                <li>
                  <strong>Remote Access</strong> — Funcionário remoto conecta do notebook ou celular.
                  Requer autenticação por usuário (EAP-MSCHAPv2 ou certificado X.509).
                  StrongSwan suporta, mas a configuração é substancialmente mais complexa que Site-to-Site.
                </li>
              </ul>
            </HighlightBox>
          </section>

          {/* Section 3: Configuration */}
          <section id="configuracao">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configurando StrongSwan</h2>
            </div>
            <p className="text-text-2 mb-6 leading-relaxed">
              Instale o StrongSwan em ambos os gateways antes de configurar:
            </p>
            <CodeBlock title="Instalação" lang="bash" code="apt install strongswan strongswan-pki -y" />

            <div className="mt-6 space-y-4">
              <WarnBox title="⚠️ Pré-requisito: Abrir portas IPSec no Firewall">
                <p className="text-sm text-text-2 mb-3">
                  Sem essas 3 regras de INPUT, o handshake IKE nunca será completado — mesmo com o StrongSwan corretamente configurado.
                </p>
                <CodeBlock
                  title="Regras iptables obrigatórias para IPSec"
                  lang="bash"
                  code={`# IKE — troca de chaves (Internet Key Exchange)\niptables -A INPUT -p udp --dport 500 -j ACCEPT\n\n# NAT-T — IPSec atravessando NAT (encapsula ESP em UDP)\niptables -A INPUT -p udp --dport 4500 -j ACCEPT\n\n# ESP — protocolo de dados criptografados (não é TCP/UDP)\niptables -A INPUT -p esp -j ACCEPT\n\n# FORWARD entre as subredes das duas filiais\niptables -A FORWARD -s 192.168.1.0/24 -d 192.168.2.0/24 -j ACCEPT\niptables -A FORWARD -s 192.168.2.0/24 -d 192.168.1.0/24 -j ACCEPT\n\n# Monitorar logs do charon (daemon IPSec do StrongSwan)\njournalctl -u strongswan -f`}
                />
              </WarnBox>
            </div>

            <div className="space-y-8 mt-6">
              <CodeBlock 
                title="/etc/ipsec.conf — Configuração Site-to-Site"
                code={`config setup\n    charondebug="all"\n    uniqueids=yes\n\nconn matriz-filial\n    type=tunnel\n    keyexchange=ikev2\n    authby=secret\n    left=200.200.200.1          # IP público da Matriz\n    leftsubnet=192.168.1.0/24   # Rede interna da Matriz\n    right=200.200.200.2         # IP público da Filial\n    rightsubnet=192.168.2.0/24  # Rede interna da Filial\n    ike=aes256-sha256-modp2048\n    esp=aes256-sha256\n    auto=start`} 
                lang="conf" 
              />

              <CodeBlock 
                title="/etc/ipsec.secrets — Chave PSK"
                code={`200.200.200.1 200.200.200.2 : PSK "ChaveSuperSecreta123!"`} 
                lang="secrets" 
              />

              <WarnBox title="Segurança da PSK">
                <p className="text-sm text-text-2">
                  Nunca use chaves fracas. Prefira senhas longas e aleatórias. Se a PSK for comprometida, todo o túnel poderá ser interceptado.
                </p>
              </WarnBox>
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

            <WarnBox title="⚠️ Problemas frequentes com IPSec">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>ipsec up falha com &quot;no proposal chosen&quot;</strong> → parâmetros IKE/ESP divergem entre os dois gateways
                  → verificar que <code className="text-xs">ike=</code> e <code className="text-xs">esp=</code> são idênticos nos dois lados
                </li>
                <li>
                  <strong>Túnel sobe (ESTABLISHED) mas ping não passa</strong> → regra FORWARD bloqueada pelo firewall
                  → <code className="text-xs">iptables -A FORWARD -s 192.168.1.0/24 -d 192.168.2.0/24 -j ACCEPT</code> (e vice-versa)
                </li>
                <li>
                  <strong>ipsec statusall mostra ESTABLISHED mas sem tráfego</strong> → rota não configurada no OS
                  → <code className="text-xs">ip route add 192.168.2.0/24 dev eth0</code> ou verificar leftsubnet/rightsubnet
                </li>
                <li>
                  <strong>Túnel cai após alguns minutos</strong> → DPD (Dead Peer Detection) expira
                  → adicionar <code className="text-xs">dpdaction=restart</code> e <code className="text-xs">dpdtimeout=30s</code> na configuração
                </li>
              </ul>
            </WarnBox>
          </section>
        </div>

        <aside className="space-y-6">
          {/* VPN Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist VPN
            </h3>
            <div className="space-y-3">
              {VPN_CHECKLIST.map(item => (
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
              Comandos Úteis
            </h3>
            <div className="space-y-4">
              <CodeBlock title="Iniciar IPSec" code="ipsec start" lang="bash" />
              <CodeBlock title="Verificar Status" code="ipsec statusall" lang="bash" />
              <p className="text-[10px] text-text-3 mt-1 mb-2">Saída esperada (túnel estabelecido):</p>
              <CodeBlock code={`Security Associations (1 up, 0 connecting):\nmatriz-filial[1]: ESTABLISHED 2 minutes ago\nmatriz-filial{'{'}1{'}'}: INSTALLED, TUNNEL, reqid 1\nmatriz-filial{'{'}1{'}'}: 192.168.1.0/24 === 192.168.2.0/24`} lang="log" />
              <CodeBlock title="Reiniciar" code="ipsec restart" lang="bash" />
            </div>
          </div>

          <HighlightBox title="IKEv1 vs IKEv2">
            <p className="text-xs text-text-2 leading-relaxed">
              Sempre prefira o <strong>IKEv2</strong>. Ele é mais rápido, mais seguro, suporta mobilidade e tem melhor tratamento de NAT Traversal.
            </p>
          </HighlightBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Aprenda os detalhes das fases do IKE e como os algoritmos Diffie-Hellman garantem a troca de chaves.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'ipsec-deep') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">IPSec Deep Dive</span>
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

      {/* Windows Comparison */}
      <div className="mt-12">
        <WindowsComparisonBox
          windowsLabel="Windows — RRAS VPN IKEv2"
          linuxLabel="Linux — StrongSwan IKEv2"
          windowsCode={`# Windows RRAS — VPN IKEv2 Site-to-Site

# 1. Habilitar RRAS no Windows Server:
Install-WindowsFeature Routing -IncludeManagementTools
Install-RemoteAccess -VpnType Vpn

# 2. Configurar via PowerShell:
Add-VpnS2SInterface \\
  -Name "Filial-VPN" \\
  -Destination "200.200.200.2" \\
  -Protocol IKEv2 \\
  -AuthenticationMethod PSKOnly \\
  -SharedSecret "ChaveSuperSecreta123!" \\
  -IPv4Subnet "192.168.2.0/24:100"

# 3. Iniciar o túnel:
Connect-VpnS2SInterface -Name "Filial-VPN"
Get-VpnS2SInterface -Name "Filial-VPN" | Select-Object ConnectionState

# 4. Verificar status:
Get-RemoteAccessConnectionStatistics
netsh ras diagnostics show all

# 5. Rota estática para rede da filial:
route add 192.168.2.0 mask 255.255.255.0 \\
  192.168.1.1 metric 10 -p`}
          linuxCode={`# Linux StrongSwan — VPN IKEv2 Site-to-Site

# 1. Instalar StrongSwan:
apt install strongswan strongswan-pki -y

# 2. /etc/ipsec.conf — configuração do túnel:
# config setup
#   charondebug="all"
#   uniqueids=yes
#
# conn matriz-filial
#   type=tunnel
#   keyexchange=ikev2
#   authby=secret
#   left=200.200.200.1
#   leftsubnet=192.168.1.0/24
#   right=200.200.200.2
#   rightsubnet=192.168.2.0/24
#   ike=aes256-sha256-modp2048
#   esp=aes256-sha256
#   auto=start

# 3. /etc/ipsec.secrets:
# 200.200.200.1 200.200.200.2 : PSK "ChaveSuperSecreta123!"

# 4. Iniciar e verificar:
ipsec start
ipsec statusall
# Procurar: ESTABLISHED e INSTALLED TUNNEL`}
        />
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/vpn-ipsec" />
    </div>
  );
}
