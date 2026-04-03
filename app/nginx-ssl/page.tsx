'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Zap, Terminal, Lock, ArrowRight, CheckCircle2, Globe, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeepDiveModal } from '@/components/DeepDiveModal';
import { DEEP_DIVES, DeepDive } from '@/data/deepDives';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox } from '@/components/ui/Boxes';

export default function NginxSslPage() {
  const [activeDeepDive, setActiveDeepDive] = useState<DeepDive | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/topicos">Tópicos</Link>
        <span>/</span>
        <span className="text-text-2">Nginx & SSL</span>
      </div>

      <div className="section-label">Tópico 06 · Camada 7</div>
      <h1 className="section-title">🔒 Nginx & SSL/TLS</h1>
      <p className="section-sub">
        O Nginx atua como um Reverse Proxy, recebendo conexões externas e encaminhando-as para
        servidores internos. Ele também é o local ideal para gerenciar certificados SSL.
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
              Enquanto um Proxy (Squid) ajuda usuários internos a sair, um <strong>Reverse Proxy</strong> ajuda usuários externos a entrar com segurança. Ele esconde a topologia da sua rede interna.
            </p>

            <div className="bg-bg-3 border border-border rounded-xl p-6 font-mono text-xs space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-xl mb-1">🌍</div>
                  <div className="text-[10px] text-text-3">Internet</div>
                </div>
                <ArrowRight size={16} className="text-border" />
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent font-bold">
                  NGINX (DMZ)
                </div>
                <ArrowRight size={16} className="text-border" />
                <div className="text-center">
                  <div className="text-xl mb-1">🖥️</div>
                  <div className="text-[10px] text-text-3">App Server</div>
                </div>
              </div>
            </div>

            <HighlightBox title="Vantagens">
              <ul className="text-sm text-text-2 space-y-2 list-disc pl-4">
                <li><strong>SSL Termination:</strong> O Nginx lida com a criptografia, aliviando o App Server.</li>
                <li><strong>Load Balancing:</strong> Distribui tráfego entre vários servidores.</li>
                <li><strong>Segurança:</strong> Filtra requisições maliciosas antes de chegarem à aplicação.</li>
              </ul>
            </HighlightBox>
          </section>

          {/* Section 2: SSL/TLS */}
          <section id="ssl-tls">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center text-ok">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Configurando SSL/TLS</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              Para habilitar o HTTPS, você precisa de um par de chaves: a <strong>Chave Privada</strong> (que nunca sai do servidor) e o <strong>Certificado</strong> (que é enviado ao cliente).
            </p>

            <CodeBlock 
              title="/etc/nginx/sites-available/default"
              code={`server {\n  listen 443 ssl;\n  server_name www.workshop.local;\n\n  ssl_certificate /etc/nginx/ssl/server.crt;\n  ssl_certificate_key /etc/nginx/ssl/server.key;\n\n  location / {\n    proxy_pass http://192.168.56.120:8080;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n  }\n}`} 
              lang="nginx" 
            />
          </section>

          {/* Section 3: OpenSSL */}
          <section id="openssl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Gerando Certificados</h2>
            </div>
            <p className="text-text-2 mb-8 leading-relaxed">
              Em laboratório, usamos certificados <strong>Self-Signed</strong> (auto-assinados). Em produção, usamos autoridades como Let's Encrypt.
            </p>

            <CodeBlock 
              title="Gerar Chave e Certificado (Auto-assinado)"
              code="openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt" 
              lang="bash" 
            />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="p-6 rounded-xl bg-bg-2 border border-border shadow-sm">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-ok" />
              Checklist Nginx
            </h3>
            <ul className="text-[10px] text-text-3 space-y-3">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-ok" />
                Sintaxe OK: <code>nginx -t</code>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-ok" />
                Portas 80/443 abertas no Firewall
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-ok" />
                Permissões nas chaves SSL (600)
              </li>
            </ul>
          </div>

          <WarnBox title="Segurança da Chave Privada">
            <p className="text-xs text-text-2 leading-relaxed">
              Se alguém roubar sua <code>.key</code>, poderá descriptografar todo o seu tráfego. Nunca envie este arquivo por e-mail ou suba no GitHub!
            </p>
          </WarnBox>

          <div className="p-6 rounded-xl bg-accent-bg border border-accent-bd">
            <h3 className="font-bold text-sm text-accent-2 mb-3">Mergulho Técnico</h3>
            <p className="text-xs text-text-2 leading-relaxed mb-4">
              Entenda como funciona o Handshake SSL/TLS e por que o cadeado fica verde no navegador.
            </p>
            <button 
              onClick={() => setActiveDeepDive(DEEP_DIVES.find(d => d.id === 'ssl-handshake') || null)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-bg-2 border border-border hover:border-accent transition-all group"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                <span className="text-[10px] font-bold text-text group-hover:text-accent uppercase tracking-wider">SSL/TLS Handshake</span>
              </div>
              <ArrowRight size={12} className="text-text-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </aside>
      </div>

      <DeepDiveModal 
        dive={activeDeepDive} 
        onClose={() => setActiveDeepDive(null)} 
      />
    </div>
  );
}
