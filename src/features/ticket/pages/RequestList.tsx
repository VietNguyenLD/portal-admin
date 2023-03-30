import { FileExcelOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CreateTicketModal from 'components/CreateTicketModal';
import { ActionText, Feature } from 'constants/permission';
import { TicketExpiredStatus } from 'constants/ticket.enum';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import useLoading from 'hooks/useLoading';
import useModal from 'hooks/useModal';
import { TicketFilters } from 'models/filters';
import { Ticket } from 'models/ticket';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertTicketType, DATE_FORMAT, generateTableOrderNumber } from 'share/helper';
import { capitalizeText, secondToDayHour } from 'utils';
import { subscriptionStatusText } from 'utils/kyc';
import PaginationConfig from 'utils/panigationConfig';
import { ticketExpiredStatusToText, ticketStatusText } from 'utils/ticket';
import SearchTicket from '../components/SearchTicket';

function RequestListPage() {
  const { requestListFilters } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const [reRender, setReRender] = useState<boolean>(false);
  const [serial] = useState<string>();
  const [requestList, setRequestList] = useState<any>();

  const { loading, toggleLoading } = useLoading();
  const { isCan } = useCan();
  const createTicketModal = useModal();
  const updateRequestModal = useModal();

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return generateTableOrderNumber(requestListFilters?.page, requestListFilters?.limit, index);
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
      title: 'Batch ID',
      dataIndex: 'batchId_code',
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
        return record;
      },
    },
    {
      title: 'Trạng Thái Thuê Bao',
      dataIndex: 'phone_number_status',
      render: (record: number) => {
        return subscriptionStatusText(record);
      },
    },
    {
      title: 'Trạng Thái Yêu Cầu',
      dataIndex: 'status',
      render: (record: number) => {
        return ticketStatusText(record);
      },
    },
    {
      title: 'Trạng Thái Quá Hạn',
      dataIndex: 'expired_status',
      render: (record: number) => {
        return ticketExpiredStatusToText(record);
      },
    },
    {
      title: 'Thời Gian Quá Hạn',
      dataIndex: 'expired_distance',
      render: (text: any, record: any) => {
        if (record.expired_status === TicketExpiredStatus.WARNING) {
          return secondToDayHour(record.expired_distance).hours;
        }
        if (record.expired_status === TicketExpiredStatus.EXPIRED) {
          return secondToDayHour(record.expired_distance).days;
        }
        return '-';
      },
    },
    {
      title: 'Số Lần CS Yêu Cầu',
      dataIndex: 'requested_count',
      render: (value: number) => {
        return value > 0 ? `${value} lần` : '-';
      },
    },
    {
      title: 'Lỗi',
      dataIndex: 'mbf_error_code',
    },
    {
      title: 'Diễn giải',
      dataIndex: 'mbf_error_message',
    },
    {
      title: 'Người Yêu Cầu',
      dataIndex: 'createdByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record.name);
      },
    },
    {
      title: 'Ngày Tạo Yêu Cầu',
      dataIndex: 'created_at',
      sorter: (a, b) => {
        var dateA = new Date(a.created_at).getTime();
        var dateB = new Date(b.created_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
      render: (v) => moment(v).format(DATE_FORMAT),
    },
    {
      title: 'Cập Nhật Lần Cuối Bởi',
      dataIndex: 'updatedByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record.name);
      },
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (record: Ticket) => {
        if (isCan(Feature.TICKET_REQUESTED_DETAIL, ActionText.READ)) {
          return <Link to={`/admin/ticket/request-detail/${record.serial_number}`}>Chi Tiết</Link>;
        }
      },
    },
  ];

  const onSearch = async (values: any) => {
    const startCreatedAt =
      values.created_at && moment(values.created_at[0]).startOf('day').format();
    const endCreatedAt = values.created_at && moment(values.created_at[1]).endOf('day').format();

    let params = {
      ...requestListFilters,
      limit: 10,
      page: 1,
      search: values?.search,
      'filter.status': `$in: ${[1]}`,
      'filter.phone_number_status': values?.phone_number_status,
      TicketExpiredStatus: values?.ticket_expired,
      'filter.type': values?.type,
      'filter.requested_count': values?.requested_count,
      'filter.updated_by': values?.updated_by,
      'filter.created_at': values.created_at && `$btw:${startCreatedAt},${endCreatedAt}`,
    };
    dispatch(filtersActions.requestList(params));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params = {
      ...requestListFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    dispatch(filtersActions.requestList(params));
  };

  const exportExcelHandler = async (query: TicketFilters, total: number) => {
    toggleLoading(true);
    try {
      let numberPgae = total < 100 ? 1 : Math.ceil(total / 100);
      let promieses = [];
      let result;
      for (let index = 0; index < numberPgae; index++) {
        promieses.push(
          ticketApi.getTicketList({
            ...query,
            page: index + 1,
            limit: 100,
          }),
        );
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
        .addSheet('ticket')
        .addColumns(col as any)
        .addDataSource(data, {
          str2Percent: true,
        })
        .saveAs(`ticket__${new Date().toLocaleDateString()}.xlsx`);
      toggleLoading(false);
    } catch (error) {
      toggleLoading(false);
      console.log(error);
    }
  };

  async function getRequestList() {
    try {
      toggleLoading(true);
      const { status, data } = await ticketApi.getTicketList(requestListFilters);
      toggleLoading(false);

      if (status === 200) {
        setRequestList(data.data);
      }
    } catch (error) {
      toggleLoading(false);
      console.log('Error: ', error);
    }
  }

  useEffect(() => {
    getRequestList();
    // eslint-disable-next-line
  }, [requestListFilters]);

  useEffect(() => {
    if (reRender) {
      getRequestList();
    }
    setReRender(false);
    // eslint-disable-next-line
  }, [reRender]);

  return (
    <Spin spinning={loading}>
      <div className='request-list'>
        {updateRequestModal.isShowing === true && (
          <CreateTicketModal
            isShowing={updateRequestModal.isShowing}
            toggle={updateRequestModal.toggle}
            serialNumber={serial}
            mode='current'
            onReRender={(flag: boolean) => setReRender(flag)}
          />
        )}

        {createTicketModal.isShowing === true && (
          <CreateTicketModal
            isShowing={createTicketModal.isShowing}
            toggle={createTicketModal.toggle}
            onReRender={(flag: boolean) => setReRender(flag)}
          />
        )}

        <SearchTicket
          type='draft'
          onSearch={onSearch}
          buttons={[
            isCan(Feature.TICKET_REQUESTED_LIST, ActionText.CREATE) && (
              <Button
                icon={<PlusCircleOutlined />}
                key='create_btn'
                className='search-box__search-button'
                onClick={createTicketModal.toggle}>
                Tạo yêu cầu
              </Button>
            ),
            isCan(Feature.TICKET_REQUESTED_LIST, ActionText.EXPORT) && (
              <Button
                key='btn-export'
                className='search-box__search-button'
                onClick={() => exportExcelHandler(requestListFilters, requestList.meta.totalItems)}>
                <FileExcelOutlined />
                Export
              </Button>
            ),
          ]}
          filterValues={requestListFilters}
        />
        <Table
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={requestList?.data}
          onChange={handleTableChange}
          pagination={PaginationConfig(requestList)}
          rowKey={(record) => {
            return record.id;
          }}
        />
      </div>
    </Spin>
  );
}

export default RequestListPage;
