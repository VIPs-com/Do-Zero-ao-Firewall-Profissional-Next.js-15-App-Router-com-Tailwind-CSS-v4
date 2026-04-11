import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/web-server');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
