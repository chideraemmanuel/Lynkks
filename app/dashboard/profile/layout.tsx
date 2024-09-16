import DashboardHeader from '@/containers/dashboard/dashboard-header';
import DashboardSideNavigation from '@/containers/dashboard/dashboard-side-navigation';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProfileLayout: FC<Props> = ({ children }) => {
  return (
    <>
      {/* sidenav and header */}
      {/* <DashboardSideNavigation />
      <DashboardHeader />
      <div className="lg:ml-[min(270px,_30vw)]">{children}</div> */}
      {children}
    </>
  );
};

export default ProfileLayout;
