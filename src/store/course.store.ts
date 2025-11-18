// src/store/course.store.ts
import { create } from "zustand";
import type { CourseSummary, CourseDetails } from "@/types/course";
import { getCourses, getCourseById, GetCoursesParams } from "@/lib/api"; // Reverting to lib/api for now
import type { Page } from "@/types/common";

interface CourseState {
  courses: CourseSummary[];
  courseDetails: CourseDetails | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  fetchCourses: (params?: GetCoursesParams) => Promise<void>;
  fetchCourseDetails: (id: string) => Promise<void>;
  clearCourseDetails: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  courseDetails: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
  fetchCourses: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      // The API doesn't support Page yet, so we'll mock it
      const courses: CourseSummary[] = await getCourses(params);
      const page: Page<CourseSummary> = {
        content: courses || [],
        totalPages: 1,
        totalElements: (courses || []).length,
        size: 10,
        number: 0,
        first: true,
        last: true,
        empty: (courses || []).length === 0,
      };
      set((state) => {
        return {
          courses: page.content || [],
          pagination: {
            page: page.number,
            size: page.size,
            totalPages: page.totalPages,
            totalElements: page.totalElements,
          },
          loading: false,
        };
      });
    } catch (err: unknown) {
      set(() => {
        console.error("fetchCourses: Error fetching:", (err as Error).message);
        return { error: (err as Error).message, loading: false };
      });
    }
  },
  fetchCourseDetails: async (id: string): Promise<void> => {
    set({ loading: true, error: null }); 
    try {
      const details = await getCourseById(id);
      set({ courseDetails: details, loading: false });
    } catch (err: unknown) {
      set({ error: (err as Error).message, loading: false }); // Set error if API call fails
    }
  },
  clearCourseDetails: () => {
    set({ courseDetails: null });
  },
}));
