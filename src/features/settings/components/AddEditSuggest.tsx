import { Col, DatePicker, Form, Input, Modal, Radio, Row, Select, UploadFile } from 'antd';
import locationApi from 'api/location';
import { useAppDispatch } from 'app/hooks';
import { KycIdType, KycIdTypeText } from 'constants/kyc.enum';
import { ticketActions } from 'features/ticketDetail/pages/ticketSlice';
import { Suggest } from 'models/suggest';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { DATE_FORMAT, disabledDate } from 'share/helper';
import { IssuePlace, Location, LocationListRequest } from '../../../models/location';
import '../Setting.scss';
const { Option } = Select;
const { RangePicker } = DatePicker;
interface ModalAddSuggestProps {
  openModal: boolean;
  fetchData: (options?: any) => void;
  cancelModal: () => void;
  onFinish: (values: any) => void;
  suggestItem?: Suggest | null;
  type: 'add' | 'edit';
  isConfirm?: boolean;
  setIsConfirm?: any;
}
const dateFormat = 'YYYY/MM/DD';
const AddEditSuggest: React.FC<ModalAddSuggestProps> = ({
  openModal,
  fetchData,
  cancelModal,
  onFinish,
  suggestItem,
  type,
  isConfirm,
  setIsConfirm,
}) => {
  const [form] = Form.useForm();
  const [wards, setWards] = useState<Location[]>([]);

  const handleSubmit = async (values: any) => {};

  const handleCancel = () => {
    if (isConfirm) {
      setIsConfirm(false);
    } else {
      form.resetFields();
      cancelModal();
    }
  };

  useEffect(() => {
    if (suggestItem) {
      onFill();
    }
  }, [suggestItem]);

  const onFill = () => {
    form.setFieldsValue({
      is_exclude_updated_user: suggestItem?.exclude_updated_user,
      is_active: suggestItem?.is_active,
      create_at: [moment(suggestItem?.start_at), moment(suggestItem?.end_at)],
    });
  };

  return (
    <Modal
      title={type === 'add' ? `${isConfirm ? 'Xác nhận' : 'Thêm yêu cầu'}` : 'Cập nhật yêu cầu'}
      open={openModal}
      okText={type === 'add' ? 'Tạo mới' : 'Cập nhật'}
      cancelText='Huỷ'
      onOk={form.submit}
      onCancel={handleCancel}>
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <div className={isConfirm ? 'is-hidden' : ''}>
          <Form.Item
            label='Loại trừ các TBĐCN:'
            name='is_exclude_updated_user'
            rules={[{ required: true, message: 'Vui lòng chọn loại trừ các TBĐCN!' }]}>
            <Select>
              <Option value={true}>Có</Option>
              <Option value={false}>Không</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Kích hoạt:'
            name='is_active'
            rules={[{ required: true, message: 'Vui lòng chọn loại kích hoạt!' }]}>
            <Select>
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Thời gian:'
            name='create_at'
            rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
            <RangePicker format={DATE_FORMAT} />
          </Form.Item>
        </div>
        {isConfirm && <p>Bạn có muốn tạo mới yêu cầu không?</p>}
      </Form>
    </Modal>
  );
};

export default AddEditSuggest;
