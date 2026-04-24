import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/shell-script');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
