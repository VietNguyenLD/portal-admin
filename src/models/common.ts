export interface AxiosResponse<T> {
  data: BaseResponse<T>;
  status: number;
}

export interface BaseResponse<T> {
  message: string;
  data: T;
  path: string;
}
export interface DataResponse<T> {
  data: T;
}

export interface Device {
  device_id: string;
}

export interface Address {
  address: string;
  province: string;
  district: string;
  ward: string;
}
