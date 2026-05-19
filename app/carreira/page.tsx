'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { GraduationCap, Timer, RotateCcw, CalendarCheck, Briefcase, MessagesSquare, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint CARREIRA — Da Formação ao Emprego: certificações, portfólio e
   entrevista técnica. Fecha a Fase 3 do Diagnóstico Curricular. */

type CarreiraTab = 'certificacoes' | 'portfolio' | 'entrevista';

const CHECKLIST_ITEMS = [
  { id: 'simulado-completo',   label: 'Fiz um simulado cronometrado completo no /quiz e revisei os erros com a revisão espaçada do /treino' },
  { id: 'portfolio-montado',   label: 'Montei meu portfólio no GitHub — publiquei pelo menos um lab do curso com um README bem escrito' },
  { id: 'entrevista-praticada', label: 'Pratiquei uma entrevista técnica respondendo perguntas de infra em voz alta, usando o método STAR para as comportamentais' },
];

export default function CarreiraPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<CarreiraTab>('certificacoes');

  useEffect(() => {
    trackPageVisit('/carreira');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-carreira min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Carreira</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Carreira & Mercado</div>
          <h1 className="text-4xl font-bold mb-4">🎓 Carreira — Da Formação ao Emprego</h1>
          <p className="text-text-2 text-lg mb-6">
            Você aprendeu firewall, redes, servidores, containers e alta disponibilidade.
            Falta a etapa que transforma <strong>conhecimento</strong> em <strong>profissão</strong>:
            uma <strong>certificação</strong> que valida você no mercado, um <strong>portfólio</strong>
            que prova o que você sabe fazer, e a <strong>entrevista técnica</strong> que abre a porta.
            Este módulo é o seu plano de carreira.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo orientado a quem busca a primeira vaga ou a transição para infra/DevOps/SRE.
          </p>
        </div>

        <FluxoCard
          title="Do estudo à vaga — o caminho completo"
          steps={[
            { label: 'Estudar a trilha', sub: 'percorrer os módulos do curso',         icon: <GraduationCap size={14}/>, color: 'border-info/50' },
            { label: 'Simulado cronometrado', sub: 'testar sob pressão de tempo',        icon: <Timer size={14}/>,         color: 'border-accent/50' },
            { label: 'Revisar erros (SRS)', sub: 'fixar o que falhou com /treino',       icon: <RotateCcw size={14}/>,     color: 'border-warn/50' },
            { label: 'Agendar a prova', sub: 'marcar a certificação com confiança',      icon: <CalendarCheck size={14}/>, color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'certificacoes', label: '🎓 Certificações & Simulado' },
              { id: 'portfolio',     label: '💼 Portfólio Profissional' },
              { id: 'entrevista',    label: '🗣️ Entrevista Técnica' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CarreiraTab)}
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
        {isActive('certificacoes') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. Por que certificar</h2>
          <p className="text-text-2 mb-4">
            Conhecimento sem prova é difícil de vender. Uma <strong>certificação</strong> é um
            sinal padronizado que o recrutador entende de imediato: passou numa prova
            independente, conhece o vocabulário, sabe o mínimo esperado. Ela não substitui
            prática — mas <strong>abre triagens automáticas</strong>, justifica salário e dá
            estrutura ao seu estudo.
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Validação no mercado</strong> — vagas de infra frequentemente listam &quot;LPIC&quot; ou &quot;Linux+&quot; como diferencial ou requisito.</li>
            <li><strong>Currículo de estudo pronto</strong> — o edital da prova vira a sua lista de tópicos a dominar.</li>
            <li><strong>Confiança</strong> — passar numa prova reconhecida tira a síndrome do impostor de quem é autodidata.</li>
          </ul>
          <InfoBox title="Certificado prova teoria — portfólio prova prática">
            O ideal é ter os dois. A certificação responde &quot;ele conhece os fundamentos?&quot;;
            o portfólio (aba 2) responde &quot;ele sabe <em>fazer</em>?&quot;. Um sem o outro é
            uma carreira pela metade.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Panorama das certificações</h2>
          <p className="text-text-2 mb-4">
            As três rotas mais recomendadas para quem começa na carreira Linux/Cloud:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { i: '🐧', t: 'LPIC-1', d: 'Linux Professional Institute, nível associado. Duas provas (101 e 102): linha de comando, FHS, pacotes, permissões, rede básica, init/systemd. A porta de entrada clássica.' },
              { i: '🐧', t: 'LPIC-2', d: 'Nível engenheiro. Kernel, storage avançado, DNS, web, e-mail, segurança de rede. O passo seguinte para quem já tem o LPIC-1.' },
              { i: '🧰', t: 'CompTIA Linux+ (XK0-005)', d: 'Prova única, neutra de distribuição, com forte foco prático e em segurança/automação. Boa alternativa ao LPIC-1.' },
              { i: '☁️', t: 'AWS Cloud Practitioner', d: 'Fundamentos de nuvem: serviços core, modelo de responsabilidade compartilhada, custos. Não é Linux puro, mas o mercado de infra hoje é cloud.' },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{c.i}</span> {c.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2 mb-4">
            O curso já mapeia o núcleo comum dessas provas aos seus módulos — veja o hub{' '}
            <Link href="/certificacoes" className="text-accent hover:underline">/certificacoes</Link>,
            que liga cada tópico de prova aos comandos e módulos correspondentes.
          </p>
          <WarnBox title="Não persiga certificado sem prática">
            Uma certificação tirada só decorando questões cai por terra na primeira entrevista
            técnica. Estude <em>fazendo</em>: monte o laboratório do curso numa VM e execute os
            comandos de verdade. A prova confirma; ela não substitui o trabalho de mão.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Montando o plano de estudo</h2>
          <p className="text-text-2 mb-4">
            Você não precisa criar um currículo do zero — as <strong>trilhas do curso</strong>
            já são um plano de estudo estruturado. Mapeie a certificação alvo à trilha:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Trilha Fundamentos</strong> — cobre o coração do LPIC-1/Linux+: FHS, comandos, permissões, processos, pacotes, boot, logs.</li>
            <li><strong>Trilha Firewall</strong> — redes, NAT, iptables, DNS, SSL/VPN: o domínio de rede e segurança das provas.</li>
            <li><strong>Trilha Avançados</strong> — servidores, containers, observabilidade, HA: terreno de LPIC-2 e da prática DevOps/SRE.</li>
          </ul>
          <p className="text-text-2 mb-4">
            Use a <Link href="/jornada" className="text-accent hover:underline">/jornada</Link>{' '}
            como linha do tempo única — ela compõe as três trilhas em ordem de dificuldade e
            marca o seu próximo módulo. Estude um bloco, faça o quiz dele, só então avance.
          </p>
          <InfoBox title="Ritmo realista">
            Melhor 45 minutos por dia, todo dia, do que uma maratona de fim de semana esquecida
            na segunda. A consistência é o que constrói retenção — e é também o que a revisão
            espaçada do <Link href="/treino" className="text-accent hover:underline">/treino</Link> reforça.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Estratégia de prova</h2>
          <p className="text-text-2 mb-4">
            Saber o conteúdo não basta — a prova é cronometrada e tem armadilhas. Técnicas que
            valem pontos:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Gestão de tempo</strong> — divida o tempo total pelo número de questões; se uma trava você, marque e siga. Tempo gasto travado é tempo roubado das fáceis.</li>
            <li><strong>Questões âncora</strong> — responda primeiro as que você domina. Garante pontos e constrói confiança antes das difíceis.</li>
            <li><strong>Eliminar alternativas</strong> — raramente você não sabe <em>nada</em>. Descarte as claramente erradas e a chance no chute sobe de 25% para 50%.</li>
            <li><strong>Ler a pergunta inteira</strong> — palavras como &quot;NÃO&quot;, &quot;EXCETO&quot; e &quot;MELHOR&quot; mudam tudo. Provas exploram a leitura apressada.</li>
          </ul>
          <p className="text-text-2 mb-4">
            Treine isso com um <strong>simulado cronometrado</strong>. No{' '}
            <Link href="/quiz" className="text-accent hover:underline">/quiz</Link>, escolha o
            modo <strong>&quot;Completo&quot;</strong>, abra um cronômetro ao lado e responda
            sem pausar — simule a pressão real. Depois, leve os erros para o{' '}
            <Link href="/treino" className="text-accent hover:underline">/treino</Link>, que usa
            <strong> revisão espaçada (SRS)</strong> para reapresentar exatamente o que você
            errou, nos intervalos certos para fixar.
          </p>
          <CodeBlock lang="bash" code={`# Rotina de simulado — repita até a nota estabilizar acima da meta da prova

# 1. Simulado cronometrado da trilha alvo (modo Completo)
#    Abra:  /quiz?trail=fundamentos     (ou ?trail=firewall / ?trail=avancados)
#    Cronometre-se: ~1 a 1,5 min por questão, sem pausar.

# 2. Anote a nota e os tópicos fracos.

# 3. Revisão espaçada dos erros — fixa o que falhou
#    Abra:  /treino

# 4. Quiz focado só no módulo fraco
#    Abra:  /quiz?modulo=<badge-do-modulo>

# 5. Repita o simulado completo dali a alguns dias.
#    Meta: nota estável acima do corte da certificação.`} />
          <p className="text-text-2 mt-4">
            Quando o simulado completo passar a sair com folga acima da nota de corte da prova,
            <strong> agende a certificação</strong> — uma data marcada vira compromisso e
            combate a procrastinação.
          </p>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['simulado-completo']} onChange={e => updateChecklist('simulado-completo', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['simulado-completo'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('portfolio') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Por que portfólio</h2>
          <p className="text-text-2 mb-4">
            O recrutador de infra não consegue ver o que você sabe — só o que você{' '}
            <strong>mostra</strong>. O portfólio transforma aprendizado em <strong>prova
            concreta</strong>: um repositório que ele abre, lê e entende em dois minutos vale
            mais que dez linhas de &quot;tenho conhecimento em&quot; no currículo.
          </p>
          <InfoBox title="Você já fez o trabalho — falta documentar">
            Cada lab deste curso — o laboratório de três zonas WAN/DMZ/LAN, o firewall iptables,
            o cluster de alta disponibilidade, a stack de containers — é material de portfólio.
            Não é preciso inventar projetos: basta <em>publicar e documentar</em> o que você
            já praticou.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Portfólio no GitHub</h2>
          <p className="text-text-2 mb-4">
            O GitHub é o portfólio padrão de quem trabalha com infra. O que importa não é a
            quantidade de repositórios, e sim a <strong>qualidade do README</strong> — é ele
            que o recrutador lê. Um bom README de um lab tem:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>O problema</strong> — o que esse lab resolve, em uma frase clara.</li>
            <li><strong>A arquitetura</strong> — um diagrama (ASCII ou imagem) das zonas, hosts e fluxos.</li>
            <li><strong>Como reproduzir</strong> — passos numerados, comandos copiáveis, pré-requisitos.</li>
            <li><strong>O que você aprendeu</strong> — decisões, problemas que enfrentou, como resolveu.</li>
          </ul>
          <CodeBlock lang="text" title="README.md — esqueleto de um lab de portfólio" code={`# Lab — Firewall com 3 zonas (WAN / DMZ / LAN)

## O problema
Segmentar uma rede em três zonas de confiança e controlar o
tráfego entre elas com iptables, expondo só os serviços da DMZ.

## Arquitetura
        Internet
           |
        [ WAN ]
           |
       +---------+
       | Firewall|  <- iptables: FORWARD com policy DROP
       +---------+
        /        \\
    [ DMZ ]     [ LAN ]
   web/ssh      estações

## Como reproduzir
1. Suba 3 VMs (firewall + 1 host por zona) — ver /laboratorio do curso.
2. Aplique as regras: \`sudo bash scripts/firewall.sh\`
3. Teste: da LAN, \`curl http://<dmz>\` funciona; da WAN, não.

## O que aprendi
- A ordem das regras importa: a primeira que casa vence.
- Persistir o ruleset com netfilter-persistent evita perder
  tudo no reboot.
- Logar os DROP ajudou a depurar um bloqueio inesperado.`} />
          <WarnBox title="Nunca commite segredos" className="mt-4">
            Senhas, chaves privadas, <code>.env</code> com credenciais — jamais vão para o
            repositório. O histórico do Git guarda para sempre. Use <code>.gitignore</code>,
            arquivos <code>.example</code> e variáveis de ambiente.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Posts técnicos e diagramas</h2>
          <p className="text-text-2 mb-4">
            Escrever sobre o que você fez tem dois efeitos: <strong>consolida o seu
            aprendizado</strong> (ensinar é a forma mais forte de aprender) e <strong>mostra
            comunicação</strong> — habilidade que recrutadores valorizam tanto quanto a técnica.
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Blog técnico</strong> — dev.to, Medium, Hashnode ou um site estático. Conte como resolveu um problema real do lab, com comandos e o raciocínio.</li>
            <li><strong>Diagramas</strong> — uma imagem de topologia vale mil linhas. Ferramentas: draw.io, Excalidraw, Mermaid (renderiza direto no README do GitHub).</li>
            <li><strong>Documentar a decisão</strong> — não basta &quot;o que&quot;; explique o &quot;por quê&quot;. Recrutadores procuram quem pensa, não quem só copia comandos.</li>
          </ul>
          <InfoBox title="Mermaid no próprio README">
            O GitHub renderiza diagramas Mermaid diretamente em arquivos Markdown. Um bloco{' '}
            <code>```mermaid</code> com um <code>graph TD</code> simples já dá ao seu README um
            diagrama de arquitetura sem precisar de imagem externa.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. LinkedIn e o que recrutadores procuram</h2>
          <p className="text-text-2 mb-4">
            O LinkedIn é onde o recrutador chega até você. Um perfil de infra que funciona:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Título claro</strong> — &quot;Analista de Infraestrutura Linux&quot; ou &quot;DevOps em formação&quot;, não um cargo genérico.</li>
            <li><strong>Resumo objetivo</strong> — o que você sabe fazer, em concreto: &quot;configuro firewall iptables, automatizo com Ansible, monitoro com Prometheus&quot;.</li>
            <li><strong>Projetos linkados</strong> — aponte para os repositórios do seu portfólio.</li>
            <li><strong>Certificações</strong> — registre as conquistadas; sinaliza compromisso.</li>
          </ul>
          <p className="text-text-2 mb-4">
            O que recrutadores de infra realmente procuram: alguém que <strong>já praticou</strong>
            (não só assistiu a vídeos), que <strong>sabe diagnosticar</strong> quando algo quebra,
            que <strong>documenta e comunica</strong>, e que tem <strong>vontade de aprender</strong>
            — a stack muda rápido. O portfólio é a evidência de tudo isso.
          </p>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['portfolio-montado']} onChange={e => updateChecklist('portfolio-montado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['portfolio-montado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('entrevista') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. O formato da entrevista de infra</h2>
          <p className="text-text-2 mb-4">
            Uma seleção para SysAdmin / DevOps / SRE costuma ter etapas previsíveis. Saber o
            formato tira metade do nervosismo:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Triagem</strong> — RH confere experiência, expectativa salarial e disponibilidade. Pouca técnica.</li>
            <li><strong>Entrevista técnica</strong> — um engenheiro pergunta fundamentos e cenários de diagnóstico. É o coração do processo.</li>
            <li><strong>Comportamental</strong> — como você trabalha em equipe, lida com incidentes e com pressão.</li>
            <li><strong>Conversa final</strong> — alinhamento com o gestor, cultura, e a sua chance de perguntar.</li>
          </ul>
          <InfoBox title="Pensar alto vale ponto">
            Na parte técnica, o entrevistador quer ver o seu <em>raciocínio</em>, não só a
            resposta certa. Verbalize o caminho: &quot;eu começaria checando X, se desse Y eu
            iria para Z&quot;. Mesmo errando o detalhe, um bom processo de pensamento impressiona.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. Perguntas técnicas comuns</h2>
          <p className="text-text-2 mb-4">
            Estas aparecem repetidamente. Não decore respostas — <strong>entenda</strong> cada
            uma a ponto de explicá-la em voz alta, com suas palavras. Treine respondendo de cabeça:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { i: '📡', t: 'O que acontece num ping?', d: 'ICMP echo request/reply, resolução de nome, ARP na rede local, TTL. Sabe descrever a jornada do pacote?' },
              { i: '🔀', t: 'TCP vs UDP', d: 'Conexão e confirmação vs sem estado e sem garantia. Quando usar cada um e por quê.' },
              { i: '🌐', t: '"O site não abre"', d: 'Diagnóstico camada a camada: link, IP, rota, DNS, porta, serviço, aplicação. Metodologia do módulo /troubleshooting.' },
              { i: '🔒', t: 'Permissões no Linux', d: 'rwx para dono/grupo/outros, octal, SUID/SGID/sticky bit. Por que 777 é perigoso.' },
              { i: '📂', t: 'O que é um inode', d: 'A estrutura de metadados de um arquivo: permissões, dono, tamanho, ponteiros de bloco — não o nome.' },
              { i: '🧭', t: 'Como funciona o DNS', d: 'Resolução recursiva, raiz → TLD → autoritativo, cache, registros A/CNAME/MX/PTR.' },
            ].map((q, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{q.i}</span> {q.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{q.d}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2 mb-4">
            Repare: <strong>todos esses temas já estão no curso</strong>. A entrevista técnica é,
            no fundo, um simulado oral das trilhas. Se você consegue explicar cada módulo em voz
            alta para outra pessoa, está pronto.
          </p>
          <WarnBox title="Não saber não é o fim">
            Se cair uma pergunta que você não domina, seja honesto: &quot;não tenho experiência
            direta com isso, mas pelo que sei seria por aqui — e eu pesquisaria assim&quot;.
            Demonstrar honestidade e método de aprendizado vale mais que um chute confiante e errado.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. Perguntas comportamentais — método STAR</h2>
          <p className="text-text-2 mb-4">
            &quot;Conte uma vez em que você lidou com um problema difícil.&quot; Respostas vagas
            afundam aqui. O método <strong>STAR</strong> estrutura uma resposta convincente:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { l: 'S — Situação', d: 'O contexto: onde, quando, qual era o cenário.' },
              { l: 'T — Tarefa', d: 'O que precisava ser feito; o seu papel e o objetivo.' },
              { l: 'A — Ação', d: 'O que VOCÊ fez, em concreto, passo a passo.' },
              { l: 'R — Resultado', d: 'O desfecho — de preferência mensurável — e o que você aprendeu.' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-accent">{s.l}</p>
                <p className="text-text-3 mt-1 leading-snug">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="text-text-2 mb-4">
            Sem projeto profissional ainda? Use os <strong>labs do curso</strong> como matéria-prima:
            &quot;quando montei o firewall de três zonas (S/T), um bloqueio inesperado derrubou a
            DMZ; eu liguei o LOG nas regras DROP, achei a regra errada e corrigi a ordem (A); o
            tráfego voltou e aprendi que a ordem das regras é decisiva (R)&quot;. É uma resposta
            STAR completa e verdadeira.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. Salário, mercado e perguntas a fazer</h2>
          <p className="text-text-2 mb-4">
            Chegue à entrevista informado. Pesquise a <strong>faixa salarial</strong> do cargo e
            da senioridade na sua região — sites de vagas, pesquisas salariais, comunidades. Saber
            o valor de mercado evita aceitar abaixo do justo e dá segurança na negociação.
          </p>
          <p className="text-text-2 mb-4">
            No fim, sempre perguntam &quot;você tem perguntas?&quot;. <strong>Tenha</strong> — não
            ter sinaliza desinteresse. Boas perguntas para o entrevistador:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li>Como é o dia a dia de quem ocupa essa vaga?</li>
            <li>Qual a stack de infraestrutura e ferramentas que vocês usam?</li>
            <li>Como funciona o plantão / on-call e a resposta a incidentes?</li>
            <li>Quais são os maiores desafios técnicos do time hoje?</li>
            <li>Como é o caminho de crescimento e aprendizado para essa posição?</li>
          </ul>
          <WindowsComparisonBox
            windowsLabel="Carreira no ecossistema Microsoft"
            linuxLabel="Carreira Linux / open-source"
            windowsCode={`# Trilha tradicional Microsoft
# Certs:   MD-100/101, AZ-104 (Azure Admin), AZ-305
#          (a antiga MCSA foi descontinuada)
# Foco:    Active Directory, Windows Server, M365, Azure
# Cargos:  Suporte N1/N2, Analista de Infra Windows,
#          Administrador Azure
# Forte em ambientes corporativos centrados em Windows.`}
            linuxCode={`# Trilha Linux / open-source / cloud-native
# Certs:   LPIC-1/2, CompTIA Linux+, AWS/CKA
# Foco:    Linux, redes, containers, automação, IaC
# Cargos:  SysAdmin Linux, DevOps, SRE, Cloud Engineer,
#          Platform Engineer
# Predomina em startups, cloud e cultura DevOps.
# As duas trilhas convergem: cloud e containers são neutros.`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['entrevista-praticada']} onChange={e => updateChecklist('entrevista-praticada', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['entrevista-praticada'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Estudar só teoria, sem praticar numa VM', sol: 'Vídeo e leitura dão familiaridade, não habilidade. Monte o laboratório do curso e execute os comandos de verdade — a entrevista técnica desmascara quem só assistiu.' },
              { erro: 'Portfólio vazio ou repositórios sem README', sol: 'Um repo de código sem README é invisível para o recrutador. Documente cada lab: o problema, a arquitetura, como reproduzir e o que você aprendeu.' },
              { erro: 'Decorar respostas em vez de entender', sol: 'Respostas decoradas caem na primeira pergunta de acompanhamento. Entenda cada tópico a ponto de explicá-lo com suas palavras e responder ao "e por quê?".' },
              { erro: 'Não saber explicar os próprios projetos', sol: 'Se você listou um projeto no currículo, espere ser questionado a fundo. Saiba descrever as decisões, os problemas enfrentados e como resolveu cada um — use o método STAR.' },
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
              <p className="font-bold text-text mb-2"><span aria-hidden="true"><Briefcase size={16} className="inline" /></span> Lab 1 — Simulado cronometrado completo</p>
              <p className="text-sm text-text-2 mb-3">
                Escolha a trilha alvo da sua certificação e abra o <Link href="/quiz" className="text-accent hover:underline">/quiz</Link>{' '}
                no modo <strong>&quot;Completo&quot;</strong>. Ponha um cronômetro ao lado, dê a
                si mesmo cerca de 1 a 1,5 minuto por questão e responda <strong>sem pausar</strong>,
                simulando a pressão da prova. Ao terminar, anote a nota e os tópicos fracos; leve
                os erros para o <Link href="/treino" className="text-accent hover:underline">/treino</Link>{' '}
                e repita o simulado dali a alguns dias.
              </p>
              <CodeBlock lang="bash" code={`# Abra no navegador, em sequência:
#   /quiz?trail=fundamentos     -> modo "Completo", cronometre-se
#   /treino                     -> revisão espaçada dos erros
#   /quiz?modulo=<badge>        -> quiz focado no módulo mais fraco
# Meta: nota estável acima do corte da certificação.`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2"><span aria-hidden="true"><Briefcase size={16} className="inline" /></span> Lab 2 — Publicar um lab do curso no GitHub</p>
              <p className="text-sm text-text-2 mb-3">
                Escolha um lab que você praticou — o firewall de três zonas, o cluster de alta
                disponibilidade ou a stack de containers. Crie um repositório no GitHub e escreva
                um <code>README.md</code> com as quatro seções: o problema, a arquitetura (com
                um diagrama), como reproduzir e o que você aprendeu. Confirme que nenhum segredo
                foi commitado.
              </p>
              <CodeBlock lang="bash" code={`mkdir lab-firewall-3-zonas && cd lab-firewall-3-zonas
git init
# escreva o README.md com as 4 secoes
echo ".env" > .gitignore        # nunca commite segredos
git add README.md scripts/ .gitignore
git commit -m "docs: lab de firewall com 3 zonas WAN/DMZ/LAN"
# crie o repo no GitHub e:
git remote add origin git@github.com:SEU-USUARIO/lab-firewall-3-zonas.git
git push -u origin main`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2"><span aria-hidden="true"><MessagesSquare size={16} className="inline" /></span> Lab 3 — Simular uma entrevista técnica</p>
              <p className="text-sm text-text-2 mb-3">
                Pegue as 6 perguntas técnicas da seção 10 mais 4 outras dos módulos do curso
                (total de 10) e responda <strong>em voz alta</strong>, como se um entrevistador
                estivesse ouvindo — de preferência grave o áudio ou peça a alguém para ouvir.
                Em seguida, escolha um projeto do seu portfólio e descreva-o usando o método
                <strong> STAR</strong> (Situação, Tarefa, Ação, Resultado). Reveja a gravação e
                anote onde travou — esses são os tópicos a reestudar.
              </p>
              <CodeBlock lang="text" title="Roteiro do simulado de entrevista" code={`Bloco técnico (responda em voz alta, ~2 min cada):
  1. O que acontece, passo a passo, quando você roda um ping?
  2. Diferença entre TCP e UDP e quando usar cada um.
  3. "O site não abre" — como você diagnostica camada a camada?
  4. Como funcionam as permissões no Linux? Por que 777 e perigoso?
  5. O que e um inode?
  6. Como funciona a resolucao de DNS?
  7. O que faz o iptables numa policy FORWARD DROP?
  8. Como voce investiga um servico que nao sobe?
  9. O que e e para que serve o systemd?
 10. Como voce manteria um servico em alta disponibilidade?

Bloco comportamental (formato STAR):
  - Conte um problema dificil de um lab e como resolveu.
  - Estruture: Situacao -> Tarefa -> Acao -> Resultado.`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/carreira" />

      </div>
    </main>
  );
}
