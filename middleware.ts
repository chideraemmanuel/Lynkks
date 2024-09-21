import { NextRequest, NextResponse } from 'next/server';
import Session, { SessionInterface } from './models/session';
import Account from './models/account';
import { nanoid } from 'nanoid';

export async function middleware(request: NextRequest) {
  //   const session_id = request.cookies.get('sid')?.value;
  //   if (session_id) {
  //     const sessionExists = await Session.findOne<SessionInterface>({
  //       session_id,
  //     });
  //     if (sessionExists) {
  //       const new_session_id = nanoid();
  //       sessionExists.expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  //       sessionExists.session_id = new_session_id;
  //       sessionExists.save();
  //       const response = NextResponse.next();
  //       response.cookies.set('sid', new_session_id, {
  //         // maxAge: 60 * 60 * 24 * 7, // 1 week
  //         maxAge: 60 * 60, // 1 hour
  //         httpOnly: true,
  //       });
  //       return response;
  //     }
  //   }
  //   return NextResponse.next();
}

// ! !
// import { NextResponse } from 'next/server';
// import type { NextFetchEvent, NextRequest } from 'next/server';

// export function middleware(req: NextRequest, event: NextFetchEvent) {
//   event.waitUntil(
//     fetch('https://my-analytics-platform.com', {
//       method: 'POST',
//       body: JSON.stringify({ pathname: req.nextUrl.pathname }),
//     })
//   );

//   return NextResponse.next();
// }
//
// const response = NextResponse.next();
//  response.cookies.set({
//    name: 'vercel',
//    value: 'fast',
//    path: '/',
//  });
//   return response;
