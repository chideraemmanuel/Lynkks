'use client';

import Logo from '@/components/logo';
import Link from 'next/link';
import { FC } from 'react';
import {
  RiHome7Line,
  RiUserReceived2Line,
  RiTeamLine,
  RiFileList2Line,
  RiCheckboxCircleLine,
  RiBarChart2Line,
  RiSettings2Line,
} from '@remixicon/react';
// import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface Props {}

const DashboardSideNavigation: FC<Props> = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden xl:block fixed left-0 top-0 bottom-0 h-screen border-r w-[min(270px,_30vw)] bg-white">
        <div className="h-20 p-6 flex items-center justify-start border-b">
          <Logo />
        </div>

        <aside>
          <nav>
            <div className="p-4">
              <span className="inline-block px-4 pb-2 font-CircularStdMedium text-[#98A1B3] text-xs leading-[140%] tracking-[-0.8%]">
                MENU
              </span>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/dashboard"
                    className={cn(
                      'group flex items-center gap-[14px] py-[10px] px-3 rounded-lg text-[#667085] font-CircularStdMedium text-sm leading-[140%] tracking-[-0.44%] transition-colors hover:bg-[#F0F2F5] hover:text-primary',
                      pathname === '/dashboard' && 'bg-[#F0F2F5] text-primary'
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
                </li>

                <li>
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
                </li>
              </ul>
            </div>

            <Separator />

            <div className="p-4">
              <span className="inline-block px-4 pb-2 font-CircularStdMedium text-[#98A1B3] text-xs leading-[140%] tracking-[-0.8%]">
                MORE
              </span>
              <ul>
                <li>
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
                </li>
              </ul>
            </div>

            <Separator />
          </nav>
        </aside>
      </div>
    </>
  );
};

export default DashboardSideNavigation;
