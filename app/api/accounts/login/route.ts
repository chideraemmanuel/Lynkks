import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import Session, { SessionInterface } from '@/models/session';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;
  const body = await request.json();

  try {
    await connectToDatabase();

    if (session_id) {
      const sessionExists = await Session.findOne<SessionInterface>({
        session_id,
      });

      if (sessionExists) {
        const account = await Account.findById(sessionExists?.account);

        if (account) {
          // const new_session_id = nanoid();

          await Session.updateOne(
            { session_id },
            {
              // session_id: new_session_id,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            }
          );

          const response = NextResponse.json(
            {
              error: 'User already logged in - An active session was found',
            },
            { status: 400 }
          );

          response.cookies.set('sid', session_id, {
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: true,
            ...(process.env.NODE_ENV === 'production' && {
              secure: true,
            }),
          });

          return response;
        }
      }
    }

    const { success, data } = BodySchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Missing or Invalid body data' },
        { status: 400 }
      );
    }

    const { email, password } = data;

    const accountExists = await Account.findOne<AccountInterface>({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!accountExists) {
      return NextResponse.json(
        { error: 'No account with the supplied email address' },
        { status: 400 }
      );
    }

    if (accountExists && accountExists.auth_type === 'google') {
      return NextResponse.json(
        {
          error:
            'Account already verified with Google. Sign in with Google instead.',
        },
        { status: 400 }
      );
    }

    const {
      password: hashedPassword,
      _id,
      first_name,
      last_name,
      username,
      // email: storedEmail,
      email_verified,
      auth_type,
      profile,
      links,
    } = accountExists;

    const passwordMatches = await bcrypt.compare(
      password,
      hashedPassword as string
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Incorrect Password' },
        { status: 400 }
      );
    }

    const new_session_id = nanoid();

    const session = await Session.create<SessionInterface>({
      account: _id,
      session_id: new_session_id,
    });

    const response = NextResponse.json({
      _id,
      first_name,
      last_name,
      username,
      email,
      email_verified,
      auth_type,
      profile,
      links,
    });

    response.cookies.set('sid', new_session_id, {
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      ...(process.env.NODE_ENV === 'production' && {
        secure: true,
      }),
    });

    return response;
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
