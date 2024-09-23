'use client';

import ErrorComponent from '@/components/error-component';
import FullScreenSpinner from '@/components/full-screen-spinner';
import { useSelectedUsernameContext } from '@/contexts/selected-username-context';
import axios, { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'sonner';

interface Props {}

const GoogleSignInCallbackPage: FC<Props> = () => {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get('code');
  const success_redirect_path = params.get('success_redirect_path');
  const error_redirect_path = params.get('error_redirect_path');
  const { selectedUsername, setSelectedUsername } =
    useSelectedUsernameContext();

  //   if (!code) {

  //   }

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sign in with google'],
    queryFn: async () => {
      const username = localStorage.getItem('lynkks_selected_username');

      console.log('lynkks_selected_username', username);

      const url = username
        ? `/api/accounts/login/google?code=${code}&success_redirect_path=${success_redirect_path}&error_redirect_path=${error_redirect_path}&selected_username=${username}`
        : `/api/accounts/login/google?code=${code}&success_redirect_path=${success_redirect_path}&error_redirect_path=${error_redirect_path}`;

      const response = await axios.get<{ message: string }>(url);

      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(data?.message || 'Sign in successful');

      localStorage.removeItem('lynkks_selected_username');
      await queryClient.invalidateQueries('get current session');
      router.replace(success_redirect_path || '/dashboard'); // redundant..?
    },
    onError: (error: AxiosError<{ error: string }>) => {
      // Authentication failed
      // if (error?.response?.data?.error === 'Authentication failed') {
      //   router.replace(error_redirect_path || '/auth/login');
      // }

      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Sign in failed - Something went wrong'
        }`
      );

      router.replace(error_redirect_path || '/auth/login');
    },
    retry: false,
  });

  if (error?.message === 'Network Error') {
    console.log('network error');
    return <ErrorComponent error={error} />;
  }

  if (
    error?.response?.data?.error === 'Internal Server Error' ||
    error?.response?.status === 500
  ) {
    console.log('server error');
    return <ErrorComponent error={error} />;
  }

  return (
    <>
      <FullScreenSpinner />
    </>
  );
};

export default GoogleSignInCallbackPage;
