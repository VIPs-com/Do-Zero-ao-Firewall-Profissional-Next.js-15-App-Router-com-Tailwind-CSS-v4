'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, Book, Hash, Shield, Globe, Lock, Terminal, Zap, Activity, Server, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleNav } from '@/components/ui/ModuleNav';

interface Term {
  term: string;
  definition: string;
  category: string;
  icon: React.ReactNode;
}

const GLOSSARY: Term[] = [
  // Firewall
  { term: "ACL", definition: "Access Control List — lista de regras que define quem pode acessar o quê. No Squid, define quais sites são permitidos ou bloqueados.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "conntrack", definition: "Módulo do kernel que mantém o estado das conexões ativas. Essencial para o funcionamento do NAT e da regra ESTABLISHED.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "ESTABLISHED", definition: "Estado de conexão TCP onde o handshake já foi completado e dados estão fluindo. Regra do iptables que permite respostas.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "FORWARD", definition: "Chain do iptables que processa pacotes que atravessam o firewall (não são destinados ao próprio firewall).", category: "Firewall", icon: <Shield size={14} /> },
  { term: "iptables", definition: "Firewall do kernel Linux. Gerencia regras de filtragem, NAT e redirecionamento de pacotes.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "Port Knocking", definition: "Técnica de segurança onde a porta SSH só abre após o envio de um pacote secreto em outra porta.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "recent", definition: "Módulo do iptables que mantém listas de IPs com timestamps. Usado pelo Port Knocking.", category: "Firewall", icon: <Shield size={14} /> },
  
  // WAN & NAT
  { term: "DNAT", definition: "Destination NAT — traduz o IP de destino do pacote. Usado para redirecionar conexões da internet para servidores internos.", category: "Redes", icon: <Globe size={14} /> },
  { term: "MASQUERADE", definition: "Variante do SNAT que descobre automaticamente o IP da interface de saída. Útil quando o IP público é dinâmico (DHCP).", category: "Redes", icon: <Globe size={14} /> },
  { term: "NAT", definition: "Network Address Translation — traduz endereços IP entre redes públicas e privadas.", category: "Redes", icon: <Globe size={14} /> },
  { term: "POSTROUTING", definition: "Chain do iptables onde o SNAT é aplicado — depois da decisão de roteamento, antes do pacote sair.", category: "Redes", icon: <Globe size={14} /> },
  { term: "PREROUTING", definition: "Chain do iptables onde o DNAT é aplicado — antes da decisão de roteamento.", category: "Redes", icon: <Globe size={14} /> },
  { term: "SNAT", definition: "Source NAT — traduz o IP de origem do pacote. Usado para que redes internas acessem a internet.", category: "Redes", icon: <Globe size={14} /> },
  
  // DNS
  { term: "BIND9", definition: "O servidor DNS mais usado no Linux. Responsável por resolver nomes de domínio em endereços IP.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "CNAME", definition: "Registro DNS que cria um apelido para outro nome. Ex: web → www (web aponta para o mesmo IP de www).", category: "DNS", icon: <Terminal size={14} /> },
  { term: "DNS", definition: "Domain Name System — sistema que traduz nomes de domínio (ex: google.com) em endereços IP.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "PTR", definition: "Registro DNS reverso — mapeia um IP para um nome de domínio. Usado por servidores de e-mail para verificar remetentes.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "TTL", definition: "Time To Live — tempo que uma resposta DNS fica em cache antes de expirar.", category: "DNS", icon: <Terminal size={14} /> },
  
  // SSL/TLS
  { term: "Nginx", definition: "Servidor web de alta performance, usado para servir páginas HTTP/HTTPS e como proxy reverso.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "OpenSSL", definition: "Biblioteca de criptografia usada para gerar certificados SSL/TLS e chaves.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "PKI", definition: "Public Key Infrastructure — infraestrutura de chave pública que gerencia certificados digitais.", category: "Segurança", icon: <Lock size={14} /> },
  { term: "SSL/TLS", definition: "Protocolos de criptografia que garantem segurança na comunicação HTTP (HTTPS). Camada 6 do modelo OSI.", category: "Segurança", icon: <Lock size={14} /> },
  
  // Squid
  { term: "dstdomain", definition: "ACL do Squid que verifica apenas o domínio de destino. Mais rápido e funciona com HTTPS.", category: "Proxy", icon: <Search size={14} /> },
  { term: "Squid", definition: "Proxy de cache que filtra conteúdo na Camada 7 (URLs). Pode bloquear sites por domínio ou palavra.", category: "Proxy", icon: <Search size={14} /> },
  { term: "url_regex", definition: "ACL do Squid que analisa a URL completa com expressões regulares. Mais lento e não funciona bem com HTTPS.", category: "Proxy", icon: <Search size={14} /> },
  
  // VPN & IPSec
  { term: "AH", definition: "Authentication Header — protocolo IPSec que autentica e garante integridade, mas não criptografa. Menos usado que ESP.", category: "VPN", icon: <Zap size={14} /> },
  { term: "ESP", definition: "Encapsulating Security Payload — protocolo IPSec que criptografa e autentica os dados. É o mais usado em VPNs.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IKE", definition: "Internet Key Exchange — protocolo que estabelece e gerencia as chaves de criptografia para VPNs IPSec. Opera em duas fases.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IKEv2", definition: "Versão moderna do IKE, mais rápida e segura. Suporta MOBIKE (roaming entre redes) e é padrão em dispositivos móveis.", category: "VPN", icon: <Zap size={14} /> },
  { term: "IPSec", definition: "Internet Protocol Security — conjunto de protocolos que autentica e criptografa pacotes IP, base das VPNs corporativas.", category: "VPN", icon: <Zap size={14} /> },
  { term: "MOBIKE", definition: "Mobility and Multihoming — extensão do IKEv2 que permite que uma VPN continue ativa mesmo quando o dispositivo muda de rede.", category: "VPN", icon: <Zap size={14} /> },
  { term: "NAT-T", definition: "NAT Traversal — técnica que encapsula tráfego IPSec em UDP (porta 4500) para funcionar através de roteadores NAT.", category: "VPN", icon: <Zap size={14} /> },
  { term: "PSK", definition: "Pre-Shared Key — chave secreta compartilhada entre os pares de uma VPN. Mais simples, mas menos segura que certificados.", category: "VPN", icon: <Zap size={14} /> },
  { term: "StrongSwan", definition: "Implementação open-source de IPSec para Linux. Suporta IKEv1, IKEv2, certificados X.509.", category: "VPN", icon: <Zap size={14} /> },
  
  // Evolução
  { term: "eBPF", definition: "Extended Berkeley Packet Filter — tecnologia que permite executar código seguro no kernel Linux. Usada em firewalls modernos.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "nftables", definition: "Sucessor do iptables, unifica as tabelas em uma sintaxe única e oferece melhor performance.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "OPNsense", definition: "Firewall de borda baseado em FreeBSD, com interface web, suporte a VPN e IDS/IPS.", category: "Evolução", icon: <Activity size={14} /> },
  { term: "Pi-hole", definition: "Servidor DNS que bloqueia anúncios e rastreadores em toda a rede. Funciona como um filtro de DNS.", category: "Evolução", icon: <Activity size={14} /> },

  // Sprint R — Termos do material original
  { term: "iptables-save", definition: "Comando que exporta todas as regras iptables ativas em formato texto. Usado com iptables-restore para persistência.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "iptables-restore", definition: "Comando que importa regras de um arquivo gerado por iptables-save. Aplica as regras atomicamente (tudo ou nada).", category: "Firewall", icon: <Shield size={14} /> },
  { term: "multiport", definition: "Módulo do iptables (-m multiport) que permite especificar múltiplas portas (--dports 25,110,143) em uma única regra.", category: "Firewall", icon: <Shield size={14} /> },
  { term: "ip_forward", definition: "Parâmetro do kernel (net.ipv4.ip_forward) que ativa o roteamento de pacotes entre interfaces. Essencial para qualquer firewall.", category: "Redes", icon: <Globe size={14} /> },
  { term: "systemd", definition: "Sistema de inicialização do Linux que gerencia serviços. Usa units (.service) para iniciar, parar e monitorar processos.", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "journalctl", definition: "Comando para consultar logs do systemd. Ex: journalctl -u nginx mostra logs do Nginx.", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "Fail2ban", definition: "Ferramenta que monitora logs e bane IPs que ultrapassam um limite de tentativas falhas (ex: SSH brute force).", category: "Segurança", icon: <Lock size={14} /> },
  { term: "WireGuard", definition: "VPN moderna com criptografia Curve25519, ~4000 linhas de código. Mais rápida e simples que IPSec e OpenVPN.", category: "VPN", icon: <Zap size={14} /> },
  { term: "SOA", definition: "Start of Authority — registro DNS obrigatório que define parâmetros da zona: serial, refresh, retry, expire e TTL negativo.", category: "DNS", icon: <Terminal size={14} /> },
  { term: "Vim", definition: "Editor de texto modal do terminal Linux. Modo inserção (i), sair sem salvar (:q!), sair salvando (:wq), apagar linha (dd).", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "tcpdump", definition: "Ferramenta de captura de pacotes no terminal. Salva em formato PCAP para análise posterior no Wireshark.", category: "Diagnóstico", icon: <Search size={14} /> },

  // Fundamentos Linux — termos essenciais
  { term: "FHS", definition: "Filesystem Hierarchy Standard — padrão que define a estrutura de diretórios do Linux: /etc (configs), /var (dados variáveis), /usr (programas), /home (usuários), /tmp (temporário).", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "umask", definition: "Máscara de permissões que define os direitos padrão de novos arquivos e diretórios. umask 022 gera 644 para arquivos (666-022) e 755 para diretórios (777-022).", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "cron", definition: "Daemon de agendamento de tarefas. Sintaxe: 'minuto hora dia mês dia-semana comando'. Ex: '30 2 * * * backup.sh' roda às 02:30 todo dia.", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "GRUB", definition: "Grand Unified Bootloader — gerenciador de boot padrão do Linux. Configurado em /etc/default/grub; aplicar com update-grub. Permite escolher kernel e parâmetros na inicialização.", category: "Sistema", icon: <Terminal size={14} /> },
  { term: "rsyslog", definition: "Daemon de logs do Linux que processa e encaminha mensagens de sistema. Suporta centralização remota via TCP/UDP porta 514 com template por hostname.", category: "Sistema", icon: <Terminal size={14} /> },

  // Containers
  { term: "Container", definition: "Processo isolado que usa namespaces + cgroups + filesystem overlay. Mais leve que uma VM — não inclui kernel próprio, compartilha o do host.", category: "Containers", icon: <Server size={14} /> },
  { term: "Image", definition: "Template somente-leitura para criar containers. Composta por camadas (layers) empilhadas. Imagens são imutáveis; o container adiciona uma camada de escrita por cima.", category: "Containers", icon: <Server size={14} /> },
  { term: "Volume", definition: "Mecanismo de armazenamento persistente externo ao container. Sobrevive ao ciclo de vida do container. Tipos: named volume (gerenciado pelo Docker), bind mount (diretório do host) e tmpfs (RAM).", category: "Containers", icon: <Server size={14} /> },
  { term: "Dockerfile", definition: "Arquivo de instruções para construir uma imagem Docker. Cada instrução (FROM, RUN, COPY, CMD) cria uma camada imutável. docker build lê o Dockerfile e gera a imagem.", category: "Containers", icon: <Server size={14} /> },
  { term: "Registry", definition: "Repositório de imagens Docker. Docker Hub é o padrão público; GitHub Container Registry (ghcr.io) e Harbor são opções self-hosted. docker push/pull transfere imagens.", category: "Containers", icon: <Server size={14} /> },

  // Kubernetes
  { term: "Pod", definition: "Menor unidade deployável do Kubernetes — agrupa 1+ containers que compartilham rede (mesmo IP) e storage. Efêmero por natureza: se o pod morre, o IP muda.", category: "Kubernetes", icon: <Network size={14} /> },
  { term: "Deployment", definition: "Controller do K8s que gerencia um conjunto de pods idênticos (réplicas). Suporta rolling update (troca gradual) e rollback automático em caso de falha.", category: "Kubernetes", icon: <Network size={14} /> },
  { term: "Service", definition: "Abstração que expõe pods via IP/DNS estável. Tipos: ClusterIP (interno), NodePort (porta no host), LoadBalancer (IP externo via cloud). O kube-proxy implementa as regras de roteamento.", category: "Kubernetes", icon: <Network size={14} /> },
  { term: "Namespace", definition: "Isolamento lógico de recursos dentro de um cluster K8s. Permite multi-tenancy: equipes diferentes usam o mesmo cluster com quotas e políticas independentes.", category: "Kubernetes", icon: <Network size={14} /> },
  { term: "Ingress", definition: "Recurso K8s que roteia tráfego HTTP/HTTPS externo para Services internos com base em hostname e path. Requer um Ingress Controller (Traefik, Nginx) para funcionar.", category: "Kubernetes", icon: <Network size={14} /> },

  // DevOps & IaC
  { term: "Playbook", definition: "Arquivo YAML do Ansible com lista ordenada de tasks a executar em hosts. Cada task usa um módulo (apt, copy, service). Executado com ansible-playbook -i inventory playbook.yml.", category: "DevOps & IaC", icon: <Zap size={14} /> },
  { term: "Idempotência", definition: "Propriedade de uma operação que produz o mesmo resultado independente de quantas vezes for executada. Pilar do Ansible: verificar o estado antes de agir, não apenas executar cegamente.", category: "DevOps & IaC", icon: <Zap size={14} /> },
  { term: "HCL", definition: "HashiCorp Configuration Language — linguagem declarativa usada no Terraform. Descreve a infraestrutura desejada (o 'quê'), não os passos para criá-la (o 'como').", category: "DevOps & IaC", icon: <Zap size={14} /> },
  { term: "State (Terraform)", definition: "Arquivo terraform.tfstate que mapeia recursos HCL à infraestrutura real. Deve ser armazenado remotamente (S3, GitLab HTTP) em equipes para evitar conflitos.", category: "DevOps & IaC", icon: <Zap size={14} /> },

  // Observabilidade
  { term: "SLO", definition: "Service Level Objective — meta interna de confiabilidade. Ex: 99,9% de requisições com latência < 200ms. Mais restritivo que o SLA contratual; serve como buffer de segurança.", category: "Observabilidade", icon: <Activity size={14} /> },
  { term: "Error Budget", definition: "Percentual de falha permitida dentro da janela do SLO. Budget sobrando → acelerar deploys. Budget esgotado → congelar features e focar em confiabilidade. Pertence ao produto, não à infra.", category: "Observabilidade", icon: <Activity size={14} /> },
  { term: "PromQL", definition: "Prometheus Query Language — linguagem de consulta de séries temporais. Funções: rate() (taxa/s), increase() (total no período), sum by() (agregar). Ex: rate(http_requests_total[5m]).", category: "Observabilidade", icon: <Activity size={14} /> },
  { term: "Exporter", definition: "Agente que coleta métricas de um sistema e as expõe no formato Prometheus via endpoint /metrics. Ex: node_exporter (sistema), mysqld_exporter (banco), nginx-exporter (web).", category: "Observabilidade", icon: <Activity size={14} /> },
  { term: "Burn Rate", definition: "Taxa na qual o error budget está sendo consumido. Burn rate 1 = consumo exatamente na taxa prevista. Burn rate 14,4 = budget esgota em 5 dias — aciona alerta crítico de page.", category: "Observabilidade", icon: <Activity size={14} /> },
  { term: "Trace / Tracing", definition: "Rastreamento distribuído que acompanha uma requisição por todos os microsserviços que ela atravessa. Ferramentas: Jaeger, Tempo. Cada span tem duração e metadados de contexto.", category: "Observabilidade", icon: <Activity size={14} /> },

  // Service Mesh
  { term: "mTLS", definition: "Mutual TLS — autenticação bidirecional onde cliente E servidor apresentam certificados. Em Service Mesh (Istio/Linkerd), aplicado automaticamente entre todos os serviços via sidecars.", category: "Service Mesh", icon: <Lock size={14} /> },
  { term: "Sidecar Proxy", definition: "Container auxiliar injetado automaticamente no mesmo Pod pelo Service Mesh. Intercepta todo o tráfego de rede do serviço principal sem mudanças no código. Envoy é o sidecar padrão do Istio.", category: "Service Mesh", icon: <Network size={14} /> },
  { term: "VirtualService", definition: "Recurso Istio que define regras de roteamento de tráfego: canary (90/10), A/B por header, retry, timeout e injeção de falhas. Trabalha em conjunto com DestinationRule.", category: "Service Mesh", icon: <Network size={14} /> },
  { term: "Circuit Breaker", definition: "Padrão de resiliência que 'abre o circuito' após N falhas consecutivas, impedindo chamadas a um serviço degradado. No Istio: outlierDetection com consecutiveErrors e ejectionTime.", category: "Service Mesh", icon: <Zap size={14} /> },

  // Kubernetes (complemento)
  { term: "CNI", definition: "Container Network Interface — plugin de rede do Kubernetes que configura interfaces e rotas dos pods. Opções: Flannel (simples), Calico (NetworkPolicy), Cilium (eBPF, L7 policy).", category: "Kubernetes", icon: <Network size={14} /> },
  { term: "NetworkPolicy", definition: "Recurso K8s que restringe tráfego entre pods com base em labels, namespaces e portas. Requer CNI compatível (Calico, Cilium) — Flannel ignora as políticas.", category: "Kubernetes", icon: <Network size={14} /> },

  // DevOps & IaC (complemento)
  { term: "Pipeline (CI/CD)", definition: "Sequência automatizada de etapas: lint → test → build → deploy. No GitHub Actions: push dispara workflow, jobs rodam em paralelo (needs: para dependências), artifacts passam entre jobs.", category: "DevOps & IaC", icon: <Zap size={14} /> },
  { term: "GitOps", definition: "Prática de usar o repositório Git como fonte única de verdade para infraestrutura. Mudanças são feitas via PR; um agente (ArgoCD, Flux) sincroniza o cluster com o estado declarado no repo.", category: "DevOps & IaC", icon: <Zap size={14} /> },

  // Segurança (complemento)
  { term: "IDS / IPS", definition: "Intrusion Detection System detecta ataques passivamente (alerta, não bloqueia). IPS (Intrusion Prevention System) bloqueia o tráfego malicioso inline. Suricata opera em modo IDS (af-packet) ou IPS (NFQUEUE).", category: "Segurança", icon: <Shield size={14} /> },
  { term: "CARP", definition: "Common Address Redundancy Protocol — protocolo de alta disponibilidade do OPNsense/pfSense. Dois firewalls compartilham um VIP; o MASTER responde pelo IP, o BACKUP assume em segundos se o MASTER falhar.", category: "Redes", icon: <Globe size={14} /> },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(GLOSSARY.map(t => t.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-glossario">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Glossário</span>
      </div>

      <div className="section-label">Dicionário Técnico</div>
      <h1 className="section-title">📖 Glossário Hacker</h1>
      <p className="section-sub">
        A sopa de letrinhas do Linux traduzida para o português claro. 
        Busque por siglas, comandos ou conceitos.
      </p>

      <div className="space-y-8 mb-12">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" size={18} />
          <input
            type="text"
            placeholder="Buscar termo... (ex: NAT, SSL, IKEv2)"
            className="w-full bg-bg-2 border border-border rounded-lg py-3.5 pl-12 pr-4 text-sm focus:border-accent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border",
                activeCategory === cat 
                  ? "bg-accent border-accent text-white" 
                  : "bg-bg-2 border-border text-text-3 hover:border-accent hover:text-accent"
              )}
            >
              {cat === 'all' ? '📚 Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((t, i) => (
          <motion.div 
            key={t.term}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-xl bg-bg-2 border border-border hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-bold text-accent-2">{t.term}</h3>
              <div className="px-2 py-1 rounded bg-bg-3 border border-border text-[9px] font-bold uppercase tracking-widest text-text-3 flex items-center gap-1.5">
                {t.icon}
                {t.category}
              </div>
            </div>
            <p className="text-sm text-text-2 leading-relaxed group-hover:text-text transition-colors">
              {t.definition}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-20 bg-bg-2 border border-dashed border-border rounded-xl">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">Nenhum termo encontrado</h3>
          <p className="text-text-3">Tente buscar por outra palavra ou limpe os filtros.</p>
        </div>
      )}

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/glossario" />
    </div>
  );
}
