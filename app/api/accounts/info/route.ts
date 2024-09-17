import { app } from '@/config/firebase';
import { passwordRegex, URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// TODO: add route for profile picture deletion!

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

    return NextResponse.json(account);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

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
  links: z
    .object({
      custom_links: z
        .array(
          //   z
          //     .object({
          //       type: z.enum(['header', 'link']),
          //       title: z.string().min(1),
          //       href: z.string().url(),
          //     })
          //     .optional()
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

    // const formDataObject: Record<
    //   string,
    //   FormDataEntryValue | FormDataEntryValue[]
    // > = {};

    // formData.forEach((value, key) => {
    //   // If the key already exists, convert it to an array and append the value
    //   if (formDataObject[key]) {
    //     if (Array.isArray(formDataObject[key])) {
    //       formDataObject[key].push(value);
    //     } else {
    //       formDataObject[key] = [formDataObject[key], value];
    //     }
    //   } else {
    //     formDataObject[key] = value;
    //   }
    // });

    // console.log('formDataObject', formDataObject);

    const body = await request.json();

    const { profile_image } = body; // ! intentional separation

    const returnObject = BodySchema.safeParse(body);
    console.log('returnObject', returnObject);

    if (!returnObject.success) {
      return NextResponse.json(
        { error: 'Missing or Invalid body data' },
        { status: 400 }
      );
    }

    if (Object.keys(returnObject.data).length === 0 && !profile_image) {
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
      links,
      completed_onboarding,
    } = returnObject.data;

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
              'Account was authenticated with google. It does not have a password.',
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
    }

    if (completed_onboarding !== undefined) {
      updates.completed_onboarding = Boolean(completed_onboarding);
    }

    let profile_image_url: string | null = null;

    if (profile_image) {
      // TODO: refine file and restrict to image files
      const { success, data: image_file } = z
        .instanceof(File)
        .safeParse(profile_image);

      if (!success) {
        return NextResponse.json(
          {
            error: 'Invalid file supplied for "profile_image"',
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

      const url = await getDownloadURL(snapshot.ref);

      profile_image_url = url;
    }

    console.log('profile_image_url', profile_image_url);

    const updatedAccount = await Account.findByIdAndUpdate(
      sessionExists?.account,
      // {}, // updates
      profile_image_url
        ? {
            ...updates,
            profile: { ...updates.profile, image: profile_image_url },
          }
        : updates,
      // {...updates, profile: {...updates.profile, image: profile_image_url}},
      { new: true }
    );

    return NextResponse.json(updatedAccount);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
