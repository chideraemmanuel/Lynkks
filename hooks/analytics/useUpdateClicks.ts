import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

interface Param {
  username: string;
  visitor_id: string;
  referrer: string;
  referrer_full_url: string;
  ip_address: string;
  link_id: string;
  link_section: 'custom_links' | 'social_links';
}

interface Data
  extends Pick<
    Param,
    'username' | 'visitor_id' | 'ip_address' | 'link_id' | 'link_section'
  > {
  referrer?: string;
  referrer_full_url?: string;
}

const updateClicks = async ({
  username,
  visitor_id,
  link_id,
  link_section,
  referrer,
  referrer_full_url,
  ip_address,
}: Param) => {
  const data: Data = {
    username,
    visitor_id,
    link_id,
    link_section,
    ip_address,
  };

  if (referrer !== '') {
    data.referrer = referrer;
  }

  if (referrer_full_url !== '') {
    data.referrer_full_url = referrer_full_url;
  }

  const response = await axios.put<{ message: string }>(
    '/api/analytics/clicks',
    data
  );

  console.log('response from update click hook', response);

  return response.data;
};

const useUpdateClicks = () => {
  return useMutation({
    mutationKey: ['update clicks'],
    mutationFn: updateClicks,
    onSuccess: (data) => {
      console.log('click update success', data);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log('click update error', error);
    },
  });
};

export default useUpdateClicks;
