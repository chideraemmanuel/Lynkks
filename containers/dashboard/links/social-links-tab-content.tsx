import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants';
import { AccountInterface, SocialLink } from '@/models/account';
import { RiPencilFill } from '@remixicon/react';
import { EyeIcon, GripVerticalIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Props {
  account: AccountInterface;
}

type SocialLinkWithId = SocialLink & { id: string };

const SocialLinksTabContent: FC<Props> = ({ account }) => {
  const socialLinkListWithId = account?.links?.social_links.map((link) => {
    return { ...link, id: link._id.toString() };
  });

  const [list, setList] = useState<SocialLinkWithId[]>(socialLinkListWithId);

  return (
    <>
      <TabsContent value="social_links">
        <div className="mb-5">
          <Button className="w-full">Add Social Link</Button>
        </div>

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
      </TabsContent>
    </>
  );
};

export default SocialLinksTabContent;

const SocialLinkCard: FC<{ link: SocialLinkWithId }> = ({ link }) => {
  const showIcon = () => {
    const res = SOCIAL_MEDIA_PLATFORMS.find((platform) => {
      return platform.name === link.platform;
    });

    return res?.icon;
  };

  const Icon = showIcon();

  return (
    <>
      <div className="bg-white sm:p-4 p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 bg-red-200">
          <div className="bg-blue-200 cursor-grab active:cursor-grabbing">
            <GripVerticalIcon />
          </div>

          <div className="flex w-full items-center gap-2">
            <div>{Icon ? <Icon size={24} /> : null}</div>

            <div className="bg-lime-200 flex-1 w-full flex flex-col gap-0">
              <span className="font-medium truncate w-[90%]">
                {link.platform}
              </span>
              {/* <span className="text-sm">https://localhost:3000</span> */}
              <span className="text-sm truncate w-[90%]">{link.href}</span>
            </div>
          </div>
        </div>

        <div>
          <Button
            size={'icon'}
            variant={'ghost'}
            className="sm:h-9 h-8 sm:w-9 w-8"
          >
            <RiPencilFill className="w-5 h-5" />
          </Button>

          <Button
            size={'icon'}
            variant={'ghost'}
            className="sm:h-9 h-8 sm:w-9 w-8"
          >
            <EyeIcon className="w-5 h-5" />
          </Button>

          <Button
            size={'icon'}
            variant={'ghost'}
            className="text-destructive hover:bg-red-100 hover:text-destructive sm:h-9 w-8 sm:w-9 h-8"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
