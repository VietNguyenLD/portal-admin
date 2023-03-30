import { Modal, ModalProps } from 'antd';
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal {
    &-content {
      border-radius: 8px;
    }
    &-header {
      border-radius: 8px 8px 0 0;
      background: #d9d9d9;
    }
  }
`;

interface BaseModalProps extends ModalProps {
  children: React.ReactNode;
}

function BaseModalV2(props: BaseModalProps) {
  const { children, footer = false, width = '100%', ...theArgs } = props;

  return (
    <StyledModal {...theArgs} width={width} footer={footer}>
      {children}
    </StyledModal>
  );
}

export default BaseModalV2;
