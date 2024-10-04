import { connectToDatabase } from '@/lib/database';
import Account, { AccountInterface } from '@/models/account';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();

  const accounts = await Account.find<AccountInterface>();

  const accountSitemaps = accounts.map((account) => ({
    url: `${process.env.CLIENT_BASE_URL}/${account.username
      // replacing the characters to use html entities is not particularly necessary, as users won't be able to create accounts with them anyway.
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
    ...accountSitemaps,
  ];
}
