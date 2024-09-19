import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import PasswordReset, { PasswordResetInterface } from '@/models/password-reset';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = async (request: NextRequest) => {
  //   const body = await request.json();
  const email_param = request.nextUrl.searchParams.get('email');

  const { success, data: email } = z.string().email().safeParse(email_param);

  if (!success) {
    return NextResponse.json(
      { error: 'Missing or Invalid "email" query param' },
      { status: 400 }
    );
  }

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    // check if email has an account in database
    const accountExists = await Account.findOne<AccountInterface>({
      email: email.toLowerCase().trim(),
    });

    if (!accountExists) {
      return NextResponse.json(
        { error: 'No account with the supplied email' },
        { status: 400 }
      );
    }

    // check if there's an existing password reset record
    const passwordRequestRecordExists =
      await PasswordReset.findOne<PasswordResetInterface>({
        account: accountExists._id,
      });

    if (!passwordRequestRecordExists) {
      return NextResponse.json(
        {
          error: 'Password reset record does not exist or has expired',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ message: 'Password reset request exists' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
