'use client';

import FullScreenSpinner from '@/components/full-screen-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants';
import CustomLinksTabContent from '@/containers/dashboard/links/custom-links-tab-content';
import SocialLinksTabContent from '@/containers/dashboard/links/social-links-tab-content';
import useAccount from '@/hooks/useAccount';
import { AccountInterface, CustomLink, SocialLink } from '@/models/account';
import { RiPencilFill, RiWhatsappLine } from '@remixicon/react';
import { EyeIcon, GripVertical, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { toast } from 'sonner';
import profileImage from '@/assets/profile.jpg';
import Image from 'next/image';
import LynkksSocialLink from '@/components/lynkks-social-link';
import LynkksLink from '@/components/lynkks-link';
import Logo from '@/components/logo';
import getIconByPlatform from '@/lib/getIconByPlatform';

interface Props {}

const DashboardLinksPage: FC<Props> = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  useEffect(() => {
    if (currentTab !== 'links' && currentTab !== 'social_links') {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('tab');
      router.replace(`?${newSearchParams}`);
    }
  }, [currentTab]);

  const updateSearchParam = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // console.log('passed value', value);

    if (value === '' || !value) {
      newSearchParams.delete('tab');
    } else {
      newSearchParams.set('tab', value);
    }

    router.replace(`?${newSearchParams}`);
  };

  const { data: account, isLoading: isFetchingAccount } = useAccount();

  return (
    <>
      {isFetchingAccount && <FullScreenSpinner />}

      {!isFetchingAccount && account && (
        <>
          <div className="sm:px-6 px-4 py-6 lg:mr-[500px]">
            <div className="pb-5">
              <span className="inline-block pb-2 font-bold text-[#98A1B3] text-[20px] leading-[140%] tracking-[-0.44%]">
                {/* Welcome, Chidera. 👋🏾 */}
                Welcome, {account.first_name}. 👋🏾
              </span>

              <h1 className="text-[#101828] font-medium text-base leading-[140%] tracking-[0%]">
                Your Links
              </h1>
            </div>

            <Tabs
              value={currentTab || 'links'}
              onValueChange={updateSearchParam}
            >
              <TabsList className="w-full mb-2">
                <TabsTrigger value="links" className="w-full">
                  Links
                </TabsTrigger>
                <TabsTrigger value="social_links" className="w-full">
                  Social Links
                </TabsTrigger>
              </TabsList>

              <>
                <CustomLinksTabContent account={account} />
                <SocialLinksTabContent account={account} />
              </>
            </Tabs>
          </div>

          <div className="fixed right-0 top-[80px] w-[500px] lg:flex hidden flex-col justify-center gap-5 sm:px-6 px-4 py-6 border-l">
            <Alert className="flex justify-between items-center p-2">
              {/* <AlertDescription>lynkks.vercel.app/chidera</AlertDescription> */}
              <AlertDescription>
                lynkks.vercel.app/{account.username}
              </AlertDescription>

              <Button
                size={'sm'}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `lynkks.vercel.app/${account.username}`
                  );
                  toast('Copied');
                }}
              >
                Copy
              </Button>
            </Alert>

            <div className="w-[calc(428px_*_0.65)] h-[calc(896px_*_0.65)] mx-auto bg-slate-500 rounded-[30px] overflow-hidden">
              <div className="bg-gradient-4 min-h-[100%] py-[calc(40px_*_0.65)] flex flex-col">
                {/* <div className="min-h-screen py-10 flex flex-col"> */}
                {/* <div className="bg-blue-300 w-[min(700px,_90%)] mx-auto flex-1"> */}
                <div className="w-[90%] mx-auto flex-1">
                  <div className="flex flex-col items-center gap-[calc(4px_*_0.65)] text-center mb-[calc(28px_*_0.65)]">
                    <div className="rounded-[50%] shadow-lg border-[calc(4px_*_0.65)] md:w-[calc(120px_*_0.65)] w-[calc(90px_*_0.65)] md:h-[calc(120px_*_0.65)] h-[calc(90px_*_0.65)] mb-[calc(12px_*_0.65)]">
                      <Image
                        src={account.profile.image || profileImage.src}
                        alt="#"
                        width={512}
                        height={512}
                        className="w-full h-full rounded-[inherit]"
                      />
                    </div>

                    <h1 className="text-[calc(20px_*_0.65)] leading-[calc(28px_*_0.65)] font-semibold">
                      {/* Chidera Emmanuel */}
                      {account.profile.title}
                    </h1>

                    <p className="w-[90%] text-muted-foreground text-[calc(14px_*_0.65)] leading-[calc(20px_*_0.65)]">
                      {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
              nihil esse debitis necessitatibus fugiat sit? */}
                      {account.profile.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-[calc(16px_*_0.65)] mb-[calc(40px_*_0.65)] w-[90%] mx-auto">
                    {account.links.social_links.map((link) => {
                      const Icon = getIconByPlatform(link.platform);
                      return (
                        <div className="w-[calc(40px_*_0.65)] h-[calc(40px_*_0.65)]">
                          <Icon size={'26'} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center gap-4 w-[90%] mx-auto">
                    {account.links.custom_links.map((link) => {
                      if (link.type === 'header') {
                        return (
                          <span
                            key={link._id.toString()}
                            className="text-[calc(20px_*_0.65)] leading-[calc(28px_*_0.65)] font-semibold text-muted-foreground"
                          >
                            {link.title}
                          </span>
                        );
                      } else {
                        return (
                          <div className="p-[calc(16px_*_0.65)] bg-white border rounded-[calc(16px_*_0.65)] w-full text-center text-[calc(20px_*_0.65)] leading-[calc(28px_*_0.65)] font-medium shadow">
                            {link.title}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>

                <div className="mt-[calc(40px_*_0.65)] flex flex-col items-center">
                  <span className="text-[calc(12px_*_0.65)] leading-[calc(16px_*_0.65)] text-muted-foreground italic">
                    Made with
                  </span>
                  <div className="text-[calc(24px_*_0.65)] leading-[calc(32px_*_0.65)] font-semibold">
                    <span>
                      Link<span className="text-primary">N</span>est
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardLinksPage;
