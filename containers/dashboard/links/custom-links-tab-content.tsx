'use client';

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
import { AccountInterface, CustomLink } from '@/models/account';
import { RiDeleteBin5Line, RiPencilFill } from '@remixicon/react';
import { EyeIcon, GripVerticalIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
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

const AddLink: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Add Link</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <div className="flex flex-col gap-9 text-center">
            <AlertDialogHeader className="!text-center">
              <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                Add new link
              </AlertDialogTitle>

              {/* <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
              Are you sure you want to disable this admin? Doing so will suspend
              the admin access.
            </AlertDialogDescription> */}
            </AlertDialogHeader>

            <AlertDialogFooter className="flex">
              <AlertDialogCancel className="w-full h-14 border-black rounded-full text-black font-bold text-base leading-[150%] tracking-[-0.44%]">
                Cancel
              </AlertDialogCancel>
              <Button
                className="w-full rounded-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                onClick={async () => {
                  // await addLink();
                  setDialogOpen(false);
                }}
                // disabled={isAddingLink}
              >
                Add link
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const AddHeader: FC<{}> = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Add Header</Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="px-6 py-12 rounded-[16px] bg-white w-[min(480px,_90%)]">
          <div className="flex flex-col gap-9 text-center">
            <AlertDialogHeader className="!text-center">
              <AlertDialogTitle className="pb-[9px] text-black font-medium text-2xl leading-[auto]">
                Add new header
              </AlertDialogTitle>

              <AlertDialogDescription className="text-[#475267] text-base leading-[24px] tracking-[-1%]">
                Headers can be used to split your links into sections.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex">
              <AlertDialogCancel className="w-full h-14 border-black rounded-full text-black font-bold text-base leading-[150%] tracking-[-0.44%]">
                Cancel
              </AlertDialogCancel>
              <Button
                className="w-full rounded-full py-4 px-6 h-14 font-medium text-base tracking-[-1%] text-white bg-primary text-center"
                onClick={async () => {
                  // await addHeader();
                  setDialogOpen(false);
                }}
                // disabled={isAddingHeader}
              >
                Add header
              </Button>
            </AlertDialogFooter>
          </div>
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
