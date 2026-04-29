import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/ssh-proxy');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
