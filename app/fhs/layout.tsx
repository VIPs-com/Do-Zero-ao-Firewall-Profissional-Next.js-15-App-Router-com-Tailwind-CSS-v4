import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/fhs');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
