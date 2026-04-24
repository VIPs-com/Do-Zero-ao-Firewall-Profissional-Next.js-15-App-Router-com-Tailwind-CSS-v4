'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Archive, RefreshCw, Upload, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, HighlightBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';

const CHECKLIST = [
  { id: 'backup-criado', text: 'Criei um backup com tar, fiz uma cópia com rsync e entendi como automatizar com cron' },
];

const TAR_CMD = `# Criar arquivo comprimido
tar -czf backup-etc.tar.gz /etc/          # c=criar, z=gzip, f=arquivo
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/  # com data no nome

# Listar conteúdo sem extrair
tar -tzf backup-etc.tar.gz

# Extrair
tar -xzf backup-etc.tar.gz               # extrai no diretório atual
tar -xzf backup-etc.tar.gz -C /tmp/restore/  # extrai em outro local`;

const RSYNC_CMD = `# Sincronização local (incremental — só transfere o que mudou)
rsync -av /etc/ /backup/etc/
rsync -av --delete /var/www/ /backup/www/  # --delete espelha exatamente

# Sincronização remota via SSH
rsync -avz /etc/ user@192.168.1.100:/backup/etc/
rsync -avz user@192.168.1.100:/etc/ ./backup-remoto/

# Dry run — testar sem fazer nada
rsync -n -av /etc/ /backup/etc/           # -n = simulate`;

const SCP_CMD = `# Copiar arquivo para servidor remoto
scp nginx.conf user@servidor:/etc/nginx/

# Copiar arquivo de servidor remoto
scp user@servidor:/etc/nginx/nginx.conf ./

# Copiar diretório recursivamente
scp -r /etc/nginx/ user@servidor:/backup/nginx/`;

const SCRIPT_BACKUP = `#!/bin/bash
# backup-diario.sh — backup automático do servidor

ORIGEM="/etc /var/www /home"
DESTINO="/backup"
DATA=$(date +%Y%m%d-%H%M)

for DIR in $ORIGEM; do
  NOME=$(echo $DIR | tr '/' '-' | sed 's/^-//')
  ARQUIVO="$DESTINO/$NOME-$DATA.tar.gz"
  tar -czf "$ARQUIVO" "$DIR" 2>/dev/null
  echo "OK: $ARQUIVO ($(du -sh $ARQUIVO | cut -f1))"
done

# Remover backups com mais de 7 dias
find $DESTINO -name "*.tar.gz" -mtime +7 -delete
echo "Backups antigos removidos"

# Agendar no cron (executar todo dia às 3h):
# 0 3 * * * /scripts/backup-diario.sh >> /var/log/backup.log 2>&1`;

export default function BackupPage() {
  const { trackPageVisit, checklist, updateChecklist } = useBadges();

  useEffect(() => {
    trackPageVisit('/backup');
  }, [trackPageVisit]);

  const toggleCheck = (id: string) => updateChecklist(id, !checklist[id]);
  const allDone = CHECKLIST.every(c => checklist[c.id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 module-accent-fundamentos">
      <div className="breadcrumb mb-8 module-hero">
        <Link href="/">Início</Link>
        <span>/</span>
        <Link href="/fundamentos">Fundamentos Linux</Link>
        <span>/</span>
        <span className="text-text-2">Backup e Restauração</span>
      </div>

      <div className="section-label">Módulo 08 · Trilha Fundamentos</div>
      <h1 className="section-title">🗄️ Backup e Restauração</h1>
      <p className="section-sub">
        Servidor sem backup é uma bomba-relógio. <strong>rsync</strong> e <strong>tar</strong> são as
        ferramentas mais usadas para backup em Linux — simples, confiáveis e scriptáveis para automação com cron.
      </p>

      <FluxoCard
        title="Fluxo: estratégia de backup completa"
        steps={[
          { label: 'tar',    sub: 'backup pontual (.tar.gz)', icon: <Archive size={14} />,    color: 'border-info/50' },
          { label: 'rsync',  sub: 'sincronização incremental', icon: <RefreshCw size={14} />, color: 'border-accent/50' },
          { label: 'scp',    sub: 'enviar para servidor remoto', icon: <Upload size={14} />,  color: 'border-warn/50' },
          { label: 'cron',   sub: 'automatizar diariamente',  icon: <Clock size={14} />,      color: 'border-ok/50' },
        ]}
      />

      <WindowsComparisonBox
        windowsCode={`Backup do Windows (Painel de Controle)
  → Histórico de Arquivos (F: drive)
  → Ponto de Restauração do Sistema
  → Backup e Restauração (Windows 7)
  → Robocopy (linha de comando avançado)
  → wbadmin para backup completo de sistema`}
        linuxCode={`tar -czf backup.tar.gz /etc/  # criar arquivo
tar -xzf backup.tar.gz       # restaurar
rsync -av /origem/ /destino/ # sincronização incremental
rsync -avz /etc/ user@srv:/backup/
# Combine com cron para automação diária`}
        windowsLabel="Windows — Backup do Sistema"
        linuxLabel="Linux — tar, rsync, scp + cron"
      />

      <div className="space-y-14">

        <section id="tar">
          <h2 className="text-2xl font-bold mb-2">tar — Arquivar e Compactar</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>tar</code> cria arquivos comprimidos (.tar.gz) de diretórios inteiros. Ideal para backups pontuais e transferências.
          </p>
          <CodeBlock code={TAR_CMD} lang="bash" title="tar" />
          <InfoBox className="mt-4" title="Decore: czf para criar, xzf para extrair">
            <p className="text-sm text-text-2">
              <strong>c</strong>reate · <strong>z</strong>ip (gzip) · <strong>f</strong>ile — para criar.
              E<strong>x</strong>tract · <strong>z</strong>ip · <strong>f</strong>ile — para extrair.
              O <code>v</code> adicional (verbose) mostra cada arquivo sendo processado.
            </p>
          </InfoBox>
        </section>

        <section id="rsync">
          <h2 className="text-2xl font-bold mb-2">rsync — Sincronização Incremental</h2>
          <p className="text-text-2 text-sm mb-4">
            <code>rsync</code> é mais eficiente que <code>cp</code> para backups — só transfere arquivos que mudaram.
            Funciona local e remoto via SSH.
          </p>
          <CodeBlock code={RSYNC_CMD} lang="bash" title="rsync" />
          <WarnBox className="mt-4" title="--delete apaga arquivos no destino">
            <p className="text-sm text-text-2">
              O flag <code>--delete</code> faz o destino espelhar a origem exatamente — incluindo apagar arquivos
              que foram removidos na origem. Sempre faça um dry run (<code>-n</code>) antes de usar em produção.
            </p>
          </WarnBox>
        </section>

        <section id="scp">
          <h2 className="text-2xl font-bold mb-2">scp — Copiar via SSH</h2>
          <CodeBlock code={SCP_CMD} lang="bash" title="scp" />
          <InfoBox className="mt-4" title="rsync vs scp — quando usar cada um">
            <p className="text-sm text-text-2">
              Use <code>scp</code> para transferências únicas e simples. Use <code>rsync</code> para
              backups recorrentes — ele só transfere os blocos que mudaram, economizando banda e tempo.
            </p>
          </InfoBox>
        </section>

        <section id="script-backup">
          <h2 className="text-2xl font-bold mb-2">Script Completo — Backup Automático</h2>
          <p className="text-text-2 text-sm mb-4">
            Combine tar + cron para uma estratégia de backup profissional.
          </p>
          <CodeBlock code={SCRIPT_BACKUP} lang="bash" title="backup-diario.sh" />
        </section>

        <HighlightBox title="🔜 Próxima versão deste módulo">
          <ul className="text-sm text-text-2 space-y-1 list-disc list-inside">
            <li>restic — backup moderno com deduplicação e criptografia nativa</li>
            <li>Bacula/Amanda — backup corporativo centralizado</li>
            <li>rclone — sincronizar para S3, Backblaze B2, Google Drive</li>
            <li>verificação de integridade com sha256sum antes e depois</li>
            <li>regra 3-2-1: 3 cópias, 2 mídias diferentes, 1 offsite</li>
          </ul>
        </HighlightBox>

        <section id="exercicios">
          <h2 className="text-2xl font-bold mb-4">Exercícios Guiados</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 1 — Backup com tar</p>
              <CodeBlock code={`mkdir -p /tmp/backup
tar -czf /tmp/backup/etc-$(date +%Y%m%d).tar.gz /etc/
ls -lh /tmp/backup/
tar -tzf /tmp/backup/etc-*.tar.gz | head -20  # ver conteúdo`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 2 — Rsync local</p>
              <CodeBlock code={`mkdir -p /tmp/backup-rsync
rsync -n -av /etc/ /tmp/backup-rsync/   # dry run primeiro
rsync -av /etc/ /tmp/backup-rsync/      # executar de verdade
rsync -av /etc/ /tmp/backup-rsync/      # segunda vez: notar velocidade`} lang="bash" />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">🎯 Exercício 3 — Restaurar um arquivo</p>
              <CodeBlock code={`# Extrair apenas um arquivo específico do backup
tar -xzf /tmp/backup/etc-*.tar.gz etc/hosts -C /tmp/
cat /tmp/etc/hosts  # confirmar restauração`} lang="bash" />
            </div>
          </div>
        </section>

        <section id="checkpoint">
          <div className="p-6 rounded-xl bg-bg-2 border border-border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>📋</span> Checkpoint do Módulo 08
            </h3>
            <div className="space-y-3">
              {CHECKLIST.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-bg-3 border border-border hover:border-[rgba(99,102,241,0.5)] transition-all text-left group"
                >
                  {checklist[item.id]
                    ? <CheckCircle2 size={18} className="text-ok shrink-0" />
                    : <Circle size={18} className="text-text-3 shrink-0 group-hover:text-[#6366f1] transition-colors" />
                  }
                  <span className={cn('text-sm', checklist[item.id] && 'line-through text-text-3')}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            {allDone && (
              <div className="mt-4 p-3 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-semibold text-center">
                ✅ Módulo 08 concluído! Próximo: Shell Script →
              </div>
            )}
          </div>
        </section>

      </div>

      <ModuleNav currentPath="/backup" order={FUNDAMENTOS_ORDER} />
    </div>
  );
}
