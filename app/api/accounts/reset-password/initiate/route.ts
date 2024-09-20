import { connectToDatabase } from '@/lib/database';
import passwordResetTemplate from '@/lib/email-templates/passwordResetTemplate';
import sendEmail from '@/lib/sendEmail';
import Account, { AccountInterface } from '@/models/account';
import PasswordReset, { PasswordResetInterface } from '@/models/password-reset';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  email: z.string().email(),
  reset_page_path: z.string(),
});

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const returnObject = BodySchema.safeParse(body);

  if (!returnObject.success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  const { email, reset_page_path } = returnObject.data;

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

    if (accountExists && !accountExists.email_verified) {
      return NextResponse.json(
        { error: 'Account with the supplied email has not been verified' },
        { status: 400 }
      );
    }

    if (accountExists.auth_type === 'google') {
      return NextResponse.json(
        {
          error: 'Account was authenticated with Google. No password to reset.',
        },
        { status: 400 }
      );
    }

    // check if there's an existing password reset record, delete if any
    const passwordRequestRecordExists =
      await PasswordReset.findOne<PasswordResetInterface>({
        account: accountExists._id,
      });

    if (passwordRequestRecordExists) {
      await PasswordReset.deleteOne({ account: accountExists._id });
    }

    // create new password reset record and send email

    const reset_string = nanoid();

    const newPasswordResetRecord = await PasswordReset.create({
      account: accountExists._id,
      reset_string,
    });

    await sendEmail({
      receipent: email,
      subject: 'Password Reset Request',
      html: passwordResetTemplate({
        first_name: accountExists.first_name,
        email: accountExists.email,
        reset_string,
        reset_page_path,
      }),
    });

    return NextResponse.json(
      {
        message: `A password reset link has been sent to ${accountExists.email}`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
