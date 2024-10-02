import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  await connectToDatabase();
  const account = await Account.findOne<AccountInterface>({
    username,
    email_verified: true,
  });

  if (!account) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 60,
          // color: 'black',
          color: '#f6f6f6',
          // background:
          //   'radial-gradient(343px at 46.3% 47.5%, rgb(242, 242, 242) 0%, rgb(241, 241, 241) 72.9%)',
          background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
          width: '100%',
          height: '100%',
          paddingTop: 50,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          width="256"
          height="256"
          src={`https://firebasestorage.googleapis.com/v0/b/lynkks-af71a.appspot.com/o/profile.jpg?alt=media&token=3cc96ef2-b7a3-49c9-ab56-9f47b55ef4d2`}
          style={{
            borderRadius: 128,
            // border: '5px solid #f6f6f6',
            border: '5px solid hsl(214, 31%, 91%)',
          }}
        />
        <p>
          {process.env.CLIENT_BASE_URL}/{username}
        </p>
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
