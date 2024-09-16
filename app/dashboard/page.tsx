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
              {/* <AlertDescription>linknest.vercel.app/chidera</AlertDescription> */}
              <AlertDescription>
                linknest.vercel.app/{account.username}
              </AlertDescription>

              <Button
                size={'sm'}
                onClick={() => {
                  navigator.clipboard.writeText(
                    ` linknest.vercel.app/${account.username}`
                  );
                  toast('Link copied successfully');
                }}
              >
                Copy
              </Button>
            </Alert>

            <div className="w-[calc(428px_*_0.65)] h-[calc(896px_*_0.65)] mx-auto bg-slate-500 rounded-[50px]"></div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardLinksPage;
