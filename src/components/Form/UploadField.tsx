import { BaseSyntheticEvent, useState } from 'react';
import styled from 'styled-components';

const StyledUploadItem = styled.div`
  text-align: center;
  > div {
    height: 9.375rem;
    width: 15.625rem;
    border: 1px dashed #ddd;
    position: relative;
    margin: 0.5rem auto;
    border-radius: 5px;
    background-color: #eee;
    > img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: pointer;
    }
  }
  .upload_select {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    padding: 0.25rem 1rem;
    border: 1px solid #1890ff;
    border-radius: 6px;
    font-weight: 500;
    color: #1890ff;
    background-color: #fff;
    cursor: pointer;
  }
`;

interface UploadFieldProps {
  label: string;
  name: string;
  value: string;
  onUploadChange: (event: BaseSyntheticEvent) => void;
  onImageClick?: (imgBase64: string) => void;
}

function UploadField(props: UploadFieldProps) {
  const { label, name, onUploadChange, onImageClick, value } = props;
  const [previewUrl, setPreviewUrl] = useState(value);

  const getBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadChange = async (event: any) => {
    const file = event.target.files[0];

    if (!file) return;
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    }
    setPreviewUrl(file.url || file.preview);
    onUploadChange(event);
  };

  const handleImgClick = (event: BaseSyntheticEvent) => {
    const imgBase64 = event.target.src;

    if (!onImageClick) return;
    onImageClick(imgBase64);
  };

  return (
    <StyledUploadItem>
      <div>
        {previewUrl ? (
          <img src={previewUrl} alt='' onClick={handleImgClick} draggable={false} />
        ) : null}
        <label htmlFor={name} className='upload_select'>
          <span>Tải lên</span>
          <input
            style={{ display: 'none' }}
            id={name}
            name={name}
            accept='image/*'
            type='file'
            onChange={handleUploadChange}
          />
        </label>
      </div>
      <p>{label}</p>
    </StyledUploadItem>
  );
}

export default UploadField;
