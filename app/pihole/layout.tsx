import { buildMetadata } from '@/lib/seo';
export const metadata = buildMetadata('/pihole');
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
