'use client';

import FormInput from '@/components/form-input';
import FullScreenSpinner from '@/components/full-screen-spinner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { emailRegex, passwordRegex } from '@/constants';
// import useRegistration from '@/hooks/auth/useRegistration';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';

interface Props {}

interface RegistrationFormTypes {
  email: string;
  password: string;
  confirm_password: string;
}

const RegistrationPage: FC<Props> = () => {
  // const { mutate: registration, isLoading: isLoggingIn } = useRegister();
  const form = useForm<RegistrationFormTypes>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = form;

  const onSubmit: SubmitHandler<RegistrationFormTypes> = (data, e) => {
    console.log('data: ', data);

    // register(data);
  };

  return (
    <>
      <div className="bg-white">
        <div className="pb-6 text-center">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Create an account
          </h1>
          <p className="w-[90%] mx-auto text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Supply the required details to create an account for free!
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
              id="password"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Please enter a password',
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    'Password must be 8-16 characters long, and contain at least one numeric digit, and special character',
                },
              })}
              error={errors.password?.message}
              // disabled={isLoggingIn}
            />

            <FormInput
              label="Confirm password"
              type="password"
              error={errors.confirm_password?.message}
              placeholder="Confirm password"
              id="confirm_password"
              {...register('confirm_password', {
                required: {
                  value: true,
                  message: 'Please confirm your password',
                },
                validate: (fieldValue) => {
                  return (
                    fieldValue === getValues('password') ||
                    'Passwords do not match'
                  );
                },
              })}
              // disabled={isLoggingIn}
            />
          </div>

          <div className="flex flex-col gap-5">
            <Button
              className="w-full h-12"
              // disabled={isLoggingIn}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sign up
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
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
