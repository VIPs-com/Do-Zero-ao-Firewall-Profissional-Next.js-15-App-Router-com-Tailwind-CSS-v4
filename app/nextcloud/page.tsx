'use client';

import { useEffect, useState } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { StepItem, ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { LayerBadge } from '@/components/ui/LayerBadge';
import {
  Cloud, Shield, Database, Lock, Users, ChevronLeft, ChevronRight,
  Server, Zap, AlertTriangle, HardDrive,
} from 'lucide-react';
import Link from 'next/link';

const checklistItems = [
  {
    id: 'nextcloud-instalado',
    text: 'Nextcloud rodando via Docker Compose com banco de dados e volumes persistentes',
    sub: 'docker compose up -d → acessar https://cloud.seudominio.tld → wizard de instalação concluído',
  },
  {
    id: 'nextcloud-ssl',
    text: 'HTTPS configurado via Traefik ou Nginx com certificado válido (Let\'s Encrypt)',
    sub: 'Nextcloud acessível via HTTPS sem aviso de certificado — trusted_domains e overwrite.cli.url corretos',
  },
  {
    id: 'nextcloud-apps',
    text: 'Apps essenciais instalados e sincronização funcionando num cliente',
    sub: 'Calendar, Contacts e Talk instalados. Cliente desktop ou mobile sincronizando arquivos com sucesso',
  },
];

const commonErrors = [
  {
    title: 'Erro 504 Bad Gateway ou loop de redirecionamento',
    detail: 'Causas comuns: (1) trusted_domains no config.php não inclui o domínio que você usa para acessar — Nextcloud rejeita a requisição. Adicione: $CONFIG = ["trusted_domains" => ["localhost", "cloud.seudominio.tld"]]. (2) overwrite.cli.url e overwrite.protocol devem corresponder ao URL externo quando há proxy reverso. (3) Se usar Traefik, garanta que o container Nextcloud recebe o header X-Forwarded-For correto — adicione o middleware forwardedHeaders.',
  },
  {
    title: 'Aviso de segurança no painel de administração',
    detail: 'O Nextcloud verifica várias configurações de segurança e mostra avisos no painel Admin → Overview. Os mais comuns: (1) memcache não configurado — instale APCu ou Redis e configure no config.php; (2) PHP opcache desabilitado — habilite no php.ini; (3) Strict-Transport-Security ausente — configure no Nginx/Traefik. Execute: docker exec -u www-data nextcloud php occ security:scan para diagnóstico completo.',
  },
  {
    title: 'Uploads grandes falham (erro 413 ou timeout)',
    detail: 'Dois locais para ajustar: (1) No Nginx: client_max_body_size 10G; (2) No PHP (via docker-compose.yml): PHP_UPLOAD_LIMIT=10G e PHP_MEMORY_LIMIT=512M como variáveis de ambiente da imagem nextcloud. O Nextcloud por padrão usa chunked upload — arquivos maiores que 5 GB são divididos automaticamente, mas o chunk individual precisa passar pelo proxy.',
  },
  {
    title: 'Dados perdidos após recriar o container',
    detail: 'O container Nextcloud armazena dados em /var/www/html/data. Se esse diretório não for mapeado para um volume Docker persistente, tudo se perde ao recriar o container. Sempre declare: volumes: - nextcloud_data:/var/www/html/data e - nextcloud_config:/var/www/html/config. O banco de dados (MariaDB/PostgreSQL) também precisa de volume próprio para os dados.',
  },
];

export default function NextcloudPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);

  useEffect(() => {
    trackPageVisit('/nextcloud');
  }, [trackPageVisit]);

  return (
    <div className="module-accent-nextcloud">
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Hero */}
        <section className="module-hero space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <LayerBadge layer="Self-hosted · Nuvem Pessoal" />
            <span className="text-xs text-text-3 font-mono">Sprint I.24</span>
          </div>
          <h1 className="section-title">Nextcloud — Nuvem Pessoal</h1>
          <p className="text-text-2 text-lg leading-relaxed">
            Google Drive, OneDrive e iCloud rodam nos servidores de outros. Com o Nextcloud,
            você hospeda seus próprios dados — <strong className="text-text">zero dependência de terceiros</strong>,
            LGPD por padrão, e extensível com calendário, contatos, videoconferência e edição de documentos.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              { icon: <HardDrive size={18}/>, label: 'Dados sob controle', desc: 'Seus arquivos no seu servidor — nenhuma big tech acessa' },
              { icon: <Shield size={18}/>, label: 'LGPD nativo', desc: 'Criptografia E2E opcional, 2FA, auditoria de acesso' },
              { icon: <Users size={18}/>, label: 'Multiusuário', desc: 'Usuários, grupos, cotas — integra com LDAP/AD' },
            ].map(c => (
              <div key={c.label} className="p-4 rounded-lg border border-border bg-bg-2 flex gap-3">
                <span className="text-[var(--mod)] mt-0.5 shrink-0">{c.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-text">{c.label}</div>
                  <div className="text-xs text-text-3 mt-0.5">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 1 — Nextcloud vs alternativas */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">1. Nextcloud vs alternativas self-hosted</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead className="bg-bg-3 text-text-2">
                <tr>
                  {['Critério', 'Nextcloud', 'ownCloud', 'Seafile', 'Google Drive'].map(h => (
                    <th key={h} className="px-4 py-2 text-left font-semibold border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-text-2">
                {[
                  ['Licença',        'AGPL-3.0',         'AGPL + Enterprise',   'Apache 2.0',      'Proprietário'],
                  ['Apps/Plugins',   '🏆 +300 apps',     '~100 apps',           'Poucos',          'Google Workspace'],
                  ['Calendário',     '✅ nativo',        '✅ nativo',           '❌',              '✅ Google Calendar'],
                  ['CalDAV/CardDAV', '✅',               '✅',                  '❌',              '⚠️ parcial'],
                  ['Performance',    '⚠️ PHP',           '⚠️ PHP',              '🏆 C (daemon)',   '🏆 cloud'],
                  ['Talk (video)',   '✅ TURN/STUN',     '❌',                  '❌',              '✅ Meet'],
                  ['Recomendação',   '🏆 uso geral',     '⚠️ fork antigo',      '🏆 só arquivos',  '💰 SaaS'],
                ].map(([crit, nc, oc, sf, gd]) => (
                  <tr key={crit} className="border-b border-border hover:bg-bg-3/50 transition-colors">
                    <td className="px-4 py-2 font-medium text-text">{crit}</td>
                    <td className="px-4 py-2 text-ok">{nc}</td>
                    <td className="px-4 py-2">{oc}</td>
                    <td className="px-4 py-2">{sf}</td>
                    <td className="px-4 py-2">{gd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2 — Stack Docker Compose */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">2. Stack Docker Compose — a forma recomendada</h2>
          <p className="text-text-2">
            O Nextcloud tem uma imagem Docker oficial. Combinamos com MariaDB (banco de dados),
            Redis (cache + fila) e Traefik (proxy reverso com SSL automático — Sprint I.11):
          </p>

          <FluxoCard
            title="Stack completa"
            steps={[
              { label: 'Traefik', sub: 'proxy reverso + Let\'s Encrypt', icon: <Zap size={14}/>, color: 'border-[var(--mod)]/50' },
              { label: 'Nextcloud', sub: 'app PHP — porta 80 interna', icon: <Cloud size={14}/>, color: 'border-ok/50' },
              { label: 'MariaDB', sub: 'banco de dados (volume persistente)', icon: <Database size={14}/>, color: 'border-info/50' },
              { label: 'Redis', sub: 'cache de sessões + fila de jobs', icon: <Server size={14}/>, color: 'border-warn/50' },
            ]}
          />

          <CodeBlock lang="yaml" code={`# docker-compose.yml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@seudominio.tld"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "letsencrypt:/letsencrypt"

  nextcloud:
    image: nextcloud:29-apache
    restart: unless-stopped
    environment:
      MYSQL_HOST: db
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: \${DB_PASSWORD}
      NEXTCLOUD_ADMIN_USER: admin
      NEXTCLOUD_ADMIN_PASSWORD: \${ADMIN_PASSWORD}
      NEXTCLOUD_TRUSTED_DOMAINS: cloud.seudominio.tld
      REDIS_HOST: redis
      PHP_UPLOAD_LIMIT: 10G
      PHP_MEMORY_LIMIT: 512M
    volumes:
      - nextcloud_html:/var/www/html
      - nextcloud_data:/var/www/html/data
    depends_on:
      - db
      - redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nextcloud.rule=Host(\`cloud.seudominio.tld\`)"
      - "traefik.http.routers.nextcloud.entrypoints=websecure"
      - "traefik.http.routers.nextcloud.tls.certresolver=letsencrypt"
      - "traefik.http.middlewares.nc-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.nextcloud-http.rule=Host(\`cloud.seudominio.tld\`)"
      - "traefik.http.routers.nextcloud-http.middlewares=nc-redirect"

  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MARIADB_DATABASE: nextcloud
      MARIADB_USER: nextcloud
      MARIADB_PASSWORD: \${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    command: --transaction-isolation=READ-COMMITTED --log-bin=binlog --binlog-format=ROW

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  nextcloud_html:
  nextcloud_data:
  db_data:
  letsencrypt:`} />

          <CodeBlock lang="bash" code={`# .env (nunca commitar)
DB_PASSWORD=senha-forte-do-banco
DB_ROOT_PASSWORD=senha-forte-root
ADMIN_PASSWORD=senha-do-admin-nextcloud

# Subir a stack
docker compose up -d

# Verificar logs
docker compose logs -f nextcloud

# Acessar: https://cloud.seudominio.tld`} />
        </section>

        {/* 3 — Pós-instalação */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">3. Pós-instalação — configurações essenciais</h2>

          <StepItem
            number={1}
            title="Configurar cache com Redis (obrigatório para produção)"
            description="Sem cache, o Nextcloud usa o sistema de arquivos para locks e sessões — lento e propenso a falhas em multiusuário. Com Redis já no Compose, apenas confirme no config.php:"
          />
          <CodeBlock lang="php" code={`// docker exec -u www-data nextcloud php occ config:system:get memcache.locking
// Se vazio, adicionar manualmente em /var/www/html/config/config.php:
'memcache.local' => '\\OC\\Memcache\\APCu',
'memcache.locking' => '\\OC\\Memcache\\Redis',
'redis' => [
  'host' => 'redis',
  'port' => 6379,
],`} />

          <StepItem
            number={2}
            title="Configurar cron via systemd timer (não usar o cron do navegador)"
            description="O Nextcloud tem jobs em background (índice de busca, limpeza, notificações). O modo padrão 'AJAX' só roda quando alguém acessa. Mude para cron real:"
          />
          <CodeBlock lang="bash" code={`# Adicionar ao docker-compose.yml (serviço cron):
  nextcloud-cron:
    image: nextcloud:29-apache
    restart: unless-stopped
    volumes:
      - nextcloud_html:/var/www/html
      - nextcloud_data:/var/www/html/data
    entrypoint: /cron.sh
    depends_on:
      - db
      - redis

# OU via cron do host (a cada 5 minutos):
*/5 * * * * docker exec -u www-data nextcloud php -f /var/www/html/cron.php`} />

          <StepItem
            number={3}
            title="Corrigir warnings no painel de segurança"
            description="Acesse: Admin (canto superior direito) → Administration → Overview. O Nextcloud lista todos os problemas detectados com instruções de correção. Os mais comuns:"
          />
          <CodeBlock lang="bash" code={`# Via occ (Nextcloud CLI):
docker exec -u www-data nextcloud php occ maintenance:repair
docker exec -u www-data nextcloud php occ db:add-missing-indices
docker exec -u www-data nextcloud php occ db:convert-filecache-bigint

# Verificar configuração de segurança:
docker exec -u www-data nextcloud php occ security:scan`} />

          <StepItem
            number={4}
            title="Habilitar 2FA para todos os usuários"
            description="Instale o app 'Two-Factor TOTP' via Apps → Security. Em Administração → Segurança → marcar 'Enforce two-factor authentication' para todos os grupos ou grupos específicos."
          />
        </section>

        {/* 4 — Apps essenciais */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">4. Apps essenciais — além do armazenamento</h2>
          <p className="text-text-2">
            O Nextcloud é uma plataforma, não apenas um drive. Os apps transformam ele numa
            suíte de produtividade completa:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'Calendar', cat: 'Produtividade', desc: 'CalDAV nativo — sincroniza com Google Calendar, Apple Calendar, Thunderbird. Compartilhamento de calendários entre usuários e grupos.' },
              { name: 'Contacts', cat: 'Produtividade', desc: 'CardDAV nativo — sincroniza com contatos do Android/iOS. Grupos de contatos e compartilhamento entre usuários.' },
              { name: 'Talk', cat: 'Comunicação', desc: 'Videoconferência via WebRTC com TURN/STUN. Salas de chat, calls 1:1 e em grupo. Requer servidor TURN para funcionar além da LAN.' },
              { name: 'Collabora/ONLYOFFICE', cat: 'Documentos', desc: 'Edição colaborativa de .docx/.xlsx/.pptx no navegador. Requer container separado (Collabora CODE ou ONLYOFFICE Document Server).' },
              { name: 'Mail', cat: 'Email', desc: 'Cliente de email integrado (IMAP/SMTP). Conecte suas contas de email e acesse pelo Nextcloud.' },
              { name: 'Deck', cat: 'Gestão', desc: 'Kanban board estilo Trello — cards, listas, atribuições. Integra com Calendar para deadlines.' },
              { name: 'Maps', cat: 'Localização', desc: 'Mapa baseado em OpenStreetMap. Mostra fotos com GPS, histórico de localização (opcional) e compartilhamento de locais.' },
              { name: 'Backup', cat: 'Admin', desc: 'Backup automático de arquivos e banco de dados para armazenamento externo (S3, SFTP). Fundamental em produção.' },
            ].map(({ name, cat, desc }) => (
              <div key={name} className="p-3 rounded-lg border border-border bg-bg-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-text">{name}</span>
                  <span className="text-xs bg-bg-3 text-text-3 px-2 py-0.5 rounded-full">{cat}</span>
                </div>
                <p className="text-xs text-text-2">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 — Integração LDAP */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">5. Integração com LDAP / Active Directory</h2>
          <p className="text-text-2">
            Em vez de criar usuários manualmente, o Nextcloud pode autenticar contra o OpenLDAP
            que configuramos no{' '}
            <Link href="/ldap" className="text-[var(--mod)] underline underline-offset-2">Sprint I.12</Link>.
            Todos os usuários do LDAP viram automaticamente usuários do Nextcloud.
          </p>

          <StepItem
            number={1}
            title="Instalar o app LDAP user and group backend"
            description="Apps → buscar 'LDAP' → habilitar 'LDAP user and group backend'. Aparece em Administração → LDAP/AD Integration."
          />

          <CodeBlock lang="bash" code={`# Configuração no painel Admin → LDAP/AD Integration:
Host:         ldap://192.168.56.10
Porta:        389 (ou 636 para LDAPS)
DN do Admin:  cn=admin,dc=workshop,dc=local
Senha:        <senha-do-admin-ldap>
Base DN:      dc=workshop,dc=local

# Filtro de usuários (aba Advanced):
(&(objectClass=inetOrgPerson)(uid=*))

# Atributos (aba Expert):
Interno:  uid          # chave única imutável
Display:  cn           # nome exibido
Email:    mail`} />

          <InfoBox title="Quota e grupos via LDAP">
            Grupos LDAP aparecem automaticamente no Nextcloud. Você pode definir quotas diferentes
            por grupo em Administração → Usuários → (selecionar grupo) → Quota. Isso é mais
            eficiente do que gerenciar usuários individualmente.
          </InfoBox>
        </section>

        {/* 6 — Object Storage S3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">6. Armazenamento externo — S3 e MinIO</h2>
          <p className="text-text-2">
            O Nextcloud pode usar S3 (AWS ou MinIO self-hosted) como primary storage.
            Isso desacopla os dados do servidor — escala independentemente.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <h3 className="font-semibold text-text text-sm flex items-center gap-2">
                <Database size={14} className="text-[var(--mod)]" />
                MinIO — S3 self-hosted
              </h3>
              <CodeBlock lang="yaml" code={`  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: \${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"  # Web UI`} />
            </div>
            <div className="p-4 rounded-lg border border-border bg-bg-2 space-y-2">
              <h3 className="font-semibold text-text text-sm flex items-center gap-2">
                <Lock size={14} className="text-[var(--mod)]" />
                config.php — usar S3 como primary
              </h3>
              <CodeBlock lang="php" code={`'objectstore' => [
  'class' => '\\OC\\Files\\ObjectStore\\S3',
  'arguments' => [
    'bucket'   => 'nextcloud',
    'key'      => 'minioadmin',
    'secret'   => 'senha-minio',
    'hostname' => 'minio',
    'port'     => 9000,
    'use_ssl'  => false,
    'use_path_style' => true,
  ],
],`} />
            </div>
          </div>

          <WarnBox title="⚠️ Migração para S3 — apenas na instalação limpa">
            O parâmetro <code>objectstore</code> deve ser definido <strong>antes</strong> do primeiro
            uso. Migrar um Nextcloud existente de disco local para S3 é complexo e requer scripts
            de migração específicos. Planeje antes de instalar.
          </WarnBox>
        </section>

        {/* 7 — Backup */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-text">7. Estratégia de backup</h2>
          <p className="text-text-2">
            Nextcloud sem backup é <strong className="text-text">um desastre esperando para acontecer</strong>.
            O backup completo envolve 3 componentes: arquivos, banco de dados e config.
          </p>

          <CodeBlock lang="bash" code={`#!/bin/bash
# backup-nextcloud.sh — executar via cron diariamente

BACKUP_DIR="/backups/nextcloud/\$(date +%Y%m%d)"
mkdir -p "\$BACKUP_DIR"

# 1. Ativar modo manutenção (impede escritas durante backup)
docker exec -u www-data nextcloud php occ maintenance:mode --on

# 2. Backup do banco de dados
docker exec db mysqldump \\
  --single-transaction \\
  -u nextcloud -p"\$DB_PASSWORD" \\
  nextcloud | gzip > "\$BACKUP_DIR/db.sql.gz"

# 3. Backup dos dados e config
rsync -az --delete \\
  /var/lib/docker/volumes/nextcloud_data/_data/ \\
  "\$BACKUP_DIR/data/"
rsync -az \\
  /var/lib/docker/volumes/nextcloud_html/_data/config/ \\
  "\$BACKUP_DIR/config/"

# 4. Desativar modo manutenção
docker exec -u www-data nextcloud php occ maintenance:mode --off

echo "Backup concluído em \$BACKUP_DIR"

# 5. Remover backups com mais de 7 dias
find /backups/nextcloud/ -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \\;`} />

          <HighlightBox title="💡 Regra 3-2-1 aplicada ao Nextcloud">
            3 cópias dos dados · 2 mídias diferentes · 1 offsite.
            Use o app Backup do Nextcloud para sincronizar o backup para um bucket S3
            ou servidor remoto via rsync/SSH — exatamente como aprendemos no{' '}
            <Link href="/backup" className="text-[var(--mod)] underline underline-offset-2">módulo Backup</Link>.
          </HighlightBox>
        </section>

        {/* Windows Comparison */}
        <WindowsComparisonBox
          windowsCode={`# Windows — OneDrive / SharePoint
# Configuração: GUI no navegador (admin.microsoft.com)
# Sincronização: cliente OneDrive (instalado no Windows)
# Usuários: Active Directory / Azure AD
# Backup: Microsoft 365 Backup (pago)
# Custo: ~R$ 50-100/usuário/mês (Microsoft 365)

# Storage: servidores Microsoft (EUA/EU)
# Compliance: Microsoft Cloud Agreement`}
          linuxCode={`# Linux — Nextcloud self-hosted
# Configuração: Web UI + occ CLI + config.php
# Sincronização: nextcloud-client (Linux/Win/Mac/iOS/Android)
# Usuários: banco local ou LDAP/Active Directory
# Backup: script + cron + S3/rsync
# Custo: apenas hardware + energia

# Storage: seu servidor (controle total)
# Compliance: você define as políticas`}
          windowsLabel="Windows — OneDrive/SharePoint"
          linuxLabel="Linux — Nextcloud self-hosted"
        />

        {/* Checklist */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-text">Checklist do Laboratório</h2>
          <div className="space-y-2">
            {checklistItems.map(item => (
              <ChecklistItem
                key={item.id}
                text={item.text}
                sub={item.sub}
                checked={!!checklist[item.id]}
                onToggle={() => updateChecklist(item.id, !checklist[item.id])}
              />
            ))}
          </div>
        </section>

        {/* Erros Comuns */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-text">Erros Comuns</h2>
          <div className="space-y-2">
            {commonErrors.map((err, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <button
                  className="w-full flex justify-between items-center px-4 py-3 bg-bg-2 hover:bg-bg-3 transition-colors text-left"
                  onClick={() => setOpenError(openError === i ? null : i)}
                  aria-expanded={openError === i}
                >
                  <span className="font-medium text-sm text-text flex items-center gap-2">
                    <AlertTriangle size={15} className="text-warn shrink-0" />
                    {err.title}
                  </span>
                  <span className="text-text-3 text-xs">{openError === i ? '▲' : '▼'}</span>
                </button>
                {openError === i && (
                  <div className="px-4 py-3 text-sm text-text-2 border-t border-border bg-bg leading-relaxed">
                    {err.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Navegação */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Link
            href="/opnsense"
            className="flex items-center gap-2 text-text-2 hover:text-text transition-colors text-sm"
          >
            <ChevronLeft size={16} />
            <span>Anterior: OPNsense</span>
          </Link>
          <span className="flex items-center gap-2 text-text-2/40 text-sm cursor-not-allowed">
            <span>Próximo: eBPF Avançado</span>
            <ChevronRight size={16} />
          </span>
        </div>

      </div>
    </div>
  );
}
