'use client';

import FormInput from '@/components/form-input';
import { emailRegex } from '@/constants';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { RiArrowLeftLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import usePasswordReset from '@/hooks/auth/usePasswordReset';

interface Props {}

const PasswordResetInitiationPage: FC<Props> = () => {
  const router = useRouter();

  const { initiatePasswordReset, isInitiatingPasswordReset } =
    usePasswordReset();

  const form = useForm<{ email: string }>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<{ email: string }> = (data, e) => {
    initiatePasswordReset({ email: data.email });
  };

  return (
    <>
      <div className="bg-white">
        <button
          onClick={() => router.back()}
          className="p-4 rounded-full bg-secondary text-secondary-foreground mb-9 md:mb-6"
        >
          <RiArrowLeftLine />
        </button>

        <div className="pb-6 flex flex-col gap-1 text-start">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Reset Password
          </h1>

          <p className="text-[#475267] text-lg leading-[140%] tracking-[-0.44%]">
            We will send you a link to reset a password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-12">
            <FormInput
              label="Email address"
              id="email"
              placeholder="Enter your email address"
              {...register('email', {
                required: {
                  value: true,
                  message: 'Please enter your email address',
                },
                pattern: {
                  value: emailRegex,
                  message: 'Invalid email format',
                },
              })}
              error={errors.email?.message}
              disabled={isInitiatingPasswordReset}
            />
          </div>

          <Button className="w-full h-12" disabled={isInitiatingPasswordReset}>
            {isInitiatingPasswordReset && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send mail
          </Button>
        </form>
      </div>
    </>
  );
};

export default PasswordResetInitiationPage;
