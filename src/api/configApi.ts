import { AppReasonRequest } from 'models/app.reason';
import axiosClient from './axiosClient';

const CONFIG_URL = '/config';

const configApi = {
  getTicketReasons: (params: { params: string }) => {
    return axiosClient.get(CONFIG_URL + '/ticket-reasons', { params });
  },
  getTicketReasonsV2: (text: string) => {
  let url = `v2${CONFIG_URL}/ticket-reasons?filter.is_active=$eq:1`
  if (text) {
      url = url + `&filter.items=${text}`
  }
    return axiosClient.get(url);
  },

  getParam: () => {
    const url = `${CONFIG_URL}/params`;
    return axiosClient.get(url);
  },
  editParam: (id: number, data: any) => {
    const url = `config/params/${id}`;
    return axiosClient.put(url, data);
  },
  addTicketReason: (data: any) => {
    const url = '/config/ticket-reasons';
    return axiosClient.post(url, data);
  },
  getTicketReason: () => {
    const url = '/config/ticket-reasons';
    return axiosClient.get(url);
  },
  editTicketReason: (id: number, data: any) => {
    const url = `/config/ticket-reasons/${id}`;
    return axiosClient.put(url, data);
  },
  createAppReason: (data: AppReasonRequest) => {
    const url = `${CONFIG_URL}/app-reason/create`;
    return axiosClient.post(url, data);
  },
  editAppReason: (id: number,data: AppReasonRequest) => {
    const url = `${CONFIG_URL}/app-reason/update/${id}`;
    return axiosClient.put(url, data);
  },
  getAppReasons: (text: string, type: number, active:string) => {
    let url = `${CONFIG_URL}/app-reason/list?filter.type=${type}`
    if (text) {
        url = url + `&filter.items=${text}`
    }
    if (active) {
        url = url + `&filter.is_active=${active}`
    }
    return axiosClient.get(url);
  },
};

export default configApi;
