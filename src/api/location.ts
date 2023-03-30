import { LocationListRequest } from 'models/location';
import axiosClient from './axiosClient';

export const LOCATION_URL = '/location';

const locationApi = {
  getIssuePlace: () => {
    return axiosClient.get(`${LOCATION_URL}/issue-place`);
  },
  getListLocation: (params: LocationListRequest) => {
    return axiosClient.get(`${LOCATION_URL}/list`, { params });
  },
};

export default locationApi;
