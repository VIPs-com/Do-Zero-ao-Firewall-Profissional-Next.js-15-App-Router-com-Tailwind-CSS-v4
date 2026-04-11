import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
 * ============================================================================
 * SPRINT E — CSP com nonce per-request (Next.js 16 Proxy)
 * ============================================================================
 *
 * Problema do Sprint D: o CSP estático em next.config.ts precisava de
 * 'unsafe-inline' em script-src porque o root layout injeta dois <script>
 * inline (anti-FOUC e JSON-LD). 'unsafe-inline' enfraquece a defesa contra XSS.
 *
 * Solução do Sprint E: o proxy gera um nonce criptográfico único por
 * requisição, propaga via request header x-nonce, e o root layout aplica
 * esse nonce nos scripts inline. O CSP da resposta inclui 'nonce-XXX' em
 * vez de 'unsafe-inline'.
 *
 * Trade-off conhecido: ler headers() no root layout torna TODAS as rotas
 * dinâmicas (ƒ em vez de ○). Para este projeto educacional, o ganho de
 * segurança (nota A+ no securityheaders.com) compensa, já que o conteúdo
 * é leve e não há necessidade de cache CDN agressivo.
 *
 * NOTA: Next.js 16 renomeou middleware.ts → proxy.ts. A API é idêntica,
 * só mudou o nome do arquivo e da função exportada (proxy em vez de middleware).
 *
 * Padrão oficial Next.js:
 * https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
 * ============================================================================
 */

export function proxy(request: NextRequest) {
  /*
   * Gera 16 bytes aleatórios e converte para base64.
   * crypto.randomUUID() não serve — precisa ser bytes binários para CSP.
   * Web Crypto API funciona no Edge runtime do Next.js.
   */
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const isDev = process.env.NODE_ENV === 'development';

  /*
   * 'strict-dynamic' permite que scripts confiáveis (com nonce) carreguem
   * outros scripts. Isso é essencial para o runtime do Next.js — o bootstrap
   * inicial tem nonce e carrega chunks de /_next/static/ sem precisar de
   * 'self' separado.
   *
   * 'unsafe-eval' continua necessário em dev por causa do HMR do Turbopack.
   */
  const cspDirectives = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ');

  /*
   * Propaga o nonce para o Server Component via request header.
   * O root layout vai ler com `await headers()` e aplicar nos <script>.
   */
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', cspDirectives);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Define o CSP também na resposta — é o que o browser vai enforçar.
  response.headers.set('content-security-policy', cspDirectives);

  return response;
}

/*
 * Matcher: aplica o middleware em todas as rotas EXCETO assets estáticos
 * e a API interna do Next.js. /_next/static não precisa de CSP (é só JS/CSS
 * referenciado pelo HTML, e o browser aplica o CSP do HTML pai).
 *
 * Excluímos também os ícones dinâmicos (icon, apple-icon, opengraph-image)
 * porque rodam no edge runtime e não emitem HTML — só PNG.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     * - icon, apple-icon, opengraph-image (dynamic image routes)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|opengraph-image).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
