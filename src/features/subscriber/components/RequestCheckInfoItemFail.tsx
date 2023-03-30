import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import batchApi from 'api/batchApi';
import { AppContext } from 'context/AppContext';
import useFetch from 'hooks/useFetch';
import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateTableOrderNumber } from 'share/helper';
import { exportExcel } from 'utils';
import PaginationConfig from 'utils/panigationConfig';

const RequestCheckInfoItemFail = forwardRef((props: any, ref) => {
  const { id } = useParams<{ id: string }>();
  const { setLoading } = useContext(AppContext);
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    type: 'import_fail',
  });

  const { data, fetchData } = useFetch({
    url: `/send-batch/request-batch/list-items/${id}`,
    param: query,
    setLoading,
  });

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: function (value: any, record: any, index: number) {
        return generateTableOrderNumber(query?.page, query?.limit, index);
      },
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phone_number',
    },
    {
      title: 'Lý Do Lỗi',
      dataIndex: 'extra_data',
      render: function (value: any) {
        return value?.failedReason;
      },
    },
  ];

  useImperativeHandle(ref, () => ({
    exportExcel: () => handleExportExcel(data?.meta?.totalItems),
  }));

  function handleExportExcel(totalItems: number) {
    if (!totalItems) {
      toast.error('Không có dữ liệu export');
      return;
    }

    const numberPage = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
    const promises: Array<Promise<any>> = [];
    for (let index = 0; index < numberPage; index++) {
      promises.push(
        batchApi.getRequestCheckInfoListItem({
          ...query,
          id: id,
          page: index + 1,
          limit: 100,
        }),
      );
    }
    const newColumns = [...columns];
    newColumns[0] = {
      title: 'STT',
      render: (value, record, index) => {
        return index + 1;
      },
    };

    exportExcel('request_checkInfo_fail', newColumns, promises, setLoading);
  }

  function handlePageChange(value: any) {
    const params = {
      ...query,
      page: value?.current,
      limit: value?.pageSize,
    };

    setQuery(params);
    fetchData(params);
  }

  return (
    <Table
      bordered
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={data?.data}
      onChange={handlePageChange}
      rowKey={(record) => {
        return record?.id;
      }}
      pagination={PaginationConfig(data)}
    />
  );
});

export default RequestCheckInfoItemFail;
