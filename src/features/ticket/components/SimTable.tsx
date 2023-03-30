import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import type { TableRowSelection } from 'antd/lib/table/interface';
import { sendBatchItemStatusText } from 'constants/batch.enum';
import { Format } from 'constants/date';
import useFetch from 'hooks/useFetch';
import { SimActivated } from 'models/sim';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showNumberOrderTable } from 'share/helper';
import { formatDateFromIso } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import { KYCProfileTempStatusToText } from 'utils/sim.enum';
interface SimTableProps {
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

const SimTable: React.FC<SimTableProps> = (props: SimTableProps) => {
  const { data, setListId, listId = [], handleTableChange, currentPage } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(listId);

  const { data: dataUser } = useFetch({ url: `/users` });

  useEffect(() => {
    setListId(selectedRowKeys);
    // eslint-disable-next-line
  }, [listId]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setListId(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

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
      title: 'Số Serial',
      dataIndex: 'sim',
      sorter: {
        compare: (a: any, b: any) => parseInt(a?.serial_number) - parseInt(b?.serial_number),
        multiple: 1,
      },
      render: (text: string, record: any) => {
        return record.serial_number;
      },
    },
    {
      title: 'Số Thuê Bao',
      dataIndex: 'phone_number',
      sorter: {
        compare: (a: any, b: any) => parseInt(a?.phone_number) - parseInt(b?.phone_number),
        multiple: 1,
      },
      render: (text: string, record: any) => {
        return record.phone_number;
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'kyc_temp_status',
      render: (text: string, record: any) => {
        return KYCProfileTempStatusToText(record.kyc_temp_status);
      },
    },
    {
      title: 'Tên Thuê Bao',
      dataIndex: 'full_name',
    },
    {
      title: 'Người cập nhật cuối',
      dataIndex: 'updated_by',
      render: (text: string, record: any) => {
        let currentItem;
        if (dataUser) {
          currentItem = dataUser?.data.find((item: any) => {
            return item.id == record.updated_by;
          });
          return currentItem?.name;
        }
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
      fixed: 'right',
      title: 'Thao Tác',
      render: (item: SimActivated) => {
        return <Link to={`/admin/sim/details/${item?.serial_number}`}>Chi Tiết</Link>;
      },
    },
  ];

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
      rowKey={(record) => {
        return record.kyc_id;
      }}
    />
  );
};

export default SimTable;
