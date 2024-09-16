import { URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// TODO (IMPORTANT): account for cases where no field to be updated is passed

const HeaderSchema = z.object({
  type: z.literal('header'),
  title: z.string().min(1).optional(),
});

const HyperlinkSchema = z.object({
  type: z.literal('link'),
  title: z.string().min(1).optional(),
  // href: z.string().url().optional(),
  href: z
    .string()
    .refine((value) => URLRegex.test(value), 'Invalid URL')
    .optional(),
});

const customLinkSchema = z.discriminatedUnion('type', [
  HeaderSchema,
  HyperlinkSchema,
]);

const socialLinkSchema = z.object({
  platform: z
    .enum([
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
    ])
    .optional(),
  href: z.string().url().optional(),
});

// const BodySchema = z.object({
//   section: z.enum(['custom_links', 'social_links']),
//   link: z.discriminatedUnion('section', [
//     z.object({ section: z.literal('custom_links'), link: customLinkSchema }),
//     z.object({ section: z.literal('social_links'), link: socialLinkSchema }),
//   ]),
// });
const BodySchema = z.discriminatedUnion('section', [
  z.object({ section: z.literal('custom_links'), link: customLinkSchema }),
  z.object({ section: z.literal('social_links'), link: socialLinkSchema }),
]);

export const GET = async (request: NextRequest) => {
  const test = { section: 'custom_links', link: { type: 'link', href: 'wo!' } };

  const res = BodySchema.safeParse(test);

  return NextResponse.json(res);
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { link_id: string } }
) => {
  const session_id = request.cookies.get('sid')?.value;
  const body = await request.json();
  const { link_id } = params;

  if (!mongoose.isValidObjectId(link_id)) {
    return NextResponse.json({ error: 'Invalid Link ID' }, { status: 400 });
  }

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
      if (link.type === 'link' && !link.title && !link.href) {
        return NextResponse.json(
          { error: 'No field to be updated was supplied' },
          { status: 400 }
        );
      }

      if (link.type === 'header' && !link.title) {
        return NextResponse.json(
          { error: 'No field to be updated was supplied' },
          { status: 400 }
        );
      }
    } else {
      if (!link.platform && !link.href) {
        return NextResponse.json(
          { error: 'No field to be updated was supplied' },
          { status: 400 }
        );
      }
    }

    const linkExists = account.links[section].find((link) =>
      link._id.equals(link_id)
    );

    if (!linkExists) {
      return NextResponse.json(
        { error: 'Link with the supplied ID does not exist' },
        { status: 400 }
      );
    }

    // update link
    if (section === 'custom_links') {
      if (link.type === 'link') {
        const { type, title, href } = link;

        // ! BUILD UPDATES !
        interface CustomLinkUpdates {
          'links.custom_links.$[element].type': 'link' | 'header';
          'links.custom_links.$[element].title'?: string;
          'links.custom_links.$[element].href'?: string;
        }
        const updates: CustomLinkUpdates = {
          'links.custom_links.$[element].type': type,
        };

        if (title) {
          updates['links.custom_links.$[element].title'] = title;
        }

        if (href) {
          updates['links.custom_links.$[element].href'] = href;
        }

        const updatedAccount = await Account.findByIdAndUpdate(
          account._id,
          {
            $set: updates,
          },
          { new: true, arrayFilters: [{ 'element._id': link_id }] }
        );

        return NextResponse.json(updatedAccount);
      } else {
        const { type, title } = link;

        // ! BUILD UPDATES !
        interface CustomLinkHeaderUpdates {
          'links.custom_links.$[element].type': 'link' | 'header';
          // 'links.custom_links.$[element].href': null;
          'links.custom_links.$[element].title'?: string;
        }
        const updates: CustomLinkHeaderUpdates = {
          'links.custom_links.$[element].type': type,
          // 'links.custom_links.$[element].href': null,
        };

        if (title) {
          updates['links.custom_links.$[element].title'] = title;
        }

        const updatedAccount = await Account.findByIdAndUpdate(
          account._id,
          {
            $set: updates,
            $unset: {
              'links.custom_links.$[element].href': '', // Remove the href field
            },
          },
          { new: true, arrayFilters: [{ 'element._id': link_id }] }
        );

        return NextResponse.json(updatedAccount);
      }
    } else {
      const { platform, href } = link;

      // ! BUILD UPDATES !
      interface SocialLinkUpdates {
        'links.custom_links.$[element].platform'?:
          | 'Instagram'
          | 'Facebook'
          | 'X'
          | 'TikTok'
          | 'YouTube'
          | 'LinkedIn'
          | 'Pinterest'
          | 'Snapchat'
          | 'WhatsApp'
          | 'Telegram'
          | 'Reddit'
          | 'Tumblr'
          | 'Twitch'
          | 'Discord';
        'links.custom_links.$[element].href'?: string;
      }
      const updates: SocialLinkUpdates = {};

      if (platform) {
        updates['links.custom_links.$[element].platform'] = platform;
      }

      if (href) {
        updates['links.custom_links.$[element].href'] = href;
      }

      const updatedAccount = await Account.findByIdAndUpdate(
        account._id,
        {
          $set: updates,
        },
        { new: true, arrayFilters: [{ 'element._id': link_id }] }
      );

      return NextResponse.json(updatedAccount);
    }
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};

// const updatedAccount = await Account.findByIdAndUpdate(
//   account._id,
//   {
//     $set: {
//       'links.custom_links.$[element].type': updatedData.type,
//       'links.custom_links.$[element].title': link.title,
//       'links.custom_links.$[element].href': updatedData.href,
//     },
//   },
//   { new: true, arrayFilters: [{ 'element._id': link_id }] }
// );
