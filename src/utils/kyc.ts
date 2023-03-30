import { KYCProfileTempStatus, SubscriptionStatus } from 'constants/kyc.enum';

export function subscriptionStatusText(type: SubscriptionStatus) {
  switch (type) {
    case SubscriptionStatus.BLOCK_1_WAY:
      return 'Khóa 1 chiều';
    case SubscriptionStatus.BLOCK_2_WAY:
      return 'Khóa 2 chiều';
    case SubscriptionStatus.UNSUBSCRIPTION:
      return 'Hủy đăng ký';
    case SubscriptionStatus.UNLOCK:
      return 'Đang hoạt động';
  }
}

export function kycProfileTempStatusText(type: KYCProfileTempStatus) {
  switch (type) {
    case KYCProfileTempStatus.DRAFT:
      return 'Draft';
    case KYCProfileTempStatus.DONE:
      return 'Hoàn thành';
    case KYCProfileTempStatus.APPROVED:
      return 'Đã duyệt';
    case KYCProfileTempStatus.MBF_REJECT:
      return 'MBF từ chối';
  }
}
