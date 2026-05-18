import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/proxmox-backup-server');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
