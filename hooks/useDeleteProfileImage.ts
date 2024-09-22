import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

const deleteProfileImage = async () => {
  const response = await axios.put(
    '/api/accounts/info/profile-image/delete',
    null,
    { withCredentials: true }
  );

  console.log('response from delete profile image hook', response);

  return response.data;
};

const useDeleteProfileImage = () => {
  return useMutation({
    mutationKey: ['delete profile image'],
    mutationFn: deleteProfileImage,
    onSuccess: (data) => {
      toast.success('Image deleted successfully');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        `${
          error?.response?.data?.error ||
          error?.message ||
          'Failed - Something went wrong'
        }`
      );
    },
  });
};

export default useDeleteProfileImage;
