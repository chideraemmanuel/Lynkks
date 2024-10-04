import { Range } from '@/app/api/analytics/route';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

interface AnalyticsReturnTypes {
  date: string;
  views: number;
  clicks: number;
}

const getAnalytics = async ({ queryKey }: { queryKey: any[] }) => {
  const range = queryKey[1];

  const response = await axios.get<AnalyticsReturnTypes[]>(
    `/api/analytics?range=${range}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const useAnalytics = (range: Range) => {
  return useQuery({
    queryKey: ['get analytics', range],
    queryFn: getAnalytics,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {},
  });
};

export default useAnalytics;
