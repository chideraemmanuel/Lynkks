import { app } from '@/config/firebase';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import { deleteObject, getStorage, ref } from 'firebase/storage';
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
    await connectToDatabase();

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

    // ! ROUTE LOGIC !
    if (!account.profile.image) {
      return NextResponse.json(
        { error: 'No profile image to delete' },
        { status: 400 }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      sessionExists?.account,
      {
        profile: { ...account.profile, image: null },
        // profile: { image: null },
        // profile: { $set: { image: null } },
      },
      { new: true }
    );

    const storage = getStorage(app);

    // Extract the file path from the full image URL
    const decodedUrl = decodeURIComponent(account.profile.image);
    const filePath = decodedUrl
      .split('/o/')[1] // Get the part after '/o/'
      .split('?')[0]; // Remove the query parameters like '?alt=media'

    const previousProfileImageRef = ref(storage, filePath);
    await deleteObject(previousProfileImageRef);

    return NextResponse.json({ message: 'Profile image deleted successfully' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
