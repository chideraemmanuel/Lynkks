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
          // color: 'black',
          color: '#f6f6f6',
          // background:
          //   'radial-gradient(343px at 46.3% 47.5%, rgb(242, 242, 242) 0%, rgb(241, 241, 241) 72.9%)',
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

{
  /* <svg
  class="pointer-events-none fixed isolate z-50 opacity-70 mix-blend-soft-light"
  width="100%"
  height="100%"
>
  <filter id="noise">
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.80"
      numOctaves="4"
      stitchTiles="stitch"
    ></feTurbulence>
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)"></rect>
</svg>; */
}
