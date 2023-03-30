import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
  Select,
  Table,
  TablePaginationConfig,
} from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { ColumnsType } from 'antd/lib/table';
import batchApi, { SEND_BATCH_URL } from 'api/batchApi';
import CreateBatchModal from 'components/CreateBatchModal';
import { BatchStatus, SendBatchType, sendBatchTypeText } from 'constants/batch.enum';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import useFetch from 'hooks/useFetch';
import useModal from 'hooks/useModal';
import { SendBatchFilter } from 'models/batch';
import { StatisticalRequest } from 'models/ticket';
import moment from 'moment';
import { Fragment, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { disabledDate, exportExcel, showNumberOrderTable } from 'share/helper';
import { capitalizeText, formatDateFromIso } from 'utils';
import { batchStatusText } from 'utils/batch';
import PaginationConfig from 'utils/panigationConfig';

const Option = Select.Option;
const { RangePicker } = DatePicker;

function SendBatchPage() {
  const { setLoading } = useContext(AppContext);
  const refBtnSearch = useRef<HTMLButtonElement>(null);

  const [querySelect, setQuerySelect] = useState<StatisticalRequest>();
  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
  });

  const [form] = Form.useForm();

  const { isCan } = useCan();
  const { data, fetchData } = useFetch({
    url: `${SEND_BATCH_URL}/list`,
    param: query,
    setLoading,
  });
  const { data: dataUser } = useFetch({
    url: `/users`,
  });

  const onSelectedFromDate = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setQuerySelect({
      ...query,
      to: moment(dateString[1]).endOf('day').format(),
      from: moment(dateString[0]).startOf('day').format(),
    });
  };

  const createBatchModal = useModal();

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'stt',
      render: (_value, _record, index) => {
        return showNumberOrderTable(query.page || 0, index);
      },
    },
    {
      title: 'SendBatch_Id',
      dataIndex: 'code',
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      render: (record: BatchStatus) => {
        return batchStatusText(record);
      },
    },
    {
      title: 'Type',
      dataIndex: 'sendbatch_type',
      render: (v) => sendBatchTypeText(v),
    },
    {
      title: 'Diễn giải',
      dataIndex: 'description',
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'total_done',
    },
    {
      title: 'Thât bại',
      dataIndex: 'total_error',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record.name);
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (record: any) => {
        return formatDateFromIso(record, Format.DATE_TIME);
      },
      key: 'created_at',
    },
    {
      title: 'Người cập nhật cuối',
      dataIndex: 'updatedByUser',
      render: (record: { [key: string]: string }) => {
        return capitalizeText(record.name);
      },
    },
    {
      title: 'Ngày cập nhật cuối',
      dataIndex: 'updated_at',
      render: (record: any) => {
        return formatDateFromIso(record, Format.DATE_TIME);
      },
      key: 'updated_at',
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (value, record, rowIndex) => {
        if (isCan(Feature.TICKET_SENDBATCH_DETAIL, ActionText.READ)) {
          return (
            <Link to={`/admin/ticket/send-batch/${value.id}?type=${value.sendbatch_type}`}>
              Xem Chi Tiết
            </Link>
          );
        }
        return null;
      },
    },
  ];

  const handleCreateSuccess = () => {
    createBatchModal.toggle();
    fetchData({
      limit: 10,
      page: 1,
    });
  };

  const exportExcelHandler = () => {
    exportExcel(columns, batchApi.getSendBatchList, data.meta.totalItems, query, 'sendbatch');
  };

  const onSearch = async (val: any) => {
    let params: SendBatchFilter = {
      limit: query.limit,
      page: 1,
    };
    if (val?.status) {
      params['filter.status'] = val.status;
    }
    if (val?.sendbatch_type) {
      params['filter.sendbatch_type'] = val.sendbatch_type;
    }
    if (val?.created_by) {
      params['filter.created_by'] = val.created_by;
    }
    if (val?.created_at) {
      params['filter.created_at'] = `$btw:${moment(val?.created_at && val?.created_at[0])
        .startOf('day')
        .format()},${moment(val?.created_at[1]).endOf('day').format()}`;
    }
    if (val?.search) {
      params['search'] = val.search.trim();
    }
    setQuery(params);
    fetchData(params);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (query.limit !== pageSize || current !== query.page) {
      setQuery({ ...query, limit: pageSize || query.limit, page: current || 1 });
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  const handleBtnResetClick = () => {
    form.resetFields();
    refBtnSearch?.current?.click();
  };

  return (
    <>
      {createBatchModal.isShowing === true && (
        <CreateBatchModal
          isShowing={createBatchModal.isShowing}
          toggle={createBatchModal.toggle}
          mode='current'
          onCreateSuccess={handleCreateSuccess}
        />
      )}
      <Fragment>
        <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
          <Row gutter={[16, 16]} className='search-box search-box__end'>
            <Col xl={3} xs={8}>
              <Form.Item name='status' label='Tình trạng'>
                <Select placeholder='Please choose'>
                  <Option value={`$eq:${BatchStatus.NEW}`}>
                    {batchStatusText(BatchStatus.NEW)}
                  </Option>
                  <Option value={`$eq:${BatchStatus.PROCESSING}`}>
                    {batchStatusText(BatchStatus.PROCESSING)}
                  </Option>
                  <Option value={`$eq:${BatchStatus.UPLOADING}`}>
                    {batchStatusText(BatchStatus.UPLOADING)}
                  </Option>
                  <Option value={`$eq:${BatchStatus.FAILED}`}>
                    {batchStatusText(BatchStatus.FAILED)}
                  </Option>
                  <Option value={`$eq:${BatchStatus.DONE}`}>
                    {batchStatusText(BatchStatus.DONE)}
                  </Option>
                  <Option value={undefined}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={2} xs={8}>
              <Form.Item name='sendbatch_type' label='Loại'>
                <Select placeholder='Please choose'>
                  <Option value={`$eq:${SendBatchType.TICKET}`}>
                    {sendBatchTypeText(SendBatchType.TICKET)}
                  </Option>
                  <Option value={`$eq:${SendBatchType.SIM}`}>
                    {sendBatchTypeText(SendBatchType.SIM)}
                  </Option>
                  <Option value={undefined}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} xs={8}>
              <Form.Item name='created_by' label='Người tạo'>
                <Select
                  value={null}
                  placeholder='Please choose'
                  optionFilterProp='children'
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option!.children as unknown as string).includes(input)
                  }>
                  {dataUser?.data.map((item: any) => (
                    <Option key={item?.id} value={item.id}>
                      {item?.name}
                    </Option>
                  ))}
                  <Option value={undefined}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={5} xs={12}>
              <Form.Item name='created_at' label='Ngày tạo'>
                <RangePicker
                  onChange={onSelectedFromDate}
                  disabledDate={disabledDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xl={3} xs={12}>
              <Form.Item name='search' label=' '>
                <Input placeholder='SendBatchId, Diễn giải ...' />
              </Form.Item>
            </Col>
            <Col xl={2} xs={4}>
              <Button style={{ width: `100%` }} onClick={handleBtnResetClick}>
                Reset
              </Button>
            </Col>
            <Col xl={2} xs={4}>
              <Button type='primary' htmlType='submit' style={{ width: `100%` }} ref={refBtnSearch}>
                Search
              </Button>
            </Col>
            <Col xl={2} xs={4}>
              {isCan(Feature.TICKET_SENDBATCH, ActionText.EXPORT) && (
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ width: `100%` }}
                  onClick={exportExcelHandler}>
                  Export
                </Button>
              )}
            </Col>
            <Col xl={2} xs={4}>
              {isCan(Feature.TICKET_SENDBATCH, ActionText.CREATE) && (
                <Button type='primary' onClick={createBatchModal.toggle}>
                  Thêm mới
                </Button>
              )}
            </Col>
          </Row>
        </Form>
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
      </Fragment>
    </>
  );
}

export default SendBatchPage;
