import { ImageResponse } from 'next/og';

/*
 * Apple touch icon (180x180) gerado dinamicamente via next/og.
 * Next.js resolve como /apple-icon e injeta o <link rel="apple-touch-icon">.
 */
export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e05a2b 0%, #ff8c5a 100%)',
          color: '#ffffff',
          fontSize: 110,
          fontWeight: 800,
          fontFamily: 'monospace',
          borderRadius: 36,
        }}
      >
        $_
      </div>
    ),
    size,
  );
}
