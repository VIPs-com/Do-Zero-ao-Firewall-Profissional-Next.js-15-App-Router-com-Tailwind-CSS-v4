'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Terminal, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { LayerBadge } from '@/components/ui/LayerBadge';
import { useBadges } from '@/context/BadgeContext';

const EQUIVALENCIA = [
  {
    categoria: 'Listar regras',
    iptables: 'iptables -L -n -v',
    nftables: 'nft list ruleset',
  },
  {
    categoria: 'Política padrão DROP',
    iptables: 'iptables -P INPUT DROP',
    nftables: 'nft add chain ip filter input { type filter hook input priority 0 \\; policy drop \\; }',
  },
  {
    categoria: 'Permitir ESTABLISHED',
    iptables: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
    nftables: 'nft add rule ip filter input ct state established,related accept',
  },
  {
    categoria: 'Bloquear IP',
    iptables: 'iptables -A INPUT -s 1.2.3.4 -j DROP',
    nftables: 'nft add rule ip filter input ip saddr 1.2.3.4 drop',
  },
  {
    categoria: 'SNAT / Masquerade',
    iptables: 'iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE',
    nftables: 'nft add rule ip nat postrouting oifname "eth0" masquerade',
  },
  {
    categoria: 'DNAT / Port Forward',
    iptables: 'iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 192.168.1.10',
    nftables: 'nft add rule ip nat prerouting tcp dport 80 dnat to 192.168.1.10',
  },
  {
    categoria: 'Salvar regras',
    iptables: 'iptables-save > /etc/iptables/rules.v4',
    nftables: 'nft list ruleset > /etc/nftables.conf',
  },
];

export default function NftablesPage() {
  const { checklist, updateChecklist } = useBadges();
  const [activeTab, setActiveTab] = useState<'conceito' | 'config' | 'equivalencia'>('conceito');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-nftables">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">nftables</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="section-label">Evolução do Firewall · Kernel 3.13+</div>
        <LayerBadge layer="Camada 3" />
        <LayerBadge layer="Camada 4" />
      </div>
      <h1 className="section-title">🔥 nftables — O Futuro do Firewall Linux</h1>
      <p className="section-sub">
        O <strong>nftables</strong> é o substituto oficial do iptables desde o kernel 3.13 (2014).
        Ele unifica as ferramentas legadas (iptables, ip6tables, arptables, ebtables) em uma única
        sintaxe moderna, mais legível e mais eficiente. Se você domina iptables, está a dois passos
        de dominar o nftables.
      </p>

      {/* Tabs de navegação */}
      <div className="flex gap-2 mb-10 border-b border-border">
        {[
          { id: 'conceito',    label: '📖 Conceito' },
          { id: 'config',      label: '⚙️ Configuração' },
          { id: 'equivalencia', label: '🔄 Tabela iptables ↔ nft' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-accent text-accent-2'
                : 'border-transparent text-text-2 hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-12">
        <div>

          {/* ── Tab: Conceito ── */}
          {activeTab === 'conceito' && (
            <div className="space-y-12">
              <section id="por-que-nftables">
                <h2 className="text-2xl font-bold mb-6">Por que migrar para nftables?</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { titulo: 'Uma ferramenta só', desc: 'iptables + ip6tables + arptables + ebtables → tudo em um único comando nft.' },
                    { titulo: 'Sintaxe legível', desc: 'Regras em texto expressivo, sem flags crípticas. Mais fácil de auditar.' },
                    { titulo: 'Performance', desc: 'Compilação JIT das regras no kernel. Conjuntos (sets) nativos sem módulos extras.' },
                    { titulo: 'Atomic reload', desc: 'Atualização atômica das regras — sem janela de exposição durante recarga.' },
                  ].map(item => (
                    <div key={item.titulo} className="p-5 rounded-xl bg-bg-2 border border-border">
                      <h4 className="font-bold text-sm text-accent-2 mb-2">{item.titulo}</h4>
                      <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <WarnBox title="iptables não foi removido — ainda">
                  Na maioria das distros modernas (Ubuntu 22.04+, Debian 12+), o comando
                  <code> iptables</code> já é um wrapper sobre nftables via{' '}
                  <code>iptables-nft</code>. Suas regras iptables continuam funcionando,
                  mas são traduzidas internamente para nftables. Para ambientes novos,
                  escreva nftables nativo diretamente.
                </WarnBox>
              </section>

              <section id="conceitos-chave">
                <h2 className="text-2xl font-bold mb-6">Conceitos: Tables, Chains e Rules</h2>
                <p className="text-text-2 mb-6 leading-relaxed">
                  O nftables tem uma hierarquia de 3 níveis — diferente do iptables que tinha
                  tabelas e chains fixas predefinidas.
                </p>

                <div className="bg-bg-2 border border-border rounded-xl p-6 font-mono text-xs space-y-3 mb-6">
                  <div className="text-accent font-bold">table ip minha-tabela {'{'}</div>
                  <div className="ml-6 text-info">chain input {'{'}</div>
                  <div className="ml-12 text-text-3">type filter hook input priority 0; policy drop;</div>
                  <div className="ml-12 text-ok">ct state established,related accept</div>
                  <div className="ml-12 text-ok">tcp dport 22 accept</div>
                  <div className="ml-6 text-info">{'}'}</div>
                  <div className="text-accent">{'}'}</div>
                </div>

                <div className="space-y-3">
                  {[
                    { termo: 'table', desc: 'Agrupa chains. Você cria com qualquer nome — não há tabelas fixas como no iptables.' },
                    { termo: 'chain', desc: 'Sequência de regras. Define o hook (input, forward, output...) e a política padrão.' },
                    { termo: 'rule', desc: 'Condição + ação. Ex: "se porta TCP for 22, aceitar".' },
                    { termo: 'set', desc: 'Conjunto nativo de IPs, portas ou redes. Muito mais eficiente que múltiplas regras.' },
                  ].map(item => (
                    <div key={item.termo} className="flex gap-4 p-4 bg-bg-3 rounded-lg border border-border">
                      <code className="text-accent-2 font-bold text-xs shrink-0 w-16">{item.termo}</code>
                      <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ── Tab: Configuração ── */}
          {activeTab === 'config' && (
            <div className="space-y-10">
              <section id="instalacao">
                <h2 className="text-2xl font-bold mb-6">Instalação e primeiros passos</h2>

                <CodeBlock
                  title="Instalação (Ubuntu/Debian)"
                  lang="bash"
                  code={`# nftables já vem instalado no Ubuntu 20.04+\napt install nftables\n\n# Habilitar na inicialização\nsystemctl enable nftables\nsystemctl start nftables\n\n# Verificar versão\nnft --version`}
                />

                <CodeBlock
                  title="Configuração base equivalente ao iptables padrão"
                  lang="bash"
                  code={`#!/usr/sbin/nft -f\n# /etc/nftables.conf\n\n# Limpa tudo antes de aplicar\nflush ruleset\n\ntable ip filter {\n    chain input {\n        type filter hook input priority 0; policy drop;\n\n        # Permitir conexões já estabelecidas\n        ct state established,related accept\n\n        # Permitir loopback\n        iifname "lo" accept\n\n        # Permitir SSH (porta 22)\n        tcp dport 22 accept\n\n        # ICMP (ping)\n        icmp type echo-request accept\n    }\n\n    chain forward {\n        type filter hook forward priority 0; policy drop;\n        ct state established,related accept\n    }\n\n    chain output {\n        type filter hook output priority 0; policy accept;\n    }\n}\n\ntable ip nat {\n    chain prerouting {\n        type nat hook prerouting priority -100;\n    }\n\n    chain postrouting {\n        type nat hook postrouting priority 100;\n        # Masquerade para saída à internet\n        oifname "eth0" masquerade\n    }\n}`}
                />

                <CodeBlock
                  title="Aplicar, verificar e persistir"
                  lang="bash"
                  code={`# Aplicar o arquivo de configuração\nnft -f /etc/nftables.conf\n\n# Verificar regras ativas\nnft list ruleset\n\n# Verificar sintaxe sem aplicar\nnft -c -f /etc/nftables.conf\n\n# Salvar estado atual\nnft list ruleset > /etc/nftables.conf`}
                />
              </section>

              <section id="sets">
                <h2 className="text-2xl font-bold mb-6">Sets — Bloqueio eficiente de múltiplos IPs</h2>
                <p className="text-text-2 mb-6 leading-relaxed">
                  No iptables, bloquear 100 IPs exige 100 regras. No nftables, um único
                  <strong> set</strong> contém todos os IPs e é consultado em O(1) — muito mais eficiente.
                </p>

                <CodeBlock
                  title="Blocklist com set nativo"
                  lang="bash"
                  code={`# Criar set de IPs bloqueados\nnft add set ip filter blocklist { type ipv4_addr; flags interval; }\n\n# Adicionar IPs ao set\nnft add element ip filter blocklist { 1.2.3.4, 5.6.7.0/24 }\n\n# Regra que referencia o set\nnft add rule ip filter input ip saddr @blocklist drop\n\n# Ver conteúdo do set\nnft list set ip filter blocklist`}
                />
              </section>
            </div>
          )}

          {/* ── Tab: Equivalência ── */}
          {activeTab === 'equivalencia' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-3">Tabela de Equivalência</h2>
                <p className="text-text-2 mb-6 leading-relaxed">
                  Use esta tabela como referência de migração. Cada linha mostra o comando
                  iptables legado e o equivalente nftables moderno.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-text-3 font-mono uppercase tracking-wider w-40">Ação</th>
                      <th className="text-left py-3 px-4 text-err font-mono uppercase tracking-wider">iptables (legado)</th>
                      <th className="text-left py-3 px-4 text-ok font-mono uppercase tracking-wider">nftables (moderno)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EQUIVALENCIA.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-bg-3 transition-colors">
                        <td className="py-3 px-4 text-text-2 font-medium">{row.categoria}</td>
                        <td className="py-3 px-4">
                          <code className="text-err bg-err/5 px-2 py-1 rounded text-[10px] block font-mono leading-relaxed">
                            {row.iptables}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-ok bg-ok/5 px-2 py-1 rounded text-[10px] block font-mono leading-relaxed">
                            {row.nftables}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <InfoBox title="A lógica é a mesma — só a sintaxe mudou">
                Os conceitos de hooks (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING),
                tabelas (filter, nat) e ações (accept, drop, masquerade) são idênticos.
                O nftables apenas os expressa de forma mais legível e unificada.
              </InfoBox>

              <HighlightBox title="Dica de migração gradual">
                Em ambientes existentes com iptables, você pode instalar o pacote
                <code> iptables-translate</code> para converter regras automaticamente:
                <br /><br />
                <code>iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT</code>
                <br />
                <span className="text-ok">→ nft add rule ip filter input tcp dport 22 counter accept</span>
              </HighlightBox>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Checklist */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-accent" />
              Checklist do Lab
            </h3>
            <div className="space-y-3">
              {[
                { id: 'nft-list',    label: 'Executar nft list ruleset com sucesso' },
                { id: 'nft-config',  label: 'Criar e aplicar /etc/nftables.conf' },
                { id: 'nft-migrate', label: 'Traduzir uma regra iptables para nft' },
              ].map(item => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={e => updateChecklist(item.id, e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span className={`text-xs leading-relaxed transition-colors ${
                    checklist[item.id] ? 'text-ok line-through' : 'text-text-2 group-hover:text-text'
                  }`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Comandos rápidos */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-sm mb-4">Comandos Essenciais</h3>
            <div className="space-y-2 font-mono text-[10px]">
              {[
                { cmd: 'nft list ruleset',           desc: 'Ver tudo' },
                { cmd: 'nft -f /etc/nftables.conf',  desc: 'Aplicar config' },
                { cmd: 'nft flush ruleset',           desc: 'Limpar tudo' },
                { cmd: 'nft -c -f arquivo.nft',      desc: 'Checar sintaxe' },
                { cmd: 'iptables-translate ...',      desc: 'Converter regra' },
              ].map(item => (
                <div key={item.cmd} className="p-2 bg-bg-3 rounded border border-border">
                  <div className="text-accent-2">{item.cmd}</div>
                  <div className="text-text-3 text-[9px] mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Link iptables */}
          <div className="p-5 rounded-xl bg-bg-2 border border-border">
            <p className="text-xs text-text-3 mb-3">Módulo base</p>
            <Link
              href="/wan-nat"
              className="flex items-center gap-2 text-sm font-medium text-accent-2 hover:text-accent transition-colors"
            >
              🌐 NAT & SNAT com iptables
              <ArrowRight size={14} />
            </Link>
            <p className="text-[10px] text-text-3 mt-1">
              Entenda o iptables antes de migrar para nftables
            </p>
          </div>

        </aside>
      </div>
    </div>
  );
}
