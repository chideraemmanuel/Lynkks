import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const { success, data } = z
    .object({ username: z.string().min(3).max(15) })
    .safeParse(body);

  if (!success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  const { username } = data;

  try {
    await connectToDatabase();

    const usernameTaken = await Account.findOne<AccountInterface>({
      username: username.toLowerCase().trim(),
    });

    if (usernameTaken) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 422 }
      );
    }

    return NextResponse.json({ message: 'Username valid' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
