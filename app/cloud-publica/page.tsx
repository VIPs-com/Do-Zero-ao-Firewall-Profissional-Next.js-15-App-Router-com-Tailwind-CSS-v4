'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { UserCog, FileLock2, KeyRound, Boxes, Network, Server, AlertOctagon, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTabFilter } from '@/hooks/useTabFilter';

/* Sprint CLOUD — Cloud Pública (AWS na prática): IAM, VPC e Compute/Deploy.
   Alinhado aos objetivos de AWS Cloud Practitioner e Solutions Architect Associate. */

type CloudTab = 'iam' | 'vpc' | 'deploy';

const CHECKLIST_ITEMS = [
  { id: 'cloud-iam',    label: 'Configurei a AWS CLI, criei um usuário IAM com MFA e apliquei uma policy de menor privilégio — sem usar a conta root' },
  { id: 'cloud-vpc',    label: 'Montei uma VPC com subnet pública e privada, Internet Gateway e NAT Gateway, e entendi Security Group vs Network ACL' },
  { id: 'cloud-deploy', label: 'Subi uma EC2 atrás de um Security Group, criei um bucket S3 e configurei um billing alarm' },
];

export default function CloudPublicaPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();
  const { isActive, setActiveTab } = useTabFilter<CloudTab>('iam');

  useEffect(() => {
    trackPageVisit('/cloud-publica');
    window.scrollTo(0, 0);
  }, [trackPageVisit]);

  return (
    <main className="module-accent-cloud-publica min-h-screen bg-bg text-text">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <nav className="flex items-center gap-2 text-sm text-text-3 mb-8 module-hero">
          <Link href="/" className="hover:text-accent transition-colors">Início</Link>
          <span>/</span>
          <span className="text-text-2">Avançados</span>
          <span>/</span>
          <span className="text-text-2">Cloud Pública</span>
        </nav>

        <div className="mb-10">
          <div className="section-label mb-3">Avançados · Carreira & Cloud</div>
          <h1 className="text-4xl font-bold mb-4">☁️ Cloud Pública (AWS na prática)</h1>
          <p className="text-text-2 text-lg mb-6">
            O servidor que você endureceu no laboratório agora roda na infraestrutura de
            outra pessoa — só que <em>você</em> continua responsável por ele. A <strong>nuvem
            pública</strong> aluga computação, rede e armazenamento sob demanda. Aqui você sai do
            zero na <strong>AWS</strong>: identidade com <strong>IAM</strong>, rede com
            <strong> VPC</strong> e o seu primeiro deploy com <strong>EC2 + S3</strong>.
          </p>
          <p className="text-text-3 text-sm">
            Conteúdo alinhado aos objetivos de AWS Cloud Practitioner e Solutions Architect Associate.
          </p>
        </div>

        <FluxoCard
          title="Como a AWS decide se você pode tocar num recurso"
          steps={[
            { label: 'Identidade',  sub: 'usuário, grupo ou role IAM',          icon: <UserCog size={14}/>,  color: 'border-info/50' },
            { label: 'Policy',      sub: 'documento JSON: Allow / Deny',         icon: <FileLock2 size={14}/>, color: 'border-accent/50' },
            { label: 'Permissão',   sub: 'a ação é avaliada na requisição',     icon: <KeyRound size={14}/>,  color: 'border-warn/50' },
            { label: 'Recurso',     sub: 'EC2, S3, VPC… acessado ou negado',    icon: <Boxes size={14}/>,     color: 'border-ok/50' },
          ]}
        />

        <div className="max-w-4xl mx-auto border-b border-border mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'iam',    label: '☁️ Conceitos & IAM' },
              { id: 'vpc',    label: '🌐 VPC & Rede' },
              { id: 'deploy', label: '🚀 Compute & Deploy' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CloudTab)}
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
        {isActive('iam') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">1. O que é cloud pública — IaaS, PaaS, SaaS</h2>
          <p className="text-text-2 mb-4">
            Cloud pública é infraestrutura de TI alugada de um provedor (AWS, Azure, GCP) e
            paga por uso. Em vez de comprar servidores, você os <em>provisiona</em> em minutos e
            os desliga quando não precisa. O grau de controle que sobra para você define o modelo:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>IaaS</strong> (Infraestrutura como Serviço) — você aluga a máquina virtual crua e cuida do SO para cima. É o seu mundo: <code>EC2</code>, VPC, discos. Máximo controle, máxima responsabilidade.</li>
            <li><strong>PaaS</strong> (Plataforma como Serviço) — você entrega só o código; o provedor cuida do SO, runtime e escala. Ex.: <code>AWS Elastic Beanstalk</code>, bancos gerenciados <code>RDS</code>.</li>
            <li><strong>SaaS</strong> (Software como Serviço) — você apenas usa o software pronto pelo navegador. Ex.: Gmail, Microsoft 365. Zero infraestrutura para gerenciar.</li>
          </ul>
          <InfoBox title="A analogia da pizza">
            IaaS é comprar a massa e os ingredientes — você monta e assa. PaaS é a pizza
            congelada — você só leva ao forno. SaaS é o delivery — chega pronta. Quanto mais
            &quot;como serviço&quot;, menos trabalho operacional, menos controle fino.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">2. Responsabilidade compartilhada</h2>
          <p className="text-text-2 mb-4">
            O erro mental mais caro do iniciante em cloud é achar que &quot;a AWS cuida da
            segurança&quot;. O <strong>Modelo de Responsabilidade Compartilhada</strong> divide
            claramente: a AWS é responsável pela <strong>segurança DA nuvem</strong>; você é
            responsável pela <strong>segurança NA nuvem</strong>.
          </p>
          <FluxoCard
            direction="vertical"
            title="Quem responde pelo quê"
            steps={[
              { label: 'AWS — segurança DA nuvem', sub: 'datacenter, hardware, hypervisor, rede física', icon: <Server size={14}/>, color: 'border-info/50' },
              { label: 'Você — segurança NA nuvem', sub: 'SO, patches, firewall, IAM, dados, criptografia', icon: <UserCog size={14}/>, color: 'border-err/50' },
            ]}
          />
          <WarnBox title="O bucket vazado é sempre culpa do cliente">
            A AWS garante que o datacenter não pega fogo e que o hypervisor está íntegro. Mas se
            você deixa um <strong>S3 público</strong>, abre o <code>0.0.0.0/0</code> num Security
            Group ou usa senha fraca no IAM, o vazamento é <strong>seu</strong> — está do seu
            lado da linha. Patches do SO numa EC2? Seus. Criptografia dos dados? Sua.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">3. Regiões, Zonas de Disponibilidade e custos</h2>
          <p className="text-text-2 mb-4">
            A AWS é geograficamente distribuída. Uma <strong>Região</strong> é uma área do mundo
            (ex.: <code>sa-east-1</code>, São Paulo). Cada região contém várias <strong>Zonas de
            Disponibilidade (AZ)</strong> — datacenters isolados entre si, mas próximos. Distribuir
            uma aplicação por <strong>múltiplas AZs</strong> é a base da alta disponibilidade na
            nuvem: se um datacenter cai, os outros seguem.
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Região</strong> — escolha pela proximidade dos usuários (latência), preço e requisitos legais de dados (soberania).</li>
            <li><strong>AZ</strong> — datacenter independente dentro da região; falhas não se propagam entre AZs.</li>
            <li><strong>Free Tier</strong> — a AWS oferece um nível gratuito por 12 meses (ex.: 750h/mês de EC2 <code>t2.micro</code>, 5 GB de S3). Ótimo para aprender — desde que você não estoure os limites.</li>
            <li><strong>Modelo de custo</strong> — você paga pelo que usa: hora de instância ligada, GB armazenado, GB de tráfego de saída. Recurso esquecido ligado = fatura crescendo sozinha.</li>
          </ul>
          <InfoBox title="Free Tier não é 'de graça para sempre'">
            O Free Tier expira em 12 meses e tem cotas mensais. Passar do limite gera cobrança
            normal. Sempre configure um <strong>billing alarm</strong> (veja a aba Deploy) para
            ser avisado antes da fatura surpreender.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">4. Instalando e configurando a AWS CLI</h2>
          <p className="text-text-2 mb-4">
            Você já domina o terminal — então a <strong>AWS CLI</strong> é o caminho natural:
            tudo o que o Console web faz, a CLI faz de forma scriptável e auditável.
          </p>
          <CodeBlock lang="bash" code={`# Instalar a AWS CLI v2 no Linux (x86_64)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Conferir a versão
aws --version          # aws-cli/2.x.x ...

# Configurar credenciais — cole a Access Key do SEU usuário IAM (nunca da root)
aws configure
# AWS Access Key ID     [None]: AKIA...
# AWS Secret Access Key [None]: ****
# Default region name   [None]: sa-east-1
# Default output format [None]: json

# Testar — quem sou eu nesta conta?
aws sts get-caller-identity`} />
          <WarnBox title="A Secret Access Key aparece UMA vez" className="mt-4">
            Ao criar uma Access Key no IAM, a <em>Secret</em> é exibida só naquele momento. Se
            você perder, não há como recuperá-la — só gerar uma nova e revogar a antiga. Nunca
            comite chaves em repositório; o GitHub varre e bots exploram em minutos.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">5. IAM — identidade e menor privilégio</h2>
          <p className="text-text-2 mb-4">
            O <strong>IAM</strong> (Identity and Access Management) controla <em>quem</em> pode
            fazer <em>o quê</em> na sua conta. Os blocos:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Usuário</strong> — uma identidade para uma pessoa ou aplicação. Tem senha (Console) e/ou Access Keys (CLI/API).</li>
            <li><strong>Grupo</strong> — um conjunto de usuários. Você anexa policies ao grupo e todos os membros herdam — gerência em escala.</li>
            <li><strong>Role</strong> — identidade <em>temporária</em>, assumida por quem precisar (uma EC2, um serviço, outra conta). Sem senha nem chave fixa: credenciais rotacionadas automaticamente.</li>
            <li><strong>Policy</strong> — documento JSON que lista permissões (<code>Allow</code>/<code>Deny</code>). É o que define o acesso de verdade.</li>
          </ul>
          <p className="text-text-2 mb-4">
            Uma policy JSON de <strong>menor privilégio</strong> — só leitura num bucket específico:
          </p>
          <CodeBlock lang="json" title="policy-s3-readonly.json" code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LeituraSomenteNesteBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::meu-bucket-do-lab",
        "arn:aws:s3:::meu-bucket-do-lab/*"
      ]
    }
  ]
}`} />
          <CodeBlock lang="bash" title="Criando usuário, grupo e policy pela CLI" code={`# Criar um grupo e anexar a policy a ele
aws iam create-group --group-name devs-lab
aws iam put-group-policy --group-name devs-lab \\
  --policy-name s3-readonly \\
  --policy-document file://policy-s3-readonly.json

# Criar o usuário e colocá-lo no grupo (herda a policy)
aws iam create-user --user-name aluno-lab
aws iam add-user-to-group --user-name aluno-lab --group-name devs-lab

# Gerar Access Keys para esse usuário (use na AWS CLI dele)
aws iam create-access-key --user-name aluno-lab`} />
          <WarnBox title="NUNCA use a conta root no dia a dia" className="mt-4">
            A conta <strong>root</strong> (o e-mail que criou a conta AWS) tem poder absoluto e
            ilimitado — inclusive fechar a conta e mexer no faturamento. Se a root vaza, acabou.
            Use a root <em>uma vez</em> para criar seu primeiro usuário IAM admin, <strong>ative
            MFA na root</strong>, e nunca mais entre com ela. O dia a dia é sempre via usuário/role
            IAM com permissões mínimas — princípio do <strong>menor privilégio</strong>.
          </WarnBox>
          <InfoBox title="MFA — a segunda camada" className="mt-4">
            Ative <strong>MFA</strong> (autenticação multifator) na root e em todo usuário IAM com
            acesso ao Console. Mesmo que a senha vaze, sem o segundo fator (app TOTP, chave física)
            o atacante não entra. É a mesma lógica do módulo de SSH com 2FA, aplicada à nuvem.
          </InfoBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['cloud-iam']} onChange={e => updateChecklist('cloud-iam', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['cloud-iam'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[0].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 2 ── */}
        {isActive('vpc') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">6. VPC — sua rede virtual isolada</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>VPC</strong> (Virtual Private Cloud) é uma rede virtual privada e isolada
            dentro da AWS — o seu próprio &quot;datacenter lógico&quot; na nuvem. É o equivalente
            cloud da rede que você montou no laboratório com WAN/DMZ/LAN: nada de fora entra sem
            você abrir explicitamente.
          </p>
          <p className="text-text-2 mb-4">
            Ao criar a VPC você define o <strong>CIDR</strong> dela — o bloco de IPs privados que
            ela ocupa, ex.: <code>10.0.0.0/16</code> (65.536 endereços). Dentro desse bloco você
            recorta <strong>subnets</strong> menores.
          </p>
          <CodeBlock lang="bash" code={`# Criar a VPC com o bloco CIDR 10.0.0.0/16
aws ec2 create-vpc --cidr-block 10.0.0.0/16 \\
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=vpc-lab}]'

# Listar VPCs da conta
aws ec2 describe-vpcs --query 'Vpcs[].{Id:VpcId,Cidr:CidrBlock}' --output table`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">7. Subnets públicas vs privadas</h2>
          <p className="text-text-2 mb-4">
            Uma <strong>subnet</strong> é um pedaço do CIDR da VPC, e cada subnet vive numa AZ.
            O que define se ela é &quot;pública&quot; ou &quot;privada&quot; é a rota de saída:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Subnet pública</strong> — tem uma rota para o <strong>Internet Gateway</strong>. Recursos aqui podem receber IP público e falar com a internet nos dois sentidos. É onde fica o servidor web, o balanceador.</li>
            <li><strong>Subnet privada</strong> — <em>sem</em> rota direta para a internet. Recursos aqui (banco de dados, backend) ficam escondidos. Se precisarem <em>sair</em> (baixar pacotes, chamar uma API), saem via <strong>NAT Gateway</strong> — mas ninguém de fora os alcança.</li>
          </ul>
          <FluxoCard
            title="O caminho do tráfego numa VPC"
            steps={[
              { label: 'Internet',        sub: 'mundo externo',                   icon: <Network size={14}/>, color: 'border-info/50' },
              { label: 'Internet Gateway', sub: 'entrada/saída da subnet pública', icon: <Network size={14}/>, color: 'border-accent/50' },
              { label: 'Subnet pública',  sub: 'web server, IP público',          icon: <Server size={14}/>,  color: 'border-ok/50' },
              { label: 'NAT Gateway',     sub: 'só saída p/ a subnet privada',    icon: <Network size={14}/>, color: 'border-warn/50' },
              { label: 'Subnet privada',  sub: 'banco de dados, sem IP público',  icon: <Server size={14}/>,  color: 'border-err/50' },
            ]}
          />
          <InfoBox title="Internet Gateway vs NAT Gateway">
            O <strong>Internet Gateway (IGW)</strong> é uma porta de mão dupla: liga a subnet
            pública à internet nos dois sentidos. O <strong>NAT Gateway</strong> é de mão única
            para fora: deixa a subnet privada <em>iniciar</em> conexões de saída, mas bloqueia
            qualquer conexão vinda de fora — exatamente o papel do <code>MASQUERADE</code> que
            você fez com iptables, agora como serviço gerenciado.
          </InfoBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">8. Route tables</h2>
          <p className="text-text-2 mb-4">
            Cada subnet está associada a uma <strong>route table</strong> — a tabela que diz para
            onde o tráfego vai. É o <code>ip route</code> da VPC. A diferença entre uma subnet
            pública e uma privada está, no fundo, em uma única linha da tabela de rotas:
          </p>
          <CodeBlock lang="text" title="Route table de uma subnet PÚBLICA" code={`Destino           Alvo
10.0.0.0/16       local              # tráfego interno da VPC
0.0.0.0/0         igw-0abc123        # TUDO o resto → Internet Gateway`} />
          <CodeBlock lang="text" title="Route table de uma subnet PRIVADA" code={`Destino           Alvo
10.0.0.0/16       local              # tráfego interno da VPC
0.0.0.0/0         nat-0def456        # saída → NAT Gateway (sem entrada de fora)`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">9. Security Group vs Network ACL</h2>
          <p className="text-text-2 mb-4">
            A AWS oferece <strong>dois</strong> firewalls na VPC, em camadas diferentes — e a
            melhor forma de entendê-los é pelo paralelo com o <code>iptables</code> que você já domina.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
            <div className="p-4 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-1"><span aria-hidden="true">🛡️</span> Security Group</p>
              <p className="text-text-3 leading-snug">
                Firewall <strong>no nível da instância</strong> (a placa de rede da EC2).
                É <strong>stateful</strong>: se você permite a entrada, a resposta sai
                automaticamente. Só tem regras de <em>Allow</em> — o que não foi permitido é
                negado. Equivale a um <code>iptables</code> com <code>conntrack</code> e política
                <code> DROP</code>.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-1"><span aria-hidden="true">🚧</span> Network ACL</p>
              <p className="text-text-3 leading-snug">
                Firewall <strong>no nível da subnet</strong> (vale para tudo dentro dela).
                É <strong>stateless</strong>: não lembra conexões — você precisa liberar a
                entrada <em>e</em> a saída (incluindo portas efêmeras). Tem regras de
                <em> Allow</em> e <em>Deny</em>, avaliadas por número. É o <code>iptables</code>
                cru, sem <code>conntrack</code>.
              </p>
            </div>
          </div>
          <CodeBlock lang="bash" code={`# Criar um Security Group para um web server
aws ec2 create-security-group --group-name sg-web --vpc-id vpc-0abc \\
  --description "Web server: HTTP/HTTPS publico, SSH restrito"

# Liberar HTTP e HTTPS para qualquer origem
aws ec2 authorize-security-group-ingress --group-id sg-0web \\
  --protocol tcp --port 80  --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-0web \\
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# SSH SÓ do seu IP — nunca 0.0.0.0/0 na porta 22
aws ec2 authorize-security-group-ingress --group-id sg-0web \\
  --protocol tcp --port 22 --cidr 203.0.113.10/32`} />
          <WarnBox title="Stateless exige liberar os dois sentidos" className="mt-4">
            Numa <strong>Network ACL</strong>, permitir a entrada na porta 80 não basta: a
            resposta sai por uma <em>porta efêmera</em> (1024–65535). Se você não liberar essa
            faixa na saída, a conexão funciona &quot;só metade&quot;. No Security Group isso é
            automático — por isso ele é o firewall do dia a dia, e a NACL é uma defesa extra de
            subnet.
          </WarnBox>

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['cloud-vpc']} onChange={e => updateChecklist('cloud-vpc', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['cloud-vpc'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[1].label}</span>
            </div>
          </label>
        </section>

        </>)}

        {/* ── TAB 3 ── */}
        {isActive('deploy') && (<>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">10. EC2 — sua máquina virtual</h2>
          <p className="text-text-2 mb-4">
            <strong>EC2</strong> (Elastic Compute Cloud) é o serviço de máquinas virtuais da AWS —
            o IaaS clássico. Conceitos para o seu primeiro deploy:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Instância</strong> — a VM em si, criada a partir de um tipo e uma imagem.</li>
            <li><strong>Tipo / família</strong> — o tamanho da VM. As famílias agrupam por perfil: <code>t</code> (uso geral, burstable, ótimo para lab — <code>t2.micro</code> é Free Tier), <code>c</code> (otimizada para CPU), <code>r</code> (memória), <code>m</code> (equilibrada).</li>
            <li><strong>AMI</strong> (Amazon Machine Image) — a imagem de disco base: Ubuntu, Amazon Linux, Debian. Define o SO que sobe.</li>
            <li><strong>Key pair</strong> — o par de chaves SSH. A AWS guarda a pública; você baixa a privada <code>.pem</code> e acessa com <code>ssh -i</code>.</li>
            <li><strong>User-data</strong> — um script que roda <em>uma vez</em> no primeiro boot — perfeito para instalar e configurar a aplicação automaticamente (bootstrap).</li>
          </ul>
          <CodeBlock lang="bash" code={`# Criar um key pair e salvar a chave privada com permissão correta
aws ec2 create-key-pair --key-name lab-key \\
  --query 'KeyMaterial' --output text > lab-key.pem
chmod 400 lab-key.pem

# Subir uma EC2 t2.micro (Free Tier) na subnet pública, com o SG sg-0web
aws ec2 run-instances \\
  --image-id ami-0abc123 \\
  --instance-type t2.micro \\
  --key-name lab-key \\
  --subnet-id subnet-0pub \\
  --security-group-ids sg-0web \\
  --user-data file://bootstrap.sh \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=web-lab}]'

# Conectar via SSH (IP público da instância)
ssh -i lab-key.pem ubuntu@<IP-PUBLICO>`} />
          <p className="text-text-2 my-4">
            O <code>bootstrap.sh</code> passado no <strong>user-data</strong> — sobe um web server
            sozinho no primeiro boot:
          </p>
          <CodeBlock lang="bash" title="bootstrap.sh — executado uma vez no primeiro boot" code={`#!/bin/bash
apt-get update -y
apt-get install -y nginx
echo "<h1>Deploy na AWS — host $(hostname)</h1>" > /var/www/html/index.html
systemctl enable --now nginx`} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">11. S3 — armazenamento de objetos</h2>
          <p className="text-text-2 mb-4">
            <strong>S3</strong> (Simple Storage Service) guarda <strong>objetos</strong> (arquivos
            + metadados) dentro de <strong>buckets</strong>. Não é um disco que você monta — é um
            armazenamento acessado por API/HTTP, com durabilidade altíssima. Recursos-chave:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Bucket</strong> — o &quot;contêiner&quot; com nome <em>globalmente único</em> em toda a AWS.</li>
            <li><strong>Política de bucket</strong> — JSON que controla quem acessa o quê (mesma linguagem das policies IAM).</li>
            <li><strong>Versionamento</strong> — guarda cada versão de um objeto; protege contra sobrescrita e exclusão acidental.</li>
            <li><strong>Hospedagem de site estático</strong> — o S3 pode servir HTML/CSS/JS direto, sem nenhum servidor.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Criar um bucket (nome único globalmente)
aws s3 mb s3://meu-bucket-do-lab-2026 --region sa-east-1

# Ativar versionamento
aws s3api put-bucket-versioning --bucket meu-bucket-do-lab-2026 \\
  --versioning-configuration Status=Enabled

# Enviar e listar objetos
aws s3 cp index.html s3://meu-bucket-do-lab-2026/
aws s3 ls s3://meu-bucket-do-lab-2026/

# Hospedar um site estático
aws s3 website s3://meu-bucket-do-lab-2026/ --index-document index.html`} />
          <WarnBox title="Bucket público é o vazamento nº 1 da nuvem" className="mt-4">
            Por padrão a AWS bloqueia acesso público a buckets (<strong>Block Public Access</strong>).
            Mantenha esse bloqueio ligado. Só desative — e com política de bucket explícita — se
            for realmente um site estático público. Inúmeros vazamentos de dados começaram com um
            S3 &quot;só de teste&quot; aberto por engano.
          </WarnBox>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">12. Billing alarms e boas práticas de custo</h2>
          <p className="text-text-2 mb-4">
            Na nuvem, o relógio do faturamento nunca para. A disciplina de custo é parte do
            trabalho do sysadmin moderno (<strong>FinOps</strong>). O básico para não tomar susto:
          </p>
          <ul className="space-y-2 text-text-2 mb-4 list-disc pl-5">
            <li><strong>Billing alarm</strong> — crie um alarme no CloudWatch que dispara um e-mail quando a estimativa de gasto passa de um valor (ex.: US$ 5). É a sua rede de segurança.</li>
            <li><strong>Desligue o que não usa</strong> — instância de lab parada continua cobrando o disco; instância ligada cobra a hora. <code>aws ec2 stop-instances</code> ao fim do dia.</li>
            <li><strong>Fique no Free Tier</strong> — <code>t2.micro</code>, volumes pequenos, sem NAT Gateway esquecido (ele cobra por hora <em>e</em> por GB).</li>
            <li><strong>Cost Explorer</strong> — revise periodicamente onde o dinheiro está indo; recursos órfãos (Elastic IPs não associados, volumes soltos) somam.</li>
          </ul>
          <CodeBlock lang="bash" code={`# Criar um billing alarm: avisa se o gasto estimado passar de US$ 5
# (1) inscreva seu e-mail num tópico SNS
aws sns create-topic --name alertas-billing
aws sns subscribe --topic-arn arn:aws:sns:us-east-1:123:alertas-billing \\
  --protocol email --notification-endpoint voce@exemplo.com

# (2) crie o alarme sobre a métrica EstimatedCharges
aws cloudwatch put-metric-alarm \\
  --alarm-name billing-acima-de-5usd \\
  --namespace AWS/Billing --metric-name EstimatedCharges \\
  --dimensions Name=Currency,Value=USD \\
  --statistic Maximum --period 21600 --evaluation-periods 1 \\
  --threshold 5 --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:123:alertas-billing

# Ao terminar o lab — desligue a instância
aws ec2 stop-instances --instance-ids i-0abc123`} />
          <InfoBox title="Parar não é terminar" className="mt-4">
            <code>stop-instances</code> desliga a VM (para de cobrar a CPU) mas mantém o disco —
            e o disco continua custando. <code>terminate-instances</code> destrói tudo. Para um
            lab que você não vai mais usar, <strong>terminate</strong>; para pausar entre sessões,
            <strong> stop</strong>.
          </InfoBox>

          <WindowsComparisonBox
            windowsLabel="Microsoft Azure (Portal / az CLI)"
            linuxLabel="Amazon AWS (Console / aws CLI)"
            windowsCode={`# Azure — mesmos conceitos, outros nomes
az login                          # autenticar
az group create -n rg-lab -l eastus
az network vnet create ...        # VNet  = rede virtual
# NSG (Network Security Group)    = firewall stateful
az vm create -g rg-lab -n vm-lab ...  # VM   = instância
# Blob Storage                    = object storage
# Portal do Azure                 = console web`}
            linuxCode={`# AWS — o que este módulo cobriu
aws configure                     # autenticar (Access Key)
aws ec2 create-vpc ...            # VPC   = rede virtual
# Security Group                  = firewall stateful
aws ec2 run-instances ...         # EC2   = instância
# S3                              = object storage
# Console AWS                     = console web`}
          />

          <label className="flex items-start gap-3 p-4 bg-bg-2 border border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors mt-6">
            <input type="checkbox" checked={!!checklist['cloud-deploy']} onChange={e => updateChecklist('cloud-deploy', e.target.checked)} className="mt-0.5 accent-[var(--color-accent)]" />
            <div className="flex items-start gap-2">
              {checklist['cloud-deploy'] ? <CheckCircle size={16} className="text-ok mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="text-warn mt-0.5 shrink-0" />}
              <span className="text-sm text-text-2">{CHECKLIST_ITEMS[2].label}</span>
            </div>
          </label>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Erros Comuns</h2>
          <div className="space-y-3">
            {[
              { erro: 'Usar a conta root no dia a dia em vez de um usuário IAM', sol: 'A root tem poder absoluto e ilimitado. Use-a só para criar o primeiro usuário IAM admin, ative MFA nela e nunca mais entre. O cotidiano é sempre via usuário/role IAM com permissões mínimas.' },
              { erro: 'Security Group sem regra de entrada — ou com SSH em 0.0.0.0/0', sol: 'Sem regra de ingress a instância fica inacessível; com a porta 22 aberta para o mundo, ela vira alvo de força bruta em minutos. Libere apenas as portas necessárias e restrinja o SSH ao seu IP (/32).' },
              { erro: 'Bucket S3 público por engano vazando dados', sol: 'Mantenha o Block Public Access ligado. Só exponha um bucket — com política explícita — se for realmente um site estático público. A maioria dos vazamentos de dados em nuvem começa num S3 aberto sem querer.' },
              { erro: 'Esquecer recursos ligados e tomar susto na fatura', sol: 'Instância ligada, NAT Gateway e Elastic IP ocioso cobram por hora. Configure um billing alarm, desligue/termine o que não usa e revise o Cost Explorer. O relógio do faturamento nunca para.' },
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
              <p className="font-bold text-text mb-2">🧪 Lab 1 — Usuário IAM com MFA e menor privilégio</p>
              <p className="text-sm text-text-2 mb-3">
                Entre uma única vez na conta root, ative MFA nela e crie um usuário IAM admin para
                você. Com esse usuário, crie um grupo <code>devs-lab</code>, anexe uma policy JSON
                de leitura num bucket específico e adicione um usuário ao grupo. Ative MFA também
                nesse usuário. Configure a AWS CLI com a Access Key dele e confirme com
                <code> aws sts get-caller-identity</code>.
              </p>
              <CodeBlock lang="bash" code={`aws iam create-group --group-name devs-lab
aws iam put-group-policy --group-name devs-lab \\
  --policy-name s3-readonly --policy-document file://policy-s3-readonly.json
aws iam create-user --user-name aluno-lab
aws iam add-user-to-group --user-name aluno-lab --group-name devs-lab
aws iam create-access-key --user-name aluno-lab
aws sts get-caller-identity`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 2 — VPC com subnet pública e privada</p>
              <p className="text-sm text-text-2 mb-3">
                Crie uma VPC <code>10.0.0.0/16</code>. Recorte uma subnet pública
                (<code>10.0.1.0/24</code>) e uma privada (<code>10.0.2.0/24</code>). Anexe um
                Internet Gateway e ajuste a route table da pública para <code>0.0.0.0/0 → IGW</code>.
                Crie um NAT Gateway na subnet pública e aponte a route table da privada para ele.
                Confirme que a privada tem saída, mas ninguém de fora a alcança.
              </p>
              <CodeBlock lang="bash" code={`aws ec2 create-vpc --cidr-block 10.0.0.0/16
aws ec2 create-subnet --vpc-id vpc-0abc --cidr-block 10.0.1.0/24   # publica
aws ec2 create-subnet --vpc-id vpc-0abc --cidr-block 10.0.2.0/24   # privada
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-0abc --internet-gateway-id igw-0xyz
aws ec2 create-route --route-table-id rtb-0pub \\
  --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0xyz`} />
            </div>

            <div className="p-5 rounded-lg bg-bg-2 border border-border">
              <p className="font-bold text-text mb-2">🧪 Lab 3 — EC2 + S3 no ar</p>
              <p className="text-sm text-text-2 mb-3">
                Crie um key pair e um Security Group liberando 80/443 ao mundo e 22 só ao seu IP.
                Suba uma EC2 <code>t2.micro</code> na subnet pública com um <code>user-data</code>
                que instala o Nginx. Acesse o IP público no navegador. Crie um bucket S3, ative
                versionamento e envie um arquivo. Por fim, configure um billing alarm e
                <strong> termine</strong> a instância ao acabar.
              </p>
              <CodeBlock lang="bash" code={`aws ec2 create-key-pair --key-name lab-key \\
  --query 'KeyMaterial' --output text > lab-key.pem && chmod 400 lab-key.pem
aws ec2 run-instances --image-id ami-0abc123 --instance-type t2.micro \\
  --key-name lab-key --subnet-id subnet-0pub --security-group-ids sg-0web \\
  --user-data file://bootstrap.sh
aws s3 mb s3://meu-bucket-do-lab-2026
aws s3 cp index.html s3://meu-bucket-do-lab-2026/
aws ec2 terminate-instances --instance-ids i-0abc123   # ao terminar o lab`} />
            </div>

          </div>
        </section>

        </>)}

        <ModuleNav order={ADVANCED_ORDER} currentPath="/cloud-publica" />

      </div>
    </main>
  );
}
