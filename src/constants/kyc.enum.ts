export enum KycIdType {
  CITIZEN_IDENTITY_CARD = 1,
  PASSPORT = 2,
}

export enum KycProfileGenderText {
  MALE = 'Nam',
  FEMALE = 'Nữ',
}

export enum KycIdTypeText {
  CITIZEN_IDENTITY_CARD = 'CMND',
  PASSPORT = 'PASSPORT',
}

export enum SubscriptionStatus {
  BLOCK_1_WAY = 1,
  BLOCK_2_WAY = 2,
  UNSUBSCRIPTION = 3,
  UNLOCK = 4,
}

export enum KYCProfileTempStatus {
  DRAFT = 1,
  DONE = 2,
  APPROVED = 3,
  MBF_REJECT = 4,
}

export enum SubscriberStatus {
  BLOCK_1_WAY = 1,
  BLOCK_2_WAY = 2,
  UNSUBSCRIPTION = 3,
  UNLOCK = 4,
}

export function subscriberStatusText(type: SubscriberStatus) {
  switch (type) {
    case SubscriberStatus.UNLOCK:
      return 'Đang hoạt động';
    case SubscriberStatus.BLOCK_1_WAY:
      return 'Bị khoá 1C';
    case SubscriberStatus.BLOCK_2_WAY:
      return 'Bị khoá 2C';
    case SubscriberStatus.UNSUBSCRIPTION:
      return 'Bị huỷ dịch vụ';
  }
}
