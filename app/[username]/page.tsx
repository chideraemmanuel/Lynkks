import Image from 'next/image';
import { FC } from 'react';
import profileImage from '@/assets/profile.jpg';
import Link from 'next/link';
import { RiWhatsappLine } from '@remixicon/react';
import Logo from '@/components/logo';

interface Props {
  params: { username: string };
}

const LinkNestUserPage: FC<Props> = ({ params: { username } }) => {
  return (
    <>
      <div className="bg-red-300 min-h-screen py-10">
        <div className="bg-blue-300 w-[min(700px,_90%)] mx-auto">
          <div className="flex flex-col items-center gap-2 text-center mb-7">
            <div className="rounded-[50%] md:w-[150px] w-[100px] md:h-[150px] h-[100px]">
              <Image
                src={profileImage.src}
                alt="#"
                width={512}
                height={512}
                className="w-full h-full rounded-[inherit]"
              />
            </div>

            <h1 className="md:text-2xl text-xl font-semibold">
              Chidera Emmanuel
            </h1>

            <p className="w-[90%] text-muted md:text-base text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
              nihil esse debitis necessitatibus fugiat sit?
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:gap-5 gap-4 mb-10 w-[90%] mx-auto">
            <Link href={'#'}>
              <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" />
            </Link>
            <Link href={'#'}>
              <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" />
            </Link>
            <Link href={'#'}>
              <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" />
            </Link>
            <Link href={'#'}>
              <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 w-[90%] mx-auto">
            <span>Username: {username}</span>

            <Link
              href={'#'}
              className="p-6 bg-white border rounded-lg w-full text-center shadow"
            >
              Username: {username}
            </Link>
            <Link
              href={'#'}
              className="p-6 bg-white border rounded-lg w-full text-center shadow"
            >
              Username: {username}
            </Link>
            <Link
              href={'#'}
              className="p-6 bg-white border rounded-lg w-full text-center shadow"
            >
              Username: {username}
            </Link>

            <span>Username: {username}</span>
            <Link
              href={'#'}
              className="p-6 bg-white border rounded-lg w-full text-center shadow"
            >
              Username: {username}
            </Link>
          </div>

          {/* <span>Username: {username}</span> */}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <span className="text-xs text-muted italic">Made with</span>
          <Logo />
        </div>
      </div>
    </>
  );
};

export default LinkNestUserPage;
