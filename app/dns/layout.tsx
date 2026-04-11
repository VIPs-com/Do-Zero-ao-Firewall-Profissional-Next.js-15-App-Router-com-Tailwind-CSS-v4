import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/dns');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
