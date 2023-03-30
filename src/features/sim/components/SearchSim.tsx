import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useAppSelector } from 'app/hooks';
import RangePickerField from 'components/Form/RangePickerField';
import SelectField from 'components/Form/SelectField';
import { KYCProfileTempStatus } from 'constants/kyc.enum';
import { PhoneNumberType, SIMStatus } from 'constants/sim.enum';
import { TicketStatus, TicketStatusText } from 'constants/ticket.enum';
import useFetch from 'hooks/useFetch';
import moment from 'moment';
import React, { ReactNode, useEffect, useRef } from 'react';
import { kycProfileTempStatusText } from 'utils/kyc';
const { Option } = Select;

interface SearchTicketProps {
  onSearch: (value: any) => void;
  loading: boolean;
  buttons?: ReactNode[];
}

const SearchSim: React.FC<SearchTicketProps> = ({ onSearch, loading, buttons }) => {
  const { simActivatedFilters } = useAppSelector((state) => state.filters);
  const [form] = Form.useForm();
  const ditributor = useFetch({ url: `/distributor/list`, param: { limit: 999 } });
  const { data } = useFetch({ url: '/public/meta' });
  const { data: users } = useFetch({ url: `/users`, param: { limit: 999 } });
  const refBtnSearch = useRef(null);

  function onFill() {
    form.setFieldsValue({
      search: simActivatedFilters?.search ?? '',
      mbf_code: simActivatedFilters?.['filter.mbf_code'] ?? '',
      distributor_id: simActivatedFilters?.['filter.distributor_id'] ?? '',
      activated_at: simActivatedFilters?.['filter.activated_at'] && [
        moment(simActivatedFilters?.['filter.activated_at']?.slice(5)?.split(',')[0]),
        moment(simActivatedFilters?.['filter.activated_at']?.slice(5)?.split(',')[1]),
      ],
      ticket_status: simActivatedFilters?.['filter.ticket_status'] ?? '',
      kyc_temp_status: simActivatedFilters?.['filter.kyc_temp_status'] ?? '',
      kyc_temp_updated_by: simActivatedFilters?.['filter.kyc_temp_updated_by'] ?? '',
      kyc_temp_updated_at: simActivatedFilters?.['filter.kyc_temp_updated_at'] && [
        moment(simActivatedFilters?.['filter.kyc_temp_updated_at']?.slice(5)?.split(',')[0]),
        moment(simActivatedFilters?.['filter.kyc_temp_updated_at']?.slice(5)?.split(',')[1]),
      ],
      phone_number_type: simActivatedFilters?.['filter.phone_number_type'] ?? '',
      sim_status: simActivatedFilters?.['filter.sim_status'] ?? '',
    });
  }

  useEffect(() => {
    onFill();
    // eslint-disable-next-line
  }, [simActivatedFilters]);

  return (
    <Card className='search-box' style={{ marginBottom: 16 }}>
      <Form layout='vertical' form={form} onFinish={(val) => onSearch(val)}>
        <Row gutter={[20, 5]}>
          <Col xl={6} xs={12}>
            <Form.Item name='search' label='Tìm kiếm:'>
              <Input placeholder='Mã ticket, số thuê bao, tên thuê bao, số serial...' />
            </Form.Item>
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='MBF code:' name='mbf_code'>
              {data?.mbf_codes.map((v: string, i: number) => (
                <Option key={v + i} value={v}>
                  {v}
                </Option>
              ))}
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Nhà phân phối:' name='distributor_id'>
              {ditributor?.data?.data.map((x: any) => (
                <Option key={`$eq:${x?.id}`} value={x?.id}>
                  {x?.name}
                </Option>
              ))}
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <RangePickerField label='Ngày kích hoạt:' name='activated_at' />
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Trạng thái ticket:' name='ticket_status'>
              <Option value={TicketStatus.DONE}>{TicketStatusText.DONE}</Option>
              <Option value={TicketStatus.DRAFT}>{TicketStatusText.DRAFT}</Option>
              <Option value={TicketStatus.REQUESTED}>{TicketStatusText.REQUESTED}</Option>
              <Option value={TicketStatus.USER_UPDATED}>{TicketStatusText.USER_UPDATED}</Option>
              <Option value={TicketStatus.CX_APPROVED}>{TicketStatusText.CX_APPROVED}</Option>
              <Option value={TicketStatus.MBF_REJECT}>{TicketStatusText.MBF_REJECT}</Option>
              <Option value={TicketStatus.CANCELED}>{TicketStatusText.CANCEL}</Option>
              <Option value={`$null`}>None</Option>
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Trạng thái TTCN:' name='kyc_temp_status'>
              <Option value={KYCProfileTempStatus.DRAFT}>
                {kycProfileTempStatusText(KYCProfileTempStatus.DRAFT)}
              </Option>
              <Option value={KYCProfileTempStatus.APPROVED}>
                {kycProfileTempStatusText(KYCProfileTempStatus.APPROVED)}
              </Option>
              <Option value={KYCProfileTempStatus.DONE}>
                {kycProfileTempStatusText(KYCProfileTempStatus.DONE)}
              </Option>
              <Option value={KYCProfileTempStatus.MBF_REJECT}>
                {kycProfileTempStatusText(KYCProfileTempStatus.MBF_REJECT)}
              </Option>
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Người cập nhật:' name='kyc_temp_updated_by'>
              {users?.data.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item?.email}
                </Option>
              ))}
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <RangePickerField label='Ngày cập nhật:' name='kyc_temp_updated_at' />
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Loại Số:' name='phone_number_type'>
              <Option value={PhoneNumberType.NORMAL}>Số thường</Option>
              <Option value={PhoneNumberType.NICE}>Số đẹp</Option>
            </SelectField>
          </Col>
          <Col xl={6} xs={12}>
            <SelectField label='Trạng thái Sim:' name='sim_status'>
              <Option value={`${SIMStatus.EXPIRED}`}>Expired</Option>
              <Option value={`${SIMStatus.ACTIVATION_SUCCESS}`}>Inusage</Option>
            </SelectField>
          </Col>
          <Col span={24} style={{ marginTop: '12px' }} className='search-box__right'>
            <Button
              type='default'
              onClick={() => {
                form.resetFields();
                //@ts-ignore
                refBtnSearch && refBtnSearch?.current?.click();
              }}>
              Xóa tìm kiếm
            </Button>
            <Button
              className='search-box__search-button'
              htmlType='submit'
              ref={refBtnSearch}
              loading={loading}>
              Tìm kiếm
            </Button>
            {buttons}
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchSim;
