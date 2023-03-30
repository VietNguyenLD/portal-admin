import { Col } from 'antd';
import styled from 'styled-components';

interface ItemInfoProps {
  colSpan?: number;
  label: string;
  value: string | number | undefined;
}

const StyledCol = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  padding: 5px 8px;
  overflow-wrap: break-word;
  &.ant-col-24 {
    span {
      display: inline-flex;
      width: 50%;
    }
  }
`;

function ItemInfo({ colSpan = 8, label, value }: ItemInfoProps) {
  return (
    <StyledCol span={colSpan}>
      <span className='text-semi'>{label}:&nbsp;</span>
      {<span style={{ whiteSpace: 'pre-line' }}>{value ?? '-'}</span>}
    </StyledCol>
  );
}

export default ItemInfo;
