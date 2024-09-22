'use client';

import useUpdateViews from '@/hooks/analytics/useUpdateViews';
import { getCookie, setCookie } from '@/lib/cookie';
import getIPAddress from '@/lib/getIPAddress';
import axios from 'axios';
import { FC, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

interface Props {
  children: React.ReactNode;
  username: string;
}

const ViewsUpdateProvider: FC<Props> = ({ children, username }) => {
  const {
    mutate: updateViews,
    isLoading: isUpdatingViews,
    isError: isErrorUpdatingViews,
    error: viewsUpdateError,
  } = useUpdateViews();

  // const getIpAddress = async () => {
  //   const response = await axios.get<{ ip: string }>(
  //     'https://api.ipify.org/?format=json'
  //   );

  //   return response.data.ip;
  // };

  useEffect(() => {
    const trackView = async () => {
      // const visitor_id = getCookie('lynkks_${username}_viewed');

      const referrer = document.referrer;
      let referrer_hostname = '';
      let referrer_full_url = '';

      if (referrer) {
        const url = new URL(referrer);
        referrer_full_url = url.href;
        referrer_hostname = url.hostname;
      }

      const ip_address = await getIPAddress();

      updateViews({
        username,
        visitor_id: uuid(),
        referrer: referrer_hostname,
        referrer_full_url,
        ip_address,
      });
    };

    const cookieName = `lynkks_${username}_viewed`;
    const lastViewed = getCookie(cookieName);

    const currentTime = new Date().getTime();
    const THIRTY_MINUTES = 30 * 60 * 1000;

    if (!lastViewed || currentTime - +lastViewed > THIRTY_MINUTES) {
      // Track view
      trackView();

      // Set cookie with the current timestamp
      setCookie(cookieName, currentTime);
    }
  }, [username]);

  return <>{children}</>;
};

export default ViewsUpdateProvider;
