import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Session, { SessionInterface } from '@/models/session';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

    //  ! VALIDATION > DELETION STARTS !
    const { success, data } = z
      .object({
        section: z.enum(['custom_links', 'social_links']),
      })
      .safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Missing or Invalid body data' },
        { status: 400 }
      );
    }

    const { section } = data;

    const linkExists = account.links[section].find((link) =>
      link._id.equals(link_id)
    );

    if (!linkExists) {
      return NextResponse.json(
        { error: 'Link with the supplied ID does not exist' },
        { status: 400 }
      );
    }

    if (section === 'custom_links') {
      const updatedAccount = await Account.findByIdAndUpdate(
        account._id,
        {
          $pull: { 'links.custom_links': { _id: link_id } },
        },
        {
          new: true,
          // arrayFilters: [{ 'element._id': link_id }]
        }
      );

      return NextResponse.json(updatedAccount);
    } else {
      const updatedAccount = await Account.findByIdAndUpdate(
        account._id,
        {
          $pull: { 'links.social_links': { _id: link_id } },
        },
        {
          new: true,
          // arrayFilters: [{ 'element._id': link_id }]
        }
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