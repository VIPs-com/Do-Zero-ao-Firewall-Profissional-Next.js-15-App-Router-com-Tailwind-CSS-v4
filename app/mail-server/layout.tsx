import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/mail-server');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
