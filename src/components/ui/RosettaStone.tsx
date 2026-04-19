'use client';

import React, { useState, useCallback } from 'react';
import { Search, Terminal, Globe, Cpu, Settings, ShieldCheck } from 'lucide-react';

interface Command {
  windows: string;
  linux: string;
  description: string;
  category: Category;
}

type Category = 'Sistema' | 'Rede' | 'Processos' | 'Serviços' | 'Admin';

const COMMANDS: Command[] = [
  // Sistema
  { windows: 'dir',             linux: 'ls -la',           description: 'Listar arquivos e pastas',         category: 'Sistema' },
  { windows: 'cd',              linux: 'cd',               description: 'Mudar diretório',                  category: 'Sistema' },
  { windows: 'type',            linux: 'cat',              description: 'Exibir conteúdo de arquivo',       category: 'Sistema' },
  { windows: 'cls',             linux: 'clear',            description: 'Limpar a tela do terminal',        category: 'Sistema' },
  { windows: 'mkdir',           linux: 'mkdir -p',         description: 'Criar diretório',                  category: 'Sistema' },
  { windows: 'del',             linux: 'rm',               description: 'Remover arquivo',                  category: 'Sistema' },
  { windows: 'copy',            linux: 'cp',               description: 'Copiar arquivo',                   category: 'Sistema' },
  { windows: 'move',            linux: 'mv',               description: 'Mover / renomear',                 category: 'Sistema' },
  // Rede
  { windows: 'ipconfig',        linux: 'ip a',             description: 'Ver endereços IP das interfaces',  category: 'Rede' },
  { windows: 'ping -n 4',       linux: 'ping -c 4',        description: 'Testar conectividade com host',    category: 'Rede' },
  { windows: 'route print',     linux: 'ip route show',    description: 'Ver tabela de roteamento',         category: 'Rede' },
  { windows: 'netstat -an',     linux: 'ss -tulpn',        description: 'Ver portas abertas e conexões',    category: 'Rede' },
  { windows: 'tracert',         linux: 'traceroute',       description: 'Rastrear rota até um host',        category: 'Rede' },
  { windows: 'nslookup',        linux: 'dig',              description: 'Consultar registros DNS',          category: 'Rede' },
  // Processos
  { windows: 'tasklist',        linux: 'ps aux',           description: 'Listar todos os processos',        category: 'Processos' },
  { windows: 'taskkill /PID N', linux: 'kill -9 PID',      description: 'Encerrar processo pelo PID',       category: 'Processos' },
  { windows: 'Gerenciador de Tarefas', linux: 'htop',      description: 'Monitor interativo de processos',  category: 'Processos' },
  // Serviços
  { windows: 'services.msc',    linux: 'systemctl',        description: 'Gerenciar serviços do sistema',    category: 'Serviços' },
  { windows: 'net start svc',   linux: 'systemctl start',  description: 'Iniciar um serviço',               category: 'Serviços' },
  { windows: 'net stop svc',    linux: 'systemctl stop',   description: 'Parar um serviço',                 category: 'Serviços' },
  { windows: 'Visualizador de Eventos', linux: 'journalctl -f', description: 'Ver logs do sistema',         category: 'Serviços' },
  // Admin
  { windows: 'Executar como Admin', linux: 'sudo',         description: 'Executar com privilégios root',    category: 'Admin' },
  { windows: '.exe (instalador)',   linux: 'apt install',  description: 'Instalar software',                category: 'Admin' },
  { windows: 'notepad',         linux: 'vim / nano',       description: 'Editar arquivo de texto',          category: 'Admin' },
  { windows: 'set VAR=valor',   linux: 'export VAR=valor', description: 'Variável de ambiente',             category: 'Admin' },
];

const CATEGORIES: Array<'Todos' | Category> = ['Todos', 'Sistema', 'Rede', 'Processos', 'Serviços', 'Admin'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sistema:   <Terminal  className="w-3 h-3" aria-hidden="true" />,
  Rede:      <Globe     className="w-3 h-3" aria-hidden="true" />,
  Processos: <Cpu       className="w-3 h-3" aria-hidden="true" />,
  Serviços:  <Settings  className="w-3 h-3" aria-hidden="true" />,
  Admin:     <ShieldCheck className="w-3 h-3" aria-hidden="true" />,
};

interface RosettaStoneProps {
  /** Chamado na primeira interação (busca ou filtro) — use para marcar checkpoint */
  onFirstInteraction?: () => void;
}

export function RosettaStone({ onFirstInteraction }: RosettaStoneProps) {
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState<'Todos' | Category>('Todos');
  const [interacted, setInteracted] = useState(false);

  const handleInteraction = useCallback(() => {
    if (!interacted) {
      setInteracted(true);
      onFirstInteraction?.();
    }
  }, [interacted, onFirstInteraction]);

  const filtered = COMMANDS.filter(cmd => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      cmd.windows.toLowerCase().includes(q) ||
      cmd.linux.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q);
    const matchCategory = category === 'Todos' || cmd.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4" role="region" aria-label="Rosetta Stone — comandos Windows e Linux equivalentes">
      {/* Busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" aria-hidden="true" />
          <input
            type="search"
            id="rosetta-search"
            placeholder="Buscar comando... (ex: ipconfig, ps aux, journalctl)"
            aria-label="Buscar comandos equivalentes Windows e Linux"
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-bg-2 text-text focus:border-accent outline-none text-sm"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (e.target.value) handleInteraction();
            }}
          />
        </div>

        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filtrar por categoria">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                if (cat !== 'Todos') handleInteraction();
              }}
              aria-pressed={category === cat}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                category === cat
                  ? 'bg-accent text-white'
                  : 'bg-bg-3 text-text-2 hover:bg-bg-2 border border-border'
              }`}
            >
              {CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl overflow-hidden border border-border">
        <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-bg-3 border-b border-border">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">🪟 Windows</span>
          <span className="text-xs font-bold text-ok uppercase tracking-wider">🐧 Linux</span>
          <span className="text-xs font-bold text-text-3 uppercase tracking-wider">Descrição</span>
        </div>
        <div className="divide-y divide-border bg-bg-2">
          {filtered.map(cmd => (
            <div
              key={cmd.windows + cmd.linux}
              className="grid grid-cols-3 gap-2 px-4 py-2.5 hover:bg-bg-3 transition-colors"
            >
              <code className="text-xs font-mono text-blue-300 truncate">{cmd.windows}</code>
              <code className="text-xs font-mono text-ok truncate">→ {cmd.linux}</code>
              <span className="text-xs text-text-2">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-text-3 text-sm" role="status">
          Nenhum comando encontrado para <strong>&ldquo;{search}&rdquo;</strong>
        </p>
      )}

      <p className="text-xs text-text-3 text-right">
        {filtered.length} de {COMMANDS.length} comandos
      </p>
    </div>
  );
}
