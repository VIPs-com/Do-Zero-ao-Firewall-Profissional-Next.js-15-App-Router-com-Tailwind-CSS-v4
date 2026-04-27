'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Server, FileCode, Package, RefreshCw, Users, Layers, Shield } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';

export default function AnsiblePage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/ansible');
  }, [trackPageVisit]);

  const items = [
    { id: 'ansible-instalado',  label: 'Ansible instalado (ansible --version) e inventário com pelo menos um host configurado — ping bem-sucedido' },
    { id: 'ansible-playbook',   label: 'Playbook executado com sucesso: Nginx instalado, firewall configurado e usuário criado em servidor remoto (ou localhost)' },
    { id: 'ansible-roles',      label: 'Role estruturada com tasks/, handlers/, templates/ e defaults/ criada e importada em playbook de produção' },
  ];

  return (
    <main className="module-accent-ansible min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚙️</span>
            <span className="section-label">v4.0 · Infraestrutura Moderna</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Ansible para SysAdmins</h1>
          <p className="text-text-2 text-lg leading-relaxed max-w-2xl">
            Infraestrutura como Código com Ansible — automatize configuração de dezenas de servidores com
            playbooks YAML legíveis, sem instalar agentes e sem aprender uma linguagem nova.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {['agentless', 'SSH', 'YAML', 'idempotente', 'playbooks', 'roles', 'Galaxy'].map(t => (
              <span key={t} className="font-mono text-xs bg-mod/10 text-mod border border-mod/30 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* O que é Ansible */}
        <section>
          <h2 className="section-title">O que é Ansible e por que ele importa</h2>
          <p className="text-text-2 mb-6 leading-relaxed">
            Ansible é uma ferramenta de automação de TI desenvolvida pela Red Hat que funciona de forma
            <strong> agentless</strong> — não precisa instalar nada nos servidores gerenciados. Ele se conecta
            via SSH, executa tarefas descritas em YAML e se desconecta. Simples assim.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Terminal size={20} />, title: 'Agentless', desc: 'Conecta via SSH. Sem daemon, sem PKI própria, sem overhead nos servidores gerenciados.' },
              { icon: <FileCode size={20} />, title: 'YAML Legível', desc: 'Playbooks são arquivos de texto compreensíveis. Um sysadmin que não conhece Ansible entende o que vai acontecer.' },
              { icon: <RefreshCw size={20} />, title: 'Idempotente', desc: 'Rodar o mesmo playbook 10× tem o mesmo resultado que rodar 1×. Seguro para re-executar após mudanças parciais.' },
            ].map(f => (
              <div key={f.title} className="bg-bg-2 border border-border rounded-xl p-5">
                <div className="text-mod mb-3">{f.icon}</div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-text-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparação com alternativas */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-2">
                  <th className="text-left p-4 font-mono text-text-2">Critério</th>
                  <th className="text-left p-4 font-bold text-mod">Ansible</th>
                  <th className="text-left p-4 text-text-2">Puppet</th>
                  <th className="text-left p-4 text-text-2">Chef</th>
                  <th className="text-left p-4 text-text-2">Salt</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Agente no host',   '❌ Não',      '✅ Sim',   '✅ Sim',  '✅ Sim'],
                  ['Linguagem',        'YAML',         'Puppet DSL','Ruby',   'YAML/Python'],
                  ['Curva de aprendizado', 'Baixa',    'Alta',     'Alta',    'Média'],
                  ['Push vs Pull',     'Push (padrão)','Pull',     'Pull',    'Ambos'],
                  ['Windows support',  '✅ Bom',      '✅ Bom',   '✅ Bom',  '✅ Bom'],
                  ['Comunidade',       'Enorme',       'Grande',   'Média',   'Média'],
                ].map(([c, a, p, ch, s]) => (
                  <tr key={c} className="border-b border-border/50 hover:bg-bg-2/50">
                    <td className="p-4 font-mono text-text-2 text-xs">{c}</td>
                    <td className="p-4 text-ok font-semibold">{a}</td>
                    <td className="p-4 text-text-2">{p}</td>
                    <td className="p-4 text-text-2">{ch}</td>
                    <td className="p-4 text-text-2">{s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Instalação</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O Ansible é instalado apenas na máquina de controle (seu laptop ou servidor de CI). Os hosts
            gerenciados precisam apenas de Python 3 e SSH habilitado.
          </p>

          <CodeBlock lang="bash" code={`# Ubuntu/Debian — repositório oficial
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install -y ansible

# Verificar instalação
ansible --version
# ansible [core 2.17.x]
#   config file = /etc/ansible/ansible.cfg
#   python version = 3.x
#   jinja version = 3.x

# Alternativa via pip (Python) — qualquer distro
python3 -m pip install --user ansible

# Instalar coleções adicionais (ex: community.general)
ansible-galaxy collection install community.general`} />

          <InfoBox title="Controle x Nós Gerenciados">
            <p>A <strong>máquina de controle</strong> executa o Ansible e precisa do pacote instalado. Os
            <strong> nós gerenciados</strong> (servidores remotos) precisam apenas de Python 3 (quase sempre
            pré-instalado) e de um usuário com acesso SSH — sem nenhum agente ou daemon.</p>
          </InfoBox>
        </section>

        {/* Inventário */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Server size={22} /> Inventário — Definindo os Hosts</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O inventário lista os servidores que o Ansible irá gerenciar. Pode ser um arquivo estático
            (INI ou YAML) ou dinâmico (script que consulta AWS/Azure/GCP).
          </p>

          <CodeBlock lang="ini" code={`# /etc/ansible/hosts  (ou inventory.ini no projeto)

# Host avulso
servidor-web ansible_host=192.168.1.10

# Grupos de servidores
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[dbservers]
db1 ansible_host=192.168.1.20
db2 ansible_host=192.168.1.21

[dmz]
proxy ansible_host=10.0.0.5

# Variáveis por grupo
[webservers:vars]
ansible_user=deploy
ansible_python_interpreter=/usr/bin/python3
http_port=80

# Grupo de grupos
[producao:children]
webservers
dbservers`} />

          <CodeBlock lang="bash" code={`# Testar conectividade com TODOS os hosts
ansible all -m ping

# Só um grupo
ansible webservers -m ping

# Listar hosts do inventário
ansible all --list-hosts

# Informações sobre um host
ansible web1 -m setup | grep ansible_distribution

# Saída esperada de ping bem-sucedido:
# web1 | SUCCESS => {
#     "changed": false,
#     "ping": "pong"
# }`} />

          <WarnBox title="Chave SSH — sem senha interativa">
            <p>Em produção, configure autenticação por chave SSH entre a máquina de controle e os nós.
            Use <code>ssh-copy-id usuario@host</code> para copiar a chave pública. O Ansible não funciona
            bem com prompts de senha interativos em automações.</p>
          </WarnBox>
        </section>

        {/* Comandos Ad-hoc */}
        <section>
          <h2 className="section-title">Comandos Ad-hoc — Tarefas Únicas</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Comandos ad-hoc executam uma única tarefa sem precisar de um playbook. Úteis para diagnósticos,
            operações pontuais e explorar módulos novos.
          </p>

          <CodeBlock lang="bash" code={`# Sintaxe: ansible <hosts> -m <módulo> -a "<argumentos>" [opções]

# Fazer ping
ansible all -m ping

# Executar comando shell (módulo command — sem shell expansion)
ansible webservers -m command -a "uptime"

# Com shell expansion (pipes, redirecionamento)
ansible webservers -m shell -a "df -h | grep /dev/sda"

# Gerenciar pacotes (apt)
ansible webservers -m apt -a "name=nginx state=present" --become

# Reiniciar serviço
ansible webservers -m service -a "name=nginx state=restarted" --become

# Copiar arquivo para hosts
ansible webservers -m copy -a "src=./nginx.conf dest=/etc/nginx/nginx.conf" --become

# Coletar fatos (informações do sistema)
ansible web1 -m setup -a "filter=ansible_memtotal_mb"

# --become = sudo (privilege escalation)
# -i inventory.ini = especificar inventário customizado
# -u usuario = especificar usuário SSH
# -k = pedir senha SSH interativamente`} />
        </section>

        {/* Playbooks */}
        <section>
          <h2 className="section-title flex items-center gap-2"><FileCode size={22} /> Playbooks — Automação em YAML</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Um playbook define uma sequência de <strong>plays</strong>, cada play contém <strong>tasks</strong>
            executadas em ordem nos hosts alvo. É o coração do Ansible.
          </p>

          <CodeBlock lang="yaml" code={`# playbook-nginx.yml — instalar e configurar Nginx
---
- name: Configurar servidor web Nginx
  hosts: webservers         # grupo do inventário
  become: true              # usar sudo
  vars:
    nginx_port: 80
    site_name: "meu-site.local"

  tasks:
    - name: Atualizar cache do apt
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600  # não atualizar se cache < 1h

    - name: Instalar Nginx
      ansible.builtin.apt:
        name: nginx
        state: present          # present, absent, latest

    - name: Criar diretório do site
      ansible.builtin.file:
        path: /var/www/{{ site_name }}
        state: directory
        owner: www-data
        group: www-data
        mode: "0755"

    - name: Copiar configuração do VirtualHost
      ansible.builtin.template:
        src: templates/nginx-vhost.conf.j2
        dest: /etc/nginx/sites-available/{{ site_name }}
        owner: root
        mode: "0644"
      notify: Reiniciar Nginx   # aciona handler se houve mudança

    - name: Habilitar site
      ansible.builtin.file:
        src: /etc/nginx/sites-available/{{ site_name }}
        dest: /etc/nginx/sites-enabled/{{ site_name }}
        state: link

    - name: Garantir que Nginx está rodando
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true           # habilitar no boot

  handlers:
    # Executado apenas se alguma task notificou — e só UMA vez no final
    - name: Reiniciar Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted`} />

          <CodeBlock lang="bash" code={`# Executar playbook
ansible-playbook playbook-nginx.yml

# Dry-run — mostrar o que faria sem aplicar
ansible-playbook playbook-nginx.yml --check

# Ver diff das mudanças antes de aplicar
ansible-playbook playbook-nginx.yml --check --diff

# Executar apenas tarefas com uma tag específica
ansible-playbook playbook-nginx.yml --tags "configuracao"

# Limitar execução a um host específico
ansible-playbook playbook-nginx.yml --limit web1

# Saída verbose (muito útil para debug)
ansible-playbook playbook-nginx.yml -v    # verbose
ansible-playbook playbook-nginx.yml -vvv  # super verbose`} />

          <InfoBox title="CHANGED vs OK vs SKIPPED">
            <p><code className="text-ok">ok</code> — tarefa verificou e o estado já estava correto (idempotência em ação).<br />
            <code className="text-warn">changed</code> — tarefa fez uma modificação no sistema.<br />
            <code className="text-info">skipped</code> — tarefa foi pulada (condição <code>when:</code> falsa).<br />
            <code className="text-err">failed</code> — tarefa falhou, execução parou neste host.</p>
          </InfoBox>
        </section>

        {/* Variáveis e Templates */}
        <section>
          <h2 className="section-title">Variáveis e Templates Jinja2</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Ansible usa Jinja2 para renderizar templates. Qualquer arquivo <code>.j2</code> pode referenciar
            variáveis do inventário, do playbook ou coletadas pelo módulo <code>setup</code> (fatos).
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">templates/nginx-vhost.conf.j2</p>
              <CodeBlock lang="nginx" code={`server {
    listen {{ nginx_port }};
    server_name {{ site_name }};

    root /var/www/{{ site_name }};
    index index.html;

    # Fato automático: IP do host
    # {{ ansible_default_ipv4.address }}

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/{{ site_name }}.log;
}`} />
            </div>
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">group_vars/webservers.yml</p>
              <CodeBlock lang="yaml" code={`---
# Variáveis automáticas para grupo webservers
nginx_port: 80
site_name: "producao.empresa.com"
max_workers: 4

# Variáveis por host ficam em:
# host_vars/web1.yml
# host_vars/web2.yml`} />
              <p className="text-sm font-bold mb-2 mt-4 text-text-2">Precedência de variáveis</p>
              <div className="bg-bg-2 border border-border rounded-lg p-3 text-xs font-mono space-y-1">
                {['extra vars (-e) ← maior prioridade', 'task vars / include_vars', 'role vars (vars/main.yml)', 'host_vars/', 'group_vars/', 'role defaults ← menor prioridade'].map(v => (
                  <div key={v} className="text-text-2">{v}</div>
                ))}
              </div>
            </div>
          </div>

          <CodeBlock lang="yaml" code={`# Condicionais e loops em tasks
- name: Instalar pacotes necessários
  ansible.builtin.apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - curl
    - htop
    - vim

# Condicional when: (só executa se verdadeiro)
- name: Configurar firewall (apenas Debian/Ubuntu)
  ansible.builtin.ufw:
    rule: allow
    port: "{{ nginx_port }}"
  when: ansible_os_family == "Debian"

# Registrar saída de uma task
- name: Verificar se Nginx está rodando
  ansible.builtin.command: systemctl is-active nginx
  register: nginx_status
  ignore_errors: true

- name: Mostrar status
  ansible.builtin.debug:
    msg: "Nginx status: {{ nginx_status.stdout }}"

# Loop com dict
- name: Criar usuários do sistema
  ansible.builtin.user:
    name: "{{ item.name }}"
    groups: "{{ item.groups }}"
    shell: /bin/bash
  loop:
    - { name: "joao", groups: "sudo" }
    - { name: "maria", groups: "www-data" }
    - { name: "deploy", groups: "docker" }`} />
        </section>

        {/* Roles */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Layers size={22} /> Roles — Reutilização e Organização</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Roles são a forma de organizar e reutilizar playbooks. Uma role empacota tasks, handlers,
            templates, arquivos e variáveis em uma estrutura padronizada que pode ser compartilhada
            via Ansible Galaxy.
          </p>

          <CodeBlock lang="bash" code={`# Criar estrutura de role automaticamente
ansible-galaxy role init nginx-server

# Estrutura criada:
# nginx-server/
# ├── tasks/
# │   └── main.yml       ← tarefas principais
# ├── handlers/
# │   └── main.yml       ← handlers (notificados por tasks)
# ├── templates/
# │   └── vhost.conf.j2  ← templates Jinja2
# ├── files/
# │   └── index.html     ← arquivos estáticos
# ├── vars/
# │   └── main.yml       ← variáveis fixas da role
# ├── defaults/
# │   └── main.yml       ← variáveis padrão (substituíveis)
# ├── meta/
# │   └── main.yml       ← metadados e dependências
# └── README.md`} />

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">nginx-server/defaults/main.yml</p>
              <CodeBlock lang="yaml" code={`---
# Valores padrão — podem ser substituídos
nginx_port: 80
nginx_worker_processes: auto
nginx_client_max_body_size: "10m"
nginx_ssl_enabled: false
nginx_ssl_port: 443`} />
            </div>
            <div>
              <p className="text-sm font-bold mb-2 text-text-2">nginx-server/tasks/main.yml</p>
              <CodeBlock lang="yaml" code={`---
- name: Instalar Nginx
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: true

- name: Deploy nginx.conf
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Reload Nginx

- name: Habilitar e iniciar Nginx
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true`} />
            </div>
          </div>

          <CodeBlock lang="yaml" code={`# site.yml — playbook principal que usa roles
---
- name: Configurar servidores web
  hosts: webservers
  become: true
  roles:
    - role: nginx-server
      vars:
        nginx_port: 8080          # sobrescreve default da role
        nginx_ssl_enabled: true

- name: Configurar banco de dados
  hosts: dbservers
  become: true
  roles:
    - role: postgresql
    - role: backup-agent

- name: Configurar todos os servidores
  hosts: all
  become: true
  roles:
    - role: base-security         # hardening SSH, sysctl, fail2ban
    - role: monitoring-agent      # node_exporter para Prometheus`} />
        </section>

        {/* Playbook Real — Servidor Firewall */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Shield size={22} /> Playbook Real: Configurar Servidor Firewall</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Um playbook completo que automatiza a configuração inicial de um servidor Linux: usuário de deploy,
            SSH seguro, firewall iptables e Nginx como proxy reverso.
          </p>

          <CodeBlock lang="yaml" code={`# firewall-server.yml
---
- name: Configuração inicial do servidor firewall
  hosts: firewall
  become: true
  vars:
    deploy_user: deploy
    ssh_port: 22
    allowed_ssh_ips:
      - "192.168.1.0/24"
      - "10.0.0.5"

  tasks:
    # --- Usuário e SSH ---
    - name: Criar usuário de deploy
      ansible.builtin.user:
        name: "{{ deploy_user }}"
        groups: sudo
        shell: /bin/bash
        create_home: true

    - name: Configurar chave SSH para deploy
      ansible.posix.authorized_key:
        user: "{{ deploy_user }}"
        state: present
        key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"

    - name: Hardening do sshd_config
      ansible.builtin.lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "^{{ item.key }}"
        line: "{{ item.key }} {{ item.value }}"
        backup: true
      loop:
        - { key: "PasswordAuthentication", value: "no" }
        - { key: "PermitRootLogin",        value: "no" }
        - { key: "X11Forwarding",          value: "no" }
        - { key: "MaxAuthTries",           value: "3" }
      notify: Reiniciar SSHD

    # --- Firewall com iptables ---
    - name: Instalar iptables-persistent
      ansible.builtin.apt:
        name: ["iptables", "iptables-persistent"]
        state: present

    - name: Política padrão DROP em INPUT e FORWARD
      ansible.builtin.iptables:
        chain: "{{ item }}"
        policy: DROP
      loop: [INPUT, FORWARD]

    - name: Permitir ESTABLISHED e RELATED
      ansible.builtin.iptables:
        chain: INPUT
        ctstate: [ESTABLISHED, RELATED]
        jump: ACCEPT

    - name: Permitir loopback
      ansible.builtin.iptables:
        chain: INPUT
        in_interface: lo
        jump: ACCEPT

    - name: Permitir SSH de IPs autorizados
      ansible.builtin.iptables:
        chain: INPUT
        protocol: tcp
        destination_port: "{{ ssh_port }}"
        source: "{{ item }}"
        jump: ACCEPT
      loop: "{{ allowed_ssh_ips }}"

    - name: Salvar regras iptables
      ansible.builtin.command: netfilter-persistent save

    # --- Nginx ---
    - name: Instalar Nginx
      ansible.builtin.apt:
        name: nginx
        state: present

    - name: Permitir HTTP e HTTPS no firewall
      ansible.builtin.iptables:
        chain: INPUT
        protocol: tcp
        destination_port: "{{ item }}"
        jump: ACCEPT
      loop: ["80", "443"]
      notify: Salvar iptables

    - name: Nginx iniciado e habilitado
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Reiniciar SSHD
      ansible.builtin.service:
        name: sshd
        state: restarted

    - name: Salvar iptables
      ansible.builtin.command: netfilter-persistent save`} />
        </section>

        {/* Ansible Galaxy */}
        <section>
          <h2 className="section-title flex items-center gap-2"><Package size={22} /> Ansible Galaxy — Roles Prontas</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            O Galaxy é o repositório oficial de roles e coleções Ansible. Em vez de escrever do zero,
            use roles testadas pela comunidade para tarefas comuns.
          </p>

          <CodeBlock lang="bash" code={`# Buscar roles no Galaxy
ansible-galaxy search nginx
ansible-galaxy search postgresql --author geerlingguy

# Instalar role
ansible-galaxy role install geerlingguy.nginx

# Instalar versão específica
ansible-galaxy role install geerlingguy.nginx,3.2.0

# Listar roles instaladas
ansible-galaxy role list

# Arquivo requirements.yml — versionamento das dependências
cat > requirements.yml << 'EOF'
---
roles:
  - name: geerlingguy.nginx
    version: "3.2.0"
  - name: geerlingguy.docker
    version: "6.1.0"

collections:
  - name: community.general
    version: ">=8.0.0"
  - name: ansible.posix
EOF

# Instalar tudo do requirements.yml
ansible-galaxy install -r requirements.yml

# Atualizar roles existentes
ansible-galaxy role install -r requirements.yml --force`} />

          <InfoBox title="Jeff Geerling — O Ansible Evangelist">
            <p>As roles do <strong>geerlingguy</strong> no Galaxy são referência da comunidade — usadas por
            milhares de empresas. Antes de escrever uma role do zero, verifique se Jeff já escreveu (e
            provavelmente melhorou) no <a href="https://github.com/geerlingguy" className="text-info underline" target="_blank" rel="noopener noreferrer">github.com/geerlingguy</a>.</p>
          </InfoBox>
        </section>

        {/* Ansible Vault */}
        <section>
          <h2 className="section-title">Ansible Vault — Segredos no Controle de Versão</h2>
          <p className="text-text-2 mb-4 leading-relaxed">
            Vault criptografa arquivos de variáveis que contêm senhas, tokens e chaves privadas —
            permitindo armazená-los com segurança no git.
          </p>

          <CodeBlock lang="bash" code={`# Criar arquivo de segredos criptografado
ansible-vault create group_vars/all/vault.yml
# Pede senha → abre editor → salva criptografado

# Conteúdo do vault.yml (antes de criptografar):
# vault_db_password: "S3cr3t@2024"
# vault_api_key: "sk-abc123..."
# vault_ssl_key: |
#   -----BEGIN PRIVATE KEY-----
#   ...

# Editar vault existente
ansible-vault edit group_vars/all/vault.yml

# Ver conteúdo sem editar
ansible-vault view group_vars/all/vault.yml

# Executar playbook com vault
ansible-playbook site.yml --ask-vault-pass

# Ou com arquivo de senha (para automação/CI)
echo "minha-senha-vault" > ~/.vault_pass
chmod 600 ~/.vault_pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass

# Referenciar variável do vault no playbook
# vars_files:
#   - group_vars/all/vault.yml
# tasks:
#   - name: Configurar banco
#     postgresql_db: password="{{ vault_db_password }}"
`} />

          <WarnBox title="Nunca commitar senhas em plaintext">
            <p>Mesmo que o repositório seja privado, use <strong>Ansible Vault</strong> para qualquer segredo.
            Adicione o arquivo de senha do vault ao <code>.gitignore</code>. O arquivo criptografado
            pode ir para o git sem problemas.</p>
          </WarnBox>
        </section>

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Ansible do Inventário ao Deploy"
          steps={[
            { label: 'Inventário', sub: 'hosts por grupo + variáveis', icon: <Server size={14} />, color: 'border-info/50' },
            { label: 'Ad-hoc', sub: 'ansible all -m ping', icon: <Terminal size={14} />, color: 'border-ok/50' },
            { label: 'Playbook', sub: 'tasks + handlers + templates', icon: <FileCode size={14} />, color: 'border-mod/50' },
            { label: 'Roles', sub: 'tasks/ handlers/ templates/ defaults/', icon: <Layers size={14} />, color: 'border-warn/50' },
            { label: 'Galaxy', sub: 'reutilizar roles da comunidade', icon: <Package size={14} />, color: 'border-info/50' },
            { label: 'Vault', sub: 'segredos criptografados no git', icon: <Shield size={14} />, color: 'border-ok/50' },
          ]}
        />

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows / PowerShell DSC"
          linuxLabel="Ansible"
          windowsCode={`# PowerShell DSC — Desired State Configuration
Configuration WebServer {
  Node "WebServer01" {
    WindowsFeature IIS {
      Ensure = "Present"
      Name   = "Web-Server"
    }
    File SiteContent {
      Ensure = "Present"
      Type   = "Directory"
      DestinationPath = "C:\\inetpub\\wwwroot\\site"
    }
  }
}
# Compilar e aplicar:
WebServer
Start-DscConfiguration -Path .\\WebServer -Wait -Verbose

# Group Policy para configurações de sistema
# GPMC.msc → GPO → Computer Config → Preferences`}
          linuxCode={`# Ansible Playbook — equivalente
- hosts: webservers
  become: true
  tasks:
    - name: Instalar Nginx (= IIS no Linux)
      apt:
        name: nginx
        state: present   # Ensure Present

    - name: Criar diretório do site
      file:
        path: /var/www/site
        state: directory  # Ensure Directory

# Executar:
ansible-playbook site.yml

# Sem compilar, sem reiniciar agente —
# SSH direto, idempotente por padrão`}
        />

        {/* Exercícios Guiados */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-6">

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">1</span>
                <h3 className="font-bold">Inventário e primeiro ping</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar inventário local (testar no próprio servidor)
mkdir -p ~/ansible-lab && cd ~/ansible-lab
cat > inventory.ini << 'EOF'
[local]
localhost ansible_connection=local
EOF

# 2. Testar conectividade
ansible all -i inventory.ini -m ping

# Resultado esperado:
# localhost | SUCCESS => {
#     "changed": false,
#     "ping": "pong"
# }

# 3. Coletar fatos do sistema
ansible localhost -i inventory.ini -m setup -a "filter=ansible_distribution*"

# 4. Instalar pacote (curl) via ad-hoc
ansible localhost -i inventory.ini -m apt \
  -a "name=curl state=present" --become`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">2</span>
                <h3 className="font-bold">Playbook: instalar e configurar Nginx</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar estrutura do projeto
mkdir -p ~/ansible-lab/templates
cd ~/ansible-lab

# 2. Criar template do VirtualHost
cat > templates/nginx-default.conf.j2 << 'EOF'
server {
    listen {{ nginx_port | default(80) }};
    server_name {{ ansible_hostname }};

    location / {
        return 200 "Ansible configurou este servidor!\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 3. Criar playbook
cat > nginx.yml << 'EOF'
---
- name: Configurar Nginx
  hosts: local
  become: true
  vars:
    nginx_port: 8080

  tasks:
    - name: Instalar Nginx
      apt:
        name: nginx
        state: present
        update_cache: true

    - name: Copiar VirtualHost
      template:
        src: templates/nginx-default.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Reload Nginx

    - name: Nginx iniciado
      service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Reload Nginx
      service:
        name: nginx
        state: reloaded
EOF

# 4. Dry-run primeiro
ansible-playbook -i inventory.ini nginx.yml --check

# 5. Aplicar
ansible-playbook -i inventory.ini nginx.yml

# 6. Testar
curl http://localhost:8080`} />
            </div>

            <div className="bg-bg-2 border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-mod/15 text-mod border border-mod/30 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold">Criar e usar uma Role</h3>
              </div>
              <CodeBlock lang="bash" code={`# 1. Criar role base-security
cd ~/ansible-lab
ansible-galaxy role init roles/base-security

# 2. Definir defaults
cat > roles/base-security/defaults/main.yml << 'EOF'
---
ssh_port: 22
fail2ban_maxretry: 3
fail2ban_bantime: 3600
EOF

# 3. Escrever tasks
cat > roles/base-security/tasks/main.yml << 'EOF'
---
- name: Instalar fail2ban
  apt:
    name: fail2ban
    state: present

- name: Configurar jail SSH
  copy:
    dest: /etc/fail2ban/jail.d/ssh.conf
    content: |
      [sshd]
      enabled  = true
      port     = {{ ssh_port }}
      maxretry = {{ fail2ban_maxretry }}
      bantime  = {{ fail2ban_bantime }}
  notify: Reiniciar fail2ban

- name: fail2ban rodando
  service:
    name: fail2ban
    state: started
    enabled: true
EOF

# 4. Adicionar handler
cat > roles/base-security/handlers/main.yml << 'EOF'
---
- name: Reiniciar fail2ban
  service:
    name: fail2ban
    state: restarted
EOF

# 5. Usar a role no playbook
cat > site.yml << 'EOF'
---
- hosts: local
  become: true
  roles:
    - role: roles/base-security
      vars:
        fail2ban_maxretry: 5   # sobrescreve default
EOF

ansible-playbook -i inventory.ini site.yml`} />
            </div>
          </div>
        </section>

        {/* Erros Comuns */}
        <section>
          <h2 className="section-title">Erros Comuns e Soluções</h2>
          <div className="space-y-4">
            {[
              {
                err: 'UNREACHABLE! Failed to connect to the host via ssh',
                fix: 'Verificar IP no inventário, testar ssh usuario@host manualmente, confirmar que o usuário tem acesso SSH e que a chave está no authorized_keys.',
              },
              {
                err: 'Missing sudo password',
                fix: 'Adicionar --ask-become-pass no comando ou configurar NOPASSWD no sudoers: echo "deploy ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/deploy',
              },
              {
                err: 'template error: no filter named X',
                fix: 'Instalar a coleção community.general: ansible-galaxy collection install community.general. Filtros extras ficam em coleções separadas.',
              },
              {
                err: 'changed=0 mas tarefa não funcionou (apt install pulou)',
                fix: 'O Ansible achou que o estado já estava correto. Verificar se o pacote está instalado: dpkg -l | grep nginx. Se não estiver, usar state: latest ou force: true no módulo apt.',
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
            <Users size={22} className="text-mod" />
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
              ⚙️ Ansible Master — infraestrutura como código dominada!
            </div>
          )}
        </section>

        {/* Navegação */}
        <nav className="flex justify-between items-center pt-4 border-t border-border">
          <Link
            href="/pihole"
            className="flex items-center gap-2 text-sm text-text-2 hover:text-text transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Pi-hole</span>
          </Link>
          <Link
            href="/monitoring"
            className="flex items-center gap-2 text-sm text-text-2 hover:text-text transition-colors group"
          >
            <span>Prometheus + Grafana</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </nav>

      </div>
    </main>
  );
}
