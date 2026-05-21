'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { ShieldCheck, FileSearch, AlertOctagon, CheckCircle, AlertTriangle, Eye, ListOrdered, Target, Layers } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint WAF-MODSECURITY — Web Application Firewall (camada 7).
   ModSecurity + OWASP Core Rule Set: filtragem HTTP/HTTPS, anomaly scoring,
   tuning de falsos positivos e regras customizadas.
   Alinhado a CompTIA Security+ e OWASP Top 10. */

type WafTab = 'conceito' | 'crs' | 'tuning';

const CHECKLIST_ITEMS = [
  { id: 'modsec-instalado',  label: 'Instalei o ModSecurity (Nginx ou Apache), subi em SecRuleEngine DetectionOnly e confirmei que requisições aparecem no /var/log/modsec_audit.log' },
  { id: 'crs-configurado',   label: 'Habilitei o OWASP Core Rule Set, ajustei o anomaly score threshold e o paranoia level no crs-setup.conf' },
  { id: 'regras-custom',     label: 'Escrevi uma SecRule customizada com id próprio (faixa 1000000+), tratei um falso positivo com SecRuleRemoveById e mudei o engine para On' },
];

export default function WafModsecurityPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<WafTab>('conceito');

  useEffect(() => {
    trackPageVisit('/waf-modsecurity');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-waf-modsecurity min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">WAF — ModSecurity</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Web Application Firewall</div>
          <h1 className="text-4xl font-bold mb-4">🧱 WAF — ModSecurity + OWASP CRS</h1>
          <p className="text-text-2 text-lg mb-6">
            O <Link href="/nftables" className="text-accent underline">iptables/nftables</Link> filtra
            pacotes na camada 4 (IP/porta); o{' '}
            <Link href="/suricata" className="text-accent underline">Suricata</Link> inspeciona
            payload mas opera de lado, passivo. O <strong>WAF</strong> é diferente: vive{' '}
            <em>dentro</em> do servidor web, entende HTTP/HTTPS por inteiro — URI, headers, cookies,
            corpo da requisição — e decide o que entra <strong>antes</strong> de chegar à aplicação.
            Este módulo monta o <strong>ModSecurity</strong> com o{' '}
            <strong>OWASP Core Rule Set</strong>, o par de facto para proteger apps web em produção.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de CompTIA Security+ e ao OWASP Top 10.
          </p>
        </div>

        <FluxoCard
          title="Por onde a requisição passa"
          steps={[
            { label: 'Cliente HTTPS',  sub: 'navegador / curl / atacante',          icon: <Target size={14}/>,      color: 'border-text-3/50' },
            { label: 'Nginx / Apache', sub: 'terminação TLS + roteamento',          icon: <Layers size={14}/>,      color: 'border-info/50' },
            { label: 'ModSecurity',    sub: '5 fases — inspeciona req e resposta',  icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
            { label: 'Backend / app',  sub: 'só vê tráfego já filtrado',            icon: <CheckCircle size={14}/>, color: 'border-ok/50' },
            { label: 'modsec_audit.log', sub: 'forense de cada bloqueio',           icon: <FileSearch size={14}/>,  color: 'border-warn/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '🧱 Conceito & ModSecurity' },
              { id: 'crs',      label: '📜 OWASP Core Rule Set' },
              { id: 'tuning',   label: '🎯 Tuning & Regras Customizadas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WafTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  isActive(tab.id)
                    ? 'border-[var(--mod)] text-text'
                    : 'border-transparent text-text-2 hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1 — Conceito & ModSecurity ── */}
        {isActive('conceito') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que é um WAF — e o que ele NÃO é</h2>
          <p className="text-text-2 mb-4">
            Um <strong>Web Application Firewall</strong> é um firewall de camada 7: ele entende{' '}
            <strong>HTTP/HTTPS</strong> — método, URI, query string, headers, cookies, body — e
            aplica regras sobre o <em>conteúdo</em> da requisição, não só sobre IP e porta. Os
            ataques que ele detém são justamente os que o iptables nunca veria:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>SQLi</strong> (SQL Injection) — <code>&apos; OR 1=1--</code> no parâmetro de login.</li>
            <li><strong>XSS</strong> (Cross-Site Scripting) — <code>&lt;script&gt;</code> em um campo de comentário.</li>
            <li><strong>LFI / RFI</strong> — <code>?file=../../etc/passwd</code> ou inclusão remota.</li>
            <li><strong>Command Injection</strong> — <code>; cat /etc/shadow</code> num parâmetro mal sanitizado.</li>
            <li><strong>Path Traversal</strong> — <code>../</code> tentando sair da raiz do site.</li>
            <li><strong>Bots / scrapers / scanners</strong> — User-Agent suspeito, rate anormal.</li>
          </ul>
          <InfoBox title="WAF, IDS/IPS e Firewall — três coisas diferentes">
            O <strong>iptables</strong> bloqueia por IP/porta (L3/L4). O{' '}
            <Link href="/suricata" className="text-accent underline">Suricata IDS/IPS</Link>{' '}
            (L4–L7) inspeciona payload de qualquer protocolo, mas geralmente fora do servidor web
            (passivo via af-packet ou inline via NFQUEUE). O <strong>WAF</strong> vive{' '}
            <em>dentro</em> do servidor web (módulo do Nginx/Apache), decodifica HTTP por inteiro
            (URL decode, compressão, charset) e age <em>antes</em> da aplicação processar. Os três
            se complementam — não se substituem.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Instalando o ModSecurity</h2>
          <p className="text-text-2 mb-4">
            Há duas linhas: <strong>ModSecurity v2</strong> (módulo nativo do Apache, maduríssimo) e{' '}
            <strong>ModSecurity v3 / libmodsecurity</strong> (biblioteca C++ + connector — usado
            com Nginx). Distribuições modernas trazem pacote para ambos:
          </p>
          <CodeBlock lang="bash" code={`# === Apache (ModSecurity v2 — módulo nativo) ===
sudo apt install -y libapache2-mod-security2
sudo a2enmod security2
sudo cp /etc/modsecurity/modsecurity.conf-recommended \\
        /etc/modsecurity/modsecurity.conf
sudo systemctl restart apache2

# === Nginx (ModSecurity v3 + connector) ===
sudo apt install -y libnginx-mod-http-modsecurity
# carregar dinamicamente no nginx.conf:
#   load_module modules/ngx_http_modsecurity_module.so;
sudo systemctl restart nginx

# Conferir que o módulo carregou
sudo apachectl -M | grep security2          # Apache
nginx -V 2>&1 | tr ' ' '\\n' | grep -i modsec  # Nginx`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. As 5 fases — onde a regra dispara</h2>
          <p className="text-text-2 mb-4">
            ModSecurity inspeciona cada requisição em <strong>5 fases ordenadas</strong>. Saber em
            qual fase a regra roda é a chave para entender por que algumas variáveis ainda não
            existem (o corpo da resposta na fase 1, por exemplo) e por que regras de bloqueio são
            quase sempre fase 1 ou 2:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Fase 1</strong> — Request headers: método, URI, User-Agent, cookies. Mais cedo possível.</li>
            <li><strong>Fase 2</strong> — Request body: parâmetros POST, JSON, XML, multipart.</li>
            <li><strong>Fase 3</strong> — Response headers: o que o backend devolveu nos cabeçalhos.</li>
            <li><strong>Fase 4</strong> — Response body: o HTML/JSON de saída (ex.: detectar vazamento de dados).</li>
            <li><strong>Fase 5</strong> — Logging: só registra, não bloqueia mais.</li>
          </ul>
          <CodeBlock lang="apache" title="/etc/modsecurity/modsecurity.conf — essencial" code={`# 1) Ligar o engine — em produção comece em DetectionOnly!
SecRuleEngine DetectionOnly        # ou: On  /  Off

# 2) Inspecionar o corpo da requisição (POST / JSON)
SecRequestBodyAccess On
SecRequestBodyLimit 13107200       # 12 MB
SecRequestBodyNoFilesLimit 131072  # 128 KB sem upload

# 3) Inspecionar a resposta (para regras fase 3/4)
SecResponseBodyAccess On
SecResponseBodyMimeType text/plain text/html text/xml application/json

# 4) Audit log — fonte de verdade para diagnóstico
SecAuditEngine RelevantOnly        # só salva o que disparou regra
SecAuditLog /var/log/modsec_audit.log
SecAuditLogParts ABIJDEFHZ         # quase tudo
SecAuditLogType Serial`} />
          <WarnBox title="Nunca ligue On antes de DetectionOnly">
            Subir um WAF direto em <code>SecRuleEngine On</code> em produção é receita de incidente:
            falsos positivos do CRS bloqueiam admin do WordPress, payloads JSON legítimos, file
            uploads, integrações de API. O fluxo profissional é{' '}
            <strong>DetectionOnly por 1 semana</strong>, coletar o audit log, criar exclusões e
            só então mudar para <strong>On</strong>.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Anatomia de uma SecRule</h2>
          <p className="text-text-2 mb-4">
            Uma regra tem três partes: <strong>variáveis</strong> (o que olhar),{' '}
            <strong>operador</strong> (como comparar) e <strong>ações</strong> (o que fazer). O id
            é obrigatório — use a faixa <strong>1000000+</strong> para regras próprias (não
            colide com o CRS, que vai até 999999).
          </p>
          <CodeBlock lang="apache" code={`# Bloqueia qualquer requisição cujo URI contenha "/admin"
SecRule REQUEST_URI "@contains /admin" \\
    "id:1000001,\\
     phase:1,\\
     deny,\\
     status:403,\\
     log,\\
     msg:'Tentativa de acesso a /admin bloqueada'"

# Detecta SQLi com o operador especializado @detectSQLi
SecRule ARGS "@detectSQLi" \\
    "id:1000002,\\
     phase:2,\\
     deny,\\
     status:403,\\
     msg:'Possivel SQL Injection em parametro',\\
     logdata:'matched: %{MATCHED_VAR}'"

# Bloqueia User-Agent vazio (bots mal-feitos)
SecRule REQUEST_HEADERS:User-Agent "@rx ^$" \\
    "id:1000003,phase:1,deny,status:403,msg:'User-Agent vazio'"`} />
          <p className="text-text-2 mt-4">
            <strong>Variáveis</strong> mais usadas: <code>ARGS</code>, <code>ARGS_NAMES</code>,{' '}
            <code>REQUEST_URI</code>, <code>REQUEST_HEADERS</code>, <code>REQUEST_BODY</code>,{' '}
            <code>RESPONSE_BODY</code>, <code>REMOTE_ADDR</code>.{' '}
            <strong>Operadores</strong>: <code>@rx</code> (regex), <code>@contains</code>,{' '}
            <code>@beginsWith</code>, <code>@detectSQLi</code>, <code>@detectXSS</code>,{' '}
            <code>@ipMatch</code>.{' '}
            <strong>Ações</strong>: <code>deny</code>, <code>pass</code>, <code>log</code>,{' '}
            <code>setvar</code>, <code>chain</code>, <code>tag</code>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Lendo o modsec_audit.log</h2>
          <p className="text-text-2 mb-4">
            Cada bloqueio (e cada requisição relevante, dependendo do{' '}
            <code>SecAuditEngine</code>) deixa um bloco em <code>/var/log/modsec_audit.log</code>{' '}
            com a requisição original, a regra que disparou, o score acumulado e o veredito.
          </p>
          <CodeBlock lang="bash" code={`# Acompanhar em tempo real
sudo tail -f /var/log/modsec_audit.log

# Ver só blocos que dispararam regra (separador --abc...--A--)
sudo grep -A 50 'Message: Access denied' /var/log/modsec_audit.log | less

# Ver IDs de regra que mais bloqueiam (para tunar / excluir)
sudo grep -oE 'id "[0-9]+"' /var/log/modsec_audit.log \\
    | sort | uniq -c | sort -rn | head

# Audit do log do próprio servidor web (errors)
sudo tail -f /var/log/nginx/error.log  | grep -i modsec`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['modsec-instalado']} onChange={e => updateChecklist('modsec-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['modsec-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 — OWASP CRS ── */}
        {isActive('crs') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. O que é o OWASP Core Rule Set</h2>
          <p className="text-text-2 mb-4">
            Escrever do zero regras para cobrir o OWASP Top 10 inteiro é impraticável. O{' '}
            <strong>OWASP Core Rule Set</strong> (CRS) é o conjunto canônico de{' '}
            <strong>~3000 regras</strong> mantido pela comunidade OWASP que detecta SQLi, XSS, LFI,
            RFI, RCE, scanners, bots, anomalias de protocolo e muito mais — pronto para plugar no
            ModSecurity.
          </p>
          <CodeBlock lang="bash" code={`# Opção 1: pacote da distribuição (mais simples)
sudo apt install -y modsecurity-crs

# Opção 2: git clone (versão mais recente, mais comum em prod)
sudo git clone https://github.com/coreruleset/coreruleset \\
    /etc/modsecurity/crs
cd /etc/modsecurity/crs
sudo cp crs-setup.conf.example crs-setup.conf

# Incluir no Apache/Nginx (modsecurity.conf principal)
# Apache: /etc/apache2/mods-enabled/security2.conf
# Nginx:  bloco http { } com modsecurity_rules_file
#   IncludeOptional /etc/modsecurity/crs/crs-setup.conf
#   IncludeOptional /etc/modsecurity/crs/rules/*.conf

sudo systemctl restart nginx     # ou apache2`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. A ordem das regras importa</h2>
          <p className="text-text-2 mb-4">
            As regras do CRS são numeradas em <strong>faixas por categoria</strong>. Conhecer a
            faixa ajuda a ler o audit log e a saber por onde começar o tuning quando um falso
            positivo aparece:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bg-2 border-b border-border">
                  <th className="p-2 text-left">Faixa</th>
                  <th className="p-2 text-left">Categoria</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border"><td className="p-2"><code>900xxx</code></td><td className="p-2">Inicialização (setup, exclusões globais)</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>910xxx</code></td><td className="p-2">IP reputation</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>920xxx</code></td><td className="p-2">Anomalias de protocolo HTTP</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>921xxx</code></td><td className="p-2">Ataques específicos de protocolo (HTTP splitting)</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>930xxx</code></td><td className="p-2">LFI — Local File Inclusion</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>931xxx</code></td><td className="p-2">RFI — Remote File Inclusion</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>932xxx</code></td><td className="p-2">RCE — Remote Command Execution</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>933xxx</code></td><td className="p-2">PHP injection</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>941xxx</code></td><td className="p-2">XSS</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>942xxx</code></td><td className="p-2">SQLi</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>949xxx</code></td><td className="p-2"><strong>Decisão de bloqueio inbound</strong> (soma do score)</td></tr>
                <tr className="border-b border-border"><td className="p-2"><code>950xxx–959xxx</code></td><td className="p-2">Detecção em RESPONSE (data leak, erro 5xx)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Anomaly Scoring — o paradigma do CRS</h2>
          <p className="text-text-2 mb-4">
            O CRS <strong>não bloqueia regra por regra</strong>. Cada regra que dispara{' '}
            <em>soma pontos</em> num contador de anomalia da requisição. No fim, a regra 949110
            (inbound blocking) compara o score com o <strong>threshold</strong> e decide:
          </p>
          <FluxoCard
            title="Fluxo do anomaly score"
            steps={[
              { label: 'Request chega', sub: 'score = 0',                               icon: <Target size={14}/>,      color: 'border-text-3/50' },
              { label: 'Regras 9xxxxx', sub: 'cada match soma +5 (crítico) ou +3 (alerta)', icon: <ListOrdered size={14}/>, color: 'border-info/50' },
              { label: 'Score final',   sub: 'somatório das regras que casaram',         icon: <Eye size={14}/>,         color: 'border-warn/50' },
              { label: 'Regra 949110',  sub: 'score >= threshold ?',                     icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
              { label: 'deny / pass',   sub: 'bloqueia ou deixa passar',                 icon: <CheckCircle size={14}/>, color: 'border-ok/50' },
            ]}
          />
          <CodeBlock lang="apache" title="/etc/modsecurity/crs/crs-setup.conf — trechos críticos" code={`# Threshold de bloqueio na entrada — score >= 5 = deny
SecAction \\
 "id:900110,\\
  phase:1,\\
  pass,\\
  nolog,\\
  setvar:tx.inbound_anomaly_score_threshold=5,\\
  setvar:tx.outbound_anomaly_score_threshold=4"

# Paranoia Level — 1 (padrão) até 4 (máximo)
SecAction \\
 "id:900000,\\
  phase:1,\\
  pass,\\
  nolog,\\
  setvar:tx.paranoia_level=1"`} />
          <InfoBox title="Paranoia Level — quanto mais alto, mais falsos positivos">
            <strong>PL1</strong> (padrão): regras com pouquíssimo falso positivo — produção
            comum. <strong>PL2</strong>: mais agressivo, exige tuning. <strong>PL3</strong>: muito
            agressivo, para apps sensíveis (e-commerce, fintech, gov). <strong>PL4</strong>:
            paranoia máxima — quase sempre quebra apps reais sem tuning extenso. Comece em PL1,
            só suba quando o tuning estiver maduro.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Falsos positivos comuns</h2>
          <p className="text-text-2 mb-4">
            Quase todo CRS recém-instalado bloqueia algo legítimo. Os suspeitos de sempre:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>WordPress admin</strong> — <code>wp-admin/post.php</code> envia HTML rico no body que dispara regras de XSS (941xxx).</li>
            <li><strong>APIs JSON</strong> — corpo JSON com aspas e chaves dispara regras de SQLi (942xxx) por falta de exclusão.</li>
            <li><strong>File upload</strong> — multipart com binário dispara 920xxx (anomalia de protocolo).</li>
            <li><strong>Caracteres especiais em formulários</strong> — campo de comentário com <code>&lt;</code>, <code>&gt;</code>, <code>&apos;</code> dispara XSS/SQLi.</li>
            <li><strong>User-Agent atípico</strong> — bots legítimos (Slackbot, Googlebot, monitoramento) tomam 913xxx.</li>
          </ul>

          <WindowsComparisonBox
            windowsLabel="Microsoft IIS + Azure WAF / ARR"
            linuxLabel="Nginx + ModSecurity + OWASP CRS"
            windowsCode={`# IIS — Request Filtering (modulo nativo, basico)
#   appcmd set config /section:requestFiltering ...
# Azure Web Application Firewall (WAF) — managed
#   Azure Application Gateway + WAF v2
#   Regras gerenciadas pela Microsoft (OWASP CRS 3.x)
#   Modos: Detection / Prevention
#   Score threshold configuravel no portal
# Azure Front Door (CDN + WAF na borda global)
# Custom rules em IPGroup / RateLimitRule / GeoFilter`}
            linuxCode={`# Stack open source equivalente
sudo apt install -y libnginx-mod-http-modsecurity \\
                    modsecurity-crs
# /etc/modsecurity/modsecurity.conf
SecRuleEngine DetectionOnly    # depois: On
SecAuditEngine RelevantOnly
SecAuditLog /var/log/modsec_audit.log
# /etc/modsecurity/crs/crs-setup.conf
setvar:tx.paranoia_level=1
setvar:tx.inbound_anomaly_score_threshold=5
sudo nginx -t && sudo systemctl reload nginx`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['crs-configurado']} onChange={e => updateChecklist('crs-configurado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['crs-configurado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 — Tuning & Regras Customizadas ── */}
        {isActive('tuning') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Workflow profissional de produção</h2>
          <p className="text-text-2 mb-4">
            Subir um WAF não é &quot;instalar e ligar&quot;. É um <strong>ciclo de tuning</strong>{' '}
            que se repete a cada nova feature da aplicação:
          </p>
          <FluxoCard
            title="Ciclo de tuning"
            steps={[
              { label: '1. DetectionOnly', sub: 'liga o engine sem bloquear',          icon: <Eye size={14}/>,         color: 'border-info/50' },
              { label: '2. Coletar',       sub: '1 semana de tráfego real no audit log', icon: <FileSearch size={14}/>, color: 'border-warn/50' },
              { label: '3. Identificar',   sub: 'top IDs que disparam (falsos +)',     icon: <ListOrdered size={14}/>, color: 'border-text-3/50' },
              { label: '4. Excluir',       sub: 'SecRuleRemoveById / UpdateTargetById',icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
              { label: '5. Ligar On',      sub: 'SecRuleEngine On — produção real',    icon: <CheckCircle size={14}/>, color: 'border-ok/50' },
            ]}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. Excluindo falsos positivos</h2>
          <p className="text-text-2 mb-4">
            As exclusões vivem em um arquivo próprio (<code>REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf</code>{' '}
            no CRS), <strong>antes</strong> das regras do CRS. Quatro padrões cobrem 95% dos casos:
          </p>
          <CodeBlock lang="apache" code={`# 1) Remover uma regra inteira (use com cuidado!)
SecRuleRemoveById 942100

# 2) Remover uma regra apenas para um URI específico
<LocationMatch "^/wp-admin/post\\.php">
    SecRuleRemoveById 941100 941160 941340
</LocationMatch>

# 3) Tirar UM parâmetro da inspeção de UMA regra
SecRuleUpdateTargetById 942100 "!ARGS:content"
SecRuleUpdateTargetById 942100 "!ARGS:descricao"

# 4) Excluir por TAG (mais cirúrgico)
SecRuleRemoveByTag "attack-xss"`} />
          <WarnBox title="Nunca remova a regra 949110">
            A 949110 é a que <em>decide</em> o bloqueio baseado no score acumulado. Removê-la
            equivale a desligar todo o CRS — você fica com os logs, mas nada mais é bloqueado.
            Se o score está baixo demais para sua aplicação, ajuste o{' '}
            <code>inbound_anomaly_score_threshold</code>, não desligue a 949110.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. Regras customizadas — id 1000000+</h2>
          <p className="text-text-2 mb-4">
            O CRS cobre o genérico; o que é específico do seu negócio você escreve. Sempre na faixa{' '}
            <strong>id ≥ 1000000</strong> para não colidir com o CRS (que vai até 999999):
          </p>
          <CodeBlock lang="apache" code={`# Bloquear acesso ao /admin de qualquer IP fora da rede interna
SecRule REMOTE_ADDR "!@ipMatch 10.0.0.0/8,192.168.0.0/16" \\
    "id:1000010,\\
     phase:1,\\
     chain,\\
     deny,\\
     status:403,\\
     msg:'Acesso ao painel admin de IP externo'"
    SecRule REQUEST_URI "@beginsWith /admin"

# Banir User-Agents de scanners conhecidos
SecRule REQUEST_HEADERS:User-Agent "@rx (?i)(sqlmap|nikto|nmap|masscan|acunetix|nessus|wpscan)" \\
    "id:1000020,phase:1,deny,status:403,msg:'Scanner detectado: %{MATCHED_VAR}'"

# Rate limit caseiro — bloqueia se 1 IP fizer >30 req/min
SecAction "id:1000030,phase:1,initcol:ip=%{REMOTE_ADDR},nolog,pass"
SecRule REQUEST_URI "@unconditionalMatch" \\
    "id:1000031,phase:1,pass,nolog,\\
     setvar:ip.req_count=+1,\\
     expirevar:ip.req_count=60"
SecRule IP:req_count "@gt 30" \\
    "id:1000032,phase:1,deny,status:429,msg:'Rate limit excedido'"

# Bloqueio geográfico (requer mod_geoip / ngx_http_geoip)
SecRule GEO:COUNTRY_CODE "@pm CN RU KP" \\
    "id:1000040,phase:1,deny,status:403,msg:'Acesso bloqueado por geolocalizacao'"`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. Integração com Fail2ban</h2>
          <p className="text-text-2 mb-4">
            ModSecurity bloqueia <em>uma requisição</em>; o{' '}
            <Link href="/fail2ban" className="text-accent underline">Fail2ban</Link> bane{' '}
            <em>o IP</em> reincidente direto no iptables. Combiná-los transforma uma série de
            ataques em <strong>5 min de ban</strong> (ou mais), sem onerar o WAF a cada hit:
          </p>
          <CodeBlock lang="ini" title="/etc/fail2ban/filter.d/modsecurity.conf" code={`[Definition]
failregex = \\[client <HOST>(?::\\d+)?\\] ModSecurity: Access denied
ignoreregex =`} />
          <CodeBlock lang="ini" title="/etc/fail2ban/jail.local — bloco" code={`[modsecurity]
enabled  = true
filter   = modsecurity
logpath  = /var/log/nginx/error.log
          /var/log/apache2/error.log
maxretry = 3
findtime = 600
bantime  = 3600
banaction = iptables-multiport
port     = http,https`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">14. Horizonte — Coraza, a alternativa moderna</h2>
          <p className="text-text-2 mb-4">
            ModSecurity v2 (Apache) e v3 (libmodsecurity) carregam décadas de C/C++ e atritam com
            proxies modernos.{' '}
            <strong>Coraza</strong> (<a href="https://coraza.io" className="text-accent underline" target="_blank" rel="noopener noreferrer">coraza.io</a>) é uma reimplementação em <strong>Go</strong>,{' '}
            <strong>compatível com a linguagem SecRule do CRS</strong>, que embarca como biblioteca
            em qualquer proxy (Caddy, Traefik, Envoy, Gateway API). Vantagens: zero dependência
            externa, melhor performance, projeto OWASP top-level moderno.
          </p>
          <CodeBlock lang="bash" code={`# Caddy + Coraza (módulo nativo)
caddy add-package github.com/corazawaf/coraza-caddy/v2
# Caddyfile
#   coraza_waf {
#       directives \`
#           Include /etc/coraza/crs/crs-setup.conf
#           Include /etc/coraza/crs/rules/*.conf
#           SecRuleEngine On
#       \`
#   }

# Traefik + Coraza via middleware HTTP
# Envoy + coraza-proxy-wasm (filtro Wasm)
# K8s Gateway API: Coraza como CRD em produção`} />
          <InfoBox title="Quando escolher Coraza vs ModSecurity">
            <strong>ModSecurity</strong>: Apache/Nginx clássicos, suporte enterprise (Atomicorp,
            Trustwave), apps WordPress/Magento maduros. <strong>Coraza</strong>: stack moderna em
            containers, proxies Go (Caddy/Traefik), edge cloud-native, microsserviços. As regras
            CRS são as <em>mesmas</em> — você troca apenas o engine.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">15. Ligando SecRuleEngine On — finalmente</h2>
          <CodeBlock lang="bash" code={`# Apos 1 semana em DetectionOnly e exclusões aplicadas:
sudo sed -i 's/^SecRuleEngine DetectionOnly/SecRuleEngine On/' \\
    /etc/modsecurity/modsecurity.conf

# Validar a config antes do reload!
sudo nginx -t                           # ou: sudo apachectl configtest

# Reload (não restart — sessões TLS não caem)
sudo systemctl reload nginx             # ou: apache2

# Teste rapido com payload SQLi (em ambiente de homologação)
curl -i "http://localhost/?id=1' OR 1=1--"
# Esperado: HTTP/1.1 403 Forbidden

# Monitorar primeiras 24h MUITO de perto
sudo tail -F /var/log/modsec_audit.log /var/log/nginx/error.log`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['regras-custom']} onChange={e => updateChecklist('regras-custom', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['regras-custom'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Ligar SecRuleEngine On direto em produção', sol: 'O CRS recém-instalado bloqueia admin do WordPress, payloads JSON legítimos, file uploads e qualquer formulário com caractere especial. O fluxo correto é DetectionOnly por 1 semana, coletar o audit log, mapear exclusões com SecRuleRemoveById / SecRuleUpdateTargetById e só então mudar para On. Pular essa fase = incidente garantido no primeiro deploy.' },
              { erro: 'WordPress admin bloqueado pelas regras de XSS (941xxx)', sol: 'O editor do WordPress envia HTML rico no body do POST (post.php), o que casa com várias regras 941xxx. Solução: bloco <LocationMatch "^/wp-admin/"> com SecRuleRemoveById para 941100, 941160, 941340 (os IDs aparecem no audit log). Não desabilite a faixa 941 inteira — quebra a proteção XSS do resto do site.' },
              { erro: 'API JSON tomando falso positivo de SQLi (942xxx)', sol: 'JSON com aspas duplas e chaves dispara o operador @detectSQLi em ARGS. Solução: identificar qual campo está sendo flagado (campo "content", "descricao", "query"?) e usar SecRuleUpdateTargetById 942100 "!ARGS:campo" para tirar só esse parâmetro da regra — preservando a proteção dos demais.' },
              { erro: 'Latência alta e CPU disparada com paranoia level 4', sol: 'PL4 carrega regras de detecção agressiva que rodam regex pesada em cada requisição — e ainda casam com tráfego legítimo (gerando logs gigantes). Em apps com volume real, PL1 é o normal; PL2/PL3 só com tuning maduro. Se a latência subir, baixe o PL, reduza SecRequestBodyLimit ou exclua regras 920xxx que sejam ruidosas para o seu workload.' },
            ].map((e, i) => (
              <details key={i} className="p-4 rounded-lg bg-bg-2 border border-border">
                <summary className="cursor-pointer font-medium text-text flex items-center gap-2">
                  <AlertOctagon size={15} className="text-err shrink-0" /> {e.erro}
                </summary>
                <p className="text-sm text-text-2 mt-2 pl-6">{e.sol}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
          <div className="space-y-4">

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Subir ModSecurity em DetectionOnly e disparar uma SQLi</p>
              <p className="text-sm text-text-2 mb-3">
                Numa VM Ubuntu, instale o Nginx + ModSecurity + OWASP CRS. Deixe o engine em{' '}
                <code>DetectionOnly</code>, suba uma página estática qualquer, dispare uma SQLi
                clássica via <code>curl</code> e localize o evento no{' '}
                <code>/var/log/modsec_audit.log</code> — observe o <em>score</em> acumulado e o ID
                da regra que casou.
              </p>
              <CodeBlock lang="bash" code={`sudo apt install -y nginx libnginx-mod-http-modsecurity modsecurity-crs
sudo cp /etc/modsecurity/modsecurity.conf-recommended \\
        /etc/modsecurity/modsecurity.conf

# Garantir DetectionOnly
grep ^SecRuleEngine /etc/modsecurity/modsecurity.conf
# SecRuleEngine DetectionOnly

# Incluir CRS no Nginx (nginx.conf bloco http)
#   modsecurity on;
#   modsecurity_rules_file /etc/modsecurity/main.conf;
sudo nginx -t && sudo systemctl reload nginx

# Disparar SQLi (não bloqueia, só loga)
curl -i "http://localhost/?id=1' UNION SELECT password FROM users--"

# Achar o evento
sudo tail -n 200 /var/log/modsec_audit.log | grep -E 'id|score|UNION'`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Mapear top falsos positivos e criar exclusões</p>
              <p className="text-sm text-text-2 mb-3">
                Com o WAF em DetectionOnly por 24h reais (ou usando ApacheBench/wrk para simular
                tráfego), liste os <strong>IDs de regra que mais disparam</strong>. Para cada um,
                decida se é ataque real ou falso positivo, e crie a exclusão correspondente em{' '}
                <code>REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf</code>.
              </p>
              <CodeBlock lang="bash" code={`# Top IDs que dispararam — onde tunar primeiro
sudo grep -oE 'id "[0-9]+"' /var/log/modsec_audit.log \\
    | sort | uniq -c | sort -rn | head -20

# Para cada ID, ler 1 evento inteiro
sudo grep -B2 -A 30 'id "941100"' /var/log/modsec_audit.log | less

# Criar exclusão localizada (exemplo: WordPress admin)
sudo tee -a /etc/modsecurity/crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf > /dev/null <<'EOF'
<LocationMatch "^/wp-admin/post\\.php">
    SecRuleRemoveById 941100 941160 941340
</LocationMatch>
EOF

sudo nginx -t && sudo systemctl reload nginx`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — Regra customizada + integração Fail2ban</p>
              <p className="text-sm text-text-2 mb-3">
                Escreva uma SecRule própria (id 1000010) que bloqueie qualquer requisição contendo{' '}
                <code>/admin</code> de IP fora de <code>192.168.0.0/16</code>. Configure um{' '}
                <strong>jail Fail2ban</strong> que lê o <code>error.log</code> do Nginx e bane o IP
                após 3 hits ModSecurity em 10 minutos. Teste com <code>curl</code> e verifique o
                ban com <code>fail2ban-client status modsecurity</code>.
              </p>
              <CodeBlock lang="bash" code={`# 1) Regra customizada (em /etc/modsecurity/custom-rules.conf)
sudo tee /etc/modsecurity/custom-rules.conf > /dev/null <<'EOF'
SecRule REMOTE_ADDR "!@ipMatch 192.168.0.0/16" \\
    "id:1000010,phase:1,chain,deny,status:403,msg:'Admin de IP externo'"
    SecRule REQUEST_URI "@beginsWith /admin"
EOF
# Incluir no main.conf:  Include /etc/modsecurity/custom-rules.conf

# 2) Mudar para On (após tuning!)
sudo sed -i 's/^SecRuleEngine DetectionOnly/SecRuleEngine On/' \\
    /etc/modsecurity/modsecurity.conf
sudo nginx -t && sudo systemctl reload nginx

# 3) Fail2ban
sudo tee /etc/fail2ban/filter.d/modsecurity.conf > /dev/null <<'EOF'
[Definition]
failregex = \\[client <HOST>(?::\\d+)?\\] ModSecurity: Access denied
EOF

sudo tee -a /etc/fail2ban/jail.local > /dev/null <<'EOF'
[modsecurity]
enabled = true
filter = modsecurity
logpath = /var/log/nginx/error.log
maxretry = 3
findtime = 600
bantime = 3600
EOF

sudo systemctl restart fail2ban

# 4) Testar — 3 hits seguidos
for i in 1 2 3 4; do curl -s -o /dev/null -w "%{http_code}\\n" http://SEU_IP/admin; done
sudo fail2ban-client status modsecurity`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/waf-modsecurity" />

      </div>
    </main>
  );
}
