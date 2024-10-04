import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

const logout = async () => {
  const response = await axios.delete<{ message: string }>(
    '/api/accounts/logout',
    { withCredentials: true }
  );

  return response.data;
};

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: (data) => {
      queryClient.setQueryData('get current session', (oldSessionData: any) => {
        return null;
      });

      queryClient.setQueryData('get current account', (oldUserData: any) => {
        return null;
      });

      toast.success('Logout Successful');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Logout failed - Something went wrong'
        }`
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries('get current session');
      await queryClient.invalidateQueries('get current account');

      const sessionQuery = queryClient.getQueryState('get current session');
      const accountQuery = queryClient.getQueryState('get current account');

      console.log('Session query state after invalidation:', sessionQuery);
      console.log('Account query state after invalidation:', accountQuery);

      await queryClient.refetchQueries('get current session');

      console.log('queries INVALIDATED and refetched!');
    },
  });
};

export default useLogout;
