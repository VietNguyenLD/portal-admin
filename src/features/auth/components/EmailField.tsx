import { ErrorMessage, useField } from 'formik';
import styled from 'styled-components';

const StyledEmailField = styled.div`
  margin-bottom: 1.5rem;
`;

function EmailField(props: any) {
  const [field] = useField(props);
  const { id, placeholder } = props;

  return (
    <StyledEmailField>
      <div className='form_input'>
        <input type='email' id={id} placeholder={placeholder} {...field} />
      </div>
      <ErrorMessage className='form_error' name={field.name} component='span' />
    </StyledEmailField>
  );
}

export default EmailField;
