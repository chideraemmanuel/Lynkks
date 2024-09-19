'use client';

import React, { ComponentPropsWithoutRef, ElementRef, FC } from 'react';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useQuery } from 'react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';

type GoogleSignInButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  username?: string;
  // success_redirect_path: string
  // error_redirect_path: string
};

type GoogleSignInButtonRef = ElementRef<typeof Button>;

const GoogleSignInButton = React.forwardRef<
  GoogleSignInButtonRef,
  GoogleSignInButtonProps
>(({ disabled, onClick, username, ...props }, ref) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ['get google oauth url'],
    queryFn: async () => {
      const queryStrings = new URLSearchParams();

      queryStrings.set('success_redirect_path', '/dashboard');
      queryStrings.set('error_redirect_path', pathname);

      if (username) {
        queryStrings.set('username', username);
      }

      console.log('queryStrings', queryStrings.toString());

      const response = await axios.get<{ url: string }>(
        `/api/accounts/login/google/get-url?${queryStrings.toString()}`
      );

      console.log('response from get google oauth url hook', response);

      return response.data;
    },
  });

  return (
    <>
      <Button
        type="button"
        variant={'outline'}
        ref={ref}
        // className="w-full"
        {...props}
        disabled={disabled || isLoading}
        onClick={(e) => {
          if (data) {
            router.push(data.url);
          }
          onClick && onClick(e);
        }}
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </>
  );
});

export default GoogleSignInButton;
