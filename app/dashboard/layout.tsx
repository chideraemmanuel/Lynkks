import DashboardHeader from '@/containers/dashboard-header';
import DashboardSideNavigation from '@/containers/dashboard-side-navigation';
import RouteGuard from '@/providers/route-guard';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <RouteGuard>
        {/* sidenav and header */}
        <DashboardSideNavigation />
        <DashboardHeader />
        {/* <div className="xl:ml-[min(270px,_30vw)] bg-red-300">{children}</div> */}
        <div className="xl:ml-[min(270px,_30vw)] bg-[#fdfdfd]">{children}</div>
      </RouteGuard>
    </>
  );
};

export default DashboardLayout;
