import { SOCIAL_MEDIA_PLATFORMS } from '@/constants';
import useUpdateClicks from '@/hooks/analytics/useUpdateClicks';
import getIconByPlatform from '@/lib/getIconByPlatform';
import getIPAddress from '@/lib/getIPAddress';
import { SocialLink } from '@/models/account';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface Props {
  link: SocialLink;
  username: string;
}

const LinkNestSocialLink: FC<Props> = ({ link, username }) => {
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
      link_section: 'social_links',
      ip_address: ipAddress,
      referrer: referrerHostname,
      referrer_full_url: referrerFullUrl,
    });
  };

  const Icon = getIconByPlatform(link.platform);

  return (
    <>
      <Link
        href={link.href}
        target="_blank"
        className="md:w-12 w-10 md:h-12 h-10"
        onClick={() => handleClick()}
      >
        {/* <RiWhatsappLine className="md:w-12 w-10 md:h-12 h-10" /> */}
        <Icon size={'auto'} />
      </Link>
    </>
  );
};

export default LinkNestSocialLink;
