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
import LinkNestLink from '@/components/linknest-link';
import LinkNestSocialLink from '@/components/linknest-social-link';
import { link } from 'fs';

interface Props {
  params: { username: string };
}

const LinkNestUserPage: FC<Props> = async ({ params: { username } }) => {
  await connectToDatabase();
  const account = await Account.findOne<AccountInterface>({
    username,
    email_verified: true,
  });

  if (!account) notFound();

  const {
    first_name,
    last_name,
    profile,
    links: { custom_links, social_links },
  } = account;

  // console.log({ custom_links, social_links });

  // const Icon = getIcon();

  return (
    <>
      <div className="bg-gradient-4 min-h-screen py-10 flex flex-col">
        {/* <div className="min-h-screen py-10 flex flex-col"> */}
        {/* <div className="bg-blue-300 w-[min(700px,_90%)] mx-auto flex-1"> */}
        <div className="w-[min(700px,_90%)] mx-auto flex-1">
          <div className="flex flex-col items-center gap-1 text-center mb-7">
            <div className="rounded-[50%] shadow-lg border-[4px] md:w-[120px] w-[90px] md:h-[120px] h-[90px] mb-3">
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
            {social_links.map((link) => (
              <LinkNestSocialLink
                key={link._id.toString()}
                // link={link} // ! cannot pass unserialized data to client component from server component
                link_id={link._id.toString()}
                link_href={link.href}
                link_platform={link.platform}
                username={username}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 w-[90%] mx-auto">
            {custom_links.map((link) => {
              if (link.type === 'header') {
                return (
                  <span
                    key={link._id.toString()}
                    className="text-xl font-semibold text-muted-foreground"
                  >
                    {link.title}
                  </span>
                );
              } else {
                return (
                  <LinkNestLink
                    key={link._id.toString()}
                    // link={link} // ! cannot pass unserialized data to client component from server component
                    link_id={link._id.toString()}
                    link_href={link.href}
                    link_title={link.title}
                    username={username}
                  />
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
