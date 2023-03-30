import { Form, Modal, Select, Typography } from 'antd';
import { BlockServiceItem } from 'constants/app.reason';
import useFetch from 'hooks/useFetch';
import { Reason } from 'models/ticket';
const { Option } = Select;
interface LockSimProps {
  openModal: boolean;
  cancelModal: () => void;
  onFinish: (values: any) => void;
  type?: number;
  phoneNumber: string;
}
const { Text } = Typography;

const stylesFormItem: React.CSSProperties = {
  marginBottom: '0',
};
const LockSimModal: React.FC<LockSimProps> = ({
  openModal,
  cancelModal,
  onFinish,
  type,
  phoneNumber,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    cancelModal();
  };

  const reasons = useFetch({
    url: `/config/app-reason/list`,
    param: {
      limit: 9999,
      'filter.is_active': '$eq:1',
      'filter.type': '$eq:2',
    },
  });

  const renderTitile = () => {
    switch (type) {
      case BlockServiceItem.BLOCK_1_WAY:
        return 'khoá 1 chiều';
      case BlockServiceItem.BLOCK_2_WAY:
        return 'khoá 2 chiều';
      case BlockServiceItem.UNSUBSCRIPTION:
        return 'huỷ dịch vụ';
      case BlockServiceItem.UNLOCK:
        return 'mở khoá';
      default:
        return '';
    }
  };

  return (
    <Modal
      title='Xác nhận'
      open={openModal}
      okText='Đồng ý'
      cancelText='Huỷ'
      onOk={form.submit}
      onCancel={handleCancel}>
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <p style={{ textAlign: 'center' }}>
          Vui lòng nhập lý do {renderTitile()} thuê bao <Text mark>{phoneNumber}</Text>
        </p>
        <Form.Item label='' valuePropName='checked' style={stylesFormItem}>
          <Form.Item
            name='reasons'
            label='Items:'
            rules={[{ required: true, message: 'Vui lòng chọn lý do!' }]}>
            <Select
              mode='multiple'
              showArrow
              style={{ width: '100%' }}
              placeholder='Chọn Item'
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }>
              {reasons?.data?.data.map((reason: Reason) =>
                reason.items.includes(type as number) ? (
                  <Option key={reason.id} value={reason?.id} label={reason?.reason}>
                    {reason?.reason}
                  </Option>
                ) : null,
              )}
            </Select>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LockSimModal;
