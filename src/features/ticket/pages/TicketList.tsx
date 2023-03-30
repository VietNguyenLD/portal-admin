import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import ticketApi from 'api/ticketApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { ActionText, Feature } from 'constants/permission';
import { TicketExpiredStatus, TicketStatus } from 'constants/ticket.enum';
import { AppContext } from 'context/AppContext';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import { TicketFilters } from 'models/filters';
import { Ticket } from 'models/ticket';
import moment from 'moment';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  convertStatusPhone,
  convertTicketType,
  DATE_FORMAT,
  generateTableOrderNumber,
} from 'share/helper';
import { capitalizeText, secondToDayHour } from 'utils/common';
import PaginationConfig from 'utils/panigationConfig';
import { ticketExpiredStatusToText, ticketStatusText } from 'utils/ticket';
import SearchTicket from '../components/SearchTicket';

function TicketListPage() {
  const { ticketListFilters } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();
  const { setLoading } = useContext(AppContext);

  const { isCan } = useCan();
  const { data, fetchData } = useFetch({
    url: '/ticket/list',
    param: ticketListFilters,
    setLoading,
  });

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return generateTableOrderNumber(ticketListFilters?.page, ticketListFilters?.limit, index);
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
        compare: (a, b) => parseInt(a.serial_number) - parseInt(b.serial_number),
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
      sorter: (a, b) => a?.full_name.length - b?.full_name.length,
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
      title: 'Trạng Thái Ticket',
      dataIndex: 'status',
      render: (value: TicketStatus) => {
        return ticketStatusText(value);
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
      render: (record: any) => {
        return capitalizeText(record?.name);
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
      title: 'Nội Dung',
      dataIndex: 'content',
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (_: Ticket) => {
        if (isCan(Feature.TICKET_ALL_DETAIL, ActionText.READ)) {
          return (
            <Link to={`/admin/ticket/list/${_?.id}?serial_number=${_.serial_number}`}>
              Chi Tiết
            </Link>
          );
        }
        return null;
      },
    },
  ];

  const onSearch = async (values: any) => {
    const startCreatedAt =
      values.created_at && moment(values.created_at[0]).startOf('day').format();
    const endCreatedAt = values.created_at && moment(values.created_at[1]).endOf('day').format();
    const arrStatus = [2, 3, 4, 5, 6, 7]; // status: all status, exclude: draft,

    let params = {
      ...ticketListFilters,
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
      'filter.content': values?.content,
    };
    dispatch(filtersActions.ticketList(params));
    fetchData(params);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params = {
      ...ticketListFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    dispatch(filtersActions.ticketList(params));
    fetchData(params);
  };

  const exportExcelHandler = async (query: TicketFilters, total: number) => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className='ticket-list' style={{ position: 'relative' }}>
      <SearchTicket
        onSearch={onSearch}
        filterValues={ticketListFilters}
        buttons={[
          isCan(Feature.TICKET_ALL_LIST, ActionText.EXPORT) && (
            <Button
              key='btn-export'
              className='search-box__search-button'
              onClick={() => exportExcelHandler(ticketListFilters, data.meta.totalItems)}>
              <FileExcelOutlined />
              Export
            </Button>
          ),
        ]}
      />
      <Table
        bordered
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

export default TicketListPage;
