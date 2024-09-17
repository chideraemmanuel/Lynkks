'use client';

import useUpdateClicks from '@/hooks/analytics/useUpdateClicks';
import getIPAddress from '@/lib/getIPAddress';
import { CustomLink, Hyperlink } from '@/models/account';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface Props {
  link: Hyperlink;
  username: string;
}

const LinkNestLink: FC<Props> = ({ link, username }) => {
  const [referrerFullUrl, setReferrerFullUrl] = useState('');
  const [referrerHostname, setReferrerHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  const {
    mutate: updateClicks,
    isLoading: isUpdatingClicks,
    isError: isErrorUpdatingClicks,
    error: clicksUpdateError,
  } = useUpdateClicks();

  useEffect(() => {
    const getCreds = async () => {
      const referrer = document.referrer;

      if (referrer) {
        const url = new URL(referrer);
        setReferrerFullUrl(url.href);
        setReferrerHostname(url.hostname);
      }

      const ip_address = await getIPAddress();
      setIpAddress(ip_address);
    };

    getCreds();
  }, []);

  const handleClick = () => {
    updateClicks({
      username,
      visitor_id: uuid(),
      link_id: link._id.toString(),
      link_section: 'custom_links',
      ip_address: ipAddress,
      referrer: referrerHostname,
      referrer_full_url: referrerFullUrl,
    });
  };

  return (
    <>
      <Link
        href={link.href}
        target="_blank"
        className="p-6 bg-white border rounded-lg w-full text-center shadow"
        onClick={() => handleClick()}
      >
        {link.title}
      </Link>
    </>
  );
};

export default LinkNestLink;
