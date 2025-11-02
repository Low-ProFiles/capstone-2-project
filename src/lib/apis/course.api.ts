
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api';
import type { CourseDetails, CourseSummary, CreateCourseReq, UpdateCourseReq } from '@/types';

// API 호출 함수들
const searchCourses = async (query: string = ''): Promise<CourseSummary[]> => {
  // 실제 API는 Page<>를 반환하지만, 여기서는 간단하게 배열로 처리합니다.
  // 추후 무한 스크롤 구현 시 수정이 필요합니다.
  const response = await apiClient.get(`/courses?q=${query}`);
  return response.data.content; // Page 객체의 content를 반환
};

const getCourseDetails = async (id: string): Promise<CourseDetails> => {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data;
};

const createCourse = async (newCourse: CreateCourseReq): Promise<CourseDetails> => {
  const response = await apiClient.post('/courses', newCourse);
  return response.data;
};

const updateCourse = async ({ id, data }: { id: string; data: UpdateCourseReq }): Promise<CourseDetails> => {
  const response = await apiClient.put(`/courses/${id}`, data);
  return response.data;
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
  return useMutation<CourseDetails, Error, { id: string; data: UpdateCourseReq }>({
    mutationFn: updateCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', data.id] }); // 상세 정보 캐시도 무효화
    },
  });
};
