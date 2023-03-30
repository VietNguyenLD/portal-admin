import { Button, ButtonProps } from 'antd';

interface ResetButtonProps extends ButtonProps {
  buttonRef?: React.MutableRefObject<any>;
  onReset?: () => void;
}

function ResetButton({ buttonRef, onReset, ...theArgs }: ResetButtonProps) {
  function handleButtonClick() {
    if (buttonRef) {
      buttonRef?.current?.resetFields();
      buttonRef?.current?.submit();
    } else if (onReset) {
      return onReset();
    }
  }

  return (
    <Button {...theArgs} onClick={handleButtonClick}>
      Xóa tìm kiếm
    </Button>
  );
}

export default ResetButton;
