import ComboBoxInput from '@/components/combobox-input';
import SocialLinkCard from '@/components/dashboards/links/social-link-card';
import FormInput from '@/components/form-input';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { SOCIAL_MEDIA_PLATFORMS, URLRegex } from '@/constants';
import useAddLinkOrHeader from '@/hooks/links/useAddLinkOrHeader';
import { AccountInterface, SocialLink } from '@/models/account';
import { RiPencilFill } from '@remixicon/react';
import { EyeIcon, GripVerticalIcon, Loader2, Trash2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ReactSortable } from 'react-sortablejs';
import { toast } from 'sonner';

interface Props {
  account: Omit<AccountInterface, 'password'>;
}

export type SocialLinkWithId = SocialLink & { id: string };

type Platform =
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
  | 'Discord';

const links: Platform[] = [
  'Instagram',
  'Facebook',
  'X',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'Pinterest',
  'Snapchat',
  'WhatsApp',
  'Telegram',
  'Reddit',
  'Tumblr',
  'Twitch',
  'Discord',
];

const SocialLinksTabContent: FC<Props> = ({ account }) => {
  const socialLinkListWithId = account?.links?.social_links.map((link) => {
    return { ...link, id: link._id.toString() };
  });

  const [list, setList] = useState<SocialLinkWithId[]>(socialLinkListWithId);

  useEffect(() => {
    console.log('account changed', account);
    const socialLinkListWithId = account?.links?.social_links.map((link) => {
      return { ...link, id: link._id.toString() };
    });

    setList(socialLinkListWithId);
  }, [account]);

  const allSocialsAdded = () => {
    const filteredLinks = links.filter((link) => {
      const exists = account?.links?.social_links.find(
        (social_link) => social_link.platform === link
      );

      if (!exists) {
        return link;
      }
    });

    if (filteredLinks.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <TabsContent value="social_links">
        {!allSocialsAdded() && (
          <div className="mb-5">
            <AddSocialLink account={account} />
          </div>
        )}

        {list.length > 0 ? (
          <ReactSortable
            list={list}
            setList={setList}
            className="flex flex-col gap-3"
            animation={150}
          >
            {list.map((link, index) => (
              <SocialLinkCard key={link.id} link={link} />
            ))}
          </ReactSortable>
        ) : (
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center h-20">
            You don't have any social links
          </p>
        )}
      </TabsContent>
    </>
  );
};

export default SocialLinksTabContent;

interface AddSocialLinkFormData {
  platform: Platform;

  href: string;
}

const AddSocialLink: FC<{
  account: Omit<AccountInterface, 'password'>;
}> = ({ account }) => {
  const { social_links } = account.links;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

  const filteredLinks = links.filter((link) => {
    const exists = social_links.find(
      (social_link) => social_link.platform === link
    );

    if (!exists) {
      return link;
    }
  });

  console.log('filteredLinks', filteredLinks);

  const {
    mutateAsync: addSocialLink,
    isLoading: isAddingSocialLink,
    isSuccess: socialLinkCreationSuccess,
  } = useAddLinkOrHeader();

  const form = useForm<AddSocialLinkFormData>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    resetField,
  } = form;

  const onSubmit: SubmitHandler<AddSocialLinkFormData> = async (data, e) => {
    const { platform, href } = data;

    await addSocialLink({
      section: 'social_links',
      link: {
        platform,
        href,
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (socialLinkCreationSuccess) {
      toast.success('Social Link added successfully');
    }
  }, [socialLinkCreationSuccess]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Add Social Link</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <AlertDialogHeader className="!text-center mb-5">
                <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                  Add new social link
                </AlertDialogTitle>

                <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                  Social links will be displayed below your profile header.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-3 mb-10">
                <ComboBoxInput
                  label="Platform"
                  comboboxTriggerProps={{
                    ...register('platform', {
                      required: {
                        value: true,
                        message: 'Platform is required',
                      },
                    }),
                    className: 'capitalize',
                  }}
                  comboboxItemProps={{ className: 'capitalize' }}
                  comboboxOpen={comboboxOpen}
                  setComboboxOpen={setComboboxOpen}
                  error={errors.platform?.message}
                  comboboxItems={filteredLinks.map((link) => {
                    return {
                      id: link,
                      value: link,
                      name: link,
                    };
                  })}
                  onItemSelect={(value) => {
                    clearErrors('platform');
                    setValue('platform', value as Platform);
                    console.log('selected platform value:', value);
                  }}
                  disabled={isAddingSocialLink}
                />

                <FormInput
                  label="URL"
                  placeholder="e.g https://mywebsite.com"
                  id="href"
                  {...register('href', {
                    required: { value: true, message: 'URL is required' },
                    pattern: {
                      value: URLRegex,
                      message: 'Invalid URL',
                    },
                  })}
                  error={errors.href?.message}
                  disabled={isAddingSocialLink}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isAddingSocialLink}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isAddingSocialLink}
                >
                  {isAddingSocialLink && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add link
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
