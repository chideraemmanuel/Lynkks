import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#f6f6f6',
          background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
          fontSize: 100,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <span style={{ paddingBottom: 20 }}>Lynkks</span>

        <span style={{ fontSize: 30 }}>
          All your important links in one place
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
