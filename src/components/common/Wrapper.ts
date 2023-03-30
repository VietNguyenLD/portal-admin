import styled from 'styled-components';

interface WrapperProps {
  padding?: string;
  margin?: string;
  background?: string;
}
export const Wrapper = styled.div<WrapperProps>`
  margin: ${(props) => props.margin ?? '0 0 1.5rem 0'};
  padding: ${(props) => props.padding ?? '1rem'};

  background-color: ${(props) => props.background || '#fff'};
`;
