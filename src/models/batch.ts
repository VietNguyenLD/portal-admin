export interface CreateBatchRequest {
  item_ids: number[];
  type: number;
  description?: string;
}

export interface SendBatchFilter {
  limit: number;
  page: number;
  search?: string;
  'filter.status'?: string;
  'filter.type'?: string;
  'filter.sendbatch_type'?: string;
  'filter.created_by'?: string;
  'filter.created_at'?: string;
}
