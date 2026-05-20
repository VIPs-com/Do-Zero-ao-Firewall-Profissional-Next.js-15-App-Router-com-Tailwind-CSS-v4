import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/seguranca-avancada');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
