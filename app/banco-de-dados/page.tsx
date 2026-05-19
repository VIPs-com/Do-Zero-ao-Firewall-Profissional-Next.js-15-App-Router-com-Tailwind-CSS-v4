'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Database, Network, ShieldCheck, HardDrive, AlertOctagon, CheckCircle, AlertTriangle, FlaskConical } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint DB — Administração de Banco de Dados (PostgreSQL e MariaDB).
   Conteúdo alinhado a LPIC-2 / CompTIA Linux+. */

type DbTab = 'instalacao' | 'backup' | 'replicacao';

const CHECKLIST_ITEMS = [
  { id: 'db-instalado',   label: 'Instalei PostgreSQL e MariaDB, criei um banco + usuário e conectei com psql / mysql' },
  { id: 'db-backup',      label: 'Fiz dump e restore de um banco, e agendei o backup automático no cron' },
  { id: 'db-replicacao',  label: 'Configurei replicação (streaming PostgreSQL ou master-replica MariaDB) e analisei uma query com EXPLAIN' },
];

export default function BancoDeDadosPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<DbTab>('instalacao');

  useEffect(() => {
    trackPageVisit('/banco-de-dados');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-banco-de-dados min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Banco de Dados</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo · Servidores & Dados</div>
          <h1 className="text-4xl font-bold mb-4">🗄️ Administração de Banco de Dados</h1>
          <p className="text-text-2 text-lg mb-6">
            Quase toda aplicação séria depende de um banco de dados — e mantê-lo de pé é tarefa
            do sysadmin. Aqui você instala os dois SGBDs livres mais usados, o{' '}
            <strong>PostgreSQL</strong> e o <strong>MariaDB</strong>, cria usuários e bancos,
            domina <strong>backup &amp; restore</strong> e dá os primeiros passos em{' '}
            <strong>replicação</strong> e <strong>tuning</strong>.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de LPIC-2 e CompTIA Linux+.
          </p>
        </div>

        <FluxoCard
          title="Caminho de uma conexão até o banco"
          steps={[
            { label: 'Cliente',        sub: 'psql / mysql / app',                  icon: <Network size={14}/>,     color: 'border-info/50' },
            { label: 'Porta 5432/3306', sub: 'PostgreSQL / MariaDB escutando',      icon: <Database size={14}/>,    color: 'border-accent/50' },
            { label: 'Autenticação',   sub: 'pg_hba.conf / GRANTs',                icon: <ShieldCheck size={14}/>, color: 'border-warn/50' },
            { label: 'Banco',          sub: 'tabelas, dados, índices',             icon: <HardDrive size={14}/>,   color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'instalacao',  label: '🗄️ Instalação & Usuários' },
              { id: 'backup',      label: '💾 Backup & Restore' },
              { id: 'replicacao',  label: '🔄 Replicação & Tuning' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DbTab)}
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

        {/* ── TAB 1 ── */}
        {isActive('instalacao') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Instalando os dois SGBDs</h2>
          <p className="text-text-2 mb-4">
            <strong>PostgreSQL</strong> é o banco objeto-relacional mais robusto do mundo livre —
            forte em integridade, tipos avançados e concorrência. <strong>MariaDB</strong> é o
            fork comunitário do MySQL, leve e onipresente em stacks web (LAMP). Conhecer os dois
            é obrigatório para qualquer admin.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL ──
sudo apt update
sudo apt install -y postgresql postgresql-contrib

sudo systemctl enable --now postgresql
systemctl status postgresql            # deve estar "active (running)"
psql --version                         # confere a versão do cliente

# ── MariaDB ──
sudo apt install -y mariadb-server

sudo systemctl enable --now mariadb
# Endurecimento interativo: senha de root, remove usuário anônimo,
# desativa login remoto de root, remove o banco de teste:
sudo mysql_secure_installation`} />
          <WarnBox title="mysql_secure_installation não é opcional" className="mt-4">
            Uma instalação recém-feita do MariaDB aceita o usuário anônimo e não tem senha de
            root. Rodar o <code>mysql_secure_installation</code> logo após instalar é a primeira
            linha de defesa — pular esse passo deixa o banco exposto.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Criando bancos e usuários</h2>
          <p className="text-text-2 mb-4">
            Nunca rode a aplicação como superusuário do banco. Crie um usuário dedicado, com
            permissão só no banco dele — princípio do menor privilégio.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL — wrappers de linha de comando ──
sudo -u postgres createuser --pwprompt loja      # cria o papel e pede a senha
sudo -u postgres createdb --owner=loja lojadb    # banco lojadb pertencente a loja

# ── PostgreSQL — equivalente em SQL (dentro do psql) ──
sudo -u postgres psql <<'SQL'
CREATE USER loja WITH PASSWORD 'troque-esta-senha';
CREATE DATABASE lojadb OWNER loja;
GRANT ALL PRIVILEGES ON DATABASE lojadb TO loja;
SQL

# ── MariaDB — sempre via SQL ──
sudo mysql <<'SQL'
CREATE DATABASE lojadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'loja'@'localhost' IDENTIFIED BY 'troque-esta-senha';
GRANT ALL PRIVILEGES ON lojadb.* TO 'loja'@'localhost';
FLUSH PRIVILEGES;
SQL`} />
          <InfoBox title="FLUSH PRIVILEGES — o passo esquecido" className="mt-4">
            No MariaDB, alterações feitas direto nas tabelas de permissão só entram em vigor após
            <code> FLUSH PRIVILEGES</code>. Comandos <code>CREATE USER</code>/<code>GRANT</code>
            recarregam sozinhos, mas crie o hábito — é o erro #1 de quem está aprendendo.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Autenticação e acesso remoto</h2>
          <p className="text-text-2 mb-4">
            Por padrão, ambos só escutam em <code>localhost</code>. Liberar acesso pela rede tem
            duas partes: mandar o servidor <em>escutar</em> num IP e <em>autorizar</em> a origem.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL ──
# 1) Escutar na rede — postgresql.conf
sudo nano /etc/postgresql/*/main/postgresql.conf
#   listen_addresses = 'localhost,10.0.0.5'   # IP da interface, nunca 0.0.0.0 sem firewall

# 2) Autorizar a origem — pg_hba.conf (Host-Based Authentication)
sudo nano /etc/postgresql/*/main/pg_hba.conf
#   # TYPE  DATABASE  USER  ADDRESS         METHOD
#   host    lojadb    loja  10.0.0.0/24     scram-sha-256

sudo systemctl restart postgresql

# ── MariaDB ──
# 1) Escutar na rede — bind-address
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
#   bind-address = 10.0.0.5

# 2) Autorizar o usuário a partir da rede (host diferente de 'localhost')
sudo mysql -e "CREATE USER 'loja'@'10.0.0.%' IDENTIFIED BY 'senha';
               GRANT ALL ON lojadb.* TO 'loja'@'10.0.0.%'; FLUSH PRIVILEGES;"
sudo systemctl restart mariadb

# ── Conectar ──
psql -h 10.0.0.5 -U loja -d lojadb
mysql -h 10.0.0.5 -u loja -p lojadb`} />
          <WarnBox title="Acesso remoto = porta aberta" className="mt-4">
            Liberar 5432/3306 na rede sem firewall é convite para varredura. Restrinja a origem
            no <code>pg_hba.conf</code>/GRANT por sub-rede e adicione uma regra de iptables
            permitindo só os IPs da aplicação.
          </WarnBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['db-instalado']} onChange={e => updateChecklist('db-instalado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['db-instalado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('backup') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Backup lógico — dump</h2>
          <p className="text-text-2 mb-4">
            O backup lógico exporta o conteúdo do banco como comandos SQL (ou um formato
            próprio). É portátil entre versões e ideal para bancos pequenos e médios.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL ──
# Um banco, formato custom (-Fc) — compactado e restaurável seletivamente
pg_dump -U loja -Fc lojadb > lojadb.dump

# Um banco em SQL puro (texto legível)
pg_dump -U loja lojadb > lojadb.sql

# TODOS os bancos + papéis/usuários do cluster
pg_dumpall -U postgres > cluster-completo.sql

# ── MariaDB ──
mysqldump -u root -p lojadb > lojadb.sql            # um banco
mariadb-dump -u root -p --all-databases > tudo.sql  # comando moderno, todos os bancos
mysqldump -u root -p --single-transaction lojadb > lojadb.sql  # consistente sem travar`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Restore</h2>
          <p className="text-text-2 mb-4">
            Restaurar depende do formato do dump. O <code>pg_restore</code> só lê o formato
            custom; dumps SQL voltam pelo próprio cliente.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL ──
# Restaurar o formato custom (.dump) — recria objetos no banco de destino
createdb -U postgres lojadb
pg_restore -U postgres -d lojadb lojadb.dump

# Restaurar um dump SQL puro
psql -U postgres -d lojadb < lojadb.sql

# ── MariaDB ──
mysql -u root -p lojadb < lojadb.sql

# Crie o banco com o MESMO encoding antes de restaurar
mysql -u root -p -e "CREATE DATABASE lojadb CHARACTER SET utf8mb4 \\
                     COLLATE utf8mb4_unicode_ci;"`} />
          <WarnBox title="Backup não testado = sem backup" className="mt-4">
            Um arquivo de dump que ninguém nunca restaurou é só uma esperança. Faça
            periodicamente o <em>restore drill</em>: recupere o backup num servidor de teste e
            confirme que os dados voltam íntegros. A hora do desastre não é a hora de descobrir
            que o dump estava corrompido.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Automatizando com cron</h2>
          <p className="text-text-2 mb-4">
            Backup que depende de alguém lembrar não acontece. Agende um script no{' '}
            <code>cron</code> e mantenha rotação por data.
          </p>
          <CodeBlock lang="bash" code={`#!/bin/bash
# /usr/local/bin/backup-db.sh — dump diário com data no nome
set -euo pipefail
DEST=/var/backups/postgres
DATA=\$(date +%F)
mkdir -p "\$DEST"

pg_dump -U loja -Fc lojadb > "\${DEST}/lojadb-\${DATA}.dump"

# Rotação: apaga dumps com mais de 14 dias
find "\$DEST" -name 'lojadb-*.dump' -mtime +14 -delete

# Agendar — crontab -e (todo dia às 02h30)
# 30 2 * * *  /usr/local/bin/backup-db.sh >> /var/log/backup-db.log 2>&1`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. PITR — Point-In-Time Recovery</h2>
          <p className="text-text-2 mb-4">
            O dump tira uma foto diária. Mas e se a tabela foi apagada às 14h47 e o último
            backup é das 02h30? O <strong>PITR</strong> resolve isso: combina um{' '}
            <em>base backup</em> com o <strong>WAL</strong> (Write-Ahead Log) — o diário de
            todas as alterações — permitindo restaurar o banco até um instante exato.
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL — habilitar arquivamento de WAL (postgresql.conf) ──
#   wal_level = replica
#   archive_mode = on
#   archive_command = 'cp %p /var/backups/wal/%f'

# Base backup do cluster inteiro
pg_basebackup -U postgres -D /var/backups/base -Ft -z -P

# Na recuperação: PostgreSQL aplica os WAL até o ponto desejado
# (recovery.signal + recovery_target_time = '2026-05-19 14:46:00')`} />
          <InfoBox title="Dump vs PITR — quando usar cada um" className="mt-4">
            Bancos pequenos e estáveis: dump diário basta. Bancos críticos com escrita intensa,
            onde perder horas de dados é inaceitável: PITR com WAL archiving. Os dois se
            complementam — o dump é o piso, o PITR é o teto.
          </InfoBox>

          <WindowsComparisonBox
            windowsLabel="Windows (SQL Server)"
            linuxLabel="Linux (PostgreSQL / MariaDB)"
            windowsCode={`# SQL Server Management Studio (SSMS) — GUI completa
# sqlcmd — cliente de linha de comando:
sqlcmd -S localhost -U sa -Q "SELECT name FROM sys.databases"

# Backup pela GUI ou T-SQL:
BACKUP DATABASE lojadb TO DISK = 'C:\\bkp\\lojadb.bak'
RESTORE DATABASE lojadb FROM DISK = 'C:\\bkp\\lojadb.bak'`}
            linuxCode={`# psql / mysql — clientes de linha de comando
psql -U loja -d lojadb -c "\\l"          # lista os bancos
mysql -u loja -p -e "SHOW DATABASES;"

# Backup e restore por ferramenta dedicada:
pg_dump -U loja -Fc lojadb > lojadb.dump
pg_restore -U postgres -d lojadb lojadb.dump
mysqldump -u root -p lojadb > lojadb.sql`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['db-backup']} onChange={e => updateChecklist('db-backup', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['db-backup'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('replicacao') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Replicação streaming no PostgreSQL</h2>
          <p className="text-text-2 mb-4">
            Replicação mantém uma cópia viva do banco em outro servidor — o{' '}
            <strong>standby</strong>. Serve para <em>alta disponibilidade</em> (se o primário
            cair, o standby assume) e para <em>distribuir leituras</em>. No PostgreSQL, o
            standby recebe o fluxo de WAL do <strong>primary</strong> em tempo real.
          </p>
          <CodeBlock lang="bash" code={`# ── No PRIMARY (postgresql.conf) ──
#   wal_level = replica
#   max_wal_senders = 10
#   listen_addresses = '*'

# pg_hba.conf — autorizar o standby a se conectar como réplica
#   host  replication  replicador  10.0.0.20/32  scram-sha-256

sudo -u postgres psql -c "CREATE ROLE replicador WITH REPLICATION LOGIN PASSWORD 'senha';"

# ── No STANDBY — clonar o primário ──
sudo systemctl stop postgresql
sudo -u postgres pg_basebackup -h 10.0.0.10 -U replicador \\
     -D /var/lib/postgresql/16/main -Fp -Xs -P -R
# A flag -R já grava standby.signal + primary_conninfo
sudo systemctl start postgresql

# Verificar o estado da replicação (no primary)
sudo -u postgres psql -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Replicação master-replica no MariaDB</h2>
          <p className="text-text-2 mb-4">
            No MariaDB, a réplica lê o <strong>binary log (binlog)</strong> do master e reaplica
            cada evento. Cada servidor precisa de um <code>server-id</code> único.
          </p>
          <CodeBlock lang="bash" code={`# ── No MASTER (50-server.cnf) ──
#   server-id        = 1
#   log_bin          = /var/log/mysql/mariadb-bin
#   binlog_format    = ROW

sudo mysql <<'SQL'
CREATE USER 'replica'@'10.0.0.%' IDENTIFIED BY 'senha';
GRANT REPLICATION SLAVE ON *.* TO 'replica'@'10.0.0.%';
FLUSH PRIVILEGES;
SHOW MASTER STATUS;   -- anote File e Position
SQL

# ── Na REPLICA (50-server.cnf: server-id = 2) ──
sudo mysql <<'SQL'
CHANGE MASTER TO
  MASTER_HOST='10.0.0.10',
  MASTER_USER='replica',
  MASTER_PASSWORD='senha',
  MASTER_LOG_FILE='mariadb-bin.000001',
  MASTER_LOG_POS=345;
START SLAVE;
SHOW SLAVE STATUS\\G   -- Slave_IO_Running e Slave_SQL_Running devem ser "Yes"
SQL`} />
          <WarnBox title="Replica em lag — Seconds_Behind_Master" className="mt-4">
            Se <code>Seconds_Behind_Master</code> cresce sem parar, a réplica não acompanha o
            volume de escrita do master. Investigue: I/O de disco lento, rede saturada ou uma
            transação enorme em curso. Lag persistente significa que um failover perderia dados.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Tuning básico</h2>
          <p className="text-text-2 mb-4">
            Um banco lento quase sempre é falta de <strong>índice</strong> ou parâmetro de
            memória mal dimensionado. As duas frentes:
          </p>
          <CodeBlock lang="sql" code={`-- Diagnosticar uma query lenta — EXPLAIN mostra o plano de execução
EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 4231;
-- "Seq Scan" numa tabela grande = sinal de índice faltando

-- Criar o índice que falta
CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);
-- Rode o EXPLAIN de novo: deve virar "Index Scan"`} />
          <p className="text-text-2 mt-4 mb-4">
            Parâmetros de memória mais impactantes:
          </p>
          <CodeBlock lang="bash" code={`# ── PostgreSQL (postgresql.conf) ──
#   shared_buffers     = 25% da RAM     # cache de páginas do banco
#   work_mem           = 16MB           # memória por operação de sort/hash
#   effective_cache_size = 50-75% da RAM

# ── MariaDB (50-server.cnf) ──
#   innodb_buffer_pool_size = 50-70% da RAM   # o parâmetro nº 1 do InnoDB
#   max_connections         = 150

# Monitorar conexões ativas
psql -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
mysql -e "SHOW STATUS LIKE 'Threads_connected';"`} />
          <InfoBox title="Meça antes de mexer" className="mt-4">
            Tuning sem dado é chute. Use <code>EXPLAIN ANALYZE</code> para queries,{' '}
            <code>pg_stat_activity</code> / <code>SHOW PROCESSLIST</code> para conexões e o log
            de queries lentas para achar o gargalo real — depois ajuste um parâmetro de cada vez.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['db-replicacao']} onChange={e => updateChecklist('db-replicacao', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['db-replicacao'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── Erros Comuns (sempre visível) ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns e Soluções</h2>
          <div className="space-y-3">
            {[
              {
                erro: 'PostgreSQL: "peer authentication failed for user"',
                sol: 'O método "peer" do pg_hba.conf exige que o usuário do SO seja igual ao do banco. Para conectar como "loja" sendo outro usuário, troque a linha local para "scram-sha-256" (ou use sudo -u postgres). Reinicie o serviço após editar.',
              },
              {
                erro: 'MariaDB: GRANT feito mas o usuário ainda não acessa',
                sol: 'Faltou FLUSH PRIVILEGES, ou o host do usuário está errado — \'loja\'@\'localhost\' é diferente de \'loja\'@\'10.0.0.%\'. Confira com SELECT user, host FROM mysql.user; e crie o usuário para o host correto.',
              },
              {
                erro: 'Restore falha com erro de encoding / collation',
                sol: 'O banco de destino foi criado com charset diferente do dump. No MariaDB, recrie com CREATE DATABASE ... CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci antes do restore. No PostgreSQL, use createdb --encoding=UTF8 com o mesmo locale do dump original.',
              },
              {
                erro: 'Replica ficou para trás (lag crescente)',
                sol: 'Seconds_Behind_Master ou pg_stat_replication mostram a réplica defasada. Causas: disco lento na réplica, rede saturada ou transação gigante. Verifique I/O, considere binlog_format=ROW e, se preciso, recrie a réplica com um base backup novo.',
              },
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

        {/* ── Exercícios Guiados (sempre visível) ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Exercícios Guiados</h2>
          <p className="text-text-2 mb-6">
            Três laboratórios práticos. Faça numa VM de testes — nunca em produção.
          </p>
          <div className="space-y-4">

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <h3 className="font-bold text-text mb-2 flex items-center gap-2">
                <FlaskConical size={16} className="text-accent shrink-0" /> Lab 1 — Do zero ao primeiro banco
              </h3>
              <p className="text-sm text-text-2 mb-3">
                Instale o PostgreSQL, crie o usuário <code>loja</code> e o banco{' '}
                <code>lojadb</code>, conecte com <code>psql</code> e crie uma tabela com 3 linhas.
              </p>
              <CodeBlock lang="bash" code={`sudo apt install -y postgresql
sudo -u postgres createuser --pwprompt loja
sudo -u postgres createdb --owner=loja lojadb
psql -h localhost -U loja -d lojadb -c \\
  "CREATE TABLE produtos (id serial PRIMARY KEY, nome text, preco numeric);
   INSERT INTO produtos (nome, preco) VALUES ('cabo',9.9),('mouse',49.0),('teclado',120.0);
   SELECT * FROM produtos;"`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <h3 className="font-bold text-text mb-2 flex items-center gap-2">
                <FlaskConical size={16} className="text-accent shrink-0" /> Lab 2 — Backup, desastre e restore
              </h3>
              <p className="text-sm text-text-2 mb-3">
                Faça o dump do <code>lojadb</code>, simule um desastre apagando a tabela e
                restaure o backup. Confirme que as 3 linhas voltaram.
              </p>
              <CodeBlock lang="bash" code={`pg_dump -U loja -Fc lojadb > lojadb.dump          # 1) backup
psql -U loja -d lojadb -c "DROP TABLE produtos;"   # 2) desastre
pg_restore -U postgres -d lojadb lojadb.dump       # 3) restore
psql -U loja -d lojadb -c "SELECT count(*) FROM produtos;"  # deve mostrar 3`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <h3 className="font-bold text-text mb-2 flex items-center gap-2">
                <FlaskConical size={16} className="text-accent shrink-0" /> Lab 3 — Índice e EXPLAIN
              </h3>
              <p className="text-sm text-text-2 mb-3">
                Popule uma tabela com 100 mil linhas, rode um <code>EXPLAIN ANALYZE</code> antes
                e depois de criar o índice e compare o plano (Seq Scan → Index Scan).
              </p>
              <CodeBlock lang="sql" code={`-- Popular: 100 mil linhas
INSERT INTO produtos (nome, preco)
SELECT 'item-' || g, (random()*100)::numeric
FROM generate_series(1, 100000) g;

EXPLAIN ANALYZE SELECT * FROM produtos WHERE nome = 'item-50000';  -- Seq Scan
CREATE INDEX idx_produtos_nome ON produtos (nome);
EXPLAIN ANALYZE SELECT * FROM produtos WHERE nome = 'item-50000';  -- Index Scan`} />
            </div>

          </div>
        </section>

        <ModuleNav order={ADVANCED_ORDER} currentPath="/banco-de-dados" />

      </div>
    </main>
  );
}
