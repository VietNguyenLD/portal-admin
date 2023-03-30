import queryString from 'query-string';
import axiosClient from './axiosClient';

export const SENDBATCH_URL = '/send-batch/import-batch';

const sendBatchApi = {
  createImportBatch: (params: { items_total: number; file_name: string; type: string }) => {
    return axiosClient.post(`${SENDBATCH_URL}/create`, params, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  },

  submitImportBatch: (params: { batch_id: number }) => {
    return axiosClient.post(`${SENDBATCH_URL}/submit`, params, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  },

  getListBatchItem: (params: any) => {
    const paramString = queryString.stringify(params.query);
    const url = `/send-batch/import-batch/${params?.batch_id}/list-item?${paramString}`;
    return axiosClient.get(url);
  },

  getImportBatchDetail: (id: string) => {
    const url = `/send-batch/import-batch/${id}/detail`;
    return axiosClient.get(url);
  },

  getResetBatchListItem: ({ id, query }: any) => {
    const paramsString = queryString.stringify(query, {
      skipEmptyString: true,
    });
    const url = `/send-batch/reset-batch/${id}/list-item?${paramsString}`;
    return axiosClient.get(url);
  },

  deleteImportBatchItem: (data: any) => {
    const url = '/send-batch/import-batch/delete';
    return axiosClient.post(url, data);
  },

  updateToDraft: (data: any) => {
    const url = '/send-batch/import-batch/update-to-draft-ticket';
    return axiosClient.post(url, data);
  },

  updateToTicket: (data: any) => {
    const url = '/send-batch/import-batch/update-to-ticket';
    return axiosClient.post(url, data);
  },

  importBatchList: (data: any) => {
    const url = '/send-batch/import-batch/importbatch/list';
    return axiosClient.get(url, data);
  },
};

export default sendBatchApi;
