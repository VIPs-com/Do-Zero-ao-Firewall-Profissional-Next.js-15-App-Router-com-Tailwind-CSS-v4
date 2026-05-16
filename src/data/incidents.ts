import { HardDrive, WifiOff, ServerCrash, Plug, Lock, Activity } from 'lucide-react';
import type { SearchItem } from './searchItems';

/**
 * Busca Preditiva de Incidentes — playbooks de resposta rápida.
 *
 * Quando o aluno digita um sintoma no ⌘K ("disco cheio", "site não abre"),
 * o GlobalSearch surge com o playbook no topo dos resultados: a `description`
 * é o FLUXO DE COMANDOS de mitigação, e o `href` leva ao módulo que ensina.
 *
 * `keywords` cobre frases coloquiais — o matching é bidirecional
 * (keyword contém query OU query contém keyword), então tanto "disco" quanto
 * "disco cheio" surgem o mesmo playbook.
 */
export const INCIDENT_ITEMS: SearchItem[] = [
  {
    id: 'inc-disco-cheio',
    title: 'Disco cheio — liberar espaço',
    description: 'df -h → du -sh /var/* → ncdu · localize e limpe o que está enchendo a partição',
    category: 'Incidente',
    href: '/discos',
    icon: HardDrive,
    keywords: [
      'disco cheio', 'disco lotado', 'disco 100%', 'sem espaço', 'sem espaco',
      'no space left', 'partição cheia', 'particao cheia', 'espaço em disco',
    ],
  },
  {
    id: 'inc-sem-internet',
    title: 'Sem internet — diagnóstico de conectividade',
    description: 'ip a → ip route → ping 8.8.8.8 → ping google.com · isole a camada que falhou (L1→L3→DNS)',
    category: 'Incidente',
    href: '/troubleshooting',
    icon: WifiOff,
    keywords: [
      'sem internet', 'sem conexão', 'sem conexao', 'sem rede', 'internet caiu',
      'não conecta', 'nao conecta', 'rede não funciona', 'conectividade',
    ],
  },
  {
    id: 'inc-site-nao-abre',
    title: 'Site não abre — DNS ou roteamento',
    description: 'ping IP vs ping nome → cat /etc/resolv.conf → dig dominio · separe falha de DNS de falha de rota',
    category: 'Incidente',
    href: '/troubleshooting',
    icon: WifiOff,
    keywords: [
      'site não abre', 'site nao abre', 'site fora do ar', 'dns', 'não resolve',
      'nao resolve', 'página não carrega', 'pagina nao carrega', 'domínio',
    ],
  },
  {
    id: 'inc-servico-nao-inicia',
    title: 'Serviço não inicia — causa raiz nos logs',
    description: 'systemctl status nome → journalctl -xeu nome → systemctl restart nome · a mensagem do crash está no journal',
    category: 'Incidente',
    href: '/troubleshooting',
    icon: ServerCrash,
    keywords: [
      'serviço não inicia', 'servico nao inicia', 'serviço caiu', 'servico caiu',
      'failed', 'systemctl falha', 'daemon não sobe', 'nginx não inicia',
    ],
  },
  {
    id: 'inc-porta-em-uso',
    title: 'Porta em uso — Address already in use',
    description: 'ss -tulpn | grep :PORTA → identifique o PID → kill PID · descubra quem ocupou a porta',
    category: 'Incidente',
    href: '/troubleshooting',
    icon: Plug,
    keywords: [
      'porta em uso', 'address already in use', 'port in use', 'porta ocupada',
      'bind failed', 'endereço já em uso', 'endereco ja em uso',
    ],
  },
  {
    id: 'inc-permissao-negada',
    title: 'Permissão negada — Permission denied',
    description: 'ls -l arquivo → chmod / chown → id · verifique dono, grupo e bits de permissão',
    category: 'Incidente',
    href: '/permissoes',
    icon: Lock,
    keywords: [
      'permissão negada', 'permissao negada', 'permission denied', 'acesso negado',
      'não tenho permissão', 'nao tenho permissao', 'chmod', 'chown',
    ],
  },
  {
    id: 'inc-cpu-memoria-alta',
    title: 'CPU ou memória alta — processo descontrolado',
    description: 'top → ps aux --sort=-%cpu | head → kill PID · encontre e contenha o processo pesado',
    category: 'Incidente',
    href: '/processos',
    icon: Activity,
    keywords: [
      'cpu alta', 'memória alta', 'memoria alta', 'servidor lento', 'processo travado',
      'load alto', 'consumo de cpu', 'consumo de memória', 'oom', 'travou',
    ],
  },
];
