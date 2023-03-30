import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Dropdown, Form, Input, MenuProps, Row, Select } from 'antd';
import { useAppSelector } from 'app/hooks';
import useFetch from 'hooks/useFetch';
import { TicketFilter } from 'models/ticket';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchUpdateListTicketProps {
  onSearch: (value: any) => void;
  loading: boolean;
  buttons?: React.ReactNode[];
  type?: string;
}

const SearchUpdateListTicket: React.FC<SearchUpdateListTicketProps> = (
  props: SearchUpdateListTicketProps,
) => {
  const { onSearch } = props;

  const location = useLocation();
  const { query, queryPending, queryRequest } = useAppSelector((state) => state.ticket);

  const [form] = Form.useForm();

  const { data } = useFetch({ url: `/users` });

  const dateFormat = 'YYYY/MM/DD';

  const onFillStatusTicket = (params: TicketFilter) => {
    if (location.pathname === '/admin/ticket/request-list') {
      return '$eq:1';
    } else {
      if (
        ['$eq:1', '$eq:2', '$eq:3', '$eq:4', '$eq:5', '$eq:6', '$eq:7'].includes(
          params['filter.status'] || '',
        )
      ) {
        return params['filter.status'];
      } else {
        return undefined;
      }
    }
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
    console.log(params);

    form.setFieldsValue({
      search: params?.search,
      status: onFillStatusTicket(params),
      phone_number_status: params['filter.phone_number_status'],
      ticket_expired: params.TicketExpiredStatus,
      type: params['filter.type'],
      requested_count: params['filter.requested_count'],
      // updated_by: params['filter.updated_by'],
      create_at: params?.from &&
        params?.to && [moment(params?.from, dateFormat), moment(params?.to, dateFormat)],
    });
  }, [query, queryPending]);

  const items: MenuProps['items'] = [
    {
      label: '1st menu item',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: '2nd menu item',
      key: '2',
      icon: <UserOutlined />,
    },
    {
      label: '3rd menu item',
      key: '3',
      icon: <UserOutlined />,
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col xl={6}>
            <Input placeholder='Tên thuê bao, số thuê bao, tên thuê bao, số serial...' />
          </Col>
          <Col xl={2}>
            <Button>Import</Button>
          </Col>
          <Col xl={2}>
            <Button>Export</Button>
          </Col>
          <Col xl={14}>
            <Dropdown.Button style={{ justifyContent: 'end' }} menu={menuProps}>
              Export template
            </Dropdown.Button>
          </Col>
          <Col xs={12}>
            <Form.Item name='search' label='Tìm kiếm'>
              <Input placeholder='Tên thuê bao, số thuê bao, tên thuê bao, số serial...' />
            </Form.Item>
          </Col>
          <Col xl={6} xxl={8} xs={12}>
            <Form.Item name='create_at' label='Ngày tạo:'>
              <RangePicker />
            </Form.Item>
          </Col>
          <Col xl={6} xxl={4} xs={12}>
            <Form.Item name='updated_by' label='Người xử lý:'>
              <Select placeholder='Please choose' onChange={(val) => {}}>
                {data?.data.map((item: any) => (
                  <Option key={item.id} value={`$eq:${item.id}`}>
                    {item?.name}
                  </Option>
                ))}
                <Option value={undefined}>Tất cả</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchUpdateListTicket;
