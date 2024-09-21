import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Login to your account',
};

interface Props {
  children: React.ReactNode;
}

const LoginLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default LoginLayout;
