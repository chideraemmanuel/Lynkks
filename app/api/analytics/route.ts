import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics from '@/models/analytics';
import Session, { SessionInterface } from '@/models/session';
import { PipelineStage, Types } from 'mongoose';
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

    // const aggregation: PipelineStage[] = [
    //   {
    //     $match: {
    //       account: account._id,
    //     },
    //   },
    //   {
    //     $project: {
    //       views: {
    //         $filter: {
    //           input: '$views',
    //           as: 'view',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$view.viewedAt', startDate] },
    //               { $lte: ['$$view.viewedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //       clicks: {
    //         $filter: {
    //           input: '$clicks',
    //           as: 'click',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$click.clickedAt', startDate] },
    //               { $lte: ['$$click.clickedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $facet: {
    //       views: [
    //         {
    //           $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$views.viewedAt',
    //                 },
    //               },
    //             },
    //             viewsCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             views: '$viewsCount',
    //           },
    //         },
    //       ],
    //       clicks: [
    //         {
    //           $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$clicks.clickedAt',
    //                 },
    //               },
    //             },
    //             clicksCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             clicks: '$clicksCount',
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       mergedData: {
    //         $concatArrays: ['$views', '$clicks'],
    //       },
    //     },
    //   },
    //   {
    //     $unwind: '$mergedData',
    //   },
    //   {
    //     $group: {
    //       _id: '$mergedData.date',
    //       date: { $first: '$mergedData.date' },
    //       views: { $sum: { $ifNull: ['$mergedData.views', 0] } },
    //       clicks: { $sum: { $ifNull: ['$mergedData.clicks', 0] } },
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: 1,
    //       views: 1,
    //       clicks: 1,
    //     },
    //   },
    // ];

    // const aggregation: PipelineStage[] = [
    //   {
    //     $match: {
    //       account: account._id,
    //     },
    //   },
    //   {
    //     $project: {
    //       views: {
    //         $filter: {
    //           input: '$views',
    //           as: 'view',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$view.viewedAt', startDate] },
    //               { $lte: ['$$view.viewedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //       clicks: {
    //         $filter: {
    //           input: '$clicks',
    //           as: 'click',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$click.clickedAt', startDate] },
    //               { $lte: ['$$click.clickedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $facet: {
    //       views: [
    //         {
    //           $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$views.viewedAt',
    //                 },
    //               },
    //             },
    //             viewsCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             views: '$viewsCount',
    //           },
    //         },
    //       ],
    //       clicks: [
    //         {
    //           $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$clicks.clickedAt',
    //                 },
    //               },
    //             },
    //             clicksCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             clicks: '$clicksCount',
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       mergedData: {
    //         $concatArrays: ['$views', '$clicks'],
    //       },
    //     },
    //   },
    //   {
    //     $unwind: '$mergedData',
    //   },
    //   {
    //     $group: {
    //       _id: '$mergedData.date',
    //       date: { $first: '$mergedData.date' },
    //       views: { $sum: { $ifNull: ['$mergedData.views', 0] } },
    //       clicks: { $sum: { $ifNull: ['$mergedData.clicks', 0] } },
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    //   // Generate all dates between startDate and endDate
    //   {
    //     $addFields: {
    //       allDates: {
    //         $range: [
    //           { $toLong: startDate },
    //           { $add: [{ $toLong: endDate }, 86400000] }, // Adding 1 day in milliseconds
    //           86400000, // Interval of 1 day in milliseconds
    //         ],
    //       },
    //     },
    //   },
    //   // Convert each timestamp to a date string
    //   {
    //     $project: {
    //       allDates: {
    //         $map: {
    //           input: '$allDates',
    //           as: 'date',
    //           in: {
    //             $dateToString: {
    //               format: '%Y-%m-%d',
    //               date: { $toDate: '$$date' },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // Left join with actual views and clicks data
    //   {
    //     $unwind: '$allDates',
    //   },
    //   {
    //     $lookup: {
    //       from: 'analytics',
    //       let: { date: '$allDates' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ['$account', account._id] },
    //                 {
    //                   $eq: [
    //                     {
    //                       $dateToString: {
    //                         format: '%Y-%m-%d',
    //                         date: '$views.viewedAt',
    //                       },
    //                     },
    //                     '$$date',
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: 'dateData',
    //     },
    //   },
    //   // Combine the results of the lookup with the default dates
    //   {
    //     $addFields: {
    //       views: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.viewsCount', 0] }, 0],
    //       },
    //       clicks: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.clicksCount', 0] }, 0],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: '$allDates',
    //       views: 1,
    //       clicks: 1,
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    // ];

    // const aggregation: PipelineStage[] = [
    //   {
    //     $match: {
    //       account: account._id,
    //     },
    //   },
    //   {
    //     $project: {
    //       views: {
    //         $filter: {
    //           input: '$views',
    //           as: 'view',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$view.viewedAt', startDate] },
    //               { $lte: ['$$view.viewedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //       clicks: {
    //         $filter: {
    //           input: '$clicks',
    //           as: 'click',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$click.clickedAt', startDate] },
    //               { $lte: ['$$click.clickedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $facet: {
    //       views: [
    //         {
    //           $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$views.viewedAt',
    //                 },
    //               },
    //             },
    //             viewsCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             views: '$viewsCount',
    //           },
    //         },
    //       ],
    //       clicks: [
    //         {
    //           $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$clicks.clickedAt',
    //                 },
    //               },
    //             },
    //             clicksCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             clicks: '$clicksCount',
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       mergedData: {
    //         $concatArrays: ['$views', '$clicks'],
    //       },
    //     },
    //   },
    //   {
    //     $unwind: '$mergedData',
    //   },
    //   {
    //     $group: {
    //       _id: '$mergedData.date',
    //       date: { $first: '$mergedData.date' },
    //       views: { $sum: { $ifNull: ['$mergedData.views', 0] } },
    //       clicks: { $sum: { $ifNull: ['$mergedData.clicks', 0] } },
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    //   // Generate all dates between startDate and endDate (in days, not ms)
    //   {
    //     $addFields: {
    //       startDay: { $toInt: { $divide: [{ $toLong: startDate }, 86400000] } },
    //       endDay: { $toInt: { $divide: [{ $toLong: endDate }, 86400000] } },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       allDates: {
    //         $range: ['$startDay', { $add: ['$endDay', 1] }, 1], // Increment by 1 day
    //       },
    //     },
    //   },
    //   // Convert each day back to a date string
    //   {
    //     $project: {
    //       allDates: {
    //         $map: {
    //           input: '$allDates',
    //           as: 'day',
    //           in: {
    //             $dateToString: {
    //               format: '%Y-%m-%d',
    //               date: { $toDate: { $multiply: ['$$day', 86400000] } }, // Convert back to milliseconds
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // Left join the generated dates with the actual data
    //   {
    //     $unwind: '$allDates',
    //   },
    //   {
    //     $lookup: {
    //       from: 'analytics',
    //       let: { date: '$allDates' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ['$account', account._id] },
    //                 {
    //                   $eq: [
    //                     {
    //                       $dateToString: {
    //                         format: '%Y-%m-%d',
    //                         date: '$views.viewedAt',
    //                       },
    //                     },
    //                     '$$date',
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: 'dateData',
    //     },
    //   },
    //   {
    //     $addFields: {
    //       views: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.viewsCount', 0] }, 0],
    //       },
    //       clicks: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.clicksCount', 0] }, 0],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: '$allDates',
    //       views: 1,
    //       clicks: 1,
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    // ];
    // const aggregation: PipelineStage[] = [
    //   {
    //     $match: {
    //       account: account._id,
    //     },
    //   },
    //   {
    //     $project: {
    //       views: {
    //         $filter: {
    //           input: '$views',
    //           as: 'view',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$view.viewedAt', startDate] },
    //               { $lte: ['$$view.viewedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //       clicks: {
    //         $filter: {
    //           input: '$clicks',
    //           as: 'click',
    //           cond: {
    //             $and: [
    //               { $gte: ['$$click.clickedAt', startDate] },
    //               { $lte: ['$$click.clickedAt', endDate] },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $facet: {
    //       views: [
    //         {
    //           $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$views.viewedAt',
    //                 },
    //               },
    //             },
    //             viewsCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             views: '$viewsCount',
    //           },
    //         },
    //       ],
    //       clicks: [
    //         {
    //           $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
    //         },
    //         {
    //           $group: {
    //             _id: {
    //               date: {
    //                 $dateToString: {
    //                   format: '%Y-%m-%d',
    //                   date: '$clicks.clickedAt',
    //                 },
    //               },
    //             },
    //             clicksCount: { $sum: 1 },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 0,
    //             date: '$_id.date',
    //             clicks: '$clicksCount',
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       mergedData: {
    //         $concatArrays: ['$views', '$clicks'],
    //       },
    //     },
    //   },
    //   {
    //     $unwind: '$mergedData',
    //   },
    //   {
    //     $group: {
    //       _id: '$mergedData.date',
    //       date: { $first: '$mergedData.date' },
    //       views: { $sum: { $ifNull: ['$mergedData.views', 0] } },
    //       clicks: { $sum: { $ifNull: ['$mergedData.clicks', 0] } },
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    //   // Generate all dates between startDate and endDate (in days, not ms)
    //   {
    //     $addFields: {
    //       startDay: { $toInt: { $divide: [{ $toLong: startDate }, 86400000] } },
    //       endDay: { $toInt: { $divide: [{ $toLong: endDate }, 86400000] } },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       allDates: {
    //         $range: ['$startDay', { $add: ['$endDay', 1] }, 1], // Increment by 1 day
    //       },
    //     },
    //   },
    //   // Convert each day back to a date string
    //   {
    //     $project: {
    //       allDates: {
    //         $map: {
    //           input: '$allDates',
    //           as: 'day',
    //           in: {
    //             $dateToString: {
    //               format: '%Y-%m-%d',
    //               date: { $toDate: { $multiply: ['$$day', 86400000] } }, // Convert back to milliseconds
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // Left join the generated dates with the actual data
    //   {
    //     $lookup: {
    //       from: 'analytics',
    //       let: { date: '$allDates' },
    //       pipeline: [
    //         {
    //           $match: {
    //             account: account._id,
    //             $expr: {
    //               $and: [
    //                 {
    //                   $eq: [
    //                     {
    //                       $dateToString: {
    //                         format: '%Y-%m-%d',
    //                         date: '$views.viewedAt',
    //                       },
    //                     },
    //                     '$$date',
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $group: {
    //             _id: null,
    //             viewsCount: { $sum: 1 },
    //             clicksCount: { $sum: 1 },
    //           },
    //         },
    //       ],
    //       as: 'dateData',
    //     },
    //   },
    //   // Handle missing values (days with no views or clicks)
    //   {
    //     $addFields: {
    //       views: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.viewsCount', 0] }, 0],
    //       },
    //       clicks: {
    //         $ifNull: [{ $arrayElemAt: ['$dateData.clicksCount', 0] }, 0],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       date: '$allDates',
    //       views: 1,
    //       clicks: 1,
    //     },
    //   },
    //   {
    //     $sort: { date: 1 },
    //   },
    // ];
    const aggregation: PipelineStage[] = [
      // Match the documents for the specified account and date range
      {
        $match: {
          account: account._id,
        },
      },
      // Filter views and clicks within the date range
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
      // Unwind both views and clicks
      {
        $unwind: { path: '$views', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true },
      },
      // Group views and clicks by day
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $ifNull: ['$views.viewedAt', '$clicks.clickedAt'], // Handle nulls for empty arrays
                },
              },
            },
          },
          viewsCount: { $sum: { $cond: ['$views.viewedAt', 1, 0] } },
          clicksCount: { $sum: { $cond: ['$clicks.clickedAt', 1, 0] } },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
      // Create all dates between startDate and endDate
      {
        $addFields: {
          startDay: { $toInt: { $divide: [{ $toLong: startDate }, 86400000] } },
          endDay: { $toInt: { $divide: [{ $toLong: endDate }, 86400000] } },
        },
      },
      {
        $addFields: {
          allDates: {
            $range: ['$startDay', { $add: ['$endDay', 1] }, 1],
          },
        },
      },
      {
        $project: {
          allDates: {
            $map: {
              input: '$allDates',
              as: 'day',
              in: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: { $toDate: { $multiply: ['$$day', 86400000] } },
                },
              },
            },
          },
        },
      },
      // Left join generated dates with actual view and click data
      {
        $lookup: {
          from: 'analytics',
          let: { generatedDate: '$allDates' },
          pipeline: [
            {
              $match: {
                account: account._id,
                $expr: {
                  $and: [
                    {
                      $in: [
                        {
                          $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$views.viewedAt',
                          },
                        },
                        '$$generatedDate',
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'dateData',
        },
      },
      {
        $addFields: {
          views: {
            $ifNull: [{ $arrayElemAt: ['$dateData.viewsCount', 0] }, 0],
          },
          clicks: {
            $ifNull: [{ $arrayElemAt: ['$dateData.clicksCount', 0] }, 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$allDates',
          views: 1,
          clicks: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ];

    const aggregationResult = await Analytics.aggregate(aggregation);

    const new_session_id = nanoid();

    await Session.updateOne(
      { session_id },
      {
        session_id: new_session_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }
    );

    const response = NextResponse.json(aggregationResult);

    response.cookies.set('sid', new_session_id, {
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
// ! 'Failed to optimize pipeline :: caused by :: $range requires a starting value that can be represented as a 32-bit integer, found value: 1726199002274';
// ! PlanExecutor error during aggregation :: caused by :: error while multiplanner was selecting best plan :: caused by :: can't convert from BSON type array to Date;
