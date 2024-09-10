'use client';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  RiAdminLine,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowLeftLine,
  RiLogoutCircleLine,
  RiMenuLine,
  RiSearch2Line,
  RiSearchLine,
  RiUserLine,
} from '@remixicon/react';
import { FC, useState } from 'react';
import MobileNavigation from './mobile-navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

interface Props {}

const DashboardHeader: FC<Props> = () => {
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 h-16 md:h-20 border-b xl:ml-[min(270px,_30vw)] px-6 bg-white">
        <div className="flex items-center justify-between gap-4 h-full">
          {/* <div className="flex items-center gap-5 lg:hidden flex-1 lg:flex-initial"> */}
          <div className="xl:hidden">
            <MobileNavigation />
          </div>

          <div className="xl:hidden">
            <Logo />
          </div>

          <div className="xl:ml-auto">
            <DashboardHeaderAccountDropdown />
          </div>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;

const DashboardHeaderAccountDropdown: FC = () => {
  return (
    <>
      {/* {isLoggingOut && <FullScreenSpinner />} */}

      <DropdownMenu>
        {/* {isFetchingUser && !user && (
          <Skeleton className="hidden md:inline-block h-10 md:h-14 w-10 md:w-14 rounded-full" />
        )} */}

        {/* {!isFetchingUser && user && ( */}
        <DropdownMenuTrigger asChild>
          {/* <button className="p-1 lg:p-2 rounded-full flex items-center gap-2 bg-[#E4F7F5]"> */}
          <button className="p-1 lg:p-2 rounded-full flex items-center gap-2 bg-secondary">
            <Avatar className="w-8 md:w-10 md:h-10 h-8">
              <AvatarFallback className="bg-primary text-white font-CircularStdMedium text-lg md:text-2xl tracking-[-3.44%]">
                C{/* {getInitials(user.first_name, user.last_name)} */}
              </AvatarFallback>
            </Avatar>

            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[#123633] font-CircularStdMedium text-sm leading-[140%] tracking-[-0.44%]">
                Chidera Emmanuel
              </span>

              <span>
                <RiArrowDownSLine className="text-[#0B510F]" />
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        {/* )} */}

        <DropdownMenuContent
          className="w-[242px] flex flex-col gap-2 border border-[#D0D4DD] shadow-[0_4px_100px_0_rgba(92,_92,_92,_0.16)] rounded-[8px] p-2"
          align="end"
        >
          {/* <CurrentUser user={user} /> */}
          <CurrentUser />

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/profile/settings`}
              className="flex items-center gap-2 p-4 rounded-[8px] text-[#667085] hover:text-black focus:text-black transition-colors"
            >
              <RiUserLine className="h-4 w-4" />
              <span>Manage profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="text-[#EB5757] hover:text-[#EB5757] focus:text-[#EB5757] hover:bg-[rgba(235,_87,_87,_0.3)] focus:bg-[rgba(235,_87,_87,_0.3)]"
          >
            <button
              className="flex items-center gap-2 p-4 rounded-[8px]"
              // onClick={() => logout()}
            >
              <RiLogoutCircleLine className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// interface CurrentUserProps {
//   user: UserReturnTypes;
// }

// const CurrentUser: FC<CurrentUserProps> = ({ user: { first_name, last_name, email } }) => {
const CurrentUser: FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 items-center bg-[#F3F7FB] border border-[#EAECF0] rounded-full p-2">
      <Avatar>
        <AvatarFallback
          className={`flex items-center justify-center p-[10px] w-10 h-10 rounded-full bg-white border border-[#EAECF0] text-black font-semibold text-2xl tracking-[-3.44%]`}
        >
          {/* {first_name.charAt(0).toUpperCase()} */}C
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="font-medium text-sm leading-[140%] tracking-[0.3%] text-black truncate w-[87%]">
          Chidera Emmanuel
          {/* {first_name} {last_name} */}
        </span>

        <span className="leading-[140%] text-xs text-[#667085] truncate w-[87%]">
          chidera@gmail.com
          {/* {email} */}
        </span>
      </div>
    </div>
  );
};
