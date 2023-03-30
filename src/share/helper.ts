import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/es/table';
import { RangePickerProps } from 'antd/lib/date-picker';
import { BlockServiceItem } from 'constants/app.reason';
import { Action, ActionText, FeatureDict } from 'constants/permission';
import {
  TicketExpiredStatus,
  TicketExpiredStatusText,
  TicketStatus,
  TicketStatusText,
  TicketType,
  TicketTypeText,
} from 'constants/ticket.enum';
import { DataTypeGroup } from 'models/permission';
import moment from 'moment';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const convertTicketType = (type: number = 1) => {
  let result;
  if (type === TicketType.CS) result = TicketTypeText.CS;
  if (type === TicketType.TL) result = TicketTypeText.TL;
  if (type === TicketType.US) result = TicketTypeText.US;
  return result;
};

export const convertStatusPhone = (type: number = 4) => {
  switch (type) {
    case BlockServiceItem.BLOCK_1_WAY:
      return 'Khoá 1 chiều';
    case BlockServiceItem.BLOCK_2_WAY:
      return 'Khoá 2 chiều';
    case BlockServiceItem.UNLOCK:
      return 'Đang hoạt động';
    case BlockServiceItem.UNSUBSCRIPTION:
      return 'Huỷ dịch vụ';
    default:
      return '';
  }
};

export const convertTicketStatus = (type: number = 1) => {
  if (type === TicketStatus.CANCELED) return TicketStatusText.CANCEL;
  if (type === TicketStatus.DONE) return TicketStatusText.DONE;
  if (type === TicketStatus.DRAFT) return TicketStatusText.DRAFT;
  if (type === TicketStatus.MBF_REJECT) return TicketStatusText.MBF_REJECT;
  if (type === TicketStatus.REQUESTED) return TicketStatusText.REQUESTED;
  if (type === TicketStatus.USER_UPDATED) return TicketStatusText.USER_UPDATED;
};

export const convertTicketExpied = (type: number = 1) => {
  if (type === TicketExpiredStatus.NORMAL) return TicketExpiredStatusText.NORMAL;
  if (type === TicketExpiredStatus.WARNING) return TicketExpiredStatusText.WARNING;
  if (type === TicketExpiredStatus.EXPIRED) return TicketExpiredStatusText.EXPIRED;
};

export const convertFeature = (type: number = 1) => {
  //@ts-ignore
  return FeatureDict[type];
};

export const isCheckedPermission = (statusAction: number, action: string) => {
  switch (action) {
    case ActionText.READ:
      return statusAction & Action.READ;
    case ActionText.CREATE:
      return statusAction & Action.CREATE;
    case ActionText.UPDATE:
      return statusAction & Action.UPDATE;
    case ActionText.SUBMIT:
      return statusAction & Action.SUBMIT;
    case ActionText.IMPORT:
      return statusAction & Action.IMPORT;
    case ActionText.EXPORT:
      return statusAction & Action.EXPORT;
  }
};

export const columnsGroup: ColumnsType<DataTypeGroup> = [
  {
    title: 'Mã nhóm',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: 'Tên nhóm',
    dataIndex: 'name',
    key: 'name',
  },
];

export const showNumberOrderTable = (page: number, index: number) => {
  if (page > 1) {
    if (index === 9) {
      return `${page}0`;
    }
    return `${page > 1 ? page - 1 : ''}${index + 1}`;
  }
  return `${page > 1 ? page : ''}${index + 1}`;
};

export const generateTableOrderNumber = (currentPage: number, pageSize: number, index: number) => {
  if (currentPage === 1) {
    return `${index + 1}`;
  }
  return `${pageSize * (currentPage - 1) + (index + 1)}`;
};

export const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current > moment().endOf('day');
};

export const exportExcel = async (
  columns: ColumnsType<any>,
  getData: any,
  total: number,
  query: any,
  nameFile: string,
  id?: string,
  batchType?: number,
) => {
  try {
    let numberPgae = total < 100 ? 1 : Math.ceil(total / 100);
    let promieses = [];
    let result;
    for (let index = 0; index < numberPgae; index++) {
      if (!id) {
        promieses.push(
          getData(new URLSearchParams({ ...query, page: index + 1, limit: 100 } as any).toString()),
        );
      } else {
        promieses.push(batchType ? getData(id, batchType) : getData(id));
      }
    }
    result = await Promise.all(promieses);

    let data = result.reduce((kq, val) => {
      return kq.concat(val.data.data.data);
    }, []);
    let col = [...columns];
    col[0] = {
      title: 'STT',
      render: (_value, _record, index) => {
        return index + 1;
      },
    };
    col.pop();
    const excel = new Excel();
    excel
      .addSheet(nameFile)
      .addColumns(col as any)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs(`${nameFile}__${new Date().toLocaleDateString()}.xlsx`);
  } catch (error) {
    console.log(error);
  }
};

export const replaceTextFileTxt = (text: string = '', textReplace: string = '') => {
  return text.replace(/[^a-zA-Z0-9]/g, textReplace);
};
