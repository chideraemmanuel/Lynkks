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
import { cn } from '@/lib/utils';
import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useSelectedUsernameContext } from '@/contexts/selected-username-context';

interface Props {}

const UsernameSelectionPage: FC<Props> = () => {
  const { selectedUsername, setSelectedUsername } =
    useSelectedUsernameContext();

  const router = useRouter();

  const form = useForm<{ username: string }>();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setError,
  } = form;

  const { mutate: verifyUsername, isLoading: isVerifyingUsername } =
    useMutation({
      mutationKey: ['verify username'],
      mutationFn: async (username: string) => {
        const response = await axios.post<{ message: string }>(
          '/api/accounts/verify-username',
          {
            username,
          }
        );

        console.log(
          'response data from verify username mutation',
          response.data
        );

        return response.data;
      },
      onSuccess: (data) => {
        // // set cookie and route to registration page
        // document.cookie = `lynkks_selected_username=${getValues(
        //   'username'
        // )};expires=${new Date(9999, 10, 10).toUTCString()}`;

        localStorage.setItem('lynkks_selected_username', getValues('username'));
        setSelectedUsername(getValues('username'));

        router.push(`/auth/register`);
      },
      onError: (error: AxiosError<{ error: string }>) => {
        if (error.response?.status === 422) {
          setError('username', { message: 'Username is already taken' });
        } else {
          toast.error(
            `${
              error?.response?.data?.error ||
              error?.message ||
              'Username verification failed - Something went wrong'
            }`
          );
        }
      },
    });

  const onSubmit: SubmitHandler<{ username: string }> = (data, e) => {
    console.log('data: ', data);

    verifyUsername(data.username);
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
            Choose your username
          </h1>

          <p className="text-[#475267] text-lg leading-[140%] tracking-[-0.44%]">
            Claim your free Link-in-bio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-12">
            <label
              htmlFor="username"
              className={cn(
                `cursor-text flex items-center gap-1 w-full shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] h-12 mt-1 rounded-md border border-input bg-white px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`,
                isVerifyingUsername && 'cursor-not-allowed opacity-50',
                `${errors.username?.message && 'border-destructive'}`
              )}
            >
              <span className="text-muted-foreground/50 text-base leading-[140%] tracking-[-0.4%]">
                lynkks.vercel.app/
              </span>

              <input
                type="text"
                placeholder="username"
                id="username"
                {...register('username', {
                  required: {
                    value: true,
                    message: 'Please choose a username',
                  },
                  // validate: (fieldValue) => {
                  //   return fieldValue.length > 2 || 'Username is too short';
                  // },
                  pattern: {
                    value: /^[a-z0-9]{3,15}$/i,
                    message: 'Invalid username',
                  },
                })}
                className="flex-1 text-[#344054] text-base leading-[140%] tracking-[-0.4%] placeholder:text-muted-foreground outline-none focus-visible:outline-none disabled:cursor-not-allowed"
                autoComplete="off"
              />
              {/* <FormInput
              // label="Email address"
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
            /> */}
            </label>
            {errors.username?.message && (
              <span className="text-xs text-destructive">
                {errors.username.message}
              </span>
            )}
          </div>

          <Button className="w-full h-12" disabled={isVerifyingUsername}>
            {isVerifyingUsername && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </form>
      </div>
    </>
  );
};

export default UsernameSelectionPage;
