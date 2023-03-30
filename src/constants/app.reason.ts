export enum AppReasonType {
  TICKET_KYC = 1, // Lý do yêu cầu trong ticket
  BLOCK_SERVICE = 2, // Lý do khoá/mở 1C/2C, huỷ dịch vụ
}

export enum BlockServiceItem {
  BLOCK_1_WAY = 1,
  BLOCK_2_WAY = 2,
  UNSUBSCRIPTION = 3,
  UNLOCK = 4,
}