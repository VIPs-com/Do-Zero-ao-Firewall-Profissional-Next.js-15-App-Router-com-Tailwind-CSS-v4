'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-mono">
      <div className="max-w-lg w-full">
        {/* Terminal window chrome */}
        <div className="rounded-t-lg bg-[#1c2128] border border-[#30363d] px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="text-[#8b949e] text-xs ml-2">firewall@workshop:~$</span>
          <span className="ml-auto text-[#8b949e] text-xs">{time}</span>
        </div>

        {/* Terminal body */}
        <div
          className="rounded-b-lg bg-[#0d1117] border border-t-0 border-[#30363d] p-6 text-sm leading-7"
          role="main"
          aria-label="Simulação de terminal offline"
        >
          <p className="text-[#8b949e]">$ ping 8.8.8.8</p>
          <p className="text-[#ff7b72]">
            ping: connect: Network is unreachable
          </p>
          <p className="text-[#8b949e] mt-2">$ ip route show</p>
          <p className="text-[#e3b341]">Error: Cannot open network namespace</p>
          <p className="text-[#8b949e] mt-2">$ curl https://workshop-linux.local</p>
          <p className="text-[#ff7b72]">
            curl: (6) Could not resolve host: workshop-linux.local
          </p>

          <p className="text-[#8b949e] mt-4">$ # Diagnóstico OSI — Camada 3 falhou</p>

          <div className="mt-4 border border-[#30363d] rounded p-4">
            <p className="text-[#e3b341] text-xs uppercase tracking-widest mb-3">
              SOS Troubleshooting
            </p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-[#8b949e]">L1 Física:  </span>
                <span className="text-[#3fb950]">✓ Interface UP</span>
              </p>
              <p>
                <span className="text-[#8b949e]">L2 Enlace:  </span>
                <span className="text-[#3fb950]">✓ ARP ok</span>
              </p>
              <p>
                <span className="text-[#8b949e]">L3 Rede:    </span>
                <span className="text-[#ff7b72]">✗ Sem rota default</span>
              </p>
              <p>
                <span className="text-[#8b949e]">L4 Trans.:  </span>
                <span className="text-[#8b949e]">- aguardando L3</span>
              </p>
            </div>
          </div>

          <p className="text-[#8b949e] mt-4">$ # Verifique sua conexão de rede</p>
          <p className="text-[#e3b341] mt-1">
            ▶ ip route add default via &lt;gateway&gt;
          </p>

          <div className="mt-6 pt-4 border-t border-[#30363d] flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1c2128] hover:bg-[#2d333b] border border-[#30363d] rounded text-xs text-[#58a6ff] transition-colors"
            >
              $ retry connection
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-[#1c2128] hover:bg-[#2d333b] border border-[#30363d] rounded text-xs text-[#3fb950] transition-colors"
            >
              $ cd ~
            </Link>
          </div>
        </div>

        <p className="text-center text-[#8b949e] text-[10px] mt-4">
          Workshop Linux · Modo Offline · {time}
        </p>
      </div>
    </div>
  );
}
