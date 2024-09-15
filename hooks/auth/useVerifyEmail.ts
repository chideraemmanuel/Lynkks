import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Credentials {
  email: string;
  OTP: string;
}

const verifyEmail = async (credentials: Credentials) => {
  const response = await axios.post<{ message: string }>(
    '/api/accounts/verify-email',
    credentials
  );

  console.log('response from verify email hook', response);

  return response.data;
};

const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['verify email'],
    mutationFn: verifyEmail,
    onSuccess: async (data) => {
      // WILL BE REDIRECTED TO APPROPRIATE ROUTE FROM EMAIL VERIFICATION PAGE ONCE ACCOUNT QUERY IS INVALIDATED
      //  router.replace('/dashboard');
      await queryClient.invalidateQueries('get current account');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Email verification failed - Something went wrong'
        }`
      );
    },
  });
};

export default useVerifyEmail;
