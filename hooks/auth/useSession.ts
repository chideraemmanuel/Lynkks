import { AccountInterface } from '@/models/account';
import { SessionInterface } from '@/models/session';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const getSession = async () => {
  const response = await axios.get<SessionInterface>('/api/session', {
    withCredentials: true,
  });

  console.log('response from use session hook', response);

  return response.data;
};

const useSession = () => {
  return useQuery({
    queryKey: ['get current session'],
    queryFn: getSession,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {
      console.log('error', error);
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useSession;
