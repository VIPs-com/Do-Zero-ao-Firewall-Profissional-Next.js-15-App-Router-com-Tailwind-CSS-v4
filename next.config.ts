import type { NextConfig } from 'next';

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
};

export default nextConfig;
