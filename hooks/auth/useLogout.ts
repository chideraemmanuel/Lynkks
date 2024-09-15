import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Params {
  successCallback?: () => void;
}

// const logout = async ({ successCallback }: Params) => {
const logout = async () => {
  const response = await axios.delete<{ message: string }>(
    '/api/accounts/logout',
    { withCredentials: true }
  );

  console.log('response from use logout hook', response);

  return response.data;
  // return { data: response.data, successCallback };
};

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: (data) => {
      // const { data, successCallback } = returnValue;
      // WILL BE REDIRECTED TO APPROPRIATE ROUTE FROM ROUTE GUARD ONCE SESSION QUERY IS INVALIDATED

      queryClient.setQueryData('get current session', (oldSessionData: any) => {
        return null;
      });

      queryClient.setQueryData('get current account', (oldUserData: any) => {
        return null;
      });

      toast.success('Logout Successful');

      // if (successCallback) {
      //   successCallback();
      // }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Logout failed - Something went wrong'
        }`
      );
      // toast.error('Something went wrong');
    },
    onSettled: async () => {
      await queryClient.invalidateQueries('get current session');
      await queryClient.invalidateQueries('get current account');
      console.log('queries INVALIDATED!');
    },
  });
};

export default useLogout;
