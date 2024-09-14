import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Initiate Password Reset',
};

interface Props {
  children: React.ReactNode;
}

const InitiatePasswordResetLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default InitiatePasswordResetLayout;
