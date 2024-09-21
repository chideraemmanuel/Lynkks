import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    </div> */}
      <div className="bg-[#fdfdfd] min-h-screen">
        <div className="sm:container px-4 mx-auto pt-4 md:pt-6 flex flex-col min-h-screen">
          <div className="flex justify-between items-center">
            <Logo />

            <div className="flex items-center gap-3">
              <Button asChild variant={'ghost'}>
                <Link href={'/auth/login'}>Login</Link>
              </Button>
              <Button asChild>
                <Link href={'/auth/username-select'}>Register</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl">
              Single Link, Multiple Benefits
              {/* One Link, Infinite Possibilities */}
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg md:w-[80%]">
              Create a personalized profile to showcase all your important links
              in one place. Share your content, social profiles, and more with a
              single link. Make it easy for your audience to connect with you
              anywhere, anytime.
            </p>

            <Button asChild>
              <Link href={'/auth/username-select'}>Get Started for free</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
