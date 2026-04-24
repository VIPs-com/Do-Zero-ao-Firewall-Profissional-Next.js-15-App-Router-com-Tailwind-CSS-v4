import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/logs-basicos');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
