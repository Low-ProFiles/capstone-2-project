
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../api';
import type { CourseDetails, CourseSummary, CreateCourseReq } from '@/types';

// API 호출 함수들
const searchCourses = async (query: string = ''): Promise<CourseSummary[]> => {
  // 실제 API는 Page<>를 반환하지만, 여기서는 간단하게 배열로 처리합니다.
  // 추후 무한 스크롤 구현 시 수정이 필요합니다.
  const response = await apiFetch(`/api/courses?q=${query}`);
  return response.content;
};

const getCourseDetails = async (id: string): Promise<CourseDetails> => {
  const response = await apiFetch(`/api/courses/${id}`);
  return response;
};

const createCourse = async (newCourse: CreateCourseReq): Promise<CourseDetails> => {
  const response = await apiFetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify(newCourse),
  });
  return response;
};

const updateCourse = async ({ id, data }: { id: string; data: Partial<CreateCourseReq> }): Promise<CourseDetails> => {
  const response = await apiFetch(`/api/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response;
};

// 커스텀 훅들
export const useSearchCourses = (query: string) => {
  return useQuery<CourseSummary[], Error>({
    queryKey: ['courses', query],
    queryFn: () => searchCourses(query),
  });
};

export const useGetCourseDetails = (id: string) => {
  return useQuery<CourseDetails, Error>({
    queryKey: ['course', id],
    queryFn: () => getCourseDetails(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<CourseDetails, Error, CreateCourseReq>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] }); // 코스 목록 캐시 무효화
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation<CourseDetails, Error, { id: string; data: Partial<CreateCourseReq> }>({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', data.id] }); // 상세 정보 캐시도 무효화
    },
  });
};
