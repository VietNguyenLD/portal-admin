import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { ErrorMessage, useField } from 'formik';
import { useState } from 'react';
import styled from 'styled-components';

const StyledPasswordField = styled.div`
  margin-bottom: 1.5rem;
  .form_input {
    position: relative;
  }

  .toggle-icon {
    cursor: pointer;
    position: absolute;
    right: 0.625rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

function PasswordField(props: any) {
  const [field] = useField(props);
  const { id, placeholder, toggleShow = true, type } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <StyledPasswordField>
      <div className='form_input'>
        <input
          id={id}
          type={type || showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          {...field}
        />
        {toggleShow ? (
          <div className='toggle-icon' onClick={handleTogglePassword}>
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </div>
        ) : null}
      </div>
      <ErrorMessage className='form_error' name={field.name} component='span' />
    </StyledPasswordField>
  );
}

export default PasswordField;
