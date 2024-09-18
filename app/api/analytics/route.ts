import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics from '@/models/analytics';
import Session, { SessionInterface } from '@/models/session';
import { PipelineStage, Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export type Range = '7d' | '30d' | '60d' | '90d';

// Utility function to calculate the start date based on the range
function calculateStartDate(range: Range) {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.setDate(now.getDate() - 7));
    case '30d':
      return new Date(now.setDate(now.getDate() - 30));
    case '60d':
      return new Date(now.setDate(now.getDate() - 60));
    case '90d':
      return new Date(now.setDate(now.getDate() - 90));
    default:
      return null;
  }
}

export const GET = async (request: NextRequest) => {
  const range = request.nextUrl.searchParams.get('range');
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

    // ! ROUTE LOGIC !
    if (!range) {
      return NextResponse.json(
        { error: '"Range" query parameter is required' },
        { status: 400 }
      );
    }

    const { success, data } = z
      .enum(['7d', '30d', '60d', '90d'])
      .safeParse(range);

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid "Range" query parameter' },
        { status: 400 }
      );
    }

    const startDate = calculateStartDate(data);
    const endDate = new Date();

    const aggregation: PipelineStage[] = [
      {
        $match: {
          account: account._id,
        },
      },
      {
        $project: {
          views: {
            $filter: {
              input: '$views',
              as: 'view',
              cond: {
                $and: [
                  { $gte: ['$$view.viewedAt', startDate] },
                  { $lte: ['$$view.viewedAt', endDate] },
                ],
              },
            },
          },
          clicks: {
            $filter: {
              input: '$clicks',
              as: 'click',
              cond: {
                $and: [
                  { $gte: ['$$click.clickedAt', startDate] },
                  { $lte: ['$$click.clickedAt', endDate] },
                ],
              },
            },
          },
        },
      },
      {
        $facet: {
          views: [
            {
              $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$views.viewedAt',
                    },
                  },
                },
                viewsCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                date: '$_id.date',
                views: '$viewsCount',
              },
            },
          ],
          clicks: [
            {
              $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
            },
            {
              $group: {
                _id: {
                  date: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$clicks.clickedAt',
                    },
                  },
                },
                clicksCount: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                date: '$_id.date',
                clicks: '$clicksCount',
              },
            },
          ],
        },
      },
      {
        $project: {
          mergedData: {
            $concatArrays: ['$views', '$clicks'],
          },
        },
      },
      {
        $unwind: '$mergedData',
      },
      {
        $group: {
          _id: '$mergedData.date',
          date: { $first: '$mergedData.date' },
          views: { $sum: { $ifNull: ['$mergedData.views', 0] } },
          clicks: { $sum: { $ifNull: ['$mergedData.clicks', 0] } },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          _id: 0,
          date: 1,
          views: 1,
          clicks: 1,
        },
      },
    ];

    const aggregationResult = await Analytics.aggregate(aggregation);

    return NextResponse.json(aggregationResult);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
