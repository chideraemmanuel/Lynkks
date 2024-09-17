import Image from 'next/image';
import { FC } from 'react';
import profileImage from '@/assets/profile.jpg';
import Link from 'next/link';
import { RiWhatsappLine } from '@remixicon/react';
import Logo from '@/components/logo';
import Account, { AccountInterface } from '@/models/account';
import { notFound } from 'next/navigation';
import { Link as LinkType, SOCIAL_MEDIA_PLATFORMS } from '@/constants';
import { connectToDatabase } from '@/lib/database';

interface Props {
  params: { username: string };
}

const LinkNestUserPage: FC<Props> = async ({ params: { username } }) => {
  await connectToDatabase();
  const account = await Account.findOne<AccountInterface>({ username });

  if (!account) notFound();

  const {
    first_name,
    last_name,
    profile,
    links: { custom_links, social_links },
  } = account;

  const getIcon = (
    social_platform:
      | 'Instagram'
      | 'Facebook'
      | 'X'
      | 'TikTok'
      | 'YouTube'
      | 'LinkedIn'
      | 'Pinterest'
      | 'Snapchat'
      | 'WhatsApp'
      | 'Telegram'
      | 'Reddit'
      | 'Tumblr'
      | 'Twitch'
      | 'Discord'
      | 'Website'
  ) => {
    const res = SOCIAL_MEDIA_PLATFORMS.find((platform) => {
      return platform.name === social_platform;
    });

    return res?.icon;
  };

  // const Icon = getIcon();

  return (
    <>
      <div className="bg-red-300 min-h-screen py-10 flex flex-col">
        {/* <div className="min-h-screen py-10 flex flex-col"> */}
        <div className="bg-blue-300 w-[min(700px,_90%)] mx-auto flex-1">
          {/* <div className="w-[min(700px,_90%)] mx-auto flex-1"> */}
          <div className="flex flex-col items-center gap-2 text-center mb-7">
            <div className="rounded-[50%] md:w-[150px] w-[100px] md:h-[150px] h-[100px]">
              <Image
                src={profile.image || profileImage.src}
                alt="#"
                width={512}
                height={512}
                className="w-full h-full rounded-[inherit]"
              />
            </div>

            <h1 className="md:text-2xl text-xl font-semibold">
              {/* Chidera Emmanuel */}
              {profile.title}
            </h1>

            <p className="w-[90%] text-muted-foreground md:text-base text-sm">
              {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint,
              nihil esse debitis necessitatibus fugiat sit? */}
              {profile.bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:gap-5 gap-4 mb-10 w-[90%] mx-auto">
            {social_links.map((link) => {
              const Icon = getIcon(link.platform);

              return (
                <Link
                  key={link._id.toString()}
                  href={link.href}
                  target="_blank"
                  className="md:w-12 w-10 md:h-12 h-10"
                >
                  {/* <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" /> */}
                  <Icon size={'auto'} />
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-4 w-[90%] mx-auto">
            {custom_links.map((link) => {
              if (link.type === 'header') {
                return <span>{link.title}</span>;
              } else {
                return (
                  <Link
                    key={link._id.toString()}
                    href={link.href}
                    target="_blank"
                    className="p-6 bg-white border rounded-lg w-full text-center shadow"
                  >
                    {link.title}
                  </Link>
                );
              }
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center">
          <span className="text-xs text-muted-foreground italic">
            Made with
          </span>
          <Logo />
        </div>
      </div>
    </>
  );
};

export default LinkNestUserPage;
