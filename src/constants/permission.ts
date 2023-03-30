export enum Action {
  READ = 1 << 0,
  CREATE = 1 << 1,
  UPDATE = 1 << 2,
  SUBMIT = 1 << 3,
  IMPORT = 1 << 4,
  EXPORT = 1 << 5,
}

export enum ActionText {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  SUBMIT = 'SUBMIT',
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

export enum Feature {
  DASHBOARD_TICKET = 1, // Dash board-Thống kê ticket

  TICKET_ALL_LIST = 11,
  TICKET_ALL_DETAIL = 12,
  TICKET_ALL_DETAIL_CONFIRM = 13,
  TICKET_ALL_DETAIL_UNSUBSCRIPTION = 15,
  TICKET_ALL_DETAIL_SEND_MBF = 14,
  TICKET_ALL_DETAIL_ONE_WAY = 17,
  TICKET_ALL_DETAIL_TWO_WAY = 18,
  TICKET_ALL_DETAIL_UNBLOCK = 19,
  TICKET_ALL_DETAIL_CANCEL = 16,
  TICKET_ALL_DETAIL_DONE = 39,
  TICKET_ALL_DETAIL_UPDATE = 41,
  TICKET_ALL_DETAIL_DENIED = 42,

  TICKET_WAITING_LIST = 2,
  TICKET_WAITING_LIST_DETAIL = 3,
  TICKET_WAITING_LIST_CONFIRM = 4,
  TICKET_WAITING_LIST_UNSUBSCRIPTION = 6,
  TICKET_WAITING_LIST_SEND_MBF = 5,
  TICKET_WAITING_LIST_ONE_WAY = 8,
  TICKET_WAITING_LIST_TWO_WAY = 9,
  TICKET_WAITING_LIST_UNBLOCK = 10,
  TICKET_WAITING_LIST_CANCEL = 7,
  TICKET_WAITING_LIST_DONE = 38,
  TICKET_WAITING_LIST_UPDATE = 43,
  TICKET_WAITING_LIST_DENIED = 44,

  TICKET_REQUESTED_LIST = 20,
  TICKET_REQUESTED_DETAIL = 21,
  TICKET_REQUESTED_SUBMIT = 22,
  TICKET_REQUESTED_DELETE = 23,

  TICKET_SENDBATCH = 46,
  TICKET_SENDBATCH_DETAIL = 47,
  TICKET_SENDBATCH_SEND_MBF = 48,

  TICKET_IMPORTBATCH = 49,
  TICKET_IMPORTBATCH_DETAIL = 50,
  TICKET_IMPORTBATCH_DETAIL_TO_REQUEST = 51,
  TICKET_IMPORTBATCH_DETAIL_TO_TICKET = 52,
  TICKET_IMPORTBATCH_DETAIL_DELETE = 53,
  TICKET_IMPORTBATCH_DETAIL_TICKET_DETAIL = 54,

  TICKET_REQUEST_BATCH = 62,
  TICKET_REQUEST_BATCH_ACTION_DETAIL = 63,
  TICKET_REQUEST_BATCH_DETAIL = 64,
  TICKET_REQUEST_BATCH_DETAIL_DELETE_BATCH = 65,
  TICKET_REQUEST_BATCH_DETAIL_CONFIRM = 66,
  TICKET_REQUEST_BATCH_DETAIL_ITEM_ACTION = 67,
  TICKET_REQUEST_BATCH_DETAIL_DELETE_ITEM = 68,

  ACTIVATED_SIM_LIST = 24,
  ACTIVATED_SIM_DETAIL = 25,
  ACTIVATED_SIM_DETAIL_SUBMIT = 26,
  ACTIVATED_SIM_DETAIL_DELETE = 27,
  ACTIVATED_SIM_CONFIRM = 28,
  ACTIVATED_SIM_UNSUBSCRIPTION = 30,
  ACTIVATED_SIM_SEND_MBF = 29,
  ACTIVATED_SIM_ONE_WAY = 31,
  ACTIVATED_SIM_TWO_WAY = 32,
  ACTIVATED_SIM_CREATE = 33,
  ACTIVATED_SIM_UNBLOCK = 40,
  ACTIVATED_SIM_UPDATE = 45,

  ACTIVATED_SIM_CHANGE_SIM = 69,
  ACTIVATED_SIM_CHANGE_SIM_DETAIL = 70,
  ACTIVATED_SIM_CHANGE_SIM_DETAIL_APPROVE = 71,
  ACTIVATED_SIM_CHANGE_SIM_DETAIL_REJECT = 72,
  ACTIVATED_SIM_CHANGE_SIM_DETAIL_MARK_DONE = 73,

  CONFIG_PARAM = 36, // Thiết lập - Tham số
  CONFIG_TICKET_REASON = 35, // Thiết lập - Lý do yêu cầu
  CONFIG_BROADCAST = 37, // Thiết lập - Yêu cầu tất cả user
  CONFIG_APP_REASON = 34, // Thiết lập - Lý do khoá 1C/2C/Huỷ dịch vụ

  RESET_BATCH = 55,
  RESET_BATCH_DETAIL = 56,
  RESET_BATCH_DETAIL_UNSUBSCRIPTION = 57,

  MANAGE_USER_CONFIG = 58,
  MANAGE_USER_CONFIG_DETAIL = 59,
  MANAGE_USER_LIST = 60,
  MANAGE_USER_LIST_DETAIL = 61,
}

export const FeatureDict = {
  '1': 'Dash board - Thống kê ticket',

  '2': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý',
  '3': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket',
  '4': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - CX Duyệt',
  '5': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Gửi MBF',
  '6': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Hủy dịch vụ',
  '7': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Hủy ticket',
  '8': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Khóa 1 chiểu',
  '9': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Khóa 2 chiểu',
  '10': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Mở khóa',
  '38': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Hoàn thành',
  '43': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Cập nhật lại',
  '44': 'Quản lý cập nhật TTTB - Danh sách Chờ xử lý - Chi tiết ticket - Từ chối, yêu cầu lại',

  '11': 'Quản lý cập nhật TTTB - Danh sách ticket',
  '12': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket',
  '13': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - CX Duyệt',
  '14': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Gửi MBF',
  '15': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Hủy dịch vụ',
  '16': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Hủy ticket',
  '17': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Khóa 1 chiểu',
  '18': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Khóa 2 chiểu',
  '19': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Mở khóa',
  '39': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Hoàn thành',
  '41': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Cập nhật lại',
  '42': 'Quản lý cập nhật TTTB - Danh sách ticket - Chi tiết ticket - Từ chối, yêu cầu lại',

  '20': 'Quản lý cập nhật TTTB - Danh sách yêu cầu',
  '21': 'Quản lý cập nhật TTTB - Danh sách yêu cầu - Chi tiết yêu cầu',
  '22': 'Quản lý cập nhật TTTB - Danh sách yêu cầu - Chi tiết yêu cầu - Chuyển thành ticket',
  '23': 'Quản lý cập nhật TTTB - Danh sách yêu cầu - Chi tiết yêu cầu - Xóa',

  '46': 'Quản lý cập nhật TTTB - Gừi MBF theo batch',
  '47': 'Quản lý cập nhật TTTB - Gừi MBF theo batch - Chi tiết batch',
  '48': 'Quản lý cập nhật TTTB - Gừi MBF theo batch - Chi tiết batch - Gửi MBF',

  '49': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB',
  '50': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB - Chi tiết batch',
  '51': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB - Chi tiết batch - Chuyển thành yêu cầu',
  '52': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB - Chi tiết batch - Chuyển thành ticket',
  '53': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB - Chi tiết batch - Xoá',
  '54': 'Quản lý cập nhật TTTB - Import danh sách CNTTTB - Chi tiết batch - Xem chi tiết ticket',

  '62': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB',
  '63': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết gửi SMS/Noti',
  '64': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết',
  '65': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết - Xoá batch',
  '66': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết - Xác nhận gửi đề nghị',
  '67': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết - Chi tiết gửi SMS/Noti',
  '68': 'Quản lý cập nhật TTTB - Import gửi đề nghị kiểm tra TTTB - Chi tiết - Xoá dòng',

  '24': 'Quản lý SIM đã kích hoạt',
  '25': 'Quản lý SIM đã kích hoạt - Chi tiết SIM',
  '26': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Chi tiết yêu cầu - Chuyển thành ticket',
  '27': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Chi tiết yêu cầu - Xóa',
  '28': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - CX Duyệt',
  '29': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Gửi MBF',
  '30': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Hủy dịch vụ',
  '31': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Khóa 1 Chiều',
  '32': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Khóa 2 Chiều',
  '33': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Tạo yêu cầu mới',
  '40': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Mở khoá',
  '45': 'Quản lý SIM đã kích hoạt - Chi tiết SIM - Cập nhật lại',

  '34': 'Thiết lập - Lý do khoá 1C/2C/Huỷ dịch vụ',
  '35': 'Thiết lập - Lý do yêu cầu',
  '36': 'Thiết lập - Tham số',
  '37': 'Thiết lập - Yêu cầu tất cả user',

  '55': 'Quản lý Số thuê bao - Import Số thuê bao cắt hủy',
  '56': 'Quản lý Số thuê bao - Import Số thuê bao cắt hủy - Chi tiết batch',
  '57': 'Quản lý Số thuê bao - Import Số thuê bao cắt hủy - Chi tiết batch - Yêu cầu Thu hồi',

  '58': 'QL và phân quyển User- Thiết lập nhóm người dùng',
  '59': 'QL và phân quyển User- Thiết lập nhóm người dùng - Chi tiết',
  '60': 'QL và phân quyển User- Danh sách người dùng',
  '61': 'QL và phân quyển User- Danh sách người dùng -Chi tiết',
};
