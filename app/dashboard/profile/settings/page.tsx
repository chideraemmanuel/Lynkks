'use client';

import FormInput from '@/components/form-input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { passwordRegex } from '@/constants';
import { cn } from '@/lib/utils';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAccount from '@/hooks/useAccount';
import FullScreenSpinner from '@/components/full-screen-spinner';
import useUpdateAccount from '@/hooks/useUpdateAccount';
import { toast } from 'sonner';
import profileImage from '@/assets/profile.jpg';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useDeleteProfileImage from '@/hooks/useDeleteProfileImage';
import TextareaInput from '@/components/textarea-input';

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

interface ProfileImageChangeFormTypes {
  profile_image?: FileList;
}

interface PersonalDetailsChangeFormTypes {
  first_name: string;
  last_name: string;
  profile: {
    title: string;
    bio: string;
  };
}

interface PasswordChangeFormTypes {
  password: string;
  confirm_password: string;
}

const ProfileSettingsPage: FC<Props> = () => {
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

  // !!! PROFILE IMAGE UPDATE LOGIC !!!
  const [selectedImage, setSelectedImage] = useState<
    undefined | { name: string; src: string | ArrayBuffer | null }
  >(undefined);

  const profileImageChangeForm = useForm<ProfileImageChangeFormTypes>();

  const {
    register: registerProfileImageChangeField,
    formState: { errors: profileImageChangeFormErrors },
    handleSubmit: handleProfileImageChangeSubmit,
    getValues: getProfileImageChangeFormValues,
    setValue: setProfileImageChangeFormValue,
    watch: watchProfileImageChangeFields,
  } = profileImageChangeForm;

  const { name, ref, onChange, onBlur } =
    registerProfileImageChangeField('profile_image');

  const onProfileImageChangeSubmit: SubmitHandler<
    ProfileImageChangeFormTypes
  > = async (data, e) => {
    if (!data.profile_image) return;

    await updateAccount({
      profile_image: data.profile_image[0],
    });

    setSelectedImage(undefined);
  };

  // !!! PROFILE IMAGE DELETE LOGIC !!!
  const { mutate: deleteProfileImage, isLoading: isDeletingProfileImage } =
    useDeleteProfileImage();

  // !!! PERSONAL DETAILS UPDATE LOGIC !!!
  const [formChanged, setFormChanged] = useState(false);

  const personalDetailsChangeForm = useForm<PersonalDetailsChangeFormTypes>({
    defaultValues: {
      // first_name: '',
      // last_name: '',
    },
  });

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
      setPersonalDetailsChangeFormValue(
        'profile.title',
        account.profile.title || ''
      );
      setPersonalDetailsChangeFormValue(
        'profile.bio',
        account.profile.bio || ''
      );
    }
  }, [account]);

  // Track personal details form change
  const watchedPersonalDetailsFormFields = watchPersonalDetailsChangeFields();

  useEffect(() => {
    if (watchedPersonalDetailsFormFields.first_name !== account?.first_name) {
      setFormChanged(true);
    } else if (
      watchedPersonalDetailsFormFields.last_name !== account?.last_name
    ) {
      setFormChanged(true);
    } else if (
      watchedPersonalDetailsFormFields.profile?.title !==
      account?.profile?.title
    ) {
      setFormChanged(true);
    } else if (
      watchedPersonalDetailsFormFields.profile?.bio !== account?.profile?.bio
    ) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [watchedPersonalDetailsFormFields]);

  const onPersonalDetailsChangeSubmit: SubmitHandler<
    PersonalDetailsChangeFormTypes
  > = async (data, e) => {
    if (!formChanged) return;

    const {
      first_name,
      last_name,
      profile: { title, bio },
    } = getPersonalDetailsChangeFormValues();

    const updates: PersonalDetailsChangeFormTypes =
      {} as PersonalDetailsChangeFormTypes;

    if (first_name !== account?.first_name) {
      updates.first_name = first_name;
    }

    if (last_name !== account?.last_name) {
      updates.last_name = last_name;
    }

    if (title !== account?.profile.title) {
      // updates.profile.title = title;
      updates.profile = {
        ...updates.profile,
        title,
      };
    }

    if (bio !== '' && bio !== account?.profile.bio) {
      // updates.profile.bio = bio;
      updates.profile = {
        ...updates.profile,
        bio,
      };
    }

    await updateAccount(updates);
  };

  // !!! PASSWORD UPDATE LOGIC !!!
  const passwordChangeForm = useForm<PasswordChangeFormTypes>();

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
    await updateAccount({
      password: data.password,
    });

    resetPasswordChangeFields();
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
      {(isFetchingAccount || isUpdatingAccount || isDeletingProfileImage) && (
        <FullScreenSpinner />
      )}

      {!isFetchingAccount && account && (
        <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col sm:px-6 px-4 py-6">
          <div className="pb-5">
            <h1 className="pb-3 pt-2 text-[#101828] font-bold text-[24px] leading-[140%] tracking-[0%]">
              Manage Profile
            </h1>
          </div>

          <div className="flex-1 flex flex-col gap-12 bg-white shadow-lg px-8 py-9 rounded-[16px] border-[#E3E7ED]">
            <form
              className="flex flex-col-reverse md:flex-row items-start gap-4 md:gap-14"
              onSubmit={handleProfileImageChangeSubmit(
                onProfileImageChangeSubmit
              )}
            >
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Profile photo
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[auto] md:max-w-[200px]">
                  This image will be displayed on your Lynkks profile
                </p>

                <Button
                  className="mt-[14px] rounded-md self-start"
                  disabled={isUpdatingAccount || !selectedImage?.src}
                >
                  {isUpdatingAccount && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>

              <div>
                <div className="relative overflow-visible">
                  <Input
                    id="profile_image"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg"
                    className="hidden"
                    name={name}
                    ref={ref}
                    onChange={async (e) => {
                      console.log('selected image File:', e.target.files);

                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.readAsDataURL(e.target.files?.[0]);
                        reader.onload = () => {
                          setSelectedImage({
                            name: e.target.files?.[0].name!,
                            src: reader.result,
                          });
                        };
                      }

                      // setSelectedImage(e.target.files?.[0].name);

                      await onChange(e);
                    }}
                    onBlur={onBlur}
                  />

                  <Label
                    htmlFor="profile_image"
                    className="group relative inline-block rounded-[50%] w-[100px] h-[100px] border-[6px] border-border cursor-pointer"
                  >
                    <div
                      className={cn(
                        'absolute inset-0 z-[2] transition-colors inline-flex items-center justify-center w-full h-full rounded-[inherit] group-hover:bg-black/50'
                      )}
                    >
                      <Plus
                        className={cn(
                          'hidden text-muted group-hover:inline-block w-7 h-7'
                        )}
                      />
                    </div>

                    <Avatar className="absolute inset-0 w-full h-full">
                      <AvatarImage
                        // @ts-ignore
                        src={
                          selectedImage?.src ||
                          account.profile.image ||
                          profileImage.src
                        }
                      />
                    </Avatar>
                  </Label>

                  {account.profile.image && (
                    <Button
                      variant={'destructive'}
                      className="absolute z-[5] right-0 bottom-[7%] flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full p-0"
                      title="Delete profile image"
                      onClick={() => deleteProfileImage()}
                      type="button"
                    >
                      <Trash2 className="w-[15px] h-[15px] text-destructive-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </form>

            <form
              className="flex flex-col-reverse md:flex-row items-start gap-4 md:gap-14"
              onSubmit={handlePersonalDetailsChangeSubmit(
                onPersonalDetailsChangeSubmit
              )}
            >
              <div className="flex flex-col gap-[6px] min-w-[305px]">
                <h3 className="text-[#1D2639] font-bold text-base leading-[145%] tracking-[0%]">
                  Personal Information
                </h3>
                <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[auto] md:max-w-[200px]">
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
                  <FormInput
                    label="Profile title"
                    placeholder="E.g John Doe"
                    id="profile_title"
                    {...registerPersonalDetailsChangeField('profile.title', {
                      required: {
                        value: true,
                        message: 'Please input a title for your profile',
                      },
                    })}
                    error={
                      personalDetailsChangeFormErrors.profile?.title?.message
                    }
                  />
                  <TextareaInput
                    label="Bio"
                    placeholder="Enter a short description"
                    className="resize-none"
                    id="bio"
                    {...registerPersonalDetailsChangeField('profile.bio', {
                      // required: {
                      //   value: true,
                      //   message: 'Please input a bio for your profile',
                      // },
                    })}
                    error={
                      personalDetailsChangeFormErrors.profile?.bio?.message
                    }
                    maxLength={300}
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
                  <p className="text-[#667185] text-sm leading-[145%] tracking-[0%] max-w-[auto] md:max-w-[200px]">
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
                          label="New password"
                          id="password"
                          type="password"
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
                          label="Repeat new password"
                          id="confirm_password"
                          type="password"
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
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettingsPage;
