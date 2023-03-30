import styled from 'styled-components';

const StyledFieldset = styled.fieldset`
  border: 1px solid #ddd;
  padding: 0.785rem;
`;
const Legend = styled.legend`
  padding: 4px 0.625rem;
  display: block;
  width: fit-content;
  margin-left: 1rem;
  background-color: #eee;
  border-radius: 5px;
`;

export interface FieldsetProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function Fieldset(props: FieldsetProps) {
  const { title, style } = props;
  return (
    <StyledFieldset style={{ ...style }}>
      <Legend>{title}</Legend>
      {props.children}
    </StyledFieldset>
  );
}

export default Fieldset;
