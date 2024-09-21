import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Setup your account',
};

interface Props {
  children: React.ReactNode;
}

const OnboardingLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default OnboardingLayout;
