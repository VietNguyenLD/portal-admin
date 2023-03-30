import { KycRequest } from 'models/kyc';
import { ChangeSimReject, ChangeSimRequest } from 'models/sim';
import { generateParamString } from 'utils';
import axiosClient from './axiosClient';

export const SIM_URL = '/sim';

const simApi = {
  senMBF: (params: KycRequest) => {
    return axiosClient.post(`${SIM_URL}/submit-mbf`, params);
  },

  simDetailBySerial: (serial: string) => {
    return axiosClient.get(`${SIM_URL}/${serial}/detail`);
  },

  getSimActivatedList: (params?: any) => {
    const paramString = generateParamString(params);
    const url = `/v2/sim/activated-sims?${paramString}`;
    return axiosClient.get(url);
  },

  getSimInfoBySerial: (serial: string) => {
    const url = `${SIM_URL}/${serial}/detail`;
    return axiosClient.get(url);
  },

  getChangeSimList: (params?: any) => {
    const paramString = generateParamString(params);
    const url = `${SIM_URL}/change-sim/list?${paramString}`;
    return axiosClient.get(url);
  },

  getChangeSimInfoById: (id: string) => {
    const url = `${SIM_URL}/change-sim/${id}`;
    return axiosClient.get(url);
  },

  changeSimApprove: (data: ChangeSimRequest) => {
    const url = `${SIM_URL}/change-sim/approve`;
    return axiosClient.post(url, data);
  },

  changeSimReject: (data: ChangeSimReject) => {
    const url = `${SIM_URL}/change-sim/reject`;
    return axiosClient.post(url, data);
  },

  getRequestNewSIMList: function ({ type, ...query }: any) {
    const paramString = generateParamString(query);
    const url = `/sim/change-sim/list?filter.type=$in:${type}${paramString && '&' + paramString}`;
    return axiosClient.get(url);
  },

  getRequestNewSIMDetail: function (id: string) {
    const url = `/sim/change-sim/${id}`;
    return axiosClient.get(url);
  },

  doneRequestNewSIM: function (data: any) {
    const url = '/sim/change-sim/mark-done';
    return axiosClient.post(url, data);
  },
};

export default simApi;
