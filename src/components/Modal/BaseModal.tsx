import { Modal } from 'antd';
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

type BaseModalProps = {
  children: React.ReactNode;
  title: string;
  footer?: boolean;
  width?: string;
  onCancelModal: () => void;
};

function BaseModal(props: BaseModalProps) {
  const { children, title, footer = false, width = '100%', onCancelModal } = props;

  function handleCancelModal() {
    onCancelModal();
  }

  return (
    <StyledModal
      title={title}
      width={width}
      open={true}
      footer={footer}
      onCancel={handleCancelModal}>
      {children}
    </StyledModal>
  );
}

export default BaseModal;
