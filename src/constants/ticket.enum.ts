export enum TicketStatus {
  DRAFT = 1,
  REQUESTED = 2,
  USER_UPDATED = 3,
  CX_APPROVED = 4,
  MBF_REJECT = 5,
  DONE = 6,
  CANCELED = 7,
}

export enum TicketStatusText {
  DRAFT = 'Draft',
  REQUESTED = 'Đang yêu cầu cập nhật',
  USER_UPDATED = 'Chờ duyệt',
  WRONG_USER_DATA = 'Sai dữ liệu cục dân cư',
  CX_APPROVED = 'CX duyệt',
  MBF_REJECT = 'MBF từ chối',
  DONE = 'Hoàn thành',
  CANCEL = 'Huỷ',
}

export enum TicketType {
  CS = 1,
  US = 2,
  TL = 3,
}

export enum TicketTypeText {
  CS = 'CS',
  US = 'US',
  TL = 'TL',
}

export enum TicketPhoneNumberStatus {
  ACTIVE = 1,
  BLOCKED_1_WAY = 2,
  BLOCKED_2_WAY = 3,
  BLOCKED = 4,
}

export enum TicketPhoneNumberStatusText {
  ACTIVE = 'Đang hoạt động',
  BLOCKED_1_WAY = 'Bị khoá 1C',
  BLOCKED_2_WAY = 'Bị khoá 2C',
  BLOCKED = 'Bị huỷ dịch vụ',
}

export enum TicketExpiredStatus {
  NORMAL = 1,
  WARNING = 2,
  EXPIRED = 3,
}

export enum TicketExpiredStatusText {
  NORMAL = 'Bình thường',
  WARNING = 'Quá hạn xử lý',
  EXPIRED = 'Quá hạn cập nhật',
}

export enum ItemType {
  ID_FRONT = 1,
  ID_BACK = 2,
  PORTRAIT = 3,
  SIGNATURE = 4,
}

export enum ItemTypeText {
  ID_FRONT = 'Mặt trước CMND',
  ID_BACK = 'Mặt sau CMND',
  PORTRAIT = 'Chân dung',
  SIGNATURE = 'Chữ ký',
}

export enum KycProfileGender {
  MALE = 0,
  FEMALE = 1,
}

export enum KycIdType {
  CITIZEN_IDENTITY_CARD = 1,
  PASSPORT = 2,
}

/* Text */
export function ticketStatusText(type: TicketStatus) {
  switch (type) {
    case TicketStatus.DRAFT:
      return 'Draft';
    case TicketStatus.REQUESTED:
      return 'Đang yêu cầu cập nhật';
    case TicketStatus.USER_UPDATED:
      return 'Chờ duyệt';
    case TicketStatus.CX_APPROVED:
      return 'CX duyệt';
    case TicketStatus.MBF_REJECT:
      return 'MBF từ chối';
    case TicketStatus.DONE:
      return 'Hoàn thành';
    case TicketStatus.CANCELED:
      return 'Hủy';
  }
}
