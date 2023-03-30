export enum BatchType {
  SEND_BATCH = 'sendbatch',
  IMPORT_BATCH = 'importbatch',
  RESET_BATCH = 'resetbatch',
  REQUEST_BATCH = 'requestbatch',
}

export enum SendBatchType {
  TICKET = 1,
  SIM = 2,
}

export function batchTypeText(type: number) {
  switch (type) {
    case 1:
      return 'Send Batch';
    case 2:
      return 'Import Batch';
  }
  return '';
}

export function sendBatchTypeText(type: number) {
  switch (type) {
    case 1:
      return 'Ticket';
    case 2:
      return 'SIM';
  }
  return '';
}

export enum BatchStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  UPLOADING = 'uploading',
  FAILED = 'failed',
  DONE = 'done',

  // import batch status
  TO_TICKET = 'toticket',
  TO_DRAFT_TICKET = 'todraftticket',

  // reset batch
  REQUEST_FOR_REVOKING_SUBS = 'requestforrevokingsubs',
  CANCELLED_SUBS = 'cancelledservices',
  REVOKED_SUBS = 'revokedsubs',

  // request batch
  IMPORTED = 'imported',
  PROCESSING_SMS_NOTIFICATION = 'processingsmsnotification',
  WORKER_PROCESSING = 'workerprocessing',
}

export enum SendBatchItemStatus {
  NEW = 1,
  PROCESSING = 2,
  DONE = 3,
  FAILED = 4,
  ERROR = 5,
}

export function sendBatchItemStatusText(type: number) {
  switch (type) {
    case 1:
      return 'Mới';
    case 2:
      return 'Đang xử lý';
    case 3:
      return 'Hoàn thành';
    case 4:
      return 'MBF Từ chối';
    case 5:
      return 'Lỗi hệ thống';
  }
  return '';
}

/* Text */
export function batchStatusText(status: BatchStatus, type: BatchType = BatchType.SEND_BATCH) {
  switch (status) {
    case BatchStatus.NEW:
      return 'Mới';
    case BatchStatus.PROCESSING:
      if ([BatchType.REQUEST_BATCH].includes(type)) return 'Đang import';
      return 'Đang xử lý';
    case BatchStatus.PROCESSING_SMS_NOTIFICATION:
      return 'Đang xử lý';
    case BatchStatus.UPLOADING:
      return 'Đang tải lên';
    case BatchStatus.FAILED:
      return 'Thất bại';
    case BatchStatus.DONE:
      if ([BatchType.SEND_BATCH, BatchType.REQUEST_BATCH].includes(type)) return 'Hoàn thành';
      return 'Đã import';
    case BatchStatus.REQUEST_FOR_REVOKING_SUBS:
    case BatchStatus.CANCELLED_SUBS:
      return 'Đã hủy dịch vụ';
    case BatchStatus.REVOKED_SUBS:
      return 'Đã thu hồi';
    case BatchStatus.IMPORTED:
      return 'Đã import';
    case BatchStatus.WORKER_PROCESSING:
      return 'Đang import';
  }
}

export function notiStatusText(type: string) {
  switch (type) {
    case 'success':
      return 'Thành công';
    case 'failed':
      return 'Thất bại';
  }
}

export function confirmRequestStatusText(type: string) {
  switch (type) {
    case 'REQUEST_SUCCESS':
    case 'DONE':
      return 'Thành công';
    case 'REQUEST_FAILED':
      return 'Thất bại';
  }
}
