'use client';

import FormInput from '@/components/form-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { passwordRegex } from '@/constants';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inter } from 'next/font/google';
// import { Badge } from '@/components/ui/badge';
import { RiCheckLine } from '@remixicon/react';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

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

interface PasswordChangeFormTypes {
  password: string;
  confirm_password: string;
}

const ProfileSettingsPage: FC<Props> = () => {
  const form = useForm<PasswordChangeFormTypes>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch,
  } = form;

  const watchedValues = watch();

  const onSubmit: SubmitHandler<PasswordChangeFormTypes> = (data, e) => {
    console.log('data: ', data);

    // resetPassword({ email, reset_string, new_password: data.password });
  };

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
      <div className="min-h-[calc(100vh-80px)] flex flex-col sm:px-6 px-4 py-6">
        <div className="pb-5">
          <h1 className="pb-3 pt-2 text-[#101828] font-bold text-[24px] leading-[140%] tracking-[0%]">
            Manage Profile
          </h1>

          {/* <div className="text-[#1D2639] text-base leading-[140%] tracking-[0%]">
              All clients <span className="text-[#667085]">(230)</span>
            </div> */}
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-12 bg-white shadow-lg px-8 py-9 rounded-[16px] border-[#E3E7ED]">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-14">
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Profile photo
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[200px]">
                  This image will be displayed on your LinkTree profile
                </p>
              </div>

              <div>
                <div className="relative overflow-visible">
                  <Avatar className="w-[100px] h-[100px] border-[6px] border-border">
                    <AvatarFallback
                      className={`bg-primary text-white text-[48px] font-semibold tracking-[-3%]`}
                    >
                      C
                    </AvatarFallback>
                  </Avatar>

                  {/* <span className="absolute right-0 bottom-0 bg-[#1D2639] text-white flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full p-0">
                    <RiCheckLine className="w-5 h-5" />
                  </span> */}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-14">
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Personal Information
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[200px]">
                  Update your personal details here
                </p>

                <Button className="mt-[14px] rounded-md self-start" disabled>
                  Save changes
                </Button>
              </div>

              <div className="w-[min(546px,_100%)]">
                <form className="flex flex-col gap-5">
                  <FormInput
                    label="Display Name"
                    value={'Chidera Emmanuel'}
                    className="disabled:bg-[#F0F2F5] disabled:opacity-1 disabled:text-[#98A2B3]"
                    disabled
                    readOnly
                  />
                  <FormInput
                    label="Email Address"
                    value={'chidera@gmail.com'}
                    className="disabled:bg-[#F0F2F5] disabled:opacity-1 disabled:text-[#98A2B3]"
                    disabled
                    readOnly
                  />
                </form>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-14">
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Account Password
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[200px]">
                  Update your account password here
                </p>
              </div>

              {/* <div> */}
              <div className="w-[min(546px,_100%)]">
                <div className="flex flex-col gap-12">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h4 className="mb-4 text-[#101928] font-bold text-[20px] leading-[140%] tracking-[-1.44%]">
                      Create a new password
                    </h4>

                    <div className="pb-9 flex flex-col gap-5">
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
                            // className="inline-block py-2 px-4 bg-[#ECFDF3] text-[#027A48]   text-sm leading-[140%] tracking-[-1.44%] text-center rounded"
                            className={cn(
                              'inline-block py-2 px-4   text-sm leading-[140%] tracking-[-1.44%] text-center rounded',
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

                    <Button className="" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Create new password
                    </Button>
                  </form>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
