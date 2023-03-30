import { Button, ButtonProps } from 'antd';

interface SubmitButtonProps extends ButtonProps {
  content: string;
  buttonRef?: React.MutableRefObject<any>;
  onSubmit?: () => void;
}

function SubmitButton(props: SubmitButtonProps) {
  const { content, onSubmit, buttonRef, ...theArgs } = props;

  function handleButtonClick() {
    if (buttonRef) {
      return buttonRef?.current?.submit();
    } else if (onSubmit) {
      return onSubmit();
    }
  }

  return (
    <Button {...theArgs} onClick={handleButtonClick}>
      {content}
    </Button>
  );
}

export default SubmitButton;
