import { passwordRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import generateOTP from '@/lib/generateOTP';
import sendEmail from '@/lib/sendEmail';
import Account, { AccountInterface } from '@/models/account';
import EmailVerification from '@/models/email-verification';
import Session, { SessionInterface } from '@/models/session';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  // first_name: z.string().min(3),
  // last_name: z.string().min(3),
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
  // const { first_name, last_name, username, email, password } = body;

  // if (!first_name || !last_name || !username || !email || !password) {
  //   return NextResponse.json(
  //     { error: 'Please supply the required fields' },
  //     { status: 400 }
  //   );
  // }

  const returnObject = BodySchema.safeParse(body);

  console.log('returnObject', returnObject.error?.message);

  if (!returnObject.success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  // const { first_name, last_name, username, email, password } =
  //   returnObject.data;
  const { username, email, password } = returnObject.data;

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
      // first_name,
      // last_name,
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

    // TODO: build email templates

    // await sendEmail({
    //   receipent: email,
    //   subject: 'Email Verification',
    //   html: `<p>${OTP}</p>`,
    // });

    const response = NextResponse.json(
      { message: `Verification email has been sent to ${email}.` },
      { status: 201 }
    );

    const new_session_id = nanoid();

    const session = await Session.create<SessionInterface>({
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
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
