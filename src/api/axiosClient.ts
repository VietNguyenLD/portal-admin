import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import jwt_decode from 'jwt-decode';
import _ from 'lodash';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_BASE_URL;
const currentUrl = window.location.origin;
let refreshTokenRequest: any = null;

const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post(`${baseURL}/auth/refresh_token`, {
      refreshToken,
    });
    const { status, data } = response;

    if (status === 201) {
      return data.data;
    }
  } catch (error) {
    localStorage.removeItem('access_token');
    window.location.replace(`${currentUrl}/auth/logout`);
  }
}

// Add a request interceptor
axiosClient.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    const token = localStorage.getItem('access_token');

    if (!token) return config;

    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    const tokenDecoded: { exp: number } = jwt_decode(token);

    const isExpired = dayjs.unix(tokenDecoded?.exp).diff(dayjs()) < 1;

    if (!isExpired) return config;

    refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : refreshToken();
    const newToken = await refreshTokenRequest;
    config.headers = {
      Authorization: `Bearer ${newToken}`,
    };
    localStorage.setItem('access_token', newToken);
    refreshTokenRequest = null;

    return config;
  },

  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    const { status, data } = response;
    return { status, data };
  },
  function (error) {
    const { data } = error.response;
    if (_.isArray(data.message) === true) {
      toast.error(data.message[0]);
      return;
    }
    toast.error(data.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
