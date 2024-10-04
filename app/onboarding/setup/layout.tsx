'use client';

import ErrorComponent from '@/components/error-component';
import FullScreenSpinner from '@/components/full-screen-spinner';
import Logo from '@/components/logo';
import OnboardingContextProvider from '@/contexts/onboarding-setup-context';
import useAccount from '@/hooks/useAccount';
import { useRouter } from 'next/navigation';
import { FC, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const OnboardingSetupLayout: FC<Props> = ({ children }) => {
  const router = useRouter();

  const {
    data: account,
    isLoading: isFetchingSession,
    isSuccess,
    isError,
    error,
  } = useAccount();

  useEffect(() => {
    if (account && account.completed_onboarding) {
      router.replace('/dashboard');
    }

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
  }, [error, account]);

  if (isFetchingSession) {
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

  return (
    <>
      {!isFetchingSession && account && !account.completed_onboarding && (
        <OnboardingContextProvider>
          <div className="bg-white">
            <div className="px-4 md:container mx-auto relative flex items-center justify-center min-h-screen">
              <div className="absolute top-8 left-4 md:left-8">
                <Logo />
              </div>

              <div className="w-[min(800px,_100%)] py-28">{children}</div>
            </div>
          </div>
        </OnboardingContextProvider>
      )}
    </>
  );
};

export default OnboardingSetupLayout;
