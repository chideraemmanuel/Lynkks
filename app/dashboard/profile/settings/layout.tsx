import { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

interface Props {
  children: React.ReactNode;
}

const ProfileSettingsLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default ProfileSettingsLayout;
