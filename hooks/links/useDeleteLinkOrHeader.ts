import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Param {
  link_id: string;
  section: 'custom_links' | 'social_links';
}

const deleteLinkOrHeader = async ({ link_id, section }: Param) => {
  const response = await axios.put<Omit<AccountInterface, 'password'>>(
    `/api/accounts/info/links/${link_id}/delete`,
    { section },
    { withCredentials: true }
  );

  console.log('response from delete link or header hook', response);

  return response.data;
};

const useDeleteLinkOrHeader = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete link or header'],
    mutationFn: deleteLinkOrHeader,
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

export default useDeleteLinkOrHeader;
