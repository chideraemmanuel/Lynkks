import { URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

const customLinkSchema = z.discriminatedUnion('type', [
  HeaderSchema,
  HyperlinkSchema,
]);

const socialLinkSchema = z.object({
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
  href: z.string().refine((value) => URLRegex.test(value), 'Invalid URL'),
});

const BodySchema = z.discriminatedUnion('section', [
  z.object({ section: z.literal('custom_links'), link: customLinkSchema }),
  z.object({ section: z.literal('social_links'), link: socialLinkSchema }),
]);

export const PUT = async (request: NextRequest) => {
  const session_id = request.cookies.get('sid')?.value;
  const body = await request.json();

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

    // ! VALIDATION STARTS !
    const { success, data } = BodySchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Missing or Invalid body data' },
        { status: 400 }
      );
    }

    const { section, link } = data;

    if (section === 'custom_links') {
      const updatedAccount = await Account.findByIdAndUpdate(
        account._id,
        {
          $push: { 'links.custom_links': link },
        },
        { new: true }
      );

      return NextResponse.json(updatedAccount);
    } else {
      const { platform } = link;

      // check if link for platform already exists on database
      const platformExists = account.links.social_links.find(
        (link) => link.platform === platform
      );

      if (platformExists) {
        return NextResponse.json(
          { error: 'Link for the specified platform already exists' },
          { status: 400 }
        );
      }

      const updatedAccount = await Account.findByIdAndUpdate(
        account._id,
        {
          $push: { 'links.social_links': link },
        },
        { new: true }
      );

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
    }
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
