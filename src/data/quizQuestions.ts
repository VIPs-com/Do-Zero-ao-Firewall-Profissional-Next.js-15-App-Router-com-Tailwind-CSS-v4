/**
 * Perguntas do Quiz — extraídas de `app/quiz/page.tsx` no Sprint F.
 *
 * Motivação: o array hardcoded (~270 linhas) inflava o bundle inicial da rota
 * /quiz. Mover para um módulo de dados permite tree-shaking melhor e deixa o
 * componente de página focado apenas em lógica/UI.
 */

export type QuizTrail = 'firewall' | 'fundamentos' | 'avancados';

export interface QuizQuestion {
  text: string;
  badge: string;
  options: string[];
  /** Índice (0-based) da opção correta em `options`. */
  correct: number;
  explanation: string;
  /** Trilha do workshop à qual a questão pertence. */
  trail: QuizTrail;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ========== Firewall e NAT ==========
  {
    text: 'Qual comando habilita o roteamento IP (ip_forward) temporariamente?',
    badge: '🌐 Camada 3',
    options: [
      'echo 1 > /proc/sys/net/ipv4/ip_forward',
      'sysctl -w net.ipv4.ip_forward=1',
      'iptables -A FORWARD -j ACCEPT',
      'ip route add default',
    ],
    correct: 1,
    explanation: 'sysctl -w net.ipv4.ip_forward=1 ativa o roteamento IP até o próximo reboot.',
    trail: 'firewall',
  },
  {
    text: 'Qual a diferença entre SNAT e MASQUERADE?',
    badge: '🌐 Camada 3',
    options: [
      'SNAT é para IPv6, MASQUERADE para IPv4',
      'SNAT usa IP fixo, MASQUERADE usa IP dinâmico da interface',
      'SNAT é mais lento que MASQUERADE',
      'Não há diferença, são sinônimos',
    ],
    correct: 1,
    explanation: 'SNAT requer IP fixo especificado; MASQUERADE descobre o IP automaticamente (útil para DHCP).',
    trail: 'firewall',
  },
  {
    text: 'Para que serve o parâmetro "net.ipv4.conf.all.rp_filter = 1" no sysctl?',
    badge: '🌐 Camada 3',
    options: [
      'Ativa o roteamento entre interfaces de rede',
      'Habilita proteção contra IP spoofing (Reverse Path Filter)',
      'Desativa o ICMP redirect para prevenir ataques MiTM',
      'Configura o tamanho máximo do buffer de pacotes IP',
    ],
    correct: 1,
    explanation: 'rp_filter (Reverse Path Filter) verifica se o pacote chegou pela interface correta para o IP de origem. Se um pacote com IP de origem 1.2.3.4 chegar pela interface LAN mas a rota para 1.2.3.4 é pela WAN, o kernel descarta — evita IP spoofing.',
    trail: 'firewall',
  },
  {
    text: 'O DNAT é configurado em qual chain do iptables?',
    badge: '🎯 DNAT',
    options: ['INPUT', 'OUTPUT', 'PREROUTING', 'POSTROUTING'],
    correct: 2,
    explanation: 'DNAT precisa acontecer ANTES da decisão de roteamento, por isso fica no PREROUTING.',
    trail: 'firewall',
  },
  {
    text: 'Um servidor interno na LAN (192.168.57.10:80) deve ser acessado da WAN. Qual regra DNAT está correta?',
    badge: '🎯 DNAT',
    options: [
      'iptables -t nat -A POSTROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.57.10:80',
      'iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.57.10:80',
      'iptables -A FORWARD -p tcp --dport 80 -j ACCEPT',
      'iptables -t nat -A INPUT -p tcp --dport 80 -j DNAT --to-destination 192.168.57.10:80',
    ],
    correct: 1,
    explanation: 'DNAT fica na tabela nat, chain PREROUTING. Também é necessário uma regra FORWARD permitindo o tráfego após o DNAT.',
    trail: 'firewall',
  },
  {
    text: 'Por que o módulo conntrack é essencial para o DNAT funcionar corretamente?',
    badge: '🎯 DNAT',
    options: [
      'Ele bloqueia pacotes duplicados na tradução de endereços',
      'Ele rastreia conexões e aplica DNAT reverso automaticamente nas respostas',
      'Ele autentica o servidor de destino antes de redirecionar',
      'Ele verifica se a porta destino está aberta antes do redirect',
    ],
    correct: 1,
    explanation: 'O conntrack garante que as respostas do servidor interno (que têm IP origem 192.168.57.10) sejam traduzidas de volta para o IP do firewall automaticamente — sem isso o cliente não receberia as respostas.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando mostra a lista de IPs autorizados pelo Port Knocking?',
    badge: '🔑 Port Knocking',
    options: [
      'iptables -L INPUT',
      'cat /proc/net/xt_recent/abre-ssh',
      'conntrack -L',
      'ss -tulpn | grep 22',
    ],
    correct: 1,
    explanation: 'O módulo recent mantém a lista em /proc/net/xt_recent/ com o nome da lista (ex: abre-ssh).',
    trail: 'firewall',
  },
  {
    text: 'Por que o Port Knocking não substitui completamente a regra ESTABLISHED no iptables?',
    badge: '🔑 Port Knocking',
    options: [
      'Porque o Port Knocking só funciona com IPv6',
      'Porque o módulo recent expira após um timer curto, mas o conntrack mantém conexões já estabelecidas indefinidamente',
      'Porque ESTABLISHED só funciona na chain INPUT, não no PREROUTING',
      'Porque o Port Knocking usa UDP e ESTABLISHED só funciona com TCP',
    ],
    correct: 1,
    explanation: 'São dois mecanismos independentes: o Port Knocking abre a porta temporariamente (timer de segundos). O conntrack ESTABLISHED mantém conexões já autorizadas pelo tempo necessário. Sem ESTABLISHED, cada pacote de uma sessão SSH teria que "bater" de novo.',
    trail: 'firewall',
  },
  {
    text: 'Um atacante monitora a rede e replay os mesmos pacotes de knock. O que acontece?',
    badge: '🔑 Port Knocking',
    options: [
      'O ataque funciona: replicar os pacotes abre a porta normalmente',
      'O ataque falha se houver timeout: o módulo recent expira a entrada antes do replay',
      'O ataque sempre falha porque iptables usa checksums únicos',
      'O ataque funciona apenas se os pacotes forem enviados em menos de 1 segundo',
    ],
    correct: 1,
    explanation: 'O módulo recent usa timestamps. Se o replay demorar mais que o timeout da sequência (ex: 10s), a entrada expira e o replay não abre nada. Para maior segurança, use Port Knocking com sequências únicas por sessão (SPA — Single Packet Auth).',
    trail: 'firewall',
  },
  {
    text: 'Qual a função da regra ESTABLISHED no iptables?',
    badge: '🛡️ Firewall',
    options: [
      'Bloquear novas conexões',
      'Permitir respostas de conexões já autorizadas',
      'Registrar logs de conexões',
      'Redirecionar portas',
    ],
    correct: 1,
    explanation: 'ESTABLISHED permite que respostas de conexões já autorizadas passem sem verificar regras novamente.',
    trail: 'firewall',
  },

  // ========== DNS ==========
  {
    text: 'Qual registro DNS faz o mapeamento reverso (IP → Nome)?',
    badge: '📖 DNS',
    options: ['Registro A', 'Registro CNAME', 'Registro MX', 'Registro PTR'],
    correct: 3,
    explanation: 'PTR (Pointer) é usado para DNS reverso, associando um IP a um nome de domínio.',
    trail: 'firewall',
  },
  {
    text: 'Qual protocolo o DNS usa na porta 53?',
    badge: '📖 DNS',
    options: ['Apenas TCP', 'Apenas UDP', 'UDP e TCP', 'ICMP'],
    correct: 2,
    explanation: 'DNS usa UDP para consultas curtas e TCP para transferências de zona e respostas longas.',
    trail: 'firewall',
  },
  {
    text: 'O que é o registro SOA no DNS?',
    badge: '📖 DNS',
    options: [
      'Server of Authority — define qual servidor responde',
      'Start of Authority — define parâmetros da zona (TTL, serial, refresh)',
      'Source of Address — mapeia IP para nome',
      'System of Access — controle de acesso DNS',
    ],
    correct: 1,
    explanation: 'SOA (Start of Authority) define TTL, serial, refresh, retry e expire da zona DNS.',
    trail: 'firewall',
  },

  // ========== SSL/TLS ==========
  {
    text: 'O que significa PKI?',
    badge: '🔒 SSL',
    options: [
      'Public Key Infrastructure',
      'Private Key Interface',
      'Protocol Key Integration',
      'Public Knowledge Internet',
    ],
    correct: 0,
    explanation: 'PKI é a infraestrutura de chave pública que gerencia certificados digitais.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando gera uma chave privada RSA 2048 bits?',
    badge: '🔒 SSL',
    options: [
      'openssl rsa -genkey 2048',
      'openssl genrsa -out key.pem 2048',
      'ssh-keygen -t rsa -b 2048',
      'certbot generate key 2048',
    ],
    correct: 1,
    explanation: 'openssl genrsa é o comando correto para gerar chave RSA com OpenSSL.',
    trail: 'firewall',
  },
  {
    text: 'Qual a função do cabeçalho HSTS?',
    badge: '🔒 SSL',
    options: [
      'Força o navegador a sempre usar HTTPS',
      'Desabilita a criptografia SSL',
      'Aumenta o TTL do DNS',
      'Redirecionar HTTP para HTTPS',
    ],
    correct: 0,
    explanation: 'HSTS (HTTP Strict Transport Security) força o navegador a usar HTTPS mesmo se o usuário digitar HTTP.',
    trail: 'firewall',
  },

  // ========== Squid Proxy ==========
  {
    text: 'Qual a porta padrão do Squid Proxy?',
    badge: '🚪 Squid',
    options: ['80', '443', '3128', '8080'],
    correct: 2,
    explanation: 'Squid escuta na porta 3128 por padrão.',
    trail: 'firewall',
  },
  {
    text: 'Qual a diferença entre dstdomain e url_regex no Squid?',
    badge: '🚪 Squid',
    options: [
      'dstdomain bloqueia IPs, url_regex bloqueia domínios',
      'dstdomain é mais rápido e funciona com HTTPS, url_regex é mais lento',
      'São equivalentes, mudam só a sintaxe',
      'url_regex funciona offline, dstdomain precisa de internet',
    ],
    correct: 1,
    explanation: 'dstdomain verifica só o domínio (mais rápido, funciona com HTTPS); url_regex analisa URL inteira (mais lento).',
    trail: 'firewall',
  },
  {
    text: 'Qual a melhor prática para HTTPS no Squid?',
    badge: '🚪 Squid',
    options: [
      'Usar url_regex para filtrar URLs completas',
      'Usar dstdomain para bloquear domínios inteiros',
      'Desabilitar proxy para HTTPS',
      'Usar SSL Bump para tudo',
    ],
    correct: 1,
    explanation: 'Como HTTPS criptografa a URL, o Squid só vê o domínio. dstdomain é a melhor prática.',
    trail: 'firewall',
  },

  // ========== DIAGNÓSTICO ==========
  {
    text: "Se o comando 'ping 8.8.8.8' funciona mas 'ping google.com' falha, qual é o problema?",
    badge: '🔧 Diagnóstico',
    options: [
      'Camada 1 (placa de rede)',
      'Camada 2 (ARP)',
      'Camada 3 (roteamento)',
      'Camada 7 (DNS)',
    ],
    correct: 3,
    explanation: 'Ping por IP funciona, mas por nome não → o DNS está quebrado. Elimina Camadas 1-4 de uma vez!',
    trail: 'firewall',
  },
  {
    text: 'Qual comando mostra a tabela ARP (mapeamento IP → MAC) da sua máquina?',
    badge: '🔧 Diagnóstico',
    options: ['ip link show', 'ip neigh show', 'ss -tulpn', 'tcpdump -i any'],
    correct: 1,
    explanation: 'ip neigh show mostra a tabela ARP, essencial para diagnóstico da Camada 2.',
    trail: 'firewall',
  },
  {
    text: 'O que significa a flag [R] em uma captura de tcpdump?',
    badge: '🦈 Análise de Pacotes',
    options: [
      'SYN (início de conexão)',
      'ACK (confirmação)',
      'RST (conexão rejeitada)',
      'FIN (encerramento)',
    ],
    correct: 2,
    explanation: 'RST (Reset) indica que a conexão foi rejeitada — geralmente firewall bloqueando ou serviço não ouvindo.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando captura tráfego na porta 443 e salva em arquivo para análise no Wireshark?',
    badge: '🦈 Análise de Pacotes',
    options: [
      'tcpdump -i any -nn port 443 -w captura.pcap',
      'tcpdump -i any port 443 > captura.txt',
      'wireshark -i any -w captura.pcap',
      'tcpflow -p 443 -w captura.pcap',
    ],
    correct: 0,
    explanation: 'tcpdump -w captura.pcap salva em formato PCAP, que pode ser aberto no Wireshark.',
    trail: 'firewall',
  },
  {
    text: 'Qual filtro tcpdump captura apenas pacotes SYN (início de conexão TCP) sem os ACK?',
    badge: '🦈 Análise de Pacotes',
    options: [
      'tcpdump -i any tcp',
      'tcpdump -i any "tcp[13] == 2"',
      'tcpdump -i any "tcp flags SYN"',
      'tcpdump -i any "tcp[tcpflags] & tcp-syn != 0 and not tcp-ack"',
    ],
    correct: 3,
    explanation: '"tcp[tcpflags] & tcp-syn != 0 and not tcp-ack" captura pacotes com flag SYN sem ACK — exatamente os pacotes de início de nova conexão. Útil para detectar port scans ou conexões legítimas.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando mostra as portas abertas e os serviços ouvindo no servidor?',
    badge: '🔧 Diagnóstico',
    options: ['iptables -L -n -v', 'ip route show', 'ss -tulpn', 'conntrack -L'],
    correct: 2,
    explanation: 'ss -tulpn lista todas as portas abertas e qual processo está escutando em cada uma.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando verifica o handshake SSL/TLS de um servidor?',
    badge: '🔒 Diagnóstico SSL',
    options: [
      'curl -k https://site',
      'openssl s_client -connect site:443',
      'ss -tulpn | grep 443',
      'tcpdump port 443',
    ],
    correct: 1,
    explanation: 'openssl s_client conecta e mostra todo o handshake SSL/TLS, incluindo certificado e cifras negociadas.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando exibe o conteúdo completo (datas de validade, CN, SANs) de um certificado SSL em arquivo PEM?',
    badge: '🔒 Diagnóstico SSL',
    options: [
      'openssl verify -in cert.pem',
      'openssl x509 -in cert.pem -text -noout',
      'openssl s_client -cert cert.pem',
      'openssl req -in cert.pem -noout -text',
    ],
    correct: 1,
    explanation: 'openssl x509 -text -noout decodifica e exibe todo o certificado: subject, issuer, validity, SANs, extensões. Essencial para depurar "certificate expired" ou "hostname mismatch".',
    trail: 'firewall',
  },
  {
    text: 'O Nginx retorna "SSL_ERROR_RX_RECORD_TOO_LONG" para o cliente. Qual é a causa mais provável?',
    badge: '🔒 Diagnóstico SSL',
    options: [
      'O certificado SSL está expirado',
      'O Nginx está servindo HTTP puro na porta 443 (falta listen 443 ssl)',
      'O cliente não suporta TLS 1.3',
      'O arquivo dhparam.pem foi gerado com tamanho insuficiente',
    ],
    correct: 1,
    explanation: 'Esse erro clássico ocorre quando o cliente tenta fazer handshake TLS mas recebe uma resposta HTTP pura — o servidor está ouvindo na 443 mas sem SSL configurado. Verificar: "listen 443 ssl" + ssl_certificate no bloco server do Nginx.',
    trail: 'firewall',
  },

  // ========== VPN & IPSec ==========
  {
    text: 'Qual protocolo é usado para estabelecer e gerenciar chaves no IPSec?',
    badge: '🔒 VPN & IPSec',
    options: ['ESP', 'AH', 'IKE', 'NAT-T'],
    correct: 2,
    explanation: 'IKE (Internet Key Exchange) é o protocolo responsável por estabelecer e gerenciar as chaves de criptografia no IPSec.',
    trail: 'firewall',
  },
  {
    text: 'Qual a porta padrão do IKE (Internet Key Exchange) no IPSec?',
    badge: '🔒 VPN & IPSec',
    options: ['500/UDP', '4500/UDP', '50/ESP', '51/AH'],
    correct: 0,
    explanation: 'IKE usa a porta 500/UDP para negociação inicial. NAT-T usa a porta 4500/UDP quando há NAT no caminho.',
    trail: 'firewall',
  },
  {
    text: 'O que é NAT-T (NAT Traversal) no IPSec?',
    badge: '🔒 VPN & IPSec',
    options: [
      'Técnica para acelerar a VPN',
      'Encapsula tráfego IPSec em UDP na porta 4500',
      'Desabilita a criptografia',
      'Aumenta o MTU do túnel',
    ],
    correct: 1,
    explanation: 'NAT-T encapsula pacotes ESP em UDP na porta 4500 para que possam atravessar roteadores NAT sem problemas.',
    trail: 'firewall',
  },
  {
    text: 'Qual é a versão mais moderna do IKE, que suporta MOBIKE (roaming entre redes)?',
    badge: '🔒 VPN & IPSec',
    options: ['IKEv1', 'IKEv2', 'IKEv3', 'IKE-MOBIKE'],
    correct: 1,
    explanation: 'IKEv2 é a versão moderna, mais rápida e segura. Suporta MOBIKE, permitindo que a VPN continue ativa ao mudar de rede (ex: Wi-Fi → 4G).',
    trail: 'firewall',
  },
  {
    text: 'Qual implementação de IPSec é mais usada no Linux?',
    badge: '🔒 VPN & IPSec',
    options: ['OpenVPN', 'WireGuard', 'StrongSwan', 'ipsec-tools'],
    correct: 2,
    explanation: 'StrongSwan é a implementação mais popular de IPSec no Linux, suportando IKEv1, IKEv2, certificados X.509 e integração com sistemas de autenticação.',
    trail: 'firewall',
  },
  {
    text: 'O que é MOBIKE no contexto de VPN IPSec?',
    badge: '🔒 VPN & IPSec',
    options: [
      'Mobile IKE — permite que a VPN continue ativa ao trocar de rede',
      'Modo de criptografia mais forte',
      'Método de autenticação por celular',
      'Protocolo de compressão de dados',
    ],
    correct: 0,
    explanation: 'MOBIKE (Mobility and Multihoming) é uma extensão do IKEv2 que permite que a VPN mantenha a conexão ativa mesmo quando o dispositivo muda de rede (ex: Wi-Fi para 4G).',
    trail: 'firewall',
  },

  // ========== Persistência & Operações (Sprint R) ==========
  {
    text: 'Qual comando salva todas as regras iptables ativas em um arquivo?',
    badge: '🛡️ Firewall',
    options: [
      'iptables -L > /etc/firewall/regras.ipt',
      'iptables-save > /etc/firewall/regras.ipt',
      'iptables --export /etc/firewall/regras.ipt',
      'cp /proc/net/ip_tables /etc/firewall/regras.ipt',
    ],
    correct: 1,
    explanation: 'iptables-save exporta todas as regras no formato que iptables-restore consegue reimportar.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando restaura regras iptables a partir de um arquivo salvo?',
    badge: '🛡️ Firewall',
    options: [
      'iptables -F < regras.ipt',
      'iptables --import regras.ipt',
      'iptables-restore < /etc/firewall/regras.ipt',
      'source /etc/firewall/regras.ipt',
    ],
    correct: 2,
    explanation: 'iptables-restore lê o formato gerado por iptables-save e aplica todas as regras atomicamente.',
    trail: 'firewall',
  },
  {
    text: 'No systemd, qual diretiva garante que o serviço de firewall inicie APÓS a rede estar disponível?',
    badge: '⚙️ systemd',
    options: [
      'Requires=network.target',
      'After=network-online.target',
      'WantedBy=network.target',
      'Before=networking.service',
    ],
    correct: 1,
    explanation: 'After=network-online.target garante que a rede esteja plenamente funcional antes do serviço iniciar.',
    trail: 'firewall',
  },
  {
    text: 'Qual flag do iptables permite especificar múltiplas portas em uma única regra?',
    badge: '🛡️ Firewall',
    options: [
      '--dports (sem módulo)',
      '-m multiport --dports',
      '-p tcp --dport 25,110,143',
      '-m portrange --range 25:995',
    ],
    correct: 1,
    explanation: 'O módulo multiport (-m multiport) permite listar várias portas com --dports em uma regra só.',
    trail: 'firewall',
  },
  {
    text: 'O que acontece quando um pacote atinge uma regra LOG no iptables?',
    badge: '🛡️ Firewall',
    options: [
      'O pacote é logado e descartado automaticamente',
      'O pacote é logado e aceito automaticamente',
      'O pacote é logado e continua para a próxima regra (LOG não é terminal)',
      'O pacote é duplicado — um vai pro log, outro segue',
    ],
    correct: 2,
    explanation: 'LOG é um target não-terminante: registra o pacote no syslog e continua avaliando as regras seguintes. Você precisa de um DROP ou ACCEPT depois.',
    trail: 'firewall',
  },
  {
    text: 'Para que serve o RemainAfterExit=yes no firewall.service?',
    badge: '⚙️ systemd',
    options: [
      'Reinicia o serviço automaticamente se ele falhar',
      'Mantém o serviço como "active" mesmo após o script oneshot terminar',
      'Impede que o serviço seja parado manualmente',
      'Executa o ExecStop quando o sistema desliga',
    ],
    correct: 1,
    explanation: 'Com Type=oneshot e RemainAfterExit=yes, o systemd marca o serviço como "active (exited)" após o script terminar. Sem isso, o status ficaria "inactive" e systemctl stop não chamaria o ExecStop.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando exibe os serviços que mais atrasaram o boot do sistema?',
    badge: '⚙️ systemd',
    options: [
      'journalctl -b --priority=crit',
      'systemctl list-units --type=service',
      'systemd-analyze blame',
      'dmesg | grep slow',
    ],
    correct: 2,
    explanation: '"systemd-analyze blame" lista os serviços ordenados pelo tempo que levaram para iniciar — essencial para diagnosticar boots lentos e decidir quais serviços desativar.',
    trail: 'firewall',
  },

  // ========== WireGuard ==========
  {
    text: 'Qual algoritmo criptográfico o WireGuard usa para troca de chaves (ECDH)?',
    badge: '🔐 WireGuard',
    options: ['RSA-4096', 'AES-256-GCM', 'Curve25519', 'Diffie-Hellman clássico'],
    correct: 2,
    explanation: 'WireGuard usa Curve25519 para ECDH (troca de chaves) e ChaCha20-Poly1305 para cifragem de dados — mais rápido que AES em hardware sem AES-NI.',
    trail: 'firewall',
  },
  {
    text: 'O que significa AllowedIPs = 0.0.0.0/0 na configuração de um cliente WireGuard?',
    badge: '🔐 WireGuard',
    options: [
      'Permite apenas a subnet da VPN (split tunnel)',
      'Bloqueia todo o tráfego externo',
      'Todo o tráfego passa pelo servidor (full tunnel)',
      'Libera o cliente para qualquer rede',
    ],
    correct: 2,
    explanation: 'AllowedIPs = 0.0.0.0/0 é o "full tunnel" — todo o tráfego do cliente é roteado pelo servidor WireGuard. Para split tunnel, use apenas a subnet específica (ex: 10.0.0.0/24).',
    trail: 'firewall',
  },
  {
    text: 'Qual porta e protocolo o WireGuard usa por padrão?',
    badge: '🔐 WireGuard',
    options: ['1194/UDP (como OpenVPN)', '500/UDP (como IKEv1)', '51820/UDP', '4500/TCP'],
    correct: 2,
    explanation: 'WireGuard usa UDP pela porta 51820 por padrão (configurável com ListenPort). UDP é essencial para o desempenho — WireGuard não suporta TCP.',
    trail: 'firewall',
  },

  // ========== Fail2ban ==========
  {
    text: 'O que é uma "jail" no Fail2ban?',
    badge: '🚫 Fail2ban',
    options: [
      'Um container de segurança para isolar processos',
      'Uma regra iptables para bloquear um IP',
      'A combinação de logpath + filtro regex + ação de ban',
      'Uma lista de IPs permanentemente banidos',
    ],
    correct: 2,
    explanation: 'Uma jail é a unidade de configuração do Fail2ban: define qual log monitorar (logpath), qual padrão detectar (filter/failregex) e qual ação executar ao atingir maxretry.',
    trail: 'firewall',
  },
  {
    text: 'Por que editar jail.local e não jail.conf diretamente no Fail2ban?',
    badge: '🚫 Fail2ban',
    options: [
      'jail.conf não existe — jail.local é o único arquivo',
      'jail.conf é sobrescrito em atualizações; jail.local persiste',
      'jail.local tem prioridade menor e é mais seguro',
      'Não há diferença — são arquivos equivalentes',
    ],
    correct: 1,
    explanation: 'jail.conf é sobrescrito a cada atualização do pacote. jail.local herda todos os defaults do jail.conf e sobrescreve apenas as chaves que você define — suas configurações nunca são perdidas.',
    trail: 'firewall',
  },
  {
    text: 'O que o parâmetro findtime controla no Fail2ban?',
    badge: '🚫 Fail2ban',
    options: [
      'O tempo de duração do ban em segundos',
      'O intervalo entre varreduras do log',
      'A janela de tempo para contar tentativas falhas',
      'O tempo máximo de conexão SSH',
    ],
    correct: 2,
    explanation: 'findtime define a janela de tempo: se um IP fizer maxretry falhas dentro de findtime segundos, ele é banido. Ex: maxretry=3 + findtime=600 = 3 falhas em 10 minutos.',
    trail: 'firewall',
  },

  // ========== nftables ==========
  {
    text: 'Qual a principal vantagem dos "sets" nativos do nftables em relação ao iptables?',
    badge: '🔥 nftables',
    options: [
      'São mais fáceis de configurar via interface gráfica',
      'Verificação O(1) — eficiente independente do tamanho da lista',
      'Sincronizam automaticamente com fail2ban',
      'São compatíveis com iptables sem conversão',
    ],
    correct: 1,
    explanation: 'No iptables, bloquear 1000 IPs exige 1000 regras avaliadas sequencialmente (O(n)). No nftables, um set usa hash/lookup em O(1) — o mesmo tempo independente de ter 1 ou 1 milhão de entradas.',
    trail: 'firewall',
  },
  {
    text: 'O que o comando "nft flush ruleset" faz?',
    badge: '🔥 nftables',
    options: [
      'Salva o ruleset atual em /etc/nftables.conf',
      'Lista todas as regras ativas',
      'Remove TODAS as tabelas, chains e regras',
      'Recarrega o ruleset do arquivo de configuração',
    ],
    correct: 2,
    explanation: 'nft flush ruleset remove completamente todas as tabelas, chains e regras ativas. Cuidado em produção: equivale a um "iptables -F + iptables -X" em todas as tabelas de uma vez.',
    trail: 'firewall',
  },
  {
    text: 'Qual ferramenta converte automaticamente regras iptables para sintaxe nftables?',
    badge: '🔥 nftables',
    options: ['nft convert', 'iptables-translate', 'nft import', 'iptables-to-nft'],
    correct: 1,
    explanation: 'iptables-translate converte uma regra iptables para o equivalente nftables. Ex: iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT → nft add rule ip filter input tcp dport 22 accept.',
    trail: 'firewall',
  },

  // ========== Hardening Linux ==========
  {
    text: 'Qual diretiva do sshd_config desativa autenticação por senha, exigindo chave SSH?',
    badge: '🔐 Hardening',
    options: ['RequireKey yes', 'PasswordAuthentication no', 'AuthMethod publickey', 'DisablePasswords yes'],
    correct: 1,
    explanation: 'PasswordAuthentication no desativa login por senha no SSH. Após configurar, apenas autenticação por chave pública funciona. SEMPRE teste a chave antes de aplicar para não se trancar fora do servidor.',
    trail: 'firewall',
  },
  {
    text: 'O que o sysctl kernel.randomize_va_space = 2 habilita no Linux?',
    badge: '🔐 Hardening',
    options: [
      'Desativa o ASLR por completo',
      'ASLR parcial — randomiza apenas a pilha',
      'ASLR completo — randomiza pilha, heap e bibliotecas',
      'Proteção contra SYN Flood',
    ],
    correct: 2,
    explanation: 'ASLR (Address Space Layout Randomization) com valor 2 randomiza completamente o espaço de endereçamento (pilha, heap, bibliotecas). Dificulta exploits de buffer overflow que dependem de endereços fixos.',
    trail: 'firewall',
  },

  {
    text: 'Qual módulo do AppArmor "força" um perfil de segurança em um processo, bloqueando ações não autorizadas?',
    badge: '🔐 Hardening',
    options: [
      'aa-status',
      'aa-enforce',
      'aa-complain',
      'aa-disable',
    ],
    correct: 1,
    explanation: '"aa-enforce" coloca o perfil em modo enforce: ações não permitidas são bloqueadas e registradas. "aa-complain" apenas loga sem bloquear — útil para criar perfis. "aa-status" apenas lista perfis ativos.',
    trail: 'firewall',
  },

  // ========== Docker Networking ==========
  {
    text: 'O que acontece no iptables quando você usa a flag -p 8080:80 no Docker?',
    badge: '🐳 Docker',
    options: [
      'Docker abre uma porta no firewall do host',
      'Docker cria uma regra DNAT automática na chain DOCKER',
      'Docker cria uma regra MASQUERADE para o container',
      'Docker adiciona uma rota no kernel para o container',
    ],
    correct: 1,
    explanation: 'O Docker cria automaticamente uma regra DNAT na chain DOCKER (na tabela nat, em PREROUTING): pacotes chegando na porta 8080 do host são redirecionados para a porta 80 do container. É o mesmo conceito do módulo DNAT, automatizado.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando inspeciona as configurações de uma rede Docker, mostrando subnet e containers conectados?',
    badge: '🐳 Docker',
    options: ['docker inspect --network bridge', 'docker network inspect bridge', 'docker ps --format network', 'docker network ls --verbose'],
    correct: 1,
    explanation: 'docker network inspect NOME mostra todas as configurações da rede: subnet, gateway, driver e quais containers estão conectados com seus IPs internos.',
    trail: 'firewall',
  },

  {
    text: 'O que a chain DOCKER-USER permite fazer que a chain DOCKER não permite?',
    badge: '🐳 Docker',
    options: [
      'Criar regras persistentes que sobrevivem ao reinício do Docker',
      'Adicionar regras de filtragem que o Docker não sobrescreve automaticamente',
      'Bloquear containers de acessar a internet',
      'Definir limites de bandwidth por container',
    ],
    correct: 1,
    explanation: 'A chain DOCKER é gerenciada exclusivamente pelo daemon Docker — ele a recria/sobrescreve. A DOCKER-USER é invocada antes da DOCKER e preserva suas regras. Adicione bloqueios e restrições na DOCKER-USER, não na DOCKER.',
    trail: 'firewall',
  },

  // ========== Docker Compose ==========
  {
    text: 'O que internal: true em uma rede do docker-compose.yml faz?',
    badge: '🐙 Compose',
    options: [
      'Cria uma rede visível apenas dentro do container',
      'Desativa o DNS interno da rede',
      'Bloqueia toda comunicação externa — sem acesso à internet',
      'Ativa o modo isolado apenas para o serviço db',
    ],
    correct: 2,
    explanation: 'internal: true na definição da rede bloqueia qualquer tráfego externo — nem saída para a internet é permitida. Ideal para redes de banco de dados que não precisam de acesso externo e não devem tê-lo.',
    trail: 'firewall',
  },
  {
    text: 'Qual a diferença entre "docker compose down" e "docker compose down -v"?',
    badge: '🐙 Compose',
    options: [
      'Não há diferença prática entre os dois',
      'down -v para containers mais rapidamente com SIGKILL',
      'down -v remove também os volumes nomeados (apaga dados persistidos)',
      'down -v remove também as imagens baixadas',
    ],
    correct: 2,
    explanation: 'docker compose down apenas para e remove containers e redes. O flag -v também remove os volumes nomeados definidos no compose file — apagando dados do banco e qualquer dado persistido. Use com extremo cuidado em produção.',
    trail: 'firewall',
  },

  {
    text: 'No docker-compose.yml, qual campo garante que um serviço só inicie após outro estar "saudável" (passou no healthcheck)?',
    badge: '🐙 Compose',
    options: [
      'depends_on: [db]',
      'depends_on: { db: { condition: service_healthy } }',
      'requires: [db]',
      'wait_for: [db:healthy]',
    ],
    correct: 1,
    explanation: 'depends_on com condition: service_healthy aguarda o healthcheck do serviço dependente passar antes de iniciar. "depends_on: [db]" simples aguarda apenas o container iniciar, não o serviço estar pronto — o banco de dados pode ainda estar inicializando.',
    trail: 'firewall',
  },

  // ========== SSH 2FA / TOTP ==========
  {
    text: 'O que significa TOTP e qual é a janela de validade de cada código?',
    badge: '📱 SSH 2FA',
    options: [
      'Temporary One-Time Password — válido por 60 segundos',
      'Time-based One-Time Password — válido por 30 segundos',
      'Token-based OTP Protocol — válido por 10 segundos',
      'Two-factor One-Time Password — válido por 2 minutos',
    ],
    correct: 1,
    explanation: 'TOTP (Time-based One-Time Password, RFC 6238) gera um código de 6 dígitos usando HMAC-SHA1(secret, floor(unixtime/30)). Cada código é válido por 30 segundos e só pode ser usado uma vez.',
    trail: 'firewall',
  },
  {
    text: 'Em qual arquivo PAM a linha do Google Authenticator deve ser adicionada para proteger o SSH com 2FA?',
    badge: '📱 SSH 2FA',
    options: ['/etc/pam.d/login', '/etc/pam.d/sshd', '/etc/ssh/pam.conf', '/etc/security/pam_google.conf'],
    correct: 1,
    explanation: '/etc/pam.d/sshd é o arquivo PAM específico do OpenSSH. Adicionar "auth required pam_google_authenticator.so" nele faz o SSH chamar o módulo TOTP durante a autenticação.',
    trail: 'firewall',
  },

  {
    text: 'Por que é obrigatório ter uma sessão SSH aberta SEPARADA ao testar o 2FA no sshd?',
    badge: '📱 SSH 2FA',
    options: [
      'Para comparar os logs de autenticação em tempo real',
      'Para evitar se trancar fora: se a configuração quebrar, a sessão existente continua funcionando',
      'Porque o sshd exige duas sessões simultâneas para ativar o 2FA',
      'Para que o Google Authenticator sincronize o código em ambas as sessões',
    ],
    correct: 1,
    explanation: 'Ao reconfigurar /etc/pam.d/sshd e sshd_config, um erro de sintaxe pode impedir qualquer novo login. Manter uma sessão SSH aberta garante acesso para corrigir o problema — sem ela, a única opção seria acesso físico ou console de emergência.',
    trail: 'firewall',
  },

  // ========== Pivoteamento ==========
  {
    text: 'Qual configuração de firewall impede que um servidor DMZ comprometido inicie conexões para a rede LAN interna?',
    badge: '🎭 Pivoteamento',
    options: [
      'Adicionar regra ACCEPT no FORWARD para tráfego ESTABLISHED entre DMZ e LAN',
      'Política padrão DROP no FORWARD sem nenhuma regra permitindo DMZ → LAN',
      'Bloquear o tráfego de entrada na DMZ via regra INPUT com -j DROP',
      'Aplicar MASQUERADE na chain POSTROUTING para ocultar os IPs da LAN',
    ],
    correct: 1,
    explanation: 'O princípio é: a DMZ nunca inicia conexões. A política padrão iptables -P FORWARD DROP, sem nenhuma regra Allow da DMZ para a LAN, garante que um servidor comprometido não consiga alcançar a rede interna.',
    trail: 'firewall',
  },
  {
    text: 'O que é um "reverse shell" e por que ele contorna firewalls de entrada?',
    badge: '🎭 Pivoteamento',
    options: [
      'O atacante abre uma porta no servidor comprometido e aguarda conexões de entrada',
      'O servidor comprometido inicia uma conexão de SAÍDA para o atacante — contorna regras que bloqueiam entrada',
      'Um ataque que inverte as ACLs do iptables temporariamente',
      'Técnica que usa SSH -R para expor uma porta interna ao atacante',
    ],
    correct: 1,
    explanation: 'Em um reverse shell, o servidor comprometido é quem inicia a conexão para o IP do atacante. Firewalls geralmente permitem tráfego de saída livremente, então essa técnica contorna regras de entrada. A defesa é o egress filtering.',
    trail: 'firewall',
  },
  {
    text: 'O que é "egress filtering" e por que é fundamental contra pivoteamento?',
    badge: '🎭 Pivoteamento',
    options: [
      'Filtrar tráfego que entra na DMZ vindo da WAN',
      'Registrar logs de saída para auditoria forense posterior',
      'Filtrar apenas pacotes com flags TCP inválidas (SYN+FIN, etc.)',
      'Limitar quais portas e destinos o servidor DMZ pode usar para sair — bloqueia reverse shells e exfiltração',
    ],
    correct: 3,
    explanation: 'Egress filtering restringe o tráfego de SAÍDA da DMZ: por exemplo, apenas HTTP/HTTPS para a internet e nada para a LAN interna. Isso impede que um servidor comprometido abra um reverse shell para o atacante ou exfiltre dados.',
    trail: 'firewall',
  },

  // ========== Laboratório Virtual ==========
  {
    text: 'Qual comando verifica se a CPU suporta virtualização por hardware (Intel VT-x ou AMD-V), necessária para KVM?',
    badge: '🧪 Laboratório',
    options: [
      'lscpu | grep Hypervisor',
      'systemctl status kvm',
      'egrep -c \'(vmx|svm)\' /proc/cpuinfo',
      'dmesg | grep virt',
    ],
    correct: 2,
    explanation: 'vmx = Intel VT-x, svm = AMD-V. Se o resultado for > 0, a CPU suporta virtualização hardware e KVM pode ser instalado. Resultado 0 significa que é necessário habilitar a opção na BIOS/UEFI.',
    trail: 'firewall',
  },
  {
    text: 'Qual a principal diferença entre VirtualBox (tipo 2) e KVM (tipo 1) para laboratórios Linux?',
    badge: '🧪 Laboratório',
    options: [
      'VirtualBox não suporta redes em modo bridge; KVM suporta',
      'KVM é hypervisor nativo do kernel Linux com menor overhead; VirtualBox roda como aplicativo sobre o OS',
      'KVM requer mínimo 32 GB de RAM; VirtualBox funciona com 4 GB',
      'VirtualBox não permite snapshots; KVM suporta via virsh snapshot-create',
    ],
    correct: 1,
    explanation: 'VirtualBox é um hypervisor tipo 2 (hosted) — roda como processo sobre Windows/macOS/Linux. KVM é tipo 1 (bare-metal) integrado ao kernel Linux: usa diretamente a CPU e tem overhead muito menor, sendo o mesmo hipervisor usado pelo Proxmox em produção.',
    trail: 'firewall',
  },
  {
    text: 'O que é o virsh e qual é sua relação com o libvirt no gerenciamento de VMs KVM?',
    badge: '🧪 Laboratório',
    options: [
      'Interface gráfica para criar VMs no Proxmox, equivalente ao Portainer para Docker',
      'Daemon que gerencia o ciclo de vida das VMs, equivalente ao dockerd',
      'CLI para gerenciar VMs via libvirt (start/stop/snapshot/list) — equivalente ao "docker" CLI para containers',
      'Script de provisioning automático de VMs via Kickstart/Preseed',
    ],
    correct: 2,
    explanation: 'virsh é o cliente CLI do libvirt, assim como "docker" é o CLI do dockerd. Exemplos: virsh list --all (listar VMs), virsh start nome, virsh snapshot-create-as nome "backup". O libvirtd é o daemon que realmente gerencia as VMs via KVM/QEMU.',
    trail: 'firewall',
  },

  // ========== Proxmox VE ==========
  {
    text: 'Em qual porta HTTPS o Proxmox VE expõe sua Web UI de gerenciamento por padrão?',
    badge: '🖥️ Proxmox',
    options: ['443', '8080', '8006', '8443'],
    correct: 2,
    explanation: 'O Proxmox VE usa a porta 8006/HTTPS para a Web UI. Acesso: https://IP-DO-SERVIDOR:8006. O certificado padrão é autoassinado — você verá um aviso no browser na primeira vez.',
    trail: 'firewall',
  },
  {
    text: 'O que são as interfaces vmbr (Virtual Machine Bridge) no Proxmox VE?',
    badge: '🖥️ Proxmox',
    options: [
      'Aliases de IP para separar tráfego de gerenciamento do tráfego de VMs',
      'Módulos do kernel para aceleração de rede nas VMs (offloading)',
      'Bridges Linux que conectam VMs e containers às redes físicas ou entre si',
      'Regras de firewall aplicadas entre zones isoladas do Proxmox',
    ],
    correct: 2,
    explanation: 'vmbr são bridges Linux padrão (como brctl). No Proxmox, cria-se uma bridge por rede: vmbr0 = WAN (uplink físico), vmbr1 = DMZ, vmbr2 = LAN. As VMs conectam suas interfaces virtuais (vnet) nas bridges, como cabos de switch.',
    trail: 'firewall',
  },
  {
    text: 'Qual comando exibe a versão do Proxmox VE e do kernel em execução?',
    badge: '🖥️ Proxmox',
    options: ['proxmox --version', 'pvecm status', 'pveversion', 'pvesh get /version'],
    correct: 2,
    explanation: 'pveversion exibe algo como "pve-manager/8.x.x (running kernel: 6.x.x-pve)". pvecm status mostra status do cluster. pvesh é a API REST do Proxmox.',
    trail: 'firewall',
  },

  // ========== Estrutura do Sistema — FHS (F01) ==========
  {
    text: 'No FHS (Filesystem Hierarchy Standard), qual diretório armazena os binários essenciais do sistema disponíveis antes de qualquer sistema de arquivos adicional ser montado?',
    badge: '🗂️ FHS',
    options: ['/usr/bin', '/opt', '/bin', '/sbin'],
    correct: 2,
    explanation: '/bin contém binários essenciais (ls, cp, bash) que devem estar disponíveis no boot, antes de /usr ser montado. Em sistemas modernos (Ubuntu 20.04+) /bin é um symlink para /usr/bin, mas o padrão FHS reserva /bin para esse propósito.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual diretório do FHS é montado como tmpfs (RAM) e contém arquivos temporários de processos em execução, sendo limpo a cada boot?',
    badge: '🗂️ FHS',
    options: ['/tmp', '/run', '/var/tmp', '/dev/shm'],
    correct: 1,
    explanation: '/run é montado como tmpfs pelo systemd antes de qualquer serviço subir. Contém PIDs, sockets e locks de processos. /tmp pode sobreviver ao reboot dependendo da configuração; /var/tmp sempre sobrevive.',
    trail: 'fundamentos',
  },
  {
    text: 'No Linux, o diretório /proc é um sistema de arquivos virtual que expõe informações do kernel. Qual arquivo em /proc contém os parâmetros passados ao kernel durante o boot?',
    badge: '🗂️ FHS',
    options: ['/proc/version', '/proc/modules', '/proc/cmdline', '/proc/sys/kernel/boot'],
    correct: 2,
    explanation: '/proc/cmdline exibe exatamente a linha de comando passada ao kernel pelo bootloader (GRUB). Exemplo: "BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet splash". Útil para diagnosticar parâmetros de boot.',
    trail: 'fundamentos',
  },

  // ========== Comandos Essenciais (F02) ==========
  {
    text: 'Qual comando exibe as últimas 20 linhas de um arquivo de log em tempo real, atualizando conforme novas linhas são escritas?',
    badge: '💻 Comandos',
    options: ['cat -n arquivo.log', 'tail -f -n 20 arquivo.log', 'head -20 arquivo.log', 'watch cat arquivo.log'],
    correct: 1,
    explanation: 'tail -f segue o arquivo (follow mode) e -n 20 define o número inicial de linhas exibidas. É o comando mais usado por sysadmins para monitorar logs ao vivo, como tail -f /var/log/syslog.',
    trail: 'fundamentos',
  },
  {
    text: 'Como encontrar todos os arquivos .conf no diretório /etc modificados nos últimos 7 dias?',
    badge: '💻 Comandos',
    options: [
      'ls -lt /etc/*.conf | head',
      'find /etc -name "*.conf" -mtime -7',
      'grep -r ".conf" /etc --newer=7',
      'locate /etc/*.conf -days 7',
    ],
    correct: 1,
    explanation: 'find /etc -name "*.conf" -mtime -7 usa -mtime -7 para "modificado há menos de 7 dias". O sinal importa: -7 = menos de 7 dias atrás, +7 = mais de 7 dias atrás, 7 = exatamente 7 dias atrás.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual operador de redirecionamento ADICIONA saída ao final de um arquivo sem sobrescrevê-lo?',
    badge: '💻 Comandos',
    options: ['>', '>>', '|', '2>'],
    correct: 1,
    explanation: '>> redireciona a saída padrão (stdout) ADICIONANDO ao final do arquivo. Um único > sobrescreve. | (pipe) conecta processos. 2> redireciona apenas stderr. Exemplo: echo "entrada" >> /var/log/meu.log',
    trail: 'fundamentos',
  },

  // ========== Editores de Texto (F03) ==========
  {
    text: 'No editor vim, em qual modo você deve estar para salvar o arquivo e sair?',
    badge: '📝 Editores',
    options: ['Modo de inserção (i)', 'Modo visual (v)', 'Modo normal (Esc), digitando :wq', 'Modo de substituição (R)'],
    correct: 2,
    explanation: ':wq (write + quit) é executado no modo de comandos do vim. Para chegar lá, pressione Esc primeiro. Alternativas: :w salva sem sair, :q! sai sem salvar, ZZ equivale a :wq. Nunca tente salvar estando em modo de inserção.',
    trail: 'fundamentos',
  },
  {
    text: 'Como substituir TODAS as ocorrências da palavra "senha" por "password" em um arquivo aberto no vim?',
    badge: '📝 Editores',
    options: [
      ':replace senha password',
      ':%s/senha/password/g',
      ':find senha | replace password',
      '/senha → r → password',
    ],
    correct: 1,
    explanation: ':%s/senha/password/g — % aplica ao arquivo inteiro, s é substituição, /g substitui todas as ocorrências na linha. Sem g, só a primeira ocorrência de cada linha é substituída. Adicione /c ao final para confirmar cada substituição.',
    trail: 'fundamentos',
  },
  {
    text: 'No nano, qual atalho de teclado exibe a linha de ajuda com os comandos disponíveis?',
    badge: '📝 Editores',
    options: ['Ctrl+H', 'Ctrl+G', 'F1', 'Alt+H'],
    correct: 1,
    explanation: 'Ctrl+G exibe o menu de ajuda do nano (G de Get Help). Ctrl+X sai, Ctrl+O salva, Ctrl+W busca, Ctrl+K corta linha, Ctrl+U cola. Os atalhos também aparecem na barra inferior do nano.',
    trail: 'fundamentos',
  },

  // ========== Gerenciamento de Processos (F04) ==========
  {
    text: 'Qual comando exibe os processos em tempo real, ordenados por uso de CPU, permitindo interação para matar processos?',
    badge: '⚙️ Processos',
    options: ['ps aux', 'top', 'htop', 'pstree'],
    correct: 1,
    explanation: 'top exibe processos em tempo real com atualização a cada 3 segundos. Pressione k para kill, r para renice, q para sair. htop é uma versão aprimorada com interface colorida, mas pode não estar instalado por padrão. ps aux é uma fotografia estática.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual sinal do kill encerra um processo imediatamente, sem dar chance ao processo de executar rotinas de cleanup?',
    badge: '⚙️ Processos',
    options: ['SIGTERM (15)', 'SIGHUP (1)', 'SIGKILL (9)', 'SIGINT (2)'],
    correct: 2,
    explanation: 'SIGKILL (9) é enviado diretamente ao kernel — o processo não pode capturá-lo, ignorá-lo ou executar limpeza. Use como último recurso. A boa prática é tentar SIGTERM primeiro (kill PID), aguardar, e só então kill -9 PID.',
    trail: 'fundamentos',
  },
  {
    text: 'Como iniciar um serviço nginx e garantir que ele suba automaticamente após reboot?',
    badge: '⚙️ Processos',
    options: [
      'service nginx start && update-rc.d nginx enable',
      'systemctl start nginx && systemctl enable nginx',
      'nginx -s start && chkconfig nginx on',
      '/etc/init.d/nginx start && rc-update add nginx',
    ],
    correct: 1,
    explanation: 'systemctl start inicia agora, systemctl enable cria o symlink em /etc/systemd/system/multi-user.target.wants/ para subir no boot. Os dois são independentes — você pode fazer um sem o outro. systemctl enable --now faz os dois em um único comando.',
    trail: 'fundamentos',
  },

  // ========== Permissões e Usuários (F05) ==========
  {
    text: 'Um arquivo tem permissões -rwxr-x---. Quais são os direitos do GRUPO sobre esse arquivo?',
    badge: '🔑 Permissões',
    options: [
      'Leitura, escrita e execução (rwx)',
      'Apenas leitura (r--)',
      'Leitura e execução (r-x)',
      'Nenhuma permissão (---)',
    ],
    correct: 2,
    explanation: '-rwxr-x--- divide-se em: dono=rwx, grupo=r-x, outros=---. O grupo tem leitura (r) e execução (x) mas NÃO escrita. Em número octal: dono=7, grupo=5, outros=0 → chmod 750.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual é o valor padrão de umask em sistemas Linux que resulta em permissões 644 para arquivos novos e 755 para diretórios novos?',
    badge: '🔑 Permissões',
    options: ['022', '077', '002', '133'],
    correct: 0,
    explanation: 'umask 022 subtrai das permissões máximas: arquivos base 666 - 022 = 644 (rw-r--r--), diretórios base 777 - 022 = 755 (rwxr-xr-x). umask 077 dá 600/700 (privado), umask 002 dá 664/775 (grupo pode escrever).',
    trail: 'fundamentos',
  },
  {
    text: 'Qual comando transfere a propriedade do arquivo config.txt para o usuário www-data e grupo www-data?',
    badge: '🔑 Permissões',
    options: [
      'chmod www-data:www-data config.txt',
      'chown www-data:www-data config.txt',
      'chgrp www-data config.txt && chmod www-data config.txt',
      'usermod -o www-data config.txt',
    ],
    correct: 1,
    explanation: 'chown usuário:grupo arquivo altera dono e grupo simultaneamente. chown www-data config.txt muda só o dono. chgrp www-data config.txt muda só o grupo. Para aplicar recursivamente a um diretório: chown -R www-data:www-data /var/www.',
    trail: 'fundamentos',
  },

  // ========== Discos e Partições (F06) ==========
  {
    text: 'Qual comando exibe o espaço em disco usado e disponível em todos os sistemas de arquivos montados, em formato legível por humanos?',
    badge: '💾 Discos',
    options: ['du -sh /*', 'lsblk -f', 'df -h', 'fdisk -l'],
    correct: 2,
    explanation: 'df -h (disk free, human-readable) mostra uso por filesystem montado com unidades KB/MB/GB. du -sh mede uso de diretórios específicos. lsblk lista dispositivos de bloco. fdisk -l lista partições sem mostrar uso real.',
    trail: 'fundamentos',
  },
  {
    text: 'Após criar uma nova partição com fdisk, qual comando é necessário para criar um sistema de arquivos ext4 nela?',
    badge: '💾 Discos',
    options: ['mount -t ext4 /dev/sdb1 /mnt', 'mkfs.ext4 /dev/sdb1', 'format /dev/sdb1 ext4', 'fsck /dev/sdb1'],
    correct: 1,
    explanation: 'mkfs.ext4 formata a partição com o sistema de arquivos ext4. É equivalente a mkfs -t ext4. Apenas após mkfs a partição pode ser montada com mount. fsck verifica/repara um sistema já existente; mount apenas monta.',
    trail: 'fundamentos',
  },
  {
    text: 'Para que uma partição seja montada automaticamente no boot, onde sua entrada deve ser registrada?',
    badge: '💾 Discos',
    options: ['/etc/mtab', '/proc/mounts', '/etc/fstab', '/etc/mount.conf'],
    correct: 2,
    explanation: '/etc/fstab (filesystem table) lista todos os sistemas de arquivos a montar no boot com dispositivo, ponto de montagem, tipo, opções, dump e pass. /etc/mtab e /proc/mounts são listas dos sistemas atualmente montados (geradas dinamicamente).',
    trail: 'fundamentos',
  },

  // ========== Logs e Monitoramento Básico (F07) ==========
  {
    text: 'Qual comando exibe os logs do boot atual, mostrando apenas mensagens de erro (prioridade err e acima)?',
    badge: '📋 Logs',
    options: [
      'cat /var/log/boot.log | grep ERROR',
      'journalctl -b -p err',
      'dmesg --level=err',
      'systemctl log --boot --priority=error',
    ],
    correct: 1,
    explanation: 'journalctl -b filtra o boot atual (-b 0 ou apenas -b), -p err filtra por prioridade err e acima (err, crit, alert, emerg). Equivalente: -p 3. dmesg --level=err funciona para logs do kernel, mas journalctl é mais completo.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual arquivo de log registra tentativas de autenticação SSH no Ubuntu/Debian?',
    badge: '📋 Logs',
    options: ['/var/log/syslog', '/var/log/auth.log', '/var/log/secure', '/var/log/ssh.log'],
    correct: 1,
    explanation: '/var/log/auth.log (Debian/Ubuntu) registra autenticações: SSH, sudo, su, PAM. Em RHEL/CentOS o equivalente é /var/log/secure. Monitorar esse arquivo é essencial para detectar tentativas de força bruta. Exemplo: tail -f /var/log/auth.log | grep "Failed".',
    trail: 'fundamentos',
  },
  {
    text: 'Como monitorar em tempo real apenas as mensagens do serviço nginx no journald?',
    badge: '📋 Logs',
    options: [
      'tail -f /var/log/nginx/error.log',
      'journalctl -u nginx -f',
      'watch journalctl nginx',
      'systemctl logs nginx --follow',
    ],
    correct: 1,
    explanation: 'journalctl -u nginx -f: -u filtra pela unit systemd (nginx.service), -f ativa follow mode (como tail -f). Combina: journalctl -u nginx -f --since "10 min ago". Alternativa: journalctl -fu nginx (ordem diferente, mesmo resultado).',
    trail: 'fundamentos',
  },

  // ========== Backup e Restauração (F08) ==========
  {
    text: 'Qual opção do rsync garante que arquivos deletados na origem sejam também deletados no destino, mantendo um espelho exato?',
    badge: '💾 Backup',
    options: ['--mirror', '--delete', '--sync', '--prune'],
    correct: 1,
    explanation: 'rsync --delete remove do destino arquivos que não existem mais na origem, criando um mirror real. Cuidado: combine com -n (dry-run) primeiro para verificar o que será deletado. Sem --delete, rsync só adiciona/atualiza, nunca remove.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual comando cria um arquivo compactado backup.tar.gz a partir do diretório /etc, preservando permissões e propriedades?',
    badge: '💾 Backup',
    options: [
      'zip -r backup.tar.gz /etc',
      'tar -czf backup.tar.gz /etc',
      'gzip -r /etc > backup.tar.gz',
      'cp -a /etc backup.tar.gz',
    ],
    correct: 1,
    explanation: 'tar -czf: -c cria, -z comprime com gzip, -f especifica o arquivo de saída. tar preserva permissões Unix, proprietários, timestamps e links simbólicos por padrão. Para restaurar: tar -xzf backup.tar.gz -C /destino.',
    trail: 'fundamentos',
  },
  {
    text: 'Na estratégia de backup 3-2-1, o que os números representam?',
    badge: '💾 Backup',
    options: [
      '3 backups diários, 2 semanais, 1 mensal',
      '3 cópias, em 2 mídias diferentes, com 1 cópia offsite',
      '3 servidores, 2 regiões, 1 provedor cloud',
      '3 snapshots, 2 réplicas, 1 backup frio',
    ],
    correct: 1,
    explanation: 'Regra 3-2-1: 3 cópias dos dados (original + 2 backups), em 2 tipos de mídia diferentes (ex: HDD + cloud), sendo 1 delas offsite (fora das instalações). Protege contra falha de hardware, desastre local e ransomware simultaneamente.',
    trail: 'fundamentos',
  },

  // ========== Shell Script Bash (F09) ==========
  {
    text: 'Em um script bash, qual construção verifica se o arquivo /etc/nginx/nginx.conf existe antes de reiniciar o Nginx?',
    badge: '🖥️ Shell Script',
    options: [
      'if exists /etc/nginx/nginx.conf; then systemctl restart nginx; fi',
      'if [ -f /etc/nginx/nginx.conf ]; then systemctl restart nginx; fi',
      'if file /etc/nginx/nginx.conf = true; then restart; fi',
      'test -exists /etc/nginx/nginx.conf && restart nginx',
    ],
    correct: 1,
    explanation: '[ -f arquivo ] testa se o arquivo existe E é um arquivo regular. Outros testes: -d (diretório), -e (existe, qualquer tipo), -r (legível), -w (gravável), -x (executável), -s (tamanho > 0). A sintaxe if [ condição ]; then ... fi é padrão POSIX.',
    trail: 'fundamentos',
  },
  {
    text: 'Como iterar sobre todos os arquivos .log do diretório /var/log em um script bash?',
    badge: '🖥️ Shell Script',
    options: [
      'for file in /var/log/*.log; do echo $file; done',
      'foreach file (/var/log/*.log) { echo $file }',
      'loop file in $(ls /var/log/*.log); do echo $file; done',
      'while read file < /var/log/*.log; do echo $file; done',
    ],
    correct: 0,
    explanation: 'for file in /var/log/*.log usa expansão de glob do bash — mais seguro que $(ls) pois lida corretamente com espaços nos nomes. A variável $file contém o caminho completo a cada iteração. Sempre use aspas: "$file" para segurança.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual variável especial em bash contém o código de retorno do último comando executado?',
    badge: '🖥️ Shell Script',
    options: ['$0', '$?', '$#', '$!'],
    correct: 1,
    explanation: '$? contém o exit code do último comando: 0 = sucesso, diferente de 0 = erro. Essencial para tratamento de erros: if ! comando; then echo "falhou: $?"; fi. $0 = nome do script, $# = número de argumentos, $! = PID do último processo em background.',
    trail: 'fundamentos',
  },

  // ========== Agendamento de Tarefas — Cron (F10) ==========
  {
    text: 'Qual é a sintaxe correta de uma entrada crontab para executar o script /opt/backup.sh todo dia às 03:30?',
    badge: '⏰ Cron',
    options: [
      '30 3 * * * /opt/backup.sh',
      '3 30 * * * /opt/backup.sh',
      '* * 3 30 * /opt/backup.sh',
      '30 03 daily /opt/backup.sh',
    ],
    correct: 0,
    explanation: 'A sintaxe crontab é: minuto hora dia-mês mês dia-semana comando. "30 3 * * *" = minuto 30, hora 3, qualquer dia/mês/dia-da-semana → 03:30 diariamente. Mnemônico: "Minuto Hora Dia Mês DiaSemana".',
    trail: 'fundamentos',
  },
  {
    text: 'Qual entrada especial do cron executa um comando na inicialização do sistema, uma única vez?',
    badge: '⏰ Cron',
    options: ['@boot', '@reboot', '@startup', '@init'],
    correct: 1,
    explanation: '@reboot é um atalho especial do cron que executa o comando uma vez quando o sistema inicia (mais precisamente quando o cron daemon inicia). Outros atalhos: @hourly, @daily, @weekly, @monthly, @yearly. É equivalente a "0 0 * * *" para @daily.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual comando lista os cron jobs do usuário atual sem abrir o editor?',
    badge: '⏰ Cron',
    options: ['cron -l', 'crontab -l', 'crontab --list', 'cat /etc/crontab'],
    correct: 1,
    explanation: 'crontab -l lista os cron jobs do usuário atual (l de list). crontab -e abre o editor. crontab -r REMOVE todos os cron jobs sem confirmação (cuidado!). /etc/crontab é o cron do sistema, separado dos crontabs de usuário em /var/spool/cron/crontabs/.',
    trail: 'fundamentos',
  },

  // ========== Instalação de Programas (Sprint F4) ==========
  {
    text: 'Qual a diferença entre "apt remove" e "apt purge" no Debian/Ubuntu?',
    badge: '📦 Pacotes',
    options: [
      'Não há diferença — os dois fazem a mesma coisa',
      'remove apaga o binário; purge apaga binário + arquivos de configuração',
      'remove apaga dependências automaticamente; purge não',
      'purge é mais rápido pois não verifica dependências',
    ],
    correct: 1,
    explanation: 'apt remove desinstala o pacote mas mantém os arquivos de configuração em /etc (útil para reinstalar com as mesmas configs). apt purge remove tudo — binários + configs. Para limpar completamente, use purge.',
    trail: 'fundamentos',
  },
  {
    text: 'Para instalar um pacote .deb baixado manualmente (fora de repositório), qual comando usar?',
    badge: '📦 Pacotes',
    options: ['apt install ./pacote.deb', 'dpkg -i pacote.deb', 'pkg install pacote.deb', 'rpm -ivh pacote.deb'],
    correct: 1,
    explanation: 'dpkg -i instala pacotes .deb diretamente. Se houver dependências faltando, rode "apt --fix-broken install" logo depois. Alternativamente, "apt install ./pacote.deb" (com ./) resolve dependências automaticamente.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual comando lista todos os pacotes instalados no sistema com dpkg?',
    badge: '📦 Pacotes',
    options: ['dpkg --list', 'dpkg -l', 'apt list --installed', 'dpkg -q all'],
    correct: 1,
    explanation: 'dpkg -l lista todos os pacotes com status (ii = instalado, rc = removido com config restante). A coluna de status indica: primeiro char = desejado, segundo = atual, terceiro = erro.',
    trail: 'fundamentos',
  },

  // ========== Processo de Boot (Sprint F5) ==========
  {
    text: 'Qual target do systemd corresponde ao modo multiusuário com rede, mas sem interface gráfica?',
    badge: '🖥️ Boot',
    options: ['graphical.target', 'multi-user.target', 'rescue.target', 'network.target'],
    correct: 1,
    explanation: 'multi-user.target é o equivalente ao runlevel 3 — todos os serviços de rede ativos, múltiplos usuários podem logar, sem GUI. Servidores Linux tipicamente usam este target como padrão.',
    trail: 'fundamentos',
  },
  {
    text: 'Qual comando identifica quais serviços estão atrasando o boot, mostrando o tempo de cada um?',
    badge: '🖥️ Boot',
    options: ['journalctl --boot-time', 'systemctl status --all', 'systemd-analyze blame', 'dmesg --timing'],
    correct: 2,
    explanation: 'systemd-analyze blame lista todos os serviços em ordem decrescente de tempo de inicialização. Útil para identificar o gargalo do boot. Use systemd-analyze critical-chain para ver a cadeia crítica.',
    trail: 'fundamentos',
  },

  {
    text: 'Após editar o /etc/default/grub, qual comando gera o arquivo /boot/grub/grub.cfg com as novas configurações?',
    badge: '🖥️ Boot',
    options: ['grub-install /dev/sda', 'update-grub', 'grub-mkconfig', 'systemctl reload grub'],
    correct: 1,
    explanation: 'update-grub é um wrapper de grub-mkconfig que lê /etc/default/grub e os scripts em /etc/grub.d/ e gera /boot/grub/grub.cfg. Sem rodá-lo, as mudanças no arquivo de configuração não têm efeito.',
    trail: 'fundamentos',
  },

  // ========== Comandos Avançados (Sprint F6) ==========
  {
    text: 'Qual o efeito de "sed -i.bak \'s/old/new/g\' arquivo.txt"?',
    badge: '🔧 Cmd Avançados',
    options: [
      'Substitui old por new e imprime na tela sem modificar o arquivo',
      'Substitui old por new no arquivo, criando backup arquivo.txt.bak',
      'Substitui apenas a primeira ocorrência e cria backup',
      'Cria um novo arquivo .bak com as substituições aplicadas',
    ],
    correct: 1,
    explanation: '-i edita o arquivo in-place; .bak é a extensão do backup criado antes da edição. Sem o .bak, o arquivo seria editado sem backup algum. O flag g na substituição garante que TODAS as ocorrências na linha sejam trocadas.',
    trail: 'fundamentos',
  },
  {
    text: 'Por que o comando DD é chamado informalmente de "disk destroyer"?',
    badge: '🔧 Cmd Avançados',
    options: [
      'Porque formata o disco antes de copiar',
      'Porque inverter if= e of= por engano sobrescreve o disco de origem irreversivelmente',
      'Porque apaga automaticamente o arquivo de origem após copiar',
      'Porque cria partições destrutivas no disco destino',
    ],
    correct: 1,
    explanation: 'dd if=/dev/sda of=/dev/sdb copia sda para sdb (correto). Mas dd if=/dev/sdb of=/dev/sda sobrescreve sda com sdb — apagando tudo. Sempre confira duas vezes if= e of= antes de executar.',
    trail: 'fundamentos',
  },
  {
    text: 'O comando "nc -zv 10.0.0.1 443" faz o quê?',
    badge: '🔧 Cmd Avançados',
    options: [
      'Abre um servidor TCP na porta 443',
      'Transfere um arquivo para 10.0.0.1 via porta 443',
      'Testa conectividade TCP na porta 443 sem enviar dados',
      'Captura pacotes na interface de rede para a porta 443',
    ],
    correct: 2,
    explanation: '-z é o modo "zero I/O" (só testa conectividade sem enviar dados), -v é verbose. É o substituto mais simples para telnet em diagnóstico de rede: se responder "succeeded" a porta está aberta e acessível.',
    trail: 'fundamentos',
  },

  // ========== Logs Centralizados — Rsyslog (Sprint F7) ==========
  {
    text: 'O que a diretiva "auth.warn /var/log/auth.log" no rsyslog.conf configura?',
    badge: '📡 Rsyslog',
    options: [
      'Grava todos os logs do sistema no arquivo auth.log',
      'Grava mensagens do facility "auth" com prioridade warn ou superior em auth.log',
      'Envia alertas de autenticação por e-mail',
      'Monitora falhas de login e bloqueia IPs automaticamente',
    ],
    correct: 1,
    explanation: 'A sintaxe é facility.prioridade destino. auth é o facility de autenticação; warn inclui warn, err, crit, alert e emerg (todas as prioridades iguais ou acima). Para capturar tudo do facility auth: auth.*',
    trail: 'fundamentos',
  },
  {
    text: 'No rsyslog, qual a diferença entre "@servidor:514" e "@@servidor:514"?',
    badge: '📡 Rsyslog',
    options: [
      'Um arroba = TCP criptografado; dois arrobas = TCP simples',
      'Um arroba = UDP; dois arrobas = TCP',
      'Um arroba = local; dois arrobas = remoto',
      'Não há diferença — são sintaxes equivalentes',
    ],
    correct: 1,
    explanation: '@servidor:514 envia logs via UDP (rápido, sem confirmação de entrega). @@servidor:514 usa TCP (garante entrega mas usa mais recursos). Em produção, prefira @@ para logs críticos de segurança.',
    trail: 'fundamentos',
  },
  {
    text: 'No logrotate, o que a diretiva "rotate 7" configura?',
    badge: '📡 Rsyslog',
    options: [
      'Rotaciona o log a cada 7 dias automaticamente',
      'Mantém 7 versões comprimidas do log e apaga a mais antiga na próxima rotação',
      'Comprime o log após 7 dias sem rotação',
      'Limita o tamanho máximo do log a 7 MB',
    ],
    correct: 1,
    explanation: '"rotate 7" significa que o logrotate mantém 7 arquivos rotacionados (syslog.1 … syslog.7). Na oitava rotação, o arquivo mais antigo é excluído. Combinado com "daily", isso equivale a 1 semana de histórico.',
    trail: 'fundamentos',
  },

  // ========== Servidor DHCP (Sprint I.7) ==========
  {
    text: 'O que significa a sequência DORA no protocolo DHCP?',
    badge: '🌐 DHCP',
    options: [
      'Detect, Offer, Request, Acknowledge',
      'Discover, Offer, Request, Acknowledge',
      'Define, Open, Resolve, Assign',
      'Discover, Open, Register, Allocate',
    ],
    correct: 1,
    explanation: 'DORA é o fluxo de 4 mensagens: o cliente envia Discover (broadcast), o servidor responde com Offer (proposta de IP), o cliente envia Request (aceita a oferta), o servidor confirma com Acknowledge. Após o ACK, o cliente usa o IP.',
    trail: 'avancados',
  },
  {
    text: 'Como reservar um IP fixo para um dispositivo específico no isc-dhcp-server?',
    badge: '🌐 DHCP',
    options: [
      'Usando "static-address" com o hostname do dispositivo',
      'Configurando "fixed-address" junto com "hardware ethernet" (MAC) no dhcpd.conf',
      'Adicionando o IP na blocklist do servidor',
      'Usando "reserve ip" com o endereço IP no dhcpd.conf',
    ],
    correct: 1,
    explanation: 'Uma reserva DHCP vincula um MAC address a um IP fixo: host servidor { hardware ethernet aa:bb:cc:dd:ee:ff; fixed-address 192.168.1.10; }. O servidor sempre entregará o mesmo IP para aquele MAC, mas via DHCP.',
    trail: 'avancados',
  },
  {
    text: 'Onde o isc-dhcp-server registra todas as concessões de IP ativas (leases)?',
    badge: '🌐 DHCP',
    options: [
      '/etc/dhcp/dhcpd.conf',
      '/var/log/dhcpd.log',
      '/var/lib/dhcp/dhcpd.leases',
      '/run/dhcp/active.db',
    ],
    correct: 2,
    explanation: '/var/lib/dhcp/dhcpd.leases é o banco de leases: cada concessão ativa contém IP, MAC, hostname e tempo de expiração. Útil para diagnosticar quais IPs estão em uso e qual MAC recebeu qual endereço. O arquivo é persistido em disco e sobrevive a reboots.',
    trail: 'avancados',
  },

  // ========== Samba — File Sharing (Sprint I.8) ==========
  {
    text: 'Por que o smbpasswd existe separado da senha do usuário Linux?',
    badge: '🗂️ Samba',
    options: [
      'Para isolar permissões de rede das permissões locais',
      'O Samba armazena um hash NT incompatível com o /etc/shadow do Linux',
      'Por motivos de performance no acesso a compartilhamentos',
      'Para permitir usuários sem conta no sistema acessar shares',
    ],
    correct: 1,
    explanation: 'O Samba usa o hash NT (NTLM), o mesmo do Windows, que é incompatível com os hashes do /etc/shadow. Por isso smbpasswd cria um banco separado. Um usuário precisa existir no Linux E ter senha Samba configurada.',
    trail: 'avancados',
  },
  {
    text: 'Qual porta TCP é usada pelo SMB moderno (direct hosting, sem NetBIOS)?',
    badge: '🗂️ Samba',
    options: ['139', '137', '445', '3389'],
    correct: 2,
    explanation: 'A porta 445 (SMB direto sobre TCP) é a forma moderna de acesso. A porta 139 era usada com NetBIOS Session Service (legado). Hoje o Windows e o Samba preferem 445. O firewall deve liberar 445/TCP + 137-138/UDP.',
    trail: 'avancados',
  },
  {
    text: 'No smb.conf, o que "valid users = @ti" configura para um compartilhamento?',
    badge: '🗂️ Samba',
    options: [
      'Permite apenas o usuário chamado "ti" acessar o share',
      'Permite apenas membros do grupo Linux "ti" acessar o share',
      'Define "ti" como administrador com controle total',
      'Redireciona o acesso para um servidor LDAP chamado "ti"',
    ],
    correct: 1,
    explanation: 'No smb.conf, o prefixo @ antes de um nome indica grupo Linux. "valid users = @ti" restringe o acesso ao share apenas para membros do grupo "ti". Para múltiplos grupos: "valid users = @ti @gerencia". O usuário ainda precisa ter senha Samba configurada via smbpasswd.',
    trail: 'avancados',
  },

  // ========== Apache Web Server (Sprint I.9) ==========
  {
    text: 'Qual a diferença entre "a2ensite" e "a2enmod" no Apache?',
    badge: '🌍 Apache',
    options: [
      'a2ensite habilita um VirtualHost; a2enmod habilita um módulo Apache',
      'a2ensite habilita um módulo; a2enmod habilita um VirtualHost',
      'São comandos equivalentes com nomes históricos diferentes',
      'a2ensite é para Apache 1.x; a2enmod para Apache 2.x',
    ],
    correct: 0,
    explanation: 'a2ensite cria symlink de sites-available/ para sites-enabled/ (habilita um VirtualHost). a2enmod cria symlink de mods-available/ para mods-enabled/ (habilita um módulo como mod_rewrite ou mod_ssl). Ambos requerem "systemctl reload apache2".',
    trail: 'avancados',
  },
  {
    text: 'O que o módulo "mod_rewrite" do Apache permite fazer?',
    badge: '🌍 Apache',
    options: [
      'Reescrever os cabeçalhos HTTP de resposta',
      'Redirecionar e reescrever URLs usando expressões regulares',
      'Comprimir o conteúdo das respostas HTTP',
      'Habilitar SSL/TLS no VirtualHost',
    ],
    correct: 1,
    explanation: 'mod_rewrite é o módulo de manipulação de URLs do Apache. Permite redirecionar HTTP→HTTPS (RedirectMatch), criar URLs amigáveis (/produto/123 → /index.php?id=123) e bloquear requisições por padrão. É base de quase todo .htaccess.',
    trail: 'avancados',
  },
  {
    text: 'Por que usar .htaccess é considerado mais lento do que configurar diretamente no bloco <Directory> do VirtualHost?',
    badge: '🌍 Apache',
    options: [
      '.htaccess usa uma sintaxe mais antiga e menos otimizada',
      'O Apache verifica se existe um .htaccess em cada diretório do caminho para cada requisição',
      '.htaccess não suporta mod_rewrite, exigindo mais processamento',
      '.htaccess é processado por um processo separado do Apache',
    ],
    correct: 1,
    explanation: 'Para cada requisição, o Apache percorre todos os diretórios do caminho (/, /var/, /var/www/, /var/www/html/) verificando se existe .htaccess. Isso resulta em múltiplas operações de I/O em disco. Com "AllowOverride None" no VirtualHost, o Apache nem procura — tudo configurado no VirtualHost é carregado uma única vez na inicialização.',
    trail: 'avancados',
  },

  // ========== OpenVPN (Sprint I.10) ==========
  {
    text: 'Qual ferramenta é usada para criar a PKI (CA, certificados de servidor e cliente) para o OpenVPN?',
    badge: '🔒 OpenVPN',
    options: ['openssl-pki', 'Easy-RSA', 'certbot', 'cfssl'],
    correct: 1,
    explanation: 'Easy-RSA é a ferramenta oficial do projeto OpenVPN para gerenciar PKI. Cria a CA (Certificate Authority), assina certificados de servidor e clientes, e gerencia revogação (CRL). É instalada junto com o pacote openvpn.',
    trail: 'avancados',
  },
  {
    text: 'O que diferencia "dev tun" de "dev tap" na configuração do OpenVPN?',
    badge: '🔒 OpenVPN',
    options: [
      'tun usa UDP; tap usa TCP',
      'tun é camada 3 (roteamento IP); tap é camada 2 (bridge Ethernet)',
      'tun é mais seguro; tap é mais rápido',
      'tun é para Linux; tap é para Windows',
    ],
    correct: 1,
    explanation: 'tun cria uma interface de rede L3 — clientes recebem IPs e o tráfego é roteado. tap cria uma interface L2 — clientes ficam na mesma broadcast domain (como um switch virtual). Para acesso remoto à internet, use tun. Para bridging de redes locais, use tap.',
    trail: 'avancados',
  },
  {
    text: 'Qual porta e protocolo o OpenVPN usa por padrão, e por que UDP é preferível a TCP neste caso?',
    badge: '🔒 OpenVPN',
    options: [
      '443/TCP — disfarça o tráfego como HTTPS e é mais confiável',
      '1194/UDP — evita o problema "TCP-over-TCP meltdown" e tem latência menor',
      '500/UDP — o mesmo do IKEv2 para compatibilidade máxima com firewalls',
      '1194/TCP — garante entrega ordenada dos pacotes VPN',
    ],
    correct: 1,
    explanation: '1194/UDP é o padrão do OpenVPN. UDP é preferível porque o próprio protocolo VPN cuida da retransmissão internamente. TCP-over-TCP é problemático: se a conexão TCP interna tiver perda, o TCP externo também retransmite — causando cascata de retransmissões (TCP meltdown). UDP elimina essa interferência.',
    trail: 'avancados',
  },

  // ========== Traefik Proxy Reverso (Sprint I.11) ==========
  {
    text: 'Como o Traefik descobre automaticamente os serviços em execução no Docker?',
    badge: '🔀 Traefik',
    options: [
      'Lendo o arquivo docker-compose.yml diretamente',
      'Consultando a API do Docker e lendo as labels dos containers',
      'Via DNS interno do Docker Compose',
      'Por polling periódico das portas abertas nos containers',
    ],
    correct: 1,
    explanation: 'O Traefik se conecta à API do Docker (/var/run/docker.sock) e monitora eventos em tempo real. Quando um container sobe com labels traefik.http.routers.*, ele cria automaticamente as rotas — sem recarregar a configuração.',
    trail: 'avancados',
  },
  {
    text: 'O que é um "entrypoint" no Traefik?',
    badge: '🔀 Traefik',
    options: [
      'O primeiro middleware da cadeia de processamento',
      'A porta de entrada onde o Traefik escuta conexões externas',
      'O certificado TLS associado a um domínio',
      'O backend de destino para uma rota específica',
    ],
    correct: 1,
    explanation: 'Entrypoints são os pontos de entrada do Traefik — as portas em que ele escuta. Convencionalmente: "web" (porta 80, HTTP) e "websecure" (porta 443, HTTPS). Um router é ligado a um entrypoint para decidir para onde encaminhar o tráfego.',
    trail: 'avancados',
  },
  {
    text: 'Onde o Traefik armazena os certificados Let\'s Encrypt gerados via ACME para que sobrevivam a reinicializações do container?',
    badge: '🔀 Traefik',
    options: [
      'Em memória — são solicitados novamente a cada restart',
      'No /etc/letsencrypt/ dentro do container Traefik',
      'No arquivo acme.json mapeado como volume persistente no host',
      'No banco de dados interno do Traefik em /var/lib/traefik/',
    ],
    correct: 2,
    explanation: 'O Traefik salva todos os certificados ACME em acme.json (ex: /letsencrypt/acme.json no container). Para persistir entre reinicializações, esse arquivo deve ser mapeado como volume. Sem o volume, o Traefik solicitaria novos certificados a cada restart — podendo atingir os rate limits da Let\'s Encrypt (50 certs/domínio/semana).',
    trail: 'avancados',
  },

  // ========== LDAP / OpenLDAP (Sprint I.12) ==========
  {
    text: 'O que é um "Distinguished Name" (DN) no LDAP?',
    badge: '👥 LDAP',
    options: [
      'O nome de exibição de um usuário no diretório',
      'O identificador único e completo de uma entrada na árvore DIT',
      'O hash da senha armazenado no LDAP',
      'O grupo de administradores do servidor LDAP',
    ],
    correct: 1,
    explanation: 'DN é o caminho completo de uma entrada: cn=joao,ou=usuarios,dc=empresa,dc=com. Cada componente (RDN) identifica um nível da árvore. É como um path de arquivo — único e absoluto. O slapd usa o DN para localizar e autenticar entradas.',
    trail: 'avancados',
  },
  {
    text: 'Qual objectClass combina atributos Unix (UID, GID, home) com LDAP para login no sistema?',
    badge: '👥 LDAP',
    options: ['inetOrgPerson', 'posixAccount', 'organizationalUnit', 'groupOfNames'],
    correct: 1,
    explanation: 'posixAccount define os atributos necessários para login Unix: uidNumber, gidNumber, homeDirectory, loginShell. Combinado com inetOrgPerson (cn, sn, mail) e shadowAccount (política de senha), o usuário pode logar via PAM+nslcd.',
    trail: 'avancados',
  },
  {
    text: 'Qual comando ldapsearch lista todas as entradas com objectClass posixAccount na OU "usuarios" do domínio empresa.com?',
    badge: '👥 LDAP',
    options: [
      'ldap search -filter posixAccount -ou usuarios',
      'ldapsearch -x -b "ou=usuarios,dc=empresa,dc=com" "(objectClass=posixAccount)"',
      'slapcat -s "ou=usuarios" -f posixAccount',
      'ldapget -base usuarios -class posixAccount',
    ],
    correct: 1,
    explanation: 'ldapsearch -x usa autenticação simples (sem SASL); -b define o search base (ponto de partida na árvore DIT); o filtro entre parênteses segue a sintaxe LDAP RFC 4515. Para buscar atributos específicos, acrescente-os no final: "... uid cn mail".',
    trail: 'avancados',
  },

  // ========== Pi-hole (Sprint I.13) ==========
  {
    text: 'Como o Pi-hole bloqueia domínios de anúncios e rastreamento?',
    badge: '🕳️ Pi-hole',
    options: [
      'Filtrando pacotes na camada de transporte via iptables',
      'Interceptando consultas DNS e retornando 0.0.0.0 para domínios bloqueados',
      'Modificando as respostas HTTP dos servidores de anúncios',
      'Bloqueando conexões HTTPS via inspeção de certificados',
    ],
    correct: 1,
    explanation: 'Pi-hole é um DNS sinkhole: quando um cliente resolve "ads.tracker.com", o Pi-hole retorna 0.0.0.0 (IP inválido) em vez do IP real. O browser tenta conectar em 0.0.0.0, falha imediatamente — anúncio nunca carrega.',
    trail: 'avancados',
  },
  {
    text: 'O que o comando "pihole -g" faz?',
    badge: '🕳️ Pi-hole',
    options: [
      'Gera um relatório de domínios bloqueados',
      'Reinicia o serviço do Pi-hole',
      'Atualiza o gravity.db re-baixando todas as blocklists configuradas',
      'Exibe as estatísticas de queries do dia',
    ],
    correct: 2,
    explanation: 'pihole -g (gravity update) baixa novamente todas as blocklists configuradas, consolida os domínios no gravity.db e recarrega o FTL (DNS engine). É o equivalente ao "apt update" do Pi-hole — deve ser executado periodicamente.',
    trail: 'avancados',
  },
  {
    text: 'Por que combinar Pi-hole com uma regra DNAT no iptables é recomendado em redes corporativas?',
    badge: '🕳️ Pi-hole',
    options: [
      'O DNAT acelera as respostas DNS redirecionando para cache local',
      'Impede que dispositivos burlem o Pi-hole usando servidores DNS externos (como 8.8.8.8) configurados manualmente',
      'Habilita automaticamente DNS sobre HTTPS (DoH) no Pi-hole',
      'O Pi-hole não funciona sem regra DNAT — ela é obrigatória para instalações Docker',
    ],
    correct: 1,
    explanation: 'Sem DNAT, um usuário ou dispositivo pode configurar 8.8.8.8 como DNS e contornar o Pi-hole. Com "iptables -t nat -A PREROUTING -p udp --dport 53 ! -d 192.168.1.1 -j DNAT --to 192.168.1.1:53", todo DNS da rede é redirecionado para o Pi-hole — ninguém escapa.',
    trail: 'avancados',
  },

  // ========== Ansible (Sprint I.14) ==========
  {
    text: 'Qual é a unidade de reutilização recomendada no Ansible para organizar tasks, handlers, templates e variáveis?',
    badge: '⚙️ Ansible',
    options: ['Module', 'Playbook', 'Role', 'Inventory'],
    correct: 2,
    explanation: 'Roles organizam o código Ansible em estrutura padronizada: tasks/, handlers/, templates/, files/, vars/, defaults/, meta/. Uma role é reutilizável entre projetos e pode ser compartilhada via Ansible Galaxy.',
    trail: 'avancados',
  },
  {
    text: 'O que o Ansible Vault faz?',
    badge: '⚙️ Ansible',
    options: [
      'Faz backup automático de playbooks e inventários',
      'Criptografa arquivos e variáveis sensíveis com AES-256',
      'Testa playbooks em modo sandbox antes de aplicar',
      'Gerencia o acesso SSH aos hosts do inventário',
    ],
    correct: 1,
    explanation: 'ansible-vault encrypt arquivo.yml criptografa com AES-256-CBC usando uma senha. O arquivo pode ser armazenado no git com segurança. Na execução, --ask-vault-pass ou --vault-password-file descriptografa na memória.',
    trail: 'avancados',
  },
  {
    text: 'Qual a principal diferença entre Ansible e Terraform?',
    badge: '⚙️ Ansible',
    options: [
      'Ansible é pago; Terraform é open source',
      'Ansible é agentless; Terraform precisa de agent instalado',
      'Ansible configura software em servidores existentes; Terraform provisiona a infraestrutura',
      'Ansible usa YAML; Terraform usa JSON',
    ],
    correct: 2,
    explanation: 'Terraform provisiona infraestrutura (cria VMs, redes, databases na cloud). Ansible configura o que está dentro dos servidores (instala pacotes, edita configs, habilita serviços). São complementares: Terraform cria a VM, Ansible configura ela.',
    trail: 'avancados',
  },

  // ========== Prometheus + Grafana (Sprint I.15) ==========
  {
    text: 'Qual função PromQL calcula a taxa de requisições por segundo numa janela de 5 minutos?',
    badge: '📊 Monitoring',
    options: ['increase(requests_total[5m])', 'rate(requests_total[5m])', 'delta(requests_total[5m])', 'sum(requests_total[5m])'],
    correct: 1,
    explanation: 'rate() calcula a taxa por segundo de um counter usando regressão linear na janela de tempo. increase() dá o crescimento absoluto na janela (não por segundo). Use rate() para gráficos de throughput; irate() para detecção de picos.',
    trail: 'avancados',
  },
  {
    text: 'O que é "scraping" no modelo de coleta de dados do Prometheus?',
    badge: '📊 Monitoring',
    options: [
      'Prometheus envia métricas para um agente nos servidores (push)',
      'Prometheus coleta métricas via pull periódico do endpoint /metrics dos targets',
      'Os servidores enviam eventos de alerta diretamente ao Prometheus',
      'Um agente criptografa e envia métricas para o servidor Prometheus',
    ],
    correct: 1,
    explanation: 'Prometheus usa modelo pull: a cada intervalo (padrão 15s), ele faz HTTP GET no /metrics de cada target. Isso simplifica descoberta, facilita debug (você mesmo pode curl o endpoint) e o target não precisa saber do Prometheus.',
    trail: 'avancados',
  },
  {
    text: 'O que são "recording rules" no Prometheus e qual sua principal vantagem?',
    badge: '📊 Monitoring',
    options: [
      'Regras que gravam alertas no log de auditoria do Prometheus',
      'Pré-calculam expressões PromQL custosas e salvam como novas séries temporais — reduzem latência de dashboards',
      'Configurações de remote write para exportar métricas para o InfluxDB',
      'Regras que habilitam a gravação de métricas em disco com retenção estendida',
    ],
    correct: 1,
    explanation: 'Recording rules pré-calculam queries PromQL pesadas (ex: sum(rate(requests[5m])) by (service)) e as salvam como novas métricas. Dashboards Grafana com muitos painéis se tornam mais rápidos porque leem métricas pré-calculadas em vez de recalcular queries complexas a cada atualização.',
    trail: 'avancados',
  },

  // ========== Kubernetes / K3s (Sprint I.16) ==========
  {
    text: 'Qual objeto Kubernetes garante que um número mínimo de réplicas de um Pod esteja sempre rodando?',
    badge: '☸️ Kubernetes',
    options: ['Pod', 'StatefulSet', 'Deployment', 'DaemonSet'],
    correct: 2,
    explanation: 'Deployment gerencia um ReplicaSet que mantém N réplicas do Pod rodando. Se um Pod morrer, o ReplicaSet cria um novo. Deployment também gerencia rolling updates (RollingUpdate strategy) e rollbacks.',
    trail: 'avancados',
  },
  {
    text: 'O que distingue um Service ClusterIP de um NodePort no Kubernetes?',
    badge: '☸️ Kubernetes',
    options: [
      'ClusterIP é para stateless; NodePort para stateful',
      'ClusterIP é acessível apenas internamente no cluster; NodePort expõe em todos os nós',
      'ClusterIP usa UDP; NodePort usa TCP',
      'ClusterIP requer Ingress; NodePort funciona standalone',
    ],
    correct: 1,
    explanation: 'ClusterIP cria um IP virtual acessível apenas dentro do cluster (Pod→Pod). NodePort expõe a porta em todos os nós do cluster via porta alta (30000-32767) — acessível externamente. Para produção, prefira Ingress + ClusterIP.',
    trail: 'avancados',
  },
  {
    text: 'O que uma NetworkPolicy com "podSelector: {}" e sem regras ingress faz no Kubernetes?',
    badge: '☸️ Kubernetes',
    options: [
      'Permite todo o tráfego para todos os pods do namespace',
      'Não tem efeito — policy vazia é ignorada',
      'Bloqueia todo o tráfego de entrada para os pods do namespace (default-deny)',
      'Bloqueia apenas tráfego externo ao cluster',
    ],
    correct: 2,
    explanation: 'Uma NetworkPolicy selecionando todos os pods (podSelector: {}) com ingress: [] implementa default-deny: nenhum tráfego de entrada é permitido a menos que outra policy o permita explicitamente. É a base de segmentação de rede no Kubernetes.',
    trail: 'avancados',
  },

  // ========== Terraform IaC (Sprint I.17) ==========
  {
    text: 'O que o "terraform plan" faz?',
    badge: '🏗️ Terraform',
    options: [
      'Aplica as mudanças imediatamente na infraestrutura',
      'Valida a sintaxe HCL sem conectar ao provider',
      'Compara o estado atual com o código e mostra o diff do que seria criado/destruído',
      'Inicializa o diretório e baixa os providers',
    ],
    correct: 2,
    explanation: 'terraform plan lê o terraform.tfstate (estado atual), conecta ao provider para verificar o estado real e compara com o código .tf. Mostra + (criar), ~ (modificar), - (destruir) — sem executar nada. Sempre revise o plan antes do apply.',
    trail: 'avancados',
  },
  {
    text: 'Por que o arquivo terraform.tfstate é crítico e não deve ser deletado?',
    badge: '🏗️ Terraform',
    options: [
      'Contém as senhas dos providers em texto claro',
      'É o cache local dos módulos baixados',
      'Mapeia os recursos do código HCL com os recursos reais criados na cloud',
      'É o log de todas as operações realizadas',
    ],
    correct: 2,
    explanation: 'O tfstate é a "memória" do Terraform: sabe que o recurso aws_instance.web corresponde à VM "i-0abc123" na AWS. Sem ele, Terraform perde o rastreamento — não consegue atualizar nem destruir recursos existentes. Use remote state (S3, Terraform Cloud) em equipes.',
    trail: 'avancados',
  },
  {
    text: 'O que "terraform apply -auto-approve" faz de diferente do "terraform apply" padrão?',
    badge: '🏗️ Terraform',
    options: [
      'Aplica apenas os recursos com o tag auto=true',
      'Pula o "terraform plan" e aplica direto sem mostrar o diff',
      'Aplica as mudanças sem exibir o prompt interativo de confirmação — ideal para pipelines CI/CD',
      'Aplica e faz rollback automático em caso de erro',
    ],
    correct: 2,
    explanation: '"terraform apply" exibe o plan e aguarda "yes" interativo. "-auto-approve" bypassa essa confirmação — essencial em pipelines CI/CD onde não há operador para confirmar. Use com cautela: sem revisão humana, um apply destrutivo executa imediatamente.',
    trail: 'avancados',
  },

  // ========== Suricata IDS/IPS (Sprint I.18) ==========
  {
    text: 'Qual a diferença entre o modo IDS e o modo IPS no Suricata?',
    badge: '🛡️ Suricata',
    options: [
      'IDS analisa logs passados; IPS analisa em tempo real',
      'IDS detecta e alerta (passivo, af-packet); IPS bloqueia o pacote (inline, NFQUEUE)',
      'IDS é para redes internas; IPS para tráfego externo',
      'IDS usa regras da Emerging Threats; IPS usa regras customizadas',
    ],
    correct: 1,
    explanation: 'No modo IDS (af-packet), o Suricata recebe cópias dos pacotes em modo promíscuo — detecta e alerta, mas não interfere. No modo IPS (NFQUEUE), os pacotes passam pelo Suricata antes de serem encaminhados — pode DROP o pacote antes de chegar ao destino.',
    trail: 'avancados',
  },
  {
    text: 'O que é o "EVE JSON" no Suricata?',
    badge: '🛡️ Suricata',
    options: [
      'O editor de regras visual do Suricata',
      'Um formato de log estruturado JSON que unifica alertas, flows, DNS e HTTP num único arquivo',
      'O protocolo de comunicação entre sensores Suricata distribuídos',
      'O módulo de geolocalização de IPs do Suricata',
    ],
    correct: 1,
    explanation: 'EVE (Extensible Event Format) é o formato de log principal do Suricata: cada linha é um JSON com tipo (alert, flow, dns, http, tls), timestamp, IPs, portas e detalhes. Facilita integração com Elasticsearch/Grafana/SIEM sem parser customizado.',
    trail: 'avancados',
  },
  {
    text: 'O que o comando "suricata-update" faz?',
    badge: '🛡️ Suricata',
    options: [
      'Atualiza o binário do Suricata para a versão mais recente via apt',
      'Baixa e atualiza as regras de detecção (Emerging Threats e outras fontes configuradas)',
      'Reinicia o processo Suricata aplicando a nova configuração do suricata.yaml',
      'Exporta os alertas do EVE JSON para um servidor SIEM remoto',
    ],
    correct: 1,
    explanation: 'suricata-update é a ferramenta oficial de gerenciamento de regras. Baixa sources configuradas (ex: et/open com ~40.000 regras), resolve conflitos, aplica modificações locais e recarrega as regras. Deve ser executado periodicamente via cron para manter as assinaturas atualizadas.',
    trail: 'avancados',
  },

  // ========== eBPF & XDP (Sprint I.19) ==========
  {
    text: 'Qual vantagem do eBPF sobre módulos de kernel tradicionais (LKMs)?',
    badge: '⚡ eBPF',
    options: [
      'eBPF é 10x mais rápido que qualquer LKM',
      'eBPF não precisa de privilégios root para executar',
      'O verificador estático garante que programas eBPF não podem crashar o kernel',
      'eBPF funciona em espaço de usuário sem acesso ao kernel',
    ],
    correct: 2,
    explanation: 'Antes de carregar, o verificador eBPF analisa o bytecode: sem loops infinitos, sem acessos a memória inválida, sem syscalls proibidas. Um LKM com bug pode travar o kernel; um programa eBPF inválido é simplesmente rejeitado na carga.',
    trail: 'avancados',
  },
  {
    text: 'O que o hook XDP_DROP faz e qual sua principal vantagem?',
    badge: '⚡ eBPF',
    options: [
      'Descarta o pacote após o processamento completo da pilha de rede',
      'Redireciona o pacote para outra interface de rede',
      'Descarta o pacote antes de entrar no kernel network stack — latência mínima',
      'Duplica o pacote para análise em paralelo',
    ],
    correct: 2,
    explanation: 'XDP_DROP descarta o pacote no driver da NIC, antes mesmo de alocar um skb (socket buffer). É o método mais eficiente de mitigação de DDoS — throughputs de 100Gbps são possíveis porque o pacote nunca entra no stack Linux.',
    trail: 'avancados',
  },
  {
    text: 'O que a ferramenta "execsnoop" do BCC mostra em tempo real?',
    badge: '⚡ eBPF',
    options: [
      'O consumo de CPU de cada executável em execução no sistema',
      'Cada chamada de sistema execve: PID, processo pai, comando executado e argumentos',
      'Os arquivos executáveis mais acessados nas últimas 24 horas',
      'As permissões de execução de cada binário no PATH',
    ],
    correct: 1,
    explanation: 'execsnoop usa kprobes eBPF para interceptar a syscall execve em tempo real. Cada linha mostra: PCOMM (processo pai), PID, PPID, RET (código de retorno) e ARGS (executável + argumentos). Essencial para detectar spawning anômalo de processos — ex: um webserver executando curl ou bash.',
    trail: 'avancados',
  },

  // ========== Service Mesh com Istio (Sprint I.20) ==========
  {
    text: 'O que é mTLS no contexto de Service Mesh com Istio?',
    badge: '🕸️ Service Mesh',
    options: [
      'TLS unidirecional onde apenas o cliente verifica o certificado do servidor',
      'TLS mútuo onde cliente e servidor trocam e verificam certificados entre si',
      'Uma versão mais rápida do TLS otimizada para microsserviços',
      'TLS gerenciado automaticamente pelo Kubernetes',
    ],
    correct: 1,
    explanation: 'mTLS (mutual TLS) exige que ambos os lados apresentem certificados X.509. O Istio injeta proxies Envoy que gerenciam os certificados automaticamente (via SPIFFE/SPIRE). Cada serviço tem identidade criptográfica única — sem mTLS manual no código da aplicação.',
    trail: 'avancados',
  },
  {
    text: 'O que um VirtualService do Istio controla?',
    badge: '🕸️ Service Mesh',
    options: [
      'Quais Pods fazem parte de um subconjunto de serviço',
      'As regras de circuit breaker e timeout dos serviços',
      'As regras de roteamento: canary (90/10), A/B por header, retry, timeout e injeção de falhas',
      'Os certificados mTLS de cada serviço no mesh',
    ],
    correct: 2,
    explanation: 'VirtualService define como o tráfego é roteado PARA um serviço: split de peso (90% stable, 10% canary), roteamento por header (X-Version: v2), retry automático (3 tentativas, 25ms timeout), injeção de falha para chaos testing. DestinationRule define os subsets.',
    trail: 'avancados',
  },
  {
    text: 'O que uma DestinationRule do Istio define, complementando o VirtualService?',
    badge: '🕸️ Service Mesh',
    options: [
      'As regras de roteamento por porcentagem entre versões do serviço',
      'As permissões de acesso entre serviços (quem pode chamar quem)',
      'Os subsets (versões) de um serviço e políticas de circuit breaker, retries e TLS por subset',
      'Os certificados mTLS individuais de cada pod no mesh',
    ],
    correct: 2,
    explanation: 'DestinationRule define os subsets (ex: version: v1 e version: v2 por label) e as políticas de tráfego: circuit breaker (outlierDetection — ejeta hosts com erros), timeouts de conexão, configurações TLS por subset. O VirtualService decide PARA ONDE rotear; a DestinationRule define COMO chegar.',
    trail: 'avancados',
  },

  // ========== SRE & SLOs (Sprint I.21) ==========
  {
    text: 'O que é "error budget" em SRE?',
    badge: '🎯 SRE',
    options: [
      'O orçamento financeiro reservado para incidentes de produção',
      'O número máximo de bugs permitidos por sprint',
      'A quantidade de downtime/erros que resta antes de violar o SLO no período',
      'O tempo máximo que um on-call pode gastar por semana',
    ],
    correct: 2,
    explanation: 'Error budget = (1 - SLO) × período. Um SLO de 99,9% em 30 dias tem ~43 minutos de error budget. Enquanto há budget sobrando, a equipe pode lançar features; quando o budget se esgota, todas as mudanças são congeladas até o período seguinte.',
    trail: 'avancados',
  },
  {
    text: 'O que distingue um SLI de um SLO?',
    badge: '🎯 SRE',
    options: [
      'SLI é definido pelo cliente; SLO pela equipe de engenharia',
      'SLI é a métrica real medida; SLO é o target que ela deve atingir',
      'SLI mede disponibilidade; SLO mede latência',
      'SLI é calculado mensalmente; SLO é calculado diariamente',
    ],
    correct: 1,
    explanation: 'SLI (Service Level Indicator) é a medição: "99,95% das requests retornaram < 200ms esta semana". SLO (Objective) é o target: "SLI de latência deve ser ≥ 99,9%". SLA (Agreement) é o contrato com penalidades — geralmente mais conservador que o SLO interno.',
    trail: 'avancados',
  },
  {
    text: 'Um SLO de 99,9% ao mês equivale a quanto tempo de indisponibilidade permitido?',
    badge: '🎯 SRE',
    options: ['~4 horas e 22 minutos', '~43 minutos', '~8 horas', '~2 minutos'],
    correct: 1,
    explanation: '(1 - 0,999) × 30 × 24 × 60 = 0,001 × 43.200 = 43,2 minutos. É útil memorizar: 99,9% = ~43 min/mês, 99,99% = ~4,3 min/mês, 99,999% = ~26 seg/mês. Esses números guiam decisões de arquitetura e custo.',
    trail: 'avancados',
  },

  // ========== CI/CD com GitHub Actions (Sprint I.22) ==========
  {
    text: 'Para que serve o "needs:" em um workflow do GitHub Actions?',
    badge: '🚀 CI/CD',
    options: [
      'Define as dependências de software necessárias para o job',
      'Cria uma dependência entre jobs — o job só roda após os listados completarem',
      'Especifica os secrets necessários para o workflow',
      'Define o ambiente (environment) onde o job será executado',
    ],
    correct: 1,
    explanation: 'needs: [lint, test] faz o job atual aguardar que lint e test completem com sucesso. Se qualquer dependência falhar, o job não executa. Isso cria pipelines sequenciais (build só roda se testes passam) enquanto jobs independentes rodam em paralelo.',
    trail: 'avancados',
  },
  {
    text: 'Qual a principal diferença entre um environment "staging" e um environment com "required reviewers" no GitHub Actions?',
    badge: '🚀 CI/CD',
    options: [
      'Staging usa runners Linux; production usa runners Windows',
      'Staging tem secrets diferentes; production não tem secrets',
      'Staging deploya automaticamente; production pausa e exige aprovação manual antes de continuar',
      'Staging roda em paralelo com production; não há diferença de aprovação',
    ],
    correct: 2,
    explanation: 'Um environment com required reviewers cria um "deployment protection rule": o workflow pausa e envia notificação aos aprovadores. Apenas após aprovação explícita no GitHub o job continua. Evita deploys acidentais em production.',
    trail: 'avancados',
  },
  {
    text: 'O que é "matrix strategy" em um workflow do GitHub Actions?',
    badge: '🚀 CI/CD',
    options: [
      'Uma estratégia de rollback que reverte automaticamente deploys com falha',
      'Executa o mesmo job em paralelo para múltiplas combinações de variáveis (ex: node 18/20/22 × ubuntu/windows)',
      'Um padrão para dividir a test suite em múltiplos shards para execução paralela',
      'Uma configuração para balancear a carga entre múltiplos runners GitHub-hosted',
    ],
    correct: 1,
    explanation: 'matrix: {node: [18, 20, 22], os: [ubuntu, windows]} gera 6 jobs em paralelo (3×2). Cada job recebe matrix.node e matrix.os como variáveis. Ideal para testar compatibilidade multi-versão. "fail-fast: false" garante que todos os jobs concluam mesmo se um falhar.',
    trail: 'avancados',
  },

  // ========== OPNsense / pfSense (Sprint I.23) ==========
  {
    text: 'No OPNsense (baseado em pf), em qual direção as regras de firewall são avaliadas por padrão?',
    badge: '🔥 OPNsense',
    options: [
      'Egress — ao sair da interface (outbound)',
      'Bidirectional — ao entrar e sair',
      'Ingress — ao entrar na interface (inbound)',
      'No roteador, antes de qualquer interface',
    ],
    correct: 2,
    explanation: 'O pf (packet filter) do FreeBSD/OPNsense avalia regras no ingresso de cada interface. Uma regra na interface LAN bloqueia tráfego entrando pela LAN. Para bloquear tráfego saindo pela WAN, crie a regra na interface WAN.',
    trail: 'avancados',
  },
  {
    text: 'O que é o protocolo CARP usado pelo OPNsense para Alta Disponibilidade?',
    badge: '🔥 OPNsense',
    options: [
      'Um protocolo de roteamento para balanceamento de carga entre firewalls',
      'Common Address Redundancy Protocol — compartilha um IP virtual entre dois firewalls (MASTER/BACKUP)',
      'Um protocolo de sincronização de regras entre múltiplos OPNsense',
      'Um protocolo de tunnel VPN entre firewalls geograficamente distribuídos',
    ],
    correct: 1,
    explanation: 'CARP permite que dois firewalls compartilhem um VIP (Virtual IP). O MASTER anuncia via multicast; se parar de responder, o BACKUP assume o VIP em segundos. Os clientes nunca percebem a troca — eles sempre usam o VIP.',
    trail: 'avancados',
  },
  {
    text: 'O que são "Aliases" no OPNsense e por que simplificam o gerenciamento de regras?',
    badge: '🔥 OPNsense',
    options: [
      'Nomes alternativos para interfaces de rede (WAN, LAN, DMZ)',
      'Grupos nomeados e reutilizáveis de IPs, redes, portas ou domínios usados em múltiplas regras de firewall',
      'Certificados SSL alternativos para múltiplos domínios no mesmo IP',
      'Redirecionamentos DNS para resolver hostnames internos',
    ],
    correct: 1,
    explanation: 'Aliases agrupam IPs/redes/portas/domínios em um nome simbólico. Ex: o alias "SERVIDORES_DMZ" com 3 IPs pode ser usado em 20 regras. Para adicionar um novo servidor, você atualiza apenas o alias — todas as regras são atualizadas automaticamente. Reduz erros e facilita auditoria.',
    trail: 'avancados',
  },

  // ========== Nextcloud (Sprint I.24) ==========
  {
    text: 'Por que o Redis é essencial em uma instalação Nextcloud com múltiplos usuários simultâneos?',
    badge: '☁️ Nextcloud',
    options: [
      'Redis aumenta a velocidade de download de arquivos grandes',
      'Redis gerencia file locking e cache de sessão — evita corrompimento de dados em acesso simultâneo',
      'Redis é o banco de dados principal do Nextcloud',
      'Redis comprime arquivos automaticamente antes de armazenar',
    ],
    correct: 1,
    explanation: 'Sem Redis, o Nextcloud usa file locking baseado em sistema de arquivos — lento e sujeito a race conditions. Com Redis (memcache.locking = Redis), os locks são atômicos e em memória. Também serve de cache de sessão PHP, reduzindo consultas ao banco.',
    trail: 'avancados',
  },
  {
    text: 'Qual protocolo aberto o Nextcloud usa para sincronizar calendários com clientes como Thunderbird ou Apple Calendar?',
    badge: '☁️ Nextcloud',
    options: ['iCalendar (ICS)', 'CalDAV', 'Exchange ActiveSync', 'WebDAV'],
    correct: 1,
    explanation: 'CalDAV (Calendar Distributed Authoring and Versioning) é o protocolo padrão para sincronização bidirecional de calendários. O Nextcloud implementa CalDAV sobre HTTPS. O mesmo princípio vale para contatos: CardDAV.',
    trail: 'avancados',
  },
  {
    text: 'Qual ferramenta de linha de comando do Nextcloud permite ajustar configurações do sistema sem usar a interface web?',
    badge: '☁️ Nextcloud',
    options: ['nextcloud-admin', 'nc-config', 'occ', 'ncadmin'],
    correct: 2,
    explanation: '"occ" (ownCloud Console, herdado do ownCloud) é a CLI do Nextcloud. Permite: occ config:system:set (ajustar config.php), occ maintenance:mode --on/off, occ user:add, occ app:enable, occ db:convert-filecache-bigint (migrations). Em containers Docker: docker exec -u www-data nextcloud php occ ...',
    trail: 'avancados',
  },

  // ========== eBPF Avançado + Cilium (Sprint I.25) ==========
  {
    text: 'Por que o Cilium oferece vantagem de performance sobre kube-proxy em clusters com muitos Services?',
    badge: '🧬 eBPF Avançado',
    options: [
      'Cilium usa UDP em vez de TCP para comunicação entre pods',
      'Cilium implementa load balancing em eBPF maps com lookup O(1) vs O(N) regras iptables do kube-proxy',
      'Cilium comprime os pacotes antes de encaminhar',
      'Cilium usa hardware offload obrigatório na NIC',
    ],
    correct: 1,
    explanation: 'kube-proxy cria regras iptables DNAT para cada endpoint de cada Service. Com 10k Services = ~40k regras = avaliação sequencial O(N). Cilium usa BPF_MAP_TYPE_LRU_HASH com lookup O(1) — o mesmo tempo para 10 ou 100.000 Services.',
    trail: 'avancados',
  },
  {
    text: 'O que o comando "hubble observe --verdict DROPPED" exibe?',
    badge: '🧬 eBPF Avançado',
    options: [
      'Todos os pods que foram terminados pelo Kubernetes',
      'Fluxos de rede bloqueados por CiliumNetworkPolicy em tempo real, com o motivo',
      'Pacotes descartados pelo kernel por erro de checksum',
      'Conexões TCP que expiraram por timeout',
    ],
    correct: 1,
    explanation: 'O Hubble captura cada decisão de forwarding no kernel. --verdict DROPPED filtra apenas os fluxos bloqueados — essencial para debugar políticas. A saída inclui origem, destino, porta, protocolo e o motivo: "policy-denied", "unknown-connection", etc.',
    trail: 'avancados',
  },
  {
    text: 'Qual action do Tetragon TracingPolicy termina um processo no momento do execve, antes de qualquer instrução rodar?',
    badge: '🧬 eBPF Avançado',
    options: ['action: Block', 'action: Deny', 'action: Sigkill', 'action: Terminate'],
    correct: 2,
    explanation: 'action: Sigkill envia SIGKILL no hook do kprobe __x64_sys_execve — antes mesmo do novo processo executar uma única instrução. Para uma nc tentando abrir conexão: o processo morre antes de criar qualquer socket.',
    trail: 'avancados',
  },

  // ========== SSH como Proxy SOCKS (Sprint SSH-PROXY) — F15 Fundamentos ==========
  {
    text: 'Qual a diferença fundamental entre "ssh -L 5432:db.lan:5432 user@bastion" e "ssh -D 1080 user@bastion"?',
    badge: '🚇 SSH Tunneling',
    options: [
      '-L cria um proxy SOCKS5 dinâmico; -D faz forward de uma porta específica',
      '-L redireciona uma porta local para um destino fixo; -D cria um proxy SOCKS5 que roteia para qualquer destino',
      '-L é mais seguro porque usa TLS adicional; -D usa apenas SSH',
      '-L funciona sem autenticação; -D exige chave SSH',
    ],
    correct: 1,
    explanation: '-L (Local Forward) cria um túnel fixo: porta local → host:porta remota específica. -D (Dynamic) cria um proxy SOCKS5: o cliente decide o destino em tempo real — ideal para browser, curl, ou qualquer app que suporte SOCKS.',
    trail: 'fundamentos',
  },
  {
    text: 'Um desenvolvedor quer acessar um painel interno em http://painel.lan:8080 usando o bastion como intermediário. Qual comando usar?',
    badge: '🚇 SSH Tunneling',
    options: [
      'ssh -R 8080:painel.lan:8080 user@bastion',
      'ssh -D 8080 user@bastion',
      'ssh -L 8080:painel.lan:8080 user@bastion',
      'ssh -J painel.lan user@bastion',
    ],
    correct: 2,
    explanation: '-L (Local Forward) é o correto: "redirecione minha porta local 8080 para painel.lan:8080 visto pelo bastion". Depois basta abrir http://localhost:8080 no browser. O bastion age como pivot — acessa painel.lan que só é acessível a partir da rede interna.',
    trail: 'fundamentos',
  },
  {
    text: 'O que o flag -J faz no comando "ssh -J bastion.empresa.com admin@192.168.10.50"?',
    badge: '🚇 SSH Tunneling',
    options: [
      'Abre duas sessões SSH paralelas para redundância',
      'Usa o bastion como Jump Host: conecta ao bastion e de lá salta para 192.168.10.50, tudo transparente',
      'Envia o tráfego por duas rotas diferentes para balanceamento',
      'Cria um túnel SOCKS5 via bastion para acessar 192.168.10.50',
    ],
    correct: 1,
    explanation: 'ProxyJump (-J) encadeia conexões SSH sem abrir shell no intermediário. O cliente SSH negocia uma sessão ao bastion e pede para o bastion fazer TCP forward até 192.168.10.50:22. Para o destino final, a conexão parece vir do bastion. Pode encadear múltiplos saltos com vírgula: -J hop1,hop2,hop3.',
    trail: 'fundamentos',
  },
];
