import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfileDto } from '@/types/profile';

interface AuthState {
  token: string | null;
  userProfile: UserProfileDto | null;
  setToken: (token: string | null) => void;
  setUserProfile: (userProfile: UserProfileDto | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userProfile: null,
      setToken: (token) => set({ token, userProfile: null }), // Clear profile on new token
      setUserProfile: (userProfile) => set({ userProfile }),
      logout: () => set({ token: null, userProfile: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
