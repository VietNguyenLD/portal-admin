import { DataPermissionUser, DataStatus, FormCreateUser, FormInFoUser } from 'models/user';
import React from 'react';
import axiosClient from './axiosClient';
export const baseURL = process.env.REACT_APP_BASE_URL;

export const USER_URL = '/users';

const userApi = {
  getListUser: (formSearch?: string) => {
    if (formSearch) {
      return axiosClient.get(`${baseURL}${USER_URL}?search=${formSearch}`);
    }
    return axiosClient.get(`${baseURL}${USER_URL}`);
  },
  createUser: (formNew?: FormCreateUser) => {
    return axiosClient.post(`${baseURL}${USER_URL}`, formNew);
  },
  detailUser: (id: React.Key) => {
    return axiosClient.get(`${baseURL}${USER_URL}/detail/${id}`);
  },
  editUser: (id: string, data: FormInFoUser) => {
    return axiosClient.put(`${baseURL}${USER_URL}/update-info/${id}`, data);
  },
  addPermissionUser: (idUser: string, data: DataPermissionUser) => {
    return axiosClient.put(`${baseURL}${USER_URL}/change-group/${idUser}`, data);
  },
  updateStatusUser: (idUser: string, data: DataStatus) => {
    return axiosClient.put(`${baseURL}${USER_URL}/${idUser}/status`, data);
  },
};

export default userApi;
