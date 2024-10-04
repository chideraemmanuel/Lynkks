import { passwordRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import emailVerificationTemplate from '@/lib/email-templates/emailVerificationTemplate';
import generateOTP from '@/lib/generateOTP';
import sendEmail from '@/lib/sendEmail';
import Account, { AccountInterface } from '@/models/account';
import EmailVerification from '@/models/email-verification';
import Session, { SessionInterface } from '@/models/session';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  username: z.string().min(3).max(15),
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

  const { success, data } = BodySchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  const { username, email, password } = data;

  try {
    await connectToDatabase();

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
      username,
      email,
      password,
      auth_type: 'manual',
    });

    const OTP = generateOTP();

    await EmailVerification.create({
      account: account._id,
      OTP,
    });

    await sendEmail({
      receipent: email,
      subject: 'Email Verification',
      html: emailVerificationTemplate(OTP),
    });

    const response = NextResponse.json(
      { message: `Verification email has been sent to ${email}.` },
      { status: 201 }
    );

    const new_session_id = nanoid();

    await Session.create<SessionInterface>({
      account: account._id,
      session_id: new_session_id,
    });

    response.cookies.set('sid', new_session_id, {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
