/**
 * Calculadora de sub-redes CIDR — lógica pura, IPv4 (Sprint Ferramentas Portáteis).
 *
 * Zero dependências, zero React — totalmente testável em isolamento.
 * Toda aritmética usa `>>> 0` para tratar os inteiros como 32 bits sem sinal.
 */

export type IPScope =
  | 'privado'
  | 'público'
  | 'loopback'
  | 'link-local'
  | 'multicast'
  | 'reservado';

export interface CidrInfo {
  /** IP digitado, normalizado. */
  ip: string;
  /** Prefixo /n (0–32). */
  prefix: number;
  /** Máscara de sub-rede (ex.: 255.255.255.0). */
  netmask: string;
  /** Máscara curinga / wildcard (ex.: 0.0.0.255). */
  wildcard: string;
  /** Endereço de rede. */
  network: string;
  /** Endereço de broadcast. */
  broadcast: string;
  /** Primeiro host utilizável. */
  firstHost: string;
  /** Último host utilizável. */
  lastHost: string;
  /** Hosts utilizáveis (descontando rede e broadcast; /31 e /32 são casos especiais). */
  usableHosts: number;
  /** Total de endereços no bloco (2^(32-n)). */
  totalAddresses: number;
  /** Classe histórica do IP (A–E). */
  ipClass: string;
  /** Escopo do endereço. */
  scope: IPScope;
}

/** Converte 4 octetos num inteiro 32 bits sem sinal. */
function octetsToInt(o: number[]): number {
  return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
}

/** Converte um inteiro 32 bits num IPv4 pontuado. */
export function intToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join('.');
}

function classOf(firstOctet: number): string {
  if (firstOctet === 127) return 'A (loopback)';
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (multicast)';
  return 'E (reservado)';
}

function scopeOf(ipInt: number): IPScope {
  const inRange = (base: string, prefix: number) => {
    const o = base.split('.').map(Number);
    const baseInt = octetsToInt(o);
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return (ipInt & mask) >>> 0 === baseInt;
  };
  if (inRange('127.0.0.0', 8)) return 'loopback';
  if (inRange('10.0.0.0', 8) || inRange('172.16.0.0', 12) || inRange('192.168.0.0', 16))
    return 'privado';
  if (inRange('169.254.0.0', 16)) return 'link-local';
  if (inRange('224.0.0.0', 4)) return 'multicast';
  if (inRange('240.0.0.0', 4)) return 'reservado';
  return 'público';
}

/**
 * Faz o parse de uma entrada CIDR e calcula todas as propriedades da sub-rede.
 *
 * Aceita `"192.168.1.10/24"` ou `"192.168.1.10"` (prefixo ausente → /32).
 * Retorna `null` se a entrada for inválida.
 */
export function parseCidr(input: string): CidrInfo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const [ipPart, prefixPart] = trimmed.split('/');
  const octets = ipPart.split('.');
  if (octets.length !== 4) return null;

  const o = octets.map((p) => Number(p));
  if (o.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return null;
  // Rejeita octetos com espaços/vazios ou não-numéricos.
  if (octets.some((p) => p === '' || !/^\d+$/.test(p))) return null;

  let prefix = 32;
  if (prefixPart !== undefined) {
    if (!/^\d+$/.test(prefixPart)) return null;
    prefix = Number(prefixPart);
    if (prefix < 0 || prefix > 32) return null;
  }

  const ipInt = octetsToInt(o);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const wildcardInt = ~mask >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | wildcardInt) >>> 0;
  const totalAddresses = 2 ** (32 - prefix);

  let usableHosts: number;
  let firstHost: number;
  let lastHost: number;
  if (prefix === 32) {
    usableHosts = 1;
    firstHost = network;
    lastHost = network;
  } else if (prefix === 31) {
    // RFC 3021 — enlace ponto-a-ponto: ambos os endereços são utilizáveis.
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
  } else {
    usableHosts = totalAddresses - 2;
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
  }

  return {
    ip: o.join('.'),
    prefix,
    netmask: intToIp(mask),
    wildcard: intToIp(wildcardInt),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    usableHosts,
    totalAddresses,
    ipClass: classOf(o[0]),
    scope: scopeOf(ipInt),
  };
}
