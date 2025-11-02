'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup } from '@/lib/api';

// Define types for the auth context
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Try to load the token from localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials: any) => {
    const data = await apiLogin(credentials);
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
  };

  const signup = async (userData: any) => {
    await apiSignup(userData);
    // Optional: automatically log in the user after signup
    // const data = await apiLogin({ email: userData.email, password: userData.password });
    // setToken(data.token);
    // localStorage.setItem('authToken', data.token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const setAuthToken = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, signup, logout, setAuthToken }}>
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
