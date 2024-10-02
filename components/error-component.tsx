import { FC } from 'react';

interface Props {
  error: any;
}

const ErrorComponent: FC<Props> = ({ error }) => {
  // console.log('error', error);

  const message = (): string => {
    if (error?.message === 'Network Error') {
      return 'Network Error';
    }

    if (
      error?.response?.data?.error === 'Internal Server Error' ||
      error?.response?.status === 500
    ) {
      return 'Internal Server Error';
    }

    if (
      error &&
      !(error?.response?.status > 400 && error?.response?.status < 500)
    ) {
      return error?.response?.data?.error || error?.message;
      // 'A client side error occured';
    }

    return 'A client side error occured';
  };

  return (
    <>
      <div className="fixed inset-0 w-screen h-screen z-[100] bg-white flex items-center justify-center">
        <p className="text-center text-xs w-[90%]">{message()}</p>
      </div>
    </>
  );
};

export default ErrorComponent;
