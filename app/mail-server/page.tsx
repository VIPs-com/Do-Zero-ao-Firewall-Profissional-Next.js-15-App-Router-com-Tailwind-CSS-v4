'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Send, Server, Inbox, ShieldCheck, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint MAIL-SERVER — Servidor de E-mail (Postfix + Dovecot).
   Conteúdo didático alinhado a LPIC-2 / CompTIA Linux+. */

type MailTab = 'postfix' | 'dovecot' | 'antispam';

const CHECKLIST_ITEMS = [
  { id: 'mail-postfix', label: 'Instalei o Postfix, ajustei o main.cf e testei o envio na porta 25/587 com swaks' },
  { id: 'mail-dovecot', label: 'Instalei o Dovecot, configurei IMAP/IMAPS e li a caixa Maildir num cliente (Thunderbird)' },
  { id: 'mail-antispam', label: 'Publiquei SPF + DKIM + DMARC e adicionei filtro anti-spam + jail Fail2ban' },
];

export default function MailServerPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<MailTab>('postfix');

  useEffect(() => {
    trackPageVisit('/mail-server');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-mail-server min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Servidor de E-mail</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo · Servidores e Serviços</div>
          <h1 className="text-4xl font-bold mb-4">📬 Servidor de E-mail (Postfix + Dovecot)</h1>
          <p className="text-text-2 text-lg mb-6">
            E-mail é a infraestrutura mais antiga e ainda mais usada da internet. Um servidor
            de e-mail completo tem duas metades: o <strong>Postfix</strong> (MTA — envia e
            recebe mensagens via SMTP) e o <strong>Dovecot</strong> (MDA/IMAP — entrega a caixa
            do usuário). Aqui você monta os dois e — o que separa o servidor amador do
            profissional — configura <strong>SPF, DKIM e DMARC</strong> para não cair em spam.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo didático alinhado aos objetivos LPIC-2 e CompTIA Linux+.
          </p>
        </div>

        <FluxoCard
          title="O caminho de uma mensagem — do remetente à caixa do usuário"
          steps={[
            { label: 'Remetente', sub: 'cliente envia via SMTP submission', icon: <Send size={14}/>, color: 'border-accent/50' },
            { label: 'DNS / MX', sub: 'descobre o servidor do destino', icon: <Server size={14}/>, color: 'border-info/50' },
            { label: 'Postfix :25', sub: 'MTA recebe e grava na Maildir', icon: <Server size={14}/>, color: 'border-warn/50' },
            { label: 'Dovecot', sub: 'IMAP/POP3 entrega ao usuário', icon: <Inbox size={14}/>, color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'postfix',  label: '📧 Postfix (MTA)' },
              { id: 'dovecot',  label: '📥 Dovecot (IMAP/POP3)' },
              { id: 'antispam', label: '🛡️ Anti-spam & Autenticação de Domínio' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MailTab)}
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
        {isActive('postfix') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que é um MTA e o protocolo SMTP</h2>
          <p className="text-text-2 mb-4">
            Um <strong>MTA</strong> (Mail Transfer Agent) é o programa que <em>transporta</em>
            e-mail entre servidores. Ele fala <strong>SMTP</strong> (Simple Mail Transfer
            Protocol) — um protocolo de texto simples: o cliente diz <code>HELO</code>,
            <code>MAIL FROM</code>, <code>RCPT TO</code>, <code>DATA</code> e o servidor
            responde com códigos numéricos (250 ok, 550 rejeitado).
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Porta 25</strong> — comunicação <em>MTA ↔ MTA</em> (servidor para servidor). Sem autenticação; é por aqui que o e-mail do mundo chega até você.</li>
            <li><strong>Porta 587</strong> — <em>submission</em>: o cliente do usuário (Thunderbird, app) entrega mensagens para serem enviadas. Exige <strong>TLS + autenticação</strong>.</li>
            <li><strong>Porta 465</strong> — SMTPS (submission sobre TLS implícito); ainda usada, equivalente moderna do 587.</li>
          </ul>
          <InfoBox title="MTA · MDA · MUA — não confunda">
            <strong>MTA</strong> (Postfix) transporta entre servidores. <strong>MDA</strong>
            (Dovecot, procmail) entrega na caixa local do usuário. <strong>MUA</strong>
            (Thunderbird, Outlook) é o cliente que a pessoa abre para ler. Os três juntos
            formam o sistema de e-mail.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Instalando o Postfix</h2>
          <p className="text-text-2 mb-4">
            Na instalação o Debian/Ubuntu abre um wizard. Escolha <strong>&quot;Internet
            Site&quot;</strong> e informe o nome de domínio do seu servidor.
          </p>
          <CodeBlock lang="bash" code={`# Instalar o Postfix (escolha "Internet Site" no wizard)
sudo apt update
sudo apt install -y postfix mailutils

# Reabrir o wizard depois, se precisar
sudo dpkg-reconfigure postfix

# Conferir que o serviço subiu
sudo systemctl status postfix
ss -tlnp | grep -E ':25|:587'`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. O arquivo main.cf</h2>
          <p className="text-text-2 mb-4">
            Toda a configuração do Postfix vive em <code>/etc/postfix/main.cf</code>. Estes são
            os parâmetros que você precisa conhecer:
          </p>
          <CodeBlock lang="bash" code={`# /etc/postfix/main.cf — parâmetros essenciais

myhostname = mail.exemplo.com.br      # nome FQDN do próprio servidor
mydomain   = exemplo.com.br           # domínio dos e-mails
myorigin   = $mydomain                # domínio que aparece no remetente

# Para QUAIS domínios este servidor aceita entrega final
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

# Redes que podem enviar SEM autenticar (a LAN interna confiável)
mynetworks = 127.0.0.0/8 192.168.1.0/24

# relayhost vazio = entrega direta. Preenchido = manda tudo via smarthost
relayhost =

# Formato Maildir (uma mensagem por arquivo) — combina com o Dovecot
home_mailbox = Maildir/

# TLS para a porta 587 (submission)
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.exemplo.com.br/fullchain.pem
smtpd_tls_key_file  = /etc/letsencrypt/live/mail.exemplo.com.br/privkey.pem
smtpd_tls_security_level = may`} />
          <p className="text-text-2 mt-4 mb-4">
            Para ativar a porta <strong>587</strong> com TLS e autenticação, descomente o bloco
            <code>submission</code> em <code>/etc/postfix/master.cf</code>. Depois de qualquer
            mudança, recarregue:
          </p>
          <CodeBlock lang="bash" code={`# Recarregar a configuração sem derrubar conexões
sudo postfix check          # valida a sintaxe do main.cf
sudo systemctl reload postfix

# Verificar valores efetivos (mostra padrões + suas alterações)
postconf myhostname mydestination mynetworks`} />
          <WarnBox title="Não vire um open relay" className="mt-4">
            Se <code>mynetworks</code> for amplo demais (ex.: <code>0.0.0.0/0</code>) ou
            <code>smtpd_recipient_restrictions</code> aceitar qualquer destino, seu servidor
            envia spam para o mundo todo — e entra em blocklists em horas. Aceite relay só
            da sua rede confiável <em>ou</em> de quem autenticou na porta 587.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. DNS: o registro MX</h2>
          <p className="text-text-2 mb-4">
            Para o mundo descobrir o seu servidor, o domínio precisa de um registro
            <strong> MX</strong> (Mail eXchanger) apontando para o nome do host, e esse nome
            precisa de um registro <strong>A</strong> com o IP. A prioridade menor vence.
          </p>
          <CodeBlock lang="dns" code={`; Zona DNS de exemplo.com.br
exemplo.com.br.        IN  MX   10  mail.exemplo.com.br.
mail.exemplo.com.br.   IN  A        203.0.113.25

; Conferir do lado de fora:
;   dig MX exemplo.com.br +short
;   dig A  mail.exemplo.com.br +short`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Testando o envio e lendo os logs</h2>
          <p className="text-text-2 mb-4">
            O <code>telnet</code> mostra o SMTP cru; o <code>swaks</code> é a ferramenta
            profissional de teste. Os logs ficam em <code>/var/log/mail.log</code>.
          </p>
          <CodeBlock lang="bash" code={`# Conversa SMTP crua (didático) — porta 25
telnet localhost 25
# HELO teste.local
# MAIL FROM:<aluno@exemplo.com.br>
# RCPT TO:<aluno@exemplo.com.br>
# DATA
# Subject: ola
#
# corpo da mensagem
# .
# QUIT

# Teste profissional com swaks (sudo apt install swaks)
swaks --to aluno@exemplo.com.br --server localhost --port 25

# Acompanhar os logs ao vivo
sudo tail -f /var/log/mail.log
# procure por "status=sent" (ok) ou "status=bounced" (rejeitado)

# Ver a fila de mensagens presas
mailq`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['mail-postfix']} onChange={e => updateChecklist('mail-postfix', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['mail-postfix'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('dovecot') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. O que faz o Dovecot</h2>
          <p className="text-text-2 mb-4">
            O Postfix recebe a mensagem e a grava num arquivo. Mas o usuário não loga no
            servidor para ler arquivos — ele usa o Thunderbird no celular. O <strong>Dovecot
            </strong> é o servidor <strong>IMAP/POP3</strong> que entrega essa caixa pela rede,
            de forma autenticada e cifrada.
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>IMAP</strong> — as mensagens ficam <em>no servidor</em>; o cliente é um espelho. Você vê a mesma caixa no celular e no notebook. Padrão moderno.</li>
            <li><strong>POP3</strong> — o cliente <em>baixa e (geralmente) apaga</em> do servidor. Bom para um único dispositivo; ruim para sincronizar vários.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Instalando e configurando o Dovecot</h2>
          <CodeBlock lang="bash" code={`# Pacotes: núcleo + IMAP + POP3
sudo apt install -y dovecot-core dovecot-imapd dovecot-pop3d

# Conferir o serviço e as portas
sudo systemctl status dovecot
ss -tlnp | grep -E ':143|:993|:110|:995'`} />
          <p className="text-text-2 mt-4 mb-4">
            A configuração é dividida em arquivos sob <code>/etc/dovecot/conf.d/</code>:
          </p>
          <CodeBlock lang="bash" code={`# /etc/dovecot/conf.d/10-mail.conf
# Apontar para o MESMO formato que o Postfix usa (Maildir)
mail_location = maildir:~/Maildir

# /etc/dovecot/conf.d/10-auth.conf
disable_plaintext_auth = yes        # senha só sobre TLS
auth_mechanisms = plain login

# /etc/dovecot/conf.d/10-ssl.conf
ssl = required
ssl_cert = </etc/letsencrypt/live/mail.exemplo.com.br/fullchain.pem
ssl_key  = </etc/letsencrypt/live/mail.exemplo.com.br/privkey.pem

# Recarregar
sudo systemctl reload dovecot
sudo doveconf -n        # mostra a config efetiva (só o que mudou do padrão)`} />
          <InfoBox title="Maildir vs mbox" className="mt-4">
            <strong>mbox</strong> guarda a caixa inteira num único arquivo — rápido de criar,
            mas trava sob acesso concorrente e corrompe fácil. <strong>Maildir</strong> usa um
            arquivo por mensagem em diretórios <code>new/</code>, <code>cur/</code>,
            <code>tmp/</code> — robusto, sem lock, e o padrão recomendado. Postfix e Dovecot
            <strong> precisam apontar para o mesmo formato</strong>.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Autenticação: Postfix usando o Dovecot (SASL)</h2>
          <p className="text-text-2 mb-4">
            Para a porta 587 (submission) o Postfix precisa <em>autenticar</em> quem envia. O
            jeito limpo é delegar isso ao Dovecot via <strong>SASL</strong>: o Dovecot já sabe
            validar senhas; o Postfix só pergunta a ele.
          </p>
          <CodeBlock lang="bash" code={`# /etc/dovecot/conf.d/10-master.conf — expor o socket SASL ao Postfix
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}

# /etc/postfix/main.cf — usar o Dovecot como backend de autenticação
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_relay_restrictions = permit_mynetworks,
                           permit_sasl_authenticated,
                           reject_unauth_destination

sudo systemctl reload dovecot postfix`} />
          <p className="text-text-2 mt-4 mb-4">
            No cliente (Thunderbird), a configuração espelha o servidor:
          </p>
          <CodeBlock lang="text" code={`Servidor de ENTRADA (Dovecot)
  Protocolo : IMAP
  Servidor  : mail.exemplo.com.br
  Porta     : 993   (IMAPS — TLS)
  Segurança : SSL/TLS
  Usuário   : aluno@exemplo.com.br

Servidor de SAÍDA (Postfix)
  Servidor  : mail.exemplo.com.br
  Porta     : 587   (submission)
  Segurança : STARTTLS
  Autenticação : Senha normal`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['mail-dovecot']} onChange={e => updateChecklist('mail-dovecot', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['mail-dovecot'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('antispam') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Por que sem SPF/DKIM/DMARC você vira spam</h2>
          <p className="text-text-2 mb-4">
            Gmail, Outlook e Yahoo não confiam em servidores anônimos. Se o seu domínio não
            <em> prova</em> que aquela mensagem é legítima, ela cai direto no spam — ou é
            rejeitada. Os três pilares dessa prova:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
            {[
              { i: '📋', t: 'SPF', d: 'Lista no DNS quais IPs PODEM enviar pelo seu domínio.' },
              { i: '✍️', t: 'DKIM', d: 'Assina cada mensagem com uma chave; o destino verifica no DNS.' },
              { i: '⚖️', t: 'DMARC', d: 'Diz o que fazer quando SPF/DKIM falham, e pede relatórios.' },
            ].map((h, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{h.i}</span> {h.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{h.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. SPF — quem pode enviar</h2>
          <p className="text-text-2 mb-4">
            O <strong>SPF</strong> é um simples registro <strong>TXT</strong> no DNS do
            domínio. Ele declara os IPs/hosts autorizados a enviar e-mail em seu nome.
          </p>
          <CodeBlock lang="dns" code={`; Registro TXT na raiz do domínio
exemplo.com.br.   IN  TXT  "v=spf1 mx a:mail.exemplo.com.br -all"

;  v=spf1                versão
;  mx                    autoriza os hosts do registro MX
;  a:mail.exemplo.com.br autoriza esse host específico
;  -all                  REJEITA qualquer outro (~all = só marca como suspeito)`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. DKIM — assinando com OpenDKIM</h2>
          <p className="text-text-2 mb-4">
            O <strong>DKIM</strong> adiciona uma assinatura criptográfica ao cabeçalho de cada
            mensagem. O <code>opendkim</code> roda como um <em>milter</em> ligado ao Postfix.
          </p>
          <CodeBlock lang="bash" code={`sudo apt install -y opendkim opendkim-tools

# Gerar o par de chaves (selector "mail" para o domínio)
sudo mkdir -p /etc/opendkim/keys/exemplo.com.br
cd /etc/opendkim/keys/exemplo.com.br
sudo opendkim-genkey -s mail -d exemplo.com.br
sudo chown opendkim:opendkim mail.private

# /etc/opendkim.conf — ligar a chave ao domínio
#   Domain      exemplo.com.br
#   Selector    mail
#   KeyFile     /etc/opendkim/keys/exemplo.com.br/mail.private

# /etc/postfix/main.cf — plugar o milter no Postfix
milter_default_action = accept
smtpd_milters = inet:localhost:8891
non_smtpd_milters = inet:localhost:8891

sudo systemctl restart opendkim postfix

# O conteúdo de mail.txt é o registro DNS a publicar:
cat /etc/opendkim/keys/exemplo.com.br/mail.txt`} />
          <CodeBlock lang="dns" code={`; Registro TXT publicado no DNS — selector._domainkey
mail._domainkey.exemplo.com.br.  IN  TXT  ( "v=DKIM1; k=rsa; "
  "p=MIGfMA0GCSqGSIb3DQEBAQUAA4G..." )   ; chave PÚBLICA gerada`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. DMARC — política de alinhamento</h2>
          <p className="text-text-2 mb-4">
            O <strong>DMARC</strong> amarra SPF e DKIM: ele exige que o domínio do
            <code> From:</code> esteja <em>alinhado</em> com o que SPF/DKIM validaram, e diz ao
            destino o que fazer quando isso falha — além de pedir relatórios por e-mail.
          </p>
          <CodeBlock lang="dns" code={`; Registro TXT no subdomínio _dmarc
_dmarc.exemplo.com.br.  IN  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@exemplo.com.br; adkim=s; aspf=s"

;  p=none        só monitora (comece por aqui)
;  p=quarantine  manda para o spam quando falha
;  p=reject      rejeita de vez (meta final)
;  rua=          endereço que recebe os relatórios agregados`} />
          <InfoBox title="Comece com p=none" className="mt-4">
            Subir direto para <code>p=reject</code> pode bloquear e-mail legítimo que você
            esqueceu de autorizar (newsletter, sistema de NF-e). Comece com <code>p=none</code>,
            leia os relatórios <code>rua</code> por algumas semanas, e só então endureça para
            <code> quarantine</code> e <code>reject</code>.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. Filtro de conteúdo e proteção do serviço</h2>
          <p className="text-text-2 mb-4">
            SPF/DKIM/DMARC provam <em>origem</em>. Para barrar o spam que <em>chega</em>, você
            ainda quer um filtro de conteúdo e camadas extras:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>SpamAssassin</strong> — clássico, pontua a mensagem por regras e Bayes; simples de plugar.</li>
            <li><strong>rspamd</strong> — moderno, muito mais rápido, com SPF/DKIM/DMARC, greylisting e UI próprios; recomendado para servidores novos.</li>
            <li><strong>Greylisting</strong> — rejeita temporariamente o 1º contato de um remetente desconhecido; spammers não tentam de novo, MTAs legítimos sim.</li>
            <li><strong>PTR / reverse DNS</strong> — o IP do servidor precisa ter um registro reverso que bata com o <code>myhostname</code>. Sem PTR, muitos destinos rejeitam na cara.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Conferir o reverse DNS (PTR) do seu IP
dig -x 203.0.113.25 +short
# deve retornar: mail.exemplo.com.br.

# Jail do Fail2ban para Postfix + Dovecot
# /etc/fail2ban/jail.local
#   [postfix]
#   enabled  = true
#   port     = smtp,submission
#   logpath  = /var/log/mail.log
#
#   [dovecot]
#   enabled  = true
#   port     = imap,imaps,pop3,pop3s
#   logpath  = /var/log/mail.log

sudo systemctl restart fail2ban
sudo fail2ban-client status dovecot`} />
          <WindowsComparisonBox
            windowsLabel="Windows (Exchange / hMailServer)"
            linuxLabel="Linux (Postfix + Dovecot)"
            windowsCode={`# Microsoft Exchange Server — MTA + caixa + agenda
# tudo num produto pago, integrado ao Active Directory.
# hMailServer — alternativa gratuita para Windows.
# Configuração por GUI; transporte e regras
# via Exchange Management Shell (PowerShell).
Get-ReceiveConnector
Set-TransportConfig`}
            linuxCode={`# Postfix (MTA) + Dovecot (IMAP/POP3) — peças
# separadas, cada uma faz uma coisa bem.
# Tudo em texto, versionável, scriptável.
postconf -n
doveconf -n
# SPF/DKIM/DMARC no DNS + OpenDKIM/rspamd.
# Mesmo padrão SMTP/IMAP — interopera com tudo.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['mail-antispam']} onChange={e => updateChecklist('mail-antispam', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['mail-antispam'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'A porta 25 de saída está bloqueada pelo provedor', sol: 'Quase todo provedor residencial e muitas clouds bloqueiam a porta 25 de saída para conter spam. Use um smarthost (relayhost) autenticado na 587, ou peça liberação à cloud com IP dedicado e PTR.' },
              { erro: 'O servidor virou um open relay', sol: 'mynetworks amplo demais ou falta de reject_unauth_destination fazem o Postfix repassar e-mail de qualquer um. Teste com mxtoolbox; corrija mynetworks e use permit_sasl_authenticated + reject_unauth_destination.' },
              { erro: 'Sem PTR / reverse DNS, tudo cai em spam', sol: 'Se o IP não tem registro reverso batendo com o myhostname, Gmail/Outlook rejeitam ou marcam como spam. O PTR é configurado pelo dono do bloco de IP (provedor/cloud), não na sua zona DNS.' },
              { erro: 'DKIM com selector ou chave errada falha a verificação', sol: 'O selector no cabeçalho da mensagem precisa bater com o registro selector._domainkey no DNS, e a chave pública publicada precisa corresponder à privada usada pelo OpenDKIM. Teste com swaks e leia o cabeçalho Authentication-Results.' },
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
            {[
              {
                n: 'Lab 1', t: 'Postfix local enviando e-mail',
                d: 'Instale o Postfix em modo "Internet Site". Ajuste myhostname, mydomain e mydestination no main.cf. Crie um usuário do sistema, envie uma mensagem para ele com swaks e confirme em /var/log/mail.log a linha status=sent. Verifique o arquivo gerado em ~/Maildir/new/.',
                icon: <Server size={16}/>,
              },
              {
                n: 'Lab 2', t: 'Dovecot entregando a caixa via IMAP',
                d: 'Instale dovecot-core e dovecot-imapd, aponte mail_location para ~/Maildir e ative ssl = required. Configure o SASL para o Postfix usar o Dovecot na porta 587. Conecte um Thunderbird (IMAPS 993 entrada, submission 587 saída) e leia a mensagem do Lab 1.',
                icon: <Inbox size={16}/>,
              },
              {
                n: 'Lab 3', t: 'Autenticando o domínio com SPF/DKIM/DMARC',
                d: 'Publique um registro TXT de SPF (v=spf1 mx -all). Instale o opendkim, gere o par de chaves, plugue o milter no Postfix e publique a chave pública em mail._domainkey. Adicione um TXT de DMARC com p=none. Envie um e-mail para uma conta Gmail e inspecione o cabeçalho Authentication-Results: spf=pass, dkim=pass, dmarc=pass.',
                icon: <ShieldCheck size={16}/>,
              },
            ].map((lab, i) => (
              <div key={i} className="p-4 rounded-lg bg-bg-2 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent">{lab.icon}</span>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">{lab.n}</span>
                  <span className="font-bold text-text">{lab.t}</span>
                </div>
                <p className="text-sm text-text-2 leading-relaxed">{lab.d}</p>
              </div>
            ))}
          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/mail-server" />

      </div>
    </main>
  );
}
