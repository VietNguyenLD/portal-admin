export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  email: string;
  password: string;
  phone: string;
  first_name: string;
  last_name: string;
  status: number;
  is_super_admin: boolean;
  name: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordVerifyRequest {
  key: string;
  pin: string;
  password: string;
}
