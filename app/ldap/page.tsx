'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Users, Shield, Search, Server, Key, Network } from 'lucide-react';
import { useBadges } from '@/context/BadgeContext';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { InfoBox, WarnBox, WindowsComparisonBox } from '@/components/ui/Boxes';
import { FluxoCard } from '@/components/ui/FluxoCard';
import { ModuleNav } from '@/components/ui/ModuleNav';
import { ADVANCED_ORDER } from '@/data/courseOrder';

export default function LDAPPage() {
  const { checklist, updateChecklist, trackPageVisit } = useBadges();

  useEffect(() => {
    trackPageVisit('/ldap');
  }, [trackPageVisit]);

  const items = [
    { id: 'ldap-instalado',   label: 'slapd instalado, suffix e rootdn configurados, rootpw definido com slappasswd' },
    { id: 'ldap-usuarios',    label: 'OU=usuarios criada e pelo menos 2 usuários adicionados via ldapadd com LDIF' },
    { id: 'ldap-autenticacao',label: 'ldapsearch retorna usuários corretamente e autenticação LDAP testada com ldapwhoami' },
  ];

  return (
    <main className="module-accent-ldap min-h-screen bg-bg text-text">
      {/* Hero */}
      <div className="module-hero border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">👥</span>
            <div>
              <p className="section-label">Servidores e Serviços — S06</p>
              <h1 className="text-3xl font-bold text-text">LDAP / OpenLDAP</h1>
            </div>
          </div>
          <p className="text-text-2 text-lg max-w-2xl">
            Diretório centralizado de usuários e grupos: autenticação única para SSH,
            Samba, web apps e serviços internos. OpenLDAP é a implementação open source
            do protocolo LDAP — a base de todo serviço de diretório corporativo.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* FluxoCard */}
        <FluxoCard
          title="Fluxo: Do Zero ao Diretório LDAP"
          steps={[
            { label: 'apt install slapd',     sub: 'instalar e configurar suffix/rootdn',         icon: <Server size={14}/>, color: 'border-ok/50' },
            { label: 'slappasswd',            sub: 'gerar hash da senha do administrador',         icon: <Key    size={14}/>, color: 'border-accent/50' },
            { label: 'ldif: OUs + usuários',  sub: 'criar unidades organizacionais e contas',     icon: <Users  size={14}/>, color: 'border-info/50' },
            { label: 'ldapadd',               sub: 'importar estrutura do diretório via LDIF',    icon: <Server size={14}/>, color: 'border-layer-5/50' },
            { label: 'ldapsearch',            sub: 'consultar e validar entradas do diretório',   icon: <Search size={14}/>, color: 'border-layer-6/50' },
            { label: 'PAM + nsswitch',        sub: 'usuários LDAP autenticam no sistema Linux',   icon: <Shield size={14}/>, color: 'border-warn/50' },
          ]}
        />

        {/* O que é LDAP */}
        <section>
          <h2 className="section-title">O que é LDAP e por que usar</h2>
          <p className="text-text-2 mb-4">
            LDAP (Lightweight Directory Access Protocol) é um protocolo para acessar e
            manter informações de diretório distribuído. Pense nele como um banco de dados
            hierárquico otimizado para <strong>leitura frequente</strong> — perfeito para
            armazenar usuários, grupos, permissões e políticas de uma organização.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              { title: 'Sem LDAP (descentralizado)', items: ['Usuário criado em cada servidor separadamente', 'Senha diferente por serviço', 'Alterar senha = alterar em N lugares', 'Demissão = revogar acesso em N servidores'] },
              { title: 'Com LDAP (centralizado)', items: ['Usuário criado uma vez no diretório', 'Mesma senha para SSH, Samba, VPN, apps', 'Alterar senha = alterar em 1 lugar', 'Demissão = desabilitar conta = acesso revogado em tudo'] },
            ].map(({ title, items }) => (
              <div key={title} className="bg-bg-2 border border-border rounded-lg p-4">
                <p className="font-semibold text-text text-sm mb-2">{title}</p>
                <ul className="space-y-1">
                  {items.map(i => <li key={i} className="text-text-2 text-sm">• {i}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bg-3 text-text-2">
                  <th className="text-left p-3 border border-border">Conceito</th>
                  <th className="text-left p-3 border border-border">Significado</th>
                  <th className="text-left p-3 border border-border">Exemplo</th>
                </tr>
              </thead>
              <tbody className="text-text-2">
                <tr><td className="p-3 border border-border font-mono text-accent text-xs">DN</td><td className="p-3 border border-border">Distinguished Name — caminho único no diretório</td><td className="p-3 border border-border font-mono text-xs">uid=joao,ou=usuarios,dc=empresa,dc=com</td></tr>
                <tr className="bg-bg-2"><td className="p-3 border border-border font-mono text-accent text-xs">dc</td><td className="p-3 border border-border">Domain Component</td><td className="p-3 border border-border font-mono text-xs">dc=empresa,dc=com → empresa.com</td></tr>
                <tr><td className="p-3 border border-border font-mono text-accent text-xs">ou</td><td className="p-3 border border-border">Organizational Unit — pasta/departamento</td><td className="p-3 border border-border font-mono text-xs">ou=usuarios, ou=grupos, ou=ti</td></tr>
                <tr className="bg-bg-2"><td className="p-3 border border-border font-mono text-accent text-xs">cn</td><td className="p-3 border border-border">Common Name — nome do objeto</td><td className="p-3 border border-border font-mono text-xs">cn=João Silva, cn=admins</td></tr>
                <tr><td className="p-3 border border-border font-mono text-accent text-xs">uid</td><td className="p-3 border border-border">User Identifier — login do usuário</td><td className="p-3 border border-border font-mono text-xs">uid=joao</td></tr>
                <tr className="bg-bg-2"><td className="p-3 border border-border font-mono text-accent text-xs">objectClass</td><td className="p-3 border border-border">Tipo do objeto — define atributos obrigatórios</td><td className="p-3 border border-border font-mono text-xs">inetOrgPerson, posixAccount</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Instalação */}
        <section>
          <h2 className="section-title">Instalação e Configuração Inicial</h2>
          <CodeBlock lang="bash" code={`# Instalar slapd (servidor LDAP) e utilitários de linha de comando
apt install slapd ldap-utils -y

# Durante a instalação será pedida a senha de admin — pode pular (reconfiguraremos)
# Reconfigurar com dpkg:
dpkg-reconfigure slapd

# Responder às perguntas:
# 1. Omit OpenLDAP server configuration? → No
# 2. DNS domain name? → empresa.com  (será o suffix: dc=empresa,dc=com)
# 3. Organization name? → Empresa SA
# 4. Administrator password? → senha_forte_aqui
# 5. Database backend? → MDB (mais eficiente)
# 6. Remove database on purge? → No
# 7. Move old database? → Yes

# Verificar serviço rodando
systemctl status slapd
ss -tlnp | grep 389          # porta 389 (LDAP) deve estar aberta

# Testar conexão anônima
ldapsearch -x -H ldap://localhost -b "dc=empresa,dc=com"
# Deve retornar: result: 0 Success`} />
          <InfoBox className="mt-3">
            <strong>Suffix e Base DN:</strong> se o domínio for <code>empresa.com</code>, o suffix LDAP é <code>dc=empresa,dc=com</code>. Todo DN no diretório termina com esse sufixo. O admin (<code>rootdn</code>) geralmente é <code>cn=admin,dc=empresa,dc=com</code>.
          </InfoBox>
        </section>

        {/* Estrutura LDIF */}
        <section>
          <h2 className="section-title">LDIF — Criar Estrutura de Unidades Organizacionais</h2>
          <p className="text-text-2 mb-4">
            LDIF (LDAP Data Interchange Format) é o formato de texto para importar e exportar
            dados do diretório. Cada entrada é separada por uma linha em branco.
          </p>
          <CodeBlock lang="bash" code={`# /etc/ldap/estrutura.ldif
# Criar OUs (Organizational Units) — as "pastas" do diretório

dn: ou=usuarios,dc=empresa,dc=com
objectClass: organizationalUnit
ou: usuarios
description: Usuarios do sistema

dn: ou=grupos,dc=empresa,dc=com
objectClass: organizationalUnit
ou: grupos
description: Grupos do sistema

dn: ou=ti,dc=empresa,dc=com
objectClass: organizationalUnit
ou: ti
description: Departamento de TI`} />
          <CodeBlock lang="bash" code={`# Importar a estrutura (autenticar como rootdn)
ldapadd -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" \\
  -W \\
  -f /etc/ldap/estrutura.ldif

# -x = autenticação simples, -D = bind DN (admin), -W = pedir senha, -f = arquivo

# Verificar estrutura criada
ldapsearch -x -H ldap://localhost \\
  -b "dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(objectClass=organizationalUnit)"`} />
        </section>

        {/* Adicionar usuários */}
        <section>
          <h2 className="section-title">Adicionar Usuários ao Diretório</h2>
          <CodeBlock lang="bash" code={`# /etc/ldap/usuarios.ldif
# Usuário com objectClass inetOrgPerson (web/apps) + posixAccount (login Linux)

dn: uid=joao,ou=usuarios,dc=empresa,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: Joao Silva
sn: Silva
givenName: Joao
uid: joao
uidNumber: 10001
gidNumber: 10001
homeDirectory: /home/joao
loginShell: /bin/bash
mail: joao@empresa.com
userPassword: {SSHA}hash_gerado_pelo_slappasswd

dn: uid=maria,ou=usuarios,dc=empresa,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
cn: Maria Santos
sn: Santos
givenName: Maria
uid: maria
uidNumber: 10002
gidNumber: 10001
homeDirectory: /home/maria
loginShell: /bin/bash
mail: maria@empresa.com
userPassword: {SSHA}hash_gerado_pelo_slappasswd`} />
          <CodeBlock lang="bash" code={`# Gerar hash de senha seguro (SSHA = Salted SHA)
slappasswd -s "senhadousuario123"
# Saída: {SSHA}AbCdEf...  ← copiar para userPassword no LDIF

# Importar usuários
ldapadd -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" \\
  -W -f /etc/ldap/usuarios.ldif

# Buscar usuário específico
ldapsearch -x -H ldap://localhost \\
  -b "ou=usuarios,dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(uid=joao)"

# Testar autenticação do usuário (bind como joao)
ldapwhoami -x -H ldap://localhost \\
  -D "uid=joao,ou=usuarios,dc=empresa,dc=com" \\
  -W
# Saída esperada: dn:uid=joao,ou=usuarios,dc=empresa,dc=com`} />
        </section>

        {/* Operações LDAP */}
        <section>
          <h2 className="section-title">Operações Essenciais — Modificar, Buscar, Deletar</h2>
          <CodeBlock lang="bash" code={`# ── MODIFICAR atributo de um usuário ────────────────────────────
# /tmp/modifica.ldif
dn: uid=joao,ou=usuarios,dc=empresa,dc=com
changetype: modify
replace: mail
mail: joao.silva@empresa.com

ldapmodify -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  -f /tmp/modifica.ldif

# ── ALTERAR SENHA de usuário ─────────────────────────────────────
ldappasswd -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  -s "novasenha456" \\
  "uid=joao,ou=usuarios,dc=empresa,dc=com"

# ── BUSCAR usuários filtrando por email ──────────────────────────
ldapsearch -x -H ldap://localhost \\
  -b "dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(mail=*@empresa.com)" uid cn mail

# ── BUSCAR com múltiplos filtros (AND) ──────────────────────────
ldapsearch -x -H ldap://localhost \\
  -b "ou=usuarios,dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(&(objectClass=posixAccount)(uidNumber>=10000))"

# ── DELETAR entrada ──────────────────────────────────────────────
ldapdelete -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "uid=joao,ou=usuarios,dc=empresa,dc=com"`} />
        </section>

        {/* Grupos */}
        <section>
          <h2 className="section-title">Grupos LDAP — Organizar Permissões</h2>
          <CodeBlock lang="bash" code={`# /etc/ldap/grupos.ldif

dn: cn=sysadmins,ou=grupos,dc=empresa,dc=com
objectClass: groupOfNames
cn: sysadmins
description: Administradores de sistema
member: uid=joao,ou=usuarios,dc=empresa,dc=com

dn: cn=developers,ou=grupos,dc=empresa,dc=com
objectClass: groupOfNames
cn: developers
description: Equipe de desenvolvimento
member: uid=maria,ou=usuarios,dc=empresa,dc=com
member: uid=joao,ou=usuarios,dc=empresa,dc=com

# Importar grupos
ldapadd -x -H ldap://localhost \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  -f /etc/ldap/grupos.ldif

# Buscar membros de um grupo
ldapsearch -x -H ldap://localhost \\
  -b "ou=grupos,dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(cn=sysadmins)" member`} />
        </section>

        {/* TLS/LDAPS */}
        <section>
          <h2 className="section-title">Segurança — LDAPS e Firewall</h2>
          <CodeBlock lang="bash" code={`# ── FIREWALL: abrir apenas para IPs da LAN interna ─────────────
# Porta 389 = LDAP texto claro (só LAN)
iptables -A INPUT -p tcp --dport 389 -s 192.168.1.0/24 -j ACCEPT
iptables -A INPUT -p tcp --dport 389 -j DROP

# Porta 636 = LDAPS (TLS)
iptables -A INPUT -p tcp --dport 636 -s 192.168.1.0/24 -j ACCEPT

# ── LDAPS com certificado autoassinado ──────────────────────────
# Gerar certificado para o servidor LDAP
openssl req -new -x509 -nodes -out /etc/ldap/ssl/ldap.crt \\
  -keyout /etc/ldap/ssl/ldap.key -days 3650 \\
  -subj "/CN=ldap.empresa.com"
chmod 640 /etc/ldap/ssl/ldap.key
chown root:openldap /etc/ldap/ssl/ldap.key

# Configurar slapd via ldif (OLC - on-line configuration)
# /tmp/tls.ldif
dn: cn=config
changetype: modify
add: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ldap/ssl/ldap.crt
-
add: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ldap/ssl/ldap.crt
-
add: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ldap/ssl/ldap.key

ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/tls.ldif

# Testar LDAPS
ldapsearch -x -H ldaps://localhost \\
  -b "dc=empresa,dc=com" \\
  -D "cn=admin,dc=empresa,dc=com" -W \\
  "(objectClass=*)" dn`} />
          <WarnBox className="mt-3">
            <strong>NUNCA expor LDAP sem TLS na internet.</strong> LDAP padrão (porta 389) transmite credenciais em texto claro. Use LDAPS (636) ou StartTLS mesmo dentro da LAN quando trafegar senhas.
          </WarnBox>
        </section>

        {/* Integração PAM */}
        <section>
          <h2 className="section-title">Integração com PAM — Login Linux via LDAP</h2>
          <p className="text-text-2 mb-4">
            Com <code className="text-accent">libpam-ldapd</code> + <code className="text-accent">nslcd</code>, usuários do diretório LDAP podem
            fazer SSH no servidor Linux sem conta local.
          </p>
          <CodeBlock lang="bash" code={`# Instalar cliente LDAP para PAM
apt install libnss-ldapd libpam-ldapd nslcd -y

# Durante a instalação pedir:
# LDAP server URI: ldap://192.168.1.10
# Distinguished name of search base: dc=empresa,dc=com
# Name services to configure: passwd, group, shadow

# /etc/nslcd.conf — cliente de diretório
uri ldap://192.168.1.10
base dc=empresa,dc=com
binddn cn=admin,dc=empresa,dc=com
bindpw senhaadmin

# /etc/nsswitch.conf — adicionar ldap às fontes
# passwd:   files ldap
# group:    files ldap
# shadow:   files ldap

# Reiniciar serviços
systemctl restart nslcd nscd

# Testar: usuário LDAP deve aparecer como usuário Linux
getent passwd joao
# Saída: joao:x:10001:10001:Joao Silva:/home/joao:/bin/bash

# Habilitar criação automática de home directory
pam-auth-update --enable mkhomedir

# Testar login SSH com usuário LDAP
ssh joao@localhost`} />
          <InfoBox className="mt-3">
            <strong>Fluxo de autenticação:</strong> SSH → PAM → nslcd → LDAP server → validação da senha → sucesso. O usuário não precisa existir em <code>/etc/passwd</code> — o nslcd fornece as informações dinamicamente.
          </InfoBox>
        </section>

        {/* WindowsComparisonBox */}
        <WindowsComparisonBox
          windowsLabel="Windows — Active Directory"
          linuxLabel="Linux — OpenLDAP"
          windowsCode={`# Active Directory = LDAP + Kerberos + DNS + GPO
# Instalar via Server Manager:
# → Add Roles → Active Directory Domain Services
# → Promote to domain controller

# PowerShell:
Install-WindowsFeature AD-Domain-Services
Install-ADDSForest -DomainName "empresa.com"

# Gerenciar usuários:
New-ADUser -Name "Joao Silva" \`
  -SamAccountName "joao" \`
  -UserPrincipalName "joao@empresa.com" \`
  -Enabled $true
Set-ADAccountPassword joao

# Busca LDAP no AD:
# Base DN: DC=empresa,DC=com
# Admin: CN=Administrator,CN=Users,DC=empresa,DC=com`}
          linuxCode={`# OpenLDAP = LDAP puro (sem Kerberos/GPO)
# Instalar:
apt install slapd ldap-utils -y
dpkg-reconfigure slapd

# Criar usuário via LDIF:
cat > usuario.ldif << EOF
dn: uid=joao,ou=usuarios,dc=empresa,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
uid: joao
cn: Joao Silva
uidNumber: 10001
gidNumber: 10001
homeDirectory: /home/joao
EOF
ldapadd -x -D "cn=admin,dc=empresa,dc=com" \\
  -W -f usuario.ldif

# Busca:
ldapsearch -x -b "dc=empresa,dc=com" \\
  "(uid=joao)"`}
        />

        {/* Troubleshooting */}
        <section>
          <h2 className="section-title">Troubleshooting</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { prob: 'ldapsearch: Can\'t contact LDAP server',  sol: 'slapd rodando? ss -tlnp | grep 389. Firewall bloqueando? Porta e URI corretos?' },
              { prob: 'ldapadd: Invalid credentials (49)',       sol: 'Senha do admin errada, ou -D DN incorreto. Verificar: cn=admin,dc=empresa,dc=com' },
              { prob: 'ldapadd: Already exists (68)',            sol: 'Entrada já existe. Usar ldapmodify com changetype: modify para atualizar.' },
              { prob: 'getent passwd não mostra usuários LDAP',  sol: 'nslcd rodando? /etc/nsswitch.conf tem "ldap"? Testar: nslcd -d para debug' },
            ].map(({ prob, sol }) => (
              <div key={prob} className="bg-bg-2 border border-border rounded-lg p-4">
                <p className="font-semibold text-warn text-sm mb-1">⚠ {prob}</p>
                <p className="text-text-2 text-sm">{sol}</p>
              </div>
            ))}
          </div>
          <CodeBlock lang="bash" code={`# Logs do slapd
journalctl -u slapd -f

# Testar conexão básica (anônima)
ldapsearch -x -H ldap://localhost -b "" -s base

# Ver configuração atual do slapd (OLC)
ldapsearch -Y EXTERNAL -H ldapi:/// -b "cn=config" -LLL

# Debug do nslcd (cliente PAM)
nslcd --debug

# Verificar schema carregado
ldapsearch -Y EXTERNAL -H ldapi:/// \\
  -b "cn=schema,cn=config" "(cn=*)" dn`} />
        </section>

        {/* Exercícios */}
        <section>
          <h2 className="section-title">Exercícios Guiados</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'Instalar e estruturar o diretório',
                desc: 'Instale slapd com suffix dc=empresa,dc=com. Crie as OUs usuarios e grupos via ldapadd. Confirme com ldapsearch retornando as 2 OUs.' },
              { n: 2, title: 'Adicionar e consultar usuários',
                desc: 'Crie 2 usuários (uid=joao e uid=maria) com objectClass posixAccount. Use slappasswd para gerar as senhas. Confirme com ldapwhoami autenticando como joao.' },
              { n: 3, title: 'Login Linux via LDAP',
                desc: 'Instale libpam-ldapd + nslcd, configure nsswitch.conf. Confirme que getent passwd mostra os usuários LDAP. Teste SSH com um usuário do diretório.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-bg-2 border border-border rounded-lg p-4 flex gap-4">
                <span className="text-accent font-bold text-xl min-w-[1.5rem]">{n}</span>
                <div>
                  <p className="font-semibold text-text">{title}</p>
                  <p className="text-text-2 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Checklist */}
        <section>
          <h2 className="section-title">Checklist do Lab</h2>
          <div className="space-y-3">
            {items.map(item => (
              <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={e => updateChecklist(item.id, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
                />
                <span className={`text-sm ${checklist[item.id] ? 'line-through text-text-3' : 'text-text-2'} group-hover:text-text transition-colors`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
          {items.every(i => checklist[i.id]) && (
            <div className="mt-6 p-4 bg-ok/10 border border-ok/30 rounded-lg text-center">
              <p className="text-ok font-semibold">👥 LDAP Master desbloqueado!</p>
              <p className="text-text-2 text-sm mt-1">Diretório centralizado configurado — todos os serviços podem autenticar em um só lugar.</p>
            </div>
          )}
        </section>

        {/* ── Erros Comuns ── */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-warn">⚠️</span> Erros Comuns e Soluções
          </h2>
          {[
            {
              err: 'ldap_bind: Invalid credentials (49) — autenticação falha',
              fix: 'DN do bind incorreto ou senha errada. Verificar o cn= exato do usuário: ldapsearch -x -H ldap://localhost -b "dc=empresa,dc=local" "(uid=usuario)". O DN completo é obrigatório: cn=admin,dc=empresa,dc=local — não apenas admin.',
            },
            {
              err: 'ldapadd: Insufficient access (50) — permissão negada ao adicionar entrada',
              fix: 'O usuário de bind não tem ACL para escrita. Usar o DN do admin (rootDN) para operações administrativas. Verificar ACLs no slapd.conf ou via olcAccess no back-end LDAP. O rootDN sempre tem acesso total independente das ACLs.',
            },
            {
              err: 'Login SSH via LDAP falha — getent passwd usuario não retorna nada',
              fix: 'nsswitch.conf ou nslcd não está configurado. Verificar: systemctl status nslcd. Testar: getent passwd. Confirmar /etc/nslcd.conf com uri, base e binddn corretos. Reiniciar: systemctl restart nslcd nscd.',
            },
            {
              err: 'LDAPS falha: certificate verify failed',
              fix: 'Certificado autoassinado não confiável pelo cliente. Adicionar à configuração do cliente: TLS_REQCERT never (para testes) ou TLS_CACERT /caminho/ca.crt (produção). No /etc/nslcd.conf: tls_reqcert never durante testes iniciais.',
            },
          ].map(({ err, fix }) => (
            <div key={err} className="border border-err/20 bg-err/5 rounded-xl p-5">
              <p className="font-mono text-sm text-err mb-2">❌ {err}</p>
              <p className="text-sm text-text-2">✅ {fix}</p>
            </div>
          ))}
        </section>

        <ModuleNav currentPath="/ldap" order={ADVANCED_ORDER} />
      </div>
    </main>
  );
}
