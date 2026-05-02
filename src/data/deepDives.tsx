import React from 'react';
import { Shield, Zap, Terminal, Search, Lock, Globe, Server, Network } from 'lucide-react';

export interface DeepDive {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'Firewall' | 'DNS' | 'Proxy' | 'SSL' | 'Kernel' | 'Containers' | 'Kubernetes';
  content: string;
  tags: string[];
}

export const DEEP_DIVES: DeepDive[] = [
  {
    id: 'knocking-vs-stateful',
    title: 'Port Knocking vs Stateful Firewall',
    icon: <Zap className="text-accent" />,
    category: 'Firewall',
    content: `
### A elegância do Stateful Firewall
Muitos confundem o Port Knocking com o Stateful Firewall, mas são mecanismos independentes:

1. **Mecanismo 1 — Módulo recent (Port Knocking)**:
   - Gerencia a LISTA de IPs autorizados a INICIAR uma conexão.
   - Vive em \`/proc/net/xt_recent/abre-ssh\`.
   - Tem um timer curto (ex: 10s). Expira e some.

2. **Mecanismo 2 — Conntrack (Stateful Firewall)**:
   - Gerencia CONEXÕES JÁ ESTABELECIDAS.
   - Vive em \`/proc/net/nf_conntrack\`.
   - O timer é longo (pode durar dias).

**O Port Knocking abre a porta. O ESTABLISHED mantém você dentro.** São dois sistemas que nem se conhecem, mas trabalham juntos para uma segurança máxima.
    `,
    tags: ['iptables', 'security', 'kernel']
  },
  {
    id: 'kernel-hooks',
    title: 'Os Hooks do Netfilter (Kernel)',
    icon: <Shield className="text-info" />,
    category: 'Kernel',
    content: `
### Onde a mágica acontece
O kernel Linux processa pacotes em 5 pontos estratégicos chamados "hooks":

1. **PREROUTING**: Logo que o pacote chega na placa. É aqui que o **DNAT** troca o IP de destino ANTES do roteamento.
2. **INPUT**: Pacotes destinados ao próprio Firewall (ex: SSH ou Squid).
3. **FORWARD**: Pacotes que estão apenas atravessando o Firewall (ex: LAN para Internet).
4. **OUTPUT**: Pacotes gerados pelo próprio Firewall.
5. **POSTROUTING**: O último ponto antes do pacote sair. É aqui que o **SNAT** troca o IP de origem.

**Por que o DNAT é no PREROUTING?** Porque a decisão de roteamento vem depois. Se trocar o IP depois, o kernel já teria decidido o destino errado.

**Boa notícia:** iptables e nftables usam os mesmos 5 hooks — a lógica não muda, só a sintaxe.
    `,
    tags: ['iptables', 'nftables', 'routing', 'nat']
  },
  {
    id: 'dns-failure-points',
    title: 'Por que o DNS é a primeira coisa que quebra?',
    icon: <Search className="text-ok" />,
    category: 'DNS',
    content: `
### O Teste de Ouro
Sempre faça dois testes para isolar o problema:
- **Teste 1**: \`ping 8.8.8.8\` (Funciona? Camadas 1 a 4 estão OK).
- **Teste 2**: \`ping google.com\` (Não funciona? O problema é EXCLUSIVAMENTE o DNS).

**Motivos comuns de falha:**
1. **Serial não incrementado**: Você alterou a zona mas o BIND9 não "avisou" os outros.
2. **Erro de sintaxe**: Um ponto final faltando no arquivo de zona.
3. **Firewall bloqueando porta 53**: O pacote UDP não consegue atravessar.
    `,
    tags: ['bind9', 'troubleshooting']
  },
  {
    id: 'squid-https-filtering',
    title: 'Squid Proxy e o Desafio do HTTPS',
    icon: <Globe className="text-accent" />,
    category: 'Proxy',
    content: `
### O Dilema da Criptografia
O Squid foi criado para filtrar HTTP (texto puro). No HTTPS, o pacote é criptografado do navegador até o servidor final.

1. **O que o Squid vê?**: Apenas o domínio (ex: google.com) via handshake TLS.
2. **O que o Squid NÃO vê?**: A URL completa (ex: google.com/search?q=segredo).

**Melhor Prática**:
- Use **dstdomain** para bloquear domínios inteiros.
- Evite **url_regex** para HTTPS, pois ele falhará em ver o conteúdo da URL.
- Para inspeção profunda, seria necessário **SSL Bump** (interceptação), o que exige instalar um certificado do firewall em todas as máquinas da rede.
    `,
    tags: ['squid', 'proxy', 'https']
  },
  {
    id: 'ipsec-ike-phases',
    title: 'As Fases do IKE (IPSec)',
    icon: <Lock className="text-info" />,
    category: 'SSL',
    content: `
### Como o Túnel é Construído
O IKE (Internet Key Exchange) estabelece a VPN em duas fases distintas:

1. **Fase 1 (ISAKMP)**:
   - Estabelece um canal seguro entre os dois firewalls.
   - Autentica os pares (via PSK ou Certificado).
   - Negocia algoritmos de criptografia (ex: AES-256).

2. **Fase 2 (IPSec SA)**:
   - Cria o túnel real por onde os dados dos usuários vão passar.
   - Define quais redes podem se falar (ex: 192.168.1.0/24 <-> 10.0.0.0/24).
   - Usa protocolos como **ESP** (criptografia) ou **AH** (apenas autenticação).

**Dica de Ouro**: Se a Fase 1 sobe mas a Fase 2 cai, o problema geralmente é erro na máscara de rede ou redes não autorizadas no arquivo de configuração.
    `,
    tags: ['ipsec', 'vpn', 'strongswan']
  },
  {
    id: 'nftables-vs-iptables',
    title: 'nftables vs iptables — Por que migrar?',
    icon: <Shield className="text-ok" />,
    category: 'Kernel',
    content: `
### A mesma lógica, uma nova linguagem

O **nftables** não reinventou o firewall — ele apenas modernizou a interface. Os 5 hooks do Netfilter continuam os mesmos (PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING). O que mudou foi a sintaxe e a arquitetura interna.

**Por que o iptables estava mostrando sua idade:**
1. **4 ferramentas separadas**: iptables, ip6tables, arptables, ebtables — cada uma com sua própria sintaxe.
2. **Sem sets nativos**: bloquear 1000 IPs = 1000 regras (lento).
3. **Reload não-atômico**: durante a recarga de regras, há uma janela de exposição.

**O que o nftables resolve:**
1. **Uma ferramenta**: \`nft\` cuida de IPv4, IPv6, ARP e bridges.
2. **Sets nativos**: \`nft add set ip filter blocklist { type ipv4_addr; }\` — busca em O(1).
3. **Atomic reload**: \`nft -f arquivo.nft\` aplica tudo ou nada — sem janela de exposição.
4. **Tabelas customizadas**: você nomeia suas tabelas e chains — sem nomes fixos obrigatórios.

**Tradução automática para migração gradual:**
\`\`\`
iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT
→ nft add rule ip filter input tcp dport 22 counter accept
\`\`\`

**Resumo**: Se você sabe iptables, já sabe nftables. É só aprender a nova sintaxe.
    `,
    tags: ['nftables', 'iptables', 'kernel', 'migration']
  },
  {
    id: 'docker-networking-internals',
    title: 'Docker Networking — Bridges, iptables e Isolamento',
    icon: <Server className="text-info" />,
    category: 'Containers',
    content: `
### Como o Docker realmente conecta containers

Quando você instala o Docker, ele cria automaticamente uma interface de rede virtual chamada \`docker0\` — uma **bridge Linux** com IP 172.17.0.1 por padrão.

**O que acontece quando você executa \`docker run\`:**
1. Docker cria um par de interfaces virtuais (veth pair): uma fica no namespace do container, outra na bridge docker0.
2. O container recebe IP via DHCP interno (ex: 172.17.0.2).
3. O kernel roteia tráfego entre container → docker0 → interface do host.

**Como o port mapping funciona (é DNAT!):**
\`\`\`
docker run -p 8080:80 nginx
↓
iptables -t nat -A DOCKER ! -i docker0 -p tcp --dport 8080 -j DNAT --to-destination 172.17.0.2:80
\`\`\`
Docker injeta regras DNAT em \`/proc/sys/net/ipv4/ip_forward\` = 1 automaticamente.

**Por que não editar a chain DOCKER?**
- Docker regenera as regras DOCKER a cada reinicialização.
- Suas regras customizadas serão apagadas.
- Use a chain **DOCKER-USER** — ela é chamada antes de DOCKER e nunca é limpa.

**Redes customizadas (\`docker network create\`):**
- Cada rede cria uma nova bridge (ex: br-abc123).
- Containers na mesma rede customizada se resolvem pelo nome (DNS interno do Docker via 127.0.0.11).
- **Isolamento real**: containers em redes diferentes não se comunicam sem regras explícitas de roteamento.
    `,
    tags: ['docker', 'networking', 'iptables', 'bridge', 'nat']
  },
  {
    id: 'k8s-service-discovery',
    title: 'Kubernetes Service Discovery — CoreDNS e kube-proxy',
    icon: <Network className="text-ok" />,
    category: 'Kubernetes',
    content: `
### Como um Pod encontra outro Pod no Kubernetes

No Kubernetes, Pods são efêmeros: o IP muda a cada reinicialização. O **Service** resolve isso com um IP virtual estável — mas como o tráfego chega ao Pod certo?

**Dois sistemas que trabalham juntos:**

**1. CoreDNS — Service Discovery por Nome:**
- Todo cluster K8s tem CoreDNS rodando como Deployment.
- Cada Service recebe um registro DNS automático: \`<serviço>.<namespace>.svc.cluster.local\`
- \`nginx.default.svc.cluster.local\` → 10.96.45.12 (ClusterIP)
- Pods consultam o DNS via /etc/resolv.conf que aponta para o IP do CoreDNS (10.96.0.10).

**2. kube-proxy — Roteamento do ClusterIP:**
- kube-proxy roda em cada nó e cria regras iptables/ipvs para cada Service.
- Quando o tráfego chega ao ClusterIP (IP virtual), iptables faz DNAT para um dos Endpoints (IPs reais dos Pods).
- Load balancing é probabilístico (--probability com statistic mode).

**Por que o ClusterIP não existe realmente:**
\`\`\`
kubectl get svc nginx → 10.96.45.12 (ClusterIP)
ip route → nenhuma rota para 10.96.45.12 no host
\`\`\`
O ClusterIP é uma ficção mantida por regras iptables em todos os nós. **Não há interface de rede com esse IP** — é pura tradução de endereço no kernel.

**Cilium e a revolução eBPF:**
- Cilium substitui kube-proxy por eBPF maps: \`O(1)\` em vez de \`O(N)\` iptables.
- Em clusters com 10.000 serviços, isso é a diferença entre 1ms e 100ms de latência.
    `,
    tags: ['kubernetes', 'coredns', 'kube-proxy', 'networking', 'cilium']
  },
];
