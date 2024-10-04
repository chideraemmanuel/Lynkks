import { SessionInterface } from '@/models/session';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

const getSession = async () => {
  const response = await axios.get<SessionInterface>('/api/session', {
    withCredentials: true,
  });

  return response.data;
};

const useSession = () => {
  return useQuery({
    queryKey: ['get current session'],
    queryFn: getSession,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {},
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useSession;
