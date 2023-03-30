import { Gender } from 'constants/common.enum';
import { ChangeSIMStatus, ChangeSIMType } from 'constants/sim.enum';
import { Address, Device } from './common';
import { Distributor } from './distributor';
import { KYC, KYCTemp } from './kyc';
import { Ticket } from './ticket';

export interface ActiveSim {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  is_active: number;
  activated_at: string;
  expire_at: string;
  kyc_id: number;
  sim_id: string;
  ticket_id: number;
  kycProfile: string | null;
}

export interface SimType {
  name: string;
}

export interface SimLot {
  name: string;
  distributor: Distributor;
}

export interface SimTap {
  created_at: string;
  updated_at: string;
  serial_number: string;
  pair_code: string;
  phone_number: string;
  type_id: number;
  valid_days: number;
  status: number;
  sim_lot_id: number;
  area_code: string | null;
  mbf_type: number;
  mbf_code: string;
  mbf_id: string;
  subscriberStatus: number;
  timeoutAt: string | null;
  activationRequestTimeoutId: string | null;
  retryTimes: string;
  zone: string | null;
  zoneChangeTimes: string;
  omsOrderId: string;
  simLot: SimLot;
}

export interface SimActivated {
  activated_at: string;
  id: number;
  kycProfile: null;
  kyc_id: number;
  sim: any;
  serial_number: number;
}

export interface Sim extends Device {
  phone_number: string;
  activated_at: string;
  serial_number: string;
  mbf_code: string;
  simLot: SimLot;
  simType: SimType;
}

export interface SimDetail {
  kyc: KYC;
  kyc_temp: KYCTemp;
  ticket: Ticket;
  sim: any;
}
export interface SimFilter {
  limit: number;
  page: number;
  'filter.updated_by'?: string;
  'filter.updated_at'?: string;
  'filter.kyc_temp_updated_by'?: string;
  'filter.kyc_temp_updated_at'?: string;
  'filter.kyc_temp_status'?: string;
  'filter.no_actived_ticket'?: string;
}

export interface RequestChangeSIM {
  id: number;
  code: string;
  old_serial: string;
  new_serial: string;
  phone_number: string;
  full_name: string;
  id_number: string;
  type: ChangeSIMType;
  status: ChangeSIMStatus;
  created_at: string;
  updated_at: string;
}

export interface KYCProfile extends Address {
  phoneNum: string;
  fullname: string;
  gender: Gender;
  dob: string;
}

export interface ChangeSimRequest {
  request_id: number;
}
export interface ChangeSimReject {
  request_id: number;
  verify_ownership?: any
}
