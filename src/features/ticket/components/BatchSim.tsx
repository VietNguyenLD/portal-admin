import { Button, Col, DatePicker, Form, Row, Select, TablePaginationConfig } from 'antd';
import { SIM_URL } from 'api/simApi';
import useFetch from 'hooks/useFetch';
import { SimFilter } from 'models/sim';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { disabledDate } from 'share/helper';
import SimTable from './SimTable';

const { Option } = Select;
const { RangePicker } = DatePicker;
interface BatchSimProps {
  onSaveBtnClick: (value: any) => void;
  dataUser: any;
  setListId: (value: any) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const BatchSim: React.FC<BatchSimProps> = (props: BatchSimProps) => {
  const { onSaveBtnClick, dataUser, setListId, setLoading } = props;

  const [query, setQuery] = useState({
    limit: 10,
    page: 1,
    'filter.kyc_temp_status': `$eq:3`,
    'filter.no_actived_ticket': '1',
  });

  const [form] = Form.useForm();

  const { data, fetchData } = useFetch({
    url: `v2${SIM_URL}/activated-sims`,
    param: query,
    setLoading,
  });

  const onSearch = async (val: any) => {
    let params: SimFilter = {
      limit: query.limit,
      page: 1,
      'filter.kyc_temp_status': `$eq:3`,
      'filter.no_actived_ticket': '1',
    };
    if (val?.updated_by) {
      params['filter.kyc_temp_updated_by'] = val.updated_by;
    }
    if (val?.updated_at) {
      params['filter.updated_at'] = `$btw:${moment(val?.updated_at[0])
        .startOf('day')
        .format()},${moment(val?.updated_at[1]).endOf('day').format()}`;
    }
    fetchData(params);
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current, pageSize } = pagination;
    if (query.limit !== pageSize || current !== query.page) {
      setQuery({ ...query, limit: pageSize || 10, page: current || 1 });
      fetchData({
        ...query,
        limit: pageSize,
        page: current,
      });
    }
  };

  return (
    <div className={'batch-body'}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[16, 16]} className='batch-list'>
          <Col span={18}>
            <h3>Lọc danh sách cần gửi</h3>
            <Row>
              <Col span={12}>
                <Form.Item name='updated_by' label='Người cập nhật'>
                  <Select
                    placeholder='Please choose'
                    optionFilterProp='children'
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      (option!.children as unknown as string).includes(input)
                    }>
                    {dataUser?.data.map((item: any) => (
                      <Option key={item.id} value={`$eq:${item.id}`}>
                        {item?.name}
                      </Option>
                    ))}
                    <Option value={undefined}>Tất cả</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='updated_at' label='Thời gian cập nhật'>
                  <RangePicker disabledDate={disabledDate} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={12}>
                <Button htmlType='submit' type='primary'>
                  Load danh sách
                </Button>
              </Col>
              <Col span={12}>
                <Button type='primary' style={{ width: `100%` }} onClick={onSaveBtnClick}>
                  Lưu
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <SimTable
          data={data}
          setListId={setListId}
          handleTableChange={handleTableChange}
          currentPage={query.page}></SimTable>
      </Form>
    </div>
  );
};

export default BatchSim;
