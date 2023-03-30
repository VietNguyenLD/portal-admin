import { Modal } from 'antd';
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import styled from 'styled-components';

interface StyledContractProps {
  image: string;
}

const StyledContract = styled.div<StyledContractProps>`
  position: relative;
  text-align: center;

  .contract_name {
    display: inline-block;
    margin-bottom: 0.5rem;
    text-transform: capitalize;
    font-weight: 600;
  }

  .contract_img {
    position: relative;
    height: 10rem;
    margin-bottom: 0.5rem;
    border: 1px dashed #eee;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      background: no-repeat top center / cover url(${(props) => props.image});
      width: 100%;
      height: 100%;
    }
  }

  .contract_download {
    color: #1890ff;
    cursor: pointer;
  }
`;

const StyledPdfContainer = styled.div`
  height: 100%;
  overflow-y: auto;

  .react-pdf__Page__canvas {
    margin: 0 auto;
  }

  .react-pdf__Page__textContent {
    height: 100% !important;
    border: 1px solid #ddd;
    box-shadow: 5px 5px 5px 1px #eee;
    border-radius: 5px;
  }
`;

const StyledModal = styled(Modal)`
  top: 1.5rem;
  .ant-modal-body {
    padding: 1.5rem;
  }
`;

interface DataProps {
  pdf_source: string;
  img_url: string;
}

function Contract({ name, data }: { name: string; data?: DataProps }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const onDownloadClick = () => {
    fetch(data?.pdf_source!).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = `${name}.pdf`;
        alink.click();
      });
    });
  };

  return (
    <React.Fragment>
      <StyledModal
        title={name}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width='60%'>
        <StyledPdfContainer>
          <Document file={data?.pdf_source} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </StyledPdfContainer>
      </StyledModal>

      {data?.pdf_source ? (
        <StyledContract image={data.img_url}>
          <span className='contract_name'>{name}</span>
          <div className='contract_img' onClick={() => setIsModalOpen(true)} />
          <span className='contract_download' onClick={onDownloadClick}>
            Tải về
          </span>
        </StyledContract>
      ) : null}
    </React.Fragment>
  );
}

export default Contract;
