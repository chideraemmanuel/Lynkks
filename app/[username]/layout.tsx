import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import ViewsUpdateProvider from '@/providers/views-update-provider';
import { Metadata, ResolvingMetadata } from 'next';
import { FC } from 'react';

interface Props {
  children: React.ReactNode;
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const { username } = params;

//   await connectToDatabase();
//   const account = await Account.findOne<AccountInterface>({
//     username,
//     email_verified: true,
//   });

//   console.log('metadata fetch response', account);

//   const previousImages = (await parent).openGraph?.images || [];

//   return {
//     title: account?.username.toUpperCase(),
//     description: account?.profile.bio,
//     // keywords: '',
//     openGraph: {
//       // images: [firstImage, ...previousImages],
//     },
//     alternates: {
//       canonical: `${process.env.CLIENT_BASE_URL}/${username}`,
//     },
//   };
// }

const LynkksUserLayout: FC<Props> = ({ children, params: { username } }) => {
  return (
    <>
      <ViewsUpdateProvider username={username}>{children}</ViewsUpdateProvider>
      {/* {children} */}
    </>
  );
};

export default LynkksUserLayout;
