import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Analytics',
};

interface Props {
  children: React.ReactNode;
}

const AnalyticsLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default AnalyticsLayout;
