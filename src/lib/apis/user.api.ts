
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './index';
import type { UserProfile } from '@/types';
import type { ProfileEditFormValues } from '@/types/form';

const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await api.get(`/users/${userId}/profile`);
  return response.data;
};

const updateUserProfile = async ({ userId, data }: { userId: string; data: ProfileEditFormValues }): Promise<UserProfile> => {
  const response = await api.put(`/users/${userId}/profile`, data);
  return response.data;
};

export const useGetUserProfile = (userId: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, { userId: string; data: ProfileEditFormValues }>({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', data.id] });
    },
  });
};
