import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { AccountInterface, CustomLink } from '@/models/account';
import { RiPencilFill } from '@remixicon/react';
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
          <Button className="w-full">Add Link</Button>

          <Button className="w-full">Add Header</Button>
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

          <div className="bg-lime-200 w-full flex flex-col gap-0">
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

          <Button
            size={'icon'}
            variant={'ghost'}
            className="text-destructive hover:bg-red-100 hover:text-destructive h-9 w-9"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
