import { TicketStatus } from 'constants/ticket.enum';
import { UserStatus } from 'constants/user.enum';

export const unitTypeToText = (type: number) => {
  switch (type) {
    case 3:
      return 'Giờ';
    case 4:
      return 'Ngày';
    case 6:
      return 'Lần';
  }
  return '';
};
export const checkStatusTicket = (statusTicket: number[]): boolean => {
  let flag = false;
  statusTicket.forEach((item) => {
    switch (item) {
      case TicketStatus.DRAFT:
        flag = true;
        break;
      case TicketStatus.REQUESTED:
        flag = false;
        break;
      case TicketStatus.MBF_REJECT:
        flag = false;
        break;
      case TicketStatus.USER_UPDATED:
        flag = false;
        break;
      case TicketStatus.DONE:
        flag = true;
        break;
      case TicketStatus.CANCELED:
        flag = true;
        break;
      default:
        flag = true;
        break;
    }
  });
  return flag;
};
export const checkUserStatus = (type: number) => {
  switch (type) {
    case UserStatus.NEW:
      return "New";
    case UserStatus.ACTIVE:
      return "Active";
    case UserStatus.DISABLED:
      return 'Disable';
    case UserStatus.LOCKED:
      return 'Locked';
  }
  return '';
};
