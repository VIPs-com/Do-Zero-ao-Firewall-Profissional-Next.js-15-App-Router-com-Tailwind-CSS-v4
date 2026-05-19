'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { InfoBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import {
  Compass, Terminal, Shield, Server, MapPin, CheckSquare,
  Brain, RefreshCw, Trophy, GraduationCap, ArrowRight,
} from 'lucide-react';

/* Sprint TRILHA-GUIADA — página-guia de entrada. Explica como usar o curso:
   as 3 trilhas, a Jornada Unificada, checkpoints, quiz, SRS, badges e certificado.
   Página de suporte (não é módulo — sem checkpoints/badge). */

const TRILHAS = [
  {
    icon: <Terminal className="w-6 h-6" />, emoji: '🐧',
    nome: 'Fundamentos Linux', rota: '/fundamentos', cor: 'border-[#6366f1]/50',
    paraQuem: 'Nunca abriu um terminal ou está vindo do Windows.',
    conteudo: '17 módulos: estrutura do sistema, comandos, permissões, processos, boot, shell script.',
  },
  {
    icon: <Shield className="w-6 h-6" />, emoji: '🔥',
    nome: 'Firewall Profissional', rota: '/instalacao', cor: 'border-accent/50',
    paraQuem: 'Já conhece o básico de Linux e quer dominar redes e segurança.',
    conteudo: '25 módulos: iptables, NAT, DNS, SSL, VPN, WireGuard, Docker, hardening.',
  },
  {
    icon: <Server className="w-6 h-6" />, emoji: '🚀',
    nome: 'Avançados', rota: '/avancados', cor: 'border-info/50',
    paraQuem: 'Domina firewall e quer servidores, infraestrutura moderna e cloud.',
    conteudo: '35 módulos: servidores, Ansible, Kubernetes, banco de dados, alta disponibilidade, cloud, carreira.',
  },
];

const RECURSOS = [
  { icon: <CheckSquare className="w-5 h-5 text-ok" />, nome: 'Checkpoints',
    desc: 'Cada módulo tem validações práticas. Marque-as conforme executa no seu laboratório — elas medem seu progresso real, não só páginas abertas.' },
  { icon: <Brain className="w-5 h-5 text-accent" />, nome: 'Quiz',
    desc: 'Teste o que aprendeu por trilha ou por módulo. As questões erradas ficam guardadas para revisão.' },
  { icon: <RefreshCw className="w-5 h-5 text-info" />, nome: 'Treino (SRS)',
    desc: 'O /treino usa repetição espaçada (SM-2): revê a questão certa no momento certo, fixando o conhecimento a longo prazo.' },
  { icon: <Trophy className="w-5 h-5 text-warn" />, nome: 'Badges',
    desc: '76 conquistas desbloqueáveis — uma por módulo concluído, mais marcos especiais como o Linux Ninja e o Mergulhador.' },
  { icon: <GraduationCap className="w-5 h-5 text-ok" />, nome: 'Certificado',
    desc: 'Ao completar 90% dos checkpoints e atingir 80% no quiz, você libera o certificado de conclusão para baixar e compartilhar.' },
];

export default function ComeceAquiPage() {
  const { trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/comece-aqui');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Comece Aqui</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Guia de Uso</div>
          <h1 className="text-4xl font-bold mb-4">🚀 Comece Aqui</h1>
          <p className="text-text-2 text-lg mb-6">
            Bem-vindo ao Workshop Linux. São <strong>77 módulos</strong> em 3 trilhas — pode
            parecer muito, mas você nunca precisa decidir sozinho o próximo passo. Esta
            página explica, em 2 minutos, <strong>como o curso funciona</strong> e por onde
            começar.
          </p>
        </div>

        {/* ── As 3 trilhas ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. As 3 trilhas — qual é a sua?</h2>
          <p className="text-text-2 mb-6">
            O conteúdo é organizado em três trilhas progressivas. Escolha o ponto de entrada
            pelo seu nível atual — você pode pular para a trilha certa sem culpa.
          </p>
          <div className="space-y-3">
            {TRILHAS.map(t => (
              <Link
                key={t.rota}
                href={t.rota}
                className={`flex items-start gap-4 p-5 rounded-xl bg-bg-2 border ${t.cor} hover:bg-bg-3 transition-colors`}
              >
                <div className="shrink-0 mt-0.5">{t.icon}</div>
                <div className="min-w-0">
                  <p className="font-bold text-text">{t.emoji} {t.nome}</p>
                  <p className="text-sm text-accent mt-0.5">Para quem: {t.paraQuem}</p>
                  <p className="text-sm text-text-3 mt-1">{t.conteudo}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-3 shrink-0 mt-1" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <InfoBox title="Não sabe seu nível?" className="mt-4">
            Comece pelos <strong>Fundamentos</strong>. Se os primeiros módulos parecerem
            triviais, avance — o curso não bloqueia nada. O importante é não pular etapas
            que você ainda não domina.
          </InfoBox>
        </section>

        {/* ── A Jornada Unificada ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. A Jornada Unificada — seu mapa</h2>
          <p className="text-text-2 mb-4">
            As 3 trilhas se encadeiam numa única linha do tempo de <strong>77 módulos</strong>,
            do primeiro comando no terminal até a cloud. A página{' '}
            <Link href="/jornada" className="text-accent hover:underline">/jornada</Link>{' '}
            é o seu mapa: ela mostra <strong>onde você está</strong>, marca o que já foi
            concluído e destaca sempre o <strong>próximo passo</strong> com um botão
            &quot;Continue aqui&quot;.
          </p>
          <FluxoCard
            title="O percurso recomendado"
            steps={[
              { label: 'Fundamentos', sub: '17 módulos · base Linux', icon: <Terminal size={14}/>, color: 'border-info/50' },
              { label: 'Firewall', sub: '25 módulos · redes & segurança', icon: <Shield size={14}/>, color: 'border-accent/50' },
              { label: 'Avançados', sub: '35 módulos · infra & cloud', icon: <Server size={14}/>, color: 'border-ok/50' },
              { label: 'Certificado', sub: 'conclusão verificável', icon: <GraduationCap size={14}/>, color: 'border-warn/50' },
            ]}
          />
          <p className="text-text-3 text-sm mt-4">
            Ao terminar uma trilha, o rodapé do último módulo te leva direto para a próxima —
            você nunca fica num beco sem saída.
          </p>
        </section>

        {/* ── Como o progresso funciona ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Como seu progresso é medido</h2>
          <div className="space-y-3">
            {RECURSOS.map(r => (
              <div key={r.nome} className="flex items-start gap-3 p-4 rounded-lg bg-bg-2 border border-border">
                <div className="shrink-0 mt-0.5">{r.icon}</div>
                <div>
                  <p className="font-semibold text-text">{r.nome}</p>
                  <p className="text-sm text-text-2 mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <InfoBox title="Onde acompanhar tudo" className="mt-4">
            O <Link href="/dashboard" className="text-accent hover:underline">Dashboard</Link>{' '}
            reúne seu progresso: módulos visitados, checkpoints concluídos, badges, pontuação
            do quiz e a próxima conquista a mirar. Volte a ele sempre que quiser uma visão geral.
          </InfoBox>
        </section>

        {/* ── Dica de método ── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. O método que funciona</h2>
          <p className="text-text-2 mb-4">
            Este curso ensina e valida o conhecimento — mas o aprendizado de verdade acontece
            no <strong>teclado</strong>. Para cada módulo:
          </p>
          <ol className="space-y-2 text-text-2 mb-4 list-decimal pl-5">
            <li>Leia o módulo e entenda o <em>porquê</em>, não só o comando.</li>
            <li>Reproduza os exemplos numa VM real (veja a trilha Fundamentos / Laboratório).</li>
            <li>Marque os <strong>checkpoints</strong> conforme executa de verdade.</li>
            <li>Faça o <strong>quiz do módulo</strong> e revise os erros no <Link href="/treino" className="text-accent hover:underline">Treino</Link>.</li>
            <li>Siga para o próximo módulo pelo botão no rodapé.</li>
          </ol>
        </section>

        {/* ── CTAs ── */}
        <section className="mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/jornada"
              className="flex items-center justify-between gap-3 p-5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-2 transition-colors"
            >
              <span className="flex items-center gap-2"><MapPin size={18} /> Ver minha Jornada</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/fundamentos"
              className="flex items-center justify-between gap-3 p-5 rounded-xl bg-bg-2 border border-border font-semibold hover:border-accent/50 transition-colors"
            >
              <span className="flex items-center gap-2"><Compass size={18} /> Começar pelos Fundamentos</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
