import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;

  if (!session_id) {
    return NextResponse.json(
      { error: 'Not Authorized - No Session Token' },
      { status: 403 }
    );
  }

  try {
    console.log('connecting to database...');
    await connectToDatabase();
    console.log('connected to database!');

    const sessionExists = await Session.findOne<SessionInterface>({
      session_id,
    });

    if (!sessionExists) {
      const response = NextResponse.json(
        { error: 'Not Authorized - Session Not Found' },
        { status: 403 }
      );

      response.cookies.set('sid', '', { maxAge: 0 });

      return response;
    }

    // console.log('sessionExists', sessionExists);

    const account = await Account.findById<AccountInterface>(
      sessionExists?.account
    );

    if (!account) {
      return NextResponse.json({ error: 'Account Not Found' }, { status: 404 });
    }

    if (!account.email_verified) {
      return NextResponse.json(
        { error: 'Account email has not been verified' },
        { status: 403 }
      );
    }

    // const storage = getStorage(app);
    // const profileImageRef = ref(storage, `images/profile/${imageName}`);
    // const info = await deleteObject(profileImageRef);

    return NextResponse.json({ message: 'Profile image deleted successfully' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
