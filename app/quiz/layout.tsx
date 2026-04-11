import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/quiz');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
