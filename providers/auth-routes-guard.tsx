'use client';

import ErrorComponent from '@/components/error-component';
import FullScreenSpinner from '@/components/full-screen-spinner';
import useSession from '@/hooks/auth/useSession';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const AuthRoutesGuard: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const return_to = searchParams.get('return_to');

  const { data: session, isLoading, error, isError } = useSession();

  useEffect(() => {
    // NAVIGATE TO DASHBOARD IF FETCH IS SUCCESSFUL (A USER IS LOGGED IN)
    // THERE WILL BE NO NEED TO PROGRAMMATICALLY REDIRECT USER AFTER LOGIN (ON LOGIN PAGE) AS THIS EFFECT HAS 'session' AS A DEPENDENCY AND WOULD RE-RUN AS SOON AS A USER LOGS IN, THEREBY CAUSING THIS IF BLOCK TO BE BE ACTIVATED :)
    if (session) {
      console.log('session', session);
      console.log('redirect from auth routes guard');
      router.replace(return_to || '/dashboard', { scroll: false });
    }
  }, [session]);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  if (error?.message === 'Network Error') {
    return <ErrorComponent error={error} />;
  }

  if (
    error?.response?.data?.error === 'Internal Server Error' ||
    error?.response?.status === 500
  ) {
    return <ErrorComponent error={error} />;
  }

  if (
    error &&
    // @ts-ignore
    !(error?.response?.status > 400 && error?.response?.status < 500)
  ) {
    return <ErrorComponent error={error} />;
  }

  console.log('isLoading', isLoading);
  console.log('session', session);
  console.log('isError', isError);
  console.log('error', error);

  // ONLY RENDER AUTH PAGE IF SERVER SENDS BACK ERROR (USER NOT AUTHENTICATED), OTHERWISE, PAGE WILL BE REDIRECTED (FROM USE EFFECT)
  return (
    <>
      {!session &&
        !isLoading &&
        isError &&
        error?.message !== 'Network Error' &&
        error?.response?.data?.error !== 'Internal Server Error' &&
        children}
    </>
    // {children}
  );
};

export default AuthRoutesGuard;
