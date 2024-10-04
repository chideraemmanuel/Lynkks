import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

interface Credentials {
  username: string;
  email: string;
  password: string;
}

const register = async (credentials: Credentials) => {
  const response = await axios.post<Omit<AccountInterface, 'password'>>(
    '/api/accounts/create',
    credentials
  );

  return response.data;
};

const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ['register'],
    mutationFn: register,
    onSuccess: (data) => {
      // router.replace('/auth/verify-email');
      router.replace('/dashboard');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Account creation failed - Something went wrong'
        }`
      );
    },
  });
};

export default useRegister;
