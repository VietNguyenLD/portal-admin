import { Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import sendBatchApi from 'api/sendBatchApi';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import { Ticket } from 'models/ticket';
import moment from 'moment';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { exportExcel, generateTableOrderNumber } from 'share/helper';
import PaginationConfig from 'utils/panigationConfig';
import SearchImportListTicket from '../components/SearchImportListTicket';

interface ExtraData {
  fail_total: number;
  file_name: string;
  import_type: string;
  request_fail: number;
  request_success: number;
  success_total: number;
  ticket_total: number;
}

function ImportTicketList() {
  const { setLoading } = useContext(AppContext);

  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
  });

  const { isCan } = useCan();
  const { data: users } = useFetch({ url: `/users`, param: { limit: 999 } });
  const { data, fetchData } = useFetch({
    url: `/send-batch/import-batch/importbatch/list`,
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
      title: 'Ngày thực hiện',
      dataIndex: 'created_at',
      render: (v) => moment(v).format('HH:MM DD/MM/YYYY'),
    },
    {
      title: 'Batch ID',
      dataIndex: 'code',
    },
    {
      title: 'Tên file',
      dataIndex: 'extra_data',
      render: (v) => v?.file_name,
      sorter: {
        compare: (a, b) => parseInt(a.serial_number) - parseInt(b.serial_number),
        multiple: 1,
      },
    },
    {
      title: 'Loại',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.import_type;
      },
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return (extra_data?.success_total || 0) + (extra_data?.fail_total || 0);
      },
    },
    {
      title: 'Import thành công',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.success_total || 0;
      },
    },
    {
      title: 'Import thất bại',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.fail_total || 0;
      },
    },
    {
      title: 'Yêu cầu thành công',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.request_success || 0;
      },
    },
    {
      title: 'Yêu cầu thất bại',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.request_fail || 0;
      },
    },
    {
      title: 'Chuyển thành ticket',
      dataIndex: 'extra_data',
      render: (extra_data: ExtraData) => {
        return extra_data?.ticket_total || 0;
      },
    },
    {
      title: 'Người thực hiện',
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
      title: 'Action',
      fixed: 'right',
      render: (_: Ticket) => {
        if (isCan(Feature.TICKET_IMPORTBATCH_DETAIL, ActionText.READ)) {
          return <Link to={`/admin/ticket/update-subs-batch-detail/${_.id}`}>Chi Tiết</Link>;
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
      setQuery({ ...query, limit: pageSize || 10, page: current || 1 });
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  const exportExcelHandler = () => {
    exportExcel(columns, sendBatchApi.importBatchList, data.meta.totalItems, query, 'sendbatch');
  };

  return (
    <div className='ticket-list' style={{ position: 'relative' }}>
      <SearchImportListTicket
        loading={false}
        setLoading={setLoading}
        onSearch={onSearch}
        users={users}
        fetchData={fetchData}
        exportExcelHandler={exportExcelHandler}
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

export default ImportTicketList;
