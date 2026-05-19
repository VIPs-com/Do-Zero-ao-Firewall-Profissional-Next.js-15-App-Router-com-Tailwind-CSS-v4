import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/banco-de-dados');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
