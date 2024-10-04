import ViewsUpdateProvider from '@/providers/views-update-provider';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const LynkksUserLayout: FC<Props> = ({ children, params: { username } }) => {
  return (
    <>
      <ViewsUpdateProvider username={username}>{children}</ViewsUpdateProvider>
    </>
  );
};

export default LynkksUserLayout;
