import { KYCProfileTempStatus, SubscriberStatus } from 'constants/kyc.enum';
import { ChangeSIMStatus, PhoneNumberType, SIMStatus } from 'constants/sim.enum';
import { TicketExpiredStatus, TicketStatus, TicketType } from 'constants/ticket.enum';

export interface Filters {
  page: number;
  limit: number;
  [key: string]: any;
}

export interface ResetSubscriberFiltersType extends Filters {
  [key: string]: any;
  'filter.kycStatus'?: number | '';
  'filter.unsubscription_status'?: boolean | '';
  'filter.recall_status'?: boolean | '';
}

export interface RequestChangeSimFilters extends Filters {
  'filter.status'?: ChangeSIMStatus | string;
  'filter.created_at'?: string;
}

export interface SimActivatedFilters extends Filters {
  'filter.mbf_code'?: string;
  'filter.distributor_id'?: string;
  'filter.activated_at'?: string;
  'filter.ticket_status'?: TicketStatus;
  'filter.kyc_temp_status'?: KYCProfileTempStatus;
  'filter.kyc_temp_updated_by'?: string;
  'filter.kyc_temp_updated_at'?: string;
  'filter.phone_number_type'?: PhoneNumberType;
  'filter.sim_status'?: SIMStatus;
}

export interface TicketFilters extends Filters {
  'filter.status'?: string | '';
  'filter.phone_number_status'?: SubscriberStatus | '';
  TicketExpiredStatus?: TicketExpiredStatus | '';
  'filter.type'?: TicketType | '';
  'filter.requested_count'?: number | '';
  'filter.updated_by'?: number;
  'filter.created_at'?: string;
}
