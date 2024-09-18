'use client';

import StatCard from '@/components/stat-card';
import { cn } from '@/lib/utils';
import { ChevronRight, Flag } from 'lucide-react';
import { FC, useState } from 'react';
import usaFlag from '@/assets/usa-flag.svg';
import Image from 'next/image';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import FullScreenSpinner from '@/components/full-screen-spinner';
import SelectInput from '@/components/select-input';
import { RiCalendar2Line } from '@remixicon/react';
import useAnalytics from '@/hooks/analytics/useAnalytics';
import { Range } from '@/app/api/analytics/route';
import useAnalyticsTotal from '@/hooks/analytics/useAnalyticsTotal';
import ErrorComponent from '@/components/error-component';
import useAccount from '@/hooks/useAccount';

interface Props {}

const BlogAnalyticsPage: FC<Props> = () => {
  const [chartRange, setChartRange] = useState<Range>('7d');

  const { data: account, isLoading: isFetchingAccount } = useAccount();

  const {
    data: analyticsTotal,
    isLoading: isFetchingAnalyticsTotal,
    isError: isErrorFetchingAnalyticsTotal,
    error: analyticsTotalFetchError,
  } = useAnalyticsTotal();

  if (isFetchingAccount || isFetchingAnalyticsTotal) {
    return <FullScreenSpinner />;
  }

  if (analyticsTotalFetchError?.message === 'Network Error') {
    return <ErrorComponent error={analyticsTotalFetchError} />;
  }

  if (
    analyticsTotalFetchError?.response?.data?.error ===
      'Internal Server Error' ||
    analyticsTotalFetchError?.response?.status === 500
  ) {
    return <ErrorComponent error={analyticsTotalFetchError} />;
  }

  if (analyticsTotalFetchError) {
    return <ErrorComponent error={analyticsTotalFetchError} />;
  }

  return (
    <>
      {/* {isFetchingAnalyticsTotal && <FullScreenSpinner />} */}

      {!isFetchingAccount &&
        account &&
        !isFetchingAnalyticsTotal &&
        analyticsTotal && (
          <div className={`flex flex-col min-h-screen`}>
            {/* <main className="flex-1 px-4 md:container mx-auto pt-6 pb-20"> */}
            <main className="flex-1">
              <div className="px-4 md:container mx-auto pt-6 pb-20 flex flex-col gap-9">
                {/* header */}
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-base leading-[140%] tracking-[0%] text-[#667085]">
                      {/* Hello Chidera, */}
                      Hello {account.first_name},
                    </span>

                    <h1 className="font-AeonikProBold font-bold text-2xl leading-[140%] tracking-[0%]">
                      Your Stats
                    </h1>
                  </div>

                  <div>
                    <SelectInput
                      icon={<RiCalendar2Line className="mr-1 w-4 h-4" />}
                      placeholder="Filter"
                      selectInputItems={[
                        { id: '7d', name: 'Last 7 days', value: '7d' },
                        { id: '30d', name: 'Last 30 days', value: '30d' },
                        { id: '60d', name: 'Last 60 days', value: '60d' },
                        { id: '90d', name: 'Last 90 days', value: '90d' },
                      ]}
                      selectInputItemProps={{ className: 'capitalize' }}
                      selectInputTriggerProps={{
                        className: 'capitalize bg-white p-4 text-sm',
                      }}
                      // disabled={isFetchingAnalyticsTotal}
                      defautlValue={'7d'}
                      onItemSelect={(value) => {
                        console.log('selected role value:', value);
                        setChartRange(value as Range);
                      }}
                    />
                  </div>
                </div>

                {/* stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  {analyticsTotal && (
                    <>
                      <StatCard
                        title={'Total views'}
                        all_time_total={analyticsTotal.views.total}
                        today_total={analyticsTotal.views.today}
                      />

                      <StatCard
                        title={'Total clicks'}
                        all_time_total={analyticsTotal.clicks.total}
                        today_total={analyticsTotal.clicks.today}
                      />
                    </>
                  )}
                </div>
                {/* <div className="h-[500px] border"></div> */}
                <AnalyticsChart range={chartRange} />
              </div>
            </main>
          </div>
        )}
    </>
  );
};

export default BlogAnalyticsPage;

interface ChartProps {
  range: Range;
}

const AnalyticsChart: FC<ChartProps> = ({ range }) => {
  const {
    data: analytics,
    isLoading: isFetchingAnalytics,
    isError: isErrorFetchingAnalytics,
    error: analyticsFetchError,
  } = useAnalytics(range);

  const chart_config = {
    views: {
      label: 'Views',
      color: 'hsl(var(--chart-1))',
    },
    clicks: {
      label: 'Clicks',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  // if (isFetchingViews) {
  //   console.log('fetching views...');
  // }

  return (
    <>
      <ChartContainer
        config={chart_config}
        className="min-h-[200px] max-h-[80vh] w-full"
      >
        <AreaChart
          accessibilityLayer
          data={analytics}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value.slice(0, 3)} // TODO: use moment to format date return..? 2024-08-03
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="views"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="clicks"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>

      <div>{/* <span>Date range goes here..?</span> */}</div>
    </>
  );
};
