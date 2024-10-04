import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

interface Param {
  username: string;
  visitor_id: string;
  referrer: string;
  referrer_full_url: string;
  ip_address: string;
}

interface Data extends Pick<Param, 'username' | 'visitor_id' | 'ip_address'> {
  referrer?: string;
  referrer_full_url?: string;
}

const updateViews = async ({
  username,
  visitor_id,
  referrer,
  referrer_full_url,
  ip_address,
}: Param) => {
  const data: Data = {
    username,
    visitor_id,
    ip_address,
  };

  if (referrer !== '') {
    data.referrer = referrer;
  }

  if (referrer_full_url !== '') {
    data.referrer_full_url = referrer_full_url;
  }

  const response = await axios.put<{ message: string }>(
    '/api/analytics/views',
    data
  );

  return response.data;
};

const useUpdateViews = () => {
  return useMutation({
    mutationKey: ['update views'],
    mutationFn: updateViews,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {},
  });
};

export default useUpdateViews;
