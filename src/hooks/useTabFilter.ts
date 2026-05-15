/**
 * useTabFilter — hook genérico para gerenciar estado de abas com type safety.
 *
 * Usado em 29+ páginas do workshop com o padrão UX-TABS:
 *   useState<'conceito' | 'config' | 'referencia'>('conceito')
 *
 * Benefícios:
 *  - Type safety: o compilador rejeita tab IDs inválidos
 *  - a11y built-in: tabButtonProps injeta role="tab" + aria-selected
 *  - DRY: elimina 87+ repetições de props manuais (29 páginas × 3 abas)
 *  - Testável: lógica pura sem JSX
 *
 * Uso básico (substitui useState inline):
 *
 *   // Antes
 *   const [activeTab, setActiveTab] = useState<'a'|'b'|'c'>('a');
 *
 *   // Depois
 *   const { activeTab, setActiveTab, isActive, tabButtonProps } = useTabFilter('a' as const);
 *
 * Uso com onClick em map():
 *
 *   {TABS.map(tab => (
 *     <button key={tab.id} {...tabButtonProps(tab.id as TabType)} className={...}>
 *       {tab.label}
 *     </button>
 *   ))}
 *
 * Páginas migradas: /monitoring, /topicos (activeTrail), /cheat-sheet (activeTab)
 * Pendentes (26 páginas): ansible, apache, audit-logs, cicd, dnat, docker,
 *   docker-compose, fail2ban, hardening, instalacao, kubernetes, laboratorio,
 *   lan-proxy, ldap, nfs, nginx-ssl, openvpn, opnsense, pivoteamento,
 *   port-knocking, proxmox, samba, service-mesh, ssh-2fa, suricata,
 *   terraform, traefik, wan-nat, wireguard (migração incremental)
 */
import { useState, useCallback } from 'react';

/** Props injetadas nos botões de aba (WAI-ARIA compliant). */
export interface TabButtonProps {
  role: 'tab';
  'aria-selected': boolean;
  onClick: () => void;
}

/**
 * Gerencia o estado de abas com helpers type-safe e a11y.
 *
 * @param initial - ID da aba ativa por padrão
 * @returns { activeTab, setActiveTab, isActive, tabButtonProps }
 */
export function useTabFilter<T extends string>(initial: T) {
  const [activeTab, setActiveTabRaw] = useState<T>(initial);

  /** Muda a aba ativa. Referência estável (useCallback). */
  const setActiveTab = useCallback((tab: T): void => {
    setActiveTabRaw(tab);
  }, []);

  /**
   * Retorna true se `tab` é a aba atualmente ativa.
   * Aceita `string` para compatibilidade com `.map(tab => tab.id)` sem cast.
   */
  const isActive = useCallback((tab: string): boolean => activeTab === tab, [activeTab]);

  /**
   * Props prontos para espalhar no botão de aba.
   * Injeta role="tab", aria-selected e onClick corretamente.
   * Aceita `string` para compatibilidade com `.map(tab => tab.id)` sem cast.
   *
   * @example
   * <button {...tabButtonProps(tab.id)} className={...}>...</button>
   */
  const tabButtonProps = useCallback((tab: string): TabButtonProps => ({
    role: 'tab',
    'aria-selected': activeTab === tab,
    onClick: () => setActiveTab(tab as T),
  }), [activeTab, setActiveTab]);

  return {
    activeTab,
    setActiveTab,
    isActive,
    tabButtonProps,
  } as const;
}
