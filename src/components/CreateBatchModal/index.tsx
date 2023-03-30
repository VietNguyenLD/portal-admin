import { Col, Form, Input, Modal, Row, Select, Spin } from 'antd';
import batchApi from 'api/batchApi';
import { useAppSelector } from 'app/hooks';
import { SendBatchType, sendBatchTypeText } from 'constants/batch.enum';
import BatchSim from 'features/ticket/components/BatchSim';
import BatchTicket from 'features/ticket/components/BatchTicket';
import useFetch from 'hooks/useFetch';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { capitalizeText } from 'utils';
import './CreateBatchModal.scss';

const { Option } = Select;
interface CreateBatchModalProps {
  mode?: string;
  serialNumber?: string;
  isShowing: boolean;
  toggle: () => void;
  onReRender?: (flag: boolean) => void;
  onCreateSuccess: () => void;
}

function CreateBatchModal(props: CreateBatchModalProps) {
  const { isShowing, toggle, onCreateSuccess } = props;

  const { currentUser } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState(SendBatchType.TICKET);
  const [listId, setListId] = useState<any[]>([]);
  const [description, setDescription] = useState('');

  const { data: dataUser } = useFetch({ url: `/users` });

  const handleSaveBtnClick = async () => {
    if (!listId.length) {
      toast.error('Xin hãy chọn ticket');
      return;
    }

    try {
      const response = await batchApi.createBatch({
        item_ids: listId,
        type,
        description,
      });
      const { status } = response;
      if (status === 201) {
        onCreateSuccess();
        toast.success('Tạo batch thành công!');
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    toggle();
  };

  const handleSelectTypeChange = (e: any) => {
    setType(e);
  };

  return (
    <Modal
      width={'100%'}
      wrapClassName='create-batch-modal'
      footer={null}
      centered
      open={isShowing}
      onCancel={handleCancel}
      title='Tạo mới Sendbatch'>
      <Spin spinning={loading}>
        <Form>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name='search' label='Diễn giải'>
                <Input
                  placeholder='Nhập diễn giải'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label='Loại'>
                <Select defaultValue={type} onChange={(e) => handleSelectTypeChange(e)}>
                  <Option value={SendBatchType.TICKET}>
                    {sendBatchTypeText(SendBatchType.TICKET)}
                  </Option>
                  <Option value={SendBatchType.SIM}>{sendBatchTypeText(SendBatchType.SIM)}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Row>
                <p>
                  Người tạo: <span>{capitalizeText(currentUser?.name!)}</span>
                </p>
              </Row>
            </Col>
          </Row>
        </Form>
        {type === SendBatchType.TICKET && (
          <BatchTicket
            onSaveBtnClick={handleSaveBtnClick}
            setListId={setListId}
            dataUser={dataUser}
            setLoading={setLoading}
          />
        )}
        {type === SendBatchType.SIM && (
          <BatchSim
            onSaveBtnClick={handleSaveBtnClick}
            setListId={setListId}
            dataUser={dataUser}
            setLoading={setLoading}
          />
        )}
      </Spin>
    </Modal>
  );
}

export default CreateBatchModal;
