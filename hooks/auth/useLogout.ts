import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

const logout = async () => {
  const response = await axios.delete<{ message: string }>(
    '/api/accounts/logout',
    { withCredentials: true }
  );

  console.log('response from use logout hook', response);

  return response.data;
};

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSuccess: async (data) => {
      // WILL BE REDIRECTED TO APPROPRIATE ROUTE FROM ROUTE GUARD ONCE SESSION QUERY IS INVALIDATED

      //  router.replace('/login');
      //   await queryClient.invalidateQueries('get current session');

      toast.success('Logout Successful');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      //   toast.error(
      //     `${
      //       error?.response?.data?.error ||
      //       error?.message ||
      //       'Logout failed - Something went wrong'
      //     }`
      //   );
      toast.error('Something went wrong');
    },
  });
};

export default useLogout;
