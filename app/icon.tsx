import { ImageResponse } from 'next/og';

/*
 * Favicon dinâmico (32x32) gerado via next/og em build time.
 * Next.js resolve este arquivo automaticamente como /icon e injeta
 * o <link rel="icon"> no <head>. Sem PNGs binários no repositório.
 */
export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#e05a2b',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 800,
          fontFamily: 'monospace',
          borderRadius: 6,
        }}
      >
        $_
      </div>
    ),
    size,
  );
}
