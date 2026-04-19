'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Shield, Terminal, Lock, ArrowRight, Server, Globe, AlertTriangle } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';

export default function NginxSslPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('nginx-ssl');
  }, [trackPageVisit]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-nginx-ssl">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Nginx como Reverse Proxy</span>
      </div>

      <div className="section-label">Tópico 06 · Camada 7</div>
      <h1 className="section-title">🔀 Nginx como Reverse Proxy</h1>
      <p className="section-sub">
        Enquanto o módulo anterior cobriu a geração de certificados (PKI), este módulo foca em
        como o Nginx atua como <strong>Reverse Proxy</strong> — recebendo conexões externas,
        encerrando o SSL e encaminhando o tráfego para servidores internos de forma segura.
      </p>

      <FluxoCard
        title="HTTPS Termination — Nginx como Reverse Proxy"
        steps={[
          { label: 'Browser', sub: 'HTTPS :443', icon: <Globe className="w-4 h-4" />, color: 'border-[var(--color-layer-6)]' },
          { label: 'Nginx DMZ', sub: 'TLS handshake + decrypt', icon: <Shield className="w-4 h-4" />, color: 'border-[var(--color-layer-7)]' },
          { label: 'proxy_pass', sub: 'HTTP interno :8080', icon: <ArrowRight className="w-4 h-4" />, color: 'border-accent/50' },
          { label: 'App Server', sub: 'resposta plaintext', icon: <Server className="w-4 h-4" />, color: 'border-ok/50' },
        ]}
      />

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">

          {/* Section 1: Reverse Proxy */}
          <section id="reverse-proxy">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Server size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. O que é um Reverse Proxy?</h2>
            </div>

            <p className="text-text-2 mb-8 leading-relaxed">
              Um Proxy comum (como o Squid) ajuda usuários <strong>internos</strong> a sair para a
              internet. Um <strong>Reverse Proxy</strong> faz o oposto: ajuda usuários
              <strong> externos</strong> a entrar na sua rede de forma controlada e segura,
              sem expor os servidores internos diretamente.
            </p>

            <div className="bg-bg-3 border border-border rounded-xl p-6 font-mono text-xs mb-8">
              <div className="flex justify-between items-center gap-4">
                <div className="text-center">
                  <div className="text-xl mb-1">🌐</div>
                  <div className="text-[10px] text-text-3">Internet</div>
                  <div className="text-[10px] text-text-3">:443 (HTTPS)</div>
                </div>
                <ArrowRight size={16} className="text-border shrink-0" />
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent font-bold text-center">
                  <div>NGINX</div>
                  <div className="text-[10px] font-normal text-accent-2">DMZ · SSL termination</div>
                </div>
                <ArrowRight size={16} className="text-border shrink-0" />
                <div className="text-center">
                  <div className="text-xl mb-1">🖥️</div>
                  <div className="text-[10px] text-text-3">App Server</div>
                  <div className="text-[10px] text-text-3">:8080 (HTTP interno)</div>
                </div>
              </div>
            </div>

            <HighlightBox title="Vantagens do Reverse Proxy">
              <ul className="text-sm text-text-2 space-y-2 list-disc pl-4">
                <li><strong>SSL Termination:</strong> O Nginx lida com toda a criptografia, liberando o App Server para processar lógica de negócio.</li>
                <li><strong>Ocultação da topologia:</strong> O cliente nunca sabe o IP real do servidor interno.</li>
                <li><strong>Load Balancing:</strong> Um Nginx pode distribuir tráfego entre múltiplos backends.</li>
                <li><strong>Filtragem:</strong> Bloqueia requisições maliciosas antes de chegarem à aplicação.</li>
              </ul>
            </HighlightBox>
          </section>

          {/* Section 2: SSL Termination Config */}
          <section id="ssl-termination">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Configurando SSL Termination</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              O Nginx recebe a conexão HTTPS do cliente, decripta usando os certificados
              (gerados no módulo anterior), e repassa a requisição em HTTP simples para o
              servidor de aplicação interno.
            </p>

            <FluxoCard
              title="Handshake TLS 1.3 — 4 Etapas"
              steps={[
                { label: 'ClientHello', sub: 'cipher suites + random', icon: <Globe className="w-4 h-4" />, color: 'border-[var(--color-layer-6)]' },
                { label: 'ServerHello', sub: 'certificado X.509', icon: <Server className="w-4 h-4" />, color: 'border-[var(--color-layer-5)]' },
                { label: 'Key Exchange', sub: 'ECDHE Curve25519', icon: <Lock className="w-4 h-4" />, color: 'border-accent/50' },
                { label: 'App Data', sub: 'AES-256-GCM cifrado', icon: <Shield className="w-4 h-4" />, color: 'border-ok/50' },
              ]}
            />

            <CodeBlock
              title="Gerar parâmetros Diffie-Hellman (proteção anti-Logjam)"
              lang="bash"
              code={`openssl dhparam -out /etc/ssl/workshop/dhparam.pem 2048\n# Atenção: leva 2-5 minutos — é normal, não cancele`}
            />

            <CodeBlock
              title="/etc/nginx/sites-available/reverse-proxy.conf"
              lang="nginx"
              code={`server {\n    listen 443 ssl;\n    server_name www.workshop.local;\n\n    # Certificados gerados no módulo Web Server & PKI\n    ssl_certificate     /etc/ssl/workshop/www.workshop.local.crt;\n    ssl_certificate_key /etc/ssl/workshop/www.workshop.local.pem;\n\n    # Parâmetros DH — proteção contra ataque Logjam\n    ssl_dhparam          /etc/ssl/workshop/dhparam.pem;\n\n    # Restringir versões TLS (desabilitar TLS 1.0 e 1.1)\n    ssl_protocols        TLSv1.2 TLSv1.3;\n    ssl_ciphers          ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305;\n    ssl_prefer_server_ciphers on;\n\n    location / {\n        proxy_pass         http://192.168.56.120:8080;\n        proxy_set_header   Host $host;\n        proxy_set_header   X-Real-IP $remote_addr;\n        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header   X-Forwarded-Proto $scheme;\n    }\n}\n\n# Redirecionar HTTP → HTTPS\nserver {\n    listen 80;\n    server_name www.workshop.local;\n    return 301 https://$host$request_uri;\n}`}
            />

            <InfoBox title="X-Forwarded-For — Por que é importante?">
              Sem esse header, o App Server vê apenas o IP do Nginx como origem de todas as
              requisições. Com ele, o servidor interno consegue logar o IP real do cliente
              para auditoria e rate limiting.
            </InfoBox>
          </section>

          {/* Section 3: Certbot — Let's Encrypt para Produção */}
          <section id="certbot">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Certbot — Let&apos;s Encrypt para Produção</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              Para servidores com domínio público real, o Let&apos;s Encrypt emite certificados
              gratuitos e confiáveis em todos os browsers. O Certbot automatiza todo o processo —
              da obtenção à renovação.
            </p>

            <WarnBox title="Pré-requisitos obrigatórios">
              <ul className="text-sm space-y-1">
                <li>• <strong>Domínio público</strong> com registro A apontando para o IP do servidor</li>
                <li>• <strong>Porta 80 aberta</strong> no firewall (HTTP-01 challenge precisa ser alcançado pela internet)</li>
                <li>• <strong>Nginx instalado e ativo</strong> na porta 80</li>
              </ul>
              <p className="text-xs text-text-3 mt-2">Em laboratório com IP privado (192.168.x.x), o challenge falha — use certificados autoassinados para estudo.</p>
            </WarnBox>

            <CodeBlock
              title="Instalar Certbot e obter certificado"
              lang="bash"
              code={`# Instalar Certbot com plugin Nginx:
apt install certbot python3-certbot-nginx -y

# Obter e instalar certificado (reconfigura o Nginx automaticamente):
certbot --nginx -d seudominio.com -d www.seudominio.com
# Interativo: email para alertas de expiração, aceitar termos, redirecionar HTTP→HTTPS

# O Certbot adiciona ao nginx.conf automaticamente:
# ssl_certificate     /etc/letsencrypt/live/seudominio.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
# include             /etc/letsencrypt/options-ssl-nginx.conf;
# ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;`}
            />

            <p className="text-xs text-text-3 mt-4 mb-1 font-mono">▶ Saída esperada — certbot certificates:</p>
            <CodeBlock
              title="Verificar certificado obtido"
              lang="bash"
              code={`# Listar certificados e datas de expiração:
certbot certificates
# Output esperado:
# Certificate Name: seudominio.com
#   Domains: seudominio.com www.seudominio.com
#   Expiry Date: 2026-07-17 (VALID: 89 days)
#   Certificate Path: /etc/letsencrypt/live/seudominio.com/fullchain.pem

# Verificar detalhes via OpenSSL:
openssl s_client -connect seudominio.com:443 < /dev/null | grep "subject\\|issuer"
# issuer=C=US, O=Let's Encrypt, CN=R10

# Verificar via curl:
curl -vI https://seudominio.com 2>&1 | grep "SSL certificate"
# SSL certificate verify ok.`}
            />

            <p className="text-xs text-text-3 mt-4 mb-1 font-mono">▶ Saída esperada — certbot renew --dry-run:</p>
            <CodeBlock
              title="Testar renovação automática (dry-run)"
              lang="bash"
              code={`# Simular renovação sem aplicar (para testar configuração):
certbot renew --dry-run
# Output esperado:
# Congratulations, all simulated renewals succeeded:
#   /etc/letsencrypt/live/seudominio.com/fullchain.pem (success)

# Ver o timer systemd que renova automaticamente (2x por dia):
systemctl status certbot.timer
systemctl list-timers | grep certbot
# O Let's Encrypt renova quando faltam < 30 dias — certificados expiram em 90 dias.
# Com o timer ativo, o certificado nunca expira.

# Forçar renovação imediata (quando necessário):
certbot renew --force-renewal`}
            />

            <FluxoCard title="Let's Encrypt — HTTP-01 Challenge" steps={[
              { label: 'Certbot solicita', sub: 'POST /acme/new-order', icon: <Lock size={16} />, color: 'border-ok/50' },
              { label: 'Cria arquivo token', sub: '/.well-known/acme-challenge/', icon: <Shield size={16} />, color: 'border-info/50' },
              { label: 'Let\'s Encrypt verifica', sub: 'GET http://seudominio.com/...', icon: <Globe size={16} />, color: 'border-accent/50' },
              { label: 'Certificado emitido', sub: 'válido por 90 dias', icon: <Lock size={16} />, color: 'border-ok/50' },
            ]} />

            <div className="flex flex-col gap-2 mt-4">
              {[
                { id: 'certbot-installed',   label: 'Certbot instalado (apt install certbot python3-certbot-nginx)' },
                { id: 'certbot-certificate', label: 'Certificado Let\'s Encrypt obtido e Nginx configurado' },
                { id: 'certbot-renewal',     label: 'certbot renew --dry-run executado com sucesso' },
              ].map(item => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={e => updateChecklist(item.id, e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span className={`text-xs leading-relaxed transition-colors ${checklist[item.id] ? 'text-ok line-through' : 'text-text-2 group-hover:text-text'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Section 4: Headers de Segurança */}
          <section id="security-headers">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-6/10 flex items-center justify-center text-layer-6">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">4. Headers de Segurança HTTP</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              O Nginx é o lugar certo para adicionar headers de segurança que protegem o
              browser do usuário contra ataques como XSS, clickjacking e downgrade de HTTPS.
            </p>

            <CodeBlock
              title="Headers de segurança recomendados"
              lang="nginx"
              code={`# Dentro do bloco server { ... }\n\n# Força HTTPS por 1 ano (HSTS)\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n\n# Impede o browser de "adivinhar" o tipo do conteúdo\nadd_header X-Content-Type-Options "nosniff" always;\n\n# Bloqueia iframe de outros domínios (anti-clickjacking)\nadd_header X-Frame-Options "SAMEORIGIN" always;\n\n# Habilita filtro XSS do browser\nadd_header X-XSS-Protection "1; mode=block" always;`}
            />

            <WarnBox title="HSTS — Cuidado ao ativar!">
              Depois de ativar o HSTS com <code>max-age=31536000</code>, o browser se recusa
              a carregar o site via HTTP por 1 ano. Teste em ambiente de lab antes de usar em
              produção — remover o HSTS não é imediato.
            </WarnBox>
          </section>

          {/* Section 4: Erros Comuns */}
          <section id="erros-comuns">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center text-warn">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-2xl font-bold">5. Erros Comuns</h2>
            </div>

            <WarnBox title="⚠️ Problemas frequentes com Nginx SSL">
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>nginx -t falha com &quot;SSL_CTX_use_PrivateKey&quot;</strong> → chave privada não corresponde ao certificado
                  → verificar: <code className="text-xs">openssl x509 -noout -modulus -in cert.pem | md5sum</code> e <code className="text-xs">openssl rsa -noout -modulus -in key.pem | md5sum</code> (devem ser iguais)
                </li>
                <li>
                  <strong>Certificado mostra como &quot;não confiável&quot; no browser</strong> → CA root não instalada no cliente
                  → copiar <code className="text-xs">ca.crt</code> para <code className="text-xs">/usr/local/share/ca-certificates/</code> e executar <code className="text-xs">update-ca-certificates</code>
                </li>
                <li>
                  <strong>proxy_pass retorna 502 Bad Gateway</strong> → aplicação não está rodando na porta configurada
                  → verificar: <code className="text-xs">ss -tlnp | grep 8080</code> e <code className="text-xs">curl http://localhost:8080</code>
                </li>
                <li>
                  <strong>curl -I mostra headers duplicados</strong> → add_header duplicado no nginx.conf e em site.conf
                  → usar <code className="text-xs">always</code> apenas no bloco de site e remover do nginx.conf global
                </li>
              </ul>
            </WarnBox>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Checklist — conectado ao BadgeContext */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-accent" />
              Checklist do Lab
            </h3>
            <div className="space-y-3">
              {[
                { id: 'nginx-ssl', label: 'Nginx respondendo na 443 como Reverse Proxy' },
              ].map(item => (
                <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={e => updateChecklist(item.id, e.target.checked)}
                    className="mt-0.5 accent-accent"
                  />
                  <span className={`text-xs leading-relaxed transition-colors ${checklist[item.id] ? 'text-ok line-through' : 'text-text-2 group-hover:text-text'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            {checklist['nginx-ssl'] && (
              <p className="text-[10px] text-ok font-mono mt-4 pt-3 border-t border-border">
                🔒 SSL Master desbloqueado!
              </p>
            )}
          </div>

          {/* Diagnóstico */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-sm mb-4">Diagnóstico Nginx</h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Verificar sintaxe</div>
                <div className="text-accent-2">nginx -t</div>
              </div>
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Ver headers de resposta</div>
                <div className="text-accent-2">curl -I https://www.workshop.local</div>
              </div>
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Log de erros em tempo real</div>
                <div className="text-accent-2">tail -f /var/log/nginx/error.log</div>
              </div>
            </div>
          </div>

        </aside>
      </div>

      {/* Navegação sequencial */}
      <ModuleNav currentPath="/nginx-ssl" />
    </div>
  );
}
