import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/service-mesh');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
