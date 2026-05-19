import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/lvm-raid');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
