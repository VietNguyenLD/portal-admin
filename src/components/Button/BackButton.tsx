import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  margin-bottom: 1rem;
`;

function BackButton() {
  const history = useHistory();

  function handleBtnClick() {
    history.goBack();
  }

  return <StyledButton onClick={handleBtnClick}>Trở về</StyledButton>;
}

export default BackButton;
