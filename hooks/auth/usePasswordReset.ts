import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

interface PasswordResetRequestParams {
  email: string;
}

const initiatePasswordResetFunction = async ({
  email,
}: PasswordResetRequestParams) => {
  const response = await axios.post<{ message: string }>(
    '/api/accounts/reset-password/initiate',
    {
      email,
      reset_page_path: '/auth/reset-password',
    }
  );

  console.log('response from initiate password reset hook', response);

  return response.data;
};

interface PasswordResetCompletionParams {
  email: string;
  reset_string: string;
  new_password: string;
}

const completePasswordResetFunction = async (
  credentials: PasswordResetCompletionParams
) => {
  const response = await axios.put<{ message: string }>(
    '/api/accounts/reset-password',
    credentials
  );

  console.log('response from complete reset password hook', response);

  return response.data;
};

const usePasswordReset = () => {
  // ! INITIATE PASSWORD RESET !
  const {
    mutate: initiatePasswordReset,
    isLoading: isInitiatingPasswordReset,
  } = useMutation({
    mutationKey: ['initiate password reset'],
    mutationFn: initiatePasswordResetFunction,
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset link sent successfully');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Failed to send reset email'
        }`
      );
    },
  });

  // ! COMPLETE PASSWORD RESET !
  const { mutate: resetPassword, isLoading: isResettingPassword } = useMutation(
    {
      mutationKey: ['reset password'],
      mutationFn: completePasswordResetFunction,
      onSuccess: (data) => {
        toast.success(data.message || 'Password updated successfully');
      },
      onError: (error: AxiosError<{ error: string }>) => {
        toast.error(
          `${
            error?.response?.data?.error ||
            error?.message ||
            'Failed to reset password'
          }`
        );
      },
    }
  );

  //
  return {
    initiatePasswordReset,
    isInitiatingPasswordReset,
    resetPassword,
    isResettingPassword,
  };
};

export default usePasswordReset;
