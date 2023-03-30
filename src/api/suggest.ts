import { SuggestCreate } from 'models/suggest';
import axiosClient from './axiosClient';

const suggestApi = {
  create: (params: SuggestCreate) => {
    return axiosClient.post(`/inform-update-request/create`, params);
  },
  edit: (id: string | number, params: SuggestCreate) => {
    return axiosClient.post(`/inform-update-request/update/${id}`, params);
  },
};

export default suggestApi;
