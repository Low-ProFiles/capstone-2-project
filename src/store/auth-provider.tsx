'use client';

import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, getUserProfile } from '@/lib/api';
import type { Login, SignUp, UserProfileDto } from '@/types';
import { useAuthStore } from './auth.store';

// Re-defining for clarity, though it comes from the store
interface DecodedUser {
  sub: string;
    [key: string]: unknown;
}

// Define types for the auth context
interface AuthContextType {
  token: string | null;
  decodedUser: DecodedUser | null; // from JWT
  userProfile: UserProfileDto | null; // from API
  isAuthenticated: boolean;
  login: (credentials: Login, onSuccess?: () => void, onFailure?: (error: Error) => void) => Promise<void>;
  signup: (userData: SignUp) => Promise<string>;
  logout: () => void;
  setAuthToken: (newToken: string | null) => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { token, decodedUser, userProfile, setToken, setUserProfile, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    // If we have a token and decoded user, but no fetched profile yet
    if (token && decodedUser && !userProfile) {
      const fetchUser = async () => {
        try {
          const profile = await getUserProfile(token);
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile with token, logging out.', error);
          storeLogout(); // Log out if the token is invalid for fetching a profile
        }
      };
      fetchUser();
    }
  }, [token, decodedUser, userProfile, setUserProfile, storeLogout]);

  const login = async (credentials: Login, onSuccess?: () => void, onFailure?: (error: Error) => void) => {
    try {
      const data = await apiLogin(credentials);
      setToken(data.token);
      onSuccess?.();
    } catch (error) {
      console.error('Login failed:', error);
      onFailure?.(error as Error);
      throw error; // Re-throw to allow calling component to handle
    }
  };

  const signup = async (userData: SignUp): Promise<string> => {
    try {
      const message = await apiSignup(userData);
      return message;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    storeLogout();
  };

  const setAuthToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, decodedUser, userProfile, isAuthenticated, login, signup, logout, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

