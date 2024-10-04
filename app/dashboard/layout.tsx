import DashboardHeader from '@/containers/dashboard/dashboard-header';
import DashboardSideNavigation from '@/containers/dashboard/dashboard-side-navigation';
import RouteGuard from '@/providers/route-guard';
import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s - Lynkks',
  },
};

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <>
      <RouteGuard>
        <DashboardSideNavigation />
        <DashboardHeader />
        <div className="xl:ml-[min(270px,_30vw)] min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] bg-[#fdfdfd]">
          {children}
        </div>
      </RouteGuard>
    </>
  );
};

export default DashboardLayout;
