import { Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useAppDispatch } from 'app/hooks';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import useFetch from 'hooks/useFetch';
import { Ticket } from 'models/ticket';
import moment from 'moment';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { DATE_FORMAT, generateTableOrderNumber } from 'share/helper';
import { batchStatusText } from 'utils/batch';
import PaginationConfig from 'utils/panigationConfig';
import SearchImportListPhone from '../components/SearchImportListPhone';
interface ExtraData {
  fail_total: number;
  file_name: string;
  import_type: string;
  request_fail: number;
  request_success: number;
  success_total: number;
  ticket_total: number;
  unsubscription_success: number;
  unsubscription_fail: number;
  recall_fail: number;
  recall_success: number;
}

function ImportPhoneList() {
  const { setLoading } = useContext(AppContext);
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
  });

  const { data: users } = useFetch({ url: `/users`, param: { limit: 999 } });
  const { data, fetchData } = useFetch({
    url: `/send-batch/import-batch/resetbatch/list`,
    param: query,
    setLoading,
  });

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return generateTableOrderNumber(query?.page, query?.limit, index);
      },
    },
    {
      title: 'Batch ID',
      dataIndex: 'code',
    },
    {
      title: 'Tên File',
      dataIndex: 'extra_data',
      render: (v) => v?.file_name,
      sorter: {
        compare: (a, b) => parseInt(a.serial_number) - parseInt(b.serial_number),
        multiple: 1,
      },
    },
    {
      title: 'Tổng STB',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return (extra_data?.success_total || 0) + (extra_data?.fail_total || 0);
      },
    },
    {
      title: 'Import Thành Công',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.success_total || 0;
      },
    },
    {
      title: 'Import Lỗi',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.fail_total || 0;
      },
    },
    {
      title: 'Huỷ DV thành công',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.unsubscription_success || 0;
      },
    },
    {
      title: 'Huỷ DV Lỗi',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.unsubscription_fail || 0;
      },
    },
    {
      title: 'Thu Hồi Thành Công',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.recall_success || 0;
      },
    },
    {
      title: 'Thu Hồi Lỗi',
      dataIndex: 'updated_by',
      render: (extra_data: ExtraData) => {
        return extra_data?.recall_fail || 0;
      },
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'created_at',
      render: (v) => moment(v).format(DATE_FORMAT),
    },
    {
      title: 'Người Tạo',
      dataIndex: 'created_by',
      render: (v) => {
        if (users?.data?.length > 0) {
          let currentUser = users?.data.find((x: any) => x.id === v);
          return (currentUser && currentUser.name) || '';
        }
        return '';
      },
    },
    {
      title: 'Trạng Thái',
      render: (v: any) => {
        return batchStatusText(v?.status, v?.type);
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      render: (_: Ticket) => {
        if ((Feature.RESET_BATCH_DETAIL, ActionText.READ)) {
          return <Link to={`/admin/subscriber/reset-subscriber/detail/${_.id}`}>Chi Tiết</Link>;
        }
        return null;
      },
    },
  ];

  const onSearch = async (val: any) => {
    let params: any = {
      limit: query.limit,
      page: 1,
    };
    if (val?.search) {
      params['search'] = val?.search;
    }
    if (val?.created_at) {
      params['filter.created_at'] = `$btw:${moment(val?.created_at[0])
        .startOf('day')
        .format()},${moment(val?.created_at[1]).endOf('day').format()}`;
    }
    if (val?.created_by) {
      params['filter.created_by'] = val?.created_by;
    }
    setQuery(params);
    fetchData(params);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (current !== query.page || pageSize !== query.limit) {
      dispatch(
        ticketActions.setQueryFilter({ ...query, limit: pageSize || 10, page: current || 1 }),
      );
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  return (
    <div className='ticket-list' style={{ position: 'relative' }}>
      <SearchImportListPhone
        loading={false}
        onSearch={onSearch}
        users={users}
        fetchData={fetchData}
        setLoading={setLoading}
      />
      <Table
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data?.data}
        onChange={handleTableChange}
        pagination={PaginationConfig(data)}
        rowKey={(record) => {
          return record.id;
        }}
      />
    </div>
  );
}

export default ImportPhoneList;
