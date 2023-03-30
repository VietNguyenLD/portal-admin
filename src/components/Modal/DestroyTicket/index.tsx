import { Form, Input, Modal } from 'antd';

interface DestroyTicketProps {
  openModal: boolean;
  cancelModal: () => void;
  onFinish: (values: any) => void;
}
const DestroyTicket: React.FC<DestroyTicketProps> = ({ openModal, cancelModal, onFinish }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    cancelModal();
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
        <Form.Item
          label='Vui lòng nhập lý do Huỷ ticket:'
          name='reason'
          rules={[{ required: true, message: 'Bạn chưa nhập lý do!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DestroyTicket;
