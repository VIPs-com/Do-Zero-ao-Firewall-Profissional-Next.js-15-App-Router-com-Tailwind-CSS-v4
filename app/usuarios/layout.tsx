import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/usuarios');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
