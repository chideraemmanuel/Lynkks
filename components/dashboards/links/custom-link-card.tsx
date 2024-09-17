import { Button } from '@/components/ui/button';
import { CustomLinkWithId } from '@/containers/dashboard/links/custom-links-tab-content';
import { CustomLink, Header, Hyperlink } from '@/models/account';
import { RiPencilFill } from '@remixicon/react';
import { EyeIcon, GripVerticalIcon, Loader2, Trash2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import FormInput from '@/components/form-input';
import { URLRegex } from '@/constants';
import useEditLink from '@/hooks/links/useEditLink';
import { toast } from 'sonner';
import useDeleteLinkOrHeader from '@/hooks/links/useDeleteLinkOrHeader';

interface Props {
  link: CustomLinkWithId;
}

const CustomLinkCard: FC<Props> = ({ link }) => {
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
          {link.type === 'link' ? (
            <EditLink link={link} />
          ) : (
            <EditHeader link={link} />
          )}

          <Button size={'icon'} variant={'ghost'} className="h-9 w-9">
            <EyeIcon className="w-5 h-5" />
          </Button>

          <DeleteLinkOrHeader link={link} />
        </div>
      </div>
    </>
  );
};

export default CustomLinkCard;

interface EditLinkFormData {
  // type: 'header' | 'link';
  title: string;
  href: string;
}

const EditLink: FC<{
  link: Hyperlink & {
    id: string;
  };
}> = ({ link }) => {
  const [formChanged, setFormChanged] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log('formChanged', formChanged);

  const {
    mutateAsync: editLink,
    isLoading: isUpdatingLink,
    isSuccess: linkEditSuccessful,
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
  // this is necessary because, for some reason, on page load, the defaultValue set on the inputs only shows the proper value in the ui, but doesn't have it's state managed by react hook form
  useEffect(() => {
    console.log('initial load form data:', getValues());

    setValue('href', link.href);
    setValue('title', link.title);
  }, []);

  // ! Track form change !
  const watchedFormFields = watch();

  useEffect(() => {
    if (watchedFormFields.href !== link.href) {
      console.log('watchedFormFields.href', watchedFormFields.href);
      console.log('link.href', link.href);
      console.log('form changed: href');
      setFormChanged(true);
    } else if (watchedFormFields.title !== link.title) {
      console.log('form changed: title');
      setFormChanged(true);
    } else {
      console.log('form has not changed');
      setFormChanged(false);
    }
  }, [watchedFormFields]);

  const onSubmit: SubmitHandler<EditLinkFormData> = async (data, e) => {
    if (!formChanged) {
      return;
    }

    const { title, href } = data;

    // ! Build updates !
    const updates: Partial<EditLinkFormData> = {};

    const formValues = getValues();

    if (formValues.href !== link.href) {
      updates.href = formValues.href;
    }

    if (formValues.title !== link.title) {
      updates.title = formValues.title;
    }

    console.log('final updates', updates);

    await editLink({
      link_id: link.id,
      update_details: {
        section: 'custom_links',
        link: {
          type: 'link',
          ...updates,
        },
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (linkEditSuccessful) {
      toast.success('Link updated successfully');
    }
  }, [linkEditSuccessful]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button size={'icon'} variant={'ghost'} className="h-9 w-9">
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
                  defaultValue={link.title}
                  disabled={isUpdatingLink}
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
                  defaultValue={link.href}
                  disabled={isUpdatingLink}
                  error={errors.href?.message}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isUpdatingLink}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isUpdatingLink || !formChanged}
                >
                  {isUpdatingLink && (
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

interface EditHeaderFormData {
  // type: 'header' | 'link';
  title: string;
}

const EditHeader: FC<{
  link: Header & {
    id: string;
  };
}> = ({ link }) => {
  const [formChanged, setFormChanged] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log('formChanged', formChanged);

  const {
    mutateAsync: editHeader,
    isLoading: isUpdatingHeader,
    isSuccess: headerUpdateSuccessful,
  } = useEditLink();

  const form = useForm<EditHeaderFormData>();

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
  // this is necessary because, for some reason, on page load, the defaultValue set on the inputs only shows the proper value in the ui, but doesn't have it's state managed by react hook form
  useEffect(() => {
    console.log('initial load form data:', getValues());

    setValue('title', link.title);
  }, []);

  // ! Track form change !
  const watchedFormFields = watch();

  useEffect(() => {
    if (watchedFormFields.title !== link.title) {
      console.log('form changed: title');
      setFormChanged(true);
    } else {
      console.log('form has not changed');
      setFormChanged(false);
    }
  }, [watchedFormFields]);

  const onSubmit: SubmitHandler<EditHeaderFormData> = async (data, e) => {
    if (!formChanged) {
      return;
    }

    const { title } = data;

    // ! Build updates !
    const updates: Partial<EditHeaderFormData> = {};

    const formValues = getValues();

    if (formValues.title !== link.title) {
      updates.title = formValues.title;
    }

    console.log('final updates', updates);

    await editHeader({
      link_id: link.id,
      update_details: {
        section: 'custom_links',
        link: {
          type: 'header',
          ...updates,
        },
      },
    });

    reset();
    setDialogOpen(false);
  };

  useEffect(() => {
    if (headerUpdateSuccessful) {
      toast.success('Header updated successfully');
    }
  }, [headerUpdateSuccessful]);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button size={'icon'} variant={'ghost'} className="h-9 w-9">
            <RiPencilFill className="w-5 h-5" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <AlertDialogHeader className="!text-center mb-5">
                <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                  Update Header
                </AlertDialogTitle>

                {/* <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                  Headers can be used to split your links into sections.
                </AlertDialogDescription> */}
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
                  disabled={isUpdatingHeader}
                />
              </div>

              <AlertDialogFooter className="flex">
                <AlertDialogCancel
                  type="button"
                  className="w-full h-14 border-primary text-primary font-bold text-base leading-[150%] tracking-[-0.44%]"
                  disabled={isUpdatingHeader}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  className="w-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                  disabled={isUpdatingHeader || !formChanged}
                >
                  {isUpdatingHeader && (
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

const DeleteLinkOrHeader: FC<{ link: CustomLinkWithId }> = ({ link }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const {
    mutateAsync: deleteLinkOrHeader,
    isLoading: isDeleting,
    isSuccess,
  } = useDeleteLinkOrHeader();

  useEffect(() => {
    if (isSuccess) {
      toast.success(`${capitalize(link.type)} deleted successfully`);
    }
  }, [isSuccess]);

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
                Delete {capitalize(link.type)}
              </AlertDialogTitle>

              <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                Are you sure you want to delete this {link.type}? This action
                cannot be undone.
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
                  await deleteLinkOrHeader({
                    link_id: link.id,
                    section: 'custom_links',
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
