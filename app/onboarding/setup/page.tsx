'use client';

import FormInput from '@/components/form-input';
import TextareaInput from '@/components/textarea-input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SOCIAL_MEDIA_PLATFORMS, Link, URLRegex } from '@/constants';
import { useOnBoardingSetupContext } from '@/contexts/onboarding-setup-context';
import useLogout from '@/hooks/auth/useLogout';
import useUpdateAccount from '@/hooks/useUpdateAccount';
import DiscordIcon from '@/icons/discord';
import WhatsAppIcon from '@/icons/whatsapp';
import { cn } from '@/lib/utils';
import {
  RiArrowLeftLine,
  RiInstagramFill,
  RiTwitterFill,
  RiWhatsappFill,
} from '@remixicon/react';
import { Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
// import { ReactComponent as X } from '@/assets/twitterx.svg'

interface Props {}

const OnboardingSetupPage: FC<Props> = () => {
  const { step, setStep, selectedLinks, setSelectedLinks } =
    useOnBoardingSetupContext();

  return (
    <>
      {step === 1 && <LinkSelection />}
      {step === 2 && <LinkPopulation />}
      {step === 3 && <ProfileConfig />}
    </>
  );
};

export default OnboardingSetupPage;

const LinkSelection: FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { step, setStep, selectedLinks, setSelectedLinks } =
    useOnBoardingSetupContext();

  const handleToggleChange = (values: string[]) => {
    let final: Link[] = [];

    values.forEach((value) => {
      const socialMediaObject = SOCIAL_MEDIA_PLATFORMS.find(
        (platform) => platform.name === value
      );

      final.push(socialMediaObject as Link);
    });

    setSelectedLinks(final);
  };

  console.log('selectedLinks', selectedLinks);

  const {
    mutate: logout,
    isLoading: isLoggingOut,
    isSuccess: isSuccessLoggingOut,
  } = useLogout();

  useEffect(() => {
    if (isSuccessLoggingOut) {
      // router.back();
    }
  }, [isSuccessLoggingOut]);

  return (
    <>
      <div className="animate-in fade-in-0">
        <button
          onClick={() => {
            logout();
          }}
          className="p-4 rounded-full bg-secondary text-secondary-foreground mb-9 md:mb-6"
        >
          <RiArrowLeftLine />
        </button>

        <div className="pb-10 text-center">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Select the links you'd like to add
          </h1>
          <p className="w-[90%] mx-auto text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Pick at least one link to add to your LinkNest. Links can be
            modified later.
          </p>
        </div>

        <div className="pb-12">
          <ToggleGroup
            type="multiple"
            className="flex-wrap gap-3"
            onValueChange={(values) => handleToggleChange(values)}
            value={selectedLinks.map((link) => link.name)}
          >
            {SOCIAL_MEDIA_PLATFORMS.map((platform, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <ToggleGroupItem
                  value={platform.name}
                  className="border !h-auto !p-3"
                >
                  <platform.icon />
                </ToggleGroupItem>

                <span className="text-sm text-muted-foreground">
                  {platform.name}
                </span>
              </div>
            ))}
          </ToggleGroup>
        </div>

        <div className="max-w-[570px] mx-auto">
          <Button
            className="w-full h-12"
            onClick={() => setStep(2)}
            disabled={selectedLinks.length === 0}
          >
            {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

type LinkName =
  | 'Instagram'
  | 'Facebook'
  | 'X'
  | 'TikTok'
  | 'YouTube'
  | 'LinkedIn'
  | 'Pinterest'
  | 'Snapchat'
  | 'WhatsApp'
  | 'Telegram'
  | 'Reddit'
  | 'Tumblr'
  | 'Twitch'
  | 'Discord'
  | 'Website';

type LinksFormData = {
  Instagram: string;
  Facebook: string;
  X: string;
  TikTok: string;
  YouTube: string;
  LinkedIn: string;
  Pinterest: string;
  Snapchat: string;
  WhatsApp: string;
  Telegram: string;
  Reddit: string;
  Tumblr: string;
  Twitch: string;
  Discord: string;
  Website: string;
};

// type PopulatedLink = Pick<Link, 'name'> & {
//   href: string
// }

const LinkPopulation: FC = () => {
  const {
    step,
    setStep,
    selectedLinks,
    setSelectedLinks,
    populatedLinks,
    setPopulatedLinks,
  } = useOnBoardingSetupContext();

  const form = useForm<LinksFormData>();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit: SubmitHandler<LinksFormData> = (data, e) => {
    console.log('data', data);
    const entries = Object.entries(data);

    const res = entries.map(([key, value]) => ({
      name: key as LinkName,
      href: value,
    }));

    setPopulatedLinks(res);
    setStep(3);
  };

  return (
    <>
      <form
        className="max-w-[570px] mx-auto animate-in fade-in-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <button
          onClick={() => setStep(1)}
          className="p-4 rounded-full bg-secondary text-secondary-foreground mb-9 md:mb-6"
        >
          <RiArrowLeftLine />
        </button>

        <div className="pb-10">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Add your links
          </h1>
          <p className="w-[90%] text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Custom links can be added from your dashboard after these steps.
          </p>
        </div>

        <div className="pb-12 flex flex-col gap-5">
          {selectedLinks.map((link, index) => (
            <div className="flex gap-2" key={index}>
              <div className="w-12 flex items-center justify-center">
                <link.icon size={36} />
              </div>

              <FormInput
                placeholder={
                  link.name === 'WhatsApp'
                    ? 'WhatsApp Phone Number or Link'
                    : `${link.name} URL`
                }
                className="bg-white shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] text-[#344054] text-base leading-[140%] tracking-[-0.4%] h-12"
                {...register(link.name, {
                  required: {
                    value: true,
                    message:
                      link.name === 'WhatsApp'
                        ? 'Phone Number or Link is required'
                        : `URL is required`,
                  },
                  validate: (fieldValue) => {
                    if (link.name === 'WhatsApp') {
                      // return (
                      //   fieldValue.length > 9 || 'Invalid Phone Number or Link'
                      // );
                      if (isNaN(+fieldValue.charAt(0))) {
                        return URLRegex.test(fieldValue) || 'Invalid URL';
                      } else {
                        return (
                          /^\d{11}$/.test(fieldValue) || 'Invalid Phone Number'
                        );
                      }
                    } else {
                      return URLRegex.test(fieldValue) || 'Invalid URLL';
                    }
                  },
                })}
                error={errors[link.name]?.message}
              />
            </div>
          ))}
        </div>

        {/* <div className="max-w-[570px] mx-auto"> */}
        <div className="max-w-[570px] mx-auto">
          <Button className="w-full h-12">
            {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

interface ProfileDetails {
  first_name: string;
  last_name: string;
  profile_image: FileList;
  profile: {
    title: string;
    bio: string;
  };
}

const ProfileConfig: FC = () => {
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<
    undefined | { name: string; src: string | ArrayBuffer | null }
  >(undefined);

  const {
    step,
    setStep,
    selectedLinks,
    setSelectedLinks,
    populatedLinks,
    setPopulatedLinks,
  } = useOnBoardingSetupContext();

  console.log('populatedLinks', populatedLinks);

  const {
    mutate: updateAccount,
    isLoading: isUpdatingAccount,
    isSuccess: accountUpdateSuccess,
    error: accountUpdateError,
  } = useUpdateAccount();

  const form = useForm<ProfileDetails>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const { name, ref, onChange, onBlur } = register('profile_image');

  const onSubmit: SubmitHandler<ProfileDetails> = (data, e) => {
    console.log('data', data);
    // TODO (IMPORTANT): ADD POPULATED LINKS TO UPDATE, AND POSSIBLY USE LINKS FOR BOTH CUSTOM AND SOCIAL HERE!
    const custom_links = populatedLinks.map(({ name, href }) => {
      if (name === 'WhatsApp') {
        if (/^\d{11}$/.test(href)) {
          return {
            type: 'link' as 'link' | 'header',
            title: name,
            href: `https://wa.me/${href}`,
          };
        } else {
          return {
            type: 'link' as 'link' | 'header',
            title: name,
            href: href,
          };
        }
      } else {
        return {
          type: 'link' as 'link' | 'header',
          title: name,
          href: href,
        };
      }
    });

    const social_links = populatedLinks
      .filter(({ name, href }) => name !== 'Website')
      .map(({ name, href }) => {
        if (name === 'WhatsApp') {
          if (/^\d{11}$/.test(href)) {
            return {
              platform: name,
              href: `https://wa.me/${href}`,
            };
          } else {
            return {
              platform: name,
              href: href,
            };
          }
        } else {
          return {
            platform: name,
            href: href,
          };
        }
      });

    console.log('FINAL DATA', {
      ...data,
      profile_image: data.profile_image[0],
      links: {
        custom_links,
        social_links,
      },
    });
    updateAccount({
      ...data,
      profile_image: data.profile_image[0],
      links: {
        custom_links,
        // @ts-ignore
        social_links,
      },
      completed_onboarding: true,
    });
  };

  useEffect(() => {
    if (accountUpdateSuccess) {
      toast.success('Update Successful'); // todo: remove this..?
      router.replace('/dashboard');
    }
  }, [accountUpdateSuccess]);

  return (
    <>
      <form
        className="max-w-[570px] mx-auto animate-in fade-in-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <button
          onClick={() => setStep(2)}
          className="p-4 rounded-full bg-secondary text-secondary-foreground mb-9 md:mb-6"
        >
          <RiArrowLeftLine />
        </button>

        <div className="pb-10">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Add profile details
          </h1>
          {/* <p className="w-[90%] mx-auto text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Pick at least one link to add to your LinkNest. Links can be
            modified later.
          </p> */}
        </div>

        <div className="pb-12 flex flex-col gap-7">
          <div>
            <div className="text-center mb-5">
              <h2 className="font-semibold text-lg mb-1">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                These will not be displayed on your public LinkNest
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <FormInput
                label="First name"
                placeholder="Enter your first name"
                id="first_name"
                {...register('first_name', {
                  required: {
                    value: true,
                    message: 'Please enter your first name',
                  },
                })}
                error={errors.first_name?.message}
                // disabled={isCreatingAccount}
              />

              <FormInput
                label="Last name"
                placeholder="Enter your last name"
                id="last_name"
                {...register('last_name', {
                  required: {
                    value: true,
                    message: 'Please enter your last name',
                  },
                })}
                error={errors.last_name?.message}
                // disabled={isCreatingAccount}
              />
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-center mb-3">
              Select a profile image
            </h2>

            <div className="flex justify-center">
              <Input
                id="profile_image"
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                className="hidden"
                name={name}
                ref={ref}
                onChange={async (e) => {
                  console.log('selected image File:', e.target.files);
                  // console.log('selected image value:', e.target.value);

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
                // className="inline-flex items-center justify-center border rounded-[50%] w-[100px] h-[100px] cursor-pointer"
                className="group relative inline-block border rounded-[50%] w-[100px] h-[100px] cursor-pointer"
              >
                <div
                  className={cn(
                    selectedImage?.src && 'group-hover:bg-black/70',
                    'absolute inset-0 z-[2] transition-colors inline-flex items-center justify-center w-full h-full rounded-[inherit]'
                  )}
                >
                  <Plus
                    className={cn(
                      selectedImage?.src && 'hidden text-muted',
                      'group-hover:inline-block w-7 h-7'
                    )}
                  />
                </div>

                {selectedImage?.src && (
                  <Avatar className="absolute inset-0 w-full h-full">
                    {/* @ts-ignore */}
                    <AvatarImage src={selectedImage?.src} />
                  </Avatar>
                )}
              </Label>
            </div>
          </div>

          <div>
            <div className="text-center mb-5">
              <h2 className="font-semibold text-lg mb-1">
                Profile Information
              </h2>
              <p className="text-sm text-muted-foreground">
                These will be displayed as header on your public LinkNest
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <FormInput
                label="Profile title"
                placeholder="E.g John Doe"
                id="profile_title"
                {...register('profile.title', {
                  required: {
                    value: true,
                    message: 'Please input a title for your profile',
                  },
                })}
                error={errors.profile?.title?.message}
                // disabled={isCreatingAccount}
              />

              <TextareaInput
                label="Bio"
                placeholder="Enter a short description"
                className="resize-none"
                id="bio"
                {...register('profile.bio', {
                  // required: {
                  //   value: true,
                  //   message: 'Please input a bio for your profile',
                  // },
                })}
                error={errors.profile?.bio?.message}
                // disabled={isCreatingAccount}
              />
            </div>
          </div>
        </div>

        <Button className="w-full h-12" disabled={isUpdatingAccount}>
          {isUpdatingAccount && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Build my LinkNest
        </Button>
      </form>
    </>
  );
};
