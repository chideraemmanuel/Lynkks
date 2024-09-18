import ViewsUpdateProvider from '@/providers/views-update-provider';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
  params: { username: string };
}

const LinkNestUserLayout: FC<Props> = ({ children, params: { username } }) => {
  return (
    <>
      <ViewsUpdateProvider username={username}>{children}</ViewsUpdateProvider>
      {/* {children} */}
    </>
  );
};

export default LinkNestUserLayout;
