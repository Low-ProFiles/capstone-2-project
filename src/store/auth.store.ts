import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { UserProfileDto } from '@/types/profile';

// For the decoded token
interface DecodedUser {
  sub: string;
  email: string;
  nickname: string;
  [key: string]: unknown; // Allow other properties
}

interface AuthState {
  token: string | null;
  decodedUser: DecodedUser | null; // From the JWT
  userProfile: UserProfileDto | null; // From the API
  setToken: (token: string | null) => void;
  setUserProfile: (userProfile: UserProfileDto | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      decodedUser: null,
      userProfile: null,
      setToken: (token) => {
        if (token) {
          console.log("Attempting to decode token:", token);
          if (typeof token !== 'string' || token.split('.').length !== 3) {
            console.error("Token is not a valid JWT format (must be a string with 3 parts). Token:", token);
            set({ token: null, decodedUser: null, userProfile: null });
            return;
          }
          try {
            const decoded: DecodedUser = jwtDecode(token);
            set({ token, decodedUser: decoded, userProfile: null }); // Reset profile on new token
          } catch (error) {
            console.error('jwtDecode failed. Token:', token, 'Error:', error);
            set({ token: null, decodedUser: null, userProfile: null });
          }
        } else {
          set({ token: null, decodedUser: null, userProfile: null });
        }
      },
      setUserProfile: (userProfile) => set({ userProfile }),
      logout: () => set({ token: null, decodedUser: null, userProfile: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
