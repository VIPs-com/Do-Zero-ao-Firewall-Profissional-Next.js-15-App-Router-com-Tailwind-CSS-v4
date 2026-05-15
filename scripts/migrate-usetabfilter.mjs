/**
 * Sprint HOOK-MIGRATE — migra todas as páginas com padrão manual de tabs
 * para usar o hook useTabFilter<T>.
 *
 * Duas variantes de padrão:
 *   A) tab.id  — onClick={() => setActiveTab(tab.id as typeof activeTab)}
 *   B) t.id    — role="tab" + aria-selected={...} + onClick={() => setActiveTab(t.id)}
 *
 * Transformações aplicadas:
 *   1. Adiciona import useTabFilter (se ausente)
 *   2. Substitui useState declaração → useTabFilter
 *   3. Corrige onClick do botão de aba (padrão A ou B)
 *   4. Substitui activeTab === tab.id / t.id → isActive(tab.id / t.id) no className
 *   5. Substitui {activeTab === 'xxx' → {isActive('xxx' nas seções de conteúdo
 *   6. Remove useState do import se não for mais usado
 *
 * Uso: node scripts/migrate-usetabfilter.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

// ── Páginas para migrar ──────────────────────────────────────────────────────
const PAGES = [
  'app/ansible/page.tsx',
  'app/apache/page.tsx',
  'app/ataques-avancados/page.tsx',
  'app/audit-logs/page.tsx',
  'app/cicd/page.tsx',
  'app/dnat/page.tsx',
  'app/dns/page.tsx',
  'app/docker-compose/page.tsx',
  'app/docker/page.tsx',
  'app/ebpf-avancado/page.tsx',
  'app/ebpf/page.tsx',
  'app/fail2ban/page.tsx',
  'app/hardening/page.tsx',
  'app/instalacao/page.tsx',
  'app/kubernetes/page.tsx',
  'app/laboratorio/page.tsx',
  'app/lan-proxy/page.tsx',
  'app/ldap/page.tsx',
  'app/nextcloud/page.tsx',
  'app/nfs/page.tsx',
  'app/nftables/page.tsx',
  'app/nginx-ssl/page.tsx',
  'app/openvpn/page.tsx',
  'app/opnsense/page.tsx',
  'app/pivoteamento/page.tsx',
  'app/port-knocking/page.tsx',
  'app/proxmox/page.tsx',
  'app/samba/page.tsx',
  'app/service-mesh/page.tsx',
  'app/sre/page.tsx',
  'app/ssh-2fa/page.tsx',
  'app/suricata/page.tsx',
  'app/terraform/page.tsx',
  'app/traefik/page.tsx',
  'app/vpn-ipsec/page.tsx',
  'app/wan-nat/page.tsx',
  'app/wireguard/page.tsx',
];

let changed = 0;
let skipped = 0;
let errors = 0;

for (const rel of PAGES) {
  const fullPath = path.join(ROOT, rel);
  let src;
  try {
    src = fs.readFileSync(fullPath, 'utf8');
  } catch {
    console.error(`❌ Não encontrado: ${rel}`);
    errors++;
    continue;
  }

  // Já migrado?
  if (src.includes('useTabFilter')) {
    console.log(`⏭  Já migrado: ${rel}`);
    skipped++;
    continue;
  }

  let out = src;

  // ── 1. Adicionar import useTabFilter ──────────────────────────────────────
  // Encontra última linha de import e insere depois
  const importRegex = /^import .+$/mg;
  let lastImportMatch = null;
  let m;
  while ((m = importRegex.exec(out)) !== null) lastImportMatch = m;

  if (lastImportMatch) {
    const insertPos = lastImportMatch.index + lastImportMatch[0].length;
    out = out.slice(0, insertPos)
      + "\nimport { useTabFilter } from '@/hooks/useTabFilter';"
      + out.slice(insertPos);
  }

  // ── 2. Substituir useState<XxxTab>('val') → useTabFilter<XxxTab>('val') ──
  // Suporta tanto useState quanto React.useState, incluindo espaços variados
  out = out.replace(
    /const \[activeTab, setActiveTab\] = (?:React\.)?useState<([^>]+)>\(('[\w-]+')\);/g,
    "const { activeTab, setActiveTab, isActive, tabButtonProps } = useTabFilter<$1>($2);"
  );

  // ── 3A. Padrão A (tab.id): substituir onClick ─────────────────────────────
  // onClick={() => setActiveTab(tab.id as typeof activeTab)}
  out = out.replace(
    /onClick=\{.*?setActiveTab\(tab\.id(?:\s+as\s+typeof\s+activeTab)?\)\}/g,
    '{...tabButtonProps(tab.id)}'
  );

  // ── 3B. Padrão B (t.id): substituir bloco role+aria-selected+onClick ──────
  // O bloco pode ter vários formatos de indentação; usa multiline
  out = out.replace(
    /[ \t]*role="tab"\n[ \t]*aria-selected=\{activeTab === t\.id\}\n[ \t]*onClick=\{.*?setActiveTab\(t\.id\)\}/g,
    (match) => {
      // Preserva a indentação da primeira linha
      const indent = match.match(/^([ \t]*)/)?.[1] ?? '            ';
      return `${indent}{...tabButtonProps(t.id)}`;
    }
  );

  // ── 4A. Padrão A: className condition ─────────────────────────────────────
  out = out.replace(/activeTab === tab\.id/g, 'isActive(tab.id)');

  // ── 4B. Padrão B: className condition ─────────────────────────────────────
  out = out.replace(/activeTab === t\.id/g, 'isActive(t.id)');

  // ── 5. Condições de renderização de seções ─────────────────────────────────
  // {activeTab === 'xxx'  →  {isActive('xxx'
  out = out.replace(/\{activeTab === '/g, "{isActive('");
  // Também cobre: activeTab === 'xxx' && (sem { inicial)
  // (seguro: os anteriores já cobriam tab.id e t.id via className, este cobre strings literais)

  // ── 6. Remover useState do import se não mais usado ────────────────────────
  // Só remove se useState não aparece mais no arquivo (exceto na linha de import)
  const srcWithoutImports = out.replace(/^import .+$/mg, '');
  if (!srcWithoutImports.includes('useState')) {
    // Remove ', useState' ou 'useState, ' de dentro do import React
    out = out.replace(/, useState\b/g, '');
    out = out.replace(/\buseState, /g, '');
    // Se a linha ficou só com 'import React from...' ou 'import { useEffect } from...' tudo bem
  }

  if (out === src) {
    console.log(`⚠️  Sem mudanças detectadas: ${rel}`);
    skipped++;
    continue;
  }

  if (DRY) {
    console.log(`🔍 [dry-run] Seria modificado: ${rel}`);
  } else {
    fs.writeFileSync(fullPath, out, 'utf8');
    console.log(`✅ Migrado: ${rel}`);
  }
  changed++;
}

console.log(`\n📊 Resultado: ${changed} migrados · ${skipped} ignorados · ${errors} erros`);
