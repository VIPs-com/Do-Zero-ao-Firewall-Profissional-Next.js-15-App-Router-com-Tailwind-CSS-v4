# Estratégias de Exposição & Proteção (Home Lab → Produção)

> Onde e como hospedar o **Workshop Linux** com segurança — do laboratório doméstico
> (UniFi / on-premises) à VPS pública. O Nginx e o Next.js se comportam **identicamente**
> em qualquer infraestrutura; o que muda é a **rede e a superfície de exposição**.
>
> Companion do [deploy.md](deploy.md) (build, Nginx canônico, TLS/Certbot, monitoramento).

---

## TL;DR — escolha pela superfície de ataque, não pela facilidade

| Estratégia | Portas abertas na internet | TLS gerenciado por | CGNAT-friendly | Quando usar |
|---|---|---|---|---|
| **1. LAN-only (sem exposição)** | nenhuma | mkcert / autoassinado / nenhum | ✔ (não importa) | Estudar, demo interna, primeiro deploy — **recomendado para começar** |
| **2. Tailscale (tailnet privada)** | nenhuma | Tailscale (HTTPS na tailnet) | ✔ | Acesso remoto pessoal/equipe sem expor à internet |
| **3. Cloudflare Tunnel** | nenhuma (conexão de saída) | Cloudflare (borda) | ✔ | Expor publicamente sem abrir portas / sob CGNAT |
| **4. Home Lab direto (Port Forward)** | 80/443 (ou alt.) | Certbot local | ✘ (precisa IP público roteável) | IP público estático e portas liberadas pelo provedor |
| **5. VPS** | 80/443 | Certbot na VPS | ✔ | Produção padrão (ver deploy.md) |
| **6. VPS-proxy + WireGuard → casa** | 80/443 na VPS | Certbot na VPS | ✔ | Servir da casa sob CGNAT, com IP público da VPS |

> **Princípio de firewall (o tema do curso):** a opção mais segura é a que **não abre porta
> nenhuma** na borda. LAN-only e os túneis (Tailscale/Cloudflare) eliminam a superfície de
> ataque externa por completo. Port forwarding só quando houver necessidade real de acesso
> público anônimo.

---

## 1. LAN-only — local sem exposição (recomendado para começar)

O servidor responde **apenas dentro da sua rede**. Nada é roteável da internet. Zero
superfície externa — o cenário mais alinhado ao espírito do projeto.

**Como funciona:**
1. App em `node server.js` (standalone) ou `next start` na porta 3000, atrás do Nginx.
2. **DNS local (split-horizon)** aponta um nome amigável para o IP privado do servidor:
   - **Pi-hole / AdGuard Home** (o curso ensina ambos): adicione um *Local DNS Record*
     `workshop.lab → 192.168.X.X`.
   - **UniFi**: em *Settings → Profiles → DNS* (ou Local DNS) crie a entrada equivalente.
3. **TLS na LAN** — três níveis:
   - **HTTP puro** (`http://workshop.lab`): simples, aceitável numa rede confiável.
   - **mkcert** (recomendado): cria uma CA local *confiável* nos seus dispositivos e
     emite um cert válido para `workshop.lab` — cadeado verde sem avisos, sem Let's Encrypt:
     ```bash
     mkcert -install                       # instala a CA local no sistema/navegador
     mkcert workshop.lab                   # gera workshop.lab.pem + -key.pem
     # aponte ssl_certificate / ssl_certificate_key do Nginx para esses arquivos
     ```
   - **Autoassinado** (`openssl req -x509 ...`): funciona, mas gera aviso no navegador.

**Vantagens:** zero exposição, sem depender do provedor, sem CGNAT, sem Certbot.
**Limite:** só acessível de dentro da rede (ou via VPN — ver Tailscale).

> O CSP do app inclui `upgrade-insecure-requests`. Em **HTTP puro na LAN** isso é inofensivo
> (não há subrecursos externos); se quiser HTTPS limpo, use mkcert.

---

## 2. Tailscale — acesso remoto sem abrir portas

Mesh WireGuard: seus dispositivos entram numa **tailnet** privada e enxergam o servidor de
qualquer lugar, **sem port forwarding e sem expor nada à internet pública**. O módulo
[`/tailscale`](modulos-linux.md) do curso cobre isso a fundo.

```bash
# no servidor
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
# acesso via MagicDNS: http://nome-do-host.tailnet-xxxx.ts.net:3000
# (ou ponha o Nginx na frente e use tailscale serve para HTTPS na tailnet)
sudo tailscale serve --bg 80         # publica o Nginx local na tailnet com HTTPS automático
```

- **TLS:** o `tailscale serve` emite certificado válido para o nome `*.ts.net` — HTTPS sem Certbot.
- **CGNAT:** irrelevante — a conexão é de saída (NAT traversal/DERP).
- **Funnel** (`tailscale funnel`) pode expor à internet pública se você quiser, ainda sem abrir portas no UniFi.

---

## 3. Cloudflare Tunnel (`cloudflared`) — exposição pública sem abrir portas

O container `cloudflared` abre uma **conexão de saída** criptografada com a borda da
Cloudflare. **Zero portas abertas** no UniFi; resolve **CGNAT**; o TLS é gerenciado pela
Cloudflare na borda (fim do Certbot local).

**Fluxo:** Cliente → (HTTPS) Cloudflare Edge → (túnel) `cloudflared` → (HTTP) Nginx local → Next.js.

```yaml
# ~/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json
ingress:
  - hostname: workshop.seudominio.com
    service: http://127.0.0.1:80      # Nginx local em HTTP puro
  - service: http_status:404
```

```bash
cloudflared tunnel login
cloudflared tunnel create workshop
cloudflared tunnel route dns workshop workshop.seudominio.com
cloudflared tunnel run workshop        # ou como serviço systemd
```

**⚠️ Cuidado técnico — `X-Forwarded-Proto`:** o túnel entrega HTTP puro ao Nginx. Configure
o Nginx para propagar `X-Forwarded-Proto: https` ao Next (o `infra/nginx/workshop-linux.conf`
já faz `proxy_set_header X-Forwarded-Proto $scheme`; sob túnel, force `https`):

```nginx
# no location / quando atrás de Cloudflare Tunnel
proxy_set_header X-Forwarded-Proto https;
```

> **Avaliação honesta para ESTE app:** o Workshop Linux guarda todo o estado em
> `localStorage` (não usa cookies de servidor) e o canonical vem de `NEXT_PUBLIC_SITE_URL`
> (não do protocolo do request). O nonce do CSP (`proxy.ts`) **não depende** de
> `X-Forwarded-Proto`. Logo, o risco de "quebrar cookies/nonce" é **baixo** aqui — mas
> propagar `X-Forwarded-Proto: https` continua sendo boa prática (URLs absolutas corretas,
> e blinda você se algum dia adicionar auth com cookie `Secure`).

---

## 4. Home Lab direto (Port Forward + DDNS) — os 4 desafios

Se optar por expor o laboratório com IP público + encaminhamento de portas, a config
canônica do Nginx ([infra/nginx/workshop-linux.conf](../infra/nginx/workshop-linux.conf))
serve **sem alteração**. Mas valide a rede residencial:

### 4.1 Portas 80/443 bloqueadas pelo provedor
Provedores residenciais (Claro, Vivo, etc.) às vezes bloqueiam entrada em 80/443.
- **Teste:** de uma rede externa, `curl -I http://SEU_IP_PUBLICO`.
- **Saída:** escutar em portas alternativas (ex.: 8443) e encaminhar no UniFi, **ou** migrar
  para Cloudflare Tunnel (§3) — que dispensa abrir qualquer porta.

### 4.2 IP dinâmico vs. CGNAT
- **IP dinâmico (roteável):** rode **DDNS** (no gateway UniFi ou um container) atualizando
  Cloudflare/Route53 a cada troca de IP.
- **CGNAT** (você divide o IP público com outros assinantes): **port forwarding não funciona**.
  Saídas: Cloudflare Tunnel (§3), Tailscale (§2), ou VPS-proxy + WireGuard (§6).

### 4.3 Certbot sob porta 80 bloqueada → use desafio DNS-01
O `HTTP-01` exige que o Let's Encrypt acesse `http://dominio/.well-known/acme-challenge/`
na porta 80. Se ela estiver fechada, o **`DNS-01`** valida via registro `TXT` no DNS —
**sem expor a porta 80**:
```bash
sudo apt install python3-certbot-dns-cloudflare
# token da API Cloudflare em ~/.secrets/cloudflare.ini (chmod 600)
sudo certbot certonly \
  --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
  -d workshop.seudominio.com
```
Bônus: o `DNS-01` permite **certificados wildcard** (`*.seudominio.com`).

### 4.4 NAT Loopback (hairpin) para acesso interno
Acessando `https://workshop.seudominio.com` de **dentro** da LAN, o pacote vai ao gateway e
"morre" se não houver reflexão de NAT.
- **Saída A:** ativar **NAT Loopback/Hairpin** no UniFi.
- **Saída B (melhor):** **Split-horizon DNS** — no Pi-hole/AdGuard/UniFi, aponte
  `workshop.seudominio.com → 192.168.X.X` (IP privado) para clientes internos. Externos
  resolvem o IP público; internos vão direto. Mais rápido e sem depender de hairpin.

---

## 5. VPS (produção padrão)

IP público estático, portas 80/443 livres — o caminho do [deploy.md](deploy.md) §3–4
(Nginx + Certbot HTTP-01) funciona direto. DigitalOcean / AWS / Hetzner / Oracle Free Tier.

---

## 6. VPS-proxy + WireGuard → Home Lab (o melhor dos dois mundos sob CGNAT)

Uma VPS barata (≈ R$20/mês) só como **frente pública**: ela tem o IP público e o TLS
(Certbot), e encaminha o tráfego por um túnel **WireGuard** até o Nginx na sua casa.
Combina IP público estável com o hardware do laboratório, contornando CGNAT.

```
Cliente → (HTTPS) VPS (Nginx + Certbot) → (WireGuard) → Nginx Home Lab → Next.js
```

O curso cobre os dois lados: [`/wireguard`](modulos-linux.md) (túnel) e
[`/nginx-ssl`](modulos-linux.md) (proxy + TLS).

---

## Matriz final de decisão

- **Só estudar / demo interna?** → §1 LAN-only (mkcert).
- **Acessar de fora, só eu/equipe?** → §2 Tailscale.
- **Público, sem abrir portas / sob CGNAT?** → §3 Cloudflare Tunnel.
- **Público, IP estático e portas livres?** → §4 Home Lab direto **ou** §5 VPS.
- **Público da casa, mas sob CGNAT e quero IP fixo?** → §6 VPS-proxy + WireGuard.

> Qualquer cenário usa os **mesmos artefatos** (`Dockerfile`, `infra/nginx`, `infra/systemd`).
> Só muda a borda (porta exposta vs. túnel) e quem emite o TLS.

---
[<- Voltar ao indice](README.md) · [deploy.md](deploy.md) · [seguranca.md](seguranca.md)
</content>
