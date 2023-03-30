import { Button, Card, Col, Form, Input, Row, Select, Table, TablePaginationConfig } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { ColumnsType } from 'antd/lib/table';
import simApi from 'api/simApi';
import RangePickerField from 'components/Form/RangePickerField';
import SelectField from 'components/Form/SelectField';
import { Format } from 'constants/date';
import { ActionText, Feature } from 'constants/permission';
import {
  ChangeSIMExpiredStatus,
  ChangeSIMExpiredStatusText,
  ChangeSIMStatus,
  changeSIMStatusText,
  ChangeSIMType,
  changeSIMTypeText,
} from 'constants/sim.enum';
import { AppContext } from 'context/AppContext';
import useCan from 'hooks/useCan';
import { TicketFilter } from 'models/ticket';
import moment from 'moment';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { generateTableOrderNumber } from 'share/helper';
import { formatDateFromIso } from 'utils';
import PaginationConfig from 'utils/panigationConfig';

const { Option } = Select;

function RequestToChange() {
  const [changeSimData, setChangeSimData] = useState<any>();
  const { setLoading } = useContext(AppContext);
  const refBtnSearch = useRef(null);
  const [ChangeSimRequestStatusList, setChangeSimRequestStatusList] = useState<any>([]);
  const [form] = Form.useForm();
  const [query, setQuery] = useState<any>({
    limit: 10,
    page: 1,
    'filter.type': `$in:LOST_SIM,DAMAGED_SIM`,
  });

  const { isCan } = useCan();

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      render: (_value, _record, index) =>
        generateTableOrderNumber(query?.page, query?.limit, index),
    },
    {
      title: 'Mã yêu cầu',
      dataIndex: 'code',
    },
    {
      title: 'Số SIM Serial',
      dataIndex: 'old_serial',
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
      title: 'Số CMND/CCCD',
      dataIndex: 'id_number',
    },
    {
      title: 'Lý do',
      dataIndex: 'type',
      render: (value) => changeSIMTypeText(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (value) => changeSIMStatusText(value),
    },
    {
      title: 'Trạng thái quá hạn',
      dataIndex: 'expired_status',
      render: (value) => ChangeSIMExpiredStatusText(value),
    },
    {
      title: 'Thời gian còn lại (ngày)',
      dataIndex: 'process_time_left',
    },
    {
      title: 'Thời gian quá hạn (ngày)',
      dataIndex: 'expired_distance',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (value) => formatDateFromIso(value, Format.DATE),
      key: 'created_at',
    },
    {
      title: 'Người duyệt',
      dataIndex: 'approved_by',
    },
    {
      title: 'Thao Tác',
      fixed: 'right',
      render: (record: any) =>
        isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL, ActionText.READ) && (
          <Link to={`/admin/sim/request-to-change/details/${record?.id}`}>Chi Tiết</Link>
        ),
    },
  ];

  const onSearch = async (val: any) => {
    let params: any = {
      limit: 10,
      page: 1,
      'filter.type': `$in:LOST_SIM,DAMAGED_SIM`,
    };

    if (val?.search) {
      params['search'] = val?.search;
    }
    if (val?.type) {
      params['filter.type'] = `$in:${val?.type}`;
    }
    if (val?.created_at) {
      params['filter.created_at'] = `$btw:${moment(val?.created_at[0])
        .startOf('day')
        .format()},${moment(val?.created_at[1]).endOf('day').format()}`;
    }
    if (val?.status) {
      params['filter.status'] = `$eq:${val?.status}`;
    }
    if (val?.expired_status) {
      params['filter.expired_status'] = `$eq:${val?.expired_status}`;
    }

    setQuery(params);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (current !== query.page || pageSize !== query.limit) {
      setQuery({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  const exportExcelHandler = async (query: TicketFilter, total: number) => {
    setLoading(true);
    try {
      let numberPgae = total < 100 ? 1 : Math.ceil(total / 100);
      let promieses: Array<any> = [];
      let result;
      for (let index = 0; index < numberPgae; index++) {
        promieses.push(
          simApi.getChangeSimList({
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

  const getChangeSim = async () => {
    try {
      setLoading(true);
      const response = await simApi.getChangeSimList(query);
      setLoading(false);
      const { status, data } = response;
      if (status === 200) {
        setChangeSimData(data.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChangeSim();
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    let keys = [];
    for (let key in ChangeSIMStatus) {
      if (ChangeSIMStatus.hasOwnProperty(key)) keys.push(key);
    }
    setChangeSimRequestStatusList(keys);
  }, []);

  return (
    <Fragment>
      <Card className='search-box' style={{ marginBottom: 16 }}>
        <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name='search' label='Tìm kiếm:'>
                <Input placeholder='Mã yêu cầu, số SIM serial, số thuê bao...' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <RangePickerField label='Ngày tạo yêu cầu:' name='created_at' />
            </Col>
            <Col span={6}>
              <SelectField label='Trạng thái yêu cầu:' name='status'>
                {ChangeSimRequestStatusList.map((status: any, index: number) => {
                  return (
                    <Option key={index} value={`$eq:${status}`}>
                      {changeSIMStatusText(status)}
                    </Option>
                  );
                })}
              </SelectField>
            </Col>
            <Col span={6}>
              <SelectField label='Trạng thái quá hạn:' name='expired_status'>
                <Option value={`${ChangeSIMExpiredStatus.NORMAL}`}>
                  {ChangeSIMExpiredStatusText(ChangeSIMExpiredStatus.NORMAL)}
                </Option>
                <Option value={`${ChangeSIMExpiredStatus.EXPIRED_APPROVAL}`}>
                  {ChangeSIMExpiredStatusText(ChangeSIMExpiredStatus.EXPIRED_APPROVAL)}
                </Option>
                <Option value={`${ChangeSIMExpiredStatus.EXPIRED_PAYMENT}`}>
                  {ChangeSIMExpiredStatusText(ChangeSIMExpiredStatus.EXPIRED_PAYMENT)}
                </Option>
              </SelectField>
            </Col>
            <Col span={6}>
              <SelectField label='Loại:' name='type'>
                <Option value={`$eq:${ChangeSIMType.LOST_SIM}`}>
                  {changeSIMTypeText(ChangeSIMType.LOST_SIM)}
                </Option>
                <Option value={`$eq:${ChangeSIMType.DAMAGED_SIM}`}>
                  {changeSIMTypeText(ChangeSIMType.DAMAGED_SIM)}
                </Option>
              </SelectField>
            </Col>
            <Col
              span={24}
              style={{ marginTop: '12px', columnGap: '1rem' }}
              className='search-box__right'>
              <Button
                type='primary'
                className='search-box__search-button'
                htmlType='submit'
                ref={refBtnSearch}>
                Tìm kiếm
              </Button>
              <Button
                type='default'
                onClick={() => {
                  form.resetFields();
                  //@ts-ignore
                  refBtnSearch && refBtnSearch?.current?.click();
                }}>
                Xóa tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <div className='sim-activated-list relative'>
        <Table
          bordered
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={changeSimData?.data}
          onChange={handleTableChange}
          pagination={PaginationConfig(changeSimData)}
          rowKey={(record) => {
            return record.id;
          }}
        />
      </div>
    </Fragment>
  );
}

export default RequestToChange;
