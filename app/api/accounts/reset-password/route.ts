import { passwordRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import PasswordReset, { PasswordResetInterface } from '@/models/password-reset';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// TODO: CREATE A ROUTE TO CHECK IF USER WITH A SUPPLIED EMAIL EXISTS; TO BE USED IN CLIENT ON PASSWORD RESET PAGE

const bodySchema = z.object({
  email: z.string().email(),
  reset_string: z.string(),
  new_password: z
    .string()
    .refine(
      (value) => passwordRegex.test(value),
      'Password must be 8-16 characters long, and contain at least one numeric digit, and special character'
    ),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const returnObject = bodySchema.safeParse(body);

  if (!returnObject.success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  const { email, reset_string, new_password } = returnObject.data;

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
        { status: 400 }
      );
    }

    const resetStringsMatch = await bcrypt.compare(
      reset_string,
      passwordRequestRecordExists.reset_string
    );

    if (!resetStringsMatch) {
      return NextResponse.json(
        { error: 'Invalid reset string' },
        { status: 400 }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountExists._id,
      { password: new_password },
      { new: true }
    );

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
