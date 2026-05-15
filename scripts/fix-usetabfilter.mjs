/**
 * Fix-up após migrate-usetabfilter.mjs:
 *
 * Bug 1 (TODOS): {isActive('xyz' && (  →  {isActive('xyz') && (
 * Bug 2 (outliers t.id): remover role="tab" + aria-selected explícitos,
 *   substituir onClick ainda manual por {...tabButtonProps(t.id)}
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  'app/ansible/page.tsx', 'app/apache/page.tsx', 'app/ataques-avancados/page.tsx',
  'app/audit-logs/page.tsx', 'app/cicd/page.tsx', 'app/dnat/page.tsx',
  'app/dns/page.tsx', 'app/docker-compose/page.tsx', 'app/docker/page.tsx',
  'app/ebpf-avancado/page.tsx', 'app/ebpf/page.tsx', 'app/fail2ban/page.tsx',
  'app/hardening/page.tsx', 'app/instalacao/page.tsx', 'app/kubernetes/page.tsx',
  'app/laboratorio/page.tsx', 'app/lan-proxy/page.tsx', 'app/ldap/page.tsx',
  'app/nextcloud/page.tsx', 'app/nfs/page.tsx', 'app/nftables/page.tsx',
  'app/nginx-ssl/page.tsx', 'app/openvpn/page.tsx', 'app/opnsense/page.tsx',
  'app/pivoteamento/page.tsx', 'app/port-knocking/page.tsx', 'app/proxmox/page.tsx',
  'app/samba/page.tsx', 'app/service-mesh/page.tsx', 'app/sre/page.tsx',
  'app/ssh-2fa/page.tsx', 'app/suricata/page.tsx', 'app/terraform/page.tsx',
  'app/traefik/page.tsx', 'app/vpn-ipsec/page.tsx', 'app/wan-nat/page.tsx',
  'app/wireguard/page.tsx',
  // Já migrados (proof-of-concept) — incluir para corrigir o Bug 1 se presente
  'app/monitoring/page.tsx', 'app/topicos/page.tsx', 'app/cheat-sheet/page.tsx',
];

let fixed = 0;
let clean = 0;

for (const rel of PAGES) {
  const fullPath = path.join(ROOT, rel);
  let src;
  try { src = fs.readFileSync(fullPath, 'utf8'); } catch { continue; }

  // Normaliza CRLF → LF para regex consistente
  let out = src.replace(/\r\n/g, '\n');

  // ── Bug 1: {isActive('tabname'  →  {isActive('tabname')  ──────────────────
  // Corrige padrão: {isActive('palavra' && (  →  {isActive('palavra') && (
  // Usa lookahead para garantir que o ')' não existe já
  out = out.replace(/\{isActive\('([\w-]+)'\s*&&/g, "{isActive('$1') &&");

  // ── Bug 2 (outliers t.id): limpar role + aria-selected explícitos ──────────
  // Linha: role="tab"  (standalone, sem ser dentro de tabButtonProps)
  // Linha: aria-selected={isActive(t.id)}  (já corrigida pelo migrate, agora redundante)
  // Linha: onClick={() => setActiveTab(t.id)}  (não substituída pelo migrate)
  //
  // Detecta se a página é outlier (ainda tem o onClick manual com t.id)
  if (out.includes("onClick={() => setActiveTab(t.id)}")) {
    // Remove as três linhas e substitui por {...tabButtonProps(t.id)}
    // Padrão: linha role + linha aria-selected + linha onClick
    out = out.replace(
      /^([ \t]*)role="tab"\n[ \t]*aria-selected=\{isActive\(t\.id\)\}\n[ \t]*onClick=\{.*?setActiveTab\(t\.id\)\}/m,
      '$1{...tabButtonProps(t.id)}'
    );
    // Fallback: se apenas onClick sobrou (role+aria-selected já removidos)
    out = out.replace(
      /[ \t]*onClick=\{\(\) => setActiveTab\(t\.id\)\}/g,
      ''
    );
  }

  // Restaura CRLF se o original era CRLF
  if (src.includes('\r\n')) out = out.replace(/\n/g, '\r\n');

  if (out === src) {
    clean++;
    continue;
  }

  fs.writeFileSync(fullPath, out, 'utf8');
  console.log(`✅ Corrigido: ${rel}`);
  fixed++;
}

console.log(`\n📊 ${fixed} corrigidos · ${clean} já ok`);
