/**
 * Testes da calculadora de sub-redes CIDR (Sprint Ferramentas Portáteis).
 * Lógica pura — sem React, roda em milissegundos.
 */
import { describe, it, expect } from 'vitest';
import { parseCidr, intToIp } from './cidr';

describe('intToIp', () => {
  it('converte inteiros para IPv4 pontuado', () => {
    expect(intToIp(0)).toBe('0.0.0.0');
    expect(intToIp(0xffffffff)).toBe('255.255.255.255');
    expect(intToIp(0xc0a80100)).toBe('192.168.1.0');
  });
});

describe('parseCidr — /24 clássico', () => {
  const r = parseCidr('192.168.1.10/24')!;
  it('calcula rede, broadcast e hosts', () => {
    expect(r.network).toBe('192.168.1.0');
    expect(r.broadcast).toBe('192.168.1.255');
    expect(r.firstHost).toBe('192.168.1.1');
    expect(r.lastHost).toBe('192.168.1.254');
    expect(r.usableHosts).toBe(254);
    expect(r.totalAddresses).toBe(256);
  });
  it('máscara e wildcard', () => {
    expect(r.netmask).toBe('255.255.255.0');
    expect(r.wildcard).toBe('0.0.0.255');
  });
  it('classe e escopo', () => {
    expect(r.ipClass).toBe('C');
    expect(r.scope).toBe('privado');
  });
});

describe('parseCidr — /8 grande', () => {
  it('10.0.0.5/8 → 16.777.214 hosts utilizáveis', () => {
    const r = parseCidr('10.0.0.5/8')!;
    expect(r.network).toBe('10.0.0.0');
    expect(r.broadcast).toBe('10.255.255.255');
    expect(r.usableHosts).toBe(16_777_214);
    expect(r.ipClass).toBe('A');
    expect(r.scope).toBe('privado');
  });
});

describe('parseCidr — casos especiais /31 e /32', () => {
  it('/32 → 1 host, rede = broadcast', () => {
    const r = parseCidr('192.168.1.10/32')!;
    expect(r.usableHosts).toBe(1);
    expect(r.network).toBe('192.168.1.10');
    expect(r.broadcast).toBe('192.168.1.10');
    expect(r.firstHost).toBe('192.168.1.10');
    expect(r.lastHost).toBe('192.168.1.10');
  });
  it('/31 → 2 hosts (RFC 3021 ponto-a-ponto)', () => {
    const r = parseCidr('10.0.0.0/31')!;
    expect(r.usableHosts).toBe(2);
    expect(r.firstHost).toBe('10.0.0.0');
    expect(r.lastHost).toBe('10.0.0.1');
  });
});

describe('parseCidr — /0 (rota default)', () => {
  it('0.0.0.0/0 cobre todo o espaço de endereços', () => {
    const r = parseCidr('0.0.0.0/0')!;
    expect(r.netmask).toBe('0.0.0.0');
    expect(r.wildcard).toBe('255.255.255.255');
    expect(r.broadcast).toBe('255.255.255.255');
    expect(r.totalAddresses).toBe(4_294_967_296);
    expect(r.usableHosts).toBe(4_294_967_294);
  });
});

describe('parseCidr — escopo e classe', () => {
  it('8.8.8.8 é público, classe A', () => {
    const r = parseCidr('8.8.8.8/32')!;
    expect(r.scope).toBe('público');
    expect(r.ipClass).toBe('A');
  });
  it('127.0.0.1 é loopback', () => {
    expect(parseCidr('127.0.0.1/8')!.scope).toBe('loopback');
  });
  it('169.254.x.x é link-local', () => {
    expect(parseCidr('169.254.10.5/16')!.scope).toBe('link-local');
  });
  it('172.16.5.0 é privado, mas 172.32.0.0 é público (fora do /12)', () => {
    expect(parseCidr('172.16.5.0/24')!.scope).toBe('privado');
    expect(parseCidr('172.32.0.0/16')!.scope).toBe('público');
  });
  it('224.x é multicast (classe D)', () => {
    const r = parseCidr('224.0.0.1/32')!;
    expect(r.scope).toBe('multicast');
    expect(r.ipClass).toBe('D (multicast)');
  });
});

describe('parseCidr — prefixo ausente assume /32', () => {
  it('"192.168.1.1" sem prefixo → /32', () => {
    const r = parseCidr('192.168.1.1')!;
    expect(r.prefix).toBe(32);
    expect(r.usableHosts).toBe(1);
  });
});

describe('parseCidr — entradas inválidas retornam null', () => {
  it.each([
    ['', 'vazio'],
    ['abc', 'não-IP'],
    ['192.168.1', '3 octetos'],
    ['256.1.1.1/24', 'octeto > 255'],
    ['192.168.1.1/33', 'prefixo > 32'],
    ['192.168.1.1/-1', 'prefixo negativo'],
    ['192.168.1.1/abc', 'prefixo não-numérico'],
    ['192.168..1/24', 'octeto vazio'],
  ])('rejeita "%s" (%s)', (input) => {
    expect(parseCidr(input)).toBeNull();
  });
});
