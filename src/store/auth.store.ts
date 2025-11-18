
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// This should be the same as in AuthProvider
interface DecodedUser {
  sub: string;
  email: string;
  nickname: string;
  roles: string[];
  exp: number;
  iat: number;
}

interface AuthState {
  token: string | null;
  user: DecodedUser | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        try {
          const decoded: DecodedUser = jwtDecode(token);
          set({ token, user: decoded });
        } catch (error) {
          console.error('Failed to decode token:', error);
          set({ token: null, user: null });
        }
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 때 사용될 키
      storage: createJSONStorage(() => localStorage), // (optional) 로컬 스토리지를 사용
    }
  )
);
