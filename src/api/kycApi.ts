import { KYCConfirmRequest, KYCPrepareRequest, KycRequest } from 'models/kyc';
import axiosClient from './axiosClient';

export const KYC_URL = '/kyc/update';

const kycApi = {
  senMBF: (params: KycRequest) => {
    return axiosClient.post(`${KYC_URL}/submit-mbf`, params);
  },

  prepare: (data: KYCPrepareRequest) => {
    const url = '/v2/kyc/update/prepare';
    return axiosClient.post(url, data);
  },

  confirm: (params: KYCConfirmRequest) => {
    return axiosClient.post(`${KYC_URL}/confirm`, params);
  },

  uploadImg: (url: string, file: File) => {
    return axiosClient.put(url, { body: file });
  },

  blockSubscription: (params: { kyc_id: number; type: number; reason_ids: [] }) => {
    return axiosClient.post('/kyc/block-subscription', params);
  },

  approve: (data: KycRequest) => {
    const url = '/kyc/approve';
    return axiosClient.post(url, data);
  },

  markDone: (data: KycRequest) => {
    const url = '/kyc/mark-done';
    return axiosClient.post(url, data);
  },

  delete: (data: KycRequest) => {
    const url = '/kyc/delete';
    return axiosClient.post(url, data);
  },
};

export default kycApi;
