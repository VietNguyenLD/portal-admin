import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { Format } from 'constants/date';
import { Ticket } from 'models/ticket';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertTicketType, showNumberOrderTable } from 'share/helper';
import { capitalizeText, formatDateFromIso } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import { ticketStatusInBatchToText } from 'utils/ticket';
import { sendBatchItemStatusText } from 'constants/batch.enum';
interface TicketTableProps {
  data: any;
  setListId: (value: any) => void;
  listId?: any[];
  handleTableChange?: (value: any) => void;
  currentPage?: number;
}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const TicketTable: React.FC<TicketTableProps> = (props: TicketTableProps) => {
  const { data, setListId, listId = [], handleTableChange, currentPage } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(listId);

  const columns: ColumnsType<any> = [
    {
      title: 'Chọn tất cả',
    },
    {
      title: 'STT',
      key: 'stt',
      render: (_value, _record, index) => {
        return showNumberOrderTable(currentPage || 0, index);
      },
    },
    {
      title: 'Mã Ticket',
      dataIndex: 'code',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (v) => convertTicketType(v),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      render: (record: number) => {
        return ticketStatusInBatchToText(record);
      },
    },
    {
      title: 'Số Lần CS Yêu Cầu',
      dataIndex: 'requested_count',
    },
    {
      title: 'Số Serial',
      dataIndex: 'serial_number',
      sorter: {
        compare: (a, b) => a.serial_number - b.serial_number,
        multiple: 1,
      },
    },
    {
      title: 'Số Thuê Bao',
      dataIndex: 'phone_number',
      sorter: {
        compare: (a, b) => a.phone_number - b.phone_number,
        multiple: 1,
      },
    },
    {
      title: 'Tên Thuê Bao',
      dataIndex: 'full_name',
      sorter: (a, b) => a.full_name.length - b.full_name.length,
      render: (record: string) => {
        return capitalizeText(record);
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record?.name);
      },
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'created_at',
      sorter: (a, b) => {
        var dateA = new Date(a.created_at).getTime();
        var dateB = new Date(b.created_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
      render: (record: any) => {
        const dateFormated = formatDateFromIso(record, Format.DATE_TIME);
        return dateFormated;
      },
    },
    {
      title: 'Người cập nhật cuối',
      dataIndex: 'updatedByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record?.name);
      },
    },
    {
      title: 'Ngày cập nhật cuối',
      dataIndex: 'updated_at',
      render: (record: any) => {
        return formatDateFromIso(record, Format.DATE_TIME);
      },
    },
    {
      title: 'Tình trạng gửi MBF',
      dataIndex: 'sendbatch_item_status',
      render: (status: number) => {
        return sendBatchItemStatusText(status);
      },
    },
    {
      title: 'Mã lỗi',
      dataIndex: 'mbf_error_code',
    },
    {
      title: 'Lỗi',
      dataIndex: 'mbf_error_message',
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      render: (_: Ticket) => {
        return (
          <Link to={`/admin/ticket/list/${_?.id}?serial_number=${_.serial_number}`}>Chi Tiết</Link>
        );
      },
    },
  ];

  useEffect(() => {
    setListId(selectedRowKeys);
  }, [listId]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setListId(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [
    //   Table.SELECTION_ALL,
    //   Table.SELECTION_INVERT,
    //   Table.SELECTION_NONE,
    // ],
  };

  return (
    <Table
      scroll={{ x: 'max-content' }}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data?.data}
      onChange={handleTableChange}
      pagination={PaginationConfig(data)}
      rowKey={(record: any) => {
        return record.id;
      }}
    />
  );
};

export default TicketTable;
