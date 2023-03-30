import { Col, DatePicker, Form, Row, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { TicketType, TicketTypeText } from 'constants/ticket.enum';
import { disabledDate } from 'share/helper';

const { RangePicker } = DatePicker;

interface FilterTickerProps {
  dataUser: any;
}

const FilterTicker: React.FC<FilterTickerProps> = (props: FilterTickerProps) => {
  const { dataUser } = props;

  return (
    <Row gutter={[16, 16]} className='batch-list'>
      <Col span={24}>
        <h3>Lọc danh sách cần gửi</h3>
        <Row>
          <Col span={4}>
            <Form.Item name='type' label='Loại Ticket'>
              <Select placeholder='Please choose'>
                <Option value={`$eq:${TicketType.CS}`}>{TicketTypeText.CS}</Option>
                <Option value={`$eq:${TicketType.US}`}>{TicketTypeText.US}</Option>
                <Option value={`$eq:${TicketType.TL}`}>{TicketTypeText.TL}</Option>
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name='created_by' label='Người tạo'>
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
          <Col span={5}>
            <Form.Item name='created_at' label='Thời gian tạo'>
              <RangePicker disabledDate={disabledDate} />
            </Form.Item>
          </Col>
          <Col span={5}>
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
          <Col span={5}>
            <Form.Item name='updated_at' label='Thời gian cập nhật'>
              <RangePicker disabledDate={disabledDate} />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default FilterTicker;
