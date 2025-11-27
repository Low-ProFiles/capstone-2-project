
export interface User {
  id: string; // UUID
  email: string;
  nickname: string;
  avatarUrl: string;
  role: string;
  status: string;
}

export interface SignUp {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
}

export interface VerifyEmailReq {
  email: string;
  code: string;
}


export interface Login {
  email: string;
  password: string;
}

export interface Token {
  token: string;
}

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
