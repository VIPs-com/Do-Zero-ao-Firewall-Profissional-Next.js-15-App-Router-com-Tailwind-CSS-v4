'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Terminal, Info, Package, Laptop, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { CodeBlock } from '@/components/ui/CodeBlock';

const CHECKLIST_ITEMS = [
  { id: 'ping-internet', text: '🌍 Ping Internet', sub: 'ping -c 3 8.8.8.8 funciona', layer: 'Camada 3' },
  { id: 'dns-resolve', text: '📖 DNS Resolve', sub: 'ping -c 3 google.com funciona', layer: 'Camada 7' },
  { id: 'dns-interno', text: '🏠 DNS Interno', sub: 'dig @DNS-SERVER www.workshop.local resolve', layer: 'Camada 7' },
  { id: 'proxy-funciona', text: '🔓 Proxy liberado', sub: 'curl -x http://FIREWALL:3128 http://google.com funciona', layer: 'Camada 7' },
  { id: 'proxy-bloqueio', text: '🚫 Proxy bloqueia', sub: 'site bloqueado retorna erro 403', layer: 'Camada 7' },
  { id: 'web-server', text: '🔒 Web Server', sub: 'curl -k https://WEB-SERVER retorna HTML', layer: 'Camada 6+7' },
  { id: 'dnat-funciona', text: '🌍 DNAT externo', sub: 'site acessível via IP público', layer: 'Camada 3+4' },
  { id: 'port-knocking', text: '🔑 Port Knocking', sub: 'SSH só acessível após knock', layer: 'Camada 4' },
];

export default function InstallationPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('instalacao');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => {
    updateChecklist(id, !checklist[id]);
  };

  const completedCount = Object.values(checklist).filter(v => v).length;
  const percentage = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-instalacao">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Instalação & Setup</span>
      </div>

      <div className="section-label">Pré-Lab · Fundação</div>
      <h1 className="section-title">🚀 Preparando o ambiente</h1>
      <p className="section-sub">
        Antes de começar, é importante garantir que você tem as ferramentas e permissões corretas 
        para configurar o laboratório. Siga os passos abaixo na ordem.
      </p>

      {/* Vim Survival Guide */}
      <div className="bg-bg-2 border border-border rounded-xl p-6 mb-12 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Guia de Sobrevivência: Editor Vim</h3>
            <p className="text-xs text-text-3 uppercase tracking-widest">Essencial para edição de arquivos de configuração</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'i', action: 'Entrar no modo de inserção (digitar)' },
            { key: 'Esc', action: 'Sair do modo de inserção' },
            { key: 'dd', action: 'Apagar uma linha inteira (no modo comando)' },
            { key: ':wq', action: 'Salvar e Sair (Write & Quit)' },
            { key: ':q!', action: 'Sair sem salvar (Forçar saída)' },
            { key: '/', action: 'Buscar termo no arquivo' },
          ].map(tip => (
            <div key={tip.key} className="p-4 rounded-lg bg-bg-3 border border-border">
              <kbd className="inline-block px-2 py-1 rounded bg-bg-2 border border-border text-accent font-mono text-sm mb-2">
                {tip.key}
              </kbd>
              <p className="text-xs text-text-2">{tip.action}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-12">
          {/* Setup Steps */}
          <div className="grid md:grid-cols-2 gap-6">
            <StepItem 
              number={1} 
              title="Criar as VMs" 
              description="Use VirtualBox ou Proxmox para criar as VMs de Firewall, DMZ e LAN. Pelo menos 2GB RAM cada." 
              icon={<Laptop size={20} />} 
            />
            <StepItem 
              number={2} 
              title="Definir redes" 
              description="Crie redes isoladas: WAN (NAT), DMZ (Host-Only) e LAN (Host-Only)." 
              icon={<Shield size={20} />} 
            />
            <StepItem 
              number={3} 
              title="Configurar IPs" 
              description="Use Netplan (Ubuntu) para atribuir os IPs fixos definidos na topologia." 
              icon={<Terminal size={20} />} 
            />
            <StepItem 
              number={4} 
              title="Instalar pacotes" 
              description="Instale Nginx, BIND9, iptables-persistent, Squid e OpenSSH-Server." 
              icon={<Package size={20} />} 
            />
          </div>

          {/* IP Architecture */}
          <section id="arquitetura">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Info size={24} className="text-info" />
              Arquitetura de IPs
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { z: 'WAN', c: 'text-accent', ips: [['Firewall', '192.168.20.200'], ['Gateway', '192.168.20.1']] },
                { z: 'DMZ', c: 'text-layer-3', ips: [['Firewall', '192.168.56.250'], ['DNS', '192.168.56.100'], ['Web', '192.168.56.120']] },
                { z: 'LAN', c: 'text-layer-5', ips: [['Firewall', '192.168.57.250'], ['Cliente', '192.168.57.50']] }
              ].map(zone => (
                <div key={zone.z} className="p-5 rounded-xl bg-bg-2 border border-border">
                  <h4 className={cn("font-bold text-xs uppercase tracking-widest mb-4", zone.c)}>Zona {zone.z}</h4>
                  <div className="space-y-3 font-mono text-[11px]">
                    {zone.ips.map(([name, ip]) => (
                      <div key={name} className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-text-3">{name}:</span>
                        <span className="text-accent-2 font-bold">{ip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <InfoBox title="Dica de Rede">
            <p className="text-sm text-text-2">
              Certifique-se de que o <strong>IP Forwarding</strong> está habilitado no Firewall para que ele possa rotear pacotes entre as interfaces.
              Use <code>sysctl -w net.ipv4.ip_forward=1</code> para teste imediato.
            </p>
          </InfoBox>

          {/* Netplan YAML */}
          <section id="netplan">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Terminal size={24} className="text-accent" />
              Configuração de Rede — Netplan (Ubuntu 22.04+)
            </h2>
            <p className="text-text-2 mb-6 leading-relaxed">
              O Ubuntu Server 22.04+ usa o Netplan para configurar interfaces de rede. O arquivo YAML abaixo configura as três interfaces do Firewall (WAN, DMZ e LAN) com IPs fixos.
            </p>
            <CodeBlock
              title="/etc/netplan/00-installer-config.yaml (Firewall)"
              lang="yaml"
              code={`network:\n  version: 2\n  renderer: networkd\n  ethernets:\n    enp0s3:             # Interface WAN (NAT para internet)\n      dhcp4: no\n      addresses: [192.168.20.200/24]\n      routes:\n        - to: default\n          via: 192.168.20.1\n      nameservers:\n        addresses: [8.8.8.8, 9.9.9.9]\n    enp0s8:             # Interface DMZ\n      dhcp4: no\n      addresses: [192.168.56.250/24]\n    enp0s9:             # Interface LAN\n      dhcp4: no\n      addresses: [192.168.57.250/24]`}
            />
            <CodeBlock
              title="Aplicar e verificar"
              lang="bash"
              code={`sudo netplan apply\nip addr show      # verificar IPs\nip route show     # verificar rotas`}
            />
          </section>

          {/* Pacotes por VM */}
          <section id="pacotes-vm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Package size={24} className="text-info" />
              Pacotes por Papel de VM
            </h2>
            <p className="text-text-2 mb-6 leading-relaxed">
              Cada VM do laboratório tem um papel específico. Instale apenas os pacotes necessários para cada função (princípio do privilégio mínimo aplicado ao software).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-bg-3 border border-border">
                    <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-text-3">VM</th>
                    <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-text-3">Função</th>
                    <th className="text-left p-3 text-xs font-bold uppercase tracking-wider text-text-3">Pacotes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { vm: '🔥 Firewall', func: 'Gateway, NAT, iptables', pkgs: 'iptables iptables-persistent squid curl tcpdump conntrack net-tools' },
                    { vm: '📖 DNS Server', func: 'BIND9 autoritativo', pkgs: 'bind9 bind9utils dnsutils' },
                    { vm: '🌐 Web Server', func: 'Nginx + SSL', pkgs: 'nginx openssl certbot python3-certbot-nginx' },
                    { vm: '💻 Cliente LAN', func: 'Testes e diagnóstico', pkgs: 'curl wget telnet dnsutils netcat-openbsd' },
                  ].map(row => (
                    <tr key={row.vm} className="bg-bg-2 hover:bg-bg-3 transition-colors">
                      <td className="p-3 font-bold text-xs">{row.vm}</td>
                      <td className="p-3 text-xs text-text-2">{row.func}</td>
                      <td className="p-3 font-mono text-[10px] text-accent-2">{row.pkgs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock
              title="Instalar pacotes de uma VM (ex: Firewall)"
              lang="bash"
              code={`apt update && apt install -y iptables iptables-persistent squid curl tcpdump conntrack net-tools`}
            />
          </section>
        </div>

        {/* Sticky Checklist */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="bg-bg-2 border border-border rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 border-b border-border bg-bg-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle2 size={18} className="text-ok" />
                Validação do Lab
              </h3>
            </div>
            <div className="p-5">
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-text-3 uppercase tracking-wider">Progresso</span>
                  <span className="text-accent">{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-bg-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-ok to-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                {CHECKLIST_ITEMS.map(item => (
                  <ChecklistItem
                    key={item.id}
                    text={item.text}
                    sub={item.sub}
                    layer={item.layer}
                    checked={!!checklist[item.id]}
                    onToggle={() => toggleCheck(item.id)}
                  />
                ))}
              </div>

              {percentage === 100 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-lg bg-ok/10 border border-ok/20 text-center"
                >
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="text-xs font-bold text-ok mb-3">Tudo validado!</p>
                  <Link href="/certificado" className="btn-primary w-full justify-center text-xs py-2">
                    Pegar Certificado
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
