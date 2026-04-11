import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/cheat-sheet');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
