'use client';

import FormInput from '@/components/form-input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { passwordRegex } from '@/constants';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
import useAccount from '@/hooks/useAccount';
import FullScreenSpinner from '@/components/full-screen-spinner';
import useUpdateAccount from '@/hooks/useUpdateAccount';
import { toast } from 'sonner';
import profileImage from '@/assets/profile.jpg';

interface Props {}

type Requirement =
  | 'Min. 8 characters'
  // | 'Capital'
  // | 'Lowercase'
  | 'Number'
  | 'Symbol';

const passwordRequirements = [
  'Min. 8 characters',
  // 'Capital',
  // 'Lowercase',
  'Number',
  'Symbol',
];

interface PersonalDetailsChangeFormTypes {
  first_name: string;
  last_name: string;
}

interface PasswordChangeFormTypes {
  password: string;
  confirm_password: string;
}

const ProfileSettingsPage: FC<Props> = () => {
  const [formChanged, setFormChanged] = useState(false);

  const { data: account, isLoading: isFetchingAccount } = useAccount();

  const {
    mutateAsync: updateAccount,
    isLoading: isUpdatingAccount,
    isSuccess: accountUpdateSuccess,
  } = useUpdateAccount();

  useEffect(() => {
    if (accountUpdateSuccess) {
      toast.success('Update Successful');
    }
  }, [accountUpdateSuccess]);

  const personalDetailsChangeForm = useForm<PersonalDetailsChangeFormTypes>({
    defaultValues: {
      // first_name: '',
      // last_name: '',
    },
  });
  const passwordChangeForm = useForm<PasswordChangeFormTypes>();

  const {
    register: registerPersonalDetailsChangeField,
    formState: { errors: personalDetailsChangeFormErrors },
    handleSubmit: handlePersonalDetailsChangeSubmit,
    getValues: getPersonalDetailsChangeFormValues,
    setValue: setPersonalDetailsChangeFormValue,
    watch: watchPersonalDetailsChangeFields,
  } = personalDetailsChangeForm;

  useEffect(() => {
    if (account) {
      setPersonalDetailsChangeFormValue('first_name', account.first_name || '');
      setPersonalDetailsChangeFormValue('last_name', account.last_name || '');
    }
  }, [account]);

  // ! Track form change !
  const watchedPersonalDetailsFormFields = watchPersonalDetailsChangeFields();

  useEffect(() => {
    if (watchedPersonalDetailsFormFields.first_name !== account?.first_name) {
      console.log(
        'watchedPersonalDetailsFormFields.first_name',
        watchedPersonalDetailsFormFields.first_name
      );
      console.log('account?.first_name', account?.first_name);
      console.log('form changed: first_name');
      setFormChanged(true);
    } else if (
      watchedPersonalDetailsFormFields.last_name !== account.last_name
    ) {
      console.log(
        'watchedPersonalDetailsFormFields.last_name',
        watchedPersonalDetailsFormFields.last_name
      );
      console.log('account?.last_name', account?.last_name);
      console.log('form changed: last_name');
      setFormChanged(true);
    } else {
      console.log('form has not changed');
      setFormChanged(false);
    }
  }, [watchedPersonalDetailsFormFields]);

  const onPersonalDetailsChangeSubmit: SubmitHandler<
    PersonalDetailsChangeFormTypes
  > = async (data, e) => {
    if (!formChanged) return;

    console.log('data', data);

    await updateAccount(data);
  };

  const {
    register: registerPasswordChangeField,
    formState: { errors: passwordChangeFormErrors },
    handleSubmit: handlePasswordChangeSubmit,
    getValues: getPasswordChangeFormValues,
    watch: watchPasswordChangeFields,
    reset: resetPasswordChangeFields,
  } = passwordChangeForm;

  const watchedPasswordChange = watchPasswordChangeFields();

  const onPasswordChangeSubmit: SubmitHandler<PasswordChangeFormTypes> = async (
    data,
    e
  ) => {
    console.log('data: ', data);

    await updateAccount({
      password: data.password,
    });
    resetPasswordChangeFields();
    // resetPassword({ email, reset_string, new_password: data.password });
  };

  const validate = (requirement: Requirement) => {
    if (requirement === 'Min. 8 characters') {
      if (watchedPasswordChange.password?.length > 7) {
        return true;
      } else {
        return false;
      }
    }
    // if (requirement === 'Capital') {
    //   if (/[A-Z]/.test(watchedPasswordChange.password)) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    // if (requirement === 'Lowercase') {
    //   if (
    //     /[a-z]/.test(watchedPasswordChange.password) &&
    //     watchedPasswordChange.password?.length > 0
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
    if (requirement === 'Number') {
      if (/[0-9]/.test(watchedPasswordChange.password)) {
        return true;
      } else {
        return false;
      }
    }

    if (requirement === 'Symbol') {
      if (/[$-/:-?{-~!"^_`\[\]]/.test(watchedPasswordChange.password)) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <>
      {(isFetchingAccount || isUpdatingAccount) && <FullScreenSpinner />}

      {!isFetchingAccount && account && (
        <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col sm:px-6 px-4 py-6">
          <div className="pb-5">
            <h1 className="pb-3 pt-2 text-[#101828] font-bold text-[24px] leading-[140%] tracking-[0%]">
              Manage Profile
            </h1>

            {/* <div className="text-[#1D2639] text-base leading-[140%] tracking-[0%]">
              All clients <span className="text-[#667085]">(230)</span>
            </div> */}
          </div>

          {/* <div className="flex-1"> */}
          <div className="flex-1 flex flex-col gap-12 bg-white shadow-lg px-8 py-9 rounded-[16px] border-[#E3E7ED]">
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
                      {account.first_name && account.first_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* <span className="absolute right-0 bottom-0 bg-[#1D2639] text-white flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full p-0">
                    <RiCheckLine className="w-5 h-5" />
                  </span> */}
                </div>
              </div>
            </div>

            <form
              className="flex flex-col md:flex-row items-start gap-4 md:gap-14"
              onSubmit={handlePersonalDetailsChangeSubmit(
                onPersonalDetailsChangeSubmit
              )}
            >
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Personal Information
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[200px]">
                  Update your personal details here
                </p>

                <Button
                  className="mt-[14px] rounded-md self-start"
                  disabled={isUpdatingAccount || !formChanged}
                >
                  {isUpdatingAccount && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </div>

              <div className="w-[min(546px,_100%)]">
                <div className="flex flex-col gap-5">
                  <FormInput
                    label="First Name"
                    id="first_name"
                    defaultValue={account.first_name || ''}
                    {...registerPersonalDetailsChangeField('first_name', {
                      required: {
                        value: true,
                        message: 'First name is required',
                      },
                    })}
                    error={personalDetailsChangeFormErrors.first_name?.message}
                    disabled={isUpdatingAccount}
                  />
                  <FormInput
                    label="Last Name"
                    id="last_name"
                    defaultValue={account.last_name || ''}
                    {...registerPersonalDetailsChangeField('last_name', {
                      required: {
                        value: true,
                        message: 'Last name is required',
                      },
                    })}
                    error={personalDetailsChangeFormErrors.last_name?.message}
                    disabled={isUpdatingAccount}
                  />
                  <FormInput
                    label="Email Address"
                    value={account.email}
                    className="disabled:bg-[#F0F2F5] disabled:opacity-1 disabled:text-[#98A2B3]"
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </form>

            {account.auth_type === 'manual' && (
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
                    <form
                      onSubmit={handlePasswordChangeSubmit(
                        onPasswordChangeSubmit
                      )}
                    >
                      <h4 className="mb-4 text-[#101928] font-bold text-[20px] leading-[140%] tracking-[-1.44%]">
                        Create a new password
                      </h4>

                      <div className="pb-9 flex flex-col gap-5">
                        <FormInput
                          type="password"
                          label="New password"
                          placeholder="Enter your password"
                          {...registerPasswordChangeField('password', {
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
                          error={passwordChangeFormErrors.password?.message}
                        />

                        <FormInput
                          type="password"
                          label="Repeat new password"
                          placeholder="Enter your password"
                          {...registerPasswordChangeField('confirm_password', {
                            required: {
                              value: true,
                              message: 'Please enter a password',
                            },
                            validate: (fieldValue) => {
                              return (
                                fieldValue ===
                                  getPasswordChangeFormValues('password') ||
                                'Passwords do not match'
                              );
                            },
                          })}
                          error={
                            passwordChangeFormErrors.confirm_password?.message
                          }
                        />

                        <div className="flex flex-wrap items-center gap-2 pt-6">
                          {passwordRequirements.map((requirement) => (
                            <span
                              key={requirement}
                              // className="inline-block py-2 px-4 bg-[#ECFDF3] text-[#027A48]   text-sm leading-[140%] tracking-[-1.44%] text-center rounded"
                              className={cn(
                                'inline-block py-2 px-4 text-sm leading-[140%] tracking-[-1.44%] text-center rounded',
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

                      <Button className="" disabled={isUpdatingAccount}>
                        {isUpdatingAccount && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create new password
                      </Button>
                    </form>
                  </div>
                </div>
                {/* </div> */}
              </div>
            )}
          </div>
          {/* </div> */}
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;
