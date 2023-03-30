export function itemTypeToText(type: number) {
  switch (type) {
    case 1:
      return 'Mặt trước CMND';
    case 2:
      return 'Mặt sau CMND';
    case 3:
      return 'Chân dung';
    case 4:
      return 'Chữ ký';
  }
}
