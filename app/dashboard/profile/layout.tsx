import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProfileLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default ProfileLayout;
