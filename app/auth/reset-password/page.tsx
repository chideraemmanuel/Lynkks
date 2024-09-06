'use client';

import FormInput from '@/components/form-input';
import FullScreenSpinner from '@/components/full-screen-spinner';
import { Button } from '@/components/ui/button';
import { passwordRegex } from '@/constants';
// import useCompletePasswordReset from '@/hooks/auth/useCompletePasswordReset';
import { cn } from '@/lib/utils';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
// import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon';
import { RiArrowLeftLine } from '@remixicon/react';
import { Loader2 } from 'lucide-react';

interface Props {}

type Requirement =
  | 'Min. 8 characters'
  | 'Capital'
  | 'Lowercase'
  | 'Number'
  | 'Symbol';

const passwordRequirements = [
  'Min. 8 characters',
  'Capital',
  'Lowercase',
  'Number',
  'Symbol',
];

interface PasswordResetFormTypes {
  password: string;
  confirm_password: string;
}

const PasswordResetPage: FC<Props> = () => {
  const searchParams = useSearchParams();

  const router = useRouter();

  // const email = searchParams.get('reset_string');
  // const reset_string = searchParams.get('reset_string');

  // if (!email || !reset_string) {
  //   notFound();
  // }

  // const { mutate: resetPassword, isLoading: isResettingPassword } =
  //   useCompletePasswordReset();

  const form = useForm<PasswordResetFormTypes>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
  } = form;

  const onSubmit: SubmitHandler<PasswordResetFormTypes> = (data, e) => {
    console.log('data: ', data);

    // resetPassword({ email, reset_string, new_password: data.password });
  };

  // const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*\W)(?!.* ).{8,16}$/;

  const watchedValues = watch();

  const validate = (requirement: Requirement) => {
    if (requirement === 'Min. 8 characters') {
      if (watchedValues.password?.length > 7) {
        return true;
      } else {
        return false;
      }
    }
    if (requirement === 'Capital') {
      if (/[A-Z]/.test(watchedValues.password)) {
        return true;
      } else {
        return false;
      }
    }
    if (requirement === 'Lowercase') {
      if (
        /[a-z]/.test(watchedValues.password) &&
        watchedValues.password?.length > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (requirement === 'Number') {
      if (/[0-9]/.test(watchedValues.password)) {
        return true;
      } else {
        return false;
      }
    }

    if (requirement === 'Symbol') {
      if (/[$-/:-?{-~!"^_`\[\]]/.test(watchedValues.password)) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <>
      {/* {isResettingPassword && <FullScreenSpinner />} */}

      <div className="bg-white">
        {/* <span>Back Button</span> */}
        {/* <button
          onClick={() => router.back()}
          className="p-4 rounded-full bg-[#F2F4F7] text-[#083D0B] mb-9 md:mb-6"
        >
          <RiArrowLeftLine />
        </button> */}

        <div className="pb-6 flex flex-col gap-1 text-start">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Create a new password
          </h1>

          <p className="text-[#475267] text-lg leading-[140%] tracking-[-0.44%]">
            Enter a new password of your choice but please make sure it’s known
            to you alone.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pb-12 flex flex-col gap-6">
            <FormInput
              type="password"
              label="New password"
              placeholder="Enter your password"
              {...register('password', {
                required: {
                  value: true,
                  message: 'Please enter a password',
                },
                pattern: {
                  value: passwordRegex,
                  message:
                    'Password must be 8-16 characters long, and contain at least one numeric digit, and a special character',
                },
              })}
              error={errors.password?.message}
            />

            <FormInput
              type="password"
              label="Repeat new password"
              placeholder="Enter your password"
              {...register('confirm_password', {
                required: {
                  value: true,
                  message: 'Please enter a password',
                },
                validate: (fieldValue) => {
                  return (
                    fieldValue === getValues('password') ||
                    'Passwords do not match'
                  );
                },
              })}
              error={errors.confirm_password?.message}
            />

            <div className="flex flex-wrap items-center gap-2 pt-6">
              {passwordRequirements.map((requirement) => (
                <span
                  key={requirement}
                  // className="inline-block py-2 px-4 bg-[#ECFDF3] text-[#027A48] font-CircularStdBook   text-sm leading-[140%] tracking-[-1.44%] text-center rounded"
                  className={cn(
                    'inline-block py-2 px-4 font-CircularStdBook   text-sm leading-[140%] tracking-[-1.44%] text-center rounded',
                    validate(requirement as Requirement)
                      ? 'bg-[#ECFDF3] text-[#027A48]'
                      : 'bg-[#F2F4F7] text-gray-400'
                  )}
                >
                  {requirement}
                </span>
              ))}
            </div>
          </div>

          <Button className="w-full h-12">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Create new password
          </Button>
        </form>
      </div>
    </>
  );
};

export default PasswordResetPage;
