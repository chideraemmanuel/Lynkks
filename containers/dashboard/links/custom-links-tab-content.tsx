'use client';

import FormInput from '@/components/form-input';
import SelectInput from '@/components/select-input';
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
import { AccountInterface, CustomLink } from '@/models/account';
import { RiDeleteBin5Line, RiPencilFill } from '@remixicon/react';
import { EyeIcon, GripVerticalIcon, Loader2, Trash2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ReactSortable } from 'react-sortablejs';

interface Props {
  account: AccountInterface;
}

type CustomLinkWithId = CustomLink & { id: string };

const CustomLinksTabContent: FC<Props> = ({ account }) => {
  const customLinkListWithId = account?.links?.custom_links.map((link) => {
    return { ...link, id: link._id.toString() };
  });

  const [list, setList] = useState<CustomLinkWithId[]>(customLinkListWithId);

  useEffect(() => {
    console.log('account changed', account);
    const customLinkListWithId = account?.links?.custom_links.map((link) => {
      return { ...link, id: link._id.toString() };
    });

    setList(customLinkListWithId);
  }, [account]);

  return (
    <>
      <TabsContent value="links">
        <div className="flex items-center gap-2 mb-5">
          <AddLink />

          <AddHeader />
        </div>

        {/* <div className="flex flex-col gap-3"> */}
        <ReactSortable
          list={list}
          setList={setList}
          className="flex flex-col gap-3"
          animation={150}
        >
          {list.map((link, index) => (
            <CustomLinkCard key={link.id} link={link} />
          ))}
        </ReactSortable>
        {/* </div> */}
      </TabsContent>
    </>
  );
};

export default CustomLinksTabContent;

const CustomLinkCard: FC<{ link: CustomLinkWithId }> = ({ link }) => {
  return (
    <>
      <div className="bg-white sm:p-4 p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 bg-red-200">
          <div className="bg-blue-200 cursor-grab active:cursor-grabbing">
            <GripVerticalIcon />
          </div>

          <div className="bg-lime-200 flex-1 flex flex-col gap-0">
            <span className="font-medium truncate w-[90%]">{link.title}</span>
            {/* <span className="text-sm">https://localhost:3000</span> */}
            {link.type === 'link' && (
              <span className="text-sm truncate w-[90%]">{link.href}</span>
            )}
          </div>
        </div>

        <div>
          <Button size={'icon'} variant={'ghost'} className="h-9 w-9">
            <RiPencilFill className="w-5 h-5" />
          </Button>

          <Button size={'icon'} variant={'ghost'} className="h-9 w-9">
            <EyeIcon className="w-5 h-5" />
          </Button>

          <DeleteLinkOrHeader />
        </div>
      </div>
    </>
  );
};

interface AddLinkFormData {
  // type: 'header' | 'link';
  title: string;
  href: string;
}

const AddLink: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync: addLink, isLoading: isAddingLink } =
    useAddLinkOrHeader();

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

    // await addLink({
    //   type: 'link',
    //   title,
    //   href,
    // });

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

                {/* <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
              Are you sure you want to disable this admin? Doing so will suspend
              the admin access.
            </AlertDialogDescription> */}
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
  // type: 'header' | 'link';
  title: string;
}

const AddHeader: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { mutateAsync: addLink, isLoading: isAddingLink } =
    useAddLinkOrHeader();

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

    // await addLink({
    //   type: 'header',
    //   title,
    // });

    await addLink({
      section: 'custom_links',
      link: {
        type: 'header',
        title,
      },
    });

    reset();
    setDialogOpen(false);
  };

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

const DeleteLinkOrHeader: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="text-destructive hover:bg-red-100 hover:text-destructive h-9 w-9"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <div className="flex flex-col gap-9 text-center">
            <AlertDialogHeader className="!text-center">
              <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                Delete Link
              </AlertDialogTitle>

              <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                Are you sure you want to delete this link | header? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex">
              <AlertDialogCancel className="w-full h-14 border-black rounded-full text-black font-bold text-base leading-[150%] tracking-[-0.44%]">
                No, cancel
              </AlertDialogCancel>
              <Button
                variant={'destructive'}
                className="w-full h-14 rounded-full bg-[#C94A4A] "
                onClick={async () => {
                  // await delete(id);
                  setDialogOpen(false);
                }}
                // disabled={isDeleting}
              >
                Yes, delete
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

//   <AlertDialogContent>
//     <AlertDialogHeader>
//       <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//       <AlertDialogDescription>
//         This action cannot be undone. This will permanently delete your account
//         and remove your data from our servers.
//       </AlertDialogDescription>
//     </AlertDialogHeader>
//     <AlertDialogFooter>
//       <AlertDialogCancel>Cancel</AlertDialogCancel>
//       <AlertDialogAction>Continue</AlertDialogAction>
//     </AlertDialogFooter>
//   </AlertDialogContent>;
