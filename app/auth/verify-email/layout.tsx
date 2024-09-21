import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Verify Email Address',
};

interface Props {
  children: React.ReactNode;
}

const EmailVerificationLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default EmailVerificationLayout;
