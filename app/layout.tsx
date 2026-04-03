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
    <html lang="pt-BR" className="dark">
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
