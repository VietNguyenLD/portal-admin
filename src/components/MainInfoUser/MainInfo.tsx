import { Col, Form, Input, Row, Select } from 'antd';
import { UserStatus } from 'constants/user.enum';

interface IProps {
  isEdit?: boolean;
  isNew?: boolean;
  statusUser?: string;
}
const MainInfoUser = ({ isEdit, isNew, statusUser }: IProps) => {

  return (
    <Row gutter={[20, 5]}>
      {/* <Col span={8}>
        <Form.Item name='id' label='Tài khoản:'>
          <Input />
        </Form.Item>
      </Col> */}
      <Col span={12}>
        <Form.Item name='first_name' label='First Name:'>
          <Input required disabled={isEdit} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name='last_name' label='Last Name:'>
          <Input required disabled={isEdit} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name='email' label='Email'>
          <Input type={'email'} required disabled={isEdit} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name='phone' label='Số điện thoại:'>
          <Input type={'number'} disabled={isEdit} />
        </Form.Item>
      </Col>
      {!isNew && statusUser && (
        <Col span={8}>
          <Form.Item name='status' label='Trạng thái:'>
            <Select style={{ width: '100%' }} disabled={isEdit}>
              {/* <Select.Option value={UserStatus.NEW}>New </Select.Option> */}
              {(statusUser === 'Disable' || statusUser === 'Locked') && (
                <Select.Option value={UserStatus.ACTIVE}>Active</Select.Option>
              )}
              {statusUser !== 'Disable' && (
                <Select.Option value={UserStatus.DISABLED}>Disable</Select.Option>
              )}
            </Select>
          </Form.Item>
        </Col>
      )}
      {/* <Col span={8}>
        <Form.Item name='name' label='Email:'>
          <Input />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name='name' label='Ghi chú:'>
          <Input />
        </Form.Item>
      </Col> */}
    </Row>
  );
};

export default MainInfoUser;
