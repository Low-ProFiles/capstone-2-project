
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api';
import type { Category } from '@/types';

// API 호출 함수
const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories');
  return response.data;
};

// 커스텀 훅
export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시된 데이터를 사용
  });
};
