import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

const size = {
  width: 1200,
  height: 630,
};

export const GET = async (request: NextRequest) => {
  const username = 'chideraemmanuel';

  return new ImageResponse(
    (
      // <div
      //   style={{
      //     display: 'flex',
      //     fontSize: 60,
      //     // color: 'black',
      //     color: '#f6f6f6',
      //     // background:
      //     //   'radial-gradient(343px at 46.3% 47.5%, rgb(242, 242, 242) 0%, rgb(241, 241, 241) 72.9%)',
      //     background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
      //     width: '100%',
      //     height: '100%',
      //     paddingTop: 50,
      //     flexDirection: 'column',
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //   }}
      // >
      //   <img
      //     width="256"
      //     height="256"
      //     src={`https://firebasestorage.googleapis.com/v0/b/lynkks-af71a.appspot.com/o/profile.jpg?alt=media&token=3cc96ef2-b7a3-49c9-ab56-9f47b55ef4d2`}
      //     style={{
      //       borderRadius: 128,
      //       // border: '5px solid #f6f6f6',
      //       border: '5px solid hsl(214, 31%, 91%)',
      //     }}
      //   />
      //   <p>
      //     {process.env.CLIENT_BASE_URL}/{username}
      //   </p>
      // </div>
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
};
