import { passwordRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session from '@/models/session';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .refine(
      (value) => passwordRegex.test(value),
      'Password must be 8-16 characters long, and contain at least one numeric digit, and special character'
    ),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  // const { first_name, last_name, username, email, password } = body;

  // if (!first_name || !last_name || !username || !email || !password) {
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

  const { first_name, last_name, username, email, password } =
    returnObject.data;

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    const emailInUse = await Account.findOne<AccountInterface>({
      email: email.toLowerCase().trim(),
    });

    if (emailInUse) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    const usernameTaken = await Account.findOne<AccountInterface>({
      username: username.toLowerCase().trim(),
    });

    if (usernameTaken) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    const account = await Account.create({
      first_name,
      last_name,
      username,
      email,
      password,
    });

    return NextResponse.json(account);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
