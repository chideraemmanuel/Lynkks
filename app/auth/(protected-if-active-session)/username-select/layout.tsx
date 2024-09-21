import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Select a username',
};

interface Props {
  children: React.ReactNode;
}

const UsernameSelectionLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default UsernameSelectionLayout;
