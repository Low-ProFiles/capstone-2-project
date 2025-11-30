// src/store/course.store.ts
import { create } from "zustand";
import type { CourseSummary, CourseDetails } from "@/types/course";
import { getCourses, getCourseById, GetCoursesParams } from "@/lib/api"; // Reverting to lib/api for now
import type { Page } from "@/types/common";

interface CourseState {
  coursesPage: Page<CourseSummary> | null;
  courseDetails: CourseDetails | null;
  loading: boolean;
  error: string | null;
  fetchCourses: (params?: GetCoursesParams) => Promise<void>;
  fetchCourseDetails: (id: string) => Promise<void>;
  clearCourseDetails: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  coursesPage: null,
  courseDetails: null,
  loading: false,
  error: null,
  fetchCourses: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const page = await getCourses(params);
      set({ coursesPage: page, loading: false });
    } catch (err: unknown) {
      set({ error: (err as Error).message, loading: false });
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
