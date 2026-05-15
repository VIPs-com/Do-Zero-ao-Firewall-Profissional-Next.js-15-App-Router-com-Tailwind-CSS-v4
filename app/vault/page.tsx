'use client';

import { useEffect, useState, useCallback } from 'react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, HighlightBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { ChecklistItem } from '@/components/ui/Steps';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';
import { useTabFilter } from '@/hooks/useTabFilter';
import {
  Lock, Shield, Key, Database, RefreshCw, AlertTriangle,
  Terminal, Server, FileText, CheckCircle,
} from 'lucide-react';

const checklistItems = [
  {
    id: 'vault-instalado',
    text: 'HashiCorp Vault instalado, inicializado e unsealed — vault status retorna Sealed: false',
    sub: 'vault operator init → guarda as 5 unseal keys e o root token → vault operator unseal (3×) → vault login <root-token>',
  },
  {
    id: 'vault-politicas',
    text: 'Política HCL criada e AppRole configurado — role-id + secret-id obtidos e autenticados',
    sub: 'vault policy write app-policy policy.hcl → vault auth enable approle → vault write auth/approle/role/myapp → vault read auth/approle/role/myapp/role-id',
  },
  {
    id: 'vault-dinamico',
    text: 'Segredo dinâmico gerado pelo Database secrets engine — credenciais PostgreSQL com TTL automático',
    sub: 'vault secrets enable database → configure plugin postgresql → vault write database/roles/app-role → vault read database/creds/app-role',
  },
];

const erros = [
  {
    title: 'Vault reinicia e fica Sealed — serviço para',
    desc: 'Por design, o Vault não guarda as unseal keys em disco. Cada reinicialização exige unseal manual (ou auto-unseal via cloud KMS). Sem processo de unseal automatizado, o Vault selado bloqueia toda a aplicação.',
    fix: `# Opção 1: Auto-unseal via AWS KMS (produção)
vault server -config=/etc/vault/vault.hcl
# vault.hcl:
seal "awskms" {
  region     = "us-east-1"
  kms_key_id = "arn:aws:kms:..."
}

# Opção 2: Script de unseal para dev/lab
#!/bin/bash
export VAULT_ADDR="http://127.0.0.1:8200"
vault operator unseal "$UNSEAL_KEY_1"
vault operator unseal "$UNSEAL_KEY_2"
vault operator unseal "$UNSEAL_KEY_3"`,
  },
  {
    title: 'Aplicação usa root token em produção',
    desc: 'O root token tem permissões ilimitadas e não expira. Usá-lo em produção viola o princípio de mínimo privilégio — qualquer vazamento compromete todo o Vault. Root token deve ser usado apenas para configuração inicial e depois revogado.',
    fix: `# Revogar root token após configuração inicial
vault token revoke <root-token>

# Criar política restrita para a app
vault policy write app-ro - <<EOF
path "secret/data/app/*" {
  capabilities = ["read", "list"]
}
EOF

# Gerar token com TTL e política restrita
vault token create -policy=app-ro -ttl=24h`,
  },
  {
    title: 'Segredos estáticos hardcoded — Vault instalado mas não usado',
    desc: 'Instalar o Vault mas continuar com senhas hardcoded no código ou variáveis de ambiente sem rotação não resolve o problema. O valor está em centralizar, rotacionar e auditar o acesso aos segredos.',
    fix: `# Ler segredo via API REST na aplicação
curl -H "X-Vault-Token: $APP_TOKEN" \\
  http://vault:8200/v1/secret/data/app/db

# Ou via CLI no entrypoint do container
export DB_PASSWORD=$(vault kv get -field=password secret/app/db)

# Injeção automática com Vault Agent Injector (Kubernetes)
annotations:
  vault.hashicorp.com/agent-inject: "true"
  vault.hashicorp.com/role: "app-role"`,
  },
  {
    title: 'Lease expirado — aplicação recebe 403 ao ler segredo dinâmico',
    desc: 'Segredos dinâmicos têm TTL. Quando o lease expira, as credenciais são revogadas no banco de dados. A aplicação deve renovar o lease antes da expiração ou lidar com a renovação automática via Vault Agent.',
    fix: `# Renovar lease manualmente
vault lease renew database/creds/app-role/<lease-id>

# Ver leases ativos
vault list sys/leases/lookup/database/creds/app-role

# Vault Agent: renovação automática
auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = { role_id_file_path = "/vault/role_id" }
  }
}

template {
  source      = "/vault/templates/db.tpl"
  destination = "/app/config/db.env"
}`,
  },
];

type VaultTab = 'conceito' | 'config' | 'avancado';

export default function VaultPage() {
  const { checklist, updateChecklist, trackPageVisit, unlockBadge, unlockedBadges } = useBadges();
  const [openError, setOpenError] = useState<number | null>(null);
  const { isActive, setActiveTab } = useTabFilter<VaultTab>('conceito');

  useEffect(() => {
    trackPageVisit('/vault');
  }, [trackPageVisit]);

  // Desbloquear badge quando todos os checkpoints forem concluídos
  useEffect(() => {
    const allDone = checklistItems.every(item => checklist[item.id]);
    if (allDone && !unlockedBadges.has('vault-master')) {
      unlockBadge('vault-master');
    }
  }, [checklist, unlockBadge, unlockedBadges]);

  const toggleError = useCallback((i: number) => {
    setOpenError(prev => (prev === i ? null : i));
  }, []);

  const completedCount = checklistItems.filter(item => checklist[item.id]).length;

  return (
    <div className="module-accent-vault min-h-screen">

      {/* ── Hero ── */}
      <section className="module-hero py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="section-label">v4.0 · Infraestrutura Moderna</span>
          </div>
          <h1 className="section-title text-4xl mb-4">
            🔐 HashiCorp Vault
          </h1>
          <p className="text-text-2 text-lg max-w-2xl">
            Gerenciamento centralizado de segredos — o Vault é o cofre da sua infraestrutura.
            Elimine senhas hardcoded, rotacione credenciais automaticamente e audite
            cada acesso a segredos com <strong className="text-text">políticas baseadas em identidade</strong>.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['segredos dinâmicos', 'AppRole', 'PKI', 'KV v2', 'Unseal', 'políticas HCL', 'TTL', 'leases'].map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-bg-3 text-text-2 border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

        {/* ── Checklist de progresso ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-ok" />
              Checklist do Lab
            </h2>
            <span className="text-sm text-text-2">{completedCount}/{checklistItems.length} concluídos</span>
          </div>
          <div className="w-full bg-bg-3 rounded-full h-2 mb-6">
            <div
              className="bg-[var(--mod)] h-2 rounded-full transition-[width] duration-700"
              style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
            />
          </div>
          <div className="space-y-3">
            {checklistItems.map(item => (
              <ChecklistItem
                key={item.id}
                text={item.text}
                checked={!!checklist[item.id]}
                onToggle={() => updateChecklist(item.id, !checklist[item.id])}
                sub={item.sub}
              />
            ))}
          </div>
        </section>

        {/* ── Abas de navegação ── */}
        <div role="tablist" className="flex gap-2 border-b border-border -mt-8 pb-0">
          {[
            { id: 'conceito', label: '🔐 Conceito & Unseal' },
            { id: 'config',   label: '⚙️ Políticas & AppRole' },
            { id: 'avancado', label: '🗄️ Segredos Dinâmicos' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive(tab.id)}
              onClick={() => setActiveTab(tab.id as VaultTab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive(tab.id)
                  ? 'border-[var(--mod)] text-[var(--mod)]'
                  : 'border-transparent text-text-2 hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            ABA 1 — Conceito & Unseal
        ════════════════════════════════════════════ */}
        {isActive('conceito') && (
          <div className="space-y-16">

            {/* Por que Vault? */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[var(--mod)]" />
                Por que HashiCorp Vault?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-bg-2 border border-err/40 rounded-xl p-5">
                  <h3 className="font-semibold text-err mb-3">❌ Sem Vault</h3>
                  <ul className="space-y-2 text-sm text-text-2">
                    <li>• Senhas hardcoded no código-fonte ou no .env</li>
                    <li>• Mesma senha usada por 10 aplicações diferentes</li>
                    <li>• Rotação manual e esporádica de credenciais</li>
                    <li>• Nenhuma auditoria — quem acessou o quê?</li>
                    <li>• Credencial vazada = comprometimento total</li>
                  </ul>
                </div>
                <div className="bg-bg-2 border border-ok/40 rounded-xl p-5">
                  <h3 className="font-semibold text-ok mb-3">✅ Com Vault</h3>
                  <ul className="space-y-2 text-sm text-text-2">
                    <li>• Segredos centralizados e criptografados em repouso</li>
                    <li>• Cada app tem credenciais únicas com TTL</li>
                    <li>• Rotação automática — sem downtime</li>
                    <li>• Audit log completo de cada leitura e escrita</li>
                    <li>• Vazamento = credencial já expirou ou revogada</li>
                  </ul>
                </div>
              </div>

              <InfoBox title="Vault vs. outros gerenciadores de segredos">
                <p className="text-sm">
                  <strong>AWS Secrets Manager / Azure Key Vault:</strong> excelentes quando você está 100% em cloud pública — nativos, sem infraestrutura.
                  {' '}<strong>HashiCorp Vault:</strong> ideal para multi-cloud, on-premises ou ambientes híbridos — open-source, agnóstico de plataforma, com segredos dinâmicos que os serviços de cloud não oferecem nativamente.
                </p>
              </InfoBox>
            </section>

            {/* Arquitetura */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Server className="w-6 h-6 text-[var(--mod)]" />
                Arquitetura: Seal / Unseal / Auth / Secrets
              </h2>

              <FluxoCard
                title="Ciclo de vida de um segredo no Vault"
                steps={[
                  { label: 'Vault inicia Sealed',     sub: 'Dados criptografados — nenhuma operação possível' },
                  { label: 'Unseal (3 de 5 keys)',     sub: 'Shamir Secret Sharing: 3 fragmentos reconstroem a master key' },
                  { label: 'Vault operacional',        sub: 'Auth methods, secrets engines e políticas disponíveis' },
                  { label: 'App autentica (AppRole)',   sub: 'Apresenta role-id + secret-id → recebe token temporário' },
                  { label: 'Lê segredo com token',     sub: 'Vault verifica política → retorna segredo + lease TTL' },
                  { label: 'Lease expira / renova',    sub: 'Credencial revogada no banco; app obtém novo par' },
                ]}
              />

              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-lg">Conceitos fundamentais</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: '🔒', term: 'Seal / Unseal', desc: 'Estado de segurança. Selado = dados inacessíveis mesmo com acesso ao disco. Unseal requer quórum de fragmentos de chave (Shamir).' },
                    { icon: '🔑', term: 'Auth Methods', desc: 'Como entidades se autenticam: Token, AppRole (máquinas), Kubernetes ServiceAccount, AWS IAM, GitHub, LDAP.' },
                    { icon: '📦', term: 'Secrets Engines', desc: 'Plugins que gerenciam segredos: KV v2 (estático), Database (dinâmico), PKI (certificados), Transit (criptografia-as-a-service).' },
                    { icon: '📜', term: 'Policies (HCL)', desc: 'Controle de acesso declarativo: quais paths o token pode ler/escrever/listar/deletar.' },
                    { icon: '⏱️', term: 'Leases & TTL', desc: 'Todo segredo dinâmico tem um tempo de vida. Ao expirar, a credencial é revogada automaticamente no sistema externo.' },
                    { icon: '📋', term: 'Audit Devices', desc: 'Log imutável de todas as requisições ao Vault — quem acessou, quando, qual path, qual resultado.' },
                  ].map(item => (
                    <div key={item.term} className="bg-bg-2 border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-mono text-sm font-semibold text-[var(--mod)]">{item.term}</span>
                      </div>
                      <p className="text-xs text-text-2 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Instalação */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-[var(--mod)]" />
                Instalação e Inicialização
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-3">1. Instalar Vault via repositório HashiCorp</h3>
                  <CodeBlock code={`# Adicionar repositório oficial HashiCorp
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

sudo apt update && sudo apt install -y vault

# Verificar instalação
vault version
# Vault v1.17.x`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">2. Configurar o servidor Vault (dev ou produção)</h3>
                  <WarnBox title="Dev mode: nunca em produção">
                    O modo <code>vault server -dev</code> não persiste dados, usa token fixo e inicia unsealado. Útil apenas para testes locais.
                  </WarnBox>
                  <div className="mt-4">
                    <CodeBlock code={`# /etc/vault/vault.hcl — configuração de produção básica
storage "file" {
  path = "/opt/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault/tls/vault.crt"
  tls_key_file  = "/etc/vault/tls/vault.key"
}

api_addr = "https://vault.local:8200"
cluster_addr = "https://vault.local:8201"
ui = true

# Para lab sem TLS (nunca em produção):
# listener "tcp" {
#   address     = "127.0.0.1:8200"
#   tls_disable = true
# }`} />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">3. Inicializar e realizar o Unseal</h3>
                  <CodeBlock code={`export VAULT_ADDR='http://127.0.0.1:8200'

# Inicializar — gera 5 unseal keys e 1 root token
vault operator init

# Saída:
# Unseal Key 1: abc123...
# Unseal Key 2: def456...
# Unseal Key 3: ghi789...
# Unseal Key 4: jkl012...
# Unseal Key 5: mno345...
# Initial Root Token: hvs.XXXXXXXXXXX

# ⚠️ GUARDE AS UNSEAL KEYS EM LOCAL SEGURO SEPARADO!
# Sem 3 dessas keys, os dados são irrecuperáveis.

# Unseal com 3 fragmentos (quórum)
vault operator unseal abc123...
vault operator unseal def456...
vault operator unseal ghi789...

# Verificar status
vault status
# Sealed: false ✅

# Login com root token (somente para configuração inicial)
vault login hvs.XXXXXXXXXXX`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">4. Ativar o KV v2 (Key-Value secrets engine)</h3>
                  <CodeBlock code={`# Habilitar secrets engine KV versão 2 no path "secret/"
vault secrets enable -path=secret kv-v2

# Gravar um segredo
vault kv put secret/app/database \\
  username="appuser" \\
  password="S3cret@2024"

# Ler o segredo
vault kv get secret/app/database

# Ler apenas um campo
vault kv get -field=password secret/app/database

# Listar segredos no path
vault kv list secret/app/

# Ver versões anteriores (KV v2 guarda histórico)
vault kv metadata get secret/app/database
vault kv get -version=1 secret/app/database`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">5. Habilitar Audit Log</h3>
                  <CodeBlock code={`# Habilitar audit log em arquivo
vault audit enable file file_path=/var/log/vault/audit.log

# Verificar audit devices ativos
vault audit list

# Exemplo de entrada no audit log (formato JSON)
# {
#   "time": "2024-01-15T10:30:00Z",
#   "type": "request",
#   "auth": { "client_token": "hvs.xxx", "policies": ["app-policy"] },
#   "request": { "operation": "read", "path": "secret/data/app/database" },
#   "response": { "data": { "keys": [...] } }
# }`} />
                </div>
              </div>
            </section>

            {/* Windows Comparison */}
            <WindowsComparisonBox
              windowsLabel="Windows: Credential Manager / Azure Key Vault"
              linuxLabel="Linux: HashiCorp Vault"
              windowsCode={`# Credential Manager — GUI, integrado com apps Microsoft
# Apenas senhas estáticas, sem rotação automática

# Azure Key Vault — excelente para workloads Azure, vendor lock-in
az keyvault secret set --vault-name MyVault --name dbpass --value "s3cr3t"

# DPAPI — criptografia vinculada à conta Windows/AD
[System.Security.Cryptography.ProtectedData]::Protect(...)

# Sem segredos dinâmicos nativos
# Senha do banco é estática e precisa de rotação manual`}
              linuxCode={`# HashiCorp Vault — API REST, multi-cloud, sem vendor lock-in

# KV v2 — segredos estáticos versionados
vault kv put secret/app/db username="app" password="s3cr3t"

# Transit engine — criptografia como serviço
vault write transit/encrypt/app-data plaintext=$(echo -n "dado" | base64)

# Database engine — segredos DINÂMICOS com TTL automático
vault read database/creds/app-role
# Cria usuário PostgreSQL por requisição — expira em 1h
# Credencial vazada = problema de no máximo 1 hora`}
            />

          </div>
        )}

        {/* ════════════════════════════════════════════
            ABA 2 — Políticas & AppRole
        ════════════════════════════════════════════ */}
        {isActive('config') && (
          <div className="space-y-16">

            {/* Políticas HCL */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[var(--mod)]" />
                Políticas HCL — Controle de Acesso
              </h2>

              <InfoBox title="Política = o que o token pode fazer">
                Policies no Vault são listas de paths com capabilities permitidas. Um token sem política explícita não pode fazer nada (deny by default). O root token é a exceção — tem acesso total.
              </InfoBox>

              <div className="mt-6 space-y-6">
                <CodeBlock code={`# policy.hcl — política para aplicação de backend

# Leitura de segredos da própria aplicação
path "secret/data/app/*" {
  capabilities = ["read", "list"]
}

# Acesso às credenciais do banco (apenas leitura)
path "database/creds/app-role" {
  capabilities = ["read"]
}

# Renovação de leases próprios
path "sys/leases/renew" {
  capabilities = ["update"]
}

# Revogação dos próprios tokens
path "auth/token/revoke-self" {
  capabilities = ["update"]
}

# Capabilities disponíveis:
# create  → POST/PUT para criar novos
# read    → GET para ler
# update  → POST/PUT em existentes
# delete  → DELETE
# list    → LIST para listar paths
# sudo    → operações privilegiadas (raramente necessário)
# deny    → bloquear explicitamente (sobrescreve qualquer allow)`} />

                <CodeBlock code={`# Aplicar política ao Vault
vault policy write app-backend policy.hcl

# Listar políticas
vault policy list

# Ler política existente
vault policy read app-backend

# Política de admin (sem acesso a segredos de produção)
cat > admin-policy.hcl << 'EOF'
# Admin pode gerenciar auth methods e políticas
path "auth/*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

path "sys/policies/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

# Mas NÃO pode ler segredos de produção
path "secret/data/prod/*" {
  capabilities = ["deny"]
}
EOF

vault policy write admin admin-policy.hcl`} />
              </div>
            </section>

            {/* AppRole */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Key className="w-6 h-6 text-[var(--mod)]" />
                AppRole — Autenticação para Máquinas
              </h2>

              <p className="text-text-2 mb-6">
                AppRole é o método de autenticação ideal para aplicações e pipelines CI/CD.
                A app apresenta dois fatores: <code className="text-[var(--mod)]">role-id</code> (identificador público, como um username)
                e <code className="text-[var(--mod)]">secret-id</code> (credencial privada, como uma senha). Ambos combinados geram um token Vault com TTL.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-3">1. Habilitar AppRole e criar role para a aplicação</h3>
                  <CodeBlock code={`# Habilitar auth method AppRole
vault auth enable approle

# Criar role para a aplicação
vault write auth/approle/role/app-backend \\
  secret_id_ttl=24h \\
  token_num_uses=10 \\
  token_ttl=1h \\
  token_max_ttl=4h \\
  secret_id_num_uses=40 \\
  policies="app-backend"

# Parâmetros importantes:
# secret_id_ttl    → secret-id expira em 24h
# token_num_uses   → token pode ser usado no máximo 10x
# token_ttl        → token válido por 1h
# secret_id_num_uses → secret-id pode ser usado 40x`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">2. Obter role-id e secret-id</h3>
                  <CodeBlock code={`# Obter role-id (pode ser versionado no código como variável de env)
vault read auth/approle/role/app-backend/role-id
# role_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890

# Gerar secret-id (deve ser tratado como senha — não commitar!)
vault write -f auth/approle/role/app-backend/secret-id
# secret_id:       s.xxxxxxxxxxxxxxxxxxxxxxxx
# secret_id_accessor: yyyy...

# Em pipelines CI/CD: gerar secret-id na hora do deploy
# Em containers: injetar via secrets manager do orquestrador`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">3. Autenticar e obter token Vault</h3>
                  <CodeBlock code={`# Autenticar com role-id + secret-id → obtém token Vault
vault write auth/approle/login \\
  role_id="a1b2c3d4-e5f6-7890-abcd-ef1234567890" \\
  secret_id="s.xxxxxxxxxxxxxxxxxxxxxxxx"

# Resposta:
# Key                  Value
# token                hvs.APP_TOKEN_HERE
# token_duration       1h
# token_policies       [app-backend]

# Exportar para uso na aplicação
export VAULT_TOKEN="hvs.APP_TOKEN_HERE"

# Ler segredo com o token da aplicação
vault kv get secret/app/database

# Via API REST (como a aplicação faria):
curl -H "X-Vault-Token: $VAULT_TOKEN" \\
  http://vault:8200/v1/secret/data/app/database | jq '.data.data'`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">4. Renovação de token antes da expiração</h3>
                  <CodeBlock code={`# Renovar token (antes de expirar)
vault token renew $VAULT_TOKEN

# Ver info do token atual
vault token lookup $VAULT_TOKEN

# Revogar token explicitamente (ex: logout da app)
vault token revoke $VAULT_TOKEN

# Revogar todos os secret-ids de uma role (emergência)
vault write auth/approle/role/app-backend/secret-id/destroy \\
  secret_id_accessor="yyyy..."`} />
                </div>
              </div>

              <HighlightBox title="AppRole em Kubernetes com Vault Agent Injector">
                <p className="text-sm mb-3">
                  No Kubernetes, o Vault Agent Injector elimina a necessidade de lógica de Vault no código da aplicação.
                  Um sidecar injeta os segredos como arquivos no pod automaticamente:
                </p>
                <CodeBlock code={`# Annotations no Deployment para injeção automática
metadata:
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "app-backend"
    vault.hashicorp.com/agent-inject-secret-db: "secret/data/app/database"
    vault.hashicorp.com/agent-inject-template-db: |
      {{- with secret "secret/data/app/database" -}}
      export DB_USER="{{ .Data.data.username }}"
      export DB_PASS="{{ .Data.data.password }}"
      {{- end -}}

# O Vault Agent escreve em /vault/secrets/db
# O container app lê: source /vault/secrets/db`} />
              </HighlightBox>
            </section>

            {/* PKI Engine */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[var(--mod)]" />
                PKI Secrets Engine — CA Interna
              </h2>

              <p className="text-text-2 mb-6">
                O PKI engine transforma o Vault em uma Autoridade Certificadora interna.
                Certificados TLS para serviços internos gerados em segundos, com rotação automática e TTL curto.
              </p>

              <CodeBlock code={`# Habilitar PKI engine
vault secrets enable pki

# Configurar TTL máximo de 10 anos para a CA raiz
vault secrets tune -max-lease-ttl=87600h pki

# Gerar certificado CA raiz
vault write -field=certificate pki/root/generate/internal \\
  common_name="Workshop Linux Internal CA" \\
  ttl=87600h > /tmp/ca.crt

# Configurar URLs de CRL e OCSP
vault write pki/config/urls \\
  issuing_certificates="http://vault:8200/v1/pki/ca" \\
  crl_distribution_points="http://vault:8200/v1/pki/crl"

# Criar role para emitir certificados de serviço
vault write pki/roles/internal-service \\
  allowed_domains="svc.cluster.local,internal.lab" \\
  allow_subdomains=true \\
  max_ttl=72h

# Emitir certificado para um serviço
vault write pki/issue/internal-service \\
  common_name="nginx.svc.cluster.local" \\
  ttl=24h

# Saída inclui: certificate, private_key, ca_chain, serial_number`} />
            </section>

          </div>
        )}

        {/* ════════════════════════════════════════════
            ABA 3 — Segredos Dinâmicos
        ════════════════════════════════════════════ */}
        {isActive('avancado') && (
          <div className="space-y-16">

            {/* Database Secrets Engine */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-6 h-6 text-[var(--mod)]" />
                Database Secrets Engine — Credenciais Dinâmicas
              </h2>

              <InfoBox title="O que são segredos dinâmicos?">
                Em vez de uma senha fixa para o banco de dados, o Vault <strong>cria um usuário temporário no PostgreSQL</strong> sob demanda.
                Quando o TTL expira, o Vault <strong>deleta o usuário automaticamente</strong>. Cada requisição gera credenciais únicas.
                Vazamento de credenciais = problema de no máximo 1 hora (o TTL).
              </InfoBox>

              <div className="mt-6 space-y-8">
                <div>
                  <h3 className="font-semibold mb-3">1. Preparar PostgreSQL para o Vault</h3>
                  <CodeBlock lang="sql" code={`-- No PostgreSQL: criar usuário com permissão para criar roles
CREATE ROLE vault_admin LOGIN PASSWORD 'vaultpass' CREATEROLE;
GRANT CREATE ON DATABASE appdb TO vault_admin;

-- O Vault vai usar vault_admin para criar/deletar usuários dinâmicos`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">2. Configurar o Database secrets engine no Vault</h3>
                  <CodeBlock code={`# Habilitar o engine no path database/
vault secrets enable database

# Configurar conexão com PostgreSQL
vault write database/config/appdb \\
  plugin_name=postgresql-database-plugin \\
  allowed_roles="app-role,readonly-role" \\
  connection_url="postgresql://{{username}}:{{password}}@postgres:5432/appdb?sslmode=disable" \\
  username="vault_admin" \\
  password="vaultpass"

# Rotacionar a senha inicial (o Vault passa a gerenciar vault_admin)
vault write -force database/config/appdb/rotate-root`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">3. Criar role com template de criação de usuário</h3>
                  <CodeBlock code={`# Role com TTL de 1 hora — usuário criado no PostgreSQL com esse TTL
vault write database/roles/app-role \\
  db_name=appdb \\
  creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \\"{{name}}\\";" \\
  default_ttl=1h \\
  max_ttl=4h

# Role somente leitura para analytics
vault write database/roles/readonly-role \\
  db_name=appdb \\
  creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \\"{{name}}\\";" \\
  default_ttl=30m \\
  max_ttl=2h`} />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">4. Solicitar credenciais dinâmicas</h3>
                  <CodeBlock code={`# Gerar credenciais — cada chamada cria um usuário novo no PostgreSQL
vault read database/creds/app-role

# Saída:
# Key                Value
# lease_id           database/creds/app-role/AbC123xyz
# lease_duration     1h
# lease_renewable    true
# password           A1-VaultDynamic-XyZ
# username           v-approle-app-role-AbC123xyz

# No PostgreSQL, confirmar usuário criado:
# psql -U postgres -c "\\du" | grep v-approle

# Renovar lease antes da expiração
vault lease renew database/creds/app-role/AbC123xyz

# Revogar credencial imediatamente (ex: suspeita de comprometimento)
vault lease revoke database/creds/app-role/AbC123xyz`} />
                </div>
              </div>
            </section>

            {/* Transit Engine */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-[var(--mod)]" />
                Transit Engine — Criptografia como Serviço
              </h2>

              <p className="text-text-2 mb-6">
                O Transit engine expõe operações criptográficas via API sem que a aplicação precise gerenciar chaves.
                A chave nunca sai do Vault — a aplicação envia o dado em plaintext e recebe de volta cifrado.
              </p>

              <CodeBlock code={`# Habilitar Transit engine
vault secrets enable transit

# Criar chave de criptografia para a aplicação
vault write -f transit/keys/app-data

# Criptografar dados (input em base64)
vault write transit/encrypt/app-data \\
  plaintext=$(echo -n "dados-sensiveis" | base64)
# Resultado: vault:v1:AbCdEfGhIjKlMnOpQrStUvWxYz...

# Descriptografar
vault write transit/decrypt/app-data \\
  ciphertext="vault:v1:AbCdEfGhIjKlMnOpQrStUvWxYz..."
# plaintext (base64) → decode para obter original

# Rotacionar a chave (versões antigas ainda conseguem descriptografar)
vault write -f transit/keys/app-data/rotate

# Reencriptar dados com a chave mais nova
vault write transit/rewrap/app-data \\
  ciphertext="vault:v1:AbCdEfGhIjKlMnOpQrStUvWxYz..."
# Retorna vault:v2:NovoCiphertext...`} />
            </section>

            {/* Vault Agent */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Server className="w-6 h-6 text-[var(--mod)]" />
                Vault Agent — Autenticação e Renovação Automática
              </h2>

              <p className="text-text-2 mb-6">
                O Vault Agent é um processo daemon que roda junto à aplicação, cuida da autenticação,
                renovação de tokens e renderização de templates com segredos. A app nunca precisa
                falar diretamente com o Vault.
              </p>

              <CodeBlock code={`# /etc/vault-agent/agent.hcl
vault {
  address = "http://vault:8200"
}

auto_auth {
  method "approle" {
    mount_path = "auth/approle"
    config = {
      role_id_file_path   = "/etc/vault-agent/role_id"
      secret_id_file_path = "/etc/vault-agent/secret_id"
    }
  }

  sink "file" {
    config = {
      path = "/tmp/vault-token"
    }
  }
}

template {
  source      = "/etc/vault-agent/templates/app.env.tpl"
  destination = "/app/config/app.env"
  perms       = 0600
  command     = "systemctl reload myapp"
}

cache {
  use_auto_auth_token = true
}`} />

              <div className="mt-4">
                <CodeBlock code={`# /etc/vault-agent/templates/app.env.tpl
{{- with secret "secret/data/app/config" -}}
APP_SECRET_KEY={{ .Data.data.secret_key }}
APP_JWT_SECRET={{ .Data.data.jwt_secret }}
{{- end }}

{{- with secret "database/creds/app-role" -}}
DB_USERNAME={{ .Data.username }}
DB_PASSWORD={{ .Data.password }}
{{- end }}

# Iniciar Vault Agent como systemd service
vault agent -config=/etc/vault-agent/agent.hcl -log-level=info`} />
              </div>
            </section>

            {/* Erros comuns */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-warn" />
                Erros Comuns e Soluções
              </h2>
              <div className="space-y-3">
                {erros.map((err, i) => (
                  <details
                    key={i}
                    open={openError === i}
                    onToggle={(e) => {
                      const open = (e.target as HTMLDetailsElement).open;
                      toggleError(open ? i : -1);
                    }}
                    className="bg-bg-2 border border-border rounded-lg"
                  >
                    <summary className="px-5 py-4 cursor-pointer font-medium text-warn flex items-center gap-2 list-none">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {err.title}
                    </summary>
                    <div className="px-5 pb-5 pt-2 space-y-3 border-t border-border">
                      <p className="text-sm text-text-2">{err.desc}</p>
                      <CodeBlock code={err.fix} />
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Exercícios guiados */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Terminal className="w-6 h-6 text-[var(--mod)]" />
                Exercícios Guiados
              </h2>

              <div className="space-y-8">
                <div className="border border-border rounded-xl p-6">
                  <p className="font-bold text-lg mb-2">
                    Lab 1 — Setup completo com AppRole e KV v2
                  </p>
                  <p className="text-text-2 text-sm mb-4">
                    Instale o Vault em modo dev, crie uma política restrita, configure AppRole
                    e autentique uma aplicação simulada via curl para ler segredos sem usar root token.
                  </p>
                  <CodeBlock code={`# 1. Iniciar Vault em dev para o lab
vault server -dev -dev-root-token-id="root" &
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'

# 2. Criar estrutura de segredos
vault kv put secret/myapp/config \\
  api_key="key-abc123" \\
  jwt_secret="supersecret"

# 3. Criar política restrita
vault policy write myapp-policy - << 'EOF'
path "secret/data/myapp/*" {
  capabilities = ["read"]
}
EOF

# 4. Configurar AppRole
vault auth enable approle
vault write auth/approle/role/myapp \\
  policies="myapp-policy" \\
  token_ttl=1h

ROLE_ID=$(vault read -field=role_id auth/approle/role/myapp/role-id)
SECRET_ID=$(vault write -field=secret_id -f auth/approle/role/myapp/secret-id)

# 5. Autenticar como a aplicação (sem root token)
APP_TOKEN=$(vault write -field=token auth/approle/login \\
  role_id="$ROLE_ID" secret_id="$SECRET_ID")

# 6. Ler segredo com token restrito
curl -s -H "X-Vault-Token: $APP_TOKEN" \\
  http://127.0.0.1:8200/v1/secret/data/myapp/config | jq '.data.data'`} />
                </div>

                <div className="border border-border rounded-xl p-6">
                  <p className="font-bold text-lg mb-2">
                    Lab 2 — Database secrets engine com PostgreSQL
                  </p>
                  <p className="text-text-2 text-sm mb-4">
                    Configure o Database engine para PostgreSQL e observe credenciais sendo criadas
                    e destruídas automaticamente com base no TTL (2 minutos para o lab).
                  </p>
                  <CodeBlock code={`# Pré-requisito: PostgreSQL rodando
docker run -d --name postgres \\
  -e POSTGRES_PASSWORD=pgpass \\
  -p 5432:5432 postgres:16

# Criar usuário vault no PostgreSQL
docker exec -i postgres psql -U postgres << 'SQL'
CREATE ROLE vault_admin LOGIN PASSWORD 'vaultpass' CREATEROLE;
CREATE DATABASE appdb;
GRANT ALL PRIVILEGES ON DATABASE appdb TO vault_admin;
SQL

# Configurar no Vault
vault secrets enable database

vault write database/config/appdb \\
  plugin_name=postgresql-database-plugin \\
  connection_url="postgresql://{{username}}:{{password}}@localhost:5432/appdb?sslmode=disable" \\
  allowed_roles="app-role" \\
  username="vault_admin" \\
  password="vaultpass"

vault write database/roles/app-role \\
  db_name=appdb \\
  creation_statements="CREATE ROLE \\"{{name}}\\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT ALL PRIVILEGES ON DATABASE appdb TO \\"{{name}}\\";" \\
  default_ttl=2m \\
  max_ttl=5m

# Obter credenciais — usuário criado automaticamente no PostgreSQL
vault read database/creds/app-role

# Checar no banco: docker exec postgres psql -U postgres -c "\\du"
# Aguardar 2 minutos e checar — usuário deletado automaticamente!`} />
                </div>

                <div className="border border-border rounded-xl p-6">
                  <p className="font-bold text-lg mb-2">
                    Lab 3 — Audit log e detecção de acesso não autorizado
                  </p>
                  <p className="text-text-2 text-sm mb-4">
                    Habilite o audit log, tente acessar um path sem permissão e analise
                    os eventos para entender a auditoria completa do Vault.
                  </p>
                  <CodeBlock code={`# Habilitar audit log
sudo mkdir -p /var/log/vault
vault audit enable file file_path=/var/log/vault/audit.log

# Criar token sem permissão para secret/prod/
vault token create -policy=myapp-policy -ttl=30m
# Token: hvs.NOAUTH_TOKEN

# Tentar acessar path não autorizado
VAULT_TOKEN="hvs.NOAUTH_TOKEN" vault kv get secret/prod/database
# Error: 403 permission denied

# Analisar audit log — todos os eventos, inclusive negados
sudo tail -5 /var/log/vault/audit.log | jq -r '
  [.time, .type, .request.operation, .request.path, .response.auth.error // "ok"] | @tsv
'

# Filtrar apenas acessos negados
sudo cat /var/log/vault/audit.log | \\
  jq -c 'select(.response.auth.error != null)' | \\
  jq '{time, path: .request.path, error: .response.auth.error}'`} />
                </div>
              </div>
            </section>

          </div>
        )}

      </div>

      {/* ModuleNav */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <ModuleNav order={ADVANCED_ORDER} currentPath="/vault" />
      </div>

    </div>
  );
}
