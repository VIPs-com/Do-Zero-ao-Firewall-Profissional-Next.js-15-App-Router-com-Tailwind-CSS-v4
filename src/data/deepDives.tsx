import React from 'react';
import { Shield, Zap, Terminal, Search, Lock, Globe, Server, Network, GitBranch, Activity, Cpu, Rocket, Key, Eye } from 'lucide-react';

export interface DeepDive {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'Firewall' | 'DNS' | 'Proxy' | 'SSL' | 'Kernel' | 'Containers' | 'Kubernetes' | 'Ansible' | 'SRE' | 'eBPF' | 'CI/CD' | 'VPN' | 'Security';
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
  {
    id: 'ansible-idempotency',
    title: 'Ansible — Idempotência e o Ciclo de Execução',
    icon: <GitBranch className="text-err" />,
    category: 'Ansible',
    content: `
### Por que "rodar duas vezes" não muda nada (e por que isso importa)

Idempotência é a propriedade mais importante do Ansible: executar um playbook N vezes deve produzir o mesmo resultado que executar uma vez.

**Como o Ansible decide se uma task precisa executar:**

1. **Estado atual**: O módulo lê o estado real do sistema (arquivo existe? pacote instalado? serviço ativo?).
2. **Estado desejado**: O que você declarou no playbook (\`state: present\`, \`state: started\`).
3. **Decisão**: Se já estão iguais → **ok** (sem ação). Se diferem → **changed** (aplica e notifica handlers).

**O ciclo de execução em detalhes:**
\`\`\`
Play → Tasks (em ordem) → Handlers (no fim do play)
         ↓
   changed? → notifica handler → handler roda UMA VEZ no final
   ok?     → próxima task
   failed? → para (a menos que ignore_errors: true)
\`\`\`

**Por que handlers são no final?**
Imagine 3 tasks que modificam o nginx.conf, os virtualHosts e o SSL. Sem handlers, você reiniciaria o nginx 3 vezes. Com \`notify: Restart nginx\`, o handler acumula a notificação e reinicia **uma única vez** após todas as tasks — mais eficiente e correto.

**O módulo \`command\` quebra a idempotência:**
\`\`\`yaml
# ❌ Não idempotente — roda sempre
- command: mkdir /opt/app

# ✅ Idempotente — cria só se não existe
- file: path=/opt/app state=directory
\`\`\`

**Dica**: Prefira sempre módulos específicos (apt, file, template, service) ao command/shell. Quando for inevitável usar command, adicione \`creates:\` ou \`removes:\` como guard de idempotência.
    `,
    tags: ['ansible', 'playbook', 'idempotency', 'handlers']
  },
  {
    id: 'sre-error-budget',
    title: 'SRE Error Budget — A Matemática dos Noves',
    icon: <Activity className="text-warn" />,
    category: 'SRE',
    content: `
### Quanto tempo de falha seu SLO permite?

O error budget transforma um SLO abstrato em uma **quantidade concreta de falha tolerada** — e isso muda completamente como equipes tomam decisões.

**A conta dos noves:**

| SLO | Downtime/mês | Downtime/ano | Error budget (minutos/mês) |
|-----|-------------|-------------|--------------------------|
| 99% | 7h 18min | 3d 15h | 438 min |
| 99.9% | 43 min | 8h 45min | 43.2 min |
| 99.95% | 21 min | 4h 22min | 21.6 min |
| 99.99% | 4.3 min | 52 min | 4.32 min |

**Como o burn rate funciona:**

Com SLO 99.9%, o budget mensal é 43.2 minutos. Se 5% das requests estão com erro:
- Error rate = 0.05 → Taxa de consumo do budget = 5× mais rápido que o normal
- **Burn rate = 5×** → Budget esgotado em 43.2 × (1/5) × 30 dias = ~8.6 dias

Para alertas com alta precisão:
\`\`\`
burn_rate > 14.4 na última 1h → page imediato (5% do budget em 1h)
burn_rate > 6 na última 6h   → ticket urgente
burn_rate > 1 na última 3d   → revisão de sprint
\`\`\`

**O poder do error budget como ferramenta de decisão:**
- **Budget sobrando**: Feature flag liberada, deploy acelerado, experimentos permitidos.
- **Budget esgotado**: Freeze de deploys, foco em confiabilidade, revisão de postmortem.

O erro mais comum: tratar o SLO como "alvo de disponibilidade" em vez de **permissão para falhar controladamente**.
    `,
    tags: ['sre', 'slo', 'error-budget', 'burn-rate', 'prometheus']
  },
  {
    id: 'ebpf-maps-architecture',
    title: 'eBPF Maps — A Memória Compartilhada do Kernel',
    icon: <Cpu className="text-accent" />,
    category: 'eBPF',
    content: `
### Como programas eBPF persistem dados e se comunicam com o userspace

Um programa eBPF isolado não persiste estado — ele roda, processa um evento, e termina. **Maps** são a solução: estruturas de dados no kernel acessíveis tanto pelo programa eBPF quanto por ferramentas no userspace via syscall \`bpf()\`.

**Os 5 tipos mais importantes:**

| Tipo | Caso de uso | Complexidade |
|------|-------------|-------------|
| \`BPF_MAP_TYPE_HASH\` | Tabela de conexões, blocklist de IPs | O(1) amortizado |
| \`BPF_MAP_TYPE_ARRAY\` | Estatísticas por CPU, configurações | O(1) acesso direto |
| \`BPF_MAP_TYPE_LRU_HASH\` | Cache de sessões com eviction automática | O(1) com LRU |
| \`BPF_MAP_TYPE_PERF_EVENT_ARRAY\` | Enviar eventos para userspace (tcpdump-like) | Ring buffer por CPU |
| \`BPF_MAP_TYPE_RINGBUF\` | Envio eficiente de eventos (substitui PERF) | Ring buffer global |

**Exemplo prático — Cilium usa maps para load balancing:**
\`\`\`
# Visualizar a tabela de serviços do Cilium (substitui kube-proxy iptables)
cilium bpf lb list

# Ver endpoints de um serviço específico
cilium bpf lb list | grep 10.96.45.12
→ 10.96.45.12:80 → [10.0.1.5:80, 10.0.2.8:80, 10.0.3.2:80]
\`\`\`

**Por que eBPF maps são superiores a iptables para N serviços:**
- iptables: cada pacote percorre uma lista linear de N regras → **O(N)**
- eBPF hash map: lookup em tabela de hash → **O(1)** independente de N

Em clusters com 10.000 serviços Kubernetes, a diferença é 10.000 iptables rules percorridas vs 1 hash lookup — literalmente 3 ordens de magnitude de diferença em latência.
    `,
    tags: ['ebpf', 'kernel', 'cilium', 'maps', 'networking']
  },
  {
    id: 'cicd-pipeline-anatomy',
    title: 'GitHub Actions — Anatomia de um Pipeline Seguro',
    icon: <Rocket className="text-info" />,
    category: 'CI/CD',
    content: `
### O que separa um pipeline amador de um pipeline de produção

Um workflow básico do GitHub Actions funciona. Um pipeline de **produção** resolve 5 problemas adicionais que iniciantes ignoram:

**1. Secrets Management — não vaze credenciais:**
\`\`\`yaml
# ❌ Errado — exposto nos logs e no PR
- run: docker login -u $USER -p mypassword123

# ✅ Correto — secrets nunca aparecem nos logs
- uses: docker/login-action@v3
  with:
    username: \${{ secrets.DOCKERHUB_USERNAME }}
    password: \${{ secrets.DOCKERHUB_TOKEN }}
\`\`\`

**2. Permissões mínimas — princípio do menor privilégio:**
\`\`\`yaml
permissions:
  contents: read        # só ler o repo
  packages: write       # só para push no GHCR
  # tudo mais: implicitamente none
\`\`\`

**3. Concurrency — evitar race conditions no deploy:**
\`\`\`yaml
concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: true  # staging: cancela o anterior
  # cancel-in-progress: false  # produção: faz fila
\`\`\`

**4. Environments — aprovação humana antes de produção:**
\`\`\`yaml
deploy-prod:
  environment:
    name: production       # requer aprovação no GitHub Settings
    url: https://app.com
  needs: [test, deploy-staging]
\`\`\`

**5. Artifacts — passar builds entre jobs sem re-compilar:**
\`\`\`yaml
# Job 1: build
- uses: actions/upload-artifact@v4
  with: { name: dist, path: ./dist }

# Job 2: deploy (usa o mesmo artefato, não re-builda)
- uses: actions/download-artifact@v4
  with: { name: dist }
\`\`\`

**A regra de ouro**: Cada push para \`main\` deve passar por: lint → test → build → staging → aprovação → produção. Automatize tudo, mas mantenha humanos no loop para o último step.
    `,
    tags: ['cicd', 'github-actions', 'security', 'pipeline', 'devops']
  },
  {
    id: 'tls-handshake-deep',
    title: 'TLS 1.3 Handshake — Do ClientHello ao Dado Cifrado',
    icon: <Lock className="text-ok" />,
    category: 'SSL',
    content: `
### O que acontece em 1-RTT no TLS 1.3

O TLS 1.2 precisava de 2 Round-Trips (2-RTT) para negociar a sessão. O TLS 1.3 reduziu para **1-RTT** e melhorou a segurança eliminando cifras fracas.

**Fluxo completo TLS 1.3:**

\`\`\`
Cliente                         Servidor
  │── ClientHello ──────────────────>│
  │   (suported_versions: TLS 1.3)   │
  │   (key_share: Curve25519 pubkey) │
  │   (cipher_suites: AEAD only)     │
  │                                   │
  │<── ServerHello ──────────────────│
  │<── Certificate ──────────────────│  ← Certificado + cadeia
  │<── CertificateVerify ────────────│  ← Prova que tem a chave privada
  │<── Finished ─────────────────────│  ← HMAC de toda a negociação
  │                                   │
  │── Finished ──────────────────────>│  ← 1-RTT completo!
  │── [DADOS CIFRADOS] ──────────────>│  ← Pode enviar na mesma viagem
\`\`\`

**Por que Curve25519 e não RSA para o key exchange?**
RSA key exchange: o cliente gera a chave de sessão e cifra com a chave pública do servidor. Se a chave privada do servidor vazar DEPOIS, todos os registros do passado podem ser decifrados (**sem Forward Secrecy**).

Curve25519 (ECDH efêmero): ambos os lados geram pares de chaves efêmeras por sessão. A chave compartilhada é derivada via Diffie-Hellman. Se vazar a chave privada do certificado, as sessões antigas ficam seguras — **Perfect Forward Secrecy (PFS)**.

**Configuração Nginx para TLS 1.3 + PFS:**
\`\`\`nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;  # TLS 1.3 o cliente escolhe
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_stapling on;                # OCSP Stapling — evita roundtrip ao CA
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
\`\`\`

**OCSP Stapling:** sem ele, o cliente consulta o CA a cada conexão para verificar revogação do certificado — latência extra. Com stapling, o Nginx faz essa consulta e "grampeia" a resposta no handshake. O cliente recebe a prova de validade junto com o certificado, sem roundtrip adicional.

**Cadeia de certificados:** \`fullchain.pem\` (Let's Encrypt) contém leaf → intermediate. O browser valida até encontrar uma CA raiz no seu trust store. Se a cadeia estiver incompleta, mobile browsers falham mas desktop com cache pode não perceber.
    `,
    tags: ['ssl', 'tls', 'nginx', 'certificate', 'cryptography', 'forward-secrecy']
  },
  {
    id: 'wireguard-noise-protocol',
    title: 'Noise Protocol — A Criptografia por Trás do WireGuard',
    icon: <Key className="text-accent" />,
    category: 'VPN',
    content: `
### Por que o WireGuard é "absurdamente simples" — e isso é bom

O código-fonte do WireGuard tem ~4.000 linhas. O OpenVPN tem ~600.000. Menos código = menos superfície de ataque.

**As 3 primitivas criptográficas do WireGuard:**

| Função | Algoritmo | Por que |
|--------|-----------|---------|
| Key Agreement | Curve25519 | ECDH efêmero — PFS garantido |
| Encryption | ChaCha20-Poly1305 | AEAD — cifra + autentica em 1 operação |
| Hashing | BLAKE2s | 2× mais rápido que SHA-256 no software |

**Noise Protocol Framework — IKpsk2:**
\`\`\`
Iniciador                     Respondedor
    │── HandshakeInitiation ──────>│
    │   (ephemeral pubkey,          │
    │    encrypted static pubkey,   │
    │    timestamp cifrado)         │
    │                               │
    │<── HandshakeResponse ─────────│
    │    (ephemeral pubkey,          │
    │     empty encrypted payload)  │
    │                               │
    │<══ DataPackets ═══════════════│  ← Sessão estabelecida!
    │═══ DataPackets ══════════════>│  ← Cada pacote é um UDP cifrado
\`\`\`

**AllowedIPs — a tabela de rotas embutida no WireGuard:**
\`\`\`ini
[Peer]
PublicKey = abc123...
AllowedIPs = 10.0.0.2/32, 192.168.10.0/24
\`\`\`
Isso faz duas coisas: ① pacotes SAINDO para 10.0.0.2 ou 192.168.10.0/24 são cifrados e enviados para esse peer; ② pacotes CHEGANDO são aceitos APENAS se vierem com IP fonte dentro do AllowedIPs. É um filtro bidirecional automático — sem regras iptables extras para isolar peers.

**AllowedIPs = 0.0.0.0/0** redireciona TODO o tráfego pelo túnel (full tunnel). **0.0.0.0/0 exceto a rede local** é split tunnel manual — WireGuard não tem conceito nativo de split tunnel, você controla via AllowedIPs.

**Roaming automático:** WireGuard detecta mudança de IP/porta do peer (ex: troca de Wi-Fi para 4G) e atualiza o endpoint automaticamente sem reconexão. IPSec e OpenVPN precisam reestabelecer o túnel.
    `,
    tags: ['wireguard', 'vpn', 'cryptography', 'noise-protocol', 'curve25519']
  },
  {
    id: 'fail2ban-architecture',
    title: 'Fail2ban — Regex Engine, Backends e Chains iptables',
    icon: <Eye className="text-err" />,
    category: 'Security',
    content: `
### Como o Fail2ban realmente funciona (por dentro)

**Arquitetura em 3 camadas:**

\`\`\`
[Logs] ──> [Backend (inotify/systemd)] ──> [Filter (regex)] ──> [Action (iptables/firewalld)]
\`\`\`

**1. Backends de monitoramento:**

| Backend | Mecanismo | Quando usar |
|---------|-----------|-------------|
| \`auto\` | systemd se disponível, senão pyinotify | padrão — deixe assim |
| \`systemd\` | lê do journal via sd_journal | logs de serviços systemd |
| \`pyinotify\` | kernel inotify — notificado a cada write | arquivos físicos em /var/log |
| \`polling\` | lê arquivo a cada X segundos | NFS ou partições remotas |

**2. failregex — a arte do regex com \`<HOST>\`:**
\`\`\`ini
# /etc/fail2ban/filter.d/custom-app.conf
[Definition]
failregex = ^%(__prefix_line)s.*authentication failure.*rhost=<HOST>\s*$
            ^%(__prefix_line)sInvalid user .* from <HOST> port \d+$
ignoreregex = ^.*INFO.*health.check.*$  # ignora health checks
\`\`\`
\`<HOST>\` é substituído por \`(?:::f{4,6}:)?(?P<host>\S+)\` — captura IPv4 e IPv6. O grupo \`host\` é o que vira o IP banido.

**3. Chain iptables gerada automaticamente:**
\`\`\`bash
# Fail2ban cria uma chain própria por jail:
iptables -N f2b-sshd
iptables -A INPUT -p tcp --dport 22 -j f2b-sshd
iptables -A f2b-sshd -j RETURN  # regra padrão: passa

# Ao banir um IP, insere no topo da chain:
iptables -I f2b-sshd 1 -s 192.168.1.100 -j REJECT --reject-with icmp-port-unreachable
\`\`\`
Por que \`REJECT\` e não \`DROP\`? REJECT responde com ICMP "port unreachable" — o atacante sabe que foi bloqueado (não fica tentando indefinidamente). DROP faz o ataque parecer um timeout de rede — o bot pode tentar mais vezes. Em brute force, REJECT é mais eficiente.

**4. Bantime incremental (Fail2ban 0.11+):**
\`\`\`ini
[DEFAULT]
bantime.increment = true
bantime.factor = 1
bantime.formula = ban.Time * (1<<(ban.Count if ban.Count<20 else 20)) * banFactor
# 1ª vez: 10min → 2ª: 20min → 3ª: 40min → ... → máx: ~116 dias
\`\`\`
Bots que persistem são penalizados exponencialmente. Endereços legítimos que erram 1× voltam em 10 minutos.

**5. Testar sem banir:**
\`\`\`bash
fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf --print-all-matched
# Mostra quais linhas seriam capturadas — sem afetar IPs reais
\`\`\`
    `,
    tags: ['fail2ban', 'iptables', 'security', 'regex', 'brute-force']
  },
  {
    id: 'hardening-defense-depth',
    title: 'Defense in Depth — 3 Camadas de Segurança do Servidor',
    icon: <Shield className="text-warn" />,
    category: 'Security',
    content: `
### Por que uma camada nunca é suficiente

Defense in Depth assume que qualquer camada PODE ser comprometida. O objetivo é que o atacante precise comprometer TODAS as camadas — e cada camada compra tempo para detecção.

**Camada 1 — Acesso: SSH Hardening**
\`\`\`bash
# /etc/ssh/sshd_config
PasswordAuthentication no          # Apenas chave — senha = phishing vulnerável
PermitRootLogin no                 # Root direto = zero auditoria de "quem fez o quê"
AllowUsers deploy admin            # Allowlist explícita — usuário criado por atacante não entra
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
KexAlgorithms curve25519-sha256    # Apenas key exchange moderno
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com

# Auditoria:
sshd -T | grep -E "passwordauth|permitroot|allowusers"
\`\`\`

**Camada 2 — Kernel: sysctl de Defesa**
\`\`\`bash
# /etc/sysctl.d/99-hardening.conf
net.ipv4.tcp_syncookies = 1         # Mitigação de SYN flood sem perder conexões legítimas
net.ipv4.conf.all.rp_filter = 1     # Reverse path filtering — bloqueia IP spoofing
kernel.randomize_va_space = 2       # ASLR: aleatoriza endereços de memória (anti-exploit)
kernel.dmesg_restrict = 1           # Usuários não-root não veem mensagens do kernel
net.ipv4.conf.all.accept_redirects = 0  # Não aceita ICMP redirects (anti-MITM)
net.ipv6.conf.all.accept_redirects = 0
fs.protected_hardlinks = 1          # Evita hardlinks para arquivos de outros usuários
fs.protected_symlinks = 1           # Evita symlinks em sticky directories

sysctl -p /etc/sysctl.d/99-hardening.conf  # aplica sem reboot
\`\`\`

**Camada 3 — Aplicação: AppArmor MAC**
\`\`\`bash
# Mandatory Access Control: processo só faz o que o perfil permite
aa-status                           # ver perfis carregados
aa-enforce /etc/apparmor.d/usr.sbin.nginx  # ativar modo enforce
aa-complain /etc/apparmor.d/usr.sbin.nginx # modo complain: loga sem bloquear

# Nginx com AppArmor enforce: mesmo que nginx seja comprometido via RCE,
# o processo não consegue ler /etc/shadow, /root/, ou executar comandos
aa-logprof                          # analisa logs e sugere regras para o perfil
\`\`\`

**Como as 3 camadas trabalham juntas:**
\`\`\`
Atacante → Tenta senha via SSH           → Bloqueado (PasswordAuthentication no)
          → Explora bug no Nginx via RCE → AppArmor impede acesso a /etc/passwd
          → Tenta SYN flood para derrubar → tcp_syncookies absorve sem colapso
          → Tenta ler memória de outro processo → ASLR randomize_va_space=2
\`\`\`

**Auditoria completa em 4 comandos:**
\`\`\`bash
sshd -T | grep -E "passwordauth|permitroot"  # verificar SSH
sysctl net.ipv4.tcp_syncookies kernel.randomize_va_space  # verificar kernel
aa-status | grep enforce                     # verificar AppArmor
ss -tlnp | grep -v "127.0.0.1"              # portas expostas publicamente
\`\`\`
    `,
    tags: ['hardening', 'ssh', 'sysctl', 'apparmor', 'defense-in-depth', 'security']
  },
];
