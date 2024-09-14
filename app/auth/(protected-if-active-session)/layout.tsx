import AuthRoutesGuard from '@/providers/auth-routes-guard';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedIfActiveSession: FC<Props> = ({ children }) => {
  return (
    <>
      <AuthRoutesGuard>{children}</AuthRoutesGuard>
    </>
  );
};

export default ProtectedIfActiveSession;
