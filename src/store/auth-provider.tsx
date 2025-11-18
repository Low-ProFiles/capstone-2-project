'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup, type LoginDto, type SignUpDto } from '@/lib/api';
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
  login: (credentials: LoginDto, onSuccess?: () => void, onFailure?: (error: Error) => void) => Promise<void>;
  signup: (userData: SignUpDto, onSuccess?: () => void, onFailure?: (error: Error) => void) => Promise<void>;
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

  const login = async (credentials: LoginDto, onSuccess?: () => void, onFailure?: (error: Error) => void) => {
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

  const signup = async (userData: SignUpDto, onSuccess?: () => void, onFailure?: (error: Error) => void) => {
    try {
      await apiSignup(userData);
      onSuccess?.();
    } catch (error) {
      console.error('Signup failed:', error);
      onFailure?.(error as Error);
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

