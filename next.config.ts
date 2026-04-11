import type { NextConfig } from 'next';
import path from 'node:path';

/*
 * ============================================================================
 * SPRINT D + E — Headers de Segurança
 * ============================================================================
 *
 * Defesa em profundidade no nível HTTP. Cada header bloqueia uma classe
 * inteira de ataques sem custo de runtime (todos são processados pelo browser).
 *
 * - Strict-Transport-Security: força HTTPS por 2 anos (HSTS preload-ready)
 * - X-Frame-Options: bloqueia iframe (defesa adicional ao frame-ancestors do CSP)
 * - X-Content-Type-Options: impede MIME sniffing
 * - Referrer-Policy: vaza apenas a origem em navegação cross-origin
 * - Permissions-Policy: desativa APIs sensíveis (geolocation, câmera, mic)
 * - X-DNS-Prefetch-Control: ativa prefetch para acelerar navegação
 *
 * NOTA SOBRE CSP (Sprint E):
 * O Content-Security-Policy NÃO é mais definido aqui. Ele é gerado por
 * requisição em middleware.ts com um nonce criptográfico único, eliminando
 * 'unsafe-inline' do script-src. Veja middleware.ts para detalhes.
 * ============================================================================
 */

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
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

  /*
   * Trava o workspace root do Turbopack neste diretório.
   * Resolve o warning "We detected multiple lockfiles" que aparecia quando
   * existem worktrees em .claude/worktrees/* com seus próprios package-lock.json.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Headers de segurança aplicados em todas as rotas (CSP fica no middleware)
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
