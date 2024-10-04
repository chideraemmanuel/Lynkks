import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

const deleteProfileImage = async () => {
  const response = await axios.put(
    '/api/accounts/info/profile-image/delete',
    null,
    { withCredentials: true }
  );

  return response.data;
};

const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete profile image'],
    mutationFn: deleteProfileImage,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries('get current account');
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
