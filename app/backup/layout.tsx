import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/backup');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
