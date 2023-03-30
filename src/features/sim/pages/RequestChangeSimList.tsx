import { Button, Col, Form, Input, PaginationProps, Row, Select, Table } from 'antd';
import simApi from 'api/simApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import BackButton from 'components/Button/BackButton';
import ResetButton from 'components/Button/ResetButton';
import { Wrapper } from 'components/common/Wrapper';
import RangePickerField from 'components/Form/RangePickerField';
import SelectField from 'components/Form/SelectField';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import {
  ChangeSIMStatus,
  changeSIMStatusText,
  ChangeSIMType,
  changeSIMTypeText,
} from 'constants/sim.enum';
import { AppContext } from 'context/AppContext';
import { filtersActions } from 'features/filtersSlice';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import { Filters } from 'models/filters';
import { RequestChangeSIM } from 'models/sim';
import moment from 'moment';
import { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateTableOrderNumber } from 'share/helper';
import { exportExcel, formatDateFromIso } from 'utils';
import PaginationConfig from 'utils/panigationConfig';

const { Option } = Select;

interface ParamsState extends Filters {
  search: string;
  status: ChangeSIMStatus | string;
  created_at: string;
}

function RequestChangeSimList() {
  const dispatch = useAppDispatch();
  const { setLoading } = useContext(AppContext);
  const { requestChangeSimFilters } = useAppSelector((state) => state.filters);
  const formRef = useRef<any>();

  const { isCan } = useCan();
  const { data, fetchData } = useFetch({
    url: '/sim/change-sim/list',
    param: requestChangeSimFilters,
    setLoading,
  });

  const columns: any = [
    {
      title: 'STT',
      render: (value: any, record: any, index: number) =>
        generateTableOrderNumber(
          requestChangeSimFilters?.page,
          requestChangeSimFilters?.limit,
          index,
        ),
    },
    {
      title: 'Mã Yêu Cầu',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Serial',
      dataIndex: 'old_serial',
    },
    {
      title: 'Số Thuê Bao',
      dataIndex: 'phone_number',
    },
    {
      title: 'Tên Thuê Bao',
      dataIndex: 'full_name',
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'id_number',
    },
    {
      title: 'Lý Do',
      dataIndex: 'type',
      render: (value: ChangeSIMType) => changeSIMTypeText(value),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      render: (value: ChangeSIMStatus) => changeSIMStatusText(value),
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'created_at',
      render: (value: string) => formatDateFromIso(value, Format.DATE_TIME),
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (record: RequestChangeSIM) =>
        isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL, ActionText.READ) && (
          <Link to={`/admin/sim/request-change-sim/detail/${record.id}`}>Chi tiết</Link>
        ),
    },
  ];

  function onFill() {
    formRef?.current?.setFieldsValue({
      search: requestChangeSimFilters?.search,
      status: requestChangeSimFilters?.['filter.status'] ?? '',
      created_at: requestChangeSimFilters?.['filter.created_at'] && [
        moment(requestChangeSimFilters?.['filter.created_at']?.slice(5)?.split(',')[0]),
        moment(requestChangeSimFilters?.['filter.created_at']?.slice(5)?.split(',')[1]),
      ],
    });
  }

  async function handleExportExcel(totalItems: number) {
    if (!totalItems) {
      toast.error('Không có dữ liệu export');
      return;
    }

    const numberPgae = totalItems < 100 ? 1 : Math.ceil(totalItems / 100);
    const promises: any = [];

    for (let index = 0; index < numberPgae; index++) {
      promises.push(
        simApi.getRequestNewSIMList({
          ...requestChangeSimFilters,
          page: index + 1,
          limit: 100,
        }),
      );
    }

    const newColumns = [...columns];
    newColumns[0] = {
      title: 'STT',
      render: (value: any, record: any, index: number) => {
        return index + 1;
      },
    };
    newColumns.pop();

    exportExcel('request_new_sim', newColumns, promises);
  }

  function handleFormSubmit(values: ParamsState) {
    const startCreatedAt =
      values.created_at && moment(values.created_at[0]).startOf('day').format();
    const endCreatedAt = values.created_at && moment(values.created_at[1]).endOf('day').format();
    const params = {
      ...requestChangeSimFilters,
      limit: 10,
      page: 1,
      search: values.search,
      'filter.status': values.status,
      'filter.created_at': values.created_at && `$btw:${startCreatedAt},${endCreatedAt}`,
    };

    dispatch(filtersActions.requestChangeSim(params));
    fetchData(params);
  }

  function handlePagechange(values: PaginationProps) {
    const params = {
      ...requestChangeSimFilters,
      limit: values?.pageSize,
      page: values?.current,
    };

    dispatch(filtersActions.requestChangeSim(params));
    fetchData(params);
  }

  useEffect(() => {
    onFill();
    // eslint-disable-next-line
  }, [requestChangeSimFilters]);

  return (
    <div className='request-newsim'>
      <BackButton />

      <Wrapper padding='1rem' margin='0 0 1rem 0'>
        <Form layout='vertical' ref={formRef} onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label='Tìm kiếm:' name='search'>
                <Input placeholder='Mã yêu cầu, Số điện thoại' />
              </Form.Item>
            </Col>

            <Col span={6}>
              <SelectField label='Trạng thái:' name='status'>
                <Option value={`${ChangeSIMStatus.DONE}`}>Hoàn thành</Option>
                <Option value={`${ChangeSIMStatus.MBF_REJECT}`}>Thất bại</Option>
              </SelectField>
            </Col>

            <Col span={6}>
              <RangePickerField label='Thời gian yêu cầu:' name='created_at' />
            </Col>
          </Row>
        </Form>

        <div className='row-button justify-end'>
          <Button onClick={() => formRef?.current?.submit()}>Tìm kiếm</Button>
          <ResetButton buttonRef={formRef} />

          {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM, ActionText.EXPORT) && (
            <Button onClick={() => handleExportExcel(data?.meta?.totalItems)}>Export</Button>
          )}
        </div>
      </Wrapper>

      <Table
        bordered
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data?.data}
        pagination={PaginationConfig(data)}
        onChange={handlePagechange}
        rowKey={(record: RequestChangeSIM) => {
          return record?.id;
        }}
      />
    </div>
  );
}

export default RequestChangeSimList;
