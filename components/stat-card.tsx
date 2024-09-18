import { FC } from 'react';

interface Props {
  title: string;
  all_time_total: number;
  today_total: number;
}

const StatCard: FC<Props> = ({ title, all_time_total, today_total }) => {
  return (
    <>
      <div className="px-6 md:px-4 py-4 bg-white border shadow-sm rounded-[16px] flex flex-col">
        <span className="inline-block pb-2 text-[#98A1B3] text-base font-AeonikProMedium font-medium leading-[150%] tracking-[0%]">
          {title}
          {/* Total views */}
        </span>

        <span className="text-black font-AeonikProBold font-bold text-2xl leading-[140%] tracking-[0%]">
          {all_time_total}
        </span>

        <span className="text-[#27AE60] text-sm leading-[140%] tracking-[0%]">
          +{today_total} today
        </span>
      </div>
    </>
  );
};

export default StatCard;
