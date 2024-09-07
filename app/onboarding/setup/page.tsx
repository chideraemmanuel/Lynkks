'use client';

import FormInput from '@/components/form-input';
import TextareaInput from '@/components/textarea-input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useOnBoardingSetupContext } from '@/contexts/onboarding-setup-context';
import { cn } from '@/lib/utils';
import {
  RiInstagramFill,
  RiTwitterFill,
  RiWhatsappFill,
} from '@remixicon/react';
import { Loader2, Plus } from 'lucide-react';
import { FC, useState } from 'react';

interface Props {}

const OnboardingSetupPage: FC<Props> = () => {
  const { step } = useOnBoardingSetupContext();

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
  return (
    <>
      <div>
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
          <ToggleGroup type="multiple" className="flex-wrap">
            <ToggleGroupItem value="whatsapp" className="border !h-auto !p-5">
              <RiWhatsappFill className="w-10 h-10" />
            </ToggleGroupItem>

            <ToggleGroupItem value="twitter" className="border !h-auto !p-5">
              <RiTwitterFill className="w-10 h-10" />
            </ToggleGroupItem>

            <ToggleGroupItem value="instagram" className="border !h-auto !p-5">
              <RiInstagramFill className="w-10 h-10" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="max-w-[570px] mx-auto">
          <Button className="w-full h-12">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

const LinkPopulation: FC = () => {
  return (
    <>
      <div className="max-w-[570px] mx-auto">
        <div className="pb-10 text-center">
          <h1 className="font-medium text-[32px] md:text-[48px] leading-[140%] tracking-[-1%] text-[#121212]">
            Add your links
          </h1>
          {/* <p className="w-[90%] mx-auto text-base text-muted-foreground leading-[140%] tracking-[-0.4%]">
            Pick at least one link to add to your LinkNest. Links can be
            modified later.
          </p> */}
        </div>

        <div className="pb-12 flex flex-col gap-5">
          <div className="flex gap-2">
            <div className="w-12 border rounded-md">
              <RiWhatsappFill />
            </div>

            <Input
              placeholder="Website URL"
              className="bg-white shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] text-[#344054] text-base leading-[140%] tracking-[-0.4%] h-12"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-12 border rounded-md">
              <RiWhatsappFill />
            </div>

            <Input
              placeholder="Website URL"
              className="bg-white shadow-[0_1px_2px_rgba(16,_24,_40,_0.05)] text-[#344054] text-base leading-[140%] tracking-[-0.4%] h-12"
            />
          </div>
        </div>

        {/* <div className="max-w-[570px] mx-auto"> */}
        <div className="max-w-[570px] mx-auto">
          <Button className="w-full h-12">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

const ProfileConfig: FC = () => {
  const [selectedImage, setSelectedImage] = useState<
    undefined | { name: string; src: string | ArrayBuffer | null }
  >(undefined);

  return (
    <>
      <div className="max-w-[570px] mx-auto">
        <div className="pb-10 text-center">
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
            <h2 className="font-semibold text-center mb-3">
              Select a profile image
            </h2>

            <div className="flex justify-center">
              <Input
                id="profile_image"
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                className="hidden"
                onChange={(e) => {
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

                  //   if (onChange) {
                  //     onChange(e);
                  //   }
                }}
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
                    <AvatarImage src={selectedImage?.src} />
                  </Avatar>
                )}
              </Label>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-center mb-3">
              Add title and bio
            </h2>

            <div className="flex flex-col gap-3">
              <FormInput placeholder="Profile title" />

              <TextareaInput placeholder="Bio" className="resize-none" />
            </div>
          </div>
        </div>

        <Button className="w-full h-12">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Build my LinkNest
        </Button>
      </div>
    </>
  );
};
