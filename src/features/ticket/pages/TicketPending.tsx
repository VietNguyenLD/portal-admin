import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { ActionText, Feature } from 'constants/permission';
import { TicketExpiredStatus } from 'constants/ticket.enum';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import useLoading from 'hooks/useLoading';
import { TicketFilters } from 'models/filters';
import { Ticket } from 'models/ticket';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  convertStatusPhone,
  convertTicketType,
  DATE_FORMAT,
  generateTableOrderNumber,
} from 'share/helper';
import { capitalizeText, secondToDayHour } from 'utils';
import PaginationConfig from 'utils/panigationConfig';
import { ticketExpiredStatusToText, ticketStatusText } from 'utils/ticket';
import SearchTicket from '../components/SearchTicket';

function TicketPendingPage() {
  const { ticketPendingFilters } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const [ticketPendingList, setTicketPendingList] = useState<any>();

  const { isCan } = useCan();
  const { loading, toggleLoading } = useLoading();

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return generateTableOrderNumber(
          ticketPendingFilters?.page,
          ticketPendingFilters?.limit,
          index,
        );
      },
    },
    {
      title: 'Mã Ticket',
      dataIndex: 'code',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      sorter: {
        compare: (a, b) => a?.code - b?.code,
        multiple: 2,
      },
      render: (v) => convertTicketType(v),
    },
    {
      title: 'Batch ID',
      dataIndex: 'batchId_code',
    },
    {
      title: 'Số Serial',
      dataIndex: 'serial_number',
    },
    {
      title: 'Số Thuê Bao',
      dataIndex: 'phone_number',
    },
    {
      title: 'Tên Thuê Bao',
      dataIndex: 'full_name',
      render: (record: string) => {
        return record;
      },
    },
    {
      title: 'Trạng Thái Thuê Bao',
      dataIndex: 'phone_number_status',
      render: (record: number) => {
        return convertStatusPhone(record);
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
      title: 'Người Yêu Cầu',
      dataIndex: 'createdByUser',
      render: (record: any) => {
        return capitalizeText(record?.name);
      },
    },
    {
      title: 'Ngày Tạo Yêu Cầu',
      dataIndex: 'created_at',
      render: (v) => moment(v).format(DATE_FORMAT),
    },

    {
      title: 'Cập Nhật Lần Cuối Bởi',
      dataIndex: 'updatedByUser',
      render: (record: any) => {
        return capitalizeText(record?.name || '-');
      },
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (_: Ticket) => {
        if (isCan(Feature.TICKET_WAITING_LIST_DETAIL, ActionText.READ)) {
          return (
            <Link to={`/admin/ticket/pending/${_?.id}?serial_number=${_.serial_number}`}>
              Chi Tiết
            </Link>
          );
        }
      },
    },
  ];
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params = {
      ...ticketPendingFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    dispatch(filtersActions.ticketPending(params));
  };

  const onSearch = async (values: any) => {
    const startCreatedAt =
      values.created_at && moment(values.created_at[0]).startOf('day').format();
    const endCreatedAt = values.created_at && moment(values.created_at[1]).endOf('day').format();
    const arrStatus = [3, 4, 5]; // status: user_updated, cx_approved, mbf_reject

    let params = {
      ...ticketPendingFilters,
      limit: 10,
      page: 1,
      search: values?.search,
      'filter.status': values?.ticket_status
        ? `$in: ${[values?.ticket_status]}`
        : `$in: ${arrStatus}`,
      'filter.phone_number_status': values?.phone_number_status,
      TicketExpiredStatus: values?.ticket_expired,
      'filter.type': values?.type,
      'filter.requested_count': values?.requested_count,
      'filter.updated_by': values?.updated_by,
      'filter.created_at': values.created_at && `$btw:${startCreatedAt},${endCreatedAt}`,
    };
    dispatch(filtersActions.ticketPending(params));
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

  async function getTicketPendingList() {
    try {
      toggleLoading(true);
      const { status, data } = await ticketApi.getTicketList(ticketPendingFilters);
      toggleLoading(false);

      if (status === 200) {
        setTicketPendingList(data.data);
      }
    } catch (error) {
      toggleLoading(false);
      console.log('Error: ', error);
    }
  }

  useEffect(() => {
    getTicketPendingList();
    // eslint-disable-next-line
  }, [ticketPendingFilters]);

  return (
    <Spin spinning={loading}>
      <SearchTicket
        onSearch={onSearch}
        filterValues={ticketPendingFilters}
        buttons={[
          isCan(Feature.TICKET_WAITING_LIST, ActionText.EXPORT) && (
            <Button
              key='btn-export'
              className='search-box__search-button'
              onClick={() =>
                exportExcelHandler(ticketPendingFilters, ticketPendingList.meta.totalItems)
              }>
              <FileExcelOutlined />
              Export
            </Button>
          ),
        ]}
      />
      <Table
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={ticketPendingList?.data}
        onChange={handleTableChange}
        pagination={PaginationConfig(ticketPendingList)}
        rowKey={(record) => {
          return record.id;
        }}
      />
    </Spin>
  );
}

export default TicketPendingPage;
