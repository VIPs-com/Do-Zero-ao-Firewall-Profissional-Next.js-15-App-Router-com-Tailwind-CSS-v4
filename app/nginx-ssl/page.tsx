'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Terminal, Lock, ArrowRight, Server } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';
import { useBadges } from '@/context/BadgeContext';

export default function NginxSslPage() {
  const { checklist, updateChecklist } = useBadges();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
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

            <CodeBlock
              title="/etc/nginx/sites-available/reverse-proxy.conf"
              lang="nginx"
              code={`server {\n    listen 443 ssl;\n    server_name www.workshop.local;\n\n    # Certificados gerados no módulo Web Server & PKI\n    ssl_certificate     /etc/ssl/workshop/www.workshop.local.crt;\n    ssl_certificate_key /etc/ssl/workshop/www.workshop.local.pem;\n\n    location / {\n        proxy_pass         http://192.168.56.120:8080;\n        proxy_set_header   Host $host;\n        proxy_set_header   X-Real-IP $remote_addr;\n        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header   X-Forwarded-Proto $scheme;\n    }\n}\n\n# Redirecionar HTTP → HTTPS\nserver {\n    listen 80;\n    server_name www.workshop.local;\n    return 301 https://$host$request_uri;\n}`}
            />

            <InfoBox title="X-Forwarded-For — Por que é importante?">
              Sem esse header, o App Server vê apenas o IP do Nginx como origem de todas as
              requisições. Com ele, o servidor interno consegue logar o IP real do cliente
              para auditoria e rate limiting.
            </InfoBox>
          </section>

          {/* Section 3: Headers de Segurança */}
          <section id="security-headers">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-6/10 flex items-center justify-center text-layer-6">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Headers de Segurança HTTP</h2>
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

          {/* Link para módulo anterior */}
          <div className="p-5 rounded-xl bg-bg-2 border border-border">
            <p className="text-xs text-text-3 mb-3">Módulo anterior</p>
            <Link
              href="/web-server"
              className="flex items-center gap-2 text-sm font-medium text-accent-2 hover:text-accent transition-colors"
            >
              🔒 Web Server & PKI
              <ArrowRight size={14} />
            </Link>
            <p className="text-[10px] text-text-3 mt-1">
              Geração de certificados e configuração base do Nginx
            </p>
          </div>

        </aside>
      </div>
    </div>
  );
}
