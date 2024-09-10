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
// import useGetTotals from '@/hooks/useGetTotals';
import FullScreenSpinner from '@/components/full-screen-spinner';
// import useGetTops from '@/hooks/useGetTops';
// import useGetViews from '@/hooks/useGetViews';
// import GlobalNetworkError from '@/components/network-error/GlobalNetworkError';
// import GlobalServerError from '@/components/server-error/GlobalServerError';
// import GlobalError from '@/components/error/GlobalError';
import SelectInput from '@/components/select-input';
import { RiCalendar2Line } from '@remixicon/react';

interface Props {}

type Range = '7d' | '30d' | '60d' | '90d';

const BlogAnalyticsPage: FC<Props> = () => {
  const [chartRange, setChartRange] = useState<Range>('7d');

  // const {
  //   data: totals,
  //   isLoading: isFetchingTotals,
  //   isError: isErrorFetchingTotals,
  //   error: totalsFetchError,
  // } = useGetTotals();

  // const {
  //   data: tops,
  //   isLoading: isFetchingTops,
  //   isError: isErrorFetchingTops,
  //   error: topsFetchError,
  // } = useGetTops();

  // const error = totalsFetchError || topsFetchError;

  // // @ts-ignore
  // if (error?.message === 'Network Error') {
  //   return <GlobalNetworkError />;
  // }

  // if (
  //   // @ts-ignore
  //   error?.response?.data?.error === 'Internal Server Error' ||
  //   // @ts-ignore
  //   error?.response?.status === 500
  // ) {
  //   return <GlobalServerError />;
  // }

  // if (error) {
  //   // @ts-ignore
  //   return <GlobalError message={error?.message} />;
  // }

  return (
    <>
      {/* {(isFetchingTotals || isFetchingTops) && <FullScreenSpinner />} */}

      <div className={`flex flex-col min-h-screen`}>
        {/* <main className="flex-1 px-4 md:container mx-auto pt-6 pb-20"> */}
        <main className="flex-1">
          <div className="px-4 md:container mx-auto pt-6 pb-20 flex flex-col gap-9">
            {/* header */}
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-base leading-[140%] tracking-[0%] text-[#667085]">
                  Hello Chidera,
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
                  // disabled={isCreatingUser}
                  defautlValue={'7d'}
                  onItemSelect={(value) => {
                    console.log('selected role value:', value);
                    setChartRange(value as Range);
                  }}
                />
              </div>
            </div>

            {/* stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
              {/* {totals && ( */}
              <>
                <StatCard
                // title={'Total views'}
                // allTimeTotal={totals?.views.total_views}
                // todayTotal={totals?.views.today_views}
                />

                <StatCard
                // title={'Total subscribers'}
                // allTimeTotal={totals?.subscribers.total_subscribers}
                // todayTotal={totals?.subscribers.today_subscribers}
                />

                <StatCard
                // title={'Total posts'}
                // allTimeTotal={totals?.posts.total_posts}
                // todayTotal={totals?.posts.today_posts}
                />
              </>
              {/* )} */}
            </div>
            {/* overview graph */}
            {/* <div className="h-[500px] border"></div> */}
            <AnalyticsChart range={chartRange} />
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogAnalyticsPage;

// const chartData = [
//   { month: 'January', desktop: 186 },
//   { month: 'February', desktop: 305 },
//   { month: 'March', desktop: 237 },
//   { month: 'April', desktop: 73 },
//   { month: 'May', desktop: 209 },
//   { month: 'June', desktop: 214 },
// ];

// const chartConfig = {
//   desktop: {
//     label: 'Desktop',
//     color: 'hsl(var(--chart-1))',
//   },
// } satisfies ChartConfig;

interface ChartProps {
  // chart_data: any[];
  // chart_config: ChartConfig;
  range: Range;
}

const AnalyticsChart: FC<ChartProps> = ({ range }) => {
  // const {
  //   data: views,
  //   isLoading: isFetchingViews,
  //   isError: isErrorFetchingViews,
  //   error: viewsFetchError,
  // } = useGetViews(range);

  const chart_config = {
    views: {
      label: 'Views',
      color: 'var(--primary)',
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
          // data={views}
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
            // tickFormatter={(value) => value.slice(0, 3)}
            // tickFormatter={(value) => value.slice(0, 3)} // TODO: use moment to format date return..? 2024-08-03
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="views"
            type="natural"
            // fill="var(--color-views)"
            fill="#5747c7"
            fillOpacity={0.4}
            // stroke="var(--color-views)"
            stroke="#5747c7"
          />
        </AreaChart>
      </ChartContainer>

      <div>{/* <span>Date range goes here..?</span> */}</div>
    </>
  );
};
