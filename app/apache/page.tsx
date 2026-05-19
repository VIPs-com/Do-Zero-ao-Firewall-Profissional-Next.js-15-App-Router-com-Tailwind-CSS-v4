'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { Globe, Shield, Layers, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { useTabFilter } from '@/hooks/useTabFilter';

const CHECKLIST_ITEMS = [
  { id: 'apache-instalado', label: 'Instalei apache2, criei um VirtualHost e testei com apache2ctl configtest sem erros' },
  { id: 'apache-vhost',     label: 'Configurei dois VirtualHosts por nome no mesmo IP e validei com curl -H "Host: ..."' },
  { id: 'apache-ssl',       label: 'Habilitei HTTPS com Certbot ou certificado autoassinado e configurei redirect HTTP→HTTPS' },
];

export default function ApachePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { activeTab, setActiveTab, isActive, tabButtonProps } = useTabFilter<'conceito' | 'config' | 'exercicios'>('conceito');

  useEffect(() => {
    trackPageVisit('/apache');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-apache min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Servidores</span>
          <span>/</span>
          <span className="text-text-2">Apache</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo S03 · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">🌍 Apache Web Server</h1>
          <p className="text-text-2 text-lg mb-6">
            apache2 · VirtualHost · a2ensite · SSL · proxy reverso — o servidor web mais usado no mundo
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do apt install ao HTTPS em produção"
          steps={[
            { label: 'apt install apache2', sub: 'instala + inicia automaticamente na porta 80', icon: <Globe size={14}/>,  color: 'border-accent/50' },
            { label: 'VirtualHost',         sub: 'sites-available/ → a2ensite → sites-enabled/', icon: <Layers size={14}/>, color: 'border-info/50' },
            { label: 'a2enmod',             sub: 'habilita módulos: ssl, rewrite, headers, proxy', icon: <Zap size={14}/>,   color: 'border-ok/50' },
            { label: 'Certbot',             sub: 'gera certificado e configura HTTPS automático',  icon: <Shield size={14}/>, color: 'border-warn/50' },
            { label: 'Redirect + HSTS',     sub: 'HTTP → HTTPS, Strict-Transport-Security',        icon: <Shield size={14}/>, color: 'border-layer-3/50' },
          ]}
        />

        {/* Tabs de navegação */}
        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2">
            {[
              { id: 'conceito',   label: '🌍 Instalação & VirtualHost' },
              { id: 'config',     label: '🔒 HTTPS & Proxy Reverso' },
              { id: 'exercicios', label: '🔧 Exercícios & Referência' },
            ].map(tab => (
              <button
                key={tab.id}
                {...tabButtonProps(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive(tab.id)
                    ? 'border-[var(--mod)] text-[var(--mod)]'
                    : 'border-transparent text-text-2 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isActive('conceito') && (<>

        {/* 1. Instalação e estrutura */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Instalação e Estrutura de Arquivos</h2>

          <CodeBlock lang="bash" code={`sudo apt update
sudo apt install apache2

# Apache inicia automaticamente após instalação
# Verificar:
sudo systemctl status apache2
curl http://localhost
# Deve retornar a página padrão "Apache2 Ubuntu Default Page"

# Versão instalada:
apache2 -v`} />

          <div className="bg-bg-2 border border-border rounded-lg p-5 mb-4">
            <h3 className="font-semibold mb-3 text-info">Estrutura de Diretórios do Apache</h3>
            <div className="font-mono text-sm space-y-1 text-text-2">
              <div><span className="text-accent">/etc/apache2/</span></div>
              <div className="ml-4">├── <span className="text-ok">apache2.conf</span>      <span className="text-text-3"># configuração global</span></div>
              <div className="ml-4">├── <span className="text-ok">ports.conf</span>         <span className="text-text-3"># portas de escuta (80, 443)</span></div>
              <div className="ml-4">├── <span className="text-warn">sites-available/</span>  <span className="text-text-3"># VirtualHosts disponíveis (desabilitados)</span></div>
              <div className="ml-4">├── <span className="text-warn">sites-enabled/</span>    <span className="text-text-3"># VirtualHosts ativos (symlinks)</span></div>
              <div className="ml-4">├── <span className="text-info">mods-available/</span>   <span className="text-text-3"># módulos disponíveis</span></div>
              <div className="ml-4">├── <span className="text-info">mods-enabled/</span>     <span className="text-text-3"># módulos ativos (symlinks)</span></div>
              <div className="ml-4">└── <span className="text-text-3">conf-available/  conf-enabled/</span></div>
              <div className="mt-2"><span className="text-accent">/var/www/html/</span>         <span className="text-text-3"># DocumentRoot padrão</span></div>
              <div><span className="text-accent">/var/log/apache2/</span>     <span className="text-text-3"># access.log e error.log</span></div>
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Comandos essenciais de gerenciamento:
sudo systemctl start|stop|restart|reload apache2
sudo apache2ctl configtest    # valida configuração (SEMPRE antes de restart)
sudo apache2ctl -S            # lista todos os VirtualHosts ativos

# Habilitar/desabilitar sites e módulos:
sudo a2ensite  meu-site.conf  # cria symlink em sites-enabled/
sudo a2dissite meu-site.conf  # remove symlink
sudo a2enmod  rewrite ssl     # habilita módulos
sudo a2dismod rewrite         # desabilita módulo`} />
        </section>

        {/* 2. VirtualHost */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. VirtualHost por Nome — Múltiplos Sites num IP</h2>

          <p className="text-text-2 mb-4">
            O Apache decide qual site servir baseado no cabeçalho <code>Host</code> da requisição HTTP.
            Isso permite hospedar dezenas de sites no mesmo servidor com um único IP.
          </p>

          <CodeBlock lang="bash" code={`# Criar a estrutura de pastas para dois sites:
sudo mkdir -p /var/www/site1.local/public_html
sudo mkdir -p /var/www/site2.local/public_html

echo "<h1>Site 1</h1>" | sudo tee /var/www/site1.local/public_html/index.html
echo "<h1>Site 2</h1>" | sudo tee /var/www/site2.local/public_html/index.html

sudo chown -R www-data:www-data /var/www/site1.local /var/www/site2.local`} />

          <CodeBlock lang="bash" code={`# /etc/apache2/sites-available/site1.local.conf
sudo nano /etc/apache2/sites-available/site1.local.conf`} />

          <CodeBlock lang="bash" code={`# site1.local.conf
<VirtualHost *:80>
    ServerName site1.local
    ServerAlias www.site1.local
    DocumentRoot /var/www/site1.local/public_html

    <Directory /var/www/site1.local/public_html>
        Options -Indexes +FollowSymLinks
        AllowOverride All           # necessário para .htaccess funcionar
        Require all granted
    </Directory>

    ErrorLog  /var/log/apache2/site1-error.log
    CustomLog /var/log/apache2/site1-access.log combined
</VirtualHost>`} />

          <CodeBlock lang="bash" code={`# site2.local.conf — mesmo padrão, caminhos diferentes
<VirtualHost *:80>
    ServerName site2.local
    DocumentRoot /var/www/site2.local/public_html

    <Directory /var/www/site2.local/public_html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog  /var/log/apache2/site2-error.log
    CustomLog /var/log/apache2/site2-access.log combined
</VirtualHost>`} />

          <CodeBlock lang="bash" code={`# Habilitar os dois sites:
sudo a2ensite site1.local.conf site2.local.conf
sudo apache2ctl configtest    # deve mostrar "Syntax OK"
sudo systemctl reload apache2

# Testar sem DNS — passando o Host header na requisição:
curl -H "Host: site1.local" http://localhost
# → <h1>Site 1</h1>
curl -H "Host: site2.local" http://localhost
# → <h1>Site 2</h1>

# Ver todos os VirtualHosts configurados:
sudo apache2ctl -S`} />
        </section>

        {/* 3. Módulos */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Módulos Essenciais</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { mod: 'mod_rewrite',  cmd: 'a2enmod rewrite',  use: 'URLs amigáveis, redirecionamentos, WordPress' },
              { mod: 'mod_ssl',      cmd: 'a2enmod ssl',      use: 'HTTPS — obrigatório para certificados' },
              { mod: 'mod_headers',  cmd: 'a2enmod headers',  use: 'Adicionar/remover headers HTTP (HSTS, CORS)' },
              { mod: 'mod_proxy',    cmd: 'a2enmod proxy proxy_http', use: 'Proxy reverso para apps Node.js, Python' },
              { mod: 'mod_deflate',  cmd: 'a2enmod deflate',  use: 'Compressão gzip das respostas' },
              { mod: 'mod_expires',  cmd: 'a2enmod expires',  use: 'Cache control (imagens, CSS, JS)' },
            ].map(({ mod, cmd, use }) => (
              <div key={mod} className="bg-bg-2 border border-border rounded-lg p-4">
                <div className="font-mono text-accent text-sm mb-1">{mod}</div>
                <div className="font-mono text-xs text-text-3 mb-2">{cmd}</div>
                <div className="text-sm text-text-2">{use}</div>
              </div>
            ))}
          </div>

          <CodeBlock lang="bash" code={`# Habilitar múltiplos módulos de uma vez:
sudo a2enmod rewrite ssl headers proxy proxy_http deflate
sudo systemctl restart apache2

# Verificar módulos carregados:
apache2ctl -M | sort`} />

          <InfoBox title=".htaccess — quando usar e quando evitar">
            <p className="text-sm text-text-2 mb-2">
              O <code>.htaccess</code> permite configuração por diretório sem reiniciar o Apache.
              É útil em hospedagem compartilhada onde o usuário não tem acesso ao VirtualHost.
            </p>
            <p className="text-sm text-text-2 mb-2">
              <strong>Problema de performance:</strong> o Apache lê o <code>.htaccess</code> em <em>cada requisição</em>,
              percorrendo toda a árvore de diretórios. Em produção com tráfego alto, prefira colocar as regras
              diretamente no bloco <code>&lt;Directory&gt;</code> do VirtualHost (requer <code>AllowOverride None</code>).
            </p>
            <CodeBlock lang="bash" code={`# .htaccess típico — WordPress / Laravel:
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]`} />
          </InfoBox>
        </section>

        </>)}

        {isActive('config') && (<>

        {/* 4. SSL */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. HTTPS — SSL/TLS com Certbot</h2>

          <CodeBlock lang="bash" code={`# Instalar Certbot para Apache:
sudo apt install certbot python3-certbot-apache

# Gerar e instalar certificado Let's Encrypt automaticamente:
# (requer domínio apontando para este IP e porta 80 acessível)
sudo certbot --apache -d site1.com -d www.site1.com

# Certbot modifica o VirtualHost automaticamente + cria novo :443
# Renovação automática via systemd timer (já configurado):
sudo systemctl status certbot.timer
sudo certbot renew --dry-run    # testar renovação sem certificado real`} />

          <CodeBlock lang="bash" code={`# VirtualHost HTTPS manual (sem Certbot):
<VirtualHost *:443>
    ServerName site1.local
    DocumentRoot /var/www/site1.local/public_html

    SSLEngine on
    SSLCertificateFile    /etc/ssl/certs/site1.crt
    SSLCertificateKeyFile /etc/ssl/private/site1.key

    # TLS moderno — desabilitar protocolos antigos:
    SSLProtocol -all +TLSv1.2 +TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5

    # HSTS — forçar HTTPS por 1 ano:
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</VirtualHost>

# Redirect HTTP → HTTPS no VirtualHost :80:
<VirtualHost *:80>
    ServerName site1.local
    Redirect permanent / https://site1.local/
</VirtualHost>`} />

          <CodeBlock lang="bash" code={`# Gerar certificado autoassinado (para lab/desenvolvimento):
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/site1.key \
    -out    /etc/ssl/certs/site1.crt \
    -subj "/CN=site1.local/O=Lab/C=BR"

sudo chmod 640 /etc/ssl/private/site1.key`} />
        </section>

        {/* 5. Proxy Reverso */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Apache como Proxy Reverso</h2>

          <p className="text-text-2 mb-4">
            O Apache recebe a requisição do cliente e a encaminha para uma aplicação rodando internamente
            (Node.js, Python/Flask, Java, etc.). O cliente vê apenas o Apache, nunca a app diretamente.
          </p>

          <CodeBlock lang="bash" code={`# Habilitar módulos necessários:
sudo a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests

# VirtualHost como proxy reverso para app na porta 3000:
<VirtualHost *:80>
    ServerName app.site1.local

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Passar IP real do cliente para a aplicação:
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
    RequestHeader set X-Forwarded-Proto "http"
</VirtualHost>`} />

          <CodeBlock lang="bash" code={`# Proxy com WebSockets (ex: app Next.js com HMR):
sudo a2enmod proxy_wstunnel

<VirtualHost *:80>
    ServerName nextjs.local

    ProxyPreserveHost On
    ProxyPass        /  http://127.0.0.1:3000/
    ProxyPassReverse /  http://127.0.0.1:3000/

    # WebSocket upgrade:
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]
</VirtualHost>`} />
        </section>

        {/* 6. Apache vs Nginx */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Apache vs Nginx — Comparação Honesta</h2>

          <div className="bg-bg-2 border border-border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-bg-3">
                <th className="text-left p-3">Critério</th>
                <th className="text-left p-3 text-warn">Apache</th>
                <th className="text-left p-3 text-info">Nginx</th>
              </tr></thead>
              <tbody>
                {[
                  ['Arquitetura',       'Prefork/Worker — processo ou thread por requisição',         'Event-driven — assíncrono, 1 worker para N conexões'],
                  ['Performance estática', 'Boa, mas inferior ao Nginx em alta carga',               '🏆 Superior — benchmarks mostram 2-5x mais rápido'],
                  ['Conc. conexões',    'Limitado pelo número de processos/threads',                  '🏆 Excelente — 10k+ conexões simultâneas por worker'],
                  ['.htaccess',        '🏆 Suporte nativo — flexível para hosting compartilhado',    'Não suporta — toda config no nginx.conf (mais rápido)'],
                  ['Módulos',           '🏆 Dinâmicos — a2enmod sem recompilar o Apache',            'Estáticos — compilados no binário (mais estável)'],
                  ['Config',            'Verbosa mas intuitiva (<VirtualHost>, <Directory>)',        'Concisa com blocos server{} e location{}'],
                  ['PHP',               '🏆 mod_php integrado — sem servidor FPM extra',              'Requer php-fpm separado (mais flexível, recomendado)'],
                  ['Proxy reverso',     'Funciona bem com mod_proxy',                                '🏆 Especialidade histórica — melhor para microserviços'],
                  ['Uso ideal',         'Hosting compartilhado, sites PHP legados, .htaccess',       'Alta performance, microserviços, CDN edge, assets'],
                ].map(([c, a, n]) => (
                  <tr key={c} className="border-b border-border/50">
                    <td className="p-3 font-semibold text-text">{c}</td>
                    <td className="p-3 text-text-2">{a}</td>
                    <td className="p-3 text-text-2">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InfoBox title="Qual usar no seu lab?">
            <p className="text-sm text-text-2">
              Para o lab do workshop (DMZ + 3 zonas), o Nginx já está configurado no módulo <code>/nginx-ssl</code>.
              O Apache brilha em ambientes com <strong>aplicações PHP</strong> (WordPress, Laravel) e
              <strong>hosting compartilhado</strong> onde cada cliente precisa de <code>.htaccess</code> próprio.
              Em produção, muitas empresas usam <strong>Nginx na frente como proxy + Apache atrás</strong> para PHP.
            </p>
          </InfoBox>

          <WindowsComparisonBox
            windowsLabel="IIS (Windows Server)"
            linuxLabel="Apache (Linux)"
            windowsCode={`# GUI: Server Manager
# → Manage → Add Roles and Features
# → Web Server (IIS)

# Sites: IIS Manager
# → Sites → Add Website
# → Site name, Physical path, Port

# Bindings: configure Host Header
# para múltiplos sites no mesmo IP

# Módulos: via GUI ou:
# Install-WindowsFeature Web-*

# SSL: via GUI, importar PFX
# → Bindings → Add → HTTPS
# → Selecionar certificado

# Logs: C:\\inetpub\\logs\\LogFiles\\
# Formato W3C por padrão`}
            linuxCode={`# CLI: apt install apache2
# Estrutura: /etc/apache2/

# Sites: criar .conf em
# sites-available/ → a2ensite

# VirtualHost com ServerName
# múltiplos sites no mesmo IP:
# Host header decide qual serve

# Módulos: a2enmod ssl rewrite
# sem recompilar o Apache

# SSL: a2enmod ssl
# certbot --apache -d dominio
# ou VirtualHost *:443 manual

# Logs: /var/log/apache2/
# access.log + error.log por site`}
          />
        </section>

        {/* 7. Performance & MPM */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Performance &amp; MPM — Tuning do Apache</h2>

          <p className="text-text-2 mb-4">
            O Apache processa requisições através de um <strong>MPM (Multi-Processing Module)</strong> —
            o módulo que decide como o servidor cria processos e threads. Escolher o MPM certo é a
            decisão de performance mais importante: define quanta memória o Apache consome e quantas
            conexões simultâneas ele aguenta. Só um MPM pode estar ativo por vez.
          </p>

          <div className="bg-bg-2 border border-border rounded-lg overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-bg-3">
                <th className="text-left p-3">MPM</th>
                <th className="text-left p-3">Modelo</th>
                <th className="text-left p-3">Quando usar</th>
              </tr></thead>
              <tbody>
                {[
                  ['prefork', 'Um processo por requisição, sem threads', 'Obrigatório com mod_php e libs não thread-safe. Estável, porém o que mais consome RAM.'],
                  ['worker',  'Processos com várias threads cada',       'Sites estáticos / proxy reverso. Bem mais leve que o prefork em alta carga.'],
                  ['event',   'Como o worker, mas thread dedicada gerencia conexões KeepAlive', 'Padrão moderno (Apache 2.4). Melhor para muitas conexões ociosas — recomendado quando não há mod_php.'],
                ].map(([m, mod, use]) => (
                  <tr key={m} className="border-b border-border/50">
                    <td className="p-3 font-mono text-accent">{m}</td>
                    <td className="p-3 text-text-2">{mod}</td>
                    <td className="p-3 text-text-2">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock lang="bash" code={`# Ver qual MPM está ativo:
apache2ctl -V | grep -i mpm
#  Server MPM: event

# Trocar de MPM (só um pode estar ativo):
sudo a2dismod mpm_prefork
sudo a2enmod  mpm_event
sudo systemctl restart apache2

# Atenção: mod_php exige o prefork. Em vez disso, use PHP-FPM
# (php8.x-fpm) com proxy_fcgi — assim você libera o MPM event:
sudo a2dismod php8.3
sudo a2enconf php8.3-fpm
sudo a2enmod proxy_fcgi mpm_event`} />

          <CodeBlock lang="apache" title="/etc/apache2/mods-available/mpm_event.conf" code={`<IfModule mpm_event_module>
    StartServers             2
    MinSpareThreads         25
    MaxSpareThreads         75
    ThreadLimit             64
    ThreadsPerChild         25     # threads por processo filho
    MaxRequestWorkers      150     # teto de requisições simultâneas
    MaxConnectionsPerChild   0     # 0 = processo nunca recicla (use 10000 se houver leak de memória)
</IfModule>`} />

          <InfoBox title="Como dimensionar o MaxRequestWorkers">
            <p className="text-sm text-text-2 mb-2">
              O <code>MaxRequestWorkers</code> é o limite de requisições atendidas ao mesmo tempo —
              quem chega além disso entra na fila. A regra prática:
            </p>
            <p className="text-sm text-text-2 mb-2">
              <code>MaxRequestWorkers = (RAM total − RAM do SO e do banco) ÷ RAM média por processo Apache</code>
            </p>
            <p className="text-sm text-text-2">
              Meça a RAM por processo com <code>ps -ylC apache2 --sort:rss</code>. No MPM event/worker,
              o valor deve ser múltiplo de <code>ThreadsPerChild</code>. Definir alto demais leva ao
              <em> swap</em> e derruba o servidor; baixo demais cria fila e lentidão.
            </p>
          </InfoBox>

          <h3 className="font-semibold mb-3 mt-6 text-info">KeepAlive — reutilizar a conexão TCP</h3>
          <p className="text-text-2 mb-4">
            O <code>KeepAlive</code> mantém a conexão TCP aberta para servir vários recursos
            (HTML, CSS, JS, imagens) sem reabrir socket a cada um — reduz latência. Mas conexão
            ociosa consome um worker, então o <code>KeepAliveTimeout</code> deve ser curto.
          </p>
          <CodeBlock lang="apache" title="/etc/apache2/apache2.conf" code={`KeepAlive On
MaxKeepAliveRequests 100   # recursos servidos por conexão antes de fechar
KeepAliveTimeout 5         # segundos de espera por nova requisição (curto!)`} />

          <h3 className="font-semibold mb-3 mt-6 text-info">mod_deflate e mod_expires — compressão e cache</h3>
          <p className="text-text-2 mb-4">
            O <code>mod_deflate</code> comprime as respostas com gzip antes de enviar — reduz o
            tráfego de texto (HTML/CSS/JS) em 60–80%. O <code>mod_expires</code> instrui o
            navegador a guardar arquivos estáticos em cache, eliminando requisições repetidas.
          </p>
          <CodeBlock lang="bash" code={`sudo a2enmod deflate expires headers`} />
          <CodeBlock lang="apache" title="conf-available/performance.conf" code={`# ── Compressão gzip — só tipos que comprimem bem ──
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css
    AddOutputFilterByType DEFLATE application/javascript application/json
    AddOutputFilterByType DEFLATE image/svg+xml
    # NÃO comprimir imagens já comprimidas (jpg/png) — só gasta CPU
</IfModule>

# ── Cache do navegador para estáticos ──
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png  "access plus 1 month"
    ExpiresByType text/css   "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>`} />

          <InfoBox title="Validar o ganho">
            <p className="text-sm text-text-2">
              Confirme a compressão com <code>curl -H &quot;Accept-Encoding: gzip&quot; -I https://site.local/style.css</code> —
              a resposta deve trazer <code>Content-Encoding: gzip</code>. Para o cache, verifique o
              header <code>Cache-Control</code>/<code>Expires</code> na resposta dos arquivos estáticos.
            </p>
          </InfoBox>
        </section>

        {/* 8. Hardening */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Hardening — Reduzir a Superfície de Ataque</h2>

          <p className="text-text-2 mb-4">
            Por padrão o Apache revela informações úteis a um atacante (versão exata, sistema
            operacional) e habilita métodos HTTP raramente necessários. Endurecer o servidor é
            cosmético no esforço, porém remove vetores clássicos de reconhecimento e exploração.
          </p>

          <CodeBlock lang="apache" title="conf-available/security.conf" code={`# ── Ocultar versão e SO no header Server e nas páginas de erro ──
ServerTokens Prod        # "Server: Apache" — sem versão nem SO
ServerSignature Off      # remove a assinatura no rodapé das páginas 404/500

# ── Desativar o método TRACE (mitiga Cross-Site Tracing) ──
TraceEnable Off

# ── Bloquear listagem de diretórios sem index ──
<Directory /var/www>
    Options -Indexes
</Directory>`} />

          <CodeBlock lang="apache" title="VirtualHost — headers de segurança via mod_headers" code={`# Requer: a2enmod headers
<VirtualHost *:443>
    # ... SSL e DocumentRoot ...

    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'"

    # Remover headers que vazam a stack:
    Header always unset X-Powered-By
    Header unset Server
</VirtualHost>`} />

          <WarnBox title="Sempre valide antes de aplicar">
            <p className="text-sm text-text-2">
              Rode <code>sudo apache2ctl configtest</code> após cada mudança e prefira
              <code> systemctl reload apache2</code> (recarrega sem derrubar conexões ativas) a
              <code> restart</code>. Audite o resultado com <code>curl -I https://site.local</code>:
              o header <code>Server</code> não deve mostrar versão, e os headers de segurança
              devem aparecer. Ferramentas como o <em>securityheaders.com</em> dão uma nota objetiva.
            </p>
          </WarnBox>
        </section>

        </>)}

        {isActive('exercicios') && (<>

        {/* Exercícios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧪 Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 1 — Dois VirtualHosts no mesmo IP</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Instale: <code>sudo apt install apache2</code></li>
                <li>Crie pastas: <code>sudo mkdir -p /var/www/site{'{1,2}'}/public_html</code></li>
                <li>Crie index.html em cada pasta com conteúdo diferente</li>
                <li>Crie <code>site1.conf</code> e <code>site2.conf</code> em <code>sites-available/</code></li>
                <li>Habilite: <code>sudo a2ensite site1.conf site2.conf</code></li>
                <li>Valide + recarregue: <code>sudo apache2ctl configtest &amp;&amp; sudo systemctl reload apache2</code></li>
                <li>Teste: <code>curl -H &quot;Host: site1.local&quot; http://localhost</code> e <code>-H &quot;Host: site2.local&quot;</code></li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 2 — HTTPS com Certificado Autoassinado</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Habilite: <code>sudo a2enmod ssl headers</code></li>
                <li>Gere o certificado autoassinado com o comando <code>openssl req -x509</code> do exemplo</li>
                <li>Crie o VirtualHost <code>*:443</code> com SSLEngine on e os caminhos do certificado</li>
                <li>Adicione o VirtualHost <code>*:80</code> com <code>Redirect permanent</code></li>
                <li>Valide e reinicie: <code>sudo apache2ctl configtest &amp;&amp; sudo systemctl restart apache2</code></li>
                <li>Teste: <code>curl -k https://site1.local</code> (flag -k ignora certificado autoassinado)</li>
              </ol>
            </div>

            <div className="bg-bg-2 border border-border rounded-lg p-6">
              <h3 className="font-bold mb-3 text-info">Exercício 3 — Proxy Reverso para app local</h3>
              <ol className="space-y-2 text-sm text-text-2 list-decimal list-inside">
                <li>Inicie uma app simples: <code>python3 -m http.server 8080 &amp;</code></li>
                <li>Habilite: <code>sudo a2enmod proxy proxy_http</code></li>
                <li>Crie VirtualHost com <code>ProxyPass / http://127.0.0.1:8080/</code></li>
                <li>Recarregue o Apache</li>
                <li>Teste: <code>curl -H &quot;Host: proxy.local&quot; http://localhost</code></li>
                <li>Verifique nos logs: <code>sudo tail /var/log/apache2/access.log</code></li>
              </ol>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">✅ Checklist do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <div className="flex items-start gap-2">
                  {checklist[item.id]
                    ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" />
                    : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
                  <span className="text-sm text-text-2">{item.label}</span>
                </div>
              </label>
            ))}
          </div>
          {CHECKLIST_ITEMS.every(i => checklist[i.id]) && (
            <div className="mt-4 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <span className="text-ok font-bold">🌍 Badge apache-master desbloqueado!</span>
              <p className="text-sm text-text-2 mt-1">Você domina o servidor web que move 30% da internet.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle size={22} className="text-warn" /> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'AH00558: apache2: Could not reliably determine the server fully qualified domain name',
              fix: 'Aviso inofensivo — Apache não consegue resolver o hostname. Corrigir: echo "ServerName localhost" >> /etc/apache2/apache2.conf && systemctl reload apache2. Não afeta o funcionamento.',
            },
            {
              err: 'VirtualHost conflict — Default VirtualHost overlap on port 80',
              fix: 'Dois VirtualHosts sem ServerName conflitam. Garantir que cada VirtualHost tenha ServerName único. Verificar com apache2ctl -S. Desativar o default: a2dissite 000-default.conf.',
            },
            {
              err: 'mod_rewrite rules não funcionam — .htaccess ignorado',
              fix: 'AllowOverride está como None (padrão). Mudar para AllowOverride All no bloco <Directory> do VirtualHost e habilitar o módulo: a2enmod rewrite && systemctl reload apache2.',
            },
            {
              err: 'Certbot falha: Problem binding to port 80 — Could not bind to IPv4 or IPv6',
              fix: 'Apache já está usando a porta 80. Usar o plugin apache: certbot --apache -d dominio.com (Certbot manipula o Apache diretamente). Alternativa: parar o Apache temporariamente para o modo standalone.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        {/* ── Exercícios Guiados ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Instalar Apache e Criar VirtualHost</p>
              <CodeBlock lang="bash" code={`# Instalar Apache
apt install apache2 -y

# Ver estrutura de diretórios
ls /etc/apache2/

# Criar diretório do site
mkdir -p /var/www/meusite/
echo "<h1>Funcionando!</h1>" > /var/www/meusite/index.html

# Criar VirtualHost
cat > /etc/apache2/sites-available/meusite.conf << 'EOF'
<VirtualHost *:80>
    ServerName meusite.local
    ServerAlias www.meusite.local
    DocumentRoot /var/www/meusite
    ErrorLog \${APACHE_LOG_DIR}/meusite-error.log
    CustomLog \${APACHE_LOG_DIR}/meusite-access.log combined

    <Directory /var/www/meusite>
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
EOF

# Ativar site e testar configuração
a2ensite meusite.conf
apache2ctl configtest
systemctl reload apache2

# Testar (adicionar ao /etc/hosts: 127.0.0.1 meusite.local)
curl -H "Host: meusite.local" http://localhost/`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Habilitar Módulos e SSL Autoassinado</p>
              <CodeBlock lang="bash" code={`# Habilitar módulos essenciais
a2enmod ssl rewrite headers deflate

# Criar certificado autoassinado
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/meusite.key \
  -out /etc/ssl/certs/meusite.crt \
  -subj "/CN=meusite.local/O=Lab/C=BR"

# Criar VirtualHost HTTPS
cat > /etc/apache2/sites-available/meusite-ssl.conf << 'EOF'
<VirtualHost *:443>
    ServerName meusite.local
    DocumentRoot /var/www/meusite
    SSLEngine on
    SSLCertificateFile    /etc/ssl/certs/meusite.crt
    SSLCertificateKeyFile /etc/ssl/private/meusite.key

    Header always set Strict-Transport-Security "max-age=63072000"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
</VirtualHost>
EOF

a2ensite meusite-ssl.conf
apache2ctl configtest && systemctl reload apache2

# Testar HTTPS (sem validar cert autoassinado)
curl -k https://localhost/ -H "Host: meusite.local"`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Proxy Reverso para Aplicação Node.js</p>
              <CodeBlock lang="bash" code={`# Habilitar módulos de proxy
a2enmod proxy proxy_http proxy_wstunnel

# Simular aplicação rodando na porta 3000
python3 -m http.server 3000 --directory /var/www/meusite &

# Configurar proxy reverso
cat > /etc/apache2/sites-available/proxy-app.conf << 'EOF'
<VirtualHost *:80>
    ServerName app.local

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # WebSocket (se necessário)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]
</VirtualHost>
EOF

a2ensite proxy-app.conf
apache2ctl configtest && systemctl reload apache2

curl -H "Host: app.local" http://localhost/

# Parar servidor de teste
kill $(pgrep -f "python3 -m http.server 3000") 2>/dev/null || true`} />
            </div>
          </div>
        </section>

        </>)}

        <ModuleNav currentPath="/apache" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
