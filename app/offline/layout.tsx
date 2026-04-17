import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sem conexão | Workshop Linux',
  description: 'Você está offline. Verifique sua conexão de rede.',
  robots: { index: false, follow: false },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
