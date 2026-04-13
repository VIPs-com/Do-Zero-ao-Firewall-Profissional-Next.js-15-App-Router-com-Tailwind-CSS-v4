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
[← Voltar ao indice](README.md)
