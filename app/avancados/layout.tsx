import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/avancados');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
