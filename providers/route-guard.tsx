'use client';

import ErrorComponent from '@/components/error-component';
import useAccount from '@/hooks/useAccount';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const RouteGuard: FC<Props> = ({ children }) => {
  const router = useRouter();

  const { data: account, isLoading, isSuccess, isError, error } = useAccount();

  useEffect(() => {
    // NAVIGATE TO LOGIN PAGE IF SERVER SENDS BACK AN ERROR (USER NOT AUTHENTICATED)
    if (
      error &&
      // @ts-ignore
      error?.response?.status > 400 &&
      // @ts-ignore
      error?.response?.status < 500
    ) {
      // router.replace(`/auth/login?return_to=${pathname}`);
      router.replace(`/auth/login`);
    }

    if (account && !account?.email_verified) {
      router.replace('/auth/verify-email');
    }

    if (account && account.email_verified && !account.completed_onboarding) {
      router.replace('/onboarding/setup');
    }
  }, [error, account]);

  if (error?.message === 'Network Error') {
    console.log('network error');
    return <ErrorComponent error={error} />;
  }

  if (
    error?.response?.data?.error === 'Internal Server Error' ||
    error?.response?.status === 500
  ) {
    console.log('server error');
    return <ErrorComponent error={error} />;
  }

  if (
    error &&
    // @ts-ignore
    !(error?.response?.status > 400 && error?.response?.status < 500)
  ) {
    return <ErrorComponent error={error} />;
  }

  // RENDER CHILDREN ONLY WHEN FETCH IS SUCCESSFUL
  return (
    <>
      {isSuccess &&
        !isLoading &&
        account &&
        account.email_verified &&
        account.completed_onboarding &&
        children}
    </>
  );
  // return <>{children}</>;
};

export default RouteGuard;
