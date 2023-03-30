import { Image } from 'antd';
import styled from 'styled-components';

interface PhotoProps {
  label: string;
  url: string | undefined;
}

const StyledPhoto = styled.div`
  text-align: center;
  .photo {
    margin-bottom: 0.5rem;
    height: 160px;
    background-color: #eee;

    img {
      height: 100%;
      object-fit: contain;
    }
  }
`;

function Photo({ label, url }: PhotoProps) {
  return (
    <StyledPhoto>
      <div className='photo'>{url && <Image src={url} />}</div>
      <span>{label}</span>
    </StyledPhoto>
  );
}

export default Photo;
