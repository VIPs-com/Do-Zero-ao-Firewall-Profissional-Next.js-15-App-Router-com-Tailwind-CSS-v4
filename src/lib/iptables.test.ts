/**
 * Testes do gerador de regras iptables (Sprint Ferramentas v2). Lógica pura.
 */
import { describe, it, expect } from 'vitest';
import { buildIptablesRule, EMPTY_RULE, type IptablesRule } from './iptables';

const rule = (over: Partial<IptablesRule>): IptablesRule => ({ ...EMPTY_RULE, ...over });

describe('buildIptablesRule', () => {
  it('regra básica — aceitar SSH na porta 22', () => {
    expect(buildIptablesRule(rule({ dport: '22' })))
      .toBe('iptables -A INPUT -p tcp --dport 22 -j ACCEPT');
  });

  it('protocolo "all" omite o -p', () => {
    expect(buildIptablesRule(rule({ protocol: 'all', dport: '' })))
      .toBe('iptables -A INPUT -j ACCEPT');
  });

  it('--dport só aparece com tcp/udp', () => {
    expect(buildIptablesRule(rule({ protocol: 'icmp', dport: '22' })))
      .toBe('iptables -A INPUT -p icmp -j ACCEPT');
  });

  it('inclui origem (-s) e interface (-i)', () => {
    const cmd = buildIptablesRule(rule({
      dport: '80', source: '192.168.1.0/24', inInterface: 'eth0',
    }));
    expect(cmd).toBe('iptables -A INPUT -i eth0 -p tcp -s 192.168.1.0/24 --dport 80 -j ACCEPT');
  });

  it('estado conntrack ESTABLISHED,RELATED', () => {
    const cmd = buildIptablesRule(rule({ dport: '', protocol: 'all', ctstate: 'ESTABLISHED,RELATED' }));
    expect(cmd).toBe('iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT');
  });

  it('tabela nat adiciona -t nat; filter é omitido', () => {
    const nat = buildIptablesRule(rule({ table: 'nat', chain: 'POSTROUTING', protocol: 'all', dport: '', action: 'MASQUERADE' }));
    expect(nat).toBe('iptables -t nat -A POSTROUTING -j MASQUERADE');
  });

  it('regra DROP de origem suspeita', () => {
    expect(buildIptablesRule(rule({ source: '203.0.113.0/24', protocol: 'all', dport: '', action: 'DROP' })))
      .toBe('iptables -A INPUT -s 203.0.113.0/24 -j DROP');
  });

  it('campos com espaços em branco são ignorados', () => {
    expect(buildIptablesRule(rule({ dport: '  ', source: '   ', inInterface: '  ' })))
      .toBe('iptables -A INPUT -p tcp -j ACCEPT');
  });
});
