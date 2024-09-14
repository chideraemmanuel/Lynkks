import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

const resendVerificationOTP = async (email: string) => {
  const response = await axios.post<{ message: string }>(
    '/api/accounts/resend-otp',
    { email }
  );

  console.log('response from resend otp hook', response);

  return response.data;
};

const useResendVerificationOTP = () => {
  return useMutation({
    mutationKey: ['resend verification otp'],
    mutationFn: resendVerificationOTP,
    onSuccess: (data) => {
      toast.success('OTP sent. Please check your email.');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Login failed - Something went wrong'
        }`
      );
    },
  });
};

export default useResendVerificationOTP;
