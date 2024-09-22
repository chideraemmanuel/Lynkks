import { app } from '@/config/firebase';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const PUT = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;
  const formData = await request.formData();
  const profile_image = formData.get('profile_image');

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

    // ! ROUTE LOGIC !
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED_IMAGE_TYPES = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    const { success, data: image_file } = z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only JPEG, JPG, PNG, and WebP formats are supported.'
      )
      .safeParse(profile_image);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Missing or Invalid file',
        },
        { status: 400 }
      );
    }

    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `images/profile/${image_file.name}-${Date.now()}`
    );
    const snapshot = await uploadBytes(storageRef, image_file);

    const profile_image_url = await getDownloadURL(snapshot.ref);

    const updatedAccount = await Account.findByIdAndUpdate(
      sessionExists?.account,
      {
        // profile: { ...account.profile, image: profile_image_url },
        // profile: { image: profile_image_url },
        profile: { $set: { image: profile_image_url } },
      },
      { new: true }
    );

    // ! delete previous profile image from firebase if any
    if (account.profile.image) {
      const storage = getStorage(app);

      // Extract the file path from the full image URL
      const decodedUrl = decodeURIComponent(account.profile.image);
      const filePath = decodedUrl
        .split('/o/')[1] // Get the part after '/o/'
        .split('?')[0]; // Remove the query parameters like '?alt=media'

      // const previousProfileImageRef = ref(storage, `images/profile/${imageName}`);
      const previousProfileImageRef = ref(storage, filePath);
      await deleteObject(previousProfileImageRef);
    }

    return NextResponse.json({ message: 'Profile image updated successfully' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
