import { app } from '@/config/firebase';
import { passwordRegex, URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, {
  AccountInterface,
  CustomLink,
  SocialLink,
} from '@/models/account';
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
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { v4 as uuid } from 'uuid';
import formDataToObject from '@/lib/formDataToObject';

export const GET = async (request: NextRequest) => {
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
      // TODO: delete session from database..?
      const response = NextResponse.json(
        { error: 'Account Not Found' },
        { status: 404 }
      );

      response.cookies.set('sid', '', { maxAge: 0 });

      return response;
    }

    // const new_session_id = nanoid();

    await Session.updateOne(
      { session_id },
      {
        // session_id: new_session_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    );

    const response = NextResponse.json(account);

    response.cookies.set('sid', session_id, {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
    });

    return response;
    // return NextResponse.json(account);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const HeaderSchema = z.object({
  type: z.literal('header'),
  title: z.string().min(1),
});

const HyperlinkSchema = z.object({
  type: z.literal('link'),
  title: z.string().min(1),
  // href: z.string().url(),
  href: z.string().refine((value) => URLRegex.test(value), 'Invalid URL'),
});

const BodySchema = z.object({
  first_name: z.string().min(3).optional(),
  last_name: z.string().min(3).optional(),
  //   username: z.string().min(3).optional(),
  password: z
    .string()
    .refine(
      (value) => passwordRegex.test(value),
      'Password must be 8-16 characters long, and contain at least one numeric digit, and special character'
    )
    .optional(),
  profile: z
    .object({
      title: z.string().min(3).optional(),
      bio: z.string().min(1).optional(),
      // image: z.instanceof(File).optional(),
    })
    .optional(),
  profile_image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, JPG, PNG, and WebP formats are supported.'
    )
    .optional(),
  links: z
    .object({
      custom_links: z
        .array(
          z
            .discriminatedUnion('type', [HeaderSchema, HyperlinkSchema])
            .optional()
        )
        .optional(),
      social_links: z
        .array(
          z
            .object({
              // title: z.string().min(1),
              platform: z.enum([
                'Instagram',
                'Facebook',
                'X',
                'TikTok',
                'YouTube',
                'LinkedIn',
                'Pinterest',
                'Snapchat',
                'WhatsApp',
                'Telegram',
                'Reddit',
                'Tumblr',
                'Twitch',
                'Discord',
              ]),
              // href: z.string().url(),
              href: z
                .string()
                .refine((value) => URLRegex.test(value), 'Invalid URL'),
            })
            .optional()
        )
        .optional(),
    })
    .optional(),
  //   completed_onboarding: z.boolean().optional(),
  //   completed_onboarding: z.enum(['true', 'false']).optional(),
  completed_onboarding: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .optional(),
});

export type Updates = z.infer<typeof BodySchema>;

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
    ).select('+password');

    if (!account) {
      return NextResponse.json({ error: 'Account Not Found' }, { status: 404 });
    }

    if (!account.email_verified) {
      return NextResponse.json(
        { error: 'Account email has not been verified' },
        { status: 403 }
      );
    }

    // !!!!! FIELD VALIDATION STARTS !!!!!
    //   const returnObject = BodySchema.safeParse({
    //     links: {
    //       custom_links: [
    //         {
    //           type: 'link',
    //           title: 'Titleee',
    //           href: 'https://google.com',
    //         },
    //       ],
    //     },
    //     completed_onboarding: 'true',
    //   });

    //   //   if (!returnObject.success) {
    //   //     return;
    //   //   }

    //   //   const {} = returnObject.data;
    //   return NextResponse.json(returnObject);
    //
    //   console.log('params', params);
    //   const body = await request.json();

    // const formData = await request.formData();

    // const profile_image = formData.get('profile_image');

    const formData = await request.formData();

    // let body: any = {};
    // formData.forEach((value, key) => (body[key] = value));
    // console.log('body', body);

    const formDataObject = formDataToObject(formData);

    // console.log('formDataObject', formDataObject);

    // const body = await request.json();

    // const { profile_image } = body; // ! intentional separation

    // console.log('body', body);
    // console.log('profile_image', profile_image);
    // const f = new Intl.DateTimeFormat('en-us', { timeStyle: 'full' });
    // console.log('[DATE]', f.format(new Date(Date.now() + 1000 * 60 * 60)));

    console.log('formDataObject', formDataObject);

    const { success, data } = BodySchema.safeParse(formDataObject);

    if (!success) {
      return NextResponse.json(
        { error: 'Missing or Invalid body data' },
        { status: 400 }
      );
    }

    // if (Object.keys(data).length === 0 && !profile_image) {
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'No field to be updated was supplied' },
        { status: 400 }
      );
    }

    const {
      first_name,
      last_name,
      password,
      profile,
      profile_image,
      links,
      completed_onboarding,
    } = data;

    console.log('dataaaa', data);

    const updates: Updates = {};

    if (first_name) {
      updates.first_name = first_name;
    }

    if (last_name) {
      updates.last_name = last_name;
    }

    if (password) {
      if (account.auth_type === 'google') {
        return NextResponse.json(
          {
            error:
              'Account was authenticated with Google. No password to update.',
          },
          { status: 400 }
        );
      }

      // ! compare new password with previous !
      const passwordIsSame = await bcrypt.compare(
        password,
        account.password as string
      );

      if (passwordIsSame) {
        return NextResponse.json(
          {
            error: 'The supplied password is the same with previous.',
          },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(password, salt);
      updates.password = hashed_password;
    }

    if (profile) {
      // const profileUpdates: ProfileUpdates = {};
      // const { title, bio } = profile;

      // if (title) {
      //   profileUpdates.title = title;
      // }

      // if (bio) {
      //   profileUpdates.bio = bio;
      // }

      updates.profile = profile;
    }

    if (links) {
      updates.links = links;

      // type LinksUpdates = {
      //   custom_links?: CustomLink[]
      //   social_links?: SocialLink[]
      // }
      // const linksUpdate: LinksUpdates = {}
      // const { custom_links, social_links } = links

      // if (custom_links) {
      //   linksUpdate.custom_links = custom_links
      // }
    }

    if (completed_onboarding !== undefined) {
      updates.completed_onboarding = Boolean(completed_onboarding);
    }

    let profile_image_url: string | null = null;

    if (profile_image) {
      const storage = getStorage(app);
      const storageRef = ref(
        storage,
        `images/profile/${profile_image.name}-${uuid()}`
      );
      const snapshot = await uploadBytes(storageRef, profile_image);

      const url = await getDownloadURL(snapshot.ref);

      profile_image_url = url;
    }

    console.log('profile_image_url', profile_image_url);

    console.log({ ...updates });

    const updatedAccount = await Account.findByIdAndUpdate(
      sessionExists?.account,
      // {}, // updates
      profile_image_url
        ? {
            ...updates,
            links: {
              ...account.links,
              ...updates.links,
            },
            // $set: { links: updates.links },
            profile: {
              ...account.profile,
              ...updates.profile,
              image: profile_image_url,
            },
          }
        : // : updates,
          {
            ...updates,
            links: {
              ...account.links,
              ...updates.links,
            },
            // $set: { links: updates.links },
            profile: { ...account.profile, ...updates.profile },
          },
      // {...updates, profile: {...updates.profile, image: profile_image_url}},
      { new: true }
    );

    // ! delete previous profile image from firebase if any
    if (account.profile.image && profile_image) {
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

    // const new_session_id = nanoid();

    await Session.updateOne(
      { session_id },
      {
        // session_id: new_session_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    );

    const response = NextResponse.json(updatedAccount);

    response.cookies.set('sid', session_id, {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
    });

    return response;
    // return NextResponse.json(updatedAccount);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
