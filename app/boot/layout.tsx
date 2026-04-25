import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata('/boot');
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
