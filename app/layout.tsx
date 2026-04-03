import type { Metadata } from 'next';
import { Providers } from './providers';
import { ClientLayout } from '@/components/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Workshop Linux — Do Zero ao Firewall',
  description: 'Documentação técnica de estudo pessoal sobre Linux e Redes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * BUG CORRIGIDO #1: className="dark" foi removido.
     * O atributo "dark" era inerte (sem CSS que o referenciasse) e gerava
     * confusão semântica. O tema padrão agora é dark por ausência de classe.
     *
     * BUG CORRIGIDO #2 (FOUC): O <script> abaixo roda de forma SÍNCRONA,
     * antes da primeira pintura do navegador. Ele lê o localStorage e aplica
     * a classe "light" imediatamente, eliminando o flash branco→escuro
     * que ocorria quando o useEffect no ClientLayout disparava tarde demais.
     */
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('workshop-theme');
                if (t === 'light') document.documentElement.classList.add('light');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
