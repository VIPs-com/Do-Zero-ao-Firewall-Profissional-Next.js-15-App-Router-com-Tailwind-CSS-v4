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
  },
  {
    text: 'Para instalar um pacote .deb baixado manualmente (fora de repositório), qual comando usar?',
    badge: '📦 Pacotes',
    options: ['apt install ./pacote.deb', 'dpkg -i pacote.deb', 'pkg install pacote.deb', 'rpm -ivh pacote.deb'],
    correct: 1,
    explanation: 'dpkg -i instala pacotes .deb diretamente. Se houver dependências faltando, rode "apt --fix-broken install" logo depois. Alternativamente, "apt install ./pacote.deb" (com ./) resolve dependências automaticamente.',
  },
  {
    text: 'Qual comando lista todos os pacotes instalados no sistema com dpkg?',
    badge: '📦 Pacotes',
    options: ['dpkg --list', 'dpkg -l', 'apt list --installed', 'dpkg -q all'],
    correct: 1,
    explanation: 'dpkg -l lista todos os pacotes com status (ii = instalado, rc = removido com config restante). A coluna de status indica: primeiro char = desejado, segundo = atual, terceiro = erro.',
  },

  // ========== Processo de Boot (Sprint F5) ==========
  {
    text: 'Qual target do systemd corresponde ao modo multiusuário com rede, mas sem interface gráfica?',
    badge: '🖥️ Boot',
    options: ['graphical.target', 'multi-user.target', 'rescue.target', 'network.target'],
    correct: 1,
    explanation: 'multi-user.target é o equivalente ao runlevel 3 — todos os serviços de rede ativos, múltiplos usuários podem logar, sem GUI. Servidores Linux tipicamente usam este target como padrão.',
  },
  {
    text: 'Qual comando identifica quais serviços estão atrasando o boot, mostrando o tempo de cada um?',
    badge: '🖥️ Boot',
    options: ['journalctl --boot-time', 'systemctl status --all', 'systemd-analyze blame', 'dmesg --timing'],
    correct: 2,
    explanation: 'systemd-analyze blame lista todos os serviços em ordem decrescente de tempo de inicialização. Útil para identificar o gargalo do boot. Use systemd-analyze critical-chain para ver a cadeia crítica.',
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
  },
  {
    text: 'Qual porta TCP é usada pelo SMB moderno (direct hosting, sem NetBIOS)?',
    badge: '🗂️ Samba',
    options: ['139', '137', '445', '3389'],
    correct: 2,
    explanation: 'A porta 445 (SMB direto sobre TCP) é a forma moderna de acesso. A porta 139 era usada com NetBIOS Session Service (legado). Hoje o Windows e o Samba preferem 445. O firewall deve liberar 445/TCP + 137-138/UDP.',
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
  },

  // ========== OpenVPN (Sprint I.10) ==========
  {
    text: 'Qual ferramenta é usada para criar a PKI (CA, certificados de servidor e cliente) para o OpenVPN?',
    badge: '🔒 OpenVPN',
    options: ['openssl-pki', 'Easy-RSA', 'certbot', 'cfssl'],
    correct: 1,
    explanation: 'Easy-RSA é a ferramenta oficial do projeto OpenVPN para gerenciar PKI. Cria a CA (Certificate Authority), assina certificados de servidor e clientes, e gerencia revogação (CRL). É instalada junto com o pacote openvpn.',
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
  },
  {
    text: 'Qual objectClass combina atributos Unix (UID, GID, home) com LDAP para login no sistema?',
    badge: '👥 LDAP',
    options: ['inetOrgPerson', 'posixAccount', 'organizationalUnit', 'groupOfNames'],
    correct: 1,
    explanation: 'posixAccount define os atributos necessários para login Unix: uidNumber, gidNumber, homeDirectory, loginShell. Combinado com inetOrgPerson (cn, sn, mail) e shadowAccount (política de senha), o usuário pode logar via PAM+nslcd.',
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
  },

  // ========== Ansible (Sprint I.14) ==========
  {
    text: 'Qual é a unidade de reutilização recomendada no Ansible para organizar tasks, handlers, templates e variáveis?',
    badge: '⚙️ Ansible',
    options: ['Module', 'Playbook', 'Role', 'Inventory'],
    correct: 2,
    explanation: 'Roles organizam o código Ansible em estrutura padronizada: tasks/, handlers/, templates/, files/, vars/, defaults/, meta/. Uma role é reutilizável entre projetos e pode ser compartilhada via Ansible Galaxy.',
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
  },

  // ========== Prometheus + Grafana (Sprint I.15) ==========
  {
    text: 'Qual função PromQL calcula a taxa de requisições por segundo numa janela de 5 minutos?',
    badge: '📊 Monitoring',
    options: ['increase(requests_total[5m])', 'rate(requests_total[5m])', 'delta(requests_total[5m])', 'sum(requests_total[5m])'],
    correct: 1,
    explanation: 'rate() calcula a taxa por segundo de um counter usando regressão linear na janela de tempo. increase() dá o crescimento absoluto na janela (não por segundo). Use rate() para gráficos de throughput; irate() para detecção de picos.',
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
  },

  // ========== Kubernetes / K3s (Sprint I.16) ==========
  {
    text: 'Qual objeto Kubernetes garante que um número mínimo de réplicas de um Pod esteja sempre rodando?',
    badge: '☸️ Kubernetes',
    options: ['Pod', 'StatefulSet', 'Deployment', 'DaemonSet'],
    correct: 2,
    explanation: 'Deployment gerencia um ReplicaSet que mantém N réplicas do Pod rodando. Se um Pod morrer, o ReplicaSet cria um novo. Deployment também gerencia rolling updates (RollingUpdate strategy) e rollbacks.',
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
  },
  {
    text: 'Um SLO de 99,9% ao mês equivale a quanto tempo de indisponibilidade permitido?',
    badge: '🎯 SRE',
    options: ['~4 horas e 22 minutos', '~43 minutos', '~8 horas', '~2 minutos'],
    correct: 1,
    explanation: '(1 - 0,999) × 30 × 24 × 60 = 0,001 × 43.200 = 43,2 minutos. É útil memorizar: 99,9% = ~43 min/mês, 99,99% = ~4,3 min/mês, 99,999% = ~26 seg/mês. Esses números guiam decisões de arquitetura e custo.',
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
  },
  {
    text: 'Qual protocolo aberto o Nextcloud usa para sincronizar calendários com clientes como Thunderbird ou Apple Calendar?',
    badge: '☁️ Nextcloud',
    options: ['iCalendar (ICS)', 'CalDAV', 'Exchange ActiveSync', 'WebDAV'],
    correct: 1,
    explanation: 'CalDAV (Calendar Distributed Authoring and Versioning) é o protocolo padrão para sincronização bidirecional de calendários. O Nextcloud implementa CalDAV sobre HTTPS. O mesmo princípio vale para contatos: CardDAV.',
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
  },
  {
    text: 'Qual action do Tetragon TracingPolicy termina um processo no momento do execve, antes de qualquer instrução rodar?',
    badge: '🧬 eBPF Avançado',
    options: ['action: Block', 'action: Deny', 'action: Sigkill', 'action: Terminate'],
    correct: 2,
    explanation: 'action: Sigkill envia SIGKILL no hook do kprobe __x64_sys_execve — antes mesmo do novo processo executar uma única instrução. Para uma nc tentando abrir conexão: o processo morre antes de criar qualquer socket.',
  },

  // ========== SSH como Proxy SOCKS (Sprint SSH-PROXY) ==========
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
  },
];
