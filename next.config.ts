import type { NextConfig } from 'next';

/*
 * ============================================================================
 * SPRINT D — Headers de Segurança
 * ============================================================================
 *
 * Defesa em profundidade no nível HTTP. Cada header bloqueia uma classe
 * inteira de ataques sem custo de runtime (todos são processados pelo browser).
 *
 * - Strict-Transport-Security: força HTTPS por 2 anos (HSTS preload-ready)
 * - Content-Security-Policy: mitiga XSS, clickjacking e injeção de assets
 * - X-Frame-Options: bloqueia iframe (defesa adicional ao frame-ancestors do CSP)
 * - X-Content-Type-Options: impede MIME sniffing
 * - Referrer-Policy: vaza apenas a origem em navegação cross-origin
 * - Permissions-Policy: desativa APIs sensíveis (geolocation, câmera, mic)
 * - X-DNS-Prefetch-Control: ativa prefetch para acelerar navegação
 *
 * NOTA SOBRE CSP:
 * 'unsafe-inline' em script-src é necessário porque o root layout injeta
 * o script anti-FOUC e o JSON-LD inline. Em um Sprint futuro, podemos
 * adotar nonces (requer middleware) para remover 'unsafe-inline'.
 * 'unsafe-eval' é necessário em dev (HMR do Turbopack); o bloco de prod
 * abaixo o omite.
 * ============================================================================
 */

const isDev = process.env.NODE_ENV === 'development';

/*
 * Content Security Policy.
 *
 * Sintaxe: cada diretiva separada por ;
 * 'self' = mesma origem
 * data:  = data URIs (necessário para SVGs inline e ImageResponse do next/og)
 * blob:  = blob URLs (next/image otimização)
 */
const cspDirectives = [
  `default-src 'self'`,
  // Scripts: inline necessário para anti-FOUC + JSON-LD; eval só em dev
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // Estilos: Tailwind v4 e motion/react injetam <style> dinâmicos
  `style-src 'self' 'unsafe-inline'`,
  // Imagens: incluindo /opengraph-image, /icon, /apple-icon (data URIs internos)
  `img-src 'self' data: blob:`,
  // Fontes: next/font self-host serve da própria origem
  `font-src 'self' data:`,
  // Conexões: nenhuma API externa neste sprint
  `connect-src 'self'`,
  // Frames: nenhum iframe permitido
  `frame-src 'none'`,
  `frame-ancestors 'none'`,
  // Bloqueia <object>, <embed>, plugins legados
  `object-src 'none'`,
  // <base href> trancado na origem (impede base hijacking)
  `base-uri 'self'`,
  // Forms só podem postar para a própria origem
  `form-action 'self'`,
  // Força upgrade de http→https em sub-recursos
  `upgrade-insecure-requests`,
].join('; ');

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: cspDirectives,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  /*
   * typescript.ignoreBuildErrors foi REMOVIDO.
   *
   * Com essa flag ativa, o build passava verde mesmo com erros de TypeScript,
   * mascarando regressões de tipo que poderiam ir silenciosamente para produção.
   *
   * Agora o build falha corretamente se houver erros de tipo.
   * Use `npm run lint` (tsc --noEmit) para checar antes do build.
   */

  // Remove header "X-Powered-By: Next.js" — não vaza versão do framework
  poweredByHeader: false,

  // Compressão gzip/brotli das respostas HTML
  compress: true,

  // Headers de segurança aplicados em todas as rotas
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
