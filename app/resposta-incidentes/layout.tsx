import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/resposta-incidentes');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
