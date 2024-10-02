import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Authenticating...',
};

interface Props {
  children: React.ReactNode;
}

const GoogleLoginLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default GoogleLoginLayout;
