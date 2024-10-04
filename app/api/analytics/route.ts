import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics from '@/models/analytics';
import Session, { SessionInterface } from '@/models/session';
import { PipelineStage } from 'mongoose';
import { nanoid } from 'nanoid';
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

// Helper function to generate all dates between start and end date
function generateDateRange(startDate: Date, endDate: Date) {
  const dateArray: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(currentDate.toISOString().split('T')[0]); // Get date in YYYY-MM-DD format
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
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

    // Get all dates between startDate and endDate
    const allDates = generateDateRange(startDate as Date, endDate);

    // Initialize a result map with all dates and zero counts
    const resultMap = allDates.reduce((acc, date) => {
      acc[date] = { date, views: 0, clicks: 0 };
      return acc;
    }, {} as Record<string, { date: string; views: number; clicks: number }>);

    // Merge the aggregation result into the resultMap
    aggregationResult.forEach(
      (entry: { date: string; views: number; clicks: number }) => {
        if (resultMap[entry.date]) {
          resultMap[entry.date].views = entry.views;
          resultMap[entry.date].clicks = entry.clicks;
        }
      }
    );

    // Convert resultMap back to an array of objects
    const finalResult = Object.values(resultMap);

    // const new_session_id = nanoid();

    await Session.updateOne(
      { session_id },
      {
        // session_id: new_session_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    );

    const response = NextResponse.json(finalResult);

    response.cookies.set('sid', session_id, {
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
    });

    return response;
    // return NextResponse.json(aggregationResult);
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
