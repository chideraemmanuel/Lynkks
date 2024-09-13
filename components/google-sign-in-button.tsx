import { FC } from 'react';
import { Button } from './ui/button';
import { FcGoogle } from 'react-icons/fc';

interface Props {}

const GoogleSignInButton: FC<Props> = () => {
  return (
    <>
      <Button type="button" variant={'outline'} className="w-full">
        <FcGoogle className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </>
  );
};

export default GoogleSignInButton;
