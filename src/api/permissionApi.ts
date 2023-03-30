import { CreatePermissionRequest } from 'models/permission';
import axiosClient from './axiosClient';

export const PERMISSION_URL = '/group';
const permissionApi = {
  groupPermisson: (id: string) => {
    return axiosClient.get(`${PERMISSION_URL}/permission/${id}`);
  },
  allPermission: () => {
    return axiosClient.get(`${PERMISSION_URL}/all-permission`);
  },
  create: (id: string, params: CreatePermissionRequest) => {
    return axiosClient.put(`${PERMISSION_URL}/change-permission/${id}`, params);
  },
  group: () => {
    return axiosClient.get(`${PERMISSION_URL}?isActive=1`);
  },
  createPermissionGroup: (params: any) => {
    return axiosClient.post(`${PERMISSION_URL}/create-group-user`, params);
  }
};
export default permissionApi;
