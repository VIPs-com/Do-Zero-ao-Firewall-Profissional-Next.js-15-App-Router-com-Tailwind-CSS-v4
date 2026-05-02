'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FileCode, Layers, RefreshCw, Shield, Server, Database, Package, Terminal } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function TerraformPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/terraform');
  }, [trackPageVisit]);

  const items = [
    { id: 'terraform-instalado',  label: 'Terraform instalado, provider Docker configurado e primeiro "terraform apply" criando container Nginx com sucesso' },
    { id: 'terraform-plan',       label: 'Ciclo completo executado: init → plan → apply → destroy com variáveis de input e outputs configurados' },
    { id: 'terraform-modulos',    label: 'Módulo criado e reutilizado em dois workspaces diferentes (staging e produção) com variáveis distintas' },
  ];

  return (
    <main className="module-accent-terraform min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏗️</span>
            <span className="section-label">v4.0 · Infraestrutura Moderna</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Terraform — IaC Declarativo</h1>
          <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
            Descreva sua infraestrutura em HCL, versione no git e nunca mais configure servidor
            manualmente. Um <code>terraform apply</code> recria seu ambiente inteiro em minutos — em
            qualquer cloud ou on-premises.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['HCL', 'providers', 'state', 'plan/apply', 'módulos', 'workspaces', 'remote state'].map(t => (
              <span key={t} className="font-mono text-xs bg-mod/10 text-mod border border-mod/30 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* O que é Terraform */}
        <section>
          <h2 className="section-title">Terraform vs Ansible — Qual usar quando</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Terraform e Ansible são complementares, não concorrentes. A confusão é comum — aqui está
            a distinção que todo SysAdmin precisa gravar:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-bg-2 border border-mod/30 rounded-xl p-5">
              <h3 className="font-bold mb-3 text-mod">🏗️ Terraform — Provisionamento</h3>
              <p className="text-sm text-text-2 mb-3 leading-relaxed">
                <strong>Cria e destrói infraestrutura:</strong> VMs, redes, bancos de dados, buckets S3,
                clusters Kubernetes, registros DNS. Pensa em termos de <em>o que existe</em>.
              </p>
              <ul className="text-sm text-text-2 space-y-1.5">
                <li>✅ Criar EC2, VPC, Security Group na AWS</li>
                <li>✅ Provisionar cluster K3s com 3 nós</li>
                <li>✅ Criar banco PostgreSQL no RDS</li>
                <li>✅ Configurar DNS no Cloudflare</li>
                <li>❌ Instalar Nginx no servidor</li>
                <li>❌ Configurar usuários Linux</li>
              </ul>
            </div>
            <div className="bg-bg-2 border border-info/30 rounded-xl p-5">
              <h3 className="font-bold mb-3 text-info">⚙️ Ansible — Configuração</h3>
              <p className="text-sm text-text-2 mb-3 leading-relaxed">
                <strong>Configura o que já existe:</strong> instala pacotes, edita arquivos, gerencia
                serviços. Pensa em termos de <em>o que está rodando</em>.
              </p>
              <ul className="text-sm text-text-2 space-y-1.5">
                <li>✅ Instalar e configurar Nginx</li>
                <li>✅ Criar usuários e permissões</li>
                <li>✅ Deploy de aplicação em servidores</li>
                <li>✅ Aplicar hardening de segurança</li>
                <li>❌ Criar VMs na cloud</li>
                <li>❌ Gerenciar estado de recursos cloud</li>
              </ul>
            </div>
          </div>

          <div className="bg-bg-2 border border-border rounded-xl p-5">
            <p className="text-sm text-text-2 leading-relaxed">
              <strong>Fluxo profissional:</strong> Terraform cria a VM → Ansible configura a VM.
              São usados juntos: Terraform provisiona, Ansible configura.
            </p>
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Terminal size={22} /> Instalação</h2>

          <CodeBlock lang="bash" code={`# Ubuntu/Debian — repositório oficial HashiCorp
wget -O- https://apt.releases.hashicorp.com/gpg | \\
  sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \\
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update && sudo apt install -y terraform

# Verificar instalação
terraform version
# Terraform v1.x.x

# Habilitar autocompletar no bash/zsh
terraform -install-autocomplete

# OpenTofu — fork open source do Terraform (sem licença BSL)
# Alternativa recomendada para novos projetos
curl -fsSL https://get.opentofu.org/install-opentofu.sh | sudo sh -s - --install-method deb`} />
        </section>

        {/* Conceitos Fundamentais */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Layers size={22} /> Conceitos Fundamentais</h2>

          <div className="space-y-3 mb-8">
            {[
              { term: 'Provider', emoji: '🔌', desc: 'Plugin que fala com uma API específica. Existem providers para AWS, GCP, Azure, Docker, Kubernetes, Cloudflare, GitHub e mais de 3.000 outros. Você declara quais usar e o Terraform baixa automaticamente.', ex: 'provider "aws" { region = "us-east-1" }' },
              { term: 'Resource', emoji: '📦', desc: 'Um objeto de infraestrutura gerenciado pelo Terraform. Cada provider define seus próprios tipos de resource. É o bloco principal do HCL.', ex: 'resource "aws_instance" "web" { ... }' },
              { term: 'Data Source', emoji: '🔍', desc: 'Lê dados de infraestrutura existente (não gerenciada pelo Terraform). Útil para referenciar recursos criados fora do Terraform.', ex: 'data "aws_ami" "ubuntu" { ... }' },
              { term: 'Variable', emoji: '📝', desc: 'Input parametrizável. Permite o mesmo código funcionar em múltiplos ambientes (staging/prod) mudando apenas os valores.', ex: 'variable "instance_type" { default = "t3.micro" }' },
              { term: 'Output', emoji: '📤', desc: 'Expõe valores após o apply. Útil para passar informações entre módulos ou exibir IPs/endpoints ao usuário.', ex: 'output "public_ip" { value = aws_instance.web.public_ip }' },
              { term: 'State', emoji: '💾', desc: 'Arquivo terraform.tfstate que mapeia recursos HCL ↔ recursos reais na cloud. É a "fonte de verdade" do Terraform. Nunca edite manualmente.', ex: 'terraform.tfstate (JSON interno)' },
              { term: 'Module', emoji: '📚', desc: 'Pasta com arquivos .tf reutilizável. Como uma função: recebe variáveis, cria recursos, retorna outputs. Permite DRY (Don\'t Repeat Yourself).', ex: 'module "vpc" { source = "./modules/vpc" }' },
            ].map(item => (
              <div key={item.term} className="flex gap-4 bg-bg-2 border border-border rounded-xl p-4 hover:border-mod/30 transition-colors">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div className="min-w-0">
                  <span className="font-mono font-bold text-mod">{item.term}</span>
                  <p className="text-sm text-text-2 leading-relaxed mt-1">{item.desc}</p>
                  <code className="text-xs text-text-3 mt-1 block">{item.ex}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projeto Inicial — Provider Docker */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Primeiro Projeto: Provider Docker (sem cloud)</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O melhor provider para aprender Terraform localmente é o <strong>Docker</strong> — cria
            containers reais no seu servidor sem precisar de conta em cloud ou pagar nada.
          </p>

          <CodeBlock lang="bash" code={`# Estrutura do projeto
mkdir -p ~/terraform-lab && cd ~/terraform-lab

# Arquivos que vamos criar:
# terraform-lab/
# ├── main.tf        ← recursos principais
# ├── variables.tf   ← definição de variáveis
# ├── outputs.tf     ← o que exibir após apply
# └── terraform.tfvars ← valores das variáveis`} />

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">main.tf</p>
              <CodeBlock lang="hcl" code={`# Bloco terraform — configuração global
terraform {
  required_version = ">= 1.5"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

# Provider Docker — conecta ao Docker local
provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Resource: imagem Docker
resource "docker_image" "nginx" {
  name         = "nginx:\${var.nginx_version}"
  keep_locally = false  # remover se não usado
}

# Resource: container Nginx
resource "docker_container" "web" {
  name  = "\${var.prefix}-nginx"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = var.http_port
  }

  env = [
    "NGINX_HOST=\${var.domain}",
  ]

  # Reiniciar automaticamente
  restart = "unless-stopped"

  labels {
    label = "managed-by"
    value = "terraform"
  }
}`} />
            </div>
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">variables.tf</p>
              <CodeBlock lang="hcl" code={`variable "nginx_version" {
  description = "Tag da imagem Nginx"
  type        = string
  default     = "1.25-alpine"
}

variable "prefix" {
  description = "Prefixo para nomes dos recursos"
  type        = string
  default     = "lab"

  validation {
    condition     = length(var.prefix) <= 10
    error_message = "Prefixo deve ter até 10 caracteres."
  }
}

variable "http_port" {
  description = "Porta HTTP exposta no host"
  type        = number
  default     = 8080
}

variable "domain" {
  description = "Domínio do servidor"
  type        = string
  default     = "localhost"
}`} />
              <p className="text-sm font-bold mb-2 mt-4 text-text-2">outputs.tf</p>
              <CodeBlock lang="hcl" code={`output "container_name" {
  description = "Nome do container criado"
  value       = docker_container.web.name
}

output "container_ip" {
  description = "IP interno do container"
  value       = docker_container.web.network_data[0].ip_address
}

output "access_url" {
  description = "URL para acessar o Nginx"
  value       = "http://localhost:\${var.http_port}"
}`} />
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Workflow básico do Terraform

# 1. INIT — baixa providers e inicializa o diretório
terraform init

# Saída esperada:
# Initializing provider plugins...
# - Installing kreuzwerker/docker v3.x.x...
# Terraform has been successfully initialized!

# 2. PLAN — mostra o que será feito (dry-run)
terraform plan

# Saída: "+ create" para novos recursos
# + resource "docker_container" "web" {
#   + name = "lab-nginx"
#   + ports { + external = 8080, + internal = 80 }
# }
# Plan: 2 to add, 0 to change, 0 to destroy.

# 3. APPLY — cria a infraestrutura
terraform apply
# Pede confirmação — digitar "yes"

# Ou sem confirmação (para automação/CI)
terraform apply -auto-approve

# Saída após apply:
# Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
# Outputs:
# access_url = "http://localhost:8080"
# container_name = "lab-nginx"

# 4. Testar
curl http://localhost:8080

# 5. Ver state
terraform show                   # estado formatado
terraform state list             # lista todos os resources
terraform state show docker_container.web  # detalhes de 1 resource

# 6. DESTROY — destruir tudo
terraform destroy
# Pede confirmação — digitar "yes"`} />
        </section>

        {/* Variables, tfvars e Workspaces */}
        <section>
          <h2 className="section-title">Variáveis, .tfvars e Workspaces</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Terraform tem uma hierarquia de precedência para variáveis. Entendendo isso, um único
            código serve para staging e produção com valores diferentes.
          </p>

          <CodeBlock lang="hcl" code={`# terraform.tfvars — valores padrão (commitado ao git)
nginx_version = "1.25-alpine"
prefix        = "lab"
http_port     = 8080
domain        = "localhost"

# staging.tfvars — ambiente de staging
prefix    = "staging"
http_port = 8081
domain    = "staging.empresa.com"

# producao.tfvars — ambiente de produção
prefix    = "prod"
http_port = 80
domain    = "empresa.com"`} />

          <CodeBlock lang="bash" code={`# Passar arquivo de variáveis manualmente
terraform apply -var-file="staging.tfvars"
terraform apply -var-file="producao.tfvars"

# Sobrescrever variável pontualmente
terraform apply -var="http_port=9090"

# Variáveis via ambiente (útil no CI/CD)
export TF_VAR_http_port=9090
export TF_VAR_prefix=ci
terraform apply

# Precedência (maior → menor):
# 1. -var="chave=valor" na linha de comando
# 2. .auto.tfvars (carregado automaticamente)
# 3. terraform.tfvars
# 4. TF_VAR_* variáveis de ambiente
# 5. default em variables.tf

# WORKSPACES — múltiplos estados no mesmo código
terraform workspace list           # listar workspaces
terraform workspace new staging    # criar workspace staging
terraform workspace select staging # trocar para staging
terraform apply -var-file=staging.tfvars

terraform workspace new producao
terraform workspace select producao
terraform apply -var-file=producao.tfvars

# Referenciar workspace no código HCL
resource "docker_container" "web" {
  name = "\${terraform.workspace}-nginx"  # staging-nginx ou producao-nginx
}`} />

          <InfoBox title="Hierarquia de precedência de variáveis">
            <p>Variáveis na linha de comando <code>-var</code> sempre ganham. Arquivos
            <code>.auto.tfvars</code> são carregados automaticamente sem precisar de <code>-var-file</code>.
            Use <code>terraform.tfvars</code> para defaults compartilhados e
            <code>TF_VAR_*</code> para segredos no CI/CD.</p>
          </InfoBox>
        </section>

        {/* State — Remote Backend */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Database size={22} /> State — A Memória do Terraform</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O <code>terraform.tfstate</code> mapeia cada bloco HCL para um recurso real. É o arquivo
            mais crítico do Terraform — sem ele, o Terraform não sabe o que já existe.
          </p>

          <WarnBox title="Nunca commitar terraform.tfstate no git">
            <p>O state pode conter senhas, chaves privadas e dados sensíveis em plaintext. Adicione ao
            <code>.gitignore</code>: <code>*.tfstate</code> e <code>*.tfstate.backup</code>.
            Use sempre um <strong>remote backend</strong> para trabalho em equipe.</p>
          </WarnBox>

          <CodeBlock lang="hcl" code={`# .gitignore — obrigatório em qualquer projeto Terraform
.terraform/         # binários dos providers (podem ser GB)
*.tfstate           # state local — NUNCA no git
*.tfstate.backup    # backup automático do state
*.tfvars            # se contiver segredos (ou usar *.auto.tfvars)
.terraform.lock.hcl # pode commitar — versiona os providers`} />

          <CodeBlock lang="hcl" code={`# Remote State — Backend S3 (AWS)
# Permite trabalho em equipe: state compartilhado + locking
terraform {
  backend "s3" {
    bucket         = "minha-empresa-terraform-state"
    key            = "producao/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"  # previne conflitos simultâneos
  }
}

# Alternativa: Terraform Cloud (gratuito até 500 recursos)
terraform {
  cloud {
    organization = "minha-empresa"
    workspaces {
      name = "producao"
    }
  }
}

# Alternativa: Backend HTTP (GitLab, Cloudflare R2, MinIO)
terraform {
  backend "http" {
    address        = "https://gitlab.com/api/v4/projects/123/terraform/state/producao"
    lock_address   = "https://gitlab.com/api/v4/projects/123/terraform/state/producao/lock"
    unlock_address = "https://gitlab.com/api/v4/projects/123/terraform/state/producao/lock"
    lock_method    = "POST"
    unlock_method  = "DELETE"
    username       = "meu-usuario"
    password       = var.gitlab_token
  }
}`} />

          <CodeBlock lang="bash" code={`# Operações de state (avançado)

# Importar recurso existente para o state (não criado pelo Terraform)
terraform import docker_container.web lab-nginx

# Mover recurso no state (refatoração)
terraform state mv docker_container.web module.nginx.docker_container.web

# Remover recurso do state SEM destruir (útil para migrações)
terraform state rm docker_container.web

# Comparar state com realidade
terraform refresh          # deprecated → use: terraform apply -refresh-only

# Forçar unlock (se alguém travou o state e crashou)
terraform force-unlock LOCK-ID`} />
        </section>

        {/* Módulos */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Módulos — Reutilização e DRY</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Módulos são a forma de encapsular e reutilizar configurações Terraform. Uma boa prática é
            criar um módulo para cada componente lógico da infraestrutura.
          </p>

          <CodeBlock lang="bash" code={`# Estrutura recomendada para projeto com módulos
projeto-infra/
├── main.tf           ← chama os módulos
├── variables.tf
├── outputs.tf
├── terraform.tfvars
└── modules/
    ├── nginx/
    │   ├── main.tf       ← recursos do módulo
    │   ├── variables.tf  ← inputs do módulo
    │   └── outputs.tf    ← outputs do módulo
    └── postgres/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf`} />

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">modules/nginx/main.tf</p>
              <CodeBlock lang="hcl" code={`# Módulo reutilizável de Nginx
resource "docker_image" "nginx" {
  name         = "nginx:\${var.nginx_version}"
  keep_locally = false
}

resource "docker_container" "nginx" {
  name  = "\${var.name}-nginx"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = var.port
  }

  restart = "unless-stopped"
}`} />
              <p className="text-sm font-bold mb-2 mt-4 text-text-2">modules/nginx/variables.tf</p>
              <CodeBlock lang="hcl" code={`variable "name" {
  type = string
}
variable "port" {
  type    = number
  default = 8080
}
variable "nginx_version" {
  type    = string
  default = "1.25-alpine"
}`} />
            </div>
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">main.tf — usando o módulo</p>
              <CodeBlock lang="hcl" code={`terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Instância de staging
module "nginx_staging" {
  source        = "./modules/nginx"
  name          = "staging"
  port          = 8081
  nginx_version = "1.25-alpine"
}

# Instância de produção
module "nginx_prod" {
  source        = "./modules/nginx"
  name          = "producao"
  port          = 80
  nginx_version = "1.26-alpine"  # versão diferente
}`} />
              <p className="text-sm font-bold mb-2 mt-4 text-text-2">modules/nginx/outputs.tf</p>
              <CodeBlock lang="hcl" code={`output "container_name" {
  value = docker_container.nginx.name
}
output "container_id" {
  value = docker_container.nginx.id
}
# Acessar no main.tf:
# module.nginx_staging.container_name
# module.nginx_prod.container_id`} />
            </div>
          </div>

          <CodeBlock lang="bash" code={`# Módulos do Terraform Registry (prontos para usar)
# https://registry.terraform.io/modules/

# Exemplo: módulo VPC da AWS (oficial HashiCorp)
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "minha-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
}

# terraform init baixa o módulo automaticamente`} />
        </section>

        {/* Provider AWS — Infraestrutura Real */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Server size={22} /> Provider AWS — Infraestrutura Real</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Com o provider AWS você gerencia toda a infraestrutura da Amazon via código.
            O mesmo princípio se aplica ao GCP (<code>google</code>), Azure (<code>azurerm</code>),
            DigitalOcean (<code>digitalocean</code>), Hetzner (<code>hcloud</code>) e outros.
          </p>

          <CodeBlock lang="hcl" code={`# main.tf — EC2 + Security Group + Elastic IP
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  # Credenciais via variáveis de ambiente:
  # AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  # ou via ~/.aws/credentials (aws configure)
}

# Data source: busca a AMI Ubuntu mais recente automaticamente
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Security Group — firewall da instância
resource "aws_security_group" "web" {
  name        = "\${var.prefix}-sg"
  description = "Allow HTTP, HTTPS and SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Instância EC2
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = var.key_pair_name

  # Script de inicialização (user_data)
  user_data = <<-EOF
    #!/bin/bash
    apt update && apt install -y nginx
    systemctl enable --now nginx
    echo "<h1>Provisionado pelo Terraform</h1>" > /var/www/html/index.html
  EOF

  tags = {
    Name        = "\${var.prefix}-web"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Elastic IP — IP fixo
resource "aws_eip" "web" {
  instance = aws_instance.web.id
  domain   = "vpc"
}

output "public_ip" {
  value = aws_eip.web.public_ip
}

output "ssh_command" {
  value = "ssh -i \${var.key_pair_name}.pem ubuntu@\${aws_eip.web.public_ip}"
}`} />
        </section>

        {/* Lifecycle e Depends_on */}
        <section>
          <h2 className="section-title flex items-center gap-2"><RefreshCw size={22} /> Lifecycle, Depends_on e Count</h2>

          <CodeBlock lang="hcl" code={`# lifecycle — controla como o Terraform atualiza o resource
resource "docker_container" "web" {
  name  = "meu-nginx"
  image = docker_image.nginx.image_id

  lifecycle {
    # Criar novo ANTES de destruir o antigo (zero downtime)
    create_before_destroy = true

    # Nunca destruir (proteção contra terraform destroy acidental)
    prevent_destroy = true

    # Ignorar mudanças nesses campos (ex: tag gerenciada externamente)
    ignore_changes = [
      labels,
    ]
  }
}

# depends_on — forçar ordem de criação
resource "docker_container" "app" {
  name  = "minha-app"
  image = "minha-app:latest"

  # Só criar o app DEPOIS que o banco estiver rodando
  depends_on = [docker_container.postgres]
}

# count — criar múltiplos recursos iguais
resource "docker_container" "worker" {
  count = 3  # cria worker-0, worker-1, worker-2
  name  = "worker-\${count.index}"
  image = docker_image.worker.image_id
}

# for_each — criar recursos de uma lista/mapa
variable "sites" {
  default = {
    blog   = 8080
    api    = 8081
    admin  = 8082
  }
}

resource "docker_container" "sites" {
  for_each = var.sites
  name     = each.key        # blog, api, admin
  image    = docker_image.nginx.image_id
  ports {
    internal = 80
    external = each.value    # 8080, 8081, 8082
  }
}`} />
        </section>

        {/* FluxoCard */}
        <FluxoCard
          title="Workflow Terraform: do Código à Infraestrutura"
          steps={[
            { label: 'terraform init', sub: 'baixa providers + inicializa backend', icon: <Package size={14} />, color: 'border-info/50' },
            { label: 'terraform plan', sub: 'compara state vs código → mostra diff', icon: <FileCode size={14} />, color: 'border-ok/50' },
            { label: 'terraform apply', sub: 'cria/atualiza recursos reais', icon: <RefreshCw size={14} />, color: 'border-mod/50' },
            { label: 'state update', sub: 'terraform.tfstate sincronizado', icon: <Database size={14} />, color: 'border-warn/50' },
            { label: 'git commit', sub: 'código versionado + state no remote', icon: <Shield size={14} />, color: 'border-info/50' },
            { label: 'terraform destroy', sub: 'remove tudo controladamente', icon: <Terminal size={14} />, color: 'border-err/50' },
          ]}
        />

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows / ARM Templates / Bicep"
          linuxLabel="Terraform / HCL"
          windowsCode={`# ARM Templates (JSON — verbose)
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2022-03-01",
  "name": "[parameters('vmName')]",
  "location": "[parameters('location')]",
  "properties": { ... }
}

# Bicep (mais legível que ARM)
resource vm 'Microsoft.Compute/virtualMachines@2022' = {
  name: vmName
  location: location
  properties: { ... }
}

# Powershell DSC para configuração
# Azure DevOps para CI/CD
# Funciona APENAS no ecossistema Azure`}
          linuxCode={`# Terraform HCL (multi-cloud, legível)
resource "azurerm_linux_virtual_machine" "web" {
  name                = var.vm_name
  location            = var.location
  resource_group_name = var.rg_name
  size                = "Standard_B2s"

  # Mesmo código, providers diferentes:
  # aws_instance, google_compute_instance,
  # hcloud_server, digitalocean_droplet...
}

# Funciona em AWS, GCP, Azure, DigitalOcean,
# Hetzner, bare-metal, Kubernetes, Docker...
# 1 linguagem para TODA a infraestrutura`}
        />

        {/* Exercícios Guiados */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-bold">Primeiro apply: container Nginx com Docker provider</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar projeto
mkdir -p ~/terraform-lab && cd ~/terraform-lab

# 2. Criar main.tf
cat > main.tf << 'EOF'
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name         = "nginx:alpine"
  keep_locally = false
}

resource "docker_container" "web" {
  name  = "tf-nginx"
  image = docker_image.nginx.image_id
  ports {
    internal = 80
    external = 8090
  }
  restart = "unless-stopped"
}

output "url" {
  value = "http://localhost:8090"
}
EOF

# 3. Inicializar
terraform init

# 4. Ver o plano
terraform plan

# 5. Aplicar
terraform apply -auto-approve

# 6. Testar
curl http://localhost:8090 | head -5

# 7. Ver o state
terraform state list
terraform show

# 8. Limpar
terraform destroy -auto-approve`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-bold">Variáveis, outputs e dois ambientes</h3>
              </div>
              <CodeBlock lang="bash" code={`mkdir -p ~/terraform-multi && cd ~/terraform-multi

# main.tf com variáveis
cat > main.tf << 'EOF'
terraform {
  required_providers {
    docker = { source = "kreuzwerker/docker", version = "~> 3.0" }
  }
}
provider "docker" {}

resource "docker_image" "nginx" {
  name = "nginx:alpine"
}

resource "docker_container" "web" {
  name  = "\${var.env}-nginx"
  image = docker_image.nginx.image_id
  ports { internal = 80; external = var.port }
}
EOF

cat > variables.tf << 'EOF'
variable "env"  { type = string; default = "dev" }
variable "port" { type = number; default = 8080  }
EOF

cat > outputs.tf << 'EOF'
output "url" { value = "http://localhost:\${var.port}" }
EOF

# Staging
terraform workspace new staging
terraform apply -var="env=staging" -var="port=8081" -auto-approve

# Produção
terraform workspace new producao
terraform apply -var="env=producao" -var="port=8082" -auto-approve

# Listar workspaces e containers
terraform workspace list
docker ps --filter "name=-nginx"`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold">Criar e reutilizar um módulo</h3>
              </div>
              <CodeBlock lang="bash" code={`mkdir -p ~/terraform-modulos/modules/nginx && cd ~/terraform-modulos

# Módulo
cat > modules/nginx/main.tf << 'EOF'
resource "docker_image" "nginx" {
  name = "nginx:\${var.version}"
}
resource "docker_container" "nginx" {
  name  = "\${var.name}-web"
  image = docker_image.nginx.image_id
  ports { internal = 80; external = var.port }
}
EOF

cat > modules/nginx/variables.tf << 'EOF'
variable "name"    { type = string }
variable "port"    { type = number; default = 8080 }
variable "version" { type = string; default = "alpine" }
EOF

cat > modules/nginx/outputs.tf << 'EOF'
output "name" { value = docker_container.nginx.name }
output "url"  { value = "http://localhost:\${var.port}" }
EOF

# Raiz do projeto
cat > main.tf << 'EOF'
terraform {
  required_providers {
    docker = { source = "kreuzwerker/docker", version = "~> 3.0" }
  }
}
provider "docker" {}

module "blog" {
  source  = "./modules/nginx"
  name    = "blog"
  port    = 8083
}

module "api" {
  source  = "./modules/nginx"
  name    = "api"
  port    = 8084
  version = "1.25-alpine"
}
EOF

cat > outputs.tf << 'EOF'
output "blog_url" { value = module.blog.url }
output "api_url"  { value = module.api.url  }
EOF

terraform init
terraform apply -auto-approve
# Outputs:
# api_url  = "http://localhost:8084"
# blog_url = "http://localhost:8083"`} />
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section>
          <h2 className="section-title">Erros Comuns e Soluções</h2>
          <div className="space-y-4">
            {[
              {
                err: 'Error: Provider configuration not present (após remover provider do código)',
                fix: 'O state ainda referencia o provider. Use terraform state rm para remover os recursos antes de remover o provider, ou adicione required_providers mesmo sem resources ativos.',
              },
              {
                err: 'Error acquiring the state lock — state is locked',
                fix: 'Outro processo (ou um crash anterior) travou o state. Verificar se há terraform apply rodando em paralelo. Se não houver: terraform force-unlock <LOCK-ID> (o ID aparece na mensagem de erro).',
              },
              {
                err: 'Error: Resource already exists (recurso existia antes do Terraform)',
                fix: 'Importar o recurso existente para o state: terraform import <tipo>.<nome> <id-externo>. Após o import, terraform plan deve mostrar "no changes".',
              },
              {
                err: 'Plan mostra "will be destroyed and recreated" quando você só queria atualizar',
                fix: 'Alguns campos de resource são "force-new" — mudar o campo reconstrói o recurso inteiro. Use lifecycle { create_before_destroy = true } para minimizar downtime. Consulte a documentação do provider para saber quais campos são imutáveis.',
              },
            ].map(({ err, fix }) => (
              <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
                <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
                <p className="text-sm text-text-2">✅ {fix}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-bg-2 border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={22} className="text-mod" />
            <h2 className="text-xl font-bold">Checklist do Lab</h2>
          </div>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-[var(--mod)]"
                />
                <span className={`text-sm leading-relaxed transition-colors ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2 group-hover:text-text'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-xl text-ok text-sm font-medium">
              🏗️ Terraform Master — infraestrutura declarativa dominada!
            </div>
          )}
        </section>

        {/* ── Exercícios Guiados ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">🎯 Exercícios Guiados</h2>
          <div className="grid gap-4">
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 1 — Primeiro Projeto Terraform com Docker Provider</p>
              <CodeBlock lang="bash" code={`# Instalar Terraform (ou OpenTofu como alternativa open-source)
wget -O /tmp/terraform.zip https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip 2>/dev/null || \
  apt install opentofu -y 2>/dev/null || \
  snap install opentofu --classic

mkdir -p ~/terraform-lab && cd ~/terraform-lab

# Criar arquivo principal
cat > main.tf << 'EOF'
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "nginx" {
  name = "nginx:alpine"
}

resource "docker_container" "web" {
  image = docker_image.nginx.image_id
  name  = "terraform-nginx"
  ports {
    internal = 80
    external = 8088
  }
}
EOF

terraform init
terraform plan
terraform apply -auto-approve
docker ps | grep terraform-nginx`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 2 — Variáveis, Outputs e .tfvars</p>
              <CodeBlock lang="bash" code={`cd ~/terraform-lab

# Criar arquivo de variáveis
cat > variables.tf << 'EOF'
variable "porta_externa" {
  description = "Porta para expor o Nginx"
  type        = number
  default     = 8088
}

variable "nome_container" {
  description = "Nome do container"
  type        = string
  default     = "meu-nginx"
}
EOF

# Criar arquivo de outputs
cat > outputs.tf << 'EOF'
output "container_id" {
  value = docker_container.web.id
}

output "url_acesso" {
  value = "http://localhost:\${var.porta_externa}"
}
EOF

# Criar arquivo de valores para ambiente de produção
cat > prod.tfvars << 'EOF'
porta_externa  = 80
nome_container = "nginx-producao"
EOF

# Aplicar com valores de produção
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars -auto-approve

# Ver outputs
terraform output`} />
            </div>
            <div className="p-4 rounded-xl bg-bg-2 border border-border">
              <p className="font-bold text-sm mb-2">Lab 3 — Workflow Completo: Plan, Apply, Destroy</p>
              <CodeBlock lang="bash" code={`cd ~/terraform-lab

# Ver estado atual dos recursos
terraform state list
terraform state show docker_container.web

# Modificar recurso (adicionar label ao container)
cat >> main.tf << 'EOF'

# Adicionar ao resource docker_container.web:
# labels {
#   label = "managed-by"
#   value = "terraform"
# }
EOF

# Ver o que vai mudar ANTES de aplicar (dry-run)
terraform plan -out=plano.tfplan

# Aplicar apenas o plano gerado (idempotente)
terraform apply plano.tfplan

# Ver diff do estado
terraform show

# Destruir todos os recursos criados
terraform destroy -auto-approve
docker ps | grep terraform || echo "Containers destruídos com sucesso"`} />
            </div>
          </div>
        </section>

        <ModuleNav currentPath="/terraform" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
