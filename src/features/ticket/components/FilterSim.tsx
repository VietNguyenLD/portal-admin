import { Col, DatePicker, Form, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { TicketType, TicketTypeText } from 'constants/ticket.enum';
import React from 'react';
import { disabledDate } from 'share/helper';

const { RangePicker } = DatePicker;

interface FilterSimProps {
  dataUser: any;
  fetchDataTable?: any;
}

const FilterSim: React.FC<FilterSimProps> = (props: FilterSimProps) => {
  const { dataUser } = props;

  return (
    <Row gutter={[16, 16]} className='batch-list'>
      <Col span={24}>
        <h3>Lọc danh sách cần gửi</h3>
        <Row>
          <Col span={12}>
            <Form.Item name='updated_by' label='Người cập nhật'>
              <Select placeholder='Please choose'
                optionFilterProp='children'
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option!.children as unknown as string).includes(input)
                }
              >
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
    </Row>
  );
};

export default FilterSim;
