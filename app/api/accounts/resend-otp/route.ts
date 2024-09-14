import { connectToDatabase } from '@/lib/database';
import generateOTP from '@/lib/generateOTP';
import sendEmail from '@/lib/sendEmail';
import Account, { AccountInterface } from '@/models/account';
import EmailVerification, {
  EmailVerificationInterface,
} from '@/models/email-verification';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  email: z.string().email(),
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

  const { email } = returnObject.data;

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

    if (emailVerificationRecord) {
      await EmailVerification.deleteOne({ account: accountExists._id });
    }

    const OTP = generateOTP();

    await EmailVerification.create({
      account: accountExists._id,
      otp: OTP,
    });

    // TODO: build email templates

    await sendEmail({
      receipent: accountExists.email,
      subject: 'Email Verification',
      html: `<p>${OTP}</p>`,
    });

    return NextResponse.json(
      {
        message: `Verification email has been sent to ${accountExists.email}.`,
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
