export interface TicketRequest {
  page: number;
  limit?: number;
  search?: string;
}
export interface MarkDoneTicket {
  ticket_id: string | number;
}

export interface TicketReasonRequest {
  params: string;
}

export interface ReasonItem {
  id: number;
  reason: string;
}
export interface Reason {
  id: number;
  reason: string;
  items: number[];
  last_updated_by: string;
  last_updated_time: string;
  is_active: boolean;
}

export interface CreatedByUser {
  name: string;
  created_at: string;
}
export interface Ticket {
  batch_id: string;
  batchId_code: string;
  createdByUser: CreatedByUser | undefined;
  updated_at: string;
  items: number[];
  code: string;
  reasons: number[];
  status: number;
  id: number;
  extra_data: string;
  serial_number: string;
  requested_count: number;
  phone_number_status: number;
  created_at: string;
  note: string;
  author: string;
  type: number;
  expired_status: number;
  created_by: number;
  first_time_requested_at: string;
  phone_number: string;
  updated_by: number;
}

export interface TicketFilter {
  limit: number;
  page: number;
  search?: string;
  'filter.status'?: string;
  'filter.updated_by'?: string;
  'filter.phone_number_status'?: string;
  'filter.requested_count'?: string;
  'filter.type'?: string;
  'filter.created_by'?: string;
  'filter.created_at'?: string;
  'filter.updated_at'?: string;
  'filter.kycTempStatus'?: string;
  expiredProcessingStatus?: string;
  expiredUpdateMetrics?: string;
  from?: string;
  to?: string;
  TicketExpiredStatus?: string | number;
}
export interface TicketListResponse<T> {
  data: T[];
  message: string;
  path: string;
}

export interface TicketHistory {
  action_text?: string;
  operator: string;
  created_at: string;
  extra_data: {
    content: string;
    images?: string[];
  };
}

export interface TicketDashboard {
  expired_processing_total: number;
  waiting_for_approve_total: number;
  waiting_for_submit: number;
  expired_update_metrics: {
    metrics_1_14: number;
    metrics_15: number;
    metrics_16_29: number;
    metrics_30: number;
    metrics_31_59: number;
    metrics_60: number;
  };
}

export interface StatisticalRequest {
  type?: number;
  updated_by?: number;
  from?: string;
  to?: string;
}

export interface ReasonCancelTicket {
  reason: string;
}
