'use client';

import FormInput from '@/components/form-input';
import GoogleSignInButton from '@/components/google-sign-in-button';
import { Button } from '@/components/ui/button';
import { emailRegex, passwordRegex } from '@/constants';
import { useSelectedUsernameContext } from '@/contexts/selected-username-context';
import useRegister from '@/hooks/auth/useRegister';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {}

interface RegistrationFormTypes {
  email: string;
  password: string;
  confirm_password: string;
}

const RegistrationPage: FC<Props> = () => {
  const { selectedUsername, setSelectedUsername } =
    useSelectedUsernameContext();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const error = params.get('error');

  // ! check for username from context
  useEffect(() => {
    if (selectedUsername === '') {
      router.replace('/auth/username-select');
    }
  }, [selectedUsername]);

  // ! handle errors; most likely from google redirect
  // authentication_failed;
  // account_exists;
  // invalid_username;
  // username_taken;
  // server_error;
  useEffect(() => {
    if (error) {
      if (error === 'authentication_failed') {
        toast.error('Authentication failed');
      }

      if (error === 'account_exists') {
        toast.error('Email is already in use. Login with password instead.');
      }

      if (error === 'invalid_username') {
        toast.error('Invalid username');
      }

      if (error === 'username_taken') {
        toast.error('Username is already taken');
      }

      if (error === 'server_error') {
        toast.error('Internal Server Error');
      }

      router.replace(pathname);
    }
  }, []);

  const { mutate: createAccount, isLoading: isCreatingAccount } = useRegister();

  const form = useForm<RegistrationFormTypes>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = form;

  const onSubmit: SubmitHandler<RegistrationFormTypes> = (data, e) => {
    createAccount({
      ...data,
      username: selectedUsername,
    });
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
              disabled={isCreatingAccount}
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
              disabled={isCreatingAccount}
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
              disabled={isCreatingAccount}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button className="w-full h-12" disabled={isCreatingAccount}>
              {isCreatingAccount && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign up
            </Button>

            <FormBreak />

            <GoogleSignInButton disabled={isCreatingAccount} />
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

const FormBreak: FC = () => {
  return (
    <div className="relative w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="bg-border h-[1px]"></div>
      <span className="text-muted-foreground">or</span>
      <div className="bg-border h-[1px]"></div>
    </div>
  );
};
