import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/waf-modsecurity');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
