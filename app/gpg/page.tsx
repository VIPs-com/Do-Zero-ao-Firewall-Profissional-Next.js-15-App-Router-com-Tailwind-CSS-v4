'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { KeyRound, PenLine, Lock, Unlock, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint GPG — OpenPGP / GPG do Zero ao Expert. Conteúdo adaptado do curso
   interno "OpenPGP/GPG do Zero ao Expert" da equipe VIPs-com. */

type GpgTab = 'conceito' | 'cifrar' | 'backup';

const CHECKLIST_ITEMS = [
  { id: 'gpg-chave',  label: 'Gerei minha chave OpenPGP — mestra [C] + subchaves ECC [S][E][A] — e confirmei com gpg -K' },
  { id: 'gpg-cifrar', label: 'Cifrei e decifrei um arquivo, e assinei + verifiquei (incluindo o caso BAD signature)' },
  { id: 'gpg-git',    label: 'Fiz backup das subchaves + certificado de revogação e assinei um commit Git com GPG' },
];

export default function GpgPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<GpgTab>('conceito');

  useEffect(() => {
    trackPageVisit('/gpg');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-gpg min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">OpenPGP / GPG</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Módulo C09 · Segurança & Criptografia</div>
          <h1 className="text-4xl font-bold mb-4">🔑 OpenPGP / GPG</h1>
          <p className="text-text-2 text-lg mb-6">
            Cifrar arquivos, <strong>assinar</strong> e verificar, provar autoria de um commit
            Git, autenticar via SSH — tudo isso é OpenPGP. O <strong>GPG (GnuPG)</strong> é a
            implementação livre. Aqui você sai do zero: cria sua chave, usa, e — o que poucos
            ensinam — aprende a <strong>fazer backup e revogar</strong> direito.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo adaptado do curso interno &quot;OpenPGP/GPG do Zero ao Expert&quot; da equipe.
          </p>
        </div>

        <FluxoCard
          title="Anatomia de uma chave OpenPGP — mestra + subchaves"
          steps={[
            { label: 'Mestra [C]',   sub: 'Certify — a identidade; fica offline/no cofre',  icon: <KeyRound size={14}/>, color: 'border-err/50' },
            { label: 'Sub [S]',      sub: 'Sign — assina arquivos, e-mails, commits',        icon: <PenLine size={14}/>,  color: 'border-accent/50' },
            { label: 'Sub [E]',      sub: 'Encrypt — cifra e decifra dados',                 icon: <Lock size={14}/>,     color: 'border-info/50' },
            { label: 'Sub [A]',      sub: 'Authenticate — autenticação (ex.: SSH via GPG)',  icon: <Unlock size={14}/>,   color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '🔑 Conceito & Primeira Chave' },
              { id: 'cifrar',   label: '🔐 Cifrar, Assinar & Verificar' },
              { id: 'backup',   label: '🛡️ Backup, Revogação & Git' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as GpgTab)}
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
        {isActive('conceito') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que o GPG resolve</h2>
          <p className="text-text-2 mb-4">
            Criptografia de chave pública responde duas perguntas que cercam todo sysadmin:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Confidencialidade</strong> — só o destinatário lê. Você cifra com a chave <em>pública</em> dele; só a <em>privada</em> dele decifra.</li>
            <li><strong>Autenticidade + integridade</strong> — provar que <em>você</em> produziu algo e que não foi alterado. Você assina com a sua chave <em>privada</em>; qualquer um verifica com a sua <em>pública</em>.</li>
          </ul>
          <InfoBox title="A par de chaves — pública e privada">
            A chave <strong>pública</strong> você distribui à vontade (cifrar para você, verificar
            suas assinaturas). A chave <strong>privada</strong> nunca sai do seu controle — é o
            que prova que é você. Perder a privada = perder a identidade; vazá-la = alguém vira você.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Mestra [C] + subchaves [S][E][A]</h2>
          <p className="text-text-2 mb-4">
            O modelo profissional não usa <em>uma</em> chave para tudo. A <strong>chave mestra</strong>
            tem só a capacidade <strong>[C]ertify</strong> — ela <em>é</em> a sua identidade e
            assina (certifica) as demais. Dela nascem <strong>subchaves</strong> para o uso diário:
            <strong> [S]ign</strong>, <strong>[E]ncrypt</strong> e <strong>[A]uthenticate</strong>.
          </p>
          <p className="text-text-2 mb-4">
            Por quê? A mestra fica guardada offline (cofre, Tails, air-gapped). Se uma subchave
            vazar, você <strong>revoga só ela</strong> e gera outra — sem perder a identidade nem
            as assinaturas de confiança que a mestra acumulou. Trocar a mestra é caro; trocar
            uma subchave é rotina.
          </p>
          <WarnBox title="ECC moderno — não use RSA por hábito">
            Tutoriais antigos mandam gerar RSA 4096. Em 2026 o padrão são curvas elípticas:
            <strong> Ed25519</strong> para assinar/autenticar e <strong>Cv25519</strong> para
            cifrar — chaves menores, mais rápidas e igualmente seguras.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Gerando sua primeira chave</h2>
          <p className="text-text-2 mb-4">
            Para <em>aprender o fluxo</em>, o assistente guiado é o melhor. Para <em>scripts</em>,
            o modo &quot;quick&quot; é reprodutível. Os dois caminhos:
          </p>
          <CodeBlock lang="bash" code={`# Conferir a versão do GnuPG (o curso assume 2.4.x+)
gpg --version | head -n1

# CAMINHO A — assistente guiado (ótimo para aprender)
gpg --full-generate-key      # pergunta tipo, curva, validade, UID

# CAMINHO B — reprodutível (modelo dos scripts) — mestra só com [C]ertify
gpg --quick-generate-key "Aluno Lab <aluno@openpgp-lab.local>" ed25519 cert 2y

# Pegue o fingerprint da chave recém-criada
FP=$(gpg --list-secret-keys --with-colons aluno@openpgp-lab.local \\
       | awk -F: '/^fpr:/ {print $10; exit}')

# Adicione as 3 subchaves de uso diário
gpg --quick-add-key "$FP" ed25519  sign 1y     # [S] assinar
gpg --quick-add-key "$FP" cv25519  encr 1y     # [E] cifrar
gpg --quick-add-key "$FP" ed25519  auth 1y     # [A] autenticar (SSH)

# Confirme: gpg -K deve mostrar [C] na mestra e [S] [E] [A] nas subchaves
gpg -K`} />
          <InfoBox title="Validade — por que não 'sem expiração'" className="mt-4">
            Dê <strong>validade</strong> às subchaves (1–2 anos). Expirar não é perder: você
            estende a data quando quiser. Mas uma chave com prazo é uma rede de segurança —
            se você sumir ou perder o acesso, ela morre sozinha em vez de ficar válida para sempre.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['gpg-chave']} onChange={e => updateChecklist('gpg-chave', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['gpg-chave'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('cifrar') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Cifrar e decifrar</h2>
          <p className="text-text-2 mb-4">
            Cifrar protege a confidencialidade. Você cifra <em>para</em> um destinatário (a
            chave pública dele) — aqui, para você mesmo, no laboratório.
          </p>
          <CodeBlock lang="bash" code={`echo "segredo do laboratorio" > segredo.txt

# Cifrar PARA você mesmo (--armor gera saída ASCII .asc legível)
gpg --encrypt --armor --recipient aluno@openpgp-lab.local segredo.txt
# → cria segredo.txt.asc

# Decifrar — só a subchave [E] privada consegue
gpg --decrypt segredo.txt.asc
# → imprime "segredo do laboratorio"; ou salve com --output:
gpg --output recuperado.txt --decrypt segredo.txt.asc`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Assinar e verificar</h2>
          <p className="text-text-2 mb-4">
            Assinar prova autoria e integridade. A <strong>assinatura destacada</strong>
            (<code>--detach-sign</code>) gera um arquivo <code>.sig</code>/<code>.asc</code>
            separado — o padrão para distribuir releases, pacotes, ISOs.
          </p>
          <CodeBlock lang="bash" code={`# Assinatura destacada (armor) — gera release.txt.asc ao lado do arquivo
gpg --detach-sign --armor release.txt

# Verificar — assinatura + arquivo original juntos
gpg --verify release.txt.asc release.txt
# → "Good signature from Aluno Lab ..."

# Prova de integridade: altere o arquivo e verifique de novo
echo "linha injetada" >> release.txt
gpg --verify release.txt.asc release.txt
# → "BAD signature" — a assinatura não cobre mais o conteúdo`} />
          <InfoBox title="Good · BAD · e o aviso de confiança" className="mt-4">
            <strong>Good signature</strong> = o conteúdo bate com a assinatura. <strong>BAD
            signature</strong> = o arquivo foi alterado. Um aviso &quot;<em>This key is not
            certified with a trusted signature</em>&quot; é normal e <strong>não</strong> é
            erro — significa só que você ainda não declarou confiança naquela chave (Web of Trust).
          </InfoBox>

          <WindowsComparisonBox
            windowsLabel="Windows (Gpg4win / Kleopatra)"
            linuxLabel="Linux (GnuPG / CLI)"
            windowsCode={`# No Windows o OpenPGP vem pelo Gpg4win
# - Kleopatra: GUI para gerar chaves, cifrar, assinar
# - GpgEX: cifrar/assinar pelo menu de contexto do Explorer
# Mesmo padrão OpenPGP — chaves .asc são interoperáveis.
# A engine por baixo é o mesmo GnuPG.`}
            linuxCode={`# No Linux o GnuPG é a engine, usada direto na CLI
gpg --full-generate-key
gpg --encrypt --armor --recipient fulano arquivo
gpg --detach-sign --armor release.txt
gpg --verify release.txt.asc release.txt
# Scriptável, audit-friendly, idêntico em qualquer distro.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['gpg-cifrar']} onChange={e => updateChecklist('gpg-cifrar', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['gpg-cifrar'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('backup') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Backup — antes de precisar</h2>
          <p className="text-text-2 mb-4">
            O erro clássico: usar GPG por meses e nunca ter feito backup. Para uso operacional,
            exporte as <strong>subchaves</strong> (<code>--export-secret-subkeys</code>) — não
            a mestra inteira. Assim você opera no dia a dia sem nunca expor a chave mestra.
          </p>
          <CodeBlock lang="bash" code={`# Backup das SUBCHAVES privadas (uso diário) — guarde cifrado e offline
gpg --export-secret-subkeys --armor aluno@openpgp-lab.local > subchaves-priv.asc

# Backup da chave pública (distribua à vontade)
gpg --export --armor aluno@openpgp-lab.local > publica.asc

# Backup do trustdb (suas relações de confiança)
gpg --export-ownertrust > ownertrust.txt

# Restaurar num ambiente novo
gpg --import publica.asc subchaves-priv.asc
gpg --import-ownertrust ownertrust.txt`} />
          <WarnBox title="Onde guardar" className="mt-4">
            O <code>subchaves-priv.asc</code> é material secreto. Guarde-o <strong>cifrado</strong>
            (ele mesmo num container/pendrive cifrado) e <strong>offline</strong>, em mais de um
            lugar — regra 3-2-1 vale para chaves também. Nunca faça commit dele num repositório.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Certificado de revogação — o seguro</h2>
          <p className="text-text-2 mb-4">
            Se a sua chave for comprometida — ou você perder o acesso a ela — o{' '}
            <strong>certificado de revogação</strong> é o que avisa o mundo &quot;não confie
            mais nesta chave&quot;. Gere-o <strong>agora</strong>, no dia em que cria a chave —
            depois pode ser tarde.
          </p>
          <CodeBlock lang="bash" code={`# Gerar o certificado de revogação (faça isso JÁ, junto com a chave)
gpg --output revoke-aluno.asc --gen-revoke aluno@openpgp-lab.local

# Guarde o revoke-*.asc offline, junto com o backup das subchaves.
# No dia do incidente, é só importar e publicar:
#   gpg --import revoke-aluno.asc        → marca a chave como revogada
#   gpg --send-keys <FP>                 → publica a revogação no keyserver`} />
          <InfoBox title="Revogar uma subchave isolada" className="mt-4">
            Não precisa queimar a chave inteira se só uma subchave vazou: <code>gpg --edit-key
            FP</code> → <code>key N</code> (seleciona) → <code>revkey</code> → <code>save</code>.
            A identidade (mestra) sobrevive; você gera uma subchave nova para o papel afetado.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Commits Git assinados</h2>
          <p className="text-text-2 mb-4">
            Um commit comum não prova nada — o campo <em>author</em> é texto livre, qualquer um
            forja. Assinar o commit com GPG prova que <strong>foi você</strong>. No GitHub, vira
            o selo <strong>Verified</strong>.
          </p>
          <CodeBlock lang="bash" code={`# Descobrir o ID da subchave de assinatura [S]
gpg --list-secret-keys --keyid-format=long
# procure a linha "ssb ... [S]" e copie o ID

# Configurar o Git para assinar com ela
git config --global user.signingkey <ID-DA-SUBCHAVE-S>
git config --global commit.gpgsign true        # assina todo commit
git config --global gpg.program gpg

# Commit assinado
git commit -S -m "feat: mudança assinada"      # -S é explícito; com gpgsign=true é automático
git log --show-signature -1                    # confere a assinatura

# Para o selo "Verified" no GitHub: registre a chave PÚBLICA
gpg --export --armor aluno@openpgp-lab.local
# cole a saída em GitHub → Settings → SSH and GPG keys → New GPG key`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['gpg-git']} onChange={e => updateChecklist('gpg-git', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['gpg-git'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Horizonte — além do básico</h2>
          <p className="text-text-2 mb-4">
            Dominado o essencial, o ecossistema OpenPGP vai longe:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { i: '🔐', t: 'SSH via GPG', d: 'A subchave [A] autentica conexões SSH — o gpg-agent substitui o ssh-agent.' },
              { i: '💿', t: 'Chave mestra offline (Tails)', d: 'A mestra [C] vive num sistema air-gapped (Tails); só as subchaves tocam o dia a dia.' },
              { i: '🌐', t: 'WKD & keyservers', d: 'Publicar e buscar chaves: Web Key Directory e keyservers HKPS (keys.openpgp.org).' },
              { i: '🧬', t: 'Pós-quântico (ML-KEM)', d: 'A RFC 9580 e builds experimentais do GnuPG já trazem criptografia resistente a computador quântico.' },
            ].map((h, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{h.i}</span> {h.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{h.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Gerar RSA 4096 por hábito de tutorial antigo', sol: 'Em 2026 o padrão é ECC: Ed25519 para [S]/[A] e Cv25519 para [E]. Menor, mais rápido, igualmente seguro.' },
              { erro: 'Usar uma única chave para tudo, sem subchaves', sol: 'Sem o modelo mestra [C] + subchaves, qualquer vazamento queima a identidade inteira. Separe os papéis [S][E][A].' },
              { erro: 'Nunca ter gerado o certificado de revogação', sol: 'Gere o revoke .asc no dia em que cria a chave. Sem ele, uma chave comprometida fica válida para sempre.' },
              { erro: 'Fazer backup com --export-secret-keys (mestra inteira)', sol: 'Para uso operacional use --export-secret-subkeys. A mestra fica offline; só as subchaves circulam.' },
              { erro: '"BAD signature" tratado como bug', sol: 'BAD signature é o GPG funcionando: o arquivo foi alterado depois de assinado. O bug seria ele aceitar mesmo assim.' },
              { erro: 'Commitar a chave privada (.asc) no repositório', sol: 'Material secreto nunca vai para o Git — o histórico guarda para sempre. Guarde cifrado e offline.' },
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

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/gpg" />

      </div>
    </main>
  );
}
