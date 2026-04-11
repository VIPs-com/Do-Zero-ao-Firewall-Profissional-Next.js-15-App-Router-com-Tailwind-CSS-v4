import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/vpn-ipsec');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
