import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const generateGoogleOauthUrl = (
  successRedirectPath: string,
  errorRedirectPath: string,
  username?: string
) => {
  const base = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    response_type: 'code',
    client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
    // redirect_uri: `${process.env.API_BASE_URL}/accounts/login/google?success_redirect_path=/&error_redirect_path=/auth/error`,
    // !!! redirect to API with query params; API handles redirect to client !!!
    // ! add username query param only when passed (i.e new account)
    redirect_uri: username
      ? `${process.env.API_BASE_URL}/accounts/login/google?username=${username}success_redirect_path=${successRedirectPath}&error_redirect_path=${errorRedirectPath}`
      : `${process.env.API_BASE_URL}/accounts/login/google?success_redirect_path=${successRedirectPath}&error_redirect_path=${errorRedirectPath}`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
  };

  const queryStrings = new URLSearchParams(options);

  // console.log(`${base}?${queryStrings.toString()}`);

  return `${base}?${queryStrings.toString()}`;
};

export const GET = (request: NextRequest) => {
  const usernameParam = request.nextUrl.searchParams.get('username');

  const success_redirect_path = request.nextUrl.searchParams.get(
    'success_redirect_path'
  );
  const error_redirect_path = request.nextUrl.searchParams.get(
    'error_redirect_path'
  );

  // const { success, data: username } = z
  //   .string()
  //   .min(3)
  //   .max(15)
  //   .optional()
  //   .safeParse(usernameParam);

  // if (!success) {
  //   return NextResponse.json(
  //     { error: 'Invalid "username" query parameter' },
  //     { status: 400 }
  //   );
  // }

  if (!success_redirect_path || !error_redirect_path) {
    return NextResponse.json(
      {
        error: `Missing 'success_redirect_path' or 'error_redirect_path' in query parameters`,
      },
      { status: 400 }
    );
  }

  if (
    !success_redirect_path.startsWith('/') ||
    !error_redirect_path.startsWith('/')
  ) {
    return NextResponse.json(
      {
        error: `Invalid 'success_redirect_path' or 'error_redirect_path'`,
      },
      { status: 400 }
    );
  }

  const url = generateGoogleOauthUrl(
    success_redirect_path,
    error_redirect_path
    // username
  );

  return NextResponse.json({ url });
};
