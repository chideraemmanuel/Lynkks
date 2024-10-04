import { IPAddressV4Regex, URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics, { AnalyticsInterface } from '@/models/analytics';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
// export const GET = (request: NextRequest) => {
//   const ip = request.headers.get('x-forwarded-for');
//   const ip2 = request.ip;
//   const city = request.geo?.city;
//   const country = request.geo?.country;
//   const region = request.geo?.region;
//   const latitude = request.geo?.latitude;
//   const longitude = request.geo?.longitude;

//   return NextResponse.json({
//     ip,
//     ip2,
//     city,
//     country,
//     region,
//     latitude,
//     longitude,
//   });
// };

// viewer_id, referrer, referrer_full_url, ip_address;

const BodySchema = z.object({
  //   username: z.string().min(3).max(15),
  username: z.string(),
  visitor_id: z.string().min(1),
  referrer: z
    .string()
    .refine((value) => URLRegex.test(value) || 'Invalid URL')
    .optional(),
  referrer_full_url: z
    .string()
    .refine((value) => URLRegex.test(value) || 'Invalid URL')
    .optional(),
  ip_address: z
    .string()
    .refine((value) => IPAddressV4Regex.test(value) || 'Invalid IP Address'),
});

export const PUT = async (request: NextRequest) => {
  const body = await request.json();

  const { success, data } = BodySchema.safeParse(body);

  if (!success) {
    return NextResponse.json(
      { error: 'Missing or Invalid body data' },
      { status: 400 }
    );
  }

  const { username, visitor_id, referrer, referrer_full_url, ip_address } =
    data;

  try {
    await connectToDatabase();

    const account = await Account.findOne<AccountInterface>({ username });

    if (!account) {
      return NextResponse.json(
        { error: 'No account with the supplied username' },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `http://ip-api.com/json/${ip_address}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,query`
    );

    const {
      continent,
      continentCode,
      country,
      countryCode,
      region,
      regionName,
      city,
      district,
      zip,
      lat,
      lon,
      timezone,
      isp,
      org,
      as,
    } = response.data;

    const analyticsRecordExists = await Analytics.findOne<AnalyticsInterface>({
      account: account._id,
    });

    if (!analyticsRecordExists) {
      // create new analytics record
      const newAnalyticsRecord = await Analytics.create({
        account: account._id,
        views: [
          {
            visitor_id,
            referrer: referrer || '',
            referrer_full_url: referrer_full_url || '',
            ip_address,
            continent,
            continent_code: continentCode,
            country,
            country_code: countryCode,
            region,
            region_name: regionName,
            city,
            district,
            zip,
            lat,
            lon,
            timezone,
            isp,
            org,
            as,
          },
        ],
        // clicks will default to an empty array
      });

      return NextResponse.json(
        { message: 'Analytics updated successfully' },
        { status: 201 }
      );
    }

    // update existing analytics record
    const updatedAnalyticsRecord = await Analytics.findOneAndUpdate(
      { account: account._id },
      {
        $push: {
          views: {
            visitor_id,
            referrer: referrer || '',
            referrer_full_url: referrer_full_url || '',
            ip_address,
            continent,
            continent_code: continentCode,
            country,
            country_code: countryCode,
            region,
            region_name: regionName,
            city,
            district,
            zip,
            lat,
            lon,
            timezone,
            isp,
            org,
            as,
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Analytics updated successfully' });
  } catch (error: any) {
    console.log('[ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
