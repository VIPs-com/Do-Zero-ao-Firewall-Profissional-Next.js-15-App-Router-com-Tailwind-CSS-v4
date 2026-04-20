import type { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { ClientLayout } from '@/components/ClientLayout';
import { SITE_CONFIG, buildMetadata } from '@/lib/seo';
import './globals.css';

/*
 * next/font self-hospeda as fontes (zero request a fonts.googleapis.com),
 * elimina layout shift via font-display: swap + size-adjust automático,
 * e fica em conformidade com LGPD/GDPR (sem expor IP do usuário ao Google).
 *
 * As CSS variables (--font-space-grotesk, --font-jetbrains-mono) são
 * consumidas pelo @theme em globals.css.
 */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/*
 * Metadata raiz — título template "%s | Workshop Linux" aplicado
 * automaticamente a todas as sub-rotas que exportarem seu próprio metadata.
 * metadataBase é obrigatório para Open Graph resolver URLs relativas.
 */
export const metadata: Metadata = {
  ...buildMetadata('/'),
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  applicationName: SITE_CONFIG.name,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
    { media: '(prefers-color-scheme: light)', color: '#f6f8fa' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

/*
 * JSON-LD estruturado — Schema.org LearningResource.
 * Rich results para pesquisas sobre cursos de segurança de redes Linux.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  url: SITE_CONFIG.url,
  inLanguage: 'pt-BR',
  learningResourceType: 'Interactive workshop',
  educationalLevel: 'Intermediate',
  teaches: [
    'Linux firewall (iptables, nftables)',
    'Network Address Translation (NAT, SNAT, DNAT)',
    'DNS BIND9',
    'SSL/TLS and PKI',
    'Nginx reverse proxy',
    'Squid proxy',
    'VPN IPSec with StrongSwan',
    'Port Knocking',
  ],
  isAccessibleForFree: true,
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
  provider: {
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
   * SPRINT E — Lê o nonce gerado pelo proxy.ts (Next.js 16 renomeou
   *            middleware.ts → proxy.ts) e aplica em ambos os
   * <script> inline. Isso permite que o CSP use 'nonce-XXX' em vez de
   * 'unsafe-inline', elevando a defesa contra XSS.
   *
   * Trade-off: chamar headers() torna o root layout dinâmico, e por
   * consequência todas as rotas viram ƒ (Dynamic) no build. Para um site
   * educacional leve sem necessidade de cache CDN, é um custo aceitável.
   */
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    /*
     * BUG CORRIGIDO #1: className="dark" foi removido.
     * O atributo "dark" era inerte (sem CSS que o referenciasse) e gerava
     * confusão semântica. O tema padrão agora é dark por ausência de classe.
     *
     * BUG CORRIGIDO #2 (FOUC): O <script> abaixo roda de forma SÍNCRONA,
     * antes da primeira pintura do navegador. Ele lê o localStorage e aplica
     * a classe "light" imediatamente, eliminando o flash branco→escuro
     * que ocorria quando o useEffect no ClientLayout disparava tarde demais.
     */
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('workshop-theme');
                if (t === 'light') document.documentElement.classList.add('light');
              } catch (e) {}
            `,
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
