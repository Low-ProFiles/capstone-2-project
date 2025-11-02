
import { useMutation } from '@tanstack/react-query';
import { apiFetch } from '../api';
import type { Login, SignUp, Token } from '@/types';

// 회원가입 API 함수
const signup = async (userData: SignUp): Promise<string> => {
  const response = await apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response;
};

// 로그인 API 함수
const login = async (credentials: Login): Promise<Token> => {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response;
};

// 회원가입을 위한 useMutation 훅
export const useSignUp = () => {
  return useMutation<string, Error, SignUp>({
    mutationFn: signup,
    onSuccess: (data) => {
      // 회원가입 성공 시 처리, 예를 들어 자동 로그인 또는 로그인 페이지로 리디렉션
      console.log('Signup successful:', data);
    },
    onError: (error) => {
      // 회원가입 실패 시 처리
      console.error('Signup failed:', error.message);
    },
  });
};

// 로그인을 위한 useMutation 훅
export const useLogin = () => {
  return useMutation<Token, Error, Login>({
    mutationFn: login,
    onSuccess: (data) => {
      // 로그인 성공 시 처리, 예를 들어 토큰 저장 및 사용자 정보 업데이트
      console.log('Login successful, token:', data.token);
      // Zustand 스토어에 토큰 저장 로직 추가
    },
    onError: (error) => {
      // 로그인 실패 시 처리
      console.error('Login failed:', error.message);
    },
  });
};
