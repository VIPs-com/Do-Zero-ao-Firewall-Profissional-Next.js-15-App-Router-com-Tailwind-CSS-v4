'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Terminal, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import { ModuleNav } from '@/components/ui/ModuleNav';
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
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [activeTab, setActiveTab] = useState<'conceito' | 'config' | 'equivalencia'>('conceito');

  useEffect(() => {
    trackPageVisit('/nftables');
  }, [trackPageVisit]);

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

      <FluxoCard
        title="Fluxo: criar um ruleset nftables do zero"
        steps={[
          { label: 'nft add table', sub: 'cria a tabela (ip, ip6 ou inet)', icon: <Zap size={14}/>, color: 'border-info/50' },
          { label: 'nft add chain', sub: 'define hook e política padrão (drop/accept)', icon: <Shield size={14}/>, color: 'border-[var(--mod)]/50' },
          { label: 'nft add rule', sub: 'condição + ação: tcp dport 22 accept', icon: <Terminal size={14}/>, color: 'border-ok/50' },
          { label: 'nft list ruleset', sub: 'verifica todas as regras ativas', icon: <ArrowRight size={14}/>, color: 'border-warn/50' },
          { label: '/etc/nftables.conf', sub: 'persiste entre reboots via systemd', icon: <Shield size={14}/>, color: 'border-ok/50' },
        ]}
      />

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

              <WindowsComparisonBox
                windowsLabel="Windows Firewall / netsh"
                linuxLabel="nftables / nft"
                windowsCode={`# GUI: wf.msc (Windows Defender Firewall)
# Ou via netsh:
netsh advfirewall firewall add rule ^
  name="Bloquear IP" dir=in action=block ^
  remoteip=1.2.3.4
# Listar regras:
netsh advfirewall firewall show rule name=all`}
                linuxCode={`# Criar tabela, chain e regra
nft add table ip meu-fw
nft add chain ip meu-fw input { type filter hook input priority 0\\; policy drop\\; }
nft add rule ip meu-fw input ip saddr 1.2.3.4 drop
# Listar tudo:
nft list ruleset
# Salvar:
nft list ruleset > /etc/nftables.conf`}
              />
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

          {/* Exercícios Guiados */}
          <section id="exercicios" className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[var(--mod)]/10 flex items-center justify-center text-[var(--mod)]">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">Exercícios Guiados</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">1</span>
                  Criar ruleset básico equivalente ao iptables padrão
                </h3>
                <p className="text-sm text-text-2">Recrie as regras mais comuns do iptables em nftables nativo.</p>
                <CodeBlock lang="bash" title="Exercício 1 — ruleset básico" code={`# Criar arquivo de configuração nftables
cat > /tmp/meu-firewall.nft << 'EOF'
#!/usr/sbin/nft -f
flush ruleset

table ip filter {
    chain input {
        type filter hook input priority 0; policy drop;

        # Conexões já estabelecidas
        ct state established,related accept

        # Loopback sempre liberado
        iifname "lo" accept

        # SSH
        tcp dport 22 accept

        # Ping
        icmp type echo-request accept
    }

    chain forward {
        type filter hook forward priority 0; policy drop;
        ct state established,related accept
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
EOF

# Verificar sintaxe sem aplicar
nft -c -f /tmp/meu-firewall.nft

# Aplicar
nft -f /tmp/meu-firewall.nft

# Verificar resultado
nft list ruleset`} />
              </div>

              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">2</span>
                  Blocklist dinâmica com set nativo
                </h3>
                <p className="text-sm text-text-2">Crie um set de IPs bloqueados e adicione/remova IPs em tempo real sem alterar as regras.</p>
                <CodeBlock lang="bash" title="Exercício 2 — set blocklist" code={`# Criar tabela e set (se não existir)
nft add table ip filter
nft add set ip filter blocklist { type ipv4_addr; flags interval; }

# Criar regra que referencia o set
nft add chain ip filter input { type filter hook input priority 0; policy accept; }
nft add rule ip filter input ip saddr @blocklist drop

# Adicionar IPs ao set dinamicamente (sem reiniciar!)
nft add element ip filter blocklist { 1.2.3.4 }
nft add element ip filter blocklist { 10.0.0.0/8 }

# Verificar conteúdo do set
nft list set ip filter blocklist

# Testar que o IP está bloqueado
ping -c 2 1.2.3.4  # deve mostrar "Operation not permitted" no firewall

# Remover IP do set
nft delete element ip filter blocklist { 1.2.3.4 }`} />
              </div>

              <div className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--mod)]/20 text-[var(--mod)] text-xs font-bold flex items-center justify-center">3</span>
                  Migrar regra iptables para nftables com iptables-translate
                </h3>
                <p className="text-sm text-text-2">Use a ferramenta oficial para converter regras legadas automaticamente.</p>
                <CodeBlock lang="bash" title="Exercício 3 — migração automática" code={`# Instalar ferramenta de tradução
apt install iptables -y  # já inclui iptables-translate

# Converter regras individuais
iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT
# → nft add rule ip filter input tcp dport 22 counter accept

iptables-translate -A INPUT -s 1.2.3.4 -j DROP
# → nft add rule ip filter input ip saddr 1.2.3.4 counter drop

iptables-translate -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# → nft add rule ip nat postrouting oifname "eth0" counter masquerade

# Converter um arquivo inteiro de regras salvas
# (se você tem /etc/iptables/rules.v4)
iptables-restore-translate -f /etc/iptables/rules.v4 > /etc/nftables.conf

# Verificar o arquivo gerado
cat /etc/nftables.conf

# Aplicar
nft -f /etc/nftables.conf`} />
              </div>
            </div>
          </section>

          {/* Erros Comuns */}
          <section id="erros-comuns" className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">Erros Comuns</h2>
            </div>

            <HighlightBox title="💡 Pulo do Gato">
              <p className="text-sm text-text-2">
                O nftables substitui iptables, ip6tables, arptables e ebtables com <strong>uma única ferramenta</strong>.
                Regras são compiladas em bytecode similar ao BPF — mais eficiente e com menos overhead no kernel.
                Se você usar nftables, desative o iptables.service para evitar conflitos.
              </p>
            </HighlightBox>

            <WarnBox title="⚠️ Problemas frequentes com nftables" className="mt-6">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>nft falha com &quot;syntax error&quot; nas portas</strong> → vírgula sem espaços em sets
                  → usar <code className="text-xs">{"{ 80, 443 }"}</code> com espaços antes e após chaves
                </li>
                <li>
                  <strong>Regras aplicadas mas somem após reboot</strong> → ruleset não salvo
                  → <code className="text-xs">nft list ruleset &gt; /etc/nftables.conf</code> e <code className="text-xs">systemctl enable nftables</code>
                </li>
                <li>
                  <strong>iptables e nftables em conflito</strong> → ambos ativos ao mesmo tempo
                  → <code className="text-xs">systemctl disable --now iptables</code> antes de usar nftables
                </li>
                <li>
                  <strong>nft list ruleset vazio após reboot</strong> → nftables.service não está carregando o arquivo
                  → verificar <code className="text-xs">/etc/nftables.conf</code> e se <code className="text-xs">systemctl is-enabled nftables</code> retorna <em>enabled</em>
                </li>
              </ul>
            </WarnBox>
          </section>
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

      {/* ── Exercícios Guiados ── */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
        <div className="grid gap-4">
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 1 — Criar Ruleset Básico com nftables</p>
            <CodeBlock lang="bash" code={`# Instalar nftables e verificar versão
apt install nftables -y
nft --version

# Ver regras atuais (provavelmente vazio)
nft list ruleset

# Criar tabela e chains básicos
nft add table inet filter
nft add chain inet filter input   '{ type filter hook input priority 0; policy drop; }'
nft add chain inet filter forward '{ type filter hook forward priority 0; policy drop; }'
nft add chain inet filter output  '{ type filter hook output priority 0; policy accept; }'

# Permitir loopback e conexões estabelecidas
nft add rule inet filter input iif lo accept
nft add rule inet filter input ct state established,related accept

# Permitir SSH
nft add rule inet filter input tcp dport 22 accept

# Verificar as regras criadas
nft list ruleset`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 2 — Usar Sets para Blocklist de IPs</p>
            <CodeBlock lang="bash" code={`# Criar set de IPs bloqueados
nft add set inet filter blocklist '{ type ipv4_addr; flags dynamic; }'

# Adicionar IPs ao set
nft add element inet filter blocklist '{ 192.168.100.10, 10.0.0.5 }'

# Criar regra que bloqueia IPs do set
nft insert rule inet filter input ip saddr @blocklist drop

# Ver o set e seus elementos
nft list set inet filter blocklist

# Adicionar IP dinamicamente (sem recarregar regras)
nft add element inet filter blocklist '{ 172.16.0.1 }'

# Ver contador de drops por IP
nft list ruleset -a   # -a mostra handles para edição

# Remover IP do blocklist
nft delete element inet filter blocklist '{ 192.168.100.10 }'`} />
          </div>
          <div className="p-4 rounded-xl bg-bg-2 border border-border">
            <p className="font-bold text-sm mb-2">Lab 3 — Persistir Regras e Migrar de iptables</p>
            <CodeBlock lang="bash" code={`# Salvar ruleset atual em arquivo
nft list ruleset > /etc/nftables.conf

# Verificar conteúdo salvo
cat /etc/nftables.conf

# Habilitar persistência via systemd
systemctl enable nftables
systemctl start nftables

# Limpar regras e restaurar do arquivo
nft flush ruleset
nft -f /etc/nftables.conf
nft list ruleset   # deve estar de volta

# Migrar regras iptables existentes para nftables
# (apenas como referência — requer iptables-translate instalado)
iptables-save 2>/dev/null | head -20 || true
# iptables-restore-translate -f /tmp/iptables.rules > /tmp/nftables-migrado.rules

echo "nftables configurado e persistindo!"
systemctl status nftables`} />
          </div>
        </div>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/nftables" />
    </div>
  );
}
