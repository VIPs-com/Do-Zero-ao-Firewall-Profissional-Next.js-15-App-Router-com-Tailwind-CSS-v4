'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { Server, ServerCrash, ArrowUpCircle, ShieldCheck, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint HA — Alta Disponibilidade: clustering e failover.
   keepalived/VRRP + Pacemaker/Corosync. Alinhado a LPIC-2 / CompTIA Linux+. */

type HaTab = 'conceito' | 'cluster' | 'failover';

const CHECKLIST_ITEMS = [
  { id: 'vrrp-configurado', label: 'Configurei o keepalived com uma instância VRRP — MASTER e BACKUP — e o VIP flutua entre os 2 nós' },
  { id: 'cluster-quorum',   label: 'Subi um cluster Pacemaker + Corosync, entendi o quorum e configurei STONITH/fencing' },
  { id: 'failover-testado', label: 'Simulei a queda de um nó, observei o failover do VIP + serviço e medi o downtime' },
];

export default function AltaDisponibilidadePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<HaTab>('conceito');

  useEffect(() => {
    trackPageVisit('/alta-disponibilidade');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-alta-disponibilidade min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Alta Disponibilidade</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Infraestrutura & Resiliência</div>
          <h1 className="text-4xl font-bold mb-4">♻️ Alta Disponibilidade</h1>
          <p className="text-text-2 text-lg mb-6">
            Um servidor que cai derruba o serviço inteiro — é um <strong>SPOF</strong> (Single
            Point of Failure). <strong>Alta disponibilidade</strong> elimina esse ponto único:
            dois ou mais nós, um <strong>IP virtual flutuante</strong> e <strong>failover</strong>
            automático. Aqui você sobe um cluster real com keepalived/VRRP e com Pacemaker/Corosync.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de LPIC-2 e CompTIA Linux+.
          </p>
        </div>

        <FluxoCard
          title="O ciclo de um failover de VIP"
          steps={[
            { label: 'Nó MASTER',  sub: 'detém o VIP e serve o tráfego',   icon: <Server size={14}/>,        color: 'border-ok/50' },
            { label: 'MASTER cai', sub: 'crash, queda de link ou de host', icon: <ServerCrash size={14}/>,   color: 'border-err/50' },
            { label: 'VRRP detecta', sub: 'BACKUP para de ver os adverts', icon: <AlertTriangle size={14}/>, color: 'border-warn/50' },
            { label: 'BACKUP assume', sub: 'vira MASTER e adota o VIP',    icon: <ArrowUpCircle size={14}/>, color: 'border-accent/50' },
            { label: 'Serviço continua', sub: 'mesmo IP, downtime de segundos', icon: <CheckCircle size={14}/>, color: 'border-info/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'conceito', label: '♻️ Conceitos & VRRP' },
              { id: 'cluster',  label: '🧩 Pacemaker & Corosync' },
              { id: 'failover', label: '🔄 Failover na Prática & Testes' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as HaTab)}
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
          <h2 className="text-2xl font-bold mb-6">1. SPOF, uptime e os &quot;noves&quot;</h2>
          <p className="text-text-2 mb-4">
            Todo componente sem redundância é um <strong>SPOF</strong>: se ele cai, o serviço
            cai junto. Alta disponibilidade (HA) é a disciplina de eliminar SPOFs — no servidor,
            no link de rede, no disco, na energia. A meta se mede em <strong>uptime</strong>,
            a famosa contagem de &quot;noves&quot;:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { n: '99%',     d: '~3,65 dias de indisponibilidade por ano' },
              { n: '99,9%',   d: '~8,8 horas por ano — &quot;três noves&quot;' },
              { n: '99,99%',  d: '~52 minutos por ano — &quot;quatro noves&quot;' },
              { n: '99,999%', d: '~5 minutos por ano — &quot;cinco noves&quot;' },
            ].map((u, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-accent font-mono">{u.n}</p>
                <p className="text-text-3 mt-1 leading-snug" dangerouslySetInnerHTML={{ __html: u.d }} />
              </div>
            ))}
          </div>
          <InfoBox title="RTO e RPO — não confunda">
            <strong>RTO</strong> (Recovery Time Objective) é <em>quanto tempo</em> o serviço pode
            ficar fora antes de voltar. <strong>RPO</strong> (Recovery Point Objective) é
            <em> quantos dados</em> você aceita perder (a janela desde o último ponto consistente).
            HA ataca o RTO — failover em segundos. RPO é problema de <strong>backup</strong> e
            replicação de dados, não de cluster.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Ativo-passivo vs ativo-ativo</h2>
          <p className="text-text-2 mb-4">
            Há dois modelos de topologia HA:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Ativo-passivo</strong> — um nó trabalha, o outro espera ocioso. Na falha, o passivo assume. Simples, previsível; metade do hardware fica parado.</li>
            <li><strong>Ativo-ativo</strong> — todos os nós atendem ao mesmo tempo, com a carga dividida. Aproveita 100% do hardware e ainda balanceia, mas exige que a aplicação tolere rodar em paralelo (estado compartilhado, sessões).</li>
          </ul>
          <InfoBox title="HA não é balanceamento de carga — mas anda com ele">
            O <Link href="/haproxy" className="text-accent hover:underline">HAProxy</Link> distribui
            requisições entre vários backends (escalabilidade). Mas o próprio HAProxy vira um SPOF.
            A receita clássica é <strong>dois HAProxy</strong> num par VRRP: o balanceador fica
            altamente disponível, e ele balanceia o resto. HA cuida do balanceador; o balanceador
            cuida da carga.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. O VIP — IP virtual flutuante</h2>
          <p className="text-text-2 mb-4">
            A peça central do failover é o <strong>VIP</strong> (Virtual IP): um endereço que
            <em> não pertence</em> a nenhum nó fisicamente — ele <strong>flutua</strong>. Quem
            estiver no papel de MASTER carrega o VIP na interface e responde por ele. Clientes e
            DNS apontam sempre para o VIP, nunca para o IP real de um nó. Quando o MASTER cai,
            o VIP migra para outro nó e o cliente nem percebe a troca de máquina.
          </p>
          <WarnBox title="O VIP precisa de um ARP gratuito">
            Ao assumir o VIP, o novo MASTER envia um <strong>Gratuitous ARP</strong> avisando a
            rede &quot;este MAC agora responde por este IP&quot;. Sem isso, switches e clientes
            mantêm o MAC antigo em cache e o tráfego continua indo para o nó morto. O keepalived
            faz esse ARP automaticamente — mas firewalls/switches que filtram ARP podem atrapalhar.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. keepalived + VRRP</h2>
          <p className="text-text-2 mb-4">
            O <strong>VRRP</strong> (Virtual Router Redundancy Protocol, RFC 5798) é o protocolo
            que elege quem segura o VIP. O <strong>keepalived</strong> é a implementação Linux mais
            usada. Os conceitos: cada nó roda uma <strong>vrrp_instance</strong> com uma
            <strong> priority</strong>; o de maior prioridade vira <strong>MASTER</strong>, os
            demais ficam <strong>BACKUP</strong>. O MASTER manda <em>adverts</em> a cada
            <code> advert_int</code> segundos; se o BACKUP para de ouvi-los, ele se promove.
          </p>
          <CodeBlock lang="bash" code={`# Instalar nos DOIS nós
sudo apt update && sudo apt install -y keepalived

# Conferir o serviço
systemctl status keepalived`} />
          <p className="text-text-2 my-4">
            O <code>/etc/keepalived/keepalived.conf</code> do <strong>nó 1</strong> (MASTER):
          </p>
          <CodeBlock lang="text" title="/etc/keepalived/keepalived.conf — nó 1" code={`# Script que verifica se o serviço local está saudável
vrrp_script chk_nginx {
    script "/usr/bin/systemctl is-active --quiet nginx"
    interval 2          # roda a cada 2s
    weight  -20         # se falhar, desconta 20 da priority
    fall    2           # 2 falhas seguidas = serviço caído
    rise    2           # 2 sucessos seguidos = serviço de volta
}

vrrp_instance VI_1 {
    state           MASTER          # papel inicial deste nó
    interface       eth0            # interface por onde sai o VRRP
    virtual_router_id 51            # ID do grupo — IGUAL nos dois nós
    priority        150             # MAIOR que o do BACKUP
    advert_int      1               # 1 advert por segundo

    authentication {
        auth_type PASS
        auth_pass labsenha           # IGUAL nos dois nós
    }

    virtual_ipaddress {
        192.168.1.100/24            # o VIP flutuante
    }

    track_script {
        chk_nginx                   # se o nginx cair, a priority desce
    }
}`} />
          <p className="text-text-2 my-4">
            O <strong>nó 2</strong> (BACKUP) é quase idêntico — muda só <code>state</code> e
            <code> priority</code>:
          </p>
          <CodeBlock lang="text" title="/etc/keepalived/keepalived.conf — nó 2" code={`vrrp_instance VI_1 {
    state           BACKUP
    interface       eth0
    virtual_router_id 51            # MESMO ID do nó 1
    priority        100             # MENOR que o do MASTER
    advert_int      1

    authentication {
        auth_type PASS
        auth_pass labsenha
    }

    virtual_ipaddress {
        192.168.1.100/24            # MESMO VIP
    }
}`} />
          <InfoBox title="track_script — o coração da inteligência" className="mt-4">
            Sem <code>track_script</code>, o VRRP só detecta a queda do <em>nó</em> — não a do
            <em> serviço</em>. Se o Nginx morrer mas o host continuar de pé, o VIP fica num nó
            que não atende ninguém. O <code>weight -20</code> resolve: ao falhar o healthcheck,
            a priority do MASTER (150) cai para 130 — abaixo do BACKUP (100)? não. Por isso o
            desconto tem de ser grande o bastante (ex.: <code>weight -60</code>) para inverter
            a eleição quando o serviço local cair.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['vrrp-configurado']} onChange={e => updateChecklist('vrrp-configurado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['vrrp-configurado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('cluster') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. Quando o VRRP não basta</h2>
          <p className="text-text-2 mb-4">
            O keepalived é perfeito para mover um VIP. Mas e quando o failover precisa
            <em> orquestrar recursos</em> — montar um disco, subir um banco, mover um IP
            <strong>e</strong> garantir que o nó morto não volte corrompendo dados? Aí entra a
            stack de cluster de verdade: <strong>Corosync</strong> + <strong>Pacemaker</strong>.
          </p>
          <FluxoCard
            direction="vertical"
            title="As duas camadas do cluster"
            steps={[
              { label: 'Corosync', sub: 'mensagens + membership: quem está vivo no cluster', icon: <Server size={14}/>, color: 'border-info/50' },
              { label: 'Pacemaker', sub: 'gerente de recursos: o que roda, onde e em que ordem', icon: <ShieldCheck size={14}/>, color: 'border-accent/50' },
            ]}
          />
          <p className="text-text-2 mb-4">
            <strong>Corosync</strong> é a camada de comunicação: troca <em>heartbeats</em> entre os
            nós e mantém a lista de membros vivos (<em>membership</em>). <strong>Pacemaker</strong>
            é o cérebro: decide quais recursos (VIP, serviço, sistema de arquivos) rodam em qual
            nó e em que ordem, e reage quando algo falha. A ferramenta de linha de comando que
            controla os dois é o <code>pcs</code>.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. Criando o cluster com pcs</h2>
          <CodeBlock lang="bash" code={`# Nos DOIS nós — instalar a stack
sudo apt update
sudo apt install -y pacemaker corosync pcs

# O pacote cria o usuário 'hacluster' — defina a MESMA senha nos dois nós
sudo passwd hacluster

# Habilitar e iniciar o daemon do pcs
sudo systemctl enable --now pcsd

# A partir de UM nó — autenticar os membros do cluster
sudo pcs host auth no1 no2 -u hacluster -p SENHA

# Criar o cluster (nome 'lab-ha') e subir nos dois nós
sudo pcs cluster setup lab-ha no1 no2
sudo pcs cluster start --all
sudo pcs cluster enable --all      # sobe junto com o boot

# Conferir o estado geral
sudo pcs status`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Quorum — por que número ímpar</h2>
          <p className="text-text-2 mb-4">
            <strong>Quorum</strong> é a regra que define quantos nós precisam concordar para o
            cluster tomar decisões. A maioria simples é o padrão: num cluster de 3 nós, 2
            formam quorum. O perigo que o quorum evita é o <strong>split-brain</strong>: se a
            rede entre os nós se parte, cada lado pode achar que é o sobrevivente e ambos sobem
            o mesmo recurso — duas instâncias do banco escrevendo no mesmo dado = corrupção.
          </p>
          <WarnBox title="O problema dos clusters de 2 nós">
            Com 2 nós não existe &quot;maioria&quot;: se eles se isolam, cada um vê 1 voto de 2 —
            ninguém tem quorum, ou pior, ambos se acham donos. Por isso clusters de produção
            preferem <strong>3 nós</strong> (número ímpar quebra o empate). Quando só há 2
            servidores reais, adiciona-se um <strong>qdevice</strong>: um terceiro
            &quot;votante&quot; leve (corosync-qnetd) que roda numa máquina barata só para
            desempatar.
          </WarnBox>
          <CodeBlock lang="bash" code={`# Ver o estado do quorum
sudo pcs quorum status
sudo corosync-quorumtool -s

# Cluster de 2 nós: adicionar um qdevice como árbitro externo
sudo pcs quorum device add model net host=arbitro algorithm=ffsplit`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Recursos e constraints</h2>
          <p className="text-text-2 mb-4">
            Um <strong>recurso</strong> é qualquer coisa que o cluster gerencia: um IP, um
            serviço systemd, um sistema de arquivos. As <strong>constraints</strong> são regras
            de relacionamento entre recursos — onde podem rodar e em que ordem.
          </p>
          <CodeBlock lang="bash" code={`# Recurso 1 — o VIP (agente IPaddr2)
sudo pcs resource create VIP ocf:heartbeat:IPaddr2 \\
  ip=192.168.1.100 cidr_netmask=24 \\
  op monitor interval=10s

# Recurso 2 — o serviço Nginx (agente systemd)
sudo pcs resource create WebServer systemd:nginx \\
  op monitor interval=15s

# COLOCATION — VIP e WebServer SEMPRE no mesmo nó
sudo pcs constraint colocation add WebServer with VIP INFINITY

# ORDER — sobe o VIP ANTES do WebServer
sudo pcs constraint order VIP then WebServer

# Conferir
sudo pcs status resources
sudo pcs constraint`} />
          <InfoBox title="Colocation e order resolvem dependências" className="mt-4">
            Sem <strong>colocation</strong>, o cluster poderia pôr o VIP no nó 1 e o Nginx no
            nó 2 — serviço de pé num lugar, IP no outro. Sem <strong>order</strong>, o Nginx
            poderia tentar subir antes do IP existir e falhar no bind. As duas constraints
            fazem o failover mover o conjunto inteiro, na ordem certa.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. STONITH / fencing — obrigatório</h2>
          <p className="text-text-2 mb-4">
            <strong>STONITH</strong> — <em>Shoot The Other Node In The Head</em> — é o mecanismo
            de <strong>fencing</strong>: quando o cluster perde contato com um nó, ele não
            <em>assume</em> que o nó morreu — ele <strong>garante</strong> isso, desligando-o à
            força (via IPMI, iLO, PDU inteligente ou API do hypervisor). Só então é seguro
            promover o recurso em outro lugar.
          </p>
          <WarnBox title="Por que fencing não é opcional">
            Sem fencing, um nó &quot;perdido&quot; mas ainda vivo (rede partida) pode continuar
            escrevendo no disco compartilhado enquanto o cluster sobe o mesmo recurso noutro
            nó. Resultado: <strong>corrupção de dados</strong>. Por isso o Pacemaker, por padrão,
            <strong> bloqueia recursos</strong> quando não há STONITH configurado. Desligar o
            STONITH (<code>pcs property set stonith-enabled=false</code>) é aceitável <em>só</em>
            num lab isolado — nunca em produção.
          </WarnBox>
          <CodeBlock lang="bash" code={`# Listar agentes de fencing disponíveis
sudo pcs stonith list

# Exemplo — fencing por IPMI (placa de gerência do servidor)
sudo pcs stonith create fence-no2 fence_ipmilan \\
  pcmk_host_list=no2 ip=10.0.0.2 \\
  username=admin password=SENHA lanplus=1

# Em LAB ISOLADO apenas, sem hardware de fencing:
sudo pcs property set stonith-enabled=false   # NUNCA em produção`} />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['cluster-quorum']} onChange={e => updateChecklist('cluster-quorum', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['cluster-quorum'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('failover') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. O cluster de 2 nós em ação</h2>
          <p className="text-text-2 mb-4">
            Cenário do lab: dois nós (<code>no1</code> e <code>no2</code>) servem um site Nginx
            atrás do VIP <code>192.168.1.100</code>. Você pode montar isso com
            <strong> keepalived</strong> (só o VIP migra; o Nginx roda nos dois) ou com
            <strong> Pacemaker</strong> (VIP + serviço migram juntos via colocation). Vamos testar
            o failover e <strong>medir o downtime</strong>.
          </p>
          <CodeBlock lang="bash" code={`# De uma terceira máquina (cliente), bombardeie o VIP em loop
while true; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" \\
    http://192.168.1.100/ || echo "FALHOU"
  sleep 0.5
done

# Deixe esse loop rodando numa janela. Em outra, derrube o MASTER:`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. Simulando a queda</h2>
          <p className="text-text-2 mb-4">
            Há três formas de provocar um failover, da mais suave à mais brutal:
          </p>
          <CodeBlock lang="bash" code={`# (A) Parar o serviço — o track_script / monitor detecta e baixa a priority
sudo systemctl stop nginx                 # no nó MASTER

# (B) Pacemaker: colocar o nó em standby (failover planejado e limpo)
sudo pcs node standby no1
sudo pcs node unstandby no1               # devolve o nó ao cluster

# (C) Derrubar a rede do nó — simula uma falha de verdade
sudo ip link set eth0 down                # o nó some do cluster

# (D) O teste definitivo — desligar o nó MASTER de uma vez
sudo poweroff`} />
          <p className="text-text-2 my-4">
            Acompanhe o failover no nó sobrevivente:
          </p>
          <CodeBlock lang="bash" code={`# Quem está com o VIP agora?
ip -br addr show eth0 | grep 192.168.1.100

# keepalived — ver a transição MASTER/BACKUP no log
sudo journalctl -u keepalived -f

# Pacemaker — acompanhar o estado dos recursos ao vivo
sudo pcs status
sudo crm_mon -1                           # snapshot do cluster`} />
          <InfoBox title="Lendo o downtime no loop do curl" className="mt-4">
            No loop do cliente você verá uma rajada de <code>FALHOU</code> ou códigos de erro
            durante a janela do failover — tipicamente <strong>1 a 5 segundos</strong> com
            keepalived/VRRP bem ajustado. Conte as linhas falhas × 0,5s para estimar o RTO real.
            Um failover saudável volta sozinho ao <code>200</code> sem você tocar em nada.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. Healthchecks e track_script</h2>
          <p className="text-text-2 mb-4">
            Failover só vale se for <strong>disparado pela coisa certa</strong>. Um healthcheck
            que só verifica &quot;o host responde a ping&quot; é fraco — o host pode estar de pé
            com o serviço travado. Bons healthchecks testam o <em>serviço</em>:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>keepalived</strong> — <code>vrrp_script</code> com <code>systemctl is-active</code> ou um <code>curl</code> a uma rota <code>/health</code> da aplicação.</li>
            <li><strong>Pacemaker</strong> — a operação <code>op monitor interval=Ns</code> de cada recurso; o agente OCF sabe checar o recurso de verdade.</li>
            <li><strong>Intervalo</strong> — curto demais gera failover por soluço de rede; longo demais aumenta o downtime. 1–2s para o VRRP, 10–15s para monitores de serviço é um bom ponto de partida.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">13. Armadilhas do failover</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            {[
              { i: '🧠', t: 'Split-brain', d: 'Rede partida + sem fencing = dois MASTER. Quorum + STONITH são a defesa.' },
              { i: '🚧', t: 'Fencing mal configurado', d: 'STONITH com credenciais erradas trava o failover: o cluster espera fence que nunca conclui.' },
              { i: '🔁', t: 'VIP duplicado', d: 'Dois nós com o mesmo VIP ao mesmo tempo geram conflito ARP — o tráfego oscila.' },
              { i: '⚖️', t: 'Priority igual', d: 'No VRRP, prioridades idênticas tornam a eleição imprevisível — defina valores distintos.' },
            ].map((a, i) => (
              <div key={i} className="p-3 rounded-lg bg-bg-2 border border-border">
                <p className="font-bold text-text"><span aria-hidden="true">{a.i}</span> {a.t}</p>
                <p className="text-text-3 mt-1 leading-snug">{a.d}</p>
              </div>
            ))}
          </div>
          <WarnBox title="HA não substitui backup">
            Um cluster replica a <em>disponibilidade</em>, não protege contra <em>erro humano</em>
            nem corrupção lógica. Se você apagar uma tabela por engano, o failover só te dá a
            tabela apagada num nó saudável — rapidinho. HA cobre RTO; <strong>backup</strong> (e
            seu RPO) é outra disciplina, complementar e igualmente obrigatória.
          </WarnBox>

          <WindowsComparisonBox
            windowsLabel="Windows Server (WSFC)"
            linuxLabel="Linux (Pacemaker / Corosync)"
            windowsCode={`# Windows Server Failover Clustering (WSFC)
# - Failover Cluster Manager: GUI do cluster
# - Witness (disco/share/cloud) = quorum / desempate
# - Cluster Shared Volumes (CSV) p/ armazenamento
# - Roles: serviços que migram entre nós
New-Cluster -Name lab -Node no1,no2
Add-ClusterResource ...
# Fencing implícito via gerência do hardware/Hyper-V`}
            linuxCode={`# Pacemaker + Corosync — equivalente open source
sudo pcs cluster setup lab-ha no1 no2
sudo pcs resource create VIP ocf:heartbeat:IPaddr2 ...
sudo pcs constraint colocation add WebServer with VIP INFINITY
# qdevice  ≈  Witness   |   STONITH  ≈  fencing
# pcs status            ≈  Failover Cluster Manager`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['failover-testado']} onChange={e => updateChecklist('failover-testado', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['failover-testado'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Split-brain por rodar o cluster sem fencing', sol: 'Sem STONITH, uma rede partida deixa dois nós se achando MASTER e escrevendo no mesmo dado. Configure fencing real (IPMI/iLO/PDU/hypervisor) — desligá-lo só em lab isolado.' },
              { erro: 'Cluster de 2 nós perde quorum quando um nó cai', sol: 'Com 2 nós não há maioria: a perda de um deixa o outro sem quorum. Adicione um qdevice (corosync-qnetd) como terceiro votante, ou use 3 nós reais.' },
              { erro: 'O VIP não migra — firewall bloqueia o VRRP', sol: 'O VRRP usa o protocolo IP 112 e o grupo multicast 224.0.0.18. Libere-os no iptables/nftables: sem isso os adverts não chegam e o BACKUP nunca vê o MASTER.' },
              { erro: 'keepalived com a mesma priority nos dois nós', sol: 'Prioridades idênticas tornam a eleição VRRP imprevisível e podem causar oscilação do VIP. Dê valores distintos (ex.: 150 no MASTER, 100 no BACKUP) e use track_script com weight para o failover por serviço.' },
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
              <p className="font-bold text-text mb-2">🧪 Lab 1 — VIP flutuante com keepalived</p>
              <p className="text-sm text-text-2 mb-3">
                Suba dois nós Linux na mesma rede. Instale o keepalived nos dois, configure a
                <code> vrrp_instance VI_1</code> (MASTER priority 150, BACKUP priority 100,
                mesmo <code>virtual_router_id</code> e <code>auth_pass</code>) com o VIP
                <code> 192.168.1.100</code>. Confirme com <code>ip -br addr</code> que só o
                MASTER carrega o VIP. Pare o keepalived no MASTER e verifique que o VIP migrou
                para o BACKUP.
              </p>
              <CodeBlock lang="bash" code={`sudo apt install -y keepalived
sudo systemctl enable --now keepalived
ip -br addr show eth0          # o VIP deve aparecer só no MASTER
sudo systemctl stop keepalived # no MASTER — observe a migração
sudo journalctl -u keepalived -f`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — Cluster Pacemaker com VIP + Nginx</p>
              <p className="text-sm text-text-2 mb-3">
                Instale <code>pacemaker corosync pcs</code> nos dois nós, autentique com
                <code> pcs host auth</code> e crie o cluster com <code>pcs cluster setup</code>.
                Crie o recurso <code>VIP</code> (IPaddr2) e o <code>WebServer</code> (systemd:nginx),
                amarre-os com <code>colocation INFINITY</code> e ordene VIP → WebServer. Em lab,
                ajuste <code>stonith-enabled=false</code> e confirme que ambos rodam no mesmo nó.
              </p>
              <CodeBlock lang="bash" code={`sudo pcs cluster setup lab-ha no1 no2
sudo pcs cluster start --all
sudo pcs property set stonith-enabled=false   # só em lab
sudo pcs resource create VIP ocf:heartbeat:IPaddr2 \\
  ip=192.168.1.100 cidr_netmask=24 op monitor interval=10s
sudo pcs resource create WebServer systemd:nginx op monitor interval=15s
sudo pcs constraint colocation add WebServer with VIP INFINITY
sudo pcs constraint order VIP then WebServer
sudo pcs status`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — Failover cronometrado</p>
              <p className="text-sm text-text-2 mb-3">
                De uma terceira máquina, rode o loop de <code>curl</code> contra o VIP medindo
                <code> time_total</code>. Provoque o failover de três formas — <code>pcs node
                standby</code> (planejado), <code>systemctl stop nginx</code> (falha de serviço)
                e <code>ip link set eth0 down</code> (falha de rede). Para cada caso, conte as
                requisições falhas e estime o RTO. Documente qual cenário foi mais rápido e por quê.
              </p>
              <CodeBlock lang="bash" code={`# cliente — loop de medição
while true; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" \\
    http://192.168.1.100/ || echo FALHOU
  sleep 0.5
done

# nó MASTER — provoque cada cenário e cronometre
sudo pcs node standby no1
sudo systemctl stop nginx
sudo ip link set eth0 down`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/alta-disponibilidade" />

      </div>
    </main>
  );
}
