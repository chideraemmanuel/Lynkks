import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Header {
  type: 'header';
  title: string;
}

interface Link {
  type: 'link';
  title: string;
  href: string;
}

type CustomType = Header | Link;

interface SocialType {
  platform:
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
    | 'Discord';
  href: string;
}

interface Custom {
  section: 'custom_links';
  link: CustomType;
}

interface Social {
  section: 'social_links';
  link: SocialType;
}

type Details = Custom | Social;

const addLinkOrHeader = async (details: Details) => {
  const response = await axios.put<AccountInterface>(
    '/api/accounts/info/links',
    details,
    { withCredentials: true }
  );

  return response.data;
};

const useAddLinkOrHeader = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add link or header'],
    mutationFn: addLinkOrHeader,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries('get current account');
      // await queryClient.refetchQueries('get current account');
      console.log('query INVALIDATED!');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Failed - Something went wrong'
        }`
      );
    },
  });
};

export default useAddLinkOrHeader;
