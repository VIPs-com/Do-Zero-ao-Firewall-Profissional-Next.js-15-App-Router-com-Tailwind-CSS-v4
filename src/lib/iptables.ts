/**
 * Gerador de regras iptables — lógica pura (Sprint Ferramentas v2).
 *
 * Monta o comando `iptables` a partir de campos estruturados. Zero React,
 * totalmente testável. Não executa nada — apenas constrói a string.
 */

export interface IptablesRule {
  /** Tabela — 'filter' (padrão) ou 'nat'. */
  table: 'filter' | 'nat';
  /** Chain — INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING. */
  chain: string;
  /** Protocolo. 'all' omite o `-p`. */
  protocol: 'tcp' | 'udp' | 'icmp' | 'all';
  /** Porta de destino (`--dport`). Só vale para tcp/udp. */
  dport: string;
  /** Origem (`-s`) — IP ou CIDR. */
  source: string;
  /** Interface de entrada (`-i`). */
  inInterface: string;
  /** Estado conntrack (`-m conntrack --ctstate`). Vazio = omite. */
  ctstate: string;
  /** Alvo (`-j`) — ACCEPT, DROP, REJECT, LOG. */
  action: string;
}

/** Regra inicial em branco — útil como estado-padrão de formulário. */
export const EMPTY_RULE: IptablesRule = {
  table: 'filter',
  chain: 'INPUT',
  protocol: 'tcp',
  dport: '',
  source: '',
  inInterface: '',
  ctstate: '',
  action: 'ACCEPT',
};

/**
 * Constrói o comando `iptables` correspondente à regra.
 * Campos vazios são omitidos; `--dport` só entra com protocolo tcp/udp.
 */
export function buildIptablesRule(r: IptablesRule): string {
  const parts: string[] = ['iptables'];

  if (r.table && r.table !== 'filter') parts.push('-t', r.table);

  parts.push('-A', r.chain);

  if (r.inInterface.trim()) parts.push('-i', r.inInterface.trim());
  if (r.protocol !== 'all') parts.push('-p', r.protocol);
  if (r.source.trim()) parts.push('-s', r.source.trim());

  if (r.dport.trim() && (r.protocol === 'tcp' || r.protocol === 'udp')) {
    parts.push('--dport', r.dport.trim());
  }

  if (r.ctstate.trim()) parts.push('-m', 'conntrack', '--ctstate', r.ctstate.trim());

  parts.push('-j', r.action);

  return parts.join(' ');
}

/**
 * Constrói um script com várias regras `iptables`, uma por linha — pronto para
 * colar num arquivo `.sh` ou executar em sequência. Lista vazia → string vazia.
 */
export function buildIptablesScript(rules: IptablesRule[]): string {
  return rules.map(buildIptablesRule).join('\n');
}
