import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Spin, Table, TablePaginationConfig } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/lib/table';
import simApi from 'api/simApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { KYCProfileTempStatus } from 'constants/kyc.enum';
import { ActionText, Feature } from 'constants/permission';
import { PhoneNumberType, phoneNumberTypeText, SIMStatus, SIMStatusText } from 'constants/sim.enum';
import { TicketStatus } from 'constants/ticket.enum';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import { TicketFilter } from 'models/ticket';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DATE_FORMAT, generateTableOrderNumber } from 'share/helper';
import PaginationConfig from 'utils/panigationConfig';
import { idTypeToText } from 'utils/ticket';
import SearchSim from '../components/SearchSim';

interface FiltersFormType {
  search: string;
  mbf_code: string;
  distributor_id: string;
  activated_at: string;
  ticket_status: TicketStatus;
  kyc_temp_status: KYCProfileTempStatus;
  kyc_temp_updated_by: string;
  kyc_temp_updated_at: string;
  phone_number_type: PhoneNumberType;
  sim_status: SIMStatus;
}

function SimActivatedList() {
  const { simActivatedFilters } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  const [simActivatedData, setSimActivatedData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const { isCan } = useCan();

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) => {
        return generateTableOrderNumber(simActivatedFilters.page, simActivatedFilters.limit, index);
      },
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
      render: (text: string) => text,
    },
    {
      title: 'MBF Code',
      dataIndex: 'mbf_code',
    },
    {
      title: 'Device ID',
      dataIndex: 'device_id',
    },
    {
      title: 'Trạng Thái SIM',
      dataIndex: 'sim_status',
      render: (value: SIMStatus) => {
        return SIMStatusText(value);
      },
    },
    {
      title: 'Nhà Phân Phối',
      dataIndex: 'distributor_name',
    },
    {
      title: 'Loại Số',
      dataIndex: 'phone_number_type',
      render: (v) => {
        return phoneNumberTypeText(v);
      },
    },
    {
      title: 'Loại giấy tờ',
      dataIndex: 'id_number_type',
      render: (v: number) => idTypeToText(v),
    },
    {
      title: 'Số CMND',
      dataIndex: 'id_number',
    },
    {
      title: 'Ngày Kích Hoạt',
      dataIndex: 'activated_at',
      sorter: (a, b) => {
        var dateA = new Date(a.activated_at).getTime();
        var dateB = new Date(b.activated_at).getTime();
        return dateA > dateB ? 1 : -1;
      },
      render: (v) => moment(v).format(DATE_FORMAT),
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (record: any) => {
        return <Link to={`/admin/sim/details/${record?.serial_number}`}>Chi Tiết</Link>;
      },
    },
  ];

  const onSearch = async (values: FiltersFormType) => {
    const startActivatedAt =
      values.activated_at && moment(values.activated_at[0]).startOf('day').format();
    const endActivatedAt =
      values.activated_at && moment(values.activated_at[1]).endOf('day').format();
    const startUpdatedAt =
      values.kyc_temp_updated_at && moment(values.kyc_temp_updated_at[0]).startOf('day').format();
    const endUpdatedAt =
      values.kyc_temp_updated_at && moment(values.kyc_temp_updated_at[1]).endOf('day').format();

    const params = {
      ...simActivatedFilters,
      page: 1,
      limit: 10,
      search: values.search,
      'filter.mbf_code': values.mbf_code,
      'filter.distributor_id': values.distributor_id,
      'filter.activated_at': values.activated_at && `$btw:${startActivatedAt},${endActivatedAt}`,
      'filter.ticket_status': values.ticket_status,
      'filter.kyc_temp_status': values.kyc_temp_status,
      'filter.kyc_temp_updated_by': values.kyc_temp_updated_by,
      'filter.kyc_temp_updated_at':
        values.kyc_temp_updated_at && `$btw:${startUpdatedAt},${endUpdatedAt}`,
      'filter.phone_number_type': values.phone_number_type,
      'filter.sim_status': values.sim_status,
    };

    dispatch(filtersActions.simActivated(params));
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params = {
      ...simActivatedFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    };

    dispatch(filtersActions.simActivated(params));
  };

  const exportExcelHandler = async (query: TicketFilter, total: number) => {
    setLoading(true);
    try {
      let numberPgae = total < 100 ? 1 : Math.ceil(total / 100);
      let promieses: Array<any> = [];
      let result;
      for (let index = 0; index < numberPgae; index++) {
        promieses.push(
          simApi.getSimActivatedList({
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
        .addSheet('sim_active')

        .addColumns(col as any)
        .addDataSource(data, {
          str2Percent: true,
        })
        .saveAs(`sim_active_${new Date().toLocaleDateString()}.xlsx`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getSimActivated = async () => {
    try {
      setLoading(true);
      const { status, data } = await simApi.getSimActivatedList(simActivatedFilters);
      setLoading(false);

      if (status === 200) {
        setSimActivatedData(data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSimActivated();
    // eslint-disable-next-line
  }, [simActivatedFilters]);

  return (
    <Spin spinning={loading}>
      <SearchSim
        onSearch={onSearch}
        loading={false}
        buttons={[
          isCan(Feature.ACTIVATED_SIM_LIST, ActionText.EXPORT) && (
            <Button
              key='btn-export'
              className='search-box__search-button'
              onClick={() =>
                exportExcelHandler(simActivatedFilters, simActivatedData.meta.totalItems)
              }>
              <FileExcelOutlined />
              Export
            </Button>
          ),
        ]}
      />
      <div className='sim-activated-list relative'>
        <Table
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={simActivatedData?.data}
          onChange={handleTableChange}
          pagination={PaginationConfig(simActivatedData)}
          rowKey={(record) => {
            return record.id;
          }}
        />
      </div>
    </Spin>
  );
}

export default SimActivatedList;
