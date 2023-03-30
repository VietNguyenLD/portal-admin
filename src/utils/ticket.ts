import { TicketStatus } from 'constants/ticket.enum';

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

export function ticketExpiredStatusToText(type: number) {
  switch (type) {
    case 1:
      return 'Bình thường';
    case 2:
      return 'Quá hạn xử lý';
    case 3:
      return 'Quá hạn cập nhật';
  }
  return '';
}

export function genderTypeToText(type: number) {
  switch (type) {
    case 0:
      return 'Nam';
    case 1:
      return 'Nữ';
  }
  return '';
}

export function idTypeToText(type: number) {
  switch (type) {
    case 1:
      return 'CMND';
    case 2:
      return 'Passport';
  }
  return '';
}

export function ticketStatusInBatchToText(type: number) {
  switch (type) {
    case 1:
      return 'Draft';
    case 2:
      return 'Đang yêu cầu cập nhật';
    case 3:
      return 'User đã cập nhập';
    case 4:
      return 'CX duyệt';
    case 5:
      return 'MBF từ chối';
    case 6:
      return 'Hoàn thành';
    case 7:
      return 'Hủy bỏ';
  }
  return '';
}
