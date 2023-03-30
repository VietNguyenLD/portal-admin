import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useAppSelector } from 'app/hooks';
import { ItemType } from 'constants/ticket.enum';
import { TicketFilter } from 'models/ticket';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
interface SearchTicketProps {
  onSearch: (value?: any) => void;
  loading: boolean;
  buttons?: React.ReactNode[];
}

const SearchReason: React.FC<SearchTicketProps> = ({ onSearch, loading, buttons }) => {
  const location = useLocation();
  const { query, queryPending, queryRequest } = useAppSelector((state) => state.ticket);
  const [form] = Form.useForm();

  const dateFormat = 'YYYY/MM/DD';

  const onFillStatusTicket = (params: TicketFilter) => {
    if (location.pathname === '/admin/ticket/request-list') {
      return '$eq:1';
    } else {
      if (
        ['$eq:1', '$eq:2', '$eq:3', '$eq:4', '$eq:5', '$eq:6'].includes(
          params['filter.status'] || '',
        )
      ) {
        return params['filter.status'];
      } else {
        return undefined;
      }
    }
  };

  const handleResetBtnClick = () => {
    form.resetFields()
    onSearch();
  };

  useEffect(() => {
    let params: TicketFilter;
    if (location.pathname === '/admin/ticket/pending') {
      params = queryPending;
    } else if (location.pathname === '/admin/ticket/request-list') {
      params = queryRequest;
    } else {
      params = query;
    }

    form.setFieldsValue({
      search: params?.search,
      status: onFillStatusTicket(params),
      phone_number_status: params['filter.phone_number_status'],
      ticket_expired: params.TicketExpiredStatus,
      type: params['filter.type'],
      requested_count: params['filter.requested_count'],
      updated_by: params['filter.updated_by'],
      create_at: params?.from &&
        params?.to && [moment(params?.from, dateFormat), moment(params?.to, dateFormat)],
    });
  }, [query, queryPending]);

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col span={6}>
            <Form.Item name='filter.is_active' label='Kích hoạt:'>
              <Select placeholder='Please choose'>
                <Option value='$eq:1'>Đã kích hoạt</Option>
                <Option value='$eq:0'>Chưa kích hoạt</Option>
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item name='filter.items' label='Items:'>
              <Select mode='tags' showArrow showSearch={false} placeholder='Chọn Item'>
                <Option value={ItemType.ID_FRONT}>Mặt trước CMND</Option>
                <Option value={ItemType.ID_BACK}>Mặt sau CMND</Option>
                <Option value={ItemType.PORTRAIT}>Chân dung</Option>
                <Option value={ItemType.SIGNATURE}>Chữ ký</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} className='search-box__right' style={{ marginTop: '10px' }}>
            <Button type='default' id='btn-reset' onClick={handleResetBtnClick}>
              Reset
            </Button>
            <Button
              type='primary'
              className='search-box__search-button'
              htmlType='submit'
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

export default SearchReason;
