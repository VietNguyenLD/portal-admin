import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import RangePickerField from 'components/Form/RangePickerField';
import SelectField from 'components/Form/SelectField';
import { SubscriberStatus } from 'constants/kyc.enum';
import { TicketExpiredStatus, TicketStatus, TicketType } from 'constants/ticket.enum';
import useFetch from 'hooks/useFetch';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

interface SearchTicketProps {
  onSearch: (value: any) => void;
  buttons?: React.ReactNode[];
  type?: string;
  filterValues?: any;
}

const SearchTicket: React.FC<SearchTicketProps> = (props: SearchTicketProps) => {
  const { onSearch, buttons, filterValues } = props;

  const refBtnSearch = useRef(null);
  const location = useLocation();

  const [form] = Form.useForm();
  const { data } = useFetch({ url: `/users` });

  const arrPath = location.pathname.split('/');
  const onFillTicketStatus = (value?: string) => {
    const status = value?.slice(5);
    if (!status) {
      return '';
    } else {
      return status && status?.length > 1 ? '' : Number(value?.slice(5));
    }
  };

  function onFill() {
    form.setFieldsValue({
      search: filterValues?.search ?? '',
      ticket_status: onFillTicketStatus(filterValues?.['filter.status']) ?? '',
      phone_number_status: filterValues?.['filter.phone_number_status'] ?? '',
      ticket_expired: filterValues?.TicketExpiredStatus ?? '',
      type: filterValues?.['filter.type'] ?? '',
      requested_count: filterValues?.['filter.requested_count'] ?? '',
      updated_by: filterValues?.['filter.updated_by'] ?? '',
      created_at: filterValues?.['filter.created_at'] && [
        moment(filterValues?.['filter.created_at']?.slice(5)?.split(',')[0]),
        moment(filterValues?.['filter.created_at']?.slice(5)?.split(',')[1]),
      ],
      content: filterValues?.['filter.content'] ?? '',
    });
  }

  useEffect(() => {
    onFill();
    // eslint-disable-next-line
  }, [filterValues]);

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name='search' label='Tìm kiếm:'>
              <Input placeholder='Tên thuê bao, số thuê bao, tên thuê bao, số serial, batch id ...' />
            </Form.Item>
          </Col>
          <Col span={6}>
            {arrPath[arrPath.length - 1] === 'list' ? (
              <SelectField label='Trạng thái ticket:' name='ticket_status'>
                <Option value={TicketStatus.REQUESTED}>Đang yêu cầu cập nhật</Option>
                <Option value={TicketStatus.USER_UPDATED}>Chờ duyệt</Option>
                <Option value={TicketStatus.CX_APPROVED}>CX duyệt</Option>
                <Option value={TicketStatus.MBF_REJECT}>MBF từ chối</Option>
                <Option value={TicketStatus.DONE}>Hoàn thành</Option>
                <Option value={TicketStatus.CANCELED}>Hủy</Option>
              </SelectField>
            ) : arrPath[arrPath.length - 1] === 'pending' ? (
              <SelectField label='Trạng thái ticket:' name='ticket_status'>
                <Option value={TicketStatus.USER_UPDATED}>Chờ duyệt</Option>
                <Option value={TicketStatus.CX_APPROVED}>CX duyệt</Option>
                <Option value={TicketStatus.MBF_REJECT}>MBF từ chối</Option>
              </SelectField>
            ) : (
              <Form.Item label='Trạng thái ticket:' name='ticket_status'>
                <Select disabled={true} defaultValue={TicketStatus.DRAFT}>
                  <Option value={TicketStatus.DRAFT}>Draft</Option>
                </Select>
              </Form.Item>
            )}
          </Col>
          <Col span={6}>
            <SelectField label='Trạng thái thuê bao:' name='phone_number_status'>
              <Option value={SubscriberStatus.UNLOCK}>Đang hoạt động</Option>
              <Option value={SubscriberStatus.BLOCK_1_WAY}>Bị khóa 1C</Option>
              <Option value={SubscriberStatus.BLOCK_2_WAY}>Bị khóa 2C</Option>
              <Option value={SubscriberStatus.UNSUBSCRIPTION}>Bị hủy dịch vụ</Option>
            </SelectField>
          </Col>
          <Col span={6}>
            <SelectField label='Trạng thái quá hạn:' name='ticket_expired'>
              <Option value={TicketExpiredStatus.NORMAL}>Bình thường</Option>
              <Option value={TicketExpiredStatus.WARNING}>Quá hạn xử lý</Option>
              <Option value={TicketExpiredStatus.EXPIRED}>Quá hạn cập nhật</Option>
            </SelectField>
          </Col>
          <Col span={6}>
            <SelectField label='Loại ticket:' name='type'>
              <Option value={TicketType.CS}>CS</Option>
              <Option value={TicketType.US}>US</Option>
              <Option value={TicketType.TL}>TL</Option>
            </SelectField>
          </Col>
          <Col span={6}>
            <SelectField label='Số lần CS yêu cầu:' name='requested_count'>
              <Option value={1}>1 lần</Option>
              <Option value={2}>2 lần</Option>
              <Option value={3}>3 lần</Option>
            </SelectField>
          </Col>
          <Col span={6}>
            <SelectField label='Người cập nhật:' name='updated_by'>
              {data?.data.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item?.name}
                </Option>
              ))}
            </SelectField>
          </Col>
          <Col span={6}>
            <RangePickerField label='Ngày tạo:' name='created_at' />
          </Col>
          <Col span={6}>
            <SelectField label='Nội dung:' name='content'>
              <Option value='confirm'>Xác nhận</Option>
              <Option value='update'>Cập nhật</Option>
            </SelectField>
          </Col>
          <Col xs={12} xl={24} className='search-box__right' style={{ marginTop: '1.5rem' }}>
            <Button
              type='default'
              onClick={() => {
                form.resetFields();
                //@ts-ignore
                refBtnSearch && refBtnSearch?.current?.click();
              }}>
              Xóa tìm kiếm
            </Button>
            <Button className='search-box__search-button' htmlType='submit' ref={refBtnSearch}>
              Tìm kiếm
            </Button>
            {buttons}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchTicket;
