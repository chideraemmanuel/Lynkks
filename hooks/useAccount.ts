import { AccountInterface } from '@/models/account';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const getAccount = async () => {
  const response = await axios.get<Omit<AccountInterface, 'password'>>(
    '/api/accounts/info',
    {
      withCredentials: true,
    }
  );

  console.log('response from use account hook', response);

  return response.data;
};

const useAccount = () => {
  return useQuery({
    queryKey: ['get current account'],
    queryFn: getAccount,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {
      console.log('error', error);
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useAccount;
