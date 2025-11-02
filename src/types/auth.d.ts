
export interface SignUp {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface Token {
  token: string;
}
