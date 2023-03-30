import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd';
import React, { useRef } from 'react';
import { disabledDate } from 'share/helper';
const { Option } = Select;
const { RangePicker } = DatePicker;
interface SearchTicketProps {
  onSearch: (value: any) => void;
  loading: boolean;
  buttons?: React.ReactNode[];
}

const SearchSuggest: React.FC<SearchTicketProps> = ({ onSearch, loading, buttons }) => {
  const [form] = Form.useForm();
  const refBtnSearch = useRef(null);

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col xl={8} xs={12}>
            <Form.Item name='filter.exclude_updated_user' label='Loại trừ các TBĐCN:'>
              <Select placeholder='Please choose'>
                <Option value='$eq:0'>Không</Option>
                <Option value='$eq:1'>Có</Option>
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={8} xs={12}>
            <Form.Item name='filter.is_active' label='Kích hoạt:'>
              <Select placeholder='Please choose'>
                <Option value='$eq:0'>No</Option>
                <Option value='$eq:1'>Yes</Option>
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={8}>
            <Form.Item name='create_at' label='Ngày tạo:'>
              <RangePicker style={{ width: '100%' }} disabledDate={disabledDate} />
            </Form.Item>
          </Col>
          <Col xs={12} xl={24} className='search-box__right' style={{ marginTop: '10px' }}>
            <Button
              type='default'
              id='btn-reset'
              onClick={() => {
                form.resetFields();
                //@ts-ignore
                refBtnSearch && refBtnSearch?.current?.click();
              }}>
              Reset
            </Button>
            <Button
              type='primary'
              className='search-box__search-button'
              htmlType='submit'
              ref={refBtnSearch}
              loading={loading}>
              Search
            </Button>

            {buttons}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchSuggest;
