'use client';

import FullScreenSpinner from '@/components/full-screen-spinner';
import { useSelectedUsernameContext } from '@/contexts/selected-username-context';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { useQuery } from 'react-query';

interface Props {}

const GoogleSignInCallbackPage: FC<Props> = () => {
  const params = useSearchParams();
  const code = params.get('code');
  const success_redirect_path = params.get('success_redirect_path');
  const error_redirect_path = params.get('error_redirect_path');
  const { selectedUsername, setSelectedUsername } =
    useSelectedUsernameContext();

  //   if (!code) {

  //   }

  const {} = useQuery({
    queryKey: ['sign in with google'],
    queryFn: async () => {
      const username = localStorage.getItem('lynkks_selected_username');

      console.log('lynkks_selected_username', username);

      const url = username
        ? `/api/accounts/login/google?code=${code}&success_redirect_path=${success_redirect_path}&error_redirect_path=${error_redirect_path}&selected_username=${username}`
        : `/api/accounts/login/google?code=${code}&success_redirect_path=${success_redirect_path}&error_redirect_path=${error_redirect_path}`;

      await axios.get(url);

      return null;
    },
    onSuccess: () => {
      localStorage.removeItem('lynkks_selected_username');
    },
  });

  return (
    <>
      <FullScreenSpinner />
    </>
  );
};

export default GoogleSignInCallbackPage;
