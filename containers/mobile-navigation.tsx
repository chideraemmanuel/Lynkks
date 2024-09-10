'use client';

import Logo from '@/components/logo';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  RiBarChart2Line,
  RiCheckboxCircleLine,
  RiFileList2Line,
  RiHome7Line,
  RiMenuLine,
  RiSettings2Line,
  RiTeamLine,
  RiUserReceived2Line,
} from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface Props {}

const MobileNavigation: FC<Props> = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <RiMenuLine />
            </Button>
          </SheetTrigger>

          <SheetContent side={'left'} className="block xl:hidden">
            <SheetHeader className="text-start items-start">
              <Logo />
            </SheetHeader>

            <div className="py-4">
              <nav>
                <div className="py-4">
                  <span className="inline-block px-4 pb-2 font-CircularStdMedium text-[#98A1B3] text-xs leading-[140%] tracking-[-0.8%]">
                    MENU
                  </span>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className={cn(
                            'group flex items-center gap-[14px] py-[10px] px-3 rounded-lg text-[#667085] font-CircularStdMedium text-sm leading-[140%] tracking-[-0.44%] transition-colors hover:bg-[#F0F2F5] hover:text-primary',
                            pathname === '/dashboard' &&
                              'bg-[#F0F2F5] text-primary'
                          )}
                        >
                          <RiHome7Line
                            className={cn(
                              'text-[#98A1B3] w-6 h-6 transition-colors group-hover:text-primary',
                              pathname === '/dashboard' && 'text-primary'
                            )}
                          />
                          Links
                        </Link>
                      </SheetClose>
                    </li>

                    <li>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard/analytics"
                          className={cn(
                            'group flex items-center gap-[14px] py-[10px] px-3 rounded-lg text-[#667085] font-CircularStdMedium text-sm leading-[140%] tracking-[-0.44%] transition-colors hover:bg-[#F0F2F5] hover:text-primary',
                            pathname.includes('/dashboard/analytics') &&
                              'bg-[#F0F2F5] text-primary'
                          )}
                        >
                          <RiBarChart2Line
                            className={cn(
                              'text-[#98A1B3] w-6 h-6 transition-colors group-hover:text-primary',
                              pathname.includes('/dashboard/analytics') &&
                                'text-primary'
                            )}
                          />
                          Analytics
                          {/* <Badge
                      variant={'destructive'}
                      className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    >
                      34
                    </Badge> */}
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="py-4">
                  <span className="inline-block px-4 pb-2 font-CircularStdMedium text-[#98A1B3] text-xs leading-[140%] tracking-[-0.8%]">
                    MORE
                  </span>
                  <ul>
                    <li>
                      <SheetClose asChild>
                        <Link
                          href="/dashboard/profile/settings"
                          className={cn(
                            'group flex items-center gap-[14px] py-[10px] px-3 rounded-lg text-[#667085] font-CircularStdMedium text-sm leading-[140%] tracking-[-0.44%] transition-colors hover:bg-[#F0F2F5] hover:text-primary',
                            pathname === '/dashboard/profile/settings' &&
                              'bg-[#F0F2F5] text-primary'
                          )}
                        >
                          <RiSettings2Line
                            className={cn(
                              'text-[#98A1B3] w-6 h-6 transition-colors group-hover:text-primary',
                              pathname === '/dashboard/profile/settings' &&
                                'text-primary'
                            )}
                          />
                          Settings
                          {/* <Badge
                      variant={'destructive'}
                      className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    >
                      4
                    </Badge> */}
                        </Link>
                      </SheetClose>
                    </li>
                  </ul>
                </div>

                <Separator />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MobileNavigation;
