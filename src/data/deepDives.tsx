import React from 'react';
import { Shield, Zap, Terminal, Search, Lock, Globe } from 'lucide-react';

export interface DeepDive {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: 'Firewall' | 'DNS' | 'Proxy' | 'SSL' | 'Kernel';
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
    `,
    tags: ['iptables', 'routing', 'nat']
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
  }
];
