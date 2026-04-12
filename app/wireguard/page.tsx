'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Key, Server, Laptop, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { useBadges } from '@/context/BadgeContext';

const WG_CHECKLIST = [
  { id: 'wg-keys',   text: 'Chaves pública/privada geradas em servidor e cliente' },
  { id: 'wg-server', text: 'wg0.conf do servidor configurado e interface up' },
  { id: 'wg-tunnel', text: 'Ping entre peers via túnel WireGuard' },
];

const INSTALL_CODE = `# Instalar WireGuard
apt install wireguard wireguard-tools -y

# Verificar instalação
wg --version
# wireguard-tools v1.0.20210914`;

const KEYGEN_SERVER = `# Criar diretório de configuração
mkdir -p /etc/wireguard && chmod 700 /etc/wireguard
cd /etc/wireguard

# Gerar chave privada do servidor → derivar pública
wg genkey | tee server.key | wg pubkey > server.pub

cat server.key   # chave privada (NUNCA compartilhar)
cat server.pub   # chave pública (compartilhar com clientes)`;

const KEYGEN_CLIENT = `# No computador do cliente:
wg genkey | tee client.key | wg pubkey > client.pub

cat client.key   # chave privada do cliente
cat client.pub   # chave pública (enviar ao servidor)`;

const SERVER_CONF = `[Interface]
Address    = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <SERVER_PRIVATE_KEY>

# NAT para que clientes acessem a internet
PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; \\
           iptables -A FORWARD -o wg0 -j ACCEPT; \\
           iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; \\
           iptables -D FORWARD -o wg0 -j ACCEPT; \\
           iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Chave pública do cliente
PublicKey  = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.0.0.2/32`;

const SERVER_UP = `# Subir a interface
wg-quick up wg0

# Verificar status e peers
wg show

# Habilitar na inicialização
systemctl enable wg-quick@wg0

# Ver interface de rede
ip addr show wg0`;

const CLIENT_CONF = `[Interface]
Address    = 10.0.0.2/24
PrivateKey = <CLIENT_PRIVATE_KEY>
DNS        = 1.1.1.1

[Peer]
PublicKey           = <SERVER_PUBLIC_KEY>
Endpoint            = <IP_PUBLICO_SERVIDOR>:51820
# 0.0.0.0/0 = full tunnel  |  10.0.0.0/24 = split tunnel
AllowedIPs          = 0.0.0.0/0
PersistentKeepalive = 25`;

const CLIENT_UP = `wg-quick up wg0       # subir túnel
ping 10.0.0.1         # testar conectividade com servidor
ip route get 8.8.8.8  # confirmar rota via wg0
wg show               # bytes transferidos + handshake
wg-quick down wg0     # derrubar túnel`;

const IPTABLES_CODE = `# Permitir handshake WireGuard (UDP 51820)
iptables -A INPUT -p udp --dport 51820 -j ACCEPT

# Encaminhar tráfego dos clientes
iptables -A FORWARD -i wg0 -j ACCEPT
iptables -A FORWARD -o wg0 -m state --state RELATED,ESTABLISHED -j ACCEPT

# MASQUERADE: clientes saem com IP do servidor
iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE

# Salvar regras
iptables-save > /etc/iptables/rules.v4`;

const SYSCTL_CODE = `echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
sysctl -p
# net.ipv4.ip_forward = 1`;

export default function WireGuardPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/wireguard');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">WireGuard</span>
      </div>

      <div className="section-label">Tópico 25 · Camada 3</div>
      <h1 className="section-title">🔐 WireGuard — VPN Moderna</h1>
      <p className="section-sub">
        <strong>WireGuard</strong> é um protocolo VPN de código aberto focado em simplicidade,
        alto desempenho e criptografia moderna. Com apenas ~4.000 linhas de código (contra
        ~100.000 do OpenVPN), é mais fácil de auditar, configurar e manter.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">

          {/* Section 1: Comparativo */}
          <section id="comparativo">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. WireGuard vs IPSec/OpenVPN</h2>
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-bg-3 border border-border">
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest text-text-3">Critério</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest text-accent">WireGuard</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest text-text-3">IPSec</th>
                    <th className="px-4 py-3 text-left font-bold text-xs uppercase tracking-widest text-text-3">OpenVPN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Linhas de código', '~4.000', '~100.000', '~70.000'],
                    ['Criptografia', 'Curve25519 + ChaCha20', 'AES-256 / IKEv2', 'AES-256 / TLS'],
                    ['Transporte', 'UDP (fixo)', 'UDP / ESP', 'UDP / TCP'],
                    ['Configuração', 'Muito simples', 'Complexa', 'Moderada'],
                    ['Performance', 'Muito alta', 'Alta', 'Moderada'],
                    ['Roaming', 'Nativo', 'Limitado', 'Sim'],
                  ].map(([crit, wg, ipsec, ovpn]) => (
                    <tr key={crit} className="bg-bg-2 hover:bg-bg-3 transition-colors">
                      <td className="px-4 py-3 text-text-3 font-medium">{crit}</td>
                      <td className="px-4 py-3 text-ok font-bold">{wg}</td>
                      <td className="px-4 py-3 text-text-2">{ipsec}</td>
                      <td className="px-4 py-3 text-text-2">{ovpn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <InfoBox title="Onde o kernel entra?">
              <p className="text-sm text-text-2">
                WireGuard é implementado diretamente no kernel Linux (desde 5.6). Isso o torna
                mais rápido que soluções em userspace como OpenVPN — o processamento de pacotes
                acontece no caminho crítico do stack de rede, sem cópias extras de memória.
              </p>
            </InfoBox>
          </section>

          {/* Section 2: Instalação e Chaves */}
          <section id="chaves">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Key size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Instalação e Geração de Chaves</h2>
            </div>

            <p className="text-text-2 mb-6">
              WireGuard usa criptografia de chave pública (Curve25519). Cada peer gera um par —
              a <strong>privada</strong> fica local, a <strong>pública</strong> é trocada com os outros peers.
            </p>

            <CodeBlock lang="bash" title="Instalar WireGuard (Debian/Ubuntu)" code={INSTALL_CODE} />
            <div className="mt-6">
              <CodeBlock lang="bash" title="Gerar par de chaves — Servidor" code={KEYGEN_SERVER} />
            </div>
            <div className="mt-6">
              <CodeBlock lang="bash" title="Gerar par de chaves — Cliente" code={KEYGEN_CLIENT} />
            </div>

            <div className="mt-6">
              <HighlightBox title="Curve25519 — por que é seguro?">
                <p className="text-sm text-text-2">
                  Curve25519 é uma curva elíptica projetada por Daniel Bernstein para resistir
                  a ataques de canal lateral. 256 bits equivalem a RSA-3072 em segurança.
                  O WireGuard usa Curve25519 para ECDH e ChaCha20-Poly1305 para cifrar dados —
                  mais rápido que AES em hardware sem instrução AES-NI.
                </p>
              </HighlightBox>
            </div>
          </section>

          {/* Section 3: Servidor */}
          <section id="servidor">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Server size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configuração do Servidor</h2>
            </div>

            <p className="text-text-2 mb-6">
              O servidor WireGuard é um peer com IP público que <em>ouve</em> em uma porta UDP.
              A configuração fica em <code>/etc/wireguard/wg0.conf</code>.
            </p>

            <CodeBlock lang="ini" title="/etc/wireguard/wg0.conf (Servidor)" code={SERVER_CONF} />
            <div className="mt-6">
              <CodeBlock lang="bash" title="Ativar a interface WireGuard" code={SERVER_UP} />
            </div>

            <div className="mt-6">
              <WarnBox title="Permissões do arquivo de configuração">
                <p className="text-sm text-text-2">
                  O <code>wg0.conf</code> contém a chave privada — deve ter permissão restrita:
                  <code> chmod 600 /etc/wireguard/wg0.conf</code>. O <code>wg-quick</code>
                  avisa se as permissões estiverem abertas.
                </p>
              </WarnBox>
            </div>
          </section>

          {/* Section 4: Cliente */}
          <section id="cliente">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Laptop size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Configuração do Cliente</h2>
            </div>

            <CodeBlock lang="ini" title="/etc/wireguard/wg0.conf (Cliente)" code={CLIENT_CONF} />
            <div className="mt-6">
              <CodeBlock lang="bash" title="Ativar e testar o cliente" code={CLIENT_UP} />
            </div>
          </section>

          {/* Section 5: Firewall */}
          <section id="firewall">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">5. Firewall e Roteamento</h2>
            </div>

            <p className="text-text-2 mb-6">
              Para que os clientes acessem a internet via servidor, precisamos de IP forwarding
              e NAT — os mesmos conceitos do módulo WAN/NAT, aplicados à interface <code>wg0</code>.
            </p>

            <CodeBlock lang="bash" title="IP forwarding permanente" code={SYSCTL_CODE} />
            <div className="mt-6">
              <CodeBlock lang="bash" title="Regras iptables para WireGuard" code={IPTABLES_CODE} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {[
                {
                  icon: <ArrowRight className="text-ok" size={20} />,
                  title: 'Full Tunnel',
                  desc: 'AllowedIPs = 0.0.0.0/0 → todo o tráfego passa pelo servidor. Útil para anonimato e contornar restrições de rede.',
                },
                {
                  icon: <ArrowRight className="text-info" size={20} />,
                  title: 'Split Tunnel',
                  desc: 'AllowedIPs = 10.0.0.0/24 → só o tráfego para a rede privada vai pelo túnel. Internet direta no cliente. Menor latência.',
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl bg-bg-2 border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    {item.icon}
                    <h3 className="font-bold">{item.title}</h3>
                  </div>
                  <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Checklist */}
          <div className="bg-bg-2 border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Shield className="text-ok" size={16} />
              Checklist do Lab
            </h3>
            <div className="space-y-3">
              {WG_CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={cn(
                    'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all text-xs',
                    checklist[item.id]
                      ? 'bg-ok/5 border-ok/30 text-text'
                      : 'bg-bg-3 border-border text-text-2 hover:border-accent/40',
                  )}
                >
                  {checklist[item.id]
                    ? <CheckCircle2 className="text-ok shrink-0 mt-0.5" size={16} />
                    : <Circle className="text-text-3 shrink-0 mt-0.5" size={16} />}
                  <span className="leading-relaxed">{item.text}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-text-3 text-center">
              {WG_CHECKLIST.filter(i => checklist[i.id]).length}/{WG_CHECKLIST.length} concluídos
              {WG_CHECKLIST.every(i => checklist[i.id]) && (
                <p className="mt-1 text-ok font-bold">🔐 WireGuard Master desbloqueado!</p>
              )}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4">Referência Rápida</h3>
            <div className="space-y-3 font-mono text-xs">
              {[
                ['wg show', 'Status de todos os peers'],
                ['wg-quick up wg0', 'Subir interface'],
                ['wg-quick down wg0', 'Derrubar interface'],
                ['wg genkey', 'Gerar chave privada'],
                ['wg pubkey', 'Derivar chave pública'],
                ['wg set wg0 peer …', 'Adicionar peer online'],
              ].map(([cmd, desc]) => (
                <div key={cmd} className="flex flex-col gap-0.5">
                  <code className="text-accent">{cmd}</code>
                  <span className="text-text-3 text-[10px]">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related */}
          <div className="bg-bg-2 border border-border rounded-xl p-6">
            <h3 className="font-bold text-sm mb-4">Relacionado</h3>
            <div className="space-y-2">
              {[
                { href: '/vpn-ipsec', label: 'IPSec com StrongSwan' },
                { href: '/wan-nat', label: 'WAN & NAT (MASQUERADE)' },
                { href: '/port-knocking', label: 'Port Knocking — SSH Invisível' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-xs text-text-2 hover:text-accent transition-colors group"
                >
                  <ArrowRight size={12} className="text-text-3 group-hover:text-accent" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
