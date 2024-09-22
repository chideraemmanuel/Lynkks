import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics from '@/models/analytics';
import Session, { SessionInterface } from '@/models/session';
import { PipelineStage } from 'mongoose';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

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
      return NextResponse.json({ error: 'Account Not Found' }, { status: 404 });
    }

    if (!account.email_verified) {
      return NextResponse.json(
        { error: 'Account email has not been verified' },
        { status: 403 }
      );
    }

    // ! ROUTE LOGIC !
    const date = new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day

    const aggregation: PipelineStage[] = [
      {
        $match: {
          account: account._id, // Match the specific account
        },
      },
      {
        $facet: {
          totalViews: [
            { $unwind: '$views' }, // Flatten the views array
            { $count: 'count' }, // Count all views
          ],
          totalClicks: [
            { $unwind: '$clicks' }, // Flatten the clicks array
            { $count: 'count' }, // Count all clicks
          ],
          viewsForDay: [
            { $unwind: '$views' }, // Flatten the views array
            {
              $match: {
                'views.viewedAt': { $gte: startOfDay, $lte: endOfDay }, // Filter by date
              },
            },
            { $count: 'count' }, // Count views for the day
          ],
          clicksForDay: [
            { $unwind: '$clicks' }, // Flatten the clicks array
            {
              $match: {
                'clicks.clickedAt': { $gte: startOfDay, $lte: endOfDay }, // Filter by date
              },
            },
            { $count: 'count' }, // Count clicks for the day
          ],
        },
      },
    ];

    const stats = await Analytics.aggregate(aggregation);

    const result = {
      views: {
        total:
          stats[0].totalViews.length > 0 ? stats[0].totalViews[0].count : 0,
        today:
          stats[0].viewsForDay.length > 0 ? stats[0].viewsForDay[0].count : 0,
      },
      clicks: {
        total:
          stats[0].totalClicks.length > 0 ? stats[0].totalClicks[0].count : 0,
        today:
          stats[0].clicksForDay.length > 0 ? stats[0].clicksForDay[0].count : 0,
      },
    };

    const new_session_id = nanoid();

    await Session.updateOne(
      { session_id },
      {
        session_id: new_session_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    );

    const response = NextResponse.json(result);

    response.cookies.set('sid', new_session_id, {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
    });

    return response;
    // return NextResponse.json(result);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
