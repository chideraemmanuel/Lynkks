import { Updates } from '@/app/api/accounts/info/route';
import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

// interface Updates {

// }

const updateAccount = async (updates: Updates & { profile_image?: File }) => {
  const response = await axios.put<AccountInterface>(
    '/api/accounts/info',
    updates,
    {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  console.log('response from update account hook', response);

  return response.data;
};

const useUpdateAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update account'],
    mutationFn: updateAccount,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries('get current account');

      // toast.success('Update Successful')
    },
    onError: (error: AxiosError<{ error: string }>) => {
      console.log('errorrr', error);

      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Something went wrong'
        }`
      );
    },
  });
};

export default useUpdateAccount;
