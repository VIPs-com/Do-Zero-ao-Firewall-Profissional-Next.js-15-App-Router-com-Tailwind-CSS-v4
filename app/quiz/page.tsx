'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, Award, ChevronRight, ChevronLeft, Trophy, Search, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBadges } from '@/context/BadgeContext';

interface Question {
  text: string;
  badge: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  // ========== Firewall e NAT ==========
  { text: "Qual comando habilita o roteamento IP (ip_forward) temporariamente?", badge: "🌐 Camada 3",
    options: ["echo 1 > /proc/sys/net/ipv4/ip_forward","sysctl -w net.ipv4.ip_forward=1","iptables -A FORWARD -j ACCEPT","ip route add default"],
    correct: 1, explanation: "sysctl -w net.ipv4.ip_forward=1 ativa o roteamento IP até o próximo reboot." },
  { text: "Qual a diferença entre SNAT e MASQUERADE?", badge: "🌐 Camada 3",
    options: ["SNAT é para IPv6, MASQUERADE para IPv4","SNAT usa IP fixo, MASQUERADE usa IP dinâmico da interface","SNAT é mais lento que MASQUERADE","Não há diferença, são sinônimos"],
    correct: 1, explanation: "SNAT requer IP fixo especificado; MASQUERADE descobre o IP automaticamente (útil para DHCP)." },
  { text: "O DNAT é configurado em qual chain do iptables?", badge: "🎯 DNAT",
    options: ["INPUT","OUTPUT","PREROUTING","POSTROUTING"],
    correct: 2, explanation: "DNAT precisa acontecer ANTES da decisão de roteamento, por isso fica no PREROUTING." },
  { text: "Qual comando mostra a lista de IPs autorizados pelo Port Knocking?", badge: "🔑 Port Knocking",
    options: ["iptables -L INPUT","cat /proc/net/xt_recent/abre-ssh","conntrack -L","ss -tulpn | grep 22"],
    correct: 1, explanation: "O módulo recent mantém a lista em /proc/net/xt_recent/ com o nome da lista (ex: abre-ssh)." },
  { text: "Qual a função da regra ESTABLISHED no iptables?", badge: "🛡️ Firewall",
    options: ["Bloquear novas conexões","Permitir respostas de conexões já autorizadas","Registrar logs de conexões","Redirecionar portas"],
    correct: 1, explanation: "ESTABLISHED permite que respostas de conexões já autorizadas passem sem verificar regras novamente." },
  
  // ========== DNS ==========
  { text: "Qual registro DNS faz o mapeamento reverso (IP → Nome)?", badge: "📖 DNS",
    options: ["Registro A","Registro CNAME","Registro MX","Registro PTR"],
    correct: 3, explanation: "PTR (Pointer) é usado para DNS reverso, associando um IP a um nome de domínio." },
  { text: "Qual protocolo o DNS usa na porta 53?", badge: "📖 DNS",
    options: ["Apenas TCP","Apenas UDP","UDP e TCP","ICMP"],
    correct: 2, explanation: "DNS usa UDP para consultas curtas e TCP para transferências de zona e respostas longas." },
  { text: "O que é o registro SOA no DNS?", badge: "📖 DNS",
    options: ["Server of Authority — define qual servidor responde","Start of Authority — define parâmetros da zona (TTL, serial, refresh)","Source of Address — mapeia IP para nome","System of Access — controle de acesso DNS"],
    correct: 1, explanation: "SOA (Start of Authority) define TTL, serial, refresh, retry e expire da zona DNS." },
  
  // ========== SSL/TLS ==========
  { text: "O que significa PKI?", badge: "🔒 SSL",
    options: ["Public Key Infrastructure","Private Key Interface","Protocol Key Integration","Public Knowledge Internet"],
    correct: 0, explanation: "PKI é a infraestrutura de chave pública que gerencia certificados digitais." },
  { text: "Qual comando gera uma chave privada RSA 2048 bits?", badge: "🔒 SSL",
    options: ["openssl rsa -genkey 2048","openssl genrsa -out key.pem 2048","ssh-keygen -t rsa -b 2048","certbot generate key 2048"],
    correct: 1, explanation: "openssl genrsa é o comando correto para gerar chave RSA com OpenSSL." },
  { text: "Qual a função do cabeçalho HSTS?", badge: "🔒 SSL",
    options: ["Força o navegador a sempre usar HTTPS","Desabilita a criptografia SSL","Aumenta o TTL do DNS","Redirecionar HTTP para HTTPS"],
    correct: 0, explanation: "HSTS (HTTP Strict Transport Security) força o navegador a usar HTTPS mesmo se o usuário digitar HTTP." },
  
  // ========== Squid Proxy ==========
  { text: "Qual a porta padrão do Squid Proxy?", badge: "🚪 Squid",
    options: ["80","443","3128","8080"],
    correct: 2, explanation: "Squid escuta na porta 3128 por padrão." },
  { text: "Qual a diferença entre dstdomain e url_regex no Squid?", badge: "🚪 Squid",
    options: ["dstdomain bloqueia IPs, url_regex bloqueia domínios","dstdomain é mais rápido e funciona com HTTPS, url_regex é mais lento","São equivalentes, mudam só a sintaxe","url_regex funciona offline, dstdomain precisa de internet"],
    correct: 1, explanation: "dstdomain verifica só o domínio (mais rápido, funciona com HTTPS); url_regex analisa URL inteira (mais lento)." },
  { text: "Qual a melhor prática para HTTPS no Squid?", badge: "🚪 Squid",
    options: ["Usar url_regex para filtrar URLs completas","Usar dstdomain para bloquear domínios inteiros","Desabilitar proxy para HTTPS","Usar SSL Bump para tudo"],
    correct: 1, explanation: "Como HTTPS criptografa a URL, o Squid só vê o domínio. dstdomain é a melhor prática." },
  
  // ========== DIAGNÓSTICO ==========
  { text: "Se o comando 'ping 8.8.8.8' funciona mas 'ping google.com' falha, qual é o problema?", badge: "🔧 Diagnóstico",
    options: ["Camada 1 (placa de rede)","Camada 2 (ARP)","Camada 3 (roteamento)","Camada 7 (DNS)"],
    correct: 3, explanation: "Ping por IP funciona, mas por nome não → o DNS está quebrado. Elimina Camadas 1-4 de uma vez!" },
  { text: "Qual comando mostra a tabela ARP (mapeamento IP → MAC) da sua máquina?", badge: "🔧 Diagnóstico",
    options: ["ip link show","ip neigh show","ss -tulpn","tcpdump -i any"],
    correct: 1, explanation: "ip neigh show mostra a tabela ARP, essencial para diagnóstico da Camada 2." },
  { text: "O que significa a flag [R] em uma captura de tcpdump?", badge: "🦈 Análise de Pacotes",
    options: ["SYN (início de conexão)","ACK (confirmação)","RST (conexão rejeitada)","FIN (encerramento)"],
    correct: 2, explanation: "RST (Reset) indica que a conexão foi rejeitada — geralmente firewall bloqueando ou serviço não ouvindo." },
  { text: "Qual comando captura tráfego na porta 443 e salva em arquivo para análise no Wireshark?", badge: "🦈 Análise de Pacotes",
    options: ["tcpdump -i any -nn port 443 -w captura.pcap","tcpdump -i any port 443 > captura.txt","wireshark -i any -w captura.pcap","tcpflow -p 443 -w captura.pcap"],
    correct: 0, explanation: "tcpdump -w captura.pcap salva em formato PCAP, que pode ser aberto no Wireshark." },
  { text: "Qual comando mostra as portas abertas e os serviços ouvindo no servidor?", badge: "🔧 Diagnóstico",
    options: ["iptables -L -n -v","ip route show","ss -tulpn","conntrack -L"],
    correct: 2, explanation: "ss -tulpn lista todas as portas abertas e qual processo está escutando em cada uma." },
  { text: "Qual comando verifica o handshake SSL/TLS de um servidor?", badge: "🔒 Diagnóstico SSL",
    options: ["curl -k https://site","openssl s_client -connect site:443","ss -tulpn | grep 443","tcpdump port 443"],
    correct: 1, explanation: "openssl s_client conecta e mostra todo o handshake SSL/TLS, incluindo certificado e cifras negociadas." },
  
  // ========== VPN & IPSec ==========
  { text: "Qual protocolo é usado para estabelecer e gerenciar chaves no IPSec?", badge: "🔒 VPN & IPSec",
    options: ["ESP","AH","IKE","NAT-T"],
    correct: 2, explanation: "IKE (Internet Key Exchange) é o protocolo responsável por estabelecer e gerenciar as chaves de criptografia no IPSec." },
  { text: "Qual a porta padrão do IKE (Internet Key Exchange) no IPSec?", badge: "🔒 VPN & IPSec",
    options: ["500/UDP","4500/UDP","50/ESP","51/AH"],
    correct: 0, explanation: "IKE usa a porta 500/UDP para negociação inicial. NAT-T usa a porta 4500/UDP quando há NAT no caminho." },
  { text: "O que é NAT-T (NAT Traversal) no IPSec?", badge: "🔒 VPN & IPSec",
    options: ["Técnica para acelerar a VPN","Encapsula tráfego IPSec em UDP na porta 4500","Desabilita a criptografia","Aumenta o MTU do túnel"],
    correct: 1, explanation: "NAT-T encapsula pacotes ESP em UDP na porta 4500 para que possam atravessar roteadores NAT sem problemas." },
  { text: "Qual é a versão mais moderna do IKE, que suporta MOBIKE (roaming entre redes)?", badge: "🔒 VPN & IPSec",
    options: ["IKEv1","IKEv2","IKEv3","IKE-MOBIKE"],
    correct: 1, explanation: "IKEv2 é a versão moderna, mais rápida e segura. Suporta MOBIKE, permitindo que a VPN continue ativa ao mudar de rede (ex: Wi-Fi → 4G)." },
  { text: "Qual implementação de IPSec é mais usada no Linux?", badge: "🔒 VPN & IPSec",
    options: ["OpenVPN","WireGuard","StrongSwan","ipsec-tools"],
    correct: 2, explanation: "StrongSwan é a implementação mais popular de IPSec no Linux, suportando IKEv1, IKEv2, certificados X.509 e integração com sistemas de autenticação." },
  { text: "O que é MOBIKE no contexto de VPN IPSec?", badge: "🔒 VPN & IPSec",
    options: ["Mobile IKE — permite que a VPN continue ativa ao trocar de rede","Modo de criptografia mais forte","Método de autenticação por celular","Protocolo de compressão de dados"],
    correct: 0, explanation: "MOBIKE (Mobility and Multihoming) é uma extensão do IKEv2 que permite que a VPN mantenha a conexão ativa mesmo quando o dispositivo muda de rede (ex: Wi-Fi para 4G)." }
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const { updateQuizScore, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('quiz');
  }, [trackPageVisit]);

  const handleAnswer = (optIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const score = useMemo(() => {
    let correct = 0;
    Object.entries(answers).forEach(([idx, ans]) => {
      if (ans === QUESTIONS[parseInt(idx)].correct) correct++;
    });
    return correct;
  }, [answers]);

  const percentage = Math.round((score / QUESTIONS.length) * 100);

  const finishQuiz = () => {
    setShowResult(true);
    // updateQuizScore() já dispara o useEffect no BadgeContext que desbloqueia
    // 'quiz-beginner' (>0), 'quiz-expert' (≥80) e 'quiz-master' (===100).
    // Não precisa chamar unlockBadge aqui — evita duplicidade.
    updateQuizScore(percentage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-2 border border-border rounded-2xl p-12 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8">
            <Search size={40} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Desafio Final</h1>
          <p className="text-text-2 mb-8 max-w-md mx-auto leading-relaxed">
            Teste seus conhecimentos em Firewall Linux, DNS, Proxy, SSL e VPN. 
            São <strong>{QUESTIONS.length} questões</strong> que cobrem todo o conteúdo do workshop.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-10 text-left">
            <div className="p-4 rounded-xl bg-bg-3 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Dificuldade</div>
              <div className="text-sm font-bold text-accent">Intermediário</div>
            </div>
            <div className="p-4 rounded-xl bg-bg-3 border border-border">
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Tempo Médio</div>
              <div className="text-sm font-bold text-accent">10-15 min</div>
            </div>
          </div>

          <button onClick={() => setStarted(true)} className="btn-primary w-full py-4 text-lg">
            Começar Agora
            <ChevronRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-2 border border-border rounded-2xl p-12 shadow-xl"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-8">
            <Trophy size={40} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Seu Resultado</h2>
          <div className="text-6xl font-black text-accent mb-2">{score}/{QUESTIONS.length}</div>
          <div className="text-xl font-bold text-text-2 mb-8">{percentage}% de acerto</div>
          
          <p className="text-text-3 mb-10 max-w-md mx-auto leading-relaxed">
            {percentage >= 80 
              ? '🎉 Excelente! Você domina os conceitos fundamentais de redes e firewalls Linux.' 
              : '📚 Bom trabalho! Recomendamos revisar os tópicos onde houve dúvidas para solidificar seu conhecimento.'}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={resetQuiz} className="btn-outline">
              <RefreshCw size={18} />
              Refazer Quiz
            </button>
            <Link href="/certificado" className="btn-primary">
              <Award size={18} />
              Ver Certificado
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 space-y-6 text-left">
          <h3 className="font-bold text-xl px-4">Revisão das Questões</h3>
          {QUESTIONS.map((q, i) => (
            <div key={i} className={cn(
              "p-6 rounded-xl border",
              answers[i] === q.correct ? "bg-ok/5 border-ok/20" : "bg-err/5 border-err/20"
            )}>
              <div className="flex justify-between items-start gap-4 mb-4">
                <h4 className="font-bold text-sm leading-relaxed">{i + 1}. {q.text}</h4>
                {answers[i] === q.correct ? (
                  <CheckCircle2 className="text-ok shrink-0" size={20} />
                ) : (
                  <XCircle className="text-err shrink-0" size={20} />
                )}
              </div>
              <div className="text-xs text-text-2 mb-4">
                Sua resposta: <span className={answers[i] === q.correct ? "text-ok font-bold" : "text-err font-bold"}>{q.options[answers[i]]}</span>
              </div>
              <div className="p-4 bg-bg-3 rounded-lg text-xs text-text-3 leading-relaxed border border-border/50">
                <strong className="text-accent block mb-1">Explicação:</strong>
                {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="breadcrumb mb-8">
        <Link href="/">Início</Link>
        <span>/</span>
        <span className="text-text-2">Quiz Interativo</span>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="section-label">Autoavaliação</div>
            <h1 className="text-3xl font-bold">Teste seus conhecimentos</h1>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-text-3 uppercase tracking-widest mb-1">Questão</div>
            <div className="text-2xl font-bold text-accent">{currentIdx + 1}<span className="text-text-3 text-sm font-normal">/{QUESTIONS.length}</span></div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-bg-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-bg-2 border border-border rounded-2xl p-8 shadow-sm"
        >
          <div className="question-badge mb-4">{currentQuestion.badge}</div>
          <h2 className="text-xl font-bold mb-8 leading-relaxed">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  answers[currentIdx] === i 
                    ? "bg-accent-bg border-accent text-text" 
                    : "bg-bg-3 border-border text-text-2 hover:border-accent/50 hover:text-text"
                )}
                aria-pressed={answers[currentIdx] === i}
                aria-label={`Opção ${i + 1}: ${opt}`}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  answers[currentIdx] === i 
                    ? "border-accent bg-accent text-white" 
                    : "border-border group-hover:border-accent/50"
                )}>
                  {answers[currentIdx] === i && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-medium">{opt}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <button 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn-outline px-4 py-2 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
            
            {currentIdx === QUESTIONS.length - 1 ? (
              <button 
                onClick={finishQuiz}
                disabled={answers[currentIdx] === undefined}
                className="btn-primary px-8 py-2 disabled:opacity-50"
              >
                Finalizar Quiz
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(QUESTIONS.length - 1, prev + 1))}
                disabled={answers[currentIdx] === undefined}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                Próxima
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
