import { Col, Row } from 'antd';

interface ChangeSimItemInfoProps {
  label: string;
  value: string | undefined;
}
function ChangeSimItemInfo({ label, value }: ChangeSimItemInfoProps) {
  return (
    <Row>
      <Col span={12}>
        <p className='text--bold'>{label}</p>
      </Col>
      <Col span={12}>
        <p>{value}</p>
      </Col>
    </Row>
  );
}

export default ChangeSimItemInfo;
