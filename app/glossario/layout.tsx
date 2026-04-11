import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/glossario');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
