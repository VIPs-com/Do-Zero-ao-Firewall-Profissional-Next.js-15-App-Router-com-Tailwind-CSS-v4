'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Shield, Key, Terminal, FileCode } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { useBadges } from '@/context/BadgeContext';

export default function WebServerPage() {
  const { checklist, updateChecklist } = useBadges();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 module-accent-web-server">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Web Server & PKI</span>
      </div>

      <div className="section-label">Tópico 05 · Camadas 6 e 7</div>
      <h1 className="section-title">🔒 Web Server & PKI</h1>
      <p className="section-sub">
        O Nginx serve páginas web (Camada 7). O SSL/TLS (Camada 6) criptografa os dados para
        garantir confidencialidade e integridade. Aqui você aprende a cadeia de confiança e a
        gerar seus próprios certificados do zero.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-12">
        <div className="space-y-16">

          {/* Section 1: PKI */}
          <section id="ssl-pki">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Cadeia de Confiança (PKI)</h2>
            </div>

            <p className="text-text-2 mb-6 leading-relaxed">
              Quando o navegador exibe o cadeado verde, ele confia no certificado porque uma
              <strong> Autoridade Certificadora (CA)</strong> assinou esse certificado. Essa cadeia
              de assinaturas é chamada de <strong>PKI — Public Key Infrastructure</strong>.
            </p>

            <div className="bg-bg-2 border border-border rounded-xl p-6 font-mono text-xs space-y-4 mb-8">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded bg-ok/10 flex items-center justify-center text-ok">🌐</div>
                <div className="flex-1">
                  <div className="text-text font-bold">Root CA</div>
                  <div className="text-text-3 text-[10px]">Pré-instalada no navegador (DigiCert, Let's Encrypt...)</div>
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
                      <div className="text-text-3 text-[10px]">www.workshop.local — assinado pela Intermediate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <WarnBox title="Certificados Autoassinados no Lab">
              No laboratório, você é sua própria CA. O navegador mostrará um aviso porque não
              reconhece sua autoridade — mas a criptografia funciona normalmente. Em produção,
              use <strong>Let's Encrypt</strong> (gratuito e reconhecido).
            </WarnBox>
          </section>

          {/* Section 2: OpenSSL */}
          <section id="openssl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Key size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Gerando Certificados com OpenSSL</h2>
            </div>

            <CodeBlock
              title="Passo 1 — Criar diretório e Chave Privada"
              lang="bash"
              code={`mkdir /etc/ssl/workshop && cd /etc/ssl/workshop\nopenssl genrsa -des3 -out www.workshop.local.key 2048`}
            />

            <CodeBlock
              title="Passo 2 — Gerar CSR e assinar o certificado"
              lang="bash"
              code={`# Gerar pedido de assinatura (CSR)\nopenssl req -key www.workshop.local.key -new -out www.workshop.local.csr\n\n# Assinar o certificado por 365 dias\nopenssl x509 -signkey www.workshop.local.key -in www.workshop.local.csr -req -days 365 -out www.workshop.local.crt`}
            />

            <CodeBlock
              title="Passo 3 — Remover senha e gerar DHParam (PFS)"
              lang="bash"
              code={`# Remove a senha da chave para o Nginx iniciar sem intervenção\nopenssl rsa -in www.workshop.local.key -out www.workshop.local.pem\n\n# Parâmetros Diffie-Hellman — Perfect Forward Secrecy\nopenssl dhparam -out dhparam.pem 2048`}
            />

            <InfoBox title="Por que remover a senha da chave?">
              Se a chave tem senha, o Nginx pede a senha toda vez que reinicia — isso quebra
              reinicializações automáticas (boot, PM2, systemd). Remover a senha e proteger com
              permissões <code>600</code> é o equilíbrio correto para servidores.
            </InfoBox>
          </section>

          {/* Section 3: Nginx Config */}
          <section id="nginx-config">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-layer-6/10 flex items-center justify-center text-layer-6">
                <FileCode size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Configuração do Nginx com HTTPS</h2>
            </div>

            <CodeBlock
              title="/etc/nginx/sites-available/www.workshop.local.conf"
              lang="nginx"
              code={`server {\n    listen 443 http2 ssl;\n    server_name www.workshop.local;\n\n    ssl_certificate     /etc/ssl/workshop/www.workshop.local.crt;\n    ssl_certificate_key /etc/ssl/workshop/www.workshop.local.pem;\n    ssl_dhparam         /etc/ssl/workshop/dhparam.pem;\n\n    root  /var/www/www.workshop.local;\n    index index.html;\n}\n\n# Redirecionar HTTP → HTTPS\nserver {\n    listen 80;\n    server_name www.workshop.local;\n    return 301 https://$host$request_uri;\n}`}
            />
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
                { id: 'web-server', label: 'Certificado gerado e Nginx respondendo na 443' },
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
            {checklist['web-server'] && (
              <p className="text-[10px] text-ok font-mono mt-4 pt-3 border-t border-border">
                🔒 SSL Master desbloqueado!
              </p>
            )}
          </div>

          {/* Diagnóstico SSL */}
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-sm mb-4">Diagnóstico SSL</h3>
            <div className="space-y-3 font-mono text-[10px]">
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Testar handshake</div>
                <div className="text-accent-2">openssl s_client -connect localhost:443</div>
              </div>
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Ver validade do certificado</div>
                <div className="text-accent-2">openssl x509 -in server.crt -noout -dates</div>
              </div>
              <div className="p-3 bg-bg-3 rounded border border-border">
                <div className="text-text-3 mb-1"># Verificar sintaxe do Nginx</div>
                <div className="text-accent-2">nginx -t</div>
              </div>
            </div>
          </div>

          {/* PFS Info */}
          <div className="p-6 rounded-xl bg-info/5 border border-info/20">
            <h4 className="font-bold text-sm text-info mb-2">Perfect Forward Secrecy</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              Com DHParam, cada sessão gera chaves temporárias. Mesmo que a chave privada
              vaze no futuro, sessões passadas não podem ser decriptadas.
            </p>
          </div>

        </aside>
      </div>
    </div>
  );
}
