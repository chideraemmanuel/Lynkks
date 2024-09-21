import DashboardHeader from '@/containers/dashboard/dashboard-header';
import DashboardSideNavigation from '@/containers/dashboard/dashboard-side-navigation';
import RouteGuard from '@/providers/route-guard';
import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
};

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
        {/* <div className="xl:ml-[min(270px,_30vw)] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-red-300">
          {children}
        </div> */}
        <div className="xl:ml-[min(270px,_30vw)] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-[#fdfdfd]">
          {children}
        </div>
      </RouteGuard>
    </>
  );
};

export default DashboardLayout;
