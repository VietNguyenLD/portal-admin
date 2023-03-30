import {
  AuthData,
  AuthRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordVerifyRequest,
} from 'models/auth';
import { AxiosResponse } from 'models/common';
import axiosClient from './axiosClient';

const authApi = {
  login: (data: AuthRequest): Promise<AxiosResponse<AuthData>> => {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },

  chagePassword: (data: ChangePasswordRequest): Promise<AxiosResponse<any>> => {
    const url = '/users/change-password';
    return axiosClient.put(url, data);
  },

  forgotPassword: (data: ForgotPasswordRequest): Promise<AxiosResponse<any>> => {
    const url = '/auth/forgot-password';
    return axiosClient.post(url, data);
  },

  forgotPasswordVerify: (data: ForgotPasswordVerifyRequest): Promise<AxiosResponse<any>> => {
    const url = '/auth/forgot-password/verify';
    return axiosClient.post(url, data);
  },
};

export default authApi;
