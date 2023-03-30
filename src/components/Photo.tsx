import { Image } from 'antd';
import { Fragment } from 'react';
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
    <Fragment>
      {url ? (
        <StyledPhoto>
          <div className='photo'>
            <Image src={url} />
          </div>
          <span>{label}</span>
        </StyledPhoto>
      ) : null}
    </Fragment>
  );
}

export default Photo;
