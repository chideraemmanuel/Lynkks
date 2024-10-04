import { IPAddressV4Regex, URLRegex } from '@/constants';
import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import Analytics, { AnalyticsInterface } from '@/models/analytics';
import axios from 'axios';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  username: z.string(),
  visitor_id: z.string().min(1),
  link_id: z
    .string()
    .refine((value) => mongoose.isValidObjectId(value) || 'Invalid Link ID'),
  link_section: z.enum(['custom_links', 'social_links']),
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

  const {
    username,
    visitor_id,
    referrer,
    referrer_full_url,
    ip_address,
    link_id,
    link_section,
  } = data;

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
        clicks: [
          {
            visitor_id,
            link: {
              link_id,
              link_section,
            },
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
          clicks: {
            visitor_id,
            link: {
              link_id,
              link_section,
            },
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
