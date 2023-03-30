import { Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import sendBatchApi from 'api/sendBatchApi';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { showNumberOrderTable } from 'share/helper';
import { exportExcel } from 'utils';
import PaginationConfig from 'utils/panigationConfig';

const BatchItemImportFail = forwardRef((props: any, ref) => {
  const { onLoading } = props;
  const { id } = useParams<{ id: string }>();
  const [listItem, setListItem] = useState<any>();
  const [query, setQuery] = useState<any>({
    page: 1,
    limit: 10,
    'filter.status': 4,
  });

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value: any, _record: any, index: number) => {
        return showNumberOrderTable(query.page, index);
      },
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone_number',
    },
    {
      title: 'Item Yêu Cầu',
    },
    {
      title: 'Lý Do',
      dataIndex: 'reason',
    },
    {
      title: 'Lý Do Lỗi',
      dataIndex: 'extra_data',
      render(value) {
        return value?.failedReason;
      },
    },
  ];

  useImperativeHandle(ref, () => ({
    exportExcel: () => handleExportExcel(listItem?.meta?.totalItems),
  }));

  function handleExportExcel(totalItems: number) {
    if (!totalItems) {
      toast.error('Không có dữ liệu export');
      return;
    }

    const numberPgae = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
    const promises: Array<Promise<any>> = [];

    for (let index = 0; index < numberPgae; index++) {
      promises.push(
        sendBatchApi.getListBatchItem({
          batch_id: id,
          query: {
            ...query,
            page: index + 1,
            limit: 100,
          },
        }),
      );
    }

    const newColumns = [...columns];

    newColumns[0] = {
      title: 'STT',
      render: (_value: any, _record: any, index: number) => {
        return index + 1;
      },
    };

    exportExcel('batch_item_fail', newColumns, promises);
  }

  async function getListBatchItem() {
    const params: any = {
      batch_id: id,
      query: {
        ...query,
      },
    };

    try {
      onLoading(true);
      const { status, data } = await sendBatchApi.getListBatchItem(params);
      onLoading(false);

      if (status === 200) {
        setListItem(data.data);
      }
    } catch (error) {
      onLoading(false);
    }
  }

  function handlePageChange(pagination: TablePaginationConfig) {
    const params = {
      ...query,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    setQuery(params);
  }

  useEffect(() => {
    getListBatchItem();
    // eslint-disable-next-line
  }, [query]);

  return (
    <div className='batch-item-fail'>
      <Table
        bordered
        columns={columns}
        dataSource={listItem?.data}
        pagination={PaginationConfig(listItem)}
        onChange={handlePageChange}
        rowKey={(item: any) => {
          return item?.id;
        }}
      />
    </div>
  );
});

export default BatchItemImportFail;
