
import { useMutation } from '@tanstack/react-query';

import api from './index'; // Import the axios instance

import type { LoginDto, SignUpDto, TokenDto } from '@/types/auth';



// API 호출 함수

export const signup = async (userData: SignUpDto): Promise<string> => {

  const response = await api.post('/auth/signup', userData);

  return response.data; // Axios wraps the response in a 'data' property

};



export const login = async (credentials: LoginDto): Promise<TokenDto> => {



  const response = await api.post('/auth/login', credentials);



  return response.data;



};



// 회원가입을 위한 useMutation 훅

export const useSignUp = () => {

  return useMutation<string, Error, SignUpDto>({ mutationFn: signup, });

};



// 로그인을 위한 useMutation 훅

export const useLogin = () => {

  return useMutation<TokenDto, Error, LoginDto>({ mutationFn: login, });

};
