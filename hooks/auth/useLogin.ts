import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Credentials {
  email: string;
  password: string;
}

const login = async (credentials: Credentials) => {
  const response = await axios.post<Omit<AccountInterface, 'password'>>(
    '/api/accounts/login',
    credentials
  );

  return response.data;
};

const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: async (data) => {
      toast.success('Login Successful');
      // WILL BE REDIRECTED TO APPROPRIATE ROUTE FROM AUTH ROUTES GUARD ONCE SESSION QUERY IS INVALIDATED
      await queryClient.invalidateQueries('get current session');
      router.replace('/dashboard'); // redundant..?
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Login failed - Something went wrong'
        }`
      );
    },
  });
};

export default useLogin;
