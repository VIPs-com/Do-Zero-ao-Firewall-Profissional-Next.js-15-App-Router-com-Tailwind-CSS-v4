'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { ShieldCheck, Lock, FileSearch, AlertOctagon, CheckCircle, AlertTriangle, HardDrive, KeyRound, Eye } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint SEGURANCA-AVANCADA — Hardening Nível Pro.
   SELinux (MAC), LUKS (criptografia de disco), auditd (audit do kernel).
   Alinhado a CompTIA Security+/Linux+ e LPIC-2. */

type SaTab = 'selinux' | 'luks' | 'auditd';

const CHECKLIST_ITEMS = [
  { id: 'selinux-configurado', label: 'Diagnostiquei uma negação AVC do SELinux, gerei política com audit2allow ou ajustei o contexto com semanage fcontext + restorecon' },
  { id: 'luks-criado',         label: 'Criei um volume LUKS, fiz backup do header com luksHeaderBackup e adicionei uma 2ª passphrase com luksAddKey' },
  { id: 'auditd-regras',       label: 'Configurei regras de auditd persistentes em /etc/audit/rules.d e li eventos com ausearch -k' },
];

export default function SegurancaAvancadaPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<SaTab>('selinux');

  useEffect(() => {
    trackPageVisit('/seguranca-avancada');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-seguranca-avancada min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Segurança Avançada</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Hardening Nível Pro</div>
          <h1 className="text-4xl font-bold mb-4">🛡️ Segurança Avançada — Hardening Nível Pro</h1>
          <p className="text-text-2 text-lg mb-6">
            Firewall, Fail2ban e hardening básico cobrem a porta da frente. Para sistemas que
            guardam dados sensíveis ainda faltam três camadas profundas: <strong>SELinux</strong>{' '}
            (controle de acesso obrigatório no kernel), <strong>LUKS</strong> (criptografia do
            disco em repouso) e <strong>auditd</strong> (rastro forense de cada chamada ao
            kernel). Este módulo monta as três num único host.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de LPIC-2 e CompTIA Security+/Linux+.
          </p>
        </div>

        <FluxoCard
          title="As três camadas do hardening pro"
          steps={[
            { label: 'SELinux',  sub: 'MAC no kernel — confina processos',     icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
            { label: 'LUKS',     sub: 'criptografia do disco em repouso',      icon: <Lock size={14}/>,        color: 'border-info/50' },
            { label: 'auditd',   sub: 'audit de syscalls e arquivos sensíveis',icon: <FileSearch size={14}/>,  color: 'border-warn/50' },
            { label: 'Forense pronto', sub: 'quem fez o quê, quando e onde',   icon: <Eye size={14}/>,         color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'selinux', label: '🛡️ SELinux' },
              { id: 'luks',    label: '🔒 LUKS — Criptografia de Disco' },
              { id: 'auditd',  label: '📋 auditd — Auditoria de Sistema' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SaTab)}
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

        {/* ── TAB 1 — SELinux ── */}
        {isActive('selinux') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. DAC vs MAC — o que o SELinux acrescenta</h2>
          <p className="text-text-2 mb-4">
            O modelo clássico de permissões Unix (<code>chmod</code>, <code>chown</code>) é
            <strong> DAC</strong> — <em>Discretionary Access Control</em>: o dono do arquivo decide
            quem acessa. É discricionário, e por isso frágil: um processo rodando como root pode
            tudo, e qualquer escalonamento de privilégio derruba a defesa inteira. O{' '}
            <strong>SELinux</strong> é <strong>MAC</strong> — <em>Mandatory Access Control</em>:
            uma política global, escrita por administradores e aplicada pelo kernel, decide o que
            cada <em>processo</em> pode tocar — <strong>independentemente</strong> do usuário, até
            mesmo do root.
          </p>
          <InfoBox title="SELinux vs AppArmor — irmãos rivais">
            Ambos são módulos LSM (Linux Security Modules) que implementam MAC, mas com filosofias
            opostas. O <strong>AppArmor</strong> (Ubuntu/SUSE) confina por <em>caminho</em> de
            arquivo — perfis simples e legíveis em <code>/etc/apparmor.d/</code>. O{' '}
            <strong>SELinux</strong> (RHEL/Fedora/CentOS) confina por <em>label</em> (contexto)
            embutido no inode — política bem mais granular e bem mais complexa. Os dois <strong>não
            convivem</strong> no mesmo kernel ativo: só um LSM domina por vez.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Modos — Enforcing, Permissive, Disabled</h2>
          <p className="text-text-2 mb-4">
            O SELinux opera em um de três modos. Em produção, o alvo é sempre{' '}
            <strong>Enforcing</strong>; <strong>Permissive</strong> é para diagnóstico (loga as
            negações sem bloquear); <strong>Disabled</strong> desativa o módulo (exige reboot e é
            desencorajado).
          </p>
          <CodeBlock lang="bash" code={`# Modo atual
getenforce                        # Enforcing | Permissive | Disabled

# Visão completa
sestatus

# Trocar em tempo de execução (não persiste no reboot)
sudo setenforce 0                 # vai para Permissive — útil para depurar
sudo setenforce 1                 # volta para Enforcing

# Persistir entre reboots — editar a configuração
sudo vi /etc/selinux/config
# SELINUX=enforcing   (recomendado)
# SELINUX=permissive  (debug)
# SELINUX=disabled    (evite)`} />
          <WarnBox title="Nunca dê setenforce 0 'temporário' em produção">
            O atalho clássico para &quot;desbloquear o serviço&quot; é <code>setenforce 0</code> —
            e ele <em>some</em> no próximo reboot, então parece inofensivo. Mas enquanto está em
            Permissive, todas as negações que existiam viram avisos ignorados, atacantes ganham
            terreno e a equipe se acostuma a rodar sem MAC. O caminho certo é{' '}
            <strong>diagnosticar a AVC, ajustar contexto/booleano/política</strong> — e manter
            Enforcing.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Anatomia de um contexto SELinux</h2>
          <p className="text-text-2 mb-4">
            Todo objeto (arquivo, processo, porta, socket) carrega um <strong>contexto</strong>
            de 4 campos: <code>user_u:role_r:type_t:level</code>. A decisão real é tomada quase
            sempre sobre o <strong>type</strong> — o resto importa em política multi-nível (MLS).
          </p>
          <CodeBlock lang="bash" code={`# Contexto de um arquivo
ls -lZ /var/www/html/index.html
# -rw-r--r--. root root unconfined_u:object_r:httpd_sys_content_t:s0  index.html
#             ^user      ^role       ^type                    ^level

# Contexto dos processos
ps -eZ | grep nginx
# system_u:system_r:httpd_t:s0  1234  nginx: master process

# Contexto de portas
sudo semanage port -l | grep http_port_t
# http_port_t   tcp  80, 81, 443, 488, 8008, 8009, 8443, 9000`} />
          <p className="text-text-2 my-4">
            A política diz coisas como: &quot;processo do tipo <code>httpd_t</code> pode ler
            arquivos do tipo <code>httpd_sys_content_t</code> e escutar em portas do tipo{' '}
            <code>http_port_t</code>&quot;. Se um arquivo servido pelo Nginx estiver com o tipo
            errado, ou a porta estiver fora da lista, o kernel nega — e gera uma AVC.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Booleans — interruptores prontos</h2>
          <p className="text-text-2 mb-4">
            <strong>Booleans</strong> são chaves on/off que ajustam a política sem precisar
            recompilar nada. São o atalho oficial para cenários comuns (&quot;deixe o Apache
            conectar em rede&quot;, &quot;deixe usuários terem diretórios web&quot;, etc.).
          </p>
          <CodeBlock lang="bash" code={`# Listar todos os booleanos (são centenas)
getsebool -a | head

# Filtrar pelos relevantes
getsebool -a | grep httpd

# Ligar um boolean em tempo de execução
sudo setsebool httpd_can_network_connect on

# -P torna a mudança PERSISTENTE entre reboots
sudo setsebool -P httpd_can_network_connect on

# Descrição de um boolean
sudo semanage boolean -l | grep httpd_can_network_connect`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Diagnosticando AVC com ausearch / audit2allow</h2>
          <p className="text-text-2 mb-4">
            Quando o SELinux nega algo, ele grava uma mensagem <strong>AVC</strong> (Access Vector
            Cache) em <code>/var/log/audit/audit.log</code>. Esse log é a fonte de verdade para
            descobrir <em>o que</em> foi negado, <em>de quem</em> para <em>quem</em>.
          </p>
          <CodeBlock lang="bash" code={`# Últimas negações de hoje
sudo ausearch -m AVC,USER_AVC -ts today

# Por processo específico
sudo ausearch -m AVC -c nginx -ts recent

# Gerar uma política customizada a partir das negações recentes
sudo ausearch -m AVC -ts recent | audit2allow -m meunginx
# (revise antes de aplicar — audit2allow é um RASCUNHO)

# Compilar e aplicar
sudo ausearch -m AVC -ts recent | audit2allow -M meunginx
sudo semodule -i meunginx.pp

# Listar módulos de política instalados
sudo semodule -l | grep meunginx`} />
          <WarnBox title="audit2allow não é mágica — revise sempre">
            O <code>audit2allow</code> apenas <em>traduz</em> as negações que apareceram em regras
            <em>allow</em>. Se o que foi negado era um <strong>ataque legítimo bloqueado</strong>,
            aplicar cegamente vai abrir o buraco. Sempre leia o <code>.te</code> gerado antes do{' '}
            <code>semodule -i</code> — e prefira <em>ajustar contexto</em> ou <em>ligar um
            boolean</em> quando o problema for de classificação, não de regra faltando.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Caso real — Nginx servindo /srv/www</h2>
          <p className="text-text-2 mb-4">
            Cenário clássico: você muda a raiz do Nginx do default <code>/var/www/html</code> para
            <code> /srv/www</code> — e em RHEL/Fedora o site dá <strong>403</strong>. O Nginx está
            de pé, o arquivo existe, as permissões Unix estão certas. Quem nega é o SELinux: o
            tipo dos novos arquivos é <code>var_t</code>, não <code>httpd_sys_content_t</code>.
          </p>
          <CodeBlock lang="bash" code={`# 1) Confirme a negação no audit log
sudo ausearch -m AVC -c nginx -ts recent
# type=AVC ... avc:  denied  { read } for  pid=... comm="nginx"
#   name="index.html" ... scontext=...:httpd_t ... tcontext=...:var_t ...

# 2) Veja o tipo atual dos arquivos
ls -lZ /srv/www/index.html
# ... unconfined_u:object_r:var_t:s0 ...   <-- tipo errado

# 3) PERMANENTE — registre o novo padrão de contexto para /srv/www
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?"

# 4) Aplique o contexto recém-cadastrado aos arquivos já existentes
sudo restorecon -Rv /srv/www

# 5) Confirme — agora o tipo é httpd_sys_content_t
ls -lZ /srv/www/index.html

# (Atalho temporário, não-persistente: chcon -t httpd_sys_content_t /srv/www/index.html)`} />
          <InfoBox title="chcon vs semanage fcontext — temporário vs definitivo">
            O <code>chcon</code> muda o contexto <em>agora</em>, mas o próximo{' '}
            <code>restorecon</code> ou recriação do arquivo volta ao padrão da política — porque o
            padrão não foi alterado. O <code>semanage fcontext -a</code> grava a regra na base de
            política do SELinux; o <code>restorecon</code> apenas aplica essa regra. Use{' '}
            <strong>chcon</strong> para testar; <strong>semanage fcontext + restorecon</strong>{' '}
            para resolver de verdade.
          </InfoBox>

          <WindowsComparisonBox
            windowsLabel="Windows (Mandatory Integrity Control)"
            linuxLabel="Linux (SELinux / AppArmor)"
            windowsCode={`# Windows MIC — Mandatory Integrity Control
# - Níveis de integridade: Low / Medium / High / System
# - Atribuídos a processos e objetos (arquivos, registro)
# - Processo Low NÃO escreve em objeto Medium
# - UAC e o sandbox do Edge/IE usam MIC
icacls arquivo.txt /setintegritylevel L
whoami /groups | findstr Mandatory
# AppLocker / WDAC complementam (controle do que executa)`}
            linuxCode={`# SELinux — MAC por LABEL (RHEL/Fedora)
ls -lZ /var/www/html                    # contexto user:role:type:level
sudo getsebool -a | grep httpd
sudo setsebool -P httpd_can_network_connect on
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?"
sudo restorecon -Rv /srv/www
sudo ausearch -m AVC -ts recent | audit2allow -M minha_pol

# AppArmor — MAC por CAMINHO (Ubuntu/SUSE)
sudo aa-status
sudo aa-complain /etc/apparmor.d/usr.sbin.nginx`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['selinux-configurado']} onChange={e => updateChecklist('selinux-configurado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['selinux-configurado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 — LUKS ── */}
        {isActive('luks') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Por que criptografar o disco</h2>
          <p className="text-text-2 mb-4">
            Permissões Unix e SELinux protegem dados <em>enquanto o sistema está ligado</em>. Tire
            o disco da máquina, plugue em outra, e as permissões viram fumaça — o kernel novo lê
            os bytes diretamente. Os cenários onde isso importa são bem reais: laptop roubado,
            HD descartado sem wipe, VPS desativada com a imagem ainda no painel do provedor,
            backup físico perdido na entrega. <strong>Criptografia de disco em repouso</strong>{' '}
            transforma todo esse risco em &quot;ruído indecifrável&quot; — sem a passphrase, o
            disco não diz nada.
          </p>
          <p className="text-text-2 mb-4">
            Em Linux a stack padrão é <strong>dm-crypt</strong> (camada do kernel que cifra e
            decifra blocos no voo) com o formato <strong>LUKS</strong> (Linux Unified Key Setup)
            por cima — LUKS guarda o <em>header</em> com até 8 <em>key slots</em>, metadados
            (cipher, hash, KDF) e a chave mestra cifrada por cada passphrase.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Ciclo de vida de um volume LUKS</h2>
          <FluxoCard
            title="Da partição bruta ao filesystem montado"
            steps={[
              { label: 'Disco bruto',  sub: '/dev/sdb1 — bytes aleatórios ainda',  icon: <HardDrive size={14}/>, color: 'border-text-3/50' },
              { label: 'luksFormat',   sub: 'cria header + 1 key slot',            icon: <KeyRound size={14}/>,  color: 'border-warn/50' },
              { label: 'header + slots', sub: 'metadados LUKS no início do disco', icon: <Lock size={14}/>,      color: 'border-info/50' },
              { label: 'luksOpen',     sub: '/dev/mapper/cofre virtual',           icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
              { label: 'mkfs + mount', sub: 'filesystem normal por cima',          icon: <CheckCircle size={14}/>, color: 'border-ok/50' },
            ]}
          />
          <CodeBlock lang="bash" code={`# Pré-requisito
sudo apt install -y cryptsetup

# 1) Formatar a partição como LUKS — DESTRUTIVO!
sudo cryptsetup luksFormat /dev/sdb1
#   digita YES (em maiúsculo) e escolhe a passphrase

# 2) Abrir o volume — vira /dev/mapper/cofre
sudo cryptsetup luksOpen /dev/sdb1 cofre

# 3) Criar o filesystem POR CIMA do mapper, não da partição
sudo mkfs.ext4 /dev/mapper/cofre

# 4) Montar e usar normalmente
sudo mkdir -p /mnt/cofre
sudo mount /dev/mapper/cofre /mnt/cofre

# 5) Ao desligar — fechar para "lacrar" novamente
sudo umount /mnt/cofre
sudo cryptsetup luksClose cofre

# Conferir o estado e o header
sudo cryptsetup status cofre
sudo cryptsetup luksDump /dev/sdb1`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. O header — backup obrigatório</h2>
          <WarnBox title="Perdeu o header LUKS? Perdeu o disco.">
            O header guarda a <strong>chave mestra cifrada</strong> — sem ele, nem a passphrase
            certa abre o volume. Corrupção dos primeiros megabytes (gravação acidental, partição
            sobrescrita, falha de SSD) inutiliza o disco para sempre. <strong>Faça backup do
            header</strong> logo após criar o volume e guarde fora dele.
          </WarnBox>
          <CodeBlock lang="bash" code={`# Backup do header LUKS (poucos KB)
sudo cryptsetup luksHeaderBackup /dev/sdb1 \\
  --header-backup-file ~/cofre-luks-header.img

# Guarde em local SEGURO e FORA do próprio disco:
gpg -c ~/cofre-luks-header.img            # cifre o backup com uma 2ª senha
# copie cofre-luks-header.img.gpg para outra máquina / pendrive

# Em emergência — restaurar
sudo cryptsetup luksHeaderRestore /dev/sdb1 \\
  --header-backup-file cofre-luks-header.img`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Key slots — rotação de passphrase</h2>
          <p className="text-text-2 mb-4">
            O LUKS tem até <strong>8 slots</strong>: cada slot guarda uma cópia da chave mestra
            cifrada por uma passphrase (ou keyfile) diferente. Você adiciona uma nova senha,
            confirma que funciona, e só então remove a antiga — rotação <em>sem</em> reformatar.
          </p>
          <CodeBlock lang="bash" code={`# Adicionar uma 2ª passphrase (preenche o próximo slot livre)
sudo cryptsetup luksAddKey /dev/sdb1

# Confirmar — agora o luksDump mostra 2 slots ATIVOS
sudo cryptsetup luksDump /dev/sdb1 | grep -E '^Key Slot'

# Testar a nova senha
sudo cryptsetup luksOpen --test-passphrase /dev/sdb1

# OK? Remova a antiga
sudo cryptsetup luksRemoveKey /dev/sdb1
#   digita a senha antiga — o slot dela é zerado

# Adicionar um KEYFILE (em vez de passphrase) — útil para automação
sudo dd if=/dev/urandom of=/root/cofre.key bs=512 count=8
sudo chmod 600 /root/cofre.key
sudo cryptsetup luksAddKey /dev/sdb1 /root/cofre.key`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. Montagem no boot — crypttab + fstab</h2>
          <p className="text-text-2 mb-4">
            Para o sistema abrir o LUKS sozinho a cada boot, você combina dois arquivos:{' '}
            <code>/etc/crypttab</code> diz <em>como destrancar</em> (mapper, dispositivo, fonte
            da chave); <code>/etc/fstab</code> diz <em>onde montar</em> o mapper já aberto.
          </p>
          <CodeBlock lang="text" title="/etc/crypttab" code={`# name      source-device                              keyfile         options
cofre       UUID=11111111-2222-3333-4444-555555555555  none            luks
# 'none' faz o systemd pedir a passphrase no boot.
# Para destrancar automaticamente com keyfile (cuidado!):
# dados     UUID=...                                   /root/cofre.key luks`} />
          <CodeBlock lang="text" title="/etc/fstab" code={`# já como /dev/mapper/<name>
/dev/mapper/cofre  /mnt/cofre  ext4  defaults  0  2`} />
          <InfoBox title="FDE remota? dropbear-initramfs">
            Em VPS / servidores sem console física, criptografar o disco raiz parece impossível:
            quem digita a senha no boot? A resposta clássica é o <strong>dropbear-initramfs</strong>{' '}
            — um servidor SSH minúsculo embutido na initramfs. O servidor sobe, expõe SSH numa
            porta, você conecta de longe com uma chave dedicada, digita a passphrase do LUKS e o
            boot prossegue. Combina lindamente com root LVM em cima de LUKS{' '}
            (<code>pvcreate /dev/mapper/cofre</code> → VG → LVs).
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. LUKS + LVM — empilhamento clássico</h2>
          <p className="text-text-2 mb-4">
            A receita mais comum em produção é <strong>LUKS embaixo, LVM em cima</strong>: cifra
            a partição inteira uma vez só, e depois fatia em vários LVs (raiz, /home, swap)
            dentro do volume cifrado. Vantagem: uma única passphrase destranca o conjunto, e o
            LVM continua flexível por dentro (resize, snapshot).
          </p>
          <CodeBlock lang="bash" code={`# 1) LUKS na partição
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen   /dev/sdb1 cripto

# 2) LVM EM CIMA do mapper, não da partição
sudo pvcreate /dev/mapper/cripto
sudo vgcreate vg_dados /dev/mapper/cripto
sudo lvcreate -L 20G -n lv_home    vg_dados
sudo lvcreate -L  4G -n lv_swap    vg_dados
sudo lvcreate -l 100%FREE -n lv_data vg_dados

# 3) Filesystems nos LVs
sudo mkfs.ext4 /dev/vg_dados/lv_home
sudo mkfs.ext4 /dev/vg_dados/lv_data
sudo mkswap    /dev/vg_dados/lv_swap`} />
          <p className="text-text-2 mt-3">
            Veja o módulo{' '}
            <Link href="/lvm-raid" className="text-accent hover:underline">LVM / RAID</Link>{' '}
            para o lado LVM dessa pilha (PVs, VGs, LVs, snapshots).
          </p>

          <WindowsComparisonBox
            windowsLabel="Windows (BitLocker)"
            linuxLabel="Linux (LUKS / dm-crypt)"
            windowsCode={`# BitLocker — FDE nativo do Windows
# Liga AES-XTS via TPM (sela a chave no chip)
manage-bde -on  C: -RecoveryPassword
manage-bde -status C:
manage-bde -off C:

# BitLocker To Go (mídia removível)
# Recovery key obrigatória — guarde fora da máquina
# Chave mestra → TPM (ou senha + USB), com slot de recuperação`}
            linuxCode={`# LUKS — equivalente open source
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen   /dev/sdb1 cofre
sudo cryptsetup luksDump   /dev/sdb1     # ver slots e cipher
sudo cryptsetup luksAddKey /dev/sdb1     # rotação de senha

# Backup do header (equivalente da recovery key)
sudo cryptsetup luksHeaderBackup /dev/sdb1 \\
  --header-backup-file cofre-header.img`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['luks-criado']} onChange={e => updateChecklist('luks-criado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['luks-criado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 — auditd ── */}
        {isActive('auditd') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. journalctl e iptables LOG não bastam</h2>
          <p className="text-text-2 mb-4">
            O <code>journalctl</code> mostra <em>o que os serviços decidiram contar</em>; o{' '}
            <Link href="/audit-logs" className="text-accent hover:underline">iptables LOG</Link>{' '}
            mostra o que passou pelo firewall. Nenhum dos dois responde:{' '}
            <em>&quot;quem executou <code>/bin/passwd</code> às 03:14?&quot;</em>,{' '}
            <em>&quot;quem leu <code>/etc/shadow</code> ontem?&quot;</em>,{' '}
            <em>&quot;qual processo alterou <code>/etc/sudoers</code>?&quot;</em>. Para isso existe
            o <strong>auditd</strong>: ele engata diretamente no <strong>subsistema de audit do
            kernel</strong> e registra eventos de <em>syscalls</em> e <em>watches</em> em
            arquivos sensíveis.
          </p>
          <p className="text-text-2 mb-4">
            Importante separar do <Link href="/audit-logs" className="text-accent hover:underline">{' '}
            módulo /audit-logs</Link> do curso: aquele cobre <em>logs do firewall</em> (prefixos
            iptables + journald). Este é o <strong>audit do kernel</strong> — outra camada,
            complementar.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">14. Arquitetura — kernel + auditd + plugins</h2>
          <FluxoCard
            title="O caminho de um evento"
            steps={[
              { label: 'syscall',      sub: 'execve / open / unlink ...',          icon: <FileSearch size={14}/>, color: 'border-text-3/50' },
              { label: 'kernel audit', sub: 'filtra pelas regras carregadas',      icon: <ShieldCheck size={14}/>, color: 'border-info/50' },
              { label: 'auditd',       sub: 'daemon em userspace',                 icon: <Eye size={14}/>,         color: 'border-accent/50' },
              { label: 'audit.log',    sub: '/var/log/audit/audit.log',            icon: <CheckCircle size={14}/>, color: 'border-ok/50' },
              { label: 'audispd → SIEM', sub: 'rsyslog → ELK / Loki opcional',     icon: <AlertOctagon size={14}/>,color: 'border-warn/50' },
            ]}
          />
          <CodeBlock lang="bash" code={`# Instalar a stack
sudo apt install -y auditd audispd-plugins

# Habilitar e subir
sudo systemctl enable --now auditd

# Estado do daemon e contadores
sudo systemctl status auditd
sudo auditctl -s`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">15. Tipos de regra</h2>
          <p className="text-text-2 mb-4">
            Há três famílias de regras no audit:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Control</strong> — configuram o próprio daemon (<code>-D</code> apaga tudo, <code>-b</code> tamanho do buffer, <code>-e 2</code> trava regras até o reboot).</li>
            <li><strong>File watch</strong> — observam um caminho. <code>-w /etc/shadow -p wa -k passwd</code>: vigia <em>writes</em> e <em>attribute changes</em>, etiqueta com a chave <code>passwd</code>.</li>
            <li><strong>Syscall</strong> — capturam chamadas ao kernel. <code>-a always,exit -F arch=b64 -S execve -k exec</code>: registra todo <code>execve</code> em 64 bits, etiqueta <code>exec</code>.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Regras em tempo de execução (não persistem!)
sudo auditctl -w /etc/shadow  -p wa -k passwd
sudo auditctl -w /etc/sudoers -p wa -k sudoers
sudo auditctl -a always,exit -F arch=b64 -S execve -k exec

# Listar as regras carregadas
sudo auditctl -l

# Apagar TODAS as regras em runtime
sudo auditctl -D`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">16. Persistir em /etc/audit/rules.d</h2>
          <p className="text-text-2 mb-4">
            Regras de <code>auditctl</code> somem no reboot. Para persistir, coloque-as em{' '}
            <code>/etc/audit/rules.d/*.rules</code> — o <code>augenrules</code> compila todos os
            arquivos da pasta em <code>/etc/audit/audit.rules</code>, que o auditd carrega no boot.
          </p>
          <CodeBlock lang="text" title="/etc/audit/rules.d/10-hardening.rules" code={`# Arquivos de identidade — qualquer alteração
-w /etc/passwd  -p wa -k identidade
-w /etc/shadow  -p wa -k identidade
-w /etc/group   -p wa -k identidade
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# Configuração do SSH
-w /etc/ssh/sshd_config -p wa -k sshd

# Toda execução de binário em 64 bits
-a always,exit -F arch=b64 -S execve -k exec

# Mudanças de propriedade e permissão em qualquer lugar
-a always,exit -F arch=b64 -S chown,fchown,fchownat -F auid>=1000 -F auid!=4294967295 -k perm
-a always,exit -F arch=b64 -S chmod,fchmod,fchmodat -F auid>=1000 -F auid!=4294967295 -k perm

# Travar as regras até o próximo reboot (último item, opcional)
# -e 2`} />
          <CodeBlock lang="bash" code={`# Compilar todas as regras de /etc/audit/rules.d em audit.rules e recarregar
sudo augenrules --load

# Conferir
sudo auditctl -l | wc -l
sudo auditctl -s`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">17. Consultando o audit.log</h2>
          <p className="text-text-2 mb-4">
            O <code>/var/log/audit/audit.log</code> é volumoso e nada amigável a olho nu. As
            ferramentas certas são <code>ausearch</code> (busca filtrada) e <code>aureport</code>{' '}
            (resumos agregados).
          </p>
          <CodeBlock lang="bash" code={`# Tudo que tocou em /etc/shadow hoje (a chave que demos foi 'passwd')
sudo ausearch -k passwd -ts today

# Tudo que foi executado pelo usuário UID 1000 nas últimas 24h
sudo ausearch -k exec -ui 1000 -ts recent

# Por intervalo de tempo absoluto
sudo ausearch -ts 2026-05-19 08:00:00 -te 2026-05-19 18:00:00 -k sshd

# Relatório de autenticações (sucesso / falha)
sudo aureport -au --summary

# Top de syscalls auditadas
sudo aureport -s --summary

# Quem rodou o quê (relatório de exec)
sudo aureport -x --summary`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">18. Rotação e integração SIEM</h2>
          <p className="text-text-2 mb-4">
            Auditoria sem rotação enche o disco e derruba o serviço. O próprio auditd cuida
            disso via <code>/etc/audit/auditd.conf</code>:
          </p>
          <CodeBlock lang="text" title="/etc/audit/auditd.conf (trechos)" code={`max_log_file       = 50          # tamanho máximo de cada arquivo (MB)
num_logs           = 10          # quantos arquivos rotacionados manter
max_log_file_action = ROTATE     # ROTATE | KEEP_LOGS | SUSPEND
space_left         = 200         # MB livres antes do alerta
space_left_action  = SYSLOG      # avisa via syslog
admin_space_left   = 50          # MB livres antes da emergência
admin_space_left_action = SUSPEND  # para de auditar (ou HALT em ambientes paranoicos)`} />
          <p className="text-text-2 my-4">
            Para mandar tudo a um SIEM central, ative o plugin <code>audisp-syslog</code> e
            deixe o <Link href="/rsyslog" className="text-accent hover:underline">rsyslog</Link>{' '}
            (ou um pipeline com Loki/ELK) levar os eventos adiante:
          </p>
          <CodeBlock lang="bash" code={`# Habilitar o plugin que despeja o audit no syslog
sudo sed -i 's/^active = no/active = yes/' /etc/audit/plugins.d/syslog.conf

# Reiniciar o auditd para o plugin pegar
sudo systemctl restart auditd

# Eventos passam a aparecer no journalctl (e podem ir para um servidor rsyslog remoto)
sudo journalctl -t audispd-syslog -f`} />

          <WindowsComparisonBox
            windowsLabel="Windows (Event Log + Sysmon)"
            linuxLabel="Linux (auditd)"
            windowsCode={`# Audit Policy do Windows
auditpol /get /category:*
auditpol /set /subcategory:"Process Creation" /success:enable

# Event Viewer — Security log = quem entrou, quem rodou o quê
# Sysmon (Sysinternals) — telemetria detalhada de processos,
# rede e drivers; XML de config; integra com SIEM
sysmon -accepteula -i sysmon-config.xml
Get-WinEvent -LogName Security -MaxEvents 50`}
            linuxCode={`# auditd — equivalente open source
sudo apt install -y auditd audispd-plugins
sudo auditctl -w /etc/shadow  -p wa -k passwd
sudo auditctl -a always,exit -F arch=b64 -S execve -k exec
sudo ausearch -k passwd -ts today
sudo aureport -au --summary

# Persistir em /etc/audit/rules.d/*.rules + augenrules --load
# Encaminhar via audisp-syslog para um SIEM (ELK / Loki / Splunk)`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['auditd-regras']} onChange={e => updateChecklist('auditd-regras', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['auditd-regras'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Rodar setenforce 0 em produção e esquecer', sol: 'Permissive parece inofensivo (volta no reboot) mas mata o MAC enquanto está ativo, esconde negações reais e a equipe se acostuma a operar sem proteção. Diagnostique a AVC com ausearch -m AVC, ajuste contexto/boolean/política e mantenha Enforcing.' },
              { erro: 'Perder o header LUKS — sem backup, dados inacessíveis', sol: 'O header guarda a chave mestra cifrada por todas as passphrases. Corrupção dos primeiros KB do disco = volume morto, mesmo com a senha certa. Sempre rode cryptsetup luksHeaderBackup logo após criar o volume e guarde o .img cifrado fora do próprio disco.' },
              { erro: 'auditd lota /var/log/audit sem rotação configurada', sol: 'Sem ajustar max_log_file, num_logs e max_log_file_action em /etc/audit/auditd.conf, o disco enche e o admin_space_left_action pode chegar a SUSPEND ou HALT — derrubando o servidor. Configure rotação e monitoração de espaço livre antes de habilitar regras pesadas como -S execve.' },
              { erro: 'Tentar usar AppArmor e SELinux ao mesmo tempo', sol: 'Os dois são módulos LSM, mas apenas UM domina o kernel por vez. Em Ubuntu, AppArmor já vem ativo; tentar habilitar SELinux por cima causa boot quebrado ou políticas silenciosamente ignoradas. Escolha o LSM por distribuição: RHEL/Fedora → SELinux; Ubuntu/SUSE → AppArmor.' },
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
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Diagnosticar e corrigir uma AVC do SELinux</p>
              <p className="text-sm text-text-2 mb-3">
                Numa VM Fedora/Rocky, mude a raiz do Nginx de <code>/var/www/html</code> para
                <code> /srv/www</code> e reproduza o <strong>403</strong>. Localize a AVC com{' '}
                <code>ausearch -m AVC</code>, identifique o tipo errado (<code>var_t</code> em vez
                de <code>httpd_sys_content_t</code>), corrija com{' '}
                <code>semanage fcontext -a -t httpd_sys_content_t &quot;/srv/www(/.*)?&quot;</code>{' '}
                e <code>restorecon -Rv /srv/www</code>. Mantenha o SELinux em Enforcing o tempo todo.
              </p>
              <CodeBlock lang="bash" code={`getenforce                                    # deve dizer Enforcing
sudo ausearch -m AVC -c nginx -ts recent      # encontre a negação
ls -lZ /srv/www                               # confirme o tipo errado
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?"
sudo restorecon -Rv /srv/www
curl -I http://localhost/                     # 200, agora`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Cofre LUKS com rotação de senha e backup do header</p>
              <p className="text-sm text-text-2 mb-3">
                Em uma partição/loopback de teste, crie um volume LUKS, formate ext4 por cima do
                mapper, monte, escreva um arquivo, desmonte e <code>luksClose</code>. Adicione uma
                2ª passphrase com <code>luksAddKey</code>, confirme com{' '}
                <code>luksDump</code> que há dois slots ativos, faça <strong>backup do header</strong>{' '}
                com <code>luksHeaderBackup</code> e remova a passphrase original com{' '}
                <code>luksRemoveKey</code>.
              </p>
              <CodeBlock lang="bash" code={`# Crie um arquivo de 200 MB e use como disco simulado
dd if=/dev/zero of=/tmp/cofre.img bs=1M count=200
sudo losetup /dev/loop0 /tmp/cofre.img

sudo cryptsetup luksFormat /dev/loop0
sudo cryptsetup luksOpen   /dev/loop0 cofre
sudo mkfs.ext4 /dev/mapper/cofre
sudo mount /dev/mapper/cofre /mnt
echo "segredo" | sudo tee /mnt/segredo.txt
sudo umount /mnt
sudo cryptsetup luksClose cofre

# Rotação + backup do header
sudo cryptsetup luksAddKey       /dev/loop0
sudo cryptsetup luksDump         /dev/loop0 | grep '^Key Slot'
sudo cryptsetup luksHeaderBackup /dev/loop0 --header-backup-file ~/cofre-header.img
sudo cryptsetup luksRemoveKey    /dev/loop0`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — auditd vigiando arquivos críticos e exec</p>
              <p className="text-sm text-text-2 mb-3">
                Instale o <code>auditd</code>, escreva um arquivo de regras em{' '}
                <code>/etc/audit/rules.d/99-lab.rules</code> que vigie <code>/etc/shadow</code>,{' '}
                <code>/etc/sudoers</code> e <code>execve</code>. Aplique com{' '}
                <code>augenrules --load</code>, dispare eventos (mude uma senha, rode binários
                comuns) e consulte com <code>ausearch -k</code> e <code>aureport</code>.
              </p>
              <CodeBlock lang="bash" code={`sudo apt install -y auditd audispd-plugins
sudo systemctl enable --now auditd

# Regras persistentes
sudo tee /etc/audit/rules.d/99-lab.rules > /dev/null <<'EOF'
-w /etc/shadow  -p wa -k passwd
-w /etc/sudoers -p wa -k sudoers
-a always,exit -F arch=b64 -S execve -k exec
EOF

sudo augenrules --load
sudo auditctl -l                            # confirme as 3 regras

# Gere eventos
sudo passwd $USER                           # toca em /etc/shadow
ls -la /tmp                                 # gera execve

# Consulte
sudo ausearch -k passwd  -ts today
sudo ausearch -k exec    -ts recent | head
sudo aureport -au --summary`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/seguranca-avancada" />

      </div>
    </main>
  );
}
