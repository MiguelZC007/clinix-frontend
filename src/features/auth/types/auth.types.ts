export type User = {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
};

export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
  confirmPassword: string;
};
