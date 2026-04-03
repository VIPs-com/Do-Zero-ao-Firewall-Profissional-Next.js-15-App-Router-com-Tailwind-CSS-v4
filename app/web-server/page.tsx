'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Shield, Key, Terminal, Info, AlertTriangle, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WebServerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Nginx & SSL</span>
      </div>

      <div className="section-label">Tópico 05 · Camadas 6 e 7</div>
      <h1 className="section-title">🔒 Nginx & SSL</h1>
      <p className="section-sub">
        O Nginx serve páginas web (Camada 7). O SSL/TLS (Camada 6) criptografa os dados para garantir confidencialidade e integridade.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">
          {/* Section 1: PKI */}
          <section id="ssl-pki">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Cadeia de Confiança</h2>
            </div>
            
            <div className="bg-bg-2 border border-border rounded-xl p-6 font-mono text-xs space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded bg-ok/10 flex items-center justify-center text-ok">🌍</div>
                <div className="flex-1">
                  <div className="text-text font-bold">Root CA</div>
                  <div className="text-text-3 text-[10px]">Pré-instalada no navegador</div>
                </div>
              </div>
              <div className="ml-6 border-l border-border pl-6 py-2">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded bg-info/10 flex items-center justify-center text-info">🔗</div>
                  <div className="flex-1">
                    <div className="text-text font-bold">Intermediate CA</div>
                    <div className="text-text-3 text-[10px]">Assinada pela Root</div>
                  </div>
                </div>
                <div className="ml-6 border-l border-border pl-6 py-2">
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">📜</div>
                    <div className="flex-1">
                      <div className="text-text font-bold">Seu Certificado</div>
                      <div className="text-text-3 text-[10px]">www.dominio.local</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="warn-box mt-8">
              <strong>⚠️ Aviso de Segurança:</strong> No laboratório, usamos certificados <strong>autoassinados</strong>. O navegador mostrará um aviso porque você é sua própria autoridade (CA), mas a criptografia ainda funciona!
            </div>
          </section>

          {/* Section 2: OpenSSL */}
          <section id="openssl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Key size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Gerando Certificados</h2>
            </div>

            <div className="space-y-6">
              <div className="code-block">
                <div className="code-header">
                  <div className="code-title">Passo 1: Criar Diretório e Chave Privada</div>
                  <div className="code-lang">bash</div>
                </div>
                <pre>
                  <span className="text-text-3">mkdir /etc/ssl/workshop && cd /etc/ssl/workshop</span>{'\n'}
                  <span className="text-ok">openssl genrsa -des3 -out www.workshop.local.key 2048</span>
                </pre>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <div className="code-title">Passo 2: Gerar CSR e Assinar</div>
                  <div className="code-lang">bash</div>
                </div>
                <pre>
                  <span className="text-text-3"># Gerar pedido de assinatura (CSR)</span>{'\n'}
                  <span className="text-ok">openssl req -key www.workshop.local.key -new -out www.workshop.local.csr</span>{'\n\n'}
                  <span className="text-text-3"># Assinar o certificado por 365 dias</span>{'\n'}
                  <span className="text-ok">openssl x509 -signkey www.workshop.local.key -in www.workshop.local.csr -req -days 365 -out www.workshop.local.crt</span>
                </pre>
              </div>

              <div className="code-block">
                <div className="code-header">
                  <div className="code-title">Passo 3: Remover Senha e Gerar DHParam</div>
                  <div className="code-lang">bash</div>
                </div>
                <pre>
                  <span className="text-text-3"># Remove a senha da chave para o Nginx iniciar sem intervenção</span>{'\n'}
                  <span className="text-ok">openssl rsa -in www.workshop.local.key -out www.workshop.local.pem</span>{'\n\n'}
                  <span className="text-text-3"># Gera parâmetros Diffie-Hellman (PFS)</span>{'\n'}
                  <span className="text-ok">openssl dhparam -out dhparam.pem 2048</span>
                </pre>
              </div>
            </div>
          </section>

          {/* Section 3: Nginx Config */}
          <section id="nginx-dnat">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-6/10 flex items-center justify-center text-layer-6">
                <FileCode size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configuração do Nginx</h2>
            </div>

            <div className="space-y-8">
              <div className="code-block">
                <div className="code-header">
                  <div className="code-title">/etc/nginx/sites-available/www.workshop.local.conf</div>
                  <div className="code-lang">nginx</div>
                </div>
                <pre className="text-[10px]">
                  server {'{'}{'\n'}
                  <span className="text-accent-2">    listen 443 http2 ssl;{'\n'}</span>
                  <span className="text-accent-2">    server_name www.workshop.local;{'\n\n'}</span>
                  <span className="text-ok">    ssl_certificate /etc/ssl/workshop/www.workshop.local.crt;{'\n'}</span>
                  <span className="text-ok">    ssl_certificate_key /etc/ssl/workshop/www.workshop.local.pem;{'\n'}</span>
                  <span className="text-ok">    ssl_dhparam /etc/ssl/workshop/dhparam.pem;{'\n\n'}</span>
                  <span className="text-text-2">    root /var/www/www.workshop.local;{'\n'}</span>
                  <span className="text-text-2">    index index.html;{'\n'}</span>
                  {'}'}{'\n\n'}
                  <span className="text-text-3"># Redirecionamento HTTP → HTTPS</span>{'\n'}
                  server {'{'}{'\n'}
                  <span className="text-accent-2">    listen 80;{'\n'}</span>
                  <span className="text-accent-2">    server_name www.workshop.local;{'\n'}</span>
                  <span className="text-err">    return 301 https://$host$request_uri;{'\n'}</span>
                  {'}'}
                </pre>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <Terminal size={16} className="text-accent" />
              Diagnóstico SSL
            </h3>
            <div className="space-y-4 font-mono text-[10px]">
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Testar handshake</div>
                <div className="text-accent-2">openssl s_client -connect localhost:443</div>
              </div>
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Ver validade</div>
                <div className="text-accent-2">openssl x509 -in server.crt -noout -dates</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-info/5 border border-info/20">
            <h4 className="font-bold text-sm text-info mb-2">Perfect Forward Secrecy</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              Para maior segurança, gere parâmetros Diffie-Hellman:
            </p>
            <code className="block p-2 bg-bg-3 rounded text-[10px] text-accent-2 font-mono mt-3">
              openssl dhparam -out dhparam.pem 2048
            </code>
          </div>
        </aside>
      </div>
    </div>
  );
}
