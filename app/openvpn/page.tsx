'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Key, Shield, Server, Network, Globe, Lock } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function OpenVPNPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/openvpn');
  }, [trackPageVisit]);

  const items = [
    { id: 'openvpn-instalado', label: 'OpenVPN + Easy-RSA instalados, PKI inicializada e certificados CA + servidor gerados' },
    { id: 'openvpn-pki',      label: 'Certificado de cliente gerado com Easy-RSA e arquivo .ovpn criado com certificados inline' },
    { id: 'openvpn-cliente',  label: 'Cliente conectado via .ovpn, interface tun0 ativa e iptables configurado (MASQUERADE + FORWARD)' },
  ];

  return (
    <main className="module-accent-openvpn min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🔒</span>
            <div>
              <p className="section-label">Servidores e Serviços — S04</p>
              <h1 className="text-3xl font-bold text-text">OpenVPN</h1>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-2xl">
            VPN completa com PKI própria: crie sua Autoridade Certificadora com Easy-RSA,
            gere certificados de servidor e cliente, configure o túnel e distribua
            arquivos <code className="text-accent">.ovpn</code> para seus usuários.
            O padrão corporativo de VPN SSL.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do Zero ao Túnel OpenVPN"
          steps={[
            { label: 'easy-rsa init-pki',     sub: 'inicializa a PKI local',                        icon: <Key     size={14}/>, color: 'border-ok/50' },
            { label: 'build-ca + build-server', sub: 'cria CA e certificado do servidor',            icon: <Shield  size={14}/>, color: 'border-accent/50' },
            { label: 'build-client',           sub: 'gera certificado para cada usuário',            icon: <Key     size={14}/>, color: 'border-info/50' },
            { label: 'server.conf',            sub: 'porta 1194 UDP, dev tun, split/full tunnel',   icon: <Server  size={14}/>, color: 'border-layer-5/50' },
            { label: 'client.ovpn',            sub: 'arquivo único com certs inline — distribuir',  icon: <Globe   size={14}/>, color: 'border-layer-6/50' },
            { label: 'iptables NAT + FORWARD', sub: 'masquerade + rotas para LAN interna',          icon: <Network size={14}/>, color: 'border-warn/50' },
          ]}
        />

        {/* Comparação OpenVPN vs WireGuard vs IPSec */}
        <section>
          <h2 className="section-title">OpenVPN vs WireGuard vs IPSec — quando usar cada</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bg-3 text-text-2">
                  <th className="text-left p-3 border border-border">Critério</th>
                  <th className="text-left p-3 border border-border">OpenVPN</th>
                  <th className="text-left p-3 border border-border">WireGuard</th>
                  <th className="text-left p-3 border border-border">IPSec</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Protocolo</td>
                  <td className="p-3 border border-border">TLS/SSL sobre UDP ou TCP</td>
                  <td className="p-3 border border-border">UDP + ChaCha20-Poly1305</td>
                  <td className="p-3 border border-border">IKEv2 + ESP</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">PKI necessária</td>
                  <td className="p-3 border border-border">✅ Easy-RSA (CA + certs)</td>
                  <td className="p-3 border border-border">❌ só par de chaves Ed25519</td>
                  <td className="p-3 border border-border">✅ ou PSK simples</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Compatibilidade</td>
                  <td className="p-3 border border-border">🏆 máxima — todo OS/mobile</td>
                  <td className="p-3 border border-border">Boa — kernel 5.6+ ou app</td>
                  <td className="p-3 border border-border">Nativa no Windows/iOS/Android</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Firewall bypass</td>
                  <td className="p-3 border border-border">✅ pode rodar na 443/TCP</td>
                  <td className="p-3 border border-border">❌ só UDP (bloqueado em redes restritas)</td>
                  <td className="p-3 border border-border">❌ portas 500/4500 fixas</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Performance</td>
                  <td className="p-3 border border-border">Boa (userspace OpenSSL)</td>
                  <td className="p-3 border border-border">🏆 excelente (módulo kernel)</td>
                  <td className="p-3 border border-border">Boa (aceleração kernel)</td>
                </tr>
                <tr className="bg-bg-2">
                  <td className="p-3 border border-border font-medium text-text">Revogar acesso</td>
                  <td className="p-3 border border-border">✅ CRL — revogar 1 cert sem afetar outros</td>
                  <td className="p-3 border border-border">Remover chave pública do servidor</td>
                  <td className="p-3 border border-border">Remover configuração do peer</td>
                </tr>
                <tr>
                  <td className="p-3 border border-border font-medium text-text">Uso ideal</td>
                  <td className="p-3 border border-border">Corporativo, clientes variados, firewall restrito</td>
                  <td className="p-3 border border-border">Site-to-site, mobile pessoal</td>
                  <td className="p-3 border border-border">Infra legada, roteadores enterprise</td>
                </tr>
              </tbody>
            </table>
          </div>
          <InfoBox className="mt-4">
            <strong>Regra prática:</strong> precisa distribuir VPN para funcionários com Windows/Mac/iOS/Android sem instalar drivers extras → <strong>OpenVPN</strong>. Infraestrutura interna entre servidores Linux → <strong>WireGuard</strong>. Integração com Cisco/Juniper/Fortinet → <strong>IPSec</strong>.
          </InfoBox>
        </section>

        {/* PKI com Easy-RSA */}
        <section>
          <h2 className="section-title">PKI com Easy-RSA — Sua Própria Autoridade Certificadora</h2>
          <p className="text-text-2 mb-4">
            Easy-RSA é um wrapper de scripts para OpenSSL que simplifica a criação de uma PKI completa.
            Você vira uma CA — a autoridade que assina todos os certificados do seu servidor e dos clientes.
          </p>
          <CodeBlock lang="bash" code={`# 1. Instalar OpenVPN e Easy-RSA
apt install openvpn easy-rsa -y

# 2. Criar diretório da PKI
make-cadir /etc/openvpn/easy-rsa
cd /etc/openvpn/easy-rsa

# 3. Inicializar a PKI (cria estrutura de diretórios)
./easyrsa init-pki

# 4. Criar a CA — vai pedir senha da CA e Common Name (ex: "WorkshopLinux-CA")
./easyrsa build-ca

# 5. Gerar certificado + chave do SERVIDOR (nopass = sem senha para auto-start)
./easyrsa build-server-full server nopass

# 6. Parâmetros Diffie-Hellman (segurança da troca de chaves — demora ~1 min)
./easyrsa gen-dh

# 7. Chave TLS-Auth (HMAC — bloqueia UDP sem assinatura válida, anti-DDoS)
openvpn --genkey secret /etc/openvpn/server/ta.key

# 8. Certificado do primeiro cliente
./easyrsa build-client-full cliente1 nopass

# 9. Copiar arquivos para o diretório do servidor OpenVPN
cp pki/ca.crt pki/issued/server.crt pki/private/server.key \\
   pki/dh.pem /etc/openvpn/server/

# Estrutura gerada:
# pki/ca.crt          → certificado raiz da CA (distribuir para clientes)
# pki/issued/         → certificados assinados (server.crt, cliente1.crt)
# pki/private/        → chaves privadas (chmod 600 — NUNCA compartilhar)
# pki/reqs/           → CSRs (pedidos de assinatura)
ls -la pki/issued/ pki/private/`} />
          <InfoBox className="mt-3">
            <strong>Segurança da PKI:</strong> a chave privada da CA (<code>pki/private/ca.key</code>) nunca sai do servidor. Se comprometida, toda a PKI precisa ser recriada. Armazene em volume criptografado ou HSM em produção.
          </InfoBox>
        </section>

        {/* server.conf */}
        <section>
          <h2 className="section-title">server.conf — Configuração do Servidor</h2>
          <CodeBlock lang="bash" code={`# /etc/openvpn/server/server.conf

port 1194
proto udp
dev tun                    # interface de túnel (tun = roteado, tap = bridge)

# Certificados PKI
ca   /etc/openvpn/server/ca.crt
cert /etc/openvpn/server/server.crt
key  /etc/openvpn/server/server.key
dh   /etc/openvpn/server/dh.pem

# TLS-Auth — assina todos os pacotes UDP (bloqueia scanners)
tls-auth /etc/openvpn/server/ta.key 0
key-direction 0

# Sub-rede da VPN — clientes recebem IPs na faixa 10.8.0.0/24
server 10.8.0.0 255.255.255.0

# Persistir mapeamento IP ↔ cliente entre reinicializações
ifconfig-pool-persist /var/log/openvpn/ipp.txt

# ── ROTEAMENTO ─────────────────────────────────────────────────
# Full tunnel: TODO o tráfego do cliente passa pela VPN
# push "redirect-gateway def1 bypass-dhcp"

# Split tunnel: só tráfego para a LAN interna vai pelo túnel ← recomendado
push "route 192.168.1.0 255.255.255.0"

# DNS para clientes VPN
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 1.1.1.1"

# ── SEGURANÇA ──────────────────────────────────────────────────
cipher AES-256-GCM
auth SHA256
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384

# Keepalive: ping a cada 10s, reiniciar se sem resposta em 120s
keepalive 10 120

# Reduzir privilégios após inicialização
user nobody
group nogroup
persist-key
persist-tun

# ── LOGS ───────────────────────────────────────────────────────
status /var/log/openvpn/openvpn-status.log
log-append /var/log/openvpn/openvpn.log
verb 3`} />
          <WarnBox className="mt-3">
            <strong>Full tunnel vs Split tunnel:</strong> com <code>redirect-gateway def1</code> todo o tráfego (YouTube, redes sociais…) passa pelo servidor VPN — maior privacidade mas maior carga e custo de banda. Com <code>push "route 192.168.1.0…"</code> apenas o tráfego da LAN interna vai pelo túnel — recomendado para acesso corporativo.
          </WarnBox>
          <CodeBlock lang="bash" code={`# Iniciar e habilitar o servidor
systemctl start  openvpn-server@server
systemctl enable openvpn-server@server
systemctl status openvpn-server@server

# Verificar interface tun0 criada (10.8.0.1 = gateway da VPN)
ip addr show tun0

# Ver clientes conectados e IPs atribuídos
cat /var/log/openvpn/openvpn-status.log`} />
        </section>

        {/* client.ovpn inline */}
        <section>
          <h2 className="section-title">client.ovpn — Arquivo do Cliente com Certificados Inline</h2>
          <p className="text-text-2 mb-4">
            A melhor prática é criar um único arquivo <code className="text-accent">.ovpn</code> com todos os certificados embutidos
            — o cliente precisa de apenas um arquivo para conectar, sem dependências externas.
          </p>
          <CodeBlock lang="bash" code={`#!/bin/bash
# Script: gerar-cliente.sh — gera <cliente>.ovpn com certs inline
# Uso: ./gerar-cliente.sh cliente1

CLIENT=$1
PKI_DIR=/etc/openvpn/easy-rsa/pki
OUTPUT=/root/$CLIENT.ovpn
SERVER_IP="SEU_IP_PUBLICO"   # ex: 203.0.113.10

cat > $OUTPUT << OVPN
client
dev tun
proto udp
remote $SERVER_IP 1194
resolv-retry infinite
nobind
user nobody
group nogroup
persist-key
persist-tun
remote-cert-tls server
key-direction 1
cipher AES-256-GCM
auth SHA256
verb 3

<ca>
$(cat $PKI_DIR/ca.crt)
</ca>
<cert>
$(openssl x509 -in $PKI_DIR/issued/$CLIENT.crt)
</cert>
<key>
$(cat $PKI_DIR/private/$CLIENT.key)
</key>
<tls-auth>
$(cat /etc/openvpn/server/ta.key)
</tls-auth>
OVPN

chmod 600 $OUTPUT
echo "✅ Arquivo gerado: $OUTPUT"
echo "   Distribute via SFTP ou canal seguro — contém chave privada!"`} />
          <InfoBox className="mt-3">
            <strong>Distribuição segura:</strong> o arquivo <code>.ovpn</code> contém a chave privada do cliente — trate como uma senha. Envie via SFTP, Signal ou e-mail criptografado. Nunca por Slack público, S3 sem autenticação ou e-mail em texto claro.
          </InfoBox>
          <div className="mt-4">
            <h3 className="font-semibold text-text mb-3">Conectar o cliente</h3>
            <CodeBlock lang="bash" code={`# Linux — linha de comando
sudo openvpn --config cliente1.ovpn

# Linux — via systemd (permanente)
cp cliente1.ovpn /etc/openvpn/client/
systemctl start  openvpn-client@cliente1
systemctl enable openvpn-client@cliente1

# Verificar: IP do tun0 deve ser 10.8.0.X
ip addr show tun0
ip route show          # rota para 192.168.1.0/24 via tun0

# Testar acesso à LAN interna
ping 10.8.0.1          # gateway da VPN
ping 192.168.1.1       # roteador da LAN interna

# macOS / Windows: importar no Tunnelblick / OpenVPN GUI
# Android / iOS: importar no OpenVPN Connect`} />
          </div>
        </section>

        {/* iptables */}
        <section>
          <h2 className="section-title">iptables — NAT e FORWARD para Clientes VPN</h2>
          <p className="text-text-2 mb-4">
            Clientes VPN chegam pela interface <code className="text-accent">tun0</code> (10.8.0.0/24). Para acessarem a LAN interna ou a internet,
            o servidor precisa de <strong>IP forwarding</strong>, <strong>MASQUERADE</strong> e regras <strong>FORWARD</strong>.
          </p>
          <CodeBlock lang="bash" code={`# 1. Habilitar IP forwarding permanente
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# 2. MASQUERADE — substitui IP da VPN (10.8.0.X) pelo IP do servidor ao sair
#    eth0 = interface WAN (internet) — adapte conforme seu setup
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

# 3. FORWARD — clientes VPN podem acessar a LAN interna
#    tun0 → eth1 (LAN): nova sessão + estabelecida
iptables -A FORWARD -i tun0 -o eth1 \\
  -s 10.8.0.0/24 -d 192.168.1.0/24 \\
  -m state --state NEW,ESTABLISHED -j ACCEPT

#    eth1 → tun0: respostas de volta para clientes VPN
iptables -A FORWARD -i eth1 -o tun0 \\
  -d 10.8.0.0/24 \\
  -m state --state ESTABLISHED -j ACCEPT

# 4. INPUT — aceitar conexões VPN na porta 1194/UDP
iptables -A INPUT -i eth0 -p udp --dport 1194 -j ACCEPT
iptables -A INPUT -i tun0 -j ACCEPT

# 5. Salvar regras
iptables-save > /etc/iptables/rules.v4

# Verificar NAT
iptables -t nat -L POSTROUTING -n -v
# Verificar FORWARD
iptables -L FORWARD -n -v`} />
          <InfoBox className="mt-3">
            <strong>Interfaces no exemplo:</strong> <code>eth0</code> = WAN (saída internet), <code>eth1</code> = LAN interna. Verifique os nomes reais com <code>ip addr</code> — no Proxmox/KVM podem ser <code>ens3</code>, <code>enp2s0</code>, etc.
          </InfoBox>
        </section>

        {/* Revogar certificados */}
        <section>
          <h2 className="section-title">Revogar Certificados — Acesso Imediato Cortado</h2>
          <p className="text-text-2 mb-4">
            A grande vantagem da PKI sobre WireGuard: revogar um certificado bloqueia <strong>apenas aquele cliente</strong> — sem tocar nos outros.
          </p>
          <CodeBlock lang="bash" code={`cd /etc/openvpn/easy-rsa

# Revogar certificado do cliente (ex: funcionário desligado)
./easyrsa revoke cliente1

# Gerar/atualizar a CRL (Certificate Revocation List)
./easyrsa gen-crl

# Copiar CRL para o servidor
cp pki/crl.pem /etc/openvpn/server/

# Adicionar ao server.conf (apenas uma vez — persiste para sempre):
# crl-verify /etc/openvpn/server/crl.pem

# Reiniciar o servidor para carregar a CRL
systemctl restart openvpn-server@server

# Testar: cliente revogado deve receber erro "VERIFY ERROR: CRL"
# openvpn --config cliente1.ovpn  →  TLS_ERROR: BIO read tls_read_plaintext error`} />
          <WarnBox className="mt-3">
            <strong>CRL tem prazo de validade!</strong> Por padrão o Easy-RSA gera CRLs válidas por 180 dias. Configure um cron para regenerar antes do vencimento:
            <code className="block mt-2 text-sm">0 3 1 * * cd /etc/openvpn/easy-rsa {'&&'} ./easyrsa gen-crl {'&&'} cp pki/crl.pem /etc/openvpn/server/ {'&&'} systemctl reload openvpn-server@server</code>
          </WarnBox>
        </section>

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows — VPN nativa"
          linuxLabel="Linux — OpenVPN"
          windowsCode={`# Painel de Controle → Central de Rede
# → Nova conexão → Conectar a local de trabalho
# → VPN → PPTP / L2TP+IPSec / SSTP / IKEv2

# Via PowerShell:
Add-VpnConnection \`
  -Name "CorpVPN" \`
  -ServerAddress "vpn.empresa.com" \`
  -TunnelType L2tp \`
  -AuthenticationMethod MSChapv2

# Conectar / desconectar
rasdial "CorpVPN" usuario senha
rasdial "CorpVPN" /disconnect

# SSTP (SSL/443) atravessa firewalls corporativos
# L2TP/IPSec precisa de portas 500+4500 UDP abertas`}
          linuxCode={`# Instalar cliente
apt install openvpn -y

# Conectar com arquivo .ovpn
sudo openvpn --config empresa.ovpn

# Via NetworkManager (GUI ou nmcli):
nmcli connection import \\
  type openvpn \\
  file /etc/openvpn/client/empresa.ovpn
nmcli connection up empresa

# Verificar IP do túnel
ip addr show tun0
ip route show

# Ver IP público (deve ser o IP do servidor VPN)
curl -s ifconfig.me

# Parar conexão
nmcli connection down empresa`}
        />

        {/* Troubleshooting */}
        <section>
          <h2 className="section-title">Troubleshooting</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { prob: 'TLS handshake falha',         sol: 'Verificar se ta.key é idêntico no servidor (key-direction 0) e cliente (key-direction 1). Rota UDP 1194 aberta?' },
              { prob: 'VERIFY ERROR: depth=0',        sol: 'Certificado expirado ou gerado com CA diferente. Checar: openssl verify -CAfile ca.crt cliente1.crt' },
              { prob: 'Conectou mas não acessa LAN',  sol: 'ip_forward=1? Regras FORWARD e MASQUERADE na interface correta? ip route no cliente mostra tun0?' },
              { prob: 'CRL has expired',              sol: 'Regenerar: ./easyrsa gen-crl && cp pki/crl.pem /etc/openvpn/server/ && systemctl reload openvpn-server@server' },
            ].map(({ prob, sol }) => (
              <div key={prob} className="bg-bg-2 border border-border rounded-lg p-4">
                <p className="font-semibold text-warn text-sm mb-1">⚠ {prob}</p>
                <p className="text-text-2 text-sm">{sol}</p>
              </div>
            ))}
          </div>
          <CodeBlock lang="bash" code={`# Logs em tempo real do servidor
journalctl -u openvpn-server@server -f

# Status de conexões ativas (Virtual Address, Common Name, bytes)
cat /var/log/openvpn/openvpn-status.log

# Testar com verbose máximo no cliente (nível 6 = muito detalhe)
sudo openvpn --config cliente1.ovpn --verb 6

# Verificar se porta 1194/UDP está aberta
ss -ulnp | grep 1194

# Verificar se tun0 tem IP atribuído
ip addr show tun0
ip route | grep tun0`} />
        </section>

        {/* Exercícios */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'PKI completa com Easy-RSA',
                desc: 'Instale OpenVPN + Easy-RSA, inicialize a PKI, crie a CA e gere certificados de servidor. Verifique ls pki/issued/ e ls pki/private/ — server.crt e server.key devem aparecer.' },
              { n: 2, title: 'Servidor rodando + cliente conectado',
                desc: 'Configure server.conf com split tunnel (route para 192.168.1.0/24), gere cliente1.ovpn com certificados inline e conecte. Confirme: ip addr show tun0 mostra 10.8.0.2 no cliente.' },
              { n: 3, title: 'iptables + revogação de certificado',
                desc: 'Configure ip_forward e regras MASQUERADE + FORWARD. Acesse um host da LAN interna via SSH a partir do cliente VPN. Depois revogue o certificado do cliente e confirme que reconexão falha com "VERIFY ERROR: CRL".' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-bg-2 border border-border rounded-lg p-4 flex gap-4">
                <span className="text-accent font-bold text-xl min-w-[1.5rem]">{n}</span>
                <div>
                  <p className="font-semibold text-text">{title}</p>
                  <p className="text-text-2 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section>
          <h2 className="section-title">Checklist do Lab</h2>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span className={`text-sm ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2'} group-hover:text-text transition-colors`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <p className="text-ok font-semibold">🔒 OpenVPN Master desbloqueado!</p>
              <p className="text-text-2 text-sm mt-1">PKI criada, servidor configurado e cliente VPN conectado com sucesso.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'TLS handshake failed — conexão OpenVPN não estabelece',
              fix: 'Verificar se ta.key (TLS Auth) está presente em ambos os lados e com a mesma direção (0 no servidor, 1 no cliente). Confirmar que os certificados foram gerados pela mesma CA. Testar com verb 4 no server.conf para logs detalhados.',
            },
            {
              err: 'Clientes conectam mas não acessam a internet (só LAN)',
              fix: 'Roteamento ausente. Verificar: (1) push "redirect-gateway def1" no server.conf; (2) NAT no servidor: iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE; (3) ip_forward habilitado: cat /proc/sys/net/ipv4/ip_forward deve retornar 1.',
            },
            {
              err: 'VERIFY ERROR: depth=0, error=CRL has expired',
              fix: 'A Certificate Revocation List (CRL) expirou. Renovar: cd easy-rsa && ./easyrsa gen-crl. Copiar a nova crl.pem para /etc/openvpn/server/ e reiniciar o serviço. Adicionar cron para renovar mensalmente.',
            },
            {
              err: 'Cliente Windows: TAP driver não encontrado',
              fix: 'O driver TAP não está instalado. No Windows: reinstalar OpenVPN com a opção "TAP Virtual Ethernet Adapter" marcada. Verificar no Device Manager se o adaptador "TAP-Windows Adapter V9" está presente e ativo.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        <ModuleNav currentPath="/openvpn" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
