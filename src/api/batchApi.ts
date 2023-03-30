import { CreateBatchRequest } from 'models/batch';
import { generateParamString } from 'utils';
import axiosClient from './axiosClient';

export const SEND_BATCH_URL = '/send-batch';

const batchApi = {
  createBatch: (params: CreateBatchRequest) => {
    return axiosClient.post(`${SEND_BATCH_URL}/create`, params);
  },
  getById: (id: string, type: number) => {
    return axiosClient.get(`${SEND_BATCH_URL}/${id}/${type === 1 ? 'ticket' : 'sim'}-list`);
  },
  getSendBatchList: (params?: string) => {
    const url = `${SEND_BATCH_URL}/list?${params}`;
    return axiosClient.get(url);
  },
  editSendBatchData: (id: string, params: CreateBatchRequest) => {
    const url = `${SEND_BATCH_URL}/${id}/update`;
    return axiosClient.put(url, params);
  },
  submitSendBatchMBF: (id: string) => {
    const url = `${SEND_BATCH_URL}/${id}/submit-mbf`;
    return axiosClient.post(url);
  },

  /* request check info */
  getRequestCheckInfoBatchDetail: function (id: string) {
    const url = `/send-batch/request-batch/${id}`;
    return axiosClient.get(url);
  },

  getRequestCheckInfoListItem: function ({ id, ...query }: any) {
    const paramString = generateParamString(query);
    const url = `/send-batch/request-batch/list-items/${id}?${paramString}`;
    return axiosClient.get(url);
  },

  getSendActionDetail: function (id: number) {
    const url = `/send-batch/request-batch/action-detail/${id}`;
    return axiosClient.get(url);
  },
};

export default batchApi;
