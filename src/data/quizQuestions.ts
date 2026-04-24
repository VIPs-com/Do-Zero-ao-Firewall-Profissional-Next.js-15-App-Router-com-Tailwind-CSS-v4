/**
 * Perguntas do Quiz — extraídas de `app/quiz/page.tsx` no Sprint F.
 *
 * Motivação: o array hardcoded (~270 linhas) inflava o bundle inicial da rota
 * /quiz. Mover para um módulo de dados permite tree-shaking melhor e deixa o
 * componente de página focado apenas em lógica/UI.
 */

export interface QuizQuestion {
  text: string;
  badge: string;
  options: string[];
  /** Índice (0-based) da opção correta em `options`. */
  correct: number;
  explanation: string;
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
  },
  {
    text: 'O DNAT é configurado em qual chain do iptables?',
    badge: '🎯 DNAT',
    options: ['INPUT', 'OUTPUT', 'PREROUTING', 'POSTROUTING'],
    correct: 2,
    explanation: 'DNAT precisa acontecer ANTES da decisão de roteamento, por isso fica no PREROUTING.',
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
  },

  // ========== DNS ==========
  {
    text: 'Qual registro DNS faz o mapeamento reverso (IP → Nome)?',
    badge: '📖 DNS',
    options: ['Registro A', 'Registro CNAME', 'Registro MX', 'Registro PTR'],
    correct: 3,
    explanation: 'PTR (Pointer) é usado para DNS reverso, associando um IP a um nome de domínio.',
  },
  {
    text: 'Qual protocolo o DNS usa na porta 53?',
    badge: '📖 DNS',
    options: ['Apenas TCP', 'Apenas UDP', 'UDP e TCP', 'ICMP'],
    correct: 2,
    explanation: 'DNS usa UDP para consultas curtas e TCP para transferências de zona e respostas longas.',
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
  },

  // ========== Squid Proxy ==========
  {
    text: 'Qual a porta padrão do Squid Proxy?',
    badge: '🚪 Squid',
    options: ['80', '443', '3128', '8080'],
    correct: 2,
    explanation: 'Squid escuta na porta 3128 por padrão.',
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
  },
  {
    text: 'Qual comando mostra a tabela ARP (mapeamento IP → MAC) da sua máquina?',
    badge: '🔧 Diagnóstico',
    options: ['ip link show', 'ip neigh show', 'ss -tulpn', 'tcpdump -i any'],
    correct: 1,
    explanation: 'ip neigh show mostra a tabela ARP, essencial para diagnóstico da Camada 2.',
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
  },
  {
    text: 'Qual comando mostra as portas abertas e os serviços ouvindo no servidor?',
    badge: '🔧 Diagnóstico',
    options: ['iptables -L -n -v', 'ip route show', 'ss -tulpn', 'conntrack -L'],
    correct: 2,
    explanation: 'ss -tulpn lista todas as portas abertas e qual processo está escutando em cada uma.',
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
  },

  // ========== VPN & IPSec ==========
  {
    text: 'Qual protocolo é usado para estabelecer e gerenciar chaves no IPSec?',
    badge: '🔒 VPN & IPSec',
    options: ['ESP', 'AH', 'IKE', 'NAT-T'],
    correct: 2,
    explanation: 'IKE (Internet Key Exchange) é o protocolo responsável por estabelecer e gerenciar as chaves de criptografia no IPSec.',
  },
  {
    text: 'Qual a porta padrão do IKE (Internet Key Exchange) no IPSec?',
    badge: '🔒 VPN & IPSec',
    options: ['500/UDP', '4500/UDP', '50/ESP', '51/AH'],
    correct: 0,
    explanation: 'IKE usa a porta 500/UDP para negociação inicial. NAT-T usa a porta 4500/UDP quando há NAT no caminho.',
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
  },
  {
    text: 'Qual é a versão mais moderna do IKE, que suporta MOBIKE (roaming entre redes)?',
    badge: '🔒 VPN & IPSec',
    options: ['IKEv1', 'IKEv2', 'IKEv3', 'IKE-MOBIKE'],
    correct: 1,
    explanation: 'IKEv2 é a versão moderna, mais rápida e segura. Suporta MOBIKE, permitindo que a VPN continue ativa ao mudar de rede (ex: Wi-Fi → 4G).',
  },
  {
    text: 'Qual implementação de IPSec é mais usada no Linux?',
    badge: '🔒 VPN & IPSec',
    options: ['OpenVPN', 'WireGuard', 'StrongSwan', 'ipsec-tools'],
    correct: 2,
    explanation: 'StrongSwan é a implementação mais popular de IPSec no Linux, suportando IKEv1, IKEv2, certificados X.509 e integração com sistemas de autenticação.',
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
  },

  // ========== WireGuard ==========
  {
    text: 'Qual algoritmo criptográfico o WireGuard usa para troca de chaves (ECDH)?',
    badge: '🔐 WireGuard',
    options: ['RSA-4096', 'AES-256-GCM', 'Curve25519', 'Diffie-Hellman clássico'],
    correct: 2,
    explanation: 'WireGuard usa Curve25519 para ECDH (troca de chaves) e ChaCha20-Poly1305 para cifragem de dados — mais rápido que AES em hardware sem AES-NI.',
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
  },
  {
    text: 'Qual porta e protocolo o WireGuard usa por padrão?',
    badge: '🔐 WireGuard',
    options: ['1194/UDP (como OpenVPN)', '500/UDP (como IKEv1)', '51820/UDP', '4500/TCP'],
    correct: 2,
    explanation: 'WireGuard usa UDP pela porta 51820 por padrão (configurável com ListenPort). UDP é essencial para o desempenho — WireGuard não suporta TCP.',
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
  },
  {
    text: 'Qual ferramenta converte automaticamente regras iptables para sintaxe nftables?',
    badge: '🔥 nftables',
    options: ['nft convert', 'iptables-translate', 'nft import', 'iptables-to-nft'],
    correct: 1,
    explanation: 'iptables-translate converte uma regra iptables para o equivalente nftables. Ex: iptables-translate -A INPUT -p tcp --dport 22 -j ACCEPT → nft add rule ip filter input tcp dport 22 accept.',
  },

  // ========== Hardening Linux ==========
  {
    text: 'Qual diretiva do sshd_config desativa autenticação por senha, exigindo chave SSH?',
    badge: '🔐 Hardening',
    options: ['RequireKey yes', 'PasswordAuthentication no', 'AuthMethod publickey', 'DisablePasswords yes'],
    correct: 1,
    explanation: 'PasswordAuthentication no desativa login por senha no SSH. Após configurar, apenas autenticação por chave pública funciona. SEMPRE teste a chave antes de aplicar para não se trancar fora do servidor.',
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
  },
  {
    text: 'Qual comando inspeciona as configurações de uma rede Docker, mostrando subnet e containers conectados?',
    badge: '🐳 Docker',
    options: ['docker inspect --network bridge', 'docker network inspect bridge', 'docker ps --format network', 'docker network ls --verbose'],
    correct: 1,
    explanation: 'docker network inspect NOME mostra todas as configurações da rede: subnet, gateway, driver e quais containers estão conectados com seus IPs internos.',
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
  },
  {
    text: 'Em qual arquivo PAM a linha do Google Authenticator deve ser adicionada para proteger o SSH com 2FA?',
    badge: '📱 SSH 2FA',
    options: ['/etc/pam.d/login', '/etc/pam.d/sshd', '/etc/ssh/pam.conf', '/etc/security/pam_google.conf'],
    correct: 1,
    explanation: '/etc/pam.d/sshd é o arquivo PAM específico do OpenSSH. Adicionar "auth required pam_google_authenticator.so" nele faz o SSH chamar o módulo TOTP durante a autenticação.',
  },
];
