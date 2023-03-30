export enum ChangeSIMType {
  GET_NEW = 'GET_NEW',
  LOST_SIM = 'LOST_SIM',
  DAMAGED_SIM = 'DAMAGED_SIM',
}

export enum ChangeSIMStatus {
  NEW = 'NEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CX_REJECT = 'CX_REJECT',
  EXPIRED = 'EXPIRED',
  MBF_REJECT = 'MBF_REJECT',
  DONE = 'DONE',
  PENDING_CHANGE_SIM = 'PENDING_CHANGE_SIM',
  OTP_VERIFIED = 'OTP_VERIFIED',
}

export enum SIMStatus {
  NOT_SALE = 1,
  IN_ACTIVE = 2,
  ACTIVATION_REQUEST = 3,
  ACTIVATION_SUCCESS = 4, // Inusage
  ACTIVATION_FAIL = 5,
  EXPIRED = 6,
}

export enum ChangeSIMExpiredStatus {
  NORMAL = 'NORMAL',
  EXPIRED_APPROVAL = 'EXPIRED_APPROVAL',
  EXPIRED_PAYMENT = 'EXPIRED_PAYMENT',
  EXPIRED_UPDATED = 'EXPIRED_UPDATED',
}

export enum PhoneNumberType {
  NORMAL = 1,
  NICE = 2,
  TRAVEL = 3,
}

export function changeSimExpiredStatusText(type: ChangeSIMExpiredStatus) {
  switch (type) {
    case ChangeSIMExpiredStatus.NORMAL:
      return 'Bình thường';
    case ChangeSIMExpiredStatus.EXPIRED_PAYMENT:
      return 'Quá hạn thanh toán';
    case ChangeSIMExpiredStatus.EXPIRED_UPDATED:
      return 'Quá hạn cập nhật';
    case ChangeSIMExpiredStatus.EXPIRED_APPROVAL:
      return 'Quá hạn xử lý';
  }
}

/* Text */
export function changeSIMStatusText(type: ChangeSIMStatus) {
  switch (type) {
    case ChangeSIMStatus.NEW:
      return 'New';
    case ChangeSIMStatus.PENDING_APPROVAL:
      return 'Chờ duyệt';
    case ChangeSIMStatus.PENDING_PAYMENT:
      return 'Chờ thanh toán';
    case ChangeSIMStatus.CX_REJECT:
      return 'Từ chối';
    case ChangeSIMStatus.EXPIRED:
      return 'Quá hạn xử lý';
    case ChangeSIMStatus.MBF_REJECT:
      return 'Thất bại';
    case ChangeSIMStatus.DONE:
      return 'Hoàn thành';
    case ChangeSIMStatus.PENDING_CHANGE_SIM:
      return 'Chờ đổi SIM';
    case ChangeSIMStatus.OTP_VERIFIED:
      return 'Đã xác minh OTP';
  }
}

export function changeSIMTypeText(type: ChangeSIMType) {
  switch (type) {
    case ChangeSIMType.GET_NEW:
      return 'Đổi sang SIM mới';
    case ChangeSIMType.DAMAGED_SIM:
      return 'Hỏng SIM';
    case ChangeSIMType.LOST_SIM:
      return 'Mất SIM';
  }
}

export function SIMStatusText(type: SIMStatus) {
  switch (type) {
    case SIMStatus.ACTIVATION_SUCCESS:
      return 'Inusage';
    case SIMStatus.EXPIRED:
      return 'Expired';
  }
}

export function ChangeSIMExpiredStatusText(type: ChangeSIMExpiredStatus) {
  switch (type) {
    case ChangeSIMExpiredStatus.NORMAL:
      return 'Bình thường';
    case ChangeSIMExpiredStatus.EXPIRED_APPROVAL:
      return 'Quá hạn phê duyệt';
    case ChangeSIMExpiredStatus.EXPIRED_PAYMENT:
      return 'Quá hạn thanh toán';
  }
}

export function phoneNumberTypeText(type: PhoneNumberType) {
  switch (type) {
    case PhoneNumberType.NORMAL:
      return 'Số thường';
    case PhoneNumberType.NICE:
      return 'Số đẹp';
  }
}

export function simUserTypeText(type: number) {
  switch (type) {
    case 1:
      return 'Chính chủ';
    case 2:
      return 'Con đẻ dưới 14 tuổi';
    case 3:
      return 'Con nuôi dưới 14 tuổi';
    case 4:
      return 'Người nhận giám hộ';
    case 5:
      return 'Cho thiết bị';
  }
}
