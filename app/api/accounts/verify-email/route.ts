import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import EmailVerification, {
  EmailVerificationInterface,
} from '@/models/email-verification';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const BodySchema = z.object({
  email: z.string().email(),
  OTP: z.string().min(6).max(6),
});

// TODO: only make endpoint accessible when there's an active session..? this would mean that the endpoint doesn't need to recieve the email field anymore, as that can be gotten from the active session.

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const returnObject = BodySchema.safeParse(body);

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
    const accountExists = await Account.findOne<AccountInterface>({
      email: email.toLowerCase().trim(),
    });

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
          error: 'Email verification record does not exist or has expired',
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

    //   TODO: send welcome email..?

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
