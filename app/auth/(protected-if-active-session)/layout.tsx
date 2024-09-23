import SelectedUsernameContextProvider from '@/contexts/selected-username-context';
import AuthRoutesGuard from '@/providers/auth-routes-guard';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedIfActiveSession: FC<Props> = ({ children }) => {
  return (
    <>
      <SelectedUsernameContextProvider>
        <AuthRoutesGuard>{children}</AuthRoutesGuard>
      </SelectedUsernameContextProvider>
    </>
  );
};

export default ProtectedIfActiveSession;
