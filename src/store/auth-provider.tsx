'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';
import type { Login, SignUp } from '@/types';
import { useAuthStore } from './auth.store';

// Define a type for the decoded JWT payload
interface DecodedUser {
  sub: string; // Subject (usually user ID)
  email: string;
  nickname: string;
  roles: string[];
  exp: number; // Expiration time
  iat: number; // Issued at time
}

// Define types for the auth context
interface AuthContextType {
  token: string | null;
  user: DecodedUser | null; // Add user to context type
  isAuthenticated: boolean;
  login: (credentials: Login, onSuccess?: () => void, onFailure?: (error: Error) => void) => Promise<void>;
  signup: (userData: SignUp) => Promise<string>; // Modified return type
  logout: () => void;
  setAuthToken: (newToken: string) => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { token, user, setToken, logout: storeLogout } = useAuthStore();

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

  // Modified signup to return the string message from the API
  const signup = async (userData: SignUp): Promise<string> => {
    try {
      const message = await apiSignup(userData);
      return message; // Return the message
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw to allow calling component to handle
    }
  };

  const logout = () => {
    storeLogout();
  };

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, signup, logout, setAuthToken }}>
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

