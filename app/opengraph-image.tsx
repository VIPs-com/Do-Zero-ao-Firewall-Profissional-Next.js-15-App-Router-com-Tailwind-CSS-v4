import { ImageResponse } from 'next/og';

/*
 * Open Graph image dinâmica (1200x630) gerada em build time.
 * Aparece em cards de compartilhamento do Twitter, LinkedIn, WhatsApp, etc.
 *
 * Next.js resolve este arquivo automaticamente como /opengraph-image.
 * Para gerar imagens diferentes por rota, basta criar app/<rota>/opengraph-image.tsx.
 */
export const runtime = 'edge';
export const alt = 'Workshop Linux — Do Zero ao Firewall Profissional';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
          color: '#e6edf3',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent bar decorativa no topo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #e05a2b 0%, #ff8c5a 100%)',
          }}
        />

        {/* Header — label + ícone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'rgba(224, 90, 43, 0.12)',
              border: '2px solid rgba(224, 90, 43, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 42,
            }}
          >
            🛡️
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div
              style={{
                fontSize: 18,
                color: '#e05a2b',
                textTransform: 'uppercase',
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              Workshop Linux
            </div>
            <div style={{ fontSize: 14, color: '#8b949e', fontFamily: 'monospace' }}>
              $ sudo iptables -L
            </div>
          </div>
        </div>

        {/* Título principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: '#e6edf3',
            }}
          >
            Do Zero ao Firewall
            <br />
            <span style={{ color: '#e05a2b' }}>Profissional</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#8b949e',
              fontWeight: 400,
              lineHeight: 1.3,
              maxWidth: 900,
            }}
          >
            iptables · nftables · DNS · SSL · VPN IPSec · Squid · Port Knocking
          </div>
        </div>

        {/* Footer — métricas + URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #30363d',
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: '#e05a2b',
                }}
              >
                24
              </div>
              <div style={{ fontSize: 16, color: '#8b949e', textTransform: 'uppercase' }}>
                Tópicos
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: '#34d399',
                }}
              >
                26
              </div>
              <div style={{ fontSize: 16, color: '#8b949e', textTransform: 'uppercase' }}>
                Checkpoints
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  color: '#60a5fa',
                }}
              >
                18
              </div>
              <div style={{ fontSize: 16, color: '#8b949e', textTransform: 'uppercase' }}>
                Badges
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              color: '#7d8590',
              fontFamily: 'monospace',
            }}
          >
            🇧🇷 português · gratuito
          </div>
        </div>
      </div>
    ),
    size,
  );
}
