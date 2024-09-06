'use client';

import FormInput from '@/components/form-input';
import FullScreenSpinner from '@/components/full-screen-spinner';
import { emailRegex } from '@/constants';
// import useInitiatePasswordReset from '@/hooks/auth/useInitiatePasswordReset';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon';
import { RiArrowLeftLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import OTPInput from '@/components/otp-input';

interface Props {}

const EmailVerificationPage: FC<Props> = () => {
  const router = useRouter();

  // const {
  //   mutate: initiatePasswordReset,
  //   isLoading: isInitiatingPasswordReset,
  // } = useInitiatePasswordReset();

  const form = useForm<{ email: string }>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<{ email: string }> = (data, e) => {
    console.log('data: ', data);

    // initiatePasswordReset(data.email);
  };

  return (
    <>
      {/* {isInitiatingPasswordReset && <FullScreenSpinner />} */}

      <div className="bg-white">
        {/* <span>Back Button</span> */}
        <button
          onClick={() => router.back()}
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
            <span className="text-[#121212] font-bold">test@test.com</span>.
            Please enter below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-12">
            <OTPInput onOTPChange={(otp) => {}} />
          </div>

          <Button className="w-full h-12">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verify
          </Button>

          <div className="pt-5 text-center">
            <p className="text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
              {/* OTP will expire in 1:00. Didn't receive mail?{' '} */}
              Didn't receive mail?{' '}
              <button className="text-primary underline">Resend</button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default EmailVerificationPage;
