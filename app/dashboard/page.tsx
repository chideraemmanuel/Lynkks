import { FC } from 'react';

interface Props {}

const DashboardLinksPage: FC<Props> = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col">
        <span>Dashboard Links!</span>
      </div>
    </>
  );
};

export default DashboardLinksPage;
