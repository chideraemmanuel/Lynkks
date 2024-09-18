import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';

interface AnalyticsTotalReturnTypes {
  views: {
    total: number;
    today: number;
  };
  clicks: {
    total: number;
    today: number;
  };
}

const getAnalyticsTotal = async () => {
  const response = await axios.get<AnalyticsTotalReturnTypes>(
    '/api/analytics/total',
    {
      withCredentials: true,
    }
  );

  console.log('response from use analytics total hook', response);

  return response.data;
};

const useAnalyticsTotal = () => {
  return useQuery({
    queryKey: ['get analytics total'],
    queryFn: getAnalyticsTotal,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {},
    onError: (error: AxiosError<{ error: string }>) => {},
  });
};

export default useAnalyticsTotal;
