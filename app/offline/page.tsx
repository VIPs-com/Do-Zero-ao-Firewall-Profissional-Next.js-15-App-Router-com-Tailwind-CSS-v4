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
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 font-mono">
      <div className="max-w-lg w-full">
        {/* Terminal window chrome */}
        <div className="rounded-t-lg bg-bg-2 border border-border px-4 py-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-err" />
          <span className="w-3 h-3 rounded-full bg-warn" />
          <span className="w-3 h-3 rounded-full bg-ok" />
          <span className="text-text-2 text-xs ml-2">firewall@workshop:~$</span>
          <span className="ml-auto text-text-2 text-xs">{time}</span>
        </div>

        {/* Terminal body */}
        <div
          className="rounded-b-lg bg-bg border border-t-0 border-border p-6 text-sm leading-7"
          role="main"
          aria-label="Simulação de terminal offline"
        >
          <p className="text-text-2">$ ping 8.8.8.8</p>
          <p className="text-err">
            ping: connect: Network is unreachable
          </p>
          <p className="text-text-2 mt-2">$ ip route show</p>
          <p className="text-warn">Error: Cannot open network namespace</p>
          <p className="text-text-2 mt-2">$ curl https://workshop-linux.local</p>
          <p className="text-err">
            curl: (6) Could not resolve host: workshop-linux.local
          </p>

          <p className="text-text-2 mt-4">$ # Diagnóstico OSI — Camada 3 falhou</p>

          <div className="mt-4 border border-border rounded p-4">
            <p className="text-warn text-xs uppercase tracking-widest mb-3">
              SOS Troubleshooting
            </p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="text-text-2">L1 Física:  </span>
                <span className="text-ok">✓ Interface UP</span>
              </p>
              <p>
                <span className="text-text-2">L2 Enlace:  </span>
                <span className="text-ok">✓ ARP ok</span>
              </p>
              <p>
                <span className="text-text-2">L3 Rede:    </span>
                <span className="text-err">✗ Sem rota default</span>
              </p>
              <p>
                <span className="text-text-2">L4 Trans.:  </span>
                <span className="text-text-3">- aguardando L3</span>
              </p>
            </div>
          </div>

          <p className="text-text-2 mt-4">$ # Verifique sua conexão de rede</p>
          <p className="text-warn mt-1">
            ▶ ip route add default via &lt;gateway&gt;
          </p>

          <div className="mt-6 pt-4 border-t border-border flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-bg-2 hover:bg-bg-3 border border-border rounded text-xs text-info transition-colors"
            >
              $ retry connection
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-bg-2 hover:bg-bg-3 border border-border rounded text-xs text-ok transition-colors"
            >
              $ cd ~
            </Link>
          </div>
        </div>

        <p className="text-center text-text-2 text-[10px] mt-4">
          Workshop Linux · Modo Offline · {time}
        </p>
      </div>
    </div>
  );
}
