import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/comece-aqui');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
