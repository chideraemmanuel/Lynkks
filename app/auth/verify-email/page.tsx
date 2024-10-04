'use client';

import FullScreenSpinner from '@/components/full-screen-spinner';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { RiArrowLeftLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import OTPInput from '@/components/otp-input';
import ErrorComponent from '@/components/error-component';
import useVerifyEmail from '@/hooks/auth/useVerifyEmail';
import useResendVerificationOTP from '@/hooks/auth/useResendVeificationOTP';
import useLogout from '@/hooks/auth/useLogout';
import useAccount from '@/hooks/useAccount';

interface Props {}

const EmailVerificationPage: FC<Props> = () => {
  const [OTP, setOTP] = useState('');

  const router = useRouter();

  const { mutate: verifyEmail, isLoading: isVerifyingEmail } = useVerifyEmail();
  const {
    mutate: resendVerificationOTP,
    isLoading: isResendingVerificationOTP,
  } = useResendVerificationOTP();

  const {
    data: account,
    isLoading: isFetchingSession,
    isSuccess,
    isError,
    error,
  } = useAccount();

  const {
    mutate: logout,
    isLoading: isLoggingOut,
    isSuccess: isSuccessLoggingOut,
  } = useLogout();

  useEffect(() => {
    if (account && account.email_verified) {
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

  return (
    <>
      {isResendingVerificationOTP && <FullScreenSpinner />}

      {!isFetchingSession && account && !account.email_verified && (
        <div className="bg-white">
          <button
            // onClick={() => router.back()}
            onClick={() => logout()}
            className="p-4 rounded-full bg-secondary text-secondary-foreground mb-9 md:mb-6"
          >
            <RiArrowLeftLine />
          </button>

          <div className="pb-6 flex flex-col gap-1 text-start">
            <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
              Email Confirmation
            </h1>

            <p className="text-[#475267] text-lg leading-[140%] tracking-[-0.44%]">
              A 6-digit confirmation code was sent to your email address,{' '}
              <span className="text-[#121212] font-bold">{account.email}</span>.
              Please enter below.
            </p>
          </div>

          <div className="pb-12">
            <OTPInput onOTPChange={(otp) => setOTP(otp)} />
          </div>

          <Button
            className="w-full h-12"
            disabled={isVerifyingEmail || OTP.length < 6}
            onClick={() => verifyEmail({ email: account.email, OTP: OTP })}
          >
            {isVerifyingEmail && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify
          </Button>

          <div className="pt-5 text-center">
            <p className="text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
              {/* TODO: add expiration timer..? */}
              {/* OTP will expire in 1:00. Didn't receive mail?{' '} */}
              Didn't receive mail?{' '}
              <button
                className="text-primary underline disabled:pointer-events-none disabled:opacity-50"
                disabled={isResendingVerificationOTP}
                onClick={() => resendVerificationOTP(account.email)}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerificationPage;
