import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import Session, { SessionInterface } from '@/models/session';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  // const { email, password } = body;

  // if (!email || !password) {
  //   return NextResponse.json(
  //     { error: 'Please supply the required fields' },
  //     { status: 400 }
  //   );
  // }

  const returnObject = bodySchema.safeParse(body);

  console.log('returnObject', returnObject);

  if (!returnObject.success) {
    return NextResponse.json(
      { error: 'Missing or Invalid required fields.' },
      { status: 400 }
    );
  }

  const { email, password } = returnObject.data;

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    const accountExists = await Account.findOne<AccountInterface>({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!accountExists) {
      return NextResponse.json(
        { error: 'No account with the supplied email address' },
        { status: 400 }
      );
    }

    const { password: hashedPassword, _id, ...accountDetails } = accountExists;

    const passwordMatches = await bcrypt.compare(hashedPassword, password);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Incorrect Password' },
        { status: 400 }
      );
    }

    const session_id = nanoid();

    const session = await Session.create<SessionInterface>({
      account: _id,
      session_id,
    });

    const response = NextResponse.json({ _id, ...accountDetails });

    response.cookies.set('sid', session_id, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
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
