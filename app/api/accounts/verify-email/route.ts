import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import EmailVerification, {
  EmailVerificationInterface,
} from '@/models/email-verification';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const bodySchema = z.object({
  email: z.string().email(),
  OTP: z.string().min(6).max(6),
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

  const { email, OTP } = returnObject.data;

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    // check if email has an account in database
    const accountExists = await Account.findOne<AccountInterface>({ email });

    if (!accountExists) {
      return NextResponse.json(
        { error: 'No account with the supplied email' },
        { status: 400 }
      );
    }

    if (accountExists.email_verified) {
      return NextResponse.json(
        { error: 'Email has already been verified' },
        { status: 400 }
      );
    }

    // check if email verification record exists
    const emailVerificationRecord =
      await EmailVerification.findOne<EmailVerificationInterface>({
        account: accountExists._id,
      });

    if (!emailVerificationRecord) {
      return NextResponse.json(
        {
          error: 'Email verification record does not exist or has expired.',
        },
        { status: 400 }
      );
    }

    const { OTP: hashedOTP } = emailVerificationRecord;

    const OTPMatches = await bcrypt.compare(OTP, hashedOTP);

    if (!OTPMatches) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountExists._id,
      { email_verified: true },
      { new: true }
    );

    await EmailVerification.deleteOne({ account: accountExists._id });

    // TODO: send email verification successful/welcome email..?

    return NextResponse.json({
      message: `Email "${email}" has been verified successfully`,
    });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
