import { FC } from 'react';

interface Props {
  // title: string;
  // allTimeTotal: number;
  // todayTotal: number;
}

// const StatCard: FC<Props> = ({ title, allTimeTotal, todayTotal }) => {
const StatCard: FC<Props> = () => {
  return (
    <>
      <div className="px-6 md:px-4 py-4 bg-white border shadow-sm rounded-[16px] flex flex-col">
        <span className="inline-block pb-2 text-[#98A1B3] text-base font-AeonikProMedium font-medium leading-[150%] tracking-[0%]">
          {/* {title} */}
          Total views
        </span>

        <span className="text-black font-AeonikProBold font-bold text-2xl leading-[140%] tracking-[0%]">
          {/* {allTimeTotal} */}0
        </span>

        <span className="text-[#27AE60] text-sm leading-[140%] tracking-[0%]">
          {/* +{todayTotal} today */}
          +0 today
        </span>
      </div>
    </>
  );
};

export default StatCard;
