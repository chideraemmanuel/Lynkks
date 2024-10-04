import ComboBoxInput from '@/components/combobox-input';
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
import { URLRegex } from '@/constants';
import { SocialLinkWithId } from '@/containers/dashboard/links/social-links-tab-content';
import useDeleteLinkOrHeader from '@/hooks/links/useDeleteLinkOrHeader';
import useEditLink from '@/hooks/links/useEditLink';
import getIconByPlatform from '@/lib/getIconByPlatform';
import { RiPencilFill } from '@remixicon/react';
import { GripVerticalIcon, Loader2, Trash2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  link: SocialLinkWithId;
  onDragEnd?: () => void;
}

const SocialLinkCard: FC<Props> = ({ link, onDragEnd }) => {
  const Icon = getIconByPlatform(link.platform);

  return (
    <>
      <div
        onDragEnd={
          onDragEnd
            ? () => {
                onDragEnd();
                // console.log('[DRAG ENDED!]');
              }
            : undefined
        }
        className="bg-white sm:p-4 p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3"
      >
        <div className="flex-1 flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing handle">
            <GripVerticalIcon />
          </div>

          <div className="flex w-full items-center gap-2">
            <div className="w-7 h-7">
              {Icon ? <Icon size={'auto'} /> : null}
            </div>

            <div className="flex-1 w-full flex flex-col gap-0">
              <span className="font-medium text-lg truncate w-[90%]">
                {link.platform}
              </span>
              <span className="text-sm truncate w-[90%] text-muted-foreground">
                {link.href}
              </span>
            </div>
          </div>
        </div>

        <div>
          <EditSocialLink link={link} />

          {/* TODO: ADD LINK VISIBILITY TOGGLE..? */}
          {/* <Button
            size={'icon'}
            variant={'ghost'}
            className="sm:h-9 h-8 sm:w-9 w-8"
          >
            <EyeIcon className="w-5 h-5" />
          </Button> */}

          <DeleteSocialLink link={link} />
        </div>
      </div>
    </>
  );
};

export default SocialLinkCard;

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

interface EditLinkFormData {
  platform: Platform;

  href: string;
}

const EditSocialLink: FC<{
  link: SocialLinkWithId;
}> = ({ link }) => {
  const [formChanged, setFormChanged] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);

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

  const {
    mutateAsync: editSocialLink,
    isLoading: isUpdatingSocialLink,
    isSuccess: socialLinkEditSuccessful,
  } = useEditLink();

  const form = useForm<EditLinkFormData>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    getValues,
    reset,
    resetField,
  } = form;

  // this sets the default value of the inputs for useForm to properly manage
  // this is necessary because, on page load, the defaultValue set on the inputs only shows the proper value in the ui, but doesn't have it's state managed by react hook form
  useEffect(() => {
    setValue('platform', link.platform);
    setValue('href', link.href);
  }, []);

  // ! Track form change !
  const watchedFormFields = watch();

  useEffect(() => {
    if (watchedFormFields.href !== link.href) {
      setFormChanged(true);
    } else if (watchedFormFields.platform !== link.platform) {
      setFormChanged(true);
    } else {
      setFormChanged(false);
    }
  }, [watchedFormFields]);

  const onSubmit: SubmitHandler<EditLinkFormData> = async (data, e) => {
    if (!formChanged) {
      return;
    }

    const { platform, href } = data;

    // ! Build updates !
    const updates: Partial<EditLinkFormData> = {};

    const formValues = getValues();

    if (formValues.platform !== link.platform) {
      updates.platform = formValues.platform;
    }

    if (formValues.href !== link.href) {
      updates.href = formValues.href;
    }

    await editSocialLink({
      link_id: link.id,
      update_details: {
        section: 'social_links',
        link: {
          ...updates,
        },
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (socialLinkEditSuccessful) {
      toast.success('Social link updated successfully');
    }
  }, [socialLinkEditSuccessful]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="sm:h-9 h-8 sm:w-9 w-8"
          >
            <RiPencilFill className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <AlertDialogHeader className="!text-center mb-5">
                <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                  Edit link
                </AlertDialogTitle>
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
                  comboboxItems={links.map((link) => {
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
                  defautlValue={{
                    id: link.platform,
                    value: link.platform,
                    name: link.platform,
                  }}
                  disabled={isUpdatingSocialLink}
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
                  defaultValue={link.href}
                  disabled={isUpdatingSocialLink}
                  error={errors.href?.message}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isUpdatingSocialLink}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isUpdatingSocialLink || !formChanged}
                >
                  {isUpdatingSocialLink && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const DeleteSocialLink: FC<{ link: SocialLinkWithId }> = ({ link }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // const capitalize = (string: string) => {
  //   return string.charAt(0).toUpperCase() + string.slice(1);
  // };

  const {
    mutateAsync: deleteSocialLink,
    isLoading: isDeleting,
    isSuccess,
  } = useDeleteLinkOrHeader();

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Social link deleted successfully`);
    }
  }, [isSuccess]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="text-destructive hover:bg-red-100 hover:text-destructive sm:h-9 w-8 sm:w-9 h-8"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <div className="flex flex-col gap-9 text-center">
            <AlertDialogHeader className="!text-center">
              <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                Delete Social Link
              </AlertDialogTitle>

              <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                Are you sure you want to delete this link? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex">
              <AlertDialogCancel
                className="w-full h-14 border-black text-black font-bold text-base leading-[150%] tracking-[-0.44%]"
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                variant={'destructive'}
                className="w-full h-14 bg-[#C94A4A] "
                onClick={async () => {
                  await deleteSocialLink({
                    link_id: link.id,
                    section: 'social_links',
                  });
                  setDialogOpen(false);
                }}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
