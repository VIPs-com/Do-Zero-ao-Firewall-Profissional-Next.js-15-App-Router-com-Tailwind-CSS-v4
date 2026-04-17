import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata('/laboratorio');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
