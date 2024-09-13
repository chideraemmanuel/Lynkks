import mongoose, { model, models, Schema } from 'mongoose';

export interface AnalyticsInterface {
  views: {
    viewer_id: string;
    referrer: string;
    referrer_full_url: string;
    ip_address: string;
    continent: string;
    continent_code: string;
    country: string;
    country_code: string;
    region: string;
    region_name: string;
    city: string;
    district: string;
    zip: string;
    lat: string | number;
    lon: string | number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
  };
  clicks: {};
}

const analyticsSchema = new Schema(
  {
    views: {
      type: [
        {
          viewer_id: {
            type: String,
            required: true,
          },
          referrer: {
            type: String,
            default: '',
          },
          referrer_full_url: {
            type: String,
            default: '',
          },
          ip_address: {
            type: String,
          },
          continent: {
            type: String,
            default: '',
          },
          continent_code: {
            type: String,
            default: '',
          },
          country: {
            type: String,
            default: '',
          },
          country_code: {
            type: String,
            default: '',
          },
          region: {
            type: String,
            default: '',
          },
          region_name: {
            type: String,
            default: '',
          },
          city: {
            type: String,
            default: '',
          },
          district: {
            type: String,
            default: '',
          },
          zip: {
            type: String,
            default: '',
          },
          lat: {
            type: String || Number,
            default: '',
          },
          lon: {
            type: String || Number,
            default: '',
          },
          timezone: {
            type: String,
            default: '',
          },
          isp: {
            type: String,
            default: '',
          },
          org: {
            type: String,
            default: '',
          },
          as: {
            type: String,
            default: '',
          },
        },
      ],
      default: [],
    },
    clicks: {}, // TODO: add schema for clicks
  },
  { timestamps: true }
);

const Analytics = models.Analytics || model('Analytics', analyticsSchema);

export default Analytics;

/* -------------------------------------------------------------------------- */
/*                             IP-API RETURN SAMPLE                            */
/* -------------------------------------------------------------------------- */
// {
//     "query": "197.210.84.53",
//     "status": "success",
//     "continent": "Africa",
//     "continentCode": "AF",
//     "country": "Nigeria",
//     "countryCode": "NG",
//     "region": "RI",
//     "regionName": "Rivers State",
//     "city": "Port Harcourt",
//     "district": "",
//     "zip": "",
//     "lat": 4.7731,
//     "lon": 7.0085,
//     "timezone": "Africa/Lagos",
//     "offset": 3600,
//     "currency": "NGN",
//     "isp": "MTN NIGERIA",
//     "org": "",
//     "as": "AS29465 MTN NIGERIA Communication limited",
//     "asname": "VCG-AS",
//     "mobile": true,
//     "proxy": false,
//     "hosting": true
// }
