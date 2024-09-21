import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();

  const accounts = await Account.find<AccountInterface>();

  const accountSitemaps = accounts.map((account) => ({
    url: `${process.env.CLIENT_BASE_URL}/${account.username
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')}`,
    lastModified: new Date(account.updatedAt),
  }));

  return [
    {
      url: `${process.env.CLIENT_BASE_URL}`,
      //   lastModified: new Date(),
      priority: 1,
    },
    // {
    //   url: `${process.env.CLIENT_BASE_URL}/about`,
    //   //   lastModified: new Date(),
    //   priority: 0.8,
    // },
    ...accountSitemaps,
  ];
}
