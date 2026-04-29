# Modulos do Laboratorio Linux

*Para cada módulo: Conceito → Por que importa → Exemplo real → Checklist → Erros comuns*

---

## Módulo 1 — Instalação & Fundação

**Conceito:** O laboratório simula uma rede corporativa real com três zonas (WAN, DMZ, LAN). Antes de configurar qualquer serviço, a fundação de IP e roteamento precisa estar sólida.

**Por que importa:** Sem roteamento ativo no kernel, o Firewall não encaminha pacotes — vira apenas um host comum.

**Exemplo prático:**
```bash
# Habilitar roteamento de pacotes no kernel Linux
sysctl -w net.ipv4.ip_forward=1

# Tornar permanente (reinicializações)
echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
```

**Checklist de validação:**
- [ ] O Firewall pinga o Gateway da WAN?
- [ ] O Firewall pinga o Web Server na DMZ?
- [ ] O Firewall pinga o Cliente na LAN?

**Erros comuns:**
- **Gateway ausente:** VM sem gateway não sabe como sair da própria rede.
- **Interfaces trocadas:** Confundir `eth0` (WAN) com `eth1` (LAN) no VirtualBox gera caos silencioso.

---

## Módulo 2 — WAN & NAT

**Conceito:** O NAT (Network Address Translation) permite que a rede interna inteira navegue na internet usando um único IP público. O Masquerade é o NAT dinâmico — ideal quando o IP da WAN muda.

**Por que importa:** IPs privados (192.168.x.x, 10.x.x.x) não são roteáveis na internet. Sem NAT, a rede interna fica isolada.

**Exemplo prático:**
```bash
# SNAT dinâmico — substitui o IP de origem pelo IP da eth0
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Listar regras NAT para validar
iptables -t nat -L -n -v
```

**Checklist de validação:**
- [ ] O cliente da LAN consegue `ping 8.8.8.8`?
- [ ] A regra aparece no `iptables -t nat -L -n`?

**Erros comuns:**
- **Masquerade na interface errada:** Aplicar na `eth1` (LAN) em vez da `eth0` (WAN).
- **FORWARD ausente:** O NAT traduz o IP, mas a chain FORWARD ainda precisa autorizar a passagem entre interfaces.

---

## Módulo 3 — DNS BIND9

**Conceito:** O DNS traduz nomes amigáveis (`www.workshop.local`) em IPs que as máquinas entendem. O BIND9 é o servidor DNS padrão em ambientes Linux corporativos.

**Por que importa:** Se o DNS falha, a rede "para" mesmo com a internet funcionando. É o serviço mais crítico da infraestrutura — e o primeiro a ser culpado por qualquer problema.

**Exemplo prático:**
```bash
# Consultar zona direta
dig @192.168.56.100 www.workshop.local

# Verificar sintaxe do arquivo de configuração
named-checkconf

# Verificar arquivo de zona
named-checkzone workshop.local /etc/bind/db.workshop.local
```

**Checklist de validação:**
- [ ] O `named-checkconf` não retorna erros?
- [ ] A zona reversa resolve o IP de volta para o nome?
- [ ] O cliente da LAN resolve `www.workshop.local` via `dig`?

**Erros comuns:**
- **Ponto final ausente:** `ns1.workshop.local` sem ponto no arquivo de zona causa resolução incorreta.
- **Serial não incrementado:** Alterar a zona sem aumentar o serial faz os resolvers ignorarem a atualização.
- **Porta 53 bloqueada:** Verificar se o iptables não está bloqueando UDP/TCP 53 no Firewall.

---

## Módulo 4 — Nginx & SSL/TLS

**Conceito:** O SSL/TLS criptografa o canal entre navegador e servidor. O Nginx atua como servidor web e termina a conexão HTTPS antes de repassar ao backend.

**Por que importa:** HTTPS é obrigatório. Sem ele, senhas e dados trafegam em texto puro — visíveis para qualquer um na mesma rede Wi-Fi.

**Exemplo prático:**
```bash
# Gerar chave privada e CSR (Certificate Signing Request)
openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr

# Gerar certificado autoassinado (para laboratório)
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

# Permissão correta na chave privada — apenas root lê
chmod 600 server.key
```

**Checklist de validação:**
- [ ] O cadeado aparece no navegador (mesmo que autoassinado)?
- [ ] O Nginx redireciona automaticamente porta 80 → 443?
- [ ] `curl -I https://www.workshop.local` retorna 200?

**Erros comuns:**
- **Permissão errada na chave:** `.key` deve ser `600` — qualquer permissão maior é risco de segurança.
- **Mixed Content:** Site HTTPS que carrega imagens via HTTP exibe cadeado amarelo/quebrado.

---

## Módulo 5 — Squid Proxy

**Conceito:** O Proxy é um intermediário entre o usuário e a internet. Recebe a requisição, aplica as ACLs (listas de controle de acesso) e decide se permite ou bloqueia.

**Por que importa:** Empresas precisam controlar o acesso para evitar perda de produtividade, infecções por malware e vazamento de dados.

**Exemplo prático:**
```bash
# squid.conf — ACL de bloqueio por arquivo de lista
acl negados url_regex -i "/etc/squid/negados.txt"
http_access deny negados

# squid.conf — bloqueio por domínio (melhor para HTTPS)
acl redes_sociais dstdomain .facebook.com .instagram.com .tiktok.com
http_access deny redes_sociais

# Monitorar acessos em tempo real
tail -f /var/log/squid/access.log
```

**Checklist de validação:**
- [ ] Sites em `negados.txt` retornam página de bloqueio?
- [ ] O log mostra os acessos em tempo real?
- [ ] O cliente da LAN está configurado para usar o proxy?

**Erros comuns:**
- **Ordem das ACLs:** `http_access allow all` antes dos bloqueios anula tudo — ordem importa.
- **HTTPS e url_regex:** O Squid sem SSL Bump não vê a URL completa de sites HTTPS, apenas o domínio. Use `dstdomain`.

---

## Módulo 6 — DNAT & Port Forwarding

**Conceito:** O DNAT (Destination NAT) redireciona pacotes que chegam na WAN para servidores dentro da rede. É como dizer "quem bater na porta 80 da minha casa, mando para o servidor interno".

**Por que importa:** Permite hospedar serviços (web, e-mail, VPN) atrás de um firewall sem expor os servidores diretamente.

**Exemplo prático:**
```bash
# Redirecionar porta 80 da WAN para o Web Server na DMZ
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 \
  -j DNAT --to-destination 192.168.56.120

# Autorizar o pacote atravessar o Firewall (OBRIGATÓRIO)
iptables -A FORWARD -p tcp -d 192.168.56.120 --dport 80 -j ACCEPT
```

**Checklist de validação:**
- [ ] Acesso ao IP da WAN na porta 80 chega no servidor interno?
- [ ] A regra FORWARD correspondente existe?

**Erros comuns:**
- **Esquecer o FORWARD:** O DNAT muda o destino, mas o filtro FORWARD ainda bloqueia o pacote.
- **Gateway do servidor interno:** O servidor na DMZ deve usar o Firewall como gateway, senão a resposta de retorno não sabe por onde voltar.

---

## Módulo 7 — Port Knocking

**Conceito:** Técnica de segurança por obscuridade. Todas as portas ficam `filtered` (invisíveis). Uma sequência secreta de "batidas" em portas específicas abre temporariamente o acesso.

**Por que importa:** Um servidor SSH com Port Knocking é invisível para scanners automáticos. Se o atacante não sabe a sequência, não sabe nem que existe um SSH.

**Exemplo prático:**
```bash
# Sequência: bater em 1000, 2000, 3000 — abre SSH por 10 segundos
iptables -A INPUT -p tcp --dport 22 -m recent --rcheck --name FASE3 -j ACCEPT
iptables -A INPUT -p tcp --dport 3000 -m recent --rcheck --name FASE2 \
  -m recent --name FASE3 --set -j DROP
iptables -A INPUT -p tcp --dport 2000 -m recent --rcheck --name FASE1 \
  -m recent --name FASE2 --set -j DROP
iptables -A INPUT -p tcp --dport 1000 -m recent --name FASE1 --set -j DROP

# Validar — deve mostrar "filtered"
nmap -p 22 IP_DO_FIREWALL
```

**Checklist de validação:**
- [ ] `nmap` mostra a porta 22 como `filtered`?
- [ ] Após a sequência correta, o SSH conecta em menos de 10s?

**Erros comuns:**
- **Timeout curto demais:** Bater as portas lentamente faz o sistema esquecer a etapa anterior.
- **Regra ESTABLISHED ausente:** Sem ela, a conexão cai quando o timer de abertura expira.

---

## Módulo 8 — VPN IPSec

**Conceito:** Cria um túnel criptografado entre dois Firewalls através da internet, interligando redes distantes como se fossem a mesma rede física.

**Por que importa:** É o padrão corporativo para conectar filiais (Site-to-Site) e para acesso remoto seguro de funcionários.

**Exemplo prático:**
```bash
# Verificar status do túnel VPN (StrongSwan)
ipsec statusall

# Status esperado para túnel ativo:
# ESTABLISHED — Fase 1 OK (canal de negociação)
# INSTALLED    — Fase 2 OK (túnel de dados ativo)

# Testar conectividade entre redes
ping -c 4 10.0.0.1   # IP na rede da Filial a partir da Matriz
```

**Checklist de validação:**
- [ ] `ipsec statusall` mostra `ESTABLISHED` e `INSTALLED`?
- [ ] A rede da Matriz pinga a rede da Filial?
- [ ] As portas UDP 500 e 4500 estão abertas no Firewall?

**Erros comuns:**
- **PSK diferente nos dois lados:** A chave pré-compartilhada deve ser idêntica — qualquer diferença impede a Fase 1.
- **Firewall bloqueando UDP 500/4500:** O IKE (negociação de chaves) usa essas portas. Sem elas, o túnel nunca sobe.

---

## Módulo 9 — nftables (sucessor moderno do iptables)

**Conceito:** `nftables` unifica `iptables`, `ip6tables`, `arptables` e `ebtables` em um único framework com sintaxe mais limpa, tabelas multi-família e melhor performance via pattern matching compilado.

**Por que importa:** É o **padrão oficial do kernel Linux moderno** — distribuições novas já migraram. `iptables` continua funcionando via `iptables-nft` (wrapper), mas entender nftables é essencial para operar ambientes atuais.

**Exemplo prático:**
```bash
# Criar tabela e chain básica
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }

# Permitir SSH e tráfego estabelecido
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept

# Listar tudo
nft list ruleset

# Salvar ruleset (Debian/Ubuntu)
nft list ruleset > /etc/nftables.conf
```

**Checklist de validação:**
- [ ] `nft list ruleset` mostra as tabelas e chains criadas?
- [ ] Conexões estabelecidas sobrevivem a reloads (`ct state`)?
- [ ] Regras persistem após reboot (`nftables.service` ativo)?

**Erros comuns:**
- **Priority errado:** A chain padrão filter tem `priority 0` (equivalente a INPUT do iptables). Priority menor executa antes.
- **Misturar iptables-legacy e nft:** Em sistemas que usam `iptables-nft`, rodar `iptables-legacy` cria duas pilhas paralelas — confuso e instável.

> Ver deep dive `nftables-vs-iptables` em `/nftables` para comparação completa.

---

## Trilha v2.0 — Fundamentos Linux (14 módulos em `/fundamentos`)

*Para iniciantes vindos do Windows ou sem experiência Linux prévia.*

### F01 — Estrutura do Sistema (FHS) · `/fhs`
Hierarquia do Filesystem Linux: `/etc` (configuração), `/var` (dados variáveis), `/proc` (kernel virtual), `/usr` (programas), `/home` (usuários). Essencial para saber onde cada coisa mora.

### F02 — Comandos Essenciais · `/comandos`
`ls`, `cd`, `cp`, `mv`, `rm`, `find`, `grep`, `pipe |`, `redirecionamento >/>>`... A caixa de ferramentas básica que todo SysAdmin usa diariamente.

### F03 — Editores: nano e VIM · `/editores`
nano para iniciantes (Ctrl+O salva, Ctrl+X sai). VIM em 4 modos: Normal/Insert/Visual/Command. `:wq`, `dd`, `yy`, `/busca` — suficiente para editar configs em produção.

### F04 — Gerenciamento de Processos · `/processos`
`ps aux`, `top`/`htop`, `kill`/`killall`, `systemctl start/stop/enable/status`, `journalctl -u servico`. Controle total sobre o que está rodando no servidor.

### F05 — Permissões e Usuários · `/permissoes`
`chmod` (octal e simbólico), `chown`, `useradd`/`usermod`/`userdel`, `sudo`, `/etc/sudoers`. O modelo de segurança Unix explicado com analogias do mundo real.

### F06 — Discos e Partições · `/discos`
`fdisk`/`parted`, `mkfs`, `mount`/`umount`, `/etc/fstab`, `df -h`, `du -sh`. Do particionamento ao ponto de montagem persistente.

### F07 — Logs e Monitoramento · `/logs-basicos`
`journalctl` (com/sem filtros), `/var/log/syslog`/`auth.log`/`nginx/`, `tail -f` para monitoramento em tempo real. A base para diagnosticar qualquer problema.

### F08 — Backup e Restauração · `/backup`
`tar -czf` / `tar -xzf`, `rsync` (local e remoto via SSH), `scp`, estratégias 3-2-1. Backup que nunca foi testado é apenas ilusão de segurança.

### F09 — Shell Script Bash · `/shell-script`
Variáveis, `$()`, `if/elif/else`, `for`/`while`, funções, `$1`/`$@`, `exit 0/1`. Scripts reais para automatizar tarefas repetitivas de SysAdmin.

### F10 — Agendamento de Tarefas · `/cron`
`crontab -e`, sintaxe `* * * * *`, `@reboot`, `systemd timers` como alternativa moderna. Automação silenciosa que roda enquanto você dorme.

### F11 — Instalação de Programas · `/pacotes`
`apt update/upgrade/install/purge/autoremove`, `dpkg -i/.deb`, repositórios + PPAs, `snap`, `pip3` + venv. Fecha o paradoxo: todo módulo usa `apt install` sem nunca explicá-lo.

### F12 — Processo de Boot · `/boot`
BIOS/UEFI → GRUB2 → kernel/initrd → systemd PID 1 → targets. `systemd-analyze blame` para depurar boot lento. `journalctl -b` para logs do boot atual.

### F13 — Comandos Avançados · `/comandos-avancados`
**sed** (substituição in-place), **dd** (cópia de disco/ISO — o "disk destroyer"), **nc/NetCat** (diagnóstico de rede), **ln -s** (links simbólicos vs hard), **gzip/tar/zip** (compactação completa).

### F14 — Logs Centralizados com Rsyslog · `/rsyslog`
`rsyslog.conf` (facilities × priorities), servidor central (imtcp porta 514), cliente remoto (`@@servidor:514`), `logrotate` com compress/delaycompress. Imprescindível para compliance e forense.

---

## Trilha v3.0 — Servidores e Serviços (9 módulos)

*Serviços de infraestrutura que completam o laboratório.*

### S01 — Servidor DHCP · `/dhcp`
`isc-dhcp-server`, `dhcpd.conf` (subnet/range/routers/dns-servers), reservas por MAC address, `/var/lib/dhcp/dhcpd.leases`. Fecha o ciclo: LAN distribui IPs automaticamente como em produção.

### S02 — Samba — File Sharing · `/samba`
`smb.conf`, shares público/privado/homes, `smbpasswd` (usuário Samba ≠ usuário Linux), acesso `\\IP\pasta` no Windows Explorer, `smbclient`/`mount.cifs` no Linux. Portas 137/138 UDP + 139/445 TCP.

### S03 — Apache Web Server · `/apache`
`a2ensite`/`a2dissite`, VirtualHosts por nome, `a2enmod rewrite/ssl/proxy`, SSL com Certbot + autoassinado, proxy reverso `ProxyPass`. Comparativo honesto Apache vs Nginx em 9 critérios.

### S04 — OpenVPN · `/openvpn`
PKI com Easy-RSA (CA + server cert + gen-dh + ta.key), `server.conf` (1194 UDP, dev tun, AES-256-GCM), `client.ovpn` inline, split/full tunnel, revogação com CRL. Vs WireGuard vs IPSec: quando usar cada um.

### S05 — Traefik Proxy Reverso · `/traefik`
Docker Compose com labels automáticas, ACME/Let's Encrypt via `tlschallenge`, middlewares (basicauth, rate-limit, HSTS, redirect HTTP→HTTPS), dashboard seguro. Complemento natural do Docker Compose.

### S06 — LDAP / OpenLDAP · `/ldap`
DIT (DN/dc/ou/cn/uid), slapd, LDIF com OUs e inetOrgPerson+posixAccount+shadowAccount, LDAPS (TLS), PAM com `libpam-ldapd+nslcd` → login SSH via LDAP. Active Directory simplificado para Linux.

### S07 — Docker Networking · `/docker`
Bridge/host/none drivers, redes customizadas + DNS interno, port mapping = DNAT automático, chains `DOCKER`/`DOCKER-USER` no iptables. Visão completa de como Docker interage com a rede do host.

### S08 — Docker Compose · `/docker-compose`
Stack completa Nginx+App+PostgreSQL, redes `frontend`/`backend`/`internal`, volumes nomeados/bind/tmpfs, `.env` + Docker Secrets, `healthcheck` + `deploy.replicas`. Orquestração local sem Kubernetes.

### S09 — Pi-hole · `/pihole`
DNS sinkhole com blocklists gravity, Docker Compose macvlan (IP fixo na LAN), iptables DNAT para forçar DNS, whitelist/blacklist/regex, Unbound como resolver recursivo local (porta 5335, privacidade máxima).

---

## Trilha v4.0 — Infraestrutura Moderna (8 módulos)

*Ferramentas que o mercado corporativo exige hoje.*

### I01 — Ansible para SysAdmins · `/ansible`
Agentless IaC via SSH, inventário INI, comandos ad-hoc, playbooks YAML (tasks/handlers/notify), templates Jinja2 (`loop`/`when`/`register`), roles (galaxy init), Ansible Galaxy, Vault (`ansible-vault create`). Automatize dezenas de servidores com um único `ansible-playbook`.

### I02 — Prometheus + Grafana · `/monitoring`
Arquitetura pull-based (TSDB, scraping 15s), Docker Compose completo (prometheus+node_exporter+alertmanager+grafana), PromQL (`rate()`, `irate()`, `sum by()`), dashboards prontos (ID 1860), `alert_rules.yml`, Alertmanager com email+Slack+`inhibit_rules`. Os 3 pilares da observabilidade.

### I03 — Kubernetes / K3s · `/kubernetes`
K3s (1 comando de instalação), conceitos core (Pod/Deployment/Service/Ingress/ConfigMap/Secret/Namespace/PVC), kubectl, manifestos YAML com `RollingUpdate`+`readinessProbe`, NetworkPolicy (requer Calico em K3s), Helm. Orquestração de containers do zero em ambiente real.

### I04 — Terraform IaC · `/terraform`
HCL declarativo, 7 conceitos core (Provider/Resource/Data Source/Variable/Output/State/Module), projeto Docker provider (main.tf+variables.tf+outputs.tf), workflow `init→plan→apply→destroy`, workspaces, state remoto (S3+DynamoDB, Terraform Cloud, GitLab), provider AWS (EC2+SG+EIP), `lifecycle`/`count`/`for_each`. Infra imutável, versionada, reproduzível.

### I05 — Suricata IDS/IPS · `/suricata`
IDS (passivo af-packet) vs IPS (inline NFQUEUE), `suricata.yaml` (HOME_NET, eve-log), anatomia de regras (ação/protocolo/cabeçalho/opções: alert/drop/pass/reject, msg/sid/rev/content/pcre/flow/threshold), Emerging Threats via `suricata-update` (~40.000 regras), EVE JSON + jq queries, modo IPS com `nftables queue` (fail-closed), integração Grafana/Loki/SIEM. Detecção e bloqueio de ameaças em tempo real.

### I06 — eBPF & XDP · `/ebpf`
eBPF: programa→verifier (segurança formal)→JIT→hook no kernel sem módulo, BCC tools (execsnoop/tcptracer/biolatency/opensnoop/funclatency), bpftrace (sintaxe AWK-like, probes kprobe/uprobe/tracepoint/usdt). XDP (eXpress Data Path): processamento antes do stack TCP/IP, modos native/offload/generic, XDP_DROP para mitigation de flood (programa C + Makefile + teste hping3). Observabilidade de kernel-space e proteção DDoS com overhead mínimo.

### I07 — Service Mesh com Istio · `/service-mesh`
Istio vs Linkerd vs Consul (tabela 7 critérios), arquitetura: istiod (control plane) + Envoy sidecar (data plane), instalação via `istioctl`. mTLS STRICT com SPIFFE/X.509 (PeerAuthentication YAML + AuthorizationPolicy deny-all). VirtualService: canary 90/10, A/B por header, retry+timeout, fault injection (delay/abort). DestinationRule: subsets e circuit breaker com `outlierDetection`. Observabilidade: Kiali (grafo de tráfego), Jaeger (distributed tracing), Grafana (métricas Envoy).

### I08 — SRE & SLOs · `/sre`
SLI/SLO/SLA hierarquia (regra fundamental: SLA < SLO), error budget com tabela dos 9s (99.9%=8.7h/ano, 99.99%=52min/ano), grid de decisão (budget restante → acelerar ou congelar deploys). PromQL para SLIs: recording rules de disponibilidade + latência P99 + burn rates (1h/6h). Alertas de burn rate: crítico 14.4× (1h) + warning 6× (6h). On-call saudável: anti-padrões (alert fatigue), runbook template markdown. Postmortem blameless: Just Culture, template 5 seções, grid blame vs sistêmico. Toil: identificar e eliminar.

---

## Trilha v5.0 — Cloud & Platform Engineering ✅ COMPLETA

*Nível sênior: automação de plataforma, observabilidade avançada e práticas de engenharia de software.*

### C01 — CI/CD com GitHub Actions · `/cicd`
6 conceitos core (Workflow/Job/Step/Action/Runner/Artifact), pipeline CI com jobs paralelos (lint+test) encadeados via `needs` até build + artifact upload, Docker build+push com `login-action`+`metadata-action` (semver+sha tags)+`build-push-action`+cache GHA, environments (staging auto + production com required reviewers), matrix strategy (node 18/20/22 × ubuntu/windows, fail-fast, exclude), scopes de secrets (repo/env/org), self-hosted runner (systemd service), workflows reutilizáveis (`workflow_call`), notificação Slack on-failure. Integração contínua e entrega contínua do zero ao ambiente de produção.

### C02 — OPNsense / pfSense · `/opnsense`
Firewall enterprise com Web UI: tabela comparativa OPNsense vs pfSense (7 critérios), instalação VM 3 NICs (WAN/LAN/DMZ), mapa da interface, regras de firewall por interface (pf avaliado ingress), Aliases (IP/Network/Port/URL), Port Forward = DNAT com equivalências iptables, VPN WireGuard nativo + OpenVPN wizard, plugin Suricata IDS/IPS, Alta Disponibilidade com CARP (FluxoCard failover), API REST e backup automático via cron.

### C03 — Nextcloud — Nuvem Pessoal Self-hosted · `/nextcloud`
Self-hosted cloud storage: Docker Compose stack (Nextcloud+MariaDB+Redis+Traefik com labels ACME), pós-instalação essencial (occ config:system, Redis cache/locking, cron container, 2FA TOTP), 8 apps integradas (Calendar/CalDAV, Contacts/CardDAV, Talk, Collabora Online, Mail, Deck, Maps, Backup), integração LDAP para SSO, object storage MinIO S3-compatible, estratégia de backup 3-2-1 (rsync local + remoto + rclone cloud).

### C04 — eBPF Avançado + Cilium · `/ebpf-avancado`
CNI eBPF nativo no K3s: Cilium substituindo kube-proxy (O(1) eBPF map vs O(N) iptables) e flannel (sem overhead VXLAN), instalação K3s bare + helm install Cilium com `kubeProxyReplacement=true`, Hubble CLI+UI para observabilidade de fluxos L7 em tempo real (`hubble observe --verdict DROPPED`, service map), CiliumNetworkPolicy L3/L4 (default-deny + whitelist por labels) e L7 (HTTP path/method, DNS `toFQDNs` com update dinâmico), eBPF load balancing com DSR, Tetragon runtime security (TracingPolicy `Sigkill` para nc/ncat, detectar acesso `/etc/shadow`), eBPF maps avançados (LRU_HASH, RINGBUF, PERCPU_HASH), bpftrace avançado (kprobes, uprobes, histogramas).

---
[← Voltar ao indice](README.md)
