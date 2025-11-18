import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../api";
import type { Login, SignUp, Token } from "@/types";
import { useAuthStore } from "@/store/auth.store";

// 회원가입 API 함수
const signup = async (userData: SignUp): Promise<string> => {
  const response = await apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return response;
};

// 로그인 API 함수
const login = async (credentials: Login): Promise<Token> => {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  return response;
};

// 회원가입을 위한 useMutation 훅
export const useSignUp = () => {
  return useMutation<string, Error, SignUp>({
    mutationFn: signup,
    onSuccess: () => {
      window.location.href = "/login";
    },
    onError: () => {
      // 회원가입 실패 시 처리
      // console.error('회원가입 실패:', error.message); // Removed console.error
      // alert(`회원가입에 실패했습니다: ${error.message}`); // Removed alert
    },
  });
};

// 로그인을 위한 useMutation 훅
export const useLogin = () => {
  return useMutation<Token, Error, Login>({
    mutationFn: login,
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.token);
      window.location.href = "/";
    },
    onError: () => {
      // 로그인 실패 시 처리
      // console.error('로그인 실패:', error.message); // Removed console.error
      // alert(`로그인에 실패했습니다: ${error.message}`); // Removed alert
    },
  });
};
