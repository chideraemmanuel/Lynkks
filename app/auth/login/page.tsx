'use client';

import FormInput from '@/components/form-input';
import FullScreenSpinner from '@/components/full-screen-spinner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { emailRegex } from '@/constants';
import { RiGoogleLine } from '@remixicon/react';
import { FcGoogle } from 'react-icons/fc';
// import useLogin from '@/hooks/auth/useLogin';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {}

interface LoginFormTypes {
  email: string;
  password: string;
}

const LoginPage: FC<Props> = () => {
  // const { mutate: login, isLoading: isLoggingIn } = useLogin();
  const form = useForm<LoginFormTypes>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<LoginFormTypes> = (data, e) => {
    console.log('data: ', data);

    // login(data);
  };

  return (
    <>
      <div className="bg-white">
        <div className="pb-6 text-center">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Welcome back!
          </h1>
          <p className="w-[90%] mx-auto text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Fill in your details to login.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-12 flex flex-col gap-6">
            <FormInput
              label="Email address"
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
              // disabled={isLoggingIn}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Please enter your password',
                },
              })}
              error={errors.password?.message}
              // disabled={isLoggingIn}
              addForgotPassword
              passwordResetInitiationHref="/auth/reset-password/initiate"
            />
          </div>

          <div className="flex flex-col gap-5">
            <Button
              className="w-full h-12"
              // disabled={isLoggingIn}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Login
            </Button>

            <Separator />

            <Button type="button" variant={'outline'} className="w-full">
              <FcGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
        </form>

        <div className="pt-5 text-center">
          <p className="text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

const FormBreak: FC = () => {
  return (
    <div className="relative w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="bg-border h-[1px]"></div>
      <span className="text-muted-foreground">or</span>
      <div className="bg-border h-[1px]"></div>
    </div>
  );
};
