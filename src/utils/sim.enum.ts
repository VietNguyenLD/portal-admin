export function KYCProfileTempStatusToText(type: number) {
  switch (type) {
    case 1:
      return 'Draft';
    case 2:
      return 'Hoàn thành';
    case 3:
      return 'CX duyệt';
    case 4:
      return 'MBF từ chối';
  }
  return '';
}

export function PhoneNumberType (type: number) {
  switch (type) {
    case 1:
      return 'Số thường';
    case 2:
      return 'Số đẹp';
  }
  return '';
}