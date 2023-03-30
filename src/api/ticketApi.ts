import { MarkDoneTicket, StatisticalRequest } from 'models/ticket';
import { generateParamString } from 'utils';
import axiosClient from './axiosClient';

export const TICKET_URL = '/ticket';
export const TICKET_URL_HIS = '/ticket/histories';

const ticketApi = {
  getOne: (id: string) => {
    return axiosClient.get(`${TICKET_URL}/detail/${id}`);
  },

  getTicketSim: (id: string) => {
    return axiosClient.get(`${TICKET_URL}/detail/${id}/sim`);
  },

  getHistoryTicket: (id: string) => {
    return axiosClient.get(`${TICKET_URL}/histories/${id}`);
  },

  markDoneTicket: (params: MarkDoneTicket) => {
    return axiosClient.post(`${TICKET_URL}/mark-done`, params);
  },

  rejectTicket: (id: number, params: { items: number[]; reason_ids: number[] }) => {
    return axiosClient.post(`${TICKET_URL}/${id}/submit`, params);
  },

  histories: (id: string) => {
    return axiosClient.get(`${TICKET_URL}/histories/${id}`);
  },

  getTicketList: (params?: any) => {
    const paramString = generateParamString(params);
    const url = `/ticket/list?${paramString}`;
    return axiosClient.get(url);
  },

  getTicketApprovedList: (params?: any) => {
    const url = `/ticket/list?${params}`;
    return axiosClient.get(url);
  },

  createTicket: (data: any) => {
    const url = '/ticket/create';
    return axiosClient.post(url, data);
  },

  submitTicket: (id: any) => {
    const url = `/ticket/${id}/submit`;
    return axiosClient.post(url);
  },

  deleteTicket: (ticketId: number) => {
    const url = `/ticket/${ticketId}/delete`;
    return axiosClient.delete(url);
  },

  dashboard: () => {
    return axiosClient.get(`${TICKET_URL}/dashboard`);
  },

  statistical: (params: StatisticalRequest | undefined) => {
    return axiosClient.get(`${TICKET_URL}/statistical`, { params });
  },

  cancelTicket: (ticketId: number, reason: string) => {
    const url = `/ticket/${ticketId}/cancel`;
    return axiosClient.post(url, { reason });
  },

  approve: (ticketId: number) => {
    const url = `/ticket/${ticketId}/approve`;
    return axiosClient.post(url);
  },
};

export default ticketApi;
