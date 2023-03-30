import { BatchStatus, BatchType } from 'constants/batch.enum';

export function batchStatusText(status: BatchStatus, type: BatchType = BatchType.SEND_BATCH) {
  switch (status) {
    case BatchStatus.NEW:
      return 'Mới';
    case BatchStatus.PROCESSING:
      return 'Đang xử lý';
    case BatchStatus.UPLOADING:
      return 'Đang tải lên';
    case BatchStatus.FAILED:
      return 'Thất bại';
    case BatchStatus.DONE:
      if (type === BatchType.SEND_BATCH) return 'Hoàn thành';
      return 'Đã import';
    case BatchStatus.REQUEST_FOR_REVOKING_SUBS:
    case BatchStatus.CANCELLED_SUBS:
      return 'Đã hủy dịch vụ';
    case BatchStatus.REVOKED_SUBS:
      return 'Đã thu hồi';
  }
}
