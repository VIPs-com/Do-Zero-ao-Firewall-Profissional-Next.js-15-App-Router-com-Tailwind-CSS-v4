/**
 * Jornada Unificada — compõe as 3 trilhas (Fundamentos → Firewall → Avançados)
 * numa única linha do tempo "do zero ao avançado". Lógica pura, zero React.
 *
 * `path`/`title`/`trail` são DERIVADOS dos arrays existentes em courseOrder.ts +
 * MODULE_META — sem duplicar listas de slugs. Só os atributos novos (dificuldade,
 * tempo estimado e checkpoint opcional) vivem no mapa JOURNEY_META abaixo.
 *
 * Invariante: `/ssh-proxy` está apenas em FUNDAMENTOS_ORDER (F16) — NÃO em
 * ADVANCED_ORDER — então concatenar os 3 arrays produz 64 paths únicos.
 */
import { FUNDAMENTOS_ORDER, COURSE_ORDER, ADVANCED_ORDER } from './courseOrder';
import { MODULE_META } from './topics';

export type Difficulty = 'iniciante' | 'intermediario' | 'avancado';
export type JourneyTrail = 'fundamentos' | 'firewall' | 'avancados';

export interface JourneyModule {
  /** Rota do módulo (ex.: '/fhs'). */
  path: string;
  /** Rótulo de exibição. */
  title: string;
  /** Trilha à qual o módulo pertence. */
  trail: JourneyTrail;
  /** Nível de dificuldade. */
  difficulty: Difficulty;
  /** Tempo estimado de estudo em minutos. */
  estMin: number;
  /** Primeiro checkpoint do módulo (sinal secundário de "concluído"). */
  checkpoint?: string;
}

interface JourneyMetaEntry {
  difficulty: Difficulty;
  estMin: number;
  checkpoint?: string;
}

/**
 * Atributos NOVOS por módulo (keyed por path). Todo path dos 3 arrays de ordem
 * precisa ter uma entrada aqui — `journey.test.ts` garante isso.
 */
const JOURNEY_META: Record<string, JourneyMetaEntry> = {
  // ── Fundamentos (iniciante) ───────────────────────────────────────────────
  '/fhs':               { difficulty: 'iniciante', estMin: 20, checkpoint: 'fhs-explorado' },
  '/comandos':          { difficulty: 'iniciante', estMin: 25, checkpoint: 'comandos-praticados' },
  '/editores':          { difficulty: 'iniciante', estMin: 20, checkpoint: 'editores-usados' },
  '/processos':         { difficulty: 'iniciante', estMin: 25, checkpoint: 'processos-controlados' },
  '/permissoes':        { difficulty: 'iniciante', estMin: 25, checkpoint: 'permissoes-configuradas' },
  '/usuarios':          { difficulty: 'iniciante', estMin: 20, checkpoint: 'usuario-criado' },
  '/discos':            { difficulty: 'iniciante', estMin: 25, checkpoint: 'discos-mapeados' },
  '/logs-basicos':      { difficulty: 'iniciante', estMin: 20, checkpoint: 'logs-lidos' },
  '/backup':            { difficulty: 'iniciante', estMin: 25, checkpoint: 'backup-criado' },
  '/shell-script':      { difficulty: 'iniciante', estMin: 30, checkpoint: 'script-escrito' },
  '/cron':              { difficulty: 'iniciante', estMin: 20, checkpoint: 'tarefa-agendada' },
  '/pacotes':           { difficulty: 'iniciante', estMin: 20, checkpoint: 'apt-atualizado' },
  '/boot':              { difficulty: 'iniciante', estMin: 25, checkpoint: 'bios-uefi-entendido' },
  '/comandos-avancados':{ difficulty: 'iniciante', estMin: 30, checkpoint: 'sed-dominado' },
  '/rsyslog':           { difficulty: 'iniciante', estMin: 25, checkpoint: 'rsyslog-configurado' },
  '/ssh-proxy':         { difficulty: 'iniciante', estMin: 25, checkpoint: 'ssh-dinamico' },
  '/troubleshooting':   { difficulty: 'iniciante', estMin: 30, checkpoint: 'trouble-conectividade' },
  // ── Firewall (intermediário) ──────────────────────────────────────────────
  '/instalacao':        { difficulty: 'intermediario', estMin: 35 },
  '/wan-nat':           { difficulty: 'intermediario', estMin: 40 },
  '/dns':               { difficulty: 'intermediario', estMin: 35 },
  '/nginx-ssl':         { difficulty: 'intermediario', estMin: 40 },
  '/lan-proxy':         { difficulty: 'intermediario', estMin: 35 },
  '/dnat':              { difficulty: 'intermediario', estMin: 35 },
  '/port-knocking':     { difficulty: 'intermediario', estMin: 30 },
  '/vpn-ipsec':         { difficulty: 'intermediario', estMin: 45 },
  '/wireguard':         { difficulty: 'intermediario', estMin: 35 },
  '/nftables':          { difficulty: 'intermediario', estMin: 35 },
  '/fail2ban':          { difficulty: 'intermediario', estMin: 30 },
  '/hardening':         { difficulty: 'intermediario', estMin: 40 },
  '/ssh-2fa':           { difficulty: 'intermediario', estMin: 30 },
  '/docker':            { difficulty: 'intermediario', estMin: 40 },
  '/docker-compose':    { difficulty: 'intermediario', estMin: 35 },
  '/audit-logs':        { difficulty: 'intermediario', estMin: 35 },
  '/ataques-avancados': { difficulty: 'intermediario', estMin: 40 },
  '/pivoteamento':      { difficulty: 'intermediario', estMin: 35 },
  '/laboratorio':       { difficulty: 'intermediario', estMin: 30 },
  '/proxmox':           { difficulty: 'intermediario', estMin: 40 },
  '/evolucao':          { difficulty: 'intermediario', estMin: 15 },
  '/cheat-sheet':       { difficulty: 'intermediario', estMin: 10 },
  '/glossario':         { difficulty: 'intermediario', estMin: 10 },
  '/quiz':              { difficulty: 'intermediario', estMin: 15 },
  '/certificado':       { difficulty: 'intermediario', estMin: 10 },
  // ── Avançados (avançado) ──────────────────────────────────────────────────
  '/dhcp':          { difficulty: 'avancado', estMin: 35 },
  '/samba':         { difficulty: 'avancado', estMin: 35 },
  '/apache':        { difficulty: 'avancado', estMin: 40 },
  '/openvpn':       { difficulty: 'avancado', estMin: 45 },
  '/traefik':       { difficulty: 'avancado', estMin: 40 },
  '/ldap':          { difficulty: 'avancado', estMin: 50 },
  '/pihole':        { difficulty: 'avancado', estMin: 35 },
  '/nfs':           { difficulty: 'avancado', estMin: 35 },
  '/haproxy':       { difficulty: 'avancado', estMin: 40 },
  '/ansible':       { difficulty: 'avancado', estMin: 50 },
  '/monitoring':    { difficulty: 'avancado', estMin: 50 },
  '/kubernetes':    { difficulty: 'avancado', estMin: 60 },
  '/terraform':     { difficulty: 'avancado', estMin: 50 },
  '/suricata':      { difficulty: 'avancado', estMin: 45 },
  '/ebpf':          { difficulty: 'avancado', estMin: 50 },
  '/service-mesh':  { difficulty: 'avancado', estMin: 55 },
  '/sre':           { difficulty: 'avancado', estMin: 45 },
  '/vault':         { difficulty: 'avancado', estMin: 45 },
  '/cicd':          { difficulty: 'avancado', estMin: 45 },
  '/opnsense':      { difficulty: 'avancado', estMin: 40 },
  '/nextcloud':     { difficulty: 'avancado', estMin: 40 },
  '/ebpf-avancado': { difficulty: 'avancado', estMin: 55 },
};

/** Erro explícito se um path do array de ordem não tiver metadado. */
function buildPhase(
  order: ReadonlyArray<{ path: string; title: string }>,
  trail: JourneyTrail,
): JourneyModule[] {
  return order.map((m) => {
    const meta = JOURNEY_META[m.path];
    if (!meta) throw new Error(`journey.ts: falta metadado para ${m.path}`);
    return {
      path: m.path,
      title: MODULE_META[m.path]?.label ?? m.title,
      trail,
      difficulty: meta.difficulty,
      estMin: meta.estMin,
      checkpoint: meta.checkpoint,
    };
  });
}

/** A jornada completa: 64 módulos em ordem pedagógica (Fundamentos → Firewall → Avançados). */
export const JOURNEY: JourneyModule[] = [
  ...buildPhase(FUNDAMENTOS_ORDER, 'fundamentos'),
  ...buildPhase(COURSE_ORDER, 'firewall'),
  ...buildPhase(ADVANCED_ORDER, 'avancados'),
];

/** Tempo total estimado da jornada, em minutos. */
export const JOURNEY_TOTAL_MINUTES: number = JOURNEY.reduce((sum, m) => sum + m.estMin, 0);

/** Um módulo está "concluído" se a página foi visitada (slug ou path) ou seu checkpoint marcado. */
function isModuleDone(
  m: JourneyModule,
  visited: Set<string>,
  checklist: Record<string, boolean>,
): boolean {
  if (visited.has(m.path) || visited.has(m.path.slice(1))) return true;
  if (m.checkpoint && checklist[m.checkpoint]) return true;
  return false;
}

/**
 * Retorna o próximo módulo recomendado em toda a jornada (primeiro incompleto),
 * ou `null` se tudo foi concluído.
 */
export function getNextJourneyModule(
  visitedPages: string[],
  checklist: Record<string, boolean> = {},
): JourneyModule | null {
  const visited = new Set(visitedPages);
  return JOURNEY.find((m) => !isModuleDone(m, visited, checklist)) ?? null;
}

/** Progresso geral da jornada — contagem e percentual. */
export function getJourneyProgress(
  visitedPages: string[],
  checklist: Record<string, boolean> = {},
): { completed: number; total: number; percent: number } {
  const visited = new Set(visitedPages);
  const completed = JOURNEY.filter((m) => isModuleDone(m, visited, checklist)).length;
  const total = JOURNEY.length;
  return { completed, total, percent: Math.round((completed / total) * 100) };
}
