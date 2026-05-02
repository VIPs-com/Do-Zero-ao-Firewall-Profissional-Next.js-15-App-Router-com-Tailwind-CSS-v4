'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';
import { FUNDAMENTOS_ORDER } from '@/data/courseOrder';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox } from '@/components/ui/Boxes';
import { WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { Terminal, Link2, Archive, Radio, HardDrive, Wrench, FileEdit, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

const CHECKLIST_ITEMS = [
  { id: 'sed-dominado',          label: 'Usei sed -i para editar um arquivo de configuração real sem abrir editor' },
  { id: 'links-criados',         label: 'Criei link simbólico e hard link e entendi a diferença de inodes' },
  { id: 'compactacao-praticada', label: 'Compactei e descompactei arquivos com tar+gzip e com zip para Windows' },
];

export default function ComandosAvancadosPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/comandos-avancados');
  }, [trackPageVisit]);

  return (
    <main className="module-accent-comandos-avancados min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <Link href="/fundamentos" className="hover:text-accent transition-colors">Fundamentos</Link>
          <span>/</span>
          <span className="text-text-2">Comandos Avançados</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="section-label mb-3">Módulo F13 · Fundamentos Linux</div>
          <h1 className="text-4xl font-bold mb-4">🔧 Comandos Avançados do SysAdmin</h1>
          <p className="text-text-2 text-lg mb-6">
            sed · dd · nc · ln · gzip/tar — a caixa de ferramentas que o mercado exige
          </p>
        </div>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: A Caixa de Ferramentas do SysAdmin"
          steps={[
            { label: 'sed',      sub: 'edita arquivos em stream — sem abrir editor',  icon: <FileEdit size={14}/>,  color: 'border-accent/50' },
            { label: 'dd',       sub: 'cópia de baixo nível — discos, ISOs, zeros',   icon: <HardDrive size={14}/>, color: 'border-warn/50' },
            { label: 'nc',       sub: 'NetCat — testa portas e transfere arquivos',    icon: <Radio size={14}/>,     color: 'border-info/50' },
            { label: 'ln',       sub: 'links simbólicos e hard links',                 icon: <Link2 size={14}/>,     color: 'border-layer-3/50' },
            { label: 'gzip/tar', sub: 'compacta para Linux e zip para Windows',        icon: <Archive size={14}/>,   color: 'border-ok/50' },
          ]}
        />

        {/* Seção 1 — SED */}
        <section className="mt-10 mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileEdit className="text-accent" size={22} />
            SED: editor de streams
          </h2>
          <p className="text-text-2 mb-4">
            O <strong>sed</strong> (Stream EDitor) processa arquivos linha por linha, sem precisar abrir um editor interativo. É a ferramenta ideal para substituições em massa, remoção de linhas e transformação de texto em scripts e pipelines.
          </p>

          <div className="mb-4">
            <WindowsComparisonBox
              windowsLabel="Windows — Localizar e Substituir"
              linuxLabel="Linux — sed"
              windowsCode={"Abrir arquivo no Notepad / VSCode\nCtrl+H → Localizar e Substituir\nSalvar manualmente\nNão funciona em scripts automáticos"}
              linuxCode={"sed 's/antigo/novo/g' arquivo      # exibir resultado\nsed -i 's/antigo/novo/g' arquivo  # editar in-place\nsed -i.bak 's/antigo/novo/g' arq  # com backup\n# Funciona em scripts, pipelines, cron"}
            />
          </div>

          <CodeBlock lang="bash" code={`# Substituição básica — exibe o resultado sem modificar o arquivo
sed 's/erro/aviso/g' /var/log/app.log

# Edição in-place (modifica o arquivo diretamente)
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Edição in-place COM backup (.bak) — recomendado em produção
sed -i.bak 's/porta=80/porta=8080/g' /etc/myapp/config.conf

# Substituir só na linha N
sed '10s/antigo/novo/' arquivo.txt

# Deletar linhas em branco
sed '/^$/d' arquivo.txt

# Deletar linhas que contêm uma palavra
sed '/DEBUG/d' /var/log/app.log

# Imprimir apenas linhas de 5 a 10
sed -n '5,10p' arquivo.txt

# Caso de uso real: trocar IP de servidor em todos os configs
sed -i 's/192.168.1.100/192.168.1.200/g' /etc/nginx/sites-available/*.conf`} />

          <div className="mt-4">
            <InfoBox title="Sed em produção">
              O sed é a ferramenta certa para: trocar valores em configs, remover linhas de log antigas, transformar saídas de outros comandos em pipelines. Para edições complexas, combine com grep e awk.
            </InfoBox>
          </div>
        </section>

        {/* Seção 2 — DD */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HardDrive className="text-warn" size={22} />
            DD: cópia de baixo nível
          </h2>
          <p className="text-text-2 mb-4">
            O <strong>dd</strong> copia dados bit a bit, independente do sistema de arquivos. É usado para fazer backups de discos completos, gravar ISOs em pendrives, zerar dispositivos de armazenamento e criar arquivos de tamanho específico para testes.
          </p>

          <div className="mb-4">
            <WarnBox title="DD — Disk Destroyer se usado errado">
              DD significa &apos;Disk Destroyer&apos; se os parâmetros <code className="font-mono">if=</code> (input) e <code className="font-mono">of=</code> (output) forem trocados. SEMPRE confira duas vezes antes de executar — dd sobrescreve sem pedir confirmação.
            </WarnBox>
          </div>

          <CodeBlock lang="bash" code={`# Verificar disco antes de qualquer operação dd
lsblk
fdisk -l

# Criar imagem de backup de um disco inteiro
dd if=/dev/sda of=/backup/sda.img bs=4M status=progress

# Restaurar imagem para disco
dd if=/backup/sda.img of=/dev/sdb bs=4M status=progress

# Zerar completamente um disco (antes de descartar)
dd if=/dev/zero of=/dev/sdb bs=4M status=progress

# Gravar ISO em pendrive USB
dd if=ubuntu-24.04-server.iso of=/dev/sdc bs=4M status=progress oflag=sync

# Criar arquivo de tamanho específico (para testes)
dd if=/dev/zero of=teste-1gb.img bs=1M count=1024

# Testar velocidade de escrita do disco
dd if=/dev/zero of=/tmp/teste-velocidade bs=1G count=1 oflag=direct`} />

          <div className="mt-4">
            <WindowsComparisonBox
              windowsLabel="Windows — Ferramentas de Disco"
              linuxLabel="Linux — dd"
              windowsCode={"Rufus → gravar ISO em USB\nClonezilla → clonar disco\nDiskpart → limpar disco\nWin32DiskImager → imagem de disco"}
              linuxCode={"dd if=ubuntu.iso of=/dev/sdc bs=4M   # gravar ISO\ndd if=/dev/sda of=backup.img          # clonar disco\ndd if=/dev/zero of=/dev/sdb           # zerar disco\n# dd faz tudo com um único comando"}
            />
          </div>
        </section>

        {/* Seção 3 — NC */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Radio className="text-info" size={22} />
            NC (NetCat): o canivete suíço da rede
          </h2>

          <div className="mb-4">
            <InfoBox title="Por que NetCat">
              NetCat (<code className="font-mono">nc</code>) conecta ou escuta em qualquer porta TCP/UDP. SysAdmins usam para testar se uma porta está aberta, validar regras de firewall e transferir arquivos sem configurar serviços.
            </InfoBox>
          </div>

          <CodeBlock lang="bash" code={`# Testar se uma porta está aberta (o teste mais útil do sysadmin)
nc -zv 192.168.1.1 22        # SSH aberto?
nc -zv 192.168.1.1 80        # HTTP aberto?
nc -zv google.com 443         # HTTPS externo funcionando?

# Escanear range de portas
nc -zv 192.168.1.1 20-30

# Listener simples — esperar uma conexão na porta 8080
nc -l 8080

# Testar regra de firewall: máquina A escuta, máquina B conecta
# Máquina A (servidor): nc -l 9999
# Máquina B (cliente):  nc IP-da-maquina-A 9999
# Se conectar → a porta está aberta no firewall

# Banner grabbing — ver o que o serviço responde
nc 192.168.1.1 22    # mostra banner do SSH
nc 192.168.1.1 80    # (enviar: GET / HTTP/1.0 + Enter 2x)

# Transferência de arquivo entre máquinas (sem SCP/FTP)
# Receptor: nc -l 9999 > arquivo-recebido.tar.gz
# Emissor:  nc IP-receptor 9999 < arquivo.tar.gz`} />

          <div className="mt-4">
            <WindowsComparisonBox
              windowsLabel="Windows — Testar Conectividade"
              linuxLabel="Linux — nc (NetCat)"
              windowsCode={"telnet host porta           # testar porta (se instalado)\nTest-NetConnection host -Port porta  # PowerShell\nPortQry.exe                 # ferramenta extra da Microsoft"}
              linuxCode={"nc -zv host porta           # testar porta\nnc -l porta                 # abrir listener\nnc host porta < arquivo     # enviar arquivo\n# nc já vem instalado ou: apt install netcat-openbsd"}
            />
          </div>
        </section>

        {/* Seção 4 — Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Link2 className="text-layer-3" size={22} />
            Links Simbólicos e Hard Links
          </h2>

          <div className="mb-4">
            <InfoBox title="Dois tipos de links">
              Linux tem dois tipos de link: simbólico (aponta para o caminho) e hard link (aponta para o mesmo inode — o dado real no disco). Entender a diferença evita surpresas ao mover/deletar arquivos.
            </InfoBox>
          </div>

          <CodeBlock lang="bash" code={`# ── Links Simbólicos (symlink) ─────────────────────────────────
# Criar link simbólico (como atalho no Windows)
ln -s /etc/nginx/sites-available/meusite /etc/nginx/sites-enabled/meusite

# Ver links simbólicos com ls -la (mostra o -> destino)
ls -la /etc/nginx/sites-enabled/
# lrwxrwxrwx 1 root root ... meusite -> /etc/nginx/sites-available/meusite

# Criar link para um diretório
ln -s /var/www/html/meuapp /home/deploy/app

# Verificar para onde um symlink aponta
readlink -f /etc/nginx/sites-enabled/meusite

# Remover symlink (não remove o arquivo original)
rm /etc/nginx/sites-enabled/meusite

# ── Hard Links ──────────────────────────────────────────────────
# Criar hard link (mesmo inode — dois nomes para o mesmo dado)
ln /etc/nginx/nginx.conf /backup/nginx.conf.bak

# Ver o número de hard links (2a coluna do ls -la)
ls -la /etc/nginx/nginx.conf
# -rw-r--r-- 2 root root ...  (o "2" = 2 hard links)

# Ver o inode (hard links compartilham o mesmo)
ls -lai /etc/nginx/nginx.conf /backup/nginx.conf.bak`} />

          <div className="mt-4">
            <WindowsComparisonBox
              windowsLabel="Windows — Atalhos e Links"
              linuxLabel="Linux — ln"
              windowsCode={"Atalho .lnk → aponta para arquivo/pasta\nmklink /D link destino   # cmd\nNew-Item -ItemType SymbolicLink # PowerShell\nHard link: mklink /H link original"}
              linuxCode={"ln -s destino link_nome   # simbólico (qualquer fs)\nln original hard_link     # hard link (mesmo fs)\nSymlink deletado ≠ arquivo deletado\nHard link deletado: dado persiste até 0 links"}
            />
          </div>

          <div className="mt-4">
            <InfoBox title="Symlinks em produção">
              Nginx usa symlinks para habilitar sites: o arquivo fica em <code className="font-mono">sites-available/</code>, o symlink em <code className="font-mono">sites-enabled/</code>. <code className="font-mono">a2ensite</code> do Apache faz o mesmo. Isso permite desabilitar (<code className="font-mono">rm symlink</code>) sem perder a configuração.
            </InfoBox>
          </div>
        </section>

        {/* Seção 5 — Compactação */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Archive className="text-ok" size={22} />
            Compactação e Descompactação
          </h2>

          <div className="mb-4">
            <InfoBox title="Por que importa">
              tar+gzip é o formato padrão Linux para backups e distribuição de software. zip é necessário para compatibilidade com Windows. xz oferece a melhor compressão para distribuições.
            </InfoBox>
          </div>

          <CodeBlock lang="bash" code={`# ── tar (agrupa arquivos) + gzip/bzip2/xz (comprime) ──────────

# Criar arquivo .tar.gz (compressão rápida — padrão para backups)
tar -czf backup.tar.gz /var/www/html/

# Criar arquivo .tar.bz2 (compressão melhor, mais lento)
tar -cjf backup.tar.bz2 /var/www/html/

# Criar arquivo .tar.xz (melhor compressão — usado por distros Linux)
tar -cJf backup.tar.xz /var/www/html/

# Listar conteúdo sem extrair
tar -tzf backup.tar.gz

# Extrair no diretório atual
tar -xzf backup.tar.gz

# Extrair em diretório específico
tar -xzf backup.tar.gz -C /tmp/restauracao/

# ── gzip direto (comprime arquivo único — não agrupa) ──────────
gzip arquivo.log          # comprime → arquivo.log.gz (original removido)
gunzip arquivo.log.gz     # descomprime
gzip -k arquivo.log       # comprime mas MANTÉM o original (-k = keep)
gzip -9 arquivo.log       # compressão máxima (mais lento)

# ── zip (compatibilidade com Windows) ──────────────────────────
zip -r backup.zip /var/www/html/   # criar zip recursivo
unzip backup.zip                    # extrair
unzip -l backup.zip                 # listar conteúdo
unzip backup.zip -d /tmp/destino/  # extrair em pasta específica`} />

          <div className="mt-4">
            <HighlightBox title="Tabela comparativa de formatos">
              <p className="text-sm text-text-2">
                <strong>tar.gz</strong> — padrão para backups e logs (rápido, bom o suficiente).{' '}
                <strong>tar.bz2</strong> — quando compressão importa mais que velocidade.{' '}
                <strong>tar.xz</strong> — kernels Linux e pacotes de distribuição.{' '}
                <strong>zip</strong> — quando vai enviar para alguém com Windows.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="text-xs w-full font-mono">
                  <thead>
                    <tr className="text-text-3 border-b border-border">
                      <th className="text-left pb-2 pr-4">Formato</th>
                      <th className="text-left pb-2 pr-4">Extensão</th>
                      <th className="text-left pb-2 pr-4">Velocidade</th>
                      <th className="text-left pb-2 pr-4">Compressão</th>
                      <th className="text-left pb-2">Compatibilidade</th>
                    </tr>
                  </thead>
                  <tbody className="text-text-2">
                    <tr className="border-b border-border/40">
                      <td className="py-1 pr-4">tar+gzip</td>
                      <td className="py-1 pr-4">.tar.gz</td>
                      <td className="py-1 pr-4 text-ok">Rápida</td>
                      <td className="py-1 pr-4">Boa</td>
                      <td className="py-1">Linux/Mac</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-1 pr-4">tar+bzip2</td>
                      <td className="py-1 pr-4">.tar.bz2</td>
                      <td className="py-1 pr-4 text-warn">Média</td>
                      <td className="py-1 pr-4">Melhor</td>
                      <td className="py-1">Linux/Mac</td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-1 pr-4">tar+xz</td>
                      <td className="py-1 pr-4">.tar.xz</td>
                      <td className="py-1 pr-4 text-err">Lenta</td>
                      <td className="py-1 pr-4">Excelente</td>
                      <td className="py-1">Linux (distros)</td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-4">zip</td>
                      <td className="py-1 pr-4">.zip</td>
                      <td className="py-1 pr-4 text-ok">Rápida</td>
                      <td className="py-1 pr-4">Boa</td>
                      <td className="py-1">Universal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </HighlightBox>
          </div>

          <div className="mt-4">
            <WindowsComparisonBox
              windowsLabel="Windows — Compressão"
              linuxLabel="Linux — gzip/tar/zip"
              windowsCode={"Clique direito → Compactar como ZIP\nWinRAR / 7-Zip → .rar .7z .zip\n'Extrair Aqui' → descompactar\nExplorador de Arquivos abre .zip nativo"}
              linuxCode={"tar -czf backup.tar.gz pasta/    # compactar\ntar -xzf backup.tar.gz            # descompactar\nzip -r backup.zip pasta/          # zip para Windows\nunzip backup.zip                  # extrair zip"}
            />
          </div>
        </section>

        {/* Exercícios Guiados */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Wrench className="text-warn" size={22} />
            Exercícios Guiados
          </h2>

          {/* Exercício 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 1 — Refatoração de config com sed
            </h3>
            <CodeBlock lang="bash" code={`# Cenário: trocar porta do SSH sem abrir editor
# 1. Ver a linha atual
grep Port /etc/ssh/sshd_config

# 2. Trocar porta 22 por 2222 in-place com backup
sed -i.bak 's/^#Port 22/Port 2222/' /etc/ssh/sshd_config

# 3. Confirmar a mudança
grep Port /etc/ssh/sshd_config

# 4. Restaurar se necessário
cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config`} />
          </div>

          {/* Exercício 2 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 2 — Testar firewall com NetCat
            </h3>
            <CodeBlock lang="bash" code={`# Cenário: validar que a regra iptables está funcionando
# Terminal 1 — abrir listener na porta 9090
nc -l 9090

# Terminal 2 — tentar conectar
nc -zv localhost 9090   # deve conectar (sem firewall)

# Adicionar regra de bloqueio
iptables -A INPUT -p tcp --dport 9090 -j DROP

# Tentar de novo
nc -zv localhost 9090 -w 2   # deve dar timeout

# Remover a regra
iptables -D INPUT -p tcp --dport 9090 -j DROP`} />
          </div>

          {/* Exercício 3 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              Exercício 3 — Backup com tar + verificação
            </h3>
            <CodeBlock lang="bash" code={`# 1. Criar backup comprimido com timestamp
HOJE=$(date +%Y-%m-%d)
tar -czf "backup-nginx-$HOJE.tar.gz" /etc/nginx/

# 2. Verificar o que foi incluído
tar -tzf "backup-nginx-$HOJE.tar.gz"

# 3. Ver o tamanho do backup
ls -lh "backup-nginx-$HOJE.tar.gz"

# 4. Testar extração em diretório temporário
mkdir -p /tmp/teste-restore
tar -xzf "backup-nginx-$HOJE.tar.gz" -C /tmp/teste-restore
ls /tmp/teste-restore/etc/nginx/

# 5. Limpar
rm -rf /tmp/teste-restore`} />
          </div>
        </section>

        {/* Checkpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Checkpoints do Módulo</h2>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => updateChecklist(item.id, !checklist[item.id])}
                className={cn(
                  'w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all',
                  checklist[item.id]
                    ? 'bg-ok/10 border-ok/40 text-ok'
                    : 'bg-bg-2 border-border hover:border-accent/40 text-text-2',
                )}
              >
                {checklist[item.id]
                  ? <CheckCircle size={18} className="mt-0.5 shrink-0 text-ok" />
                  : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-text-3" />
                }
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle size={22} className="text-warn" /> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'sed: 1: "arquivo.conf": undefined label — sed -i no macOS difere do Linux',
              fix: 'BSD sed (macOS) exige sufixo para -i: sed -i "" "s/old/new/g" arquivo. GNU sed (Linux): sed -i "s/old/new/g" arquivo. Para scripts portáveis, usar perl -pi -e "s/old/new/g" arquivo ou instalar gnu-sed no macOS via Homebrew.',
            },
            {
              err: 'dd: error writing — no space left on device (mesmo com espaço disponível)',
              fix: 'A partição de destino está cheia, não o disco inteiro. Verificar: df -h. O dd escreve byte a byte — se of= for uma partição menor que if=, vai encher. Usar bs=4M e verificar se o destino tem espaço suficiente antes de iniciar.',
            },
            {
              err: 'nc: connection refused — netcat não conecta na porta',
              fix: 'Nenhum serviço escutando na porta, ou firewall bloqueando. Verificar se o serviço está ativo: ss -tuln | grep PORTA. Testar de dentro do servidor (localhost) primeiro. Se funcionar local mas não remoto, é firewall: verificar iptables -L -n.',
            },
            {
              err: 'ln: failed to create symbolic link: File exists',
              fix: 'Link já existe. Para sobrescrever: ln -sf alvo link (flag -f força). Para verificar links existentes: ls -la | grep "->". Links quebrados (apontam para alvo inexistente) aparecem em vermelho no ls.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        {/* ModuleNav */}
        <ModuleNav currentPath="/comandos-avancados" order={FUNDAMENTOS_ORDER} />

      </div>
    </main>
  );
}
