'use client';

import CustomLinkCard from '@/components/dashboards/links/custom-link-card';
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
import { URLRegex } from '@/constants';
import useAddLinkOrHeader from '@/hooks/links/useAddLinkOrHeader';
import useUpdateAccount from '@/hooks/useUpdateAccount';
import { AccountInterface, CustomLink } from '@/models/account';
import { Loader2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ReactSortable } from 'react-sortablejs';
import { toast } from 'sonner';

interface Props {
  account: Omit<AccountInterface, 'password'>;
}

export type CustomLinkWithId = CustomLink & { id: string };

const CustomLinksTabContent: FC<Props> = ({ account }) => {
  const customLinkListWithId = account?.links?.custom_links.map((link) => {
    return { ...link, id: link._id.toString() };
  });

  const [list, setList] = useState<CustomLinkWithId[]>(customLinkListWithId);

  useEffect(() => {
    const customLinkListWithId = account?.links?.custom_links.map((link) => {
      return { ...link, id: link._id.toString() };
    });

    setList(customLinkListWithId);
  }, [account]);

  // ! UPDATE ON SORT !
  const {
    mutateAsync: updateAccount,
    isLoading: isUpdatingAccount,
    isSuccess: accountUpdateSuccessful,
    error: accountUpdateError,
  } = useUpdateAccount();

  return (
    <>
      <TabsContent value="links">
        <div className="flex items-center gap-2 mb-5">
          <AddLink />

          <AddHeader />
        </div>

        {list.length > 0 ? (
          <ReactSortable
            disabled={isUpdatingAccount}
            list={list}
            // setList={setList}
            setList={(newState) => {
              setList(newState);

              //  updateAccount({
              //   links: {
              //     custom_links: newState,
              //   },
              // });
            }}
            className="flex flex-col gap-3"
            animation={150}
            handle=".handle"
          >
            {list.map((link, index) => (
              <CustomLinkCard
                key={link.id}
                link={link}
                onDragEnd={() => {
                  updateAccount({
                    links: {
                      custom_links: list,
                    },
                  });
                }}
              />
            ))}
          </ReactSortable>
        ) : (
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center h-20">
            You don't have any links
          </p>
        )}
      </TabsContent>
    </>
  );
};

export default CustomLinksTabContent;

interface AddLinkFormData {
  title: string;
  href: string;
}

const AddLink: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    mutateAsync: addLink,
    isLoading: isAddingLink,
    isSuccess: linkCreationSuccess,
  } = useAddLinkOrHeader();

  const form = useForm<AddLinkFormData>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    resetField,
  } = form;

  const onSubmit: SubmitHandler<AddLinkFormData> = async (data, e) => {
    const { title, href } = data;

    await addLink({
      section: 'custom_links',
      link: {
        type: 'link',
        title,
        href,
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (linkCreationSuccess) {
      toast.success('Link added successfully');
    }
  }, [linkCreationSuccess]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Add Link</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <AlertDialogHeader className="!text-center mb-5">
                <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                  Add new link
                </AlertDialogTitle>
              </AlertDialogHeader>

              <div className="flex flex-col gap-3 mb-10">
                <FormInput
                  label="Title"
                  placeholder="e.g My website"
                  id="title"
                  {...register('title', {
                    required: {
                      value: true,
                      message: 'Link title is required',
                    },
                  })}
                  error={errors.title?.message}
                  disabled={isAddingLink}
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
                  disabled={isAddingLink}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isAddingLink}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isAddingLink}
                >
                  {isAddingLink && (
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

interface AddHeaderFormData {
  title: string;
}

const AddHeader: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    mutateAsync: addHeader,
    isLoading: isAddingHeader,
    isSuccess: headerCreationSuccess,
  } = useAddLinkOrHeader();

  const form = useForm<AddHeaderFormData>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
    setValue,
    reset,
    resetField,
  } = form;

  const onSubmit: SubmitHandler<AddHeaderFormData> = async (data, e) => {
    const { title } = data;

    await addHeader({
      section: 'custom_links',
      link: {
        type: 'header',
        title,
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (headerCreationSuccess) {
      toast.success('Header added successfully');
    }
  }, [headerCreationSuccess]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Add Header</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <AlertDialogHeader className="!text-center mb-5">
                <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                  Add new header
                </AlertDialogTitle>

                <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                  Headers can be used to split your links into sections.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-3 mb-10">
                <FormInput
                  label="Title"
                  placeholder="e.g Projects Section"
                  id="title"
                  {...register('title', {
                    required: {
                      value: true,
                      message: 'Header title is required',
                    },
                  })}
                  error={errors.title?.message}
                  disabled={isAddingHeader}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isAddingHeader}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isAddingHeader}
                >
                  {isAddingHeader && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add header
                </Button>
              </AlertDialogFooter>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
