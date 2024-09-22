import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

interface GoogleResponse {
  id_token: string;
  access_token: string;
}

export const GET = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;
  const selected_username = request.cookies.get(
    'lynkks_selected_username'
  )?.value;
  const code = request.nextUrl.searchParams.get('code');
  const success_redirect_path = request.nextUrl.searchParams.get(
    'success_redirect_path'
  );
  const error_redirect_path = request.nextUrl.searchParams.get(
    'error_redirect_path'
  );

  console.log('selected_username', selected_username);

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    if (session_id) {
      const sessionExists = await Session.findOne<SessionInterface>({
        session_id,
      });

      if (sessionExists) {
        const account = await Account.findById(sessionExists?.account);

        if (account) {
          const new_session_id = nanoid();

          await Session.updateOne(
            { session_id },
            {
              session_id: new_session_id,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            }
          );

          const response = NextResponse.json(
            {
              error: 'User already logged in - An active session was found',
            },
            { status: 400 }
          );

          response.cookies.set('sid', new_session_id, {
            // maxAge: 60 * 60 * 24 * 7, // 1 week
            maxAge: 60 * 60, // 1 hour
            httpOnly: true,
          });

          return response;
        }
      }
    }

    // !!! Auth logic starts !!!
    // ! redundant; redirect uri must match what is in google cloud console before it gets here anyway
    if (!success_redirect_path || !error_redirect_path) {
      return NextResponse.json({
        error: `Missing 'success_redirect_path' or 'error_redirect_path' in query parameters`,
      });
    }

    // ! redundant; redirect uri must match what is in google cloud console before it gets here anyway
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

    if (!code) {
      return NextResponse.redirect(
        `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=authentication_failed`
      );
    }

    const base = 'https://oauth2.googleapis.com/token';

    const params = {
      code,
      client_id: process.env.GOOGLE_AUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      //  !!! must match redirect_uri in oauth url params !!!
      redirect_uri: `${process.env.API_BASE_URL}/accounts/login/google?success_redirect_path=${success_redirect_path}&error_redirect_path=${error_redirect_path}`,
      grant_type: 'authorization_code',
    };

    try {
      // params can be passed as either body data or query strings
      const googleResponse = await axios.post<GoogleResponse>(base, params);

      console.log('googleResponse.data', googleResponse.data);

      const googleUserData = jwt.decode(googleResponse?.data?.id_token);

      console.log('googleUserData', googleUserData);

      // @ts-ignore
      const { email, given_name, family_name, picture } = googleUserData;

      const accountExists = await Account.findOne<AccountInterface>({
        email: email.toLowerCase().trim(),
      });

      if (accountExists && accountExists.auth_type === 'manual') {
        return NextResponse.redirect(
          `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=account_exists`
        );
      }

      if (accountExists && accountExists.auth_type === 'google') {
        // create session and redirect to success path
        const new_session_id = nanoid();

        const session = await Session.create<SessionInterface>({
          account: accountExists._id,
          session_id: new_session_id,
        });

        const response = NextResponse.redirect(
          `${process.env.CLIENT_BASE_URL}${success_redirect_path}?new_account=false`
        );

        response.cookies.set('sid', new_session_id, {
          // maxAge: 60 * 60 * 24 * 7, // 1 week
          maxAge: 60 * 60, // 1 hour
          httpOnly: true,
        });

        return response;
      }

      // ! account with email doesn't exist
      // ! create new account and session, and redirect to success path
      const { success, data: username } = z
        .string()
        .min(3)
        .max(15)
        .safeParse(selected_username);

      if (!success) {
        return NextResponse.redirect(
          `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=invalid_username`
        );
      }

      const usernameTaken = await Account.findOne<AccountInterface>({
        username: username.toLowerCase().trim(),
      });

      if (usernameTaken) {
        return NextResponse.redirect(
          `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=username_taken`
        );
      }

      const account = await Account.create({
        first_name: given_name,
        last_name: family_name,
        username,
        email,
        email_verified: true,
        auth_type: 'google',
      });

      //   TODO: send welcome email..?

      const new_session_id = nanoid();

      const session = await Session.create<SessionInterface>({
        account: account._id,
        session_id: new_session_id,
      });

      const response = NextResponse.redirect(
        `${process.env.CLIENT_BASE_URL}${success_redirect_path}?new_account=true`
      );

      response.cookies.set('sid', new_session_id, {
        // maxAge: 60 * 60 * 24 * 7, // 1 week
        maxAge: 60 * 60, // 1 hour
        httpOnly: true,
      });

      return response;
    } catch (error: any) {
      console.log('[GOOGLE_OAUTH_ERROR]', error);
      return NextResponse.redirect(
        `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=authentication_failed`
      );
    }
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.redirect(
      `${process.env.CLIENT_BASE_URL}${error_redirect_path}?error=server_error`
    );
  }
};
