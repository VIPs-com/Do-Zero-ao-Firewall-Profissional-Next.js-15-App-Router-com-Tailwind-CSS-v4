import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/alta-disponibilidade');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
