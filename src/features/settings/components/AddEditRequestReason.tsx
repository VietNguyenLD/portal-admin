import { DatePicker, Form, Input, Modal, Select } from 'antd';
import { BlockServiceItem } from 'constants/app.reason';
import { AppReason } from 'models/app.reason';
import { useEffect } from 'react';
import { ItemType, ItemTypeText } from '../../../constants/ticket.enum';
const { Option } = Select;
interface AddEditLockCancelProps {
  openModal: boolean;
  fetchData: (options?: any) => void;
  cancelModal: () => void;
  onFinish: (values: any) => void;
  item?: AppReason | null;
  type: 'add' | 'edit';
}
const AddEditLockCancel: React.FC<AddEditLockCancelProps> = ({
  openModal,
  fetchData,
  cancelModal,
  onFinish,
  item,
  type,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    cancelModal();
  };

  useEffect(() => {
    form.resetFields();
  }, [openModal]);

  useEffect(() => {
    if (item) {
      onFill();
    }
  }, [item]);

  const onFill = () => {
    form.setFieldsValue({
      reason: item?.reason,
      is_active: item?.is_active,
      items: item?.items,
    });
  };

  return (
    <Modal
      title={
        type === 'add' ? 'Thêm Lý Do Yêu Cầu' : 'Cập Nhật Lý Do Yêu Cầu'
      }
      open={openModal}
      okText={type === 'add' ? 'Tạo mới' : 'Cập nhật'}
      cancelText='Huỷ'
      onOk={form.submit}
      onCancel={handleCancel}>
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item
          label='Lý do:'
          name='reason'
          rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Item:'
          name='items'
          rules={[{ required: true, message: 'Vui lòng chọn item!' }]}>
          <Select mode='multiple' allowClear>
            <Option value={ItemType.ID_FRONT}>{ItemTypeText.ID_FRONT}</Option>
            <Option value={ItemType.ID_BACK}>{ItemTypeText.ID_BACK}</Option>
            <Option value={ItemType.PORTRAIT}>{ItemTypeText.PORTRAIT}</Option>
            <Option value={ItemType.SIGNATURE}>{ItemTypeText.SIGNATURE}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Kích hoạt:'
          name='is_active'
          rules={[{ required: true, message: 'Vui lòng chọn loại kích hoạt!' }]}>
          <Select>
            <Option value={true}>Kích hoạt</Option>
            <Option value={false}>Không kích hoạt</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditLockCancel;
