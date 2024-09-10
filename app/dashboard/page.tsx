'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiPencilFill, RiWhatsappLine } from '@remixicon/react';
import { EyeIcon, GripVertical, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Props {}

// const DashboardLinksPage: FC<Props> = () => {
//   const router = useRouter();

//   const searchParams = useSearchParams();
//   const currentTab = searchParams.get('tab');

//   useEffect(() => {
//     if (currentTab !== 'links' && currentTab !== 'social_links') {
//       const newSearchParams = new URLSearchParams(searchParams.toString());
//       newSearchParams.delete('tab');
//       router.replace(`?${newSearchParams}`);
//     }
//   }, [currentTab]);

//   const updateSearchParam = (value: string) => {
//     const newSearchParams = new URLSearchParams(searchParams.toString());

//     // console.log('passed value', value);

//     if (value === '' || !value) {
//       newSearchParams.delete('tab');
//     } else {
//       newSearchParams.set('tab', value);
//     }

//     router.replace(`?${newSearchParams}`);
//   };

//   return (
//     <>
//       <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-[1fr,_500px]">
//         <div className="sm:px-6 px-4 py-6">
//           <div className="pb-5">
//             <span className="inline-block pb-2 font-bold text-[#98A1B3] text-[20px] leading-[140%] tracking-[-0.44%]">
//               Welcome, Chidera. 👋🏾
//             </span>

//             <h1 className="text-[#101828] font-medium text-base leading-[140%] tracking-[0%]">
//               Your Links
//             </h1>
//           </div>

//           <Tabs value={currentTab || 'links'} onValueChange={updateSearchParam}>
//             <TabsList className="w-full mb-2">
//               <TabsTrigger value="links" className="w-full">
//                 Links
//               </TabsTrigger>
//               <TabsTrigger value="social_links" className="w-full">
//                 Social Links
//               </TabsTrigger>
//             </TabsList>

//             <>
//               <LinksTabContent />
//               <SocialLinksTabContent />
//             </>
//           </Tabs>
//         </div>

//         <div className="lg:flex hidden flex-col justify-center gap-5 sm:px-6 px-4 py-6 border-l">
//           <Alert className="flex justify-between items-center p-2">
//             <AlertDescription>linknest.vercel.app/chidera</AlertDescription>

//             <Button size={'sm'}>Copy</Button>
//           </Alert>

//           {/* <div className='w-[428px] h-[926px]'> */}
//           {/* <div className="w-[414px] h-[896px] bg-slate-500 rounded-[50px]"></div> */}
//           {/* <div className="w-[375px] h-[812px] bg-slate-500 rounded-[50px]"></div> */}
//           <div className="w-[calc(428px_*_0.65)] h-[calc(896px_*_0.65)] mx-auto bg-slate-500 rounded-[50px]"></div>
//         </div>
//       </div>
//     </>
//   );
// };

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

  return (
    <>
      {/* <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-[1fr,_500px]"> */}
      <div className="sm:px-6 px-4 py-6 lg:mr-[500px]">
        <div className="pb-5">
          <span className="inline-block pb-2 font-bold text-[#98A1B3] text-[20px] leading-[140%] tracking-[-0.44%]">
            Welcome, Chidera. 👋🏾
          </span>

          <h1 className="text-[#101828] font-medium text-base leading-[140%] tracking-[0%]">
            Your Links
          </h1>
        </div>

        <Tabs value={currentTab || 'links'} onValueChange={updateSearchParam}>
          <TabsList className="w-full mb-2">
            <TabsTrigger value="links" className="w-full">
              Links
            </TabsTrigger>
            <TabsTrigger value="social_links" className="w-full">
              Social Links
            </TabsTrigger>
          </TabsList>

          <>
            <LinksTabContent />
            <SocialLinksTabContent />
          </>
        </Tabs>
      </div>

      <div className="fixed right-0 top-[80px] w-[500px] lg:flex hidden flex-col justify-center gap-5 sm:px-6 px-4 py-6 border-l">
        <Alert className="flex justify-between items-center p-2">
          <AlertDescription>linknest.vercel.app/chidera</AlertDescription>

          <Button size={'sm'}>Copy</Button>
        </Alert>

        <div className="w-[calc(428px_*_0.65)] h-[calc(896px_*_0.65)] mx-auto bg-slate-500 rounded-[50px]"></div>
      </div>
      {/* </div> */}
    </>
  );
};

export default DashboardLinksPage;

const LinksTabContent: FC<{}> = () => {
  const [list, setList] = useState([
    { id: 1, name: 'chidera' },
    { id: 2, name: 'shrek' },
    { id: 2, name: 'fiona' },
  ]);

  // console.log('list', list);

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
          {list.map((item, index) => (
            <LinkCard key={index} item={item} />
          ))}
        </ReactSortable>
        {/* </div> */}
      </TabsContent>
    </>
  );
};

const SocialLinksTabContent: FC<{}> = () => {
  const [list, setList] = useState([
    { id: 1, name: 'chidera' },
    { id: 2, name: 'shrek' },
    { id: 2, name: 'fiona' },
  ]);

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
          {list.map((item, index) => (
            <SocialLinkCard key={index} item={item} />
          ))}
        </ReactSortable>
      </TabsContent>
    </>
  );
};

// TODO: make LinkCard accomodate for headers too. Use a `type` prop
const LinkCard: FC<{ item: { id: number; name: string } }> = ({ item }) => {
  return (
    <>
      <div className="bg-white sm:p-4 p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 bg-red-200">
          <div className="bg-blue-200 cursor-grab active:cursor-grabbing">
            <GripVertical />
          </div>

          <div className="bg-lime-200 flex flex-col gap-0">
            <span className="font-medium">Link Title {item.name}</span>
            <span className="text-sm">https://localhost:3000</span>
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

const SocialLinkCard: FC<{ item: { id: number; name: string } }> = ({
  item,
}) => {
  return (
    <>
      <div className="bg-white sm:p-4 p-3 rounded-2xl shadow-sm border flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-3 bg-red-200">
          <div className="bg-blue-200 cursor-grab active:cursor-grabbing">
            <GripVertical />
          </div>

          <div className="flex items-center gap-2">
            <div>
              <RiWhatsappLine />
            </div>

            <div className="bg-lime-200 flex flex-col gap-0">
              <span className="font-medium">Link Title {item.name}</span>
              <span className="text-sm">https://localhost:3000</span>
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
