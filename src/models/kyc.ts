import { Gender } from 'constants/common.enum';
import { KycIdType, KYCProfileTempStatus, SubscriptionStatus } from 'constants/kyc.enum';
import { Address } from './common';

export interface KycRequest {
  kyc_id: number;
}

export interface KYCPrepareRequest {
  kyc_id: number;
  id_front_img: boolean;
  id_back_img: boolean;
  selfie_img: boolean;
  signature_img: boolean;
}

export interface KYCConfirmRequest {
  kyc_id: number;
  id_front_path: string;
  id_back_path: string;
  selfie_path: string;
  signature_path: string;
  full_name: string;
  gender: string;
  id_type: number;
  id_number: string;
  dob: string;
  issue_date: string;
  issue_place_code: string;
  expiry_date: string;
  address: string;
  district_code: string;
  province_code: string;
  ward_code: string;
  isCommittingKyc: any;
}

export interface PrepareResponse {
  path: string;
  path_type: string;
  link_upload: string;
}

export interface KYC extends Address {
  id: number;
  fullname: string;
  dob: string;
  gender: Gender;
  idType: KycIdType;
  idNumber: string;
  issueDate: string;
  issuePlace: string;
  frontImg: string;
  backImg: string;
  faceImg: string;
  signImg: string;
  documentURL: string;
  subscriptionStatus: SubscriptionStatus;
}

export interface KYCTemp extends Address {
  full_name: string;
  dob: string;
  gender: Gender;
  id_type: KycIdType;
  id_number: string;
  issue_date: string;
  issue_place: string;
  status: KYCProfileTempStatus;
}
