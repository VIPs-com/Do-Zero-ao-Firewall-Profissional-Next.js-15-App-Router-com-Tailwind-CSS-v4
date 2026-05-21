import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/observabilidade-stack');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
